---
title: "Implementation Summary: HVR Reader-Needed Lens"
description: "Complete at its label gate. hvr_reader_lens.py prints a zero-call census of flagged skill-doc sections, draws 150 rows for the operator to label across three reader-needed categories and, behind --jev or --deem and each backend's own gate, asks one noul per labeled row under a keep rule fixed in the spec. The 2026-09-29 final runs printed stop: fewer than 150 labeled rows, its 42 tests cover the census, comparators, draw, label gate, gates and arms, and the sk-doc docs describe it. Built as `2588231589`."
trigger_phrases:
  - "hvr reader-needed lens summary"
  - "hvr reader lens status"
  - "hvr_reader_lens complete"
  - "reader-needed lens verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens"
    last_updated_at: "2026-09-30T06:38:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build 2588231589 committed; phase closed at its label gate"
    next_safe_action: "Operator: draw and label 150 rows, then run the two backend arms"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py"
      - "specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-034-hvr-reader-needed-lens"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The 150-row draw, the operator's yes or no label on each row, then a live Deem run and a Jev run on the operator's yes"
      - "The five recorded P2 findings"
      - "A served form once a keep exists"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: HVR Reader-Needed Lens

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-hvr-reader-needed-lens |
| **Status** | Complete |
| **Completed** | 2026-09-29, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many flagged skill-doc sections the tracked skill docs carry, how many each of two lexical rules catches, and, once the operator labels the drawn sample, how well a Jev or Deem `noul` flags three reader-needed tells against the scanner's floor and the standard's lexical rules. The phase closes at the label gate: no labels file is committed, so the runs print `stop: fewer than 150 labeled rows` and no verdict line has printed. `hvr_scan.py`, its test, its fixtures and the standard are unchanged.

### Phase 34: hvr-reader-needed-lens

