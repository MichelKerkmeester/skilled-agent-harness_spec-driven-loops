---
title: "Tasks: Remediation of the 016 Last-50-Commits Deep Review"
description: "Each actionable 016 finding as a completed remediation task with its file(s) and verification evidence, grouped by the four work streams plus the test round. Accept-no-action items are routed to decision-record.md ADRs."
trigger_phrases:
  - "016 remediation tasks"
  - "remediation task list per finding"
  - "shipped fixes with evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/017-last-50-commits-review-remediation"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Recorded each actionable finding as a completed task with evidence"
    next_safe_action: "Operator builds + deploys the dist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "last-50-commits-review-remediation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Remediation of the 016 Last-50-Commits Deep Review

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### [P?] Description (evidence)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the 016 actionable finding list and classify actionable vs accept-no-action (`016/review/review-report.md`)
- [x] T002 Partition into 4 parallel streams + a test round; sequence the shutdown keystone first (`plan.md` phase deps)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Stream 1 — Shutdown / lifecycle
- [x] T003 F-X19-02 + F-A4-02 keystone: unify the two divergent SIGTERM/SIGINT handler stacks into one ordered path with a deterministic exit code (`mcp_server/context-server.ts`, `lib/runtime/shutdown-hooks.ts`)
- [x] T004 F-A4-01: fence the ingest worker — add `stopWorker()`/`shuttingDown` guard + non-reopen DB accessor in job-queue; call it in `fatalShutdown` before `closeDb` (`lib/ops/job-queue.ts`, `mcp_server/context-server.ts`)

### Stream 2 — IPC / socket + launcher
- [x] T005 [P] F-A5-01: fresh-bind symlink reject + lstat-guarded `fchmod` (`shared/ipc/socket-server.ts` + code-graph fork, kept byte-identical)
- [x] T006 [P] F-A5-03: fail-closed canonicalize (`shared/ipc/socket-server.ts` + code-graph fork)
- [x] T007 [P] F-A4-03: re-entrant `startIpcSocketServer` guard (`shared/ipc/socket-server.ts`)
- [x] T008 [P] F-004: launcher lease fsync parity (`bin/mk-spec-memory-launcher.cjs`)

### Stream 3 — Validator + memory-write
- [x] T009 [P] F-A5-02: bound `collectKnownSessionIds` DFS with dir/depth/time caps (`lib/validation/orchestrator.ts`)
- [x] T010 [P] F-A2-01: enrichment skip-guard also skips `archived` (`handlers/memory-save.ts`)
- [x] T011 [P] F-A2-02: corrected entity-density doc comment (`lib/search/entity-density.ts`)
- [x] T012 [P] F-A2-03: tightened E089 `access denied:` substring (`handlers/save/response-builder.ts`)

### Stream 4 — Contract / config / docs
- [x] T013 [P] F-A7-01: embedder tools (`embedder_list/set/status`) added to `TOOL_LAYER_MAP` (`lib/architecture/layer-definitions.ts`)
- [x] T014 [P] F-A8-01: dangling `.gemini/agents` refs removed from `.claude/agents` + `.codex/agents` mirrors (`.claude/agents/{orchestrate,deep-review,prompt-improver}.md`+`README.txt`, `.codex/agents/{deep-review,prompt-improver}.toml`+`README.txt`)
- [x] T015 [P] F-A8-02: `_NOTE_HF_EMBED_SOCKET` + `_NOTE_TOTAL_MCP_BUDGET` added for parity (`.codex/config.toml`, `.devin/config.json`)
- [x] T016 [P] F-A9-01: P0 miscount 2 -> 1 (`015/review/review-report.md`, `changelog-000-015-docs-drift-review.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Test round
- [x] T017 F-X19-01: processLiveness drift guard — new `tests/lib/process-liveness-drift.vitest.ts`
- [x] T018 F-A4-01 + F-A5-01 validation: new `tests/ipc-socket-fresh-bind.vitest.ts` + job-queue.vitest.ts cases
- [x] T019 F-A6-01: auto-fix default OR-path integration test (`mcp_server/tests/**`)
- [x] T020 F-A6-02: 3-node contradiction-cycle test (`mcp_server/tests/**`)
- [x] T021 F-A6-03: de-no-op'd 7 guarded assertions + gitignored fixture dir (`mcp_server/tests/**`)
- [x] T022 F-X19-03: rollout-bucketing test (`mcp_server/tests/**`)

### Accept-no-action (recorded, no code change)
- [x] T023 Record F-002, F-A3-01, F-A3-02, F-CC-01, F-CC-P2-01/02 as deliberate decisions (`decision-record.md`)

### Verification gate
- [x] T024 `npx tsc --noEmit` exit 0, 0 errors in mcp_server, shared, code-graph
- [x] T025 Affected suites 1055 pass (0 fail); new/extended 154 pass; code-graph fork drift+toctou 3 pass; both socket-server copies byte-identical (`diff -q`)
- [x] T026 `verify_alignment_drift.py --root .opencode/skills/system-spec-kit` PASS (1510 files, 0 findings)
- [x] T027 Run `validate.sh <folder> --strict`; reconcile this packet's completion metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every actionable finding fixed with evidence; accept-no-action items recorded in `decision-record.md`
- [x] Deploy of the dist deferred to the operator (running daemon uses current dist)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Findings source**: `016-last-50-commits-deep-review/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
