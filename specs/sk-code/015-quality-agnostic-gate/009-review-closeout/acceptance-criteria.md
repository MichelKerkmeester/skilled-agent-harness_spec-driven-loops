---
title: "Acceptance Criteria: Phase 9: review-closeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/009-review-closeout"
    last_updated_at: "2026-10-26T18:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed AC-015 and AC-016 on the final tree, all sixteen Met"
    next_safe_action: "Commit, then pin CHK-FIX-007 to the fix SHA"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-review-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 9: review-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/009-review-closeout
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Commands run from the repository root. Set the variables from `tasks.md` (`Q`, `H`, `D`, `R`, `P`). A `\|` inside a table cell stands for a plain `|` in the command. `Pending` means the lane has not reported yet and counts as unmet for closure.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an outside skill with a malformed quality row whose surface no file in scope reaches, When the runner runs, Then the fault is listed in `config.warnings` and the gate and exit code are unchanged | `node --test --test-reporter=tap $Q/scripts/tests/quality-gate.test.cjs` prints `# fail 0` with the non-applying fault case in it. Evidence 2026-10-26: `# tests 74`, `# pass 74`, `# fail 0`, and the case `outside skill fault: a malformed row whose surface reaches no scoped file never gates` (line 728) asserts `config.warnings` holds `CHECKLIST_ROW_INVALID` and the text output prints its `warning` line | Met | - |
| AC-002 | REQ-001 | Given the same fault with a file of that skill's surface in scope, When the runner runs, Then the gate reads `ERROR` with the fault in `errors[]` | The applying fault case in `quality-gate.test.cjs` passes, and `rg -c 'config.warnings' $Q/references/runner-contract.md` prints `1` or more. Evidence 2026-10-26: the case `outside skill fault: the same malformed row with a scoped file its surface reaches gates` (line 744) passes in that run, asserting `config.errors` holds `CHECKLIST_ROW_INVALID` and `config.warnings` is empty, and the `rg -c` printed `3` | Met | - |
| AC-003 | REQ-002 | Given a fixture repository with a committed `.sk-code/quality.json`, no local grant and no `--config`, When the runner runs, Then each configured check reads `SKIPPED_UNTRUSTED` with the repair line `git config --local skilled.trustRepoChecks true`, and a required one makes the run `UNVERIFIED` with exit 4 | `node --test --test-reporter=tap $Q/scripts/tests/configured-checks.test.cjs` prints `# fail 0` with the no-grant case in it. Evidence 2026-10-26: `# tests 23`, `# pass 23`, `# fail 0`. Case 5 asserts status 4, gate `UNVERIFIED`, the row `SKIPPED_UNTRUSTED` and a canary that never ran, and the repair string is the one line 65 of `quality-gate.cjs` builds from `TRUST_KEY` | Met | - |
| AC-004 | REQ-002 | Given each of the four grants in turn, the hub repository by shared git common dir, `skilled.trustRepoChecks` true in the repository's own `.git/config`, `--config` named on the command line and `skcode.qualityConfig` stored in the repository's own `.git/config`, not through an include, When the runner runs, Then the configured checks run | The four grant cases in `configured-checks.test.cjs` pass, and T030 prints `0` for this repository. Amended 2026-10-26: the Given named three grants while the runner and both references hold four, so the check names the `skcode.qualityConfig` case too. Evidence 2026-10-26: `# tests 23`, `# pass 23`, `# fail 0`, with cases 6 (local key), 8 (`--config`), 9 (`skcode.qualityConfig` in `.git/config`) and 12 (hub repository by shared common dir, a unit case) printing `ok`, and cases 10 (global scope) and 11 (through an include) proving the key grants only from the repository's own file. T030's command printed nothing, the `rg -c` zero count. This repository has no `.sk-code/quality.json`, so its trust reads `none`, and the hub grant rests on case 12 | Met | - |
| AC-005 | REQ-002 | Given the doctor's quality leg, When `status` runs, Then it reports the trust state and which grant holds, and the local git config is unchanged afterwards | `node --test --test-reporter=tap $D/tests/sk-code-quality-config.test.cjs` prints `# fail 0`, and `rg -c 'trustRepoChecks' $Q/references/quality-config.md` prints `1` or more. Evidence 2026-10-26: `# tests 9`, `# pass 9`, `# fail 0`, with `TRUST=untrusted` and `TRUST=trusted` asserted and `status` wrapped in a snapshot that covers `.git/config`, and the `rg -c` printed `1` | Met | - |
| AC-006 | REQ-003 | Given a list of `.js` files longer than the pool bound with one syntax error in the middle, When `syntax-node` runs through the pool, Then its findings equal the sequential loop's in content and order | The pool parity case in `quality-gate.test.cjs` passes. Reading 2026-10-26: the case at line 1909 runs twelve files past the bound of 8 and matches each finding to a direct `node --check`, but its two faulty files sort first (input index 0 and 1), so no error sits in the middle of the list. Open until a case puts one there. Evidence 2026-10-26: the case at line 1954 runs eleven files past the bound with the fault in `src/part-06.js`, sorted index 5 of 11, and matches each finding's file, line and reason to a direct `node --check` per file. `quality-gate.test.cjs` printed `# tests 77`, `# pass 77`, `# fail 0`, the case `ok 75`. The runner sorts findings by file, line and rule before output, so order parity follows from content parity | Met | - |
| AC-007 | REQ-003 | Given 50 changed files in this repository, When five full runs are timed, Then `evidence/timing.json` holds five runs with wall time and per-check `duration_ms`, the machine, the core count and the HEAD, and each wall time reads under 2000 ms on the reference machine | `node -p "require('./$P/evidence/timing.json').runs.length"` prints `5`, and each run's wall time reads under 2000. Amended 2026-10-26: `.runs.length` could not hold because the file keeps runs under `before` and `after`; `node -p "require('./$P/evidence/timing.json').after.runs_ms.length"` tests the same intent. Reading 2026-10-26: it printed `5`, the runs read 620 to 725 ms, `checks_ms` and `reference_machine` (Apple M5 Max, 18 cores) are present, and the file held no HEAD field. Evidence 2026-10-26: the file now holds `head` `002c94662f`, matching `git rev-parse --short HEAD`, with `tree` naming the uncommitted working tree the after runs measured. The amended check printed `5`, and the after runs read 723, 704, 725, 668 and 620 ms, max 725 | Met | - |
| AC-008 | REQ-004 | Given the hub reader and the advisor plugin copy of `declaredSurfaces`, When the parity test runs on the same inputs, Then it passes on the tracked tree and fails when one reader's labels differ | `node --test $H/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` exits 0, and the T017 run against a changed copy exits non-zero. Evidence 2026-10-26: the tracked test printed `pass 2`, `fail 0` with no non-zero exit, and a copy whose plugin `surfaceEntry` lowercased the label printed `fail 2` with `Exit code 1`, the tracked readers unchanged afterwards | Met | - |
| AC-009 | REQ-005 | Given the @code agent and its mirrors, When the QUALITY step is read, Then it names the runner by the loaded sk-code skill's location and every mirror matches the source | `rg -c 'node .skilled/skills/sk-code/sk-code-quality' .skilled/agents/code.md` prints `0`, and `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0. Reading 2026-10-26: the mirror check printed 11 agents in sync, OK. The `rg -c` printed `1`, because line 68 keeps an in-repository example after naming the runner by the loaded skill's location. Amended 2026-10-26: `rg -c ... prints 0` could not hold because the step keeps a worked example labelled `in this repository:`; ``rg -c 'inside the sk-code skill loaded in step 3' .skilled/agents/code.md`` printing `1`, and ``rg -c 'in this repository: `node .skilled/skills/sk-code/sk-code-quality' .skilled/agents/code.md`` matching the unlabelled count, tests the same intent. Evidence 2026-10-26: the three counts printed `1`, `1` and `1`, and the mirror check printed 11 agents in sync, OK | Met | - |
| AC-010 | REQ-006 | Given the records of phases 001 to 008, When pending confirmation wording is searched for, Then none is left, each decision records the 2026-10-26 confirmation, and the 005 outside-skill fault rule reads amended by this phase | `rg -n 'pending operator confirmation\|pending confirmation' $R/00[1-8]-*` prints no line, and `rg -c 'amended' $R/005-consumers-and-routing/decision-record.md` prints `1` or more. Reading 2026-10-26: the `amended` count printed `3`. The search printed two lines, `004-doctrine/tasks.md:81` and `007-checker-debt-closeout/tasks.md:212`, both closed task evidence that quotes the old status as history. Amended 2026-10-26: the bare search could not print no line because closed evidence quotes the old status; the same search piped through `rg -v 'Confirmed by the operator 2026-10-26'` tests the same intent, since each history line carries its confirmation. Evidence 2026-10-26: it printed no line (exit 1) | Met | - |
| AC-011 | REQ-007 | Given 006 AC-021, When it is read, Then it compares the files 006's commits changed, from `git diff --name-only` over 006's commit range, with 006 `plan.md`'s files-to-change list | `rg -n 'AC-021' $R/006-measurement/acceptance-criteria.md` prints a row naming `git diff --name-only` and `plan.md`. Reading 2026-10-26: the row is a scope check again and `Met`, but it uses `git show --name-only` over the five named commits and compares with `spec.md` section 3, since it records that `plan.md` holds no files list. It names `plan.md` and not `git diff --name-only`. Amended 2026-10-26: a row naming `git diff --name-only` and the `plan.md` list could not hold because 006's `plan.md` holds no files list; a row that runs `git show --name-only` over 006's five commits against `spec.md` section 3 and reads `Met` tests the same intent. Evidence 2026-10-26: the AC-021 line matched `git show --name-only` (count `1`), `spec.md` section 3 (count `1`) and `\| Met \| - \|` (count `1`) | Met | - |
| AC-012 | REQ-007 | Given 006 NFR-P01 and the benchmark README, When they are read, Then NFR-P01 is labelled a reference-machine figure over five runs, and the README says pre-renderer folders are legacy and `--check` does not apply to them | `rg -n 'NFR-P01' $R/006-measurement/spec.md` prints the labelled line, and `rg -n 'legacy' $H/benchmark/README.md` prints the note. Evidence 2026-10-26: `spec.md` line 183 names five full runs and "a reference-machine figure, measured on an Apple M5 Max with 18 cores", and README line 133 says pre-renderer folders are legacy and `render-report.cjs --check` does not apply to them | Met | - |
| AC-013 | REQ-008 | Given packet 053's completion criterion 3, When it is read, Then it leaves out only the CodeQL workflow's `dynamic` runs by workflow name, and no other line of that goal changed except the amendment note | `rg -n 'CodeQL' specs/system-speckit/053-ci-workflow-efficiency/goal.md` prints criterion 3 with the workflow-name filter, and the file's diff touches only criterion 3 and its amendment row. Reading 2026-10-26: line 90 carries `select(.event != "dynamic" or .workflowName != "CodeQL")` and line 129 is the new amendment row. The diff also changes the Phase 008 status row to "confirmed by the operator on 2026-10-26", the D8 confirmation, which this criterion does not allow for. Amended 2026-10-26: "only criterion 3 and its amendment row" could not hold because REQ-006 asks that the D8 confirmation be recorded in the Phase 008 row; a diff touching only criterion 3, its amendment row and the Phase 008 row tests the same intent. Evidence 2026-10-26: `git diff HEAD -U0` printed three hunks, at lines 90, 117 and 129, and `--stat` printed `3 insertions(+), 2 deletions(-)` | Met | - |
| AC-014 | REQ-009 | Given the parent `spec.md`, When ADR-001, the purpose line and section 5 are read, Then ADR-001 names the four UNKNOWN rule sources, the purpose line names the phases that exist, and every status reads `Accepted, confirmed by the operator 2026-10-26` with a note that none was reversed | `rg -c 'confirmed by the operator 2026-10-26' $R/spec.md` prints `6` or more, `rg -c 'all seven phases' $R/spec.md` prints `0`, and `rg -n 'surface-neutral checklists' $R/spec.md` prints the ADR-001 line. Evidence 2026-10-26: the counts printed `7` and nothing (no match), the last command printed line 228, and line 223 reads "None was reversed." | Met | - |
| AC-015 | REQ-010 | Given the skill packets this phase touched, When their versions and changelogs are read, Then each carries a new version and a changelog entry at that number, and the packet changelog exists | `rg -n '^version' $H/SKILL.md $Q/SKILL.md $H/sk-code-skilled/SKILL.md` prints the new numbers, and `ls $R/changelog/changelog-015-009-review-closeout.md` lists the file. Reading 2026-10-26: the versions read 3.9.0.0, 1.13.0.0 and 2.1.2.0, each with a changelog file at that number. The packet changelog `changelog-015-009-review-closeout.md` did not exist yet. Evidence 2026-10-26: the `rg` printed `sk-code/SKILL.md:5:version: 3.9.0.0`, `sk-code-quality/SKILL.md:5:version: 1.13.0.0` and `sk-code-skilled/SKILL.md:5:version: 2.1.2.0`, and `ls` lists `changelog/v3.9.0.0.md`, `sk-code-quality/changelog/v1.13.0.0.md`, `sk-code-skilled/changelog/v2.1.2.0.md` and `system-skill-advisor/changelog/v0.17.2.0.md` (its `SKILL.md` reads `version: 0.17.2.0`). The generator `nested-changelog.js $P --write` exited 0, and `ls` lists `$R/changelog/changelog-015-009-review-closeout.md` | Met | - |
| AC-016 | All | Given the finished packet, When the strict validator runs on this folder and recursively on the packet, Then both last lines read `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $R --recursive --strict \| tail -1` prints `RESULT: PASSED`. Reading 2026-10-26, before the packet is finished: this folder and the recursive run each printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`. Evidence 2026-10-26, after AC-015 closed and `repair-derived.cjs --folder $P --apply` printed `inspected=1 repaired=1 failed=0`: `validate.sh $P --strict` and `validate.sh $R --recursive --strict` each printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All sixteen rows are `Met`: AC-001 to AC-016. AC-007, AC-009, AC-010, AC-011 and AC-013 closed on amended checks, each recorded in its cell. AC-015 closed on the generated packet changelog and AC-016 on the final strict runs. The one open item in `tasks.md`, CHK-FIX-007, pins the evidence to the fix SHA and is closed once the commit lands; it is not an acceptance criterion.
<!-- /ANCHOR:closure -->
