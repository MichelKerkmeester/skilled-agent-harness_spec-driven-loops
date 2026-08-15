---
title: "Implementation Plan: Phase 016 Default-Off and Advisor Exclusion"
description: "Complete the default-off enablement gate and the adjustable advisor route-exclusion through paired package and advisor verification, a live routing probe, and strict packet closeout."
trigger_phrases:
  - "default-off-and-advisor-exclusion"
  - "implementation plan"
  - "enablement gate and advisor exclusion plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/016-default-off-and-advisor-exclusion"
    last_updated_at: "2026-08-13T19:03:35.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded the completed enablement-gate and advisor-exclusion plan and verification path."
    next_safe_action: "After landing on main, rebuild the advisor dist, reindex, and re-probe to confirm the exclusion."
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
      session_id: "phase-016-default-off-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The package gate and the advisor route-exclusion tests, plus a live routing probe, are the completion evidence."
      - "A negative control with an empty exclusions directory proves the advisor edits add zero new failures."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 016 Default-Off and Advisor Exclusion

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript package plus the TypeScript advisor runtime |
| **Framework** | Node file and environment reads; vitest; system-spec-kit Level-3 closeout |
| **Storage** | Repository files only; a git-ignored local file and a committed default per surface |
| **Testing** | Package `npm run check`, advisor route-exclusion unit tests, a live advisor probe, and a negative control against the known failure baseline |

### Overview

Close two completed changes with paired evidence. The package proves a default-off enablement gate through its full gate. The advisor proves an adjustable route-exclusion through ten unit tests, a live probe, and a negative control that isolates the change from the known 41-failure baseline. The result is a self-contained evidence packet, not a behavior change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The two opt-in sources and their precedence are explicit. [evidence: environment variable wins, then the git-ignored local file]
- [x] Both advisor routability seams are located. [evidence: `isDefaultRoutable` in `fusion.ts` and `filterDefaultRoutable` in `archive-handling.ts`]
- [x] The advisor failure baseline is captured. [evidence: 41 pre-existing failures from prior worktree drift]

### Definition of Done

- [x] All eight requirements have observed evidence. [evidence: `checklist.md` and `implementation-summary.md`]
- [x] The live advisor probe no longer returns `sk-communication`. [evidence: probe returns `cli-external-orchestration`, `sk-git`, `sk-design`, `sk-code`]
- [x] Phase 016 and its parent pass strict validation with zero errors and warnings. [evidence: final `validate.sh --strict` runs]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two independent gates verified in parallel: an activation-seam enablement gate in the package and an adjustable, fail-safe denylist in the advisor, joined by a live routing probe and a negative control.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Enablement resolver and gate | Default projection to off and opt in privately through an environment variable or a git-ignored local file |
| Route-exclusion loader | Resolve the excluded-skill-id set from a committed default or a git-ignored override, fail-safe and cached |
| Routability seams | Drop excluded ids at the production recommend gate and at the archive filter |
| Evidence and parent wiring | Preserve strict conformance, navigation, and graph truth |

### Data Flow

Enablement: environment variable or local file -> pure resolver -> `isProjectionEnabled()` -> activation path projects or returns the exact original. Exclusion: committed or local config -> cached loader -> both routability seams -> the advisor omits `sk-communication`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Package config module | Decide enablement | Verified: default-off resolver and gate | `npm run check` passes 296/296 with 7 new tests |
| Package exports | Publish the public surface | Verified: enablement exported through `config/index.ts` and `index.ts` | Public-import smoke in the package gate |
| Advisor route-exclusion loader | Resolve the denylist | Verified: fail-safe cached loader with env-dir override and reset seam | Ten unit tests in `route-exclusions.vitest.ts` |
| Advisor routability seams | Recommend and filter skills | Verified: denylist wired into `fusion.ts` and `archive-handling.ts` | Live probe omits `sk-communication`; negative control isolates the change |
| Phase and parent packet docs | Record and route completion state | Create Phase 016 and wire parent, 015, and graph links | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm the two enablement opt-in sources and their precedence. [evidence: environment variable wins over the git-ignored local file]
- [x] Locate both advisor routability seams and capture the failure baseline. [evidence: `fusion.ts`, `archive-handling.ts`, and 41 pre-existing failures]

### Phase 2: Implementation

- [x] Verify the default-off enablement gate and its exports. [evidence: `src/config/enablement.ts`, `config/index.ts`, `src/index.ts`]
- [x] Verify the fail-safe route-exclusion loader and the committed denylist. [evidence: `lib/routing/route-exclusions.ts`, `config/route-exclusions.json`]
- [x] Verify the denylist wired into both seams and the git-ignored override files. [evidence: `fusion.ts`, `archive-handling.ts`, `.gitignore` entries, `.example` templates]

### Phase 3: Verification

