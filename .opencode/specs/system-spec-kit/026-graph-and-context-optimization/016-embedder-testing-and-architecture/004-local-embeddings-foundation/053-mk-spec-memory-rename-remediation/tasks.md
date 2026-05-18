---
title: "Tasks: Remediate 052 Deep-Review Findings"
description: "Task list for closing the 052 mk-spec-memory rename review findings in packet 053."
trigger_phrases:
  - "053 remediation tasks"
  - "052 findings tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/053-mk-spec-memory-rename-remediation"
    last_updated_at: "2026-05-15T05:59:52Z"
    last_updated_by: "main_agent"
    recent_action: "Tracked remediation tasks"
    next_safe_action: "Complete validation and commit tasks"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:86bf49bec84fa5fc12e7b121d154467b5d864090c0a6788ff4ec61ce80c6992d"
      session_id: "main-2026-05-15-053-remediation-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Remediate 052 Deep-Review Findings

<!-- SPECKIT_LEVEL: 1 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create 053 remediation packet directory.
- [x] T002 Read target command/config files before editing.
- [x] T003 Read 052 packet docs and review registry before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fix `/doctor` frontmatter namespace ownership (`.opencode/commands/doctor.md`).
- [x] T005 Fix skill-advisor route MCP tools (`.opencode/commands/doctor/_routes.yaml`).
- [x] T006 Fix CCC command examples and allowlist (`.opencode/commands/memory/manage.md`).
- [x] T007 Align VS Code MCP config to launcher (`.vscode/mcp.json`).
- [x] T008 Rewrite 052 plan from scaffold (`../052-mk-spec-memory-rename/plan.md`).
- [x] T009 Refresh 052 spec metadata and old-prefix acceptance language (`../052-mk-spec-memory-rename/spec.md`).
- [x] T010 Refresh 052 graph metadata (`../052-mk-spec-memory-rename/graph-metadata.json`).
- [x] T011 Reconcile 052 resource-map runtime surfaces and counts (`../052-mk-spec-memory-rename/resource-map.md`).
- [x] T012 Update 052 implementation-summary validation evidence (`../052-mk-spec-memory-rename/implementation-summary.md`).
- [x] T013 Mark findings registry resolved (`../052-mk-spec-memory-rename/review/deep-review-findings-registry.json`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run strict validation on 052.
- [x] T015 Run strict validation on 053.
- [x] T016 Run namespace leak grep.
- [x] T052 Verify replacement namespaces have non-zero hits.
- [x] T053 Stage explicit allowed files only and commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validation passed for 052 and 053.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source packet**: `../052-mk-spec-memory-rename/`
<!-- /ANCHOR:cross-refs -->
