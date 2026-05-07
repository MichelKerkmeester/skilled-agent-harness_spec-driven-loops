---
title: "Tasks: Re-review of skilled-agent-orchestration 093-098"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "099 tasks track rereview"
  - "deep-review tasks 093-098"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/099-track-rereview"
    last_updated_at: "2026-05-07T19:05:00Z"
    last_updated_by: "deep-review-loop-manager"
    recent_action: "Tasks list authored"
    next_safe_action: "Run phase_init: scaffold review/ state files"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-099-2026-05-07T1905"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Re-review of skilled-agent-orchestration 093-098

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet at `.opencode/specs/skilled-agent-orchestration/099-track-rereview/`
- [x] T002 Create description.json + graph-metadata.json with track-prefixed paths
- [x] T003 Author spec.md / plan.md / tasks.md / checklist.md
- [x] T004 Run YAML phase_init steps to create `review/` directory + state files (config, JSONL, registry, strategy, dashboard placeholders)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Iteration 1 — closed-gate replay table for 097's 22 findings (RESOLVED/STILL_ACTIVE/NEW per finding)
- [ ] T006 Iteration 2 — correctness pass on 098/001 dist-rebuild + sed-mangled vitest regex repair
- [ ] T007 Iteration 3 — correctness pass on 098/002-007 (sk-deep token replace, narrative repair, hooks resolver, checklist evidence, advisor-python, p2 doc drift)
- [ ] T008 Iteration 4 — security pass on Stop hook env override + workflow-resolved spec_folder authority
- [ ] T009 Iteration 5 — traceability pass (smart-router validator now scans 16 plural skills; advisor state path plural; sk-deep-* dead refs replaced)
- [ ] T010 Iteration 6 — traceability resource-map cross-check (target_files vs resource-map across 098 sub-phases)
- [ ] T011 Iteration 7 — maintainability pass (doc anchors, dead refs in 098 narrative repair, memory_handback.md cross-CLI references)
- [ ] T012 Iteration 8 — re-pass on least-covered dimension based on running deltas
- [ ] T013 Iteration 9 — adversarial re-verification of any P0/P1 candidates (file:line evidence)
- [ ] T014 Iteration 10 — saturation iteration; promote STOP if all gates green
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Hydrate summary metrics from state.jsonl + findings registry
- [ ] T016 Build deduplicated finding registry across all iteration files
- [ ] T017 Run adversarial self-check on every active P0 and P1
- [ ] T018 Emit `review/resource-map.md` from converged deltas
- [ ] T019 Compile `review/review-report.md` with 9 sections + Planning Packet (verdict-flip confirmation explicit)
- [ ] T020 `git add` the artifact_dir for operator commit
- [ ] T021 `node generate-context.js` to route continuity into the right canonical doc
- [ ] T022 `memory_save` index of routed canonical doc for MCP visibility
- [ ] T023 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` to verify packet
- [ ] T024 Mark all checklist items `[x]` with evidence
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (excluding tasks blocked by FAIL/CONDITIONAL verdict triggering follow-on plan)
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict-validate passes; checklist.md fully marked
- [ ] review-report.md verdict surfaced; Planning Packet present; verdict-flip explicit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor (FAIL verdict)**: `.opencode/specs/skilled-agent-orchestration/097-track-review/review/review-report.md`
- **Remediation packet**: `.opencode/specs/skilled-agent-orchestration/098-097-remediation/`
- **Review report (post-synthesis)**: See `review/review-report.md`
- **Resource map (post-synthesis)**: See `review/resource-map.md`
<!-- /ANCHOR:cross-refs -->

---
