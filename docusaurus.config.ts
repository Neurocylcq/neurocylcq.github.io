import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Neurocylcq",
  tagline: "Knowledge base, formal articles, and project wikis",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://neurocylcq.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Neurocylcq", // Usually your GitHub org/user name.
  projectName: "neurocylcq.github.io", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themes: [
    '@docusaurus/theme-live-codeblock',
    '@docusaurus/theme-mermaid'
  ],

  markdown: {
    mermaid: true,
  },

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          blogTitle: "Blog",
          blogDescription: "Reviewed posts with references and stronger validation.",
          routeBasePath: "blog",
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    "./plugins/notes-status-validator.cjs",
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "notes",
        path: "docs",
        routeBasePath: "notes",
        sidebarPath: "./sidebarsNotes.ts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "projects",
        path: "projects",
        routeBasePath: "projects",
        sidebarPath: "./sidebarsProjects.ts",
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "Neurocylcq",
      logo: {
        alt: "Neurocylcq Logo",
        src: "img/logo.svg",
      },
      items: [
        { to: "/", label: "Home", activeBaseRegex: "^/$", position: "left" },
        {
          type: "dropdown",
          position: "left",
          label: "Blog",
          items: [
            { to: "/blog", label: "All Posts" },
            { to: "/blog/tags", label: "Tags" },
            { to: "/blog/writing-standards", label: "Writing Standards" },
          ],
        },
        {
          type: "dropdown",
          position: "left",
          label: "Notes",
          items: [
            { to: "/notes", label: "Overview" },
            { to: "/notes/machine-learning", label: "Machine Learning" },
            { to: "/notes/computer-science", label: "Computer Science" },
            { to: "/notes/status-system", label: "Status System" },
          ],
        },
        {
          type: "dropdown",
          position: "left",
          label: "Projects",
          items: [
            { to: "/projects", label: "Overview" },
            { to: "/projects/sample-project", label: "Sample Project" },
          ],
        },
        { to: "/apps", label: "Apps", position: "left", className: "navbar-apps-pill" },
        { to: "/about", label: "About", position: "left" },
        {
          href: "https://github.com/Neurocylcq",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Notes",
          items: [
            {
              label: "Overview",
              to: "/notes",
            },
            {
              label: "Machine Learning",
              to: "/notes/machine-learning",
            },
            {
              label: "Computer Science",
              to: "/notes/computer-science",
            },
          ],
        },
        {
          title: "Apps",
          items: [
            {
              label: "Frontend Apps",
              to: "/apps",
            },
          ],
        },
        {
          title: "Projects",
          items: [
            {
              label: "Project Wiki",
              to: "/projects",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/Neurocylcq",
            },
          ],
        },
        {
          title: "About",
          items: [
            {
              label: "About This Site",
              to: "/about",
            },
            {
              label: "Writing Standards",
              to: "/blog/writing-standards",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Neurocylcq, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
    }
  } satisfies Preset.ThemeConfig,
};

export default config;
