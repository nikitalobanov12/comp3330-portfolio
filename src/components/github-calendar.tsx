"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface GitHubCalendarProps {
  username: string;
}

export default function GitHubCalendar({ username }: GitHubCalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle hydration - only render dynamic content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !calendarRef.current || !mounted) return;

    // Clear previous content before reinitializing
    if (calendarRef.current) {
      calendarRef.current.innerHTML = "Loading GitHub contributions...";
    }

    const timer = setTimeout(() => {
      try {
        // @ts-expect-error GitHubCalendar is loaded from external script
        if (typeof window.GitHubCalendar === "function") {
          // @ts-expect-error GitHubCalendar is loaded from external script
          window.GitHubCalendar(calendarRef.current, username, {
            responsive: true,
            tooltips: true,
            global_stats: false, // Disable broken stats
          });
          setIsLoading(false);
        } else {
          setError("GitHub Calendar library failed to load");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error initializing GitHub Calendar:", err);
        setError("Failed to load GitHub contributions");
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isScriptLoaded, username, mounted]);

  return (
    <>
      {/* Base responsive CSS from the library */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css"
      />

      {/* Custom styles for dark/light mode theming */}
      <style jsx global>{`
        /* Light mode styles */
        .calendar {
          font-family: inherit;
          text-align: center;
        }

        .calendar .contrib-legend {
          text-align: center;
          padding: 0 14px 10px;
        }

        .calendar .contrib-legend .legend {
          display: inline-block;
          list-style: none;
          margin: 0 5px;
          padding: 0;
        }

        .calendar .contrib-legend .legend li {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin: 0 1px;
        }

        .calendar .contrib-column {
          text-align: center;
          border-left: 1px solid hsl(var(--border));
          border-top: 1px solid hsl(var(--border));
          font-size: 11px;
        }

        .calendar .contrib-column-first {
          border-left: 0;
        }

        .calendar .table-column {
          display: table-cell;
        }

        .calendar table.days,
        .calendar .calendar-graph {
          display: inline-block;
          max-width: 100%;
        }

        .calendar .days {
          width: 100%;
        }

        .calendar .contrib-footer {
          padding: 0 10px 12px;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
          font-size: 12px;
          color: hsl(var(--muted-foreground));
        }

        .calendar .position-relative {
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
        }

        /* Theme-aware calendar cell colors */
        .calendar rect.ContributionCalendar-day {
          rx: 2;
          ry: 2;
        }

        /* Light mode contribution levels */
        :root .calendar rect.ContributionCalendar-day[data-level="0"] {
          fill: hsl(var(--muted));
        }
        :root .calendar rect.ContributionCalendar-day[data-level="1"] {
          fill: #9be9a8;
        }
        :root .calendar rect.ContributionCalendar-day[data-level="2"] {
          fill: #40c463;
        }
        :root .calendar rect.ContributionCalendar-day[data-level="3"] {
          fill: #30a14e;
        }
        :root .calendar rect.ContributionCalendar-day[data-level="4"] {
          fill: #216e39;
        }

        /* Dark mode contribution levels */
        .dark .calendar rect.ContributionCalendar-day[data-level="0"] {
          fill: hsl(var(--muted));
        }
        .dark .calendar rect.ContributionCalendar-day[data-level="1"] {
          fill: #0e4429;
        }
        .dark .calendar rect.ContributionCalendar-day[data-level="2"] {
          fill: #006d32;
        }
        .dark .calendar rect.ContributionCalendar-day[data-level="3"] {
          fill: #26a641;
        }
        .dark .calendar rect.ContributionCalendar-day[data-level="4"] {
          fill: #39d353;
        }

        /* Text colors */
        .calendar text.ContributionCalendar-label {
          fill: hsl(var(--foreground));
          font-size: 9px;
        }

        .calendar .text-muted-link,
        .calendar a {
          color: hsl(var(--muted-foreground));
          text-decoration: none;
        }

        .calendar a:hover {
          color: hsl(var(--primary));
        }

        /* Tooltip styling */
        .calendar .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Summary text */
        .calendar .contrib-footer .float-left {
          float: left;
        }

        /* Legend styling */
        .calendar .legend li {
          border-radius: 2px;
        }

        :root .calendar .legend li:nth-child(1) { background-color: hsl(var(--muted)); }
        :root .calendar .legend li:nth-child(2) { background-color: #9be9a8; }
        :root .calendar .legend li:nth-child(3) { background-color: #40c463; }
        :root .calendar .legend li:nth-child(4) { background-color: #30a14e; }
        :root .calendar .legend li:nth-child(5) { background-color: #216e39; }

        .dark .calendar .legend li:nth-child(1) { background-color: hsl(var(--muted)); }
        .dark .calendar .legend li:nth-child(2) { background-color: #0e4429; }
        .dark .calendar .legend li:nth-child(3) { background-color: #006d32; }
        .dark .calendar .legend li:nth-child(4) { background-color: #26a641; }
        .dark .calendar .legend li:nth-child(5) { background-color: #39d353; }

        /* Hide default link in footer if we're adding our own */
        .calendar .contrib-footer .float-right {
          display: none;
        }
      `}</style>

      <Script
        src="https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => {
          setError("Failed to load GitHub Calendar script");
          setIsLoading(false);
        }}
      />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-xl font-[family-name:var(--font-roboto-mono)] flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub Contributions
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Profile
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(!mounted || isLoading) && !error && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-28 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">{error}</p>
              <Button asChild variant="outline">
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View @{username} on GitHub
                </a>
              </Button>
            </div>
          )}

          {mounted && (
            <div
              ref={calendarRef}
              className={`calendar ${isLoading || error ? "hidden" : ""}`}
            >
              Loading GitHub contributions...
            </div>
          )}

          {mounted && !isLoading && !error && (
            <div className="mt-4 pt-4 border-t text-center">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                @{username}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
