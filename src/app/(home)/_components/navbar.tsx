"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { User, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserProfile } from "../_types";

const links = [
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "AI Chat", href: "/aichat" },
  { label: "Chat", href: "/chat" },
  { label: "Mall", href: "/mall" },
];

export function Navbar({ user }: { user: UserProfile | null }) {
  const [open, setOpen] = useState(false);

  const isLoggedIn = !!user?.id;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight">
          AI-Powered Platform
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        {/* <ThemeSwitcher /> */}

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild onMouseEnter={() => setOpen(true)}>
            <Avatar className="h-9 w-9">
              {isLoggedIn && user?.avatarUrl ? (
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.displayName ?? ""}
                />
              ) : null}
              <AvatarFallback className="bg-muted">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {isLoggedIn ? (
              <>
                <div className="truncate px-2 py-1.5 text-sm font-medium">
                  {user?.displayName || user?.email || "User"}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/login" className="cursor-pointer">
                  Sign In
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
