---
title: "Tasks: 101/007 Council Infrastructure Hardening"
description: "Task list for the six-gap closure dispatched to cli-codex."
trigger_phrases:
  - "101/007 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/007-council-infrastructure-hardening"
    last_updated_at: "2026-05-11T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task breakdown"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-007-infrastructure-hardening"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/007 Council Infrastructure Hardening

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

- [x] T001 Scope all six gaps with file paths
- [x] T002 Scaffold packet 007 spec docs
- [x] T003 Identify reference patterns (system-spec-kit/feature_catalog, npm scripts, vitest format)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Gap #1: Add `test:council` npm script + standalone runner + CONTRIBUTING.md
- [x] T011 Gap #2: Author 32 feature catalog entries across 9 category folders
- [x] T012 Gap #2: Update root playbook §17 to reference real catalog paths
- [x] T013 Gap #3: Author reverse-anchor integrity vitest
- [x] T014 Gap #4: Author DAC-025 replay helper script + update DAC-025 scenario file
- [x] T015 Gap #5: Broaden Codex TOML parity assertions
- [x] T016 Gap #6: Add normalization provenance comments to DAC-030/032 fixtures
- [x] T017 cli-codex runs `npm run test:council` and confirms green
- [x] T018 Main agent: update parent 101 spec.md + graph-metadata.json
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run new anchor-integrity vitest standalone
- [x] T031 Run full 9-file council vitest batch
- [x] T032 Smoke test runner script + npm script
- [x] T033 Smoke test replay helper `--help`
- [x] T034 Verify §17 catalog rows have 0 "No feature catalog exists yet" hits
- [x] T035 Run sk-doc validators
- [x] T036 Strict spec validation on 007 + parent 101
- [x] T037 Author real implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements REQ-001..REQ-009 verified with evidence
- [x] Full 9-file council vitest matrix passes
- [x] Strict spec validation 0/0 on 007 + parent 101
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../006-council-graph-value-scenario-automation/`
<!-- /ANCHOR:cross-refs -->
