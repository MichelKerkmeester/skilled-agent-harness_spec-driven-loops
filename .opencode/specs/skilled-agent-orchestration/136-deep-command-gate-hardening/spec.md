---
title: "Feature Specification: Deep-command @general + setup hard-blocker gates"
description: "Deep commands could be run without verifying the orchestrator agent or completing setup: only 2 of 7 had a Phase 0 @general check and setup-blocker strength varied. This packet puts two un-skippable HARD-BLOCK gates at the top of every deep command."
trigger_phrases:
  - "deep command phase 0 gate"
  - "general agent verification deep command"
  - "unskippable setup phase deep command"
  - "deep command hard blocker"
  - "deep loop command gating"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-deep-command-gate-hardening"
    last_updated_at: "2026-06-07T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added Phase 0 + BLOCKED setup gates to all 7 deep commands"
    next_safe_action: "Run validate.sh --strict and reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-context-loop.md"
      - ".opencode/commands/deep/start-research-loop.md"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/ask-ai-council.md"
      - ".opencode/commands/deep/start-skill-benchmark-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-136-deep-command-gate-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Enforcement level? -> markdown hard-blocker (no runtime hook)."
      - "Which gates? -> both: @general Phase 0 + un-skippable setup phase."
      - "Which commands? -> all 7 deep commands."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-command @general + setup hard-blocker gates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep commands could begin work without two safeguards. Only 2 of 7 (`start-model-benchmark-loop`, `start-agent-improvement-loop`) carried a Phase 0 "@general agent" self-verification, and the strength of the setup-phase blocker varied across commands. An AI could skip the orchestrator-agent check or jump past the consolidated setup prompt and start executing a loop with unresolved inputs.

### Purpose
Every deep command opens with two un-skippable, ordered HARD-BLOCK gates: **Gate 1** Phase 0 @general-agent verification, then **Gate 2** the BLOCKED unified setup phase. Neither can be skipped before the YAML/Run step.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the Phase 0 @general-agent verification block to the 5 commands missing it (context, research, review, skill-benchmark, ask-ai-council).
- Ensure every command's setup phase is a `STATUS: ☐ BLOCKED` gate with FIRST-MESSAGE / STOP-and-wait (interactive) and fail-fast (`:auto`) language.
- Amend each EXECUTION PROTOCOL "first action" list so step 1 = Run Phase 0, step 2 = the BLOCKED setup phase.
- Standardize the 2 existing commands (fix the broken model-benchmark display box; normalize setup `STATUS` markers to `☐ BLOCKED`).

### Out of Scope
- A runtime hook - the user chose markdown-level enforcement; slash commands only ever run in the orchestrator, so the markdown gate is the practical layer.
- The deep-context native-default pool change - separate packet (134/006).
- Changing any YAML dispatch logic or skill behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/start-context-loop.md` | Modify | Add Phase 0; first-action order; normalize setup marker |
| `.opencode/commands/deep/start-research-loop.md` | Modify | Add Phase 0; first-action order; normalize setup marker |
| `.opencode/commands/deep/start-review-loop.md` | Modify | Add Phase 0; first-action order; normalize setup marker |
| `.opencode/commands/deep/ask-ai-council.md` | Modify | Add Phase 0; first-action order; normalize setup marker |
| `.opencode/commands/deep/start-skill-benchmark-loop.md` | Modify | Add EXECUTION PROTOCOL + Phase 0 + BLOCKED Setup |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modify | Fix broken display box (standardize) |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modify | Already conformant; no change required this pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 7 deep commands carry the Phase 0 @general-agent block | `rg "PHASE 0: @GENERAL AGENT VERIFICATION"` matches all 7 |
| REQ-002 | Phase 0 is the documented first action | Each EXECUTION PROTOCOL lists "Run Phase 0" as step 1 |
| REQ-003 | Every command's setup phase is a BLOCKED gate | Each has a `STATUS: ☐ BLOCKED` setup marker + STOP/wait (interactive) / fail-fast (:auto) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each Phase 0 names its own skill + restart command | No model-benchmark leftovers in the 5 new blocks; restart line matches the command |
| REQ-005 | Display boxes are clean and consistent | The model-benchmark box borders align; markers normalized to `☐ BLOCKED` |
| REQ-006 | No behavior/logic regressions | YAML dispatch logic, mode enums, and skill behavior unchanged |

### Acceptance Criteria (Given/When/Then)

- **Given** any deep command, **When** it is read top-to-bottom, **Then** Phase 0 (@general) appears before the setup phase.
- **Given** `:confirm`/no-suffix, **When** setup runs, **Then** it must present the prompt and wait (DO NOT proceed until answered).
- **Given** `:auto`, **When** required inputs are missing, **Then** setup fails fast naming them (no silent proceed).
- **Given** the 5 newly-gated commands, **When** their Phase 0 box is read, **Then** it names that command's skill and restart line.
- **Given** the model-benchmark display box, **When** rendered, **Then** its right borders align.
- **Given** all 7 commands, **When** grepped for `☐ BLOCKED`, **Then** each shows two markers (Phase 0 + setup).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 deep commands match `PHASE 0: @GENERAL AGENT VERIFICATION` and list "Run Phase 0" as first action.
- **SC-002**: All 7 have two `☐ BLOCKED` markers (Phase 0 + setup) with STOP/wait + fail-fast language.
- **SC-003**: `validate.sh --strict` passes for this packet; no YAML/skill logic changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Markdown gate is prompt-enforced, not runtime-enforced | Low - slash commands run in the orchestrator anyway | Gates are STATUS:☐ BLOCKED and ordered first; user accepted markdown level |
| Risk | Per-command Phase 0 text drift | Low | Single canonical block adapted with 3 substitutions; verified by grep |
| Dependency | Existing model-benchmark Phase 0 as the template | Low | Copied verbatim and adapted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime cost; gates are static markdown read at command load.
- **NFR-P02**: No added round-trips beyond the already-required setup prompt.

### Security
- **NFR-S01**: Gate 1 asserts orchestrator context before a loop dispatches sub-agents/CLIs.
- **NFR-S02**: Gate 2 prevents execution with unresolved/unconfirmed inputs.

### Reliability
- **NFR-R01**: Uniform two-gate opening across all 7 deep commands reduces skip risk.
- **NFR-R02**: No change to YAML dispatch or convergence logic.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `:auto` with all inputs present: Phase 0 passes, setup resolves confidently, proceeds.
- `:auto` with missing inputs: setup fails fast naming them.
- `:confirm`/no-suffix: setup prompt is the first response and waits.

### Error Scenarios
- Not the @general agent (rare for slash commands): Gate 1 hard-blocks with the restart box.
- Skill-benchmark thin structure: given a full EXECUTION PROTOCOL + Phase 0 + BLOCKED Setup.

### State Transitions
- Commands already conformant (agent-improvement): left unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 6 of 7 command files edited; repetitive block |
| Risk | 5/25 | Docs/prompt only; no logic change; reversible |
| Research | 5/20 | Per-command structure + insertion points surveyed |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Enforcement level (markdown) and both-gates scope confirmed with the user.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
