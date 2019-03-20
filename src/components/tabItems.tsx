import * as React from 'react';
import { TabItem } from '../types/tabItem';
import { getFaviconUrl } from '../common/common';

export interface TabItemsProps {
  tabs: TabItem[],
  onSelectTab?: React.MouseEventHandler
}

const TabItems: React.SFC<TabItemsProps> = (props: TabItemsProps) => {
  const renderHeader = () => { return (<div className="header">2 days ago</div>); }

  const renderFooter = (url: string) => {
    return (<div className="footer"><span>{url}</span></div>);
  }

  const renderContent = (title: string, url: string) => {
    const faviconUrl = getFaviconUrl(url);
    return (
      <div className="content">
        <img className='icon' src={faviconUrl} alt="kl;" />
        <div className="tab-title">{title}</div>
      </div>
    );
  }

  const { tabs, onSelectTab } = props;
  const tabElements = tabs.map((tab, index) => {
    let classes = 'tab-item';
    if (tab.isSelected) classes += " selected";
    return (
      <li key={index} value={tab.id} onClick={onSelectTab} className={classes}>
        {renderHeader()}
        {renderContent(tab.title, tab.url)}
        {renderFooter(tab.url)}
      </li>
    );
  });

  return (
    <ul className='tab-container'>
      {tabElements}
    </ul>
  );
}

export default TabItems;