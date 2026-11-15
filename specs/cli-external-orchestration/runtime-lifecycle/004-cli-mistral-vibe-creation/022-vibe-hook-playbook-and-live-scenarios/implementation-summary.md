---
title: "Implementation Summary"
description: "Every Vibe hook, hook part, mirror and the renderer has a conversation scenario a live Vibe session passed: 26 PASS, every runner scenario sends two or more messages, and the handover hop was run by hand."
trigger_phrases:
  - "vibe hook playbook and live scenarios implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios"
    last_updated_at: "2026-11-15T13:28:41Z"
    last_updated_by: "generate-context"
    recent_action: "Ran the last ten Vibe hook scenarios live as multi-turn conversations; all 26 now pass"
    next_safe_action: "Commit the 022 work with explicit pathspecs, then ask before pushing to origin/main"
    packet_purpose: "Purpose: Every Vibe hook, hook part, generated mirror and the hooks renderer has a conversation scenario that a live Vibe session passed, and the branch carries no open in-scope alignment finding."
    blockers: []
    key_files:
      - "scratch/verdicts.md"
      - "scratch/live/VIB-HK-026/hop-record.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:75bccaa56fb4cd2f4b16aa2179c473c2881e95a281301dae1d0d5f9bc5c825bf"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "425e79e1-c5de-4edb-b8bb-77ee620d2538"
      workspace: "/Users/michelkerkmeester/worktrees/public/383-mistral-vibe-runtime"
      savedAt: "2026-11-15T13:28:41Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-vibe-hook-playbook-and-live-scenarios |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every Vibe hook, hook part, generated mirror and the hooks renderer now has a conversation scenario that a live Vibe session passed. Twenty-five of the 26 run through the shared runner, and each sends at least two user messages, with the later one checking something that only holds across turns. The manual handover hop is the 26th: the runner cannot drive two sessions with a shell step between them, so it was run by hand in a terminal and recorded.

### Phase 22: vibe-hook-playbook-and-live-scenarios

The shared runner gained a `vibe` adapter and a `launch_setup` key, which changes the Vibe home after the runner writes it and before Vibe starts. That key is what let the last operator-only scenarios run under the runner: a 30,000-token probe model for the mid-turn compaction, a fixture MCP server for the route guard, and an agent profile that names the mirrored prompt. The branch passed one local skilled alignment run, and its 51 confirmed findings were fixed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | Modified | The `vibe` adapter and the `launch_setup` key |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified | Accepts `launch_setup` |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md` | Modified | Documents `launch_setup` and the `vibe` runtime |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/` | Created | The 26 conversation scenarios |
| `.vibe/plugins/repo-guards/fixtures/journal-check.cjs` | Created | Judges one post-tool result per question from the session journal |
| `.vibe/plugins/repo-guards/fixtures/mcp-route-guard/stdio-server.cjs` | Created | A dependency-free stdio MCP server for the route guard scenario |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Modified | `--all` honours `SPECKIT_DIST_WORKSPACE_ROOT` |
| `scratch/verdicts.md`, `scratch/live/` | Created | One verdict per scenario and the evidence behind it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each scenario ran live against Vibe 3.1.2 on `deepseek-flash`, one at a time, and its runner evidence was copied under `scratch/live/`. Two scenarios failed first, VIB-HK-006 and VIB-HK-024. Their causes were fixed in the session reader, the compaction watermark and the agent generator, and both reruns passed. The hop was driven in a tmux pane. Tasks T037 to T096 in `tasks.md` carry the checks and their evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared runner, with a Vibe adapter | A one-off Vibe script would give Vibe a second evidence shape and drift from the five runtimes the runner already drives |
| A `launch_setup` key instead of more operator-only procedures | The three remaining blockers were all Vibe-home changes the runner could make before launch, so a written procedure was the weaker proof |
| Every scenario sends a second message | The operator asked on 2026-11-15 for proper conversation scenarios, not single-prompt checks, and chose all of them |
| Journal checks judge one tool result, never a count | Models repeat calls, and Vibe moves older journal records into snapshot generations, so counts changed between runs |
| The VIB-HK-026 hop is recorded by hand | The runner cannot run a shell command between two sessions or carry the note path a run creates |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live verdicts | 26 PASS, 0 FAIL, 0 OPERATOR-ONLY (`scratch/verdicts.md`) |
| Playbook validator on the Vibe package | `scenarios=51 violations=0` |
| Runner suite | 27 pass, 0 fail |
| Dist checker suite | 9 pass, 0 fail |
| Vibe hook suites | 41 pass, 0 fail |
| `validate.sh <this folder> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hop stays outside the runner.** VIB-HK-026 has a hand-run record, not a runner row.
2. **The printed claim command drops launch flags.** `skilled-loop`'s `build_manual_command_template` replays extra arguments only in hop mode, so a manual claim command printed in an untrusted checkout leaves out `--trust`.
3. **Vibe handover needs its switch.** Handover is default-on for Claude Code only, so a Vibe hop needs `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`.
4. **The runner leaves the Vibe home behind.** A fixed scratch path (VIB-HK-017, VIB-HK-018) must be cleared with `chmod -R u+w` before a rerun, because Vibe's extracted plugin files are read-only.
<!-- /ANCHOR:limitations -->

---
