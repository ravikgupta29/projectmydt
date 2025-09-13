import { GraphKpiOneProps, ProjectDetailTopItemProps } from "../type/type";
import { ATTRITION_RATE, BUSINESS_UNIT, CUSTOMERS, CUSTOMER_SATISFACTION, DC_ENTITIES, EFFICIENCY, FACTORIES, FORECASTED_LEVEL_ON_ENGINEERS, KPI_ONE, KPI_TWO, ORDER_TO_BILLING, OTD, PROJECT_SALARY_EVOLUTION, REALISED_LEVEL_ON_ENGINEERS, RFT, SEMESTER_TO_DATE_VIEW, SKILLS_MATRIX, WORKLOAD } from "./string";
// Hardcoded data for proficiency levels and employee
const skillCategories = [
  "Product Design Support",
  "Product Development Support",
  "Manufacturing Engineering",
  "Product Performance & Life Utilisation",
  "After Marketing",
  "Analysis Tool",
  "CAD Tool",
];

export const proficiencyLevels = [
  "Information level", // Level 1
  "Accompanied Level", // Level 2
  "Autonomy Level", // Level 3
  "Referent Level - Training Capability", // Level 4
];

function generateEmployees(num: number) {
  const employees = [];

  for (let i = 1; i <= num; i++) {
    const skills: Record<string, number> = {}; // Explicitly define object type
    const numSkills = Math.floor(Math.random() * skillCategories.length) + 1;
    const selectedSkills = new Set<string>(); // 🔹 Explicitly define as Set<string>

    while (selectedSkills.size < numSkills) {
      const randomSkill = skillCategories[Math.floor(Math.random() * skillCategories.length)];
      selectedSkills.add(randomSkill);
    }

    selectedSkills.forEach((skill: string) => { // 🔹 Explicitly type skill
      const proficiencyLevel = Math.floor(Math.random() * proficiencyLevels.length);
      skills[skill] = proficiencyLevel + 1;
    });

    employees.push({ name: `Emp ${i}`, skills });
  }

  return employees;
}

export const employees = generateEmployees(5);

export const getChartData = (selectedEmployee?: string) => {
  const proficiencyCounts = proficiencyLevels.map((level, index) => {
    return skillCategories.map((category) => {
      if (selectedEmployee) {
        // For a specific employee, return their proficiency level for the selected skills
        const employee = employees.find((emp) => emp.name === selectedEmployee);
        const proficiency = employee?.skills[category as keyof typeof employee.skills];
        // Ensure it's either 1, 2, 3, or 4 for individual employees, return 0 if not available
        return proficiency === index + 1 ? index + 1 : 0;
      } else {
        // Calculate the count of employees for each proficiency level
        const count = employees.filter(
          (emp) => emp.skills[category as keyof typeof emp.skills] === index + 1
        ).length;
        return count > 0 ? count : 0; // Return the count for "All Employees"
      }
    });
  });

  // Remove any categories that are not present in the selected employee's skills
  const filteredSkillCategories = selectedEmployee
    ? skillCategories.filter((category) =>
      employees.some((emp) => emp.skills.hasOwnProperty(category))
    )
    : skillCategories;

  const datasets = proficiencyLevels.map((level, index) => ({
    label: level,
    data: proficiencyCounts[index].filter((count, idx) => filteredSkillCategories[idx]),
    backgroundColor:
      index === 0
        ? "rgba(255, 99, 132, 0.2)"
        : index === 1
          ? "rgba(54, 162, 235, 0.2)"
          : index === 2
            ? "rgba(255, 206, 86, 0.2)"
            : "rgba(75, 192, 192, 0.2)",
    borderColor:
      index === 0
        ? "rgba(255, 99, 132, 1)"
        : index === 1
          ? "rgba(54, 162, 235, 1)"
          : index === 2
            ? "rgba(255, 206, 86, 1)"
            : "rgba(75, 192, 192, 1)",
    borderWidth: 1,
    pointBackgroundColor:
      index === 0
        ? "rgba(255, 99, 132, 1)"
        : index === 1
          ? "rgba(54, 162, 235, 1)"
          : index === 2
            ? "rgba(255, 206, 86, 1)"
            : "rgba(75, 192, 192, 1)",
    pointBorderColor: "#fff",
    pointRadius: 6,
    pointHoverRadius: 10,
    pointHoverBackgroundColor: "#fff",
    pointHoverBorderColor:
      index === 0
        ? "rgba(255, 99, 132, 1)"
        : index === 1
          ? "rgba(54, 162, 235, 1)"
          : index === 2
            ? "rgba(255, 206, 86, 1)"
            : "rgba(75, 192, 192, 1)",
    pointHitRadius: 10,
    pointBorderWidth: 3,
    pointStyle: "circle",
    hoverRadius: selectedEmployee ? 0 : 10, // Disable hover if selectedEmployee is not null
    hoverBackgroundColor: selectedEmployee ? "" : "#fff", // Optional, clear hover background
    hoverBorderColor: selectedEmployee ? "" : "rgba(255, 99, 132, 1)", // Optional, clear hover border color
  }));

  return {
    labels: filteredSkillCategories, // Filtered skill categories
    datasets: datasets,
  };
};

