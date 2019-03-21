import * as React from 'react';
import { TabItem } from './../types/tabItem';
import { Group } from './../types/group';
import TabItems from './tabItems';

export interface GroupProps {
  group: Group,
  isEditable: boolean,
  isDetailed: boolean,
  onConfirmEdit: (group: Group) => void,
  onChangeName: React.ChangeEventHandler,
  onExcludeTab: React.MouseEventHandler<HTMLLIElement>,
  onOpenTab: {
    (urls: string[]): void;
    (e: React.MouseEvent, group: Group): void;
  }
  onDelete: (group: Group) => void,
  toggleUpdate: (group: Group) => void,
  filter: (tab: TabItem) => boolean
}

const GroupBox: React.SFC<GroupProps> = (props: GroupProps) => {
  const {
    group,
    isEditable,
    isDetailed,
    onConfirmEdit,
    onChangeName,
    onExcludeTab,
    onOpenTab,
    onDelete,
    toggleUpdate,
    filter
  } = props;

  const renderName = () => {
    let groupName: JSX.Element;
    let onClickName: React.MouseEventHandler | undefined = undefined;
    if (isEditable) {
      groupName = <input type="text" value={group.name} onChange={onChangeName} />;
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

  const renderBtnsOnEdit = () => {
    return (
      <React.Fragment>
        <i onClick={() => onConfirmEdit(group)} className="fas fa-check fa-2x"></i>
        <i onClick={() => toggleUpdate(group)} className="fas fa-times fa-2x"></i>
      </React.Fragment>
    );
  }

  const renderBtnsOnDefault = () => {
    return (
      <React.Fragment>
        <i onClick={() => toggleUpdate(group)} className="far fa-edit fa-2x"></i>
        <i onClick={() => onDelete(group)} className="far fa-trash-alt fa-2x"></i>
      </React.Fragment>
    );
  }

  const renderNav = () => {
    return (
      <div className="group-nav">
        {isEditable ? renderBtnsOnEdit() : renderBtnsOnDefault()}
      </div>
    );
  }

  const renderHeader = () => {
    return (
      <div className="header">
        {renderName()}
        {renderNav()}
      </div>
    );
  }

  const filteredTabs = group.tabItems.filter((item) => filter(item));
  if (filteredTabs.length < 1) return null;
  
  return (
    <div className="group">
      {renderHeader()}
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

export default GroupBox;