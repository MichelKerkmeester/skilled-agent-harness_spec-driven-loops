---
title: "Tasks: Shallow evidence claims research"
description: "Task ledger for the evidence research round: replay five claims, reduce them to one criterion, and land it on the existing boundary row."
trigger_phrases:
  - "shallow evidence claims tasks"
  - "evidence boundary landing tasks"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/003-shallow-evidence-claims"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete: criterion landed, mirror and promotion recorded"
    next_safe_action: "Land the two shared-table promotions together"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Shallow evidence claims research

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T301 Collect the false confident claims from one session. — `5` claims diagnosed.
- [x] T302 Reproduce each claim with the receipt behind it. — each receipt re-read for what it actually showed.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T303 Extract the test that would have caught each claim. — reduced to one criterion: a false claim must have changed what the receipt showed.
- [x] T304 Name the recurring shapes. — a search that never hit, a read that stopped short, a total carried from another analysis, a match that never checked the two sides.
- [x] T305 Place the criterion on the boundary row. — row 1 of the four-standards table, with no new row and no new rule file.
- [x] T306 Record the tier mirror and the coordinated promotion. — the evidence rule's mirror, and the self-lens clause that lands in the same table.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T307 Apply the criterion to all five claims. — each one is caught by the counterfactual test.
- [x] T308 Confirm the shared region in the other two repositories. — re-checked line by line rather than trusted to the share.
- [x] T309 Record the sentinel finding as a finding, not a defect. — the completion sentinel mis-fires on read-only prose and stays advisory by design.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. — `9` of `9` tasks complete.
- [x] No blocked tasks remain. — `0` blocked tasks.
- [x] Manual verification passed. — the criterion, the shapes, and the promotion pair were read back from the iteration records.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decision record**: See `../decisions.md`.

<!-- /ANCHOR:cross-refs -->
