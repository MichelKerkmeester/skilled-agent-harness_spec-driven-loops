---
title: "Implementation Summary: Phase 2: deepseek-harness-persona-probe"
description: "A DeepSeek Harness child given the read-only context persona read its file with and without a tool-mapping line, so the harness skill was not changed and the verdict is recorded."
trigger_phrases:
  - "deepseek harness persona probe implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe"
    last_updated_at: "2026-11-14T16:33:11Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 2 on the verdict no-line-needed after a control and a probe"
    next_safe_action: "Review the verdict and the incomplete harness tool list"
    packet_purpose: "Purpose: One live control and one live probe show whether a harness child given a read-only persona reads the file it is asked to read, and the harness skill says what the runs showed."
    blockers: []
    key_files:
      - "specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe/scratch/verdict.md"
    session_dedup:
      fingerprint: "sha256:e010ca2bcbac0342783c0881c35811d8f58eb023c9eae7de08a679aa4c357a7f"
      session_id: "scaffold-002-deepseek-harness-persona-probe"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3eadb8bc-945b-4a2e-8183-a55e83f9e728"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T16:33:11Z"
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
| **Spec Folder** | 002-deepseek-harness-persona-probe |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing under `.skilled/` changed in this phase. The finding was that the harness documents name no read tool, so a harness child given a read-only persona might read nothing. Two live runs settled it: the harness has a tool named `read`, and the child used it with no mapping line. The verdict is `no-line-needed`.

### Phase 2: deepseek-harness-persona-probe

The control inlined the `context` persona, which denies Bash and names Read, Grep and Glob, exactly as rule 7 of the harness skill requires today. The probe added one tool-mapping line above the persona. Both children called `read` on the file they were asked for and ended their report with the file's path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/baseline.txt` | Created | The measured behavior, the binary and its version against the pin, the route, the tool names and the dispatch shape |
| `scratch/dsh-control-prompt.txt`, `scratch/dsh-probe-prompt.txt` | Created | The two prompts |
| `scratch/dsh-control-report.txt`, `scratch/dsh-probe-report.txt` | Created | The final message of each run |
| `scratch/dsh-control-events.jsonl`, `scratch/dsh-probe-events.jsonl` | Created | The event stream of each run, which shows the tool each child called |
| `scratch/verdict.md` | Created | The verdict, its evidence and the limits of that evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session read the harness skill and ran both dispatches itself with the documented read-only shape: a scratch directory outside the checkout, a fresh `DSH_HOME` for each run, the route, lineage and guards patches by absolute path, and the prompt on stdin. It added `--add-dir` for the worktree so the child could read the file there. Each run was accepted on three readings in order: exit 0, a last `final` event with reason kind `completed`, and the last line of the final message.

The installed `dsh` is 0.2.2-rc.3 and the skill pins 0.2.2-rc.1. The skill says to refuse any other version, so the session stopped and asked. The operator chose to waive the pin for this probe.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `no-line-needed`, and the harness skill is not edited | The control child read its file with no mapping line. The spec changes rule 7 only when the control reads nothing |
| The runs were made on 0.2.2-rc.3 | The operator waived the version pin for this probe. The verdict says so and claims nothing certain about 0.2.2-rc.1 |
| The tool name was read from a run, not from the config | `--dump-config` lists tool packages. The model-facing name `read` appears only in a run's `tool_call` event |
| The incomplete tool list in the skill is reported, not fixed | The spec keeps the skill unchanged on this verdict. The sentence that lists `bash`, `write`, `edit` and `subagent` leaves out `read` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Control run | Exit 0, empty stderr, reason kind `completed`, one `read` call, last line `FILES READ: .skilled/agents/README.txt` |
| Probe run | Exit 0, empty stderr, reason kind `completed`, one `read` call, last line `FILES READ: .skilled/agents/README.txt` |
| `rg -c '^verdict: ' scratch/verdict.md` | 1 |
| `rg -c -i 'tool mapping'` on the harness skill | Prints no line, the same as before, as the spec requires for this verdict |
| Search of both prompts for `api_key` and `token=` | No line |
| Strict validation of this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One run each way.** The verdict is observed once and not proven.
2. **The runs were made on an unpinned version.** The skill pins 0.2.2-rc.1 and the machine runs 0.2.2-rc.3.
3. **Only a read was tested.** The harness names of the search tools were not observed, so a persona task that needs Grep or Glob is untested.
4. **The harness skill's tool list is incomplete.** `references/guards-and-hooks.md` line 61 lists four tool names and leaves out `read`. That sentence is what made the predecessor packet mark the harness `needs the line`. It is a follow-up for the harness packet's owner.
<!-- /ANCHOR:limitations -->

---
