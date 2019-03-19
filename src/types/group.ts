import { TabItem } from './tabItem';

export interface Group {
  id: number | undefined,
  name: string,
  tabItems: TabItem[]
}

export interface NewGroup{
  name: string,
  tabItems: TabItem[]
}