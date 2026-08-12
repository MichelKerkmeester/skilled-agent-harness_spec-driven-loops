---
title: "Tasks: Hook Feature Flags + Full Hub Index"
description: "Per-phase task tracking for the shared kill-switch guard, the mcp-route-guard pilot, the hub and skill-owned concern fan-out, the hub symlink index, and the cross-runtime validation sweep."
status: "in-progress"
completion_pct: 15
importance_tier: "high"
contextType: "tasks"
parent: "./spec.md"
---
# Tasks: Hook Feature Flags + Full Hub Index

<!-- SPECKIT_LEVEL: 3 -->

---

## PHASE 1 — Guard + master switch

- [x] `hook-flags.cjs` canonical resolver (master + per-concern + legacy aliases) — `.opencode/hooks/shared/hook-flags.cjs`
- [x] `hook-flags.mjs` + `hook-flags.ts` facades (re-export via `createRequire`, zero drift)
- [x] `hook-flags.test.cjs` — `node --test` 7/7 pass incl. cross-flavor parity

## PHASE 2 — Pilot: mcp-route-guard (all 6 runtimes)

- [ ] Guard `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs`
- [ ] Guard `mcp-route-guard/cursor/mcp-route-guard.mjs`
- [ ] Guard `mcp-route-guard/pi/mcp-route-guard.ts` (settle Pi import path)
- [ ] Realign `plugins/mk-mcp-route-guard.js` to the shared helper
- [ ] Prove: `MK_MCP_ROUTE_GUARD_DISABLED=1` and `MK_HOOKS_DISABLED=1` each silence it; default guards

## PHASE 3 — Remaining hub concerns

- [ ] dispatch (claude/codex/devin/pi + plugin)
- [ ] post-edit-quality (claude/codex/devin/pi + plugin)
- [ ] task-dispatch (claude/cursor/devin + plugin)
- [ ] goal (cursor/pi + bin + plugin)

## PHASE 4 — Skill-owned concerns

- [ ] skill-advisor · spec-gate · spec-memory · completion
- [ ] session-lifecycle · git-preflight · directive-lifecycle
- [ ] dist-freshness · codex-watchdog · permission-policy

## PHASE 5 — Full hub index + docs

- [ ] Symlink every skill-owned hook into `.opencode/hooks/<concern>/<runtime>/`
- [ ] Rewrite hub `README.md` + `injection-contract.md` for the full-index model

## PHASE 6 — Cross-runtime validation

- [ ] Each runtime loads clean; master-off silences all; per-concern toggles verified; no stray files
