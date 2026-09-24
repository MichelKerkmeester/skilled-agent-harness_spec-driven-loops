---
title: "Feature Specification: Phase 1: tooling and pilot"
description: "Builds the checker, the two briefs and the driver that rewrite skill changelogs one file at a time, then runs a ten-file pilot whose style the operator approves before any per-skill wave starts."
trigger_phrases:
  - "changelog retrofit tooling"
  - "changelog shape checker"
  - "changelog rewrite pilot"
  - "changelog rewrite driver"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: tooling and pilot

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-24 |
| **Branch** | `worktrees/064-save-writer-continuity-fields` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 16 |
| **Predecessor** | None |
| **Successor** | 002-cli-external-orchestration |
| **Handoff Criteria** | The operator approves the pilot style, and the checker, briefs and driver are frozen for the waves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the skill changelog retrofit.

**Scope Boundary**: The tooling in `../scratch/` and the ten pilot changelogs in `../scratch/pilot-list.txt`. No per-skill wave runs in this phase.

**Dependencies**:
- GPT-6 Luna on the GPT plan through cli-pi and cli-codex
- sk-create-changelog's format contract and its v4.0.0.0 exemplar

**Deliverables**:
- A calibrated shape checker, a rewrite brief, a fact-check brief and a driver
- A reviewed ten-file pilot and the operator's style approval
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 549 legacy skill changelogs span several older styles, and a model asked to rewrite them can drop or invent facts. A per-file rewrite at this scale needs gates that catch that before anything is committed. It also needs a style the operator has seen on a few files before hundreds more follow it.

### Purpose
A rewrite reaches the tree only after a shape check, a voice check and a second-model fact check all pass, and the style is fixed on ten files before the rest run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The shape checker, the rewrite brief, the fact-check brief and the driver in `../scratch/`
- A pilot of ten changelogs that covers every legacy style
- The operator's review of the pilot style

### Out of Scope
- The per-skill waves, which phases 002 to 016 own
- Changes to sk-create-changelog's own contract

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../scratch/check_changelog_shape.py` | Create | Shape, frontmatter and new-fact checks |
| `../scratch/brief-rewrite.md` | Create | The one-file rewrite brief |
| `../scratch/brief-verify.md` | Create | The no-tools fact-check brief |
| `../scratch/rewrite-driver.cjs` | Create | Two-lane queue with gates, up to three attempts, restore and a state file |
| The ten files in `../scratch/pilot-list.txt` | Modify | Rewritten in place when every gate passes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

These are the per-file rules the tooling enforces. Phases 002 to 016 apply them unchanged.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A rewrite adds no fact. Every identifier and number in it already appears in the original, and a separate fact check finds nothing unsupported, dropped or distorted. |
| REQ-002 | A rewrite keeps every user-visible behavior change, breaking change, migration step, required action and correction the original records. |
| REQ-003 | A rewrite passes the shape checker and has zero HVR hard blockers. |
| REQ-004 | A file that cannot pass is restored to its original, and its draft is kept for review. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Frontmatter stays byte-identical, and paths and names stay as the original wrote them. |
| REQ-006 | Dispatches use GPT-6 Luna through the GPT plan on cli-pi and cli-codex. The LLM Gateway route runs only while that plan reports a usage limit. |
| REQ-007 | The operator approves the pilot style before phase 002 starts. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this phase may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The checker passes the exemplar and all 25 compliant changelogs, and fails the legacy ones.
- **SC-002**: Every pilot file either passes all three gates or equals its original with its draft kept.
- **SC-003**: The operator approves the pilot style.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A model states a fact the original does not | High | The checker rejects new identifiers and numbers, and the fact check lists unsupported claims |
| Risk | A rewrite drops a breaking change or upgrade step | High | The fact check lists drops, and the checker warns when the original mentions a breaking change the rewrite does not mark |
| Risk | The GPT plan runs out mid-run | Medium | The driver switches to the gateway after a usage-limit reply and retries GPT after 30 minutes |
| Dependency | GPT-6 Luna on both CLIs | Medium | Smoke-tested on 2026-09-24: `openai-codex/gpt-6-luna` on cli-pi and `gpt-6-luna` on cli-codex both replied |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Two dispatches run at once, one per CLI. Each file is one rewrite dispatch plus one fact-check dispatch, and a failed gate earns another attempt, up to three in all.

### Security
- **NFR-S01**: Executors write only the one changelog they are given. The fact-check dispatch runs without tools on cli-pi and read-only on cli-codex.

### Reliability
- **NFR-R01**: The driver resumes from its state file and stops cleanly when a `STOP` file appears.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A very short original (164 bytes) stays short, because the brief forbids padding.
- A very long original (up to 57 KB) takes the expanded format within the contract's caps.

### Error Scenarios
- An executor leaves the file unchanged or times out: the attempt counts as failed and the next one is told so.
- The GPT plan reports a usage limit: the file goes back to the front of the queue on the gateway route.

### State Transitions
- A killed run leaves at most the files that were in flight. The next run restores each of them from its saved original before rewriting it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four tools and ten pilot files |
| Risk | 12/25 | Documentation only, but historical facts must survive |
| Research | 6/20 | The contract and exemplar define the target |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The retry question was answered on 2026-09-24: each file gets three attempts, as part of the operator's "Approve with fixes" decision.
<!-- /ANCHOR:questions -->
