---
title: "Implementation Plan: deep-alignment deep-review remediation"
description: "Fix the 10 deep-review Pass A findings in workstream order, verify-first per finding, with RED->GREEN regressions for the correctness fixes and honest claim/topology reconciliation for the rest."
trigger_phrases:
  - "deep-alignment remediation plan"
  - "deep-alignment fail-closed plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/013-review-remediation"
    last_updated_at: "2026-07-13T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Planned F001-F010 remediation in workstream order"
    next_safe_action: "Run validate.sh --strict from the main tree"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-013-review-remediation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: deep-alignment deep-review remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), declarative command YAML, Markdown agent/spec docs |
| **Framework** | system-deep-loop deep-alignment mode (reducer / convergence / partitioner / adapters) |
| **Storage** | JSONL state log + `deep-alignment-*.json` packet files (no DB) |
| **Testing** | Hand-rolled `node` assertion tests under `deep-alignment/scripts/tests/` + `.opencode/plugins/tests/` |

### Overview
Remediate the 10 findings in workstream order. Verify-first per finding: re-read every cited `file:line` and confirm the real symptom against source before editing. Add RED→GREEN regressions for the correctness P0/P1s (F001, F005, F007, F006). For the security-boundary and contract findings, reconcile claims and topology to reality; where a full fix is architectural, defer with a decision-record rather than fabricate. Apply entirely in the isolated worktree; the operator merges.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings sourced from the Pass A review-report; both P0s independently re-verified against source
- [x] Scope frozen to the 10 findings' implicated files
- [x] Success criteria measurable (tests green + validate --strict exit 0)

### Definition of Done
- [x] Every actionable finding fixed at root or deferred with recorded rationale
- [x] All deep-alignment script tests + both dispatch-guard tests green
- [x] `validate.sh --strict` on this packet exits 0 (run from the main tree) — EXIT=0, Errors:0 Warnings:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-shot CLI scripts (reducer, convergence, partitioner) that an external command workflow calls between LEAF iterations; fail-closed state machine.

### Key Components
- **`reduce-alignment-state.cjs`**: owns the findings registry + verdict roll-up. Now corpus-gated (`incompleteCoverage`, `integrityFault`) and exposes `checkedArtifactIds`.
- **`check-convergence.cjs`**: reads the reducer fresh in-process, so the corpus gate is inherited.
- **`partition-corpus.cjs`**: identity-based set-difference progress with a count-only fallback; passes `adapter` through the slice.
- **`scoping.cjs`**: lane resolution now carries an optional `adapter` discriminator.
- **`dispatch-guard.cjs`**: `LOOP_EXECUTOR_AGENTS` now includes `deep-alignment`.

### Data Flow
Corpus (discovered artifacts) + JSONL/deltas → reducer registry (verdict, checkedArtifactIds) → convergence decision + next slice → LEAF dispatch (with adapter) → back to JSONL.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from a deep-review FAIL verdict; F002 touches the permission boundary.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduce-alignment-state.cjs` | verdict/registry owner | update: corpus gate + fail-closed + checkedArtifactIds | `reducer-fail-closed.test.cjs` RED→GREEN |
| `check-convergence.cjs` | convergence decision | unchanged (inherits reducer fix in-process) | read-confirmed `reduceAlignmentState({write:false})` call |
| `partition-corpus.cjs` | next-slice resolver | update: identity difference + adapter passthrough | `partition-identity-progress.test.cjs` |
| `scoping.cjs` | lane resolution | update: optional adapter | `scoping-adapter.test.cjs` |
| `dispatch-guard.cjs` | Task repeat guard | update: register deep-alignment | both guard tests |
| `deep-alignment.md` (+mirror), `mode-registry.json` | read-only claim / tool surface | update: honest boundary, mutatesWorkspace:true | parent-skill-check exit 0 |
| `deep_alignment_{auto,confirm}.yaml`, `alignment.md`, legacy body | command contract | update: resolved_lanes, registry seed, executor honesty, adapter | YAML parse + read |
| 059 `spec.md`/`graph-metadata.json` (parent) | topology | update: children 000-013, status in_progress | JSON parse + read |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify-first re-read of every cited `file:line`; both P0s reproduced against source
- [x] Isolated worktree + baseline `state-machine-wiring.test.cjs` green

### Phase 2: Implementation
- [x] WS1 fail-closed correctness (F001, F005, F007)
- [x] WS2 security boundary (F002, F008)
- [x] WS3 contract fidelity (F003, F004, F006)
- [x] WS4 topology/behavior truth (F009, F010)

### Phase 3: Verification
- [x] All deep-alignment script tests + both dispatch-guard tests green
- [x] `validate.sh --strict` exit 0 (main tree)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **RED→GREEN, F001+F005**: `reducer-fail-closed.test.cjs` — unaudited non-empty corpus, empty corpus, corrupt JSONL, unknown severity. RED proven against the un-fixed reducer (`'PASS' !== 'FAIL'`); GREEN after fix.
- **F007**: `partition-identity-progress.test.cjs` — non-prefix checked set re-offers the skipped artifact; count-only fallback preserved.
- **F006**: `scoping-adapter.test.cjs` — adapter defaults to authority, live-render selectable, unknown adapter fails closed.
- **F008**: both `mk-deep-loop-guard.test.cjs` and `claude-task-dispatch-guard.test.cjs` — deep-alignment reaches loop rejection.
- **Regression baseline**: `state-machine-wiring.test.cjs` stays green throughout.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Validator `tsx` runtime is absent in the worktree; run node validators from the **main tree** against worktree paths.
- The concurrent session owns the main working tree; all edits stay in the worktree, nothing committed without operator approval.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Isolated worktree; nothing committed. Rollback = discard the worktree edits (`git -C <worktree> checkout -- .` / remove the worktree). The verified fixes are preserved only here until the operator merges. F002 mechanical sandbox and F010 termination proof are deferred (decision-record), so no partial-enforcement state needs unwinding.
<!-- /ANCHOR:rollback -->
