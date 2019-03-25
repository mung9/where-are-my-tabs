import { Tab } from '../types/tab';
import { TabItem } from '../types/tabItem';
import { Group, NewGroup } from '../types/group';
import { delay, reject } from 'q';
import { NODE_ENV } from '../config/constants';
import { tabs } from '../fakeData/tabs.json';
// import { groups } from '../fakeData/stored.js';
import { groups, postGroup, removeGroup } from '../fakeData/stored';
import { resolve } from 'path';

interface MyWindow extends Window {
  generateId: () => number;
  generateGroupName: () => string;
  getTabItems: () => Promise<TabItem[]>;
  getStoredGroups: () => Promise<Group[]>;
  storeGroup: (group: NewGroup) => Promise<Group>;
  updateGroup: (group: Group) => Promise<Group>;
  deleteGroup: (group: Group) => Promise<Group>
  openTab: (url: string, index: number, windowId?: number) => Promise<Tab>
  openTabs: (urls: string[]) => Promise<Tab[]>
  mapTabs2Items: (tabs: Tab[]) => TabItem[]
}

let res = null;
if (chrome && chrome.extension) {
  res = chrome.extension.getBackgroundPage();
}
if (!res) {
  console.log('!!!!!');
}
const background = res as MyWindow;
console.log('background:', background);

function isDev() {
  return (NODE_ENV === 'development');
}

function generateId() {
  if(isDev()){
    return Date.now();
  }
  
  return background.generateId();
}

async function generateGroupName() {
  if(isDev()){
    return new Date().toDateString();
  }

  return await background.generateGroupName();
}

async function getTabItems(): Promise<TabItem[]> {
  if (isDev()) {
    await delay(1);
    return tabs;
  }

  return background.getTabItems();
}

async function getStoredGroups(): Promise<Group[]> {
  if (isDev()) {
    await (1);
    return groups;
  }

  return background.getStoredGroups();
}

async function storeGroup(group: NewGroup): Promise<Group> {
  if (isDev()) {
    const newGroup = { ...group, id: generateId() };
    await delay(1);
    postGroup(newGroup);
    return newGroup;
  }

  return background.storeGroup(group)
}

async function updateGroup(group: Group): Promise<Group> {
  if (isDev()) {
    await delay(1);
    updateGroup(group);
    return group;
  }

  return background.updateGroup(group);
}

async function deleteGroup(group: Group): Promise<Group> {
  if (isDev()) {
    await delay(1);
    return removeGroup(group);
  }

  return background.deleteGroup(group);
}

async function openTab(url: string, index: number, windowId?: number) {
  return background.openTab(url, index, windowId);
}

async function openTabs(urls: string[]) {
  if (isDev()) {
    urls.forEach((url) => console.log(`Opening a tab with url ${url}`));
    return;
  }

  return background.openTabs(urls);
}

function mapTabs2Items(tabs: Tab[]): TabItem[] {
  if (isDev()) {
    // return tabs.map((tab) => {
    //   const { id, title, url, favIconUrl } = tab;
    //   return {
    //     id,
    //     title,
    //     url,
    //     favIconUrl,
    //     isSelected: false
    //   }
    // });
  }

  return background.mapTabs2Items(tabs);
}

export {
  generateGroupName,
  getTabItems,
  getStoredGroups,
  storeGroup,
  updateGroup,
  deleteGroup,
  openTabs,
  mapTabs2Items
}