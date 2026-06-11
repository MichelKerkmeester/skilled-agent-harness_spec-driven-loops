---
title: "Implementation Summary: Provenance Injection"
description: "Provenance tagging remediation decoupled default scan/ingest provenance from governed-ingest validation and threaded caller provenance through prediction-error update and reinforce mutations. Follow-on guard enforcement gaps are documented separately."
trigger_phrases:
  - "provenance injection summary"
  - "source_kind automated writers fixed"
  - "prediction error provenance fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/022-provenance-injection"
    last_updated_at: "2026-06-11T12:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented provenance tagging remediation and added focused regression tests."
    next_safe_action: "Record final tsc, suite, validation, and comment-hygiene results after they run."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "No automated production caller requiring `memory_update` provenance injection was found."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/027-xce-research-based-refinement/022-provenance-injection` |
| **Completed** | 2026-06-11 |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This remediation preserved the existing provenance helper and good write-path work while fixing review findings in governed ingest and prediction-error mutation paths.

### FIX 1: Governed-Ingest Decoupling

`memory_index_scan` and `memory_ingest_start` no longer inject default import provenance into `validateGovernedIngest`. They validate the caller-supplied arguments as-is, use `requiresGovernedIngest` to decide whether a normalized governance decision should be passed downstream, and keep ordinary scan/ingest calls ungoverned.

Default scan provenance continues to be derived by `indexMemoryFile` when origin is `scan`. Default async-ingest provenance is now supplied by the ingest worker at the `indexSingleFile` persistence call when no governed decision exists.

### FIX 2: Prediction-Error Provenance Threading

`memory_save` already builds caller-aware `writeProvenance`. That context now flows into `evaluateAndApplyPeDecision`, then into prediction-error update and reinforce helpers. `updateExistingMemory` applies it to appended update rows, and `reinforceExistingMemory` applies it to the reinforced existing row.

### FIX 3: `memory_update` Reachability

Grep verified that production `memory_update` is exposed as a public MCP tool and `vectorIndex.updateMemory` is used directly only in tests and the handler implementation. Internal provenance injection is already handled by `__provenanceContext` in `memory-crud-update.ts`; no reducer, feedback, or system-job production caller was found invoking `memory_update` or `vectorIndex.updateMemory` without provenance context. The human-facing default-human behavior remains correct.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | Validate raw scan args and pass governance only for explicit governed ingest. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Modified | Queue ungoverned jobs with `governance: null`. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Pass default async-ingest provenance to persistence for ungoverned jobs. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Pass caller `writeProvenance` into prediction-error orchestration. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts` | Modified | Forward caller provenance to update and reinforce helpers. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts` | Modified | Apply caller provenance to update and reinforce mutations. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts` | Modified | Add ungoverned scan regression test. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts` | Modified | Assert ungoverned ingest queues null governance. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/write-provenance.vitest.ts` | Created | Verify default scan/ingest row tagging. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/pe-gating-provenance.vitest.ts` | Created | Verify PE update/reinforce row provenance. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration-provenance.vitest.ts` | Created | Verify PE orchestration passes provenance through. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/022-provenance-injection/*` | Created | Document phase scope, plan, checklist, tasks, metadata, summary, and follow-ons. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The remediation was delivered as surgical MCP write-path edits plus focused temp/in-memory regression tests. No schema migration, live shard mutation, host daemon operation, or rollout flag was required.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep default scan/ingest provenance out of governed validation input. | Default import provenance is a tagging concern and must not imply governed ingest. |
| Use `requiresGovernedIngest` to decide whether to pass a governance decision. | This preserves explicit governed behavior while making ungoverned paths stay ungoverned. |
| Add persistence-only provenance support to `indexSingleFile`. | Async ingest needs default tagging at the worker write site without expanding job governance semantics. |
| Pass real caller provenance into prediction-error update/reinforce. | Automated save callers should be classified as agent/system/feedback/import, not human. |
| Document guard-coverage gaps as follow-ons. | This phase is tagging only; guard enforcement expansion is a separate, higher-risk phase. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New/modified provenance regression tests | PASS, exit 0, 5 files passed, 18 tests passed, 28 skipped. |
| `npx tsc --noEmit` from `.opencode/skills/system-spec-kit/mcp_server` | PASS, exit 0 (rerun at epic review close, 2026-06-11). |
| Requested provenance/guard vitest suite | PASS: 5 files, 18 tests passed, 28 env-gated skips (rerun at epic review close). |
| `validate.sh --strict` for this phase | PASS: 0 errors, 0 warnings (rerun at epic review close). |
| Changed-code comment-hygiene check | PASS: enforced by the pre-commit hygiene gate on the phase commit. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Ungoverned scan/ingest do not fail from default provenance | New handler tests cover ungoverned paths | Pass |
| NFR-R02 | PE mutations persist caller provenance | PE row-level tests cover update and reinforce | Pass |
| NFR-S01 | Automated PE callers are non-human | Tests assert `agent` and `system` classifications | Pass |
| NFR-S02 | No live shard or host daemon touched | Tests use in-memory/temp fixtures and mocks | Pass |
| NFR-M01 | Public MCP schemas preserved | No schema changes made | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Same-path retire guard coverage remains follow-on work.** Same-path save/reindex can retire a manual predecessor without a protected-source check. This phase tags provenance but does not extend guard enforcement.
2. **Auto-promotion guard coverage remains follow-on work.** Automated tier promotion can still update `importance_tier` without a source-kind protection check. This phase documents the P0-class follow-on and preserves behavior.
3. **`memory_update` remains human-facing by default.** This is intentional after reachability verification; automated callers must continue using internal provenance context if they ever reach the handler.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Fix only handlers named in review | Also touched `context-server.ts` | Async ingest default provenance is applied at the worker persistence site, which is where ungoverned ingest rows are actually written. |
| Docs list did not explicitly mention `checklist.md` | Added `checklist.md` | Level 2 strict validation requires a checklist. |
<!-- /ANCHOR:deviations -->
