---
title: "Implementation Summary: Series parent rule, sibling listing and trigger phrases for new packets"
description: "A second small change to the same artifact now has a legal home, the series parent, and create.sh shows the recent packets in the track and seeds trigger phrases that name the topic."
trigger_phrases:
  - "series parent rule shipped"
  - "sibling listing shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing"
    last_updated_at: "2026-10-06T21:20:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the series parent rule, seeded phrases and the sibling listing"
    next_safe_action: "Rerun the sibling census in two to three weeks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-series-parent-rule-and-sibling-listing"
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
| **Spec Folder** | 006-series-parent-rule-and-sibling-listing |
| **Completed** | 2026-10-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A second small change to the same file no longer has to become a new top-level packet. The rules now name a series parent for it, and `create.sh` shows you the packets created in the same track over the last 14 days before it hands out a number, so the sibling is in front of you when you decide.

### The series parent rule

`phase-definitions.md` §2 now has a second way to qualify for phases. Work qualifies for a series parent when it changes the same named artifact as an existing standard packet, in the same track, and is a different change rather than a correction of that packet's own change. A correction still continues the existing packet. Every other doc that restates the phase thresholds now names this exception, Gate 3 Option C in `AGENTS.md` names it, and the stale labels that said Option D adds a phase and Option E skips are gone.

### Tooling

`create.sh` lists the recent packets in the target track on stderr before it numbers a new top-level packet, and ends the listing with a pointer to the rule. It replaces the spec template's four placeholder trigger phrases with the packet's slug and a phrase cut from its description, and the phrase judge now reports those placeholders under a `template-default` class.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/structure/phase-definitions.md` | Modified | Series parent rule, §4 exception, label fixes |
| `references/structure/sub-folder-versioning.md`, `phase-system.md` | Modified | Name the exception, say when a version fits instead |
| `references/workflows/quick-reference.md`, `spec-folder-authoring-checklist.md` | Modified | §8 rule, priority line, labels, `create.sh` instead of `mkdir` |
| `SKILL.md`, `AGENTS.md`, `speckit-plan.yaml`, `speckit-complete.yaml` | Modified | Rule 16, Gate 3 Option C, Option C for adding a phase |
| `runtime/cli/spec/create.sh` | Modified | Sibling listing and seeded trigger phrases |
| `runtime/cli/retrieval/lib/phrase-judge.mjs` | Modified | `template-default` class |
| `runtime/cli/tests/create-root-numbering.vitest.ts`, `create-track-refresh.vitest.ts`, `trigger-index.vitest.ts` | Modified | Coverage for the three behaviours |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four DeepSeek V4.1 Flash workers, dispatched one at a time through `cli-opencode`, each applied one change from a literal brief with a bound write path. The orchestrator read every diff before the next dispatch and made three fixes itself: punctuation in a description became a word break instead of vanishing, the listing guards a track folder that does not exist yet, and the listing function moved so it no longer split `resolve_branch_name` from its doc comment. One threshold restatement the review missed, in `spec-folder-authoring-checklist.md`, was found by a search and fixed. Each worker run also rewrote `.opencode/package.json` to the local opencode plugin version, which was restored every time.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the rule before the tooling | The grouped packets cite their own siblings, so the agents knew and had no legal home for the work |
| Same artifact as the test, not outcome family | An artifact can be checked, an outcome family turns a parent into a bucket for the whole track |
| Leave the Gate 3 hook alone | It never sees a packet being created and its question text is compared byte for byte |
| No backfill of the 195 old specs | A warning never fails a run, and each edit forces metadata and index rebuilds |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Six create, scaffold and trigger-index test files | PASS, 96 tests, baseline was 90 |
| `create.sh --track system-speckit` in the worktree | Lists nine recent packets, `--json` stdout parses |
| `create.sh` into a track that does not exist | No listing, no stack trace, exit 0 |
| Old labels | `rg` finds no "Option E" or "Option D adds a phase" in the edited docs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The listing cannot stop an agent that ignores it.** Only the rule does that. The census baseline is 17 recent packets in 6 same-track clusters, so rerun it in two to three weeks to see whether new singletons still appear.
2. **Existing specs keep the template phrases.** About 195 specs still carry them, and they now warn under `template-default` without failing.
3. **The operator's global `~/.claude/CLAUDE.md` still has the old Gate 3 Option C wording.** It is outside this repository.
4. **The four parents grouped on 2026-10-06 predate the rule.** `system-skill-advisor/026-defect-and-hardening-fixes` groups by outcome, not by artifact, so it would not qualify as a series parent today.
<!-- /ANCHOR:limitations -->

---
