import * as React from 'react';
import { TabItem } from '../types/tabItem';
import { getFaviconUrl } from '../common/common';
import { TooltipContent } from './../types/tooltip';

export interface TabItemsProps {
  tabs: TabItem[],
  onTooltip?: (e: React.MouseEvent, tooltipContent: TooltipContent) => void;
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
  
  const { tabs, onSelectTab, onTooltip } = props;
  const tabElements = tabs.map((tab, index) => {
    let classes = 'tab-item';
    if (tab.isSelected) classes += " selected";
    const tooltipContent: TooltipContent = {
      title: tab.title,
      content: tab.url
    }
    return (
      <li
        key={index}
        value={tab.id}
        onMouseEnter={e => onTooltip && onTooltip(e, tooltipContent)}
        onMouseLeave={e => onTooltip && onTooltip(e, tooltipContent)}
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