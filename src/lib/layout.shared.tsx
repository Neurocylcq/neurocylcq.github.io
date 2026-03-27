import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

const globalLinks: LinkItemType[] = [
  {
    text: 'Docs',
    url: '/docs',
    active: 'nested-url',
  },
  {
    text: 'Apps',
    url: '/apps',
    active: 'url',
  },
  {
    text: 'About',
    url: '/about',
    active: 'url',
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
      url: '/',
      transparentMode: 'top',
    },
    links: globalLinks,
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
