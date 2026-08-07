---
title: "Implementation Plan: Fix and Test deep-pi"
description: "Fork deep-pi at the pinned commit that already has full test coverage, apply two required fixes plus one optional P2 fix, and prove each with new tests that fail without it."
trigger_phrases:
  - "deep-pi fix and test plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi"
    last_updated_at: "2026-08-07T20:30:37Z"
    last_updated_by: "spec-author"
    recent_action: "HANDOFF review's 4 confirmed findings fixed; 60/60 tests"
    next_safe_action: "None — 006 packet complete"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Fix and Test deep-pi

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension) |
| **Framework** | Pi coding-agent extension hook API |
| **Storage** | None (deep-pi keeps no persistent stats file, unchanged by this phase) |
| **Testing** | vitest — the fork's real (unpublished-in-npm) test suite, extended with new tests for the fixes |

### Overview
Fork `christopherarter/deep-pi` at commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549` (the exact commit phase 004 already verified byte-identical to the installed `v1.0.0` package, and which carries a full vitest suite the npm tarball excludes). Apply two required fixes (silent-counter surfacing, warning-only model-drift signal) plus one optional P2 fix (defensive cost-math validation), and add tests that fail without each.

A `gpt-5.6-sol` xhigh review of the first draft of this work found the originally-proposed fix #2 (an activation-based model-drift fallback) would crash Pi's UI status-bar path for any unrecognized model id. That fix is redesigned here as warning-only — see §3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement grounded in a full read of the installed source, not assumption (`spec.md` §2)
- [x] Fork commit identified and confirmed to carry the real test suite (`git ls-tree` at `0f1cbd8` shows 8 test files; `git diff 0f1cbd8 HEAD -- extensions/` is empty, confirming no drift since)
- [x] Fixes scoped with explicit acceptance criteria and correct priorities after review (`spec.md` §4)
- [x] Fix #2's crash risk (unrecognized-model UI lookup) found by review, independently re-verified, and redesigned before implementation (`spec.md` §2)

### Definition of Done
- [x] Fixes #1, #2, and #3 all implemented, each with a new test that fails without it (two negative controls run — fix #3's guard, fix #2's provider check — both confirmed real)
- [x] Full test suite (8 files, 60 tests total: 52 existing + 8 new across two rounds) passes: `npm test` → `Tests 60 passed (60)`
- [x] `tsc --noEmit` exits 0, no output
- [x] Diff against the pinned commit limited to `extensions/deeppi.ts` (+30/-1), `extensions/deeppi/telemetry.ts` (+13/-0), and 5 test files (+202/-3) — `eligibility.ts` byte-identical
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same pattern as `003-fork-and-guard-cache-optimizer`: fork a small third-party Pi extension, patch a narrow set of hooks/functions, test each fix in isolation.

### Key Components
- **Silent-counter surfacing (fix #1)**: `formatDeepPiReport()`'s `ReportInput` gains `transformErrors: number` and `usageUnavailable: boolean` fields; `deeppi.ts`'s command handler passes `stability.transformErrors`/`telemetry.usageUnavailable` through; the report only shows a line when the value is nonzero/true, so a clean run's output is unchanged. `deeppi.ts`'s `session_start` handler additionally resets `stability.transformErrors = 0` (and `prunedThinking`/`preservedThinking` for consistency) so the report reflects the current session, matching how `resetTelemetry`/`resetStormBreaker` already work
- **Model-drift warning, NOT activation (fix #2, redesigned)**: `isDeepPiModel`'s exact-match gate (`DEEPPI_MODEL_IDS`) is **unmodified** — it remains the only thing that activates any hook, tool, or `state.byModel` key. Separately, in `session_start`/`model_select`, a new check runs: `if (ctx.model?.provider === "deepseek" && !isDeepPiModel(ctx.model) && matchesModelPattern(ctx.model, ["deepseek-v"]))` → `ctx.ui.notify(...)` once per distinct unrecognized id per session. This never touches `footerText`, `formatDeepPiReport`, `state.byModel`, or tool registration for that id — it can only ever notify, never activate. (Note: `matchesModelPattern()` expects `{id, provider, name}`; the real `ctx.model` object from Pi's model registry has a `name` field even though the narrower `DeepPiModel` interface in `eligibility.ts` doesn't declare one — the warning check reads `ctx.model` directly, not through that narrower type, so no cast or interface change is needed)
- **Cost-math validation, P2 (fix #3, optional)**: if implemented, `recordUsage()` gets an early-return guard — `if (!model?.cost || !usage?.cost) { state.costMathErrors++; return false; }` — placed BEFORE any of the existing `totals.*` mutations, not a try/catch wrapped around the whole function after mutations already ran (review found the original try/catch-after shape would leave `responses`/`hitTokens`/`missTokens`/`actualInputCost` partially updated). `costMathErrors` itself must also be surfaced in `/deeppi`'s report and reset in `session_start`, exactly like fix #1's counters — a HANDOFF review caught that the first implementation pass omitted this, leaving fix #3's own counter as an unsurfaced silent counter.

### Data Flow
Pi resolves the active model → `isDeepPiModel` gates all three hook groups exactly as in phase 004, completely unchanged. Two additions run alongside, not instead of, that gate: `session_start`/`model_select` independently checks for an unrecognized `deepseek`-provider id and warns (fix #2); `session_start` resets the two silent counters so `/deeppi`'s report is session-scoped (fix #1). Note also that `telemetry.ts`'s `message_end` hook has its own second, narrower gate (`ctx.model.id in state.byModel`) in addition to the shared `isDeepPiModel` check upstream — this was already true before this phase and is unchanged by it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reused the existing clone of `christopherarter/deep-pi` at commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549`; `npm install` run directly (network step, outside the sandboxed dispatch); baseline confirmed clean (52 tests, typecheck clean) before patching

