import * as React from 'react';
import { TooltipContent } from '../types/tooltip';

export interface TooltipProps {
  tooltipContent: TooltipContent
}

const Tooltip: React.SFC<TooltipProps> = (props) => {
  const { title, content } = props.tooltipContent;
  return (
    <div className="tooltip">
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  );
}

export default Tooltip;