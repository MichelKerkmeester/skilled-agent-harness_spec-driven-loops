---
title: "Feature Specification: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard"
description: "Patch the installed pi-cache-optimizer extension so its two mutation hooks no-op on DeepSeek-matched models, clearing the way for deep-pi to own DeepSeek exclusively without double-mutating the same request."
trigger_phrases:
  - "pi-cache-optimizer deepseek guard"
  - "fork pi-cache-optimizer"
  - "deepseek exclusion patch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer"
    last_updated_at: "2026-08-07T13:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Patched source vendored in-repo; re-verified live"
    next_safe_action: "None — phase 003 complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REVIEW FIX (gpt-5.6-sol, high/fast, read-only): original guard used a nonexistent event.model field and covered only 2 of 6 hooks. Corrected with live-source verification."
      - "Fork hosted at public MichelKerkmeester/pi-cache-optimizer, commit 5132d137ce28cb91ec12a5475832df4d5154085a."
      - "after_provider_response's 400-retry path is covered by the same narrow guard; non-deepseek-provider models keep their existing logic."
      - "model_select correctly uses event.model (real field on that event type); the other 5 hooks correctly use ctx.model — not a defect, verified against Pi's types."
      - "codex exec's sandbox has no network and blocks .git writes; the fork push and live Pi-session verification ran directly, outside the dispatch."
      - "2026-08-07: patched source vendored in-repo (operator request) at .pi/extensions/pi-cache-optimizer/, resolved via Pi's local package source; re-verified 25/25 tests, tsc clean, live guard smoke tests pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Fork pi-cache-optimizer with a DeepSeek Exclusion Guard

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-synthesis-and-decision |
| **Successor** | 004-adopt-deep-pi-deepseek |
| **Handoff Criteria** | Patched source (shared predicate, six model-specific guards, boundary test — 25/25 tests, `tsc --noEmit` exit 0) exists at the pinned fork commit `MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a` and, per the 2026-08-07 delivery-mechanism update below, is vendored byte-identical in-repo at `.pi/extensions/pi-cache-optimizer/`; `.pi/settings.json` resolves it via that local path; live non-DeepSeek, `opencode/deepseek-v4-flash-free`, real DeepSeek-direct, and rollback smoke tests all passed with real evidence, re-run against the vendored copy — met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the "Split DeepSeek vs. non-DeepSeek Pi cache-optimization ownership" work, re-entering `002-synthesis-and-decision`'s ADR-001 under its own documented re-entry contract ("a new phase child and a superseding ADR").

**Scope Boundary**: Touches only the forked copy of `pi-cache-optimizer` and the local Pi install pointer. Does not touch `deep-pi` (phase 004) or author the superseding ADR (phase 005).

**Dependencies**:
- `jiangge/pi-cache-optimizer` v2.8.0 source (public, MIT) — already installed locally at `~/.pi/agent/npm/node_modules/pi-cache-optimizer/index.ts`
- GitHub hosting for the fork

