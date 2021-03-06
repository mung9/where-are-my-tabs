import { Tab } from '../types/tab';
import { TabItem } from '../types/tabItem';
import { Group, NewGroup } from '../types/group';
import { delay, reject } from 'q';
import { NODE_ENV } from '../config/constants';
import { tabs } from '../fakeData/tabs.json';
// import { groups } from '../fakeData/stored.js';
import { groups, postGroup, removeGroup } from '../fakeData/stored';

interface BackgroundWindow extends Window {
  createWindow: (createData: chrome.tabs.CreateProperties) => Promise<chrome.windows.Window>
  generateId: () => number;
  generateGroupName: () => string;
  getTabItems: () => Promise<TabItem[]>;
  getStoredGroups: () => Promise<Group[]>;
  storeGroup: (group: NewGroup) => Promise<Group>;
  updateGroup: (group: Group) => Promise<Group>;
  deleteGroup: (group: Group) => Promise<Group>
  openTab: (url: string, index: number, windowId?: number) => Promise<Tab>
  openTabs: (urls: string[], windowId?: number) => Promise<Tab[]>
  mapTabs2Items: (tabs: Tab[]) => TabItem[]
}

function getBackgroundPage() {
  return new Promise<BackgroundWindow>((resolve) => chrome.runtime.getBackgroundPage((window) => resolve(window as BackgroundWindow)));
}

function isDev() {
  return (NODE_ENV === 'development');
}


async function generateId() {
  if (isDev()) {
    return Date.now();
  }

  const background = await getBackgroundPage()
  return background.generateId();
}

async function generateGroupName() {
  if (isDev()) {
    return new Date().toDateString();
  }

  const background = await getBackgroundPage();
  return background.generateGroupName();
}

async function getTabItems(): Promise<TabItem[]> {
  if (isDev()) {
    await delay(1);
    return tabs;
  }

  const background = await getBackgroundPage();
  return background.getTabItems();
}

async function getStoredGroups(): Promise<Group[]> {
  if (isDev()) {
    await (1);
    return groups;
  }

  const background = await getBackgroundPage();
  return background.getStoredGroups();
}

async function storeGroup(group: NewGroup): Promise<Group> {
  if (isDev()) {
    const generatedId = await generateId();
    const newGroup = { ...group, id: generatedId };
    await delay(1);
    postGroup(newGroup);
    return newGroup;
  }

  const background = await getBackgroundPage();
  return background.storeGroup(group);
}

async function updateGroup(group: Group): Promise<Group> {
  if (isDev()) {
    await delay(1);
    updateGroup(group);
    return group;
  }

  const background = await getBackgroundPage();
  return background.updateGroup(group);
}

async function deleteGroup(group: Group): Promise<Group> {
  if (isDev()) {
    await delay(1);
    return removeGroup(group);
  }

  const background = await getBackgroundPage();
  return background.deleteGroup(group);
}

// async function openTab(url: string, index: number, windowId?: number) {
//   const background = await getBackgroundPage();
//   return background.openTab(url, index, windowId);
// }

async function openTabs(urls: string[], inNewWindow = true) {
  if (isDev()) {
    urls.forEach((url) => console.log(`Opening a tab with url ${url}`));
    return;
  }

  const background = await getBackgroundPage();
  console.log('background:', background);
  let windowId = undefined;
  if (inNewWindow) {
    const window = await background.createWindow({});
    windowId = window.id;
  }
  
  return background.openTabs(urls, windowId);
}

export {
  generateGroupName,
  getTabItems,
  getStoredGroups,
  storeGroup,
  updateGroup,
  deleteGroup,
  openTabs
}