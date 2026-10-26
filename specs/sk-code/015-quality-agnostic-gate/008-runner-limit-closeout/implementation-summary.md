---
title: "Implementation Summary"
description: "Implementation summary for the runner limit closeout: what the phase built, the four findings a read-only review raised and how each was fixed, the release work and the final numbers."
trigger_phrases:
  - "runner limit closeout implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/008-runner-limit-closeout"
    last_updated_at: "2026-10-26T12:13:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the fifth review round and recorded its evidence, the suite counts and the final timings"
    next_safe_action: "Hand the packet to the conductor for the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-runner-limit-closeout"
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
| **Spec Folder** | 008-runner-limit-closeout |
| **Status** | Complete |
| **Completed** | 2026-10-26. Every task and criterion is closed, the strict validator printed `RESULT: PASSED`, and the conductor owns the commit |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The phase's changes sit on branch head `f1732e4d95` as one uncommitted change set. A read-only review then read that tree and raised four findings. A second read-only review confirmed four more, and the review fix rounds below record each fix with the verification that proves it. `spec.md` section 3 lists the files, and `tasks.md` records each task with its evidence.

### Runner limit closeout

The phase finished the five items the built-in runner phase named as known limitations and left to a later phase. The runner gave an honest verdict, and its own record still called these five open. A pre-commit hook named a checker that might not exist, and the layer still read installed. The dist adapter had never checked a real generated path, because the freshness library writes a cache record beside the dist entry. The two-second budget was unmet, and most of the overrun was three whole-tree listings in one run. The guard watched one repository and listed no ignored path, and nothing stated that boundary. The limitation list still described all of it as open.

With the phase in place, a run over fifty changed files finishes under two seconds, a `present` pre-commit layer means a checker that exists and can run, a declared generated path is really checked with no file written anywhere, the guard's boundary is written down with the measurement behind it, and the limitation list says what closed each item.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| The files `spec.md` section 3 lists | Edit, create, regenerate | One requirement per change |
| `runtime/cli/lib/dist-freshness.cjs` under the system-spec-kit skill | Edit | Fix rounds: a dist entry maps back to its package, and a package provisioned through a hoisted ancestor reports its stale build |
| `runtime/cli/tests/test-dist-freshness.sh` under the system-spec-kit skill | Edit | Fix rounds: the shell suite covers the new mapping and the hoisted dependency shape |
| `scripts/check-dist-staleness.sh` under the sk-code-quality mode | Edit | Fix round: a dist check that cannot assess its package prints an error in the read-only mode |
| `scripts/quality-gate.cjs` under the sk-code-quality mode | Edit | Fix rounds: an unmatched declared path is `ERROR`, a configured check skips a base-declared generated file while a repository's own generated row runs on its declared paths, and every checker spelling a hook can carry resolves |
| `scripts/lib/run-check.cjs` under the sk-code-quality mode | Edit | Fix round: a `--files` guard bounds its listing to the named files' folders |
| `scripts/tests/fixtures.cjs` and `scripts/tests/quality-gate.test.cjs` under the sk-code-quality mode | Edit | Fix rounds: `unit: files scope guard`, `unit: configured skips generated`, the two quoted hook forms, and fixtures F30 to F38 |

### Review Fix Round

A read-only review read the changed tree after the phase's own tasks ran. It raised four findings, and each one was fixed at its cause rather than where it showed.

| Finding | Fix | Evidence 2026-10-26 |
|---------|-----|---------------------|
| The eight declared generated paths were never checked. The freshness library mapped only source files to packages, so each dist path read `unmatched` and the adapter reported `RAN_CLEAN`. | `packageForDistFile` maps a dist entry back to its package and its entry name, and the adapter reads an unmatched verdict for a declared path as `ERROR`. | All eight declared paths print `fresh` beside their package. F20 asserts a real fresh verdict and F20b a stale one. The library suite printed `[PASS] check-file maps a dist entry back to its package` and `Totals: 2 passed, 1 failed`, with only the baseline `[FAIL] validate.sh stale-dist backstop` left, and the fifth round closed that baseline case. |
| A `--files` run took no untracked listing in either snapshot, so a file a check created in the scope's folder was missed. The base caught it. | The files scope takes a bounded untracked listing over the named files' folders in both snapshots, and still takes no listing for the scope itself. | `unit: files scope guard` prints `# pass 1` and `# fail 0`, and pins exit 3 naming `src/new.txt`. |
| Repository-configured checks received declared generated files, and a repository exclude could not take one out. | A configured source check skips a base-declared generated file, and the repository exclude is read before the declared rows. A repository's own `generated` row still has to run on the paths it declares, which the fifth round below fixes. | `unit: configured skips generated` prints `# pass 1` and `# fail 0`. |
| A hook quoting its checker path variable read `broken`. | A quoted `$NAME`, `${NAME}` or `$(...)` prefix resolves under each root. | `unit: layers` prints `# pass 1` and `# fail 0`, and covers both quoted forms. |

