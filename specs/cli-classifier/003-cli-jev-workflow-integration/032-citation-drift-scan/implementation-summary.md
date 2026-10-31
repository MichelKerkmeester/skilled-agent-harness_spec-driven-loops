---
title: "Implementation Summary"
description: "Complete at its label gate. cite-drift-scan.mjs prints a zero-call census of file:line citations in the tracked skill docs, settles dead ones, draws a 40-row label sample and scores two zero-call comparators, then holds one noul per labeled row behind --jev or --deem and each backend's own gate. The 2026-09-29 final runs printed stop: fewer than 40 labeled rows, its 32 tests cover the extraction, resolution, draw, comparators, gates and arms, and the sk-doc docs describe it. Built as c5d3ced36f."
trigger_phrases:
  - "citation drift scan summary"
  - "citation drift scan status"
  - "cite-drift-scan complete"
  - "citation drift verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan"
    last_updated_at: "2026-09-29T23:35:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build c5d3ced36f committed; phase closed at its label gate"
    next_safe_action: "Operator: label the 20 live rows, then run the two backend arms"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-032-citation-drift-scan"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The draw, the operator's labels, then a live Deem run and a Jev run on the operator's yes"
      - "A reader for a drift report once a keep exists"
      - "The six recorded P2 findings"
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
| **Spec Folder** | 032-citation-drift-scan |
| **Status** | Complete |
| **Completed** | 2026-09-29, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read which `file:line` citations the tracked skill docs carry, which of them are dead, and, once the operator labels the drawn sample, how well a Jev or Deem `noul` flags drift against two fixed zero-call comparators. The phase closes at the label gate: no labels file is committed, so the runs print `stop: fewer than 40 labeled rows` and no verdict line has printed. Every existing check and every doc still reads as today by construction, since no validator and no cited file changed.

### Phase 32: citation-drift-scan

**The script.** `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (1,707 lines, Node ESM, standard library only) finds the repository from its own path, so the working directory changes nothing. Its usage is `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs [--draw --seed <n>] [--jev] [--deem] [--out <dir>] [--labels <file>]`, run from the repository root. From the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`, the default run exits 0 in about 171 s. It prints one `skill <name>: citations=<n> in_range=<n> past_end=<n> ambiguous=<n> unresolved=<n> dead=<n>` line per skill folder, sorted by name, then:

```text
citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=709b1078ee5d
cite dead: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md:102 -> .skilled/commands/deep/research.md:157
cite dead: .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md:107 -> .skilled/skills/system-deep-loop/deep-research/SKILL.md:450
margin: 0.10
keep rule: coverage 10*M >= 9*K, then precision 5*TP >= 4*(TP+FP) with TP+FP >= 1, then margin 10*(A-B) >= M, then sign test p < 0.05, then for jev flips 10*F <= 3*M
stop: fewer than 40 labeled rows
```

The counts read the live tree, so a later run may differ. `--draw --seed <n>` writes 40 rows to `cite-drift-labels.jsonl` beside the script (or the file `--labels` names): 20 live citations with `verdict` and `labeler` null, and 20 constructed rows whose window moved 60 lines down its own file with `verdict: contradicts` and `labeler: construction`. The 2026-09-29 draw ran with seed 20260929 at commit 709b1078ee5d, 40 rows, exit 0 in about 381 s, and the file stays in the session scratchpad: no labels file is committed, since parent D4 stops the phase at its label gate. `--jev` and `--deem` each need `--out <dir>` and run one backend behind its own gate; with both switches the Jev gate and arm run first, then the Deem gate and arm, each regardless of the other's outcome. A bad invocation exits 2 before any call, and a skipped or stopped arm still exits 0.

**The tests.** `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` (989 lines, 32 cases) runs the script against a temp git repository holding two skill folders and fixture docs, with stub `jev` and `cli-deem` binaries first on `PATH`. It covers extraction and the fenced-code skip, the resolution order and an ambiguous basename, `unresolved`, the dead check and a line past the end, refusal of an untracked and a `.env` target, the comparator flag, its no-token case and a token present, draw reproducibility and the refusal, the label gate at 39, the instruction line, `no headroom`, `underpowered`, the default run's zero stub calls, both gate passes and both skips, Deem exit 4 with a changed pair, `--out` required, one `--provider` on every stub `jev` call, Jev exit 3 after the gate and the verdicts `keep`, `kill (precision)`, `stop (coverage)`, `stop (margin)` and `requalify`. It prints `tests 32`, `pass 32`, `fail 0`.

