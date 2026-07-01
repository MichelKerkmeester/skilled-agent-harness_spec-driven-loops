---
title: "Changelog: GPT Behavioral Hardening Research [031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research]"
description: "Chronological changelog for the GPT Behavioral Hardening Research phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research` (Level 1, research)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode`

### Summary

Two-round, six-lineage deep-research investigation (GLM-5.2, GPT-5.5-fast, Claude Sonnet 5, Claude Opus 4.8) answered all 9 key questions, self-corrected a wrong round-1 claim about the ai-council route-proof validator via independent 2-vs-1 convergence, and produced the recommended phase 008-012 breakdown.

### Added

- Added a new `"max"` reasoning-effort enum value to the shared `executor-config.ts` schema (GLM-5.2's own native ceiling, previously capped at `"xhigh"` which GLM doesn't recognize) — a shared-runtime change affecting all deep-loop workflows.

### Changed

- `executor-config.ts` — new `"max"` reasoning-effort enum value.
- `deep_research_presentation.txt` / `deep_review_presentation.txt` — docs updated to match.
- `research-prompt.md` — amended with a new §9 charter for round 2's critical re-review.

### Fixed

- No code bugs; the research corrected its own internal error mid-investigation (round 1's claim that the ai-council route-proof validator is a "guaranteed FAIL" was wrong — it actually passes on non-canonical values, a subtler defect).

### Verification

- `npx vitest run` on affected schema/fanout files — 100/102 passed, 2 failures confirmed pre-existing/flaky by isolated re-run.
- All 6 lineages confirmed the anti-convergence fix held (`max_iterations` stop reason).
- `bash validate.sh --strict` — PASS, 0 errors / 0 warnings.
- No `checklist.md` for this phase (research-only).

### Files Changed

| File | Action | What changed |
|---|---|---|
| `research/research.md` | Created | Final consolidated two-round synthesis |
| `research-prompt.md` | Modified | §9 added for round-2 critical re-review |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | Added `"max"` reasoning effort |
| `.opencode/commands/deep/assets/deep_research_presentation.txt` | Modified | Docs updated to match |
| `.opencode/commands/deep/assets/deep_review_presentation.txt` | Modified | Docs updated to match |

### Follow-Ups

- Confirm a genuine `OPENCODE_PID`-free external shell exists before phases 011/012 — later confirmed in phase 012.
- GLM's silent quota-exhaustion hang (not distinguished from genuine long reasoning) flagged as a deep-research runtime robustness gap, independent of this packet.
- Stdout-salvage recovery needed for most GPT/Opus iterations — a runtime robustness gap worth investigating separately.
- Mode-D magnitude confirmed-in-mechanism but not measured across all modes/models — deferred to phase 012's benchmark.
- The entire phase 008-012 chain depends on the external-shell precondition, not yet confirmed at time of writing.
