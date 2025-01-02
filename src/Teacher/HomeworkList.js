import React, { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar"; // Import TeacherSidebar component

const TeacherHomework = () => {
  const [homeworkAssignments, setHomeworkAssignments] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [homeworkPerPage] = useState(10); // Number of homeworks per page
  const [statusData, setStatusData] = useState({});

  // Fetch homework data from API
  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/teacher/homeworks");
        const data = await response.json();
        if (data.message === "Homeworks retrieved successfully!") {
          setHomeworkAssignments(data.homeworks);
        } else {
          console.error("Failed to retrieve homework data");
        }
      } catch (error) {
        console.error("Error fetching homework data:", error);
      }
    };

    fetchHomeworks();
  }, []);

  // Handle class selection
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection(""); // Reset section on class change
  };

  // Handle section selection
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  // Filter homework based on selected class and section
  const filteredHomework = homeworkAssignments.filter((homework) => {
    return (
      (selectedClass ? homework.class === selectedClass : true) &&
      (selectedSection ? homework.section === selectedSection : true)
    );
  });

  // Pagination logic
  const indexOfLastHomework = currentPage * homeworkPerPage;
  const indexOfFirstHomework = indexOfLastHomework - homeworkPerPage;
  const currentHomework = filteredHomework.slice(indexOfFirstHomework, indexOfLastHomework);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle status change and update the status via API
  const handleStatusChange = async (homeworkId, newStatus) => {
    try {
      // Send a PUT request to the backend to update the status
      const response = await fetch(`http://localhost:4000/api/teacher/update-status/${homeworkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.message === "Status updated successfully!") {
        // Update the status in the local state after successful API response
        setStatusData((prevStatus) => ({
          ...prevStatus,
          [homeworkId]: newStatus,
        }));
        console.log("Homework status updated!");
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen ml-64">
        <h1 className="text-xl text-purple-700 mb-6">Assigned Homework</h1>

        {/* Filters (Class, Section displayed together) */}
        <div className="flex space-x-6 mb-6 bg-white shadow-lg p-4 rounded-lg">
          <div className="flex-1">
            <label className="mr-4 text-lg">Select Class:</label>
            <select
              className="p-2 rounded-lg border border-gray-300 w-full"
              value={selectedClass}
              onChange={handleClassChange}
            >
              <option value="">Select Class</option>
              {[...new Set(homeworkAssignments.map((hw) => hw.class))].map((classOption) => (
                <option key={classOption} value={classOption}>
                  {classOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="mr-4 text-lg">Select Section:</label>
            <select
              className="p-2 rounded-lg border border-gray-300 w-full"
              value={selectedSection}
              onChange={handleSectionChange}
              disabled={!selectedClass} // Disable section dropdown if class is not selected
            >
              <option value="">Select Section</option>
              {[...new Set(homeworkAssignments.filter((hw) => hw.class === selectedClass).map((hw) => hw.section))].map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Homework List */}
        {currentHomework.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="min-w-full table-auto text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Homework Title</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2">Homework Date</th>
                  <th className="px-4 py-2">Submission Date</th>
                  <th className="px-4 py-2">Marks</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentHomework.map((homework) => (
                  <tr key={homework._id}>
                    <td className="px-4 py-2">{homework.homeworkTitle}</td>
                    <td className="px-4 py-2">{homework.description}</td>
                    <td className="px-4 py-2">{new Date(homework.homeworkDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(homework.submissionDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{homework.marks}</td>
                    <td className="px-4 py-2">
                      <select
                        value={statusData[homework._id] || homework.status}
                        onChange={(e) => handleStatusChange(homework._id, e.target.value)}
                        className="p-2 rounded-lg border border-gray-300"
                      >
                        <option value="Not Submitted">Not Submitted</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Graded">Graded</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">{new Date(homework.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No homework found for the selected class and section.</p>
        )}

        {/* Pagination */}
        {filteredHomework.length > homeworkPerPage && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg mr-2"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredHomework.length / homeworkPerPage)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherHomework;
