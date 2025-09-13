"use client";
import {
    Bar,
    Line,
    Radar,
    Pie,
    Doughnut,
    PolarArea,
} from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartCard from "./ChartCard";
import { GraphKpiOneProps } from "../../../../../type/type";
import { motion } from "framer-motion";

const GraphKpi = ({ graphData }: GraphKpiOneProps) => {
    if (!graphData || graphData.length === 0) {
        return (
            <div className="flex text-xl justify-center items-center">
                No Graph Data
            </div>
        );
    }

    const length = graphData.length;

    const containerGridClass = (() => {
        if (length === 1) return "grid grid-cols-1 gap-6";
        if (length === 2) return "grid grid-cols-1 gap-6";
        if (length === 3) return "grid grid-cols-2 gap-6";
        if ([4, 6, 8].includes(length)) return "grid grid-cols-2 gap-6";
        return "grid grid-cols-2 gap-6";
    })();

    return (
        <motion.div
            key={JSON.stringify(graphData)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className={containerGridClass}>
                {graphData
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => renderChart(item, index, length))}
            </div>
        </motion.div>
    );
};

// Mapping chart types to components
const chartTypeMap: Record<string, any> = {
    bar: Bar,
    line: Line,
    radar: Radar,
    pie: Pie,
    doughnut: Doughnut,
    polarArea: PolarArea,
};

const renderChart = (item: any, index: number, totalItems: number) => {
    const noAxisTypes = ["doughnut", "pie", "polarArea"];
    const ChartComponent = chartTypeMap[item.type] || Bar;
    const chartType = item.type;
    // Plugin handling
    const commonPlugins = [];
    const datalabelSupportedTypes = [
        "bar",
        "line",
        "radar",
        "pie",
        "doughnut",
        "polarArea",
    ];

    const useDatalabels = item.showlabel && datalabelSupportedTypes.includes(item.type);

    if (useDatalabels) {
        commonPlugins.push(ChartDataLabels);
        item.options.plugins = item.options.plugins || {};
        item.options.plugins.datalabels = {
            ...(item.options.plugins.datalabels || {}),
            display: function (context: any) {
                const value = context.dataset.data[context.dataIndex];
                return value !== 0;
            },
            color: "white",
            font: { size: 20 },
        };
    }

    // // Inject conditional display logic for non-zero values
    item.options.plugins.datalabels = {
        ...(item.options.plugins.datalabels || {}),
        display: function (context: any) {
            const value = context.dataset.data[context.dataIndex];
            const type = context.dataset.type || context.chart.config.type;
            return (type === "bar" || noAxisTypes.includes(type)) && value !== 0;
        },
        color: "white",
        font: { size: 20 },
    };


    // Add suggestedMax for bar and line only
    if (["bar", "line"].includes(item.type)) {
        item.options.scales = item.options.scales || {};
        item.options.scales.y = item.options.scales.y || {};

        const allValues = item.data.datasets
            .filter((ds: any) => !ds.type || ds.type === item.type)
            .flatMap((ds: any) => ds.data);
        const maxVal = Math.max(...allValues);
        item.options.scales.y.suggestedMax = Math.ceil(maxVal) + 1;
    }

    // Remove scales if chart type doesn't use them
    if (noAxisTypes.includes(item.type)) {
        delete item.options.scales;
    } else {
        item.options.scales = item.options.scales || {};
        item.options.scales.y = item.options.scales.y || {};

        const allBarValues = item.data.datasets
            .filter((ds: any) => !ds.type || ds.type === "bar")
            .flatMap((ds: any) => ds.data);

        const maxBarValue = Math.max(...allBarValues);
        const paddedMax = Math.ceil(maxBarValue) + 1;
        item.options.scales.y.suggestedMax = paddedMax;
    }

    // Tailwind responsive grid spans
    let itemSpanClass = "col-span-1";

    if (totalItems === 3 && index === 2) {
        itemSpanClass = "col-span-2";
    }
    // Apply fixed aspect ratio container for doughnut-style charts
    const isDoughnutLike = noAxisTypes.includes(chartType);

    return (
        <div key={index} className={itemSpanClass}>
            <ChartCard title={item.name as string}>
                {isDoughnutLike ? (
                    <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mx-auto aspect-square">
                        <ChartComponent
                            data={item.data}
                            options={item.options}
                            plugins={useDatalabels ? commonPlugins : []}
                        />
                    </div>
                ) : (
                    <ChartComponent
                        data={item.data}
                        options={item.options}
                        plugins={useDatalabels ? commonPlugins : []}
                    />
                )}
            </ChartCard>
        </div>
    );
};

export default GraphKpi;
