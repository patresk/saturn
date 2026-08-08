import React, { useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';

// Neither pane can be dragged smaller than this, so one can never disappear.
export const MIN_PANE_PX = 100;
export const DEFAULT_FRACTION = 0.5;

const STORAGE_KEY = 'saturn.sidebarFraction';
const KEYBOARD_STEP = 0.02;

export function loadSidebarFraction(): number {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return DEFAULT_FRACTION;
    }
    const fraction = Number.parseFloat(stored);
    if (!Number.isFinite(fraction) || fraction <= 0 || fraction >= 1) {
      return DEFAULT_FRACTION;
    }
    return fraction;
  } catch (error) {
    return DEFAULT_FRACTION;
  }
}

export function saveSidebarFraction(fraction: number) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(fraction));
  } catch (error) {
    // Storage can be unavailable or full. Not worth failing the resize over.
  }
}

export function clampFraction(
  fraction: number,
  containerWidth: number,
): number {
  const minFraction = MIN_PANE_PX / containerWidth;
  const maxFraction = 1 - minFraction;
  if (minFraction >= maxFraction) {
    // The pane is too narrow to honour both minimums.
    return DEFAULT_FRACTION;
  }
  return Math.min(Math.max(fraction, minFraction), maxFraction);
}

// Rendered only while dragging, so the cursor stays put and the drag never
// selects text under it. Mounting/unmounting with the drag means React cleans it
// up for us, including if the pane closes mid-drag.
const DraggingStyles = createGlobalStyle`
  * {
    cursor: col-resize !important;
    user-select: none !important;
  }
`;

const Handle = styled.div<{ isDragging: boolean }>`
  flex: 0 0 4px;
  cursor: col-resize;
  touch-action: none;
  background-color: ${(props) => props.theme.colors.sidebarBorderColor};
  &:hover {
    background-color: ${(props) => props.theme.colors.tableRowActive};
  }
  ${(props) =>
    props.isDragging &&
    css`
      background-color: ${(props) => props.theme.colors.tableRowActive};
    `}
`;

export function Splitter(props: {
  containerRef: React.RefObject<HTMLDivElement>;
  fraction: number;
  onChange: (fraction: number) => void;
  onCommit: (fraction: number) => void;
}) {
  const { containerRef, fraction, onChange, onCommit } = props;
  const [isDragging, setIsDragging] = useState(false);

  // Derive the fraction from the container rect instead of a pixel delta, so it
  // stays correct under the `zoom` wrapper used by the dev harness.
  function fractionFromClientX(clientX: number): number | null {
    const container = containerRef.current;
    if (!container) {
      return null;
    }
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) {
      return null;
    }
    return clampFraction((rect.right - clientX) / rect.width, rect.width);
  }

  function nudge(delta: number) {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const next = clampFraction(
      fraction + delta,
      container.getBoundingClientRect().width,
    );
    onChange(next);
    onCommit(next);
  }

  return (
    <>
      {isDragging && <DraggingStyles />}
      <Handle
        isDragging={isDragging}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize request details"
        aria-valuenow={Math.round(fraction * 100)}
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDragging(true);
        }}
        onPointerMove={(event) => {
          if (!isDragging) {
            return;
          }
          const next = fractionFromClientX(event.clientX);
          if (next !== null) {
            onChange(next);
          }
        }}
        onPointerUp={(event) => {
          if (!isDragging) {
            return;
          }
          event.currentTarget.releasePointerCapture(event.pointerId);
          setIsDragging(false);
          // Commit where the pointer actually ended up, rather than trusting the
          // last render to have caught up with the final move.
          const next = fractionFromClientX(event.clientX) ?? fraction;
          onChange(next);
          onCommit(next);
        }}
        onDoubleClick={() => {
          onChange(DEFAULT_FRACTION);
          onCommit(DEFAULT_FRACTION);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            nudge(KEYBOARD_STEP);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            nudge(-KEYBOARD_STEP);
          }
        }}
      />
    </>
  );
}
