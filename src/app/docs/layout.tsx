import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import {
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from 'fumadocs-ui/layouts/notebook/slots/sidebar';
import { NotebookCollapseTrigger } from '@/components/notebook-collapse-trigger';
import { NotebookSidebarRoot } from '@/components/notebook-sidebar-root';

export default function Layout({ children }: LayoutProps<'/docs'>) {
    const { nav, ...rest } = baseOptions();

    const tree = source.getPageTree();

    return (
        <DocsLayout
            tree={tree}
            nav={{ ...nav, mode: 'top' }}
            tabs={[
                { title: 'DeepLearning', url: '/docs/deep-learning' },
                { title: 'Computer', url: '/docs/computer' },
            ]}
            tabMode="sidebar"
            sidebar={{
                collapsible: true,
                defaultOpenLevel: 1,
                prefetch: true,
            }}
            slots={{
                sidebar: {
                    provider: SidebarProvider,
                    root: NotebookSidebarRoot,
                    trigger: SidebarTrigger,
                    collapseTrigger: NotebookCollapseTrigger,
                    useSidebar,
                },
            }}
            {...rest}
        >
            {children}
        </DocsLayout>
    );
}
