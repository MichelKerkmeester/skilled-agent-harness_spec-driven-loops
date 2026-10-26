---
title: "Implementation Summary"
description: "The quality runner is built: one verdict per change in any repository, built-in checks only, no writes, with declared hub checklists and the proofs in goal.md section 3."
trigger_phrases:
  - "builtin runner implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/002-builtin-runner"
    last_updated_at: "2026-10-26T08:36:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Corrected the limitation list so each corrected item says what closed it"
    next_safe_action: "Run the closeout packet's acceptance commands, then let phase 6 measure the runner"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/references/runner-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-builtin-runner"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-builtin-runner |
| **Status** | Complete |
| **Completed** | 2026-10-26, on HEAD `a1673881f2` with the changes uncommitted in the working tree |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` now prints one verdict for a change in any repository. A foreign Go repository with a spec label in a comment gets `BLOCKED` with exit 1 and surface `unknown`, and this repository's own checker file gets `NO_BLOCKER_FOUND` with SKILLED resolved.

### Phase 2: builtin-runner

The runner reads the change from `--worktree`, `--base <ref>` or `--files`, with changed lines from `git diff -U0`. It runs conflict-marker, secret and debug-leftover sensors in process, the first two on every readable text file, one comment-hygiene call with `--json`, and a parse floor chosen by shebang before extension: JSON and JSONC and CommonJS in process, `.mjs` and `.js` through `node --check`, Python, YAML and TOML in one `python3 -B -I` process, and shell through `bash -n`. It probes the pre-commit, CI and post-edit layers, resolves surfaces through `declaredSurfaces` with the real-path guard, and lists the checklists the floor, the quality defaults and the hub declarations name. It prints `json`, `text` or the `code-quality/v1` envelope, writes no file and runs no repository command. Every spawn goes through `lib/run-check.cjs` as an argv array under its own deadline, and all of them run between one content-hash snapshot and the next. No part of a key reaches any output: the redaction reads the source line and the file's own keys, and a parser message in a file that holds a key is withheld.

The gate is `NO_BLOCKER_FOUND` 0, `BLOCKED` 1, `NOTHING_CHECKED` 2, `ERROR` 3 or `UNVERIFIED` 4, with precedence 3, 1, 4, 2, 0. A missing `python3` reads `SKIPPED_ABSENT` and exits 4, never clean. The SKILLED and `sk-code-ci` surfaces declare `quality.checklists` rows in `mode-registry.json`, and the registry compiler rejects a malformed block with `QUALITY_DECLARATION_INVALID`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Create | The runner: CLI, scope, sensors, parse floor, layers, checklists, verdict and renderers |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Create | Argv spawn, deadline, tool probe and the content-hash guard |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/fixtures.cjs` | Create | Throwaway git repositories from quoted strings, and the snapshot assertion |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Create | Twelve named fixtures and fifteen unit cases |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | Create | Excluded paths, sensor settings and the quality-owned checklist rows, with no command |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Create | The eight-section runner contract |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.6.0.0.md` | Create | Packet changelog |
| `.skilled/skills/sk-code/changelog/v3.2.0.0.md` | Create | Hub changelog |
| `.skilled/skills/sk-code/sk-code-skilled/changelog/v2.0.2.0.md` | Create | Surface packet changelog for the reader change |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Edit | Tree, phase flow, resource domains, loading table, target map, enforcement text, `DEFAULT_RESOURCE`, workflow with the restraint step, P0 table, envelope grammar, rules, success criteria and version 1.6.0.0 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Edit | CQ-001 resources and path loop follow `DEFAULT_RESOURCE`, version 1.1.3.0 |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Edit | The quick start, flow, verification and related tables describe the runner and the SKILLED-only universal checklist, version 1.3.0.0 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Edit | Runner, `lib/` and `tests/` rows, and the `node --test` suite, version 1.0.2.0 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/README.md` | Edit | Describes `run-check.cjs` in place of the pointer-only text, version 1.0.1.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Edit | `quality.checklists` for SKILLED and `sk-code-ci`, and version 3.2.0.0 |
| `.skilled/skills/sk-code/hub-router.json`, `.skilled/skills/sk-code/description.json`, `.skilled/skills/sk-code/SKILL.md` | Edit | Hub version 3.2.0.0 |
| `.skilled/skills/sk-code/README.md` | Edit | The newest-entry row names `v3.2.0.0.md`, version 2.2.23.0 |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Edit | The runner row in the reader table at line 126, version 2.2.7.0 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Edit | `surfaceEntry` adds per-kind marker lists, exports unchanged |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Edit | Version 2.0.2.0 |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` | Edit | `validateQualityDeclarations`, called from `compileRegistry` and exported |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin | Regenerate | Refreshed for the new registry |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerate | Lists `assets/quality-defaults.json` and `references/runner-contract.md` |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/sk-code-skilled/SKILL.md` | Regenerate | Hermes copies |
| `.github/workflows/sk-code-script-tests.yml` | Edit | The `node --test` step for the runner tests, and path filters for the three compiled-routing folders those tests load |
| `specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/decision-record.md` | Edit | ADR-017 and ADR-018 |
| `specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/spec.md` | Edit | Section 3 names every derived and companion file, the `ROUTER.md` CODE_QUALITY row records what Phase 5 plans and the checklist entry no phase plans, and REQ-014 and SC-006 state the contract's `local-` rule |
| `specs/sk-code/015-quality-agnostic-gate/spec.md` | Edit | Phase 2 reads Complete in the phase map, and its continuity names phase 3 next |
| `specs/sk-code/015-quality-agnostic-gate/graph-metadata.json`, `specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/graph-metadata.json` | Regenerate | Re-derived with `repair-derived.cjs --apply` after the doc edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tasks ran in `tasks.md` order. The spawn module and the defaults came first, then the runner, then the fixture builder and the test file, so each stage task had its named case to run. The declarations, the compiler validator and the reader change followed, then the docs, the versions and the changelogs, then the regenerations: the Hermes copies with `sync-skills-hermes.cjs`, the leaf manifest with `generate-leaf-manifest.cjs --write`, the activation manifest with `compiled-route-manifest.cjs refresh` and the served compiler with `compiled-route-sync.cjs`. `regenerate-skill-derived.cjs --root .skilled/skills/sk-code` reported `unchanged`, and the router intent signals check printed `RESULT: PASSED` with nothing missing.

