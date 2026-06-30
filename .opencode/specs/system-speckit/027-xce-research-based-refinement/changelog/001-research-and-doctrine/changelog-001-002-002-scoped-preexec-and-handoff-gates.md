---
title: "Wave 2: Scoped Pre-Execution and Typed Debug-to-Implementation Handoff Gates"
description: "Three predicate-scoped optional gates and a typed debug-to-implementation handoff landed across the advisory contract and all three agent runtime mirrors."
trigger_phrases:
  - "027 001/002 002 changelog"
  - "scoped preexec gates changelog"
  - "debug handoff gates changelog"
  - "pre-mortem predicate changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption`

### Summary

Wave 2 activated the handoff and pre-execution groups in the shared advisory contract and planted three narrow predicate-scoped gates in `@orchestrate`. Gate A fires only when a debug diagnosis crosses to implementation. Gate B fires only for API/schema/integration change classes. Gate C fires only for medium or high complexity work. Low-effort, docs-only and typo fixes are untouched. `@debug` now emits typed handoff fields when the crossing exists. `@code` validates only diagnosis-based handoffs and returns `BLOCKED/LOW_CONFIDENCE` when required fields are missing; ordinary envelope-less work remains valid. The `sk-code` SKILL, debug-delegation template and scaffold script were read and flagged as out of approved write scope; the predicates are carried by the contract and orchestrator instead.

### Added

- Three predicate-scoped gates in `@orchestrate`: Gate A (debug-to-implementation crossing), Gate B (API/schema/integration class), Gate C (medium/high complexity) across all three runtime mirrors
- Typed handoff fields in `@debug` for cross-agent debug-to-implementation handoffs across all three runtime mirrors
- `BLOCKED/LOW_CONFIDENCE` receiver-validation path in `@code` for incomplete diagnosis handoffs across all three runtime mirrors
- `AGENT_IO_HANDOFF` and `AGENT_IO_PRE_EXECUTION` groups activated as optional/advisory sections in `agent-io-contract.md`

### Changed

- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` updated to promote handoff and pre-execution groups from stubs to defined optional/advisory sections
- `@orchestrate` body extended with predicate guards and gated pre-mortem fields in all three runtime mirrors
- `@debug` extended with downscale framing and typed handoff fields while keeping the 5-phase method untouched
- `@code` extended with receiver-validation behavior for diagnosis-based handoffs

### Fixed

- None.

### Verification

- Gates skip outside their predicate scope: verified by mirror content review and invariant grep across debug-crossing, API/schema/integration class and medium/high complexity predicates
- Debug-to-implementation handoff emitted, preserved and validated across `@debug`, `@orchestrate` and `@code` mirrors: passed; incomplete diagnosis handoff safely returns `BLOCKED/LOW_CONFIDENCE`
- Legacy debug-delegation warns but does not fail for non-crossing cases: verified by wording review
- TOML parse for all edited Codex files: passed
- Agent alignment drift check (`verify_alignment_drift.py --root .opencode/agents`): passed
- Strict spec validation (`validate.sh --strict`): exit 0 (Errors 0 / Warnings 0)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Modified | Handoff and pre-execution groups promoted to optional/advisory schema sections |
| `.opencode/agents/orchestrate.md` | Modified | Three predicate-scoped gates and gated pre-mortem fields |
| `.opencode/agents/debug.md` | Modified | Typed handoff fields for debug-to-implementation crossing; 5-phase method untouched |
| `.opencode/agents/code.md` | Modified | Receiver-validation path for incomplete diagnosis handoffs |
| `.claude/agents/orchestrate.md` | Modified | Runtime mirror parity |
| `.claude/agents/debug.md` | Modified | Runtime mirror parity |
| `.claude/agents/code.md` | Modified | Runtime mirror parity |
| `.codex/agents/orchestrate.toml` | Modified | Runtime mirror parity; TOML parse passed |
| `.codex/agents/debug.toml` | Modified | Runtime mirror parity; TOML parse passed |
| `.codex/agents/code.toml` | Modified | Runtime mirror parity; TOML parse passed |

### Follow-Ups

- Direct `sk-code/SKILL.md`, debug-delegation template and scaffold-script edits are flagged for a future scope-approved pass.
- Gates remain optional/advisory with no runtime validator enforcement.
