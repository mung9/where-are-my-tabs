import * as React from 'react';
import { TabItem } from './../types/tabItem';
import { Group } from './../types/group';
import TabItems from './tabItems';
import KeyCode from '../common/key';
import GroupNameInput from './groupNameInput';
import { TooltipContent } from '../types/tooltip';

export interface GroupBoxProps {
  group: Group,
  isEditable: boolean,
  onConfirmEdit: (group: Group) => void,
  onChangeName: React.ChangeEventHandler,
  onExcludeTab: React.MouseEventHandler<HTMLLIElement>,
  onOpenTab: {
    (urls: string[]): void;
    (e: React.MouseEvent, group: Group): void;
  }
  onDelete: (group: Group) => void,
  onTooltip?: (e: React.MouseEvent, content: TooltipContent) => void;
  toggleUpdate: (group: Group) => void,
  filter: ((tab: TabItem) => boolean) | null
}

export interface GroupBoxState {
  isDetailed: boolean,
}

class GroupBox extends React.Component<GroupBoxProps, GroupBoxState> {
  state = { isDetailed: true }
  nameInput = React.createRef<HTMLInputElement>();

  componentDidUpdate(prevProps: GroupBoxProps, prevState: GroupBoxState) {
    if (!prevProps.isEditable && this.props.isEditable) {
      const input = this.nameInput.current;
      if (input) input.focus();
    }

    if (!this.state.isDetailed && !prevProps.filter && this.props.filter) {
      this.toggleDetail();
    }
  }

  toggleDetail = () => {
    const isDetailed = !this.state.isDetailed;
    this.setState({ isDetailed });
  }

  handleToggleDetail = (e: React.MouseEvent) => {
    if ((e.target as Element).className.includes('header')) {
      this.toggleDetail();
    }
  }

  renderName = () => {
    const { isEditable, group, onChangeName, onOpenTab, onTooltip } = this.props;

    let groupName: JSX.Element;
    let onClickName: React.MouseEventHandler | undefined = undefined;
    if (isEditable) {
      groupName = <GroupNameInput
        ref={this.nameInput}
        type="text"
        value={group.name}
        className='group-name-input'
        onKeyDown={this.handleKeyDown}
        onChange={onChangeName}
      />;
    }
    else {
      const tooltipContent = {
        title: group.name,
        content: `Tabs count: ${group.tabItems.length}`
      }
      groupName = (
        <h3
          onMouseEnter={e => onTooltip && onTooltip(e, tooltipContent)}
          onMouseLeave={e => onTooltip && onTooltip(e, tooltipContent)}
        >{group.name}</h3>
      );

      const urls = group.tabItems.map((i) => i.url);
      onClickName = () => onOpenTab(urls);
    }

    return (
      <div onClick={onClickName} className="group-name">
        {groupName}
      </div>
    );
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    const { onConfirmEdit, group } = this.props;
    if (e.keyCode === KeyCode.ENTER) {
      onConfirmEdit(group);
    }
  }

  renderBtnsOnEdit = () => {
    const { group, onConfirmEdit, toggleUpdate } = this.props;
    return (
      <React.Fragment>
        <button onClick={() => onConfirmEdit(group)} className='btn-skel'>OK</button>
        <button onClick={() => toggleUpdate(group)} className='btn-skel'>Cancel</button>
      </React.Fragment>
    );
  }

  renderBtnsOnDefault = () => {
    const { group, onDelete, toggleUpdate } = this.props;
    return (
      <React.Fragment>
        <button onClick={() => toggleUpdate(group)} className='btn-skel'>Update</button>
        <button onClick={() => onDelete(group)} className='btn-skel'>Delete</button>
      </React.Fragment>
    );
  }

  renderNav = () => {
    const { isEditable } = this.props;
    return (
      <div className="group-nav">
        {isEditable ? this.renderBtnsOnEdit() : this.renderBtnsOnDefault()}
      </div>
    );
  }

  renderHeader = () => {
    return (
      <div onClick={this.handleToggleDetail} className="header">
        {this.renderName()}
        {this.renderNav()}
      </div>
    );
  }

  render() {
    const { filter } = this.props;
    const { group, isEditable, onExcludeTab, onOpenTab, onTooltip } = this.props;
    const { isDetailed } = this.state;
    const filteredTabs = (
      filter
        ? group.tabItems.filter((item) => filter(item))
        : group.tabItems
    );

    if (filteredTabs.length < 1) return null;

    const classes = `group ${isDetailed ? "group-detailed" : ""}`;

    return (
      <div className={classes}>
        {this.renderHeader()}
        {
          isDetailed
            ? <TabItems
              tabs={filteredTabs}
              onTooltip={onTooltip}
              onSelectTab={isEditable ? onExcludeTab : (e) => { onOpenTab(e, group) }} />
            : null
        }
      </div>
    );
  }
}

export default GroupBox;