Every `node --test` Verify command carries `--test-reporter=tap`. Node 26 prints its spec reporter even when piped, so without it the commands print `ℹ fail 0` and an `rg '^# fail'` matches nothing.

A review then found that a parser message or a cut excerpt could print part of a key, that git's tab after a spaced name made changed lines read as touched-file, that the sensors skipped files with no comment family, that common JSONC configs blocked on their comments, that a timeout under 1 ms meant no deadline, that the CI path filters missed the compiler, and that a snapshot per spawned check dominated the run. Each was reproduced in a throwaway repository, fixed at its source, and covered by a case: `unit: secret redaction`, `unit: changed lines`, `unit: sensors`, `unit: jsonc` and new assertions in `unit: flags`, `unit: private label` and `unit: argv spawn and guard`.

The final gate set, from the final working tree:

| Gate | Output | Exit |
|------|--------|------|
| `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` | `# tests 27`, `# pass 27`, `# fail 0` | 0 |
| The four bash suites | 95, 11 and 9 PASS lines, and `Post-edit adapter parse regression fixture passed` | 0 each |
| `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` | `# tests 27`, `# pass 27`, `# fail 0` | 0 |
| `node --test --test-reporter=tap .skilled/bin/tests/compiled-route-*.test.cjs` | `# tests 94`, `# pass 94`, `# fail 0` on three runs in a row, after the fix in Known Limitations item 6 | 0 |
| The eight pre-commit mirror checks | 194 runtime mirrors, 11 agents, 38 prompts, roster OK, catalog OK, 4 hook registration files, 67 Hermes skill copies, 38 Hermes prompts | 0 each |
| `compiled-route-sync.cjs --check` | `all 7 hubs resolve`, `all 55 served copies match their authored files` | 0 |
| `compiled-route-guard.cjs` | `All hubs fresh or excused` | 0 |
| `parent-skill-check.cjs .skilled/skills/sk-code` | `all hard invariants passed, 0 warnings` | 0 |
| `ci-leaf-manifest-freshness.cjs` | `checked=14 fresh=14 failed=0` | 0 |
| `ci-skill-root-metadata.cjs` | `checked=14 passed=14 failed=0 fixed=0` | 0 |
| `run-all-drift-guards.sh` | `all 4 guards PASSED, 10 non-blocking warning(s)`, the same ten as the baseline and none in a touched file | 0 |
| `actionlint .github/workflows/sk-code-script-tests.yml` | No output | 0 |
| `validate_document.py` on every changed `.md` | `VALID`, 0 issues, for each | 0 each |
| Whole-tree comment hygiene over `git ls-files` | 63 findings, all under `specs/`, the same count as the baseline | 1 |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Node runner over the Python hygiene engine (ADR-001) | The framework already runs Node. The engine that blocks stays one checker, so the gate and CI cannot disagree |
| Changed lines block, and touched-file findings block only with a whole-file layer (ADR-003) | A commit should fail on what it adds. The layers that scan whole files already fail on old comments |
| Five exit codes with a fixed precedence, and no pass value (ADR-004) | Exit 1 must not hide a usage error, and no output may read as a pass |
| `--config` waits for Phase 3 (ADR-010) | The config layer carries the trust boundary, so it lands with its own tests |
| `--no-run` lists spawning checks and exits 4 (ADR-017) | A listed check produced no evidence, and in-process blockers still count |
| One guard snapshot pair around every spawned check | Listing the untracked files walks the tree, about 0.63 s here, so a snapshot per check dominated the run. A mutation now names every check that ran in the window |
| A file with no comment family gets the conflict and secret sensors and stays unchecked | A key in a `.env` or a marker in a Markdown file blocks, and a change of such files alone still reads `NOTHING_CHECKED`, as F05 expects |
| No generated path is declared yet (ADR-018) | The freshness library can write a cache record in the hub's repository, which the guard does not watch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The seven criteria in `goal.md` section 3 | Each passed. The runner suite printed `# fail 0` and the named fixtures `# pass 12`, both with the TAP reporter |
| Self-run on `check-comment-hygiene.sh` (AC-027, T035) | Printed `true` |
| Foreign smoke test on a temporary Go repository (AC-028, T036) | Printed `exit=1`, then `true` |
| Hub validators on `sk-code` (AC-029, T037) | Printed `hub-validators-ok` |
| Envelope private-label and pass check (AC-030, T038) | Printed `0` |
| Strict validation of this folder (AC-031, T043) | `validate.sh --strict --no-recursive` printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` with the packet Complete |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The dist adapter has a real path to check, and the missing path is closed by the opt-in read-only mode with the declared generated rows.** The freshness library takes a `readOnly` option and a `--no-write` flag, `check-dist-staleness.sh` passes the switch on its per-file call, `quality-defaults.json` declares the dist entries this repository holds, and a declared path reaches the adapter instead of stopping at the `**/dist/**` exclusion. No cache record is written beside a dist entry, and fixture F20 runs the real checker over a declared entry and asserts the dist folders are unchanged. Every declared path is now checked against the package that builds it, because the library maps a dist entry back to its package and the adapter reads an unmatched verdict for a declared path as `ERROR` rather than as clean. All eight declared paths read `fresh` beside their package, F20 asserts that real verdict and F20b the stale counter case, and a declared path the run cannot map fails the check. The default stays writable, so the session-start self-heal is unchanged (Phase 8, ADR-002).
2. **No repository config.** `--config` is rejected with exit 3 until Phase 3 (ADR-010). Repositories get the floor and the built-in checks only.
3. **A trusted hook reads `present` only when the checker it names resolves to an executable file, and the old gap is closed by the resolved-checker probe.** `probePreCommit` takes every token in the hook text that ends in `check-comment-hygiene.sh`, drops a leading shell variable, resolves the remainder against the repository root, both source roots and the repository that owns the hook, and reports `broken` with a repair line when no candidate is a regular file with the execute bit (Phase 8, ADR-001).
4. **The guard sees the target repository and the files the scope reaches, and the one-repository blind spot is closed by a measured boundary stated in the contract.** `takeSnapshot` hashes the tracked diff, the untracked files inside the folders the scope reaches, the commit `HEAD` names and the named files. A named-file scope takes no listing for the scope itself and bounds both of its guard snapshots to the folders its named files sit in, so a file a check creates beside one is caught, and a case pins that write as exit 3. A bounded watch over the ignored paths was measured and refused: listing and hashing the folders this hub's own scope reaches took 327 to 1232 ms across five runs, against a 50 ms budget, so no ignored path is hashed. `runner-contract.md` states what stays outside the watch, which is an ignored path, a write outside the scope, a write in another repository and a write to the hub itself. Every built-in spawn still runs with `-B` or `--check`, so it writes nothing, and the snapshot pair names every check that ran between its two halves rather than the one that wrote (Phase 8, ADR-004).
5. **The repeated whole-tree walks behind the overrun are gone, and the budget gap is closed by one bounded workspace listing measured over five runs.** With 93 files in scope the full run took 2.59 s to 3.14 s, against 3.28 s and 3.35 s before the guard change, and `--no-run` took 0.92 s to 1.12 s, because each untracked-file listing walked the 114,000-file tree. A worktree or base run now takes one whole-tree untracked listing for its scope, and each guard window after it takes one bounded listing over the folders the scope reaches, so a file a check creates there is still seen. A `--files` run takes no listing for its scope at all and bounds each of its guard snapshots to the folders its named files sit in. The five-run command records the baseline and the after numbers beside the machine and `HEAD`, and NFR-P01 stays Phase 6's to gate against them (Phase 8, ADR-003).
6. **The compiled-route suite was red on arrival, and is green after a fix at the cause.** Two `compiled-route-admission` tests failed before this phase. The corpus-size pin read 89 while the live corpus held 90 (`90 !== 89`), because the `/doctor:ci` report scenario added in the CI efficiency release carries routing gold. That gold expected no route (`UNKNOWN`), and the scenario's prompt, which asks about GitHub Actions workflows, routes to `sk-code-ci`, so the admission check also scored sk-code as drift. The activation-state hash test failed only when `compiled-route-manifest.test.cjs` ran beside it: that file mints short-lived fixture hubs in the real activation root, and the hash covered the whole root. The coordinator set the scenario's gold to `sk-code-ci`, raised the pin to 90, and scoped the hash to the live hubs' activation directories, which are the state the admission check reads. `node --test --test-reporter=tap .skilled/bin/tests/compiled-route-*.test.cjs` then printed `# tests 94`, `# pass 94`, `# fail 0` on three runs in a row, and `compiled-route-admission.cjs --all` printed `Every hub passes the admission check.`
7. **The deviations from the task text are recorded beside each task.** The six F02 strings (Phase 1 kept `phase 0` and `T1000` as known false positives), a node-only PATH for F17, debug-leftovers kept to checked files, the `dist` finding class, the `OVERVIEW AND CLI` section title, the authored compiler twin, and the derived and companion files that the generators and version rules require, which `spec.md` section 3 now names.
8. **The hub route and the runner now agree on the SKILLED house checklist.** `ROUTER.md` used to list `universal-checklist.md` for every surface in the CODE_QUALITY intent overlay row (line 121) and in `RESOURCE_MAP` (line 271), while ADR-012 and the runner list it only when SKILLED resolves. Phase 5 of the quality gate program scoped both entries to a SKILLED-resolved target, at lines 121 and 272 at this tree, so this limitation is closed.
<!-- /ANCHOR:limitations -->

---
