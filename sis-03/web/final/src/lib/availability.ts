import { MINUTES_PER_DAY, formatMinutes, parseMinuteInput } from '@/lib/time';

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
  | { status: 'ok'; start: number; end: number }
  | { status: 'invalid'; message: string }
  | { status: 'out-of-range'; message: string };

export type AvailabilityResult =
  | { status: 'available' }
  | { status: 'blocked' }
  | { status: 'conflict'; booking: Booking };

export type CheckOutcome =
  | { kind: 'checked'; start: number; end: number; result: AvailabilityResult }
  | { kind: 'out-of-range' };

export function validateRequest(startValue: string, endValue: string, now: number): RequestCheck {
  const start = parseMinuteInput(startValue);
  const end = parseMinuteInput(endValue);

  if (start === null || end === null) {
    return { status: 'invalid', message: 'Enter whole minutes for both the start and the end.' };
  }
  if (start < 0 || start > MINUTES_PER_DAY || end < 0 || end > MINUTES_PER_DAY) {
    return {
      status: 'out-of-range',
      message: `Start and end must be between 0 and ${MINUTES_PER_DAY} minutes.`,
    };
  }
  if (start <= now) {
    return {
      status: 'invalid',
      message: `The start must be later than the current time, ${now} minutes (${formatMinutes(now)}).`,
    };
  }
  if (end <= start) {
    return { status: 'invalid', message: 'The end must be greater than the start.' };
  }
  const duration = end - start;
  if (duration > MAX_DURATION_MINUTES) {
    return {
      status: 'invalid',
      message: `A booking can be at most ${MAX_DURATION_MINUTES} minutes. This request is ${duration} minutes.`,
    };
  }
  return { status: 'ok', start, end };
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
