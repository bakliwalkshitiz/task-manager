import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityStyles = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

const TaskCard = ({ task, onEdit, onDelete, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition group cursor-grab active:cursor-grabbing ${
        isDragging ? "shadow-xl rotate-1 scale-105" : ""
      } ${isSortableDragging ? "opacity-40" : ""}`}
    >
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300 text-lg select-none">⠿</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-slate-500 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {formatDate(task.createdAt)}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="p-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="p-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;