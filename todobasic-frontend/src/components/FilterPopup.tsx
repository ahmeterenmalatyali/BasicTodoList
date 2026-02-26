"use client";

import { useState, useRef, useEffect } from "react";
import { FiFilter, FiChevronDown } from "react-icons/fi";

export const FilterPopup = ({
  categories,
  filterCategory, setFilterCategory,
  filterPriority, setFilterPriority,
}: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount = [
    filterCategory !== "Hepsi" ? 1 : 0,
    filterPriority !== "Hepsi" ? 1 : 0,
  ].reduce((a: number, b: number) => a + b, 0);

  const clearAll = () => {
    setFilterCategory("Hepsi");
    setFilterPriority("Hepsi");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black uppercase transition-all border ${
          activeCount > 0
            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
            : "bg-[var(--card)] text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 shadow-sm"
        }`}
      >
        <FiFilter size={14} />
        <span>Filtrele</span>
        {activeCount > 0 && (
          <span className="bg-white/25 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <FiChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden">
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Filtreler</h3>
              <button onClick={clearAll} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700">
                Temizle
              </button>
            </div>

            {/* Kategori */}
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Kategori</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterCategory("Hepsi")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                    filterCategory === "Hepsi"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Hepsi
                </button>
                {categories?.map((cat: any) => (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setFilterCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                      filterCategory === cat.name
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Öncelik */}
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Öncelik</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "Hepsi", label: "Hepsi",  dot: "bg-slate-400" },
                  { value: "1",     label: "Düşük",  dot: "bg-emerald-500" },
                  { value: "2",     label: "Orta",   dot: "bg-amber-500" },
                  { value: "3",     label: "Acil",   dot: "bg-rose-500" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterPriority(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                      filterPriority === opt.value
                        ? "ring-2 ring-indigo-400 bg-slate-100 dark:bg-slate-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-2xl text-xs font-black transition-all"
            >
              Uygula
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
