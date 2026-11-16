import { describe, expect, it } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import type { Room } from './rooms';

const TEST_ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'b204',
    name: 'Room B-204',
    capacity: 10,
    equipment: ['Whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'c305',
    name: 'Room C-305',
    capacity: 30,
    equipment: ['Projector', 'Whiteboard', 'Computers'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'd406',
    name: 'Room D-406',
    capacity: 15,
    equipment: ['Projector', 'Computers'],
    blocked: true,
    bookings: [],
  },
];

describe('Room filtering', () => {
  it('F1 B5: includes a room when capacity equals attendees', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 20,
      equipment: [],
    });

    expect(result.map(room => room.id)).toContain('a101');
  });

  it('F1 B6: excludes a room when capacity is one below attendees', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 21,
      equipment: [],
    });

    expect(result.map(room => room.id)).not.toContain('a101');
  });

  it('F2: requires ALL selected equipment', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 10,
      equipment: ['Projector', 'Computers'],
    });

    expect(result.map(room => room.id)).toEqual(['c305', 'd406']);
  });

  it('F2: excludes rooms missing one required equipment item', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 10,
      equipment: ['Projector', 'Whiteboard', 'Computers'],
    });

    expect(result.map(room => room.id)).toEqual(['c305']);
  });
});

describe('Filtering and booking integration', () => {
  it('F4: returns an empty list when no room matches capacity and equipment', () => {
    const result = filterRooms(TEST_ROOMS, { attendees: 31, equipment: ['Computers'] });
    expect(result).toEqual([]);
  });

  it('INT: filterRooms result uses the selected room own bookings in checkRoom', () => {
    const candidates = filterRooms(TEST_ROOMS, { attendees: 10, equipment: ['Projector'] });
    const blockedRoom = candidates.find(room => room.id === 'd406');
    const openRoom = candidates.find(room => room.id === 'a101');
    expect(blockedRoom).toBeDefined();
    expect(openRoom).toBeDefined();
    expect(checkRoom(candidates, 'd406', { start: 720, end: 780, now: 540 })).toBe(false);
    expect(checkRoom(candidates, 'a101', { start: 720, end: 780, now: 540 })).toBe(true);
  });
});
