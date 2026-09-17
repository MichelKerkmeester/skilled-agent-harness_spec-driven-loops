// ───────────────────────────────────────────────────────────────────
// MODULE: Daemon Detect
// ───────────────────────────────────────────────────────────────────
// Process-liveness probe. The save path owns no background service any more, so the
// only remaining caller is the workflow save lock, which must know whether a recorded
// owner pid is alive before reclaiming the lock as stale.

// ───────────────────────────────────────────────────────────────────
// 1. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export function isProcessAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    return code !== 'ESRCH';
  }
}
