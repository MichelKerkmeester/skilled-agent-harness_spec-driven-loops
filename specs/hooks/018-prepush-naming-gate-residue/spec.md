---
title: "Feature Specification: Remove the deleted pre-push naming gate's residue"
description: "The pre-push naming grammar gate was deleted on purpose in August, but its test cases, six playbook scenarios, a feature-catalog document, a bypass flag and two live advice branches stayed behind, so the suite was red and the tooling told operators to use a flag that does nothing."
trigger_phrases:
  - "pre-push naming gate residue"
  - "SPECKIT_SKIP_PREPUSH_NAMING dead flag"
  - "pre-push test failures"
  - "gate:naming unreachable"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/018-prepush-naming-gate-residue"
    last_updated_at: "2026-09-10T12:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Traced the two failures to a deleted gate and removed its residue"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-prepush-residue"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove the deleted pre-push naming gate's residue

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "investigate fails" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`pre-push.test.sh` failed two of twenty-two cases. The cause was not in the test. A commit on 2026-08-31 deleted the pre-push naming grammar gate deliberately, reasoning that it never refused a push the permission gate would have allowed, and removed the code without the things that described it. The two failures were the only loud part. The rest was quiet and worse: neighbouring cases passed because the permission gate returned the same exit code for a different reason, six playbook scenarios and a feature-catalog document described a gate that cannot run, and two live scripts classified a `[gate:naming]` string the hook emits zero times and told the operator to retry with `SPECKIT_SKIP_PREPUSH_NAMING=1`, a variable nothing reads. The gate the hook does emit on a blocked creation, `[gate:remote-create]`, had no branch at all, so that operator got the default advice instead of the fix.

### Purpose
The suite passes for the right reasons, no document describes a gate that was removed, and an operator whose push is blocked is told what actually unblocks it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The four `pre-push.test.sh` cases that drove the deleted gate, and the labels on the cases that now pass through the permission gate
- The six `owner-first-worktree-tooling/prepush-*` scenarios and the `pre-push-naming-enforcement.md` catalog document
- One replacement scenario, so the surviving gate keeps operator coverage rather than losing it with the ones removed
- The dead `SPECKIT_SKIP_PREPUSH_NAMING` flag wherever it is advertised, and the two dead `[gate:naming]` classifier branches
- The playbook index, its coverage matrix, the feature catalog, the policy reference and the two hook READMEs

### Out of Scope
- `worktree-naming.sh` and its `is_valid_branch` function, which the allocator and its own tests still use. Only the hook stopped calling it
- Reinstating the gate. Its removal was a decision, and this packet follows it rather than reopening it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | Modify | Remove the dead cases, relabel the rest |
| `.opencode/skills/sk-git/manual-testing-playbook/**` | Delete, Create, Modify | Six scenarios out, one in, index and matrix updated |
| `.opencode/skills/sk-git/feature-catalog/**` | Delete, Modify | Dead-gate document out, section rewritten |
| `.opencode/bin/git-sync.sh`, `.opencode/bin/git-primary-reconcile.sh` | Modify | Dead classifier branch replaced with the reachable one |
| `.opencode/scripts/install-git-hooks.sh`, `.env.example`, two READMEs, the policy reference | Modify | Dead flag removed, gate descriptions corrected |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | `pre-push.test.sh` passes with no case asserting behavior the hook no longer has |
| REQ-002 | No live file advertises `SPECKIT_SKIP_PREPUSH_NAMING` except the sentence recording that it is gone |
| REQ-003 | A blocked creation classifies as `remote-create` and prints the approval form that works |
| REQ-004 | No document links a deleted scenario or catalog file |
| REQ-005 | The surviving permission gate has playbook coverage, so removing six scenarios is not a coverage regression |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both hook suites pass
- **SC-002**: A repository grep for the dead flag and the six deleted filenames returns only the removal note
<!-- /ANCHOR:success-criteria -->
