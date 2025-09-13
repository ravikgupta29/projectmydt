"use client"
import Image from "next/image"
import { ProjectDetailTopItemProps } from "../../../../../type/type"
import images from "../../../../../constant/images"
import "chart.js/auto";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from "chart.js";
import { useState } from "react";
import KpiTab from "./kpiTab";
import ProjectObjectivePage from "./projecObjectivePage";
import ProjectDocumentPage from "./ProjectDocumentPage";
import WorkflowPage from "./WorkflowPage";
import { useParams } from 'next/navigation';
import graphData from "./../../../../../constant/graphData.json"
import RemarkPage from "./Remark";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import KpiTabV2 from "./KpiTabV2";

interface projectDetailTab {
    tabName: string,
    onTabClick: (id: number) => void,
    tabId: number,
    selectedId: number
}


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const ProjectDetail = () => {
    const params = useParams();
    const ref = params?.projectDetail as string
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [projectData, setProjectData] = useState<any[]>(graphData.data.filter((item) => {
        return item.ref_id === ref
    })[0]?.ProjectData);
    
    const onTabClick = (id: number) => {
        setSelectedTab(id)
    }

    const onClickCutomerCard = () => {
        router.push(`/root/customer/${ref}`)
    }

    const getTabPageBaseOnPageSelection = () => {
        switch (selectedTab) {
            case 0: return <ProjectObjectivePage pageNumber = {ref}  />
            case 1: return <ProjectDocumentPage pageNumber = {ref} />
            case 2: return <KpiTabV2 pageNumber = {ref} />
            case 3: return <WorkflowPage />;
            case 4: return <RemarkPage pageNumber={ref}/>
            default: return <ProjectObjectivePage pageNumber = {ref} />
        }
    }

    return (
        <div className="p-4 lg:p-6 w-full mx-auto">
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {projectData.map((item, index) => (
                    item?.id === 2 ?  <ProjectDetailTopItem key={index} onBottomImageClick={onClickCutomerCard} {...item} /> :
                    <ProjectDetailTopItem key={index} {...item} />
                ))}
            </div>
            {/*tab bar */}
                <div className="flex flex-row gap-1">
                    <ProjectDetailTab tabName="🎯 Project Objective" onTabClick={onTabClick} tabId={0} selectedId={selectedTab} />
                    <ProjectDetailTab tabName="📁 Project Document" onTabClick={onTabClick} tabId={1} selectedId={selectedTab} />
                    <ProjectDetailTab tabName="📊 KPI's" onTabClick={onTabClick} tabId={2} selectedId={selectedTab} />
                    <ProjectDetailTab tabName="⚙️ Workflow" onTabClick={onTabClick} tabId={3} selectedId={selectedTab} />
                    <ProjectDetailTab tabName="📝 Updates" onTabClick={onTabClick} tabId={4} selectedId={selectedTab} />
                </div>

            {/* Tab content below */}
            <div className="mb-6">
                {getTabPageBaseOnPageSelection()}
            </div>


        </div>

    )
}

// Updated ProjectDetailTopItem with better styling
const ProjectDetailTopItem = ({
    title, subTitle, showIconOnSubTitle = false, infoText,
    showBottomImage = false , onBottomImageClick,
    bgVariant, showBottomText = false, className, ...props
}: ProjectDetailTopItemProps) => {
    return (
        <div className={`p-5 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-lg w-full min-h-[160px] relative overflow-hidden ${getBgVariantStyle(bgVariant)} ${className}`} {...props}>
            <div className="flex flex-col h-full justify-between">
                <div>
                    <h3 className="font-medium text-white opacity-90 text-2xl">{title}</h3>
                    <div className="flex items-center gap-x-2 mt-2">
                        {showIconOnSubTitle && (
                            <Image
                                src={images.flag_india}
                                className="w-8 h-8 object-contain"
                                alt="flag"
                                width={32}
                                height={32}
                            />
                        )}
                        <p className="text-3xl font-bold text-white">{subTitle}</p>
                    </div>
                </div>

                {infoText && (
                    <p className="mt-2 text-sm font-medium text-white opacity-90 whitespace-pre-line">
                    </p>
                )}

                {showBottomText && (
                    <div className="mt-4 flex justify-end">
                        <span className="text-xl font-bold text-white opacity-90">{infoText}</span>
                    </div>
                )}
                {
                    showBottomImage && (
                     <div className="mt-4 flex justify-end cursor-pointer"
                     onClick={onBottomImageClick}
                     >
                        <ChevronRight size={40} color="white" />
                    </div> 
                    )
                }
            </div>
        </div>
    )
}

const ProjectDetailTab = ({ tabName, onTabClick, tabId, selectedId }: projectDetailTab) => {
    const isSelected = selectedId === tabId;

    return (
        <div
            className={`
                cursor-pointer px-6 py-3 rounded-t-xl text-2xl font-semibold transition-all duration-300 transform 
                backdrop-blur-sm border 
                ${isSelected
                    ? "bg-emerald-600 text-white scale-95 translate-y-1 shadow-inner border-emerald-700 z-10"
                    : "bg-white/40 text-slate-700 hover:bg-white/70 hover:shadow-lg border-gray-300 -translate-y-1 z-0"}
            `}
            onClick={() => onTabClick(tabId)}
        >
            {tabName}
        </div>
    );
};



// Keep getBgVariantStyle function unchanged
const getBgVariantStyle = (variant: ProjectDetailTopItemProps["bgVariant"]) => {
    switch (variant) {
        case "yellow": return "bg-[#EFB944]"
        case "red": return "bg-[#E44F39]"
        case "orange": return "bg-[#FC9889]"
        case "blue": return "bg-[#A9DDD9]"
        default: return "bg-[#EFB944]"
    }
}

export default ProjectDetail