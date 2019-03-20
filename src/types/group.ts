import { TabItem } from './tabItem';

export interface Group {
  id: number,
  name: string,
  tabItems: TabItem[]
}

export interface NewGroup {
  name: string,
  tabItems: TabItem[]
}

export const dummyId = 10000000;
export function isDummy(group: Group){ return dummyId === group.id; }
export const emptyGroup: Group = { id: dummyId, name: '', tabItems: [] };