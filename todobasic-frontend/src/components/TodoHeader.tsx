import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";

interface Props {
  username: string;
  stats: { total: number; completed: number; pending: number };
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLogout: () => void;
}

export const TodoHeader = ({ username, stats, darkMode, setDarkMode, onLogout }: Props) => {
  const avatarSrc = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div className="bg-[var(--card)] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
      {/* Başlık satırı */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img
            src={avatarSrc}
            className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 p-1"
            alt="avatar"
          />
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">{username}</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Görev Listem</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-amber-500 hover:rotate-12 transition-transform shadow-sm"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button
            onClick={onLogout}
            className="p-3 text-rose-500 bg-rose-50 dark:bg-rose-900/20 rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-center">
          <p className="text-[10px] font-black uppercase text-slate-400">Toplam</p>
          <p className="text-xl font-black text-slate-700 dark:text-slate-200">{stats.total}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl text-center border border-emerald-100 dark:border-emerald-800">
          <p className="text-[10px] font-black uppercase text-emerald-500">Biten</p>
          <p className="text-xl font-black text-emerald-600">{stats.completed}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl text-center border border-indigo-100 dark:border-indigo-800">
          <p className="text-[10px] font-black uppercase text-indigo-500">Kalan</p>
          <p className="text-xl font-black text-indigo-600">{stats.pending}</p>
        </div>
      </div>
    </div>
  );
};
