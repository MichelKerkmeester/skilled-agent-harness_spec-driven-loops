---
title: "Implementation Summary"
description: "New specs now carry a Measured Behavior block that holds a command and its verbatim output, and a strict validate run on a Draft packet repairs derived metadata itself, the round that failed 33 of 36 times in the benchmark."
trigger_phrases:
  - "measured behavior and draft metadata implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata"
    last_updated_at: "2026-10-26T18:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Recorded both full suites and the closeout deviations; every criterion Met"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-017-measured-behavior-and-draft-metadata"
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
| **Spec Folder** | 017-measured-behavior-and-draft-metadata |
| **Completed** | 2026-10-26; code `62e4661e01`, docs `ef939bf0ac` on `worktrees/217-weak-model-spec-authoring`, not pushed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--quiet` prints one line. The default report is unchanged. WEAK: Implemented the feature. -->

A new spec now has a Measured Behavior block right after the Problem Statement, and the new `MEASURED_BEHAVIOR` rule warns while that block is missing or empty. A `validate.sh --strict` run on a Draft packet whose only errors are derived metadata now runs `repair-derived.cjs --apply` once, names each file it rewrote and validates again, so the author no longer spends a round on metadata the repository can recompute.

### Phase 17: measured-behavior-and-draft-metadata

The block exists because running a command did not stop authors from misstating its output: graders found a wrong report shape in 5 of 12 benchmark packets, and four of those authors had run the script. You now paste the command and its verbatim output, or write `N/A:` with a reason, and every number about current behavior quotes it. The rule only warns, and only for a `spec.md` stamped `spec-core` v2.4 or later, so no existing packet gains a warning.

The repair exists because 33 of the 36 failed validator rounds in the 24 author runs failed only on derived-metadata rules and none failed on content (`scratch/metadata-rounds.md`). It runs only from the CLI entry, never from `validateFolder`, and only when the run is `--strict` over the full rule set, `spec.md` says Draft and every error is one of the five rules the repair tool can settle. `SPECKIT_DRAFT_AUTO_REPAIR=0`, `false` or `off`, a set `CI` or a `SPECKIT_RULES` subset turns it off. In `--json` and `--quiet` the notice goes to stderr.

### Files Changed

All paths are under `.skilled/skills/system-spec-kit/` unless stated.

| File | Action | Purpose |
|------|--------|---------|
| `templates/core/spec.md.tmpl` | Modified | `measured-behavior` anchor, H3, fill note and fence after the `problem` anchor; stamps to v2.4 |
| `templates/core/plan.md.tmpl`, `templates/core/tasks.md.tmpl`, `templates/core/implementation-summary.md.tmpl`, `templates/addons/acceptance-criteria.md.tmpl` | Modified | Stamps to v2.4 |
| `templates/spec-kit-docs.json` | Modified | The new anchor at every level |
| `templates/examples/level-1/spec.md` to `level-3+/spec.md` | Modified | A filled block that measures a `404` for the missing login route |
| `runtime/cli/rules/check-measured-behavior.sh` | Created | The warning rule |
| `runtime/cli/lib/validator-registry.json` | Modified | `MEASURED_BEHAVIOR` at severity `warn`; 42 rules |
| `runtime/lib/validation/orchestrator.ts` | Modified | `draftAutoRepairRefusal`, `findRepairRoot` and `runDraftAutoRepair` in the CLI entry |
| `runtime/cli/spec/validate.sh` | Modified | `--help` names the rule and the switch |
| `runtime/cli/spec/repair-derived.cjs`, `runtime/cli/spec/upgrade-legacy.mjs`, `runtime/cli/spec/quality-audit.sh`, `runtime/cli/spec/progressive-validate.sh`, `runtime/cli/sweep/strict-pass-freshness.ts` | Modified | Run their child `validate.sh` with `SPECKIT_DRAFT_AUTO_REPAIR=0`, so read-only and dry-run tools stay read-only |
| `runtime/cli/tests/measured-behavior-rule.vitest.ts`, `runtime/cli/tests/draft-auto-repair.vitest.ts` | Created | Rule test (7 cases) and repair test (15 cases) |
| `runtime/tests/validation-optional-anchors.vitest.ts`, `runtime/cli/tests/level-contract-resolver.vitest.ts`, `runtime/cli/tests/upgrade-legacy.vitest.ts` | Modified | New optional-anchor case, v2.4 stamp, plan stamp read from the manifest |
| `references/workflows/spec-authoring-card.md`, `SKILL.md`, `references/validation/validation-rules.md`, `runtime/ENV-REFERENCE.md`, `README.md` | Modified | The block rule, the repair, its switch and the 42-rule count |
| `.hermes/skills/system-spec-kit/SKILL.md` (repository root) | Modified | Hermes copy of `SKILL.md` |
| `ARCHITECTURE.md` | Modified | The validation paragraph says 42 rules (23 authored-template, 13 operational-runtime, 6 structural) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--quiet` and the default form, then the suite. All three passed. WEAK: Tested and shipped. -->

