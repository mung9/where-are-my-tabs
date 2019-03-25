import * as React from 'react';
import { TabItem } from '../types/tabItem';
import { getFaviconUrl } from '../common/common';

export interface TabItemsProps {
  tabs: TabItem[],
  onSelectTab?: React.MouseEventHandler
}

const TabItems: React.SFC<TabItemsProps> = (props: TabItemsProps) => {
  // const renderHeader = () => { return (<div className="header">2 days ago</div>); }
  const renderHeader = () => null;

  const renderFooter = (url: string) => {
    // return (<div className="footer"><span>{url}</span></div>);
    return null;
  }

  const renderContent = (title: string, url: string) => {
    const faviconUrl = getFaviconUrl(url);
    return (
      <div className="content">
        <img className='icon' src={faviconUrl} alt="kl;" />
        <div className="desc">
          <div className="tab-title">{title}</div>
          <div className="url"><span>{url}</span></div>
        </div>
      </div>
    );
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const target = e.target as HTMLLIElement;
    const index = target.className.indexOf("tab-item");
    if (index < 0) return;

    /**
     * TODO:
     * 안내 창을 띄운다.
     * 
     * 
     *  */ 
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    console.log(e.target);
  }

  const { tabs, onSelectTab } = props;
  const tabElements = tabs.map((tab, index) => {
    let classes = 'tab-item';
    if (tab.isSelected) classes += " selected";
    return (
      <li
        key={index}
        value={tab.id}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onSelectTab}
        className={classes}
      >
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