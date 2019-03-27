import * as React from 'react';
import { Group, NewGroup } from './../types/group';
import TabItems from './tabItems';
import KeyCode from '../common/key';
import GroupNameInput from './groupNameInput';

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
    isDetailed: false
  }

  toggleDetail = (): void => {
    this.setState({ isDetailed: !this.state.isDetailed });
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.ENTER) {
      this.props.onGroup();
    }
  }

  renderDetail = () => {
    const { group, onSelectTab } = this.props;
    return (
      <div className="new-group-detail">
        <TabItems tabs={group.tabItems} onSelectTab={onSelectTab} />
      </div>
    );
  }

  renderLogo = () => {
    return <div className="logo"><h1>WHERE ARE MY TABS?</h1></div>;
  }

  renderNewGroupForm = () => {
    const { group, onChangeGroupName, onGroup } = this.props;
    const { isDetailed } = this.state;
    const arrowClass = isDetailed ? "rot-180" : null;

    return (
      <div className="new-group-layout">
        <GroupNameInput
          name='groupName'
          value={group.name}
          className='group-name-input'
          onKeyDown={this.handleKeyDown}
          onChange={onChangeGroupName}
          placeholder='Group Name'
        ></GroupNameInput>
        <i
          onClick={() => { this.setState({ isDetailed: false }); onGroup(); }}
          className="fas fa-plus fa-2x">
        </i>
        <i
          onClick={this.toggleDetail}
          className={`fas fa-chevron-down fa-2x ${arrowClass}`}>
        </i>
      </div>
    );
  }

  renderSearchForm = () => {
    const { query, onQuery } = this.props;
    return (
      <div className="search">
        <input type="text" name='query' value={query} onChange={(e) => onQuery(e.currentTarget.value)} placeholder='Search' />
      </div>
    );
  }

  render() {
    const { isDetailed } = this.state;

    return (
      <header>
        <div className="header-row">
          {this.renderNewGroupForm()}
          {this.renderLogo()}
          {this.renderSearchForm()}
        </div>
        <div className="header-row">
          {isDetailed ? this.renderDetail() : null}
        </div>
      </header>
    );
  }
}

export default Header;