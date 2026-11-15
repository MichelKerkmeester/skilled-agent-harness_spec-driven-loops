---
title: "Feature Specification: Phase 4: Commit-Id in every toolchain repo"
description: "Since the 2026-10-02 trust gate, the stamper skipped every clone it did not trust, and nothing checked that an id was there. 52 Barter commits and three whole public repositories went out with no Commit-Id."
trigger_phrases:
  - "commit id in every toolchain repo"
  - "phase 4 commit id in every toolchain repo"
  - "commit id policy"
  - "skilled.commitId"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: Commit-Id in every toolchain repo

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-13 |
| **Branch** | `main` (operator chose the current branch) |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-hook-docs-and-standards-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every hook suite passes, and each new case fails against the previous hooks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the template-driven message enforcement packet.

**Scope Boundary**: the three global hooks that stamp and check `Commit-Id`, one shared helper they source, their tests and their READMEs.

**Dependencies**:
- The trust gate from phase 1 stays as it is. No repository code runs in an untrusted clone.

**Deliverables**:
- `lib/commit-id-policy.sh`, which decides which repositories carry an id
- A stamper that mints through the allocator beside the hooks when the repository's own is hidden or missing
- A commit-msg check and a pre-push gate that refuse a missing id

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The stamper minted ids only through the allocator in the repository's own toolchain. The trust gate added on 2026-10-02 hides that toolchain in every clone that does not share the hooks' git dir, so stamping stopped there without a word. Nothing else noticed, because the message contract checks an id's format and uniqueness but never that one exists. Barter shipped 52 commits without an id, and Product Owner, Prompt Improver and Media Editor never had one.

### Purpose
Every non-merge commit in a repository that uses sk-git carries a `Commit-Id`, and a commit without one cannot be made or pushed there.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One policy answer for which repositories carry ids, with a local opt-in and opt-out
- Stamping through the hooks' own allocator when the repository's is hidden or missing
- Stamping a continued revert and a squash commit, which git hands over as `merge` and `squash` sources
- A blocking check at commit time and at push time

### Out of Scope
- Backfilling ids into existing history - each backfill is a history rewrite the operator approves per repository
- Moneybird Accountant - its rulebook states it carries no Commit-Id, so covering it is the operator's decision
- CI enforcement - a push with `--no-verify` skips every hook, and CI lives per repository

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/lib/commit-id-policy.sh` | Create | Policy, own-allocator path and id test |
| `.skilled/scripts/git-hooks/prepare-commit-msg` | Modify | Mint for every covered repository, stamp continued reverts and squashes |
| `.skilled/scripts/git-hooks/commit-msg` | Modify | Refuse a covered message without an id |
| `.skilled/scripts/git-hooks/pre-push` | Modify | Gate 7 refuses pushed commits without an id |
| `.skilled/scripts/git-hooks/tests/*.test.sh` | Modify | Cases for each rule, fixtures for other gates exempted |
| `.skilled/scripts/git-hooks/README.md`, `lib/README.md`, `tests/README.md` | Modify | Describe the policy and the new gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A repository that ships the sk-git allocator or the toolchain sentinel is stamped whether or not it is trusted, and no code from it runs |
| REQ-002 | A repository whose last fifty commits carry ids is stamped, and local `skilled.commitId` true or false overrides the default |
| REQ-003 | commit-msg refuses a covered message without an id, a real merge excepted |
| REQ-004 | pre-push refuses any added non-merge commit without an id in a covered repository |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A continued revert and a squash commit are stamped, and only a real merge is left alone |
| REQ-006 | The hook READMEs describe the policy, the flag and the new gate |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ten hook and allocator suites pass, against a baseline of nine suites and 381 cases
- **SC-002**: Each new case fails against the hooks at HEAD and passes against the changed hooks
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The hooks run from the working tree, so every repository on the machine sees each saved edit | High | Each file was syntax-checked before the next edit, and the policy is inert until a hook sources it |
| Risk | A covered repository gets a new blocking gate on push | Med | The gate checks only commits a push adds, and `skilled.commitId false` exempts a repository |
| Risk | A hostile clone sets the flag | Low | Only local config counts, which a clone cannot carry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The history probe reads at most fifty commits, so a large repository that never adopted ids pays a bounded cost per commit
- **NFR-P02**: A repository covered by its toolchain never reaches the history probe

### Security
- **NFR-S01**: No script from the target repository runs unless the existing trust gate allows it
- **NFR-S02**: A command-scope `skilled.commitId` never opts a repository in or out

### Reliability
- **NFR-R01**: The stamper still never blocks a commit
- **NFR-R02**: A missing helper blocks commit-msg everywhere and pre-push where the toolchain ships
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty repository: the history probe has no HEAD and reports not covered
- A commit already carrying an id: kept, as before
- A pushed sha git does not hold: skipped, since git never offers one

### Error Scenarios
- Allocator failure: the stamper leaves the message alone and commit-msg refuses it with the reason
- Unreadable push range: pre-push blocks and names the failure

### State Transitions
- Continued revert after a conflict: source `merge` with no `MERGE_HEAD`, stamped
- Squash commit: source `squash`, stamped
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One new helper, three hooks, three suites, three READMEs |
| Risk | 18/25 | Machine-wide hooks, live on save |
| Research | 6/20 | git's source argument per commit kind, probed |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should Moneybird Accountant carry ids? Its rulebook would need a Commit-Id machine key first.
<!-- /ANCHOR:questions -->

---
