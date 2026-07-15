---
title: "Tasks: mk-spec-memory MCP Server Rename"
description: "Task tracker for the spec-kit-memory → mk-spec-memory rename. All tasks closed."
trigger_phrases:
  - "017 tasks"
  - "mk-spec-memory tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename"
    last_updated_at: "2026-05-14T23:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks closed; smoke probe passed"
    next_safe_action: "validate + commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:bf2bdb232c1bac9388ee62ca1fd2b7ab762158bda279de04947ac3e1d3e77baf"
      session_id: "main-2026-05-14-mk-spec-memory-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: mk-spec-memory MCP Server Rename

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

- [x] T001 Move packet from 027/001 → 026/017 (`git mv`)
- [x] T002 Refresh description.json + graph-metadata.json for new location
- [x] T003 Build resource-map.md inventory (8 layers)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update Server({ name }) in `mcp_server/context-server.ts:894` → `'mk-spec-memory'`
- [x] T005 [P] Rename launcher binary `spec-kit-memory-launcher.cjs` → `mk-spec-memory-launcher.cjs`
- [x] T006 [P] Update launcher internal prefix + state file paths
- [x] T007 [P] Rename `.gemini/scripts/spec-kit-memory.sh` → `mk-spec-memory.sh`
- [x] T008 [P] Update 4 runtime configs (opencode/.claude/.codex/.gemini)
- [x] T009 [P] Rename state file `.spec-kit-memory-launcher.json` → `.mk-spec-memory-launcher.json`
- [x] T010 Operational sweep: `mcp__spec_kit_memory__` → `mcp__mk_spec_memory__` (61 files)
- [x] T011 Targeted server-name updates in ~14 operational docs
- [x] T012 Fix substrate harness + sandbox runner: selectClientForServer, dict keys, connection
- [x] T013 Rewrite shared-daemon-runner-helpers.vitest.ts for valid JS
- [x] T014 Update spec-folder-mutex.ts LOCK_ROOT prefix
- [x] T015 Rebuild dist (`npm run build`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Smoke probe: launcher starts with `[mk-spec-memory-launcher]` prefix
- [x] T017 JSON-RPC initialize returns `serverInfo.name = "mk-spec-memory"`
- [x] T018 JSON-RPC tools/list returns 41 tools including memory_context + memory_search
- [x] T019 Grep verify: 0 `mcp__spec_kit_memory__` in operational paths
- [x] T020 Grep verify: 90+ `mcp__spec_kit_memory__` preserved in `.opencode/specs/**/*.md`
- [x] T021 strict-validate on 017 packet (run before commit)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual smoke verification passed (launcher + JSON-RPC)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
