import './Tooltip.css';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

interface TooltipProps {
  x: number;
  y: number;
  visible?: boolean;
  children: ReactNode;
  container?: HTMLElement;
}

const Tooltip = ({
  x,
  y,
  visible,
  children,
  container = document.body,
}: TooltipProps) => {
  return createPortal(
    <div className={clsx('tooltip', { visible })} style={{ left: x, top: y }}>
      {children}
    </div>,
    container,
  );
};

export default Tooltip;
