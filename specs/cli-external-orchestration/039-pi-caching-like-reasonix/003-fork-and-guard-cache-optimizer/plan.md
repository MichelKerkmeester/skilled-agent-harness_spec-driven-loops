---
title: "Implementation Plan: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard"
description: "Fork jiangge/pi-cache-optimizer, insert the narrow DeepSeek ownership guard into its six model-specific hooks, host the fork, and repoint the local Pi install at it."
trigger_phrases:
  - "pi-cache-optimizer fork plan"
  - "deepseek guard implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer"
    last_updated_at: "2026-08-07T13:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Vendored in-repo (Phase D); re-verified live"
    next_safe_action: "None — phase 003 complete"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension) |
| **Framework** | Pi coding-agent extension hook API |
| **Storage** | None (state stays in `pi-cache-optimizer-stats.json`, unaffected by this change) |
| **Testing** | Manual: source diff for scope, live `/cache-optimizer stats` comparison for regression |

### Overview
Patch a fork of the installed `pi-cache-optimizer` (v2.8.0, `github.com/jiangge/pi-cache-optimizer`) so 6 of its 7 registered hooks early-return via a new, narrow shared predicate (`isDeepPiOwned`, `provider === "deepseek"` + `deepseek-v4-flash`/`deepseek-v4-pro`) reading `ctx.model` — not the broader existing `isDeepSeekLikeModel` (`index.ts:1275`, substring-matches any "deepseek" model/provider) and not `event.model` (does not exist on these event types). `session_shutdown` stays unguarded (confirmed model-agnostic cleanup).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (`spec.md` §5)
- [x] Dependencies identified (public upstream source, already installed locally for reference)

### Definition of Done
- [x] Fork diff contains the shared predicate, six hook guards, and the boundary-test/export support at commit `5132d137ce28cb91ec12a5475832df4d5154085a`
- [x] `.pi/settings.json` points at the patched source (now the in-repo vendored copy, see Phase D), and `pi list` reports that source instead of npm
- [x] Live non-DeepSeek and provider-specific sessions show the required cache behavior — confirmed via `pi-cache-optimizer-stats.json` deltas (see §4 Phase C, re-confirmed against the vendored copy in Phase D)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extension hook guard (early-return via a new shared predicate), not a new caching engine.

### Key Components
- **`isDeepPiOwned(model)`** (new, added by this fork): `model?.provider === "deepseek" && (model.id === "deepseek-v4-flash" || model.id === "deepseek-v4-pro")` — matches `deep-pi`'s actual documented scope exactly, unlike the existing broader `isDeepSeekLikeModel` (`index.ts:1275`, substring match, stays in place for its original compat-warning use)
- **`session_start`** (`index.ts:7274`): sets long cache retention — needs the guard
- **`model_select`** (`index.ts:7291`): publishes DeepSeek compat status — needs the guard
- **`before_agent_start`** (`index.ts:7296`): reads model via `_ctx.model` (confirmed live, e.g. `resolveActiveRouteSnapshot(_ctx.model, _ctx)`) — needs the guard
- **`before_provider_request`** (`index.ts:7416`): reads model via `resolveRouteModel(ctx.model, ctx) ?? ctx.model` — needs the guard
- **`after_provider_response`** (`index.ts:7469`): same resolution pattern — needs the guard
- **`message_end`** (`index.ts:7530`): persists cache stats — needs the guard
- **`session_shutdown`** (`index.ts:7280`): global cleanup (stats flush, teardown, env restore) — confirmed model-agnostic, no guard needed

### Data Flow
Pi resolves the active model for a session/request onto `ctx.model` → calls every registered extension's hooks in registration order, each receiving `(event, ctx)` → the patched `pi-cache-optimizer` calls `isDeepPiOwned(ctx.model)` (route-resolved, matching each hook's existing resolution pattern) as the first statement in the 6 model-specific hooks; if true, it returns immediately (no prefix rewrite, no cache-key injection, no retention write, no stats write); if false — including for DeepSeek-family models on non-`deepseek` providers like `opencode/deepseek-v4-flash-free` — it runs its existing logic completely unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Audit (new — added after review)
- [x] Re-confirmed the 7-hook inventory against the fork commit and upstream source evidence
- [x] Resolved `after_provider_response`: the narrow guard precedes its 400-retry compatibility path

