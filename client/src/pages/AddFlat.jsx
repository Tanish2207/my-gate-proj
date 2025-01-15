import { useState } from 'react';
import { UserCircleIcon, PhoneIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function AddFlat() {
  const [flatDetails, setFlatDetails] = useState({
    flatNumber: '',
    ownerName: '',
    contactNumber: '',
    familyMembers: [''],
  });

  const handleAddFamilyMember = () => {
    setFlatDetails({
      ...flatDetails,
      familyMembers: [...flatDetails.familyMembers, ''],
    });
  };

  const handleFamilyMemberChange = (index, value) => {
    const newFamilyMembers = [...flatDetails.familyMembers];
    newFamilyMembers[index] = value;
    setFlatDetails({
      ...flatDetails,
      familyMembers: newFamilyMembers,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(flatDetails);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-xl p-6 card-hover">
        <h2 className="text-2xl font-bold mb-6 text-primary">Add New Flat</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-6 w-6 text-secondary" />
              <div className="flex-1">
                <label className="block text-sm text-text/60 mb-1">Flat Number</label>
                <input
                  type="text"
                  className="w-full bg-background p-2 rounded-lg"
                  value={flatDetails.flatNumber}
                  onChange={(e) => setFlatDetails({ ...flatDetails, flatNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-6 w-6 text-secondary" />
              <div className="flex-1">
                <label className="block text-sm text-text/60 mb-1">Owner Name</label>
                <input
                  type="text"
                  className="w-full bg-background p-2 rounded-lg"
                  value={flatDetails.ownerName}
                  onChange={(e) => setFlatDetails({ ...flatDetails, ownerName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-6 w-6 text-secondary" />
              <div className="flex-1">
                <label className="block text-sm text-text/60 mb-1">Contact Number</label>
                <input
                  type="tel"
                  className="w-full bg-background p-2 rounded-lg"
                  value={flatDetails.contactNumber}
                  onChange={(e) => setFlatDetails({ ...flatDetails, contactNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-6 w-6 text-secondary" />
                  <span className="text-sm text-text/60">Family Members</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddFamilyMember}
                  className="text-primary hover:text-primary/80"
                >
                  + Add Member
                </button>
              </div>
              {flatDetails.familyMembers.map((member, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-full bg-background p-2 rounded-lg"
                  value={member}
                  onChange={(e) => handleFamilyMemberChange(index, e.target.value)}
                  placeholder={`Family Member ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Add Flat
          </button>
        </form>
      </div>
    </div>
  );
}