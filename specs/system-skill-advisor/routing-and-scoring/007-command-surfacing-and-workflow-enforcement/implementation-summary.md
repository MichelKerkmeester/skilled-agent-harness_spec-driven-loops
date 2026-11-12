---
title: "Implementation Summary"
description: "Thirty research iterations across three models produced one design for surfacing every slash command through the skill advisor, with one decision returned to the operator."
trigger_phrases:
  - "command surfacing and workflow enforcement implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement"
    last_updated_at: "2026-11-12T14:44:01Z"
    last_updated_by: "generate-context"
    recent_action: "Completed the command surfacing research, review and operator decisions"
    next_safe_action: "Continue the build in packet 008 command surfacing build"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/research.md"
      - "specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md"
    session_dedup:
      fingerprint: "sha256:11be4ede7799b8835497eb4f70976b3b341d4107315f16e42d8d45d4dcad7c6a"
      session_id: "scaffold-007-command-surfacing-and-workflow-enforcement"
      parent_session_id: null
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-command-surfacing-and-workflow-enforcement |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

You now have an evidence-backed design for making the skill advisor surface all 45 slash commands and for bringing a chat-only request onto the right command workflow. Three model lineages ran 10 iterations each and agreed on the mechanism. They split on one point, how strict the run-or-ask default should be, and that decision is yours.

### Research how the skill advisor should surface slash commands and how native chat reaches the proper command workflow without the user typing a command

The research found four stacked gaps: an inventory built from four hand-kept sources with 22 bridge rows switched off, command keywords that only match typed slashes, a recommendation with no command field, and no rule telling a model what to do with a surfaced command. `research/research.md` gives five changes in order, a verdict for each of the 45 commands and the alternatives the lineages rejected.

No runtime code changed. The build is planned from the synthesis.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Merged synthesis of the three lineages |
| `research/lineages/{codex-luna,opencode-deepseek,pi-deepseek}/` | Created | Each lineage's 10 iterations, state and own synthesis |
| `research/findings-registry.json`, `research/resource-map.md`, `research/fanout-attribution.md` | Created | Merged registry, resource map and attribution |
| `spec.md` | Modified | Research angles and the generated findings block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

`fanout-run.cjs` ran the three lineages in parallel and exited with all three fulfilled. `fanout-merge.cjs` merged three registries, and the resource map was emitted from 30 deltas. The orchestrator read the three lineage syntheses, opened the citations listed in section 16 of `research/research.md` and wrote the merged file. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Forced all 10 iterations per lineage with stop policy `max-iterations` | The operator asked for 30 iterations, and convergence would have stopped a lineage early |
| Ran the OpenCode lineage on OpenCode 1.19.4 | OpenCode 2.2.7 lists no `opencode-go` models |
| Pinned Pi to 1.5.0 for the run | Pi 1.5.2 failed to load 16 repository extensions in this checkout |
| Kept the lineage disagreement on run-or-ask visible | Two verdicts from one model family are a preference, not a finding |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `orchestration-summary.json` | `total: 3`, `succeeded: 3`, `failed: 0` |
| Iteration files per lineage | 10, 10 and 10, with 10 iteration records in each state log |
| `fanout-merge.cjs` | `status: ok`, `merged_lineages: 3` |
| Citations opened by the orchestrator | 15 resolved, one line number off by one, one lineage claim found wrong and corrected in the synthesis |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Two of three lineages share a model family.** Agreement between the DeepSeek lineages is one lens. The synthesis marks where only they agree.
2. **Several counts are carried on a lineage's word.** Section 16 of `research/research.md` lists what the orchestrator did not re-check.
3. **The workflow's synthesis close-out event was not appended at the packet root.** A fan-out run has no root state log, so the close-out lives in each lineage's own log.
<!-- /ANCHOR:limitations -->

---