export const filterOptionGraphData = [
  {
    data:["2025", "2024","2023","2022"],
    name:"Year"
  },
  {
    data:["Q1","Q2","Q3","Q4"],
    name: "Quater"
  }

]

// Dummy data for the filters
export const businessUnits = ["Unit A", "Unit B", "Unit C", "Unit D"];
export const customers = ["Customer 1", "Customer 2", "Customer 3", "Customer 4"];
export const dcEntities = ["Entity 1", "Entity 2", "Entity 3", "Entity 4"];
export const factories = ["Factory 1", "Factory 2", "Factory 3", "Factory 4"];


export const topLayout: ProjectDetailTopItemProps[] = [
  {
    title: "📁 Project: ",
    subTitle: "Pool & DH Customer Services",
    infoText: "OTP:- BU: \n POOL, BENCH",
    bgVariant: "yellow",
    showIconOnSubTitle: false,
    showBottomText: false,
  },
  {
    title: "🧑🏻‍💼 Customer:",
    subTitle: "ODC India",
    infoText: "",
    bgVariant: "red",
    showIconOnSubTitle: false,
    showBottomText: false,
  },
  {
    title: "DC Entity:",
    subTitle: "- Alten IN",
    infoText: "",
    bgVariant: "orange",
    showIconOnSubTitle: true,
    showBottomText: false,
  },
  {
    title: "People staffed/ordered today",
    subTitle: "1/7",
    infoText: "",
    bgVariant: "blue",
    showIconOnSubTitle: false,
    showBottomText: true,
  },
]


