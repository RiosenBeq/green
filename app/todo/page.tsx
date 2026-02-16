"use client";

import { useState, useEffect } from "react";
import {
    ClipboardList,
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    Clock,
    Briefcase,
    Ship,
    Users,
    AlertCircle,
    Calendar,
    ChevronRight,
    Search
} from "lucide-react";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    category: "Operations" | "Chartering";
    priority: "High" | "Medium" | "Low";
    dueDate?: string;
    dueTime?: string;
    tags: string[];
}

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [newDueTime, setNewDueTime] = useState("");
    const [activeCategory, setActiveCategory] = useState<"All" | "Operations" | "Chartering">("All");
    const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");
    const [newCategory, setNewCategory] = useState<"Operations" | "Chartering">("Operations");

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("gnb_todos");
        if (saved) {
            try {
                setTodos(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse todos", e);
            }
        } else {
            // Seed defaults
            setTodos([
                { id: '1', text: 'Follow up on GUNECE port DA @ Port Said', completed: false, category: 'Operations', priority: 'High', tags: ['Logistics'], dueDate: '2026-02-18', dueTime: '09:00' },
                { id: '2', text: 'Send market report to KOLMAR for March laycans', completed: false, category: 'Chartering', priority: 'Medium', tags: ['Market'], dueDate: '2026-02-17', dueTime: '14:30' },
                { id: '3', text: 'Check BL drafts for BANDIRMA fixture', completed: true, category: 'Operations', priority: 'High', tags: ['Documentation'] },
            ]);
        }
    }, []);

    // Save to localStorage whenever todos change
    useEffect(() => {
        localStorage.setItem("gnb_todos", JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (!newTodo.trim()) return;
        const todo: Todo = {
            id: Date.now().toString(),
            text: newTodo,
            completed: false,
            category: newCategory,
            priority: newPriority,
            tags: [],
            dueDate: newDueDate,
            dueTime: newDueTime
        };
        setTodos([todo, ...todos]);
        setNewTodo("");
        setNewDueTime("");
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    const filteredTodos = todos.filter(t => {
        if (activeCategory === "All") return true;
        return t.category === activeCategory;
    });

    const stats = {
        total: todos.length,
        ops: todos.filter(t => t.category === 'Operations').length,
        chartering: todos.filter(t => t.category === 'Chartering').length,
        completed: todos.filter(t => t.completed).length
    };

    return (
        <div className="anim-fade flex flex-col gap-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--green-500)] to-[#10b981] flex items-center justify-center text-black shadow-lg shadow-[var(--green-500)/20]">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Shipbroker To-Do Hub</h1>
                        <p className="text-xs text-[var(--text-secondary)] font-medium">Manage your daily desk operations and chartering tasks.</p>
                    </div>
                </div>

                <div className="flex gap-4 p-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl">
                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'All' ? 'bg-[var(--green-500)] text-black shadow-lg shadow-[var(--green-500)/20]' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveCategory("Operations")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'Operations' ? 'bg-[#60a5fa] text-black shadow-lg shadow-[#60a5fa]/20' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        Operations
                    </button>
                    <button
                        onClick={() => setActiveCategory("Chartering")}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'Chartering' ? 'bg-[#f59e0b] text-black shadow-lg shadow-[#f59e0b]/20' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        Chartering
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
                <div className="panel flex flex-col gap-1 p-4 border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Active Tasks</span>
                    <span className="text-2xl font-black text-white">{stats.total - stats.completed}</span>
                </div>
                <div className="panel flex flex-col gap-1 p-4 border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#60a5fa]">Operations</span>
                    <span className="text-2xl font-black text-white">{stats.ops}</span>
                </div>
                <div className="panel flex flex-col gap-1 p-4 border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b]">Chartering</span>
                    <span className="text-2xl font-black text-white">{stats.chartering}</span>
                </div>
                <div className="panel flex flex-col gap-1 p-4 border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--green-500)]">Completion</span>
                    <span className="text-2xl font-black text-white">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
                </div>
            </div>

            {/* Input Section */}
            <div className="panel flex flex-col bg-[var(--bg-elevated)] border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex gap-2 items-center p-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                        <input
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="Assign a new task to your desk..."
                            className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-medium focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={addTodo}
                        className="w-12 h-12 rounded-xl bg-[var(--green-500)] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--green-500)/20]"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </button>
                </div>
                <div className="flex gap-4 p-4 bg-white/[0.02] border-t border-white/5">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Desk</label>
                        <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as any)}
                            className="bg-[var(--bg-card)] border border-white/5 rounded-lg text-xs font-bold text-white px-3 py-2 outline-none cursor-pointer hover:border-[var(--green-500)/30] transition-colors appearance-none"
                        >
                            <option value="Operations">Operations Desk</option>
                            <option value="Chartering">Chartering Desk</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Priority</label>
                        <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as any)}
                            className={`bg-[var(--bg-card)] border border-white/5 rounded-lg text-xs font-bold px-3 py-2 outline-none cursor-pointer transition-colors appearance-none ${newPriority === 'High' ? 'text-red-500' : newPriority === 'Medium' ? 'text-amber-500' : 'text-blue-500'}`}
                        >
                            <option value="High">Emergency (High)</option>
                            <option value="Medium">Standard (Medium)</option>
                            <option value="Low">Information (Low)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Deadline Date</label>
                        <input
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="bg-[var(--bg-card)] border border-white/5 rounded-lg text-xs font-bold text-white px-3 py-2 outline-none cursor-pointer hover:border-[var(--green-500)/30] transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Deadline Time</label>
                        <input
                            type="time"
                            value={newDueTime}
                            onChange={(e) => setNewDueTime(e.target.value)}
                            className="bg-[var(--bg-card)] border border-white/5 rounded-lg text-xs font-bold text-white px-3 py-2 outline-none cursor-pointer hover:border-[var(--green-500)/30] transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="flex flex-col gap-3">
                {filteredTodos.map((todo) => (
                    <div
                        key={todo.id}
                        className={`group p-4 flex items-center gap-4 rounded-2xl border transition-all duration-300 ${todo.completed ? 'bg-white/[0.01] border-white/5 opacity-50' : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--green-500)/30] hover:translate-x-1'}`}
                    >
                        <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`flex-shrink-0 transition-all ${todo.completed ? 'text-[var(--green-500)]' : 'text-[var(--text-muted)] group-hover:text-white'}`}
                        >
                            {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-[#60a5fa] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${todo.category === 'Operations' ? 'bg-[#60a5fa15] text-[#60a5fa]' : 'bg-[#f59e0b15] text-[#f59e0b]'}`}>
                                    {todo.category}
                                </span>
                                {todo.priority === 'High' && (
                                    <span className="bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <AlertCircle size={10} /> Priority
                                    </span>
                                )}
                                {(todo.dueDate || todo.dueTime) && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] font-mono">
                                        <Calendar size={12} className="opacity-40" />
                                        {todo.dueDate}
                                        {todo.dueTime && <span className="text-[var(--green-500)] ml-1 border-l border-white/10 pl-1.5 opacity-80">{todo.dueTime}</span>}
                                    </span>
                                )}
                            </div>
                            <span className={`block text-[13px] font-bold transition-all ${todo.completed ? 'line-through text-[var(--text-muted)]' : 'text-white'}`}>
                                {todo.text}
                            </span>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] transition-colors"><ChevronRight size={16} /></button>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredTodos.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center opacity-30">
                        <ClipboardList size={48} className="mb-4" />
                        <p className="font-bold text-sm tracking-widest">NO PENDING TASKS</p>
                    </div>
                )}
            </div>
        </div>
    );
}
