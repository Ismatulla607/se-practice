import { Building2 } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-md items-center gap-3 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-semibold text-navy-900">Smart Campus</p>
          <p className="text-xs text-slate-500">Room Availability Checker</p>
        </div>
      </div>
    </header>
  );
}
