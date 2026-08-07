---
title: "Spec: 022/002 CocoIndex Embedder Doc-Drift Resync"
description: "4 doc edits closing the embedder-side P0 doc drift from packet 021: config_templates.md _NOTE_2 (3 sites) + embedder-pluggability.md historical annotation + ENV_REFERENCE.md date refresh + SKILL.md keywords. Reranker-side doc edits (BAAI/bge-reranker-v2-m3 → Qwen/Qwen3-Reranker-0.6B prose) deferred to follow-on packet because they need Qwen3 disk-footprint + daemon-log behavior verification beyond the mechanical-edit threshold."
trigger_phrases:
  - "022/002 embedder doc drift"
  - "embeddinggemma doc resync"
  - "embedder-pluggability historical annotation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync"
    last_updated_at: "2026-05-23T16:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 002 shipped (embedder side); 002b reranker side scoped + deferred"
    next_safe_action: "Stop session; resume with phase 002b (reranker doc edits) or 003/004 next session"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/assets/config_templates.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/references/embedder-pluggability.md"
      - ".opencode/skills/mcp-coco-index/SKILL.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022c1"
      session_id: "016-002-022-002"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Reranker prose corrections (007-reranker-opt-in.md, manual_testing_playbook.md, benchmarks/README.md) deferred to phase 002b — need Qwen3-Reranker-0.6B verified disk footprint + daemon-log naming"
    answered_questions:
      - "Scope split: embedder side (this phase) vs reranker side (phase 002b). Reason: reranker swaps cascade into BGE-specific size prose (~2.3 GB) + daemon-log behavioral descriptions that need verification beyond mechanical edit."
      - "Current actual defaults verified: DEFAULT_EMBEDDER_NAME='sbert/nomic-ai/CodeRankEmbed', DEFAULT_RERANKER_NAME='Qwen/Qwen3-Reranker-0.6B' (per 023B follow-on, registered_embedders.py:255-256)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/002 CocoIndex Embedder Doc-Drift Resync

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | Doc-only resync (embedder side) |
| Owner | main_agent direct (no executor dispatch) |
| Parent | `../spec.md` (022-hardcoded-default-remediation-arc) |
| Sibling | `../001-profile-ts-fallback-fix/` (shipped) |
| Estimated wall-clock | 20–40 min (actual ~25 min including discovery + verification) |
| Risk class | TRIVIAL (docs-only) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CocoIndex docs cite `google/embeddinggemma-300m` as the "default embedding" in 3 `_NOTE_2` lines of `config_templates.md`, even though `DEFAULT_EMBEDDER_NAME = "sbert/nomic-ai/CodeRankEmbed"` shipped on 2026-05-19 (per the 018 follow-on). Per packet 021 finding f-iter006-001, this is **P0 doc-drift**: an operator copy-pasting the template would believe embeddinggemma is the default and misconfigure or under-resource accordingly.

Two adjacent doc surfaces have the same shape:
- `embedder-pluggability.md:342` describes `jinaai/jina-embeddings-v2-base-code` as "production CocoIndex default per 018 ADR-001" without noting supersession by `sbert/nomic-ai/CodeRankEmbed`.
- `ENV_REFERENCE.md:560` last-updated date is `2026-04-01`, two months stale.
- `SKILL.md:8` keywords block lists `embeddinggemma-300m` but not `code-rank-embed` — invisible to operators searching the canonical current default.

Purpose: close the embedder-side P0 doc-drift in a single doc-only phase, deferring the reranker-side prose corrections (which cascade into BGE-specific size + daemon-log prose) to a follow-on packet.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `config_templates.md:75,140,160` — 3 `_NOTE_2` citations: `google/embeddinggemma-300m` → `sbert/nomic-ai/CodeRankEmbed`
- `ENV_REFERENCE.md:560` — refresh "Last updated" date `2026-04-01` → `2026-05-23`
- `embedder-pluggability.md:342` — annotate `jinaai/jina-embeddings-v2-base-code` row as historical, citing supersession by `sbert/nomic-ai/CodeRankEmbed` in the 018 follow-on
- `SKILL.md:8` — keywords block: add `code-rank-embed` adjacent to `embeddinggemma-300m`

### Out of Scope (deferred to phase 002b)

