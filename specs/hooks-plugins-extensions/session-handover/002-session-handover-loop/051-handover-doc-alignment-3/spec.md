---
title: "Feature Specification: Hand-over doc alignment, third pass: fix the 25 findings of the deepseek-flash check"
description: "A third doc alignment run over 87 hand-over docs found 25 statements that no longer match the code: Vibe left out of the linked-folder lists, Cursor's command named wrong, and the env reference missing four wrapper variables. This packet fixes them."
trigger_phrases:
  - "handover doc alignment 3"
  - "phase 51 handover doc alignment 3"
  - "handover doc alignment third pass"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Hand-over doc alignment, third pass: fix the 25 findings of the deepseek-flash check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 51 of 51 |
| **Predecessor** | 050-handover-doc-alignment-2 |
| **Successor** | None |
| **Handoff Criteria** | Every kept finding is fixed in its doc and the topic's two checks pass on the fixed tree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 51** of the session-handover loop: the third doc alignment pass over the hand-over docs.

**Scope Boundary**: The 16 docs the 25 kept findings name. No code changes.

**Dependencies**:
- The `/local-doc-alignment session-handover` run of 2026-11-16 at `~/.local/state/local-doc-alignment/Skilled/20261116T130806Z`.

**Deliverables**:
- The 25 findings fixed in their docs, and this packet's record of how each was checked.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A third `/local-doc-alignment session-handover` run read 87 docs in four DeepSeek V4.1 Flash lanes at max thinking, and a critic checked each finding. It kept 25: 7 P1 and 18 P2. Two docs list the folders a linked repository needs for an automatic hop and leave out `.vibe`, two docs give Cursor the wrong command name, and the env reference leaves out four variables the wrapper exports.

### Purpose
Every kept finding is fixed in the doc that states it, so the hand-over docs match the code they describe.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs --run-dir ~/.local/state/local-doc-alignment/Skilled/20261116T130806Z --map .skilled/commands/assets/local-doc-alignment/doc-map.yaml
STATUS=OK aggregate-findings: findings=25 P0=0 P1=7 P2=18 inferred=0 outside_scope=0 overturned=1 problems=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the 18 literal fixes with the alignment tool's `apply-fixes.cjs`, after checking the riskier claims against the code.
- Write the 7 judgment fixes by hand, each checked against the code it describes.
- Verify with the sk-doc validator, the voice scan against each file's committed copy and the topic's two checks.

### Out of Scope
- Code changes. Every finding is a doc statement, and where the code and a doc disagree the doc changes.
- The finding the critic overturned, about the start claim and the Claude enable switch. The code at `claude/handover-compact-pointer.mjs:171` agrees with the critic.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Session-handover docs under `.skilled/hooks/` | Modify | Runtime folders, arm events, goal packet export, lock expiry, troubleshooting, Vibe adapter row |
| `.skilled/hooks/shared/README.md` | Modify | The default-off list now holds two concerns |
| System-spec-kit feature catalog, playbook and `ENV-REFERENCE.md` | Modify | Vibe folder, compaction claims, sub-agent guard, switch coverage, wrapper variables |
| Root `README.md`, `.skilled/bin/README.md`, `.skilled/commands/speckit/README.txt` | Modify | Effort carry, which runtimes hop, Cursor's command name, the handoff command's effect |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 25 kept findings is fixed in its doc, and each fix states what the code does |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | No changed doc gains a voice hard blocker or a validation issue against its committed copy |
| REQ-003 | No code or unrelated file changes: the diff lists only the 16 docs and this packet |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `apply-fixes.cjs` reports `applied=18 skipped=0`, and the 7 judgment fixes are in place.
- **SC-002**: The topic's two checks, `D2-drift-guards` and `D2-hook-registrations`, pass on the fixed tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The alignment run's `findings.json` | A fix string that no longer matches its doc would be skipped | The dry run reported `would_apply=18 skipped=0` before the real run |
| Risk | A model-written fix states something new that is also wrong | Med | Each claim the orchestrator could not confirm from memory was checked against the code before the fixes were applied |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: docs only, no service.

### Security
- **NFR-S01**: N/A: no code, credential or permission surface changes.

### Reliability
- **NFR-R01**: Every command and variable a changed doc names exists in the code as written.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a finding the code refutes is left unchanged and recorded with its evidence.
- Maximum input: two findings on one statement get one edit that fixes both.
- Failure path: a literal fix whose old text is gone is skipped by `apply-fixes.cjs` and reported.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 16 docs, no code |
| Risk | 5/25 | Docs only |
| Research | 7/20 | Each riskier claim checked against the code |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
