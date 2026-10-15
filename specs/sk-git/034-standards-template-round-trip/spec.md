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

### Out of Scope
- Raising `INLINE_WIDTH`. The operator chose the template reflow, which leaves every user's `set` output layout as it is.
- A CI guard for the shipped templates. The existing round-trip test already catches this, it only needs to stay green.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/assets/commit-message-template.md` | Modify | Split the `commitId` line into six lines |
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


