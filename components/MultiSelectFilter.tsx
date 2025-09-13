"use client";
import { useState } from "react";
import { MultiSelectFilterProps } from "../type/type";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { ChevronDown, Search, X } from "lucide-react";

const MultiSelectFilter = ({
    column,
    options,
    selected,
    onChange,
    isShownSearchList = true,
    showHeaderWithoutSearchAndDropDown = true
}: MultiSelectFilterProps) => {
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState<string[]>([""]);

    // Function to toggle selection of individual items
    const toggleSelection = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value];

        onChange(column, newSelected);
    };

    // Function to select all options
    const toggleSelectAll = () => {
        if (selected.length === options.length) {
            // Deselect all
            onChange(column, []);
        } else {
            // Select all
            onChange(column, options.filter((opt) => typeof opt === "string"));
        }
    };
    // Handle input change
    const handleSearch = (value: string) => {
        setSearchQuery([value]); // Update the single-item array
        const searchValue: string[] = [value]
        onChange(column, searchValue)
    };


    // Function to filter options based on search
    const filteredOptions = options.filter((opt) => {
        return typeof opt === 'string' && opt.toLowerCase().includes(search.toLowerCase());
    });


    return (
        <Popover>
           {
    !showHeaderWithoutSearchAndDropDown ? (
        <span className="truncate text-xl">{column}</span>
    ) : (
        <PopoverTrigger 
            className={`flex items-center justify-between px-2 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition bg-white text-xl
                ${!showHeaderWithoutSearchAndDropDown ? "pointer-events-none opacity-50" : ""}`}
            disabled={!showHeaderWithoutSearchAndDropDown} // Ensures it's disabled
        >
            {
                isShownSearchList ? (
                    <div className="flex flex-row items-center justify-between p-2 ml-1 mr-1 border-cyan-600 border" style={{ border: "1px solid #D3D3D3"
                    }}>
                        <span className="truncate">{column}</span>
                        <ChevronDown size={18} className="ml-2 text-gray-500" />
                    </div>
                ) : (
                    <div>
                        {/* Input field */}
                        <input
                            type="text"
                            placeholder={column}
                            value={searchQuery[0]}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-2 py-1 border-none focus:outline-none"
                        />
                    </div>
                )
            }
        </PopoverTrigger>
    )
}

            {isShownSearchList && (
                <PopoverContent className="p-2 border bg-white shadow-md rounded-md w-64">

                    <div>
                        {/* Search Input */}
                        <div className="flex items-center border shadow-md rounded-md mb-2">
                            <Search size={24} className="text-gray-400 ml-4" />
                            {/* Input field */}
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border-none focus:outline-none"
                            />
                            {/* Clear icon (X) */}
                            {search && (
                                <X
                                    size={24}
                                    className="text-gray-400 cursor-pointer mr-10"
                                    onClick={() => setSearch("")}
                                />
                            )}
                        </div>

                        {/* Select All Checkbox */}
                        <div className="px-4 py-2">
                            <label className="flex items-center gap-x-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selected.length === options.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-blue-500 border-gray-300 mr-4 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-700 text-md">Select All</span>
                            </label>
                        </div>

                        {/* Options List */}
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {filteredOptions.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center gap-x-4 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 focus:bg-gray-200 transition-all duration-200"
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(opt)}
                                        onChange={() => toggleSelection(opt)}
                                        className="w-4 h-4 text-blue-500 border-gray-300 mr-4 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                    {/* Option Text */}
                                    <span className="text-gray-700 text-md ml-4">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </PopoverContent>
            )}
        </Popover>
    );
};

export default MultiSelectFilter;
