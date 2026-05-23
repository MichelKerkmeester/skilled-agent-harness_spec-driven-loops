---
title: "Phase 003 — Deep-Agent-Improvement Recommended 5-Packet Roadmap"
description: "5-packet follow-on roadmap closing 26 actionable items (5 P0 + 14 P1 + 7 P2) from the 10-iter deep-research investigation."
---

# Deep-Agent-Improvement 5-Packet Roadmap

## Verdict

**PASS-WITH-UPLIFT** — 26 actionable items across 5 themes. Substantially higher signal than 119 (5 items, 0 P0) — deep-agent-improvement has GENUINE defects + missing patterns that the 117-122 arc cluster's learnings would close.

## Sequencing Logic

Operator-trust-first → docs/version truth → evaluator robustness → cross-runtime → methodology enhancements.

## Packet 124: `124-deep-agent-improvement-correctness-fixes`

**Scope**: 5 P0 + key P1 code-correctness fixes — restore operator trust first.

| Finding | Severity | What |
|---------|----------|------|
| DAI-009 | P0 | Add error-type discrimination in profile generation (file-not-found vs parse error vs crash) |
| DAI-013 | P0 | Resolve SKILL.md vs README contradiction on `plateau` stop reason |
| DAI-017 | P0 | Bump SKILL.md frontmatter version to align with changelog history |
| DAI-018 | P0 | Replace v1.4.0.0.md placeholder content with real changelog OR delete + skip |
| DAI-021 | P0 | Address cross-runtime agent definition drift risk (iter-8 finding) |
| DAI-010 | P1 | Replace silent NaN fallback in 5-dim scoring with explicit zero-or-throw |
| DAI-014 | P1 | Fix `target-manifest.jsonc` → `target_manifest.jsonc` path mismatch in YAML |
| DAI-016 | P1 | Fix `.opencode/command` → `.opencode/commands` (plural) hardcoded path |

**Level**: 3 (ADR for error-type taxonomy + NaN-handling policy)
**Effort**: M (~5-8 LOC fixes + 1 ADR + tests)
**Dependencies**: none — ship first
**Risk if NOT shipped**: error reporting unreliable; scoring produces false-perfect results; cross-runtime improvements drift; paths fail at runtime

---

## Packet 125: `125-deep-agent-improvement-doc-version-reconciliation`

**Scope**: Sk-doc canonical alignment + remaining documentation drift.

| Finding | Severity | What |
|---------|----------|------|
| (sk-doc canonical companions standard) | P1 | Verify DAI has feature_catalog + manual_testing_playbook + references + graph-metadata at post-118 depth; fill gaps |
| DAI-008 | P2 | Strip stale MCP tool refs from SKILL.md (post-118 cleanup) |
| (other doc drift from iter-6) | P1 | Cross-reference verifications |

**Level**: 2
**Effort**: M (mostly doc authoring; some validation)
**Dependencies**: 124 (some doc updates depend on the 124 fixes)
**Risk if NOT shipped**: DAI documentation drift continues; future contributors hit stale guidance

---

## Packet 126: `126-deep-agent-improvement-evaluator-hardening`

**Scope**: 5-dim scoring + promotion-gate + dedup robustness.

| Finding | Severity | What |
|---------|----------|------|
| DAI-001 | P1 | Codify promotion gate values per-dimension (not magic numbers) |
| DAI-005 | P1 | Make 5-dim scoring reproducible (input hash → score should be deterministic) |
| DAI-012 | P1 | Fix mutation-coverage signature dedup empty-field collision |
| DAI-022 | P1 | Multi-runtime sync coverage gap (cross-runtime validation) |
| (content-hash dedup pattern from 122/DR-005) | P1 | Apply to DAI candidate proposals |
| (convergence transparency from 121/DR-003) | P1 | Surface "unscored dimensions" in DAI dashboard |

**Level**: 3 (ADR for evaluator-reproducibility contract)
**Effort**: L (multi-file refactor + tests)
**Dependencies**: 124 + 125
**Risk if NOT shipped**: evaluator outputs not reliably comparable across runs; cross-iter regressions undetected

---

## Packet 127: `127-deep-agent-improvement-cross-runtime-promotion`

**Scope**: Multi-runtime agent definition consistency (Claude/Codex/Gemini/OpenCode).

| Finding | Severity | What |
|---------|----------|------|
| (iter-8 multi-runtime sync) | P1 | Add cross-runtime A/B validation step before promoting agent definition |
| DAI-006 | P1 | Iter state recovery semantics: handle partial-runtime-success state |
| (mirror sync gate) | P1 | Add 4-runtime mirror sync verification |

**Level**: 3 (ADR for cross-runtime promotion gate)
**Effort**: M (~1 new gate + cross-runtime smoke test)
**Dependencies**: 124 + 126
**Risk if NOT shipped**: agent improvements land in 1 runtime but drift in others; 4 mirrors out of sync

---

## Packet 128: `128-deep-agent-improvement-mixed-executor-adjudication`

**Scope**: Adopt the mixed-executor (cli-devin + cli-codex) + adjudication-iter patterns from 119.

| Finding | Severity | What |
|---------|----------|------|
| (mixed-executor pattern) | P2 | DAI evaluator runs across cli-devin SWE-1.6 + cli-codex gpt-5.5 hybrid |
| (adjudication iter) | P2 | DAI 5-dim scoring includes false-positive filter pass |
| DAI-004 | P2 | Dynamic profiling auditability (logs profile selection rationale) |
| (other methodology lift-ups) | P2 | Various P2 hygiene items |

**Level**: 3 (ADR for executor strategy + methodology)
**Effort**: L (rework dispatch pattern)
**Dependencies**: 124 + 125 + 126 + 127
**Risk if NOT shipped**: DAI methodology lags behind sibling skills' improved patterns

---

## Sequencing

```text
Packet 124 (P0 fixes)
  → Packet 125 (doc reconciliation)
    → Packet 126 (evaluator hardening)
      → Packet 127 (cross-runtime promotion)
        → Packet 128 (methodology uplift)
```

Total estimated effort: ~M×4 + L×2 = ~15-25 hours of work across 5 commits.

## Out of Scope (per iter-2/iter-3/iter-7 verifications)

- 22 SKIP patterns from iter-2 (deep-review/research-specific)
- Runtime relocation patterns (DAI doesn't have a deep-loop-runtime equivalent)
- MCP removal (DAI already minimal MCP surface)
- Workflow YAML cutover (DAI YAMLs already script-based)

## Cross-References

- Phase 001 research: `../001-research-recent-updates/research/research-report.md`
- Phase 002 applicability: `../002-applicability-analysis/applicability-table.md`
- 10 iter narratives + deltas
- Predecessor arcs: 117 / 118 / 119 / 120 / 121 / 122
