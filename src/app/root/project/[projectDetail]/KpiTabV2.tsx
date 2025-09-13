import { useState } from "react"
import { Props } from "../../../../../type/type"
import graphData from "./../../../../../constant/graphData.json"
import GraphKpi from "./graphKpi"


const KpiTabV2 = ({ pageNumber }: Props) => {
    const [KpiTabs, setKpiTabs] = useState<any>(graphData.data.filter((item) => {
        return item.ref_id === pageNumber
    })[0].KPI_Tab[0])

    const [selectedQuarter, setSelectedQuarter] = useState<string>("Q1");


    const [selectedTabId, setSelectedTabId] = useState<number>(1)
    const [comments, setComments] = useState<string>()

    const handleChipClick = (id: number) => {
        setSelectedQuarter("Q1")
        setSelectedTabId(id)
    }

    const onChangeComments = (value: string) => {
        setComments(value)
    }
    const selectedGraphData = KpiTabs && KpiTabs?.find((item: any) => item.id === selectedTabId)?.GraphData || [];

    const selectedTab = KpiTabs && KpiTabs?.find((item: any) => item.id === selectedTabId) || []


    return (
        <div className="p-4 lg:p-6 bg-gray-100">
            <div className="flex flex-wrap mb-6">
                {
                    KpiTabs && KpiTabs.filter((item: any) => item.name !== "Skill Compliance")
                        .sort((a: any, b: any) => a.order - b.order)
                        //@ts-ignore
                        .map(item => {
                            const isSelected = selectedTabId === item.id;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleChipClick(item.id)}
                                    aria-pressed={isSelected}
                                    className={`rounded-full py-2 px-6  font-medium transition m-2
              ${isSelected
                                            ? "bg-blue-600 text-white shadow text-2xl"
                                            : "bg-white text-lg text-gray-800 border border-gray-300 hover:bg-gray-100"}
            `}
                                >
                                    {item.name}
                                </button>
                            );
                        })
                }
            </div>


            {/* Conditionally show color code table for "Team Skill" */}
            {selectedTab.name === "Team Skill" && (
                <div className="overflow-x-auto sticky top-0 mt-8 mb-8 bg-white p-4 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4">Reference Colors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { range: "> 100%", grade: "A+", color: "#08AADE" },
                            { range: "= 100%", grade: "A", color: "#08AA4E" },
                            { range: "> 85%", grade: "B", color: "#0BE615" },
                            { range: "> 65%", grade: "C", color: "#EBB915" },
                            { range: "> 40%", grade: "D", color: "#EB210E" },
                            { range: "<= 40%", grade: "E", color: "#B21A0E" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg shadow-md text-white font-bold"
                                style={{ backgroundColor: item.color }}
                            >
                                <span className="text-lg">{item.range}</span>
                                <span className="text-xl">{item.grade}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Conditionally show color code table for "ACQP" */}
            {selectedTab.name === "ACQP" && (
                <div className="overflow-x-auto sticky top-0 mt-8 mb-8 bg-white p-4 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4">Reference Colors</h3>
                    <p className="text-xl font-light mb-4 text-center">(1- Very Dissatisfied, 2- Dissatisfied, 3-Staisfied, 4-Extremely)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                        {[
                            { range: "", grade: "1", color: "#A9D18E" },
                            { range: "", grade: "2", color: "#F4B084" },
                            { range: "", grade: "3", color: "#9DC3E6" },
                            { range: "", grade: "4", color: "#FFD966" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg shadow-md text-white font-bold"
                                style={{ backgroundColor: item.color }}
                            >
                                <span className="text-lg">{item.range}</span>
                                <span className="text-xl text-black">{item.grade}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Conditionally show color code table for "CSAT" */}
            {selectedTab.name === "CSAT" && (
                <div className="overflow-x-auto sticky top-0 mt-8 mb-8 bg-white p-4 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4">Reference Colors</h3>
                    <p className="text-xl font-light mb-4 text-center">(1- Very Dissatisfied, 2- Dissatisfied, 3-Staisfied, 4-Extremely)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                        {[
                            { range: "", grade: "1", color: "#A9D18E" },
                            { range: "", grade: "2", color: "#F4B084" },
                            { range: "", grade: "3", color: "#9DC3E6" },
                            { range: "", grade: "4", color: "#FFD966" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg shadow-md text-white font-bold"
                                style={{ backgroundColor: item.color }}
                            >
                                <span className="text-lg">{item.range}</span>
                                <span className="text-xl text-black">{item.grade}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            <div className="flex items-center justify-end mb-4 ">
                <div className="bg-blue-500 p-2 rounded-lg">
                    <label className="text-xl text-white font-medium mr-3">Select Quarter:</label>
                    <select
                        value={selectedQuarter}
                        onChange={(e) => setSelectedQuarter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                    </select>
                </div>

            </div>


            <GraphKpi graphData={selectedGraphData} />


            <div className="overflow-x-auto mt-8 mb-8 bg-white p-4 rounded-lg">
                <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 border text-xl">Comment</th>
                            <th className="p-3 border-b text-xl">Date</th>
                            <th className="p-3 border-b text-xl">Responsiable</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {
                            selectedTab.comments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500 text-xl">
                                        No Comments Added.
                                    </td>
                                </tr>
                            ) : selectedTab.comments.map((item: any, index: any) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 border text-xl">
                                        {item.comments}
                                    </td>
                                    <td className="p-3 border-b text-xl">{item.date}</td>
                                    <td className="p-3 border-b text-xl">{item.responsiable}</td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className="mb-6 mt-6 flex flex-col">
                <label className="block text-gray-700 font-rubik-bold mb-1 text-xl">Comments</label>
                <textarea
                    value={comments}
                    placeholder="Add Comments"
                    onChange={(e) => onChangeComments(e.target.value)}
                    className="w-full min-h-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-xl w-60 self-end mt-6 "
                    onClick={() => ""}
                >
                    Save
                </button>
            </div>

        </div>
    )

}

export default KpiTabV2