**The docs (parent D6, through sk-doc).** `SKILL.md` (one sentence in the section 3 shared-backbone paragraph) and its regenerated Hermes copy, `README.md` (one row in the section 8 checks table), `changelog/v2.2.3.0.md`, the catalog leaf `feature-catalog/document-validation/citation-drift-scan.md` at `version: 2.2.0.0` with its index block in `feature-catalog.md`, and the playbook scenario `manual-testing-playbook/document-validation/citation-drift-scan.md` (SD-021) with its two index rows. The hub version moved to 2.2.3.0 in `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json`, checked by `parent-skill-check.cjs` printing `OK`. `validate_document.py` exits 0 on each changed doc except the playbook index, whose three `missing_required_section` errors are identical at HEAD. No doc names a verdict line, since none was printed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Created | The census, resolution, dead check, draw, comparators, label gate, both arms and the per-column verdicts, 1,707 lines. Briefs c2 to c7, fixes c8f and c8g |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Created | 32 cases over every public surface with fixture docs and stub backends, 989 lines. Briefs c2 to c7, c8g |
| `.skilled/skills/sk-doc/shared/scripts/README.md` | Modified | One row for the script, naming the labels file as the default `--draw` writes. Brief d8a |
| `.skilled/skills/sk-doc/scripts/tests/README.md` | Modified | One row for the test file. Brief d8b |
| `.skilled/skills/sk-doc/SKILL.md` | Modified | One sentence naming the scan, its zero-call default and both switches, and `version:` to 2.2.3.0. Briefs d10a and d10d |
| `.hermes/skills/sk-doc/SKILL.md` | Regenerated | The Hermes copy of the hub `SKILL.md`, in sync |
| `.skilled/skills/sk-doc/README.md` | Modified | One row in the section 8 checks table. Brief d10b |
| `.skilled/skills/sk-doc/changelog/v2.2.3.0.md` | Created | The next changelog entry after `v2.2.2.0.md`. Brief d10c |
| `.skilled/skills/sk-doc/ROUTER.md` | Modified | `version:` to 2.2.3.0. Brief d10d |
| `.skilled/skills/sk-doc/description.json` | Modified | `version` to 2.2.3.0. Brief d10d |
| `.skilled/skills/sk-doc/hub-router.json` | Modified | `version` to 2.2.3.0. Brief d10d |
| `.skilled/skills/sk-doc/mode-registry.json` | Modified | `version` to 2.2.3.0. Brief d10d |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md` | Created | The catalog leaf at `version: 2.2.0.0`. Brief d10e, fix f1 |
| `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` | Modified | The index H3 block in section 4. Brief d10f |
| `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md` | Created | Scenario SD-021 covering the zero-call default and the stub-backend skip. Brief d10g |
| `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` | Modified | The category row and the scenario index row. Brief d10h |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | Regenerated | Re-minted by the pre-commit route gate when `sk-doc`'s `SKILL.md` was staged |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json` | Regenerated | The same re-mint, second copy |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs, evidence and facts, untracked |

