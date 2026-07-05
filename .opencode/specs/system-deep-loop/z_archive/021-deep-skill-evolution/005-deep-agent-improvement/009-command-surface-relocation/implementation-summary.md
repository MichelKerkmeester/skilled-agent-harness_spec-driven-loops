---
title: "Implementation Summary: Deep Agent Improvement Command Surface Relocation"
description: "The old improve command group has been replaced by deep/root command surfaces so operators use /deep:start-agent-improvement-loop for agent loops and /prompt for prompt work."
trigger_phrases:
  - "implementation summary deep agent command relocation"
  - "deep start agent improvement loop implementation"
  - "prompt command migration summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/009-command-surface-relocation"
    last_updated_at: "2026-05-24T07:06:34Z"
    last_updated_by: "codex"
    recent_action: "implemented command surface migration and completed root/runtime follow-up audit"
    next_safe_action: "report final status"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
      - ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml"
      - ".opencode/commands/prompt.md"
      - ".gemini/commands/prompt.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000014"
      session_id: "codex-2026-05-24-command-surface-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Archives and changelogs were included in the repo-wide rewrite."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Deep Agent Improvement Command Surface Relocation

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/009-command-surface-relocation` |
| **Completed** | 2026-05-24 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The command surface now points operators at the new deep/root entrypoints instead of the deleted improve command family. Agent improvement runs through `/deep:start-agent-improvement-loop`; prompt improvement runs through `/prompt`; Gemini mirrors delegate to those canonical OpenCode command specs.

### Deep Agent Command

The deep agent improvement workflow assets were moved to `.opencode/commands/deep/assets/` and renamed to `deep_start-agent-improvement-loop_auto.yaml` and `deep_start-agent-improvement-loop_confirm.yaml`. The command spec loads those new asset names and its examples use `/deep:start-agent-improvement-loop`.

### Prompt Command

The prompt command is now documented as the root `/prompt` surface. Prompt-improver agents and related command docs reference `.opencode/commands/prompt.md` instead of the removed improve path.

### Runtime Mirrors

Gemini now has `.gemini/commands/deep/start-agent-improvement-loop.toml` and `.gemini/commands/prompt.toml` wrappers that read the canonical OpenCode specs. The obsolete `the legacy Gemini improve command folder` folder and stale Gemini create-prompt mirror were removed.

### Root README and Runtime Audit

The root `README.md` now reflects the actual command tree: 24 command entrypoints across speckit, memory, create, deep, doctor, and root utilities. The old improve command section was replaced by deep/root command guidance. Runtime command coverage was checked: Claude commands are a symlink to `.opencode/commands`, Gemini has concrete TOML mirrors for the deep agent loop and root prompt command, and Codex has agent/config mirrors but no command mirror directory in this repo snapshot.

### Repo-Wide Reference Cleanup

Exact-string replacements swept hidden files, specs, archives, changelogs, runtime agents, and docs for the removed improve command names, old command paths, and old asset names.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The migration used file moves for assets/mirrors, exact-string rewrites for old public names and paths, and targeted manual edits for command indexes where a blind replacement would produce an incorrect command group. Final validation is tracked in the verification table below.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No compatibility aliases | The user explicitly requested the old syntax be removed, and alias files would keep the deleted group alive |
| Rewrite archives and changelogs | The requested policy was repo-wide consistency rather than historical preservation |
| Keep this under `005-deep-agent-improvement/009-*` | The migration specifically owns deep-agent-improvement command relocation, while root `007` remains the earlier deep command relocation packet |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deleted improve folders | PASS: deleted-folder checks passed for OpenCode and Gemini command groups |
| New deep asset files | PASS: both `deep_start-agent-improvement-loop_auto.yaml` and `deep_start-agent-improvement-loop_confirm.yaml` were listed under `.opencode/commands/deep/assets/` |
| Zero-old-reference gate | PASS: requested hidden-file grep gate returned no matches |
| Positive-reference gate | PASS: positive grep returned `/deep:start-agent-improvement-loop`, `/prompt`, and `deep_start-agent-improvement-loop` references |
| Root README audit | PASS: root README command count and command sections now match the deep/root command surface |
| Runtime command audit | PASS: OpenCode, Gemini, Claude symlink, and Codex command-surface presence were checked |
| Active README/SKILL/runtime stale-name sweep | PASS: active README, SKILL, graph metadata, command, and agent surfaces returned no old command/agent/skill references |
| Child strict spec validation | PASS: `validate.sh` strict run for this child phase exited 0 |
| Parent recursive spec validation | PASS: recursive strict run for `005-deep-agent-improvement` exited 0 |
| Skill-advisor smoke tests | PASS: deep loop request routed to `deep-agent-improvement`; prompt request routed to `sk-prompt` |
| OpenCode alignment drift | REPORTED: verifier executed but failed before drift evaluation with `FileNotFoundError` for `.opencode/skill/mcp-chrome-devtools/scripts/install.sh`; the existing file is under `.opencode/skills/...` |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. The worktree contains many unrelated pre-existing changes. This packet only claims the command relocation changes and does not attempt to clean unrelated state.
2. External references outside this repository were not searched.
3. The OpenCode alignment drift verifier did not complete because of the singular/plural Chrome DevTools skill path issue recorded above.
<!-- /ANCHOR:limitations -->
