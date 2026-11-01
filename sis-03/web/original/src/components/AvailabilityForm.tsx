import { useState, type FormEvent } from 'react';
import { AlertCircle } from 'lucide-react';

interface AvailabilityFormProps {
  defaultStart: string;
  defaultEnd: string;
  error: string | null;
  onCheck: (startValue: string, endValue: string) => void;
}

const inputClass =
  'mt-2 w-full rounded-lg border bg-white px-4 py-3 text-base text-navy-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-600/30';

export default function AvailabilityForm({ defaultStart, defaultEnd, error, onCheck }: AvailabilityFormProps) {
  const [startValue, setStartValue] = useState(defaultStart);
  const [endValue, setEndValue] = useState(defaultEnd);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCheck(startValue, endValue);
  }

  const invalidBorder = error ? 'border-red-400' : 'border-slate-300';

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-card bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-navy-900">Check a time</h2>
      <p className="mt-1 text-sm text-slate-600">Choose when you need the room. Times can be up to 2 hours.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
        <label htmlFor="start-time" className="block text-sm font-medium text-slate-700">
          Start
          <input
            id="start-time"
            type="time"
            value={startValue}
            onChange={(event) => setStartValue(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'availability-error' : undefined}
            className={`${inputClass} ${invalidBorder}`}
          />
        </label>
        <label htmlFor="end-time" className="block text-sm font-medium text-slate-700">
          End
          <input
            id="end-time"
            type="time"
            value={endValue}
            onChange={(event) => setEndValue(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'availability-error' : undefined}
            className={`${inputClass} ${invalidBorder}`}
          />
        </label>
      </div>

      {error && (
        <div
          id="availability-error"
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-navy-800 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-2 active:scale-[0.99]"
      >
        Check Availability
      </button>
    </form>
  );
}
