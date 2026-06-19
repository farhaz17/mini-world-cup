import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center min-h-screen bg-bg">
      <div className="relative w-full max-w-[430px] min-h-screen flex flex-col bg-bg">
        <main className="flex-1 overflow-y-auto pb-20">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
