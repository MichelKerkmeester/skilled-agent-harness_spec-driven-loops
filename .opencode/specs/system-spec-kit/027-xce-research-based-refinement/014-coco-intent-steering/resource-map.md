---
title: "Resource Map — Phase 007 Coco-Index Intent Steering"
description: "File inventory for Phase 007: scope is per-child (this phase only). Spans coco-index Python + skill_advisor TypeScript + tests + ENV/SKILL docs. ~15 files total."
trigger_phrases:
  - "027 phase 007 resource map"
  - "coco intent steering files"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-coco-intent-steering"
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

This is a **per-child resource map** for Phase 007. Pt-03 already produced an aggregate map at `../research/027-xce-research-pt-03/resource-map.md` covering the full scope of the research pass. This file narrows to the files Phase 007 specifically touches during scaffolding + planned implementation.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 17
- **By category**: READMEs=2, Documents=3, Specs=8, Scripts=10, Tests=4, Config=2
- **Missing on disk**: 0 (all references exist or are PLANNED-create)
- **Scope**: Per-child — files Phase 007 reads, modifies, creates, or cites during scaffolding + Sub-Phases 1-4 implementation.
- **Generated**: 2026-05-09T11:00:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Cited` · `Validated`.
> **Status vocabulary**: `OK` (exists on disk) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/SKILL.md` | Updated | OK | Document new flag + intent families + opt-out (REQ-011) |
| `.opencode/skills/system-spec-kit/SKILL.md` | Cited | OK | Routing context for advisor hint integration |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/research.md` | Cited | OK | Pt-03 RQ-A1 verdict + adoption matrix |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-001.md` | Cited | OK | Iter-001 RQ-A1 findings (5 findings F-iter001-001..005) |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | Updated | OK | Update with expansion-active behavior (REQ-011) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> Note: per-category precedence rule — Specs takes precedence over Config for JSON metadata files.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `007-coco-intent-steering/spec.md` | Created | OK | This packet |
| `007-coco-intent-steering/plan.md` | Created | OK | This packet |
| `007-coco-intent-steering/tasks.md` | Created | OK | This packet |
| `007-coco-intent-steering/checklist.md` | Created | OK | This packet |
| `007-coco-intent-steering/decision-record.md` | Created | OK | This packet |
| `007-coco-intent-steering/implementation-summary.md` | Created | OK | Placeholder; filled post-impl |
| `007-coco-intent-steering/description.json` | Created | OK | Spec-folder metadata |
| `007-coco-intent-steering/graph-metadata.json` | Created | OK | Graph metadata |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> All `.sh`, `.js`, `.ts`, `.py` artifacts touched by this phase.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/intent_classifier.py` | Created | PLANNED | Sub-Phase 1: rule-based intent classifier |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Updated | OK | Sub-Phase 2: expansion shim before line 293; intent priors in `_ranked_result()` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Cited | OK | `classify_path()` taxonomy reuse (lines 53-91) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Cited | OK | MCP search tool entry — confirms NO API surface change (ADR-004) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Cited | OK | IPC SearchRequest schema — confirms no schema change |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py` | Updated | OK | Verify rankingSignals fields support new `intent`, `expanded_to`, `sub_query_idx` (REQ-005) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Cited | OK | Embedder configuration — confirms no embedding-model swap |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts` | Updated | OK | Sub-Phase 3: advisor first-action hint (lines 124-158) |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | Cited | OK | Coco-relevant lexical hints (lines 25-30) |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Cited | OK | Coco explicit boosts (lines 55-56, 154-160) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts` | Updated | OK | Sub-Phase 4: telemetry envelope additions (REQ-007) |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/tests/test_intent_classifier.py` | Created | PLANNED | 30+ query fixtures; precision ≥ 0.85 |
| `.opencode/skills/mcp-coco-index/tests/test_query_expansion.py` | Created | PLANNED | E2E expansion path; cap enforcement; suppression heuristics |
| `.opencode/skills/mcp-coco-index/tests/test_latency_benchmark.py` | Created | PLANNED | 50-query fixture; p50 overhead < 100ms |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/skill_advisor/render-coco-hint.vitest.ts` | Created | PLANNED | Phase-005-integrated path + standalone-fallback |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

> JSON / YAML / TOML / env-example artifacts. NOT spec JSON (those are in §Specs).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Document `SPECKIT_COCOINDEX_INTENT_EXPAND` (REQ-006) + `SPECKIT_COCOINDEX_FIRST_ACTION_HINT` (REQ-009) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Cited | OK | Existing CocoIndex config; no changes needed |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:author-notes -->
## Author Notes

- **Per-child scope** — pt-03's aggregate resource map (`../research/027-xce-research-pt-03/resource-map.md`) covers the broader context; this file is narrowed to Phase 007's specific touch set.
- **Categories omitted (zero entries)**: Commands, Agents, Skills, Meta. Skill itself is in §READMEs (mcp-coco-index/SKILL.md). No agent/command-surface changes for this phase.
- **PLANNED entries** become OK when the file is created during implementation; Status field gets updated as Sub-Phases 1-4 land.
- **Soft dep on Phase 005** — `render.ts` is shared with Phase 005 work; coordination via standalone-fallback flag (REQ-009).
<!-- /ANCHOR:author-notes -->
