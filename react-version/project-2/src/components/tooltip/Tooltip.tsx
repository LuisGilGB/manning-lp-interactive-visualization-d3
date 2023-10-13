import './Tooltip.css';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface TooltipProps {
  x: number;
  y: number;
  visible?: boolean;
  children: ReactNode;
}

const Tooltip = ({ x, y, visible, children }: TooltipProps) => {
  console.log({ x, y, visible });
  return (
    <div className={clsx('tooltip', { visible })} style={{ left: x, top: y }}>
      {children}
    </div>
  );
};

export default Tooltip;