**The script.** `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` (2,295 lines, Python 3, standard library only) sits beside the unchanged `hvr_scan.py`. Its usage is `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py [--draw --seed <n>] [--jev] [--deem] [--out <dir>] [--labels <file>]`, run from the repository root. From the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`, the default run exits 0 in about 207 s and prints:

```text
census: commit=<40-hex HEAD> files=7920 sections=107218 flagged=51057 in_band_5_80=40965 refused=5
census: category=synonym-cycling candidates=0
census: category=significance-inflation candidates=2
census: category=false-ranges candidates=786
question synonym-cycling sha256=e7dd7323d340c79869fc0ce0f90a34ef014fa1252c3f3e1342486e04cfe6f0ef: Does this passage refer to the same thing by three or more different words?
question significance-inflation sha256=848ce248ac0cfcc67ed27acb732421d9ac0ad6a44a827e413fabfefd5635dd15: Does this passage declare that something is important or historic instead of stating what happened?
question false-ranges sha256=c885108586da7be1539d9c8ecc3fdfc577d5919820016c92a5ae905be04a892c: Does this passage use a from X to Y construction whose endpoints are not on a meaningful scale?
margin: 0.10
keep rule: coverage 10*M >= 9*K, kill 5*TP < 3*(TP+FP) in every category, precision TP+FP >= 1 and 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only), keep at two categories passing
labels: labeled=0 of 150
stop: fewer than 150 labeled rows
```

The counts read the live tree, so a later run may differ. The census walks HEAD's tree for `*.md` under `.skilled/skills/` outside `/changelog/`, `/fixtures/` and `node_modules`, refuses a `.env` basename, reads each file at the recorded commit and scans a temporary copy of the committed text outside the repository, so an uncommitted edit never changes the census. A flagged section holds at least one finding from the unchanged `hvr_scan.py --json`; a skipped scanner prints `stop: scanner skipped`, and a scanner exit 2 stops the run with exit 2.

`--draw --seed <n>` writes 150 rows, 50 per category, to `hvr-reader-lens-labels.jsonl` beside the script (or the file `--labels` names): each row carries its doc, section lines, commit, section hash and an empty label, and no text. The 2026-09-29 draw proof ran with seed 20260929, exit 0 in about 184 s, `rows=150`, `candidate_rows` 0, 2 and 25, every label empty and no stub call. The file stays in the session scratchpad: no labels file is committed (parent D4). `--jev` and `--deem` each need `--out <dir>` and run one backend behind its own gate; with both switches the Jev gate and arm run first, then the Deem gate and arm, each regardless of the other's outcome. A bad invocation exits 2 before any call, and a skipped or stopped arm still exits 0.

**The tests.** `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` (1,397 lines, 42 cases) runs the script against a temp git repository with fixture docs and stub `jev` and `cli-deem` binaries first on `PATH`. It covers the frame walker and its `.env`, changelog and fixture refusals, reading at a commit, the section split and a heading inside a fence, the census and a skipped scanner and a scanner exit 2, both comparators and a genuine range the false-range pattern still flags, a thin standard, draw reproducibility, the per-skill cap and the refusal, the label gate at 149 rows, the baseline choice, headroom, power and the categories stop, an untracked or `.env` row, a spawn past its timeout and a missing answer, the Deem gate pass and the stub-backend skip, Deem exit 4 with a changed pair, `--out` required, a stored pair that differs printing requalify, the Jev gate pass and the `no credential` and wrong-version skips, one `--provider` on every stub `jev` call, Jev exit 3 after the gate, the verdicts `keep`, `kill (precision)`, `stop (coverage)` and `stop (categories)`, the exact sign test, Jev first with both switches, each column's `report.json` entry, the default run's zero stub calls, the census reading committed text rather than uncommitted edits and leaving out a staged, uncommitted doc. It prints 42 `PASS` lines and `ALL PASS`. The unchanged `test_hvr_scan.py` prints 11 `PASS` lines and `ALL PASS`.

**The docs (parent D6, through sk-doc).** The packet `SKILL.md` gains one sentence and moves to 1.2.0.0, with `changelog/v1.2.0.0.md` and the regenerated Hermes copy; `README.md` gains one line in section 3; `scripts/README.md` gains two rows and a usage fence. The catalog leaf `feature-catalog/document-validation/hvr-reader-needed-lens.md` is `version: 2.2.0.0` with its index block in `feature-catalog.md`, and the playbook scenario `manual-testing-playbook/tell-detection/reader-needed-lens-measurement.md` is HVT-004 at `version: 1.2.0.0` with its index rows. The index and README versions stay as 032 left them. The labels file gets no row of its own, since it does not exist (parent D4; design steps 11 and 15 deviation). `validate_document.py` exits 0 on each. No doc names a verdict line, since none was printed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` | Created | The census, section split, comparators, `--draw`, label gate, both arms and the per-column verdicts, 2,295 lines. Briefs c1 to c10, fixes c8f, c10f, c11f, c11g, c11h, c12f, c13f |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` | Created | 42 cases over every public surface with fixture docs and stub backends, 1,397 lines. Briefs c1 to c10, fixes c10f, c11g, c11h, c12g, c13g |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/README.md` | Modified | Two OVERVIEW rows and a usage fence for the script and its test. Brief d11 |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | Modified | One sentence naming the lens and `version:` to 1.2.0.0. Brief d12 |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/README.md` | Modified | One line in section 3. Brief d13 |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/changelog/v1.2.0.0.md` | Created | The next changelog entry after `v1.1.0.0.md`. Brief d14 |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/hvr-reader-needed-lens.md` | Created | The catalog leaf at `version: 2.2.0.0`. Brief d15 |
| `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` | Modified | The index H3 block in section 4. Brief d16 |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/reader-needed-lens-measurement.md` | Created | Scenario HVT-004 covering the zero-call default and the stub-backend skip. Brief d17, fix f0 |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md` | Modified | The HVT-004 block and its index rows. Brief d18 |
| `.hermes/skills/sk-create-with-human-voice/SKILL.md` | Regenerated | The Hermes copy of the packet `SKILL.md`, in sync |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | Regenerated | Re-minted by the pre-commit route gate |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json` | Regenerated | The same re-mint, second copy |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs, evidence and facts, untracked |

