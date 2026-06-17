---
title: "Tasks: terminal-control-and-integration-research"
description: "Task breakdown for the wave-1 read-only research fleet on driving Open Design from the terminal and de-vendoring sk-interface-design. All tasks complete; deliverable is research/research.md."
trigger_phrases:
  - "open design terminal research tasks"
  - "mcp-open-design research tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/001-terminal-control-and-integration-research"
    last_updated_at: "2026-06-14T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All research tasks complete"
    next_safe_action: "Operator reviews the recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-001-terminal-control-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: terminal-control-and-integration-research

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] Create the `001-terminal-control-and-integration-research` child + `research/` dir
- [x] Assign the three read-only seats (terminal surface, de-vendor, skill design plus cross-check)
- [x] Confirm the installed app path and bundled `daemon-cli.mjs` entry
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P] Run Seat A (claude2-opus): Open Design terminal control surface from bundled code
- [x] [P] Run Seat B (claude2-opus): sk-interface-design de-vendor, integration, licensing
- [x] [P] Run Seat C (gpt-5.5-fast): mcp-open-design skill design plus adversarial cross-check
- [x] Reconcile Seat A and Seat C on the terminal surface
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Ground-truth the live-observed transport and tool-tier facts
- [x] Restore the deleted license files to clean baseline (live defect found by Seat B)
- [x] Write canonical `research/research.md` with the prioritized recommendation
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Three seats executed read-only over local source
- [x] Recommendation cross-checks the seats and calls out divergences
- [x] Negative knowledge and a live-verification list recorded
- [x] No skill or app change made (research-only scope honored)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable: `research/research.md`
- Per-seat findings: `research/seats/{seat-a.findings.md,seat-b.findings.md,seat-c.out}`
- Parent: `../spec.md` (phase map)
<!-- /ANCHOR:cross-refs -->
