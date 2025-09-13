import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import graphData from "./../../../../../constant/graphData.json"

type Remark = {
  id: number;
  author: string;
  content: string;
  date: string;
};

type Props = {
  pageNumber: string;
};


export default function RemarkPage({pageNumber}: Props) {
  //@ts-ignore
  const [remarks, setRemarks] = useState<Remark[]>(graphData.data.filter((item) => {
    return item.ref_id === pageNumber
})[0]?.Remark);
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const openModal = (remark?: Remark) => {
    if (remark) {
      setAuthor(remark.author);
      setContent(remark.content);
      setEditId(remark.id);
    } else {
      setAuthor('');
      setContent('');
      setEditId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setAuthor('');
    setContent('');
    setEditId(null);
  };

  const saveRemark = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString('default', {
      month: 'long',
      day: '2-digit',
    });

    if (editId !== null) {
      setRemarks(prev =>
        prev.map(r =>
          r.id === editId ? { ...r, author, content, date: formattedDate } : r
        )
      );
    } else {
      setRemarks(prev => [
        ...prev,
        {
          id: Date.now(),
          author,
          content,
          date: formattedDate,
        },
      ]);
    }
    closeModal();
  };

  const deleteRemark = (id: number) => {
    setRemarks(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
      <div className="max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Remarks</h2>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200 text-xl"
          >
            Add Remark
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          {remarks.length === 0 ? (
            <div className="text-gray-500 text-center p-6 text-xl">No remarks added yet.</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="border px-4 py-3 text-left text-xl">Author</th>
                  <th className="border px-4 py-3 text-left text-xl">Remark</th>
                  <th className="border px-4 py-3 text-left text-xl">Date</th>
                  <th className="border px-4 py-3 text-center text-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {remarks.map((remark) => (
                  <tr
                    key={remark.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="border px-4 py-4 text-xl">{remark.author}</td>
                    <td className="border px-4 py-4 text-xl ">{remark.content}</td>
                    <td className="border px-4 py-4 text-xl">{remark.date}</td>
                    <td className="border px-4 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Pencil
                          className="w-5 h-5 text-blue-600 cursor-pointer hover:scale-110 transition"
                          onClick={() => openModal(remark)}
                        />
                        <Trash2
                          className="w-5 h-5 text-red-600 cursor-pointer hover:scale-110 transition"
                          onClick={() => deleteRemark(remark.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? 'Edit Remark' : 'Add Remark'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Remark"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRemark}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
