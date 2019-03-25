import * as React from 'react';
import { TabItem } from './../types/tabItem';
import { Group } from './../types/group';
import TabItems from './tabItems';

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
    const { isEditable, group, onChangeName, onOpenTab } = this.props;

    let groupName: JSX.Element;
    let onClickName: React.MouseEventHandler | undefined = undefined;
    if (isEditable) {
      groupName = <input ref={this.nameInput} type="text" value={group.name} onChange={onChangeName} />;
    }
    else {
      groupName = <h3>{group.name}</h3>

      const urls = group.tabItems.map((i) => i.url);
      onClickName = () => onOpenTab(urls);
    }

    return (
      <div onClick={onClickName} className="group-name">
        {groupName}
      </div>
    );
  }

  renderBtnsOnEdit = () => {
    const { group, onConfirmEdit, toggleUpdate } = this.props;
    return (
      <React.Fragment>
        <i onClick={() => onConfirmEdit(group)} className="fas fa-check fa-2x"></i>
        <i onClick={() => toggleUpdate(group)} className="fas fa-times fa-2x"></i>
      </React.Fragment>
    );
  }

  renderBtnsOnDefault = () => {
    const { group, onDelete, toggleUpdate } = this.props;
    return (
      <React.Fragment>
        <i onClick={() => toggleUpdate(group)} className="far fa-edit fa-2x"></i>
        <i onClick={() => onDelete(group)} className="far fa-trash-alt fa-2x"></i>
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
    const { group, isEditable, onExcludeTab, onOpenTab } = this.props;
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
              onSelectTab={isEditable ? onExcludeTab : (e) => { onOpenTab(e, group) }} />
            : null
        }
      </div>
    );
  }
}

export default GroupBox;
