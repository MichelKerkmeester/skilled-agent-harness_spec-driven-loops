---
title: "Feature Specification: Trigger coverage check"
description: "check-repo-rules.cjs never compares a router trigger row with its rule's Fires-when list, and the two are written independently. Add a tenth check that flags a Fires-when bullet the router row never routes, and fix what it finds."
trigger_phrases:
  - "trigger coverage check"
  - "fires when router parity"
  - "check repo rules tenth check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Trigger coverage check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-rule-delivery-instrumentation |
| **Successor** | 006-rule-concision-rewrites |
| **Handoff Criteria** | `check-repo-rules.cjs` passes ten checks on the corpus |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the repo rule surfacing, concision and loading specification.

**Scope Boundary**: One new check, a `--root` flag for tests, the router edits it forces, and the docs that list the checks.

**Dependencies**:
- The gap named in `001-advisor-surfacing/research/research.md`

**Deliverables**:
- Check 10 in `check-repo-rules.cjs`
- pytest fixtures
- Router rows fixed where the check finds a real gap

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check-repo-rules.cjs` runs nine checks and none compares a trigger row in `REPO RULES.md` with its rule's `## Fires when` bullets. The two are worded independently: `REPO RULES.md:41` reads "Touch a file outside the ask" while `scope-discipline.md:35-39` reads "You notice a defect, a smell". A rule can therefore fire on an action the router never sends anyone to it for, and Gate 5 loads by the router.

### Purpose
CI fails when a rule's Fires-when bullet has no counterpart in its router row.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Check 10: lexical coverage of each Fires-when bullet by the router row's `·`-separated items
- A `--root <dir>` flag so tests can point the checker at a fixture tree
- Router row edits for each real gap the check finds, each listed
- Docs that enumerate the checks: `SKILL.md:171`, `references/rule-anatomy.md:22-25`

### Out of Scope
- Semantic matching with a model - a lexical rule is deterministic and cheap
- Barter's copy of the checker - gitignored and maintained separately
- Rewording rule bodies - phase 006

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modify | Add check 10 and `--root` |
| `.skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py` | Create | Covered and uncovered fixtures |
| `REPO RULES.md` | Modify | Router items for real gaps |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modify | Ten checks listed |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | Modify | Check list updated |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Check 10 reports each uncovered bullet with its rule, the bullet text and the router line number |
| REQ-002 | The corpus passes all ten checks after the router edits, and each edit is listed in `implementation-summary.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | pytest covers one covered and one uncovered bullet through `--root` |
| REQ-004 | The docs list ten checks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node check-repo-rules.cjs` prints `RESULT: PASSED (10/10 checks)`.
- **SC-002**: Removing a router item in a fixture makes check 10 fail.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A lexical threshold flags wording variance as gaps | Med | T002 measures overlap across all 13 rules first and sets the threshold from that |
| Risk | Router edits change what Gate 5 loads | Low | Edits only add missing routes, and land before the phase 007 and 008 measurement windows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What token-overlap threshold separates a real gap from paraphrase? T002 measures it.
<!-- /ANCHOR:questions -->

---
