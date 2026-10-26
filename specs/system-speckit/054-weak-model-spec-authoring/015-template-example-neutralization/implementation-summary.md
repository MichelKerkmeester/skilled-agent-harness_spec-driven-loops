---
title: "Implementation Summary"
description: "The template fill notes and the authoring card no longer retell the speed benchmark's own task. Every worked example now uses one neutral feature, a --keep option for a fictional rotate-logs.sh, and the guards, tests, census and review all pass, so every acceptance row is Met."
trigger_phrases:
  - "template example neutralization implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/015-template-example-neutralization"
    last_updated_at: "2026-10-26T18:30:00Z"
    last_updated_by: "closeout"
    recent_action: "Closed AC-003 on the review fix check's VERDICT: PASS; the phase is Complete"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-015-template-example-neutralization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-recommend-level-quiet`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-template-example-neutralization |
| **Completed** | 2026-10-26; code `62e4661e01`, docs `ef939bf0ac` on `worktrees/217-weak-model-spec-authoring`, not pushed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--quiet` prints one line. The default report is unchanged. WEAK: Implemented the feature. -->

A model that authors a spec packet no longer reads the speed benchmark's own task, a quiet flag for `recommend-level.sh`, in the fill notes or the authoring card. Every worked example now tells one neutral story: `scripts/rotate-logs.sh --keep <n>` deletes all but the newest n archives in `logs/archive/`, ten archives become 3 after `--keep 3`, stay 10 after a plain run, and a missing value exits 2.

### Phase 15: template-example-neutralization

The sweep in `scratch/example-sweep.md` found 87 lines in 12 files, 52 with the task's own words and 35 that told the same story in other words, plus 96 rendered lines in the golden snapshot. All 87 were rewritten and the snapshot was regenerated. Card section 7's task line uses the new example. The implementation-summary decision example now reads "Option over environment variable". In `research.md.tmpl` the review's fixes removed the stray `-k` short option and the `--dry-run` feature, and the failure example is now a real defect (a sort that tied on whole seconds kept 4 archives instead of 3).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl` | Modified | Fill-note examples rewritten (21, 13, 10 and 6 lines in the sweep) |
| `.skilled/skills/system-spec-kit/templates/addons/research.md.tmpl`, `handover.md.tmpl`, `debug-delegation.md.tmpl`, `goal.md.tmpl`, `acceptance-criteria.md.tmpl`, `timeline.md.tmpl`, `decision-record.md.tmpl` | Modified | Fill-note examples rewritten (17, 4, 4, 3, 2, 2 and 1 lines) |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modified | Section 6 and section 7 worked examples |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated | Rendered fill notes follow the templates |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--quiet` and the default form, then the suite. All three passed. WEAK: Tested and shipped. -->

The sweep and the guard baselines came first, recorded in `scratch/example-sweep.md`. The templates were then rewritten and the snapshot regenerated. A fresh Opus medium agent reviewed the diff in `scratch/review.md`: verdict CHANGES NEEDED, with 3 P1 and 7 P2 findings. All ten were fixed afterwards; the closeout re-checked each one in the templates (for example `--keep <n>` is closed at `spec.md.tmpl:408`, `rg -n 'dry-run'` and the `-k` option print nothing, and the four open-question notes all ask about a missing value). A fresh fix check then read the tree and recorded `VERDICT: PASS` at `scratch/review.md:71`.

Phases 015, 016 and 017 then shared one strict census, begun on the post-014 tree and rerun on the final tree. The closeout reran every acceptance command from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Flag over env var: callers already pass flags. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| One neutral feature, `rotate-logs.sh --keep <n>`, for every example | One story read the same way in every file teaches the note's shape without teaching an answer; `goal.md` D1 |
| Phase 018 may not use the neutral feature as its benchmark task | Otherwise the leak comes back; `goal.md` D2 |
| Keep each note's instruction word for word | Only the examples carried the task; `goal.md` D3. This is why one instruction word, "flag", still trips the term gate |
| One census shared by phases 015 to 017 | The three phases edited the same templates in one uncommitted tree, so one before and one after run covers them all |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `--quiet` line count: 1. Default line count: 17. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Term gate `G` over `FILL:` lines in `templates/core` and `templates/addons` | 1 (63 at the sweep); the one hit is the D3 instruction at `research.md.tmpl:777`. With that line excluded (`rg -v -F 'List each flag and its effect'`): 0 |
| Per-file `git diff --numstat` | research 17, debug-delegation 4, goal 3, timeline 2, decision-record 1, as planned. The other seven files carry phase 016 and 017 lines on top of the planned ones, each named on its task line |
| Card: `rg -n -i -e 'quiet flag' -e 'flag parser' -e 'script\.sh --quiet'` | nothing, exit 1 |
| Card: `rg -c -i 'quiet\|recommend-level'` | 7 |
| `template-fill-guidance.vitest.ts` | `Tests  24 passed (24)`, exit 0 |
| `scaffold-golden-snapshots.vitest.ts` without `-u` | `Tests  12 passed (12)`, exit 0; snapshot term gate prints 0 |
| `check-card-sync.sh` | `CARD SYNC OK`, exit 0 |
| `check-example-drift.sh` | `EXAMPLE_DRIFT_OK`, exit 0 |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync`, exit 0 |
| Strict census diff in `../016-scaffold-filler-section-trim/scratch/baseline/` | no output, exit 0; 4,757 rows each side |
| `rg -n 'rotate-logs' goal.md` | lines 45 (D1) and 46 (D2) |
| `rg -c '^VERDICT: PASS$' scratch/review.md` | 1, line 71 (the fix check after the first review's CHANGES NEEDED) |
| `git diff --name-only -- . ':!specs'` scope check | more than 13 paths, across phases 015 to 017; all 12 edited files and the snapshot are in the list |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--quiet` does not hide stderr warnings. Redirect stderr when silence is required. WEAK: No limitations. -->

1. **Three checks were reworded after the fact, each a recorded deviation.** The term gate excludes the one instruction line that `goal.md` D3 keeps word for word, because "flag" in "List each flag and its effect" names no benchmark task (AC-001, T018). Phases 015 to 017 shared one uncommitted tree, so the per-file `git diff --numstat` counts and the 13-path scope count cannot isolate this phase; the evidence is the `G` check per file, the named extra lines and list membership (AC-008, T005 to T016, T023).
2. **Planned artifacts were skipped or moved.** `scratch/replacements.md` and `scratch/baseline/` were never written. The 87-line table in `scratch/example-sweep.md` lists every swept line by file and line number, and the diff holds the new text. The edit briefs were not written per file here; they were combined with phase 016 and 017 edits under `../016-scaffold-filler-section-trim/scratch/briefs/`.
3. **The evidence is pinned to its commits.** The shipped work is `62e4661e01` and these docs are `ef939bf0ac`, on `worktrees/217-weak-model-spec-authoring`, not pushed.
4. **The `research.md.tmpl:777` GOOD example was rewritten at closeout.** It gave a design reason ("No option: an environment variable instead would add a hidden input"), which a weak model could copy as an option entry. It now says what `--keep` does and how a missing value fails.
<!-- /ANCHOR:limitations -->

---
