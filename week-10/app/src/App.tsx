import { useState } from 'react';
import { canBook } from './booking';

type Interval = { start: number; end: number };
type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', blocked: false, bookings: [{ start: 600, end: 660 }] },
];

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [blocked, setBlocked] = useState(false);
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const room = ROOMS.find(r => r.id === roomId)!;

  function check() {
    setResult(null);

    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }

    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);
    const n = toMinutes(now);

    if (!(s < e)) {
      setError('The end time must be after the start time.');
    } else {
      setError('');
    }

    const ok = canBook({
      start: s,
      end: e,
      now: n,
      blocked: blocked || room.blocked,
      bookings: room.bookings,
    });

    setResult(ok);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <div className="row">
        <label>
          Room
          <select value={roomId} onChange={e => { setRoomId(e.target.value); setResult(null); setError(''); }}>
            {ROOMS.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Current time
          <input
            type="time"
            value={now}
            onChange={e => { setNow(e.target.value); setResult(null); setError(''); }}
          />
        </label>

        <label>
          Start
          <input
            type="time"
            value={start}
            onChange={e => { setStart(e.target.value); setResult(null); setError(''); }}
          />
        </label>

        <label>
          End
          <input
            type="time"
            value={end}
            disabled={endOfDay}
            onChange={e => { setEnd(e.target.value); setResult(null); setError(''); }}
          />
        </label>

        <label className="inline">
          <input
            type="checkbox"
            checked={endOfDay}
            onChange={e => { setEndOfDay(e.target.checked); setResult(null); setError(''); }}
          />
          Ends at 24:00
        </label>

        <label className="inline">
          <input
            type="checkbox"
            checked={blocked}
            onChange={e => { setBlocked(e.target.checked); setResult(null); setError(''); }}
          />
          Room blocked
        </label>
      </div>

      <button onClick={check}>Check availability</button>

      {error && <p className="error">{error}</p>}

      {result !== null && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>
          {result ? 'Available' : 'Unavailable'}
        </p>
      )}

      <h2>Existing bookings</h2>

      <ul>
        {room.bookings.length ? (
          room.bookings.map((b, i) => (
            <li key={i}>
              {fmt(b.start)}–{fmt(b.end)}
            </li>
          ))
        ) : (
          <li>none</li>
        )}
      </ul>
    </main>
  );
}