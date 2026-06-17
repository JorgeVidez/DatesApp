'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    {
      href: '/',
      label: 'Dashboard',
      icon: 'dashboard',
    },
    {
      href: '/ideas',
      label: 'Ideas de Citas',
      icon: 'favorite',
    },
    {
      href: '/momentos',
      label: 'Momentos Inolvidables',
      icon: 'photo_library',
    },
    {
      href: '/randomizer',
      label: 'Selector al Azar',
      icon: 'casino',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col lg:flex-row relative">
      
      {/* SideNavBar (Desktop: >= lg) */}
      <aside className="bg-surface-container-low border-r border-outline-variant/20 shadow-md h-screen w-64 hidden lg:flex flex-col p-md gap-lg flex-shrink-0 z-40 fixed left-0 top-0">
        <div className="flex flex-col items-center gap-sm mt-md border-b border-outline-variant/30 pb-md">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-fixed shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Couple profile"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            />
          </div>
          <div className="text-center">
            <h1 className="font-headline-md text-headline-md text-primary">L&apos;Amour Moderne</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Planning with Intention</p>
          </div>
        </div>

        <nav className="flex flex-col gap-sm flex-grow mt-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-label-md text-label-md transition-all duration-150 active:translate-x-1 focus-ring-visible ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm'
                    : 'text-on-tertiary-fixed-variant hover:bg-secondary-container/20'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/programar"
          className="bg-primary text-on-primary rounded-full py-3 px-6 font-label-md text-label-md hover:opacity-90 transition-opacity w-full mt-auto mb-md flex justify-center items-center gap-2 soft-shadow active:scale-95 duration-200 focus-ring-visible"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">calendar_add_on</span>
          Programar Cita
        </Link>
      </aside>

      {/* TopAppBar (Mobile/Tablet: < lg) */}
      <header className="fixed top-0 w-full z-40 bg-background/95 backdrop-blur-md flex justify-between items-center px-margin-mobile h-16 border-b border-outline-variant/20 lg:hidden pt-[env(safe-area-inset-top,0px)]">
        <div className="h-8 w-8 rounded-full overflow-hidden bg-surface-container-highest border border-outline-variant/30 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
          />
        </div>
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight">
          L&apos;Amour Moderne
        </h1>
        <button
          aria-label="notificaciones"
          className="text-primary hover:opacity-80 transition-opacity flex-shrink-0 active:scale-95 p-2 focus-ring-visible rounded-full"
        >
          <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow min-h-screen flex flex-col lg:pl-64">
        <main className="flex-grow pt-24 pb-28 lg:pt-8 lg:pb-8 px-margin-mobile md:px-lg max-w-max-width w-full mx-auto">
          {children}
        </main>
      </div>

      {/* BottomNavBar (Mobile/Tablet: < lg) */}
      <nav className="fixed bottom-0 left-0 w-full z-40 rounded-t-xl bg-surface-container-low shadow-[0_-4px_12px_rgba(250,210,225,0.4)] flex justify-around items-center px-margin-mobile py-2 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] lg:hidden border-t border-outline-variant/10">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all duration-200 focus-ring-visible ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold scale-95 shadow-sm'
                  : 'text-on-surface-variant hover:bg-secondary-container/30'
              }`}
            >
              <span
                className="material-symbols-outlined mb-0.5"
                aria-hidden="true"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              <span className="font-label-sm text-[10px]">{link.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
