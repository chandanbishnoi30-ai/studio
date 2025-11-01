'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';

export function AppHeader() {
  const pathname = usePathname();
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/summarizer') return 'AI Summarizer';
    if (pathname === '/notes') return 'Notes';
    if (pathname === '/time-management') return 'Time Management';
    if (pathname === '/master-classes') return 'Master Classes';
    if (pathname === '/motivational-books') return 'Motivational Books';
    return 'StudyFlow';
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/60 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="hidden max-md:flex" />
      <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
      <div className="ml-auto flex items-center gap-2">
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
                <AvatarFallback>SF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
