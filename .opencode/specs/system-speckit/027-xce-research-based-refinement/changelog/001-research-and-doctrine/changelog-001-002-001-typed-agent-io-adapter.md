---
title: "Wave 1: Optional Advisory Agent I/O Contract"
description: "Typed dispatch header and output envelope added as optional advisory hints across all three runtime mirrors and the Wave-1 planning commands."
trigger_phrases:
  - "027 001/002 001 changelog"
  - "typed agent io contract changelog"
  - "agent-io-contract wave 1"
  - "dispatch header envelope changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption`

### Summary

Wave 1 of the gem-team adoption introduced an optional advisory agent I/O contract. Rich markdown agent bodies remain canonical. A shared `agent-io-contract.md` reference now defines typed dispatch headers, result envelopes, handoff and pre-execution sections, and an advisory group. Numeric confidence is derived from existing HIGH/MED/LOW bands rather than kept as a competing field. The four Wave-1 planning dispatches in both `speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml` now prepend compact advisory headers to their `@context` exploration prompts. All five core agents (`@orchestrate`, `@code`, `@review`, `@context`, `@debug`) gained optional guidance in all three runtime mirrors (`.opencode`, `.claude`, `.codex`). `@orchestrate` tolerates envelope-less output for backward compatibility.

### Added

- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`: single advisory contract covering dispatch, result, handoff, pre_execution and advisory groups with schema_version, confidence mapping and backward-compat rules
- Optional dispatch header on the four `@context` exploration prompts in `speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml`
- Optional result-envelope guidance and envelope-less degrade path in `@orchestrate` across all three runtime mirrors
- Optional envelope appended after the native `RETURN:` body in `@code` across all three runtime mirrors
- P0/P1/P2 plus confidence-band mapping into the result envelope in `@review` across all three runtime mirrors
- Accept-dispatch-header guidance plus read-directives retention in `@context` across all three runtime mirrors
- Dispatch and handoff header awareness in `@debug` across all three runtime mirrors
- Optional contract pointer added to `AGENTS.md`

### Changed

- `@orchestrate` updated to consume the result envelope when present and degrade gracefully when absent
- `.opencode/agents/{orchestrate,code,review,context,debug}.md`, `.claude/agents/{orchestrate,code,review,context,debug}.md` and `.codex/agents/{orchestrate,code,review,context,debug}.toml` updated in lockstep for runtime mirror parity

### Fixed

- None.

### Verification

- Contract doc present and all four planning `@context` dispatches emit the header: passed by read and grep verification
- Envelope-less agent output still parses unchanged: passed via advisory-only degrade path in `@orchestrate`
- YAML parse for both plan assets: passed with `python3 -c 'import yaml; ...'`
- TOML parse for all five Codex agent mirrors: passed with `tomli`
- Preservation grep for `@code` first-line `RETURN:` and `@context` six Context-Package sections: passed
- `AGENTS.md` Four Laws and Gate 3 headings present after edit: passed
- Strict spec validation (`validate.sh --strict`): exit 0 (Errors 0 / Warnings 0)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Added | New advisory contract defining all five typed groups |
| `.opencode/agents/orchestrate.md` | Modified | Optional dispatch header; result-envelope consume and envelope-less degrade path |
| `.opencode/agents/code.md` | Modified | Optional result envelope appended after `RETURN:`; escalation-to-failure mapping |
| `.opencode/agents/review.md` | Modified | P0/P1/P2 plus confidence-band mapping into envelope |
| `.opencode/agents/context.md` | Modified | Accept dispatch header; read-directives retention; six Context-Package sections preserved |
| `.opencode/agents/debug.md` | Modified | Dispatch and handoff header awareness; 5-phase method untouched |
| `.claude/agents/orchestrate.md` | Modified | Runtime mirror parity |
| `.claude/agents/code.md` | Modified | Runtime mirror parity |
| `.claude/agents/review.md` | Modified | Runtime mirror parity |
| `.claude/agents/context.md` | Modified | Runtime mirror parity |
| `.claude/agents/debug.md` | Modified | Runtime mirror parity |
| `.codex/agents/orchestrate.toml` | Modified | Runtime mirror parity; TOML parse passed |
| `.codex/agents/code.toml` | Modified | Runtime mirror parity; TOML parse passed |
| `.codex/agents/review.toml` | Modified | Runtime mirror parity; TOML parse passed |
| `.codex/agents/context.toml` | Modified | Runtime mirror parity; TOML parse passed |
| `.codex/agents/debug.toml` | Modified | Runtime mirror parity; TOML parse passed |
| `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` | Modified | Advisory headers on four Wave-1 `@context` dispatches |
| `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml` | Modified | Advisory headers on four Wave-1 `@context` dispatches |
| `AGENTS.md` | Modified | Small optional contract pointer added |

### Follow-Ups

- No runtime parser or validator consumes the contract yet; existing markdown remains authoritative until a follow-on enforcement pass.
- Broader command and deep-loop integration remain out of scope for this packet.
