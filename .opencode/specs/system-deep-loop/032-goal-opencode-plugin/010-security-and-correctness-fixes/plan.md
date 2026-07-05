---
title: "Implementation Plan: Phase 10: security-and-correctness-fixes"
description: "Land 5 targeted fixes in mk-goal.js: 2 security (redaction, sanitizer), 3 correctness (injection clamp, stale-verifier guard, RICCE metadata)."
trigger_phrases:
  - "implementation"
  - "plan"
  - "goal plugin security fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/010-security-and-correctness-fixes"
    last_updated_at: "2026-07-01T10:04:51Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from deep-review findings"
    next_safe_action: "Run /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:892b855d642d1fb86b5e7e4d43b1bf3225e0604bab5c6adb21a9deb658233c00"
      session_id: "scaffold-032-010"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: security-and-correctness-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ESM), OpenCode plugin runtime |
| **Framework** | `.opencode/plugins/mk-goal.js` (single-file plugin, ~1676 lines) |
| **Storage** | Flat per-session JSON goal state (`.opencode/skills/.goal-state/`) |
| **Testing** | `node --test` / direct `node` execution of `.opencode/plugins/tests/mk-goal-*.test.cjs` (6 files) |

### Overview
Five surgical edits to `mk-goal.js`, each landing one deep-review finding (DR-001/003/004-P1/005/006). No new files, no schema changes, no command/doc changes — this phase is code-only and independent of phases 011/013.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from `review/review-report.md`)
- [x] Success criteria measurable (existing suite green + no reproduction of the 5 findings)
- [x] Dependencies identified (none blocking; independent of 011/013)

### Definition of Done
- [ ] All 5 acceptance criteria (REQ-001–005) met
- [ ] Full 6-file test suite passing, freshly executed
- [ ] `implementation-summary.md` cites fresh execution evidence, not prior-run citations
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file plugin, direct function-level edits (no new components).

### Key Components
- **`redactEvidence`** (`mk-goal.js:205`): existing secret-redaction helper — REQ-001 routes verifier exception messages through it.
- **`sanitizeInlineText`/`sanitizePromptText`** (`mk-goal.js:177`): existing sanitizers — REQ-002 broadens their coverage.
- **`renderGoalInjection`** (`mk-goal.js:1350`): builds the `[active_goal]` block — REQ-003 clamps its final output.
- **`maybeVerifyGoal`/`maybeContinueGoal`** (`mk-goal.js:1080`/`1236`): verifier + continuation gating — REQ-004 adds staleness signaling between them.
- **`buildEnhancedGoalPrompt`** (`mk-goal.js:264`): goal-prompt generator — REQ-005 adds (or the spec amends away) the RICCE field.

