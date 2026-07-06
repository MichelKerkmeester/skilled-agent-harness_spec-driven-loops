---
title: "Implementation Plan: Phase 005 - Parity Benchmark Release Gate"
description: "Plan for executing golden prompts, live/manual checks, proof gates, baseline deltas, and release authority decisions for sk-design parity readiness."
trigger_phrases:
  - "phase 005 plan"
  - "parity benchmark plan"
  - "release gate plan"
  - "golden prompt corpus"
  - "baseline delta"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/005-parity-benchmark-release-gate"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Executed automated router-mode gate and recorded conditional release report."
    next_safe_action: "Operator runs live/browser/manual scenarios before any ready verdict."
---
# Implementation Plan: Phase 005 - Parity Benchmark Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec packet; future benchmark may exercise OpenCode skill routing and design-mode docs |
| **Framework** | system-spec-kit Level 3 documentation with sk-doc quality review |
| **Storage** | Phase packet metadata; future benchmark outputs must be append-only unless overwrite authority is recorded |
| **Testing** | Strict Spec Kit validation now; future golden prompts, manual playbook, router/advisor checks, md-generator preservation checks |

### Overview

This plan now records the executed automated portion of the release gate for `sk-design` parity behavior. It separates the router-mode evidence that was collected from the live/manual/browser evidence that remains operator-owned, protects the frozen baseline, and records release-owner authority for the CONDITIONAL verdict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 004 implementation evidence is available; the user supplied that Phase 004 is closed.
- [x] Release owner is named for failure and overwrite decisions: repository owner, delegated to this session for the automated gate record.
- [x] Existing benchmark baseline status is known: `benchmark/baseline/skill-benchmark-report.json` is the frozen comparison anchor.
- [x] Golden prompt corpus is approved for all five public modes through the existing 24-scenario manual playbook corpus.
- [x] Manual playbook scenarios and negative controls are defined; live/manual execution remains pending operator action.

### Definition of Done

- [x] Baseline and current benchmark results exist, with deltas in `release-report.md`.
- [x] Router/advisor replay invariants pass in router mode; live advisor scoring remains unscored.
- [x] Procedure-selection and proof-gate scenarios replay in router mode; live response proof remains pending operator execution.
- [x] Anti-slop, accessibility, hierarchy, interaction, polish, and live usefulness lanes are explicitly recorded as not run in this pass and release-blocking before READY.
- [x] md-generator preservation replays to `md-generator` with `playwright-extract`; live extraction remains pending operator execution.
- [x] Release report states CONDITIONAL with repository-owner authority.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-gated release checklist with append-only benchmark runs and separate verdict lanes.

### Key Components

- **Golden Prompt Corpus**: Mode-specific prompts, expected procedure-selection behavior, negative controls, and manual playbook scenarios.
- **Baseline Ledger**: Captures immutable baseline reference, current run, delta, and overwrite authority status.
- **Procedure Proof Gate**: Records public mode, internal procedure path, context manifest, proof notes, and fallback behavior.
- **Design Quality Review**: Scores anti-slop, accessibility, hierarchy, interaction, polish, and live usefulness separately from routing.
- **Routing Invariant Checks**: Confirms single `sk-design` advisor identity, five public modes, registry, and hub-router stability.
- **Release Authority Record**: Captures release owner decisions for failures, conditional release, or baseline overwrite.

### Data Flow

