"use client";

interface UserData {
  FirstName?: string;
  LastName?: string;
  Address?: string;
  Barangay?: string;
  City?: string;
  Province?: string;
  Region?: string;
  PhoneNumber?: string;
  Email?: string;
  createdAt?: string;
}

interface User {
  uid: string;
  data: UserData;
}

interface ExportFunctionsProps {
  users: User[];
  filteredUsers?: User[];
}

export default function ExportFunctions({ users, filteredUsers }: ExportFunctionsProps) {
  const getPhoneNumber = (user: UserData) => {
    if (user.PhoneNumber) return user.PhoneNumber;
    const userAny = user as any;
    const phoneKey = Object.keys(userAny || {}).find(
      (key) =>
        (key.toLowerCase().includes("phone") ||
          key.toLowerCase().includes("mobile") ||
          key.toLowerCase().includes("tel")) &&
        userAny[key] &&
        typeof userAny[key] === "string" &&
        userAny[key].trim() !== ""
    );
    return phoneKey ? userAny[phoneKey] : "N/A";
  };

  const getFullName = (user: UserData) => {
    const firstName = user.FirstName || "";
    const lastName = user.LastName || "";
    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  const getFullAddress = (user: UserData) => {
    const parts = [
      user.Address,
      user.Barangay,
      user.City,
      user.Province,
      user.Region,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  const exportToCSV = () => {
    const dataToExport = filteredUsers || users;
    const headers = [
      "Name",
      "Email",
      "Phone Number",
      "Address",
      "Barangay",
      "City",
      "Province",
      "Region",
      "Account Created",
    ];

    const rows = dataToExport.map((user) => [
      getFullName(user.data),
      user.data.Email || "N/A",
      getPhoneNumber(user.data),
      user.data.Address || "N/A",
      user.data.Barangay || "N/A",
      user.data.City || "N/A",
      user.data.Province || "N/A",
      user.data.Region || "N/A",
      formatDate(user.data.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tulong-users-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // For Excel, we'll create a CSV with Excel-compatible format
    const dataToExport = filteredUsers || users;
    const headers = [
      "Name",
      "Email",
      "Phone Number",
      "Address",
      "Barangay",
      "City",
      "Province",
      "Region",
      "Account Created",
    ];

    // Excel-compatible CSV with BOM for UTF-8
    const BOM = "\uFEFF";
    const rows = dataToExport.map((user) => [
      getFullName(user.data),
      user.data.Email || "N/A",
      getPhoneNumber(user.data),
      user.data.Address || "N/A",
      user.data.Barangay || "N/A",
      user.data.City || "N/A",
      user.data.Province || "N/A",
      user.data.Region || "N/A",
      formatDate(user.data.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tulong-users-${new Date().toISOString().split("T")[0]}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printView = () => {
    const dataToExport = filteredUsers || users;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>T.U.L.O.N.G Users Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #D32F2F; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              body { margin: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>T.U.L.O.N.G Users Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Users: ${dataToExport.length}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Province</th>
                <th>Region</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${dataToExport
                .map(
                  (user) => `
                <tr>
                  <td>${getFullName(user.data)}</td>
                  <td>${user.data.Email || "N/A"}</td>
                  <td>${getPhoneNumber(user.data)}</td>
                  <td>${user.data.City || "N/A"}</td>
                  <td>${user.data.Province || "N/A"}</td>
                  <td>${user.data.Region || "N/A"}</td>
                  <td>${formatDate(user.data.createdAt)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #D32F2F; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Print
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={exportToCSV}
        className="px-4 py-2.5 bg-[#27AE60] text-white font-medium rounded-xl hover:bg-[#229954] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>
      <button
        onClick={exportToExcel}
        className="px-4 py-2.5 bg-[#3498DB] text-white font-medium rounded-xl hover:bg-[#2980B9] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Excel
      </button>
      <button
        onClick={printView}
        className="px-4 py-2.5 bg-[#E67E22] text-white font-medium rounded-xl hover:bg-[#D35400] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print View
      </button>
    </div>
  );
}

