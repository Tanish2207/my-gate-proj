import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { get_owner } from "../api/all_api";

export default function FlatOwnerDashboard() {
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        get_owner(2002).then((res) => {
          console.log(res);
          setOwnerDetails(res);
        });
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const [flatDetails] = useState({
    flatNumber: "101",
    ownerName: "John Doe",
    contactNumber: "+1 234 567 890",
    familyMembers: ["Jane Doe", "Jimmy Doe"],
  });

  const [visitors] = useState([
    {
      id: 1,
      name: "Alice Smith",
      mobile: "+1 987 654 321",
      reason: "Maintenance",
      entryTime: "2024-03-10 10:00 AM",
      exitTime: "2024-03-10 11:30 AM",
    },
  ]);

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
                <p className="text-lg">{flatDetails.contactNumber}</p>
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
        <h2 className="text-2xl font-bold mb-6 text-primary">
          Recent Visitors
        </h2>
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
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="border-b border-white/5">
                  <td className="py-3">{visitor.name}</td>
                  <td className="py-3">{visitor.mobile}</td>
                  <td className="py-3">{visitor.reason}</td>
                  <td className="py-3">{visitor.entryTime}</td>
                  <td className="py-3">{visitor.exitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
