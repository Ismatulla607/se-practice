import type { Booking, Room } from '@/lib/availability';

export const CURRENT_TIME_MINUTES = 540;

export const ROOM_A101_BOOKINGS: Booking[] = [{ id: 'bk-1', start: 600, end: 660, title: 'Lecture' }];

export const TEST_BOOKING: Booking = { id: 'test-1', start: 700, end: 760, title: 'Test booking' };

export const ROOM_A101_NAME = 'Room A-101';