// KPI 1 data 
export const KPI_ONE_DATA = [
  {
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "OTD",
          data: [246, 578, 418, 1071, 1449, 1489, 1706],
          backgroundColor: "#179E27",
          
        },
        
      ],
    } as any,
    options: {
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          font: {
            size: 16,
          },
          anchor: "center" as const,  // Center the label within the bar
          align: "center" as const,   // Align the label in the center of the bar
          formatter: (value: number) => value,
        },
      },
    } as any,
    scales: {
      x: {
        ticks: {
          font: {
            size: 20,       
            weight: "500",
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 20,      
            weight: "500",
          },
        },
      },
    } as any,
    type: "bar",
    name: OTD,
    order: 1,
    showlabel: true
  },
  {
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "RFT 2023",
          data: [234, 519, 572, 391, 1446, 1408, 1075],
          backgroundColor: "#179E27",
          order: 2
        },
        {
          label: "RFT 2024",
          data: [200, 450, 500, 800, 1000, 1200, 1300],
          backgroundColor: "red",
          order: 1
        },
        {
          label: "RFT %",
          data: [80, 90, 93, 81, 73, 90, 60, 85],
          type: "line",
          borderColor: "gray",
          borderWidth: 2,
          order: 1,
          yAxisID: "y-right",
        }
      ],
    } as any,
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          display: true,
          color: "black",   // White color for better contrast
          font: {
            size: 16,
          },
          anchor: "center" as const,  // Center the label inside the bar
          align: "center" as const,   // Align the label in the middle of the bar
          formatter: (value: number) => value,
        },
      },
      scales: {
        x: {
          stacked: true,  // Enable stacking on the x-axis
          title: {
            display: true,
            text: "Month",
          },
        },
        y: {
          stacked: true,  // Enable stacking on the y-axis
          title: {
            display: true,
            text: "RFT",
          },
        },
        "y-right": {
          beginAtZero: true,
          position: "right",
          max: 100,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    } as any,
    type: "bar",
    name: RFT,
    order: 2,
    showlabel: true
  },
  {
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Attrition Rate %",
          data: [
            2.7, 4.7, 7.01, 9.23, 11.16, 14.18, 16.54, 18.87, 21.12, 23.69, 26.48,
            28.94,
          ],
          fill: false,
          borderColor: "#007BFF",
          tension: 0.4,
          backgroundColor: "rgba(75, 192, 192, 0.3)",
          pointBackgroundColor: "#007BFF",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    } as any,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          display: true,
          color: "black",
          font: {
            size: 14 as const,
          },
          anchor: "end" as const,
          align: "top" as const,
          formatter: (value: number) => `${value} %`, // Add % symbol to values
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Month",
          },
        },
        y: {
          title: {
            display: true,
            text: "Attrition Rate %",
          },
          ticks: {
            callback: function (value: number) {
              return `${value} %`;
            },
          },
        },
      },
    } as any,
    type: "line",
    name: ATTRITION_RATE,
    order: 3,
    showlabel: true
  },
  {
    data: {
      datasets: [
        {
          data: [8, 6, 3],
          backgroundColor: ["#00AF50", "#558230", "#0D98C5"],
        },
      ],
    } as any,
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          font: {
            size: 14,
          },
          anchor: "center",  // Keep labels centered
          align: "center",
          formatter: (value: number) => `${value}`,
        },
      },
    } as any,
    type: "pie",
    name: CUSTOMER_SATISFACTION,
    order: 4,
    showlabel: true
  },
  {
    data: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Capacity",
          data: [1974, 1974, 1308, 1983, 1992, 1992],
          type: "bar",
          backgroundColor: "#5A9BD5",
          yAxisID: "y-left",
          order: 2,
        },
        {
          label: "Workload",
          data: [927.71, 588.95, 697.42, 809.93, 857.81, 250],
          type: "bar",
          backgroundColor: "#EE7D31",
          yAxisID: "y-left",
          order: 1
        },
        {
          label: "Workload %",
          data: [47, 30, 53, 41, 43, 20],
          type: "line",
          borderColor: "red",
          borderWidth: 2,
          yAxisID: "y-right",
          order: 1
        }
      ]
    } as any,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        "y-left": {
          beginAtZero: true,
          position: "left",
          max: 4000,
        },
        "y-right": {
          beginAtZero: true,
          position: "right",
          max: 100,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    } as any,
    type: "bar",
    name: WORKLOAD,
    order: 5,
    showlabel: false
  },
  {
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          type: "bar",
          label: "FTE",
          data: [10, 10, 13, 13, 15, 13, 11, 10, 10, 10, 10, 10],
          backgroundColor: "gray",
          yAxisID: "y-left",
          borderWidth: 1,
          order: 1,

        },
        {
          type: "line",
          label: "Efficiency",
          data: [100, 102, 105, 110, 115, 112, 113, 118, 120, 125, 130, 135],
          borderColor: "blue",
          backgroundColor: "blue",
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: "y-right",
          order: 2,
        },
        {
          type: "line",
          label: "Productivity",
          data: [90, 88, 85, 82, 80, 78, 75, 73, 70, 68, 65, 63],
          borderColor: "red",
          backgroundColor: "red",
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: "y-right",

        },
        {
          type: "line",
          label: "Cost of Quality",
          data: [2, 2.2, 2.1, 2.4, 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1],
          borderColor: "green",
          backgroundColor: "green",
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: "y-right",
        },
        {
          type: "line",
          label: "Cost of Non-Quality",
          data: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5],
          borderColor: "darkblue",
          backgroundColor: "darkblue",
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: "y-right",

        }
      ],
    } as any,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        "y-left": {
          beginAtZero: true,
          position: "left",
          max: 20,
        },
        "y-right": {
          beginAtZero: true,
          position: "right",
          max: 150,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    } as any,
    type: "bar",
    name: EFFICIENCY,
    order: 6,
    showlabel: false
  },
  {
    data: getChartData() as any,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    } as any,
    type: "radar",
    name: SKILLS_MATRIX,
    proficiencyLevels: [
      "Information level", // Level 1
      "Accompanied Level", // Level 2
      "Autonomy Level", // Level 3
      "Referent Level - Training Capability", // Level 4
    ],
    order: 7,
    showlabel: false
  }

] as any

