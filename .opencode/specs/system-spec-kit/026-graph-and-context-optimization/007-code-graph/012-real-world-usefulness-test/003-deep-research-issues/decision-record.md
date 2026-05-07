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
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:decision-record -->
## ADR-001: Dedupe by Root Cause

**Status**: Accepted  
**Date**: 2026-05-06  
**Decision**: Deduplicate findings by behavioral root cause, then keep test, documentation, and configuration gaps as separate P1/P2 items only when they require distinct work.

The research loop produced overlapping evidence around the same failure chain: default scope excludes maintainer code, read paths block on full-scan readiness, empty scans can promote zero nodes, and parser errors can overwrite useful graph state. Counting every repeated symptom as a separate root cause would make the follow-up remediation packet noisy. The original synthesis kept three P0s as primary behavior blockers and placed supporting test/doc gaps under P1/P2.

**2026-05-06 correction**: user clarification reclassifies the default-scope finding as design intent. The corrected P0 set is F-002 and F-003 only; F-001 is closed as DESIGN-INTENT.

## ADR-002: Prioritize Code Graph Reliability Before Auto-Rescan

**Status**: Accepted  
**Date**: 2026-05-06  
**Decision**: Recommend fixing zero-node promotion, parser-error persistence, and structured readiness reasons before enabling production read-path auto-rescan. Scope-policy changes are maintainer-mode polish, not end-user blockers.

`ensureCodeGraphReady()` already has inline full-scan machinery, but the native failure chain shows a full scan can currently be destructive when scan results are empty or parse health is wrong. Auto-rescan should not become default until candidate scans can be classified and quarantined safely. The remediation backlog therefore orders safety guards before read-path convenience.

## ADR-003: Treat Runtime Configuration as Part of Remediation

**Status**: Accepted  
**Date**: 2026-05-06  
**Decision**: Include runtime startup configuration, hook smoke docs, and advisor staleness checks in the same remediation scope instead of limiting Phase 014 to code graph internals.

The day-to-day failure is partly code and partly launch environment. Hook smoke coverage is asymmetric, advisor repair can skip mixed live/absent states, and framework maintainers may still need explicit maintainer-mode scope flags across runtimes. A code-only fix would leave operators with the same confusion under different runtimes, so the follow-up packet should close the integration loop as well.

**2026-05-06 correction**: `opencode.json` maintainer-scope flags versus `.codex/config.toml` parity is maintainer-only. It remains useful polish for contributors to this framework, but it is not a default setup requirement for template users.

## ADR-004: Code Graph Default Scope Is Working As Designed

**Date**: 2026-05-06  
**Decision**: ACCEPTED.

**Context**: User clarification on 2026-05-06 states that the code graph default scope excluding `.opencode/skills/**`, `agent/**`, `command/**`, `specs/**`, and `plugins/**` is intentional. The code graph is primarily for indexing the user's production code, such as web app and project code, not the framework backend. Template users will not maintain `.opencode/` skills; they will use the code graph on their own project files.

**Implication**: F-001 (default scope excludes `.opencode/**`) is reclassified from P0 to DESIGN-INTENT. F-005 (`.codex/config.toml` lacks `SPECKIT_CODE_GRAPH_INDEX_*`) and F-004 (invalid env token handling) are demoted to P2 maintainer-only, since end users should not need those env vars.

**What stays P0**: F-002 (zero-node scan wipes populated graph) and F-003 (parse-error persistence overwrites prior successful content), because both affect end users indexing their own codebase, not just maintainers.

**Documentation impact**: Replace any "you must set `SPECKIT_CODE_GRAPH_INDEX_SKILLS`" recommendation with a maintainer-mode-only note. Do not recommend it as a default for new template users.
<!-- /ANCHOR:decision-record -->
