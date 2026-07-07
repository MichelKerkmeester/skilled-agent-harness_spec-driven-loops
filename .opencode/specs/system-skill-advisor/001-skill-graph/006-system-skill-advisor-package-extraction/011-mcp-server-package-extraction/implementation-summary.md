---
title: "Implementation Summary: Full MCP extraction D2a+D2b"
description: "D2a moved skill graph DB/query code and lifecycle ownership into system_skill_advisor; D2b verified hooks, schemas, topology, full tests, and parent continuity."
trigger_phrases:
  - "013/009/011 implementation"
  - "skill graph d2a summary"
importance_tier: "critical"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction"
    last_updated_at: "2026-05-14T20:05:00Z"
    last_updated_by: "codex"
    recent_action: "011 full extraction shipped (D2a+D2b)"
    next_safe_action: "Operator: 014 manual testing via cli-opencode"
    blockers: []
    key_files:
      - "decision-record.md"
      - "research/multi-ai-council-deliberation.md"
      - "implementation-summary.md"
      - "checklist.md"
      - "tasks.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `011-mcp-server-package-extraction` |
| **Completed** | D2a+D2b completed 2026-05-14 |
| **Level** | 3 |
| **Next Safe Action** | Operator: 014 manual testing via cli-opencode |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

D2a made the skill graph a real advisor-owned subsystem instead of an advisor tool surface backed by memory-server internals. The DB/query library moved into `system-skill-advisor`, advisor startup now initializes and watches the graph, and `spec_kit_memory` no longer writes that state at startup.

D2b closed the packet by verifying the adjacent `system-spec-kit` surfaces that consume advisor-owned code: prompt hooks, schema imports, session-bootstrap topology behavior, full advisor Vitest, memory package full-suite evidence, and parent continuity.

### Atomic Library Move

The three library files moved from `system-spec-kit/mcp_server/lib/skill-graph/` to `system-skill-advisor/mcp_server/lib/skill-graph/` with `git mv`. The moved DB module now resolves `skill-graph.sqlite` under the advisor package and uses advisor-local integrity and markdown helpers.

### Lifecycle Transfer

`advisor-server.ts` now initializes the skill graph DB, runs startup indexing, publishes advisor generation metadata, starts the existing daemon watcher with a 2 second debounce, and closes the daemon and DB on shutdown. `context-server.ts` no longer imports, initializes, scans, watches, publishes, or closes skill graph state.

### Boundary Cleanup

Advisor skill graph handlers, rebuild, daemon watcher, semantic lane, tools, and auth guard now use package-local skill graph or caller-context imports. The old empty `system-spec-kit/mcp_server/handlers/skill-graph/` directory is gone.

### D2b Verification And Close-Out

Spec-kit hook imports for Claude, Codex, and Gemini resolve `system-skill-advisor/mcp_server/lib/{skill-advisor-brief,render,metrics}.js` after the D2a move. This checkout has no `hooks/opencode/` directory under `system-spec-kit/mcp_server`, so no fourth hook file exists to verify.

Schema imports in `tool-input-schemas.ts` resolve `AdvisorToolInputSchemas`, `ADVISOR_RECOMMEND_PARAMETER_KEYS`, and `ADVISOR_VALIDATE_PARAMETER_KEYS` from the advisor package. TypeScript verified those sibling imports.

