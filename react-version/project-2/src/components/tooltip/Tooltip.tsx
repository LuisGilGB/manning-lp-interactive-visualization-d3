import './Tooltip.css';
import { ReactNode } from 'react';

interface TooltipProps {
  x: number;
  y: number;
  children: ReactNode;
}

const Tooltip = ({ x, y, children }: TooltipProps) => {
  return (
    <div className="tooltip" style={{ left: x, top: y }}>
      {children}
    </div>
  );
};

export default Tooltip;
