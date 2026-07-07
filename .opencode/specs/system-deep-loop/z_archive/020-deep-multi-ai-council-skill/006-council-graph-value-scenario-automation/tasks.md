---
title: "Tasks: 101/006 Council Graph Value-Scenario Automation"
description: "Task list for fixture-driven vitest + operator seeder dispatched to cli-codex."
trigger_phrases:
  - "101/006 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-deep-multi-ai-council-skill/006-council-graph-value-scenario-automation"
    last_updated_at: "2026-05-11T09:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented fixture-driven council graph value scenarios and verification"
    next_safe_action: "Review final diff and commit if desired"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-006-value-scenario-automation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/006 Council Graph Value-Scenario Automation

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Approve scope with user
- [x] T002 Scaffold packet 006 folder + spec docs
- [x] T003 Confirm codex CLI flags (`-c reasoning_effort='high'`, `-c service_tier='fast'`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 cli-codex authors `mcp_server/tests/fixtures/council-value/seed-helpers.ts`
- [x] T011 cli-codex authors per-scenario fixtures `dac-{027..032}.ts`
- [x] T012 cli-codex authors `mcp_server/tests/council-graph-value-scenarios.vitest.ts`
- [x] T013 cli-codex authors `scripts/seed-council-value-fixture.cjs` operator CLI
- [x] T014 cli-codex updates 6 playbook scenario files with automated-anchor line
- [x] T015 cli-codex updates root playbook §16 cross-ref row
- [x] T016 cli-codex runs `npx vitest run tests/council-graph-value-scenarios.vitest.ts` and confirms 6/6 pass
- [x] T017 Parent 101 spec.md + graph-metadata.json include phase 006
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run new vitest standalone
- [x] T031 Run full 8-file council vitest batch
- [x] T032 Smoke test `seed-council-value-fixture.cjs`
- [x] T033 Run sk-doc validators
- [x] T034 Strict spec validation on 006 + parent 101
- [x] T035 Author implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 6/6 new vitest tests pass
- [x] Full 8-file council vitest matrix passes
- [x] Strict spec validation 0/0 on 006 and parent
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../005-deep-ai-council-fixups-and-graph-value-scenarios/`
<!-- /ANCHOR:cross-refs -->
