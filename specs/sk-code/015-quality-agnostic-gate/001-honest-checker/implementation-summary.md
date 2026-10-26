---
title: "Implementation Summary"
description: "Phase 1 built the comment-family table, the honest checker, the table-reading ceiling report and router, two CI rows, the wording fixes and the version bumps, then cleared the baseline outside specs/ under the ADR-010 amendment."
trigger_phrases:
  - "honest checker implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/001-honest-checker"
    last_updated_at: "2026-10-26T09:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Known Limitations items 1 to 4 closed by phase 007"
    next_safe_action: "Start phase 002-builtin-runner"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/assets/comment-syntax.json"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh"
      - ".skilled/hooks/post-edit-quality/lib/post-edit-router.cjs"
      - ".skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs"
      - ".github/workflows/comment-hygiene.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which router should name naming-init-formatting-and-css.md and verification-quick-reference-and-related.md now that DEFAULT_RESOURCE lists only the three always-loaded resources?"
    answered_questions:
      - "The ADR-010 halt: the limits count only delta lines outside specs/, and the lines under specs/ stay as accepted debt (ADR-010 amendment)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-honest-checker |
| **Status** | Complete. T001 to T063 are ticked, all 28 acceptance criteria are Met and the sk-code drift-guard wrapper passes. |
| **Completed** | 2026-10-26. The ADR-010 amendment waits for operator confirmation at program end. |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Steps 1 to 4 of `plan.md` are built, and the Phase 3 verification tasks have run. The baseline at T043 first passed the ADR-010 file limit. The coordinator's ruling, recorded as the ADR-010 amendment, counts only the delta outside `specs/`, so this pass cleared those lines and left the packet artifacts as debt.

### Phase 1: honest-checker

The comment-hygiene checker reads its nine comment families and eleven languages from `assets/comment-syntax.json`. A shebang that names a known interpreter picks the language before the extension does. URL spans are cut out of the comment text, so a spec path beside a link is flagged. Python docstrings, first in a module, first in a def or class body or right after an assignment, and block-comment bodies count as comment text, while a block opener inside a string, after a backslash or in a glob such as `src/**` does not. YAML has its own family now. A key or list item whose value is `|` or `>`, with an optional anchor or tag, opens a block scalar, and each following line that is blank or deeper than the key is text, so a Markdown heading there is never a comment. TOML multi-line strings and Go raw strings hold text the same way, and a Rust char literal opens no string. A new rule flags issue and ticket numbers, and `--ticket-prefix`, `--extension` and `--extra-pattern` add a repository's own terms. The slash rule needs a zero-padded second number, so ratios pass. A URL or a standard code such as `CWE-79` is cut out of the text, so neither hides a label beside it. Each text finding ends with its reason, `--json` prints a `comment-hygiene/v1` document, and usage, table and read errors exit 3.

The ceiling report reads its extensions and each family's comment tokens from the same table and takes the repository root from the working directory. The post-edit router reads the table, with its built-in set as fallback, resolves the comment-hygiene checker beside its own real path first, and returns one `quality-notice` when the checker is missing. The CI job finds the checker under `.skilled/` or `.opencode/`, annotates each finding and fails on any exit above 2. The script-tests job runs the four quality bash suites. The quality mode's wording, its `DEFAULT_RESOURCE` list and five docs now match the tree.

The baseline found 30 new findings outside `specs/`. 29 were rewritten to their durable reason: 22 command asset comments lost a phase label, one speckit-implement example lost a real packet path, and three Python docstrings lost their task, finding, phase and packet ids. The last was the YAML block scalar line, which the checker no longer reports.

