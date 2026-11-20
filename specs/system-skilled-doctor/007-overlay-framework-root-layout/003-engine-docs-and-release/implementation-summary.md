---
title: "Implementation Summary: Phase 3: engine-docs-and-release"
description: "The doctor docs, workflow yaml, playbook and release note now describe the framework/ and root/ default, the sibling overlay folder and the one migration step, apply --relayout, and system-skilled-doctor ships as 1.2.0.0."
trigger_phrases:
  - "overlay docs and release shipped"
  - "system-skilled-doctor 1.2.0.0 release evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release"
    last_updated_at: "2026-11-20T12:32:08Z"
    last_updated_by: "generate-context"
    recent_action: "Merged into main and recorded the pin"
    next_safe_action: "Start phase 004 from an ai-speckit session"
    packet_purpose: "Purpose: A consumer who re-pins onto this engine reads, in the release note and the overlay reference, that the default changed, that nothing is refused, and that the one action is `/doctor:overlay apply --relayout` once."
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md"
    session_dedup:
      fingerprint: "sha256:bb9b190ce71735e6cb0ebf879d20d5c4e529803c9afed20b76e1638ebead8d4b"
      session_id: "impl-003-engine-docs-and-release"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0bdae7d5-3bdf-4448-b239-f0e7616d298a"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-20T12:32:08Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-engine-docs-and-release |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A consumer reading the doctor docs now learns that every overlay copy lays out under `framework/` or `root/` by default. They also learn that an old-layout tree keeps passing, and that the one action is `/doctor:overlay apply --relayout` once after the re-pin. The relayout workflow takes its plan and its approval from the full `offLayout` list in `status --json`, because the text report stops after 20 LAYOUT lines.

### Docs, workflow and release

The presentation contract, the command doc, the apply, repin and update workflows and the route manifest all state the new rule and the sibling `../<name>` folder. The repin rollback and the update check resolve the setting against the tree root. The skill reference gains the passage "Moving an existing tree onto the new layout". The playbook moves five scenarios to the new paths and adds `SKD-013` for a sibling folder with 21 old-layout entries. The skill ships as 1.2.0.0 with a release note that leads with the default change and the one action.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | LAYOUT row with the cap, adopt and relayout plan text, refusal row, sibling example, re-read and plan rows from `offLayout` |
| `.skilled/commands/doctor/overlay.md` | Modified | Status cap, adopt path, relayout plan and approval from `status --json`, next step after a re-pin |
| `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` | Modified | Relayout write list, plan, approval invariant and re-read from `offLayout` |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The relayout clause of `gate3_location` |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml`, `doctor-update-apply.yaml` | Modified | Resolve a `../<name>` setting against the tree root |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Setting, LAYOUT, relayout and adopt text, and the migration passage |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/` | Modified, Created | Five scenarios moved to the new paths, `overlays/sibling-folder-relayout.md` (SKD-013) and its index rows |
| `.skilled/skills/system-skilled-doctor/SKILL.md`, `changelog/v1.2.0.0.md` | Modified, Created | Version 1.2.0.0 and its release note |
| `.skilled/skills/system-skilled-doctor/leaf-manifest.json`, `leaf-aliases.json` | Regenerated | The new scenario file, through `ci-skill-root-metadata.cjs --fix` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

1. Recorded the baseline: 7 doc lines and 23 playbook lines in 5 files, contract test 9/9, `route-validate` exit 0.
2. Three Claude documentation workers edited disjoint file groups in parallel. DeepSeek V4.1 Flash, through cli-pi, moved the five scenarios and wrote SKD-013.
3. DeepSeek ran all six scenarios on temporary trees. Three failed because the scenario sweep had unescaped a quote in their manifest step. The review found the same defect, and the escaping was restored. The three were then rerun and passed.
4. The review asked for changes: that quoting, plus two lines still calling the capped LAYOUT text the approval. All were fixed, and the re-review approved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Phase 004 pins the merged `main` commit, not this phase's own commit | The operator named the merged `main` commit as the pin. It carries phases 1-3 plus everything `main` gained since the branch was cut. |
| The relayout approval is the `offLayout` plan, not the printed LAYOUT lines | With more than 20 off-layout copies, the text shows fewer moves than the run makes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` | PASS: 9/9, `# fail 0`, exit 0 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | PASS: exit 0, 32 routes, 11 warnings, the same count as `main` before this phase |
| Residual rule, switch and playbook searches (T038-T040) | PASS: no stale rule. Two documented hits: `doctor-env.yaml:48`, unrelated, and SKD-013's deliberate old-layout fixture |
| Each doc task's verify command (T005-T035) | PASS (`scratch/evidence/doc-task-verify.txt`) |
| Scenarios SKD-005, 006, 007, 009, 010, 013 | PASS, with 006, 007 and 010 after the quoting fix (`scratch/evidence/scenario-runs.md`) |
| `ci-skill-root-metadata.cjs` | PASS: 14/14 after the leaf-manifest regeneration |
| Review | APPROVED after one fix round |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The scenario count lines omit `cannot-apply=0`.** The engine prints it after `upstream-moved=0`. The expected text is a prefix of what prints, so every scenario still matches.
2. **The overflow line always names relayout,** even when an entry past the first 20 is a `root/skilled` move. `status --json` shows each item's real target.
<!-- /ANCHOR:limitations -->
