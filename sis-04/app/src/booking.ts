import type { Room } from './rooms';
type Interval = {
  start: number;
  end: number;
};

type BookingInput = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
};

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: BookingInput): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;

  for (const b of bookings) {
    if (start < b.end && end > b.start) {
      return false;
    }
  }

  return true;
}
type RoomCheckInput = {
  start: number;
  end: number;
  now: number;
};

export function checkRoom(
  rooms: Room[],
  roomId: string,
  { start, end, now }: RoomCheckInput
): boolean {
  const room = rooms.find(room => room.id === roomId);

  if (!room) {
    return false;
  }

  return canBook({
    start,
    end,
    now,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}