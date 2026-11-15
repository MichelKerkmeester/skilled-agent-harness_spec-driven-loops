---
title: "Implementation Summary"
description: "The 26 Vibe hook scenarios this phase owns each passed live: every runner scenario sends two or more messages, and the handover hop was run by hand."
trigger_phrases:
  - "vibe hook playbook and live scenarios implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios"
    last_updated_at: "2026-11-15T16:28:25Z"
    last_updated_by: "generate-context"
    recent_action: "Reran the five hardened scenarios live; all passed"
    next_safe_action: "Await the operator's go-ahead to push the closeout to origin/main"
    packet_purpose: "Purpose: Every Vibe hook, hook part, generated mirror and the hooks renderer has a conversation scenario that a live Vibe session passed, and the branch carries no open in-scope alignment finding."
    blockers: []
    key_files:
      - "tasks.md"
      - "scratch/verdicts.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:fae0c9e06aab9359072a2c35bad25df6cb9fbe87b4b2ebab0fd57afa14f23878"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "425e79e1-c5de-4edb-b8bb-77ee620d2538"
      workspace: "/Users/michelkerkmeester/worktrees/public/383-mistral-vibe-runtime"
      savedAt: "2026-11-15T16:28:25Z"
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

Every Vibe hook, hook part, generated mirror and the hooks renderer that existed when this phase ran has a conversation scenario that a live Vibe session passed. Twenty-five of those 26 run through the shared runner, and each sends at least two user messages, with the later one checking something that only holds across turns. The manual handover hop is the 26th: the runner cannot drive two sessions with a shell step between them, so it was run by hand in a terminal and recorded.

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
| Live verdicts | 26 PASS (`scratch/verdicts.md`); the five checks hardened after the review passed a live rerun. VIB-HK-005, 006 and 007 failed when first rerun after the automatic hand-over tier changed their hooks; phase 023 fixed the scenarios and reran VIB-HK-004 to 008 live on `deepseek-flash`, all PASS |
| Playbook validator on the Vibe package | `scenarios=51 violations=0` at `af1a00789b8`; `scenarios=52 violations=0` after the merge brought VIB-HK-027 |
| Runner suite | 27 pass, 0 fail at `af1a00789b8`; 29 pass, 0 fail after the review fixes |
| Dist checker suite | 9 pass, 0 fail |
| Vibe hook suites | 41 pass, 0 fail at `af1a00789b8`; 46 pass, 0 fail after the merge |
| `validate.sh <this folder> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hop stays outside the runner.** VIB-HK-026 has a hand-run record, not a runner row.
2. **Vibe handover needs its switch.** Handover is default-on for Claude Code only, so a Vibe hop needs `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`. This is intended, and the cli-mistral-vibe skill now says so.
3. **VIB-HK-027 is not covered here.** The automatic handover tier's scenario arrived with the merge of origin/main and belongs to that work.
4. **The runner keeps the Vibe home by default.** Its journal is the only copy, so removal is opt-in with `--remove-home`. Without the flag, a fixed scratch path (VIB-HK-017, VIB-HK-018) must still be cleared with `chmod -R u+w` before a rerun.
<!-- /ANCHOR:limitations -->

---
