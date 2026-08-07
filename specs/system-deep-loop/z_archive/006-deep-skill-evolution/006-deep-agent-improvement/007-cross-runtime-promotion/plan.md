---
title: "Implementation Plan: Packet 127 deep-agent-improvement cross-runtime promotion"
description: "Plan for hard four-runtime mirror verification and partial-state recovery semantics."
trigger_phrases:
  - "packet 127 plan"
  - "cross-runtime promotion plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/006-deep-agent-improvement/007-cross-runtime-promotion"
    recent_action: "Planned and implemented packet 127 cross-runtime promotion gate."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Rerun Vitest."
---
# Implementation Plan: Packet 127 deep-agent-improvement cross-runtime promotion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| --- | --- |
| Language/Stack | CommonJS Node scripts, TypeScript Vitest tests, Markdown docs |
| Framework | OpenCode skill runtime |
| Storage | JSON/JSONL state plus Markdown dashboard output |
| Testing | `node --check`, Vitest test file, strict spec validation |

### Overview

Implement a reusable mirror verifier and wire it into guarded promotion. Agent-definition promotion now evaluates all four runtime mirrors before copying a candidate into the target. Failed verification rejects with structured JSON and records mirror recovery state when a state file is provided.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet 127 spec folder provided by user.
- [x] Scope boundaries identified: writable only in packet 127 and DAI skill subpaths.
- [x] Packet 123, 124, and 126 precedents read.
- [x] Current promotion and promotion-gates scripts read before modification.

### Definition of Done

- [x] Hard mirror gate implemented for agent-definition targets.
- [x] Partial mirror state semantics implemented in state output and reducer visibility.
- [x] Verifier helper and regression test authored.
- [x] Level 3 docs authored, including ADR-001.
- [x] Modified `.cjs` files pass syntax checks.
- [ ] New Vitest passes locally. Blocked: local Vitest package is absent and network is restricted.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reusable verifier plus narrow hard gate.

### Key Components

- `lib/mirror-sync-verify.cjs`: runtime path map, Markdown body extraction, Codex TOML body extraction, token comparison, and aggregate result shape.
- `lib/promotion-gates.cjs`: mirror sync state constants and gate evaluation.
- `promote-candidate.cjs`: agent-definition target detection, candidate-body verification, structured rejection, and optional state-file write.
- `reduce-state.cjs`: resume/dashboard visibility for latest mirror sync state and default recovery action.
- `references/promotion_rules.md` and `references/mirror_drift_policy.md`: operator-facing contract updates.

### Data Flow

```text
candidate body + target path
  -> infer agent name and target format
  -> verifyMirrorSync(agentName, content)
  -> evaluateMirrorSyncGate()
  -> reject structured error OR continue promotion
  -> optional mirror_sync_state JSON/JSONL
  -> reduce-state dashboard resume signal
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research

- [x] Read packet 123 roadmap, iteration 008, packet 124 ADR, and packet 126 ADR.
- [x] Inspect promotion, gate, scanner, reducer, and mirror policy surfaces.
- [x] Confirm runtime directories: `.opencode`, `.claude`, `.codex`, `.gemini`.

### Phase 2: Implementation

- [x] Add verifier helper.
- [x] Extend promotion gates for mirror sync state.
- [x] Wire hard promotion rejection for agent-definition targets.
- [x] Record partial recovery state and surface it through reducer/dashboard.
- [x] Update promotion and mirror drift references.

### Phase 3: Verification

- [x] Run `node --check` on modified `.cjs` files.
- [x] Run verifier smoke against the live `deep-agent-improvement` agent mirrors.
- [x] Attempt new Vitest. Blocked by missing local dependency and restricted network.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool | Evidence |
| --- | --- | --- | --- |
| Syntax | Modified `.cjs` files | `node --check` | All modified CJS files exit 0. |
| Verifier smoke | Live DAI mirrors | Direct Node call | `deep-agent-improvement` returns `allInSync: true`. |
| Regression | Synthetic 4-runtime fixtures | Vitest | Test file authored; runner blocked until dependencies exist. |
| Spec | Level 3 docs | `validate.sh --strict` | Final gate exits 0. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
| --- | --- | --- | --- |
| Packet 124 ADR-001 | Policy | Green | Mirror sync TODO would remain advisory. |
| Packet 126 promotion-gates helper | Code precedent | Green | State policy would scatter across scripts. |
| Runtime mirror directories | Repo structure | Green | Verifier needs all four paths. |
| Vitest package | Dev dependency | Blocked | New Vitest cannot execute until `.opencode/node_modules` exists. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: promotion rejects valid synchronized mirrors or reducer state causes resume confusion.
- Procedure: revert packet 127 changes in DAI scripts/references/tests and remove packet 127 docs.
- Verification after rollback: run `node --check` on touched scripts and run promotion against a non-agent fixture.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
| --- | --- | --- |
| Phase 1: Research | User scope and prior packets | Phase 2 |
| Phase 2: Implementation | Current code reads | Phase 3 |
| Phase 3: Verification | Implementation complete | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
| --- | --- | --- |
| Research | Medium | 45 minutes |
| Implementation | Medium | 2 hours |
| Verification | Medium | 45 minutes |
| Documentation | Medium | 1 hour |
| Total |  | 4.5 hours |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No actual agent definitions edited.
- [x] No sibling skill changes made.
- [x] State writes are optional and packet/runtime-local.

### Rollback Procedure

1. Remove `lib/mirror-sync-verify.cjs` and its test.
2. Revert promotion-gates, promote-candidate, reduce-state, and reference-doc edits.
3. Re-run syntax checks and any available DAI tests.

### Data Reversal

- Has data migrations? No.
- Reversal procedure: remove optional mirror sync state files generated by failed promotion attempts.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Packet 123 roadmap
  -> Packet 124 mirror TODO
  -> Packet 126 shared promotion-gates helper
  -> Packet 127 hard four-runtime sync gate
```

| Component | Depends On | Produces | Blocks |
| --- | --- | --- | --- |
| Mirror verifier | Runtime path map | Sync result shape | Promotion gate |
| Promotion mirror gate | Verifier result | Pass/reject and state | Canonical copy |
| State reducer | State JSON/JSONL | Resume dashboard signal | Operator recovery |
| Vitest fixture | Helper exports | Regression evidence | Final local test claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Establish runtime mirror contract.
2. Implement reusable verifier.
3. Wire hard promotion rejection.
4. Add state semantics for resume.
5. Verify syntax and helper behavior.
6. Strict-validate packet docs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria | Status |
| --- | --- | --- |
| M1: Verifier | Helper returns requested shape and handles Codex TOML | Complete |
| M2: Gate | Promotion rejects missing/drifted mirrors with structured error | Complete |
| M3: Recovery | `mirror_sync_state` visible to resume/dashboard | Complete |
| M4: Validation | Strict spec validation passes | Complete |
| M5: Vitest | New Vitest runs locally | Blocked by missing dependency |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:adr -->
## L3: ARCHITECTURE DECISION RECORDS

| ADR | Title | Status |
| --- | --- | --- |
| ADR-001 | Cross-Runtime Promotion Gate Contract | Accepted |
<!-- /ANCHOR:adr -->
