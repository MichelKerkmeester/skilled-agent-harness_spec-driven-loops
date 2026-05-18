---
title: "Tasks: 045 Shared Daemon Suite Runner"
description: "Task ledger for the direct MCP shared-daemon scenario runner."
trigger_phrases:
  - "045 tasks"
  - "shared daemon runner tasks"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner"
    last_updated_at: "2026-05-14T17:53:33Z"
    last_updated_by: "cli-codex-gpt-5-5-high"
    recent_action: "Wired second cocoindex_code MCP client; 403/404/407/410 PASS via shared daemon"
    next_safe_action: "Operator: optional full-suite run 401-415; operator: commit grouping"
    blockers: []
    key_files:
      - "tasks.md"
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000045"
      session_id: "046-shared-daemon-suite-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "CocoIndex execution is handled by a second shared StdioClientTransport to cocoindex_code, while memory scenarios stay on spec_kit_memory."
---
# Tasks: 045 Shared Daemon Suite Runner

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

- [x] T001 Scaffold Level 2 packet (`046-shared-daemon-suite-runner/`).
- [x] T002 Inspect 043 failure evidence (`../044-suite-revalidation/implementation-summary.md`).
- [x] T003 [P] Inspect memory launcher stdio binding (`.opencode/bin/spec-kit-memory-launcher.cjs`).
- [x] T004 [P] Inspect MCP SDK version and client API (`mcp_server/node_modules/@modelcontextprotocol/sdk`).
- [x] T005 [P] Inspect playbook scenarios 403 and 410.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create direct MCP runner (`_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs`).
- [x] T007 Implement playbook tool-call parser (`run-mcp-direct.mjs`).
- [x] T008 Implement generic MCP call execution and unavailable-tool SKIP behavior (`run-mcp-direct.mjs`).
- [x] T009 Implement scenario 410 latency workload and metrics (`run-mcp-direct.mjs`).
- [x] T010 Add capped daemon stderr evidence logging (`run-mcp-direct.mjs`).
- [x] T011 Add parser helper unit test (`mcp_server/tests/shared-daemon-runner-helpers.vitest.ts`).
- [x] T018 Wire second shared CocoIndex MCP client and per-server routing (`run-mcp-direct.mjs`). Evidence: scenarios 403/404/407 PASS through `cocoindex_code.search`.
- [x] T019 Add pure routing helper unit coverage (`shared-daemon-runner-helpers.vitest.ts`). Evidence: memory, CocoIndex, and unknown server cases pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run Node syntax check (`node --check run-mcp-direct.mjs`).
- [x] T013 Run helper unit test (`npx vitest run tests/shared-daemon-runner-helpers.vitest.ts`).
- [x] T014 Run smoke scenarios 403 and 410 (`node run-mcp-direct.mjs --scenarios 403,410`).
- [x] T015 Capture summary TSV (`run-2026-05-14-shared-daemon.summary.tsv`).
- [x] T016 Run strict packet validation (`validate.sh .../046-shared-daemon-suite-runner --strict`).
- [x] T017 Fill implementation summary with architecture, smoke result, run recipe, and limitations.
- [x] T020 Run shared Memory+CocoIndex smoke (`node run-mcp-direct.mjs --scenarios 403,404,407,410`). Evidence: 403 PASS, 404 PASS, 407 PASS, 410 PASS.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual smoke verification completed.
- [x] Shipped status documented for shared Memory and CocoIndex daemon routing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Dependency Packet**: See `../044-suite-revalidation/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
