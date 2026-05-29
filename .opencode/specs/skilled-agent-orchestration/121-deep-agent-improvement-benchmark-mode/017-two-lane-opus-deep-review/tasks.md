---
title: "Tasks: 017 two-lane Opus 4.8 deep review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "017 deep review tasks"
  - "two-lane opus review tasks"
  - "deep-review iteration tasks"
  - "post-015 review checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/017-two-lane-opus-deep-review"
    last_updated_at: "2026-05-29T13:38:56Z"
    last_updated_by: "deep-review-leaf"
    recent_action: "Scaffolded 017 packet + deep-review state config"
    next_safe_action: "Run deep-review iterations against the two-lane code"
    blockers: []
    key_files:
      - "review/deep-review-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-017-two-lane-opus-deep-review"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 017 two-lane Opus 4.8 deep review

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Create 017 phase child packet (spec/plan/tasks/impl-summary)
- [x] T002 Fill parent phase-map row + handoff + graph-metadata children_ids
- [x] T003 [P] Create review/ with iterations/ + deltas/ and write deep-review-config.json
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Correctness dimension pass over loop-host + reduce-state + scorers
- [ ] T005 Security dimension pass (path handling, env precedence, sanitize, dispatch default)
- [ ] T006 Confirm 015 remediation items hold (parseArgs, read-only default, cache keying, history, provenance)
- [ ] T007 Traceability + maintainability passes (SKILL.md, command docs, advisor explicit lane)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Claim adjudication on every new P0/P1
- [ ] T009 Convergence check + replay validation
- [ ] T010 Compile review-report.md with verdict; reconcile continuity metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] review-report.md issued with verdict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
