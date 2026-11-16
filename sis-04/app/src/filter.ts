import type { Room } from './rooms';

type FilterOptions = {
  attendees: number;
  equipment: string[];
};

export function filterRooms(
  rooms: Room[],
  { attendees, equipment }: FilterOptions
): Room[] {
  return rooms.filter(room => {
    const hasCapacity = room.capacity >= attendees;

    const hasEquipment = equipment.every(item =>
      room.equipment.includes(item)
    );

    return hasCapacity && hasEquipment;
  });
}