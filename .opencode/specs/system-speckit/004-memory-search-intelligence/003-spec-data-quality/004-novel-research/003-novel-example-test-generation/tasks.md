---
title: "Tasks: Novel GO Automatic Example and Test Generation From Specs [template:level_2/tasks.md]"
description: "Task breakdown for the additive human-approved example and test-stub generator, default-off, never a rewrite of requirement prose."
trigger_phrases:
  - "example generation tasks"
  - "test generation from specs tasks"
  - "additive adherence artifacts tasks"
  - "novel go floor bypass tasks"
  - "ears ac coverage consumer tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/004-novel-research/003-novel-example-test-generation"
    last_updated_at: "2026-07-04T17:12:07.329Z"
    last_updated_by: "plan-bench-agent"
    recent_action: "Mirrored GEN_COVERAGE benchmark and named test tasks"
    next_safe_action: "Hold for implementation, no task started"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/sweep/gen-examples-tests.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl"
      - ".opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Novel GO Automatic Example and Test Generation From Specs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

This phase is PLANNED and not yet built, so every task stays pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the fence-aware scan to lock the requirement-scan discipline the generator reuses (.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh)
- [ ] T002 Confirm the AC_COVERAGE registry entry shape so the generator flag registers default-off and not as a blocking rule (.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json)
- [ ] T003 [P] Decide the artifact landing shape, a new examples file under the spec folder or a marked EXAMPLES anchor, per open question one (spec.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the generator that reads the REQUIREMENTS anchor fence-aware and emits one proposed example or stub per requirement, each tagged with its REQ id and a pending-review marker, REQ-001 REQ-004 REQ-006 (.opencode/skills/system-spec-kit/scripts/sweep/gen-examples-tests.ts)
- [ ] T005 Make the generator dry-run by default and require an explicit confirm before any write so an unconfirmed run writes nothing, REQ-003 (.opencode/skills/system-spec-kit/scripts/sweep/gen-examples-tests.ts)
- [ ] T006 Make an empty or absent REQUIREMENTS anchor a clean no-op with a no-requirements notice and no artifact, REQ-005 (.opencode/skills/system-spec-kit/scripts/sweep/gen-examples-tests.ts)
- [ ] T007 Add the named EXAMPLES landing surface so the additive artifact has a documented home that never touches REQUIREMENTS prose, REQ-001 (.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl)
- [ ] T008 Document the generated test-stub linkage so a task row can reference its stub for the A7 gates, REQ-004 (.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl)
- [ ] T009 Register the generator flag default-off so an unset run is a verified no-op, REQ-002 (.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the generator on a Level 2 spec and confirm one example or stub per requirement with the source REQUIREMENTS prose byte-for-byte unchanged, REQ-001
- [ ] T011 Run the generator with no confirm and confirm nothing is written, then confirm and check the artifact lands, REQ-003
- [ ] T012 Run validate.sh strict flag-unset on a 005 sibling and confirm the same exit code and the same files as before, REQ-002
- [ ] T013 Benchmark GEN_COVERAGE: run the generator over the planted fixture and assert un-covered-requirement count 0, fenced-decoy false-positives 0 and REQUIREMENTS-prose bytes-changed 0, SPECIFIED-not-run, REQ-001 REQ-004 (.opencode/skills/system-spec-kit/scripts/tests/fixtures)
- [ ] T014 Author the named test pinning per-REQ coverage, REQUIREMENTS byte-identity, fence-decoy skip and the dry-run-writes-nothing gate, REQ-001 REQ-003 (.opencode/skills/system-spec-kit/scripts/tests/gen-examples-tests.vitest.ts)
- [ ] T015 Register SPECKIT_GEN_EXAMPLES in the flag ceiling so the default-off proof and the SPECKIT_GEN_EXAMPLES=false reversibility ride the shipped assertions, REQ-002 (.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
