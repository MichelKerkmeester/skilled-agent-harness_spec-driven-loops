---
title: "Code Graph Phase 012: Real-World Usefulness Test"
description: "Phase parent rollup for the 7-child real-world usefulness test campaign. Scoped the validation of code graph, hooks, and plugin/runtime integrations against day-to-day engineering tasks. Seven children executed sandbox trials, native reruns, deep research, remediation, scope guarding, cluster polishing, and tree-sitter parser resilience."
trigger_phrases:
  - "012 real world usefulness test"
  - "code graph usefulness test"
  - "hook usefulness validation"
  - "026/007/012 rollup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2, Phase Parent)

### Summary

The code-graph, hooks, and plugin/runtime integrations had shipped through 11 phases of upgrades. Each phase was verified in isolation. No phase asked: does this actually help an engineer get work done?

The Phase 012 campaign answered that question through 7 child phases (001 through 007). The campaign ran sandboxable code-graph and hook trials, native reruns of deferred cells, a 10-iteration deep-research sweep, P0/P1 remediation, scope-guard defense, a five-cluster polishing pass, and a 7-iteration tree-sitter parser resilience fix that dropped the crash rate from 17.5 percent to 0.72 percent.

The campaign confirmed that the code-graph and hook surfaces work in day-to-day engineering scenarios. The key gap was broad-scope parser crashes, which the 007 child phase fixed. After all 7 children shipped, the code-graph system was hardened from "internal tool that could break" to "production system that operators can rely on."

### Included Phases

The 012 track has 7 child phases. Each has its own changelog:

| Child | Date | Title | Changelog |
|-------|------|-------|-----------|
| 012/001 | 2026-05-05 | Real-World Usefulness Test Execution | [changelog-012-001-sandbox-usefulness-trials.md](./changelog-012-001-execution.md) |
| 012/002 | 2026-05-05 | Native Rerun of Deferred Usefulness Cells | [changelog-012-002-native-deferred-trial-rerun.md](./changelog-012-002-native-rerun.md) |
| 012/003 | 2026-05-06 | Deep Research Issues | [changelog-012-003-code-graph-bug-surface-research.md](./changelog-012-003-deep-research-issues.md) |
| 012/004 | 2026-05-06 | Index Can No Longer Be Wiped | [changelog-012-004-zero-node-and-parser-remediation.md](./changelog-012-004-remediation.md) |
| 012/005 | 2026-05-06 | Scope Changes Need Explicit Consent | [changelog-012-005-scope-change-scan-guard.md](./changelog-012-005-scope-guard.md) |
| 012/006 | 2026-05-06 | Cluster A to E Polish | [changelog-012-006-readiness-hooks-advisor-polish.md](./changelog-012-006-cluster-a-to-e.md) |
| 012/007 | 2026-05-06 | Tree-sitter Parser Resilience | [changelog-012-007-tree-sitter-parser-crash-resilience.md](./changelog-012-007-tree-sitter-parser-resilience.md) |

### Added

- Real-world validation campaign spanning all 7 child phases
- Sandbox-based usefulness trial infrastructure with synthesis reporting
- Native-rerun protocol for cells deferred by the sandbox campaign
- 10-iteration deep-research sweep identifying and classifying all known code-graph and hook issues
- P0 remediation: zero-node scan rejection and scope-guard defense
- Five-cluster medium-priority polish (diagnostics surfacing, auto-rescan, verify endpoint path, and two more)
- Tree-sitter parser skip-list and quarantine sentinel reducing crash rate from 17.5 percent to 0.72 percent

### Changed

- Code-graph scan pipeline: zero-node scans now rejected, scope changes require explicit consent
- Code-graph status handler: diagnostics surfaced, stale-graph highlights added
- Code-graph parser: skip-list pre-filter, B1/B2 classification, quarantine on B2 cascade
- Real-world verdict: code-graph downgraded from READY to OVERHEAD pending the tree-sitter fix, then restored after the 012/007 fix

### Fixed

- A zero-node scan could wipe a populated 56k-node graph. Now rejected by forceZeroNodeReset gate.
- A smaller scoped scan over a larger index silently shrank it. Now requires forceScopeChange flag.
- The verify endpoint path pointed at a non-existent directory. Now correct.
- Broad-scope scans crashed on 17.5 percent of files. After skip-list and quarantine, 0.72 percent.

### Verification

- All 7 child phases verified independently. See each child changelog for per-phase verification details.
- Live MCP verification: broad-scope scan on 9,391 files completed without B2 cascade.
- Strict packet validation (`validate.sh --strict`): phase parent passed with zero errors.

### Files Changed

| File | What changed |
|------|--------------|
| `011-real-world-usefulness-test-planning/001-sandbox-usefulness-trials/` | Sandbox usefulness trials and synthesis |
| `011-real-world-usefulness-test-planning/002-native-deferred-trial-rerun/` | Native rerun protocol and backlog fixes |
| `011-real-world-usefulness-test-planning/003-code-graph-bug-surface-research/` | 10-iteration deep-research sweep |
| `011-real-world-usefulness-test-planning/004-zero-node-and-parser-remediation/` | P0 zero-node scan rejection |
| `011-real-world-usefulness-test-planning/005-scope-change-scan-guard/` | P1 scope-change force flag |
| `011-real-world-usefulness-test-planning/006-readiness-hooks-advisor-polish/` | Medium-priority cluster polish |
| `011-real-world-usefulness-test-planning/007-tree-sitter-parser-crash-resilience/` | Parser skip-list and quarantine sentinel |

### Follow-Ups

- **Usefulness verdict reevaluation.** The code-graph was downgraded to OVERHEAD in Phase 012/002 due to parser crashes. After the 012/007 fix, it was restored. A follow-up reevaluation with the post-fix system in day-to-day use over 2+ weeks is recommended.
- **Quarterly skip-list review.** Files added to the parser skip-list at runtime do not auto-unskip. A quarterly operator review workflow should check if the upstream tree-sitter-bash bug has been fixed and `DELETE` the entries if so.
