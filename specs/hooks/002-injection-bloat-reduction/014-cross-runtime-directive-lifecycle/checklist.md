---
title: "Verification Checklist: Cross-Runtime Directive Lifecycle"
description: "Completed verification evidence for the historical cross-runtime directive-lifecycle delivery scope."
trigger_phrases:
  - "cross-runtime directive lifecycle checklist"
  - "directive lifecycle dedup verification"
importance_tier: "normal"
contextType: "general"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/014-cross-runtime-directive-lifecycle"
    last_updated_at: "2026-08-11T09:40:00Z"
    last_updated_by: "claude"
    recent_action: "Historical delivery gates and reconciliation completed; phase 018 owns current hardening"
    next_safe_action: "None; historical packet complete"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Cross-Runtime Directive Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md `REQ-001..007` (`REQ-001..005` P0: full-first/boundary rule, same-content suppression, fail-open, session isolation, Pi non-interference; `REQ-006..007` P1: kill-switch + frozen files).
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md architecture — pure decision over `(context, input)` + injected per-session state; one canonical core + plain-JS plugin mirror; file store for per-call subprocesses, in-memory map for the plugin.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Canonical core exists with the full export surface
  - **Evidence**: `hooks/lib/directive-lifecycle.ts` exports `decideDirectiveLifecycleDelivery`, `splitDirectiveBrief`, `isDirectiveLifecycleDedupEnabled`, `InMemoryDirectiveLifecycleStore`, `FileDirectiveLifecycleStore`, `defaultDirectiveLifecycleStore`, `resetDefaultDirectiveLifecycleStore`, `DIRECTIVE_SEPARATOR = '\nDirectives:'`, `MAX_DIRECTIVE_LIFECYCLE_SESSIONS = 64`.
- [x] CHK-011 [P1] Follows existing patterns
  - **Evidence**: split mirrors render.ts `DIRECTIVES_LABEL`; kill-switch env parsing mirrors 013's `isPiDirectiveDedupEnabled`; plugin mirror follows the render.ts-mirror convention and documents "prefer importing compiled dist when it exists".
- [x] CHK-012 [P0] Fail-open on every uncertain path
  - **Evidence**: `decideDirectiveLifecycleDelivery` returns `FULL_DIRECTIVE_LIFECYCLE_DELIVERY` for enabled=false, non-reducible/headless brief, missing or unconfirmed session, boundary, and dirty content; file-store `get`/`set`/`clear` catch and degrade; shim wraps the decision in try/catch keeping `emitted`.
- [x] CHK-013 [P0] Comment hygiene — no ephemeral ids/spec paths in code comments
  - **Evidence**: module header and block comments state durable WHY (recurring ~763 B payload, lifecycle rule, fail-open rationale); no ADR-/REQ-/CHK-/task-ids or spec paths in `directive-lifecycle.ts`, `user-prompt-submit.ts`, or `mk-skill-advisor.js` comments.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] First-turn full; identical repeat suppressed (route line kept) — core suite written
  - **Evidence**: `directive-lifecycle.vitest.ts` first/repeat cases (reducedContext is the head, no `Directives:` in the reduced output) plus shim DL1 and plugin PL1.
- [x] CHK-021 [P0] Re-delivery on lifecycle/dirty/unknown/fallback/kill-switch — core suite written
  - **Evidence**: core cases for `startup`/`resume`/`compact` boundaries, transcript shrink, path change, growth no-re-arm, dirty content, unknown/unconfirmed session, fallback, kill-switch, non-reducible brief; shim `DL2`-`DL6`; plugin `PL2`-`PL5`.
- [x] CHK-022 [P0] Lifecycle handlers re-arm full delivery — wiring present, plugin tests written
  - **Evidence**: shim `lifecycleEventFor` maps explicit lifecycle_source/lifecycle_event and SessionStart sources; plugin deletes the session's dedup record on `session.created`/`session.resumed`/`session.compacted`/`session.compact`/`session.deleted` and on `resetRuntimeState`; plugin PL2 (event) and PL3 (transform-carried) cover re-arm.
- [x] CHK-023 [P0] Session isolation and store durability — tests written
  - **Evidence**: core isolation case; `FileDirectiveLifecycleStore` round-trip, cross-instance persistence (per-call subprocess simulation), corrupt-record fail-open, bounded eviction, missing-dir clear, env-overridable base dir; plugin `PL6` isolation; plugin `PL7` status-tool reporting.
