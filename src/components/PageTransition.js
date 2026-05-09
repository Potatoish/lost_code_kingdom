'use client';

/*
  PageTransition
  ==============
  Wraps every page and coordinates route-aware transitions.
  The important bit: we start the exit animation before navigation,
  then play a matching reveal animation on the next page.
*/

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

const EXIT_DURATION = 680;
const ENTER_DURATION = 960;
const TransitionContext = createContext(null);

function getTransitionMeta(pathname) {
  if (pathname === '/') {
    return { variant: 'book', label: 'Opening the Codebook' };
  }

  if (pathname === '/chapters') {
    return { variant: 'map', label: 'Charting the World Map' };
  }

  if (pathname === '/chapters/forest-of-variables') {
    return {
      variant: 'mist',
      label: 'Tracing the Forest Route',
      preview: 'forest',
      previewTitle: 'Forest of Variables',
      previewNote: 'Route I - Lumenwood',
      previewStyle: {
        '--transition-preview-image': "url('/art/forest-banner.jpg')",
        '--transition-preview-position': '24% 46%',
        '--transition-preview-accent': 'rgba(52, 211, 153, 0.28)',
        '--transition-preview-top-glow': 'rgba(16, 185, 129, 0.12)',
        '--transition-preview-route-start': 'rgba(167, 243, 208, 0.12)',
        '--transition-preview-route-mid': 'rgba(110, 231, 183, 0.58)',
        '--transition-preview-route-end': 'rgba(16, 185, 129, 0.98)',
        '--transition-preview-route-glow': 'rgba(16, 185, 129, 0.42)',
        '--transition-preview-route-angle': '-12deg',
        '--transition-preview-route-left': '14%',
        '--transition-preview-route-top': '56%',
        '--transition-preview-route-width': '58%',
        '--transition-preview-node-start': '10%',
        '--transition-preview-node-end': '88%',
      },
    };
  }

  if (pathname === '/chapters/river-of-conditions') {
    return {
      variant: 'mist',
      label: 'Following the River Current',
      preview: 'river',
      previewTitle: 'River of Conditions',
      previewNote: 'Route II - Shifting Waters',
      previewStyle: {
        '--transition-preview-image': "url('/art/river-banner.avif')",
        '--transition-preview-position': '52% 48%',
        '--transition-preview-accent': 'rgba(56, 189, 248, 0.28)',
        '--transition-preview-top-glow': 'rgba(56, 189, 248, 0.12)',
        '--transition-preview-route-start': 'rgba(191, 219, 254, 0.14)',
        '--transition-preview-route-mid': 'rgba(125, 211, 252, 0.54)',
        '--transition-preview-route-end': 'rgba(56, 189, 248, 0.98)',
        '--transition-preview-route-glow': 'rgba(56, 189, 248, 0.42)',
        '--transition-preview-route-angle': '10deg',
        '--transition-preview-route-left': '28%',
        '--transition-preview-route-top': '58%',
        '--transition-preview-route-width': '56%',
        '--transition-preview-node-start': '8%',
        '--transition-preview-node-end': '90%',
      },
    };
  }

  if (pathname === '/chapters/looping-caverns') {
    return {
      variant: 'mist',
      label: 'Descending Into the Echoes',
      preview: 'cavern',
      previewTitle: 'Looping Caverns',
      previewNote: 'Route III - Echo Caverns',
      previewStyle: {
        '--transition-preview-image': "url('/art/cave-banner.jpg')",
        '--transition-preview-position': '50% 48%',
        '--transition-preview-accent': 'rgba(245, 158, 11, 0.24)',
        '--transition-preview-top-glow': 'rgba(124, 58, 237, 0.14)',
        '--transition-preview-route-start': 'rgba(221, 214, 254, 0.14)',
        '--transition-preview-route-mid': 'rgba(250, 204, 21, 0.52)',
        '--transition-preview-route-end': 'rgba(245, 158, 11, 0.96)',
        '--transition-preview-route-glow': 'rgba(245, 158, 11, 0.38)',
        '--transition-preview-route-angle': '-4deg',
        '--transition-preview-route-left': '18%',
        '--transition-preview-route-top': '60%',
        '--transition-preview-route-width': '60%',
        '--transition-preview-node-start': '12%',
        '--transition-preview-node-end': '86%',
      },
    };
  }

  if (pathname === '/chapters/list-labyrinth') {
    return {
      variant: 'mist',
      label: 'Entering the Index Maze',
      preview: 'labyrinth',
      previewTitle: 'List Labyrinth',
      previewNote: 'Route IV - Index Maze',
      previewStyle: {
        '--transition-preview-image': "url('/art/list-labyrinth-scene.svg')",
        '--transition-preview-position': '50% 50%',
        '--transition-preview-accent': 'rgba(217, 70, 239, 0.24)',
        '--transition-preview-top-glow': 'rgba(34, 211, 238, 0.12)',
        '--transition-preview-route-start': 'rgba(245, 208, 254, 0.14)',
        '--transition-preview-route-mid': 'rgba(217, 70, 239, 0.54)',
        '--transition-preview-route-end': 'rgba(34, 211, 238, 0.96)',
        '--transition-preview-route-glow': 'rgba(217, 70, 239, 0.38)',
        '--transition-preview-route-angle': '7deg',
        '--transition-preview-route-left': '16%',
        '--transition-preview-route-top': '57%',
        '--transition-preview-route-width': '62%',
        '--transition-preview-node-start': '10%',
        '--transition-preview-node-end': '90%',
      },
    };
  }

  if (pathname.startsWith('/chapters/')) {
    return { variant: 'mist', label: 'Crossing Into the Next Realm' };
  }

  return { variant: 'book', label: 'Opening the Codebook' };
}

