---
title: "Phase 003 — Deep-Research Uplift Recommended Packet Roadmap"
description: "3-packet follow-on roadmap closing the 5 actionable items from the 10-iter deep-research investigation. Total effort: ~3-5 hours, 2-3 commits."
---

# Deep-Research Uplift Recommended Packet Roadmap

## Verdict from 10-iter Investigation

**PASS hasAdvisories=true.** 0 P0 / 2 actionable P1 / 3 actionable P2 — 5 total items after iter-7 adjudication filtered 9 false-positives + 4 outdated + 2 miscategorized from the original ~17 P1 candidates.

The deep-research skill is **shippable as-is**. The 3-packet roadmap below addresses quality polish, not blockers.

## Packet 1: `131-deep-skill-evolution/004-deep-research/004-iteration-ordering-fix`

| Field | Value |
|-------|-------|
| **Closes** | DR-006 |
| **Level** | 2 |
| **Effort** | S (small — ~5 LOC + 1 test) |
| **Dependencies** | none — ship first |
| **Risk if NOT shipped** | Iteration-10+ files lexical-sort before iteration-2; chronological dashboards distorted |

### Scope

Fix lexical sort bug at `.opencode/skills/deep-research/scripts/reduce-state.cjs:874`. Switch from default string sort to numeric sort on the trailing iter number.

### Implementation Sketch

```javascript
// Before
files.sort();
// After (parseInt extracts the NNN from iteration-NNN.md)
files.sort((a, b) => parseInt(a.match(/iteration-(\d+)/)?.[1] ?? '0', 10) - parseInt(b.match(/iteration-(\d+)/)?.[1] ?? '0', 10));
```

Add unit test: feed `['iteration-1.md', 'iteration-2.md', 'iteration-10.md', 'iteration-11.md']`; assert sorted to numeric order.

## Packet 2: `131-deep-skill-evolution/004-deep-research/005-uncovered-questions`

| Field | Value |
|-------|-------|
| **Closes** | DR-003 |
| **Level** | 3 (ADR for the surfacing contract + impl across reducer + dashboard) |
| **Effort** | M (medium — new fields in reducer + dashboard rendering + tests) |
| **Dependencies** | Packet 1 (shared reducer surface) |
| **Risk if NOT shipped** | 85% question-coverage convergence rule visible in docs but not in dashboards; operators can't debug stuck convergence |

### Scope

Surface uncovered questions in:
1. `reduce-state.cjs` output schema — add `uncoveredQuestions: string[]` field
2. `deep-research-dashboard.md` rendering — show "N questions still uncovered" + list
3. ADR-001 documenting the convergence-transparency contract

### Implementation Sketch

Extend the reducer's claim-coverage tracking to emit per-iter "uncovered" set. Dashboard renderer reads that field + lists.

## Packet 3: `131-deep-skill-evolution/004-deep-research/006-hygiene-fix-pack`

| Field | Value |
|-------|-------|
| **Closes** | DR-005, C-008, DR-008 (bundle of 3 P2s) |
| **Level** | 2 (bundled P2 fix-pack) |
| **Effort** | M (medium — 3 small surfaces; 1 commit) |
| **Dependencies** | Packets 1 + 2 (ship after the P1s land) |
| **Risk if NOT shipped** | Low — verification debt + duplicate rows in synthesis; not user-facing failures |

### Scope

Three small hygiene items:

1. **DR-005 negative knowledge dedup**: in reducer, dedup duplicate `ruledOut` rows by content-hash (otherwise repeated negative findings accumulate as duplicates)
2. **C-008 workflow YAML script-invocation verification**: lightweight grep check in CI / pre-commit hook that confirms YAML script paths exist + are executable
3. **DR-008 allowed-tools list pruning**: audit `.opencode/skills/deep-research/SKILL.md` frontmatter `allowed-tools:` — remove any entries that no longer reference live MCP tools (post-118)

### Implementation Sketch

Single fix-pack commit `chore(122): deep-research hygiene fix-pack — DR-005 + C-008 + DR-008`. Each fix is small + independent.

## Sequencing

```text
Packet 1 (DR-006 fix) → Packet 2 (DR-003 contract + impl) → Packet 3 (hygiene fix-pack)
```

Total wall-clock: ~3-5 hours of work across 2-3 commits.

## Out of Scope (DO NOT create packets for)

Per iter-3, iter-6, iter-7, iter-8 confirmations — these were either already-done OR adjudicated false-positive:

- Canonical companions for deep-research (already has feature_catalog/, manual_testing_playbook/, references/, graph-metadata.json)
- Runtime relocation (inherited from `deep-loop-runtime` v1.0.0)
- MCP removal (already shipped bilaterally in 118 phase 004)
- DB lifecycle (inherited)
- Path guards / executor config hardening (already in `deep-loop-runtime/scripts/lib/cli-guards.cjs`)
- Changelog accuracy (PASS in iter-6: 0 factual errors)
- Assets/references quality (healthy per iter-4 + iter-5)
- SKILL.md / README.md docs compliance (DQI healthy already)

## Cross-References

- Phase 001 research: `../001-research-deep-review-changes/research/research-report.md`
- Phase 002 applicability: `../002-applicability-analysis/applicability-table.md`
- 10 iter narratives + deltas: `../001-research-deep-review-changes/research/iterations/` + `.../deltas/`
- 118 arc predecessor: `../../003-deep-loop-runtime/spec.md`