`session-bootstrap.ts` no longer reads a removed memory-side skill graph proxy. It still emits a `SkillGraphTopologySummary`, with the summary explicitly marking topology unavailable from memory because ownership now belongs to `system_skill_advisor`. Targeted session-bootstrap tests passed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was held uncommitted until the source move, import rewires, lifecycle transfer, grep gates, targeted tests, builds, and MCP smokes all had evidence. The compatibility shape is a clean cut, not a proxy period, matching the council verdict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `git mv` for `lib/skill-graph/` | Preserves history and matches council Q1. |
| Reuse advisor daemon watcher | It already owns debounce, serialization, and publication behavior. |
| Remove memory lifecycle in the same changeset | Prevents R1/R2 dual-writer and watcher races. |
| Mark completion at 100% after D2b | Hooks, schemas, topology, tests, and parent continuity are verified or explicitly classified. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` in advisor MCP | PASS |
| `npx tsc --noEmit` in memory MCP | PASS |
| Advisor targeted skill graph Vitest | PASS, 3 files and 6 tests |
| Advisor `npm run build` | PASS |
| Memory `npm run build` | PASS |
| Advisor MCP smoke | PASS, startup logged DB path, scan, daemon active; timeout ended process with SIGTERM |
| Memory MCP smoke | PASS, startup reached "Context MCP server running on stdio" with no skill graph init log |
| Grep: old advisor skill graph imports | PASS, zero matches |
| Grep: old spec-kit `lib/skill-graph` | PASS, old directory absent |
| Grep: old spec-kit handler orphan | PASS, old directory absent |
| Packet strict validation | PASS, 0 errors and 0 warnings |
| Hook import resolution | PASS for 3 present hook runtimes: Claude, Codex, Gemini. No OpenCode hook directory exists in this checkout. |
| Schema import resolution | PASS via file existence checks and memory MCP TypeScript. |
| Session-bootstrap topology | PASS; targeted `session-bootstrap` suites passed 3/3 and topology returns advisor-ownership unavailable state. |
| Advisor full Vitest | PASS, 40 files and 291 tests passed. |
| Memory full `npm test` | CORE RED BASELINE: `test:core` ran 670 files, 11,404 passed / 11,582 total tests, 95 failed, 83 skipped; `test:file-watcher` passed 21/21 when run separately because `npm test` stopped after core failure. D2b fixed the stale D2a-owned F-015 fixture and its targeted test passed. Remaining red areas are unrelated baseline surfaces: Copilot dist hooks, code-graph extraction leftovers, vector dimension mismatch, workflow vocabulary invariance, and similar non-011 failures. |
| Broader seam classification | 15 non-test `system-skill-advisor.*lib` matches: 13 legitimate sibling imports, 2 shared-concern candidates, 0 test seams in the non-test sweep. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No OpenCode hook file exists in this checkout.** The verified hook set is Claude, Codex, and Gemini.
2. **Memory full-suite baseline remains red.** The stale 011 fixture was fixed, but unrelated failures remain outside D2b scope.
3. **Two shared-concern seams remain classified for follow-up.** `lib/utils/sqlite-integrity.ts` re-exports advisor freshness integrity, and `lib/utils/skill-label-sanitizer.ts` re-exports advisor render sanitization. Both are candidates for future neutral `@spec-kit/shared` extraction, not D2b moves.

---

<!-- ANCHOR:req-verification -->
## Requirement Verification

| Requirement | Status | Evidence |
|-------------|--------|----------|
| REQ-001 Move skill graph library into advisor | GREEN | D2a commit `76317ed82`; old spec-kit lib path absent. |
| REQ-002 Advisor owns startup lifecycle | GREEN | `advisor-server.ts` initializes DB, scans, publishes generation, starts daemon, and closes DB. |
| REQ-003 Memory stops writing skill graph DB | GREEN | `context-server.ts` has no `publishSkillGraphGeneration` or skill graph DB init path. |
| REQ-004 Reverse skill graph imports are gone | GREEN | D2a grep gate zero; D2b TypeScript still passes. |
| REQ-005 Orphan handler directory deleted | GREEN | Old spec-kit handler directory absent. |
| REQ-006 Verification passes or is classified | GREEN | Advisor typecheck PASS, memory typecheck PASS, advisor full Vitest 291/291, memory full suite baseline-red classified. |
| REQ-007 Council decisions recorded | GREEN | ADR-001 through ADR-008 remain accepted in `decision-record.md`. |
| REQ-008 D2b handoff complete | GREEN | Packet closed at 100%; parent continuity updated for 011/012/013 and next safe action set to 014 manual testing. |
<!-- /ANCHOR:req-verification -->

---

<!-- ANCHOR:broader-seams -->
## Broader Seams Classification

| File | Classification | Disposition |
|------|----------------|-------------|
| `hooks/claude/user-prompt-submit.ts` | Legitimate sibling import | Keep: hook brief/render/metrics are advisor-owned. |
| `hooks/codex/user-prompt-submit.ts` | Legitimate sibling import | Keep. |
| `hooks/codex/prompt-wrapper.ts` | Legitimate sibling import | Keep. |
| `hooks/gemini/user-prompt-submit.ts` | Legitimate sibling import | Keep. |
| `stress_test/search-quality/harness.ts` | Legitimate sibling import | Keep: stress harness consumes advisor shadow types. |
| `vitest.config.ts` | Legitimate sibling test configuration | Keep: excludes advisor test surfaces from memory suite glob. |
| `lib/utils/sqlite-integrity.ts` | Shared concern candidate | Flag follow-up for neutral shared extraction. |
| `lib/utils/skill-label-sanitizer.ts` | Shared concern candidate | Flag follow-up for neutral shared extraction. |

Counts: `BROADER_SEAMS_TOTAL=15`, `BROADER_SEAMS_LEGITIMATE=13`, `BROADER_SEAMS_SHARED_FLAGGED=2`, `BROADER_SEAMS_TEST_SEAM=0`.
<!-- /ANCHOR:broader-seams -->
<!-- /ANCHOR:limitations -->
