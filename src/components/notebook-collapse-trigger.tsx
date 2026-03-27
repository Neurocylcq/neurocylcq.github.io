'use client';

import type { ComponentProps } from 'react';
import { SidebarCollapseTrigger as NativeSidebarCollapseTrigger } from 'fumadocs-ui/layouts/notebook/slots/sidebar';

export function NotebookCollapseTrigger(props: ComponentProps<'button'>) {
  const className = typeof props.className === 'string' ? props.className : '';

  // Hide only the notebook header right-side collapse toggle.
  if (className.includes('-me-1.5')) {
    return null;
  }

  return <NativeSidebarCollapseTrigger {...props} />;
}
