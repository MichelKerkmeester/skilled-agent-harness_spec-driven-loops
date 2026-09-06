---
title: "Task Breakdown: A Gate That Can Actually Block"
description: "Resolution, both directions, then retire the cron."
trigger_phrases:
  - "retire the sweep tasks"
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
# Task Breakdown: A Gate That Can Actually Block

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P0] Read the workflow being replaced and record why it could not block. Evidence: cron-only trigger, cache-keyed baseline, and `continue-on-error` on the sweep step with the downstream job testing the recorded outcome rather than the packets.
- [x] T-002 [P1] Read a sibling pull-request workflow for house conventions. Evidence: `comment-hygiene.yml` uses `fetch-depth: 0` and drives off the base and head SHAs.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Write the packet-resolution rule: nearest ancestor of a changed file that owns a `spec.md`.
- [x] T-102 [P0] Write the workflow, reusing the dependency-install block from the deleted sweep along with the comments recording why it is shaped that way.
- [x] T-103 [P0] Require an explicit `RESULT: PASSED` line rather than trusting an exit code, so a validator that refuses to run fails the gate.
- [x] T-104 [P1] Delete `strict-pass-freshness-sweep.yml`, remove its index row, and add the new workflow to the index.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] Resolution replayed on one commit. Evidence: resolves to the single child packet touched, not its parent.
- [x] T-202 [P0] Resolution replayed on an eight-commit range. Evidence: 129 changed files under `specs/` resolve to 15 distinct packets, parents and children both.
- [x] T-203 [P0] The gate passes on real work. Evidence: 15 of 15 of those packets validate clean, so the gate would not have blocked the last eight commits.
- [x] T-204 [P0] Negative control. Evidence: run against `specs/cli-external-orchestration/029-cli-devin-revival`, a packet known to fail from the phase 6 sample, the gate blocks with `Errors: 1` and `RESULT: FAILED`.
- [x] T-205 [P1] The workflow is well formed. Evidence: YAML parses with the expected trigger, job and four steps; the embedded shell passes `bash -n`.
- [x] T-206 [P1] Keeping the sweep script did not break it. Evidence: `strict-pass-freshness.vitest.ts` and `validation-gate-hardening.vitest.ts` both pass.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- A pull request that breaks a packet it touched is blocked; one that touches
  only healthy packets is not; the weekly cron is gone.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 through REQ-004
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
