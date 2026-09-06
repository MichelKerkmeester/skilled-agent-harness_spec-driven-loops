---
title: "Task Breakdown: Stop Grading Prose Against A Moving Target"
description: "Trace, replace, converge to zero regressions, clean the references."
trigger_phrases:
  - "stop grading prose shape"
  - "template conformance removed"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/004-stop-grading-prose-shape"
    last_updated_at: "2026-08-29T20:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Replaced template-shape grading with anchor integrity"
    next_safe_action: "Packet phases complete; merge to the release branches"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-041-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Stop Grading Prose Against A Moving Target

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

- [x] T-001 [P0] Measure what still blocks packets. Evidence: anchors and headings led by a wide margin; metadata rules had nearly vanished after warnings stopped blocking, so the phase planned next was dropped in favour of this one.
- [x] T-002 [P0] Trace what reads anchors before touching them. Evidence: merge, chunking and search metadata all read them, so deletion was the wrong instinct.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T-101 [P0] Replace anchor template-matching with anchor integrity: unique ids, matched pairs, present where a template defines them.
- [x] T-102 [P0] Remove heading-shape grading, which nothing machine-readable consumes.
- [x] T-103 [P1] Remove the section-count rule, which duplicated heading grading with an arbitrary numeric floor.
- [x] T-104 [P1] Delete three rule scripts no code path could reach, and mark the surviving anchor rule as implemented natively rather than pointing at a file that no longer exists.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T-201 [P0] Pin a fixed sample. The previous approach rebuilt its sample per run and drifted, producing a reading of 160 regressions that was an artifact and had to be discarded.
- [x] T-202 [P0] Converge to zero regressions. Three separate over-reaches were found and narrowed: requiring anchors in documents with no template, in templates that define none, and in phase parents that were always exempt.
- [x] T-203 [P0] Final measurement. Evidence: 74.0% to 79.0% on an identical 300-packet set, 15 recovered, 0 regressions.
- [x] T-204 [P1] Clean every reference. Evidence: the full chained validation suite runs green — 114, 39 and 106 cases.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- A template edit no longer regrades the corpus, and anchors still satisfy the code that reads them.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — requirements REQ-001 … REQ-004
- `plan.md` — approach and rollback

<!-- /ANCHOR:cross-refs -->
