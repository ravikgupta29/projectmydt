import { UseQueryOptions } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, Method } from 'axios';
import { UseQueryOptions } from '@tanstack/react-query';

import React, { ReactNode } from "react";
interface NavbarProps {
    href: string,
    pathName: string,
    children: React.ReactNode,
    onClick?: () => void
}

interface MultiSelectFilterProps {
    column: string,
    options: string[],
    selected: string[],
    onChange: (column: string, selected: string[]) => void,
    isShownSearchList?: boolean,
    showHeaderWithoutSearchAndDropDown?: boolean

}

interface ProjectDetailTopItemProps {
    title: string,
    subTitle: string,
    showIconOnSubTitle?: boolean,
    infoText: string,
    bgVariant: "yellow" | "red" | "orange" | "blue",
    className?: string,
    showBottomText?: boolean,
    showBottomImage?: boolean,
    onBottomImageClick?: ()=> void
}

interface User {
    empId?: number;
    email: string;
    name: string;
    role: string;
    status: string;
    projectRef: number[];
    manager: string;
    department: string;
    location: string;
    createdDate?: string;
    createdBy?: string;
    modifiedBy?: string;
    modifiedDate?: string;
}

interface UserModalProps {
    onClose: () => void;
    modalType: "edit" | "add"; // Determines if the modal is for editing or adding
    userData: User; // Existing user data for editing
    onSave: (user: User | User[]) => void; // Function to save single/multiple users
}

interface ProjectInfoModalProps {
    onClose: () => void;
    projectData: ProjectData
}

interface ProjectData {
    Customer: string;
    IQP: string;
    Project: string;
    Reference: number;
    Status: string;
    Validator: string;
    BO_PM: string,
    BO_PL2: string,
    BU: string,
    OTD: string,
    Remark: string,
    ref: string,
    Business_Manager: string,
    COC_Manager: string,
    Competency_Head: string,
    Project_Director: string,
    DC_Head: string,
    infoRightKey: string[],
    infoLeftKey: string[],
    excludedFieldsFromTable: string[]
}


interface GraphKpiOneProps {
    graphData: any[];
}


// Error types
interface ApiErrorResponse {
    message: string;
    code?: string;
    statusCode: number;
    timestamp?: string;
}


// Config type
interface ApiClientConfig extends AxiosRequestConfig {
    skipErrorHandling?: boolean;
    retry?: boolean;
    _retry?: boolean;
}

interface UseApiQueryOptions<T> extends UseQueryOptions<T, AxiosError<ApiErrorResponse>> {
    suppressError?: boolean;
    pollingInterval?: number;
    enableBackgroundPolling?: boolean;
}

type Props = {
    pageNumber: string;
};



interface ObjectiveFile {
    Tasks: string;
    Objectives: string;
    Timing: string;
    IQP: string;
    Files: Document[],
    TopProjectTable: ProjectOverallData,
    KPI_Metric: any[],
    FTE_Data: any[]
  }
  
  // Type for each document
  type Document = {
    name: string;
    file_type: string;
    type: string;
    link: string;
    Date: string;
    Responsiable: string
  };
  
  type ProjectOverallData = {
    project: string
    OBM: string
    otp: string
    customer: string
    iqpStatus: string
    t0tEnd: string
    toPlan: string
    marginPlan: string
    dp: string
    cp2: string
    cp1: string
    rc: string
    dd: string
  }