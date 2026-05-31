---
title: "Code Graph Phase 005-002: Code Graph Resilience Research"
description: "Deep-research packet that produced the verification battery, staleness model, recovery playbook and exclude-rule confidence tiers needed to gate Phase B of the /doctor:code-graph command. Converged after 7 iterations with all 4 deliverables shipped."
trigger_phrases:
  - "code graph resilience research"
  - "code graph staleness model"
  - "code graph recovery playbook"
  - "exclude-rule confidence tiers"
  - "code graph verification battery"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/002-code-graph-resilience-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor`

### Summary

The `/doctor:code-graph` Phase B (apply mode) needed four authoritative inputs before it could safely auto-fix issues: a verification battery to prove fixes worked, a staleness model to know when the graph was fresh enough for diagnostics, a recovery playbook to guide operator actions. Exclude-rule confidence tiers were also required to calibrate bloat-directory detection. Without these, the doctor command lacked a principled answer to "when is the code-graph index trustworthy and how do we recover when it is not."

A 7-iteration deep-research loop using the cli-copilot executor (gpt-5.5, reasoning-effort: high) converged with all 10 research questions answered and all 4 mandatory assets materialized. Iteration 3 ran a live SQLite `.recover` experiment on a temporary database copy. Iteration 7 synthesized findings into the four deliverables and the decision record, unblocking the sibling 006 doctor command's Phase B implementation.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| Deep-research loop converged | PASS. Iter 7 status=complete. Verdict CONVERGED in iter 7 markdown. |
| All 7 iterations produced canonical markdown + delta JSON | PASS. 7 iterations x 2 files each. No log-embedded recoveries. |
| State JSONL has 9 entries (init + executor + 7 iters) | PASS. |
| 4 mandatory assets exist with non-empty content | PASS. code-graph-gold-queries.json (10.8 KB). exclude-rule-confidence.json (8.9 KB). recovery-playbook.md (4.8 KB). staleness-model.md (5.0 KB). |
| Both JSON assets parse cleanly via python3 json.load | PASS. |
| Gold queries JSON has 28 queries with expected_count + expected_top_K_symbols shape | PASS. |
| Exclude-rule JSON has high/medium/low tiers | PASS. |
| Synthesis document has 10 or more file:line citations | PASS. Citations span 7+ source files in `mcp_server/code_graph/`. |
| decision-record.md frontmatter complete + body covers all decisions | PASS. |
| Strict spec validation 0/0 | PASS. Final run of `validate.sh --strict`. |
| Sibling 006 packet cross-references this packet | PASS. See 006 implementation-summary "Phase B promotion gated on 007". |

### Files Changed

| File | What changed |
|------|--------------|
| `research/iterations/iteration-001.md` through `research/iterations/iteration-007.md` (NEW) | Per-iteration findings covering Q3 through Q10. |
| `research/deltas/iteration-001.json` through `research/deltas/iteration-007.json` (NEW) | Per-iteration delta state for convergence tracking. |
| `research/deep-research-state.jsonl` (NEW) | 9 entries: init, executor, 7 iterations. |
| `research/research.md` (NEW) | Synthesis document with 10 or more file:line citations across `mcp_server/code_graph/`. |
| `assets/code-graph-gold-queries.json` (NEW) | 28-query verification battery with schema_version, pass_policy, per-query expected shapes. |
| `assets/staleness-model.md` (NEW) | 3-state freshness model (fresh, soft-stale, hard-stale) with observable conditions, trust-surface mapping, action mapping. |
| `assets/recovery-playbook.md` (NEW) | 3 idempotent procedures: CG-RP-001 SQLite corruption, CG-RP-002 partial-scan failure, CG-RP-003 bad-apply rollback. |
| `assets/exclude-rule-confidence.json` (NEW) | Tiered exclude classes with rationale and false-positive evidence across high, medium, low tiers. |
| `decision-record.md` (NEW) | Threshold and tier decisions with rationale. Covers 50-file selective-reindex switch, 8-hour soft-stale boundary, 24-hour hard-stale boundary. |

### Follow-Ups

- Build a runtime gold-battery harness. The pass_policy contract is materialized in `assets/code-graph-gold-queries.json`. No harness exists yet that drops a canonical symbol via an exclude rule, runs the queries against a `code_graph_query` MCP tool, then counts mismatches. That harness belongs to the 006 Phase B (apply mode) implementation.
- Measure NFR-P01 and NFR-P02 against the live runtime. The plan targets gold battery completion in under 30 seconds for repos under 10k files and recovery procedure completion in under 5 minutes. Neither target has been measured against the live code-graph runtime.
- Fix resolver failure modes in a follow-on scanner-uplift packet. Iteration 6 documented path aliases, dynamic imports, type-only imports, re-export barrels as trust limitations. Default-import aliasing was also enumerated. Closing those gaps was deferred to a separate packet.
- Expose edge-weight tuning via `IndexerConfig`. Edge weights are compile-time constants in the indexer producer. Drift detection signals are documented but per-edge-class weights have no runtime knob.
- Re-tune staleness age boundaries after 6 or more months of doctor apply-mode telemetry. The 8-hour and 24-hour thresholds are derived from Sourcegraph and ctags external evidence, not from this codebase's measured working-tree velocity.
