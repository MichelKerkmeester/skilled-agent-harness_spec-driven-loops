---
title: "Implementation Summary: Phase 2 retrieval lessons research"
description: "Five-iteration research rated five sweet-search lexical techniques for system-spec-kit retrieval: build three small changes, defer two, no embeddings or daemon."
trigger_phrases:
  - "retrieval lessons research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research"
    last_updated_at: "2026-11-09T14:30:54Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Completed 5-iteration retrieval-lessons research and wrote research/research.md"
    next_safe_action: "Plan a build phase for the three adopted lessons from research.md section 9"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:5df338a0476a60d029ae45f28db0822a9f24b8d44cb6801aef0f201f0cbed3e4"
      session_id: "phase-2-retrieval-lessons"
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
| **Spec Folder** | 002-retrieval-lessons-research |
| **Completed** | 2026-11-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

You now know which of sweet-search's search ideas improve Skilled's own retrieval, and what each costs. Three are worth building as small changes inside system-spec-kit, two wait for a trigger, and none needs embeddings, MCP, a daemon or a new index.

### Phase 2: retrieval-lessons-research

Five parallel iterations each read one sweet-search module and Skilled's own lookup and ripgrep code, ran real queries against this repo, and rated the lesson. The synthesis ranks them: a candidate count and a section 9 doc row first, a zero-hit fallback to git-changed spec docs second, an elision line in the ripgrep wrapper third. Boilerplate demotion and an out-of-scope hint are deferred with named triggers. No `.skilled/` file changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Verdict per lesson, ranked build list, eliminated alternatives |
| `research/iterations/`, `research/deltas/`, state and ledger files | Created | Per-iteration evidence and audited loop state |
| `spec.md`, `plan.md`, `tasks.md` | Created | Phase 2 scope, plan and tasks |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The `/deep:research:auto` workflow ran 5 iterations in parallel on cli-devin `deepseek-v4-1-flash-max`, one lesson each. `verify-iteration.cjs` passed for all five. Before synthesis, five code claims were checked directly and every source tag was remapped to its finding line. Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Build lessons 5, 1 and 2, in that order | Each fixes a measured gap with file reads, git or ripgrep only; the first sets the truncation-report shape the others reuse |
| Defer lessons 3 and 4 | Lesson 3 costs 200–270 lines for stock-sentence queries only; lesson 4's keyed half has no caller that passes a scope |
| One question per parallel iteration | The operator asked for parallel runs, and the five lessons are independent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `verify-iteration.cjs` for iterations 1–5 | PASS, 5/5 |
| Code spot checks: `lookup-trigger-index.mjs:83`, `:201`, `rg-lane.mjs:110`, `corpus.mjs:67`, live zero-hit lookup | PASS, all match |
| Source tags in `research.md` resolve to non-empty lines | PASS, 0 empty |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No real-query frequency data.** How often each gap fires comes from small probes, not a log of real prompts. Collect a Gate 1 query log before building the deferred lessons.
2. **Parallel iterations did not see each other.** Synthesis applied iteration 5's ordering note by hand.
<!-- /ANCHOR:limitations -->

---


