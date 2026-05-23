---
title: "Implementation Summary: 022/002 CocoIndex Embedder Doc-Drift Resync"
description: "Shipped 4 doc edits closing the embedder-side P0 doc drift. Reranker side scoped + deferred to follow-on 002b."
trigger_phrases:
  - "022/002 shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync"
    last_updated_at: "2026-05-23T16:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 002 shipped — 2 P0 + 1 P1 + 1 P2 closed (embedder side)"
    next_safe_action: "Stop session; resume with phase 003 (codex agents) or phase 002b (reranker doc) in fresh session"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/assets/config_templates.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/references/embedder-pluggability.md"
      - ".opencode/skills/mcp-coco-index/SKILL.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022c5"
      session_id: "016-002-022-002-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Reranker-side prose corrections (002b) need Qwen3-Reranker-0.6B disk footprint + daemon-log identifier verification"
    answered_questions:
      - "Phase 002 embedder-only ship closed 2 P0 + 1 P1 + 1 P2"
      - "Memory entry project_2026_05_19_cocoindex_arc_shipped.md is stale on reranker (says jina-v3, actual is Qwen3-0.6B per 023B follow-on); update post-arc"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/002 CocoIndex Embedder Doc-Drift Resync

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (embedder side); 002b deferred for reranker |
| Shipped | 2026-05-23 |
| Files changed | 4 docs |
| Tests added | 0 (docs-only) |
| Typecheck | n/a (no code) |
| Audit findings closed | f-iter006-001 (embeddinggemma in config_templates 3 sites) + embedder-pluggability historical clarity + ENV_REFERENCE date + SKILL.md keywords (2 P0 + 1 P1 + 1 P2) |
| Audit findings deferred to 002b | Reranker-side prose: 007-reranker-opt-in.md (121-line scenario) + manual_testing_playbook.md:402,407 + benchmarks/README.md:202 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### `.opencode/skills/mcp-coco-index/assets/config_templates.md`

- Replaced 3 `_NOTE_2` instances at lines 75 / 140 / 160 (OpenCode / Claude JSON / Codex TOML templates): `google/embeddinggemma-300m` → `sbert/nomic-ai/CodeRankEmbed`. Used `replace_all=true` on the surrounding 3-line context block to catch the duplicated _NOTE_ pair, then a separate targeted edit on the TOML form.

### `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`

- Refreshed "Last updated" date at line 560 from `2026-04-01` to `2026-05-23` reflecting the doc audit pass.

### `.opencode/skills/system-spec-kit/references/embedder-pluggability.md`

- Line 342 row for `jinaai/jina-embeddings-v2-base-code`: annotated description as "historical CocoIndex default per 018 ADR-001, superseded by `sbert/nomic-ai/CodeRankEmbed` in the 018 follow-on (corrected-pipeline bench tied `bge-code-v1` on hit rate with lower latency)". Preserves the historical entry while making current-state obvious to operators.

### `.opencode/skills/mcp-coco-index/SKILL.md`

- Line 8 keywords block: added `code-rank-embed` adjacent to existing `embeddinggemma-300m`. Both kept — embeddinggemma remains a registered candidate (search keyword still valid); code-rank-embed is the canonical default (now searchable).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Main-agent direct execution (no cli-devin dispatch) per scope-vs-overhead judgment. ~25 minutes wall-clock total:

1. Pre-edit verification: read `registered_embedders.py:255-256` to confirm `DEFAULT_EMBEDDER_NAME='sbert/nomic-ai/CodeRankEmbed'` and `DEFAULT_RERANKER_NAME='Qwen/Qwen3-Reranker-0.6B'` (discovered memory entry `project_2026_05_19_cocoindex_arc_shipped.md` is stale on the reranker side — says jina-v3, actual is Qwen3-0.6B per 023B follow-on).
2. 4 Edit calls applied to 4 doc files.
3. Post-edit grep ban-list verifications on each file.
4. Spec docs (this one + spec/plan/tasks/checklist) authored post-execution per Level 2 contract.

Scope split rationale: reranker-side prose (007-reranker-opt-in.md is 121 lines deep referencing "~2.3 GB BGE model" and "BGE cross-encoder load activity" in daemon.log) requires Qwen3-Reranker-0.6B disk footprint + daemon-log identifier verification beyond mechanical-edit threshold. Splitting preserves arc cadence and isolates the verification work to a tightly scoped follow-on packet (002b).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Pre-edit canonical verification**: instead of trusting the plan's target values, read `registered_embedders.py` first. Caught that memory entry was stale on reranker — saved fixing one drift by re-introducing another.
- **Scope split into 002 + 002b (embedder + reranker)**: reranker docs cascade into size + log-name prose. Splitting isolates the verification work.
- **Kept `embeddinggemma-300m` keyword in SKILL.md alongside new `code-rank-embed`**: embeddinggemma remains a registered baseline candidate; removing the keyword would hurt search recall.
- **Annotated historical entry, didn't delete**: `embedder-pluggability.md:342` row for jina-v2-base-code preserves the 018 ADR-001 history; deletion would lose audit-trail value.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `rg "google/embeddinggemma-300m" .opencode/skills/mcp-coco-index/assets/config_templates.md` → 0 hits
- `grep "Last updated: 2026-05-23" .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` → 1 hit
- `grep "code-rank-embed" .opencode/skills/mcp-coco-index/SKILL.md` → 1 hit
- `grep "historical CocoIndex default" .opencode/skills/system-spec-kit/references/embedder-pluggability.md` → 1 hit
- Strict-validate phase 002 → exit 0 (after this doc set is written)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- Reranker-side doc drift (BAAI/bge-reranker-v2-m3 prose in 4 surfaces) NOT closed in this phase. Deferred to 002b.
- README.md:217 + INSTALL_GUIDE.md:563 non-default markers for embeddinggemma row NOT applied — the current rows already say "Pre-018 baseline" / "Pre-CodeRankEmbed baseline" which is functionally equivalent to a non-default marker. Audit verdict was P2 informational; leaving as-is.
- Memory entry `project_2026_05_19_cocoindex_arc_shipped.md` still says jina-reranker-v3 is the production default. Should be updated post-arc to note 023B promoted Qwen3-Reranker-0.6B over jina-v3.

### Commit Handoff

Suggested message:

```
docs(022/002): resync CocoIndex embedder doc drift to sbert/nomic-ai/CodeRankEmbed canonical

Closes 2 P0 + 1 P1 + 1 P2 audit findings from packet 021 (embedder side):
- config_templates.md 3 _NOTE_2 sites: embeddinggemma-300m → sbert/nomic-ai/CodeRankEmbed
- embedder-pluggability.md:342 jina-v2-base-code row annotated as historical
- ENV_REFERENCE.md:560 last-updated date refreshed
- SKILL.md:8 keywords add code-rank-embed alongside embeddinggemma-300m

Reranker-side prose corrections (007-reranker-opt-in.md, manual_testing_playbook.md,
benchmarks/README.md — BAAI/bge-reranker-v2-m3 → Qwen/Qwen3-Reranker-0.6B with
size + daemon-log corrections) deferred to follow-on packet 002b pending Qwen3
disk footprint + daemon-log identifier verification.
```

Suggested explicit paths:

```
.opencode/skills/mcp-coco-index/assets/config_templates.md
.opencode/skills/mcp-coco-index/SKILL.md
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/skills/system-spec-kit/references/embedder-pluggability.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync/
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json
```
<!-- /ANCHOR:limitations -->