### Phase A: Fork & Diff
- [x] Fork `jiangge/pi-cache-optimizer` was hosted at `MichelKerkmeester/pi-cache-optimizer`, pinned to commit `5132d137ce28cb91ec12a5475832df4d5154085a`
- [x] Added the narrow `isDeepPiOwned` predicate and boundary test in the pinned fork
- [x] `model_select`'s guard correctly uses `event.model` — verified against Pi's own `ModelSelectEvent` type, which carries `model` directly on the event; the other 5 hooks correctly use route-resolved `ctx.model`
- [x] `tsc --noEmit` (exit 0) and 25/25 tests passed, run in a dedicated full clone of the fork before pushing/pinning the commit
- [x] GitHub commit diff is limited to `index.ts` and `tests/review-findings.test.ts`, containing the predicate, export, six guards, and boundary test

### Phase B: Host & Repoint
- [x] GitHub commit `5132d137ce28cb91ec12a5475832df4d5154085a` is reachable through the GitHub connector
- [x] Updated `.pi/settings.json`'s `packages` array to `git:github.com/MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a`
- [x] `pi list --approve` reports the pinned Git source and no npm `pi-cache-optimizer` entry

### Phase C: Non-Regression Smoke Test
- [x] `openai-codex/gpt-5.6-luna` (non-DeepSeek) live session: `totalRequests` incremented normally (31→32→33 across checks)
- [x] `opencode/deepseek-v4-flash-free` live session: new stats entry created (0→1), confirming continued coverage
- [x] Rollback tested: no active Pi sessions found (`pgrep -fl` empty), reverted to `npm:pi-cache-optimizer`, confirmed normal operation, re-applied the pinned fork source as final state

### Phase D: Delivery Mechanism Update (added 2026-08-07, operator request)
- [x] Vendored the pinned fork commit's `index.ts`/`package.json`/`tests/`/`tsconfig.json`/`types/`/`LICENSE`/`README*` into `.pi/extensions/pi-cache-optimizer/` in this repo; diff against the fork commit confirms `index.ts` is byte-identical
- [x] Ran `npm install` + `npm test` + `npm run typecheck` inside the vendored copy: 25/25 tests pass, typecheck clean
- [x] Updated `.pi/settings.json`'s `packages` entry from `git:github.com/MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a` to `extensions/pi-cache-optimizer` (Pi's local package-source type — no `npm:`/`git:` prefix)
- [x] `pi list` confirms `extensions/pi-cache-optimizer` resolves to `<repo>/.pi/extensions/pi-cache-optimizer`
- [x] Live smoke tests re-run against the vendored copy: DeepSeek-direct session → zero new `pi-cache-optimizer` stats entries; non-DeepSeek session → stats incremented normally
- [x] Temporary smoke-test session files removed after verification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type check | Guard uses valid fields (`ctx.model`, not `event.model`) | `tsc --noEmit` |
| Unit | `isDeepPiOwned` predicate boundary (deepseek-v4-flash/-pro true; opencode-routed deepseek false; unrelated models false) | Fork's own test suite |
| Diff-based | Fork vs. upstream source | `diff`/`git diff` |
| Manual regression | Non-DeepSeek session cache behavior vs. a fresh pre-patch A/B baseline | `/cache-optimizer stats`, `pi-cache-optimizer-stats.json` |
| Manual smoke | DeepSeek-direct-API session hook no-op (full cross-extension confirmation happens in phase 005 once deep-pi is installed); non-`deepseek`-provider DeepSeek-family model still optimized | Live Pi sessions with each model class selected |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `jiangge/pi-cache-optimizer` v2.8.0 source | External | Green (public, MIT, already installed locally) | Cannot diff or patch |
| GitHub hosting for the fork | External | Green (assumes existing account access); superseded as the operational dependency by Phase D's in-repo vendoring, but the fork remains published as the patch's origin | Falls back to a local-only patch outside version control, which does not survive reinstall (unacceptable per REQ-002) — Phase D's in-repo vendoring avoids this because the copy is tracked by this repo's own git history, not a bare `node_modules` edit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard breaks non-DeepSeek behavior, or a DeepSeek regression appears that the guard did not anticipate
- **Procedure**: Stop active Pi sessions first (a live session holds the old extension code in memory; reverting the source alone does not affect it). Revert `.pi/settings.json`'s `packages` entry back to `npm:pi-cache-optimizer` (the original unpatched package). Restart a session and confirm `/cache-optimizer stats` resumes normally. No data migration needed — `pi-cache-optimizer-stats.json` is provider-keyed and unaffected by the source swap.
- **Delivery evidence**: `pgrep -fl "^pi "` returned no matches (no active sessions to quiesce). The `.pi/settings.json` `packages` entry was reverted to `npm:pi-cache-optimizer`, a live `openai-codex/gpt-5.6-luna` session confirmed normal operation (`totalRequests` incremented), then the pinned fork source was re-applied and confirmed via `pi list`. Rollback is genuinely tested, not just documented.
<!-- /ANCHOR:rollback -->