### Phase 2: Core Implementation
- [x] Fix #1: `transformErrors`/`usageUnavailable` added to `ReportInput`, threaded from `stability`/`telemetry` state in `deeppi.ts`, shown only when nonzero/true; reset in `session_start` alongside `prunedThinking`/`preservedThinking`
- [x] Fix #2 (warning-only): unrecognized-`deepseek`-provider-id check added in `session_start`/`model_select` via a `warnedModelIds` Set, `ctx.ui?.notify?.(..., "warning")` once per distinct id per session — `isDeepPiModel`'s activation boundary, `state.byModel`, and tool registration confirmed untouched
- [x] Fix #3: early-return validation guard added in `recordUsage()` BEFORE any `totals.*` mutation, incrementing `TelemetryState.costMathErrors` on failure — implemented, not skipped, per the autonomous-run default

### Phase 3: Verification
- [x] New tests written (first round): stability-transform failure + failed usage record surface in the report and reset on `session_start` (fix #1); unrecognized `deepseek-v5-test` id triggers exactly one warning with no `state.byModel` entry/tool activation, while a static boundary check covers `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash` (fix #2); `recordUsage` with `model.cost === undefined` returns `false`, increments the counter, leaves totals byte-identical (fix #3)
- [x] New tests written (HANDOFF round, T010): `costMathErrors` surfaced in the report and reset test; a real-hook integration test exercising `warnOnUnrecognizedModel()` for `opencode`/`opencode-go` models (the first round's boundary check was static-only); `FakePi.notify()` now captures severity so the warning test can assert `"warning"`; `usage.cost === undefined` branch tested to match the existing `model.cost === undefined` one
- [x] `npm test`: `Test Files 8 passed (8)`, `Tests 60 passed (60)`; `npm run typecheck`: exits 0, no output — both re-run independently after both rounds, not just trusted from either dispatch's own report
- [x] `git diff 0f1cbd8124b4fb35df97f85aa943d730f4aae549 --numstat -- extensions/ tests/` limited to 7 files: `extensions/deeppi.ts` (+30/-1), `extensions/deeppi/telemetry.ts` (+13/-0), 5 test files (+202/-3); `eligibility.ts` diff empty
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (new) | Fix #1: counter surfacing + session-reset (both `transformErrors`/`usageUnavailable` and, after HANDOFF, `costMathErrors`); Fix #2: warning fires without any activation, boundary models stay silent through both a static check and a real-hook integration test, severity captured; Fix #3: undefined-`model.cost` and undefined-`usage.cost` guards both leave state unmutated | vitest, extending the fork's existing suite |
| Unit (existing) | All 8 existing test files must keep passing unmodified where the fixes don't touch them | vitest |
| Type check | Patched fork compiles cleanly under `"strict": true` | `tsc --noEmit` |
| Diff-based | Patched fork's diff against `0f1cbd8` is limited to the fixes actually implemented + their tests | `diff`/`git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `christopherarter/deep-pi` GitHub access at the pinned commit | External | Green (public, already cloned once during planning) | Cannot fork with the real test suite; would have to write all tests from scratch against the npm-published subset |
| Phase 004's `deep-pi` adoption already complete | Internal (parent packet) | Green (Complete) | This phase patches an already-adopted extension; no dependency on further phase 003/005 work |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix's new test can't be made to pass without breaking an existing test, or the diff-scope check finds unrelated changes
- **Procedure**: This phase produces a fork, not a live change — nothing to roll back at the environment level. Discard the working clone and restart from the pinned commit if a fix's approach proves unworkable.
<!-- /ANCHOR:rollback -->
