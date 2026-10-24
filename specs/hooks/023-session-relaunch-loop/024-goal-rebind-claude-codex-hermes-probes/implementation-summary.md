---
title: "Implementation Summary"
description: "Four recorded probes with controls settled how a fresh receiver session can get a goal on Claude Code, Codex and Hermes, and picked the build path for phase 27."
trigger_phrases:
  - "goal rebind probes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/024-goal-rebind-claude-codex-hermes-probes"
    last_updated_at: "2026-10-25T00:30:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Ran the four probes with controls and wrote the verdicts"
    next_safe_action: "Start phase 27 on the Claude start-prompt path and the Codex seed path"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-24-goal-rebind-claude-codex-hermes-probes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-goal-rebind-claude-codex-hermes-probes |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No repository code. Four probes ran against the real runtimes in throwaway directories, each with a negative control, and their records sit under `scratch/`. Runtimes: Claude Code 2.1.310, Codex CLI 0.164.0, Hermes Agent v0.21.1.

### Phase 24: goal-rebind-claude-codex-hermes-probes

#### Probe Verdicts

| Probe | Verdict | Control | Evidence | What the run cannot show |
|-------|---------|---------|----------|--------------------------|
| A: Claude start prompt `/goal <text>` | **Works.** The start prompt runs as the slash command: `Goal set: ...`, the `/goal active` indicator, and a `goal_status` entry in the transcript. A 3,900-character multi-line condition is accepted; 4,394 is refused (`Goal condition is limited to 4000 characters`). Also works under `claude -p`. | A3: the same text after `Please run:` sets no goal (`No goal set`) | `scratch/probe-a-claude-start-prompt.md`, `scratch/raw/a*-pane*.txt` | Other permission modes or managed policy; a goal short enough to be judged met at once ends itself (A1) |
| B: Claude SessionStart hook sending `/goal` | **Does not work in an interactive session; works only under `claude -p`.** The hook runs and its `initialUserMessage` output is parsed (`provided initialUserMessage (63 chars)`), but the interactive TUI never submits it, with or without a start prompt. Under `-p` the message is queued first and runs as the command. `additionalContext` or plain stdout carrying `/goal` never sets a goal in either mode. | B3: a silent hook sets no goal in either mode. The print-mode B1 versus B3 pair differs only by the payload and differs in outcome. `hook-ran.log` proves each hook ran. | `scratch/probe-b-claude-start-hook.md`, `scratch/raw/b*` | Why the TUI drops the field (code not read); `source=resume` or `clear`; a hook that injects keystrokes through tmux; a later release may deliver it |
| C: Codex goal from start seed or hook context | **Start prompt `/goal ...` does not work** (sent as plain text, `No goal is currently set`). **A seed that asks the model to call `create_goal` works**, and **hook `additionalContext` asking for it works once a first turn exists** (the hook only fires at the first turn, so with no turn nothing is set). Both are model-mediated. Typed `/goal text` works by hand. `create_goal` limit: 4,000 characters (a 4,398-character objective was rejected). | C4: a silent hook and a plain READY prompt set no goal | `scratch/probe-c-codex-goal.md`, `scratch/raw/c*` | n = 1 each, and the model must choose to call the tool; the limit is from the model's report of the tool rejection and a binary string, not a raw tool result; the 3,900 accept side stalled (C6) and is untested; a long typed or pasted `/goal` was not measured |
| D: Hermes with `HERMES_SPEC_FOLDER` | **Works for the bind.** With the export, each of two sessions with different ids got its own active goal record (`goal-d184528c...`, `goal-306ce1f6...`, `boundBy hermes`, packet `specs/hooks/023-session-relaunch-loop`) and the system prompt Hermes built carries a `[active_goal:...]` section. | D3: without the export no record exists and the prompt has no goal section; another session id shows `goal_present=false` | `scratch/probe-d-hermes-spec-folder.md`, `scratch/raw/d-request-dump-extract.json`, `scratch/raw/d*.err` | **SKIP for the model reply:** every Hermes model call returned HTTP 402 (daily pacing allowance), so the model was never seen using the goal. Run from this worktree with the repo plugin enabled |

#### Phase 27 Path

- **Claude Code receiver: the start prompt is the command.** Launch with a start prompt that begins `/goal <slice>` (slice at or under 4,000 characters, which is the same cap as the slice limit). Selected by probe A. A start hook cannot carry it on an interactive session (probe B), so the hook path is out. Open design point for phase 27: a Claude start prompt is one prompt, so the claim seed (`/speckit:resume` and the packet answer) cannot also be that prompt. Either the goal command goes first and the resume seed follows by another route (the existing SessionStart context path is a candidate), or the slice rides in the seed as the fenced block and the model is asked to send `/goal`. Phase 27 must choose one and prove it.
- **Codex receiver: the seed asks the model to create the goal, with the fenced-slice request as the fallback.** Selected by probe C: the start prompt cannot be the command, the seed and the hook context both got `create_goal` called once each, within 4,000 characters. Treat it as a request, not a guarantee, and keep the fenced-slice fallback the GOAL POSTURE RULE already requires.
- **Hermes: no new Claude-style mechanism.** Probe D shows `HERMES_SPEC_FOLDER` plus the existing plugin is enough for the bind, so phase 26 binds Hermes through the shared core as planned and phase 25 only has to export the variable to the receiver.

