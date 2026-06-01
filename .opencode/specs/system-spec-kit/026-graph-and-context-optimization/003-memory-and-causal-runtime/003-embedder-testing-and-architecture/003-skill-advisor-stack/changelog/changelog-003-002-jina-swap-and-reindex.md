---
title: "Skill-Advisor Stack 002: Jina-v3 Swap and Reindex"
description: "Operator runbook, pre-swap DB snapshot plus architecture-gap analysis shipped for the jina-embeddings-v3 activation. Actual swap deferred after discovering the write path in skill-graph-db.ts was not wired to the new EmbedderAdapter layer. Follow-on packet 010/004 required to complete the swap."
trigger_phrases:
  - "jina swap runbook"
  - "skill-graph writer cross-wiring"
  - "010/002 jina swap partial"
  - "skill-advisor embedder swap deferred"
  - "vec_1024 half-wired"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex` (Level 1)
> Parent packet: `026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack`

### Summary

The skill-advisor stack shipped a pluggable EmbedderAdapter layer in the prior packet (010/001) but left the write path in `skill-graph-db.ts:refreshSkillEmbeddings()` wired to the legacy `createEmbeddingsProvider()` factory. That factory has no Ollama provider, so it cannot produce jina-v3 vectors. Setting the active embedder pointer without also wiring the writer would leave the `vec_1024` table empty, causing semantic-shadow to silently degrade to zero results.

Executing the swap was deferred. Instead, a comprehensive operator runbook was authored documenting the architecture state, the safe post-010/004 swap procedure, a rollback path plus explicit cross-references to the E deep-review findings (P1-1 regression-risk, P2-11 documentation-alignment) that independently confirmed the defect. A pre-swap DB snapshot was captured as rollback insurance for the 010/004 execution window.

The architecture gap and its path forward via 010/004 are now documented in the packet. No production behavior changed in this packet.

### Added

- `evidence/swap-runbook.md` operator runbook covering architecture context, swap prerequisites, step-by-step swap procedure (post-010/004), rollback instructions plus cross-references to the E deep-review findings

### Changed

- None. Additive-only phase.

### Fixed

- None. Actual swap deferred to 010/004.

### Verification

| Item | Result |
|------|--------|
| `evidence/swap-runbook.md` exists with 150+ lines | Passed (~200 lines) |
| Architecture gap documented with file:line evidence in runbook | Passed (runbook "Architecture Context" section) |
| 010/004 follow-on path described in runbook | Passed (runbook "Known Architecture Gap" section) |
| Cross-reference to E review P1-1 and P2-11 present | Passed (runbook "Cross-references" section) |
| DB snapshot captured at pre-swap path | Passed at commit time. Snapshot later removed from repo (not a regression artifact for this packet). |
| R1-R4 swap requirements | Deferred to 010/004 plus runbook execution |
| Strict-validate | Pending post-commit step per implementation-summary |

### Files Changed

| File | What changed |
|------|--------------|
| `evidence/swap-runbook.md` (NEW) | Comprehensive operator runbook documenting the half-wired architecture state, safe swap procedure (post-010/004), rollback path plus E review cross-references |

### Follow-Ups

- Execute the swap procedure defined in the runbook once 010/004 ships the writer cross-wiring in `refreshSkillEmbeddings()`.
- Re-snapshot `skill-graph.sqlite` immediately before executing the swap in case the schema drifts before 010/004 lands.
- Validate R1 through R4 after swap: active pointer reads `jina-embeddings-v3`, reindex completes without error, semantic-shadow returns non-empty top-3. Confirm `skill_advisor.py recommend "memory save"` includes `system-spec-kit` in top-3.
- Align spec.md wording to remove the env-var swap path (P2-11) after 010/004 lands.
