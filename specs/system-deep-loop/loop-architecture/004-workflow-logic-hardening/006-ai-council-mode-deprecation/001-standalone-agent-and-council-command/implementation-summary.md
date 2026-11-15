---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "standalone agent and council command implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/001-standalone-agent-and-council-command"
    last_updated_at: "2026-11-15T01:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed child 001 with every acceptance row Met"
    next_safe_action: "Close child 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-standalone-agent-and-council-command"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-standalone-agent-and-council-command |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The AI council now runs without the deep-loop hub. `@ai-council` carries its own artifact layout and output schema, and `/speckit:ai-council` binds the spec folder and dispatches the agent once.

### Phase 1: standalone-agent-and-council-command

The agent used to read its layout, its schema and its event script from the `deep-ai-council` packet. Removing the mode would have left it pointing at nothing. You can now convene a council with one command, and the agent writes only under the bound packet's `ai-council/` folder with `bash: deny` still set.

This child also captured the start state for the whole phase: 58 gates at commit `a55b1f3d58`, six of them already failing, and the list of history paths the vocabulary sweep must skip.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/ai-council.md` | Modified | Holds the artifact layout and output schema, and names no packet path, script or `node` call |
| `.claude/agents/ai-council.md` | Modified | The hand-kept Claude twin of the same body |
| `.codex/agents/ai-council.toml`, `.pi/agents/ai-council.md`, `.dsh/agents/ai-council.patch.yml` | Regenerated | Generated agent mirrors |
| `.skilled/agents/orchestrate.md` | Modified | The Deep Route rule names the two deep agents, and the council stays a leaf |
| `.skilled/commands/speckit/ai-council.md` | Created | The single-round council command |
| `.skilled/commands/speckit/assets/speckit-ai-council.yaml` | Created | One workflow file for both modes |
| `.skilled/commands/speckit/assets/speckit-ai-council-presentation.txt` | Created | The command's presentation text |
| `.skilled/skills/system-spec-kit/command-metadata.json` | Modified | The command row, owned by `system-spec-kit` |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | The advisor tracks the new command |
| `../scratch/gate-baseline.md`, `../scratch/exceptions.md`, `../scratch/council-inventory-start.txt` | Created | The start state the later children are measured against |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The gate baseline was captured first, in commit `c67864c53c`. The agent, the command and their mirrors landed in `34692583f9`. The agent mirror checker, the roster check and the three generators with `--check` exit 0. A dispatch on OpenCode 2.3.0 against a probe packet wrote seven files under `ai-council/` and nothing outside it. The advisor clause of AC-009 stayed open until child 004 removed the hub council lanes, and it passes now.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Option B, a dedicated command | The operator chose it as D3. A council needs a bound spec folder, and a command is where this repository binds one. |
| `patch: allow` with `bash: deny` | The operator approved it as Q010. OpenCode 2.3.0 gives an agent a write tool only when patch or bash is allowed, and patch is the narrower of the two. |
| A rolled-back round stays in place | The agent has no shell, so it cannot move or hash a file. It marks the round with rollback and superseded events instead. |
| The agent and command files were written directly | They are agent and command definitions, and the dispatch worker would have been editing the instructions it runs under. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `rg -n 'system-deep-loop\|deep-ai-council\|/deep:ai-council\|append-mode-event\|persist-artifacts\|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md` | Prints nothing |
| `node .skilled/bin/check-agent-mirror-sync.cjs --all` | `11 agent(s) checked`, all comparable mirrors in sync, exit 0 |
| `find -L` for `ai-council*` across the eight agent folders | Prints 8 |
| `find -L` for the command across the six runtime folders | Prints 6 |
| `advisor_recommend` for the council prompt | `/speckit:ai-council` at confidence 0.8412 |
| `validate.sh` on this folder with `--strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A rolled-back round is not moved aside.** Its files stay under `ai-council/` and the events say they are superseded. Read the event log before trusting a round's files.
2. **The dispatch probe ran on OpenCode 2.3.0 only.** The CLI skill docs were verified on 2.1.4. Rerun the probe after an OpenCode downgrade.
<!-- /ANCHOR:limitations -->

---


