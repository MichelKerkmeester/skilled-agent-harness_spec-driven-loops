---
title: "Code Graph Phase 012/001: Real-World Usefulness Test Execution"
description: "Sandbox-based execution child packet for the real-world usefulness campaign. Ran code-graph query trials, hook integration trials, advisor trials, Gate 3 classification trials, and runtime-smoke trials. Produced a synthesis report mapping usefulness signals to deferred remediation cells."
trigger_phrases:
  - "012 001 execution"
  - "real world usefulness test execution"
  - "sandbox usefulness trial"
  - "code graph usefulness trial"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-05

> Spec folder: `026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/001-sandbox-usefulness-trials` (Level 2)
> Parent packet: `026-graph-and-context-optimization/004-code-graph`

### Summary

The Phase 012 campaign needed a first-pass execution to measure whether code-graph, hook, advisor, Gate 3, and runtime-integration surfaces were useful in day-to-day engineering tasks. The execution packet ran sandbox-based trials across five surface categories.

The trials used sandbox-limited environments (no live MCP server, no external tool access) to control for infrastructure noise. Each trial ran a real engineering scenario (e.g. "find the callers of this function," "what code-graph readiness do I get on startup," "does the advisor recommend the right skill for this prompt") and recorded the outcome: useful, partially useful, or not useful.

The synthesis report mapped each trial outcome to a deferred remediation cell. Cells that passed were marked READY. Cells that failed partially were deferred to the Phase 012/002 native rerun. Cells that failed entirely were escalated to the Phase 012/003 deep-research sweep.

Key signals from the synthesis:

- **Code-graph queries.** End-user scope queries were useful. Broad-scope queries crashed the parser on approximately 17 percent of files. The broad-scope crash was deferred to the 012/007 tree-sitter resilience investigation.
- **Hook integration.** Startup payload surfaced correctly in Claude, Gemini, and Codex runtimes. Copilot runtime showed a partial failure in structured-payload transport (deferred to 012/002).
- **Advisor.** Advisor recommendations were correct for 12 of 15 test prompts. Three prompts returned wrong recommendations due to stale skill-graph cache (deferred to 012/002).
- **Gate 3 classification.** File-modification detection classified 18 of 20 sample prompts correctly. Two false positives on read-only review prompts were deferred to the 012/003 sweep.
- **Runtime smoke.** All four runtimes started and produced structured startup payloads. Copilot showed the same partial failure noted under hook integration.

### Added

- Synthesis report documenting trial outcomes across all five surface categories
- Deferred remediation cell mapping for cells requiring native rerun (012/002) or deep research (012/003)

### Changed

- None. Execution-only phase.

### Fixed

- None. Execution-only phase.

### Verification

- Synthesis report produced with all five surface categories mapped.
- Trial-log entries for each scenario with outcome classification (useful, partially useful, not useful).
- Deferred-cell mapping complete for handoff to 012/002 and 012/003.

### Files Changed

| File | What changed |
|------|--------------|
| `synthesis-report.md` (NEW) | Trial-outcome synthesis and deferred-cell mapping |
| `trial-logs/` (NEW) | Per-scenario trial logs with outcome classification |

### Follow-Ups

- **Broad-scope parser crash.** Deferred to Phase 012/007 tree-sitter parser resilience investigation.
- **Copilot runtime payload transport.** Deferred to Phase 012/002 native rerun.
- **Stale skill-graph cache in advisor.** Deferred to Phase 012/002 native rerun.
- **Gate 3 false positives on read-only prompts.** Deferred to Phase 012/003 deep-research sweep.
