---
title: "Implementation Plan: Hook Feature Flags + Full Hub Index"
description: "Six-phase plan: ship a shared kill-switch guard, pilot it on one concern end-to-end, fan out to all hub and skill-owned concerns across six runtimes, then complete the hub symlink index and validate."
status: "in-progress"
completion_pct: 30
importance_tier: "high"
contextType: "plan"
parent: "./spec.md"
---
# Implementation Plan: Hook Feature Flags + Full Hub Index

<!-- SPECKIT_LEVEL: 3 -->

---

## GUARD CONTRACT

`.opencode/hooks/shared/hook-flags.{cjs,mjs,ts}` exports `isHookEnabled(concern, env?)`:
- returns `false` if `MK_HOOKS_DISABLED` is truthy (master), or if the canonical `MK_<CONCERN>_DISABLED` or any registered legacy alias is truthy;
- returns `true` otherwise (default on).

Canonical source is `hook-flags.cjs`; `.mjs` and `.ts` re-export it via `createRequire` (zero drift). Truthy = `1|true|yes|on`, case/space-insensitive.

Each adapter adds one guarded early-return at entry:
```
if (!isHookEnabled("<concern>")) return;   // or process.exit(0) for stdin-filter adapters
```
No other logic changes.

## PHASE DETAIL

| Phase | Work | Proof |
|---|---|---|
| 1 | Guard + master switch + tests | `node --test hook-flags.test.cjs` 7/7 |
| 2 (pilot) | Wire guard into all 6 `mcp-route-guard` adapters + plugin; import-path per runtime settled here | each adapter loads; `MK_MCP_ROUTE_GUARD_DISABLED=1` and `MK_HOOKS_DISABLED=1` both silence it; default still guards |
| 3 | Hub concerns: dispatch, post-edit-quality, task-dispatch, goal | per-concern toggle + master verified; existing plugin self-checks realigned to the helper |
| 4 | Skill-owned: skill-advisor, spec-gate, completion, session-lifecycle, git-preflight, spec-memory, directive-lifecycle, dist-freshness, codex-watchdog, permission-policy | same |
| 5 | Symlink every skill-owned hook into `.opencode/hooks/<concern>/<runtime>/`; rewrite hub README + `injection-contract.md` for the full-index model | symlinks resolve; Pi/OpenCode loaders still clean |
| 6 | Cross-runtime validation sweep | each runtime loads clean; master-off = all silent; toggles verified; no stray files |

## IMPORT-PATH NOTE (settled in Phase 2)

Adapter languages differ: `.cjs` require, `.mjs`/`.js` import, `.ts` (Pi/Claude) import. Pi resolves an extension's relative imports against the `.pi/extensions/` symlink base, so a Pi `.ts` adapter's import of the guard is written relative to that base. The pilot pins the exact working path per runtime before fan-out.

## STATUS

Phases 1-2 shipped. Import-path pattern settled per runtime kind (see implementation-summary). Phase 3 fan-out next.
