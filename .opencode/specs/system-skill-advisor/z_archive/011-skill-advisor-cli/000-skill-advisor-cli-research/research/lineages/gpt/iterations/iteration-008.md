# Iteration 8: KQ8 Coexistence, Races, and Orphans

## Focus

Root-cause the orphan launcher class and specify CLI-spawn reaping guarantees.

## Findings

1. The launcher serializes concurrent starts with a bootstrap lock and uses a strict single-writer lease check [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:72], [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:246].
2. If a live lease exists, the launcher attempts bridge handoff or reports the lease holder instead of starting another daemon [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:235].
3. The launcher writes its own PID lease after the second strict-single-writer check and before launching the server [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:635].
4. Normal cleanup exists: child exit clears lease; signals forward to child, wait up to 5s, then SIGKILL and clear lease; process exit also clears lease [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:543], [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:569], [SOURCE: file:.opencode/bin/mk-skill-advisor-launcher.cjs:610].
5. The orphan class is therefore outside the happy parent-child path: killed parents, stale bridge/no-socket states, worktree removal, or launchers that become resident without a supervising caller.
6. CLI-spawn guarantee needed: every CLI auto-spawn must have an owner token, idle timeout, lease PID plus process-group reaping, stale socket detection, and a no-bridge fallback that never leaves a second resident launcher alive after the request exits.

## Sources Consulted

- `mk-skill-advisor-launcher.cjs`
- Launcher bridge behavior comments in plugin bridge
- Attempted live `ps` inspection, blocked by sandbox

## Assessment

`newInfoRatio`: 0.76. Source-level lifecycle is clear; live process table verification was unavailable.

## Reflection

What worked: tracing signal and lease cleanup paths. What failed: process list command was blocked. Ruled out: relying only on `process.on('exit')`.

## Recommended Next Focus

KQ9: turn risks into implementation deltas.
