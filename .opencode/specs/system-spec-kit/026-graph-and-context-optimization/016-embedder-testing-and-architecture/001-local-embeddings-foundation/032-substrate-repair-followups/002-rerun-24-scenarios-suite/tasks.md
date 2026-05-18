---
title: "Tasks: rerun 24-- scenarios suite"
description: "Task list for the post-032 15-scenario local-LLM memory substrate rerun."
trigger_phrases:
  - "rerun 24 scenarios tasks"
  - "post 032 scenario runner tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/002-rerun-24-scenarios-suite"
    last_updated_at: "2026-05-14T11:55:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded blocked preflight tasks"
    next_safe_action: "Repair Memory MCP startup and provider connectivity, then rerun script"
    blockers:
      - "Missing zod-to-json-schema prevents spec_kit_memory MCP startup"
      - "opencode-go/kimi-k2.6 provider route failed from sandbox"
    key_files:
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000322"
      session_id: "002-rerun-24-scenarios-suite"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: rerun 24-- scenarios suite

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet `spec.md`.
- [x] T002 [P] Verify `opencode` is installed.
- [x] T003 [P] Verify provider credentials exist.
- [x] T004 [P] Inventory scenario files 401-415.
- [x] T005 Create evidence output directories.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Attempt `memory_health` through OpenCode.
- [x] T007 Probe `spec-kit-memory-launcher.cjs` directly after OpenCode MCP startup failed.
- [B] T008 Capture `memory_health` output. Blocked by missing `zod-to-json-schema`.
- [B] T009 Create sample preflight spec and call `memory_save`. Blocked because health gate failed first.
- [B] T010 Delete sample memory and remove preflight sandbox. Blocked because no sample memory was created.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Add runner script at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh`.
- [B] T012 Execute 15-scenario suite. Blocked by failed preflight and provider connection errors.
- [B] T013 Collect per-scenario logs. Blocked because scenarios were not run.
- [B] T014 Aggregate real verdict counts. Blocked; report records 15 SKIP due preflight.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Reporting

- [x] T015 Write blocked evidence report at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md`.
- [x] T016 Write Level-2 packet docs.
- [x] T017 Update `graph-metadata.json` derived status to `blocked`.
- [x] T018 Rerun packet validation after docs are written.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All scenarios attempted.
- [ ] PASS/PARTIAL count is at least 8.
- [x] Blocked preflight is documented with concrete evidence.
- [x] Packet status reflects blocked state rather than success.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Summary**: See `implementation-summary.md`.
- **Evidence**: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md`.
<!-- /ANCHOR:cross-refs -->
