/**
 * Browser checks used by the animation components.
 * Only call these inside useEffect or event handlers: `window` doesn't exist on the server.
 */

/** True when the visitor turned on "reduce motion" in their OS settings. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** True for a mouse or trackpad (not a touch screen). Hover effects only make sense here. */
export function hasFinePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
