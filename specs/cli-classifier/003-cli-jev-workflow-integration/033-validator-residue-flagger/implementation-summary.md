---
title: "Implementation Summary"
description: "Complete at its label gate. score-residue-flagger.cjs prints a zero-call census of the finding tables in committed review documents, holds 100 operator labels behind a 100-row draw and scores one noul per labeled row behind --jev or --deem and each backend's own gate. The 2026-09-29 final run printed stop: fewer than 100 labeled rows, its 36 tests cover the census, resolver, draw, gates and arms, and the deep-review docs describe it. Built as c13e968a58."
trigger_phrases:
  - "validator residue flagger summary"
  - "residue flagger status"
  - "score-residue-flagger complete"
  - "residue flagger verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger"
    last_updated_at: "2026-09-29T21:57:25Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build c13e968a58 committed; phase closed at its label gate"
    next_safe_action: "Operator: draw from a corpus with resolvable rows, then label 100 rows"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-033-validator-residue-flagger"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A corpus with at least 25 resolvable correctness rows, then the draw and 100 operator labels"
      - "A live Deem run and a Jev run on the operator's yes"
      - "The five recorded P2 findings"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-validator-residue-flagger |
| **Status** | Complete |
| **Completed** | 2026-09-29, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many correctness and traceability finding rows the committed review files hold, how many resolve to a passage, and, once the operator labels the drawn sample, how well a Jev or Deem `noul` flags those passages against flag-nothing, the review table today. The phase closes at the label gate: no labels file could be drawn from today's corpus, so every run prints `stop: fewer than 100 labeled rows` and no verdict line has printed. No review table, template, reducer or finding changed, so every review runs as today.

### Phase 33: validator-residue-flagger

**The script.** `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` (1,648 lines, Node CommonJS, standard library only) sits beside `render-contract-snapshot.cjs` and runs with `node` from the repository root. Its usage is `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs [--labels <file>] [--draw --seed <n> | --jev | --deem] [--out <dir>]`. From the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`, the default run exits 0 in 134 s and prints 90,510 bytes:

```text
census: commit=c91420429b7e files=5862 tables=115 rows=796 skipped=525
severity P0=8 P1=394 P2=394
dimension correctness=271 security=51 traceability=258 maintainability=212
header "Severity|Dimension|Evidence": tables=57 rows=266
header "Severity|Dimension|File": tables=5 rows=19
header "Severity|Dimension|File:Line": tables=36 rows=346
header "Sev|Dimension|Evidence": tables=12 rows=112
header "Sev|Dimension|File": tables=2 rows=28
header "Sev|Dimension|File:Line": tables=3 rows=25
resolvable: correctness=0 traceability=7 refused=125 dropped=664
margin: 0.10
keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)
instruction correctness sha256=3da5d21ad7b02a59f03a9ed398497da4e401844f6b30ff55f738fffe58150ba8: Does this passage claim behavior that its own text shows to be wrong or inconsistent?
instruction traceability sha256=00d7d74e8be9e0c51c6f688d58faa133f07fc0e9ef95bca3296c4cebae91d454: Does this passage name a spec item or requirement that the text it describes does not match or does not contain?
stop: fewer than 100 labeled rows
```

plus one `census skipped: <file>:<line>` line per finding table the parser cannot read, 525 of them. The counts read the live tree, so a later run may differ. The census walks HEAD's tree, reads each finding table by its header, resolves each row's cited location at the first parent of the commit that added the review file, refuses a basename starting `.env` or a path outside the file list and counts the rows it drops. `--draw --seed <n>` writes `residue-flagger-labels.jsonl` beside the script: 100 rows with no text, 50 positives from resolvable correctness and traceability rows and 50 negatives from the same documents at the same commits. On the real tree `--draw --seed 20260929` exits 2 in 137 s with `draw needs 25 resolvable rows in correctness, found 0`, writes no file and calls no stub, since no correctness finding's location resolves (`resolvable: correctness=0`); the draw waits on a corpus with resolvable correctness rows. `--jev` and `--deem` each need `--out <dir>` and run one backend behind its own gate, Jev first, then Deem, each regardless of the other's outcome; a failed gate prints one skip line and never starts the other backend in its place. A bad invocation exits 2 before any call, and a skipped or stopped arm still exits 0.

**The tests.** `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` (997 lines, 36 cases) runs the script against a temp git repository with two commits, review folders holding three recognized header shapes and one unrecognized shape, an untracked review file and a `.env` location, with stub `jev` and `cli-deem` binaries first on `PATH`. It covers the corpus walk, the parser and a skipped shape, dimension mapping, commit resolution and an untracked review file, location resolution and a dropped line, a refused `.env`, staged-file listing after c8f is pinned by c8g, draw reproducibility, spacing, the refusal and the shortfall, the label gate at 99, the default run's zero stub calls, the baseline and headroom, `no headroom`, `underpowered`, both gate passes and both skips, Deem exit 4 with a changed pair, `--out` required, one `--provider` on every stub `jev` call, Jev exit 3 after the gate and the verdicts `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and `requalify`. The folder run prints `tests 37`, `pass 37`, `fail 0`, the baseline's 1 plus this phase's 36.

