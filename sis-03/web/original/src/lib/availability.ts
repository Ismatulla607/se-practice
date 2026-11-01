import { MINUTES_PER_DAY, formatMinutes, parseTimeInput } from '@/lib/time';

export const MAX_DURATION_MINUTES = 120;

export interface Booking {
  id: string;
  start: number;
  end: number;
  title: string;
}

export interface Room {
  name: string;
  blocked: boolean;
  bookings: Booking[];
}

export type RequestCheck =
  | { ok: true; start: number; end: number }
  | { ok: false; message: string };

export type AvailabilityResult =
  | { status: 'available' }
  | { status: 'blocked' }
  | { status: 'conflict'; booking: Booking };

export function validateRequest(startValue: string, endValue: string, now: number): RequestCheck {
  const start = parseTimeInput(startValue);
  const end = parseTimeInput(endValue);

  if (start === null || end === null) {
    return { ok: false, message: 'Enter both a start time and an end time.' };
  }
  if (start < 0 || end > MINUTES_PER_DAY) {
    return { ok: false, message: 'Times must fall within a single day, from 00:00 to 24:00.' };
  }
  if (end <= start) {
    return { ok: false, message: 'The end time must be later than the start time.' };
  }
  if (start <= now) {
    return {
      ok: false,
      message: `The start time must be later than the current time (${formatMinutes(now)}).`,
    };
  }
  const duration = end - start;
  if (duration > MAX_DURATION_MINUTES) {
    return {
      ok: false,
      message: `A booking can be at most ${MAX_DURATION_MINUTES} minutes. This request is ${duration} minutes long.`,
    };
  }
  return { ok: true, start, end };
}

export function checkAvailability(room: Room, start: number, end: number): AvailabilityResult {
  if (room.blocked) {
    return { status: 'blocked' };
  }
  const conflict = room.bookings.find((booking) => start < booking.end && booking.start < end);
  if (conflict) {
    return { status: 'conflict', booking: conflict };
  }
  return { status: 'available' };
}
