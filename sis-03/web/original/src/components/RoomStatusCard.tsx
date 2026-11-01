import { Clock } from 'lucide-react';
import type { Booking, Room } from '@/lib/availability';
import { formatMinutes } from '@/lib/time';

interface RoomStatusCardProps {
  room: Room;
  currentTime: number;
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3">
      <Clock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
      <span className="text-sm text-slate-700">
        <span className="font-medium text-navy-900">
          {formatMinutes(booking.start)}–{formatMinutes(booking.end)}
        </span>
        <span className="text-slate-400"> · </span>
        {booking.title}
      </span>
    </li>
  );
}

export default function RoomStatusCard({ room, currentTime }: RoomStatusCardProps) {
  return (
    <section className="rounded-card bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Selected room</p>
          <h1 className="mt-1 text-2xl font-semibold text-navy-900">{room.name}</h1>
        </div>
        {room.blocked ? (
          <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 ring-1 ring-red-200">
            Blocked
          </span>
        ) : (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
            Not blocked
          </span>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-navy-900">Today&apos;s bookings</h2>
        <p className="mt-1 text-xs text-slate-500">Current time {formatMinutes(currentTime)}</p>
        {room.bookings.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {room.bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No bookings today.</p>
        )}
      </div>
    </section>
  );
}
