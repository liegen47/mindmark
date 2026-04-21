'use client';

import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import clsx from 'clsx';

interface MobileSidebarProps {
  children: React.ReactNode;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 sm:hidden">{children}</div>
        </>
      )}
      <nav
        className="bg-black/10
      backdrop-blur-lg
      sm:hidden 
      fixed 
      z-50 
      bottom-0 
      right-0 
      left-0
      "
      >
        <ul
          className="flex 
        justify-center 
        items-center 
        p-4"
        >
          <li
            className="flex
              items-center
              flex-col
              justify-center
              cursor-pointer
            "
            onClick={() => setIsOpen((value) => !value)}
          >
            <Menu />
            <small
              className={clsx('', {
                'text-muted-foreground': !isOpen,
              })}
            >
              {isOpen ? 'Close' : 'Sidebar'}
            </small>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MobileSidebar;