`2588231589` feat(sk-doc) holds 13 files and 3,981 insertions and 6 deletions: the script, its test, the eight docs, the Hermes copy and the two re-minted routing manifests. Not pushed. The trigger index follows in its own commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/` and ran the build through CLI executors. Parent D5, amended on 2026-09-29, allows only Pi writes with no Claude leaves. The design step ran on Devin first and exited 1 when Devin's daily quota ran out, so it reran on DeepSeek V4.1 Flash through Cline, which then ran the code steps c1 to c10 and every code fix at `--thinking xhigh`, each checked by the test file. The eight docs d11 to d18 ran on Pi MiMo at `high`, each written from the facts file at `scratch/w4-session/docs/facts.txt` that the session built from its own runs.

The build deviated from the design in three places. The labels file gets no README row of its own and no catalog source row, since it does not exist and the session commits none: parent D4 outranks the phase's ruling 4, which had the session commit the draw, so the draw ran only as a proof in the scratchpad and is the operator's first step. Step c8f defined `FLAG_AT` after the c8 test run stopped at `NameError: name 'FLAG_AT' is not defined`, and c10f corrected the `auth test` call slice after one check counted it with `call[:1] == ["auth", "test"]`, which is never true. The docs were written from the label-gate state, since T017 waits on the operator's labels; no doc names a verdict line.

The session then reran the proof plan from the final state, with logging stubs first on `PATH`. The default run exits 0 in 207 s with `census: ... files=7920 sections=107218 flagged=51057 in_band_5_80=40965 refused=5`, `candidates=0`, `candidates=2` and `candidates=786`, the three questions with their SHA-256 digests, `margin: 0.10`, the keep rule, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`, and the stub log was never written. `--deem --out <dir>` adds only `deem arm skipped: stub backend` after one `cli-deem health` call, and `--jev --out <dir>` adds only the identity line and `jev arm skipped: no credential` after `jev --version` and `jev auth status --provider official`; neither writes a file in `<dir>`. `--deem` without `--out` exits 2 with `--jev and --deem need --out <dir> so every call is recorded`, before any call and with no stdout. The draw reran on the committed code with seed 20260929, exit 0 in 184 s, `rows=150`, 50 per category, `candidate_rows` 0, 2 and 25, every label empty and no text field. The census printed the same counts across the runs while other skill docs were edited, the case the c12f and c13f fixes close. The key grep exits 1, the Python comment hygiene checker exits 0 on the script and its test, and `hvr_scan.py` is byte-identical to HEAD.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (`review-code-pi.md`, 796 s) and printed `VERDICT: FAIL`: 2 P1 and 3 P2. The first P1 held that the Deem fallback pointed one folder too high and ran the `.mjs` client with Python, where REQ-007 names `node`; fix c11f corrected it and c11g added the check. The second held that no check read `report.json`; fix c11h reads it after the both-switches run and checks each column's stored verdict line, categories and identity fields against the printed run. The recheck (167 s) printed `VERDICT: PASS`. The session then found a third P1 the review missed: the census read each section's text at the recorded commit, but the scanner ran on the working tree, so two runs at one commit printed different counts while the doc queues edited skill docs (REQ-002); fix c12f writes the committed text into a temporary folder outside the repository and scans that, and c12g checks that a working-tree edit leaves the census unchanged. The recheck (292 s) printed `VERDICT: PASS`. DeepSeek on Cline reviewed the docs (`review-docs-ds.md`, 717 s) and printed `VERDICT: FAIL`: 1 P1 and no P2, holding that `tracked_files` listed the git index while the census reads each file at HEAD, so a staged, uncommitted file killed the default and `--draw` runs with a traceback (REQ-002). Fix c13f lists HEAD's tree and c13g adds the check "census leaves out a staged, uncommitted doc"; the recheck by Pi MiMo (369 s) printed `VERDICT: PASS`. Before the doc review, fix f0 (MiMo, 214 s) deleted a dated session run with live counts from the playbook scenario's Expected paragraph after the packet playbook package failed with `BAKED_RUN_TRANSCRIPT`. Five P2 findings are recorded, not chased (parent D5), and they are listed under Known Limitations.