Golden prompts and manual scenarios feed benchmark runs. Runs produce mode/procedure evidence, design-quality verdicts, routing invariant verdicts, md-generator preservation verdicts, baseline deltas, and release-owner decisions. The release report consumes those artifacts to produce the final release-ready, blocked, or conditional verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design` advisor route | Public skill selection | Must remain unchanged by parity release gate | Advisor invariant check |
| Five public modes | Public execution lanes | Must each receive golden prompt coverage | Golden prompt matrix |
| Private procedure support | Internal behavior after public mode selection | Must be proven through procedure-selection evidence | Procedure proof gate |
| md-generator backend | Mutating extraction and style-reference output | Must be preserved | Preservation tests |
| Benchmark baseline | Comparison source for no-regression claims | Must be append-only unless overwrite authority is recorded | Baseline ledger and release report |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gate Setup

- [x] Confirm Phase 004 implementation evidence exists.
- [x] Name release owner and failure authority rules.
- [x] Locate the immutable baseline ledger.
- [x] Approve append-only artifact location for benchmark outputs.

### Phase 2: Benchmark Corpus

- [x] Author golden prompts for interface, foundations, motion, audit, and md-generator through the existing manual playbook corpus.
- [x] Add negative controls for vague, non-design, unsafe, and conflicting prompts through the existing advisor/transform/shared-reference scenarios.
- [x] Add manual playbook scenarios that exercise live usefulness and parity feel: PB-001, PB-002, and PB-003.
- [x] Define expected evidence fields for every prompt in the per-scenario playbook files.

### Phase 3: Gate Execution

- [x] Run router/advisor replay invariants in router mode; D1-inter live advisor remains unscored by this harness.
- [x] Run golden prompt benchmark and record baseline deltas in `release-report.md`.
- [x] Run procedure-selection, context manifest, and proof-gate replay scenarios; live response evidence remains pending operator execution.
- [x] Record anti-slop, accessibility, hierarchy, interaction, polish, and usefulness review lanes as not run in this automated pass and release-blocking before READY.
- [x] Run md-generator preservation replay; live extraction remains pending operator execution.

### Phase 4: Release Decision

- [x] Compile release report with lane verdicts and evidence gaps.
- [x] Record release-owner decisions for conditional release and no baseline overwrite.
- [x] Block READY when live/manual/browser P0 lanes are not run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | Golden prompts and negative controls for all five public modes | Router-mode benchmark harness rerun into `benchmark/after-009/` |
| Routing | Advisor identity, mode-registry, hub-router, public/private boundary | Router-mode replay in `benchmark/after-009/report.json`; live D1-inter not scored |
| Manual | Live usefulness, parity feel, anti-slop, accessibility, hierarchy, interaction, polish | Not run in this pass; requires operator execution before READY |
| Preservation | md-generator extraction and output behavior | Router replay confirms `md-generator`/`playwright-extract`; live extraction not run |
| Documentation | Phase packet validity and release report consistency | `validate.sh <phase-root> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 implementation evidence | Internal | Available per user-provided verified fact | None for automated gate |
| Release owner | Governance | Repository owner delegated to this session for automated gate record | Live/operator decisions still require owner/operator follow-through |
| Golden prompt corpus | Test design | Present as 24-scenario playbook | Live/manual execution remains pending |
| Baseline ledger | Benchmark discipline | Frozen baseline located at `benchmark/baseline/skill-benchmark-report.json` | None for router-mode no-regression claim |
| md-generator preservation command set | Verification | Router replay present; live extraction pending | READY remains blocked until operator run or owner decision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark execution writes a bad run, overwrites a baseline without authority, or records an unsupported release-ready claim.
- **Procedure**: Preserve the bad artifact for audit, add a corrected append-only run, mark the unsupported claim invalid in the release report, and require release-owner review before continuing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 004 implementation evidence
        |
        v
Gate setup -> Corpus approval -> Benchmark execution -> Release decision
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Gate setup | Phase 004 implementation evidence | Corpus approval, benchmark execution |
| Corpus approval | Gate setup | Benchmark execution |
| Benchmark execution | Corpus approval, baseline ledger | Release decision |
| Release decision | Benchmark execution | Release readiness claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Gate setup | Medium | 1-2 hours |
| Corpus approval | High | 3-5 hours |
| Benchmark execution | High | 4-8 hours |
| Release decision | Medium | 1-2 hours |
| **Total** | | **9-17 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Baseline ledger exists or missing-baseline status is recorded.
- [ ] Release owner is named.
- [ ] Benchmark output location is approved.
- [ ] Existing baseline overwrite policy is visible in the plan.

### Rollback Procedure

1. Stop release-ready claim propagation.
2. Preserve the problematic benchmark artifact for audit.
3. Create a corrected append-only run or release-owner decision record.
4. Re-run affected P0 lanes.
5. Update the release report with failure and correction evidence.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Benchmark outputs are append-only by default; do not delete historical runs unless separately authorized.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌────────────────────┐
│ Phase 004 Evidence │
└─────────┬──────────┘
          v
