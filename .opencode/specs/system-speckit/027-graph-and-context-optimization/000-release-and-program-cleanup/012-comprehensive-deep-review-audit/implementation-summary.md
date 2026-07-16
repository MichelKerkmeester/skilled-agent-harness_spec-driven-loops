---
title: "Implementation Summary: Comprehensive Deep-Review + Deep-Research Audit of system-spec-kit & 026"
description: "Consolidated, deduped, severity-calibrated findings from an 8-slice deep-review plus root-cause research pass over system-spec-kit, 026, and 027."
trigger_phrases:
  - "deep review audit results"
  - "026 audit findings"
  - "system-spec-kit audit"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit"
    last_updated_at: "2026-06-04T19:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 8-slice deep-review + deep-research audit (5x gpt-5.5-xhigh per slice, worktree-isolated); consolidated and verified findings"
    next_safe_action: "Route findings to /speckit:plan for remediation; start with the deep-loop fan-out result-accounting P0, then community-fallback/causal scope, then entity-density invalidation"
    blockers: []
    completion_pct: 100
    open_questions:
      - "Corpus-wide count of metadata-drift packets (this audit established a verified lower bound only)"
    answered_questions:
      - "Root cause of doc/schema-to-code drift: hand-maintained contracts with no single source of truth (RC1)"
      - "P0 scope/causal findings calibrate to P1 under the local single-user MCP threat model"
      - "Fan-out concurrency cap is defeated by synchronous spawnSync; non-zero lineage exits are counted as success"
      - "Entity-density cache is not invalidated on memory_update/memory_delete"
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Comprehensive Deep-Review + Deep-Research Audit

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

## 1. OUTCOME

A maximal audit of system-spec-kit, the 026 program, the interconnected MCPs, and the 027 launch — executed by **gpt-5.5 at xhigh reasoning, 5 concurrent lineages per slice** (40 review lineages + 5 research lineages, ~225 internal iterations), fully isolated in worktree `wt/0006-deep-review-audit` (every slice tripwire confirmed **0 reviewed files modified**).

**Overall verdict: CONDITIONAL.** No catastrophic data-loss bug was found, but the audit surfaced **~50 distinct real findings** — 1 confirmed infrastructure P0, several genuine correctness/scope bugs, and pervasive doc/schema↔code and metadata drift — clustering into **5 systemic root causes**. Findings were corroborated across independent lineages and the top items were re-verified by direct code reads.

## 2. METHOD & VERIFICATION POSTURE

- 8 review slices (correctness/security/traceability/maintainability) + 1 research synthesis pass, each a 5-way gpt-5.5-xhigh fan-out, merged with strongest-restriction (review) / dedup (research).
- **Verification scorecard** (top findings re-verified by direct Read, not taken on faith):

| Finding | Verification |
|---|---|
| Community-fallback scope leak (`memory-search.ts:1000-1011`) | ✅ Confirmed in code |
| Fan-out: non-zero lineage exit counted as success (`fanout-run.cjs:362` / `fanout-pool.cjs`) | ✅ Confirmed in code |
| Fan-out: `spawnSync` serializes lineages despite concurrency cap; `iterations` only sizes timeout | ✅ Confirmed (reproduced empirically this run) |
| Entity-density cache stale on update/delete | ✅ Confirmed gap (freshness rule mandates only save/bulk-delete) |
| Atomic-save index-before-promote (`atomic-index-memory.ts:362→378`) | 🟡 Ordering confirmed; durability impact = crash-window only |

- **Methodology caveat (self-found):** the per-slice `orchestration-summary.json` files report 1 lineage/1 success because the campaign ran 5 separate `count=1` processes (last-write-wins on the shared summary). The **ledgers (`orchestration-status.log`) + per-lineage `fanout-lineage.out` sentinels confirm all 5 lineages ran**; consolidation read per-lineage state directly, not the summaries.

## 3. ROOT CAUSES (from the research synthesis)

| # | Root cause | Confidence | Remediation target |
|---|---|---|---|
| RC1 | **Tool contracts are hand-maintained** across public JSON schema, Zod allow-list, handler, install docs, feature catalog, and playbook — no single source of truth | High | Typed contract manifest + parity test (fail when surfaces disagree) |
| RC2 | **Metadata freshness is split** across canonical save, graph refresh, description generation, and snapshot docs | Med-High | Single metadata reconciliation command + stale-surface detector |
| RC3 | **Write paths don't consistently invalidate derived caches** (entity-density) | High | Invalidate entity-density on save/update/delete/bulk-delete commit |
| RC4 | **Governed scope applied in main retrieval path but not late fallback / causal tools** | High | Add scope fields + fail-closed post-filtering |
| RC5 | **Fan-out conflates subprocess completion with lineage success** | High | Throw on non-zero/missing-sentinel; async spawn; summaries from per-lineage state |

## 4. CONSOLIDATED FINDINGS (deduped across slices)

### P0 (blocking)
- **[P0 · deep-loop reliability] Non-zero CLI lineage exits counted as successful fan-out results** (`deep-loop-runtime/scripts/fanout-run.cjs:362`, `fanout-pool.cjs`). Silent failure masking — prior "passing" multi-lineage runs cannot be trusted from the summary alone. *Verified.*

