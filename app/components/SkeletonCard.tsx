export default function SkeletonCard() {
  return (
    <div className="w-full bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-300 dark:bg-slate-700" />
          <div className="w-24 h-4 rounded bg-slate-300 dark:bg-slate-700" />
        </div>
        <div className="w-16 h-5 rounded-full bg-slate-300 dark:bg-slate-700" />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col gap-1">
          <div className="w-12 h-6 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="w-20 h-3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4">
           <div className="w-full h-px bg-slate-300 dark:bg-slate-700" />
        </div>

        <div className="flex flex-col gap-1 items-end">
          <div className="w-12 h-6 rounded bg-slate-300 dark:bg-slate-700" />
          <div className="w-20 h-3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
