import { useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { ROOMS } from './rooms';

const EQUIPMENT = ['Projector', 'Whiteboard', 'Computers'];

const toMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const fmt = (minutes: number): string => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
};

export default function App() {
  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);

  const [roomId, setRoomId] = useState('a101');

  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);

  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const matchingRooms = filterRooms(ROOMS, {
    attendees,
    equipment,
  });

  const selectedRoom = matchingRooms.find(room => room.id === roomId);

  function updateFilters(
    nextAttendees: number,
    nextEquipment: string[]
  ) {
    const nextMatchingRooms = filterRooms(ROOMS, {
      attendees: nextAttendees,
      equipment: nextEquipment,
    });

    setAttendees(nextAttendees);
    setEquipment(nextEquipment);

    if (!nextMatchingRooms.some(room => room.id === roomId)) {
      setRoomId(nextMatchingRooms[0]?.id ?? '');
    }

    setResult(null);
    setError('');
  }

  function toggleEquipment(item: string) {
    const nextEquipment = equipment.includes(item)
      ? equipment.filter(value => value !== item)
      : [...equipment, item];

    updateFilters(attendees, nextEquipment);
  }

  function changeRoom(nextRoomId: string) {
    setRoomId(nextRoomId);
    setResult(null);
    setError('');
  }

  function check() {
    setResult(null);
    setError('');

    if (!selectedRoom) {
      setError('No matching rooms are available for selection.');
      return;
    }

    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }

    const startMinutes = toMinutes(start);
    const endMinutes = endOfDay ? 1440 : toMinutes(end);
    const nowMinutes = toMinutes(now);

    if (startMinutes >= endMinutes) {
      setError('The end time must be after the start time.');
      return;
    }

    const available = checkRoom(ROOMS, selectedRoom.id, {
      start: startMinutes,
      end: endMinutes,
      now: nowMinutes,
    });

    setResult(available);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <h2>Find a Room</h2>

      <div className="row">
        <label>
          Number of attendees
          <input
            type="number"
            min="1"
            value={attendees}
            onChange={event =>
              updateFilters(Number(event.target.value), equipment)
            }
          />
        </label>
      </div>

      <h3>Required equipment</h3>

      <div className="row">
        {EQUIPMENT.map(item => (
          <label className="inline" key={item}>
            <input
              type="checkbox"
              checked={equipment.includes(item)}
              onChange={() => toggleEquipment(item)}
            />
            {item}
          </label>
        ))}
      </div>

      <h2>Matching Rooms</h2>

      {matchingRooms.length === 0 ? (
        <p className="error">
          No rooms match your capacity and equipment requirements.
        </p>
      ) : (
        <>
          <p>
            Found {matchingRooms.length} matching room(s).
          </p>

          <div className="row">
            <label>
              Select room
              <select
                value={selectedRoom?.id ?? ''}
                onChange={event => changeRoom(event.target.value)}
              >
                {matchingRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} — {room.capacity} seats
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedRoom && (
            <>
              <p>
                <strong>Capacity:</strong> {selectedRoom.capacity}
              </p>

              <p>
                <strong>Equipment:</strong>{' '}
                {selectedRoom.equipment.join(', ')}
              </p>

              <p>
                <strong>Room status:</strong>{' '}
                {selectedRoom.blocked ? 'Blocked' : 'Open'}
              </p>

              <h2>Check Availability</h2>

              <div className="row">
                <label>
                  Current time
                  <input
                    type="time"
                    value={now}
                    onChange={event => {
                      setNow(event.target.value);
                      setResult(null);
                    }}
                  />
                </label>

                <label>
                  Start
                  <input
                    type="time"
                    value={start}
                    onChange={event => {
                      setStart(event.target.value);
                      setResult(null);
                    }}
                  />
                </label>

                <label>
                  End
                  <input
                    type="time"
                    value={end}
                    disabled={endOfDay}
                    onChange={event => {
                      setEnd(event.target.value);
                      setResult(null);
                    }}
                  />
                </label>

                <label className="inline">
                  <input
                    type="checkbox"
                    checked={endOfDay}
                    onChange={event => {
                      setEndOfDay(event.target.checked);
                      setResult(null);
                    }}
                  />
                  Ends at 24:00
                </label>
              </div>

              <button onClick={check}>
                Check availability
              </button>

              {error && <p className="error">{error}</p>}

              {result !== null && (
                <p
                  className={`result ${
                    result ? 'available' : 'unavailable'
                  }`}
                >
                  {result ? 'Available' : 'Unavailable'}
                </p>
              )}

              <h2>Existing Bookings</h2>

              <ul>
                {selectedRoom.bookings.length > 0 ? (
                  selectedRoom.bookings.map((booking, index) => (
                    <li key={index}>
                      {fmt(booking.start)}–{fmt(booking.end)}
                    </li>
                  ))
                ) : (
                  <li>none</li>
                )}
              </ul>
            </>
          )}
        </>
      )}
    </main>
  );
}