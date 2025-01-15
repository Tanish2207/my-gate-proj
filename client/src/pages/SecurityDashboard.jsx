import { useState , useEffect} from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';


export default function SecurityDashboard() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch('/api/all_visitors');
        if (response.ok) {
          const data = await response.json();
          console.log(response)
          setVisitors(data);
        } else {
          console.error('Failed to fetch visitors');
        }
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    };

    fetchVisitors();
  }, []);


  

  const [showAddVisitor, setShowAddVisitor] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    flatNumber: '',
    mobile: '',
    reason: '',
  });

  const handleAddVisitor = (e) => {
    e.preventDefault();
    const visitor = {
      id: Date.now(),
      ...newVisitor,
      entryTime: new Date().toLocaleString(),
    };
    setVisitors([visitor, ...visitors]);
    setNewVisitor({ name: '', flatNumber: '', mobile: '', reason: '' });
    setShowAddVisitor(false);
  };

  const handleDeleteVisitor = (id) => {
    setVisitors(visitors.filter(visitor => visitor.id !== id));
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
          <form onSubmit={handleAddVisitor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Visitor Name"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.name}
              onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Flat Number"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.flatNumber}
              onChange={(e) => setNewVisitor({ ...newVisitor, flatNumber: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.mobile}
              onChange={(e) => setNewVisitor({ ...newVisitor, mobile: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Reason for Visit"
              className="bg-background p-2 rounded-lg"
              value={newVisitor.reason}
              onChange={(e) => setNewVisitor({ ...newVisitor, reason: e.target.value })}
              required
            />
            <button type="submit" className="btn-secondary md:col-span-2">
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
                  <td className="py-3">{visitor.exitTime || '-'}</td>
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
    </div>
  );
}