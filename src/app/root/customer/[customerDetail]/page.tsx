"use client";
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import * as topojson from "topojson-client";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const geoUrl = "/world-countries.json";

const markers = [
    { markerOffset: -15, name: "US", coordinates: [-105, 25], current: 73, forecast: 300 },
    { markerOffset: -15, name: "Germany", coordinates: [-10, 45], current: 59, forecast: 170 },
    { markerOffset: -15, name: "UK", coordinates: [35, 48], current: 376, forecast: 650 },
    { markerOffset: -15, name: "ILB", coordinates: [78, 20], current: 194, forecast: 400 },
    { markerOffset: -15, name: "India", coordinates: [70, 10], current: 128, forecast: 100 },
];

const tableData = [
    { "Row_Lables": "ADC", "Mechanical": "17", "Digital": "-", "Embedded": "-", "TD_After_Market_Services": "177" },
    { "Row_Lables": "Atexis", "Mechanical": "-", "Digital": "-", "Embedded": "-", "TD_After_Market_Services": "340" },
    { "Row_Lables": "ATF1", "Mechanical": "18", "Digital": "49", "Embedded": "-", "TD_After_Market_Services": "-" },
    { "Row_Lables": "ATF2", "Mechanical": "60", "Digital": "12", "Embedded": "6", "TD_After_Market_Services": "-" },
    { "Row_Lables": "GMBH", "Mechanical": "40", "Digital": "-", "Embedded": "19", "TD_After_Market_Services": "-" },
    { "Row_Lables": "India", "Mechanical": "59", "Digital": "-", "Embedded": "69", "TD_After_Market_Services": "-" },
    { "Row_Lables": "INT1", "Mechanical": "17", "Digital": "34", "Embedded": "3", "TD_After_Market_Services": "-" },
    { "Row_Lables": "INT 2", "Mechanical": "43", "Digital": "-", "Embedded": "30", "TD_After_Market_Services": "-" },
    { "Row_Lables": "UK", "Mechanical": "272", "Digital": "-", "Embedded": "104", "TD_After_Market_Services": "-" },
];

const tableHeader = Object.keys(tableData[0]);

export default function CustomerDetail() {
    const [geographies, setGeographies] = useState<any[]>([]);

    useEffect(() => {
        fetch(geoUrl)
            .then((res) => res.json())
            .then((data) => {
                {/*@ts-ignore */ }
                const geoData = topojson.feature(data, data.objects.world).features;
                setGeographies(geoData);
            })
            .catch((error) => {
                console.error("Error loading map data:", error);
            });
    }, []);

    const exportToPDF = async () => {
        const input = document.getElementById("customer-detail-content"); // The ID for the section to export
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/ALTEN_logo.svg/1200px-ALTEN_logo.svg.png";
        
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = reject;
        });
    
        const logoRatio = logoImg.width / logoImg.height;
        const displayWidth = 10; // mm
        const displayHeight = displayWidth / logoRatio;
    
        const resizedCanvas = document.createElement("canvas");
        resizedCanvas.width = logoImg.width;
        resizedCanvas.height = logoImg.height;
        const ctx = resizedCanvas.getContext("2d")!;
        ctx.drawImage(logoImg, 0, 0);
        const logoDataUrl = resizedCanvas.toDataURL("image/png");
    
        if (input) {
            html2canvas(input).then((canvas) => {
                const pdf = new jsPDF();
                const gap = 10; // Gap between logo and content
    
                // First page (Map section)
                const imgData = canvas.toDataURL("image/png");
                pdf.addImage(logoDataUrl, "PNG", 10, 10, displayWidth, displayHeight); // Add logo
                pdf.addImage(imgData, "PNG", 10, 10 + displayHeight + gap, 180, 160); // Map content starts below the logo
    
                pdf.addPage();
    
                const tableCanvas = document.getElementById("customer-detail-table");
                if (tableCanvas) {
                    html2canvas(tableCanvas).then((tableCanvas) => {
                        const tableDataUrl = tableCanvas.toDataURL("image/png");
                        pdf.addImage(logoDataUrl, "PNG", 10, 10, displayWidth, displayHeight); // Add logo on the table page
                        pdf.addImage(tableDataUrl, "PNG", 10, 10 + displayHeight + gap, 180, 160); // Table content starts below the logo
                        pdf.save("customer-details.pdf");
                    });
                } else {
                    pdf.save("customer-details.pdf");
                }
            });
        }
    };
    

    return (
        <div className="flex flex-col bg-gray-50">

            <div className="flex justify-end items-start m-4">
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xl"
                    onClick={exportToPDF}
                >
                    Export as PDF
                </Button>
            </div>

            <div className="flex flex-row p-4 gap-4">
                {/* Customer Detail Table */}
                <div className="flex flex-col bg-white rounded-lg shadow-xl overflow-hidden" id="customer-detail-table">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">Customer Details</h2>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    {tableHeader.map((header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xl"
                                        >
                                            {header.replaceAll("_", " ")}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tableData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {Object.values(row).map((value, i) => (
                                            <td
                                                key={i}
                                                className="px-4 py-3 text-xl text-gray-700 whitespace-nowrap"
                                            >
                                                {value}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Map Section */}
                <div className="w-3/4 relative bg-white rounded-lg shadow-xl overflow-hidden" id="customer-detail-content">
                    <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded-lg shadow-md flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                            <span className="text-l">Current</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-600 rounded-sm"></div>
                            <span className="text-l">Forecast</span>
                        </div>
                    </div>

                    <div className="w-full h-full overflow-auto">
                        <ComposableMap
                            projectionConfig={{ scale: 150 }}
                            width={800}
                            height={450}
                            style={{ minWidth: '800px', minHeight: '450px', backgroundColor: '#F8FAFC' }}
                        >

                            <Geographies geography={geographies}>
                                {/*@ts-ignore */}
                                {({ geographies }) =>
                                    geographies.map((geo: any) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            style={{
                                                default: { fill: "#42A5F5", stroke: "#42A5F5", strokeWidth: 0.5 },
                                                hover: { fill: "#94A3B8" },
                                                pressed: { fill: "#475569" },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>

                            {markers.map(({ name, coordinates, current, forecast }) => (
                                <Marker key={name} coordinates={coordinates}>
                                    <g
                                        transform="translate(-24 -44)"
                                        className="cursor-pointer"
                                    >
                                        <rect x="8" y="0" width="40" height="16" fill="#2563EB" rx="0" />
                                        <text
                                            x="25"
                                            y="12"
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="8"
                                            fontWeight="500"
                                        >
                                            {current}
                                        </text>
                                        <rect
                                            x="48"
                                            y="0"
                                            width="40"
                                            height="16"
                                            fill="#CA8A04"
                                            rx="0"
                                        />
                                        <text
                                            x="68"
                                            y="12"
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="8"
                                            fontWeight="500"
                                        >
                                            {forecast}
                                        </text>
                                        <text
                                            x="48"
                                            y="26"
                                            textAnchor="middle"
                                            fill="black"
                                            fontSize="12"
                                            fontWeight="500"
                                        >
                                            {name}
                                        </text>
                                    </g>
                                </Marker>
                            ))}
                        </ComposableMap>
                    </div>
                </div>
            </div>
        </div>
    );
}
