---
title: "Tasks: Re-review #2 of skilled-agent-orchestration 093-101"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "102 tasks track rereview 2"
  - "deep-review tasks 093-101"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview"
    last_updated_at: "2026-05-07T20:55:00Z"
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
      session_id: "deep-review-102-2026-05-07T2055"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Re-review #2 of skilled-agent-orchestration 093-101

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

- [x] T001 Scaffold packet at `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/`
- [x] T002 Run cli-opencode + deepseek-v4-pro pre-flight smoke test
- [x] T003 Author spec.md / plan.md / tasks.md / checklist.md
- [ ] T004 Create description.json + graph-metadata.json with track-prefixed paths
- [ ] T005 Run YAML phase_init steps to create `review/` directory + state files (config, JSONL, registry, strategy, dashboard placeholders)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Iteration 1 — closed-gate replay of 099's 13 P1 + 6 P2; 101 executor wiring inventory; cli-opencode smoke result narrative
- [ ] T011 Iteration 2 — correctness pass on 100 reducer delta-extraction fix (`reduce-state.cjs` extractFindingsFromDelta surface)
- [ ] T012 Iteration 3 — correctness pass on 101 executor-config (`executor-config.ts` EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'])
- [ ] T013 Iteration 4 — security pass on Stop hook env override + workflow-resolved spec_folder authority + opencode --dangerously-skip-permissions semantics
- [ ] T014 Iteration 5 — traceability pass: diff the 4 cli_opencode YAML branches (deep-research-{auto,confirm}, deep-review-{auto,confirm}) for parity
- [ ] T015 Iteration 6 — traceability pass: advisor aliases coverage + 100 sub-phase canonicalization + cross-references
- [ ] T016 Iteration 7 — maintainability pass (doc anchors, dead refs in 100 + 101, executor descriptions across runtimes)
- [ ] T017 Iteration 8 — re-pass on least-covered dimension based on running deltas
- [ ] T018 Iteration 9 — adversarial re-verification of any P0/P1 candidates (file:line evidence)
- [ ] T019 Iteration 10 — saturation iteration; promote STOP if all gates green
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Hydrate summary metrics from state.jsonl + findings registry
- [ ] T021 Build deduplicated finding registry across all iteration files
- [ ] T022 Run adversarial self-check on every active P0 and P1
- [ ] T023 Emit `review/resource-map.md` from converged deltas
- [ ] T024 Compile `review/review-report.md` with 9 sections + Planning Packet
- [ ] T025 `node generate-context.js` to route continuity into canonical doc
- [ ] T026 Refresh description.json + graph-metadata.json post-synthesis
- [ ] T027 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict`
- [ ] T028 Mark all checklist items `[x]` with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict-validate passes
- [ ] review-report.md verdict surfaced; Planning Packet present (§2); verdict-flip explicit (§1 + §9 closed-gate replay); cli-opencode smoke result documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor #1 (FAIL verdict)**: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/review-report.md`
- **Predecessor #2 (FAIL verdict)**: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/004-track-rereview/review/review-report.md`
- **Remediation packet (097)**: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/`
- **Remediation packet (099)**: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/005-remediation/`
- **Executor wiring packet**: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/006-cli-opencode-executor/`
- **Review report (post-synthesis)**: See `review/review-report.md`
- **Resource map (post-synthesis)**: See `review/resource-map.md`
<!-- /ANCHOR:cross-refs -->

---