The metadata-round count came first, during planning. The template, rule, registry, orchestrator and test changes were built by the conductor's workers; this folder does not hold their briefs. Two doc briefs are here, D1 (the README rule count) and D2 (`SKILL.md`, `validation-rules.md` and `ENV-REFERENCE.md`), in `scratch/briefs/`, with reports in `scratch/runs/`; the Hermes copy was regenerated after D2. A fresh Opus medium agent then reviewed the diff with the write-path risk named (`scratch/review.md`): no blocker, six findings, all fixed. The conductor rebuilt the runtime and ran the strict, six-rule and new-rule censuses over 4,757 folders, shared with phase 016, in `../016-scaffold-filler-section-trim/scratch/baseline/`. At closeout every acceptance command was rerun from the final tree, with each test file run on its own, and the conductor ran both full suites on the final tree (`scratch/baseline/suite-after-runtime.txt`, `scratch/baseline/suite-after-cli.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Flag over env var: callers already pass flags. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| An H3 in its own anchor, with no H2 | An H2 becomes required for every v2.3 doc and would fail existing packets; nesting inside `problem` breaks the anchor nesting check |
| The rule warns and checks only presence | Matching prose numbers to pasted output is not reliable enough to fail a run; the fill note and the card carry the quoting rule |
| The repair lives in the CLI entry only | A census or any other library caller of `validateFolder` must never write into the packets it reads |
| `SPEC_DOC_INTEGRITY` stays out of the repair set | The repair tool settles it only in part, so a packet failing on it goes back to its author |
| Repair only on `--strict` with no `SPECKIT_RULES` subset | "Every error is derived" means something only when every content rule ran |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `--quiet` line count: 1. Default line count: 17. Suite: PASSED. WEAK: All tests pass. -->

CLI tests run as `cd .skilled/skills/system-spec-kit && npx vitest run --config vitest.config.ts --project cli tests/<name>.vitest.ts`. The form `cd runtime && npx vitest run cli/tests/<name>` finds no file.

| Check | Result |
|-------|--------|
| `measured-behavior-rule`, `draft-auto-repair` | 7 and 15 passed, exit 0 |
| `repair-derived`, `placeholder-token-gate`, `template-structure`, `example-drift` | 36, 48, 8 and 6 passed, exit 0 |
| `validator-registry-doc-count`, `validate-help-lists-every-rule`, `level-contract-resolver`, `upgrade-legacy` | 1, 2, 7 and 67 passed, exit 0 |
| `validation-optional-anchors` (runtime project) | 2 passed |
| Conductor run of 24 files on the final build | All passed |
| Strict and six-rule census diffs over 4,757 folders | Both print nothing; 4,562 PASS and 195 FAIL before and after |
| `rg -c '=warn\|=error' measured-after.tsv` | Nothing; all 4,757 rows `MEASURED_BEHAVIOR=pass` |
| Template anchors | `ANCHOR:measured-behavior` 2; no H2 for it; stamps v2.4 at lines 36, 39 and 43 |
| Registry and help | `42 warn`; `validate.sh --help` prints 2 matching lines |
| `check-example-drift.sh`, `check-card-sync.sh` | `EXAMPLE_DRIFT_OK`; `CARD SYNC OK` |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `rg -n '41-rule registry'` | No output, exit 1 |
| Runtime build | Run by the conductor, succeeded; at closeout the compiled orchestrator is newer than every source `.ts` |
| Full runtime suite (`npx vitest run` in `runtime`) | `Test Files 279 passed \| 3 skipped (282)`, `Tests 4184 passed \| 21 skipped (4205)`, `vitest_exit=0`; no failure |
| Full CLI suite (`npx vitest run --config vitest.config.ts --project cli`) | `Test Files 1 failed \| 189 passed \| 3 skipped (193)`, `Tests 1 failed \| 2202 passed \| 20 skipped (2223)`; the one failure, `recursive-child-manifest`, is also in phase 013's baseline |
| Baseline (phase 013 `cli-after.txt`, the tree before phases 015 to 017) | `2 failed \| 186 passed \| 3 skipped (191)`: `recursive-child-manifest` and `repo-era`; no failure is new, `repo-era` now passes |
| Census write check | `git status --porcelain specs/` outside 054 prints 0 lines |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

