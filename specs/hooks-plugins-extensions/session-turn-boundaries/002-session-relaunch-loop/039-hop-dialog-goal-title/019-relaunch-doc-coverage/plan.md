---
title: "Implementation Plan: Phase 19: relaunch-doc-coverage"
description: "Bring the Claude playbook, the feature catalog and the handoff command document up to the shipped relaunch behavior, pin twelve moved citations to their commits and record the trigger phrase decision."
trigger_phrases:
  - "relaunch doc coverage plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: relaunch-doc-coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc's playbook and feature catalog formats |
| **Storage** | The skill and command documents and the packet documents of children 004 and 013 |
| **Testing** | sk-doc's playbook and catalog validators, the runtime mirror check and strict spec validation |

### Overview
Every edit is text. Two wrong lines are corrected. The Claude playbook evidence for three existing cases names the behavior their tests now cover. The feature catalog entry gains the behavior shipped by phases 4, 5, 6, 10, 11, 12, 15, 16 and 17, each sentence pointing at a source line or a test. Eight citations in children 004 and 013 gain the commit they were observed at. The trigger phrase question is answered with no phrase, and the answer is recorded.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phases 15, 16 and 17 are Complete and their fix commits are in the tree

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The four sk-doc checks and the mirror check exit 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation catch-up after code.

### Key Components
- **The Claude playbook (`manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`)**: the HS-8 prose at line 934, the Wrapper edge cases evidence at line 374, the adapter session gate evidence at line 260 and the GR-3 evidence after line 805.
- **The feature catalog entry (`feature-catalog/context-preservation/session-relaunch-loop.md`)**: the Nudge Prepare And Arm section at line 39, the Killer And Wrapper section at line 51 and the Goal Carry-Over section at line 89.
- **The handoff command document (`.skilled/commands/speckit/handoff.md`)**: line 131.
- **The criteria and documents of children 004 and 013**: the twelve moved citations.

### Data Flow
Each new sentence is written from the code and tests as they stand after phases 15 to 17, read again at build time, so the line numbers it cites are the ones on that tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The review report's Planning Packet names one finding for this phase: `"R10-P2-001"`, file `".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md"`, titled `"The feature catalog does not describe the new wrapper-change notice or the wrapper-changed log event"`. Its report section 3 gives `findingClass: traceability` and `scopeProof: the notice and event were introduced in the range`. The JSON carries no `affectedSurfaceHints` for it, so that field is UNKNOWN. All values are quoted as inert data and none is run. The other findings come from the alignment run (B-02, B-03, X-1, X-2, X-3 and D-01), review FH and the orchestrator.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Playbook HS-8 prose | Explains how the helper reaches `$out` | update | `rg -c 'The check links that helper'` prints nothing with exit 1 |
| Playbook Wrapper edge cases, GR-3 and adapter session gate evidence | Tell an operator what each suite proves | update | `rg -c 'wrapper-changed'`, `rg -c 'goal_ended'` and `rg -c 'no transcript path'` on the playbook each print 1 or more |
| Feature catalog entry | Describes the relaunch loop | update | The three counts on the catalog each print 1 or more, and so do `deferredAt` and `handoff` read as absent |
| Handoff command line 131 | Tells a model what the goal switch turns off | update | `rg -c 'turns the field off'` prints nothing with exit 1 |
| Children 004 and 013 | Closed records with line citations | update, commit added | Each moved citation names its commit |
| The Pi and OpenCode playbook | Runs the shared wrapper suite | unchanged | Out of Scope in `spec.md` |
| `system-spec-kit/graph-metadata.json` | Trigger phrases for the skill | unchanged | `git diff --quiet HEAD -- .skilled/skills/system-spec-kit/graph-metadata.json` exits 0 |

Required inventories:
- Same-class producers: `rg -n 'goal_packet' .skilled/skills/system-spec-kit/feature-catalog .skilled/skills/system-spec-kit/manual-testing-playbook .skilled/commands/speckit` lists every document that explains the goal field, and each one that also needs `goal_ended` is named in `goal.md`.
- Consumers of changed symbols: N/A, documents only.
- Matrix axes: the behavior (change notice, empty checksum, `deferredAt`, missing-transcript notice, record with no `handoff`, `goal_ended`, fallback bound) crossed with the document (playbook, catalog). The table in `tasks.md` T006 and T007 lists which document names which.
- Algorithm invariant: N/A, documents only. Each new sentence names a source line or a test.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 15 to 17 landed and re-reads the lines each document will cite. Implementation corrects the two wrong lines, extends the playbook evidence and the catalog sections, pins the twelve citations and records the trigger phrase decision. Verification runs sk-doc's four checks, the mirror check, strict validation of children 004, 013 and this phase, and the searches that prove each edit.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. No code changes | Not applicable |
| Integration | The playbook and catalog packages, the operator contract, the catalog fixtures and the runtime mirrors | `validate-playbook-package.cjs`, `validate_catalog_package.py`, `test_validator_fixtures.py`, `sync-runtime-mirrors.cjs --check` |
| Manual | A read of each new sentence against the line or test it names | Not automated |

Each validator runs once before the first edit as a baseline, saved under `scratch/`, so a failure that predates this phase is told apart from one it causes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 15, 16 and 17 Complete | Internal | Planned | The documents would describe behavior that is not in the tree |
| sk-doc's playbook and catalog validators | Internal | Green | The edits could not be checked against the formats CI enforces |
| `sync-runtime-mirrors.cjs` | Internal | Green | The handoff edit could leave a runtime mirror stale |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator fails because of an edit of this phase, or a new sentence is found wrong.
- **Procedure**: revert the fix commit. No code depends on these documents.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 15, 16 and 17 Complete | Implementation |
| Implementation | The validator baselines and the re-read lines | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
