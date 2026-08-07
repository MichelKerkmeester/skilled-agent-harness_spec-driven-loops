---
title: "Implementation Plan: Phase 18: fanout-stopreason-tolerance"
description: "Add a small exported isMaxIterationsStopReason helper to fanout-run.cjs, route the max-iterations policy validator through it, and pin the tolerated-vs-rejected boundary with a RED/GREEN unit test."
trigger_phrases:
  - "fanout stopreason tolerance plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/003-guard-and-enforcement/004-fanout-stopreason-tolerance"
    last_updated_at: "2026-07-04T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored plan from spec"
    next_safe_action: "Implement helper and test"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-phase-018-fanout-stopreason-tolerance-20260704"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: fanout-stopreason-tolerance

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CJS script (`fanout-run.cjs`) with a TSX/vitest unit suite |
| **Framework** | vitest 4.x |
| **Storage** | None |
| **Testing** | `npm --prefix .opencode/skills/deep-loop-runtime test` (vitest run) |

### Overview
One pure helper plus a one-line swap at the single call site, pinned by a unit test. The iteration-count check already proves completeness, so this only loosens a redundant string check from exact-equality to an anchored family match.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure helper + single call-site swap; no state, no signature change to the validator.

### Key Components
- **`isMaxIterationsStopReason(stopReason)` (new)**: `typeof stopReason === 'string'` guard, then `stopReason.toLowerCase().replace(/[^a-z]/g, '').startsWith('maxiteration')`. Stripping non-alphabetic characters folds `maxIterationsReached`, `max-iterations (10/10)`, `maxIterations`, and `max_iterations_reached` to a common `maxiteration…` prefix, while `converged`/`manualStop`/`error`/`userPaused` do not match. Placed adjacent to `findMaxIterationsPolicyViolation`.
- **`findMaxIterationsPolicyViolation` (fanout-run.cjs:~619)**: the branch `if (synthesis.stopReason !== 'maxIterationsReached')` becomes `if (!isMaxIterationsStopReason(synthesis.stopReason))`; the returned message string is unchanged so existing failure-path assertions still read the same.
- **`module.exports` (fanout-run.cjs:~1826)**: add `isMaxIterationsStopReason` so the vitest can import it directly, matching the existing `requireCjs(fanoutRunScript)` destructuring pattern used for `computeLineageTimeoutMs`.

### Data Flow
No behavioral change for a lineage that wrote the canonical stop reason; the only difference is that a completed lineage with a variant spelling now passes instead of being marked `failed`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `findMaxIterationsPolicyViolation` (:~619) | Strict `!== 'maxIterationsReached'` | Route through the tolerant helper | RED/GREEN: `max-iterations (10/10)` no longer violates |
| `isMaxIterationsStopReason` (new) | — | Add + export | Unit test on tolerated + rejected sets |
| `module.exports` (:~1826) | Helper export list | Add the new helper | `requireCjs` import succeeds in vitest |
| `fanout-run.vitest.ts` | Existing helper unit tests | Add a describe block | vitest green |

Required inventories:
- `rg -n "maxIterationsReached|stopReason" .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` to confirm the only strict consumer is this one branch before loosening it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [ ] Run the runtime vitest suite fresh; capture the pre-change pass count
- [ ] `rg` confirm the strict stopReason check is the only consumer

### Phase 2: Core Implementation
- [ ] Add the failing unit test for `max-iterations (10/10)` (RED against the strict check via the helper's absence, or against a temporary direct-equality expectation), capture RED
- [ ] Add `isMaxIterationsStopReason`, swap the call site, export it (GREEN)
- [ ] Add the rejected-set assertions (REQ-002)

### Phase 3: Verification
- [ ] Full runtime vitest suite green; capture the delta
- [ ] `node --check` on `fanout-run.cjs`
- [ ] Comment hygiene on the changed file
- [ ] Write `implementation-summary.md`; set spec.md Status to Complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (RED/GREEN) | Tolerated variants pass, different reasons fail (REQ-001, REQ-002) | vitest, `requireCjs` helper import |
| Regression | Full runtime unit suite | `npm --prefix .opencode/skills/deep-loop-runtime test` |
| Static | `node --check` on the CJS script | node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime vitest toolchain | Internal | Available (`vitest` in deep-loop-runtime package.json) | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any runtime vitest regression
- **Procedure**: Revert the `fanout-run.cjs` hunk and the test hunk via targeted `git checkout`; the change is a single helper plus one call-site line
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

Single small change: RED test, implement, GREEN, verify. No cross-phase ordering.
<!-- /ANCHOR:sequencing -->
