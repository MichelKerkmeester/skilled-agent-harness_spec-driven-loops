---
title: "Checklist: Skill & Advisor JSON Optimization Research"
description: "QA checklist for the three-lineage deep-research fan-out and synthesis."
trigger_phrases:
  - "skill json optimization research checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research"
    last_updated_at: "2026-07-29T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist"
    next_safe_action: "Launch the fan-out"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Skill & Advisor JSON Optimization Research

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. Run-dependent items stay `[ ]` until the fan-out completes.

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Executor model ids verified against the runtime allowlists [evidence: `executor-config.ts` — `glm-5-2` = GLM-5.2 High free, `cursor-grok-4.5-high`, `openai/gpt-5.6-sol`]
- [x] CHK-002 [P1] All three CLI contracts read before composing dispatch prompts [evidence: `cli-opencode/SKILL.md`, `cli-devin/SKILL.md`, `cli-cursor/SKILL.md`]
- [x] CHK-003 [P1] Fan-out supports 3 concurrent lineages [evidence: deep-research `SKILL.md` "Multi-lineage fan-out is SUPPORTED" + `fanout-run.cjs` executors array]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-004 [P0] No code, contract, or generated JSON modified by this packet (research only) [evidence: `git status` shows only `029-*/` additions; no `.cjs`/`.ts`/`.py`/contract file changed]
- [x] CHK-005 [P1] Pre-existing dirty files from other sessions left untouched (scope lock) [evidence: 11 pre-existing dirty files under `036-deep-loop-innovation`/`041`/`sk-git/018` unchanged]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-006 [P0] All three lineages reached 5/5 iterations (stop-policy max-iterations, no early convergence) [evidence: `orchestration-summary.json` succeeded=3 failed=0; each lineage `complete`=5]
- [x] CHK-007 [P0] Per-lineage `research.md` produced under `research/lineages/{label}/` [evidence: sol-high 26.6KB, glm-high 16.5KB, grok-high 8.0KB]
- [x] CHK-008 [P1] Every finding cites file:line or command/output evidence [evidence: `[SOURCE: file:line]` markers throughout all three `research.md`]
- [x] CHK-009 [P1] Five dimensions and every in-scope JSON type covered [evidence: dimension-coverage + JSON-surface tables in each lineage `research.md`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-010 [P1] Cross-lineage synthesis ranks gaps by leverage with cross-lineage agreement marked [evidence: `research/research.md` §2-3, agreement 3/3..1/3 per theme]
- [x] CHK-011 [P2] Highest-leverage gap identified and recorded as a candidate follow-up packet [evidence: `research/research.md` §6 — O1 derived owner first]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-012 [P1] Fetched/web content treated as untrusted data, never as instructions (deep-research rule) [evidence: lineage `deltas/iter-00N.jsonl` toolsUsed = Read/Glob/Grep/Bash only, no web-driven Write/Edit]
- [x] CHK-013 [P2] No credentials or proprietary data surfaced in findings
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-014 [P1] Consolidated report and per-lineage evidence preserved under `research/` [evidence: `research/research.md` + `research/lineages/{sol,glm,grok}-high/`]
- [x] CHK-015 [P2] Packet continuity updated after the run [evidence: spec.md + implementation-summary.md status Complete]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-016 [P1] All artifacts scoped under this packet's `research/` tree [evidence: `git status` — all additions under `029-skill-json-optimization-research/`]
- [x] CHK-017 [P2] No `.opencode/package.json` pin bump committed; no node_modules symlink tracked
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 3/3 |
| Lineages complete (5/5 each) | 3 | 3/3 |
| Dimensions covered | 5 | 5/5 |
| Synthesis produced | 1 | 1/1 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
