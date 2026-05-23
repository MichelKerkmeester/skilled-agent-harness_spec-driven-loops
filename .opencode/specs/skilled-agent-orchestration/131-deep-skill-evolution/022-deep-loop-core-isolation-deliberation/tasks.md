---
title: "Tasks: Deep-Loop Core Script Isolation Deliberation"
description: "Task list for 117 AI Council deliberation packet."
trigger_phrases:
  - "deep-loop isolation tasks"
  - "117 deliberation tasks"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-deep-loop-core-isolation-deliberation"
    last_updated_at: "2026-05-22T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Begin Phase 2 seat dispatches"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:3373373373373373373373373373373373373373373373373373373373370000"
      session_id: "117-deep-loop-isolation-council"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-Loop Core Script Isolation Deliberation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet folder + spec.md Level 3
- [x] T002 Author plan.md Level 3
- [x] T003 Author tasks.md (this file)
- [x] T004 Author checklist.md Level 3 P0/P1/P2 items
- [x] T005 Author placeholder decision-record.md (ADR-001 stub)
- [x] T006 Author placeholder implementation-summary.md
- [x] T007 Create ai-council/ folder + config.json + strategy.md + empty state.jsonl
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Dispatch Seat A — Isolation Architect (cli-codex gpt-5.5 xhigh fast)
- [ ] T009 Dispatch Seat B — Status-Quo Defender (cli-codex gpt-5.5 xhigh fast)
- [ ] T010 Dispatch Seat C — Pragmatist (cli-codex gpt-5.5 high fast)
- [ ] T011 Dispatch Seat D — Adjudicator (cli-codex gpt-5.5 xhigh fast, with A/B/C as input)
- [ ] T012 Append round events to state.jsonl as seats return
- [ ] T013 Author deliberations/round-001.md (composition, comparison, agreements, disagreements, convergence decision)
- [ ] T014 Author council-report.md per output_schema.md (required sections)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Author decision-record.md ADR-001 (ruling, alternatives, 5-checks, migration outline if applicable)
- [ ] T016 Author implementation-summary.md with `## Commit Handoff` section
- [ ] T017 Refresh metadata fields in description.json + graph-metadata.json
- [ ] T018 Run validate.sh --strict — PASS Level 3, 0 errors, 0 warnings
- [ ] T019 Verify all 4 seat outputs have verdict line
- [ ] T020 Single commit on main with explicit-paths git add
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All seat outputs land under ai-council/seats/round-001/
- [ ] council-report.md compliant with output_schema.md
- [ ] decision-record.md ADR-001 with 5/5 PASS checks
- [ ] strict validate PASSED
- [ ] Single commit on main with packet-local scope only
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Council Strategy**: See `ai-council/ai-council-strategy.md`
<!-- /ANCHOR:cross-refs -->
