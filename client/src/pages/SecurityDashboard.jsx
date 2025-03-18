import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { add_visitor, get_inactive_flats } from "../api/all_api";

export default function SecurityDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [showAddVisitor, setShowAddVisitor] = useState(false);
  const [inactiveFlats, setInactiveFlats] = useState([]);
  const [showInactiveFlats, setShowInactiveFlats] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    vis_name: "",
    vis_flat_num: "",
    vis_mobile: "",
    vis_reason: "",
  });

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch("/api/all_visitors");
        if (response.ok) {
          const data = await response.json();
          // console.log(response)
          setVisitors(data);
        } else {
          console.error("Failed to fetch visitors");
        }
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };

    fetchVisitors();
  }, [showAddVisitor]);

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    const new_instance_visitor = {
      ...newVisitor,
      // vis_entry_time: new Date().toLocaleString(),
    };
    setVisitors([new_instance_visitor, ...visitors]);
    console.log(new_instance_visitor);
    const response = await add_visitor(new_instance_visitor);
    console.log(response);
    // setNewVisitor({ name: "", flatNumber: "", mobile: "", reason: "" });
    // setShowAddVisitor(false);
  };

  const handleDeleteVisitor = (id) => {
    setVisitors(visitors.filter((visitor) => visitor.id !== id));
  };

  const fetchInactiveFlats = async () => {
    try {
      const flats = await get_inactive_flats();
      setInactiveFlats(flats);
      setShowInactiveFlats(true);
      console.log(flats)
    } catch (error) {
      console.error("Error fetching inactive flats:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Security Dashboard</h2>
        <button
          onClick={() => setShowAddVisitor(!showAddVisitor)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Visitor</span>
        </button>
      </div>

      {showAddVisitor && (
        <div className="glass-effect rounded-xl p-6 card-hover">
          <h3 className="text-xl font-bold mb-4 text-secondary">New Visitor</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Visitor Name"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.name}
              onChange={(e) =>
                setNewVisitor({ ...newVisitor, vis_name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Flat Number"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.flatNumber}
              onChange={(e) =>
                setNewVisitor({ ...newVisitor, vis_flat_num: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.mobile}
              onChange={(e) =>
                setNewVisitor({ ...newVisitor, vis_mobile: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Reason for Visit"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.reason}
              onChange={(e) =>
                setNewVisitor({ ...newVisitor, vis_reason: e.target.value })
              }
              required
            />
            <button
              onClick={handleAddVisitor}
              className="btn-secondary md:col-span-2"
            >
              Add Visitor
            </button>
          </form>
        </div>
      )}

      <div className="glass-effect rounded-xl p-6 card-hover">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="pb-3">Name</th>
                <th className="pb-3">Flat</th>
                <th className="pb-3">Mobile</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Entry Time</th>
                <th className="pb-3">Exit Time</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="border-b border-white/5">
                  <td className="py-3">{visitor.visitorName}</td>
                  <td className="py-3">{visitor.flatNumber}</td>
                  <td className="py-3">{visitor.visitorMobile}</td>
                  <td className="py-3">{visitor.visitReason}</td>
                  <td className="py-3">{visitor.entryTime}</td>
                  <td className="py-3">{visitor.exitTime || "-"}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-primary hover:text-primary/80">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVisitor(visitor.id)}
                        className="p-1 text-red-500 hover:text-red-400"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={fetchInactiveFlats}
        className="btn-primary px-4 py-2 rounded-lg bg-blue-500 text-white"
      >
        Show Inactive Flats
      </button>

      {showInactiveFlats && (
        <div className="glass-effect rounded-xl p-6 card-hover">
          <h3 className="text-xl font-bold text-primary mb-4">Inactive Flats</h3>
          {inactiveFlats.length > 0 ? (
            <ul className="list-disc pl-6">
              {inactiveFlats.map((flat, index) => (
                <li key={index} className="text-lg">
                  Flat Number: 
                  <p className="text-red-400 font-semibold inline">  {flat.flat_id}</p>
                  ,   Owner:  <p className="text-red-400 font-semibold inline">{flat.owner_name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No inactive flats found.</p>
          )}
        </div>
      )}
      
    </div>
  );
}
