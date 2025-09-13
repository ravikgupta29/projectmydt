'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, Plus, Search, Eye } from 'lucide-react';

type WorkflowFile = {
    id: string;
    name: string;
    type: 'image' | 'pdf' | 'excel' | 'doc' | 'other';
    sharepointLink: string;
};

const fileIcons: Record<string, string> = {
    image: '🖼️',
    pdf: '📄',
    excel: '📊',
    doc: '📝',
    other: '📁',
};

const dummyFiles: WorkflowFile[] = [
    {
        id: uuidv4(),
        name: 'Design Mockup',
        type: 'image',
        sharepointLink: 'https://static.tildacdn.one/tild6538-6537-4534-b334-393965303361/sn_sf11.png',
    },
    {
        id: uuidv4(),
        name: 'Project Plan',
        type: 'pdf',
        sharepointLink: 'https://raw.githubusercontent.com/vineettiwari22071991/reactNative/main/dummy.pdf',
    },
    {
        id: uuidv4(),
        name: 'Sprint Sheet',
        type: 'excel',
        sharepointLink: 'https://raw.githubusercontent.com/vineettiwari22071991/reactNative/main/updated_project_data.xlsx',
    },
    {
        id: uuidv4(),
        name: 'Notes',
        type: 'doc',
        sharepointLink: 'https://raw.githubusercontent.com/vineettiwari22071991/reactNative/main/Updated%20Arun-March-2025%20(2).docx',
    },
];

const WorkflowPage = () => {
    const [workflowFiles, setWorkflowFiles] = useState<WorkflowFile[]>(dummyFiles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFile, setNewFile] = useState<Partial<WorkflowFile>>({});
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const filteredFiles = workflowFiles.filter((file) => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || file.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleAddOrUpdateFile = () => {
        if (!newFile.name || !newFile.type || !newFile.sharepointLink) return;

        if (isEditing) {
            setWorkflowFiles((prev) =>
                prev.map((file) => (file.id === isEditing ? { ...file, ...newFile } as WorkflowFile : file))
            );
        } else {
            setWorkflowFiles([...workflowFiles, { ...newFile, id: uuidv4() } as WorkflowFile]);
        }

        setIsModalOpen(false);
        setNewFile({});
        setIsEditing(null);
    };

    const handleEdit = (file: WorkflowFile) => {
        setNewFile(file);
        setIsEditing(file.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setWorkflowFiles(workflowFiles.filter((file) => file.id !== id));
    };

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };


    return (
        <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
            <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-8">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">⚙️ Project Workflow Files</h2>
                    <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
                        <div className="flex items-center border rounded-lg px-3 py-1.5 bg-white shadow-sm">
                            <Search className="w-4 h-4 text-gray-500 mr-2 text-xl" />
                            <input
                                type="text"
                                placeholder="Search by name"
                                className="outline-none w-full text-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-3 py-2 rounded-lg border bg-white shadow-sm text-xl"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="image">Image</option>
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="doc">Doc</option>
                            <option value="other">Other</option>
                        </select>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition text-xl"
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsEditing(null);
                                setNewFile({});
                            }}
                        >
                            <Plus className="w-6 h-6" /> Add File
                        </button>
                    </div>
                </div>
                {
                    filteredFiles.length > 0 ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {

                                filteredFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className="group relative block bg-white bg-opacity-10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {/* File Preview (Image, PDF, Excel/Doc) */}
                                        <div>
                                            {file.type === 'image' ? (
                                                <img
                                                    src={file.sharepointLink}
                                                    alt={file.name}
                                                    className="w-full h-40 object-cover rounded-lg filter blur-sm group-hover:blur-none transition duration-300"
                                                />
                                            ) : file.type === 'pdf' ? (
                                                <iframe
                                                    src={`https://docs.google.com/viewer?url=${file.sharepointLink}&embedded=true`}
                                                    title={file.name}
                                                    className="w-full h-40 rounded-lg border border-gray-200 bg-white shadow-sm"
                                                />
                                            ) : file.type === 'excel' || file.type === 'doc' ? (
                                                <iframe
                                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.sharepointLink)}`}
                                                    title={file.name}
                                                    className="w-full h-40 rounded-lg border border-gray-200 bg-white shadow-sm"
                                                />
                                            ) : (
                                                <div className="text-5xl mb-3">{fileIcons[file.type]}</div>
                                            )}
                                        </div>

                                        {/* File Name */}
                                        <h3 className="text-md font-semibold truncate mt-4 text-center">{file.name}</h3>

                                        {/* Action Buttons (Preview, Edit, Delete) */}
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                                            {/* Preview button - Eye icon */}
                                            <a
                                                href={file.sharepointLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye className="w-5 h-5 hover:scale-110 transition" />
                                            </a>

                                            {/* Edit button */}
                                            <button onClick={() => handleEdit(file)} title="Edit">
                                                <Pencil className="text-yellow-600 w-5 h-5 hover:scale-110 transition" />
                                            </button>

                                            {/* Delete button */}
                                            <button onClick={() => handleDelete(file.id)} title="Delete">
                                                <Trash2 className="text-red-600 w-5 h-5 hover:scale-110 transition" />
                                            </button>
                                        </div>
                                    </div>

                                ))
                            }

                        </div>
                    ) : (

                        <div className="flex justify-center items-center py-6 text-gray-500 text-xl font-bold">
                            No Data
                        </div>

                    )
                }
                { }

            </div>

            {/* Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-90"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-90"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                                <Dialog.Title className="text-lg font-bold mb-4">
                                    {isEditing ? 'Edit File' : 'Add New File'}
                                </Dialog.Title>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="File Name"
                                        className="w-full border rounded px-3 py-2"
                                        value={newFile.name || ''}
                                        onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                                    />
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={newFile.type || ''}
                                        onChange={(e) =>
                                            setNewFile({ ...newFile, type: e.target.value as WorkflowFile['type'] })
                                        }
                                    >
                                        <option value="">Select File Type</option>
                                        <option value="image">Image</option>
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                        <option value="doc">Doc</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <input
                                        type="url"
                                        placeholder="SharePoint Link"
                                        className="w-full border rounded px-3 py-2"
                                        value={newFile.sharepointLink || ''}
                                        onChange={(e) => setNewFile({ ...newFile, sharepointLink: e.target.value })}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddOrUpdateFile}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            {isEditing ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default WorkflowPage;
