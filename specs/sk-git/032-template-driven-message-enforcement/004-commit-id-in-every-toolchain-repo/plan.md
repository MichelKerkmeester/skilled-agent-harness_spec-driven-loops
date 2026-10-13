---
title: "Implementation Plan: Phase 4: Commit-Id in every toolchain repo"
description: "One shared helper decides which repositories carry a Commit-Id. The stamper mints through the hooks' own allocator when the repository's is hidden, and commit-msg and pre-push refuse a missing id."
trigger_phrases:
  - "commit id in every toolchain repo plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: Commit-Id in every toolchain repo

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash git hooks |
| **Framework** | Global `core.hooksPath` hooks from this checkout |
| **Storage** | None. The allocator keeps its counter under the target's git dir |
| **Testing** | The bash suites in `.skilled/scripts/git-hooks/tests/` |

### Overview
`lib/commit-id-policy.sh` answers one question for all three hooks: does this repository carry ids. The stamper keeps a trusted toolchain's own allocator and otherwise uses the allocator beside the hooks, which only reads history. commit-msg and a new pre-push gate refuse a missing id, because the stamper is built never to block.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared sourced helper, as `lib/message-contract-gate.sh` already is for two of the same hooks.

### Key Components
- **`cip_repo_wants_ids`**: local flag first, then the shipped allocator or sentinel, then ids in the last fifty commits
- **`cip_own_allocator`**: the allocator path beside the hooks
- **Gate 7 in pre-push**: Gate 6's range, merges excluded

### Data Flow
prepare-commit-msg asks the policy, mints and appends the id. commit-msg asks again and refuses a message without one. pre-push asks once per push and lists every added commit without one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `prepare-commit-msg` | Mints the id | Update | `prepare-commit-msg.test.sh` 78/78 |
| `commit-msg` | Validates the contract | Update | `commit-msg.test.sh` 44/44 |
| `pre-push` | Re-checks pushed commits | Update | `pre-push.test.sh` 50/50 |
| `validate-message.mjs` contract | Format and uniqueness of an id | Unchanged | Presence is a hook rule, so repositories without a rulebook are covered too |
| `.skilled/hooks/git/` legacy hooks | Older per-repo install | Not a consumer | Holds no stamper |

Matrix axes: trust (trusted, untrusted), toolchain (allocator, sentinel only, none), history (ids, none), flag (true, false, unset, command scope), commit kind (normal, merge, continued revert, squash, cherry-pick).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each policy branch, through the real hook files | Bash suites |
| Integration | A real `git merge` and push range in a fixture repository | `pre-push.test.sh` |
| Manual | The policy answer for every repository under `~/MEGA/Development` | `cip_repo_wants_ids` sourced directly, no id minted |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `commit-id-naming.sh` | Internal | Green | No id can be minted |
| git `%(trailers)` format | External | Green | The probe and Gate 7 read trailers through it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a covered repository cannot commit or push for a reason other than a missing id
- **Procedure**: `git config --local skilled.commitId false` in that repository for an immediate exemption, or revert the phase's commit in this checkout
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 2 hours |
| Verification | Med | 1 hour |
| **Total** | | **3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes)
- [x] Feature flag configured
- [x] Monitoring alerts set

No data changes. The flag is `skilled.commitId`, and a refusal prints how to exempt the repository.

### Rollback Procedure
1. Exempt the affected repository with `git config --local skilled.commitId false`
2. Revert the phase's commit in this checkout, which the global hooks read on save
3. Rerun the hook suites to confirm the previous behavior
4. Tell the operator which repository was exempted

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
