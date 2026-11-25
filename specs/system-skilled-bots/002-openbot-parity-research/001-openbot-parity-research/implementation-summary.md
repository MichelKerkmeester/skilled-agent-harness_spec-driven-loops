---
title: "Implementation Summary"
description: "A 52-iteration expansive research run found the smallest set of OpenBot parts a small team needs, and ranked them into a build order a first build packet can start from."
trigger_phrases:
  - "openbot parity research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research"
    last_updated_at: "2026-11-24T23:13:37Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded Rust MIT TUI decision; committing 002 without Vibe logs"
    next_safe_action: "Plan build packet 003: activity view and routines, then the Rust terminal screen"
    packet_purpose: "Purpose: A ranked, sourced build recommendation that names, for each of OpenBot's eight bot parts, what we have, what we lack, the smallest change that closes the gap and the reference repo to borrow from, plus a verdict on a terminal-first experience against a desktop app."
    blockers: []
    key_files:
      - "specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:77812ffc73e9d4dadc9c5ebbb501f02f2d4b1ecfbfd2e1f9f7a48d219538e71a"
      session_id: "scaffold-002-openbot-parity-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "335d5a41-9d36-45cb-8bae-6e6010fef894"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-24T23:13:37Z"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-openbot-parity-research |
| **Completed** | 2026-11-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

You now have a ranked, sourced build order for getting skilled bots close to OpenBot for a small team, without a server, a database or a desktop app. All four research lineages reached the same verdict independently: the terminal is enough, and every gap closes with a file-backed change to the existing runtime.

### OpenBot parity research

`research/research.md` walks OpenBot's eight bot parts one by one: what OpenBot does, what the other seven repos do better, what skilled bots has and the smallest change that closes the gap. It adds a terminal-versus-desktop verdict, a small-team model, a skip list and a reuse table with licenses. The first build packet it recommends is the activity view with an actor field, then the routine layer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Merged synthesis of the four lineages |
| `research/lineages/` | Created | Four lineages of 13 iterations each, with their own syntheses |
| `research/resource-map.md`, `research/findings-registry.json` | Created | Resource map and merged findings registry |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Created | Packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

One `/deep:research` fan-out in expansive depth mode, with the stop policy set to max iterations: two lineages on Devin `deepseek-v4-1-flash-max` and two on Vibe `deepseek-flash`, 13 iterations each. A one-word probe on each executor and a dry run came first. Every lineage finished all 13 iterations, so the Codex fallback was not used. Before the merge, the claims the ranking rests on were checked against their sources, and one overstated lineage claim about the desktop install was corrected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Four lineages of 13 iterations | Each lineage has a hard 4-hour limit, so smaller lineages left margin. The operator chose this split |
| Small-team scope | The operator chose it. It keeps sign-in, roles and shared memory in scope and skips enterprise parts |
| Merged build order by dependency, then leak risk | The four lineages ranked differently. Both rules appear in every lineage |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Iteration records | PASS: 52, 13 per lineage, each with `target_agent: "deep-research"` and `agent_definition_loaded: true` |
| Citations in `research/research.md` | PASS: 69 of 69 resolve to an existing file and line |
| Out-of-folder writes | PASS: `git status` showed nothing outside the packet in the worktree or the primary checkout |
| `validate.sh --strict` | See the final close-out run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No live use yet.** The ranking is a recommendation. No change was built or tried against a real team.
2. **Ended at budget, not saturation.** The last new-information ratios were 0.55 to 0.7, so more iterations would still find new detail, mostly in vibe-1, which read four of the eight repos.
<!-- /ANCHOR:limitations -->

---


