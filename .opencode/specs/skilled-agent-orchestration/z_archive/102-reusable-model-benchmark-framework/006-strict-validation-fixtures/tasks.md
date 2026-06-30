---
title: "Tasks: Strict-validation fixtures — boolean validators + v3 capability profile"
description: "Task Format: T### [P?] Description (file path) — mapped 1:1 to REQ-001..004 / SC-001..004"
trigger_phrases:
  - "strict validation fixtures tasks"
  - "boolean validator benchmark tasks"
  - "v3 capability profile tasks"
  - "adversarial invalid fixtures tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/006-strict-validation-fixtures"
    last_updated_at: "2026-06-02T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete; ref 1.0 / lax <1.0 verified, suite 158 green"
    next_safe_action: "Hand back; real benchmark run out of scope"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-127-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Strict-validation fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write reference + lax impls for ipv4/date/semver (throwaway /tmp harness) [20m] — REQ-002
- [x] T002 Confirm each VALID input → true, each INVALID input → false under the reference [10m] — REQ-002
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Oracle generation + validation
- [x] T003 Generate oracle booleans from the reference impl over the spec input lists; split visible/hidden (≥26 cases, ≥60% invalid) (harness) [20m] — REQ-001
- [x] T004 Score reference + lax through the real `code-task-scorer.cjs`; assert ref=1.0, lax<1.0 (`lib/code-task-scorer.cjs`, consumed) [20m] — REQ-002, SC-002

### Fixture + profile assets
- [x] T005 [P] Write `validate-ipv4.json` (`benchmark-fixtures/validate-ipv4.json`) [10m] — REQ-001, SC-001
- [x] T006 [P] Write `validate-date.json` (`benchmark-fixtures/validate-date.json`) [10m] — REQ-001, SC-001
- [x] T007 [P] Write `validate-semver.json` (`benchmark-fixtures/validate-semver.json`) [10m] — REQ-001, SC-001
- [x] T008 Create `capability-m3-vs-mimo-v3.json` (4 fixtures, n=5, both models, gate 1.0, groupBy model); validate `{valid:true,errors:[]}` (`benchmark-profiles/capability-m3-vs-mimo-v3.json`) [20m] — REQ-003, SC-003
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Extend vitest: validation-pack shape coverage (3 fixtures, ≥26 cases, ≥60% invalid, boolean expect) + v3 profile loads (`tests/sweep-isolation.vitest.ts`) [25m] — REQ-004, SC-004
- [x] T010 Run `npx vitest run model-benchmark/tests/`; report green count (158) [10m] — REQ-004, SC-004
- [x] T011 Run `validate.sh --strict` on this folder; clean up /tmp harness [10m] — REQ-004, SC-004
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Reference oracles score 1.0, lax impls score <1.0 through the real scorer
- [x] v3 profile validates `{valid:true,errors:[]}`
- [x] Vitest suite green (158, exit 0)
- [x] checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
