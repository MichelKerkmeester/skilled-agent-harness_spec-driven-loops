---
title: "Resource Map — Phase 010 Coco-Memory Context Extras"
description: "File inventory for Phase 010: per-child scope. Bundles RQ-A4 (coco) + RQ-B2 (memory) presentation features. ~25 files."
trigger_phrases:
  - "027 phase 010 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-coco-memory-context-extras"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored per-child resource map"
    next_safe_action: "Update on file changes"
    blockers: []
    key_files: ["resource-map.md"]
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Per-child resource map for Phase 010. Pt-03 aggregate map at `../research/027-xce-research-pt-03/resource-map.md`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 25
- **By category**: READMEs=3, Documents=3, Specs=8, Scripts=18, Tests=8, Config=2
- **Missing on disk**: 0
- **Scope**: Per-child — files Phase 010 reads, modifies, creates, or cites across 5 sub-phases (bundles RQ-A4 + RQ-B2).
- **Generated**: 2026-05-09T11:00:00Z
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/SKILL.md` | Updated | OK | Document exemplar feature + opt-out (REQ-005, T028) |
| `.opencode/skills/system-spec-kit/SKILL.md` | Updated | OK | Document curator feature + opt-out (REQ-018, T028) |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Cited | OK | Server context |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/research.md` | Cited | OK | Pt-03 §§RQ-A4, RQ-B2 |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-004.md` | Cited | OK | RQ-A4 findings (6 findings) |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-007.md` | Cited | OK | RQ-B2 findings (6 findings) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `010-coco-memory-context-extras/spec.md` | Created | OK | This packet |
| `010-coco-memory-context-extras/plan.md` | Created | OK | This packet |
| `010-coco-memory-context-extras/tasks.md` | Created | OK | This packet (28 tasks) |
| `010-coco-memory-context-extras/checklist.md` | Created | OK | This packet (28 CHK items) |
| `010-coco-memory-context-extras/decision-record.md` | Created | OK | This packet (7 ADRs) |
| `010-coco-memory-context-extras/implementation-summary.md` | Created | OK | Placeholder |
| `010-coco-memory-context-extras/description.json` | Created | OK | Spec-folder metadata |
| `010-coco-memory-context-extras/graph-metadata.json` | Created | OK | Graph metadata |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

### RQ-A4 — Coco Exemplars (Sub-Phases 1-2)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/example_bank.py` | Created | PLANNED | Capture + maintenance helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/example_bank_schema.py` | Created | PLANNED | `coco_query_examples_vec` schema + migration |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplar_lookup.py` | Created | PLANNED | KNN + reconciliation |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Updated | OK | Sub-Phase 2 — exemplar response group integration (after line 317-323) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Updated | OK | Sub-Phase 2 — register `ccc_examples_clear` MCP tool (lines 141-150) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Updated | OK | Sub-Phase 1 + 2 — possibly extend ccc_feedback shape; add exemplars field to query response |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py` | Cited | OK | CodeChunk + QueryResult shape context |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Cited | OK | code_chunks_vec mount context (verifies separation) |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/ccc-feedback.ts` | Updated | OK | Sub-Phase 1 — capture trigger on helpful/partial ratings |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Updated | OK | Sub-Phase 1 — possibly extend cccFeedbackSchema (lines 611-616) |

### RQ-B2 — Memory Curator (Sub-Phases 3-4)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context-curator.ts` | Created | PLANNED | Sub-Phase 3 — integration seam + deterministic fallback |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/context-curator-prompt.ts` | Created | PLANNED | Sub-Phase 4 — LLM prompt template + schema |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Updated | OK | Sub-Phase 3+5 — wire curator hook + telemetry |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Updated | OK | Sub-Phase 3 — budget split (lines 900-950) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-cache.ts` | Updated | OK | Sub-Phase 4 — mode: 'context_curation' keying (lines 21-27) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts` | Cited | OK | Stage 4 immutability binding (lines 6-19, 128-317) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts` | Cited | OK | LLM call + cache + fail-open precedent (lines 321-371) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/profile-formatters.ts` | Cited | OK | Deterministic profiles baseline (lines 4-21, 73-119) |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/tests/test_example_bank.py` | Created | PLANNED | Sub-Phase 1 — capture + reconciliation |
| `.opencode/skills/mcp-coco-index/tests/test_exemplar_reconciliation.py` | Created | PLANNED | Sub-Phase 2 — stale reconciliation (3 conditions) |
| `.opencode/skills/mcp-coco-index/tests/test_examples_clear.py` | Created | PLANNED | Sub-Phase 2 — maintenance op |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/budget-split.vitest.ts` | Created | PLANNED | Sub-Phase 3 — budget split |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/context-curator.vitest.ts` | Created | PLANNED | Sub-Phase 4 — curator integration |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/curator-fallback.vitest.ts` | Created | PLANNED | Sub-Phase 4 — deterministic fallback |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/curator-schema-validation.vitest.ts` | Created | PLANNED | Sub-Phase 4 — strict JSON validation |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Document `SPECKIT_COCOINDEX_EXEMPLARS_*` + `SPECKIT_CONTEXT_CURATOR_*` flag families (REQ-009, REQ-017) |
| `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl` | Cited | OK | Read-only audit input for exemplar capture trigger |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:author-notes -->
## Author Notes

- **Per-child scope** — pt-03 aggregate at `../research/027-xce-research-pt-03/resource-map.md`.
- **Bundles two features** — RQ-A4 (Sub-Phases 1-2) and RQ-B2 (Sub-Phases 3-4) share governance pattern + Phase-005 gate.
- **Categories omitted (zero entries)**: Commands, Agents, Skills, Meta. New `ccc_examples_clear` is a MCP tool surface but registered via existing `server.py`; not a standalone command-surface file.
- **PLANNED entries** become OK during implementation per sub-phase.
- **Cross-language coordination** — coco side is Python; memory side is TypeScript. No shared modules; only ccc_feedback schema extension touches both sides.
- **ADR-002 open question** — extend `ccc_feedback` schema vs new `ccc_example_positive` writer; resolution documented in commit message during Sub-Phase 1.
<!-- /ANCHOR:author-notes -->
