---
title: "Deep-Research Investigation of System-Spec-Kit MCP Sidecar: Drift, Dead Code, Security, Over-Engineering, Simplification, Refinement"
description: "20-iteration deep-research investigation of the system-spec-kit MCP sidecar surface. Produced a final synthesis with 110 deduplicated findings across 6 angles: 3 P0, 39 P1, 68 P2. No source code modified. Remediation deferred to follow-on packets."
trigger_phrases:
  - "sidecar deep-research drift simplification"
  - "system-spec-kit mcp sidecar investigation"
  - "sidecar 110 findings synthesis"
  - "arc 010 phase 015 research"
  - "sidecar drift dead code security"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

The system-spec-kit MCP sidecar surface had grown quickly across TypeScript client and worker code, a Node ensure helper and supporting embedder lifecycle logic. Recent churn raised the risk that dead paths, duplicated abstractions, stale assumptions, local-service security gaps and unnecessary complexity were hiding in code on a critical retrieval path.

A 20-iteration deep-research investigation ran across six angles: drift detection, dead code, security risks, over-engineering, simplification opportunities without function loss and refinement candidates. The executor mix completed as configured: 10 cli-devin SWE-1.6 iterations and 10 cli-opencode DeepSeek-v4-pro high iterations. The final synthesis in `research/research.md` produced 110 deduplicated findings (3 P0, 39 P1, 68 P2) with per-angle narratives, top themes, adversarial spot-checks on the five highest-severity items and remediation packet suggestions. No source code was modified. Remediation is deferred to follow-on packets.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Iteration count | Passed | 20 iteration markdown files present under `research/iterations/iteration-001.md` through `iteration-020.md`. |
| Executor mix | Passed | 10 cli-devin SWE-1.6 iterations and 10 cli-opencode DeepSeek-v4-pro high iterations from config schedule. |
| Finding registry | Passed | 110 findings: 3 P0, 39 P1, 68 P2 recorded in `research/findings-registry.json`. |
| Adversarial spot-check | Passed | F12, F13, F47, F86, F87 re-read against source files and tests. Zero changes to severity or wording. |
| Strict validation | Passed | `validate.sh .../015-deep-research-drift-and-simplification --strict` and `validate.sh .../009-memory-leak-remediation --strict` both exited 0. |
| Synthesis artifact | Passed | `research/research.md` contains 10-anchor synthesis report with by-angle counts, top themes, P0/P1 prioritization and commit handoff. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/research.md` (NEW) | Created | Final 10-anchor synthesis report with 110 findings, by-angle narratives, adversarial spot-checks, remediation packet suggestions, limitations. |
| `research/findings-registry.json` | Updated | 110 deduplicated findings indexed by severity and angle. |
| `research/deep-research-state.jsonl` | Appended | Final synthesis event with severity counts appended. |
| `research/iterations/iteration-001.md` through `iteration-020.md` (NEW) | Created | 20 evidence-based iteration markdowns covering the six investigation angles. |
| `implementation-summary.md` | Updated | Completion state, verification evidence, limitations added. |

### Follow-Ups

- Plan targeted remediation packets from the P0 and P1 findings in `research/findings-registry.json`.
- Cluster related findings by root cause before assigning to individual fix packets to avoid duplicated work across angles.
