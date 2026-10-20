---
title: "Implementation Summary"
description: "Every plugin in .opencode/plugins now has a live playbook scenario, run on OpenCode 1 and 2 with DeepSeek v4.1 flash high: all 17 work on v1, 10 work on v2, and the 7 that do not are traced to four bridge-level causes."
trigger_phrases:
  - "live plugin playbook implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook"
    last_updated_at: "2026-10-20T19:30:00Z"
    last_updated_by: "group-034-worker"
    recent_action: "Closed the review rounds and recorded the run results"
    next_safe_action: "Push the merge to main and record each CI workflow's conclusion under AC-006"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/capture-proxy.mjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/results-matrix.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-034-live-plugin-playbook"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 034-live-plugin-playbook |
| **Completed** | 2026-10-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now check, plugin by plugin, whether OpenCode actually uses each plugin in `.opencode/plugins/`. Each check is a live model session with an observed effect, not a unit test. The first run says every plugin works on OpenCode 1. On OpenCode 2, seven plugins load but never produce their effect, and the run names why.

### Live plugin utilization playbook on OpenCode v1 and v2

The cli-opencode playbook has a new category, `plugin-utilization/`, with one scenario per plugin (CO-040 to CO-056). Each scenario gives the trigger prompt, the exact v1 and v2 commands, the check that proves the effect and the cleanup. The list comes from the plugin folder, so a new plugin shows up as a missing scenario.

The scenarios share one runner, `run-plugin-scenario.sh`. It routes the llmgateway provider through a local capture proxy, so the check can read the system prompt and tool results the model was sent. It also records new log and state lines, and keeps everything in the checkout's gitignored state folder. The proxy keeps no headers or keys and refuses plain HTTP except to loopback.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/manual-testing-playbook/plugin-utilization/*.md` (17) | Created | One scenario per plugin |
| `cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh` | Created | Runs one scenario on v1 or v2 and writes the evidence files |
| `cli-opencode/manual-testing-playbook/plugin-utilization/capture-proxy.mjs` | Created | Records what each model request carried, without headers |
| `cli-opencode/manual-testing-playbook/plugin-utilization/mcp-stub.mjs` | Created | A one-tool MCP server for the route-guard scenario |
| `cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modified | Lists the category, its index and section 22, and the new census |
| `cli-opencode/benchmark/reports/2026-10-20--manual-testing-playbook--plugin-utilization/` | Created | The first run, as a seven-file report package |
| `cli-opencode/benchmark/README.md`, `benchmark/reports/README.md` | Modified | List the new report |
| `scratch/live-runs/` in this packet | Created | Per-run evidence, the results matrix and the event probe |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

OpenCode 1 with DeepSeek v4.1 flash high wrote the scenario files from short briefs. I ran every scenario myself from the worktree, on OpenCode 1.19.3 and 2.0.32 (`--standalone`), and read each verdict from the capture, log or event file rather than the model's reply. A temporary probe plugin recorded which events each version delivers. That probe is how the v2 causes were confirmed. Luna reviewed read-only over four rounds. Rounds 1 to 3 found safety gaps in the scenario commands: guards that did not stop, temp paths left unchecked, and state that was not restored on interrupt. All were fixed, and the changed blocks were re-run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prove each plugin by an observed effect | A plugin that loads but never fires looks the same as one that works unless the check reads the block, the injected line, the log line or the file it writes |
| Capture through a local proxy, not the model's answer | The model can paraphrase or omit injected context; the proxy shows what was actually sent |
| Record the seven v2 failures, do not fix them | The task was to measure utilization; the fixes belong to the bridge and the plugins, with their own tests |
| Keep evidence in the checkout's gitignored state folder | A shared `/tmp` folder let runs from two worktrees overwrite each other |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live runs, OpenCode 1 | 17 of 17 PASS (`scratch/live-runs/results-matrix.md`) |
| Live runs, OpenCode 2 | 10 PASS, 7 FAIL, each FAIL with a root cause and evidence |
| Kill switch, `SYSTEM_SKILL_ADVISOR_DISABLED=1` | 0 `Advisor:` lines on both versions, against 2 (v1) and 1 (v2) without it |
| Re-run of the six blocks changed in review | `scratch/live-runs/round4-rerun.txt` |
| Playbook validator, links, sk-doc script tests, cite-drift | `scratch/live-runs/local-checks.txt` |
| Recursive strict validation of 082 | Recorded in `tasks.md` T013 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Seven plugins have no effect on OpenCode 2.** There are four causes. The shell tool is named `shell`, not `bash`. The subagent tool is `subagent`, and its argument is `agent`. `opencode2 run` never sends `session.created` for its own session. The bridge's `message.updated` lacks a top-level `sessionID` and `info.time.completed`. Each cause needs a bridge or plugin fix and its own test.
2. **The runs are model-driven.** A model can refuse or rephrase a trigger prompt. The prompts are framed as test fixtures for that reason, and a refusal shows up as a missing tool call, not as a false PASS.
3. **One run per cell.** Each verdict rests on one live session per version, not on repeated trials.
<!-- /ANCHOR:limitations -->

---
