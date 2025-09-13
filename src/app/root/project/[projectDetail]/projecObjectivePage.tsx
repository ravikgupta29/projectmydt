"use client";

import React, { useState } from "react";
import graphData from "./../../../../../constant/graphData.json"
import { Document, ObjectiveFile, ProjectOverallData, Props } from "../../../../../type/type";
import { Edit2, Pencil, PlusCircle, Trash2, X } from "lucide-react";



const ProjectObjectivePage = ({ pageNumber }: Props) => {
  const imageUrl =
    "https://www.projektron.de/fileadmin/user_upload/1_bilder_website/blog/fachartikel/2024/Projektziele/Zielbaum-Zielhierarchie-Projektziele-EN.png";
  const [isEditing, setIsEditing] = useState(false);
  const [isProjectOverViewEditing, setIsProjectOverViewEditing] = useState(false)
  const [objectiveFiles, setObjectiveFiles] = useState<ObjectiveFile>(graphData.data.filter((item) => {
    return item.ref_id === pageNumber
  })[0].Project_Objective)
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
  const [error, setError] = useState("");
  const [objective, setObjective] = useState<string>(objectiveFiles.Objectives)
  const [task, setTask] = useState<string>(objectiveFiles.Tasks)
  const [timing, setTiming] = useState<string>(objectiveFiles.Timing)
  const [showModal, setShowModal] = useState(false);
  const [showKPIModal, setShowKPIModal] = useState(false)
  const [showFTEModal, setShowFTEModal] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [docInput, setDocInput] = useState<Document>({
    name: '',
    file_type: '',
    type: '',
    link: '',
    Date: '',
    Responsiable: ''
  });
  const [kpiInput, setKpiInput] = useState<any>([])
  const [fTEInput, setFTEInput] = useState<any>([])
  const [projectOverallData, setProjectOverallData] = useState<ProjectOverallData>(objectiveFiles.TopProjectTable)
  const [kpiMetric, setKpiMatric] = useState<any[]>(objectiveFiles.KPI_Metric)
  const [fteData, setFteData] = useState<any[]>(objectiveFiles.FTE_Data)

  const openModal = (doc?: Document, index?: number) => {
    if (doc && index !== undefined) {
      setDocInput(doc);
      setEditIndex(index);
    } else {
      setDocInput({ name: '', type: '', file_type: '', link: '', Responsiable: '', Date: '' });
      setEditIndex(null);
    }
    setError('');
    setShowModal(true);
  };

  const openKpiModal = (kpi?: any, index?: number) => {

    if (kpi) {
      setKpiInput(kpi)
    } else {
      setKpiInput([])
    }
    setShowKPIModal(true)
  }

  const openFTEModal = (fte?: any, index?: number) => {

    if (fte) {
      setFTEInput(fte)
    } else {
      setKpiInput([])
    }
    setShowFTEModal(true)
  }



  return (
    <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-8">


        {error && (
          <div className="mb-4 text-red-600 font-medium bg-red-100 border border-red-300 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="flex grid-flow-row gap-2">

          {/* Left Side */}
          <div className="w-1/2 rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-rubik-bold rounded-lg bg-yellow-200 py-2 px-2">{objectiveFiles.IQP}</span>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2
                    size={24}
                    color="blue"
                  />
                </button>


              ) : (
                <div className="space-x-3">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-xl"
                    onClick={() => setIsEditing(false)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg text-xl"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-xl font-rubik-bold text-gray-800 mb-2">Objectives</label>
              {isEditing ? (
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Enter objectives"
                  className="w-full min-h-[200px] rounded-2xl border border-gray-300 bg-white px-4 py-3 text-lg text-gray-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              ) : (
                <div className="bg-gray-50 overflow-x-auto max-h-[300px] text-gray-800 rounded-2xl px-5 py-4 text-lg shadow-sm border border-blue-100">
                  {objective?.trim() ? objective : <span className="italic text-gray-500">--</span>}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-rubik-bold mb-1 text-xl">Tasks</label>
              {isEditing ? (
                <textarea
                  value={task}
                  placeholder="Enter tasks"
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full min-h-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                />
              ) : (
                <p className="text-gray-800 overflow-x-auto max-h-[300px] whitespace-pre-line text-xl bg-gray-50 rounded-2xl px-5 py-4 shadow-sm border border-blue-100">{task || '--'}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-rubik-bold mb-1 text-xl">Timing</label>
              {isEditing ? (
                <textarea
                  value={timing}
                  placeholder="Enter timing"
                  onChange={(e) => setTiming(e.target.value)}
                  className="w-full min-h-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                />
              ) : (
                <p className="text-gray-800 overflow-x-auto max-h-[300px] whitespace-pre-line text-xl bg-gray-50 rounded-2xl px-5 py-4 shadow-sm border border-blue-100">{timing || '--'}</p>
              )}
            </div>
          </div>
          {/* Right Side */}

          <div className="w-1/2 rounded-lg p-6 shadow-md">
            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-rubik-bold mb-4 text-gray-700">Project overview</h2>
                {!isProjectOverViewEditing ? (
                  <button
                    onClick={() => setIsProjectOverViewEditing(true)}
                  >
                    <Edit2
                      size={24}
                      color="blue"
                    />
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-xl"
                      onClick={() => setIsProjectOverViewEditing(false)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg text-xl"
                      onClick={() => setIsProjectOverViewEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>


              <div className="grid grid-cols-3 gap-6 text-sm ">
                {/* Left Column */}
                <div className="space-y-4 overflow-y-auto pr-2">
                  {[
                    ['Project', 'project'],
                    ['OBM', 'OBM'],
                    ['Customer', 'customer'],
                    ['IQP Mode-Status', 'iqpStatus'],
                  ].map(([label, key]) => (
                    <div key={key}>
                      <div className="font-rubik-medium text-gray-700 text-xl">{label}</div>
                      {isProjectOverViewEditing ? (
                        <input
                          placeholder="Enter value"
                          // @ts-ignore
                          value={projectOverallData[key]}
                          onChange={(e) =>
                            setProjectOverallData({ ...projectOverallData, [key]: e.target.value })
                          }
                          className="w-full border rounded px-2 py-1 text-lg"
                        />
                      ) : (
                        <div className="text-gray-900 bg-gray-100 px-2 py-2 rounded-md text-lg">
                          {/*@ts-ignore */}
                          {projectOverallData[key] === "" ? "--" : projectOverallData[key]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Center Column */}
                <div className="space-y-4">
                  {[
                    ['T0-T End', 't0tEnd'],
                    ['TO plan T0-PTD', 'toPlan'],
                    ['Margin Plan TO-PTD', 'marginPlan'],
                  ].map(([label, key]) => (
                    <div key={key}>
                      <div className="font-rubik-medium text-gray-700 text-xl">{label}</div>
                      {isProjectOverViewEditing ? (
                        <input
                          placeholder="Enter value"
                          // @ts-ignore
                          value={projectOverallData[key]}
                          onChange={(e) =>
                            setProjectOverallData({ ...projectOverallData, [key]: e.target.value })
                          }
                          className="w-full border rounded px-2 py-1 text-lg"
                        />
                      ) : (
                        // @ts-ignore
                        <div className="text-gray-900 bg-gray-100 px-2 py-2 rounded-md text-lg">{projectOverallData[key] === "" ? "--" : projectOverallData[key]}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {[
                    ['DP', 'dp'],
                    ['CP2', 'cp2'],
                    ['CP1', 'cp1'],
                    ['RC', 'rc'],
                    ['DD', 'dd'],
                  ].map(([label, key]) => (
                    <div key={key}>
                      <div className="font-rubik-medium text-gray-700 text-xl">{label}</div>
                      {isProjectOverViewEditing ? (
                        <input
                          placeholder="Enter value"
                          // @ts-ignore
                          value={projectOverallData[key]}
                          onChange={(e) =>
                            setProjectOverallData({ ...projectOverallData, [key]: e.target.value })
                          }
                          className="w-full border rounded px-2 py-1 text-lg"
                        />
                      ) : (
                        // @ts-ignore
                        <div className="text-gray-900 bg-gray-100 px-2 py-2 rounded-md text-lg">{projectOverallData[key] === "" ? "--" : projectOverallData[key]}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* KPIs Table Below Project Overview */}
            <div className="mt-8 rounded-md bg-gray-100 p-4">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-rubik-bold mb-4 text-gray-700">KPI Summary</h2>
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={() => openKpiModal([])}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-md"
                  >
                    <PlusCircle size={18} /> Add KPI
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-2 ">
                <table className="min-w-full border border-gray-300 text-sm text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 bg-gray-200 text-left text-xl">Metric</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">H-1</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">Target H</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">HTD</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      kpiMetric?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-gray-500 text-xl">
                            No Data found.
                          </td>
                        </tr>
                      ) : (
                        kpiMetric.map(([metric, h1, target, htd], index) => (
                          <tr key={metric} className="bg-white even:bg-gray-50">
                            <td className="border px-4 py-2 text-left font-medium text-xl">{metric}</td>
                            <td className="border px-4 py-2 text-xl">{h1}</td>
                            <td className="border px-4 py-2 text-xl">{target}</td>
                            <td className="border px-4 py-2 text-xl">{htd}</td>
                            <td className="p-3 border-b text-center space-x-3">
                              <button
                                onClick={() => openKpiModal(kpiMetric[index])}
                                className="text-yellow-600 hover:text-yellow-800"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )
                    }
                  </tbody>
                </table>
              </div>
            </div>

            {/* FTE Data Table Below KPI Overview */}
            <div className="mt-8 rounded-md bg-gray-100 p-4">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-rubik-bold mb-4 text-gray-700">FTE Summary</h2>
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={() => openFTEModal([])}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-md"
                  >
                    <PlusCircle size={18} /> Add FTE
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-2 ">
                <table className="min-w-full border border-gray-300 text-sm text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 bg-gray-200 text-left text-xl">FTE</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">IQP2</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">IQP3</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">IQP4</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">IQP5</th>
                      <th className="border px-4 py-2 text-red-600 font-semibold text-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      fteData?.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-gray-500 text-xl">
                            No Data found.
                          </td>
                        </tr>
                      ) : (
                        fteData.map(([fte, iqp2, iqp3, iqp4, iqp5], index) => (
                          <tr key={fte} className="bg-white even:bg-gray-50">
                            <td className="border px-4 py-2 text-left font-medium text-xl">{fte}</td>
                            <td className="border px-4 py-2 text-xl">{iqp2}</td>
                            <td className="border px-4 py-2 text-xl">{iqp3}</td>
                            <td className="border px-4 py-2 text-xl">{iqp4}</td>
                            <td className="border px-4 py-2 text-xl">{iqp5}</td>
                            <td className="p-3 border-b text-center space-x-3">
                              <button
                                onClick={() => openFTEModal(fteData[index])}
                                className="text-yellow-600 hover:text-yellow-800"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )
                    }
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>



        <div>
          {/* Image Card */}
          <div
            className="flex justify-center"
          >
            <img
              src={imageUrl}
              alt="Project Objective"
              className="w-1/2 h-96 bg-gray-50 shadow-xl rounded-xl border border-gray-50 overflow-hidden cursor-pointer hover:shadow-2xl transition mt-10 self-center"
              onClick={() => setIsModalImageOpen(true)}
            />

          </div>

          {isModalImageOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close button */}
                <button
                  onClick={() => setIsModalImageOpen(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300"
                >
                  <X size={32} />
                </button>

                {/* Image inside modal */}
                <img
                  src={imageUrl}
                  alt="Full View"
                  className="max-w-[95%] max-h-[95%] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-end mb-4 mt-10">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xl"
            >
              <PlusCircle size={18} /> Add Document
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 border text-xl">Name</th>
                  <th className="px-4 py-3 border text-xl">Type</th>
                  <th className="p-3 border-b text-xl">Created Date</th>
                  <th className="p-3 border-b text-xl">Responsiable</th>
                  <th className="px-4 py-3 border text-xl">Link</th>
                  <th className="p-3 border-b text-center text-xl">Actions</th>
                  {isEditing && <th className="px-4 py-3 border text-center text-xl">Action</th>}
                </tr>
              </thead>
              <tbody>
                {
                  objectiveFiles.Files.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500 text-xl">
                        No documents found.
                      </td>
                    </tr>
                  ) : objectiveFiles.Files.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border text-xl">
                        {file.name}
                      </td>
                      <td className="px-4 py-3 border text-xl">
                        {file.type}
                      </td>
                      <td className="p-3 border-b text-xl">{file.Date}</td>
                      <td className="p-3 border-b text-xl">{file.Responsiable}</td>
                      <td className="px-4 py-3 border text-xl">
                        <a
                          href={file.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          click
                        </a>
                      </td>
                      <td className="p-3 border-b text-center space-x-3">
                        <button
                          onClick={() => openModal(file, index)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
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
                <option value="Project Review">Project Review</option>
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
                onClick={() => { }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/*KPI Modal */}
      {
        showKPIModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl">
              <h2 className="text-lg">
                {kpiInput.length !== 0 ? 'Edit KPI' : 'Add KPI'}
                <div className="gap-y-2 mt-10">
                  <span className="text-lg text-gray-500">Metric</span>
                  <input
                    type="text"
                    placeholder="Metric"
                    value={kpiInput[0] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                  <span className="text-lg text-gray-500">H-1</span>
                  <input
                    type="text"
                    placeholder="H-1"
                    value={kpiInput[1] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                  <span className="text-lg text-gray-500">Target</span>
                  <input
                    type="text"
                    placeholder="Target"
                    value={kpiInput[2] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                  <span className="text-lg text-gray-500">HTD</span>
                  <input
                    type="text"
                    placeholder="HTD"
                    value={kpiInput[3] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowKPIModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowKPIModal(false)}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </h2>
            </div>
          </div>
        )

      }


      {/*FTE Modal */}
      {
        showFTEModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl">
              <h2 className="text-lg">
                {fTEInput.length !== 0 ? 'Edit FTE' : 'Add FTE'}
                <div className="gap-y-2 mt-10">
                  <span className="text-lg text-gray-500">FTE</span>
                  <input
                    type="text"
                    placeholder="FTE"
                    value={fTEInput[0] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                  <span className="text-lg text-gray-500">IQP2</span>
                  <input
                    type="text"
                    placeholder="IQP2"
                    value={fTEInput[1] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                  <span className="text-lg text-gray-500">IQP3</span>
                  <input
                    type="text"
                    placeholder="IQP3"
                    value={fTEInput[2] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                  <span className="text-lg text-gray-500">IQP4</span>
                  <input
                    type="text"
                    placeholder="IQP4"
                    value={fTEInput[3] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                  <span className="text-lg text-gray-500">IQP5</span>
                  <input
                    type="text"
                    placeholder="IQP5"
                    value={fTEInput[4] || ''}
                    onChange={(e) => ""}
                    className="border p-2 rounded w-full mb-2 mt-2"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowFTEModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowFTEModal(false)}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </h2>
            </div>
          </div>
        )

      }
    </div>
  );
};




export default ProjectObjectivePage;
