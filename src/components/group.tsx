import * as React from 'react';
import { TabItem } from './../types/tabItem';
import { Group } from './../types/group';
import TabItems from './tabItems';

export interface GroupProps {
  group: Group,
  isEditable: boolean,
  isDetailed: boolean,
  onChangeName: React.ChangeEventHandler,
  onSelectTab: React.MouseEventHandler<HTMLLIElement>,
  toggleUpdate: (group: Group) => void
}

const GroupBox: React.SFC<GroupProps> = (props: GroupProps) => {
  const renderName = () => {
    const { group, isEditable, onChangeName } = props;
    return (
      <div className="group-name">
        {
          isEditable ?
            <input type="text" value={group.name} onChange={onChangeName} /> :
            <h3>{group.name}</h3>
        }
      </div>
    );
  }

  const renderNav = () => {
    const { toggleUpdate, group } = props;
    return (
      <div className="group-nav">
        <button onClick={() => toggleUpdate(group)}>수정</button>
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

  const { group, isDetailed, isEditable, onSelectTab } = props;
  return (
    <div className="group">
      {renderHeader()}
      {isDetailed ?
        <TabItems
          tabs={group.tabItems}
          onSelectTab={isEditable?onSelectTab:undefined}
        /> :
        null
      }
    </div>
  );
}

export default GroupBox;