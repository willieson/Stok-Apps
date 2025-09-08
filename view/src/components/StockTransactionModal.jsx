import React, { useState, useEffect } from "react";

const StockTransactionModal = ({
  isOpen,
  onClose,
  onTransaction,
  product,
  transactionType,
}) => {
  const [quantity, setQuantity] = useState("");

  // Reset kuantitas saat modal dibuka untuk produk atau jenis transaksi baru
  useEffect(() => {
    setQuantity("");
  }, [product, transactionType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity <= 0) {
      return;
    }
    onTransaction({ quantity: parseInt(quantity, 10) });
    setQuantity("");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">
          {transactionType === "in" ? "Barang Masuk" : "Barang Keluar"}
        </h2>
        <p className="text-gray-600 mb-4">Produk: {product.name}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="quantity"
            >
              Jumlah
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Simpan
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockTransactionModal;
