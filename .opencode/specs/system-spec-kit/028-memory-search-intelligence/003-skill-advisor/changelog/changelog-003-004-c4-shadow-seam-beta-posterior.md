---
title: "Changelog: Skill Advisor Shadow Seam and Beta Posterior"
description: "Chronological changelog for the Skill Advisor shadow seam and Beta posterior shadow-only build phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/004-c4-shadow-seam-beta-posterior` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

This phase shipped the Skill Advisor reliability-learning path as a shadow-only build. It adds a shared Beta-posterior reliability primitive, an out-of-process promoter that consumes the calibration proposals the estimator already writes, and the conservative two-gate, held-out attestation and decay policy that decides whether a lane weight should move. Everything stays shadow-only: the live recommend path is byte-identical and the live lane weights are frozen. Live promotion stays a no-go until a micro-benchmark, real per-lane attribution and a daemon reload trigger exist.

### Added

- `lib/scorer/beta-reliability.ts`: the shared Beta posterior `(a0+s)/(a0+b0+s+f)` with a neutral Beta(1,1) cold-start prior, plus pure-policy helpers for asymmetric sink deltas, two-gate promotion with reachability validation, held-out attestation and reversible decay un-promotion.
- `lib/scorer/shadow-weight-promoter.ts`: an out-of-process cron promoter that folds proposals into the posterior, applies the gate family and writes the shadow weight channel only.
- A content-addressed fold so replay or double-delivery folds to the same result.
- Focused coverage for the posterior math, the gate policy and the promoter seam.

### Changed

- The estimator's calibration proposals finally have a consumer: the promoter reads the append-only JSONL the estimator writes and never touches the live channel.
- `feedback-calibration.ts` and `lane-registry.ts` gained the integration points the promoter needs without changing live lane resolution.

### Fixed

- The shadow learning loop no longer dead-ends. The estimator wrote proposals that nothing read back, and the promoter now closes the loop on a cron cadence.
- Raw acceptance frequency no longer stands in for reliability. The bounded posterior keeps a handful of all-accepted samples from looking as certain as ten thousand.
- A contributor with no evidence reads the neutral 0.5 prior instead of being dropped by the low-sample cliff.

### Verification

| Check | Result |
|-------|--------|
| Beta posterior and policy Vitest | PASS, 25 cases in `beta-reliability.vitest.ts` |
| Promoter seam Vitest | PASS, 8 cases in `shadow-weight-promoter.vitest.ts` |
| Live recommend path | Byte-identical, shadow channel separate from the frozen live weights |
| Live promotion micro-benchmark | PENDING, the live flip stays a no-go |
| Strict validation | PASS for the sub-phase |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/beta-reliability.ts` | Created | Shared Beta posterior primitive plus asymmetric-delta, two-gate, held-out and decay policy |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/shadow-weight-promoter.ts` | Created | Out-of-process cron promoter that writes the shadow weight channel only |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Modified | Integration points for the promoter |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` | Modified | Shadow weight resolution wiring, live weights left frozen |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/beta-reliability.vitest.ts` | Created | Posterior math and gate policy coverage |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/shadow-weight-promoter.vitest.ts` | Created | Promoter seam coverage |

### Follow-Ups

- Build the runtime micro-benchmark that must clear before any live lane weight moves.
- Wire a daemon reload trigger so the warm process picks up new shadow weights without a restart (Q-002).
- Capture a real per-lane attribution signal before quoting any benefit or live-promotion claim.