**Deliverables**:
- A forked `pi-cache-optimizer` whose `before_agent_start` and `before_provider_request` hooks early-return on DeepSeek-matched models
- The local Pi install repointed at that fork
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`pi-cache-optimizer` v2.8.0 (installed, live stats confirm 89% hit rate / ~87% token-cache rate on `openai-codex/gpt-5.6-luna`) already has an `isDeepSeekLikeModel(model)` predicate (`index.ts:1275`), but it is used only for DeepSeek compat-warning advice. It registers **7** hooks total (`session_start:7274`, `session_shutdown:7280`, `model_select:7291`, `before_agent_start:7296`, `before_provider_request:7416`, `after_provider_response:7469`, `message_end:7530`); **6 of the 7 are model-specific and run unconditionally for every provider today, DeepSeek included** (`session_shutdown` is the one exception — it is global cleanup with no model branching, confirmed by reading its body, and needs no guard). Once the operator increases DeepSeek usage and adopts `deep-pi` for DeepSeek sessions (phase 004), both extensions would independently act on the same outbound DeepSeek request across all 6 of those hooks — redundant prefix-stability rewrites, redundant cache-retention env writes, and two uncoordinated stats counters (`pi-cache-optimizer-stats.json` vs. deep-pi's own telemetry).

A first draft of this guard proposed `isDeepSeekLikeModel(event.model)`. That is not implementable as written: neither `BeforeAgentStartEvent` nor `BeforeProviderRequestEvent` carries a `model` field (confirmed against Pi's `ExtensionEvent` type definitions). The actual model is available on the shared `ctx` parameter (`ExtensionContext.model`) that every one of these 7 handlers already receives — confirmed live in the installed source, e.g. `before_agent_start` reads `_ctx.model` via `resolveActiveRouteSnapshot(_ctx.model, _ctx)`, and `before_provider_request`/`after_provider_response`/`message_end` all resolve it the same way: `resolveRouteModel(ctx.model, ctx) ?? ctx.model`.

A second problem with the first draft: `isDeepSeekLikeModel` matches any model whose id/name/provider string contains "deepseek" — broader than `deep-pi`'s actual scope (direct DeepSeek API, `deepseek-v4-flash`/`deepseek-v4-pro` only). This environment's own `.pi/settings.json` lists `opencode/deepseek-v4-flash-free` as an enabled model — a DeepSeek-family model routed through a **different provider** (`opencode`, not `deepseek`). A blanket "deepseek"-substring guard would exclude that model from `pi-cache-optimizer` while `deep-pi` (DeepSeek-direct-API only) never claims it either, leaving it with **no cache optimizer at all**. This is a real, present configuration, not a hypothetical.

### Purpose
Patch `pi-cache-optimizer` so it fully steps aside — across all 6 model-specific hooks, not just 2 — for exactly the models `deep-pi` actually owns (`provider === "deepseek"` AND `id` is `deepseek-v4-flash` or `deepseek-v4-pro`), while every other provider, including DeepSeek-family models routed through non-`deepseek` providers, keeps the 89%-hit-rate baseline behavior exactly as it is today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fork `jiangge/pi-cache-optimizer` (GitHub) to a hosted remote the operator controls, pinned to an immutable commit (not a floating branch)
- Audit ALL 7 `pi.on(...)` registrations against live source (already done for this spec — see Problem Statement) and add a single shared `isDeepPiOwned(model)` early-return guard (`provider === "deepseek" && (id === "deepseek-v4-flash" || id === "deepseek-v4-pro")`) to the 6 that are model-specific: `session_start`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, `message_end`. Read the model from `ctx.model` (route-resolved via the existing `resolveRouteModel(ctx.model, ctx) ?? ctx.model` pattern each handler already uses), never from `event.model` (does not exist on any of these event types)
- Leave `session_shutdown` unguarded — confirmed model-agnostic global cleanup (stats flush, cache-hint service teardown, env restore)
- Repoint the local Pi install at the fork via `.pi/settings.json`'s `packages` array (confirmed the actual package-source registry in this environment — not `models.json`), not `node_modules` editing, which does not survive `pi install`/reinstall
- Typecheck (`tsc --noEmit`) and unit-test the patched fork before hosting it — the `event.model` defect in the first draft would have been caught immediately by a type check

### Out of Scope
- Modifying `deep-pi` itself — that is phase 004
- Changing `pi-cache-optimizer`'s existing DeepSeek compat-warning logic (`index.ts:2517-2628`) — it only emits advisory text, it does not mutate requests, so it is not part of the overlap problem this phase solves
- Upstreaming the guard to `jiangge/pi-cache-optimizer` — a separate, later decision
- Live A/B benchmarking of DeepSeek cache performance — deferred to phase 005
- `opencode/deepseek-v4-flash-free` and any other DeepSeek-family model NOT routed through the `deepseek` provider — these keep using `pi-cache-optimizer` exactly as today (the narrow `provider === "deepseek"` predicate deliberately does not exclude them)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `index.ts` (in the fork) | Modify | Insert the shared `isDeepPiOwned(ctx.model)` early-return guard at the top of 6 model-specific hook bodies (not `event.model`) |
| `.pi/settings.json` `packages` array | Modify | Point the `pi-cache-optimizer` entry at the pinned fork commit instead of `npm:pi-cache-optimizer` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared `isDeepPiOwned(model)` guard added as the first statement of all 6 model-specific hooks, reading `ctx.model` (route-resolved), never `event.model` | `grep -n "isDeepPiOwned" index.ts` shows a call inside `session_start`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, and `message_end`; `grep -n "event.model" index.ts` returns no new matches introduced by this patch |
| REQ-002 | Fork is hosted at a reachable git remote pinned to an immutable commit, and `.pi/settings.json`'s `packages` array resolves it, not the npm package | `.pi/settings.json`'s `packages` array shows the fork URL + commit SHA, not `npm:pi-cache-optimizer` |
| REQ-005 | Patched fork passes `tsc --noEmit` and the fork's own test suite before hosting | Typecheck exits 0; existing test suite passes; a targeted new test asserts the guard fires only for `provider === "deepseek"` + `deepseek-v4-flash`/`deepseek-v4-pro` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Non-DeepSeek behavior is provably unchanged | `diff` between the fork and upstream `jiangge/pi-cache-optimizer@v2.8.0` shows only the guard-clause insertions across the 6 hooks plus the shared predicate function |
| REQ-004 | Rollback path documented and tested with active Pi sessions quiesced | Reverting `.pi/settings.json`'s `packages` entry back to `npm:pi-cache-optimizer` is verified to work after stopping running Pi sessions, not just as a file edit |
| REQ-006 | `opencode/deepseek-v4-flash-free` (and any other non-`deepseek`-provider DeepSeek-family model) keeps working with `pi-cache-optimizer` unchanged | A live session on that model shows the same hook behavior before and after the patch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: DeepSeek-direct-API requests (`deepseek-v4-flash`/`deepseek-v4-pro`) receive zero `pi-cache-optimizer` hook mutation and zero stats accrual across all 6 model-specific hooks (verified in phase 005 with real payload/prompt diffs, not just visibility of a stats counter)
- **SC-002**: Non-DeepSeek cache-hit rate — measured via a controlled A/B workload, not a comparison against the historical cumulative 89% figure — shows no regression
- **SC-003**: `opencode/deepseek-v4-flash-free` and any other DeepSeek-family model outside the `deepseek` provider keep `pi-cache-optimizer` fully active, unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `jiangge/pi-cache-optimizer` upstream releases | Fork drifts from upstream fixes/features over time | Pin to an immutable commit; keep the diff to the shared predicate + 6 call sites so re-applying after an upstream version bump is mechanical |
| Risk | Guard predicate too broad (blanket "deepseek" substring match) | Confirmed real gap: `opencode/deepseek-v4-flash-free` (enabled in this environment's `.pi/settings.json`) would lose `pi-cache-optimizer` coverage while `deep-pi` never claims it either, leaving it with no optimizer at all | Use the narrow `provider === "deepseek" && id in {deepseek-v4-flash, deepseek-v4-pro}` predicate matching `deep-pi`'s actual documented scope, not a substring match |
| Risk | Guard reads `event.model` instead of `ctx.model` | Non-functional: `BeforeAgentStartEvent`/`BeforeProviderRequestEvent` have no `model` field; a naive `event.model` guard is a silent no-op or a type error, never actually excluding anything | REQ-001/REQ-005 require `ctx.model` (route-resolved) and a typecheck gate before hosting |
| Risk | Only 2 of 6 model-specific hooks patched | `session_start`'s cache-retention env write and `message_end`'s stats persistence would keep firing on DeepSeek even with the two mutation hooks guarded | REQ-001 requires the guard on all 6 hooks, confirmed by the full registration inventory in the Problem Statement |
| Risk | `.pi/settings.json` patch reverted by `pi install`/update | Guard silently disappears, overlap risk returns | REQ-002 requires a hosted, pinned fork + repointed `packages` entry, not a local-only edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved during delivery:

- The fork is hosted publicly at `MichelKerkmeester/pi-cache-optimizer`, pinned to commit `5132d137ce28cb91ec12a5475832df4d5154085a`.
- `after_provider_response` uses the same narrow guard before its 400-retry compatibility logic. This is correct for direct DeepSeek ownership and preserves the path for non-`deepseek` providers.
- `model_select`'s guard correctly uses `event.model` (that event type carries `model` directly, verified against Pi's own type definitions); the other 5 hooks correctly use route-resolved `ctx.model`. This is not a defect — an earlier automated pass mis-flagged it by applying the general rule too literally.
- All live checks (non-DeepSeek, `opencode/deepseek-v4-flash-free`, rollback) were run directly outside the `codex exec` sandbox, which has no outbound network — see `implementation-summary.md` for the full evidence trail.
- **Delivery mechanism update (2026-08-07):** at operator request, the patched source moved from a `git:`-sourced hosted fork to an in-repo vendored copy at `.pi/extensions/pi-cache-optimizer/` (Pi's `local` package-source type — a bare path with no `npm:`/`git:` prefix, confirmed in `@earendil-works/pi-coding-agent`'s `package-manager.js`: `isLocalPath()` treats any non-prefixed string as local, resolved directly against `.pi/`, no clone/copy/network involved). The vendored `index.ts` is byte-identical to the pinned fork commit above (diff-confirmed). Re-verified against the vendored copy: `npm test` 25/25, `tsc --noEmit` clean, `pi list` resolves `extensions/pi-cache-optimizer` to the in-repo path, live DeepSeek-direct session still produces zero `pi-cache-optimizer` stats entries, live non-DeepSeek session still increments them. The external fork remains published (harmless, zero cost) but is no longer the operational source — `.pi/settings.json` no longer references it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor decision**: `../002-synthesis-and-decision/decision-record.md` (ADR-001, the NO-GO this phase re-enters under its documented conditions)
- **Successor**: `../004-adopt-deep-pi-deepseek/spec.md`