**The docs (parent D6, through sk-doc).** `SKILL.md` (one sentence after the Review Dimensions table) and its regenerated Hermes copy, both at `version: 1.11.0.37`, `README.md` (one row in the section 9 table), `changelog/v1.11.0.37.md`, the catalog leaf `feature-catalog/review-dimensions/residue-flagger-measurement.md` with its index block in `feature-catalog.md`, and the playbook scenario `manual-testing-playbook/entry-points-and-modes/residue-flagger-measurement.md` (DRV-069) with its two index rows. `validate_document.py` exits 0 on each. No doc names a verdict line, since none was printed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` | Created | The census, commit and location resolution, `--draw`, the label gate, flag-nothing, both arms and the per-column verdicts, 1,648 lines. Briefs c1 to c6, c7f, c7g, c7h and c8f |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` | Created | 36 cases over every public surface with fixture review folders and stub backends, 997 lines. Briefs c1 to c6, c7f and c8g |
| `.skilled/skills/system-deep-loop/deep-review/scripts/README.md` | Modified | One row for the script, naming the census, the zero-call default and both switches. Brief d8a |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/README.md` | Modified | One row for the test file. Brief d8b |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modified | One sentence naming the offline measurement, and `version:` to 1.11.0.37. Briefs d10a and d10h |
| `.hermes/skills/deep-review/SKILL.md` | Regenerated | The Hermes copy of the deep-review `SKILL.md`, in sync |
| `.skilled/skills/system-deep-loop/deep-review/README.md` | Modified | One line naming the script, its default and its switches. Brief d10b |
| `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.0.37.md` | Created | The next changelog entry after `v1.11.0.36.md`. Brief d10c |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/review-dimensions/residue-flagger-measurement.md` | Created | The catalog leaf. Brief d10d, fix f1 |
| `.skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md` | Modified | The index H3 block in section 4. Brief d10e, fix f2 |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/residue-flagger-measurement.md` | Created | Scenario DRV-069 covering the zero-call run and a stub-backend skip. Brief d10f, fix f1 |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md` | Modified | The category census and the scenario index row. Brief d10g, fix f2 |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.md` | Regenerated | Recompiled from this phase's staged tree, since it hashes `deep-review/SKILL.md` |
| `.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl` | Not created | `--draw --seed 20260929` exits 2 with the correctness shortfall, so no file was drawn (parent D4) |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs, evidence and facts, untracked |

`c13e968a58` feat(deep-review) holds 13 files and 2,859 insertions and 5 deletions: the script, its test, the nine docs, the Hermes copy and the recompiled contract. Not pushed. The trigger index follows in its own commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/` and ran the build through CLI executors. Parent D5, amended on 2026-09-29, allows only Pi writes with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The design ran on Devin (`deepseek-v4-1-flash-max`, 382 s) before its daily quota ran out; code step c1 then ran on Pi MiMo (1,707 s) and steps c2 to c6 and the fixes c7f, c7g and c7h on DeepSeek V4.1 Flash through Cline, each checked by the test file; the docs d8a to d10h ran on Pi MiMo at `high`, written from `scratch/w4-session/docs/facts.txt`.

