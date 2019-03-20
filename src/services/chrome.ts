import { Tab } from '../types/tab';
import { TabItem } from '../types/tabItem';
import { Group, NewGroup } from '../types/group';
import { delay, reject } from 'q';
import { NODE_ENV } from '../config/constants';
import { tabs } from '../fakeData/tabs.json';
// import { groups } from '../fakeData/stored.js';
import { groups, postGroup, removeGroup } from '../fakeData/stored';
import { resolve } from 'path';

function generateId() {
  return Date.now();
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
  if (isDev()) {
    await delay(1);
    postGroup(newGroup);
    return newGroup;
  }

  let groups = await getStoredGroups();
  if (!groups) groups = [newGroup];
  else groups.push(newGroup);

  console.log('new group:', newGroup);
  return new Promise<Group>((resolve) => chrome.storage.sync.set({ groups }, () => resolve(newGroup)));
}

async function updateGroup(group: Group): Promise<Group> {
  if (isDev()) {
    await delay(1);
    updateGroup(group);
    return group;
  }

  let groups = await getStoredGroups();
  if (!groups) reject("The group with given id does not exists");
  const index = groups.findIndex((g) => g.id === group.id);
  groups[index] = group;

  return new Promise<Group>((resolve) => chrome.storage.sync.set({ groups }, () => resolve(group)));
}

async function deleteGroup(group: Group): Promise<Group> {
  if (isDev()) {
    await delay(1);
    return removeGroup(group);
  }

  let groups = await getStoredGroups();
  if (!groups) reject("The group with given id does not exists");
  const index = groups.findIndex((g) => g.id === group.id);
  const deletedGroup = groups.splice(index, 1)[0];

  return new Promise<Group>((resolve) => chrome.storage.sync.set({ groups }, () => resolve(deletedGroup)));
}

async function createTab(url: string, index: number, windowId?: number) {
  const properties = { windowId, index, url };
  return new Promise<Tab>((resolve) => {
    chrome.tabs.create(properties, resolve);
  });
}

async function createTabs(urls: string[]) {
  if (NODE_ENV == 'development') {
    urls.forEach((url) => console.log(`Opening a tab with url ${url}`));
    return;
  }

  const currentTabs = await getTabs();
  const firstIndex = currentTabs.length;
  return new Promise<Tab[]>(
    async (resolve) => {
      const ps = urls.map(async (url, index) => {
        return await createTab(url, firstIndex + index);
      });
      const createdTabs = await Promise.all(ps);
      resolve(createdTabs);
    }
  )
}

function mapTabs2Items(tabs: Tab[]): TabItem[] {
  return tabs.map((tab) => {
    const { id, title, url, favIconUrl } = tab;
    return {
      id,
      title,
      url,
      favIconUrl,
      isSelected: false
    } as TabItem;
  });
}

export {
  getTabs,
  getStoredGroups,
  storeGroup,
  updateGroup,
  deleteGroup,
  createTabs,
  mapTabs2Items
}