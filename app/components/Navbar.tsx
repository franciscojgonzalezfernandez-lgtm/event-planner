"use client";

import { logout } from "@/lib/auth-actions";
import { Session } from "next-auth";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href={"/"}
              className="font-bold text-xl text-primary hover:text-foreground transition-colors"
            >
              EventPlanner
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={"/events"}
              className="hover:text-primary px-3 py-2 rouded-md text-sm font-medium transition-colors"
            >
              Events
            </Link>
            {session ? (
              <>
                <Link
                  href={"/events/create"}
                  className="hover:text-primary px-3 py-2 rouded-md text-sm font-medium transition-colors"
                >
                  Create events
                </Link>
                <Link
                  href={"/dashboard"}
                  className="hover:text-primary px-3 py-2 rouded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={logout}
                    className="bg-primary text-background rounded-md hover:bg-primary/90 px-3 py-2 rouded-md text-sm font-medium transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href={"/login"}
                  className="bg-primary text-background rounded-md hover:bg-primary/90 px-3 py-2 rouded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="text-foreground hover:text-primary focus:outline-none focust:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pb-2 pt-3 space-y-1 sm:px-3">
              <Link
                href={"/events"}
                className="hover:text-primary block px-3 py-2 rouded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              {session ? (
                <>
                  <Link
                    href={"/events/create"}
                    className="hover:text-primary block px-3 py-2 rouded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create events
                  </Link>
                  <Link
                    href={"/dashboard"}
                    className="hover:text-primary block px-3 py-2 rouded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2 px-3">
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="bg-primary text-background rounded-md hover:bg-primary/90 px-3 py-2 rouded-md text-base font-medium transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2 px-3">
                  <Link
                    href={"/login"}
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-primary text-background rounded-md hover:bg-primary/90 px-3 py-2 rouded-md text-base font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
