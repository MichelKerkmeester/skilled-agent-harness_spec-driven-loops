---
title: "Peck verification discipline: read-budget, escalation, anti-softening, and completion-freshness gate"
description: "Shipped four cumulative slices: reviewer read-budget discipline across the agent roster (T8), escalation and anti-softening governance text (T5/T7/T9), numeric-severity calibration for code review (T9), and a default-off CONTINUITY_FRESHNESS validator with packet-scoped dirty-path detection and vitest coverage (T6)."
trigger_phrases:
  - "peck verification discipline"
  - "completion-verdict freshness gate"
  - "CONTINUITY_FRESHNESS validator"
  - "reviewer read-budget discipline"
  - "anti-verdict-softening"
  - "SPECKIT_COMPLETION_FRESHNESS"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption`

### Summary

Delivered peck verification discipline across four successive commits. The first added strict non-diff read-budget guidance to the `review` agent and adapted read-budget guidance to `context`, `deep-research`, `deep-review`, and `orchestrate` agents with all three runtime mirrors. The second added escalation discipline (root-cause, amendment path, three-strike, reviewer-contradiction) to `sk-code` and `CLAUDE.md`, plus anti-softening rules and VERDICT_LOCK to the `deep-review` skill and agent, and advisory `riskScore` to `sk-code-review`. The third shipped the T6 completion-freshness validator (`CONTINUITY_FRESHNESS`) as a default-off strict rule with fingerprint recompute, packet-scoped dirty-path detection, warn-first behavior, and enforcement promotion behind `SPECKIT_COMPLETION_FRESHNESS_ENFORCE`. Each slice is additive: no existing routing, permissions, severity model, or output schema was changed.

### Added

- `continuity-freshness.ts`: completion-fingerprint recompute, packet-scoped dirty-path detection, warn/enforce behavior, and `clock_drift` pass handling.
- `continuity-freshness.vitest.ts`: flag-off byte-identical behavior, stale warn, enforce error, no-false-positive, and packet-scoped dirty-path cases.
- Escalation discipline in `sk-code/SKILL.md`: root-cause, amendment-path, three-strike, and reviewer-contradiction cases.
- Logic-Sync amendment-path guidance in `.claude/CLAUDE.md` and `AGENTS.md`.
- VERDICT_LOCK, exact verdict anti-softening, and optional non-gating `riskScore` in `deep-review/SKILL.md`.
- Strict non-diff read-budget discipline in the `review` agent (all 3 runtime mirrors).
- Adapted read-budget guidance in `context`, `deep-research`, `deep-review`, and `orchestrate` agents (all 3 runtime mirrors).
- `+/-2 context` numeric calibration and rejection of numeric gating thresholds in `sk-code-review/SKILL.md` and `references/review_core.md`.

### Changed

- `mcp_server/lib/validation/spec-doc-structure.ts`: exported the normalized continuity fingerprint helper consumed by the freshness rule.
- `scripts/spec/validate.sh`: gated `CONTINUITY_FRESHNESS` behind `SPECKIT_COMPLETION_FRESHNESS`, set preferred source for the strict rule, and fixed the source fallback path.
- `references/validation/validation_rules.md`: documented `CONTINUITY_FRESHNESS`, default-off rollout, warn/enforce flags, packet scope, and How to Fix steps.
- `AGENTS.md`: added one additive completion-rule line binding completion claims to freshness when the flag is enabled.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Freshness invalidates a green completion after in-scope edits (warn-first and enforce) | PASS: `npx vitest run tests/continuity-freshness.vitest.ts tests/spec-doc-structure.vitest.ts` |
| Flag-off byte-identical validation | PASS |
| Recomputed fingerprint no false positive | PASS |
| Packet-scoped clean-tree | PASS |
| Four Laws and Gates unchanged | PASS: direct read confirmed Four Laws and Gate sections intact |
| `.claude/agents/*` and `.codex/agents/*` mirrors updated | PASS |
| TypeScript no-emit | PASS: `npx tsc --noEmit -p tsconfig.json` from `system-spec-kit` |
| Strict spec validation | PASS (0 errors, 0 warnings; freshness flag unset) |
| Comment hygiene | PASS: `check-comment-hygiene.sh` produced no output for modified files |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` | Modified | Fingerprint recompute, packet-scoped dirty paths, warn/enforce, clock_drift pass |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Modified | Exported normalized continuity fingerprint helper |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modified | Gated `CONTINUITY_FRESHNESS`, preferred source, fallback fix |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Modified | Documented `CONTINUITY_FRESHNESS` rule and flags |
| `.opencode/skills/system-spec-kit/mcp_server/tests/continuity-freshness.vitest.ts` | Created | Vitest coverage for freshness rule behaviors |
| `.opencode/agents/review.md` + `.claude/agents/review.md` + `.codex/agents/review.toml` | Modified | Strict non-diff read-budget discipline |
| `.opencode/agents/context.md` + `.claude/agents/context.md` + `.codex/agents/context.toml` | Modified | Adapted read-budget with blocker-grade reread allowance |
| `.opencode/agents/deep-research.md` + `.claude/agents/deep-research.md` + `.codex/agents/deep-research.toml` | Modified | Read-budget freshness and status-honesty safeguards |
| `.opencode/agents/deep-review.md` + `.claude/agents/deep-review.md` + `.codex/agents/deep-review.toml` | Modified | Verification-discipline guidance, P0 verdict lock, escalation reporting |
| `.opencode/agents/orchestrate.md` + `.claude/agents/orchestrate.md` + `.codex/agents/orchestrate.toml` | Modified | Consume-only review-verdict discipline |
| `.opencode/skills/sk-code/SKILL.md` | Modified | Escalation discipline for root-cause and amendment cases |
| `.opencode/skills/deep-review/SKILL.md` | Modified | VERDICT_LOCK and exact verdict anti-softening |
| `.opencode/skills/sk-code-review/SKILL.md` + `references/review_core.md` | Modified | `+/-2 context` numeric calibration |
| `.claude/CLAUDE.md` + `AGENTS.md` | Modified | Logic-Sync amendment-path guidance (additive) |

### Follow-Ups

- `CONTINUITY_FRESHNESS` is inert until `SPECKIT_COMPLETION_FRESHNESS=true`.
- `ENV_REFERENCE.md` and the constitutional completion-ritual file were outside approved write paths and were not edited.
- Dist files were not touched. The orchestrator build remains authoritative outside this source-only verification slice.
