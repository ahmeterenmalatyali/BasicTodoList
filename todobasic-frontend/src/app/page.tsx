"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext } from "@hello-pangea/dnd";
import { FiSave } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "@/lib/api";

import { TodoHeader }          from "@/components/TodoHeader";
import { AddTodoForm }         from "@/components/AddTodoForm";
import { TodoToolbar }         from "@/components/TodoToolbar";
import { TodoItem }            from "@/components/TodoItem";
import { SubTaskModal }        from "@/components/SubTaskModal";
import { StrictModeDroppable } from "@/components/StrictModeDroppable";

export default function HomePage() {
  const router = useRouter();

  // ── State ─────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser]     = useState<any>(null);
  const [todos, setTodos]                 = useState<any[]>([]);
  const [categories, setCategories]       = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [darkMode, setDarkMode]           = useState(false);
  const [selectedTodo, setSelectedTodo]   = useState<any>(null);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isSaving, setIsSaving]           = useState(false);

  // Form state
  const [newTodoTitle, setNewTodoTitle]   = useState("");
  const [priority, setPriority]           = useState(1);
  const [category, setCategory]           = useState("Genel");
  const [dueDate, setDueDate]             = useState("");
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");

  // Filtre / arama state
  const [searchQuery, setSearchQuery]       = useState("");
  const [filterCategory, setFilterCategory] = useState("Hepsi");
  const [filterPriority, setFilterPriority] = useState("Hepsi");
  const [sortBy, setSortBy]                 = useState("Manuel");

  // ── Veri çekme ────────────────────────────────────────────────────────────
  const fetchTodos = useCallback(async () => {
    try {
      const res = await api.get("/Todo");
      setTodos(res.data.sort((a: any, b: any) => a.order - b.order));
      setIsOrderChanged(false);
    } catch {
      console.error("Görevler çekilemedi");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/Category");
      setCategories(res.data);
      if (res.data.length > 0) setCategory(res.data[0].name);
    } catch {
      console.error("Kategoriler çekilemedi");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    Promise.all([
      api.get("/Auth/me"),
      api.get("/Todo"),
      api.get("/Category"),
    ]).then(([userRes, todosRes, catsRes]) => {
      setCurrentUser(userRes.data);
      setTodos(todosRes.data.sort((a: any, b: any) => a.order - b.order));
      setCategories(catsRes.data);
      if (catsRes.data.length > 0) setCategory(catsRes.data[0].name);
    }).catch(() => {
      router.push("/login");
    }).finally(() => {
      setLoading(false);
    });
  }, [router]);

  // ── Handler'lar ───────────────────────────────────────────────────────────
  const handleAddTodoSubmit = async (e: any) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    try {
      await api.post("/Todo", {
        Title: newTodoTitle,
        Priority: priority,
        Category: category,
        DueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setNewTodoTitle("");
      setDueDate("");
      toast.success("Görev eklendi!");
      fetchTodos();
    } catch {
      toast.error("Görev eklenemedi.");
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      await api.post("/Category", { name });
      toast.success("Kategori eklendi!");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Kategori eklenemedi.");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await api.put(`/Todo/${id}/toggle`);
      fetchTodos();
    } catch (err: any) {
      toast.error(err.response?.data || "Görev güncellenemedi.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/Todo/${id}`);
      toast.success("Görev silindi.");
      fetchTodos();
    } catch {
      toast.error("Görev silinemedi.");
    }
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTodos(items);
    setIsOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      await api.put("/Todo/reorder", todos.map((t) => t.id));
      setIsOrderChanged(false);
      toast.success("Sıralama kaydedildi!");
    } catch {
      toast.error("Kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSub = async (sid: number) => {
    try {
      await api.put(`/Todo/subtask/${sid}/toggle`);
      fetchTodos();
    } catch {
      toast.error("Alt görev güncellenemedi.");
    }
  };

  const handleAddSub = async (e: any) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim()) return;
    try {
      await api.post(`/Todo/${selectedTodo.id}/subtask?title=${encodeURIComponent(newSubTaskTitle)}`);
      setNewSubTaskTitle("");
      fetchTodos();
    } catch {
      toast.error("Alt görev eklenemedi.");
    }
  };

  // ── Filtrele & Sırala ─────────────────────────────────────────────────────
  const filteredTodos = (() => {
    let list = todos.filter((t) => {
      const matchSearch   = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === "Hepsi" || t.category === filterCategory;
      const matchPriority = filterPriority === "Hepsi" || t.priority.toString() === filterPriority;
      return matchSearch && matchCategory && matchPriority;
    });

    if (sortBy === "Ad")       list = [...list].sort((a, b) => a.title.localeCompare(b.title, "tr"));
    else if (sortBy === "Öncelik") list = [...list].sort((a, b) => b.priority - a.priority);
    else if (sortBy === "Tarih")  {
      list = [...list].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    return list;
  })();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-indigo-600 text-4xl animate-pulse tracking-tighter">
      FOCUSFLOW...
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className={`${darkMode ? "dark" : ""} min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500`}>
      <div className="max-w-2xl mx-auto py-12 px-4">

        {/* Sıralama kaydet butonu */}
        {isOrderChanged && (
          <div className="fixed bottom-10 right-10 z-50">
            <button
              onClick={handleSaveOrder}
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-black shadow-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all"
            >
              <FiSave /> {isSaving ? "KAYDEDİLİYOR..." : "SIRAYI KAYDET"}
            </button>
          </div>
        )}

        {/* Header */}
        <TodoHeader
          username={currentUser?.username || ""}
          stats={{
            total: todos.length,
            completed: todos.filter((t) => t.isCompleted).length,
            pending: todos.filter((t) => !t.isCompleted).length,
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={() => { localStorage.clear(); router.push("/login"); }}
        />

        {/* Görev ekleme formu */}
        <AddTodoForm
          onSubmit={handleAddTodoSubmit}
          title={newTodoTitle}     setTitle={setNewTodoTitle}
          priority={priority}      setPriority={setPriority}
          category={category}      setCategory={setCategory}
          dueDate={dueDate}        setDueDate={setDueDate}
          categories={categories}
          onAddCategory={handleAddCategory}
        />

        {/* Toolbar */}
        <TodoToolbar
          searchQuery={searchQuery}         setSearchQuery={setSearchQuery}
          filterCategory={filterCategory}   setFilterCategory={setFilterCategory}
          filterPriority={filterPriority}   setFilterPriority={setFilterPriority}
          sortBy={sortBy}                   setSortBy={setSortBy}
          categories={categories}
        />

        {/* Todo listesi */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <StrictModeDroppable droppableId="todos">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="pb-24">
                {filteredTodos.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-slate-400 font-bold">Henüz görev yok.</p>
                    <p className="text-xs text-slate-300 mt-1">Yukarıdan yeni bir görev ekle.</p>
                  </div>
                )}
                {filteredTodos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onSelect={setSelectedTodo}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </div>

      {/* Alt görev modalı */}
      {selectedTodo && (
        <SubTaskModal
          todo={selectedTodo}
          onClose={() => { setSelectedTodo(null); setNewSubTaskTitle(""); }}
          onToggleSub={handleToggleSub}
          onAddSub={handleAddSub}
          newTitle={newSubTaskTitle}
          setNewTitle={setNewSubTaskTitle}
        />
      )}
    </main>
  );
}
