---
title: "Changelog: Phase 3: promote-results [149-kimi-k2-7-code-support/003-promote-results]"
description: "Chronological changelog for promoting the first Kimi bakeoff result into the registry as an interim placeholder."
trigger_phrases:
  - "phase changelog"
  - "promote results"
  - "kimi run 006"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support/003-promote-results` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support`

### Summary

This phase did not pretend an inconclusive bakeoff had chosen a framework. It folded run 006 into the registry and model profile as evidence that correctness saturated, then kept `primary: rcaf` and `status: default-unverified` because the rule was TIE or INCONCLUSIVE means keep the default and record why. Phase 004 later superseded this placeholder with run 007, moving the live state to `primary: costar`, `fallback: tidd-ec`, `avoid: [rcaf]`, `status: empirical` and evidence `007-kimi-k2.7-discriminating`.

### Added

- None.

### Changed

- Re-read `minimax-m3.md` and `mimo-v2.5-pro.md` §3 and §4 as the citation pattern.
- Confirmed the verdict class was TIE and the resulting status decision was to keep `default-unverified` and retain RCAF.
- Edited `model-profiles.json#kimi-k2.7-code.recommended_frameworks` to keep `primary: "rcaf"` and `preplanning_density: "medium"`, since the TIE gave no reason to change them.
- Kept `status: "default-unverified"` and recorded the reason in `evidence.sample`: no trustworthy winner, RCAF retained as the convention default.
- Treated `check-prompt-quality-card-sync.sh .` as the orchestrator's closing gate after registry and reference edits.
- Confirmed registry §3 and §4 already matched with `primary: rcaf`, status `default-unverified` and run 006 cited.
- Ran `validate.sh --strict` on both children at exit 0.
- Left parent plus tree-wide strict sweep as the orchestrator's closing gate.

### Fixed

- Read run 006 `synthesis.md` and confirmed verdict TIE, inside noise floor.
- Confirmed correctness was saturated, there was no primary score, all frameworks pinned at correctness 1.0 and confidence was low.
- Set `evidence.benchmark` to `006-kimi-k2.7-prompt-framework`.
- Set `primary_score` and `fallback_score` to null because correctness saturated and there was no ranking score.
- Wrote the evidence sample describing the TIE, saturation and subjective secondary ranking.
- Set evidence `confidence: "low"`.
- Rewrote §1 Core Principle, §3 Recommended Framework and §4 Benchmark Evidence of `references/models/kimi-k2.7-code.md` to report the TIE and saturated result.
- Recorded the subjective secondary ranking with its caveat.
- Stated that framework choice did not affect correctness for this model and RCAF was retained.

### Verification

| Check | Result |
|-------|--------|
| Card-sync guard | PASS: `bash .opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh .` was the orchestrator closing gate, and registry §3 and §4 already matched. |
| Strict validation | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <children> --strict` exited 0 on both children, with parent plus tree-wide sweep owned by the orchestrator's closing gate. |
| Framework status | PASS: `recommended_frameworks.status` stayed `default-unverified` with a documented TIE reason in `evidence.sample`. |
| Reference parity | PASS: `kimi-k2.7-code.md` §1, §3 and §4 reported the TIE, matched the registry, retained RCAF, cited run 006 and aligned `_index.md` at phase close. |
| Supersession note | PASS: phase 004 later replaced this state with run 007, COSTAR and empirical status. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `model-profiles.json` | Updated | Kept `kimi-k2.7-code.recommended_frameworks.primary: rcaf` and `status: default-unverified`, then populated evidence with benchmark 006, null scores, TIE and saturation sample and confidence low. |
| `references/models/kimi-k2.7-code.md` | Updated | Rewrote §1, §3 and §4 to report the TIE, the subjective secondary ranking with caveat and the statement that framework choice does not affect correctness, so RCAF was retained. |
| `references/models/_index.md` | Updated | Status note changed to `default-unverified (bakeoff 006: TIE, correctness-saturated)`. |
| `Parent spec.md phase map` | Updated | Phases 2 and 3 flipped to Complete. |

### Follow-Ups

- This phase's promotion did not make RCAF empirical for Kimi K2.7 Code. It recorded that run 006 could not discriminate frameworks, so the status stayed as phase 001 set it and only the evidence was populated.
- Phase 004 later flipped the registry to empirical with COSTAR, so `default-unverified` is no longer the live state.
- No empirical winner existed from run 006. At this phase close, the dispatch recommendation was still the convention default, not a measured best.
- The follow-up bakeoff with harder, less-saturating fixtures became phase 004, run 007, which discriminated and promoted COSTAR while retiring RCAF.
- The COSTAR and CIDI clarity edge from the `gpt-5.5` judge was advisory only. It was subjective and not strong enough to change the primary.
- Card-sync and tree-wide validate were the closing gate. Both children validated at exit 0, while the full parent plus children strict sweep and card-sync guard run stayed with the orchestrator's final step.
