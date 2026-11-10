---
title: "Feature Specification: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer"
description: "One over-wide line in the shipped commit template stops its rules block from round-tripping, so /doctor:git standards set rewrites the whole block instead of one line."
trigger_phrases:
  - "standards template round trip"
  - "restore the round trip of the shipped commit"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Restore the round-trip of the shipped commit template rules block through the /doctor:git standards serializer

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-15 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:git standards set` changes one rule by re-serializing the rules block, and it keeps the block's own layout only when the shipped block round-trips through `styled()` in `git-standards.cjs`. Commit `b36049af39` widened the `commitId` trailer line in `commit-message-template.md` to 133 characters, past the 115-character inline limit (`git-standards.cjs:61`). The block now falls back to `JSON.stringify`, so a one-value change rewrites the whole block in the user's `.sk-git/` copy, and two `git-standards.test.cjs` tests fail on main.

### Purpose
The shipped commit template round-trips again, so `set` changes exactly one line and both tests pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reflow the `commitId` entry of the shipped commit template's rules block into the multi-line layout the serializer emits. Whitespace only, the JSON value is unchanged.

Scope widened on 2026-10-15 with operator approval to the follow-ups of the `/doctor:git setup` build: the red Gate Inputs CI check, the HVR blockers in the docs that build touched, all six AI-tool adapters in the ai-tool-hooks check and a DOC-384 run through a real runtime.

### Out of Scope
- Raising `INLINE_WIDTH`. The operator chose the template reflow, which leaves every user's `set` output layout as it is.
- A CI guard for the shipped templates. The existing round-trip test already catches this, it only needs to stay green.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Modify | Split the `commitId` line into six lines |
| `.github/scripts/check-gate-inputs.sh`, `.github/scripts/tests/check-gate-inputs.test.sh` | Modify | Read the `/dev/null/.skilled-untrusted` hook-trust sentinel as a note, not an unread source root |
| `.skilled/commands/doctor/git.md`, `.skilled/skills/sk-git/README.md`, `README.md`, `.skilled/commands/doctor/scripts/README.md`, spec-kit `feature-catalog/doctor-commands/category-overview.md` | Modify | Clear the HVR hard blockers |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs`, its test, `doctor-git-presentation.txt`, playbook DOC-384 | Modify | The ai-tool-hooks check covers all six AI-tool adapters |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` and its test | Modify | The nine fixes from the fresh Opus review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shipped commit rules block round-trips through the serializer | `git-standards.test.cjs` "the shipped rules blocks round-trip" passes |
| REQ-002 | `set` changes only the edited line | `git-standards.test.cjs` "set changes only the edited line" passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The contract the hooks enforce is unchanged | The parsed JSON of the block is equal before and after, and `validate-message.mjs` accepts and refuses the same Commit-Id values |
| REQ-004 | `check-gate-inputs.sh` passes on main | The script prints `RESULT: PASSED`, and its own test suite gains a sentinel case |
| REQ-005 | The five docs carry no HVR hard blocker | `hvr_scan.py` reports 0 hard blockers for each |
| REQ-006 | The ai-tool-hooks check reports all six adapters | Tests cover a registered, a missing and a broken adapter |
| REQ-007 | DOC-384 has a real-runtime verdict | The scenario run is recorded with its evidence |
| REQ-008 | Every confirmed review finding is fixed | Each fix has a test that fails with the fix reverted |
| REQ-009 | The root README, the sk-git skill and its feature catalog and the playbook cross-reference name `/doctor:git setup` | `rg` over those files finds it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git-standards.test.cjs` passes 10 of 10.
- **SC-002**: `run-all.sh` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The reflow changes the parsed contract | High | Compare the parsed JSON before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the template reflow on 2026-10-15.
<!-- /ANCHOR:questions -->

---


