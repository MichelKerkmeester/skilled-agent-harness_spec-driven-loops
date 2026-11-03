---
title: "Feature Specification: Phase 8: release-coverage"
description: "The root release notes and the root README never mentioned this packet, because the alignment check only reviews lines a branch touches. This phase folds the packet into v4.0.1.0 and the README, and adds a check that an added skill changelog or skill is named in the open release notes and the root README."
trigger_phrases:
  - "release coverage"
  - "phase 8 release coverage"
  - "release notes coverage check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: release-coverage

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-web-only-frontend |
| **Successor** | None |
| **Handoff Criteria** | The new check passes on this branch, and the release notes and README validate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the frontend upstream proposals packet.

**Scope Boundary**: the open root release notes `.skilled/changelog/skilled/v4.0.1.0.md`, the root `README.md`, and the operator-local alignment harness under `.skilled/commands/assets/local-skilled-alignment/` with its command doc. The harness is gitignored, so its change lives in the main checkout and is not committed.

**Dependencies**:
- Phase 007 closed, with the per-skill changelogs aligned.

**Deliverables**:
- The packet folded into v4.0.1.0 and the README; a release-coverage check in the alignment battery, with tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every skill this packet changed has its own changelog entry, but the open root release notes say nothing about the packet and the root README mentions only the three surfaces. Two alignment passes missed it, because the review lanes read the lines a branch touched and the branch never touched those sections, and S6 has no deterministic check at all.

### Purpose
A reader of the release notes or the root README learns what this packet ships, and the next branch that adds a skill changelog or a skill without naming it there fails the alignment battery.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c -i "sk-code-frontend|five-pass|sk-design-fundamentals" .skilled/changelog/skilled/v4.0.1.0.md
(no output, exit 1)
$ rg -n -A3 "^  S6:" .skilled/commands/assets/local-skilled-alignment/surface-map.yaml | rg checks
    checks: []
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fold the frontend surface, the Figma check, the design hand-offs, the router-tooling fixes and the two Spec Kit lines into v4.0.1.0 and the root README.
- Add `check-release-coverage.cjs` to the alignment harness as S6's check, with tests, and widen the S5 and S6 review lens past the touched lines.

### Out of Scope
- A new root release version: the operator chose to fold into v4.0.1.0, as the decision-capture series was.
- Release notes or README sections for skills this packet did not change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.1.0.md` | Modify | Fold the packet in |
| `README.md` | Modify | One entry per affected skill section |
| `.skilled/commands/assets/local-skilled-alignment/check-release-coverage.cjs`, its test | Create | Release-coverage check (gitignored) |
| `.skilled/commands/assets/local-skilled-alignment/surface-map.yaml`, `.skilled/commands/local-skilled-alignment.md` | Modify | Wire the check and widen the lens (gitignored) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-release-coverage.cjs` fails when an added skill changelog's skill, or an added skill, is absent from the open release notes, and an added skill absent from the root README, in tests that fail without the rule |
| REQ-002 | The check passes on this branch after the fold |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | v4.0.1.0 describes the frontend surface, the design hand-offs, the router-tooling fixes and the Spec Kit lines, and validates |
| REQ-004 | The root README entries for mcp-figma, sk-design-fundamentals and Spec Kit describe what shipped |
| REQ-005 | `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On this branch the check prints `STATUS=OK` after the fold, where it printed `MISSING` lines before it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The check flags a skill whose release-note mention is generic | Low | It is a floor; the widened lens covers the substance |
| Dependency | The harness symlink in a worktree resolves to the main checkout | The change lands in main's gitignored copy | Run it from a worktree copy, as phase 006 did |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: A missing release-notes folder grades the row `cannot_run`, never a silent pass.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Versions compare numerically, so `v1.0.10.0` is newer than `v1.0.9.0`.
- A scope that adds no changelog and no skill requires nothing and passes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two docs and one script with tests |
| Risk | 4/25 | Docs and an operator-local check |
| Research | 4/20 | The release-notes shape is set by the decision-capture fold |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose to fold into v4.0.1.0 and to widen the alignment check (2026-11-03).
<!-- /ANCHOR:questions -->

---
