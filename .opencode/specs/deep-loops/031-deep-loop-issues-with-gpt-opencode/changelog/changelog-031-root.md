---
title: "Changelog: Deep-Loop Issues with GPT-Backed OpenCode [031-deep-loop-issues-with-gpt-opencode/root]"
description: "Packet-level rollup changelog for packet 031, deep-loop-issues-with-gpt-opencode, covering all seventeen phases from initial research through loop-guard hardening implementation."
trigger_phrases:
  - "031 root changelog"
  - "packet rollup changelog"
  - "deep loop gpt opencode packet changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode` (Level phase, phase parent)

### Summary

Packet 031 investigated and fixed GPT-backed OpenCode's deep-skill mis-routing problem across seventeen phases: research and decomposition, route-proof validation, agent-dispatch and command pre-route hardening, a blocked smoke test, a parked-then-closed host-identity investigation, six-lineage behavioral-hardening research, Mode-D and ai-council identity fixes, universal orchestrate routing, an ai-council reachability conversion, a detection-layer enforcement plugin, a real GPT-vs-Claude benchmark, a FIX-5 closure decision, a skill-doc drift audit and remediation, and a final loop-repeat-detection hardening pass on the enforcement plugin. Fifteen phases shipped real changes; one (005) was blocked/inconclusive without a clean pass; one (006) was parked and ultimately closed unimplemented.

### Before vs After

**Before**

GPT-backed models running inside OpenCode did not properly invoke deep skills (deep-research, deep-review, deep-context, deep-ai-council). The dispatch path relied on prose/prompt contracts rather than a hard runtime identity boundary, so GPT absorbed or misinterpreted deep LEAF roles, re-dispatched incorrectly, and ran slower than Claude even in fast mode, with no mechanical enforcement layer and no measured evidence of the actual gap.

**After**

Route-proof validation rejects wrong-mode dispatch records, `orchestrate.md` carries a complete, registry-resolved Priority table and Deep Route field on both runtime mirrors, the Mode-D self-classification gate is replaced with an evidence-based check across all 8 `/deep:*` commands, ai-council's route identity and reachability are corrected and deliberately narrowed to subagent-only, and a live-verified `tool.execute.before` plugin (`mk-deep-loop-guard.js`) mechanically flags or blocks both Deep Route mode mismatches and loop-like repeated `orchestrate`-to-loop-executor dispatches. A real GPT-vs-Claude benchmark measured zero semantic wrong-mode artifacts and zero route-proof mismatches, closing the parked host-hard-identity investigation as unnecessary. A dual-model skill-doc drift audit and remediation pass then brought every affected `SKILL.md`/reference/README back into sync with the shipped state.

**Impact**

The deep-loop dispatch path now has real registry-resolved routing, a live enforcement plugin covering both mismatch and loop-repeat detection, and measured evidence (not assumption) that the agent-layer fix is sufficient without host-runtime hard identity. Every skill doc touched by the program's own changes was independently audited and brought current.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-deep-agent-router-and-orchestration` | Complete (research) | 6-iteration research decomposing the fix into phases 002-006. |
| `002-route-proof-validation` | Complete | Route-proof fields close the false-negative that let wrong-mode artifacts pass as valid. |
| `003-agent-dispatch-hardening` | Complete | New `deep.md` primary router (both runtimes) + registry-backed `Deep Route:` dispatch field. |
| `004-command-pre-route-headers` | Complete | Resolved-route headers added before body prose across all 4 deep-mode prompt packs/commands. |
| `005-gpt-verification-smoke` | Blocked/inconclusive | GPT smoke attempts failed before reaching leaf dispatch on every mode; not a clean pass. |
| `006-host-hard-identity-fix5` | Closed, never implemented | Host-hard-identity spec stayed parked; closed by phase 013's evidence-based gate. |
| `007-gpt-behavioral-hardening-research` | Complete (research) | Six-lineage, two-round research; corrected its own round-1 ai-council route-proof claim. |
| `008-mode-d-ai-council-identity-fix` | Complete | Self-classification gate replaced with evidence-based check across 8 commands; ai-council route identity corrected. |
| `009-orchestrate-universal-routing` | Complete | Completed Priority table, registry-resolved Deep Route, NDP boundary, later bloat reduction. |
| `010-ai-council-subagent-only` | Complete | `ai-council.md` converted to `mode: subagent`, an explicit operator override of research's recommendation. |
| `011-deep-route-guard-plugin` | Complete | Built and live-verified the `tool.execute.before` mode-mismatch enforcement plugin (later renamed `mk-deep-loop-guard.js`). |
| `012-gpt-claude-benchmark` | Complete | Real GPT-vs-Claude benchmark: zero wrong-mode artifacts, zero route mismatches, 3-10x latency gap measured. |
| `013-fix5-checkpoint` | Complete | Closed phase 006 against phase 012's real results; agent-layer fix confirmed sufficient. |
| `014-skill-doc-drift-audit` | Complete | 20-iteration dual-fan-out audit confirmed 6 real skill-doc drift clusters from phases 008-013's changes. |
| `015-skill-doc-drift-remediation` | Complete | All 6 clusters fixed, plus 2 more residuals found by a follow-up adversarial review. |
| `016-mk-deep-loop-guard-hardening` | Complete (research) | 5-iteration dual-model research on loop-repeat detection; surfaced the `subagent_type="general"` gap. |
| `017-loop-guard-implementation` | Complete | Implemented loop-repeat detection + identity-resolution fix; live-verified with zero regression. |

### Added

- See each phase's own changelog in this directory for phase-level detail.

### Changed

- See each phase's own changelog in this directory for phase-level detail.

### Fixed

- See each phase's own changelog in this directory for phase-level detail.

### Verification

- Every shipped phase independently passed `validate.sh --strict` (0 errors / 0 warnings) before being marked Complete.
- Phase 011's plugin and phase 017's hardening were both live-verified against the real installed `opencode` host, not simulated.
- Phase 012's GPT-vs-Claude benchmark is the packet's central evidence source: zero semantic wrong-mode artifacts, zero route-proof mismatches, across 4 deep modes x 2 models.
- Phase 014's 20-iteration dual-fan-out audit was independently re-verified by 20 fresh Sonnet 5 agents with zero fabrications found.

### Files Changed

_No packet-level file-level detail recorded. See each phase's own changelog for full file-level detail._

### Follow-Ups

- Phase 006 (host-hard-identity/FIX-5) is closed but explicitly reopenable on fresh contrary evidence (a future report of semantic wrong-mode artifacts or a route-proof mismatch).
- Phase 008 flagged `.opencode/commands/prompt.md` as carrying the same pre-fix Mode-D pattern, outside its declared scope — not yet fixed.
- Phase 010 left `markdown.md`'s own `mode: all` untouched — a natural follow-up if cross-runtime consistency becomes the driving concern.
- Phase 015 flagged a genuine, pre-existing routing-matrix contradiction in `agent_delegation.md` as out of scope — not fixed.
- Phase 016/017 left Design Option C (a prompt-shape companion guard) and a `prompt-improver` registry entry as viable, unimplemented future work.
