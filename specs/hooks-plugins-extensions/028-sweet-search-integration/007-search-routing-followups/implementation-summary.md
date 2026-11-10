---
title: "Implementation Summary: Phase 7: search-routing-followups"
description: "The search command runs its default lane through the ripgrep wrapper, and a prompt about searching the spec docs routes to system-spec-kit."
trigger_phrases:
  - "search routing followups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/028-sweet-search-integration/007-search-routing-followups"
    last_updated_at: "2026-11-10T07:13:04Z"
    last_updated_by: "conductor"
    recent_action: "Built, gated and closed"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-search-routing-followups"
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
| **Spec Folder** | 007-search-routing-followups |
| **Completed** | 2026-11-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`/speckit:search` on a common phrase now returns 20 ranked files and says how much it left out. On `trigger index` the command used to print 2,614 match lines; it now prints 20 rows and `hidden: { files: 1329, matches: 2526 }`.

### Phase 7: search-routing-followups

Phase 6 put the flood control in `rg-wrapper.mjs`, but the command people type still ran the raw recipe, so you only got the shaping when you called the wrapper by hand. The default free-text lane now runs `rg-wrapper.mjs structured '<QUERY>' --json`. The path-only, count and context modes keep their recipe, because paths and counts cannot flood and the wrapper has no context mode.

The advisor also sent a prompt that asks to search the spec and skill docs to `sk-doc`. `system-spec-kit` now declares four retrieval phrases, and that prompt ranks it first.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/search.md` | Modified | Default free-text lane runs the wrapper; the raw recipe covers a phrase that starts with `--` |
| `.skilled/commands/speckit/assets/search-presentation.txt` | Modified | Says the command runs the wrapper, and when the raw recipe applies |
| `.skilled/commands/speckit/README.txt` | Modified | Lane table and wrapper sentence |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modified | `spec docs`, `spec and skill docs`, `ripgrep retrieval`, `ripgrep wrapper` in `intent_signals` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Recompiled so the compiled signals match the metadata |
| `.skilled/skills/system-spec-kit/SKILL.md`, `changelog/v2.12.44.0.md` | Modified, Created | Version 2.12.44.0 and its entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

In worktree 335 on top of the merged phase 6 tree. The conductor ran the raw recipe and the wrapper on the same phrase, then edited the command, its asset and its README. For the advisor it first added five phrases built on the word `search`; the divergence ratchet failed, and a run on the unchanged metadata passed, which pinned the failure on the edit. Single-phrase runs showed every phrase holding `search` moved one approved route, so the final four avoid the word. The conductor then rebuilt the advisor, reran both probes, and ran the advisor suite, the alignment battery and strict validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Route only the default lane through the wrapper | The structured lane is the one that floods. The wrapper's path and count modes add nothing a count or a path list lacks, and it has no context mode |
| No intent signal holds the word `search` | `spec search`, `docs search` and `search the spec docs` each moved the labeled prompt `rr-iter3-061`, a request for a helper in a `research` summary, from `sk-code` to `system-spec-kit`. `spec docs` and `ripgrep retrieval` moved nothing |
| Leave probe P02 as a tie | P02 asks to update an audit so it counts every matching line, which is a code edit. The advisor scores `sk-code` and `system-spec-kit` at 0.82 each, and `sk-code` is a correct answer. Phrases that broke the tie (`retrofit audit`, `row per file`) copied the probe's wording and opened a new local-versus-native divergence on `rr-iter3-135` |
| Leave the `AGENTS.md` Gate 1 sentence as written | "It reads the committed index; exit 1 with no rows is a clean no-hit" is still true: the fallback only adds candidates after that read, and exit 1 still means nothing matched. The sentence is copied into every vendoring repository through the manifest, so a rewording has a cost and corrects nothing |
| Operator answers recorded | Asked how to land the build, the operator chose "Rebase, regate, push". They then asked for the standing failures to be fixed too, and for no open ends, which is this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Raw recipe on `trigger index`, before | 2,614 match lines |
| `rg-wrapper.mjs structured 'trigger index' --json`, after | 20 results, `matchCount` 2614, `fileCount` 1349, `hidden: { files: 1329, matches: 2526 }`, `truncated: true` |
| Wrapper on a phrase with no match | exit 1, `outcome: no-match` |
| Wrapper on `--foo` | exit 2 |
| Probe P01, before and after | `sk-doc` 0.87 first; now `system-spec-kit` 0.885, `sk-doc` 0.873 |
| Probe P02, before and after | `sk-code` first; now `sk-code`, `system-spec-kit` and `sk-doc` tied at 0.82 |
| Divergence ratchet on the unchanged metadata | `Tests  9 passed (9)` |
| Divergence ratchet with a `search` phrase | 1 failed: `rr-iter3-061: nativeTop ledger=sk-code current=system-spec-kit` |
| Advisor suite on the final four phrases | 161 files passed, 1383 passed, 8 skipped, 0 failed, exit 0 |
| Alignment battery, first run | `pass=47 fail=1`: `S7-skill-graph-freshness`, `SIGNAL DRIFT compiled vs disk: system-spec-kit`. Fixed with `skill_graph_compiler.py --export-json`, then the advisor suite was rerun with the result above |
| Alignment battery, after the recompile | `pass=52 fail=0 cannot_run=0 not_applicable=7` over 16 files |
| `validate.sh --strict --recursive` on the packet | 8 folders, each `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A phrase that starts with `--` skips the wrapper.** The wrapper reads it as a flag and exits 2. The command runs the raw Section 2.1 recipe for that phrase, which prints every match.
2. **Probe P02 still ties.** A prompt that mixes a code edit with spec search can route to `sk-code`. Name the skill in the prompt when the route matters.
3. **A running advisor keeps the old signals.** Run `skill_graph_scan --trusted`, then `advisor_rebuild --trusted --force true` after pulling this change.
<!-- /ANCHOR:limitations -->

---


