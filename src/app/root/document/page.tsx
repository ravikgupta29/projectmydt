"use client";
import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  type: "Design Doc" | "Report" | "PDF" | "Presentation" | "Other";
  projectName: string;
  uploadedBy: string;
  uploadedAt: string;
  links: string[];
  files: File[];
}

const DocumentPage = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "1",
      name: "UX Research Report",
      type: "Report",
      projectName: "Onboarding Revamp",
      uploadedBy: "Alice",
      uploadedAt: "2025-03-10",
      links: [
        "https://sharepoint.com/sites/project/docs/UXResearchReport.pdf",
        "https://sharepoint.com/sites/project/docs/UXSummary.pdf"
      ],
      files: [],
    },
    {
      id: "2",
      name: "API Integration Plan",
      type: "Design Doc",
      projectName: "Platform Upgrade",
      uploadedBy: "Bob",
      uploadedAt: "2025-03-12",
      links: ["https://sharepoint.com/sites/project/docs/APIIntegration.pdf"],
      files: [],
    }
  ]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  const handleAddNew = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
  };

  const handleEdit = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const links = (formData.get("links") as string)
      .split("\n")
      .map((link) => link.trim())
      .filter(Boolean);
    const files = (formData.getAll("files") as File[]).filter(Boolean);

    const newDoc: DocumentItem = {
      id: editingDoc?.id || Date.now().toString(),
      name: formData.get("name") as string,
      type: formData.get("type") as any,
      projectName: formData.get("projectName") as string,
      uploadedBy: formData.get("uploadedBy") as string,
      uploadedAt: formData.get("uploadedAt") as string,
      links,
      files,
    };

    if (editingDoc) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === editingDoc.id ? newDoc : d))
      );
    } else {
      setDocuments((prev) => [...prev, newDoc]);
    }

    setIsModalOpen(false);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const docTypes = ["All", "Design Doc", "Report", "PDF", "Presentation", "Other"];


  const [urls, setUrls] = useState<string[]>(editingDoc?.links || [""]);
const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

const handleAddUrl = () => {
  if (urls.length < 5) setUrls((prev) => [...prev, ""]);
};

const handleRemoveUrl = (index: number) => {
  setUrls((prev) => prev.filter((_, idx) => idx !== index));
};

const handleUrlChange = (index: number, value: string) => {
  const updated = [...urls];
  updated[index] = value;
  setUrls(updated);
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  if (files.length + uploadedFiles.length > 5) {
    alert("You can only upload a maximum of 5 files.");
    return;
  }
  setUploadedFiles([...uploadedFiles, ...files]);
};


  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-6 items-center text-xl">
        <input
          type="text"
          placeholder="Search by document or project name..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {docTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddNew}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Document
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-300 border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100/80 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xl font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-gray-700">Project</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-gray-700">File Name</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-gray-700">Links</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium capitalize text-xl">{doc.type}</td>
                <td className="px-6 py-4 text-gray-600 text-xl">{doc.projectName}</td>
                <td className="px-6 py-4 text-gray-800 font-semibold text-xl">{doc.name}</td>
                <td className="px-6 py-4">
                  <ul className="space-y-1">
                    {doc.links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-xl"
                        >
                          View Link {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 space-x-3 flex items-center">
                  <button
                    onClick={() => handleEdit(doc)}
                    title="Edit"
                    className="text-yellow-600 hover:scale-110 transition"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    title="Delete"
                    className="text-red-600 hover:scale-110 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-xl">
      <h3 className="text-xl font-semibold mb-4">
        {editingDoc ? "Edit Document" : "Add Document"}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const links = urls.filter((link) => link.trim() !== "");
          const files = uploadedFiles;

          const newDoc: DocumentItem = {
            id: editingDoc?.id || Date.now().toString(),
            name: formData.get("name") as string,
            type: formData.get("type") as any,
            projectName: formData.get("projectName") as string,
            uploadedBy: formData.get("uploadedBy") as string,
            uploadedAt: formData.get("uploadedAt") as string,
            links,
            files,
          };

          if (editingDoc) {
            setDocuments((prev) =>
              prev.map((d) => (d.id === editingDoc.id ? newDoc : d))
            );
          } else {
            setDocuments((prev) => [...prev, newDoc]);
          }

          setIsModalOpen(false);
          setUrls([""]); // reset URL list
          setUploadedFiles([]); // reset files
        }}
      >
        <div className="space-y-4">
          <input name="name" defaultValue={editingDoc?.name} placeholder="Document Name" required className="w-full border px-3 py-2 rounded" />
          <input name="projectName" defaultValue={editingDoc?.projectName} placeholder="Project Name" required className="w-full border px-3 py-2 rounded" />
          <input name="uploadedBy" defaultValue={editingDoc?.uploadedBy} placeholder="Uploaded By" required className="w-full border px-3 py-2 rounded" />
          <input name="uploadedAt" defaultValue={editingDoc?.uploadedAt} type="date" required className="w-full border px-3 py-2 rounded" />
          <select name="type" defaultValue={editingDoc?.type || "Report"} required className="w-full border px-3 py-2 rounded">
            {docTypes.filter(t => t !== "All").map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* URL input list */}
          <div>
            <label className="font-medium block mb-1">SharePoint URLs:</label>
            {urls.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder={`Link ${idx + 1}`}
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(idx)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {urls.length < 5 && (
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add another link
              </button>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="font-medium block mb-1">Upload Files (optional, max 5):</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.ppt,.docx,.pptx,.txt"
              className="w-full border px-3 py-2 rounded"
            />
            {uploadedFiles.length > 0 && (
              <ul className="text-sm mt-2 list-disc list-inside text-gray-600">
                {uploadedFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editingDoc ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default DocumentPage;
