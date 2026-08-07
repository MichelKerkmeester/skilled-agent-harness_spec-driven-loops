---
title: "Changelog: Runtime Hygiene Fixes [009-research-backlog-remediation/003-runtime-hygiene-fixes]"
description: "Chronological changelog for the Runtime Hygiene Fixes phase."
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

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-deep-loop-improved/009-research-backlog-remediation`

### Summary

Ephemeral finding-id markers were left inside HTML comments across command and skill source files, a salvage placeholder filename used non-padded iteration numbers and a suspected codex zero-finding registry bug was traced to its real root cause instead of assumed.

### Added

- Add the `COMMENT_HYGIENE_MARKER` validate.sh rule, registered in `validator-registry.json`, with clean and violation test fixtures and an extended-harness test block.
- Add a RED-before-GREEN test for the salvage placeholder zero-padding fix.

### Changed

- `validate.sh`'s Node-orchestrator routing now falls back to the shell registry framework when a caller requests a rule subset through `SPECKIT_RULES`, so a newly registered standalone rule can actually run through that path.

### Fixed

- Removed 15 ephemeral `F-\d+-...` HTML-comment markers across `deep_review_auto.yaml`, `deep_research_auto.yaml`, `cli-opencode/SKILL.md` and `cli-opencode/references/agent_delegation.md`.
- Fixed `fanout-salvage.cjs` to zero-pad the iteration number in placeholder filenames (`iteration-1.md` to `iteration-001.md`) matching the convention used elsewhere in the runtime.
- Traced the codex zero-finding registry hypothesis to its real mechanism (the merge reducer reads state-log finding details, not iteration markdown files) and confirmed with live data that codex's registry already carries 5 real findings, so no backfill was needed.

### Verification

- Extended validation harness run, PASS, 110 of 110 including the new rule.
- Targeted `fanout-salvage.vitest.ts` run, PASS, 12 of 12.
- Repo-wide marker grep, 0 hits remaining outside documented historical contexts.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/deep/assets/deep_review_auto.yaml`, `deep_research_auto.yaml` | Modified | Removed comment-hygiene markers. |
| `.opencode/skills/cli-opencode/SKILL.md`, `references/agent_delegation.md` | Modified | Removed comment-hygiene markers. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-comment-hygiene.sh` | Added | New standalone validate.sh rule. |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered the new rule. |
| `.opencode/skills/system-spec-kit/scripts/test-fixtures/070-comment-hygiene-marker/`, `071-comment-hygiene-marker-violation/` | Added | Clean and violation fixtures. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Modified | Zero-padded placeholder filenames. |

### Follow-Ups

- None. All P0 items closed with independent verification.
