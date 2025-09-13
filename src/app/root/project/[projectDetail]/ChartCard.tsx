// Enhanced ChartCard component
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white shadow-lg rounded-xl p-5 h-full flex flex-col">
        <h2 className="text-lg font-rubik-semibold mb-4 text-gray-800">{title}</h2>
        <div className="flex-1 min-h-[300px] lg:min-h-[400px]">
            {children}
        </div>
    </div>
);

export default ChartCard