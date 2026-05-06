---
title: "Decision Record: Deep Research Issues [template:level_3/decision-record.md]"
description: "Supplemental ADRs documenting synthesis decisions for the Level 2 deep research issues packet."
trigger_phrases:
  - "deep research decision"
  - "synthesis ADR"
  - "remediation scope decision"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deep Research Issues

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:decision-record -->
## ADR-001: Dedupe by Root Cause

**Status**: Accepted  
**Date**: 2026-05-06  
**Decision**: Deduplicate findings by behavioral root cause, then keep test, documentation, and configuration gaps as separate P1/P2 items only when they require distinct work.

The research loop produced overlapping evidence around the same failure chain: default scope excludes maintainer code, read paths block on full-scan readiness, empty scans can promote zero nodes, and parser errors can overwrite useful graph state. Counting every repeated symptom as a separate root cause would make the follow-up remediation packet noisy. The synthesis keeps the three P0s as the primary behavior blockers and places supporting test/doc gaps under P1/P2.

## ADR-002: Prioritize Code Graph Reliability Before Auto-Rescan

**Status**: Accepted  
**Date**: 2026-05-06  
**Decision**: Recommend fixing scope policy, zero-node promotion, parser-error persistence, and structured readiness reasons before enabling production read-path auto-rescan.

`ensureCodeGraphReady()` already has inline full-scan machinery, but the native failure chain shows a full scan can currently be destructive when scope or parse health is wrong. Auto-rescan should not become default until candidate scans can be classified and quarantined safely. The remediation backlog therefore orders safety guards before read-path convenience.

## ADR-003: Treat Runtime Configuration as Part of Remediation

**Status**: Accepted  
**Date**: 2026-05-06  
**Decision**: Include runtime startup configuration, hook smoke docs, and advisor staleness checks in the same remediation scope instead of limiting Phase 014 to code graph internals.

The day-to-day failure is partly code and partly launch environment. `opencode.json` has maintainer-scope flags while `.codex/config.toml` does not, hook smoke coverage is asymmetric, and advisor repair can skip mixed live/absent states. A code-only fix would leave operators with the same confusion under different runtimes, so the follow-up packet should close the integration loop as well.
<!-- /ANCHOR:decision-record -->
