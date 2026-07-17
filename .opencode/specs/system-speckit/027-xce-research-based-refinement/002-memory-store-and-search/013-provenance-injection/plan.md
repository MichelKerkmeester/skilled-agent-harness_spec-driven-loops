---
title: "Implementation Plan: Provenance Injection"
description: "Plan for decoupling default scan/ingest provenance from governed-ingest validation while threading caller provenance through prediction-error update and reinforce mutations."
trigger_phrases:
  - "provenance injection plan"
  - "governed ingest decoupling plan"
  - "prediction error provenance plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection"
    last_updated_at: "2026-06-11T12:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Provenance plan and fixes recorded"
    next_safe_action: "Use tasks.md and implementation-summary.md for verification evidence."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Default import provenance belongs at the write persistence site, not the governed-ingest validation boundary."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Provenance Injection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Spec Kit MCP server handlers and Vitest |
| **Storage** | `better-sqlite3` interfaces with temp/in-memory test fixtures only |
| **Testing** | Targeted vitest files, provenance/guard suite, `npx tsc --noEmit`, strict spec validation |

### Overview
The implementation separates governance validation from provenance tagging. `validateGovernedIngest` receives only caller-supplied scope/provenance/retention fields. Default scan and ingest provenance is passed to the write persistence call so row metadata is still tagged without forcing governed mode. Prediction-error orchestration now receives the caller-aware `writeProvenance` built by `memory_save` and passes it into update and reinforce mutations.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Review findings mapped to concrete write-path files.
- [x] Good existing provenance work identified and preserved.
- [x] Live shard and host daemon restrictions understood.
- [x] `ENV_REFERENCE.md` excluded from scope.

### Definition of Done
- [x] Ungoverned scan and ingest no longer require tenant/session metadata.
- [x] Default scan and ingest provenance is applied at persistence time.
- [x] Prediction-error update and reinforce mutations receive caller provenance.
- [x] `memory_update` automated reachability finding is documented.
- [x] P0-class guard follow-ons are documented, not fixed.
- [x] Tests and docs are ready for strict verification.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small corrective write-path changes with explicit provenance handoff.

### Key Components
- **Governed-ingest validation**: Decides whether tenant/session/provenance enforcement is active.
- **Write provenance helper**: Derives `source_kind` and persists provenance metadata on rows.
- **Scan handler**: Discovers spec and constitutional files, then indexes them through `indexSingleFile`.
- **Async ingest worker**: Dequeues accepted files and indexes each path after validation.
- **Prediction-error orchestration**: Chooses create, update, reinforce, supersede, or linked-create behavior.
- **Prediction-error mutation helpers**: Mutate existing or appended rows.

### Data Flow
For scan and ingest, caller args enter validation exactly as supplied. If validation requires governance, the normalized decision is passed downstream. If validation does not require governance, downstream persistence receives default import provenance only as write metadata. For `memory_save`, the handler constructs `writeProvenance` from the real caller context, passes it to prediction-error orchestration, and update/reinforce helpers call `applyWriteProvenance` with that context.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-index.ts` | Scans spec documents and passes indexing options | Use `requiresGovernedIngest(args)` and `validateGovernedIngest(args)` without default provenance | Regression test asserts ungoverned scan has no governance option |
| `memory-ingest.ts` | Queues async ingest jobs | Queue `governance: null` for ungoverned jobs | Handler test asserts null governance |
| `context-server.ts` | Initializes async ingest worker | Pass default async-ingest provenance at `indexSingleFile` call when no governed decision exists | Source inspection and row-tagging helper test |
| `memory-save.ts` | Builds caller-aware write provenance | Pass `writeProvenance` into prediction-error orchestration | PE orchestration provenance test |
| `pe-orchestration.ts` | Applies PE decisions | Forward provenance to update and reinforce helpers | PE orchestration provenance test |
| `pe-gating.ts` | Performs update/reinforce mutations | Persist caller provenance on mutated rows | PE row-level provenance test |
| `memory-crud-update.ts` | Human-facing metadata update plus automated guard when internal context exists | No code change after reachability check | Grep evidence documented in implementation summary |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the review findings and target code sections.
- [x] Read governed-ingest validation and write-provenance helpers.
- [x] Read prediction-error orchestration and mutation helpers.
- [x] Read existing scan, ingest, provenance, and guard tests.

### Phase 2: Core Implementation
- [x] Move default scan provenance out of governed validation input.
- [x] Move default async-ingest provenance out of governed validation input.
- [x] Preserve explicit governed-ingest behavior for caller-supplied provenance/scope.
- [x] Add persistence-only provenance support to `indexSingleFile` options.
- [x] Pass default async-ingest provenance from the worker to persistence.
- [x] Pass caller write provenance into prediction-error orchestration.
- [x] Persist caller provenance on prediction-error update and reinforce mutations.

### Phase 3: Verification
- [x] Add and run new targeted provenance regression tests.
- [x] Verify `memory_update` automated reachability by grep.
- [x] Create Level 2 phase documentation.
- [x] Run final TypeScript, requested test suite, strict spec validation, and comment-hygiene checks. Evidence: tsc 0; provenance/guard vitest 18 pass / 28 env-skips; `validate.sh --strict` 0/0; comment hygiene clean (see implementation-summary.md + review/review-report.md).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Ungoverned scan and ingest governance behavior | Vitest handler tests |
| Row metadata | Default scan/ingest provenance tagging | In-memory `write-provenance` vitest |
| Prediction-error provenance | Update and reinforce caller provenance | In-memory PE vitests |
| Guard regression | Existing memory-update constitutional guard | Existing vitest suite |
| Type safety | MCP server TypeScript project | `npx tsc --noEmit` |
| Documentation | Level 2 phase docs | `validate.sh --strict` |
| Comment hygiene | Changed code files | `check-comment-hygiene.sh` and grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `requiresGovernedIngest` | Internal | Green | Needed to distinguish explicit governed callers from default provenance tagging. |
| `WriteProvenanceContext` | Internal | Green | Shared context type for scan, ingest, save, and prediction-error paths. |
| `applyWriteProvenance` | Internal | Green | Persists `source_kind` and provenance metadata. |
| Existing Vitest harnesses | Internal | Green | Enables temp/in-memory verification without live shards. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript, targeted tests, strict spec validation, or comment hygiene fails and cannot be repaired within this scoped change.
- **Procedure**: Revert the provenance threading edits in scan, ingest, context-server, memory-save, pe-orchestration, and pe-gating files; remove the added tests and 022 phase docs.
- **Data Reversal**: None. Tests use temp/in-memory fixtures only, and no live shard is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Review Findings -> Code Reads -> Targeted Fixes -> Regression Tests -> Final Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Code Reads | Review findings | Targeted fixes |
| Targeted Fixes | Code reads | Regression tests |
| Regression Tests | Targeted fixes | Final verification |
| Final Verification | Regression tests and docs | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Code reads and reachability check | Medium | Completed in-session |
| Core implementation | Medium | Completed in-session |
| Regression tests | Medium | Completed in-session |
| Documentation and final validation | Medium | Completed in-session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist
- [x] No live database shard modified.
- [x] No host daemon touched.
- [x] `ENV_REFERENCE.md` left out of scope.

### Rollback Procedure
1. Revert only the files listed in the scope table.
2. Re-run the targeted tests that failed.
3. Re-run strict spec validation if documentation files are changed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not needed; tests use temp/in-memory fixtures only.
<!-- /ANCHOR:enhanced-rollback -->
