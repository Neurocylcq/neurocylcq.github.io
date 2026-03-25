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
    "@docusaurus/theme-live-codeblock",
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        indexDocs: true,
        docsRouteBasePath: ["notes", "projects"],
        // Avoid falling back to non-existent default docs plugin id.
        docsPluginIdForPreferredVersion: "notes",

        // For Docs using Chinese, it is recomended to set:
        // language: ["en", "zh"],

        // Customize the keyboard shortcut to focus search bar (default is "mod+k"):
        searchBarShortcutKeymap: "s", // Use 'S' key
        // searchBarShortcutKeymap: "ctrl+shift+f", // Use Ctrl+Shift+F

        // If you're using `noIndex: true`, set `forceIgnoreNoIndex` to enable local index:
        // forceIgnoreNoIndex: true,

        // Enable Ask AI integration:
        // askAi: {
        //   project: "your-project-name",
        //   apiUrl: "https://your-api-url.com/api/stream",
        //   hotkey: "cmd+I", // Optional: keyboard shortcut to trigger Ask AI
        // },
      },
    ],
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
          blogDescription:
            "Reviewed posts with references and stronger validation.",
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
        path: "docs/notes-home",
        routeBasePath: "notes",
        sidebarPath: "./sidebars/sidebarsNotesHome.ts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "notes-ml",
        path: "docs/machine-learning",
        routeBasePath: "notes/ml",
        sidebarPath: "./sidebars/sidebarsNotesMl.ts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "notes-dl",
        path: "docs/deep-learning",
        routeBasePath: "notes/dl",
        sidebarPath: "./sidebars/sidebarsNotesDl.ts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "notes-cs",
        path: "docs/computer-science",
        routeBasePath: "notes/cs",
        sidebarPath: "./sidebars/sidebarsNotesCs.ts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "projects-overview",
        path: "projects/overview",
        routeBasePath: "projects",
        sidebarPath: "./sidebars/sidebarsProjectsOverview.ts",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "projects-sample",
        path: "projects/sample-project",
        routeBasePath: "projects/sample",
        sidebarPath: "./sidebars/sidebarsProjectsSample.ts",
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
            {
              type: "docSidebar",
              label: "Overview",
              docsPluginId: "notes",
              sidebarId: "notesHomeSidebar",
            },
            {
              type: "docSidebar",
              label: "Machine Learning",
              docsPluginId: "notes-ml",
              sidebarId: "machineLearningSidebar",
            },
            {
              type: "docSidebar",
              label: "Deep Learning",
              docsPluginId: "notes-dl",
              sidebarId: "deepLearningSidebar",
            },
            {
              type: "docSidebar",
              label: "Computer Science",
              docsPluginId: "notes-cs",
              sidebarId: "computerScienceSidebar",
            },
            {
              type: "doc",
              label: "Status System",
              docsPluginId: "notes",
              docId: "status-system",
            },
          ],
        },
        {
          type: "dropdown",
          position: "left",
          label: "Projects",
          items: [
            { to: "/projects", label: "Overview" },
            { to: "/projects/sample", label: "Sample Project" },
          ],
        },
        {
          to: "/apps",
          label: "Apps",
          position: "left",
          className: "navbar-apps-pill",
        },
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
              to: "/notes/ml",
            },
            {
              label: "Deep Learning",
              to: "/notes/dl",
            },
            {
              label: "Computer Science",
              to: "/notes/cs",
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
            {
              label: "Sample Project",
              to: "/projects/sample",
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
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
