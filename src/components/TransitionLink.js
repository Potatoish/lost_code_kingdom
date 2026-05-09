'use client';

/*
  TransitionLink
  ==============
  Small wrapper around Next.js Link that starts our custom page
  transition before changing routes.
*/

import Link from 'next/link';
import { useRouteTransition } from '@/components/PageTransition';

export default function TransitionLink({
  href,
  onClick,
  target,
  rel,
  children,
  ...props
}) {
  const { navigateWithTransition, isTransitioning } = useRouteTransition();

  function handleClick(event) {
    onClick?.(event);

    // Let the browser handle special clicks like a normal link.
    if (
      event.defaultPrevented ||
      target === '_blank' ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (typeof href !== 'string') {
      return;
    }

    event.preventDefault();
    navigateWithTransition(href);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      target={target}
      rel={rel}
      aria-disabled={isTransitioning ? 'true' : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
