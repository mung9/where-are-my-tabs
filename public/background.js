const GROUP_CURRENT_TABS = "group-current-tabs"

chrome.commands.onCommand.addListener(async function (command) {
  if (command === GROUP_CURRENT_TABS) {
    alert("이거야!");

    const tabItems = await getTabItems();
    const group = { name: await generateGroupName(), tabItems };
    await storeGroup(group);
  }
});

function generateId() {
  return Date.now();
}

async function generateGroupName() {
  let groupName = new Date().toDateString();
  const groups = await getStoredGroups();
  let exist = true;

  const checkGroupName = (g) => g.name === groupName;
  exist = groups.find(checkGroupName);
  let index = 0;
  console.log(groupName);
  while (exist) {
    console.log(groupName);
    ++index;
    if (index === 1) groupName += `(${index})`;
    else groupName = groupName.slice(0, -3) + `(${index})`;
    exist = groups.find(checkGroupName);
  }

  console.log(groupName);
  return groupName;
}

function getTabItems() {
  return new Promise((resolve) => chrome.tabs.query({ currentWindow: true }, (tabs) => { return resolve(mapTabs2Items(tabs)); }));
}

function getStoredGroups() {
  return new Promise((resolve) => {
    chrome.storage.local.get('groups', (data) => { console.log('getStoredGroups:', data); resolve(data.groups || []) });
  });
}

async function storeGroup(group) {
  const newGroup = { ...group, id: generateId() };

  let groups = await getStoredGroups();
  if (!groups) groups = [newGroup];
  else groups.push(newGroup);

  console.log('new group:', newGroup);
  return new Promise((resolve) => chrome.storage.local.set({ groups }, () => resolve(newGroup)));
}

async function updateGroup(group) {
  let groups = await getStoredGroups();
  if (!groups) reject("The group with given id does not exists");
  const index = groups.findIndex((g) => g.id === group.id);
  groups[index] = group;

  return new Promise((resolve) => chrome.storage.local.set({ groups }, () => resolve(group)));
}

async function deleteGroup(group) {
  let groups = await getStoredGroups();
  if (!groups) reject("The group with given id does not exists");
  const index = groups.findIndex((g) => g.id === group.id);
  const deletedGroup = groups.splice(index, 1)[0];

  return new Promise((resolve) => chrome.storage.local.set({ groups }, () => resolve(deletedGroup)));
}

function openTab(url, index, windowId) {
  const properties = { windowId, index, url };
  return new Promise((resolve) => {
    chrome.tabs.create(properties, resolve);
  });
}

async function openTabs(urls) {
  const currentTabs = await getTabItems();
  const firstIndex = currentTabs.length;
  return new Promise(
    async (resolve) => {
      const ps = urls.map(async (url, index) => {
        return await openTab(url, firstIndex + index);
      });
      const createdTabs = await Promise.all(ps);
      resolve(createdTabs);
    }
  )
}

function mapTabs2Items(tabs) {
  return tabs.map((tab) => {
    const { id, title, url, favIconUrl } = tab;
    return {
      id,
      title,
      url,
      favIconUrl,
      isSelected: false
    }
  });
}