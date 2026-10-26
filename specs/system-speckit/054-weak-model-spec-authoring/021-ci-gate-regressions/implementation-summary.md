---
title: "Implementation Summary"
description: "Two CI gates that failed on main pass again: changed-packet validation no longer grades the benchmark copies kept under scratch/, and /deep:research :auto prompts route to system-deep-loop because the advisor phrase that handed spec-kit the token auto is gone. The in-range docs, lint and YAML findings from the same audit run are fixed too."
trigger_phrases:
  - "ci gate regressions implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions"
    last_updated_at: "2026-10-26T23:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Closed out: both gates replayed green, every acceptance row Met"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-021-ci-gate-regressions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-ci-gate-regressions |
| **Status** | Complete |
| **Completed** | 2026-10-26, uncommitted on `worktrees/217-weak-model-spec-authoring` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Changed-packet validation stops grading the benchmark copies under `scratch/`, so the push that blocked on 81 of them would now grade its 7 real packets. The divergence ratchet passes 9 of 9 again, because `/deep:research :auto` no longer hands system-spec-kit the token `auto`.

### Phase 21: ci-gate-regressions

A local alignment audit run over `ac2be31ec6..HEAD` (6,737 files, 56 commits) ended with a completeness critic, and the critic found two CI gates red on main. X1: phase 011 committed sandbox packets as benchmark results under `scratch/speed-loop/results/`, each with a `description.json` naming a `zz-bench-authoring/...` folder, and the changed-packet gate graded every one, so CI run 40380947180 on `b51a341a07` failed. The repo already says scratch is never validated (`path-scoped-rules.md:57`, `validation-rules.md:322`), and the validator's folder discovery skips it, so the gate now does too, matching only a whole `scratch` path segment. X2: phase 020 had added the intent signal `draft auto-repair`, and rescoring showed its token `auto` pulled `:auto` prompts to spec-kit; it is now `spec docs`.

DeepSeek V4.1 Flash 1017 through cli-pi made the four literal fixes, one short brief each, and every run exited 0. Opus made the judgment fixes: the workflow skip and its two tests, the advisor phrase, and the three level docs that now call `decision-record.md` a lazy add-on.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/changed-packet-validation.yml` | Modified | Skip `*/scratch/*` in the selection loop (X1) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Modified | Scratch-copy and scratch-named tests (X1) |
| `.skilled/skills/system-spec-kit/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | `spec docs` in place of `draft auto-repair`, recompiled graph (X2) |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modified | Section separators and `## 1. OVERVIEW AND BOUNDS` (B-01) |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`, `path-scoped-rules.md`, `references/templates/level-selection-guide.md` | Modified | `decision-record.md` is a lazy add-on (B-03, B-04, B-05) |
| `.skilled/skills/system-spec-kit/runtime/eslint.config.mjs` | Modified | `**/dist/**` ignore (A-1) |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | Real `sk-code-skilled` checklist paths (X6) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified | `--help` Level 2 line (X7) |
| `.skilled/skills/system-spec-kit/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md` | Modified | Version 2.12.2.0 |
| `.skilled/skills/system-spec-kit/changelog/v2.12.2.0.md` | Created | The release note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The conductor confirmed each cause first: the CI log for X1, a rescore for X2. The literal fixes went to cli-pi and the judgment fixes to Opus, and the conductor reran the ratchet, the card and comparison tests and the graph freshness check. At closeout every check below was rerun from the final tree, plus a replay of the selection loop over the failing commit's diff and a run of the new tests against the old workflow.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Skip scratch in the gate instead of fixing the 104 benchmark packets' metadata | The packets are evidence of a sandbox run and must keep naming that sandbox; the repo convention and the validator already treat scratch as unvalidated |
| Match `*/scratch/*`, a whole path segment | A real packet named `001-scratch-notes` must still be graded, and a test holds that |
| Replace the phrase with `spec docs` rather than retune the scorer | One metadata line fixes the ratchet; a scorer change that ignores `:auto` flags touches every hub |
| Accept that Draft-auto-repair-named prompts no longer route to spec-kit | That was the pre-054 behavior, and the ratchet is the gate CI enforces |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| CI run 40380947180, read with `gh` | `"conclusion":"failure"` on `b51a341a07`, 81 `New packet does not validate` annotations |
| Selection replay, `b51a341a07^2..b51a341a07` | Old loop 111 graded, 104 under `scratch/`; new loop 7 graded, 0 under `scratch/` |
| `ci-rule-set-comparison.vitest.ts` | `Tests 17 passed (17)`; against the old workflow `Tests 1 failed \| 16 passed (17)` |
| card-sync plus comparison vitest | `Tests 27 passed (27)` |
| Divergence ratchet | `Tests 9 passed (9)`, rc=0 |
| Drift guard and parity suites; scorer baseline; golden prompts | `21 passed`; `7 passed`; `14 passed` |
| Skill graph freshness `--strict`, compiler, intent signals, compiled route guard | `SIGNAL DRIFT compiled vs disk: none` rc=0; `VALIDATION PASSED`; `RESULT: PASSED`; `All hubs fresh or excused` |
| `validate_document.py` on the card, `check-card-sync.sh`, `check-example-drift.sh` | `Total issues: 0`; `CARD SYNC OK`; `EXAMPLE_DRIFT_OK` |
| ESLint over `runtime/` | 244 problems, 0 in `dist/` |
| Hermes check | `PASS: 67 Hermes skill copies in sync` |
| `validate.sh` on packet 054, `--strict --recursive`, repair off | `RESULT: PASSED` for the parent and every phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The live advisor still sends rr-iter3-168 to spec-kit by a hair.** "Run /deep:research :auto --max-iterations=8 on the routing packet." ranks system-spec-kit 0.5744 and system-deep-loop 0.5665 in the closeout probe. The ratchet still passes; the conductor's rescore found the harness result matches pre-054. A scorer change that ignores `:auto` mode flags would fix both this and limit 2.
2. **Prompts that name only Draft auto-repair no longer reach spec-kit.** That is the pre-054 behavior. Name the spec packet in the prompt to reach system-spec-kit.
3. **The remaining 244 lint problems predate 054.** No CI step runs that lint; the conductor's count before A-1 was 288.
4. **The evidence is pinned after the commit.** The phase changelog is `../changelog/changelog-054-021-ci-gate-regressions.md`; the commit SHA belongs in the parent goal log.
<!-- /ANCHOR:limitations -->

---
