"use client"
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import ChartCard from "./ChartCard";
import { GraphKpiOneProps } from "../../../../../type/type";
import { motion } from "framer-motion";

const GraphKpi = ({ graphData }: GraphKpiOneProps) => {
    if (!graphData || graphData.length === 0) {
        return <div className="flex text-xl justify-center items-center">No Graph Data</div>;
    }

    const length = graphData.length;

    // Compute container grid classes dynamically
    // For 1 or 2, use single-column grid, for 3 use two columns, else two columns grid with gap.
    const containerGridClass = (() => {
        if (length === 1) return "grid grid-cols-1 gap-6";
        if (length === 2) return "grid grid-cols-1 gap-6";
        if (length === 3) return "grid grid-cols-2 gap-6";
        if ([4,6,8].includes(length)) return "grid grid-cols-2 gap-6";
        // Default fallback
        return "grid grid-cols-2 gap-6";
    })();

    return (
        <motion.div
            key={JSON.stringify(graphData)} // Force re-render on data change
            initial={{ opacity: 0, scale: 0.9 }} // Start animation
            animate={{ opacity: 1, scale: 1 }} // End animation
            exit={{ opacity: 0, scale: 0.9 }} // On unmount
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

const renderChart = (item: any, index: number, totalItems: number) => {
    const commonPlugins = [ChartDataLabels];
      // Conditionally add datalabel plugin
  if (item.showlabel) {
    commonPlugins.push(ChartDataLabels);

    // Ensure plugins object exists
    item.options.plugins = item.options.plugins || {};

    // Inject conditional display logic for non-zero values
    item.options.plugins.datalabels = {
      ...(item.options.plugins.datalabels || {}),
      display: function (context: any) {
        const value = context.dataset.data[context.dataIndex];
        const type = context.dataset.type || context.chart.config.type;
        return type === 'bar' && value !== 0;;
      },
      color: "white",
      font: { size: 20 },
    };
  }

   // Ensure scales object exists
   item.options.scales = item.options.scales || {};
   item.options.scales.y = item.options.scales.y || {};
 
   // Compute the max value from bar datasets
   const allBarValues = item.data.datasets
   .filter((ds: any) => !ds.type || ds.type === 'bar')
   .flatMap((ds: any) => ds.data);
   const maxBarValue = Math.max(...allBarValues);
   const paddedMax = Math.ceil(maxBarValue) + 1;
 
   // Apply suggested max to Y axis
   item.options.scales.y.suggestedMax = paddedMax;

    // Determine grid item style depending on total items and index
    // For 1 item - full width always (default grid-cols-1)
    // For 2 items - each full width stacked (grid-cols-1)
    // For 3 items:
    //    index 0 & 1: half width (span 1)
    //    index 2: full width (span 2)
    // For 4,6,8 items - all half width (span 1)

    // Tailwind grid column spans for xl screens
    let itemSpanClass = "";

    if (totalItems === 1) {
        itemSpanClass = "col-span-1"; // full width in grid-cols-1
    } else if (totalItems === 2) {
        itemSpanClass = "col-span-1"; // full width in grid-cols-1, stacked vertically
    } else if (totalItems === 3) {
        if (index < 2) {
            itemSpanClass = "col-span-1"; // first two items side-by-side
        } else {
            itemSpanClass = "col-span-2"; // third item full width below
        }
    } else if ([4,6,8].includes(totalItems)) {
        itemSpanClass = "col-span-1"; // all equal half width in 2-col grid
    } else {
        // default fallback
        itemSpanClass = "col-span-1";
    }

    return (
        <div key={index} className={itemSpanClass}>
            {item.type === "bar" ? (
                <ChartCard title={item.name as string}>
                    <Bar data={item.data} options={item.options} plugins={item.showlabel && commonPlugins} />
                </ChartCard>
            ) : (
                <ChartCard title={item.name as string}>
                    <Line data={item.data} options={item.options} plugins={item.showlabel && commonPlugins} />
                </ChartCard>
            )}
        </div>
    );
};

export default GraphKpi;
