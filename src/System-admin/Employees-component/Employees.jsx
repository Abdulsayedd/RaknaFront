// import React, { useEffect } from "react";
// import Employeestyle from '../Styles/Employees.module.css'

// import ExpandIcon from "../assets/light-mode/Details-icon.svg";

// function EmployeesTable({
//   employees,
//   expandedRow,
//   toggleDropdown,
//   handleEditClick,
//   handleDeleteClick,
//   handleViewClick,
// }) {

//   return (

//     <table className={Employeestyle.SystemAdminEmployeeTable}>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>email</th>
//           <th>salary</th>
//           <th>nationalId</th>
//           <th>Settings</th>
//         </tr>
//       </thead>
//       <tbody>
//         {employees.map((employee, index) => (
//           <tr key={index}>
//             <td>{employee.name}</td>
//             <td>{employee.email}</td>
//             <td>{employee.salary}</td>
//             <td>{employee.nationalId}</td>
//             <td>
//               <div
//                 className={Employeestyle.employeeDetails}
//                 onClick={() => toggleDropdown(index)}
//               >
//                 <img
//                   src={ExpandIcon}
//                   alt="Details"
//                   className={Employeestyle.expandIcon}
//                 />
//                 {index === expandedRow && (
//                   <div className={Employeestyle.dropdownMenu}>
//                     <button
//                       className={Employeestyle.dropdownButton}
//                       onClick={() => handleViewClick(index)}
//                     >
//                       View
//                     </button>
//                     <hr />
//                     <button
//                       className={Employeestyle.dropdownButton}
//                       onClick={() => handleEditClick(index)}
//                     >
//                       Edit
//                     </button>
//                     <hr />
//                     <button
//                       className={Employeestyle.dropdownButton}
//                       onClick={() => handleDeleteClick(index)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default EmployeesTable;

//===================================================================================

// import React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import Employeestyle from "../Styles/Employees.module.css";

// function EmployeesTable({
//   employees,
//   expandedRow,
//   toggleDropdown,
//   handleEditClick,
//   handleDeleteClick,
//   handleViewClick,
// }) {
//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "email", headerName: "Email", flex: 1 },
//     { field: "salary", headerName: "Salary", flex: 1 },
//     { field: "nationalId", headerName: "National ID", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Settings",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <button
//             className={Employeestyle.dropdownButton}
//             onClick={() => {handleViewClick(params.id)}}
//           >
//             View
//           </button>
//           <button
//             className={Employeestyle.dropdownButton}
//             onClick={() => handleEditClick(params.id)}
//           >
//             Edit
//           </button>
//           <button
//             className={Employeestyle.dropdownButton}
//             onClick={() => handleDeleteClick(params.id)}
//           >
//             Delete
//           </button>
//         </>
//       ),
//     },
//   ];

//   const rows = employees.map((employee, index) => ({
//     id: index,
//     name: employee.name,
//     email: employee.email,
//     salary: employee.salary,
//     nationalId: employee.nationalId,
//   }));

//   return (
//     <div style={{ height: '700px', width: "100%" }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSize={5}
//         rowsPerPageOptions={[5, 10, 20]}
//         checkboxSelection
//       />
//     </div>
//   );
// }

// export default EmployeesTable;

//=================================================================================
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Employeestyle from "../Styles/Employees.module.css";
import axios from "axios";
import Swal from "sweetalert2";

function EmployeesTable({
  employees,
  expandedRow,
  toggleDropdown,
  handleEditClick,
  handleDeleteClick,
  handleViewClick,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState(""); // New state for the title

  const accessToken = sessionStorage.getItem("accessToken");

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "salary", headerName: "Salary", flex: 1 },
    { field: "nationalId", headerName: "National ID", flex: 1 },
    {
      field: "actions",
      headerName: "Settings",
      flex: 1,
      renderCell: (params) => (
        <>
          <button
            className={Employeestyle.dropdownButton}
            onClick={() => handleViewClick(params.id)}
          >
            View
          </button>
          <button
            className={Employeestyle.dropdownButton}
            onClick={() => handleEditClick(params.id)}
          >
            Edit
          </button>
          <button
            className={Employeestyle.dropdownButton}
            onClick={() => handleDeleteClick(params.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const rows = employees.map((employee, index) => ({
    id: index,
    name: employee.Name,
    email: employee.Email,
    salary: employee.salary,
    nationalId: employee.NationalId,
  }));

  const handleRowSelectionModelChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
  };

  const sendEmails = () => {
    console.log(
      "Sending emails to:",
      selectedRows.map((rowId) => rows.find((row) => row.id === rowId).email)
    );
    console.log("Message:", message);
    console.log("Title:", title); // Log the title as well

    const response = axios
      .post(
        `https://raknaapi.azurewebsites.net/api/GarageAdmin/SendBulkEmails`,
        {
          emails: selectedRows.map(
            (rowId) => rows.find((row) => row.id === rowId).email
          ),
          message: message,
          title: title, // Pass the title
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", `Failed to send emails, ${error}`, "error");
      });
    console.log(response);
    Swal.fire("Success", "Emails sent successfully", "success");
  };

  return (
    <div style={{ height: "700px", width: "100%" }}>
      <h1 style={{ marginBottom: "20px" }}>Employees</h1>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelectionModelChange}
      />
      {selectedRows.length > 0 && (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title here..."
            style={{
              width: "50%",
              marginBottom: "10px",
              marginRight: "10px",
              marginTop: "10px",
            }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            style={{ width: "50%", marginBottom: "-11px" }}
          />
          <button onClick={sendEmails} style={{ marginLeft: "10px" }}>
            Send Emails
          </button>
        </>
      )}
    </div>
  );
}

export default EmployeesTable;
