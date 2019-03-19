import * as React from 'react';
import GroupBox from './group';
import { Group, NewGroup } from './../types/group';
import TabItems from './tabItems';

export interface HeaderProps {
  query: string,
  group: NewGroup,
  onChangeGroupName: React.ChangeEventHandler,
  onSelectTab: React.MouseEventHandler,
  onGroup: () => void,
  onQuery: (query: string) => void
}

export interface HeaderState {
  isDetailed: boolean
}

class Header extends React.Component<HeaderProps, HeaderState> {
  state = {
    groupName: '',
    isDetailed: false
  }

  // isStateProperty = (obj: any): obj is HeaderState => {
  //   return true;
  // }

  // handleChange = (e: React.ChangeEvent): void => {
  //   const { name, value } = (e.currentTarget as HTMLInputElement);
  //   const obj = { [name]: value };
  //   if (this.isStateProperty(obj)) this.setState(obj);
  // }

  toggleDetail = (): void => {
    this.setState({ isDetailed: !this.state.isDetailed });
  }

  renderDetail = () => {
    const { group, onSelectTab } = this.props;
    console.log('hedaer',group.tabItems);
    return (
      <div className="new-group-detail">
        <TabItems tabs={group.tabItems} onSelectTab={onSelectTab} />
      </div>
    );
  }

  render() {
    const { group, query, onChangeGroupName, onSelectTab, onGroup, onQuery } = this.props;
    const { isDetailed } = this.state;
    return (
      <header>
        <div className="header-row">
          <div className="logo">
            <h1>LOGO</h1>
          </div>
          <div className="new-group-layout">
            <input type="text" name='groupName' value={group.name} onChange={onChangeGroupName} placeholder='Group Name...' />
            <button onClick={onGroup}>Group</button>
            <button onClick={this.toggleDetail}>Details</button>
          </div>
          <div className="search">
            <input type="text" name='query' value={query} onChange={(e) => onQuery(e.currentTarget.value)} placeholder='Search' />
          </div>
        </div>
        <div className="header-row">
          {isDetailed ? this.renderDetail() : null}
        </div>
      </header>
    );
  }
}

export default Header;