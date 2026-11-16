import { describe, test, it, expect } from 'vitest';
import { canBook, checkRoom } from './booking';
import type { Room } from './rooms';

describe('canBook validation and booking logic', () => {
  test('T01 B3 AC4 - 660–720 (touching after)', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(true);
  });

  test('T02 AC1 - 540–570 (starts now)', () => {
    const result = canBook({
      start: 540,
      end: 570,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T03 AC1 - 720–720 (zero duration)', () => {
    const result = canBook({
      start: 720,
      end: 720,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T04 AC1 - 750–720 (reversed)', () => {
    const result = canBook({
      start: 750,
      end: 720,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T05 AC1 - 1380–1441 (past day end)', () => {
    const result = canBook({
      start: 1380,
      end: 1441,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T06 B1 AC2 - 720–840 (120 minutes)', () => {
    const result = canBook({
      start: 720,
      end: 840,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(true);
  });

  test('T07 B2 AC2 - 720–841 (121 minutes)', () => {
    const result = canBook({
      start: 720,
      end: 841,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T08 B3 AC4 - 570–600 (touching before)', () => {
    const result = canBook({
      start: 570,
      end: 600,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(true);
  });

  test('T09 B4 AC4 - 630–690 (partial overlap)', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T10 AC4 - 570–690 (contains booking)', () => {
    const result = canBook({
      start: 570,
      end: 690,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T11 AC4 - 615–645 (inside booking)', () => {
    const result = canBook({
      start: 615,
      end: 645,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T12 AC4 - 600–660 (identical interval)', () => {
    const result = canBook({
      start: 600,
      end: 660,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T13 AC3 - 660–720, blocked = true', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: true,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('T14 AC4 - 630–690, bookings = []', () => {
    const result = canBook({
      start: 630,
      end: 690,
      now: 540,
      blocked: false,
      bookings: [],
    });
    expect(result).toBe(true);
  });

  test('AC5 - 660–720, compare bookings before and after', () => {
    const bookings = [{ start: 600, end: 660 }];
    const bookingsSnapshot = JSON.parse(JSON.stringify(bookings));
    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings,
    });
    expect(result).toBe(true);
    expect(bookings).toEqual(bookingsSnapshot);
  });

  test('X1 - 1320–1440', () => {
    const result = canBook({
      start: 1320,
      end: 1440,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(true);
  });

  test('X2 - 0–60, now = 540', () => {
    const result = canBook({
      start: 0,
      end: 60,
      now: 540,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });
    expect(result).toBe(false);
  });

  test('X3 - request overlaps the second of multiple bookings', () => {
    const result = canBook({
      start: 720,
      end: 750,
      now: 540,
      blocked: false,
      bookings: [
        { start: 600, end: 660 },
        { start: 735, end: 780 },
      ],
    });
    expect(result).toBe(false);
  });

  test('X4 - reversed existing booking does not overlap 660–720', () => {
    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings: [{ start: 700, end: 650 }],
    });
    expect(result).toBe(true);
  });
});
const TEST_ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
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
    equipment: ['Projector', 'Computers'],
    blocked: false,
    bookings: [{ start: 660, end: 720 }],
  },
  {
    id: 'd406',
    name: 'Room D-406',
    capacity: 15,
    equipment: ['Projector'],
    blocked: true,
    bookings: [],
  },
];

describe('Room-specific availability', () => {
  it('F3: blocked room is never available', () => {
    expect(
      checkRoom(TEST_ROOMS, 'd406', {
        start: 720,
        end: 780,
        now: 540,
      })
    ).toBe(false);
  });

  it('F5: selected room uses its own bookings', () => {
    expect(
      checkRoom(TEST_ROOMS, 'a101', {
        start: 630,
        end: 690,
        now: 540,
      })
    ).toBe(false);

    expect(
      checkRoom(TEST_ROOMS, 'b204', {
        start: 630,
        end: 690,
        now: 540,
      })
    ).toBe(true);
  });

  it('F5: unknown room is unavailable', () => {
    expect(
      checkRoom(TEST_ROOMS, 'unknown', {
        start: 720,
        end: 780,
        now: 540,
      })
    ).toBe(false);
  });
});