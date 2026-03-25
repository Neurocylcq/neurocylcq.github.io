import { useEffect, useMemo, useState, type ReactNode } from "react";
import Layout from "@theme-original/Layout";
import { useLocation } from "@docusaurus/router";
import type LayoutType from "@theme/Layout";

import styles from "./styles.module.css";

type Props = Parameters<typeof LayoutType>[0];
const SIDEBAR_COLLAPSE_CLASS = "docs-sidebar-collapsed-custom";
const SIDEBAR_COLLAPSE_KEY = "docs.sidebarCollapsed";

export default function LayoutWrapper(props: Props): ReactNode {
  const location = useLocation();
  const [showDesktopToggle, setShowDesktopToggle] = useState(false);
  const [dock, setDock] = useState({ top: 84, left: 10 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isDocsContext = useMemo(
    () =>
      location.pathname.startsWith("/notes") ||
      location.pathname.startsWith("/projects"),
    [location.pathname],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";
    setIsSidebarCollapsed(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDocsContext && isSidebarCollapsed) {
      root.classList.add(SIDEBAR_COLLAPSE_CLASS);
    } else {
      root.classList.remove(SIDEBAR_COLLAPSE_CLASS);
    }

    window.localStorage.setItem(
      SIDEBAR_COLLAPSE_KEY,
      isSidebarCollapsed ? "1" : "0",
    );
    return () => root.classList.remove(SIDEBAR_COLLAPSE_CLASS);
  }, [isDocsContext, isSidebarCollapsed]);

  useEffect(() => {
    let frame = 0;
    let observer: ResizeObserver | undefined;

    const update = () => {
      const desktop = window.matchMedia("(min-width: 997px)").matches;
      if (!desktop || !isDocsContext) {
        setShowDesktopToggle(false);
        return;
      }

      setShowDesktopToggle(true);
      const navbar = document.querySelector(".navbar") as HTMLElement | null;
      const navBottom = navbar?.getBoundingClientRect().bottom ?? 64;
      const sidebarContainer = document.querySelector(
        ".theme-doc-sidebar-container",
      ) as HTMLElement | null;
      if (!sidebarContainer) {
        setDock({ top: Math.max(navBottom + 10, 74), left: 20 });
        return;
      }

      const sidebarEdge = document.querySelector(
        ".theme-doc-sidebar-container [class*='sidebar_']",
      ) as HTMLElement | null;
      const rect = sidebarContainer.getBoundingClientRect();
      const collapsed =
        isSidebarCollapsed ||
        sidebarContainer.getBoundingClientRect().width <= 8;
      const left = collapsed ? 12 : rect.right;
      setDock({ top: Math.max(navBottom + 10, 74), left });
    };

    const scheduleUpdate = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();

    const sidebarContainer = document.querySelector(
      ".theme-doc-sidebar-container",
    ) as HTMLElement | null;
    if (sidebarContainer && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        scheduleUpdate();
      });
      observer.observe(sidebarContainer);
    }

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      observer?.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [isDocsContext, isSidebarCollapsed]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <>
      <Layout {...props} />
      {showDesktopToggle && (
        <button
          type="button"
          className={`${styles.sidebarFab} ${isSidebarCollapsed ? styles.sidebarFabCollapsed : ""}`}
          style={{ top: `${dock.top}px`, left: `${dock.left}px` }}
          onClick={toggleSidebar}
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span aria-hidden="true">{isSidebarCollapsed ? "▸" : "◂"}</span>
        </button>
      )}
    </>
  );
}
