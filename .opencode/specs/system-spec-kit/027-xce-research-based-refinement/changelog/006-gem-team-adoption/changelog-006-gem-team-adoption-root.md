---
title: "Phase Rollup: gem-team-adoption (027/006)"
description: "Rollup of three shipped leaves introducing the typed agent I/O contract across Wave 1 (advisory contract and runtime mirrors), Wave 2 (predicate-scoped pre-execution and handoff gates) and Wave 3 (reviewer-focus and spec-drift advisory hints)."
trigger_phrases:
  - "027 006 rollup"
  - "gem-team adoption changelog rollup"
  - "agent io contract phase rollup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption` (Phase Parent)

### Summary

Phase 006 introduced a typed advisory agent I/O contract across three sequential waves. Wave 1 created the shared contract reference and propagated optional dispatch headers and result envelopes to all five core agents across three runtime mirrors. Wave 2 added predicate-scoped pre-execution and handoff gates to prevent unnecessary ceremony on small changes while carrying typed context for debug-to-implementation crossings. Wave 3 extended the contract with planner-emitted reviewer-focus hints and implementation-time spec-drift recommendations. All changes are additive and advisory; existing markdown agent bodies and Logic-Sync authority are unchanged.

### Included Phases

| Phase | Date | Notes |
|-------|------|-------|
| [001-typed-agent-io-adapter](./changelog-006-001-typed-agent-io-adapter.md) | 2026-06-10 | Advisory contract and Wave-1 runtime mirror propagation |
| [002-scoped-preexec-and-handoff-gates](./changelog-006-002-scoped-preexec-and-handoff-gates.md) | 2026-06-10 | Predicate-scoped pre-execution and typed debug handoff gates |
| [003-planner-review-focus-and-drift-hint](./changelog-006-003-planner-review-focus-and-drift-hint.md) | 2026-06-10 | Reviewer-focus and spec-drift advisory hints |

### Added

- `agent-io-contract.md`: new shared advisory reference defining five typed groups (DISPATCH/RESULT/HANDOFF/PRE_EXECUTION/ADVISORY) with schema_version, confidence mapping and backward-compat rules
- Optional dispatch headers on all four Wave-1 `@context` planning dispatches in `speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml`
- Three predicate-scoped gates in `@orchestrate`: debug-to-implementation crossing, API/schema/integration change class and medium/high complexity
- Typed `AGENT_IO_HANDOFF` fields in `@debug` for debug-to-implementation crossings
- `BLOCKED/LOW_CONFIDENCE` receiver-validation path in `@code` for incomplete diagnosis handoffs
- Optional `reviewer_focus` and `spec_drift` advisory fields in the contract
- Optional `specDrift` and `reviewerFocus` JSON key documentation in `/memory:save` and `generate-context.ts`

### Changed

- All five core agents (`@orchestrate`, `@code`, `@review`, `@context`, `@debug`) updated in `.opencode`, `.claude` and `.codex` runtime mirrors across the three waves
- `agent-io-contract.md` extended incrementally across all three waves without breaking Wave-1 or Wave-2 groups

### Fixed

- None.

### Verification

- Each leaf passed strict spec validation (`validate.sh --strict`) at exit 0
- YAML parse for plan assets and TOML parse for all Codex agent mirrors passed
- Agent alignment drift check passed across all edited agent surfaces
- Envelope-less and hint-absent cases degrade to legacy behavior in all agents

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Added / Modified across three waves | Full advisory contract with all five typed groups |
| `.opencode/agents/{orchestrate,code,review,context,debug}.md` | Modified | Advisory guidance across three waves |
| `.claude/agents/{orchestrate,code,review,context,debug}.md` | Modified | Runtime mirror parity |
| `.codex/agents/{orchestrate,code,review,context,debug}.toml` | Modified | Runtime mirror parity |
| `.opencode/commands/speckit/assets/speckit_plan_{auto,confirm}.yaml` | Modified | Wave-1 dispatch headers on four `@context` prompts |
| `.opencode/commands/memory/save.md` | Modified | Wave-3 optional JSON key documentation |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modified | Wave-3 optional JSON key documentation |
| `AGENTS.md` | Modified | Optional contract pointer |

### Follow-Ups

- Direct `sk-code/SKILL.md`, debug-delegation template and scaffold-script surfaces are flagged for a future scope-approved pass.
- No runtime parser or validator enforces the contract; enforcement is a follow-on concern.
- `ThinContinuityRecord` schema work deferred beyond this phase.