//KPI 2 data
export const KPI_TWO_DATA = [

  {
    data: {
      labels: [
        "01/07/2024",
        "01/08/2024",
        "01/09/2024",
        "01/10/2024",
        "01/11/2024",
        "01/12/2024",
      ],
      datasets: [
        {
          label: "STD Margin Previous Month (%)",
          data: [16.7, 24.8, 27.1, 22.3, 22.0, 23.7],
          borderColor: "#ffcc00",
          backgroundColor: "#ffcc00",
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "STD Margin (%)",
          data: [16.7, 24.8, 31.2, 26.0, 22.3, 23.7],
          borderColor: "#007bff",
          backgroundColor: "#007bff",
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "STD Projected Margin (%)",
          data: [null, 27.1, 26.0, 22.3, 22.0, 23.7],
          borderColor: "#28a745",
          backgroundColor: "#28a745",
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    } as any,
    options: {
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          font: { weight: "bold" },
          formatter: (value: number) => `${value}%`,
        },
        legend: {
          position: "top",
        },
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: number) => `${value}%`,
          },
        },
      },
    } as any,
    type: "line",
    name: SEMESTER_TO_DATE_VIEW,
    order: 1,
    showlabel: true
  },
  {
    data: {
      labels: ["Exp2", "Exp1", "SP2", "SP1", "IE2", "IE1", "IEJ"],
      datasets: [
        {
          label: "Realised Level on Engineers",
          data: [4, 25, 274, 590, 953, 998, 550],
          backgroundColor: "#3b82f6",
          borderRadius: 6,
          barThickness: 20,
        },
      ],
    } as any,
    options: {
      indexAxis: "y",
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false }, min: 0 },
        y: { grid: { display: false }, reverse: true },
      },
    } as any,
    type: "bar",
    name: REALISED_LEVEL_ON_ENGINEERS,
    order: 2,
    showlabel: false
  },
  {
    data: {
      labels: ["Exp2", "Exp1", "SP2", "SP1", "IE2", "IE1", "IEJ"],
      datasets: [
        {
          label: "Forecasted Level on Engineers",
          data: [4, 27, 282, 668, 1077, 1042, 600],
          backgroundColor: "#3b82f6",
          borderRadius: 6,
          barThickness: 20,
        },
      ],
    } as any,
    options: {
      indexAxis: "y",
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false }, min: 0 },
        y: { grid: { display: false }, reverse: true },
      },
    } as any,
    type: "bar",
    name: FORECASTED_LEVEL_ON_ENGINEERS,
    order: 3,
    showlabel: false
  },
  {
    data: {
      labels: ["Jan-25", "Feb-25", "Mar-25", "Apr-25", "May-25", "Jun-25", "Jul-25", "Aug-25", "Sep-25", "Oct-25", "Nov-25", "Dec-25"],
      datasets: [
        {
          label: "FTE",
          data: [10, 10, 10, 10, 13, 13, 13, 10, 10, 10, 10, 10],
          type: "bar",
          backgroundColor: "#b0b0b0",
          yAxisID: "y",
          order: 2
        },
        {
          label: "Salary",
          data: [690909, 693182, 696364, 707273, 717273, 719091, 723638, 723636, 726364, 730455, 730455, 730455],
          borderColor: "#ffcc00",
          type: "line",
          backgroundColor: "#ffcc00",
          tension: 0.4,
          yAxisID: "y1",
          order: 1,
        },
        {
          label: "Salary PCI",
          data: [690909, 693182, 696364, 507273, 517273, 419091, 323638, 923636, 726364, 730455, 730455, 730455],
          borderColor: "#0033cc",
          backgroundColor: "#0033cc",
          type: "line",
          tension: 0.4,
          yAxisID: "y1",
        },
      ],
    } as any,
    options: {
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: {
          type: "linear",
          position: "left",
          grid: { display: false },
        },
        y1: {
          type: "linear",
          position: "right",
          grid: { display: false },
        },
      },
    } as any,
    type: "bar",
    name: PROJECT_SALARY_EVOLUTION,
    order: 4,
    showlabel: false

  },
  {
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [
        {
          label: "Activity Engaged",
          data: [100000, 120000, 140000, 160000, 180000, 200000, 220000, 240000, 260000, 280000, 300000, 320000],
          backgroundColor: "#b0b0b0",
          stack: "Stack 0",
          order: 2
        },
        {
          label: "Activity In Progress",
          data: [110000, 130000, 150000, 170000, 190000, 210000, 230000, 250000, 270000, 290000, 310000, 330000],
          backgroundColor: "#80bfff",
          stack: "Stack 0",
          order: 2
        },
        {
          label: "Current Month DAN",
          data: [119925, 242898, 372896, 593309, 593309, 593309, 593309, 593309, 593309, 593309, 593309, 593309],
          borderColor: "#0033cc",
          backgroundColor: "#0033cc",
          type: "line",
          tension: 0.4,
          order: 1
        },
      ],
    } as any,
    options: {},
    type: "bar",
    name: ORDER_TO_BILLING,
    order: 5,
    showlabel: false
  }

] as any


// KPI Tab
export const KPI_TABS = [
  { label: "KPI 1", value: KPI_ONE, data: KPI_TWO_DATA },
  { label: "KPI 2", value: KPI_TWO, data: KPI_ONE_DATA },
]

