---
title: "Tasks: 035 CocoIndex MCP Reliability"
description: "Task ledger for the CocoIndex MCP reliability diagnostic packet."
trigger_phrases:
  - "035 tasks"
  - "cocoindex mcp reliability tasks"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/035-cocoindex-mcp-reliability"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Completed diagnostic task ledger"
    next_safe_action: "Strict validate packet"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: 035 CocoIndex MCP Reliability

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

**Task Format**: `T### [P?] Description (file path or command)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm 035 packet path from user dispatch.
- [x] T002 Read root `AGENTS.md` and `system-spec-kit` instructions.
- [x] T003 Inspect sibling Level-2 packet structure.
- [x] T004 Create 035 packet directory.
- [x] T005 Create `description.json` and `graph-metadata.json`.
- [x] T006 Create Level-2 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 List CocoIndex MCP Python/TypeScript files.
- [x] T011 Inspect MCP server wrapper in `server.py`.
- [x] T012 Inspect CLI launcher path in `cli.py`.
- [x] T013 Inspect daemon client send/receive path in `client.py`.
- [x] T014 Inspect daemon request handler and dispatcher in `daemon.py`.
- [x] T015 Inspect msgspec protocol encode/decode helpers in `protocol.py`.
- [x] T016 Inspect query latency hot path in `query.py`.
- [x] T017 Search for timeout constants, `-32001`, and `Request timed out`.
- [x] T018 Search daemon logs and local scratch logs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Check `.opencode/bin` for a CocoIndex launcher.
- [x] T021 Identify actual launcher as `ccc mcp` / Python module path.
- [x] T022 Inspect active daemon pid/socket files.
- [x] T023 Attempt `ps` process pressure observation.
- [x] T024 Attempt `ccc status` as a lightweight baseline.
- [x] T025 Record sandbox blockers and partial reproduction status.
<!-- /ANCHOR:phase-3 -->

---

## Phase 4: Documentation and Validation

- [x] T030 Document failure modes, code path map, and candidate root causes in `spec.md`.
- [x] T031 Document diagnostic findings and recommended follow-up in `implementation-summary.md`.
- [x] T032 Mark known limitation that this packet does not fix the issue.
- [x] T033 Update checklist evidence.
- [x] T034 Run strict validation for the 035 packet.
- [x] T035 Emit required binding trace in final response.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Code path map documented with source references.
- [x] Local logs inspected.
- [x] Diagnostic status recorded as partial.
- [x] No source changes made.
- [x] Checklist items marked with evidence.
- [x] Strict validation result captured.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent**: `../spec.md`
- **Source**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`
<!-- /ANCHOR:cross-refs -->
