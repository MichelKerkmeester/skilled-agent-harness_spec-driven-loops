---
title: "Changelog: Agent Dispatch Hardening [031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/003-agent-dispatch-hardening]"
description: "Chronological changelog for the Agent Dispatch Hardening phase."
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

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/003-agent-dispatch-hardening` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Created OpenCode/Claude DEEP primary router mirrors (`deep.md`) and added a registry-backed "Deep Route:" dispatch field to both orchestrators, giving GPT an explicit, single-dispatch route instead of prose negotiation.

### Added

- `.opencode/agents/deep.md` — new OpenCode DEEP primary router (`mode: primary`).
- `.claude/agents/deep.md` — Claude mirror of the DEEP primary router.

### Changed

- `.opencode/agents/orchestrate.md` and `.claude/agents/orchestrate.md` — added a `Deep Route:` field before `Subagent Type` in the Task dispatch format.

### Fixed

- Long-prose, negotiation-based route resolution replaced with a compact, registry-resolved route package, reducing mis-invocation risk.

### Verification

- Route table cross-checked against `mode-registry.json` — PASS.
- `.opencode`/`.claude` alignment-drift checks — PASS.
- Comment hygiene — PASS.
- Claude-flex preservation table check — PASS.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings.
- Checklist: P0 12/12, P1 9/9, P2 1/1.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/agents/deep.md` | Created | OpenCode DEEP primary router |
| `.claude/agents/deep.md` | Created | Claude mirror router |
| `.opencode/agents/orchestrate.md` | Modified | Adds `Deep Route:` dispatch field |
| `.claude/agents/orchestrate.md` | Modified | Mirrors `Deep Route:` field |

### Follow-Ups

- No hard runtime identity yet — this is prompt-identity hardening, not host-enforced identity; phase 006 (FIX-5/host hard identity) stays parked unless GPT smoke testing triggers it.
- Codex mirror out of scope (TOML-location doc contradiction, tracked separately).