The build deviated from the design at step 10 and its own proof and the two reviews changed three more things at the source. The design's step 10 syncs `SKILL.md`'s `version:` with `frontmatter-version.mjs apply --skill deep-review`; its dry run matched 0 files and `apply` rewrites every in-scope doc's version from history, far wider than this phase, so step d10h set `version: 1.11.0.37` by hand, the convention the skill already kept (1.11.0.36 beside `v1.11.0.36.md`). The first session proof found a 1 MB `spawnSync` buffer: `git ls-files -z` prints 15.7 MB on this tree, so the default run exited 1 with `Error: git ls-files -z exited null`; c7f raises the buffer as the 035 sibling does and adds a test that reads a 2,000,000-character tracked file. Ruling 6 then changed what a skipped table is: a table without a recognized header counts only when one of its data rows holds a cell that is exactly `P0`, `P1` or `P2`, which took the skipped lines from 5,620 to 525 and the run from about 6 minutes to 1 min 48 s, and `buildCensus` resolves a file's reviewed commit only when it holds a parsed row, since only rows use it. The docs review then caught a wrong premise at the source: `trackedFiles` listed the git index while every read is `git show HEAD:<path>`, so a review file staged but not committed aborted the run; c8f lists HEAD's tree instead, c8g pins the `staged review file` case, and the catalog leaf, the changelog and the playbook leaf now say HEAD's tree.

The session then reran the proof plan from the final state, with logging stubs first on `PATH`. The default run exits 0 in 134 s and prints 90,510 bytes, the census block above, the margin, the keep rule and the two instruction lines, and `stop: fewer than 100 labeled rows`, plus 525 `census skipped:` lines, and the stub log was never written. `--deem --out <dir>` with a stub backend added only `deem arm skipped: stub backend` after one `cli-deem health` call, and `--jev --out <dir>` with `auth status --provider official` exiting 3 added only the identity line and `jev arm skipped: no credential`; neither wrote a file. `--deem` without `--out` exits 2 with `--jev and --deem need --out <dir> so every call is recorded`, before any call and with no stdout. `--draw --seed 20260929` exits 2 in 137 s with `draw needs 25 resolvable rows in correctness, found 0`, writes no file and calls no stub, so no labels file exists. `git status --porcelain` was equal before and after, the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test. The runtime suite, leaving out the in-progress test files of phases 029 and 030, printed `Test Files 1 failed | 125 passed (126)` and `Tests 1 failed | 2455 passed (2456)`; the failure is `fanout-run.vitest.ts`, whose checkpoint is due 800 ms after its own clock, and it passed 3 of 3 when run alone and in phase 028's run, while this phase touches no fan-out code, so the session records it as a timing flake, not a regression.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (`review-code-pi.md`, 837 s) and printed `VERDICT: PASS` with 3 P2; MiMo wrote c1, so it reviewed DeepSeek's steps c2 to c7h. DeepSeek on Cline reviewed the nine docs and step c1 (`review-docs-ds.md`, 1,064 s) and printed `VERDICT: FAIL` with 2 P1 and 4 P2. One P1 was the staged-file abort, fixed by c8f and c8g; the other was the stale Hermes copy, regenerated by the session at commit. The P2 that the goal cares about, the catalog leaf claiming every run prints the margin, the keep rule and the questions where `--draw` does not, and the playbook leaf's `version:` at 1.11.0.37 where a new leaf takes 1.11.0.0, were fixed by f1 (MiMo, 187 s). The recheck (DeepSeek, 254 s) printed `VERDICT: PASS`, closed the P1 and both P2 and ran the test file (`tests 36`, `pass 36`, `fail 0`). The session then found the playbook package's `CENSUS_MISMATCH`: the index said 55 scenarios (39 in the first 7 categories) where the tree holds 56, and the catalog overview said 4 review dimensions where the folder holds 5; f2 (MiMo, 247 s) set 56, 40 and 5, and the recheck (DeepSeek, 131 s) printed `VERDICT: PASS`. The five remaining P2 findings are recorded, not chased (parent D5).

