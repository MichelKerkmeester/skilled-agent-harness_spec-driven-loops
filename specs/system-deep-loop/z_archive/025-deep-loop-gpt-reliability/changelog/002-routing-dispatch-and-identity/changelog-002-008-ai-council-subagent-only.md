---
title: "Changelog: AI-Council Subagent-Only Conversion [031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/008-ai-council-subagent-only]"
description: "Chronological changelog for the AI-Council Subagent-Only Conversion phase."
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

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/008-ai-council-subagent-only` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Converted `ai-council.md` from `mode: all` to `mode: subagent` (Task-dispatch only) per explicit operator instruction overriding research's unanimous 6/6 "keep mode: all" finding, verified via 4 live `opencode` CLI smoke dispatches and 2 redirected documentation callers.

### Added

- `decision-record.md` documenting the deliberate operator override of research's recommendation.

### Changed

- `.opencode/agents/ai-council.md` — `mode: all` → `mode: subagent`.
- `cli-opencode/references/agent_delegation.md` — redirected the `@ai-council` delegation pattern to the existing "Command-only" convention.
- `sk-doc/assets/agent_template.md` — corrected a stale `mode: all` example agent.

### Fixed

- Cross-runtime asymmetry (Claude Code has no "primary agent" concept; this was the repo's only `mode: all` agent besides `markdown.md`).
- 2 real documentation callers that would have broken post-conversion — redirected before landing, not after.

### Verification

- Live CLI dispatch before conversion: direct invoke PASS (loaded full definition, 36,004 tokens).
- Live CLI dispatch after conversion: direct invoke correctly rejected, falls back to the default agent (27,975 tokens).
- Task-dispatch after conversion: PASS (real `task` tool call, `subagent_type: 'ai-council'`).
- Orchestrate routing after conversion: PASS (resolved `Agent: @ai-council per §2 Priority 4`, matching phase 009's renumbering).
- Grep sweep found and redirected 2 real callers.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings.
- Checklist: P0 9/9, P1 6/6, P2 1/1.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/agents/ai-council.md` | Modified | `mode: all` → `mode: subagent` |
| `.../cli-opencode/references/agent_delegation.md` | Modified | Redirected to Command-only convention |
| `.../sk-doc/assets/agent_template.md` | Modified | Corrected stale `mode: all` example |
| `decision-record.md` | Created | Documents deliberate override of research |

### Follow-Ups

- Orchestrate live-test was not observed to full completion — only the load-bearing part was confirmed.
- `markdown.md`'s own `mode: all` remains untouched — a natural follow-up if cross-runtime consistency is the driving rationale; not yet raised by the operator.
- Accepted residual risk of an undiscovered caller depending on direct reachability.
