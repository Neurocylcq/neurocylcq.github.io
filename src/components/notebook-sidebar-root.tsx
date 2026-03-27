'use client';

import { cn } from '@/lib/cn';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { ChevronDown, SidebarIcon } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook';
import { isLayoutTabActive } from 'fumadocs-ui/layouts/shared';
import { Sidebar, type SidebarProps } from 'fumadocs-ui/layouts/notebook/slots/sidebar';

const panelTop = 'top-[calc(--spacing(4)+var(--fd-docs-row-3))]';
const panelTransition = 'transition-all duration-200 ease-out';

export function NotebookSidebarRoot(props: SidebarProps) {
  const pathname = usePathname();
  const { slots, props: layoutProps } = useNotebookLayout();
  const { collapsed } = slots.sidebar.useSidebar();
  const tabs = layoutProps.tabs;
  const activeTab = tabs.find((tab) => isLayoutTabActive(tab, pathname)) ?? tabs[0];

  return (
    <>
      <Sidebar
        {...props}
        banner={() => (
          <div className="flex items-center gap-2 p-4 pb-2">
            <div className="min-w-0 flex-1">
              {tabs.length > 0 ? (
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ color: 'ghost', size: 'sm' }),
                      'h-8 w-full justify-between rounded-lg border px-2.5 text-fd-foreground',
                    )}
                  >
                    <span className="truncate">{activeTab?.title}</span>
                    <ChevronDown className="size-3.5" />
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[220px] p-1">
                    <div className="space-y-0.5">
                      {tabs.map((tab) => (
                        <Link
                          key={tab.url}
                          href={tab.url}
                          className={cn(
                            'block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
                            isLayoutTabActive(tab, pathname) && 'bg-fd-primary/10 text-fd-primary',
                          )}
                        >
                          {tab.title}
                        </Link>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : null}
            </div>
            <slots.sidebar.collapseTrigger
              aria-label="Collapse sidebar"
              className={cn(
                buttonVariants({
                  color: 'ghost',
                  size: 'icon-sm',
                  className: 'h-8 w-8 rounded-lg border bg-fd-card text-fd-muted-foreground shadow-sm hover:bg-fd-accent',
                }),
              )}
            >
              <SidebarIcon />
            </slots.sidebar.collapseTrigger>
          </div>
        )}
      />

      <div
        data-sidebar-panel=""
        className={cn(
          'fixed flex start-4 shadow-lg rounded-xl p-0.5 border bg-fd-muted text-fd-muted-foreground z-10 max-md:hidden',
          panelTop,
          panelTransition,
          !collapsed && 'pointer-events-none opacity-0 -translate-x-1',
        )}
      >
        <slots.sidebar.collapseTrigger
          aria-label="Expand sidebar"
          className={cn(
            buttonVariants({
              color: 'ghost',
              size: 'icon-sm',
              className: 'rounded-lg',
            }),
          )}
        >
          <SidebarIcon />
        </slots.sidebar.collapseTrigger>
      </div>
    </>
  );
}
