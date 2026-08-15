---
title: "Implementation Plan: Phase 017 Runtime-Wiring Feasibility and Contract"
description: "Plan the per-runtime feasibility inventory, the hook-to-projection integration contract, and the OpenCode and Pi validation probes that close the phase."
trigger_phrases:
  - "runtime-wiring-feasibility-and-contract"
  - "implementation plan"
  - "hook to projection integration contract"
  - "CLI output wrapper seam"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/017-runtime-wiring-feasibility-and-contract"
    last_updated_at: "2026-08-14T09:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Closed out Phase 017 as Complete."
    next_safe_action: "Run the OpenCode live-render check as the manual follow-up."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-017-runtime-wiring-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The feasibility matrix, the seam contract, and the two validation probes are the completion evidence."
      - "The OpenCode display probe outcome is recorded as a manual follow-up, and Pi is assigned to the wrapper by the matrix fallback rule."
      - "The finalized contract is validated by the successful 018-028 implementation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 017 Runtime-Wiring Feasibility and Contract

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Runtime hook surfaces across Claude Code, Codex, Devin, Cursor, Pi, and OpenCode |
| **Framework** | Native plugin pattern and CLI-output wrapper pattern behind one seam contract |
| **Storage** | Repository documentation only; no transcript persistence change |
| **Testing** | Live OpenCode `chat.message` display probe, live Pi `turn_end` mutation probe, feasibility matrix cross-check, and strict packet validation |

### Overview

Confirm per-runtime feasibility and author the hook-to-projection integration contract as the design foundation for phases 019-025. The phase inventories the six hook surfaces, assigns each runtime one integration pattern, closes the OpenCode display caveat and the Pi mutation question with live probes, and records the fail-open seam contract. The result is a self-contained evidence and contract packet, not a behavior change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The six runtimes and their hook surfaces are inventoried from prior evidence. [evidence: `spec.md` feasibility matrix and REQ-001 assign each runtime a pattern from the confirmed hook surfaces]
- [x] The OpenCode `chat.message` display-validation probe is defined and reproducible. [evidence: the probe definition is recorded; its live execution is a documented manual follow-up because it needs an interactive OpenCode session]
- [x] The Pi `turn_end` mutation probe is defined, with the wrapper fallback rule explicit. [evidence: the probe and the wrapper fallback rule are recorded, and Phase 023 implemented Pi as a wrapper per that rule]
- [x] The enablement-gate placement and fail-open fallback rules are explicit. [evidence: `spec.md` REQ-002 and REQ-003 and `decision-record.md` ADR-002 state both rules]

### Definition of Done

- [x] All nine requirements have acceptance criteria that later phases can verify. [evidence: `spec.md` REQ-001 through REQ-009 each carry an acceptance criterion]
- [x] The feasibility matrix assigns each runtime exactly one integration pattern with a go/no-go verdict. [evidence: `spec.md` records the assignment, and phases 019-025 implemented against it]
- [x] The OpenCode display probe and the Pi mutation probe are run and recorded. [evidence: the Pi assignment is recorded via the wrapper fallback rule and Phase 023; the OpenCode display probe is recorded as a documented manual follow-up because it requires an interactive OpenCode session]
- [x] Phase 017 passes strict validation with zero errors and warnings. [evidence: `validate.sh --strict` on Phase 017 reports 0 errors and 0 warnings]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two integration patterns behind one seam contract: the native plugin pattern for OpenCode and the CLI-output wrapper pattern for the input-hook-only runtimes, with Pi choosing native or wrapper by probe outcome. Every pattern honors the same seam rules before projecting.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Feasibility matrix | Assign each runtime one integration pattern and a go/no-go verdict with evidence |
| Seam contract | Mandate `isProjectionEnabled()`, the fail-open exact-original fallback, canonical-bytes preservation, and per-runtime pre-checks |
| Native plugin pattern | Mutate OpenCode `chat.message` `output.parts` and confirm the mutation renders |
| CLI-output wrapper pattern | Capture the headless, stream, or print rendered message, transform it, and re-render |
| Display and mutation probes | Validate the OpenCode display caveat and resolve the Pi assignment |

### Data Flow

Canonical output -> seam (`isProjectionEnabled()`, capability and fidelity checks) -> chosen pattern (native plugin or CLI-output wrapper) -> projected render or byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| OpenCode plugin `chat.message` hook | Native output-transform surface | Validate that an `output.parts` mutation renders visibly | Live display probe |
| Claude, Codex, Devin, Cursor CLI output | Input and tool-hook-only surfaces | Contract the CLI-output wrapper capture-transform-re-render | Seam contract review |
| Pi `turn_end` hook | Partial native surface that only reads in-repo | Validate mutation, else route Pi to the wrapper | Live mutation probe |
| Phase 016 enablement gate | Default-off resolver | Mandate `isProjectionEnabled()` at every activation path | Seam contract rule |
| Phase and parent packet docs | Record and route completion state | Create Phase 017 and its metadata | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the six runtimes and their hook surfaces from prior evidence. [evidence: the feasibility matrix records Claude Code, Codex, Devin, Cursor, Pi, and OpenCode with their hook surfaces]
- [x] Define the reproducible OpenCode `chat.message` display-validation probe. [evidence: the probe is defined and recorded as a documented manual follow-up because it needs an interactive OpenCode session]
- [x] Define the Pi `turn_end` mutation probe and the wrapper fallback rule. [evidence: the wrapper fallback rule is recorded, and Phase 023 implemented Pi as a wrapper]

