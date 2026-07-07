---
title: "Tasks: System Code Graph Import Path Cleanup"
description: "Task ledger for the 033 mcp_server shared dist cleanup."
trigger_phrases:
  - "033 import path cleanup tasks"
  - "mcp_server orphan shared tasks"
  - "system-code-graph dist cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/013-code-graph-import-path-cleanup"
    last_updated_at: "2026-05-14T15:39:08Z"
    last_updated_by: "codex-gpt5.5-033"
    recent_action: "Completed dist cleanup tasks"
    next_safe_action: "Review implementation-summary for evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tsconfig.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-033-system-code-graph-import-path-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: System Code Graph Import Path Cleanup

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold Level 2 packet at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/033-system-code-graph-import-path-cleanup/`.
- [x] T002 Read `.opencode/skills/system-spec-kit/tsconfig.json`.
- [x] T003 Read `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json`.
- [x] T004 Read `.opencode/skills/system-spec-kit/shared/tsconfig.json`.
- [x] T005 Read `.opencode/skills/system-spec-kit/shared/package.json`.
- [x] T006 Confirm the orphan shared tree existed before the fix at `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/shared/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Remove the `@spec-kit/shared/*` source path alias from `mcp_server/tsconfig.json`.
- [x] T008 Add `../../shared` and `../../shared/**` to `mcp_server/tsconfig.json` excludes.
- [x] T009 Add `scripts/finalize-dist.mjs` to normalize clean build output.
- [x] T010 Update `mcp_server/package.json` build script to run the finalizer after `tsc --build`.
- [x] T011 Keep source files under `shared/` and `mcp_server/lib/` unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Move the existing `dist` aside into `/private/tmp/033-mcp-server-dist-*` because `rm -rf dist` was blocked by policy.
- [x] T013 Run `npm run build </dev/null` from `mcp_server`; exit code 0.
- [x] T014 Confirm `dist/system-spec-kit/shared` does not exist after build.
- [x] T015 Run `node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js --health-check </dev/null`; exit code 0.
- [x] T016 Run `npx vitest run tests/llama-cpp-token-budget.vitest.ts tests/governance-ephemeral-decouple.vitest.ts </dev/null`; exit code 0 with 6 passed and 1 skipped.
- [x] T017 Run strict validation for the 033 packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification Evidence**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
