"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "@auth0/nextjs-auth0";
import { Moon, Sun, Menu, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useUser();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const publicNavItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/resume", label: "Resume" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg sm:text-xl font-[family-name:var(--font-roboto-mono)]">
            Nikita
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {publicNavItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}

              {/* Auth-dependent items */}
              {!isLoading && user && (
                <NavigationMenuItem>
                  <Link
                    href="/dashboard"
                    className={cn(navigationMenuTriggerStyle(), "flex items-center")}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Button */}
          {!isLoading && (
            <>
              {user ? (
                <Button asChild variant="outline" size="sm">
                  <a href="/auth/logout">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </a>
                </Button>
              ) : (
                <Button asChild variant="default" size="sm">
                  <a href="/auth/login">
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </a>
                </Button>
              )}
            </>
          )}

          {/* Dark Mode Toggle - Desktop */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          {/* Dark Mode Toggle - Mobile */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-[family-name:var(--font-roboto-mono)]">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Auth-dependent mobile items */}
                {!isLoading && user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                {/* Auth Button - Mobile */}
                {!isLoading && (
                  <div className="pt-4 border-t">
                    {user ? (
                      <a
                        href="/auth/logout"
                        onClick={() => setOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </a>
                    ) : (
                      <a
                        href="/auth/login"
                        onClick={() => setOpen(false)}
                        className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        Login
                      </a>
                    )}
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
