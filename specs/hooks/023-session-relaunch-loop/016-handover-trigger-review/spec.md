---
title: "Feature Specification: Phase 16: handover-trigger-review"
description: "The /speckit:handoff command doc did not follow the sk-create-command template, and nobody had asked whether the automatic handover fires every time on all five automatic runtimes. This phase aligns the command doc and runs a ten-iteration deep review of the whole packet steered at that question."
trigger_phrases:
  - "handover trigger review"
  - "phase 16 handover trigger review"
  - "speckit handoff command template"
  - "handover fires every time"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: handover-trigger-review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/172-v4-0-0-13-changelog-and-handover-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-v4-0-0-13-changelog |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, every confirmed P0 and P1 finding is fixed, live hops pass again on the five automatic runtimes and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Session relaunch loop specification.

**Scope Boundary**: Two parts. Part A aligns the `/speckit:handoff` command doc with the sk-doc sk-create-command template. Part B reviews the whole 023 packet in a ten-iteration `/deep:review`, then fixes what the review confirms and proves live hops again.

**Dependencies**:
- Phases 001 to 015, which built, documented and released the in-session handover.
- The sk-doc sk-create-command template and contract for Part A.
- The `/deep:review` workflow and `fanout-run.cjs` with one cli-codex executor for Part B.

**Deliverables**:
- Part A: a `/speckit:handoff` doc that follows the command template, and a contract coverage note that names it.
- Part B: a review report for the packet, fixes for every confirmed P0 and P1 finding and the P2s, and fresh live-hop evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/speckit:handoff` command doc used a section name the command template does not approve, "RECEIVING A HANDOFF". Its step headings were not in title case and its overview did not list the exact STATUS lines the command prints. Separately, phase 013 proved one live hop per automatic runtime, but no review has asked whether the automatic handover fires every time on Claude, Pi, OpenCode, Codex and Hermes, including in repositories that symlink `.skilled`.

### Purpose
The command doc reads like every other command doc, and the packet has review evidence that the automatic handover fires every time it should, or a list of fixed findings where it did not.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Part A: the `/speckit:handoff` command doc and the coverage note in the sk-create-command contract.
- Part B: a ten-iteration `/deep:review` of the whole 023 packet with cli-codex `gpt-6-luna`, reasoning max, fast tier, run through `fanout-run.cjs` with one executor.
- Part B: steering the review to whether the automatic handover fires every time on the five automatic runtimes, including repositories that symlink `.skilled`.
- Part B: verifying each finding, fixing every confirmed P0 and P1 and the P2s, and proving live hops again.

### Out of Scope
- A command contract family entry for `/speckit:handoff`, because it takes no arguments, has no modes and has no presentation asset.
- The `argument-hint`, the `allowed-tools` list and a violation self-detection block in the handoff doc, left unchanged on purpose.
- Applying the proposed one-line amendment for the violation self-detection inconsistency in sk-create-command.
- Cursor and Devin automatic hops, which stay on the command trigger.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/handoff.md` | Modify | Part A: REFERENCE section, title-case steps, Outputs column with the three STATUS lines |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Part A: coverage note says 34 of the 40 shipped commands and names `/speckit:handoff` and `/doctor:setup` |
| Files named by confirmed review findings | Modify | Part B: pending, decided by the review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The `/speckit:handoff` doc follows the sk-create-command template: an approved section name, title-case step headings and an Outputs column that lists the exact STATUS lines. |
| REQ-002 | A ten-iteration `/deep:review` of the whole 023 packet runs with cli-codex `gpt-6-luna`, reasoning max, fast tier, through `fanout-run.cjs` with one executor, steered to whether the automatic handover fires every time on the five automatic runtimes. Pending. |
| REQ-003 | Every P0 and P1 finding from the review is verified, and every confirmed one is fixed. Pending. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The Part A checks pass: the kebab name check, `validate_document.py --type command`, `extract_structure.py`, `hvr_scan.py`, the router generator, the runtime mirror check and the doctor-update contract test. |
| REQ-005 | Confirmed P2 findings are fixed. Pending. |
| REQ-006 | Live hops pass again on Claude, Pi, OpenCode, Codex and Hermes after the fixes, including in a repository that symlinks `.skilled`. Pending. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The handoff command doc passes the command validators with 0 issues and 0 HVR hard blockers.
- **SC-002**: The review converges and every confirmed P0 and P1 finding has a fix and a passing check.
- **SC-003**: A fresh live hop passes on each of the five automatic runtimes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reviewer finding is a false positive | Med | Each finding is a hypothesis until a read or a run confirms it |
| Risk | A fix for one runtime breaks the hop on another | High | Live hops are proven again on all five runtimes after the fixes |
| Risk | The template rename breaks a router or mirror | Low | The router generator and the mirror check both ran clean after Part A |
| Dependency | cli-codex with `gpt-6-luna` | Part B cannot run | Read the cli-codex skill before composing the dispatch |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The review runs ten iterations at most, with convergence allowed to stop it sooner.

### Security
- **NFR-S01**: No fix lets the killer signal a process the loop did not start.

### Reliability
- **NFR-R01**: Every fix carries a test or a live run that fails without it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A repository whose `.skilled` is a symlink to this checkout: the review checks it hops the same way.
- A session started outside the loop: the review checks no nudge fires.

### Error Scenarios
- A hop that stalls: the review checks the record is disarmed and the notice names the reason.

### State Transitions
- A session at the hop cap: the review checks no adapter nudges and no record arms.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One command doc now, and the files the review names later |
| Risk | 10/25 | Fixes touch the hop path on five runtimes |
| Research | 12/20 | A ten-iteration review and a live re-proof |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which findings the review confirms, and which files they touch.
<!-- /ANCHOR:questions -->

---
