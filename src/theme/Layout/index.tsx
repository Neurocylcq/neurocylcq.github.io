import { useEffect, useMemo, useState, type ReactNode } from "react";
import Layout from "@theme-original/Layout";
import { useLocation } from "@docusaurus/router";
import type LayoutType from "@theme/Layout";

import styles from "./styles.module.css";

type Props = Parameters<typeof LayoutType>[0];

export default function LayoutWrapper(props: Props): ReactNode {
  const location = useLocation();
  const [showDesktopToggle, setShowDesktopToggle] = useState(false);
  const [dock, setDock] = useState({ top: 84, left: 10 });

  const isDocsContext = useMemo(
    () => location.pathname.startsWith("/notes") || location.pathname.startsWith("/projects"),
    [location.pathname],
  );

  useEffect(() => {
    const update = () => {
      const desktop = window.matchMedia("(min-width: 997px)").matches;
      if (!desktop || !isDocsContext) {
        setShowDesktopToggle(false);
        return;
      }

      setShowDesktopToggle(true);
      const sidebar = document.querySelector(".theme-doc-sidebar-container") as HTMLElement | null;
      if (!sidebar) {
        setDock({ top: 84, left: 10 });
        return;
      }
      const rect = sidebar.getBoundingClientRect();
      setDock({ top: Math.max(rect.top + 8, 72), left: Math.max(rect.right - 16, 8) });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [isDocsContext]);

  const toggleSidebar = () => {
    const nativeBtn = document.querySelector('[class*="collapseSidebarButton"]') as HTMLButtonElement | null;
    nativeBtn?.click();
  };

  return (
    <>
      <Layout {...props} />
      {showDesktopToggle && (
        <button
          type="button"
          className={styles.sidebarFab}
          style={{ top: `${dock.top}px`, left: `${dock.left}px` }}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar">
          <span aria-hidden="true">◂</span>
        </button>
      )}
    </>
  );
}
