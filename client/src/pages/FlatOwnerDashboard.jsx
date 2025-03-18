import { useCallback, useEffect, useState } from "react";
import {
  UserCircleIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import { get_flat_wise_visitor, get_owner, search_name } from "../api/all_api";
import debounce from "lodash/debounce";
import moment from "moment";

export default function FlatOwnerDashboard() {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [originalVisitors, setOriginalVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [global_flat_num, setglobalFlatNum] = useState(105);
  const [filter, setFilter] = useState("All");
  const [visitorCount, setVisitorCount] = useState(0);

  const fetchSearchResults = async (searchQuery, flatNumber) => {
    if (!searchQuery) {
      setVisitors(originalVisitors);
      return;
    }

    try {
      const data = await search_name(searchQuery, flatNumber);
      console.log(data);
      setVisitors(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
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
        // const count = await get_visitors_count(global_flat_num);
        // setVisitorCount(count.count);
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
        setVisitorCount(res.length);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    fetchVisitors();
  }, []);

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
    if (filterType === "All") {
      setVisitors(originalVisitors);
    } else if (filterType === "Guest Visit") {
      // Get first 3 rows
      const guestVisitors = originalVisitors.slice(0, 3);
      setVisitors(guestVisitors);
    } else if (filterType === "Delivery Visit") {
      // Get remaining rows after index 2
      const deliveryVisitors = originalVisitors.slice(3);
      setVisitors(deliveryVisitors);
    }
  };

  const [flatDetails] = useState({
    flatNumber: "101",
    ownerName: "John Doe",
    contactNumber: "+1 234 567 890",
    familyMembers: ["Vedant Bhamare", "Sapana Bhamare", "Narendra Bhamare"],
  });

  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-xl p-6 card-hover">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold mb-6 text-primary">Flat Details</h2>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl pr-7 font-bold text-red-400">
              <div className="bg-gray-700 rounded-md px-2 py-1">
                {global_flat_num}
              </div>
            </h2>
            <div>
              <div className="rounded-sm bg-green-200 border border-slate-500 text-slate-800 font-bold px-1">
                <h2>Maintenance</h2>
                <h2 className="text-2xl">₹ {ownerDetails?.at(0)?.maintenance_amt}</h2>
              </div>
            </div>
          </div>
        </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary">Total Visitors</h3>
            <p className="text-4xl font-bold mt-2">
              {loading ? "..." : visitorCount}
            </p>
          </div>
          <UsersIcon className="h-12 w-12 text-secondary opacity-50" />
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              className={`px-4 py-2 mr-2 text-black ${
                filter === "All" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("All")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 mr-2 text-black ${
                filter === "Guest Visit"
                  ? "bg-blue-500 text-black"
                  : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("Guest Visit")}
            >
              Guest Visit
            </button>
            <button
              className={`px-4 py-2 text-black ${
                filter === "Delivery Visit"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleFilterChange("Delivery Visit")}
            >
              Delivery Visit
            </button>
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
                      <td className="py-3">
                        {moment(visitor.vis_entry).format(
                          "DD MMM YYYY, hh:mm A"
                        )}
                      </td>
                      <td className="py-3">
                        {visitor.vis_exit
                          ? moment(visitor.vis_exit).format(
                              "DD MMM YYYY, hh:mm A"
                            )
                          : "--"}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
