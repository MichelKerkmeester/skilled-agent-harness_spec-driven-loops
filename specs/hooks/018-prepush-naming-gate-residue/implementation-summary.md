---
title: "Implementation Summary: Remove the deleted pre-push naming gate's residue"
description: "What the two failures actually were, the residue the deleted gate left across nine surfaces, and how each was verified after removal."
trigger_phrases:
  - "prepush residue summary"
  - "gate:naming dead branch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/018-prepush-naming-gate-residue"
    last_updated_at: "2026-09-10T12:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Removed the residue and verified both suites"
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
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Remove the deleted pre-push naming gate's residue

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:status -->
## 1. STATUS

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Suites** | pre-push 19 passed 0 failed, pre-commit 8 passed 0 failed |
<!-- /ANCHOR:status -->

---

<!-- ANCHOR:diagnosis -->
## 2. THE DIAGNOSIS

The pre-push naming grammar gate was deleted on 2026-08-31, deliberately, on the reasoning that it never refused a push the permission gate would have allowed. The code went. Nothing that described it did.

Two test cases failed because they asserted the deleted fail-open path. That was the loud part. Four quieter consequences mattered more:

- Neighbouring cases passed for the wrong reason. They assert that a branch is rejected, and it still is, but by the permission gate rather than the gate their names credit.
- Two cases drove `SPECKIT_SKIP_PREPUSH_NAMING`, a variable nothing reads.
- `git-sync.sh` and `git-primary-reconcile.sh` both classified a `[gate:naming]` string the hook emits zero times, and told the operator to retry with that dead variable.
- `[gate:remote-create]`, which the hook does emit when it blocks a creation, had no classifier branch at all, so that operator fell through to the default advice and was told to repeat the push that had just been refused.

The last of those is the only one a user would have hit, and it is the reason this went past a test fix.
<!-- /ANCHOR:diagnosis -->

---

<!-- ANCHOR:wrong-turn -->
## 3. THE FIRST ANSWER WAS WRONG

A permission-gate change in late August had made a bare approval unable to create a branch, and it migrated three of five call sites that combined that approval with a creation. The two it missed sit in the same block as the failures, which made it a convincing producer.

Patching them cleared one failure and produced a different one in the same run. A fix that moves a failure rather than removing it is evidence the diagnosis is at the wrong level, so the patch was reverted and the search moved up to what the hook still contains. It does not contain `is_valid_branch`, `is_wrapper_branch` or the bypass variable, which is where the real answer was.
<!-- /ANCHOR:wrong-turn -->

---

## 4. WHAT CHANGED

| Surface | Change |
|---|---|
| `pre-push.test.sh` | The owner-discovery block and the two dead-flag cases removed. Five case names relabelled to credit the gate that actually rejects them. 22 cases to 19, all passing |
| Playbook scenarios | Six `prepush-*` files deleted, one written for the surviving gate |
| Playbook index | Six scenario blocks and six coverage rows replaced by one each, two range references updated |
| Feature catalog | The two-gate section rewritten for one gate, the dead-gate document deleted, its inbound link repointed |
| `git-sync.sh`, `git-primary-reconcile.sh` | The unreachable `[gate:naming]` branch replaced with `[gate:remote-create]` and the approval form that works |
| `install-git-hooks.sh`, `.env.example`, two READMEs, the policy reference | Dead flag removed, pre-push descriptions corrected to the two gates that exist |

Deleting six scenarios would have left the surviving gate with no operator coverage, so one replacement covers what the removed six were reaching for: a creation refused by default, a blanket approval that still cannot create, a named approval that can, and the release lane and allowlist passing with nothing set.

---

## 5. VERIFICATION

- Both hook suites pass. The pre-push suite passes with no case asserting removed behavior, which is the distinction that matters here, since it passed at 20 of 22 before this work by counting two false passes.
- A repository grep for `SPECKIT_SKIP_PREPUSH_NAMING` across live files returns one hit, the sentence in the policy reference recording that it is gone.
- No document links any of the seven deleted files.
- `bash -n` clean on all three edited shell scripts, and the new scenario and the rewritten index both validate.

One thing left alone on purpose: `worktree-naming.sh` keeps `is_valid_branch`, because the allocator and its own test suite still call it. Only the hook stopped.