- [x] CHK-024 [P0] Full suite run green
  - **Evidence**: `npx vitest run` — directive-lifecycle.vitest.ts 21/21; claude-user-prompt-submit-hook.vitest.ts 16/16 (AS1-AS6, CHK-021, CHK-028, T014, swallows-async, DL1-DL6); mk-skill-advisor-plugin.vitest.ts 38/38 (PL1-PL7 + updated cache/fallback tests); Pi dispatch suite (.opencode/hooks/dispatch/pi) 54/54. 129 tests green across the four suites.
- [x] CHK-025 [P0] No regression
  - **Evidence**: detached-HEAD baseline worktree comparison (verifier run): the full mcp-server suite's 46 failures decompose into 39 pre-existing-at-HEAD + 7 new-at-the-time (PL1-PL7); the 7 were test-mock defects since fixed (plugin suite now 38/38; the 6 pre-existing plugin failures — stale fallback constant + stale 10s-default-timeout assumption — were root-caused and fixed in the same file). Remaining pre-existing failures in other files reproduce identically at HEAD. Frozen files byte-identical (`render.ts`, `policy-plan.ts`, 007 `activation-matrix.json`, `mk-skill-advisor-bridge.mjs`, `prompt-advisor.ts`): `git status` shows none modified.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The directive block is dropped ONLY on a confirmed session's byte-identical, same-epoch repeat; every other path delivers full. Evidence: `decideDirectiveLifecycleDelivery` guards (enabled, split, head non-empty, session id, confirmation, boundary, byte-match) and the plugin mirror's equivalent guards; core suite first/repeat/dirty cases.
- [x] CHK-FIX-002 [P0] The full directive block is re-delivered after every lifecycle boundary and content change, including the transcript shrink/path-change signature. Evidence: `isLifecycleBoundary` + `transcriptShrunkOrMoved` in the core; shim passes lifecycle event and transcript path/size; plugin re-arms on all five session events.
- [x] CHK-FIX-003 [P0] Pi is non-interfered and the layering stays transparent. Evidence: `prompt-advisor.ts` calls the shim with only `{ prompt, cwd, hook_event_name }` (no session id) so the shim decision always fails open there; Pi's own 013 `decidePiDirectiveDelivery` remains the sole active mechanism on Pi; no git diff on `prompt-advisor.ts`.
- [x] CHK-FIX-004 [P1] No cell in the 007 activation matrix was activated and no shared library changed. Evidence: zero git diff on `render.ts`, `policy-plan.ts`, the 007 activation folder, and `plugin-bridges/mk-skill-advisor-bridge.mjs` (bridge also has zero directive-lifecycle references).

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Guardrail never silently dropped
  - **Evidence**: suppression requires confirmed session + byte-identical block + same epoch; every uncertain path (unknown/unconfirmed session, fallback, kill-switch, corrupt/missing store, any throw) delivers `FULL_DIRECTIVE_LIFECYCLE_DELIVERY`; the directives-only fallback has no head and is never reducible.
- [x] CHK-031 [P1] No secrets, no new external surface
  - **Evidence**: file-store paths derive from `sha256` of cwd and session id, live under tmpdir (or the env override), use 0700 dirs / 0600 files; no network, no new packages; runtime opt-outs via env only.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with implementation
  - **Evidence**: all historical documents now report complete; phase 018 is authoritative for current hardening and `validate.sh --strict` confirms document consistency.
- [x] CHK-041 [P1] Code self-documents the guardrail rationale
  - **Evidence**: module header of `directive-lifecycle.ts` documents the recurring-payload problem and the fail-open lifecycle rule; the plugin's mirror section documents the same and points at the canonical file.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Writes confined to the packet and its implementation files
  - **Evidence**: new core, three test suites, and this packet; changes to `user-prompt-submit.ts` and `mk-skill-advisor.js` are the phase's own consumers; no residue outside the scoped set.
- [x] CHK-051 [P1] Scoped diff clean
  - **Evidence**: git status shows the expected consumer edits + new files; the bridge, `render.ts`, `policy-plan.ts`, the 007 folder, and `prompt-advisor.ts` have zero diff.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Pending gate |
|----------|-------|----------|--------------|
| P0 Items | 10 | 10/10 | 0/10 |
| P1 Items | 7 | 7/7 | 0/7 |
| P2 Items | 0 | 0/0 | 0/0 |

**Verification Date**: 2026-08-11; historical gate complete
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
