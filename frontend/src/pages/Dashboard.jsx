import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getTasks, createTask, updateTask, deleteTask, updateTaskStage } from "../services/taskApi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/TaskModal";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import TaskCard from "../components/TaskCard";

const STAGES = ["Todo", "In Progress", "Done"];

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data.tasks);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      const data = await createTask(formData);
      setTasks((prev) => [data.task, ...prev]);
      toast.success("Task created!");
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      const data = await updateTask(editTask.id, formData);
      setTasks((prev) =>
        prev.map((t) => (t.id === editTask.id ? data.task : t))
      );
      toast.success("Task updated!");
      setModalOpen(false);
      setEditTask(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted!");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const taskId = active.id;
    const newStage = over.id;
    if (!STAGES.includes(newStage)) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.stage === newStage) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, stage: newStage } : t))
    );
    try {
      await updateTaskStage(taskId, newStage);
    } catch (error) {
      toast.error("Failed to update task stage");
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority ? task.priority === filterPriority : true;
    return matchSearch && matchPriority;
  });

  const getTasksByStage = (stage) =>
    filteredTasks.filter((t) => t.stage === stage);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's what's on your plate today.
          </p>
        </div>

        {/* Stats */}
        <StatsCards tasks={tasks} />

        {/* Search + Filter + Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            onClick={() => { setEditTask(null); setModalOpen(true); }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            + Add Task
          </button>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STAGES.map((stage) => (
                <TaskColumn
                  key={stage}
                  stage={stage}
                  tasks={getTasksByStage(stage)}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isDragging
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editTask}
          onClose={() => { setModalOpen(false); setEditTask(null); }}
          onSubmit={editTask ? handleUpdateTask : handleCreateTask}
        />
      )}
    </div>
  );
};

export default Dashboard;