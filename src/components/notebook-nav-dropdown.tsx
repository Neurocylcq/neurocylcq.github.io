'use client';

import { cn } from '@/lib/cn';
import type { Folder, Node } from 'fumadocs-core/page-tree';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { useNotebookLayout } from 'fumadocs-ui/layouts/notebook';
import { isLayoutTabActive, type LayoutTab } from 'fumadocs-ui/layouts/shared';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

function getFolderUrl(folder: Folder): string | undefined {
  if (folder.index?.url) return folder.index.url;

  for (const child of folder.children) {
    if (child.type === 'page') return child.url;
    if (child.type === 'folder') {
      const nested = getFolderUrl(child);
      if (nested) return nested;
    }
  }

  return undefined;
}

function TreeNode({ node, pathname, depth = 0 }: { node: Node; pathname: string; depth?: number }) {
  if (node.type === 'separator') return null;

  if (node.type === 'page') {
    const active = pathname === node.url || pathname.startsWith(`${node.url}/`);

    return (
      <li>
        <Link
          href={node.url}
          className={cn(
            'block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
            active && 'bg-fd-primary/10 text-fd-primary',
            depth > 0 && 'ms-3',
          )}
        >
          {node.name}
        </Link>
      </li>
    );
  }

  const folderUrl = getFolderUrl(node);
  const active = folderUrl ? pathname === folderUrl || pathname.startsWith(`${folderUrl}/`) : false;

  return (
    <li>
      <div className={cn('flex items-center rounded-md', depth > 0 && 'ms-3')}>
        {folderUrl ? (
          <Link
            href={folderUrl}
            className={cn(
              'flex-1 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
              active && 'bg-fd-primary/10 text-fd-primary',
            )}
          >
            {node.name}
          </Link>
        ) : (
          <span className="px-2 py-1.5 text-sm text-fd-muted-foreground">{node.name}</span>
        )}
      </div>

      {node.children.length > 0 && (
        <ul className="mt-0.5 space-y-0.5">
          {node.children.map((child, idx) => (
            <TreeNode key={`${node.$id ?? String(node.name)}-${idx}`} node={child} pathname={pathname} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function NotebookNavDropdown() {
  const pathname = usePathname();
  const { props } = useNotebookLayout();
  const tabs = props.tabs;

  const rootTabs = useMemo(() => tabs.filter((tab): tab is LayoutTab & { $folder: Folder } => !!tab.$folder), [tabs]);
  const activeTab = useMemo(
    () => rootTabs.find((tab) => isLayoutTabActive(tab, pathname)) ?? rootTabs[0],
    [rootTabs, pathname],
  );

  const [selectedUrl, setSelectedUrl] = useState(activeTab?.url);
  const selected = rootTabs.find((tab) => tab.url === selectedUrl) ?? activeTab;

  if (rootTabs.length === 0 || !selected?.$folder) return props.nav?.children ?? null;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ color: 'ghost', size: 'sm' }),
          'h-8 gap-1.5 rounded-md px-2 text-fd-muted-foreground hover:text-fd-accent-foreground',
        )}
      >
        <span className="truncate max-w-[160px]">{selected.title}</span>
        <ChevronDown className="size-3.5" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[min(92vw,760px)] p-0">
        <div className="grid grid-cols-[220px_1fr] max-md:grid-cols-1">
          <div className="border-e bg-fd-card p-2 max-md:border-e-0 max-md:border-b">
            <p className="px-2 py-1 text-xs uppercase tracking-wide text-fd-muted-foreground">Notebooks</p>
            <div className="mt-1 space-y-0.5">
              {rootTabs.map((tab) => (
                <button
                  key={tab.url}
                  type="button"
                  onClick={() => setSelectedUrl(tab.url)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
                    selected.url === tab.url && 'bg-fd-primary/10 text-fd-primary',
                  )}
                >
                  <span className="truncate">{tab.title}</span>
                  <ChevronRight className="size-3.5 opacity-70" />
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[65vh] overflow-auto p-2">
            <ul className="space-y-0.5">
              {selected.$folder.children.map((node, idx) => (
                <TreeNode key={`${selected.url}-${idx}`} node={node} pathname={pathname} />
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
