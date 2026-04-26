export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-12 h-[50vh]">
      <div className="relative flex w-12 h-12">
        <div className="absolute inset-0 rounded-full border-t-2 border-blue-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }}></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Loading...</p>
    </div>
  );
}
