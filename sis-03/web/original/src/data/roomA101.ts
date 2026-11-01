import type { Room } from '@/lib/availability';

export const CURRENT_TIME_MINUTES = 540;

export const ROOM_A101: Room = {
  name: 'Room A-101',
  blocked: false,
  bookings: [{ id: 'bk-1', start: 600, end: 660, title: 'Lecture' }],
};
