import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda tidak terautentikasi. Silakan login kembali.");
      navigate("/");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data);
    } catch (error) {
      toast.error("Gagal memuat log aktivitas.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Log Aktivitas</h1>
        <Link
          to="/dashboard"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Daftar Log</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengguna
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktivitas
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.ID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(log.CreatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {log.User.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{log.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;
