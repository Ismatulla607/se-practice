import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import RoomStatusCard from '@/components/RoomStatusCard';
import AvailabilityForm from '@/components/AvailabilityForm';
import AvailabilityResultBanner from '@/components/AvailabilityResultBanner';
import { CURRENT_TIME_MINUTES, ROOM_A101 } from '@/data/roomA101';
import { checkAvailability, validateRequest, type AvailabilityResult } from '@/lib/availability';

interface CheckOutcome {
  start: number;
  end: number;
  result: AvailabilityResult;
}

function App() {
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);

  function handleCheck(startValue: string, endValue: string) {
    const request = validateRequest(startValue, endValue, CURRENT_TIME_MINUTES);
    if (!request.ok) {
      setError(request.message);
      setOutcome(null);
      return;
    }
    setError(null);
    setOutcome({
      start: request.start,
      end: request.end,
      result: checkAvailability(ROOM_A101, request.start, request.end),
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-5 py-8">
        <RoomStatusCard room={ROOM_A101} currentTime={CURRENT_TIME_MINUTES} />
        <AvailabilityForm
          defaultStart="11:00"
          defaultEnd="12:30"
          error={error}
          onCheck={handleCheck}
        />
        {outcome && (
          <AvailabilityResultBanner
            roomName={ROOM_A101.name}
            start={outcome.start}
            end={outcome.end}
            result={outcome.result}
          />
        )}
        <p className="text-center text-xs text-slate-500">
          Prototype with fictional data. Checking availability never creates or changes a booking.
        </p>
      </main>
    </div>
  );
}

export default App;
