import React, { useState } from 'react';
import Sidebar from './Sidebar';

const ClassRoomPage = () => {
  const [formData, setFormData] = useState({
    roomNo: '',
    capacity: '',
  });

  const [classRooms, setClassRooms] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClassRoom = async () => {
    if (formData.roomNo && formData.capacity) {
      try {
        const response = await fetch('https://school-backend-1-2xki.onrender.com/api/admin/add-classroom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomNumber: formData.roomNo,
            capacity: formData.capacity,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setClassRooms([...classRooms, { id: result.data._id, ...formData }]);
          setFormData({ roomNo: '', capacity: '' });
          setError('');
          setSuccessMessage('Classroom added successfully!');
        } else {
          setError(result.message || 'Failed to add classroom.');
          setSuccessMessage('');
        }
      } catch (error) {
        setError('An error occurred while adding the classroom.');
        setSuccessMessage('');
      }
    } else {
      setError('Please fill in all fields.');
      setSuccessMessage('');
    }
  };

  const handleRemoveClassRoom = (id) => {
    setClassRooms(classRooms.filter((room) => room.id !== id));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar /> {/* Sidebar added here */}

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        <div className="flex gap-6">
          <div className="w-1/3 bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg text-gray-500 mb-4">Add Class Room</h2>
            <form className="space-y-4">
              {/* Room No Input */}
              <div>
                <label htmlFor="roomNo" className="text-sm text-gray-600">
                  Room No *
                </label>
                <input
                  type="text"
                  id="roomNo"
                  name="roomNo"
                  value={formData.roomNo}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Capacity Input */}
              <div>
                <label htmlFor="capacity" className="text-sm text-gray-600">
                  Capacity *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Save Class Room Button */}
              <div>
                <button
                  type="button"
                  onClick={handleSaveClassRoom}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Save Class Room
                </button>
              </div>

              {/* Error or Success Message */}
              {error && <div className="text-red-600 mt-2">{error}</div>}
              {successMessage && <div className="text-green-600 mt-2">{successMessage}</div>}
            </form>
          </div>

          {/* Right Side - Class Room List */}
          <div className="w-2/3 bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg text-gray-500 mb-4">Class Room List</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-gray-600">Room No</th>
                  <th className="px-4 py-2 text-gray-600">Capacity</th>
                  <th className="px-4 py-2 text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {classRooms.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500">
                      No Data Available In Table
                    </td>
                  </tr>
                ) : (
                  classRooms.map((room) => (
                    <tr key={room.id} className="border-t border-gray-300">
                      <td className="px-4 py-2 text-gray-600">{room.roomNo}</td>
                      <td className="px-4 py-2 text-gray-600">{room.capacity}</td>
                      <td className="px-4 py-2 text-gray-600">
                        <button
                          onClick={() => handleRemoveClassRoom(room.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassRoomPage;
