---
title: "Implementation Plan: Fanout LEAF-Identity Conflation"
description: "Plan to reword buildLoopPrompt's identity line so it no longer claims LEAF-agent identity, fixing codex-lineage finding F003."
trigger_phrases:
  - "fanout leaf identity conflation"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/011-followup-remediation/002-fanout-leaf-identity-conflation"
    last_updated_at: "2026-07-01T20:22:37Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented identity wording fix and regression test"
    next_safe_action: "Final spec validation and report"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fanout LEAF-Identity Conflation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) |
| **Framework** | deep-loop-workflows fan-out orchestration |
| **Testing** | vitest (`fanout-run.vitest.ts`) |

### Overview
Reword the identity line in `buildLoopPrompt` (`fanout-run.cjs`) so the dispatched CLI subprocess is framed as running/orchestrating the loop-type's workflow YAML as a detached fan-out lineage, not as "being" the LEAF agent, while preserving the existing phase-instruction line and fixing all 3 loop types (context/research/review) with a single shared-function edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause and exact line numbers confirmed against current code (prior codex-lineage finding F003, independently re-verified).
- [x] Fix scoped to the identity line only; phase-instruction line and `buildNativeCommandInput` are already correct.

### Definition of Done
- [x] Identity line in `buildLoopPrompt` reworded for all 3 loop types (context/research/review). Evidence: shared `agentName` mapping remains in `fanout-run.cjs`, and the one identity line now frames the subprocess as orchestrating workflow YAML.
- [x] Phase-instruction line (phase_init/phase_main_loop/phase_synthesis) preserved unchanged. Evidence: `fanout-run.cjs` still emits the existing phase line.
- [x] New regression test passes; existing `fanout-run.vitest.ts` suite unaffected. Evidence: `npm test -- tests/unit/fanout-run.vitest.ts` passed 1 file / 42 tests.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal-diff wording fix inside a shared prompt-builder function; no new state, schema, or behavior change.

### Key Components
- **`buildLoopPrompt`**: shared fan-out prompt builder (`fanout-run.cjs:863-945`); sets the identity line (~line 930) and the phase-instruction line (~line 940).
- **`agentName` mapping** (~line 870): maps loop type to agent name (e.g. `'deep-review'`) for context/research/review; the identity-line fix must apply uniformly across all 3.
- **`buildNativeCommandInput`** (sibling, `fanout-run.cjs:947-980`): reference pattern already correctly framed around the `:auto` command surface rather than leaf-agent identity.

### Data Flow
Fan-out runner selects loop type → `agentName` resolved → `buildLoopPrompt` composes the CLI subprocess prompt → reworded identity line plus unchanged phase-instruction line → subprocess dispatched via the CLI executor path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `buildLoopPrompt` in full (`fanout-run.cjs:863-945`), confirming the exact identity-line and phase-instruction-line text and line numbers.
- [x] Read `buildNativeCommandInput` (`fanout-run.cjs:947-980`) to confirm its correct framing as the reference wording pattern.
- [x] Read `.opencode/agents/deep-review.md`'s "ILLEGAL NESTING (HARD BLOCK)" section (~lines 54-64) to confirm the LEAF contract being violated.

### Phase 2: Implementation
- [x] Reword the identity line in `buildLoopPrompt` so it does not claim LEAF-agent identity for any of context/research/review.
- [x] Preserve the phase-instruction line (phase_init/phase_main_loop/phase_synthesis) unchanged.
- [x] Verify the reworded line renders correctly for all 3 `agentName` values (context/research/review).

### Phase 3: Verification
- [x] Add new regression test asserting the fan-out prompt never claims LEAF identity for any loop type, but still contains the phase-instruction line.
- [x] Run `fanout-run.vitest.ts` in full; confirm 0 new failures. Evidence: `npm test -- tests/unit/fanout-run.vitest.ts` passed 1 file / 42 tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New identity-line wording assertion, covering all 3 loop types | vitest |
| Regression | Full existing `fanout-run.vitest.ts` suite | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | This child has no dependency on any other child in this phase; both 001 and 002 modify `fanout-run.cjs` but in disjoint functions (`buildNativeCommandInput` vs `buildLoopPrompt`) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New test fails to pass, or existing suite regresses.
- **Procedure**: `git checkout -- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`; no other packet content touched.
<!-- /ANCHOR:rollback -->
