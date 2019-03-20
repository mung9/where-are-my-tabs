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
  toggleUpdate: (group: Group) => void
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
        <button onClick={() => toggleUpdate(group)}>Cancel</button>
        <button onClick={() => onConfirmEdit(group)}>Confirm</button>
      </React.Fragment>
    );
  }

  const renderBtnsOnDefault = () => {
    return (
      <React.Fragment>
        <button onClick={() => toggleUpdate(group)}>Modify</button>
        <button onClick={() => onDelete(group)}>Delete</button>
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

  return (
    <div className="group">
      {renderHeader()}
      {
        isDetailed
          ? <TabItems
            tabs={group.tabItems}
            onSelectTab={isEditable ? onExcludeTab : (e) => { onOpenTab(e, group) }} />
          : null
      }
    </div>
  );
}

export default GroupBox;