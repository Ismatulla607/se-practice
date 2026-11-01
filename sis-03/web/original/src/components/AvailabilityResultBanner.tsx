import { CheckCircle2, XCircle } from 'lucide-react';
import type { AvailabilityResult } from '@/lib/availability';
import { formatMinutes } from '@/lib/time';

interface AvailabilityResultBannerProps {
  roomName: string;
  start: number;
  end: number;
  result: AvailabilityResult;
}

function describeResult(result: AvailabilityResult, roomName: string, start: number, end: number) {
  const range = `${formatMinutes(start)}–${formatMinutes(end)}`;
  if (result.status === 'available') {
    return {
      heading: 'Available',
      detail: `${roomName} is free from ${range}.`,
    };
  }
  if (result.status === 'blocked') {
    return {
      heading: 'Unavailable',
      detail: `${roomName} is blocked and cannot be used.`,
    };
  }
  const { booking } = result;
  return {
    heading: 'Unavailable',
    detail: `${range} overlaps an existing booking, ${formatMinutes(booking.start)}–${formatMinutes(booking.end)} · ${booking.title}.`,
  };
}

export default function AvailabilityResultBanner({ roomName, start, end, result }: AvailabilityResultBannerProps) {
  const isAvailable = result.status === 'available';
  const { heading, detail } = describeResult(result, roomName, start, end);
  const Icon = isAvailable ? CheckCircle2 : XCircle;

  return (
    <section
      role="status"
      aria-live="polite"
      className={`flex items-start gap-4 rounded-card px-5 py-5 text-white shadow-sm animate-fade-up ${
        isAvailable ? 'bg-teal-700' : 'bg-red-700'
      }`}
    >
      <Icon className="mt-0.5 h-7 w-7 shrink-0" aria-hidden="true" />
      <div>
        <p className="text-xl font-semibold">{heading}</p>
        <p className="mt-1 text-sm text-white/90">{detail}</p>
      </div>
    </section>
  );
}
