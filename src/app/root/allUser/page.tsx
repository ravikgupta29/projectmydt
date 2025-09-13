"use client"
import { Fragment, useEffect, useState } from "react"
import MultiSelectFilter from "../../../../components/MultiSelectFilter"
import { User, UserModalProps } from "../../../../type/type";
import { Trash2Icon, X } from "lucide-react";
const AllUserData = [
    {
        empId: 5495,
        email: "Syam.KUMAR@alten-india.com",
        name: "Syam KUMAR",
        role: "BO-PM",
        projectRef: [1916],
    },
    {
        empId: 5496,
        email: "SENTHILKUMAR.KANAGARAJ@alten-india.com",
        name: "SENTHILKUMAR KANAGARAJ",
        role: "BO-PL2",
        projectRef: [1916],
    },
    {
        empId: 5497,
        email: "Vamsi.MACHIREDDY@alten-india.com",
        name: "Vamsi MACHIREDDY",
        role: "BO-PM",
        projectRef: [294, 295, 1693,532],
    },
    {
        empId: 5498,
        email: "Pradeep.GAJAKOSH@alten-india.com",
        name: "Pradeep GAJAKOSH",
        role: "BO-PL2",
        projectRef: [294, 1693],
    },
    {
        empId: 5499,
        email: "Sachin.SAJEEV@alten-india.com",
        name: "Sachin SAJEEV",
        role: "BO-PL2",
        projectRef: [295],
    },
    {
        empId: 5500,
        email: "Ranjana.HEGDE@alten-india.com",
        name: "Ranjana HEGDE",
        role: "BO-PL2",
        projectRef: [532],
    },
];

