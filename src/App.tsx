/**
 * Entry Point
 */

import React, { Component, KeyboardEvent } from 'react';
import Header from './components/header';
import GroupBox from './components/group';
import { getTabItems, getStoredGroups, storeGroup, updateGroup, deleteGroup, openTabs, generateGroupName } from './services/chrome';
import { UpdateInfo } from './types/UpdateInfo';
import { Group, isDummy, emptyGroup } from './types/group';
import { TabItem } from './types/tabItem';
import KeyCode from './common/key';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';

type OpeningTabHandler = {
  (urls: string[]): void;
  (e: React.MouseEvent, group: Group): void;
}

class App extends Component {
  state: AppState = {
    groups: [],
    editGroup: emptyGroup,
    query: '',
    updates: {},
    openInNewWindow: false,
  }

  async componentDidMount() {
    document.addEventListener("keydown", this.handleCtrlKeyDown);
    document.addEventListener("keyup", this.handleCtrlKeyUp);

    const editGroup = { ...this.state.editGroup };
    editGroup.tabItems = await getTabItems();

    const groups = await getStoredGroups();
    this.setState({ groups, editGroup });
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleCtrlKeyDown);
    document.removeEventListener("keyup", this.handleCtrlKeyUp);
  }

  handleCtrlKeyDown = (e: KeyboardEvent | Event) => {
    if (!('keyCode' in e)) return;
    if (!e.repeat && e.keyCode === KeyCode.CTRL) {
      this.setState({ openInNewWindow: true });
    }
  }

  handleCtrlKeyUp = (e: KeyboardEvent | Event) => {
    if (!('keyCode' in e)) return;
    if (e.keyCode === KeyCode.CTRL) {
      this.setState({ openInNewWindow: false });
    }
  }


  // handleKeyPress = (e: KeyboardEvent | Event) => {
  //   if (!('keyCode' in e)) return;
  //   if (!e.repeat && (e as KeyboardEvent).keyCode === KeyCode.CTRL) {
  //     const openInNewWindow = !this.state.openInNewWindow;
  //     this.setState({ openInNewWindow });
  //   }
  // }

  handleQuery = (query: string) => {
    this.setState({ query });
  }

  handleChangeGroupName = (e: React.ChangeEvent, originalGroup: Group) => {
    const group = { ...originalGroup };
    const name = (e.currentTarget as HTMLInputElement).value;
    group.name = name;
    if (isDummy(group)) return this.setState({ editGroup: group });

    const updates = { ...this.state.updates };
    updates[group.id] = { group };
    this.setState({ updates });
  }

  handleOpenTab: OpeningTabHandler = (urlsOrEvent: string[] | React.MouseEvent, group?: Group) => {
    let urls: string[];
    // When urlsOrEvent is an event type
    if ('currentTarget' in urlsOrEvent) {
      if (!group) return console.log('The parameter `group` must be provided.');
      const e = urlsOrEvent;
      const tabIdInString = (e.currentTarget as HTMLLIElement).getAttribute('value');
      if (!tabIdInString) return console.log('The id of the group is required');

      const tabId = parseInt(tabIdInString);

      const clickedTab = group.tabItems.find((item) => item.id === tabId);
      if (!clickedTab) return console.log('The tab with the given id does not exist.');

      urls = [clickedTab.url];
    }
    else urls = urlsOrEvent;

    openTabs(urls, this.state.openInNewWindow);
  }

  handleSelectTab = (e: React.MouseEvent, group: Group) => {
    const tabIdInString = (e.currentTarget as HTMLLIElement).getAttribute('value');
    if (!tabIdInString) return console.log('The id of the group is required');

    const tabId = parseInt(tabIdInString);

    if (isDummy(group)) {
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
    const groups = [...this.state.groups];
    let editGroup = { ...this.state.editGroup };
    if (!editGroup.name) {
      editGroup.name = await generateGroupName();
    }

    editGroup.tabItems = this.filterExcludedTabs(editGroup.tabItems);
    editGroup = await storeGroup(editGroup);
    groups.push(editGroup);

    editGroup = emptyGroup;
    editGroup.tabItems = await getTabItems();
    this.setState({ groups, editGroup: emptyGroup });
  }

  handleChange = (e: React.ChangeEvent): void => {
    const { name, value } = (e.currentTarget as HTMLInputElement);
    this.setState({ [name]: value });
  }

  toggleUpdate = (group: Group) => {
    if (isDummy(group)) return console.log('invalid group: no id');

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

  handleConfirmUpdate = async (group: Group) => {
    const tabItems = this.filterExcludedTabs(group.tabItems);
    let updatedGroup = { ...group, tabItems };
    updatedGroup = await updateGroup(updatedGroup);

    const groups = [...this.state.groups];
    const index = groups.findIndex((g) => g.id === updatedGroup.id);
    groups[index] = updatedGroup;

    const updates = { ...this.state.updates };
    delete updates[updatedGroup.id];

    this.setState({ groups, updates });
  }

  filterExcludedTabs = (src: TabItem[]) => {
    return src.filter((item) => !item.isSelected);
  }

  handleDeleteGroup = async (group: Group) => {
    const deletedGroup = await deleteGroup(group);
    const groups = [...this.state.groups];
    const index = groups.findIndex((g) => g.id === deletedGroup.id);
    groups.splice(index, 1);

    const updates = { ...this.state.updates };
    if (updates[deletedGroup.id]) {
      delete updates[deletedGroup.id];
    }

    this.setState({ groups, updates });
  }

  prune = (url: string) => {
    return url.split(/[\s.:\/]/).join("");
  }

  handleFilter = (tab: TabItem) => {
    const query = this.state.query.toLowerCase();

    const title = tab.title.toLowerCase();
    const prunedTitle = this.prune(title);
    const url = tab.url.toLowerCase();
    const prunedUrl = this.prune(url);

    if (title.includes(query)
      || prunedTitle.includes(query)
      || url.includes(query)
      || prunedUrl.includes(query)
    ) return true;

    return false;
  }

  renderGroups = () => {
    const { query } = this.state;
    const updates = this.state.updates;
    return (
      <div className="groups-container">
        {
          // group list
          this.state.groups.map((group, index) => {
            const isEditable = group.id in updates;
            return (
              <div className="group-row">
                <GroupBox
                  key={index}
                  group={isEditable ? updates[group.id].group : group}
                  isEditable={isEditable}
                  toggleUpdate={this.toggleUpdate}
                  onDelete={this.handleDeleteGroup}
                  onConfirmEdit={this.handleConfirmUpdate}
                  onChangeName={(e) => { this.handleChangeGroupName(e, group) }}
                  onExcludeTab={(e) => { this.handleSelectTab(e, group) }}
                  onOpenTab={this.handleOpenTab}
                  filter={query ? this.handleFilter : null}
                />
              </div>
            );
          })
          // group list end
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
  groups: Group[];
  editGroup: Group;
  query: string;
  updates: { [key: number]: UpdateInfo };
  openInNewWindow: boolean;
}

export default App;
