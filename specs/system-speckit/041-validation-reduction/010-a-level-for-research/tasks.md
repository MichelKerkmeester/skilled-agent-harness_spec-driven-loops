---
title: "Task Breakdown: A Level For Research"
description: "Measure, add, follow failures, apply, verify."
trigger_phrases:
  - "research level tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-validation-reduction/010-a-level-for-research"
    last_updated_at: "2026-08-30T12:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added a research level and taught every level enumeration about it"
    next_safe_action: "None outstanding for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: A Level For Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[x]` complete · `[ ]` open
- `T-0NN` setup · `T-1NN` implementation · `T-2NN` verification

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T-001 [P0] Separate phase parents from real gaps using the shipped detection contract rather than a heuristic. Evidence: 370 parents, 104 leaves; the shipped rule also accepts a child carrying description.json, and produced the same counts.
- [x] T-002 [P0] Measure the shapes of the 104. Evidence: 76 neither, 11 research/research.md, 8 review/ without a top-level report, 7 research/ without research.md, 2 review/review-report.md.
- [x] T-003 [P0] Establish that the 76 are not a contract gap. Evidence: 61 are Draft, Planned, or carry no status; only 4 claim done.
- [x] T-004 [P0] Confirm the level fixes the symptom before building it. Evidence: declaring the existing `review` level on a review-shaped packet cleared FILE_EXISTS.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Add `levels.research` to the manifest, modelled on `review`.
- [x] T-102 [P0] Accept the level in the SpecKitLevel type, both VALID_LEVELS sets, the SPECKIT_LEVEL marker regex, and the orchestrator's normalizer.
- [x] T-103 [P0] Accept it in the spec-doc structure module's second normalizer, found by a throw the first fix did not prevent.
- [x] T-104 [P0] Accept it in the shell helper's normalizer, found by an unresolved-contract error.
- [x] T-105 [P0] Teach the shell LEVEL_MATCH rule the non-numeric levels. Evidence: its twelve patterns matched `[123]\+?` only, so `phase`, `review` and `research` were all unknown to it.
- [x] T-106 [P0] Correct the contract after measuring: research.md returns to lazy-addon status so it is not shape-graded.
- [x] T-107 [P1] Declare the level on the packets whose shape it describes and regenerate their metadata.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] The contract resolves. Evidence: the helper returns `spec.md` for research and `spec.md review/review-report.md` for review.
- [x] T-202 [P0] Research-shaped packets pass. Evidence: 11 of 11, after three needed a template-source header.
- [x] T-203 [P0] Review-shaped packets pass. Evidence: 2 of 2.
- [x] T-204 [P0] No regression. Evidence: pinned sample 277 to 281 of 300, 0 regressed.
- [x] T-205 [P0] The gate is green. Evidence: test:validation exit 0.
- [x] T-206 [P1] A folder that is not a packet was left failing rather than relabelled. Evidence: `advisor-state-containment` breaks the folder-naming convention, and that finding is the correct one.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- A research or audit packet can declare what it is, and the rules agree with
  the manifest about which levels exist.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 through REQ-004
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