- [x] Run the package gate from the package directory. [evidence: `npm run check` passes 296/296]
- [x] Run the advisor tests, the live probe, and the negative control. [evidence: ten new tests pass, probe omits `sk-communication`, control shows +10 and 0 new failures]
- [x] Author the Level-3 packet, wire Phase 016, backfill metadata, and pass both strict validators. [evidence: final packet and parent receipts]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Enablement unit | Pure resolver and gate across the two opt-in sources | Package vitest, 7 new tests inside the 296 total |
| Package gate | Typecheck, build, 296 tests, public-import smoke | `npm run check` from the package directory |
| Route-exclusion unit | Loader precedence, env-dir override, fail-safe behavior, cache reset | Advisor vitest, 10 new tests |
| Live routing probe | A projection-shaped prompt against the live advisor | `skill_advisor.py "make CLI output readable, claudish to english" --threshold 0.5` |
| Negative control | Empty exclusions directory to isolate the change | Advisor vitest against the 41-failure baseline |
| Packet integrity | Phase 016 plus parent map, links, and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Package build and test gate | Internal | Available: 296/296 | Enablement alignment cannot be claimed |
| Advisor source and both seams | Internal | Available and wired | The denylist would not suppress routing |
| Advisor failure baseline | Evidence | Available: 41 pre-existing failures | Regression cannot be isolated |
| Advisor rebuild and reindex on main | Deployment | Pending on the target | The compiled gate would not take effect on main |
| system-spec-kit metadata and strict validator | Internal | Available | Packet and parent cannot be closed cleanly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: enablement flips on without an opt-in, the advisor recommends `sk-communication` again, or a config change crashes routing.
- **Procedure**: revert the enablement module and exports, or clear `excludedSkillIds` in the committed config and revert the loader and both seam edits, then rerun `npm run check` and the advisor tests, refresh graph metadata, and rerun Phase 016 plus parent strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Opt-in and seam inventory -> Gate and loader evidence -> Live probe and negative control -> Packet and parent closeout
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Opt-in and seam inventory | Maintained package and advisor structure | Gate and loader evidence |
| Gate and loader evidence | Complete inventory | Live probe and negative control |
| Live probe and negative control | Completed evidence | Packet closeout |
| Packet and parent closeout | All verification evidence | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Opt-in and seam inventory | Low | 0.5 day |
| Gate and loader evidence | Medium | 0.5-1 day |
| Verification and packet closeout | Low | 0.5 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the package failure baseline. [evidence: 289 prior tests green before the 7 new enablement tests]
- [x] Record the advisor failure baseline. [evidence: 41 pre-existing failures from prior worktree drift]
- [x] Confirm the source is the only landed surface. [evidence: the advisor dist is git-ignored and not committed]

### Procedure

1. Restore only the gate, loader, seam, or packet link that regressed.
2. Rerun `npm run check` or the advisor tests as applicable.
3. Refresh the affected graph metadata.
4. Rerun strict validation for Phase 016 and the parent.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Restore config and source only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Opt-in and seam inventory
        |
        v
Package gate -> Enablement evidence
        |
Advisor loader -> Both seams -> Live probe
        |                          |
        +------ negative control --+
                                   |
                                   v
                          Packet and parent closeout
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Enablement gate | Package config module | Default-off resolution and a gated activation path | Package gate evidence |
| Route-exclusion loader | Committed and optional local config | The resolved excluded-skill-id set | Both routability seams |
| Routability seams | The resolved set | A recommend gate and an archive filter that omit excluded ids | Live probe and negative control |
| Packet and parent wiring | All verification evidence | Strict conformance, navigation, and graph truth | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm opt-in sources and locate both seams** - 0.5 day - critical.
2. **Prove the gate and the loader with paired evidence** - 0.5-1 day - critical.
3. **Run the live probe and the negative control, then close the packet** - 0.5 day - critical.

**Parallel opportunities**:

- The package gate and the advisor tests run on independent surfaces.
- Packet authoring can proceed while the live probe and negative control run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Sources and seams confirmed | Two opt-in sources and both seams identified with the failure baseline | Stage 1 |
| M2 | Gates proven | Package gate 296/296 and ten advisor tests pass | Stage 2 |
| M3 | Phase handoff accepted | Live probe omits the skill, negative control is clean, and strict validation passes | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: gate enablement at the activation seam with a pure resolver, and exclude the skill through an adjustable denylist.

**Status**: Accepted. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the predecessor handoff and both failure baselines before recording evidence.
- Re-read every target file before editing and keep writes inside the documentation scope.
- Translate each requirement into an observable check before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; evidence cannot precede inventory. |
| TASK-SCOPE | Modify only the Phase 016 documentation surfaces and the named parent links. |
| TASK-PROOF | Run focused checks, then rerun the authoritative gates and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=016 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the package gate, the advisor tests, or the live probe disagree with this plan, mark the task blocked, preserve the default-off and fail-safe behavior, and update the decision record before resuming.
