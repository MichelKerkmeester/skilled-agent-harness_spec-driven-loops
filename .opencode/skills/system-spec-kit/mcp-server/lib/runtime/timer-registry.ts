// ───────────────────────────────────────────────────────────────
// MODULE: Runtime Timer Registry
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

type TimerHandle = NodeJS.Timeout;

interface TimerRegistrationOptions {
  readonly unref?: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. STATE
// ───────────────────────────────────────────────────────────────

const registry = new Set<TimerHandle>();

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function track(handle: TimerHandle, options: TimerRegistrationOptions = {}): TimerHandle {
  registry.add(handle);
  if (options.unref) {
    handle.unref?.();
  }
  return handle;
}

export function registerInterval(
  fn: () => void,
  ms: number,
  options: TimerRegistrationOptions = {},
): TimerHandle {
  return track(setInterval(fn, ms), options);
}

export function registerTimeout(
  fn: () => void,
  ms: number,
  options: TimerRegistrationOptions = {},
): TimerHandle {
  const handle = setTimeout(() => {
    registry.delete(handle);
    fn();
  }, ms);
  return track(handle, options);
}

export function clearRegisteredTimer(handle: TimerHandle | null | undefined): void {
  if (!handle) return;
  clearInterval(handle);
  clearTimeout(handle);
  registry.delete(handle);
}

export function clearAllTimers(): void {
  for (const handle of registry) {
    clearInterval(handle);
    clearTimeout(handle);
  }
  registry.clear();
}

export function getRegisteredTimerCount(): number {
  return registry.size;
}
