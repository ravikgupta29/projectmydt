import { clsx, type ClassValue } from "clsx"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleExportPDF = async ({
    selectedToExport,
    hiddenRefs,
    kpiTabs
}: {
    selectedToExport: string[],
    hiddenRefs: { [key: string]: HTMLDivElement | null },
    kpiTabs: any[]
}) => {
    if (selectedToExport.length === 0) {
        alert("Please select at least one KPI to export.");
        return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const exportDate = new Date().toLocaleDateString();

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

    for (let i = 0; i < selectedToExport.length; i++) {
        const kpiKey = selectedToExport[i];
        const ref = hiddenRefs[kpiKey];
        if (!ref) continue;

        const canvas = await html2canvas(ref, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();

        pdf.addImage(logoDataUrl, "PNG", 10, 10, displayWidth, displayHeight);
        pdf.setFontSize(10);
        pdf.text(`${exportDate}`, 160, 15);

        const kpiLabel = kpiTabs.find((k) => k.value === kpiKey)?.label || kpiKey;
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        const textWidth = pdf.getTextWidth(kpiLabel);
        const x = (pdf.internal.pageSize.getWidth() - textWidth) / 2;
        pdf.text(kpiLabel, x, 30);

        pdf.addImage(imgData, "PNG", 0, 40, imgWidth, imgHeight);
    }

    pdf.save("kpi-report.pdf");
};
