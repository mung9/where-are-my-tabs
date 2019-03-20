import { Group,  dummyId } from '../types/group';

export const groups = [
  {
    "id": 0,
    "name": "group1",
    "tabItems": [
      {
        "title": "Naver",
        "url": "https://www.naver.com",
        "favIconUrl": "favicon.ico",
        "id": 0,
        "isSelected": false
      },
      {
        "title": "Tab 2",
        "url": "https://www.google.com",
        "favIconUrl": "favicon.ico",
        "id": 1,
        "isSelected": false
      },
      {
        "title": "Tab 3",
        "url": "www.kw.ac.kr",
        "favIconUrl": "favicon.ico",
        "id": 2,
        "isSelected": false
      },
      {
        "title": "Tab 4",
        "url": "tab4.com",
        "favIconUrl": "favicon.ico",
        "id": 3,
        "isSelected": false
      },
      {
        "title": "Tab 5",
        "url": "tab5.com",
        "favIconUrl": "favicon.ico",
        "id": 4,
        "isSelected": false
      },
      {
        "title": "Tab 6",
        "url": "tab6.com",
        "favIconUrl": "favicon.ico",
        "id": 5,
        "isSelected": false
      },
      {
        "title": "Tab 7",
        "url": "tab7.com",
        "isSelected": false,
        "favIconUrl": "favicon.ico",
        "id": 5,
      }
    ]
  }
];


export function postGroup(group: Group): Group {
  groups.push(group);
  return group;
}

export function putGroup(group: Group) {
  if (group.id === dummyId) return postGroup(group);
  const index = groups.findIndex((g) => g.id === group.id);
  groups[index] = group;
  return { ...groups[index] };
}

export function removeGroup(group: Group) {
  const index = groups.findIndex((g) => g.id === group.id);
  return groups.splice(index, 1)[0];
}