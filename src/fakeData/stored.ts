import { Group,  dummyId } from '../types/group';

export const groups = [
  {
    "id": 0,
    "name": "group1",
    "tabItems": [
      {
        "title": "The Best Online Courses To Learn Node Js – Quick Code – Medium",
        "url": "https://medium.com/quick-code/the-best-tutorials-to-learn-node-js-34818d757013",
        "id": 0,
        "isSelected": false
      },
      {
        "title": "Tab 2",
        "url": "https://www.google.com",
        "id": 1,
        "isSelected": false
      },
      {
        "title": "Tab 3",
        "url": "www.kw.ac.kr",
        "id": 2,
        "isSelected": false
      },
      {
        "title": "Tab 4",
        "url": "tab4.com",
        "id": 3,
        "isSelected": false
      },
      {
        "title": "Tab 5",
        "url": "tab5.com",
        "id": 4,
        "isSelected": false
      },
      {
        "title": "Tab 6",
        "url": "tab6.com",
        "id": 5,
        "isSelected": false
      },
      {
        "title": "Tab 7",
        "url": "tab7.com",
        "isSelected": false,
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