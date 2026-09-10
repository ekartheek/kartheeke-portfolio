import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06090e] text-[#f8fafc] flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="text-xs text-sky-400 tracking-widest uppercase mb-2">ERROR 404 // ROUTE UNREACHABLE</div>
      <h1 className="text-4xl font-bold mb-4">PACKET DROPPED</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6 font-sans">
        The requested network endpoint or route does not exist in the routing table.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded bg-sky-950 border border-sky-600 text-sky-300 text-xs font-bold hover:bg-sky-900 transition-colors"
      >
        RETURN TO NETWORK CORE
      </Link>
    </div>
  );
}