┌────────────────────┐     ┌────────────────────┐
│ Baseline Ledger    │────►│ Benchmark Runs     │
└────────────────────┘     └─────────┬──────────┘
┌────────────────────┐               │
│ Golden Prompts     │───────────────┤
└────────────────────┘               v
                              ┌────────────────────┐
                              │ Release Decision   │
                              └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 004 evidence | Completed implementation | Refactored behavior under test | Gate setup |
| Baseline ledger | Release owner policy | Baseline and current run identity | No-regression claim |
| Golden prompt corpus | Mode coverage and negative controls | Prompt matrix | Benchmark execution |
| Benchmark runs | Baseline ledger and prompt corpus | Lane verdicts and deltas | Release decision |
| Release decision | Benchmark runs | Ready, blocked, or conditional verdict | Release claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm Phase 004 evidence and release owner** - complete for automated gate record.
2. **Approve golden prompts and negative controls** - complete for router-mode corpus.
3. **Run benchmark and preservation lanes** - router-mode complete; live/browser/manual lanes pending operator execution.
4. **Record release authority decision** - complete as CONDITIONAL.

**Total Critical Path**: 9-17 hours

**Parallel Opportunities**:
- Golden prompt drafting can run alongside md-generator preservation command discovery after Phase 004 evidence exists.
- Manual playbook scenarios can be reviewed alongside router/advisor invariant checks.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Gate setup ready | Release owner, baseline status, and output location known | Complete |
| M2 | Corpus approved | Golden prompts and negative controls cover all five public modes | Complete for router-mode corpus |
| M3 | Evidence collected | Benchmark and routing lanes collected; manual/live lanes listed as gaps | Conditional |
| M4 | Release verdict recorded | Release owner records ready, blocked, or conditional decision | Complete: CONDITIONAL |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION

The future execution should run directly inside the approved workflow and should not treat subagent success, route success, or generated prose as proof by itself. Any AI-produced review note must be backed by a benchmark artifact, manual transcript, screenshot, validator output, or explicit release-owner decision.

### Pre-Task Checklist

- [x] Confirm Phase 004 implementation evidence exists.
- [x] Confirm the release owner is named.
- [x] Confirm baseline status before any no-regression claim.
- [x] Confirm writes are scoped to the approved benchmark output root and Phase 005 packet.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Do not write outside approved benchmark artifacts and the active phase packet. |
| Evidence first | Do not claim parity from routing success alone. |
| Baseline discipline | Capture baseline and current run before reporting deltas. |
| Failure authority | Route P0 failures, accepted risks, conditional release, and baseline overwrite to the release owner. |

### Status Reporting Format

Use one summary status line with validation evidence: `STATUS=OK PATH=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/design/009-sk-design-claude-parity/005-parity-benchmark-release-gate VALIDATION_EXIT=0` or `STATUS=FAIL ERROR=reason VALIDATION_EXIT=code`.

### Blocked Task Protocol

If Phase 004 evidence, baseline status, release-owner authority, md-generator preservation evidence, or a P0 benchmark lane is missing, stop the release-ready claim, record the blocked lane, and ask the release owner for a block, fix, deferral, or accepted-risk decision.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

The release gate has two independent proof tracks: OpenCode-native routing invariants and Claude Design-like usefulness evidence. A release can pass only when both tracks pass or when the release owner records a scoped, explicit exception.
<!-- /ANCHOR:architecture-overview -->

---

<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Mitigation | Verification |
|------|------------|--------------|
| Router-only false confidence | Keep routing and design-quality lanes separate | Release report has separate verdict columns |
| Baseline overwrite | Append-only runs by default | Baseline ledger records overwrite authority if used |
| Weak prompt coverage | Include negative controls and all five modes | Golden prompt matrix reviewed before execution |
| md-generator regression | Dedicated preservation lane | Preservation test verdict blocks release |
<!-- /ANCHOR:risk-mitigation -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the release-evidence and authority decisions.
