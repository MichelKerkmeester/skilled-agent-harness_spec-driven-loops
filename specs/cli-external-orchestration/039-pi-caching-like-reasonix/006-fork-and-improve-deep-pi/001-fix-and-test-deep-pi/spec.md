---
title: "Feature Specification: Fix and Test deep-pi"
description: "Fork deep-pi at the pinned commit, apply two required fixes (silent-counter surfacing, warning-only model-drift signal) plus one optional P2 fix, and prove each with a new test."
trigger_phrases:
  - "deep-pi fix and test"
  - "deep-pi patch"
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
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-006-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "deep-pi's pinned commit has a full vitest suite (8 files, 958 lines) NOT shipped in the npm tarball. Forking from it gives full test coverage for free."
      - "gpt-5.6-sol (xhigh) found the original fix #2 (activation fallback) would crash on any unrecognized model id; redesigned warning-only, independently re-verified before accepting."
      - "Same review disproved fix #3's original justification via provider-composer.js:62; demoted REQ-003 to P2. gpt-5.6-luna implemented all three fixes; independently re-verified myself."
      - "A second gpt-5.6-sol HANDOFF review (post-implementation) found 4 more real, confirmed gaps: costMathErrors never surfaced (the exact bug class this phase fixes), a boundary test that never exercised the real code path, discarded notification severity, and an untested guard branch. All fixed, re-tested (60/60), and re-verified with a second negative control."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Fix and Test deep-pi

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-vendor-and-repoint |
| **Handoff Criteria** | Fixes #1/#2/#3 implemented with passing new tests, full test suite green (60/60 after the HANDOFF review's 4 confirmed findings were fixed), `tsc --noEmit` clean, diff against the pinned commit limited to the fixes and their tests — met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the 006 "Fork and Improve deep-pi" work — the code-authoring and unit-testing phase. It produces the patched fork that phase 2 vendors and phase 3 verifies live.

**Scope Boundary**: Touches only the forked copy of `deep-pi`'s source and its test suite. Does not touch this repo's `.pi/` directory (phase 2) or run any live Pi session (phase 3).

**Dependencies**:
- `deep-pi` v1.0.0 already installed and active (phase 004) — this phase patches a fork, it does not re-decide adoption
- `christopherarter/deep-pi`'s real GitHub history, specifically the pinned commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549`, already verified byte-identical to the installed package (phase 004) and confirmed to carry the full (npm-excluded) test suite (this phase's own planning)

**Deliverables**:
- A forked, patched `deep-pi` with fixes #1 and #2 implemented and tested; fix #3 implemented and tested, or explicitly cut, per the operator's decision on the open question below
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A full read of `deep-pi`'s installed source (1,299 lines across **7** files — `deeppi.ts`, `eligibility.ts`, `stability.ts`, `stormbreaker.ts`, `telemetry.ts`, `hashlines.ts`, `utils.ts`) surfaced source-level gaps. An adversarial `gpt-5.6-sol` (xhigh) review independently re-verified every claim below against the real source and found two of the three originally-proposed fixes needed rework before they were safe to implement — both corrections are folded in here, not left as a separate errata:

1. **Silent failure counters**: `stability.ts`'s `StabilityState.transformErrors` increments whenever `stabilizeMessages`/`freezeSessionTimestamps`/`capturePrefixShape` throws (each wrapped in its own try/catch), but nothing reads this field anywhere — confirmed by reading `telemetry.ts`'s `ReportInput` interface and `formatDeepPiReport` body line by line. The same class of gap exists for `TelemetryState.usageUnavailable` (`telemetry.ts:27`, set on a failed usage record, never read or reported). Neither counter is reset in `session_start` (`deeppi.ts:28` resets `telemetry`/`storm`/`stability.previousShape`/`latestChurn`/`frozenLines`, but not `transformErrors`, `prunedThinking`, or `preservedThinking`) — so surfacing them without also resetting them would mix prior-session errors into a report the operator reasonably expects to reflect the current session.
2. **Hardcoded model allowlist, no fallback, and no drift warning**: `eligibility.ts`'s `isDeepPiModel` hardcodes exactly `deepseek-v4-flash`/`deepseek-v4-pro` (`DEEPPI_MODEL_IDS`). `utils.ts` exports a `matchesModelPattern()` function, never called anywhere in the extension (confirmed via `grep -rn "matchesModelPattern" extensions/`). When DeepSeek ships a new direct-API model id, `deep-pi` silently goes dormant for it with zero operator-visible signal. **The original plan's proposed fix — actually activating `deep-pi` for any `provider === "deepseek"` id matching a `deepseek-v` pattern — is unsafe and was rejected on review**: `TelemetryState.byModel` is a fixed two-key object (`{deepseek-v4-flash, deepseek-v4-pro}`), so `footerText()`'s `state.byModel[modelId]` and `formatDeepPiReport()`'s equivalent lookup would be `undefined` for any other id, and `cacheHitRate(undefined)` throws reading `totals.hitTokens` on `undefined` — a real crash in the UI status-bar path, not a hypothetical. `matchesModelPattern()` also requires `{id, provider, name}` while `DeepPiModel` only carries `{provider, id}` — a type error under the fork's `"strict": true` tsconfig. The corrected design (§3) only *warns*, it never activates functionality for an unrecognized id.
3. **Unguarded telemetry cost math — reframed as defensive hardening, not a confirmed live defect**: `telemetry.ts`'s `recordUsage()` computes `model.cost.input - model.cost.cacheRead` with no guard. The original justification — "a custom/self-hosted DeepSeek-compatible endpoint missing pricing metadata" — was checked against Pi's actual model-loading code and disproven: `provider-composer.js`'s `modelFromJson()` normalizes a custom model definition's missing `cost` to `{input:0, output:0, cacheRead:0, cacheWrite:0}`, never `undefined` (confirmed by reading the function directly). No reachable path producing `model.cost === undefined` through Pi's normal contract was found. This is downgraded to P2 defensive hardening against malformed input, not a P0/P1 fix for a demonstrated bug. Pi's own hook runner (`extensions/runner.js`'s `emitMessageEnd`, confirmed by reading it) does catch each handler's exceptions per-handler and routes them to `emitError` — so even in the disproven scenario, this would not crash a session, only silently skip that turn's telemetry update. If pursued, note that `recordUsage()` mutates `responses`/`hitTokens`/`missTokens`/`actualInputCost` *before* the line that would throw, so a bare try/catch around the whole function would leave partially-updated state — any real fix must validate before mutating, not wrap-and-catch after.

A fourth candidate gap was investigated and deliberately excluded: `edit_lines` (in `hashlines.ts`) structurally cannot create new files (it always reads existing content first to compute hashes), so new-file creation on a DeepSeek session still falls back to the standard `edit`/`write` tools. This is a design property of hash-anchored editing, not a bug, and stays out of scope for the whole 006 packet.

### Purpose
Patch `deep-pi` to close the silent-diagnostics gap (#1) and add a safe, warning-only drift signal (#2) with real fixes and real tests; treat the cost-math hardening (#3) as optional P2 with a correct implementation shape if pursued.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix #1: thread `StabilityState.transformErrors` and `TelemetryState.usageUnavailable` into `formatDeepPiReport()`'s output and the `/deeppi` command, so nonzero counts are visible without reading source; add both counters to `session_start`'s reset block so the report reflects the current session, not lifetime state
- Fix #2 (warning-only, not activation): `isDeepPiModel`'s exact-match gate (`DEEPPI_MODEL_IDS`) stays completely unchanged — it is what actually activates every hook, tool, and telemetry key, and none of that changes. Separately, `session_start`/`model_select` gains a narrow check: if `ctx.model.provider === "deepseek"` and the id is NOT in `DEEPPI_MODEL_IDS` but does match a `deepseek-v` pattern (via the existing, currently-unused `matchesModelPattern()`), emit one `ctx.ui.notify(..., "warning")`. No hook, tool, or `state.byModel` entry activates for the unrecognized id — this cannot reproduce the crash the original design had, because nothing downstream of the warning ever looks up `state.byModel[unrecognizedId]`
- Fix #3 (P2, optional): if pursued, validate `model?.cost` and `usage?.cost` are defined *before the `totals.*` mutations that follow* in `recordUsage()`, returning early with a counter increment on failure — not a try/catch wrapped around the whole function after those mutations have already run. (Precision note added after HANDOFF review: `recordUsage`'s own pre-existing, unmodified first check — a different failure mode, `usage.input + usage.cacheRead === 0` — sets a simple boolean flag and returns before fix #3's guard is even reached. That's not the partial-`totals`-corruption bug fix #3 exists to prevent; the actual guarantee that matters — `totals` is never partially updated — holds.)
- Fork `christopherarter/deep-pi` at the pinned commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549` — this commit already carries the full test suite that the npm tarball's `files` field excludes
- Add new tests for fix #1 (transform/usage failure surfacing, and reset-on-session-start) and fix #2 (warning fires for an unrecognized `deepseek`-provider id, no hook/tool/telemetry activation occurs, `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash` still correctly excluded)

### Out of Scope
- Vendoring the patched fork into this repo — phase 2
- Any live Pi session — phase 3
- Fix #4 (`edit_lines` cannot create new files) — a deliberate design property of hash-anchored editing, not attempted anywhere in 006
- Actually activating deep-pi for unrecognized model ids — fix #2 is warning-only by design, not a functional expansion

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `extensions/deeppi/eligibility.ts` (fork) | No change expected | `isDeepPiModel`'s activation boundary is intentionally untouched |
| `extensions/deeppi/stability.ts` (fork) | No change expected | `transformErrors` already exists; only its consumer and reset lifecycle change |
| `extensions/deeppi/telemetry.ts` (fork) | Modify | Thread `transformErrors`/`usageUnavailable` into the report (fix #1); optionally guard `recordUsage` (fix #3, P2) |
| `extensions/deeppi.ts` (fork) | Modify | Reset the two counters in `session_start` (fix #1); add the warning-only drift check in `session_start`/`model_select` (fix #2) |
| `tests/telemetry.test.ts` / `tests/stability.test.ts` / `tests/eligibility.test.ts` (fork) | Modify | New tests for fixes #1 and #2 (and #3 if pursued) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `transformErrors`, `usageUnavailable`, and `costMathErrors` are all surfaced in `/deeppi`'s report, reset per session | `grep -n "transformErrors\|usageUnavailable\|costMathErrors" extensions/deeppi/telemetry.ts extensions/deeppi.ts` shows all three read, passed through, and reset in `session_start`; new tests force each failure mode and assert the report reflects it, then assert reset on the next `session_start`. **`costMathErrors` was originally omitted from this requirement's implementation — the HANDOFF review caught that fix #3's own counter had become exactly the class of silent counter this phase exists to fix; corrected and re-verified.** |
| REQ-002 | Model-drift warning fires for an unrecognized `deepseek`-provider id WITHOUT activating any deep-pi functionality for it | New tests confirm: (a) `isDeepPiModel` is unchanged — still accepts exactly `deepseek-v4-flash`/`deepseek-v4-pro`; (b) a synthetic `deepseek-v5-test` id (`provider: "deepseek"`) triggers exactly one `ctx.ui.notify(..., "warning")` call and does NOT register in `state.byModel`, does NOT activate `edit_lines`, and does NOT call `footerText`/`formatDeepPiReport` with that id; (c) `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash` (both currently enabled in `.pi/settings.json`) trigger no warning and no activation, exactly as today |
| REQ-004 | Patched fork passes its full test suite, existing and new | `npm test` (vitest) exits 0 with all existing tests still passing plus the new ones for REQ-001/REQ-002 |
| REQ-006 | Non-regression: existing DeepSeek-direct behavior unchanged outside the fixes | `diff` between the patched fork and the pinned commit `0f1cbd8` shows only the fix-related hunks, no unrelated changes. Non-deferrable — this is scope integrity, not a negotiable item |

### P2 - Optional (defer or cut without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `recordUsage`'s cost math validated before mutation, not wrapped-and-caught after | A new test calls `recordUsage` with `model.cost === undefined` and asserts: no exception, an incremented error counter, AND that `responses`/`hitTokens`/`missTokens`/`actualInputCost` are NOT partially updated (all-or-nothing, not a partial write). Demoted from P0 to P2 after `provider-composer.js:62` confirmed a custom model's missing `cost` is normalized to a zero-valued object, not `undefined`, through Pi's normal model-loading path — no reachable trigger for this scenario was found; this is defensive hardening against malformed input, not a fix for a demonstrated live defect |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fixes #1 and #2 each have a real fix and a real test that fails without the fix and passes with it; fix #3 (P2) gets the same treatment only if pursued
- **SC-002**: Zero behavioral change to `deep-pi`'s existing DeepSeek-direct activation boundary — fix #2 adds a warning, never a new activation path
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `deep-pi` GitHub repo access to the pinned commit | Needed to fork with the real test suite intact (not shipped in the npm tarball) | Already confirmed reachable and byte-identical in phase 004; a local clone from prior exploration already exists |
| Risk | An activation-based fix #2 would crash the UI status path for unrecognized models | Confirmed by review: `footerText()`/`formatDeepPiReport()` index a fixed two-key `state.byModel` object; an unrecognized id makes `cacheHitRate(undefined)` throw reading `totals.hitTokens` | Fix #2 is redesigned to warn only — it never touches `state.byModel`, `footerText`, or any hook activation for an unrecognized id, so this crash surface cannot be introduced |
| Risk | Fix #2's warning pattern-matches too broadly | Could warn (harmlessly, since it doesn't activate anything) or worse, later be extended into an activation path that duplicates `pi-cache-optimizer`'s coverage of e.g. `opencode/deepseek-v4-flash-free` | REQ-002 requires tests asserting both that model AND `opencode-go/deepseek-v4-flash` trigger no warning and no activation; the check is scoped to `provider === "deepseek"` before the pattern match runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Fix #2 is now warning-only (see §2/§3) after review confirmed an activation-based fallback would crash on an unrecognized model id. If a future need arises to actually *activate* deep-pi for new model ids (not just warn), that requires redesigning `TelemetryState.byModel` as a dynamic map, not a fixed two-key object — out of scope here, noted for a future phase if the warning-only approach proves insufficient.
- **RESOLVED (2026-08-07):** REQ-003 (fix #3, P2) was implemented, not cut. The autonomous-implementation directive's default was "implement since it's cheap and fully scoped, unless it proves genuinely blocking" — it didn't; the guard was a 4-line addition with a clean negative-control test (verified: removing the guard reproduces the exact predicted crash, confirming the test is real). No further decision needed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Successor**: `../002-vendor-and-repoint/spec.md`
- **Related**: `../../004-adopt-deep-pi-deepseek/spec.md` (original adoption decision, unchanged by this phase)