Confidence: Claude path high (a positive run, a limit run and a control, repeated in two modes, one version). Codex path medium (n = 1 per route, model-mediated, limit second-hand). Hermes bind high, model-visible use unobserved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| scratch/probe-a-claude-start-prompt.md | Created | Probe A runs and control |
| scratch/probe-b-claude-start-hook.md | Created | Probe B runs and controls |
| scratch/probe-c-codex-goal.md | Created | Probe C runs, control and limit |
| scratch/probe-d-hermes-spec-folder.md | Created | Probe D runs and control |
| scratch/operator-approval.md | Created | Approval, isolation, versions, baseline |
| scratch/raw/ | Created | Pane captures, hook scripts, wrappers and the request-dump extract the records cite |
| tasks.md, acceptance-criteria.md, spec.md, implementation-summary.md | Modified | Closure records |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One probe at a time through `env -i` wrappers (`scratch/raw/run-claude.sh`, `run-codex.sh`, `run-hermes.sh`), so loop variables never leaked in. Claude used `--setting-sources project,local` in throwaway projects. Codex used a throwaway `CODEX_HOME` per probe with the auth file symlinked and never read, which also kept the probe goals out of the real goals database. Hermes ran from this worktree root with the goal state redirected to the scratchpad. Interactive TUIs were driven in tmux. The operator-approved bypass flags were not needed and not used.

Deviations from the plan: the plan called for eight runs and about 26 were made, because probe B needed an interactive and a print-mode pair to separate "hook output ignored" from "hook never ran", and probe D could not get a model reply, so the request payload Hermes writes for a failed call was read instead. The Claude self-invocation guard was overridden as the operator approved (probes ran under a Claude Code session with the nesting variables stripped).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Probe before building | The design rested on four claims read from code and docs, and a hook built on an unrun claim can fail without a sound |
| Run each probe with a control | A run that comes out the same whether the claim is true or false confirms nothing |
| Record the interactive-versus-print split for Claude hooks | The receiver is interactive, and the print-mode success would have misled phase 27 |
| Read the Hermes request payload when the provider refused | It is the rendered system prompt the model would have received, so the goal section is observable without a model reply |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `RESULT: PASSED` (Errors: 0, Warnings: 0; AC_CLOSURE 5/5, AC_COVERAGE 5/5) |
| Four probe records and four controls | present under `scratch/`, each cited above |
| Probe processes and tmux | none left: 17 Codex app-server daemons spawned by the probes were stopped (the two pre-existing ones remain); `tmux ls` reports no server |
| Goals | Claude A2 cleared with `/goal clear` and read back as `No goal set`; Codex C1b, C2, C3 cleared or their throwaway sessions and homes deleted; Hermes records lived only in the scratchpad state dir, deleted. Hermes session rows for the three probe sessions remain in `~/.hermes/state.db` (no safe removal command) |
| Reverted or removed | scratchpad probe dir (throwaway hooks, settings, CODEX_HOMEs, Hermes goal state); the probe Claude project logs under `~/.claude/projects`; three Hermes request dumps under `~/.hermes/sessions` (their credential header was not copied anywhere); the gitignored `.hermes/plugins/repo-guards/__pycache__` the Hermes run created. Nothing was installed in the repo or in `~/.claude`, `~/.codex` or `~/.hermes` configuration; the real `~/.codex/auth.json` mtime is unchanged (2026-10-16) |
| Scope | `git -c core.fsmonitor=false status --short` shows this phase folder plus changes by other agents that this run did not make: `.env.example`, `.skilled/bin/skilled-loop`, `.skilled/commands/speckit/handoff.md`, `.skilled/hooks/session-relaunch/**` (README, bin, lib, tests), `ENV-REFERENCE.md`, the phase 025 folder docs, and the pre-existing untracked `.opencode/cli.json` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A probe shows behavior on this machine and these runtime versions only (Claude 2.1.310, Codex 0.164.0, Hermes 0.21.1). A runtime update can change it, so each record names the version.
2. Interactive runs were driven through tmux. A real terminal's paste handling can differ, notably on Codex (a pasted `/goal` went in as plain text).
3. Hermes could not be taken past the provider limit, so model-side use of the goal is unobserved.
4. Hook error paths and an empty goal text were not probed.
<!-- /ANCHOR:limitations -->
