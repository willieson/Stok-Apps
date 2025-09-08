import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import useIsMobile from "../hooks/useIsMobile"; // Import hook baru

const StockHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skuQuery, setSkuQuery] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null); // State untuk akordeon
  const isMobile = useIsMobile(); // Panggil hook

  const navigate = useNavigate();

  useEffect(() => {
    fetchStockHistory();
  }, []);

  const fetchStockHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda tidak terautentikasi. Silakan login kembali.");
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/api/stock/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Gagal memuat riwayat stok:", error);
      toast.error("Gagal memuat riwayat stok.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    const itemDate = new Date(item.CreatedAt);
    if (startDate && itemDate < new Date(startDate)) return false;
    if (endDate && itemDate > new Date(endDate)) return false;
    if (
      skuQuery &&
      item.Product?.sku?.toLowerCase().includes(skuQuery.toLowerCase()) ===
        false
    )
      return false;
    if (transactionType && item.transaction_type !== transactionType)
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
          Riwayat Transaksi Stok
        </h1>
        <Link
          to="/dashboard"
          className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            SKU Produk
          </label>
          <input
            type="text"
            placeholder="Cari SKU..."
            value={skuQuery}
            onChange={(e) => setSkuQuery(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Jenis Transaksi
          </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Semua</option>
            <option value="in">Masuk</option>
            <option value="out">Keluar</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Daftar Riwayat
        </h2>
        {/* Render kondisional */}
        {isMobile ? (
          // Tampilan Akordeon (Mobile)
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div
                key={item.ID}
                className="bg-gray-50 rounded-lg overflow-hidden shadow"
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() =>
                    setOpenAccordion(openAccordion === item.ID ? null : item.ID)
                  }
                >
                  <span className="font-bold text-xs">
                    {item.Product?.name || "N/A"}
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.transaction_type === "in"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.transaction_type === "in" ? "Masuk" : "Keluar"}
                    </span>
                    : {item.quantity}
                  </span>
                  <span className="text-gray-500">
                    {openAccordion === item.ID ? "▲" : "▼"}
                  </span>
                </div>
                {openAccordion === item.ID && (
                  <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                    <p>
                      <strong>Tanggal:</strong>{" "}
                      {new Date(item.CreatedAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Jenis Transaksi:</strong>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.transaction_type === "in"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.transaction_type === "in" ? "Masuk" : "Keluar"}
                      </span>
                    </p>
                    <p>
                      <strong>Jumlah:</strong> {item.quantity}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Tampilan Tabel (Desktop)
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Transaksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => (
                    <tr key={item.ID}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(item.CreatedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.Product?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.transaction_type === "in"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.transaction_type === "in" ? "Masuk" : "Keluar"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.quantity}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockHistory;
