'use client';

import { useEffect } from 'react';

const TOP_OFFSET = 20;
const DELTA_THRESHOLD = 8;

export function NavAutoHide() {
  useEffect(() => {
    let lastY = window.scrollY;
    let hidden = false;
    let ticking = false;

    const setHidden = (value: boolean) => {
      if (hidden === value) {
        return;
      }

      hidden = value;
      document.documentElement.dataset.navHidden = String(value);
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;

        if (y <= TOP_OFFSET) {
          setHidden(false);
        } else if (delta > DELTA_THRESHOLD) {
          setHidden(true);
        } else if (delta < -DELTA_THRESHOLD) {
          setHidden(false);
        }

        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      delete document.documentElement.dataset.navHidden;
    };
  }, []);

  return null;
}