The session committed the build as `c13e968a58`, 13 files, not pushed. The staged set passed the key grep (exit 1); the pre-commit route-remint gate re-minted `system-deep-loop` and its manifests came out unchanged; after the commit `compiled-route-guard.cjs` lists every hub fresh. The session set aside phase 029's uncommitted edit to the hub `SKILL.md` for the suite and the commit, since the contracts and the route manifest hash that file, and restored it with the same SHA-1. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure both categories offline, not one judgment over a document | R26 asks per passage and category (`research.md:1076`), and the synthesis parked it because finding rows label positives only, so the operator judges 50 passages clean beside 50 finding-cited ones |
| Read each passage at the reviewed commit | A passage read today can already hold the fix the finding asked for |
| Flag-nothing is the baseline | It is what every review table does today, and no validator checks either category |
| No column is added here | A served column needs a `keep`, a reviewer naming what it changes and a later phase, and opening it is the operator's call |
| Two switches, one provider, no failover | Parent goals D1 and D5 and research rows 80 and 81: Jev first, else Deem, a failed gate never starts the other backend |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its gate stop from the final state is Complete, and only the operator labels. The draw's correctness shortfall is recorded as an operator item, not a failure |
| Skipped means a finding table the parser cannot read (ruling 6) | The design's first wording printed one line per unrecognized table, 5,620 of them and 928 KB of stdout; a table counts only when one of its rows holds a `P0` to `P2` cell, which leaves 525 |
| HEAD's tree, not the git index | Every read is `git show HEAD:<path>`, so listing the index let a staged review file abort the run; c8f lists HEAD's tree and c8g pins the case |
| Set `version:` by hand (design step 10 deviation) | The frontmatter sync dry run matched 0 files and `apply` rewrites every in-scope doc's version from history, far wider than this phase; 1.11.0.37 follows the convention the skill already kept |
| Fix P0 and P1, record P2 | Parent D5 as amended on 2026-09-29. Both doc P1s are closed and rechecked; five P2 findings are recorded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the session-run facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Default run on the real tree, stubs first on `PATH` | Exit 0 in 134 s with 90,510 bytes: `census: commit=c91420429b7e files=5862 tables=115 rows=796 skipped=525`, the severity, dimension and header lines, `resolvable: correctness=0 traceability=7 refused=125 dropped=664`, `margin: 0.10`, the keep rule, the two instruction lines and `stop: fewer than 100 labeled rows`, plus 525 `census skipped:` lines; no file written and the stub log never created (`SE` section 2) |
| `--deem --out <dir>` and `--jev --out <dir>` | Exit 0 with only the skip line added: `deem arm skipped: stub backend` after one `cli-deem health` call, and the identity line then `jev arm skipped: no credential` after `jev --version` and `auth status --provider official`; neither writes a file in `<dir>`; `--deem` without `--out` exits 2 with `--jev and --deem need --out <dir> so every call is recorded`, before any call and with no stdout (`SE` section 2) |
| The draw | `--draw --seed 20260929` exits 2 in 137 s with `draw needs 25 resolvable rows in correctness, found 0`, writes no file and calls no stub; the corpus holds 0 resolvable correctness rows, so the draw waits on the operator's corpus (`SE` section 2; `facts.txt`) |
| `node --test` on `deep-review/scripts/tests/` | `tests 37`, `pass 37`, `fail 0`, exit 0: the baseline's 1 plus this phase's 36, against goal criterion 3's floor of 18; the recheck recorded `tests 36`, `pass 36`, `fail 0` for the test file alone (`SE` sections 1 and 3) |
| The runtime suite | `Test Files 1 failed | 125 passed (126)`, `Tests 1 failed | 2455 passed (2456)`, with the in-progress test files of phases 029 and 030 left out. The one failure is `fanout-run.vitest.ts` (`expected -1 to be greater than or equal to 0`), a timing flake the phase did not cause: the file alone passed 3 of 3, phase 028's suite run passed it, and this phase touches no fan-out code (`SE` section 2) |
| Key grep, `git status` and comment hygiene | The key grep exits 1; `git status --porcelain` was equal before and after the runs; the Python comment hygiene checker exits 0 on the script and its test (`SE` section 2) |
| `validate_document.py` on the changed docs | Exit 0 on all nine docs (the two index files with `--type feature_catalog` and `--type playbook`), and fix f1 re-checked all three docs it touched (`notes.md`; the d8a to d10h logs; `fix/recheck-ds.md`) |
| Generators and packages | `sync-skills-hermes.cjs` regenerated the Hermes copy; `recompile-contracts.sh` printed `[CONTRACT DRIFT] OK commands=3` with only `deep-review.contract.md` changed; the catalog package reads `violations=101`, HEAD's count; the playbook package `PASS ... scenarios=56 ... violations=0 warnings=3` against HEAD's 55; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; after the commit `compiled-route-guard.cjs` lists every hub fresh (`SE` sections 4 and 5) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (3 P2); DeepSeek on Cline on the docs and c1 `VERDICT: FAIL` (2 P1, 4 P2), the first closed by c8f and c8g with recheck `VERDICT: PASS`, the docs fix f1 and f2 with rechecks `VERDICT: PASS`. Five P2 findings recorded. The SHA-1 over each review's files was equal before and after (`SE` section 3) |
| Build commit | `c13e968a58` feat(deep-review), 13 files, 2,859 insertions and 5 deletions, not pushed, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0; `graph-metadata.json` re-derived |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, `Errors: 0  Warnings: 0` |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3960`; `packet_budget=unknown` by design for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and every verdict waits.** No labels file exists: `--draw --seed 20260929` exits 2 with `draw needs 25 resolvable rows in correctness, found 0`, so the runs print `stop: fewer than 100 labeled rows` and call nothing. A corpus with at least 25 resolvable correctness rows, then the draw, then the operator's 100 labels, then a live Deem run and a Jev run on the operator's yes are the operator's. T015 to T017 stay `[B]`, and parent D4 puts that outside this phase's completion.
2. **No verdict line exists.** Every real run stopped at the label gate, so the keep rule's verdict path is pinned only on fixtures and no real column has been measured.
3. **No reader is named.** A `keep` here serves nothing. The synthesis promotes R26 once a reviewer names what a flag column would change (`research.md:905`).
4. **Serving is not in this phase.** A keep wires nothing, and any served form needs a later phase and the operator's call.
5. **Five review P2 findings are recorded, not fixed** (parent D5): `labelGate` completes only at exactly 100 labeled rows, so a hand-edited file with 101 prints the stop line; the unmeasured-row exclusion is never driven through an arm, since the 2-of-10 case hand-feeds the counts; `parseArgs`' error branches, `readJsonl`'s corrupt-line throw and a run with both switches have no test, and `censusLines`' format is only prefix-checked; the deep-review `README.md` frontmatter says 1.11.0.36 at HEAD too, so the drift predates this phase; and the default run still reads each of the 5,862 review files with one `git show`, about 1 min 48 s.
6. **The runtime suite carried one timing failure.** `fanout-run.vitest.ts` failed once under load and passed 3 of 3 when run alone; the phase touches no fan-out code and the session records it as a flake, not a regression.
7. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record.
8. **Premise corrections at close.** `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, its deliverable and Files to Change rows name what was built and the draw shortfall, and its Files to Change paragraph names the recompiled contract. `plan.md`'s roster states parent D5, its step 7 records the draw shortfall and its dependencies record the gate. `tasks.md`'s notation carries the closure record and T015 to T017 stay `[B]`. `goal.md` criterion 4 and the `tasks.md` completion rows now treat the label gate stop as the accepted end of this build (parent D4).
<!-- /ANCHOR:limitations -->

---