`c5d3ced36f` feat(sk-doc) holds 18 files and 2,949 insertions and 10 deletions: the script, its test, the 13 docs and hub files, the Hermes copy and the two re-minted routing manifests. Not pushed. The trigger index follows in its own commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/` and ran the build through CLI executors. Parent D5, amended on 2026-09-29, allows only Pi writes with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The design ran on Devin before its daily quota ran out. The code steps c2 to c7 and both code fixes c8f and c8g ran on DeepSeek V4.1 Flash through Cline, each checked by the test file; the docs d8a to d10h ran on Pi MiMo at `high`, each written from the facts file at `scratch/w4-session/docs/facts.txt` that the session built from its own runs.

The build deviated from the design in four places. `shared/scripts/README.md` gets one row, for the script, which names `cite-drift-labels.jsonl` as the file `--draw` writes by default; the design's second row would describe a file that does not exist until the operator draws it. Ruling 2 read the versions at doc time: the newest changelog was `v2.2.2.0.md` and the highest playbook id SD-020, so the build wrote `changelog/v2.2.3.0.md` with playbook scenario SD-021 and set 2.2.3.0 in the five hub version fields. Ruling 3 made `--draw` the session's own run, and no labels file is committed (parent D4), so the draw is the operator's first step. Step `d10h` made its edit and then reported BLOCKED: `validate_document.py --type playbook` exits 1 with three `missing_required_section` errors, and the session confirmed the same three errors and exit 1 on HEAD's copy of the index, so they predate this phase and restructuring the index is outside the frozen scope.

The session then reran the proof plan from the final state, with logging stubs first on `PATH`. The default run exits 0 in 171 s with `citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=709b1078ee5d`, two `cite dead:` lines, `margin: 0.10`, the keep rule line and `stop: fewer than 40 labeled rows`, and the stub log was never written. `--deem --out <dir>` with a stub backend added only `deem arm skipped: stub backend` after one `cli-deem health` call, and `--jev --out <dir>` with `auth status --provider official` exiting 3 added only the identity line and `jev arm skipped: no credential`; neither wrote a file. `--deem` without `--out` exits 2 with `--deem and --jev need --out <dir> so every call is recorded`, before any call and with no stdout. The draw ran with seed 20260929 at commit 709b1078ee5d and wrote 40 rows, 20 live and 20 constructed, into the session scratchpad. `git status` changed during the runs only by the doc files the 031 and 033 queues were writing at the time; the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (`review-code-pi.md`, 954 s) and printed `VERDICT: FAIL`: 1 P0, 1 P1 and 3 P2. The P0 was the drift flag's polarity, inverted in both arms; fix c8f (DeepSeek, 52 s) flags below the threshold and inverts both Brier inputs, and fix c8g (59 s) moves the seven test expectations with it. The P1 was ruled against by the session: the backend gates run under the label gate, so `--deem --out <dir>` below 40 labels still calls `cli-deem health`, while the goal's criterion 2 and the design's proof plan run the gates on an unlabeled tree and a gate check calls no model. The recheck (214 s) printed `VERDICT: PASS`, the P0 closed and nothing new at P0 or P1. DeepSeek on Cline reviewed the docs (`review-docs-ds.md`, 571 s) and printed `VERDICT: FAIL`: 1 P1 and 4 P2. The P1 held that the catalog entry said a citation to a path outside the tracked files is refused; the session ruled that the code follows the design, whose census line carries both `unresolved` and `refused` and whose test table refuses an untracked file, so REQ-003's "a target outside `git ls-files`" is an untracked file and the doc was wrong. Fix f1 (MiMo, 95 s) corrected all five items, the P1 and the four P2, and the recheck (154 s) printed `VERDICT: PASS`. The six remaining P2 findings are recorded, not chased (parent D5).

The session committed the build as `c5d3ced36f`, 16 files staged; the pre-commit route-remint gate re-minted `sk-doc` and staged both manifests, 18 files in all, not pushed. The staged set passed the key grep (exit 1). After the commit `compiled-route-guard.cjs` lists `sk-doc` fresh and `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure drift, not dead lines | The dead check needs no model and the synthesis counted only 4 dead of 232 resolvable citations. Drift is the unmeasured part |
| Half the labels are constructed | R24's labels can be made by moving a citation's window on purpose, the property that makes it the cheapest later residue to measure (`research.md:480`) |
| Labels are read at a recorded commit | A later edit to a doc or a cited file would otherwise move the window under a label |
| Two switches, no failover | Research rows 80 and 81 |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its gate stop from the final state is Complete, and only the operator labels |
| One README row for the script (design step 8 deviation) | The labels file does not exist until an operator's `--draw`, so the row names it inside the script row instead of describing a missing file |
| Read the changelog version and playbook id at doc time (ruling 2) | The newest changelog was `v2.2.2.0.md` and the highest playbook id SD-020, so the build took `v2.2.3.0.md` and SD-021, with 2.2.3.0 in the five hub version fields |
| Refused means an untracked file on disk, `unresolved` means no match anywhere (session ruling) | The code follows the design's census line, which carries both counts, and its test table refuses an untracked file; if every non-tracked target were refused, `unresolved` could never occur |
| Fix P0 and P1, record P2 | Parent D5 as amended on 2026-09-29. The code P0 and the doc P1 are closed and rechecked; six P2 findings are recorded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the session-run facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Default run on the real tree, stubs first on `PATH` | Exit 0 in 171 s with `citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=709b1078ee5d`, two `cite dead:` lines, `margin: 0.10`, the keep rule line and `stop: fewer than 40 labeled rows`; no file written and the stub log never created (`SE` section 2) |
| `--deem --out <dir>` and `--jev --out <dir>` | Exit 0 with only the skip line added: `deem arm skipped: stub backend` after one `cli-deem health` call, and the identity line then `jev arm skipped: no credential` after `jev --version` and `auth status --provider official`; neither writes a file in `<dir>`; `--deem` without `--out` exits 2 with `--deem and --jev need --out <dir> so every call is recorded`, before any call and with no stdout (`SE` section 2) |
| The draw | `--draw --seed 20260929 --labels <scratchpad file>` exits 0 in 381 s with `draw: ... seed=20260929 commit=709b1078ee5d rows=40 live=20 constructed=20`; 20 live rows with null `verdict` and `labeler`, 20 constructed rows with `contradicts` and `construction`; no stub call; the file stays in the scratchpad (`SE` section 2) |
| `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | `tests 32`, `pass 32`, `fail 0`, exit 0, against goal criterion 3's floor of 18 (`SE` section 2) |
| The sk-doc suite and its baseline | `run-script-tests.sh` prints 26 PASS and 3 FAIL lines with the same one failing file as the baseline (26 PASS, 3 FAIL, `1 failing: test_rename_tooling_fixture_harness.py`); `test-frontmatter-version.mjs` prints `PASS` with 23 passed and 0 failed (`SE` sections 1 and 2) |
| Key grep, `git status` and comment hygiene | The key grep exits 1; `git status` changed during the runs only by the doc files the 031 and 033 queues were writing; the Python comment hygiene checker exits 0 on the script and its test (`SE` section 2) |
| `validate_document.py` on the changed docs | Exit 0 on each changed doc but the playbook index, whose three `missing_required_section` errors are identical at HEAD (pre-existing, out of scope); the `--type feature_catalog` run on the catalog index exits 0 (`SE` section 1; the doc briefs' checks) |
| Generators and packages | `sync-skills-hermes.cjs` regenerated the Hermes copy; `parent-skill-check.cjs` prints `OK` with all hard invariants passed and `0 warnings`; the catalog package reads `violations=6`, HEAD's count; the playbook package `scenarios=27` (HEAD 26), `violations=0`, one advisory warning; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; after the commit `compiled-route-guard.cjs` lists `sk-doc` fresh (`SE` sections 4 and 5) |
| Cross-family review | Pi MiMo on the code `VERDICT: FAIL` (1 P0, 1 P1, 3 P2); the P0 closed by c8f and c8g, recheck `VERDICT: PASS`; the P1 ruled against; DeepSeek on Cline on the docs `VERDICT: FAIL` (1 P1, 4 P2), all closed by f1, recheck `VERDICT: PASS`; six P2 findings recorded. The SHA-1 over each review's files was equal before and after (`SE` section 3) |
| Build commit | `c5d3ced36f` feat(sk-doc), 18 files, 2,949 insertions and 10 deletions, not pushed, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0; `graph-metadata.json` re-derived |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, `Errors: 0  Warnings: 0` |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3907`; `packet_budget=unknown` by design for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and every verdict waits.** No labels file exists, so the runs print `stop: fewer than 40 labeled rows` and call nothing. The 40-row draw, the operator's labels on the 20 live rows, then a live Deem run and a Jev run on the operator's yes are the operator's. T015 and T016 stay `[B]`, and parent D4 puts that outside this phase's completion.
2. **No verdict line exists.** Every real run stopped at the label gate, so the keep rule's verdict path is pinned only on fixtures and no real column has been measured.
3. **No reader is named.** A `keep` here serves nothing. The synthesis promotes R24 once someone names a reader, a validator advisory line or a periodic report (`research.md:863`).
4. **Serving is not in this phase.** A keep wires nothing, and any served form needs a later phase and the operator's call.
5. **Six review P2 findings are recorded, not fixed** (parent D5): the draw refusal keys on any non-null `labeler`, so a fresh draw's construction rows block a second `--draw`; the request's `target` is the bare path where REQ-009 names `path:line`; two verdict tests feed counts that cannot occur together, and nothing covers `stop (sign test)`, `stop (flips)` or disagreeing Jev reruns; `doc.split('/')[2]` counts every folder under `.skilled/skills/` as a skill and prints an all-zero `skill .state:` line; the no-`--out` message names both switches whichever one was given; and the default run takes about 3 minutes, since it reads every tracked doc at its commit.
6. **The playbook index does not validate.** `validate_document.py --type playbook` exits 1 on `manual-testing-playbook/manual-testing-playbook.md` with three `missing_required_section` errors (`global_preconditions`, `global_evidence_requirements`, `deterministic_command_notation`), identical on HEAD's copy. The index predates this phase and its restructure is outside the frozen scope. The playbook package itself reads `scenarios=27` and `violations=0`.
7. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record.
8. **Premise corrections at close.** `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, its REQ-003 acceptance carries the `unresolved` sentence, and its script, test, labels, changelog and playbook rows name what was built. `plan.md`'s roster states parent D5 as amended on 2026-09-29 and its step 7 records that no labels file is committed. `tasks.md`'s notation carries the closure record.
<!-- /ANCHOR:limitations -->

---
