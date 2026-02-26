"use client";

import { useState } from "react";
import { FiX, FiPlus, FiUser, FiCheckCircle, FiCircle } from "react-icons/fi";

export const SubTaskModal = ({
  todo, onClose,
  onToggleSub, onAddSub,
  newTitle, setNewTitle,
}: any) => {
  const [subTaskUserId, setSubTaskUserId] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-indigo-50/30 dark:bg-indigo-900/10">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight break-words">
              {todo.title}
            </h2>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">ALT GÖREVLER</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all text-slate-400">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Alt görev ekleme formu */}
          <form
            onSubmit={(e) => { e.preventDefault(); onAddSub(e, subTaskUserId); setSubTaskUserId(""); }}
            className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Alt görev başlığı..."
              className="bg-transparent border-none text-sm font-bold focus:ring-0 dark:text-white outline-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Not: Alt görevler kendine atanabilir</p>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 transition-all flex items-center gap-1">
                <FiPlus size={14} /> Ekle
              </button>
            </div>
          </form>

          {/* Alt görev listesi */}
          <div className="space-y-3">
            {todo.subTasks?.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">Henüz alt görev yok.</p>
            )}
            {todo.subTasks?.map((sub: any) => (
              <div key={sub.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleSub(sub.id)}
                    className={`text-xl transition-colors ${
                      sub.isCompleted ? "text-indigo-500" : "text-slate-300 hover:text-indigo-400"
                    }`}
                  >
                    {sub.isCompleted ? <FiCheckCircle /> : <FiCircle />}
                  </button>
                  <span className={`text-sm font-semibold ${
                    sub.isCompleted ? "line-through text-slate-300" : "text-slate-600 dark:text-slate-300"
                  }`}>
                    {sub.title}
                  </span>
                </div>

                {sub.assignedUser && (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
                    <FiUser size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      {sub.assignedUser.username}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