### P0→P1 (severity-calibrated to the local single-user MCP threat model; promote to P0 under multi-tenant/untrusted callers)
- **[P1 · scope/privacy] `memory_search` community fallback bypasses governed retrieval scope** — fetches member rows `WHERE id IN (...)` with no specFolder/tenant/user/agent filter and appends to scoped results (`handlers/memory-search.ts:1000-1031`; gated by `isDualRetrievalEnabled()` + `isCommunitySearchFallbackEnabled()`). *Verified.*
- **[P1 · scope/privacy] Causal-graph tools operate on bare IDs without governed scope** (`tool-schemas.ts:451`, `handlers/causal-graph.ts:757`, `lib/storage/causal-edges.ts`).

### P1 (required)
- **[P1] Entity-density cache stale after `memory_update`/`memory_delete`** → stale graph-channel routing until TTL/restart (`handlers/mutation-hooks.ts`, `memory-crud-update.ts:91`, `lib/search/entity-density.ts`). The freshness rule only mandates save/bulk-delete invalidation. *Verified.*
- **[P1] Embedding-reconcile dry-run undercounts** rows missing only the active-dimension vector (dry-run predicate ≠ apply predicate) (`lib/embedders/embedding-reconcile.ts:281-286`).
- **[P1] `memory_embedding_reconcile` contract drift** — public schema exposes `dryRun`/`force`/`activeOnly`; Zod allow-list permits only `mode`/`limit`; runtime uses `mode:"apply"`; install guide + catalog still say `dryRun:false` (`tool-schemas.ts:342`, `schemas/tool-input-schemas.ts:583`, `INSTALL_GUIDE.md:737`). *(Clearest instance of RC1.)*
- **[P1] Governed ingest metadata accepted+validated then dropped before indexing** on bulk/scan/async paths (`schemas/tool-input-schemas.ts:455`).
- **[P1] `memory_search` does not validate caller `sessionId`** through `resolveTrustedSession` like context/triggers do (`handlers/memory-search.ts:664,970`).
- **[P1] Causal edge writers can create orphan/wrong-target edges** (FK validation deferred for synthetic IDs leaks into production path) (`handlers/causal-graph.ts:745-756`, `lib/storage/causal-edges.ts:279-344`).
- **[P1] Atomic save indexes DB row before promoting the pending file** — crash/promotion-failure window leaves DB↔file inconsistency (`handlers/save/atomic-index-memory.ts:362→378`). *Ordering verified; impact = crash window.*
- **[P1 · 026] Stale program graph-metadata** (last-active/track-status) (`026/spec.md:139`, `graph-metadata.json:156`); **changelog rollups omit live child rollups**; **completed packets still marked in-progress**.
- **[P1 · catalog] Catalog/playbook verification gaps** — false universal-coverage claim, tool-count drift (37 vs 36), scenario-gate drift (380 vs 384), **5 playbook scenarios link to non-existent catalog files**, stale local-LLM impl paths.
- **[P1 · governance] sk-doc instructs removing spec YAML frontmatter that templates now require**; comment-hygiene checker misses forbidden examples + a broad `hygiene-ok` escape; routing rule says code search falls back to `memory_search` (which doesn't index code).
- **[P1 · 027] Placeholder `000-release-cleanup` declared executable child; renumbered children expose stale phase IDs; graph status marks draft phases complete** (`027/.../003-incremental-index-foundation/graph-metadata.json:42`).

### P2 (advisory) — selected
- `activeOnly` advertised in schema but never read; `memory_causal_stats.backfill` live but absent from public schema; resource-map stale OK rows; changelog voice-rule violations; codex dispatch emits `service_tier=default` outside the validated enum; deep-loop SKILL.md script-count drift; ephemeral phase/ADR labels in real code comments (`system-code-graph/.../code-graph-tools.ts`).

## 5. RECOMMENDED REMEDIATION ORDER

1. **Fan-out result accounting** (P0): treat non-zero exit / timeout / missing sentinel as failed; regenerate summaries from per-lineage state; move to async spawn (also fixes the concurrency cap).
2. **Community-fallback scope** + **causal-graph scope**: pass/post-filter governed scope; fail closed.
3. **Entity-density invalidation** on save/update/delete/bulk-delete commit.
4. **Metadata status derivation**: placeholder implementation-summaries must not imply completion; reconcile 026/027 status surfaces.
5. **MCP contract parity suite** (RC1): one manifest → public schema, Zod, handler, docs, catalog, playbook; parity test.
6. **Catalog/playbook**: fix broken links, count gates, coverage claims; align sk-doc frontmatter guidance with templates.
7. Regenerate/archive stale resource maps, changelog rollups, description renumbering.

## 6. ARTIFACTS

- Per-slice review packets: `001-*/review/` … `008-*/review/` (each: 5 lineage reports, merged `deep-review-findings-registry.json`, `fanout-attribution.md`).
- Research synthesis: `009-research-synthesis/research/` (5 lineage `research.md` + merged registry).
- Calibration evidence: `001-mcp-core/probe-report.md`.

## 7. STATUS

Audit COMPLETE. Findings are remediation-ready for `/speckit:plan`. No code was modified by this audit (read-only review; worktree-isolated). Severity is calibrated to the **local single-user MCP** model — re-rate the scope/causal findings to P0 if the deployment becomes multi-tenant or accepts untrusted callers.