const AllUserScreen = () => {
    const [header, setHeader] = useState<string[]>([])
    const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
    const [options, setOptions] = useState<{ [key: string]: string[] }>({});
    const [dummyData, setDummyData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const excludedFielsForDropSearch = ["empId"]
    const excludedFieldsForNotShowDropAndSearch = ["createdDate"]

    const [showUserModal, setShowUserModal] = useState<boolean>(false)
    const [selectedUser, setSelectedUser] = useState<User>({} as User)
    const [modalType, setModalType] = useState<"edit" | "add">("add")



    useEffect(() => {
        ; (() => {
            const excludedFields = ["status", "location", "modifiedBy", "modifiedDate"];
            const keys = Object.keys(AllUserData[0]).filter(key => !excludedFields.includes(key));
            setHeader(keys)


            const extractUniqueValues = (column: string) => {
                return [...new Set(AllUserData.map((row: any) => row[column]))];
            };

            const filterOptions: { [key: string]: string[] } = {};
            keys.forEach((key) => {
                filterOptions[key] = extractUniqueValues(key);
            });

            setOptions(filterOptions);
            setFilters(keys.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));

            setDummyData(AllUserData)
        })()

    }, [])

    const handleFilterChange = (column: string, selected: string[]) => {
        console.log("Selected values for", column, ":", selected);
        setFilters((prev) => ({ ...prev, [column]: selected }));
    };


    const handleClearFilters = () => {
        setFilters(header.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));
    };

    const openUserModal = (type: string, user: User) => {
        if (type === "add") {
            setSelectedUser(user)
            setModalType("add")
            setShowUserModal(true)
        } else {
            setSelectedUser(user)
            setModalType("edit")
            setShowUserModal(true)
        }
    }

    const closeUserModal = () => {
        setShowUserModal(false)
    }



    const filteredData = dummyData
        .filter((row) =>
            Object.keys(filters).every((key) =>
                filters[key].length
                    ? filters[key].some(
                        (filterValue) =>
                            String(row[key]).toLowerCase().includes(String(filterValue).toLowerCase())  // Allow partial match
                    )
                    : true
            )
        );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    console.log(currentData)

    return (
        <Fragment>
            <div className="p-4">

                <div className="flex justify-between">
                    <div className="flex justify-center mt-4 space-x-2">
                        {[...Array(totalPages).keys()].map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum + 1)}
                                className={`px-4 py-2 rounded-md ${currentPage === pageNum + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                {pageNum + 1}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-x-5">
                        <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                            Clear All Filters
                        </button>
                        <button onClick={() => { openUserModal("add", {} as User) }} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Add new user
                        </button>
                        <button onClick={() => { }} className="px-4 py-2 bg-green-800 text-white rounded-md">
                            Export to Excel
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto mt-10">
                    <table className="w-full border min-w-max">
                        <thead>
                            <tr className="bg-gray-200">
                                {header.map((header) => (
                                    <th key={header} className="p-2 border">
                                        {options[header] && (
                                            <MultiSelectFilter
                                                column={header}
                                                options={options[header]}
                                                selected={filters[header]}
                                                onChange={handleFilterChange}
                                                isShownSearchList={
                                                    excludedFielsForDropSearch.includes(header) ? false : true
                                                }
                                                showHeaderWithoutSearchAndDropDown={
                                                    excludedFieldsForNotShowDropAndSearch.includes(header) ? false : true
                                                }
                                            />
                                        )}
                                    </th>
                                ))}
                                <th className="p-2 border text-xl">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentData.length === 0 ? (
                                    <tr>
                                        <td colSpan={header.length + 1} className="p-4 text-center text-black-300 font-rubik-medium text-xl">
                                            No record has been found
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((row, index) => (
                                        <tr key={index} className="border text-xl">
                                            {header.map((head, index) => (
                                                head === "projectRef" ? (
                                                    <td key={index} className="p-2 border">{row.projectRef.join(", ")}</td>
                                                ) : <td key={index} className="p-2 border">{row[head]}</td>
                                               
                                            ))}
                                            <td className="p-2 text-xl">
                                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                                    onClick={() => openUserModal("edit", row)}
                                                >View</button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>


                    </table>


                </div>
            </div>
            {
                showUserModal && <UserModal
                    modalType={modalType}
                    onClose={closeUserModal}
                    onSave={() => { }}
                    userData={selectedUser}
                />
            }

        </Fragment>

    )

}





const UserModal = ({ onClose, userData, modalType, onSave }: UserModalProps) => {
    const roles = ["BO-PM", "BO-PL2"];
    const [formData, setFormData] = useState<User>(
        Object.keys(userData || {}).length > 0 ? userData : {
            empId: undefined,
            email: "",
            name: "",
            role: "",
            status: "",
            projectRef: [],
            manager: "",
            department: "",
            location: ""
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleStatus = () => {
        setFormData((prev) => ({
            ...prev,
            status: prev.status === "Active" ? "Inactive" : "Active",
        }));
    };


    const addProject = () => {
        setFormData((prev) => ({
            ...prev,
            projectRef: [...prev.projectRef, 0 ], // Initialize new projectRef with default 0
        }));
    };

    const updateProject = (index: number, value: string) => {
        const updatedProjects = [...formData.projectRef];
        updatedProjects[index] = Number(value);
        setFormData((prev) => ({ ...prev, projectRef: updatedProjects }));
    };

    const removeProject = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            projectRef: prev.projectRef.filter((_, i) => i !== index),
        }));
    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-2xl ml-5 mr-5">
                <div className="flex flex-row items-start justify-between">
                    <h2 className="text-2xl font-semibold mb-4">
                        {modalType === "edit" ? "Edit User" : "Add New User"}
                    </h2>
                    <X className="w-10 h-10"
                        onClick={onClose}
                    />
                </div>
                {
                    modalType === "add" && (
                        <div className="w-full flex flex-col mt-5 mb-5 items-center justify-center">
                            <button onClick={() => { }} className="px-4 py-2 bg-green-800 text-white rounded">
                                Import User
                            </button>
                            <div className="flex flex-row w-full mt-5 items-center justify-center">
                                <div className="w-20 h-0.5 bg-gray-400 self-center" />
                                <span className="text-sm font-rubik-medium ml-2 mr-2">OR</span>
                                <div className="w-20 h-0.5 bg-gray-400 self-center" />
                            </div>
                        </div>
                    )
                }

                <div className="w-full flex flex-row gap-6">
                    {/* Scrollable content area */}
                    <div className="w-1/2 max-h-[70vh] overflow-y-auto border-r pr-6">
                        {/* Employee Info Section */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold border-b-2  border-[#ECCD00] pb-2 mb-2">Employee Info</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xl font-medium">Emp ID</label>
                                    <input type="text" className={`w-full p-2 border rounded text-xl ${modalType === "edit" ? "bg-gray-100" : "bg-white"}`}
                                        value={formData.empId} disabled={modalType === "edit" ? true : false}
                                        onChange={() => { handleChange }} />
                                </div>
                                <div>
                                    <label className="block text-xl font-medium">Email</label>
                                    <input type="email" className={`w-full p-2 border rounded text-xl ${modalType === "edit" ? "bg-gray-100" : "bg-white"}`}
                                        value={formData.email} disabled={modalType === "edit" ? true : false}
                                        onChange={() => { handleChange }} />
                                </div>
                                <div>
                                    <label className="block text-xl font-medium">Name</label>
                                    <input type="text" name="name" className={`w-full p-2 border rounded text-xl ${modalType === "edit" ? "bg-gray-100" : "bg-white"}`}
                                        value={formData.name} disabled={modalType === "edit" ? true : false}
                                        onChange={() => { handleChange }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xl font-medium">Role</label>
                                    <select name="role" className="w-full p-2 border rounded text-xl"
                                        value={formData.role} onChange={handleChange}>
                                        {formData.role ? (
                                            <option value={formData.role}>{formData.role}</option>
                                        ) : (
                                            <option value="">Select Role</option>
                                        )}
                                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>
                               
                            </div>

                            {/* Status Toggle Switch */}
                            <div className="items-center mt-4 hidden">
                                <span className="text-xl font-medium mr-2">Status:</span>
                                <label className="relative inline-flex items-center cursor-pointer ">
                                    <input type="checkbox" className="sr-only peer" checked={formData.status === "Active"} onChange={toggleStatus} />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-green-500">
                                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                </label>
                            </div>
                        </div>


                        {/* Audit Info */}
                        {
                            modalType === "edit" && (
                                <div className="mb-4 hidden">
                                    <h3 className="text-xl font-semibold border-[#ECCD00] border-b-2 pb-2 mb-2">Info</h3>
                                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                                        <div>
                                            <span className="text-xl font-medium">Created By:</span>
                                            <p className="text-xl">{formData.createdBy || "N/A"}</p>
                                            <div>
                                                <span className="text-xl font-medium">Created Date:</span>
                                                <p className="text-xl">{formData.createdDate || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xl font-medium">Modified By:</span>
                                            <p className="text-xl">{formData.modifiedBy || "N/A"}</p>
                                            <div>
                                                <span className="text-xl font-medium">Modified Date:</span>
                                                <p className="text-xl">{formData.modifiedDate || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                    </div>



                    {/* Project Section with Scroll */}
                    <div className="w-1/2 max-h-[70vh] overflow-y-auto border-r pr-6">
                        <h3 className="text-xl font-semibold border-b-2 pb-2 mb-2 border-[#ECCD00] ">Project Reference</h3>
                        <div className="max-h-[60vh] overflow-y-auto">
                            {formData?.projectRef?.map((project, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-xl"
                                >
                                    <input
                                        type="number"
                                        value={project}
                                        onChange={(e) => updateProject(index, e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        placeholder="Enter project reference"
                                    />

                                    <label className="inline-flex items-center space-x-2 text-xl text-gray-700">
                                        <input
                                            type="checkbox"
                                            onChange={() => { }}
                                            className="accent-blue-500 h-4 w-4"
                                        />
                                        <span>Write</span>
                                    </label>

                                    <button
                                        onClick={() => removeProject(index)}
                                        className="text-red-500 hover:text-red-600 transition-colors text-xl"
                                        title="Remove Project"
                                    >
                                        <Trash2Icon className="w-6 h-6" />
                                    </button>
                                </div>
                            ))}

                        </div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 text-xl"
                            onClick={addProject}>Add Project</button>
                    </div>

                </div>




                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-blue-500 text-white rounded text-xl"> {modalType === "edit" ? "Update" : "Add"}</button>
                </div>

            </div>
        </div>
    );
};



export default AllUserScreen