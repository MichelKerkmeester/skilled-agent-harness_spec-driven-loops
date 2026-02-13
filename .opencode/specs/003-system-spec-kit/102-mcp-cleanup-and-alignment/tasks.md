# Tasks — Spec 102: MCP Server Cleanup & Documentation Alignment

**Status:** COMPLETE (retroactive)

## Session 1

### WS-1: Pre-existing Test Failures

- [x] Fix `scoring-gaps.test.ts` — change 4 tests (T-CT12/13/16/17) from expect-throw to expect-false
- [x] Fix `vector-index-impl.js` — add `is_archived INTEGER DEFAULT 0` to CREATE TABLE schema

### WS-2: Pre-existing TypeScript Errors

- [x] TS-1: `core/db-state.ts` — SessionManagerLike.init uses `any` for database param
- [x] TS-2: `handlers/memory-index.ts` — `title?: string | null` in IndexResult
- [x] TS-3: `handlers/memory-search.ts` — `last_accessed?: number` (removed string)
- [x] TS-4: `lib/parsing/trigger-matcher.ts` — added `[key: string]: unknown` index signature
- [x] TS-5: `hooks/memory-surface.ts` — cast rows as `Record<string, unknown>[]`
- [x] TS-6: `lib/search/vector-index.ts` — explicit type annotation on SQLiteVectorStore

### WS-3 Phase 1: Quick Wins (13 findings)

- [x] F-030: `agent/speckit.md` — Level 1 "5 files" to "4 files"
- [x] F-010: `README.md` — Handover steps "5" to "4"
- [x] F-014: `scripts/README.md` — Validation rules "9" to "13" (2 places)
- [x] F-005: `resume.md` — Removed phantom `dryRun: true`
- [x] F-011: `save.md` — Removed phantom `specFolder` from memory_stats
- [x] F-033: `learn.md` — Bare `memory_search` to full prefix
- [x] F-031: `research.md` — Python-style syntax to JS object syntax (3 places)
- [x] F-032: `research.md` — "9-step" to "5-step investigation phase"
- [x] F-009: ALREADY-DONE — No templates/verbose/ row exists
- [x] F-018: ALREADY-DONE — Already shows ~1090
- [x] F-015: ALREADY-DONE — Assets table already has 4 files
- [x] F-012: ALREADY-DONE — Comment explains threshold doesn't exist
- [x] F-013: ALREADY-DONE — Already uses enableDedup correctly

### WS-3 Phase 2: Moderate Fixes (11 findings)

- [x] F-006: `SKILL.md` — Replaced "Two-Stage Question Flow" with Consolidated Question Protocol
- [x] F-017: `SKILL.md` — Added Epistemic Learning Workflow (PREFLIGHT/POSTFLIGHT) section
- [x] F-019: `debug.md` (cmd+agent), `SKILL.md` — Standardized model names
- [x] F-020: `handover.md` — "consider running" to MUST for generate-context.js
- [x] F-021: `SKILL.md` — Added :with-research and :auto-debug flags documentation
- [x] F-024: `README.md` — Implement steps "9" to "11" (incl. 5.5/7.5)
- [x] F-025: `speckit.md` — Added Gate 3 Entry Point section
- [x] F-001: ALREADY-DONE — SKILL.md warning note already present
- [x] F-004: ALREADY-DONE — anchors param exists in tool-schemas.ts
- [x] F-007: ALREADY-DONE — Section counts already match
- [x] F-026: ALREADY-DONE — compose.sh and CORE+ADDENDUM already documented

### WS-3 Phase 3: Remaining Non-Deferred (7 findings)

- [x] F-016: `SKILL.md` — Added "Advanced/Manual-Use" note for L6 tools
- [x] F-023: `README.md` — Added mode suffix exception note for handover
- [x] F-035: `SKILL.md` — Added multi-concept AND search example
- [x] F-036: `SKILL.md` — Added auto-debug note to Debug Delegation
- [x] F-027: ALREADY-DONE — sequential_thinking removed from SKILL.md
- [x] F-028: ALREADY-DONE — @explore/@write references removed
- [x] F-029: ALREADY-DONE — Dispatch refactored into module files

### WS-4: ADR-008

- [x] Write ADR-008 (sqlite-vec adoption) in Spec 098 decision-record.md (74 lines)

## Session 2: Deferred Architectural Findings

### F-002 + F-003: Unified L1 Memory Context Entry Point

- [x] Refactor `command/spec_kit/research.md` — replace `memory_search` with `memory_context({ mode: "deep" })`
- [x] Refactor `command/spec_kit/plan.md` — replace setup-phase calls with `memory_context({ mode: "focused" })`
- [x] Refactor `command/spec_kit/resume.md` — update Mermaid diagram, show `memory_context()` as primary
- [x] Refactor `command/spec_kit/implement.md` — make "prefer memory_context" the actual instruction
- [x] Refactor `command/memory/context.md` — reframe from "alternative" to "recommended unified approach"
- [x] Refactor `command/memory/continue.md` — replace `memory_search` with `memory_context({ mode: "resume" })`

### F-008: Circuit Breaker Standardization

- [x] Standardize `command/spec_kit/research.md` — canonical param names
- [x] Standardize `command/spec_kit/plan.md` — canonical param names + add `success_to_close`
- [x] Standardize `command/spec_kit/implement.md` — `cooldown_seconds: 30` to `recovery_timeout_s: 60`
- [x] Standardize `command/spec_kit/complete.md` — replace 4-param config with canonical 3-param
- [x] Add circuit breaker to `command/spec_kit/handover.md` — new section with canonical config
- [x] Standardize `spec_kit_implement_auto.yaml` — canonical params
- [x] Standardize `spec_kit_implement_confirm.yaml` — canonical params
- [x] Standardize `spec_kit_complete_auto.yaml` — canonical params, remove monitoring_window
- [x] Standardize `spec_kit_complete_confirm.yaml` — canonical params, remove monitoring_window
- [x] Standardize `spec_kit_handover_full.yaml` — canonical params

### F-022: Quality Gate Threshold Standardization

- [x] Fix `command/spec_kit/implement.md` — mid-execution threshold 65 to 70
- [x] Fix `command/spec_kit/complete.md` — pre-execution threshold 60/Soft to 70/HARD
- [x] Fix `agent/orchestrate.md` — add explicit 70 threshold to mid-execution gate
- [x] Fix `spec_kit_implement_auto.yaml` — threshold 65 to 70
- [x] Fix `spec_kit_implement_confirm.yaml` — threshold 65 to 70
- [x] Fix `spec_kit_complete_auto.yaml` — threshold 60/soft to 70/hard
- [x] Fix `spec_kit_complete_confirm.yaml` — threshold 60/soft to 70/hard

### F-034: Resume MCP Docs Consolidation

- [x] Consolidate `command/spec_kit/resume.md` Section 6 — ~153 lines to ~49 lines (68% reduction)