The second read-only review confirmed four more defects on the same tree, and this round fixes each one at its cause.

| Finding | Fix | Evidence 2026-10-26 |
|---------|-----|---------------------|
| A dist check that could not assess its package exited 0 with no output in the read-only mode, so the adapter read `RAN_CLEAN` for a build it had never checked. | The checker prints one `DIST FRESHNESS CHECK ERROR:` line, naming the file and the reason, for a checker that throws, exits non-zero, prints nothing, prints a payload with no status, or reports the package unprovisioned. | F30 to F33 print `# tests 4`, `# pass 4` and `# fail 0`, each asserting the adapter reads `ERROR`. |
| A provisioned worktree whose dependencies hoist to an ancestor read every package as `unprovisioned`, and every stale branch then answered `stale:false`. | `isPackageProvisioned` walks from the package root up to the workspace root, so a `node_modules` at any of those ancestors counts and one above the workspace root does not. | `test-dist-freshness.sh` printed `Totals: 4 passed, 0 failed`, including `[PASS] a package whose dependencies hoisted to an ancestor reports its stale build`. |
| The probe accepted a checker only behind a `$NAME`, `${NAME}` or `$(...)` prefix, so a hook that spelled the path plainly read `broken`, and a mention inside a comment read `broken` as well. | Each occurrence of the file name is read back to the last character a path can hold, the text before it is taken as a known root, a variable name inside the word is dropped, `..` segments fold at the root, and shell comments are stripped first. | F34 to F37 read `present` for the plain, `./`, `sh`, `bash`, `|| true`, `cd ... &&`, `${ROOT:-.}` and nested substitution spellings, and `absent` for a comment-only mention. |
| A repository's own `generated` row read `NOT_APPLICABLE`, because `configuredMatches` returned false for every fact that carried the generated mark, which is the inverse of the rule it meant. | The reachability test lets a generated row reach a fact marked generated or hidden by the exclude list, while an authored fact stays out of its reach. | F38 reads `RAN_FAIL` with one file, exit 7 and `BLOCKED`, on a run that changes nothing on disk, and the five-case pattern prints `# pass 5` and `# fail 0`. |
| The reachability test from the fifth round let a repository `generated` row reach only a base-declared or excluded path, so a row on `gen/schema.js` read `NOT_APPLICABLE` where the base commit blocked, and an escaped quote outside quotes opened quote mode in the comment strip. | A repository generated row reaches every in-scope file its own `paths` match, declared dist paths included, while built-in and configured checks still skip declared generated files. A backslash outside quotes escapes one character. | F39 and F40 read `RAN_FAIL` and `BLOCKED` on `gen/schema.js` and `gen/out.txt`, and F41 reads `absent` for a comment after `echo don\'t`. |

The suite after the sixth round printed `# tests 84`, `# pass 84` and `# fail 0` on two serial runs, and the five-run timing command printed every run under `2.00`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The order of work is `tasks.md`. Setup confirmed the two earlier phases landed and recorded the baseline timings, each requirement was one measured change, and verification ran the suites, the timing command and the packet gate. Two read-only reviews then read the changed tree, and their eight findings are fixed at their cause in the rounds above. The release tasks ran after that, and their evidence follows.

The shell variables below are the ones `tasks.md` defines (`Q`, `H`, `K`, `P`).

### Release Work

Each line names the command the release task ran and what it printed.