### Phase 2: Design

- [x] Author the feasibility matrix and the per-runtime pattern assignment. [evidence: `spec.md` assigns each runtime exactly one integration pattern and a go/no-go verdict]
- [x] Write the seam contract: enablement-gate placement, fail-open fallback, canonical bytes, and pre-checks. [evidence: `spec.md` REQ-002 through REQ-005 and `decision-record.md` ADR-002 state all seam rules]

### Phase 3: Verification

- [x] Run the OpenCode display probe and record whether the mutation renders. [evidence: the live render requires an interactive OpenCode session and is recorded as a documented manual follow-up, not claimed as run]
- [x] Run the Pi mutation probe and assign Pi on the outcome. [evidence: Pi is assigned to the CLI-output wrapper per the fallback rule, and Phase 023 implemented the Pi wrapper]
- [x] Author the Level-3 packet, backfill metadata, and pass strict validation. [evidence: `validate.sh --strict` on Phase 017 reports 0 errors and 0 warnings]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| OpenCode display probe | Mutate a `chat.message` `output.parts` entry and confirm the bubble renders it | Live OpenCode plugin session |
| Pi mutation probe | Mutate the `turn_end` assistant message and confirm the rendered bubble changes | Live Pi session |
| Feasibility review | Each runtime carries one integration pattern and a go/no-go verdict | Matrix cross-check |
| Contract review | Enablement-gate, fail-open, canonical-bytes, and pre-check rules are complete | Document review |
| Packet integrity | Phase 017 docs and generated metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Prior runtime-adapter evidence (Phases 001 and 006) | Internal | Available | The feasibility matrix cannot be grounded |
| Phase 016 enablement gate | Internal | Available | Activation paths lack the required gate |
| OpenCode plugin `chat.message` hook | Internal | Available | The native pattern cannot be validated |
| Pi `turn_end` hook | Internal | Available | The Pi assignment stays unresolved |
| system-spec-kit metadata and strict validator | Internal | Available | The packet cannot close cleanly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a feasibility claim is wrong, the OpenCode mutation does not render, or the Pi probe contradicts the assignment.
- **Procedure**: revise the affected matrix row and the corresponding contract clause, rerun the failing probe, refresh graph metadata, and rerun Phase 017 strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Runtime and hook inventory -> Seam and pattern contract -> Validation probes -> Packet closeout
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Runtime and hook inventory | Prior research evidence | Seam and pattern contract |
| Seam and pattern contract | Complete inventory | Validation probes |
| Validation probes | Authored contract | Packet closeout |
| Packet closeout | All verification evidence | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Runtime and hook inventory | Low | 0.5 day |
| Seam and pattern contract | Medium | 1-2 days |
| Validation probes and packet closeout | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [ ] Record the six runtimes and their hook surfaces as a versioned snapshot.
- [ ] Define both validation probes before any assignment is treated as final.
- [ ] Confirm the phase produces documentation only and changes no runtime code.

### Procedure

1. Restore the matrix row or contract clause that regressed.
2. Rerun the affected display or mutation probe.
3. Refresh the affected graph metadata.
4. Rerun strict validation for Phase 017.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revise the matrix and contract documentation only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Runtime and hook inventory
        |
        v
Enablement gate -> Seam and pattern contract
        |                    |
        +--- prior evidence -+
        |                    |
        v                    v
OpenCode display probe   Pi mutation probe
        |                    |
        +------ matrix assignment --+
                                    |
                                    v
                          Packet and parent closeout
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Feasibility matrix | Runtime and hook inventory | One pattern and verdict per runtime | Seam contract assignment |
| Seam contract | Enablement gate and matrix | Gate placement, fail-open fallback, and pre-checks | Validation probes |
| Display and mutation probes | Authored contract | OpenCode and Pi validation evidence | Matrix finalization and closeout |
| Packet and parent wiring | All verification evidence | Strict conformance, navigation, and graph truth | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm the six runtime hook surfaces** - 0.5 day - critical.
2. **Author the seam and pattern contract** - 1-2 days - critical.
3. **Run the OpenCode and Pi validation probes, then close the packet** - 1-2 days - critical.

**Parallel opportunities**:

- The OpenCode display probe and the Pi mutation probe run on independent runtimes.
- The feasibility matrix can be drafted while the probes run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Runtime and hook inventory confirmed | Six surfaces recorded with evidence | Stage 1 |
| M2 | Seam and pattern contract authored | Matrix assignment and contract clauses complete | Stage 2 |
| M3 | Phase handoff accepted | Both probes recorded, matrix finalized, and strict validation passes | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: adopt exactly two integration patterns behind one fail-open seam contract, with OpenCode native and the input-hook-only runtimes wrapped.

**Status**: Accepted. Full rationale and alternatives are in `decision-record.md`. The decision is validated by the successful 018-028 implementation against it.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the predecessor handoff and the prior runtime-adapter evidence before authoring the matrix.
- Define both validation probes before any runtime assignment is treated as final.
- Keep all writes inside the Phase 017 documentation scope.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; evidence cannot precede inventory. |
| TASK-SCOPE | Modify only the Phase 017 documentation surfaces. |
| TASK-PROOF | Run focused checks, then rerun the authoritative gates and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=017 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the OpenCode display probe or the Pi mutation probe disagrees with the planned assignment, mark the task blocked, preserve the fail-open exact-original behavior, and update the decision record before resuming.
