import { Tab } from '../types/tab';
import { TabItem } from '../types/tabItem';
import { Group, NewGroup } from '../types/group';
import { delay } from 'q';
import { NODE_ENV } from '../config/constants';
import { tabs } from '../fakeData/tabs.json';
import { groups } from '../fakeData/stored.json';

function generateId() {
  return tabs.length;
}

function isDev() {
  return (NODE_ENV === 'development');
}

async function getTabs(): Promise<Tab[]> {
  if (isDev()) {
    await delay(1);
    return tabs;
  }
  return new Promise<Tab[]>((resolve) => chrome.tabs.query({ currentWindow: true }, resolve));
}

async function getStoredGroups(): Promise<Group[]> {
  if (isDev()) {
    await (1);
    return groups;
  }

  return new Promise<Group[]>((resolve) => {
    chrome.storage.sync.get('groups', (data: any) => { console.log(data); resolve(data.groups) });
  });
}

async function storeGroup(group: NewGroup): Promise<Group> {
  const newGroup = { ...group, id: generateId() };
  if (NODE_ENV === 'development') {
    await delay(1);
    return newGroup;
  }

  let groups = await getStoredGroups();
  if (!groups) groups = [newGroup];
  else groups.push(newGroup);

  return new Promise<Group>((resolve) => chrome.storage.sync.set({ groups }, () => resolve(newGroup)));
}

function mapTabs2Items(tabs: Tab[]): TabItem[] {
  return tabs.map((tab) => {
    const { id, title, url, favIconUrl } = tab;
    return {
      id,
      title,
      url,
      favIconUrl,
      isSelected:false
    } as TabItem;
  });
}

export {
  getTabs,
  getStoredGroups,
  storeGroup,
  mapTabs2Items
}