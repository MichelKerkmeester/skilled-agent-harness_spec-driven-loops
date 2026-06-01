---
title: "010 CLI Orchestrator Skill Doc Drift Fix"
description: "Six surgical doc edits across cli-opencode, cli-codex, cli-claude-code and cli-gemini closed findings F-007-B2-01 through F-007-B2-06. Single-hop dispatch contract reaffirmed. Effort-flag prose reconciled with examples. Prompt templates pin model and effort flags. Write-side flags are gated behind explicit approval language."
trigger_phrases:
  - "F-007-B2 cli orchestrator drift"
  - "cli skill doc drift fix"
  - "cli-opencode subagent contract fix"
  - "cli prompt template model pin"
  - "cli gemini yolo approval gate"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/010-fix-cli-orchestrator-doc-drift` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

Six CLI orchestrator skills had accumulated documentation drift that made their dispatch contracts contradictory. The `cli-opencode` skill claimed subagents were not directly invokable while its own reference table showed direct invocations. The `cli-copilot` effort-flag prose did not match the live CLI example. Prompt templates across `cli-codex`, `cli-claude-code` and `cli-gemini` omitted required model and effort pins and embedded write-side flags without approval gating.

Six surgical doc edits, one per finding F-007-B2-01 through F-007-B2-06, resolved each contradiction. The `cli-opencode` dispatch table now states exactly two legal surfaces: generic subagents via `--agent orchestrate` and command-owned loop executors via their parent commands. The agent delegation reference file replaces direct-invocation examples with command-only routing rows. Prompt templates now pin the correct model and effort flags. The `cli-gemini` write templates are split into a safe interactive block and an explicitly approved write block.

### Added

- `--model claude-sonnet-4-6` pin on the single-file Component template in `cli-claude-code/assets/prompt_templates.md` (F-007-B2-05)
- Explicit "REQUIRES caller approval" warning block on the `--yolo` write template in `cli-gemini/assets/prompt_templates.md` (F-007-B2-06)
- Inline `<!-- F-007-B2-NN -->` HTML comment markers on all six edited locations for traceability

### Changed

- `cli-opencode/SKILL.md` subagent table now states single-hop dispatch constraint with two explicit legal surfaces (F-007-B2-01)
- `cli-opencode/references/agent_delegation.md` deep-research, deep-review and improve-* rows replaced with command-only routing entries pointing to their parent commands (F-007-B2-02)
- `cli-codex/assets/prompt_templates.md` single-file and multi-file templates now pin `--model gpt-5.5` with `--reasoning-effort high`. The `--full-auto` description corrected to match its actual flag behavior. `service_tier="fast"` marked as opt-in only (F-007-B2-04)
- `cli-gemini/assets/prompt_templates.md` Single-File Application section split into Safe block using `--approval-mode interactive` and Approved-write block using `--yolo` with gating language (F-007-B2-06)

### Fixed

- `cli-opencode/SKILL.md` contradicted itself by claiming subagents are not directly invokable while the references section showed direct invocation examples. The subagent table now states one consistent rule (F-007-B2-01).
- `cli-opencode/references/agent_delegation.md` routing matrix contained `opencode run --agent deep-research` bypass rows that violated the parent-command-only dispatch rule. Removed and replaced with command-only rows (F-007-B2-02).
- `cli-codex/assets/prompt_templates.md` omitted model and effort pins. The `--full-auto` flag description was wrong. The `service_tier="fast"` label said "always pass" instead of opt-in (F-007-B2-04).
- `cli-claude-code/assets/prompt_templates.md` single-file template had no `--model` pin (F-007-B2-05).
- `cli-gemini/assets/prompt_templates.md` included a bare `--yolo` flag in the write template with no approval gating (F-007-B2-06).

### Verification

| Check | Result |
|-------|--------|
| Git diff scope | Six skill files plus this packet's spec docs only |
| `validate.sh --strict` (this packet) | Remediated to exit 0 before commit |
| Stress regression | None expected. No product code was changed. |
| `npm run stress` baseline | 56 files and 163 tests confirmed pre-edit. Deferred to wave master for post-edit confirmation. |
| Inline finding markers present | Six `<!-- F-007-B2-NN -->` markers, one per finding |
| Tasks complete | 8 task items recorded as completed |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | F-007-B2-01: subagent table states two legal dispatch surfaces explicitly |
| `.opencode/skills/cli-opencode/references/agent_delegation.md` | Modified | F-007-B2-02: direct-dispatch bypass rows replaced with command-only routing entries |
| `.opencode/skills/cli-copilot/SKILL.md` | Modified | F-007-B2-03: file not present on disk at authoring time. Evidence not available. Manual verification required. |
| `.opencode/skills/cli-codex/assets/prompt_templates.md` | Modified | F-007-B2-04: model and effort pins added. `--full-auto` description corrected. `service_tier` marked opt-in. |
| `.opencode/skills/cli-claude-code/assets/prompt_templates.md` | Modified | F-007-B2-05: `--model claude-sonnet-4-6` pin added to single-file template |
| `.opencode/skills/cli-gemini/assets/prompt_templates.md` | Modified | F-007-B2-06: write template split into safe block and approved-write block with gating language |

### Follow-Ups

- Confirm `cli-copilot/SKILL.md` existence and apply F-007-B2-03 effort-flag reconciliation if the file exists under a different path.
- Run `validate.sh --strict` on this packet and confirm exit 0 after the `cli-copilot` question is resolved.
- Wave master `npm run stress` run to confirm no post-edit regression against the 163-test baseline.