### Data Flow
No change to the overall data flow (session-keyed JSON state → injection → verifier → continuation). This phase only tightens correctness/security guarantees at existing seams.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from a deep-review CONDITIONAL verdict (`review/review-report.md`); findings touch security (redaction, prompt-injection) and persistence (stale-state handling). Table below imports `review-report.md` §2's Planning Packet fields for the relevant `activeFindings` entries.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `redactEvidence` (`mk-goal.js:205`) | Secret-redaction helper, currently only applied to verifier *evidence*, not exception *messages* | Update: extend call site to cover exception-message path (REQ-001) | `grep -n "redactEvidence" .opencode/plugins/mk-goal.js`; manual exception-injection test |
| `sanitizeInlineText`/`sanitizePromptText` (`mk-goal.js:177`) | Prompt-injection blacklist sanitizer | Update: broaden to structural/allowlist treatment (REQ-002) | Existing `mk-goal-state.test.cjs` adversarial sanitizer assertions stay green; add manual spot-check strings |
| `renderGoalInjection` (`mk-goal.js:1350`) | Renders `[active_goal]` block, clamps only the prompt subsection | Update: clamp total output (REQ-003) | Manual invocation with a small `maxInjectionChars` override, assert total length ≤ cap |
| `maybeVerifyGoal`/`maybeContinueGoal` (`mk-goal.js:1080`/`1236`) | Verifier result feeds continuation gating without staleness check | Update: add staleness signal (REQ-004) | Manual scenario: replace goal mid-verify, trigger `session.idle`, assert no continuation on stale evidence |
| `buildEnhancedGoalPrompt` (`mk-goal.js:264`) | Generates `promptEnhancement`, currently no RICCE field | Update or spec-amend (REQ-005) | `grep -n "RICCE\|ricce"` before/after; or diff against amended `007-sk-prompt-goal-enhancement/spec.md` |
| `.opencode/plugins/tests/mk-goal-*.test.cjs` (6 files) | Existing regression suite | Unchanged (new tests are phase 012's scope) — must still pass after all 5 edits | `node --test` / direct execution, all 6 files, exit 0 |

Required inventories:
- Same-class producers: `rg -n 'redactEvidence|sanitizeInlineText|sanitizePromptText|renderGoalInjection|maybeVerifyGoal|maybeContinueGoal|buildEnhancedGoalPrompt' .opencode/plugins/mk-goal.js` to confirm no other call sites need the same fix.
- Consumers of changed symbols: `rg -n 'redactEvidence|renderGoalInjection|maybeVerifyGoal|maybeContinueGoal|buildEnhancedGoalPrompt' .opencode/plugins/tests/*.test.cjs` to know which existing tests exercise the changed functions and must stay green.
- Matrix axes: (a) verifier exception vs verifier evidence redaction path, (b) sanitizer coverage for role-labels vs bidi/homoglyph vs instruction-override phrasing, (c) injection block length at default vs small custom `maxInjectionChars`, (d) goal-replace-during-verification timing, (e) RICCE field present vs spec-amended-away.
- Algorithm invariant (security fixes): no unredacted secret-shaped string (matching the existing `redactEvidence` patterns: `sk-`, `gh[pousr]_`, `xox[...]`, `AKIA`, `api_key=`, `token=`, `password=`, `secret=`) may appear in persisted state or rendered output via ANY code path, including exception handling — adversarial case: a verifier that throws an error object containing a secret in its `.message`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read the current live `mk-goal.js` at the 5 cited line ranges to confirm they still match the review's evidence (code may have shifted slightly since the audit).
- [ ] Re-run the existing 6-file test suite once *before* making changes to establish the baseline (all 6 should already pass — confirmed earlier this session).

### Phase 2: Core Implementation
- [ ] REQ-001: redact verifier exception messages (DR-006).
- [ ] REQ-002: harden the prompt-injection sanitizer (DR-005).
- [ ] REQ-003: clamp the total injection block (DR-001).
- [ ] REQ-004: add verifier-staleness signaling (DR-003).
- [ ] REQ-005: add RICCE metadata or amend the spec (DR-004-P1).

### Phase 3: Verification
- [ ] `node --check .opencode/plugins/mk-goal.js` passes.
- [ ] Full 6-file suite passes, freshly executed.
- [ ] Manual spot-check reproduction of each of the 5 original findings shows the issue no longer reproduces.
- [ ] `implementation-summary.md` filled with fresh execution evidence (not cited from this planning session).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (existing) | All 6 `mk-goal-*.test.cjs` files must stay green | `node --test` / direct `node <file>` |
| Manual reproduction | Re-run each finding's original reproduction steps (redaction bypass, sanitizer bypass, injection-cap overrun, stale-verifier race, RICCE absence) and confirm each is fixed | `node -e` ad hoc scripts against the live module, matching the style used in the completed deep-review iterations |
| New regression coverage | Deferred to phase 012 (regression-test-backfill) — do not add new test files in this phase | N/A |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `review/review-report.md` (finding evidence) | Internal | Green (already exists, complete) | N/A |
| `research/iterations/iteration-00{1-8}.md` (design-fork context for REQ-005) | Internal | Green (already exists, complete) | N/A |
| Phase 011 (command normalization) | Internal | Independent — no blocking dependency either direction | N/A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of the 5 fixes causes a previously-passing test to fail, or manual reproduction shows a new regression in the injection/verifier/continuation path.
- **Procedure**: all changes are isolated to `.opencode/plugins/mk-goal.js`; `git diff`/`git checkout -- .opencode/plugins/mk-goal.js` cleanly reverts this phase with no state-file or schema migration to undo.
<!-- /ANCHOR:rollback -->
