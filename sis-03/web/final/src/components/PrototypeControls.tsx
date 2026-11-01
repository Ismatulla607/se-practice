interface PrototypeControlsProps {
  blocked: boolean;
  includeTestBooking: boolean;
  onBlockedChange: (blocked: boolean) => void;
  onIncludeTestBookingChange: (include: boolean) => void;
}

const checkboxClass = 'h-5 w-5 shrink-0 rounded border-slate-300 text-teal-700 focus:ring-teal-600/40';

export default function PrototypeControls({
  blocked,
  includeTestBooking,
  onBlockedChange,
  onIncludeTestBookingChange,
}: PrototypeControlsProps) {
  return (
    <section className="rounded-card bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold text-navy-900">Prototype test settings</h2>
      <p className="mt-1 text-xs text-slate-500">These switches only change fictional test data.</p>
      <div className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={blocked}
            onChange={(event) => onBlockedChange(event.target.checked)}
            className={checkboxClass}
          />
          Room blocked
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeTestBooking}
            onChange={(event) => onIncludeTestBookingChange(event.target.checked)}
            className={checkboxClass}
          />
          Include test booking 700–760
        </label>
      </div>
    </section>
  );
}