- **T039, the mode version and its changelog.** `rg -n '^version: ' $Q/SKILL.md` printed `5:version: 1.10.0.0`, one line. Plain `ls $Q/changelog | tail -1` printed `v1.8.0.0.md`, because `ls` sorts `v1.10.0.0.md` before `v1.8.0.0.md` as text, and the same listing read in version order with `sort -V | tail -1` printed `v1.10.0.0.md`. `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` printed `PASS: 13d-packet-version: 4 mode packet(s) match their newest changelog entry` and exited 0.
- **T040, the hub version.** `node -p "[require('./$H/hub-router.json').version, require('./$H/mode-registry.json').version, require('./$H/description.json').version].join(',')"` printed `3.6.0.0,3.6.0.0,3.6.0.0`, and `rg -n '^version: ' $H/SKILL.md` printed `5:version: 3.6.0.0`. The same doctor script printed `PASS: 13a-version: all JSON routing files carry the SKILL.md version 3.6.0.0` and `PASS: 13b-version: SKILL.md version 3.6.0.0 matches the newest changelog entry`, then `OK: parent-skill-check`, exit 0.
- **T041, the system-spec-kit version.** `rg -n '^version: ' $K/SKILL.md` printed `5:version: 2.10.0.0`, one line. Plain `ls $K/changelog | tail -1` printed `v2.9.2.0.md` for the same sort reason, and `sort -V | tail -1` printed `v2.10.0.0.md`, with a version-tuple scan of the folder printing `newest by version: 2.10.0.0`.
- **T042, the hub README.** `rg -c 'changelog/v' $H/README.md` printed `1`, and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $H/README.md --type readme | tail -3` printed `Total issues: 0`, exit 0. The README document version reads `2.2.27.0`.
- **T043, the Hermes copies.** `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` printed `Wrote 3 of 67 Hermes skill copies; pruned 0`, exit 0, and `--check` then printed `PASS: 67 Hermes skill copies in sync`, exit 0.
- **T044, the leaf manifest.** `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $H` printed `leaf-manifest.json OK (6f80ee80c90908e4afb52bdbc110742c2a3045ecb2b856003c2f08d8517f9428)`, exit 0. The phase added and removed no skill resource, so the manifest needed no regeneration.
- **T045, the phase map and the derived metadata.** `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/sk-code/015-quality-agnostic-gate --folder $P --apply` printed `repaired specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout` and `inspected=2 repaired=1 failed=0`, exit 0, and `rg -n '008-runner-limit-closeout' specs/sk-code/015-quality-agnostic-gate/spec.md` printed the phase map row for phase 8.
- **T046, the packet changelog.** `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js $P --write` exited 0, `ls specs/sk-code/015-quality-agnostic-gate/changelog/` lists `changelog-015-008-runner-limit-closeout.md`, and the document validator printed `Total issues: 0` for it.

The baseline checks below were read on the branch head before any edit, and they are not results of this phase. The rows after them are results of this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The layer probe resolves the checker its hook names and reports `broken` when it cannot run (ADR-001) | A `present` layer lends whole-file authority to a checker that never runs |
| The freshness library gains an opt-in read-only mode with its writable default kept (ADR-002) | The no-write promise belongs where the gate runs, and four session-start callers depend on the record |
| A worktree run reads one whole-tree listing for its scope and one bounded listing per guard window, and a `--files` run takes no scope listing (ADR-003) | The repeated whole-tree walks are the recorded cause of the overrun, and the fix leaves every hashed path in place |
| The guard's boundary is settled by a measurement rather than by preference (ADR-004) | An ignored write beside a dist entry is invisible today, and the bounded watch has a measured cost |
| The spec-folder checklist row is scoped by repository, not by surface label (ADR-005) | This repository's spec files resolve to `unknown`, so a label condition would drop its own checklist too |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout --strict --no-recursive` before the authored documents were finished | Baseline: `Summary: Errors: 3  Warnings: 0`, then `RESULT: FAILED`, exit 2. The three errors were the six template placeholders in this file and two generated-metadata checks |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --strict --no-recursive` before any edit under the parent | Baseline: `RESULT: PASSED` with one warning, `GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 008-runner-limit-closeout` |
| `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout` before the goal was authored | Baseline: `RESULT: FAILED (4/5 checks)`, exit 1, five placeholder findings |
| Phase verification after the sixth review fix round | `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` printed `# tests 84`, `# pass 84` and `# fail 0`, exit 0, on two serial runs |
| The five-run timing command on the final tree | Printed `real 1.23`, `0.86`, `0.87`, `0.83` and `0.90` at a load average of 8.69 at HEAD `f1732e4d95`, every run under `2.00`. The round-5 run before it printed `real 1.10`, `0.84`, `0.82`, `0.97` and `0.99` |
| The dist freshness library suite | `Totals: 4 passed, 0 failed`, exit 0, with `ls -d .skilled/skills/system-spec-kit/runtime/node_modules` reporting the folder absent. The worktree hoists dependencies to `.skilled/skills/system-spec-kit/node_modules`, and the library read every package under it as unprovisioned, so the stale-dist case fell back to a clean verdict. The walk now reaches any ancestor up to the workspace root, and the suite gained a case that hoists `node_modules` to an intermediate ancestor and asserts a stale exit 69. Before the change the suite printed `Totals: 2 passed, 1 failed` with `[FAIL] validate.sh stale-dist backstop` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout --strict --no-recursive` after the authored documents were finished | `Summary: Errors: 0  Warnings: 0`, then `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The commit is the conductor's.** The implementation, both review fix rounds and the release work sit on branch head `f1732e4d95` as an uncommitted change set, and the conductor owns the commit. Every task row is closed in `tasks.md`, and the strict validator printed `RESULT: PASSED`.
2. **The ignored watch depends on one measurement.** Task T023 repeats the ignored listing at both bounds on the landed tree. If the bounded cost exceeds the phase's 50 millisecond budget there, the target-repository boundary stands and `runner-contract.md` states that instead, as ADR-004 records.
3. **The timing number is machine specific.** The machine and the HEAD are recorded beside the five lines, and the measurement phase runs the same command, so a change reads as a delta rather than as a claim.
<!-- /ANCHOR:limitations -->

---
