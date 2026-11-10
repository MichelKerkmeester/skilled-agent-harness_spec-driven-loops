---
title: "Implementation Plan: Graph Impact and Affordance Uplift"
description: "Six-sub-phase Level 3 plan to land the converged external-project research recommendations across Code Graph, Memory, and Skill Advisor with strict ownership boundaries and a clean-room license gate."
trigger_phrases:
  - "graph impact and affordance uplift plan"
  - "external project adoption plan"
  - "code graph phase runner plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Graph Impact and Affordance Uplift

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Code Graph, Skill Advisor scorer), Python (skill graph compiler), display-only Memory formatters |
| **Framework** | Not recorded |
| **Storage** | Existing SQLite schema; no migrations |
| **Testing** | Not recorded |

### Overview

Implement the converged pt-01 and pt-02 External Project research recommendations as a 6-sub-phase Level 3 implementation packet. pt-02 cross-checked pt-01 with an independent executor and reached the same core conclusions: External Project is architectural evidence, not a source transplant; Code Graph, Memory, and Skill Advisor stay separately owned; route/tool/shape work is deferred until Public has the substrate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

### Ownership Boundary Contract (from pt-02 §13)

| Owner | Exclusive | Shared (translated only) |
|-------|-----------|--------------------------|
| Code Graph | Structural code facts; file/node/edge persistence; readiness blocking; route/tool extraction (future) | Confidence, reason, freshness, next-action summaries |
| Memory | Causal lineage (six relation types); strength, evidence, anchors, age | May DISPLAY Code Graph-derived trust/freshness; MUST NOT store code relation types |
| Skill Advisor | Routing evidence in 5 scoring lanes | May CONSUME normalized tool/resource affordances as derived/graph-causal evidence |
| Cross-owner governance | License posture; clean-room rule; unified-graph-collapse prevention | Shared evidence summaries only after owner-local translation |

### Sequencing

```
012/001 license-audit (P0) blocks ALL
        ↓
012/002 phase-runner + detect_changes (gates safety semantics)
        ↓
   ┌────────┬────────┬────────┐
   ↓        ↓        ↓
012/003   012/004   012/005
  edge      skill     memory
(parallel)
        ↓
012/006 docs-and-catalogs-rollup (after 002-005)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 3. AFFECTED SURFACES

| Sub-phase | Files Touched (Summary) |
|-----------|-------------------------|
| 001 | `decision-record.md` (license ADR); no code changes |
| 002 | NEW: `code_graph/lib/phase-runner.ts`, `code_graph/lib/diff-parser.ts`, `code_graph/handlers/detect-changes.ts`. MODIFY: `structural-indexer.ts`, `handlers/index.ts` |
| 003 | MODIFY: `structural-indexer.ts`, `handlers/query.ts`, `code-graph-context.ts` |
| 004 | NEW: `skill_advisor/lib/affordance-normalizer.ts`. MODIFY: `skill_graph_compiler.py`, `scorer/lanes/derived.ts`, `scorer/lanes/graph-causal.ts` |
| 005 | MODIFY: `formatters/search-results.ts`, `lib/response/profile-formatters.ts` (display only; no schema change) |
| 006 | MODIFY: root `/README.md`, `system-spec-kit/SKILL.md`, `system-spec-kit/README.md`, `mcp_server/README.md`, `mcp_server/INSTALL_GUIDE.md`, feature_catalog/manual_testing_playbook indexes |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. PHASES

- **001 — Clean-room license audit (P0 governance gate).** Record the license decision in `decision-record.md`; articulate the clean-room rule and the allow-list of pattern-only adaptations versus forbidden source forms.
- **002 — Code Graph phase-DAG runner + read-only `detect_changes` preflight.** Typed phases with `inputs[]`/`outputs[]`; reject duplicate names, missing deps, and cycles; `detect_changes` returns `status: blocked` when readiness requires a full scan.
- **003 — Code Graph edge `reason`/`step` display + `blast_radius` uplift.** Edge metadata gains `reason` + `step` JSON fields (no SQLite migration); output adds `riskLevel`, `minConfidence`, `ambiguityCandidates`, and structured `failureFallback`.
- **004 — Skill Advisor affordance evidence.** Sanitize tool/resource text via an allowlist before evidence reaches the scorer; no new entity kinds and no new scoring lane.
- **005 — Memory causal trust display.** Badges only, read from existing causal-edge columns; no schema change and no new relation types.
- **006 — Docs + catalog rollup.** Umbrella docs and per-packet feature_catalog/manual_testing_playbook entries written by 002-005 inline; this sub-phase rolls up the shared docs.

Out of scope: pt-02 Packet 5 (route/tool/shape contract safety), a mutating `rename` tool, unified graph collapse, the Memory-CodeGraph evidence bridge, and storage migrations.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

Sub-phase 001 (license audit) blocks all code work. Sub-phase 002 (phase runner + `detect_changes`) blocks any feature that builds on changed-impact preflight semantics. Sub-phases 003-005 run in parallel after 002; sub-phase 006 follows 002-005.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK

Not recorded in spec.md or git history.
<!-- /ANCHOR:rollback -->
