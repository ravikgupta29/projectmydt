"use client";

import { AnimatePresence } from "framer-motion";
import GraphKpi from "./graphKpi";
import {
    CLEAR_ALL_FILTERS,
    KPI_ONE,
    PROJECT_ANALYTICS_DASHBOARD,
} from "../../../../../constant/string";
import {
    filterOptionGraphData,
} from "../../../../../constant/data";
import { useRef, useState } from "react";
import MultiSelectFilter from "../../../../../components/MultiSelectFilter";
import { Button } from "@/components/ui/button";
import graphData from "./../../../../../constant/graphData.json"
import { handleExportPDF } from "@/lib/utils";
import { Props } from "../../../../../type/type";

const KpiTab = ({ pageNumber }: Props) => {
    const [showKpi, setShowKpi] = useState<string>(KPI_ONE);
    const [KpiTabs, setKpiTabs] = useState<any[]>(graphData.data.filter((item) => {
        return item.ref_id === pageNumber
    })[0].KPI_Tab)
    const [graphKpiData, setGraphKpiData] = useState<any[]>(KpiTabs[0].GraphData);

    const [selectedToExport, setSelectedToExport] = useState<string[]>([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const hiddenRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const onHandleKpiClick = (kpiValue: string, data: any[]) => {
        setShowKpi(kpiValue);
        setGraphKpiData(data);
    };

    const toggleKpiSelection = (kpiValue: string) => {
        setSelectedToExport((prev) =>
            prev.includes(kpiValue)
                ? prev.filter((val) => val !== kpiValue)
                : [...prev, kpiValue]
        );
    };

    const toggleAll = () => {
        if (selectedToExport.length === KpiTabs.length) {
            setSelectedToExport([]);
        } else {
            setSelectedToExport(KpiTabs.map((k) => k.value));
        }
    };
    return (
        <div className="p-4 lg:p-6 bg-gray-100">
            {/* Filters & Top Section */}
            <div className="sticky top-0 z-10 bg-white shadow-sm py-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {PROJECT_ANALYTICS_DASHBOARD}
                    </h2>

                    <div className="flex items-center gap-4 flex-wrap">
                        <Button
                            className="hidden"
                            variant="destructive"
                            onClick={() => {
                                setSelectedToExport([]);
                                // setGraphKpiData(KPI_ONE_DATA);
                                // setShowKpi(KPI_ONE);
                            }}
                        >
                            {CLEAR_ALL_FILTERS}
                        </Button>

                        <div className="relative">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xl"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                            >
                                Export KPI(s)
                            </Button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 p-3">
                                    <label className="flex items-center mb-2 text-xl">
                                        <input
                                            type="checkbox"
                                            checked={selectedToExport.length === KpiTabs.length}
                                            onChange={toggleAll}
                                            className="mr-2"
                                        />
                                        Select All
                                    </label>
                                    <div className="max-h-40 overflow-y-auto text-xl">
                                        {KpiTabs.map((kpi) => (
                                            <label key={kpi.value} className="flex items-center mb-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedToExport.includes(kpi.value)}
                                                    onChange={() => toggleKpiSelection(kpi.value)}
                                                    className="mr-2"
                                                />
                                                {kpi.label}
                                            </label>
                                        ))}
                                    </div>
                                    <Button
                                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xl"
                                        onClick={() => {
                                            handleExportPDF({
                                                selectedToExport,
                                                hiddenRefs: hiddenRefs.current,
                                                kpiTabs: KpiTabs
                                            }).then(() => setDropdownOpen(false));
                                        }}
                                        disabled={selectedToExport.length === 0}
                                    >
                                        Export to PDF
                                    </Button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="relative flex bg-slate-100 p-1 rounded-full w-fit gap-x-1 ml-2 mb-2">
                    {KpiTabs.map((kpi) => (
                        <div
                            key={kpi.value}
                            onClick={() => onHandleKpiClick(kpi.value, kpi.GraphData)}
                            className={`cursor-pointer px-6 py-2 text-sm rounded-full transition-all duration-300 ${showKpi === kpi.value
                                ? "bg-emerald-500 text-white font-rubik-bold shadow-md scale-105"
                                : "text-slate-600 hover:bg-emerald-100"
                                }`}
                        >
                            {kpi.label}
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 px-4 bg-gray-50 p-4 rounded-xl">
                    {filterOptionGraphData.map((item, index) => (
                        <MultiSelectFilter
                            key={index}
                            column={item.name}
                            options={item.data}
                            selected={[]}
                            onChange={() => { }}
                        />
                    ))}
                </div>
            </div>

            {/* Live Graph Display */}
            <AnimatePresence mode="wait">
                {graphKpiData?.length > 0 ? (
                    <div>
                        <GraphKpi key={showKpi} graphData={graphKpiData} />
                    </div>
                ) : (
                    <div className="flex text-xl justify-center items-center">No Graph Data</div>
                )}
            </AnimatePresence>

            {/* Hidden KPI Graphs for PDF Export */}
            <div style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
            }}>
                {KpiTabs.map((kpi) => (
                    <div
                        key={kpi.value}
                        ref={(el) => {
                            hiddenRefs.current[kpi.value] = el;
                        }}
                        style={{ marginBottom: "20px" }}
                    >
                        {selectedToExport.includes(kpi.value) && (

                            <GraphKpi graphData={kpi.GraphData} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KpiTab;
