import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const stageStyles = {
  "Todo": {
    header: "bg-slate-100 text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  "In Progress": {
    header: "bg-yellow-100 text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-400",
  },
  "Done": {
    header: "bg-green-100 text-green-700",
    border: "border-green-200",
    dot: "bg-green-400",
  },
};

const TaskColumn = ({ stage, tasks, onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  const style = stageStyles[stage];

  return (
    <div
      className={`bg-white rounded-xl border ${style.border} flex flex-col min-h-[500px] transition ${
        isOver ? "ring-2 ring-blue-400 ring-offset-1" : ""
      }`}
    >
      {/* Column Header */}
      <div className={`${style.header} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
          <h2 className="font-semibold text-sm">{stage}</h2>
        </div>
        <span className="text-xs font-bold bg-white bg-opacity-60 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 text-sm text-center py-8">
                No tasks here.<br />Drag one here or create new.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default TaskColumn;