import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import RoomStatusCard from '@/components/RoomStatusCard';
import AvailabilityForm from '@/components/AvailabilityForm';
import AvailabilityResultBanner from '@/components/AvailabilityResultBanner';
import PrototypeControls from '@/components/PrototypeControls';
import {
  CURRENT_TIME_MINUTES,
  ROOM_A101_BOOKINGS,
  ROOM_A101_NAME,
  TEST_BOOKING,
} from '@/data/roomA101';
import { checkAvailability, validateRequest, type CheckOutcome, type Room } from '@/lib/availability';

function App() {
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [includeTestBooking, setIncludeTestBooking] = useState(false);

  const room: Room = {
    name: ROOM_A101_NAME,
    blocked,
    bookings: includeTestBooking ? [...ROOM_A101_BOOKINGS, TEST_BOOKING] : ROOM_A101_BOOKINGS,
  };

  function clearResult() {
    setError(null);
    setOutcome(null);
  }

  function handleBlockedChange(next: boolean) {
    setBlocked(next);
    clearResult();
  }

  function handleTestBookingChange(next: boolean) {
    setIncludeTestBooking(next);
    clearResult();
  }

  function handleCheck(startValue: string, endValue: string) {
    const request = validateRequest(startValue, endValue, CURRENT_TIME_MINUTES);
    if (request.status === 'invalid') {
      setError(request.message);
      setOutcome(null);
      return;
    }
    if (request.status === 'out-of-range') {
      setError(request.message);
      setOutcome({ kind: 'out-of-range' });
      return;
    }
    setError(null);
    setOutcome({
      kind: 'checked',
      start: request.start,
      end: request.end,
      result: checkAvailability(room, request.start, request.end),
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-5 py-8">
        <RoomStatusCard room={room} currentTime={CURRENT_TIME_MINUTES} />
        <AvailabilityForm defaultStart="660" defaultEnd="750" error={error} onCheck={handleCheck} />
        {outcome && <AvailabilityResultBanner roomName={room.name} outcome={outcome} />}
        <PrototypeControls
          blocked={blocked}
          includeTestBooking={includeTestBooking}
          onBlockedChange={handleBlockedChange}
          onIncludeTestBookingChange={handleTestBookingChange}
        />
        <p className="text-center text-xs text-slate-500">
          Prototype with fictional data. Checking availability never creates or changes a booking.
        </p>
      </main>
    </div>
  );
}

export default App;
