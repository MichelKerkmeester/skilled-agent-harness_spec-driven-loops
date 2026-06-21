---
title: "Tasks: validation and docs"
description: "Task record for the spec-150 live verification and 10-seat deep review: live-test the run direction, generate a real design, run 5 claude2-opus plus 5 gpt-5.5-fast seats, remediate all P0/P1 and the P2 backlog. All tasks complete, with evidence in research/ and review/review-report.md."
trigger_phrases:
  - "open design validation tasks"
  - "spec-150 deep review tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/004-validation-and-docs"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All live-test and review tasks complete and remediated"
    next_safe_action: "Operator runs the optional formal od mcp install opencode live-wire"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:44cf386586aa3e3911d853ff7bf5bc776807815e89bfc3a291ca80c5359aba74"
      session_id: "session-150-004-validation-and-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: validation and docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- `[P]` parallelizable
- Evidence in parentheses where applicable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Confirm the shipped skills (phases 002, 003) and the phase 001 research ground-truth are in place
- [x] Confirm the running Open Design app is available for the live test
- [x] Scope the 10 narrow review slices across both skills and the research packet
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Run the live generation test: `od run start` to the discovery question-form to `od ui respond` to build
- [x] Confirm `od artifacts create` only adds a file (no run, no render, no preview update)
- [x] Generate a real design end to end via the corrected flow ("Brackwater - Holy Island causeway crossing")
- [x] [P] Run the five claude2-opus judgment seats (SKILL.md accuracy, licensing, integration, research, coherence)
- [x] [P] Run the five gpt-5.5-fast mechanical seats (references, catalog/playbook x2, graph-metadata, links)
- [x] Remediate all 10 P0/P1 at-location and fix the P2 backlog, then record the three WONTFIX items with rationale
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py --check` PASS for mcp-open-design and sk-design-interface
- [x] `validate.sh --strict --recursive` on 150 green, with document validation clean on the affected indexes
- [x] Every fixed path re-resolved against its target on disk
- [x] Review report authored at `../review/review-report.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The run direction is live-verified: generation is multi-turn, `od artifacts create` only adds a file
- [x] A real design rendered via the corrected flow
- [x] All deep-review P0/P1 findings and the P2 backlog are remediated and re-validated
- [x] The shipped Apache-2.0-only license state was confirmed correct (no real license violation)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Research ground-truth: `../001-terminal-control-and-integration-research/research/`
- Deep-review report: `../review/review-report.md`
- Downstream correction: `../007-mcp-open-design-generation-flow-correction/` (applied the live findings to the skill)
- Parent: `../spec.md` (150 phase map)
<!-- /ANCHOR:cross-refs -->
