const StatsCards = ({ tasks }) => {
  const stats = [
    {
      label: "Total Tasks",
      count: tasks.length,
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      icon: "📋",
    },
    {
      label: "Todo",
      count: tasks.filter((t) => t.stage === "Todo").length,
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      icon: "🔵",
    },
    {
      label: "In Progress",
      count: tasks.filter((t) => t.stage === "In Progress").length,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
      icon: "🟡",
    },
    {
      label: "Done",
      count: tasks.filter((t) => t.stage === "Done").length,
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
      icon: "🟢",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} ${stat.border} border rounded-xl p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">{stat.icon}</span>
            <span className={`text-2xl font-bold ${stat.text}`}>
              {stat.count}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;