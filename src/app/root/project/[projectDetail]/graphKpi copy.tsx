"use client"
import { SKILLS_MATRIX } from "../../../../../constant/string";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Pie, Line, Radar } from "react-chartjs-2";
import "chart.js/auto";
import ChartCard from "./ChartCard";
import { GraphKpiOneProps } from "../../../../../type/type";
import { motion } from "framer-motion";



const GraphKpi = ({ graphData }: GraphKpiOneProps) => {
    if(!graphData) {
        return  <div className="flex text-xl justify-center items-center">No Graph Data</div>
    }
    return (
        <motion.div
            key={JSON.stringify(graphData)} // Force re-render on data change
            initial={{ opacity: 0, scale: 0.9 }} // Start animation
            animate={{ opacity: 1, scale: 1 }} // End animation
            exit={{ opacity: 0, scale: 0.9 }} // On unmount
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
                {graphData
                    .sort((a, b) => a.order - b.order) // Sorting charts by position in ascending order
                    .map((item, index) => (
                        renderChart(item, index)
                    ))}
            </div>
        </motion.div>
    );

}


const renderChart = (item: any, index: number) => {
    const commonPlugins = [ChartDataLabels];

    switch (item.type) {
        case "radar":
            return (
                <ChartCard key={index} title={SKILLS_MATRIX}>
                    <div className="relative w-full aspect-square lg:aspect-video">
                        <Radar
                            data={item.data}
                            options={
                                item.options
                            }
                        />
                    </div>
                </ChartCard>
            );

        case "pie":
            return (
                <div key={index} className="card bg-white shadow-lg p-6 col-span-1 md:col-span-2 xl:col-span-3">
                    <h2 className="text-lg font-rubik-semibold mb-4 text-gray-800">{item.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="w-full h-64">
                                <Pie
                                    data={item.data}
                                    options={{
                                        ...item.options,
                                        plugins: {
                                            ...item.options.plugins,
                                            datalabels: {
                                                ...item.options.plugins?.datalabels,
                                                font: { size: 14 }
                                            }
                                        }
                                    }}
                                    plugins={[ChartDataLabels]}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { color: "#00AF50", label: "Excellent / Much more than expected" },
                            { color: "#558230", label: "Good / A little more than expected" },
                            { color: "#0D98C5", label: "Average / As expected" },
                        ].map(({ color, label }) => (
                            <div key={color} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }}></span>
                                <span className="text-sm text-gray-600">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case "bar":
            return (
                <ChartCard key={index} title={item.name as string}>
                    <Bar data={item.data} options={item.options}
                        plugins={item.showlabel && commonPlugins} />
                </ChartCard>
            );

        default:
            return (
                <ChartCard key={index} title={item.name as string}>
                    <Line data={item.data} options={item.options} plugins={item.showlabel && commonPlugins} />
                </ChartCard>
            );
    }
}



export default GraphKpi