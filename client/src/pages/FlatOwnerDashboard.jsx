import { useCallback, useEffect, useState } from "react";
import {
  UserCircleIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import { get_flat_wise_visitor, get_owner, search_name } from "../api/all_api";
import debounce from "lodash/debounce";

export default function FlatOwnerDashboard() {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [originalVisitors, setOriginalVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [global_flat_num, setglobalFlatNum] = useState(101)

  const fetchSearchResults = async (searchQuery, flatNumber) => {
    if (!searchQuery) {
      // setResults([]);
      setVisitors(originalVisitors);
      return;
    }

    try {
      const data = await search_name(searchQuery, flatNumber)
      console.log(data);
      setVisitors(data);
    } catch (error) {
      console.error("Error fetching search results:");
    }
  };

  const debouncedFetch = useCallback(
    debounce((value) => fetchSearchResults(value, global_flat_num), 300)
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        get_owner(global_flat_num).then((res) => {
          setOwnerDetails(res);
        });
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    async function fetchVisitors() {
      setLoading(true);
      try {
        const res = await get_flat_wise_visitor(global_flat_num);
        setOriginalVisitors(res);
        setVisitors(res);
      } catch (error) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    fetchVisitors();
  }, []);

  // useEffect(() => {
  //   console.log(results)
  // }, [results])

  const [flatDetails] = useState({
    flatNumber: "101",
    ownerName: "John Doe",
    contactNumber: "+1 234 567 890",
    familyMembers: ["Jane Doe", "Jimmy Doe"],
  });

  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-xl p-6 card-hover">
        <h2 className="text-2xl font-bold mb-6 text-primary">Flat Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-6 w-6 text-secondary" />
              <div>
                <p className="text-sm text-text/60">Owner Name</p>
                <p className="text-lg">
                  {loading ? "loading ... " : ownerDetails?.at(0)?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-6 w-6 text-secondary" />
              <div>
                <p className="text-sm text-text/60">Contact Number</p>
                <p className="text-lg">{ownerDetails?.at(0)?.mobile}</p>
              </div>
              <div>
                <p className="text-sm text-text/60">Flat no.</p>
                <p className="text-lg">{ownerDetails?.at(0)?.flat_number}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <UsersIcon className="h-6 w-6 text-secondary" />
              <p className="text-sm text-text/60">Family Members</p>
            </div>
            <ul className="space-y-2">
              {flatDetails.familyMembers.map((member, index) => (
                <li key={index} className="text-lg">
                  {member}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 card-hover">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-6 text-primary">
            Recent Visitors
          </h2>
          <div className="">
            <input
              type="text"
              className="bg-gray-400 rounded-sm text-gray-900 px-2 outline-none placeholder:text-gray-700"
              placeholder="Search name"
              onChange={(e) => debouncedFetch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="pb-3">Name</th>
                <th className="pb-3">Mobile</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Entry Time</th>
                <th className="pb-3">Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? "Loading..."
                : visitors.map((visitor) => (
                    <tr
                      key={visitor.vis_id}
                      className="border-b border-white/5"
                    >
                      <td className="py-3">{visitor.vis_name}</td>
                      <td className="py-3">{visitor.vis_mobile}</td>
                      <td className="py-3">{visitor.vis_reason}</td>
                      <td className="py-3">{visitor.vis_entry}</td>
                      <td className="py-3">{visitor.vis_exit}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
