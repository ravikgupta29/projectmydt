"use client";

import React, { useState } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Props } from '../../../../../type/type';
import graphData from "./../../../../../constant/graphData.json"

// Type for each document
type Document = {
  name: string;
  file_type: string;
  type: string;
  link: string;
  Date: string;
  Responsiable: string
};

const ProjectDocumentPage = ({ pageNumber }: Props) => {
  const [documents, setDocuments] = useState<Document[]>(graphData.data.filter((item) => {
    return item.ref_id === pageNumber
  })[0].Project_Document.Files)

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [docInput, setDocInput] = useState<Document>({
    name: '',
    file_type: '',
    type: '',
    link: '',
    Date:'',
    Responsiable:''
  });
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const openModal = (doc?: Document, index?: number) => {
    if (doc && index !== undefined) {
      console.log(doc)
      setDocInput(doc);
      setEditIndex(index);
    } else {
      setDocInput({ name: '', type: '', file_type: '', link: '' , Responsiable:'', Date:''});
      setEditIndex(null);
    }
    setError('');
    setShowModal(true);
  };

  const handleSave = () => {
    const { name, file_type, type, link } = docInput;

    if (!name || !file_type || !type || !link) {
      setError('Please fill in all fields.');
      return;
    }

    const updatedDocs = [...documents];
    if (editIndex !== null) {
      updatedDocs[editIndex] = docInput;
    } else {
      updatedDocs.push(docInput);
    }
    setDocuments(updatedDocs);
    setShowModal(false);
    setDocInput({ name: '', file_type: '', type: '', link: '', Responsiable:'',Date:'' });
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.file_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="w-full mx-auto p-6">
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xl"
            >
              <PlusCircle size={18} /> Add Document
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded-md shadow">
              <thead className="bg-gray-100 text-left text-gray-700 text-sm">
                <tr>
                  <th className="p-3 border-b text-xl">Name</th>
                  <th className="p-3 border-b text-xl">Type</th>
                  <th className="p-3 border-b text-xl">Created Date</th>
                  <th className="p-3 border-b text-xl">Responsiable</th>
                  <th className="p-3 border-b text-xl">View</th>
                  <th className="p-3 border-b text-center text-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500 text-xl">
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc, index) => (
                    <tr key={index} className="hover:bg-gray-50 text-sm">
                      <td className="p-3 border-b flex items-center gap-2 text-xl">{doc.name}</td>
                      <td className="p-3 border-b text-xl">{doc.type}</td>
                      <td className="p-3 border-b text-xl">{doc.Date}</td>
                      <td className="p-3 border-b text-xl">{doc.Responsiable}</td>
                      <td className="p-3 border-b text-xl">
                        <a
                          href={doc.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          click
                        </a>
                      </td>
                      <td className="p-3 border-b text-center space-x-3">
                        <button
                          onClick={() => openModal(doc, index)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">
                  {editIndex !== null ? 'Edit Document' : 'Add Document'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Document Name"
                    value={docInput.name}
                    onChange={(e) => setDocInput({ ...docInput, name: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                 

                  <select
                    className="w-full border rounded px-3 py-2"
                    value={docInput.type || ''}
                    onChange={(e) =>
                      setDocInput({ ...docInput, type: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="PMP">PMP</option>
                    <option value="Skill Matrix">Skill Matrix</option>
                    <option value="SLA">SLA</option>
                    <option value="Turtle Chart">Turtle Chart</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="url"
                    placeholder="Link"
                    value={docInput.link}
                    onChange={(e) => setDocInput({ ...docInput, link: e.target.value })}
                    className="border p-2 rounded w-full col-span-1 md:col-span-2"
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDocumentPage;
