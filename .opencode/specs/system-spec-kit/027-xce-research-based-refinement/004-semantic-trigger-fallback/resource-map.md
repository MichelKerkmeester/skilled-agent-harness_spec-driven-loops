---
title: "Resource Map — Phase 004 Memory Semantic Triggers"
description: "File inventory for Phase 004: per-child scope. Spans memory backend handlers + semantic matcher + schema + cache + cognitive activation. ~22 files."
trigger_phrases:
  - "027 phase 004 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback"
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

Per-child resource map for Phase 004. Pt-03's aggregate map (`../research/027-xce-research-pt-03/resource-map.md`) covers full research scope; this file narrows to Phase 004's specific touch set.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 22
- **By category**: READMEs=2, Documents=3, Specs=8, Scripts=14, Tests=6, Config=2
- **Missing on disk**: 0
- **Scope**: Per-child — files Phase 004 reads, modifies, creates, or cites during scaffolding + Sub-Phases 1-4 implementation.
- **Generated**: 2026-05-09T11:00:00Z
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Cited | OK | Memory MCP routing context |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Cited | OK | Server context for handler integration |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/research.md` | Cited | OK | Pt-03 RQ-B1 verdict + adoption matrix |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-006.md` | Cited | OK | Iter-006 RQ-B1 findings (6 findings) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts` | Updated | OK | Schema migration documented in header (REQ-004) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `008-memory-semantic-triggers/spec.md` | Created | OK | This packet |
| `008-memory-semantic-triggers/plan.md` | Created | OK | This packet |
| `008-memory-semantic-triggers/tasks.md` | Created | OK | This packet |
| `008-memory-semantic-triggers/checklist.md` | Created | OK | This packet |
| `008-memory-semantic-triggers/decision-record.md` | Created | OK | This packet |
| `008-memory-semantic-triggers/implementation-summary.md` | Created | OK | Placeholder; filled post-impl |
| `008-memory-semantic-triggers/description.json` | Created | OK | Spec-folder metadata |
| `008-memory-semantic-triggers/graph-metadata.json` | Created | OK | Graph metadata |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` | Cited | OK | Lexical primary path; unchanged when flag off (REQ-001) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | Updated | OK | Sub-Phase 3: Stage 2 gate + UNION + activation guards (REQ-002, REQ-008) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/triggers/semantic-trigger-matcher.ts` | Created | PLANNED | Sub-Phase 2: cosine + threshold + margin + max gates |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Cited | OK | BLOB storage reuse; no changes (REQ-004) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` | Updated | OK | Sub-Phase 1: save-time backfill hook (REQ-006) |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Cited | OK | Embedding factory/auto-select; local-first, default Ollama `nomic-embed-text-v1.5` 768d (remote e.g. Voyage = fallback only) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embeddings/embeddings.ts` | Cited | OK | Embed timeout/circuit-breaker context |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-scan.ts` | Updated | OK | Sub-Phase 1: per-memory backfill loop (REQ-005, REQ-006) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts` | Updated | OK | Sub-Phase 1: ADD `memory_trigger_embeddings` table (REQ-004) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-summaries.ts` | Cited | OK | Cosine helper + BLOB-to-Float32 reuse (T006) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-store.ts` | Cited | OK | Vector store init reference |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts` | Cited | OK | HOT/WARM/COLD/DORMANT consumer of activation values (ADR-004) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts` | Cited | OK | Activation pipeline downstream |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts` | Cited | OK | Spreading activation downstream |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts` | Cited | OK | Semantic broadening precedent (ADR-002 supporting evidence) |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/fixtures/trigger-goldens.json` | Created | PLANNED | ~40 phrases × {exact, paraphrase, distractor} |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/triggers/semantic-matcher.vitest.ts` | Created | PLANNED | Sub-Phase 2 unit tests |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/triggers/hybrid-handler.vitest.ts` | Created | PLANNED | Sub-Phase 3 integration tests |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/triggers/lexical-parity.vitest.ts` | Created | PLANNED | Diff test: flag-off output bit-identical (REQ-001) |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/triggers/cold-start.vitest.ts` | Created | PLANNED | Phrases without embeddings skipped silently (REQ-011) |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/triggers/latency-budget.vitest.ts` | Created | PLANNED | 30-50ms PASS / 100ms WARN preserved (REQ-013) |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Document 5 new flag env vars (REQ-009) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts` | Updated | OK | New table (also in Scripts §) |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:author-notes -->
## Author Notes

- **Per-child scope** — pt-03 aggregate at `../research/027-xce-research-pt-03/resource-map.md`.
- **Categories omitted (zero entries)**: Commands, Agents, Skills (skill itself in §READMEs), Meta.
- **PLANNED entries** become OK during Sub-Phases 1-4 implementation.
- **Schema migration** is a forward-only ADD — no rollback path, but reads remain backward-compatible.
- **No external dependencies** — Phase 004 has no hard preconditions; soft dep on shadow-eval evidence (equivalent shadow-eval harness) for threshold tuning; the previously-cited `028/004-code-graph-adoption-eval` folder does not exist.
<!-- /ANCHOR:author-notes -->