export function useRouteTransition() {
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error('useRouteTransition must be used inside PageTransition.');
  }

  return context;
}

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const exitTimerRef = useRef(null);
  const enterTimerRef = useRef(null);
  const pendingHrefRef = useRef(null);
  const [transition, setTransition] = useState(() => ({
    phase: 'entering',
    ...getTransitionMeta(pathname),
  }));

  // Clear timers when the wrapper unmounts.
  useEffect(() => {
    return () => {
      clearTimeout(exitTimerRef.current);
      clearTimeout(enterTimerRef.current);
    };
  }, []);

  // When the URL changes, reveal the new page using the matching style.
  useEffect(() => {
    const nextMeta = getTransitionMeta(pathname);

    clearTimeout(enterTimerRef.current);
    const frameId = window.requestAnimationFrame(() => {
      setTransition({
        phase: 'entering',
        ...nextMeta,
      });

      enterTimerRef.current = setTimeout(() => {
        setTransition((current) => ({ ...current, phase: 'idle' }));
        pendingHrefRef.current = null;
      }, ENTER_DURATION);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  const navigateWithTransition = useCallback(
    (href) => {
      if (!href || href === pathname || transition.phase === 'exiting') {
        return;
      }

      clearTimeout(exitTimerRef.current);
      clearTimeout(enterTimerRef.current);

      pendingHrefRef.current = href;
      setTransition({
        phase: 'exiting',
        ...getTransitionMeta(href),
      });

      exitTimerRef.current = setTimeout(() => {
        router.push(href);
      }, EXIT_DURATION);
    },
    [pathname, router, transition.phase]
  );

  const contextValue = useMemo(
    () => ({
      navigateWithTransition,
      isTransitioning: transition.phase !== 'idle',
    }),
    [navigateWithTransition, transition.phase]
  );

  const activeMeta = transition.variant
    ? transition
    : { ...getTransitionMeta(pathname), phase: transition.phase };
  const activeVariant = activeMeta.variant;

  return (
    <TransitionContext.Provider value={contextValue}>
      <div
        className={`page-transition ${
          transition.phase !== 'idle' ? 'page-transition--active' : ''
        }`}
      >
        <div
          className={`page-transition__overlay page-transition__overlay--${activeVariant} page-transition__overlay--${transition.phase}`}
          aria-hidden="true"
        >
          <div className="page-transition__veil" />
          <div className="page-transition__glow" />
          <div className="page-transition__streak" />
          <div className="page-transition__book">
            <div className="page-transition__page-edge" />
          </div>
          <div className="page-transition__mist" />
          <div className="page-transition__map">
            <div className="page-transition__map-ring" />
            <div className="page-transition__map-sigil" />
          </div>
          {activeMeta.preview ? (
            <div
              className={`page-transition__preview page-transition__preview--${activeMeta.preview}`}
              style={activeMeta.previewStyle}
            >
              <div className="page-transition__preview-image" />
              <div className="page-transition__preview-focus" />
              <div
                className={`page-transition__preview-ornaments page-transition__preview-ornaments--${activeMeta.preview}`}
              >
                <span className="page-transition__preview-ornament page-transition__preview-ornament--one" />
                <span className="page-transition__preview-ornament page-transition__preview-ornament--two" />
                <span className="page-transition__preview-ornament page-transition__preview-ornament--three" />
              </div>
              <div className="page-transition__preview-route">
                <span className="page-transition__preview-route-sweep" />
                <span className="page-transition__preview-node page-transition__preview-node--start" />
                <span className="page-transition__preview-node page-transition__preview-node--end" />
              </div>
              <div className="page-transition__preview-content">
                <p className="page-transition__preview-note">
                  {activeMeta.previewNote}
                </p>
                <p className="page-transition__preview-title">
                  {activeMeta.previewTitle}
                </p>
              </div>
            </div>
          ) : null}
          <div className="page-transition__caption">
            <span className="page-transition__caption-label">
              {activeMeta.label}
            </span>
          </div>
        </div>
        <div
          key={pathname}
          className={`page-transition__content page-transition__content--${activeVariant} page-transition__content--${transition.phase}`}
        >
          {children}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
