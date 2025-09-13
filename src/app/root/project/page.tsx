"use client";
import MultiSelectFilter from "../../../../components/MultiSelectFilter";
import React, { useState, useEffect, Fragment } from "react";
import * as XLSX from "xlsx";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { ProjectData, ProjectInfoModalProps } from "../../../../type/type";
import { ACTION, ALL_PROJECT_DETAIL, CLEAR_ALL_FILTERS, DC_RESPONSIBLE, EXPORT_TO_EXCEL, GENERAL_PROJECT_INFORMATION, INFO, NO_RECORD_FOUND, OLD_COMMENTS, PROJECT_STAFF_INFORMATION, VALIDATORS, VIEW } from "../../../../constant/string";
import projectData from "./../../../../constant/dataValue.json"
const ProjectScreen: React.FC = () => {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [options, setOptions] = useState<{ [key: string]: string[] }>({});
  const [dummyData, setDummyData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const excludedFielsForDropSearch = ["OTP", "Project name", "Reference", "OTD"]
  const [projectInfoModal, setProjectInfoModal] = useState<boolean>(false)
  const [projectInfoData, setProjectInfoData] = useState<ProjectData>({} as ProjectData)
  useEffect(() => {
    const loadExcelData = async () => {
      const jsonData = projectData.data

      if (jsonData.length > 0) {
        const keys = Object.keys(jsonData[0]).filter(key => !jsonData[0].excludedFieldsFromTable.includes(key));
        setHeaders(keys);
        const extractUniqueValues = (column: string) => {
          const values = jsonData.map((row: any) => row[column]).filter((value) => value !== undefined);
          return [...new Set(values)];
        };

        const filterOptions: { [key: string]: string[] } = {};
        keys.forEach((key) => {
          const uniqueValues = extractUniqueValues(key);
          if (uniqueValues.length > 0) {
            filterOptions[key] = uniqueValues;
          }
        });
        setOptions(filterOptions);
        setFilters(keys.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));
      }



      setDummyData(jsonData);

    };

    loadExcelData();
  }, []);

  const handleFilterChange = (column: string, selected: string[]) => {
    setFilters((prev) => ({ ...prev, [column]: selected }));
  };


  const handleClearFilters = () => {
    setFilters(headers.reduce((acc, key) => ({ ...acc, [key]: [] }), {}));
  };

  const toggleRowExpansion = (rowId: string | number) => {
    setExpandedRowId(expandedRowId === rowId ? null : rowId);
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, "ProjectsData.xlsx");
  };

  const filteredData = dummyData
    .filter((row) =>
      Object.keys(filters).every((key) =>
        filters[key].length
          ? filters[key].some(
            (filterValue) =>
              String(row[key]).toLowerCase().includes(String(filterValue).toLowerCase())  // Allow partial match
          )
          : true
      )
    );

  const totalProjects = filteredData.length;

  const avgGrossMargin = filteredData.length
    ? (
      filteredData.reduce((acc, curr) => acc + parseFloat(curr["Gross_Margin"] || 0), 0) /
      filteredData.length
    ).toFixed(2)
    : 0;

  const avgSkillCompliance = filteredData.length
    ? (
      filteredData.reduce((acc, curr) => acc + parseFloat(curr["Skill_Compliance"] || 0), 0) /
      filteredData.length
    ).toFixed(2)
    : 0;



  const onProjectInfoClick = (projectData: ProjectData) => {
    setProjectInfoModal(true)
    setProjectInfoData(projectData)
  }

  const onCloseModal = () => {
    setProjectInfoModal(false)
    setProjectInfoData({} as ProjectData)

  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const excludedFieldsForNotShowDropAndSearch = ["OTD","RFT","CSAT","ACQP"]

  return (
    <Fragment>
      <div className=" bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-rubik-semibold text-center text-gray-800 mb-10">
            Project Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {/* Total Projects */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-full max-w-xs text-center transition duration-300 hover:shadow-lg">
              <h3 className="text-gray-500 uppercase tracking-wide text-xl">Total Projects</h3>
              <p className="text-3xl font-semibold text-blue-600 mt-2">{totalProjects}</p>
            </div>

            {/* Avg Gross Margin */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-full max-w-xs text-center transition duration-300 hover:shadow-lg">
              <h3 className="text-gray-500 text-xl uppercase tracking-wide">Avg. Gross Margin</h3>
              <p className="text-3xl font-semibold text-green-600 mt-2">{avgGrossMargin} %</p>
            </div>

            {/* Avg Skill Compliance */}
            <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] w-full max-w-xs text-center transition duration-300 hover:shadow-lg">
              <h3 className="text-gray-500 text-xl uppercase tracking-wide">Avg. Skill Compliance</h3>
              <p className="text-3xl font-semibold text-purple-600 mt-2">{avgSkillCompliance} %</p>
            </div>
          </div>
        </div>
      </div>



      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages).keys()].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum + 1)}
                className={`px-4 py-2 rounded-md ${currentPage === pageNum + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-x-5">
            <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-500 text-white rounded-md">
              {CLEAR_ALL_FILTERS}
            </button>
            <button onClick={handleExportToExcel} className="px-4 py-2 bg-green-800 text-white rounded-md">
              {EXPORT_TO_EXCEL}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-10">
          <table className="w-full border min-w-max">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border hidden"></th>

                {headers.map((header) => (
                  <th key={header} className="p-2 border">

                    {options[header] && (
                      <MultiSelectFilter
                        column={header}
                        options={options[header]}
                        selected={filters[header]}
                        onChange={handleFilterChange}
                        isShownSearchList={
                          excludedFielsForDropSearch.includes(header) ? false : true
                        }
                        showHeaderWithoutSearchAndDropDown={
                          excludedFieldsForNotShowDropAndSearch.includes(header) ? false : true

                        }
                      />
                    )}
                  </th>
                ))}
                <th className="p-2 border text-xl">
                  {ACTION}
                </th>
              </tr>
            </thead>
            <tbody>


              {

                currentData.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length + 1} className="p-4 text-center text-black-300 font-rubik-medium text-xl">
                      {NO_RECORD_FOUND}
                    </td>
                  </tr>
                ) : (
                  currentData.map((row, index) => (
                    <React.Fragment key={index}>
                      <tr className="border">
                        <td className="px-6 py-4 items-center space-x-2 hidden" onClick={() => toggleRowExpansion(index)}>
                          {expandedRowId === index ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                        </td>
                        {headers.map((header) => (
                          <td key={header} className="p-2 border px-6 py-6 text-xl">
                            {(header === "OTD" || header === "RFT" || header === "CSAT" || header === 'Gross_Margin') ? (
                              <div className="flex flex-col space-y-1 text-xl">
                                {(Array.isArray(row[header]) ? row[header] : [row[header]])?.map((entry: string, idx: number) => {
                                  if (!entry || typeof entry !== "string") return null;

                                  const match = entry.match(/([-+]\d+)/);
                                  const change = match ? parseInt(match[1], 10) : null;
                                  const direction = change !== null
                                    ? change > 0
                                      ? "Up"
                                      : change < 0
                                        ? "Down"
                                        : null
                                    : null;

                                  return (
                                    <div key={idx} className="flex items-center space-x-1">
                                      <span>{entry}</span>
                                      {direction === "Up" && <ChevronUp className="text-green-500 w-10 h-10 text-xl" />}
                                      {direction === "Down" && <ChevronDown className="text-red-500 w-10 h-10 text-xl" />}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              row[header]
                            )}
                          </td>

                        ))}
                        <td className="p-2"
                        >
                          <div className="flex lex-row gap-x-3 px-6 py-2" >
                            <Link href={`/root/project/${row["ref"]}`}
                              className="hover:text-primary-300 text-xl">{VIEW}</Link>
                            <span className="text-md hover:text-primary-300 text-xl"
                              onClick={() => { onProjectInfoClick(row) }}
                            >{INFO}</span>
                          </div></td>
                      </tr>
                      {expandedRowId === index && (
                        <tr className="bg-gray-100">
                          <td colSpan={headers.length + 2}>
                            <div className="p-6 bg-white rounded-lg shadow-md mt-4 mb-4 ml-1 mr-1 hidden">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <p className="text-lg font-semibold text-black">{VALIDATORS}</p>
                                  <span className="text-xl text-gray-600">{row.Validator || "N/A"}</span>
                                </div>
                                <div className="space-y-3">
                                  <p className="text-lg font-semibold text-black">{DC_RESPONSIBLE}</p>
                                  <span className="text-xl text-gray-600">{row["DC Responsible"] || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )
              }

            </tbody>
          </table>
        </div>

        {
          projectInfoModal && (
            <ProjectInfoModal onClose={onCloseModal} projectData={projectInfoData} />
          )
        }
      </div>
    </Fragment>

  );
};


const ProjectInfoModal = ({ onClose, projectData }: ProjectInfoModalProps) => {

  const staffFields = projectData.infoRightKey as (keyof ProjectData)[]
  const generalProjectInfo =  projectData.infoLeftKey as (keyof ProjectData)[]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-2xl max-h-[90vh] overflow-y-auto m-3">
        <div className="flex flex-row justify-between items-start">

          <h1 className="text-2xl text-black font-rubik-bold">{ALL_PROJECT_DETAIL}</h1>

          <X className="w-10 h-10"
            onClick={onClose}
          />
        </div>
        <div className="flex flex-row items-start justify-around w-full mt-5">

          {/* Left Section */}
          <div className="flex flex-col gap-y-3">
            <div className="flex-row flex items-center gap-x-1">
              <div className="bg-[#ECCD00] w-10 h-1" />
              <span className="text-md font-rubik-medium text-gray-500 text-xl">{GENERAL_PROJECT_INFORMATION}</span>

            </div>



            {
              generalProjectInfo.map((key)=> {
                return(
                  <ProjectInfoModalItem
                  key={key}
                  itemData={projectData[key] as string}
                  label={key}
                  showDownArrow={false}
                />
                )
              })
            }
    

            <span className="block text-xl font-bold text-gray-700">{OLD_COMMENTS}</span>
            <textarea
              className="w-full p-2 border rounded bg-white text-gray-500 font-rubik text-xl"
              name="description"
              rows={4}
              placeholder=""
              value={projectData.Remark}
              disabled
            />
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-y-3">
            <div className="flex-row flex items-center gap-x-1">
              <div className="bg-[#ECCD00] w-10 h-1" />
              <span className="text-xl font-rubik-medium text-gray-500">{PROJECT_STAFF_INFORMATION}</span>

            </div>

            {
              staffFields.map((key) => {
                return (
                  <ProjectStaffInfoItem
                    key={key}
                    label={key}
                    item={projectData[key] as string}
                    editable={false}
                  />
                )
              })
            }

          </div>


        </div>


      </div>

    </div>
  )

}

const ProjectInfoModalItem = (
  {
    label,
    itemData,
    isDisable = true,
    showDownArrow = true,

  }: {
    label: string,
    itemData: string,
    isDisable?: boolean,
    showDownArrow?: boolean


  }
) => {

  return (
    <div className="flex flex-col">
      <label className="block font-bold text-gray-700 text-xl">{label}</label>
      <select
        name={label}
        className={`w-full p-2 border rounded bg-gray-100 text-gray-900 text-xl ${!showDownArrow ? "appearance-none" : "appearance-auto"} `}
        value={itemData}
        onChange={() => { }}
        disabled={isDisable}
      >
        <option className="text-gray-50 font-light text-start text-xl" value={itemData}>
          {itemData}
        </option>
      </select>
    </div>

  )
}


type Props = {
  label: string;
  item: string;
  editable: boolean;
};

const ProjectStaffInfoItem = ({ label, item, editable }: Props) => {
  const managers = ["Ranjana HEGDE", "Sachin SAJEEV", "Pradeep GAJAKOSH", "SENTHILKUMAR KANAGARAJ"];
  const [input, setInput] = useState(item);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInput(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = managers.filter(name =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setInput(name);
    setShowSuggestions(false);
  };

  return (
    <div className="mt-2">
      <span className="block font-bold text-gray-700 text-xl">{label}</span>
      <div className="border rounded bg-white px-2 py-2">
        <div className="relative max-w-sm mx-auto">
          {editable ? (
            <>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
                value={input}
                onChange={handleChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => input && setShowSuggestions(true)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md">
                  {suggestions.map((name, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-xl"
                      onClick={() => handleSuggestionClick(name)}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="px-4 py-2 text-gray-800 text-xl">{input}</div>
          )}
        </div>
      </div>
    </div>
  );
};


export default ProjectScreen;