A review of the working tree then raised thirteen findings. Each reproduced, and T051 to T061 and the doc fixes in `tasks.md` closed them. The sk-code compiled routing manifest was stale, because this phase changed the hub's routing inputs, so it was re-minted. Triple-quoted strings inside brackets no longer count as docstrings. TOML and Go got their own families. Both pre-commit hooks pass `--` before the staged paths. The ceiling report reads SQL markers. The spec's file list now names every changed file. The baseline rerun after these fixes gave the same 21 delta lines. A second review raised three P2 findings, each reproduced: the T011 Verify clause still expected HEAD line numbers on the working tree, so it now reads HEAD; the closure statement called all 21 delta lines debt where only the 19 added lines are; and the live pre-commit hook in the main checkout still calls the checker without `--`, now Known Limitation 8.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-quality/assets/comment-syntax.json` | Created | The shared comment-family table, nine families, with YAML block scalars and TOML and Go multi-line strings |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modified | The checker, rewritten around the table, with block scalar, multi-line string and Python statement state |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` | Modified | 95 cases, up from 26 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` | Modified | Table extensions and comment tokens, and a working-directory root |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` | Modified | The subfolder, SQL and Go cases, 11 cases |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | Table extensions, router-first resolution, the missing-checker notice |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` | Created | Six router unit cases |
| `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` | Modified | The real checker replaces the stub |
| `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs` | Modified | The real checker replaces the stub |
| `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | Modified | Fixtures moved onto the real checker after router-first resolution (ADR-009) |
| `.github/workflows/comment-hygiene.yml` | Modified | Checker lookup, annotations, fail above exit 2 |
| `.github/workflows/sk-code-script-tests.yml` | Modified | Runs the four quality bash suites |
| `.skilled/commands/create/assets/*.yaml` (20 files), `.skilled/commands/design/assets/diagram-auto.yaml`, `diagram-confirm.yaml` | Modified | One header comment each keeps its meaning without the phase label |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modified | The nesting example shows its shape without a real packet path |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`, `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py`, `.skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py` | Modified | Docstrings state their purpose without ids |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modified | Wording, `DEFAULT_RESOURCE`, version 1.5.0.0 |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modified | The `--all` row, version 1.2.5.0 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Modified | Four suites, the checker row, version 1.0.1.0 |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Modified | `specs/` path examples, version 2.2.4.0 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Modified | The three-resource loop, version 1.1.2.0 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modified | The `node --check` claim, version 1.1.1.0 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modified | Spec-root rows, version 1.0.2.0 |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modified | Hub version 3.1.0.0 |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerated | The new asset, by `generate-leaf-manifest.cjs --write` |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md` | Regenerated | By `sync-skills-hermes.cjs` |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.5.0.0.md` | Created | Quality release notes with the final baseline classes |
| `.skilled/skills/sk-code/changelog/v3.1.0.0.md` | Created | Hub release notes |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-001-honest-checker.md` | Created | Packet changelog, by `nested-changelog.js --write` |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/hooks/git/pre-commit` | Modified | `--` before the staged paths |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | One case per hook for a staged name that starts with `--` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/` | Re-minted | By `compiled-route-manifest.cjs refresh`, then copied |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tasks ran in order from T001. Each Verify command ran, and its output and exit status were read before the task was ticked. Every new suite case was also run against the code before its change as a negative control. The HEAD checker failed 32 cases of an earlier suite version, the HEAD ceiling report failed the subfolder case, and a copy of the HEAD router failed 5 of the 6 router cases. The new clean case for YAML block scalars failed against the checker before the block scalar fix, and the violation case fails under a rule that measures depth from the line rather than the key. The design 6.4 baseline ran the HEAD checker and the working-tree checker over every tracked file. Its first run surfaced a `/**` glob in a template literal that opened a block comment, which was fixed with a regression case. The rerun passed the ADR-010 file limit, so the phase stopped after T043 for a ruling. Under the amended rule the 30 lines outside `specs/` were fixed, the baseline was rerun, and T044 to T050 ran from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Operator decision 1: amend Iron Law 3 with the design's floor text, executed in Phase 4 (ADR-001) | A repository with no surface packet needs a gate it can complete. |
| Operator decision 2: scope the universal checklist to SKILLED, with its spec-root rows changed here (ADR-002) | The checklist's own text names the OpenCode environment, so foreign repositories should not load it. |
| Operator decision 3: the repository config is `.sk-code/quality.json`, read in Phase 3 (ADR-003) | It sits beside the other committed skill folders, and a commit is the trust boundary for commands. |
| Operator decision 4: CI and pre-commit keep whole-file scope (ADR-004) | A scope change to a blocking layer needs its own decision and test. |
| Operator decision 5: the benchmark report follows the existing report format (ADR-005) | Comparable reports matter more than a new layout. |
| Operator decision 6: the advisor plugin keeps its own copy of `declaredSurfaces` (ADR-006) | The copy only routes hints, so drift cannot change a gate result. |
| Keep the `phase 0` and `T\d{3,4}` patterns, and record two residual false positives (ADR-007) | Two pinned suite cases fix the current contract, and the HARD BLOCK favours detection. |
| Narrow the `NNN/NNN` pattern to a zero-padded second number (ADR-008) | It removes the ratio false positive, and the path form still flags. |
| The router resolves its checker from its own real path first (ADR-009) | Downstream links work, and every adapter runs one checker. |
| Halt the phase above 50 new-language lines or 20 files (ADR-010) | It gives a stop point before CI and pre-commit inherit a large block. |
| Count only the delta outside `specs/`, and keep packet artifacts as debt (ADR-010 amendment) | Every previous finding sits under `specs/`, and CI and pre-commit check only the files a change touches. |
| Measure a block scalar's depth from its key, not from the start of its line | After a list dash YAML nests the mapping at the key, so a comment at the key's column after `- run: |` ends the block and is checked. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline before change (T001, T002) | 43 `PASS` lines over the four bash suites, all exit 0. The adapter suites passed 3/3, 4/4 and 51/51. |
| Four quality bash suites (T044) | All exit 0 with their final lines, 115 `PASS` lines (95 checker, 11 ceiling, 9 typo-flag) and no `FAIL` line, after the review fixes. |
| Router, codex, devin and opencode `node --test` runs (T045) | All exit 0, with 6/6, 3/3, 4/4 and 51/51 passing. |
| sk-code-skilled `node --test` suites, the CI script-tests step | Exit 0, 27/27 passing. |
| actionlint on both workflows (T046) | Exit 0, no output. The same binary reported a known-bad workflow. |
| Local run of the comment-hygiene step (AC-013) | The step matched `scratch/ci-step.sh`. It annotated `svc.go` line 3 with `ADR reference` and exited 1, and with the table removed it reported checker exit 3 and exited 1. |
| Checker on every changed code file (T047) | 40 files after the review fixes, each exit 0 with no output. |
| Pre-commit suite (T054) | `pre-commit gates: 134 passed, 0 failed`, exit 0, against 132 and 0 before the change. Without the `--` the two new cases fail. |
| `compiled-route-guard.cjs` (T051) | Exit 1 with `sk-code stale-manifest` before the re-mint. Exit 0 with `All hubs fresh or excused` after it and after every later fix. |
| `ci-leaf-manifest-freshness.cjs` | `checked=14 fresh=14 failed=0`, exit 0, run with the worktree's fsmonitor override. Without it the gate stalled on `git check-ignore`. |
| 6.4 baseline after the review fixes (T061) | Same delta: 21 lines in 14 files, all under `specs/`, in the same four classes. No stderr line. |
| 6.4 baseline first run (T042) | 51 lines, 49 added and 2 removed, in 41 files. 30 lines in 27 files sat outside `specs/`. |
| 6.4 baseline rerun (T042, T043) | 21 lines, 19 added and 2 removed, in 14 files, all under `specs/`. 0 lines outside `specs/`. New languages 11 in 7 files, docstrings 7 in 5, shebang 1 in 1, slash removals 2 in 1. |
| Edited YAML assets | All 24 parse to the same data as at HEAD. |
| Eight pre-commit mirror checks | All exit 0 after the review fixes: 194 runtime mirrors, 11 codex agents, 38 codex prompts, the agent roster, the command catalog, 4 hook registration files, 67 Hermes skill copies and 38 Hermes prompts. |
| `parent-skill-check.cjs .skilled/skills/sk-code` | Exit 0, `all hard invariants passed, 0 warnings`. |
| `generate-leaf-manifest.cjs --check .skilled/skills/sk-code` and `generate-router-intent-signals.cjs --check --hub sk-code` | `leaf-manifest.json OK`, exit 0, and `RESULT: PASSED`, exit 0. |
| `run-all-drift-guards.sh` | Exit 0 after T062, `all 4 guards PASSED, 10 non-blocking warning(s)`. The first run failed router-sync checks 1b and 4 on two checklist assets no router named. The ten warnings sit in files this phase does not touch. |
| `validate_document.py --type changelog` and `hvr_scan.py` on both release entries | `Total issues: 0` and 0 hard blockers, each exit 0. |
| Strict validator (T048) | `Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0, after `spec.md` and this summary both took the In Progress status and `repair-derived.cjs --apply` re-derived the graph metadata. |
| AC-001 to AC-028 | All 28 Met. See `acceptance-criteria.md`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Packet artifacts carry accepted debt.** 19 comments in 13 files under `specs/` now fail the checker. Pre-commit and CI check whole files, so each fails when its file is touched. Workaround: rewrite it to its durable reason or mark it `hygiene-ok` then. Closed by phase `007-checker-debt-closeout`: the whole-tree run over every tracked file now reports zero findings, with live comments rewritten to their durable reason and frozen evidence marked `hygiene-ok`. Finding class: `instance-only`, one fix per comment.
2. **The ceiling report still reads YAML block scalar text as comments.** It takes extensions and comment tokens from the table but tracks no block scalar, multi-line string or docstring state, so a `# ceiling:` line inside a block scalar is listed. The report never gates, so the gap adds a report line and blocks nothing. Closed by phase `007-checker-debt-closeout`: the report now reads comment text through the checker's own extraction, so a marker inside a block scalar, a string, a template literal or a heredoc body is not listed. Finding class: `cross-consumer`, because the report kept a second copy of the checker's rules.
3. **A string statement in the middle of a Python body is data.** Only a docstring in a place Python or its tools read one counts as comment text, so a triple-quoted string used as a block comment after other code is not checked. Closed by phase `007-checker-debt-closeout`: a string literal that opens a logical line at bracket depth 0 is now comment text wherever it stands, and an `f` prefix keeps it data. Finding class: `class-of-bug`, shared with the template literal and heredoc rules.
4. **The CI failure path has no live run.** The ADR-010 amendment accepts actionlint and a local run of the step's script in its place. Closed by phase `007-checker-debt-closeout`: run `40276844110` on a throwaway pull request failed the comment-hygiene step on a planted ADR reference, and the pull request and its branch were deleted afterwards. Finding class: `instance-only`.
5. **The universal checklist keeps its old title until Phase 4.** Phase 1 changed only its spec-root rows, and the quality changelog says the retitle is pending.
6. **The live pre-commit hook still calls the checker without `--` until this change reaches the main checkout.** The global `core.hooksPath` links `pre-commit` to the main checkout's `.skilled/scripts/git-hooks/pre-commit`, whose comment-hygiene call has no `--`, while the checker it runs comes from the committing repository's `SOURCE_ROOT`. A commit from a tree that holds the new checker therefore reaches the strict option parser through the old call. A staged file whose path starts with `--`, which can only be a top-level file, makes the checker print `ERROR: unknown option` and exit 3, and the old hook blocks on that exit, where the HEAD checker exited 0. The worktree hooks pass `--`, and the pre-commit suite covers it. Workaround until the hook lands in the main checkout: `SPECKIT_SKIP_COMMENT_HYGIENE=1` for that one commit, or rename the file.
<!-- /ANCHOR:limitations -->

---