- Review fixes F1 and F2: `repair-derived.cjs` dry runs wrote files, because their inner validate auto-repaired. Every internal caller that runs `validate.sh` as a child now sets `SPECKIT_DRAFT_AUTO_REPAIR=0`: `repair-derived.cjs`, `upgrade-legacy.mjs`, `quality-audit.sh`, `strict-pass-freshness.ts` and `progressive-validate.sh`. A dry-run case in the test proves the packet stays unchanged.
- Review fix F3: the Level 2 example showed a `200 OK` before the feature existed; it now measures a `404` like the others.
- Review fix F4: the repair needs `--strict` and no `SPECKIT_RULES` subset, beyond the plan's refusal list. A narrowed or non-strict run cannot see every content error.
- Review fix F5: `ENV-REFERENCE.md`, `validation-rules.md`, the card and the help text now name the Spec Folder row write, the `CI` exception and the `false` and `off` values.
- Review fix F6: tests for a failing repair child and a `--recursive` parent were added.
- The censuses ran once for phases 016 and 017 together over 4,757 folders in phase 016's `scratch/baseline/`, not over the 4,719 folders of the 010 shard lists named in the plan, so the census baselines live in 016's `scratch/baseline/`, not this folder's (CHK-050).
- No suite baseline was taken before the edits. The nearest one is phase 013's whole CLI run, `../013-addon-removal-and-speed-refinements/scratch/baseline/cli-after.txt`, taken on the tree right before phases 015 to 017 (014 changed docs and one test comment). No pre-phase runtime-project baseline exists; the runtime run on the final tree has zero failures, so it holds none a baseline could lack (AC-006).
- The CLI suite's `recursive-child-manifest` fixture script (`specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh`) runs a bare `git ls-files`, which hung on fsmonitor for 853 s until the conductor ended that one git process so the suite could finish; the test then failed, as it does in the baseline.
- No tree-status snapshot was taken before the census. The write check ran afterwards: `git status --porcelain specs/` outside 054 prints 0 lines, and inside 054 every change outside phases 015 to 018 and the changelog is a conductor edit or a speed-loop file. The census path calls `validateFolder` in-process and cannot reach the CLI-only repair (T025).
- No separate build was logged before the census; the census ran on a build `validate.sh` accepted as fresh, and the final build is T019 (T003).
- Phases 015, 016 and 017 were built in parallel in one uncommitted tree and are committed together after this closeout, so 015 and 016 were not committed before the template edits; the stamp v2.4 was set once for all five templates (T002, CHK-003).
- The work is committed as `62e4661e01` (code) and `ef939bf0ac` (docs), on `worktrees/217-weak-model-spec-authoring`, not pushed.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--quiet` does not hide stderr warnings. Redirect stderr when silence is required. WEAK: No limitations. -->

1. **The suite comparison rests on a borrowed baseline.** The CLI baseline is phase 013's run, and no runtime-project baseline exists; the runtime run has zero failures, so the comparison holds there. In the CLI project, a new cause of failure inside the already-failing `recursive-child-manifest` test would not show as a new failure.
2. **A validate run on a Draft packet can now write.** A hook or script that runs `validate.sh` and expects a read-only check must set `SPECKIT_DRAFT_AUTO_REPAIR=0`; CI is covered because it sets `CI`.
3. **The rule checks presence, not quoting.** A spec can fill the block and still state a number the block does not hold.
<!-- /ANCHOR:limitations -->

---