The session committed the build as `2588231589`, 11 files staged; the pre-commit route-remint gate re-minted `sk-doc` and staged both manifests, 13 files in all, not pushed. The staged set passed the key grep (exit 1). After the commit `compiled-route-guard.cjs` lists `sk-doc` fresh and `ci-leaf-manifest-freshness.cjs` prints `checked=15 fresh=15 failed=0`. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A sibling script, never an edit to `hvr_scan.py` | The research keeps the scanner's output byte-identical, and its floor stays the baseline |
| Three categories only | They are the research's named examples, and each has a clear question in the standard's own words |
| Candidate halves for two categories | The rough census found 2 significance-phrase sections among 40,946 in-band flagged sections, so a random draw would carry almost no positives. The 2026-09-29 draw drew 2 and 25 candidate rows in those two categories |
| Committed docs only | Drafts are the operator's private text and would need a D9-style gate, which belongs to a later served form |
| The label gate closes the phase | Parent D4: no model labels, so the operator's draw and labels come first and the phase stops there |
| The draw stays in the scratchpad | Parent D4 outranks the phase's ruling 4 and design step 19, which had the session commit the drawn file |
| HEAD's tree, not the index | The census reads each file at its recorded commit, so a staged, uncommitted path has no committed text to scan (REQ-002) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the session-run facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Default run on the real tree, stubs first on `PATH` | Exit 0 in 207 s with `census: ... files=7920 sections=107218 flagged=51057 in_band_5_80=40965 refused=5`, `candidates=0`, `candidates=2` and `candidates=786`, the three questions with their SHA-256 digests, `margin: 0.10`, the keep rule, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`; no file written and the stub log never created (`SE` section 2) |
| `--deem --out <dir>` and `--jev --out <dir>` | Exit 0 with only the skip line added: `deem arm skipped: stub backend` after one `cli-deem health` call, and the identity line then `jev arm skipped: no credential` after `jev --version` and `auth status --provider official`; neither writes a file in `<dir>`; `--deem` without `--out` exits 2 with `--jev and --deem need --out <dir> so every call is recorded`, before any call and with no stdout (`SE` section 2) |
| The draw | `--draw --seed 20260929 --labels <scratchpad file>` exits 0 in 184 s with `rows=150`, 50 per category, `candidate_rows` 0, 2 and 25, every label empty and no text field; no stub call; the file stays in the scratchpad (`SE` section 2) |
| `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` | 42 `PASS` lines and `ALL PASS`, exit 0, against goal criterion 3's floor of 18 (`SE` section 2) |
| `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py` | 11 `PASS` lines and `ALL PASS`, exit 0, unchanged from the baseline (`SE` section 2) |
| The sk-doc suite and its baseline | `run-script-tests.sh` prints 26 PASS lines with the same one failing file as 032's baseline (`test_rename_tooling_fixture_harness.py`); `test-frontmatter-version.mjs` prints `PASS` with 23 passed and 0 failed (`SE` section 2) |
| Key grep, `git status` and comment hygiene | The key grep exits 1; `git status` changed during the runs only by the session's own 029 and 030 doc commits; the Python comment hygiene checker exits 0 on the script and its test; `hvr_scan.py` is byte-identical to HEAD (`SE` section 2) |
| `validate_document.py` on the changed docs | Exit 0 on all eight docs (`SE` section 2; the doc briefs' checks) |
| Generators and packages | `sync-skills-hermes.cjs` regenerated the Hermes copy; `parent-skill-check.cjs` prints `OK`, 0 warnings; the catalog package reads `violations=6`, HEAD's count; the playbook package `scenarios=10` (HEAD 9), `violations=0`, `warnings=0`; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`; after the commit `compiled-route-guard.cjs` lists `sk-doc` fresh (`SE` sections 4 and 5) |
| Cross-family review | Pi MiMo on the code `VERDICT: FAIL` (2 P1, 3 P2), both P1s closed by c11f, c11g and c11h, recheck `VERDICT: PASS`; the session's census P1 closed by c12f and c12g, recheck `VERDICT: PASS`; DeepSeek on Cline on the docs `VERDICT: FAIL` (1 P1, no P2), closed by c13f and c13g, recheck Pi MiMo `VERDICT: PASS`; f0 deleted the baked transcript. Five P2 findings recorded. The SHA-1 over each review's files was equal before and after (`SE` section 3) |
| Build commit | `2588231589` feat(sk-doc), 13 files, 3,981 insertions and 6 deletions, not pushed, confirmed by `git show --stat` at this closure pass (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0; `graph-metadata.json` re-derived |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, `Errors: 0  Warnings: 0` |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars` at or under 4000; `packet_budget=unknown` by design for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and every verdict waits.** No labels file exists, so the runs print `stop: fewer than 150 labeled rows` and call nothing. The 150-row draw, the operator's `yes` or `no` label on each row, then a live Deem run and a Jev run on the operator's yes are the operator's. T015, T016 and T017 stay `[B]`, and parent D4 puts that outside this phase's completion.
2. **No verdict line exists.** Every real run stopped at the label gate, so the keep rule's verdict path is pinned only on fixtures and no real column has been measured.
3. **Two categories can end underpowered.** The tells are rare in committed docs: the draw found 0 synonym-cycling, 2 significance-inflation and 25 false-range candidate rows among 150. The likeliest first result after the labels is `stop: fewer than 2 categories can pass`, which the phase records as its answer.
4. **Serving is not in this phase.** A keep wires nothing, and any served form needs a later phase and the operator's call.
5. **Five review P2 findings are recorded, not fixed** (parent D5): a column that fails coverage or kill still prints its three category lines before its verdict, where the design says the verdict line prints alone; every column line prints `p50=none p95=none`, where the design fixes the measured latencies; K counts non-refused rows rather than the category's labeled rows, so an untracked drawn doc re-bases coverage; `scan_batch`'s docstring still calls its second parameter the repository, and a relative scanner path passed through `deps` would resolve against the temporary folder, though no switch sets one; and the default run takes about 3.5 minutes on the real tree.
6. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record.
7. **Criterion 4 was amended at close.** Its wording demanded the operator's labels before any verdict. Parent D4 closes phases 019 to 035 at their label gate, so the criterion now reads as the label-gate close and the operator's branch, and the amendment is logged in `goal.md`.
8. **Premise corrections at close.** `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, and its `git ls-files` mechanism text in REQ-002, REQ-003 and Out of Scope now names HEAD's tree, which c13f made current. `plan.md`'s roster states parent D5 as amended on 2026-09-29 and its step 7 records that no labels file is committed. `tasks.md`'s notation carries the closure record.
<!-- /ANCHOR:limitations -->

---