- `manual_testing_playbook/03--configuration/007-reranker-opt-in.md` (121-line CFG-007 scenario) — `BAAI/bge-reranker-v2-m3` → `Qwen/Qwen3-Reranker-0.6B` plus size prose (`~2.3 GB` → Qwen3-verified footprint) plus daemon-log naming
- `manual_testing_playbook.md:402,407` — same reranker swap with prose
- `benchmarks/README.md:202` — same reranker swap
- `INSTALL_GUIDE.md:563` + `README.md:217` — non-default marker for embeddinggemma row (low-risk; folded into 002b)
- `embedder-pluggability.md` reranker-side rows (if any) — folded into 002b

### Why split

Reranker doc edits require verifying Qwen3-Reranker-0.6B disk footprint (model card lookup) + daemon-log identifier (cross-encoder load activity message) + cold-cache download wall-clock characteristics. Each is a small verification but cumulatively pushes the phase past the mechanical-edit threshold. Splitting preserves arc cadence (1 phase = 1 closed risk-class) and isolates the reranker verification work.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | 3 `_NOTE_2` lines in `config_templates.md` cite `sbert/nomic-ai/CodeRankEmbed` | `rg "google/embeddinggemma-300m" config_templates.md` returns 0 hits |
| R2 | `ENV_REFERENCE.md:560` date is `2026-05-23` | `grep "Last updated" ENV_REFERENCE.md` shows new date |
| R3 | `embedder-pluggability.md:342` row marks jina-v2-base-code as historical with supersession note | `rg "production CocoIndex default per 018 ADR-001" embedder-pluggability.md` returns 0 hits OR matches new "historical ... superseded" wording |
| R4 | `SKILL.md` keywords block includes `code-rank-embed` | `grep "code-rank-embed" SKILL.md` returns 1 hit |
| R5 | Strict-validate of this phase exits 0 | `bash validate.sh 002-cocoindex-embedder-doc-drift-resync --strict` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 4 edits applied; verification grep on R1–R4 passes
- Phase ships closing 2 P0 (config_templates + SKILL.md keywords) + 1 P1 (embedder-pluggability historical clarity) + 1 P2 (ENV_REFERENCE date)
- Phase 002b scope documented for follow-on dispatch
- Parent `022-hardcoded-default-remediation-arc/graph-metadata.json` updated with `002-cocoindex-embedder-doc-drift-resync` in `children_ids` (status: complete)
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct Edit. No executor dispatch (4 file edits, all mechanical string replacements once the canonical target is verified).

Verification protocol:
1. Confirmed `DEFAULT_EMBEDDER_NAME` and `DEFAULT_RERANKER_NAME` in `registered_embedders.py:255-256` BEFORE applying edits — caught that memory entry `project_2026_05_19_cocoindex_arc_shipped.md` is stale on reranker (says jina-v3, actual is Qwen3-0.6B per 023B follow-on).
2. Applied edits via Edit tool with verified canonical values.
3. Post-edit grep ban-list on each file.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Wrong canonical applied (introducing fresh drift) | Verified `DEFAULT_EMBEDDER_NAME` = `sbert/nomic-ai/CodeRankEmbed` in `registered_embedders.py:255` before any edit |
| Stale memory entry leading future runs astray | Memory entry `project_2026_05_19_cocoindex_arc_shipped.md` to be updated post-arc to reflect 023B Qwen3-0.6B promotion |
| Reranker doc-drift left unfixed | Documented in phase 002b scope; arc convergence gate catches if 002b never ships |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- (Deferred to 002b) Qwen3-Reranker-0.6B exact disk footprint for prose corrections to "~2.3 GB BGE model" lines
- (Deferred to 002b) Daemon-log message exact identifier when Qwen3-Reranker-0.6B loads
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Predecessor phase: `../001-profile-ts-fallback-fix/`
- Audit source: `../../021-hardcoded-default-audit-deep-research/research/research.md` finding f-iter006-001
- Embedder default ADRs: `004-spec-memory-embedder-bake-off/decision-record.md` (ADR-013, ADR-014)
- Promotion commit: 2026-05-19 (nomic + jina-v3); 023B follow-on commit (Qwen3 reranker promotion)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- No code path affected; behavior unchanged
- No new dependencies
- Documentation must remain operator-readable (mid-paragraph annotation must not break table rendering)
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- `config_templates.md` has the `_NOTE_2` line at 3 different positions (75, 140, 160) corresponding to OpenCode / Claude / Codex CLI templates. All 3 must be updated together; Edit's `replace_all=true` on the surrounding 3-line block caught all instances.
- `embedder-pluggability.md:342` is inside a multi-column markdown table; annotation must fit within table cell semantics without breaking rendering.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 documentation-only edit. 4 files modified, 0 lines added, 4 lines changed in place. Below cli-devin dispatch overhead threshold.
<!-- /ANCHOR:complexity -->
