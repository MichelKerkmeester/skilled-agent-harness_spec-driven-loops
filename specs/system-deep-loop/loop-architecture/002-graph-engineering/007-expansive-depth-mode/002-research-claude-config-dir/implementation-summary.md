---
title: "Implementation Summary: Forward the Claude config dir on single-executor research cli-claude-code dispatch"
description: "A cli-claude-code research dispatch now accepts an optional --claude-config-dir, validates it before the prompt read and runs Claude under it, and the research workflow forwards config.executor.configDir. The playbook scenario and changelog entry were written at integration, and the live walk stays blocked by the Claude ancestry guard."
trigger_phrases:
  - "research claude config dir implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir"
    last_updated_at: "2026-11-17T23:59:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Research config-dir path built and verified; playbook DLR-064 and changelog v2.1.6.0 written at integration"
    next_safe_action: "Run the live walk of DLR-064 from a shell outside Claude Code, then the full runtime suite at the merge gate"
    blockers:
      - "Live walk of DLR-064 needs a shell outside Claude Code (Claude ancestry guard)"
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs"
      - ".skilled/commands/deep/assets/deep-research.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-2-002-research-claude-config-dir"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Forward the Claude config dir on single-executor research cli-claude-code dispatch

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-research-claude-config-dir |
| **Completed** | Implementation done 2026-11-17 on branch `worktrees/465-ed-002-research-claude-config-dir`. T014 was written at integration, T013's live walk is blocked by the Claude ancestry guard, and T009's full-suite half runs at the merge gate |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A single-executor research run on cli-claude-code now uses the Claude account the operator configured. `dispatch-iteration.cjs` accepts `--claude-config-dir` on any cli-claude-code dispatch. Review still requires it, an empty value means no dir, and every other executor still refuses it. On research the dir is validated before the prompt is read, set on the executor object, so the audit record carries it, and exported as `CLAUDE_CONFIG_DIR` through the guarded env, so it overrides an inherited value. The research workflow's `if_cli_claude_code` branch forwards `config.executor.configDir` and renders no flag when it is unset, so a run with no configured dir behaves as before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/dispatch-iteration.cjs` | Modified | Optional flag on research, validation before the prompt read, `configDir` on the executor, `CLAUDE_CONFIG_DIR` in the guarded env |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modified | `{optional_claude_config_dir_flag}` on the cli-claude-code command with its render hint |
| `compiled/deep-research.contract.markdown` | Regenerated | Source digests follow the YAML edit |
| `runtime/tests/unit/dispatch-iteration.vitest.ts` | Modified | Five config-dir cases, including the review reference case and a recorder `claude` shim |
| `runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Modified | Research twin proving the audit record carries the dir |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tests went in first and failed for the expected reasons. Each implementation task then went to DeepSeek V4.1 Flash on the Mistral Vibe lane as one brief (`scratch/dispatch/`), and every `export.json` recorded exit code 0 and outcome `finished`. The orchestrator read each diff and reran each check itself. A negative control with the script edits reverted showed the three new behavior cases failing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The two recorder-shim cases skip when the runner sits under a Claude Code process | The recursion guard refuses a nested cli-claude-code dispatch whenever `claude` is in the process ancestry, by design. Those cases pass in a run detached from that tree, which is where they were proven |
| The REQ-005 case uses a config dir outside `~/.claude*` | `validateClaudeConfigDir` checks location, not existence, for both loops. Research now refuses exactly what review refuses |
| A trailing shell comment names `--claude-config-dir` on the YAML command line | The placeholder renders no flag when unset (REQ-004), and the comment lets the goal's grep criterion see the forwarding on the command line itself |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three suites in-session | 3 files, 27 passed and 2 skipped (23 baseline + 6 new) |
| `dispatch-iteration.vitest.ts` detached from the Claude tree | 10 passed |
| Negative control, script edits reverted | 3 failed (cases 2, 3, 4), 7 passed |
| `check-contract-drift.cjs --command deep/research` | `OK commands=1`, exit 0 |
| Full runtime suite | Not run in the phase worktree; it runs at the integration merge gate |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Playbook scenario and changelog entry.** The changelog is written as `changelog/v2.1.6.0.md`. The playbook scenario DLR-064 is written and indexed. Its live walk is blocked: a live `cli-claude-code` dispatch is refused inside a Claude session by the Claude ancestry guard.
2. **An inherited `CLAUDE_CONFIG_DIR` still reaches a research run that names no dir.** Stripping it would change every default research run, so it stays out of scope (goal log, open question).
<!-- /ANCHOR:limitations -->
