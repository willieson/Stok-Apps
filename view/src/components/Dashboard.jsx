import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AddProductModal from "./AddProductModal";
import StockTransactionModal from "./StockTransactionModal";
import useIsMobile from "../hooks/useIsMobile"; // Import hook baru

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null); // State untuk akordeon
  const isMobile = useIsMobile(); // Panggil hook untuk mendeteksi layar mobile

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Anda tidak terautentikasi. Silakan login kembali.");
      navigate("/");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      toast.error("Gagal memuat data produk.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Anda telah keluar.");
    navigate("/");
  };

  const handleAddProduct = async (productData) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:3000/api/products", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Produk berhasil ditambahkan!");
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Gagal menambahkan produk.");
    }
  };

  const handleStockTransaction = async (data) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:3000/api/stock/${transactionType}`,
        {
          product_id: selectedProduct.ID,
          quantity: data.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Transaksi stok berhasil!");
      setIsTransactionModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal melakukan transaksi.");
    }
  };

  const openTransactionModal = (product, type) => {
    setSelectedProduct(product);
    setTransactionType(type);
    setIsTransactionModalOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
          Manajemen Stok
        </h1>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:space-x-4">
          <Link
            to="/history"
            className="px-3 py-2 text-sm text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
          >
            Riwayat Stok
          </Link>
          <Link
            to="/logs"
            className="px-3 py-2 text-sm text-white bg-yellow-600 rounded-lg shadow-md hover:bg-yellow-700"
          >
            Log Aktivitas
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 text-sm text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
          >
            Tambah Produk
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700"
          >
            Keluar
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari produk berdasarkan nama..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Daftar Produk
        </h2>
        {/* Render kondisional */}
        {isMobile ? (
          // Tampilan Akordeon (Mobile)
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.ID}
                className="bg-gray-50 rounded-lg overflow-hidden shadow"
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === product.ID ? null : product.ID
                    )
                  }
                >
                  <span className="font-bold text-lg">{product.name}</span>
                  <span className="text-gray-500">
                    {openAccordion === product.ID ? "▲" : "▼"}
                  </span>
                </div>
                {openAccordion === product.ID && (
                  <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                    <p>
                      <strong>SKU:</strong> {product.sku}
                    </p>
                    <p>
                      <strong>Stok Saat Ini:</strong> {product.current_stock}
                    </p>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => openTransactionModal(product, "in")}
                        className="flex-1 px-2 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Stok Masuk
                      </button>
                      <button
                        onClick={() => openTransactionModal(product, "out")}
                        className="flex-1 px-2 py-1 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        Stok Keluar
                      </button>
                    </div>
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
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Saat Ini
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.ID}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.current_stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openTransactionModal(product, "in")}
                        className="px-2 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Masuk
                      </button>
                      <button
                        onClick={() => openTransactionModal(product, "out")}
                        className="px-2 py-1 text-xs text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        Keluar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
      <StockTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onTransaction={handleStockTransaction}
        product={selectedProduct}
        transactionType={transactionType}
      />
    </div>
  );
};

export default Dashboard;
