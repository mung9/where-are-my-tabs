import React, { Component, FormEvent } from 'react';
import Header from './components/header';
import GroupBox from './components/group';
import { getTabs, getStoredGroups, storeGroup, mapTabs2Items } from './services/chrome';
import { UpdateInfo } from './types/UpdateInfo';
import { Group, NewGroup } from './types/group';
import { TabItem } from './types/tabItem';
import logo from './logo.svg';
import './App.css';
import { exists } from 'fs';

class App extends Component {
  state: AppState = {
    groups: [],
    editGroup: { id: undefined, name: '', tabItems: [] },
    query: '',
    updates: {}
  }

  async componentDidMount() {
    const editGroup = { ...this.state.editGroup };
    const curTabs = await getTabs();
    editGroup.tabItems = mapTabs2Items(curTabs);

    const groups = await getStoredGroups();

    this.setState({ groups, editGroup });
  }

  handleQuery = (query: string) => {
    console.log('query: ', query);
  }

  handleChangeGroupName = (e: React.ChangeEvent, originalGroup: Group) => {
    const group = { ...originalGroup };
    const name = (e.currentTarget as HTMLInputElement).value;
    group.name = name;
    if (!group.id) return this.setState({ editGroup: group });

    const updates = { ...this.state.updates };
    updates[group.id] = { group };
    this.setState({ updates });
  }

  handleSelectTab = (e: React.MouseEvent, group: Group) => {
    const tabIdInString = (e.currentTarget as HTMLLIElement).getAttribute('value');
    if (!tabIdInString) return console.log('The id of the group is required');

    const tabId = parseInt(tabIdInString);
    // const tabItem = group.tabItems.find((item) => item.id === id);
    // if (!tabItem) return console.log("The tab item with given id does not exist.");

    if (!group.id) {
      const editGroup = { ...group };
      const tabItems = [...editGroup.tabItems];
      const index = tabItems.findIndex((item) => item.id === tabId);
      tabItems[index] = { ...tabItems[index] };
      tabItems[index].isSelected = !tabItems[index].isSelected;
      editGroup.tabItems = tabItems;
      this.setState({ editGroup });
      return;
    }

    const updates = { ...this.state.updates };
    if (!updates[group.id]) return console.log('Only the tab of the group which is allowed to be updated can be selected.');

    const update: UpdateInfo = { group: { ...updates[group.id].group } };
    const index = update.group.tabItems.findIndex((item) => item.id === tabId);
    if (index < 0) return console.log('The tab item with the given id does not exists.');

    const tabItems = [...update.group.tabItems];
    tabItems[index] = { ...tabItems[index] };
    tabItems[index].isSelected = !tabItems[index].isSelected;

    update.group.tabItems = tabItems;

    updates[group.id] = update;
    this.setState({ updates });
  }

  handleGroup = async () => {
    const editGroup = this.state.editGroup;
    if (editGroup === null) return;

    const groups = [...this.state.groups];
    const group = await storeGroup(editGroup);
    groups.push(group);
    this.setState({ groups, groupName: '' });
  }

  handleChange = (e: React.ChangeEvent): void => {
    const { name, value } = (e.currentTarget as HTMLInputElement);
    this.setState({ [name]: value });
  }

  toggleUpdate = (group: Group) => {
    if (!group.id) return console.log('invalid group: no id');

    const groups = [...this.state.groups];
    const index = groups.findIndex((g) => g.id === group.id);
    groups[index] = { ...group };

    const tabItems = [...group.tabItems];
    groups[index].tabItems = tabItems;

    const updates = { ...this.state.updates };
    if (group.id in updates) {
      delete updates[group.id];
    }
    else {
      const originalGroup = this.state.groups.find((g) => g.id === group.id);
      if (!originalGroup) return console.log('The group with the given id does not exists');
      const updateInfo: UpdateInfo = { group: { ...originalGroup } };
      updates[group.id] = updateInfo;
    }

    this.setState({ updates });
  }

  renderGroups = () => {
    const updates = this.state.updates;

    return (
      <div className="groups-container">
        {
          // group list
          this.state.groups.map((group, index) => {
            if (!group.id) return console.log('A tab does not have id property.');

            const isEditable = group.id in updates;
            return (
              <div className="group-row">
                <GroupBox
                  key={index}
                  group={isEditable ? updates[group.id].group : group}
                  isEditable={isEditable}
                  isDetailed={true}
                  toggleUpdate={this.toggleUpdate}
                  onChangeName={(e: React.ChangeEvent) => { this.handleChangeGroupName(e, group) }}
                  onSelectTab={(e: React.MouseEvent) => { this.handleSelectTab(e, group) }}
                />
              </div>
            );
          })
          // end
        }
      </div>
    );
  }

  renderHeader = () => {
    const { editGroup, query } = this.state;
    return (
      <Header
        query={query}
        group={editGroup}
        onChangeGroupName={(e: React.ChangeEvent) => { this.handleChangeGroupName(e, editGroup) }}
        onSelectTab={(e: React.MouseEvent) => { this.handleSelectTab(e, editGroup) }}
        onGroup={this.handleGroup}
        onQuery={this.handleQuery}
      />
    );
  }

  render() {
    return (
      <div className="container">
        {this.renderHeader()}
        <div className='groups-layout'>
          {this.renderGroups()}
        </div>
      </div>
    );
  }
}

export interface AppState {
  groups: Group[],
  editGroup: Group,
  query: string,
  updates: { [key: number]: UpdateInfo }
}

export default App;
