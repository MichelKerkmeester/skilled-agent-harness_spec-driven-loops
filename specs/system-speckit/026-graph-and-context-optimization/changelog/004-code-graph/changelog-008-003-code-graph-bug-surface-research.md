---
title: "Code Graph Phase 008-003: Bug Surface Research"
description: "Ten-iteration read-only sweep over code graph, hooks/plugin and advisor surfaces. Produced a corrected remediation backlog: P0=2 end-user blockers, P1=16 required fixes, P2=12 suggestions, one DESIGN-INTENT closure. Converged after 10 iterations with all required research artifacts shipped."
trigger_phrases:
  - "code graph bug surface research"
  - "zero-node scan promotion"
  - "parser error persistence"
  - "deep research 008-003"
  - "bug surface remediation backlog"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/003-code-graph-bug-surface-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

After the native rerun in 012/002 exposed broad scan regressions, the code graph and adjacent runtime surfaces had no unified bug inventory. Operators lacked severity classification, file:line evidence or a corrected framing of what counted as an end-user defect versus a framework-maintainer concern.

A 10-iteration read-only research loop swept code graph scan and read-path handlers, hook and plugin contracts, the advisor and skill-graph subsystem, CocoIndex handoff contracts and test coverage. The raw delta stream totaled P0=3, P1=19, P2=13 across all iterations. A user clarification on 2026-05-06 corrected one core premise: default scope excluding `.opencode/skills/**` and related framework paths is intentional for template users indexing their own project code, not a bug. The corrected deduplicated counts are P0=2 end-user blockers, P1=16 required fixes, P2=12 suggestions and DESIGN-INTENT closed=1.

The two remaining P0 blockers are F-002 (zero-node full scan can wipe a populated graph at `scan.ts:292`) and F-003 (parser-error persistence overwrites prior successful graph content at `ensure-ready.ts:467`). The research synthesis at `research/research.md` provides file:line citations, remediation order and a negative knowledge section. A follow-up remediation packet should address the P0 blockers before enabling automatic read-path rescans.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| Iteration artifacts present | PASS: 10 markdown reports (`research/iterations/iteration-001.md` through `iteration-010.md`) and 10 delta JSONL files (`research/deltas/iter-001.jsonl` through `iter-010.jsonl`) read |
| Required synthesis sections | PASS: `research/research.md` contains executive summary, methodology, severity view, axis view, primary-question answers, remediation scope, env snippets, negative knowledge, iteration index and convergence note |
| Framing correction applied | PASS: F-001 closed as DESIGN-INTENT, F-004 and F-005 reclassified to maintainer-only P2 |
| Resource map exists | PASS: `research/resource-map.md` groups every finding citation by subsystem |
| Parent metadata updated | PASS: parent `children_ids` includes this packet |
| Strict spec validation | PASS: `validate.sh --strict` exited 0 |
| Tasks complete | PASS: 30 completed task items recorded |

### Files Changed

| File | What changed |
|------|--------------|
| `research/research.md` (NEW) | Canonical final report. P0=2, P1=16, P2=12, DESIGN-INTENT closed=1. File:line citations for all findings. |
| `research/resource-map.md` (NEW) | Citation ledger grouped by subsystem for the next implementer |
| `research/deep-research-strategy.md` (NEW) | Research charter defining the 10-dimension sweep |
| `research/deep-research-config.json` (NEW) | Research loop configuration |
| `research/iterations/` (NEW) | Ten iteration reports covering code graph, hooks/plugin, advisor, CocoIndex and test coverage surfaces |
| `research/deltas/` (NEW) | Ten JSONL delta records tracking finding progression across iterations |
| `decision-record.md` (NEW) | Supplemental ADRs documenting synthesis choices |
| Packet docs (NEW) | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` |
| `../graph-metadata.json` | Updated: parent `children_ids` extended with this packet |

### Follow-Ups

- Open a remediation packet targeting F-002 (zero-node scan promotion guard at `scan.ts:292`) and F-003 (parser-error graph preservation at `ensure-ready.ts:467`) before enabling automatic read-path rescans.
- Track affected filenames for parser out-of-bounds crashes. The native artifacts preserved crash count and message but not the file list.
