---
title: "Tasks: Hook Feature Flags + Full Hub Index"
description: "Per-phase task tracking for hook kill-switches, the full hub index, remaining runtime adapters, and the final concern-by-runtime coverage matrix."
status: "in-progress"
completion_pct: 83
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

- [x] Guard `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs` — import `../../shared/hook-flags.cjs`
- [x] Guard `mcp-route-guard/cursor/mcp-route-guard.mjs` — import `../../shared/hook-flags.mjs`
- [x] Guard `mcp-route-guard/pi/mcp-route-guard.ts` — import `../../.opencode/hooks/shared/hook-flags.mjs` (Pi base settled)
- [x] Realign `plugins/mk-mcp-route-guard.js` to the shared helper — import `../hooks/shared/hook-flags.cjs`
- [x] Prove: default=ADVISORY, concern-off=silent, master-off=silent (4 stdin adapters); plugin + pi load OK

## PHASE 3 — Remaining hub concerns

- [x] dispatch (claude/codex/devin/pi + plugin)
- [x] post-edit-quality (claude/codex/devin/pi + plugin)
- [x] task-dispatch (claude/cursor/devin + plugin)
- [x] goal (cursor/pi + bin + plugin)

## PHASE 4 — Skill-owned concerns

- [x] skill-advisor · spec-gate · spec-memory · completion
- [x] session-lifecycle · git-preflight · directive-lifecycle
- [x] dist-freshness · codex-watchdog · permission-policy

## PHASE 5 — Full hub index + docs

- [x] Symlink every Phase 4 adapter into `.opencode/hooks/<concern>/<runtime>/` — 49 relative links, all resolved with `readlink -f`
- [ ] Rewrite hub `README.md` + `injection-contract.md` for the full-index model — skipped because this implementation's scope lock permits only new symlinks under `.opencode/hooks/`

## PHASE 6 — Cross-runtime validation

- [ ] Each runtime loads clean; master-off silences all; per-concern toggles verified; no stray files

## PHASE 7 — Remaining index gaps

- [x] Index Cursor dispatch coverage at `.opencode/hooks/dispatch/cursor/post-tool-use.mjs` [Evidence: relative link resolves to the live Cursor post-tool proxy with `readlink -f`]
- [x] Index Cursor post-edit-quality coverage at `.opencode/hooks/post-edit-quality/cursor/post-tool-use.mjs` [Evidence: relative link resolves to the same multiplexed proxy with `readlink -f`]
- [x] Keep Pi directive lifecycle represented by the existing `skill-advisor/pi/prompt-advisor.ts` index rather than adding a duplicate concern alias [Evidence: directive de-dup is embedded in the advisor adapter and is not independently guarded by `directive-lifecycle`]
- [x] Keep OpenCode session lifecycle represented by the existing owning plugin indexes rather than adding duplicate aliases [Evidence: session events are embedded across guarded `mk-*` plugins and no standalone `session-lifecycle` adapter exists]

## PHASE 8 — Fillable runtime adapters

- [ ] Add guarded advisory-only completion coverage for Cursor `onEnd`
- [ ] Add guarded advisory-only completion coverage for Pi's apt turn/session event
- [ ] Determine whether Codex and Pi expose genuine task-dispatch interception events; implement only where real
- [ ] Load-check every new adapter and prove default-on, concern-off, and master-off behavior

## PHASE 9 — Coverage matrix

- [ ] Append a complete concern × runtime coverage matrix to `.opencode/hooks/README.md`
- [ ] Record every intentionally unfilled gap as by-design or unavailable with a one-line reason
