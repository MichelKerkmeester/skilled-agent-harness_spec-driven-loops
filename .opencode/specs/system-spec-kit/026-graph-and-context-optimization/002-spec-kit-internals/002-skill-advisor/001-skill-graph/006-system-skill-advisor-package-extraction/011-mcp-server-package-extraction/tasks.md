---
title: "Tasks: Full MCP extraction of skill graph library and lifecycle"
description: "D2a+D2b task list for atomic skill graph library move, lifecycle transfer, verification, and close-out."
trigger_phrases:
  - "013/009/011 tasks"
  - "skill graph lifecycle tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction"
    last_updated_at: "2026-05-14T20:05:00Z"
    last_updated_by: "codex"
    recent_action: "011 full extraction shipped (D2a+D2b)"
    next_safe_action: "Operator: 014 manual testing via cli-opencode"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Full MCP extraction of skill graph library and lifecycle

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Confirm branch is `main`.
- [x] T002 Confirm old spec-kit `lib/skill-graph/` exists and advisor target does not.
- [x] T003 Scaffold Level 3 packet 011.
- [x] T004 Promote `/tmp/cli-codex-dispatches/011-council-deliberation-out.log` to `research/multi-ai-council-deliberation.md`.
- [x] T005 Read council output, code-graph precedent, packet 008 analog, metadata sibling, source files, handler imports, freshness files, and tsconfigs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Move three skill graph library files with `git mv`.
- [x] T007 Rewire advisor skill graph handlers to package-local DB/query imports.
- [x] T008 Rewire advisor rebuild, daemon watcher, semantic lane, tools, and auth guard imports needed by moved library ownership.
- [x] T009 Add advisor-local caller context so skill graph dispatch no longer depends on the private spec-kit caller context.
- [x] T010 Update moved DB library to use advisor package-local `skill-graph.sqlite` path and advisor integrity/markdown helpers.
- [x] T011 Add advisor startup DB init, startup scan, generation publication, daemon watcher startup, and shutdown close.
- [x] T012 Remove skill graph DB init, startup scan, watcher startup, generation publication, and DB close from memory `context-server.ts`.
- [x] T013 Delete empty spec-kit handler orphan directory.
- [x] T014 Add packet ADRs for council Q1-Q7 and R1-R8 mitigation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run advisor typecheck.
- [x] T016 Run memory typecheck.
- [x] T017 Run targeted advisor skill graph Vitest.
- [x] T018 Run advisor build and memory build for fresh dist smokes.
- [x] T019 Run grep gates for old skill graph imports, old lib directory, and orphan directory.
- [x] T020 Run advisor MCP startup smoke.
- [x] T021 Run memory MCP startup smoke.
- [x] T022 Run strict validation for packet 011.
- [x] T023 Stage only D2a files and commit on `main`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: D2b Verification And Close-Out

- [x] T024 Verify spec-kit hook imports for present runtimes. Evidence: Claude, Codex, and Gemini hook imports resolve advisor `lib/` files; no OpenCode hook directory exists in this checkout.
- [x] T025 Verify schema imports from advisor package. Evidence: `tool-input-schemas.ts` imports resolve under TypeScript.
- [x] T026 Verify session-bootstrap topology after lifecycle move. Evidence: targeted `session-bootstrap` suites passed 3/3.
- [x] T027 Run advisor full Vitest. Evidence: 291/291 passing.
- [x] T028 Run memory full `npm test` and classify baseline. Evidence: core baseline-red 11,404/11,582; stale D2a F-015 fixture fixed; file-watcher leg passed 21/21 separately.
- [x] T029 Classify broader `system-skill-advisor.*lib` seams. Evidence: 15 total, 13 legitimate, 2 shared-candidate, 0 test seams.
- [x] T030 Update packet 011 implementation summary/checklist/tasks to 100%.
- [x] T031 Update parent 013/009 handover §9 and graph metadata for 011/012/013.
- [x] T032 Run strict validation for 011, 012, 013, parent 009, and lane 013.
- [x] T033 Commit D2b close-out on `main`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All D2a implementation tasks are complete.
- [x] All D2b verification and continuity tasks are complete.
- [x] No `[B]` blocked tasks remain.
- [x] Advisor owns the skill graph writer lifecycle.
- [x] Memory startup no longer writes or watches skill graph state.
- [x] Hook/schema/topology surfaces are verified after D2a.
- [x] Strict validation passed for the packet and required parents/siblings.
- [x] D2b commit complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Decisions**: See `decision-record.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
