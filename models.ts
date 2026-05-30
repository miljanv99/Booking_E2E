export type ChildrenData = {
  numberOfChildren: number;
  ages?: number[];
};

export interface PeopleAndRooms {
  numberOfPeople: number;
  children: ChildrenData;
  numberOfRooms: number;
}
