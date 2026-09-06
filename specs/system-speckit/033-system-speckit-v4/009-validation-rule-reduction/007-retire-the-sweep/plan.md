---
title: "Implementation Plan: A Gate That Can Actually Block"
description: "Prove the resolution rule against real diffs, prove the gate both blocks and passes, then retire the cron."
trigger_phrases:
  - "retire the sweep plan"
  - "changed packet gate plan"
  - "packet resolution rule"
  - "nearest ancestor spec"
  - "gate blocks and passes"
  - "cron retired after proven"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/007-retire-the-sweep"
    last_updated_at: "2026-08-30T08:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added a changed-packet pull-request gate and deleted the weekly sweep workflow"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".github/workflows/changed-packet-validation.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A Gate That Can Actually Block

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Write the packet-resolution rule, test it against real commit ranges, confirm
the resulting gate passes on healthy work and blocks on a broken packet, and
only then remove the cron it replaces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Resolution is replayed against real diffs, not reasoned about.
- The gate is demonstrated in both directions before it is committed.
- The cron is removed only after its replacement is proven.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

A packet is the nearest ancestor of a changed file that owns a `spec.md`. That
rule is the whole design: it maps an arbitrary changed path — a nested research
log, a metadata file, a child document — onto the folder the validator accepts,
and it naturally yields both a parent and a child when a change touched both.

The run is `--no-recursive`, so a phase parent is graded on its own documents
rather than on children the pull request never opened. A changed child resolves
to itself and appears in the list independently.

The verdict is read from an explicit `RESULT: PASSED` line rather than from an
exit code. A stale compiled orchestrator makes the validator refuse to run and
emit no rule output at all, and an exit-code check reads that silence as
success — which is the specific way the job being replaced reported green while
checking nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Resolution

Write the rule and replay it over real ranges. One commit resolved to the single
child it touched; an eight-commit range resolved 129 changed files to 15 distinct
packets, including parents and children where both had changed.

### Phase 2: Both directions

Run the gate's logic over those 15 packets: all pass, so the gate would not have
blocked recent real work. Then run it over a packet known to fail from the
phase 6 sample: it blocks. A gate only proven in one direction is not proven.

### Phase 3: Retire the cron

Delete the sweep workflow and its index row, add the new workflow to the index,
and confirm the sweep script's own tests still pass, since the script is kept.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The workflow cannot be executed locally, so each part it depends on was tested
directly: the YAML parses and exposes the expected trigger and steps, the
embedded shell parses under `bash -n`, the resolution rule was replayed against
git history, and the pass and block behaviours were reproduced by running the
same validate invocation the workflow issues.

The dependency-install block is carried over unchanged from the workflow being
deleted, including its comments, because that block encodes two failures already
paid for: installing a workspace directly fails for want of a lockfile, and
installing only the scripts workspace leaves every TypeScript rule erroring.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1, which made warnings advisory. Against the previous verdict rule a
  changed-packet gate would have blocked most pull requests.
- Phase 3, which made a fresh scaffold pass, so creating a packet does not
  immediately fail the gate.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting the commit restores the sweep workflow and removes the new one. The
new check is additive and no other job depends on it, so deleting the workflow
file is sufficient to disable it without touching anything else.
<!-- /ANCHOR:rollback -->
