---
title: "Implementation Summary: Phase 2: scorer-deem-arms"
description: "Remove every scorer's --deem arm with its tests and docs, so each scorer's default run and --jev arm behave as they did before. Complete."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms"
    last_updated_at: "2026-10-02T17:30:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-002-scorer-deem-arms"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-scorer-deem-arms |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 20 scorers that 001's inventory assigns here have no Deem arm. `--deem` now reaches each scorer's unknown-flag path and exits 2. The `--jev` arm and the default run are unchanged, apart from three default-output lines that named Deem's planned calls.

### Phase 2: scorer-deem-arms

The 99 files 001 assigns to this phase hold no Deem reference. Tests that covered only the Deem arm are removed, and tests of logic the Jev arm still runs came back as Jev-only tests.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 20 scorer scripts in `../001-removal-plan/inventory.md` | Update | Deem switch, gate, arm, report column and helpers removed |
| Their test suites | Update | Deem-only tests removed, Jev coverage restored |
| Their READMEs, feature-catalog and playbook pages | Update | Describe the Jev arm alone |

### Removed Tests

Each test below drove the Deem arm. Where it was the only test of logic the Jev arm still runs, a Jev-only test replaced it, named after the arrow.

**`.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs`**

- verdict stop (coverage) with 2 of 10 rows unmeasured → verdict stop (coverage) with two Jev rows unmeasured
- jev flips stop a column that passes every other check, and deem ignores flips
- deem gate passes a torch health and prints the commit pair
- deem gate skips a stub backend
- deem arm prints a keep verdict and records every call
- a missing answer is recorded unmeasured, never 0 → a Jev answer without a probability stays unmeasured
- deem exit 4 with a changed commit pair stops the arm
- a stored commit pair that differs prints requalify before the verdict → a changed Jev identity requalifies before its verdict
- --deem with a stub backend adds one skip line and writes nothing
- a passing gate before the labels exist calls no model → a passing Jev gate before labels exist makes no scoring call
- both switches on the labeled fixture print a verdict per backend, jev first, and record every call

**`.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs`**

- the stub jev answers --version and logs the call, and cli-deem health exits 3
- main refuses --deem without --out before reading any file
- main prints the deem health line and skips the arm at the label gate
- main skips the deem arm when the health check reports a stub backend
- the deem arm measures every reply and dimension and the report keeps the column → the jev arm measures every reply and dimension and the report keeps the column
- the deem arm stops on the margin when the column repeats the baseline
- the deem arm kills a column that matches neither the grades nor the baseline
- the deem arm reports a coverage stop when every score call exits 1 → the jev arm reports a coverage stop when every score call exits 1
- main refuses an untracked payload without --accept-payload and still runs the deem arm

**`.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`**

- deem gate pass
- deem stub backend
- deem exit 4 changed pair

**`.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs`**

- --deem without --out exits before invoking the Deem stub
- the Deem health gate prints each skip reason and leaves lexical output unchanged
- the Deem arm reports one pass, both columns, commit provenance and a keep verdict
- Deem exit 4 rechecks the commit pair and retries that question once
- a Deem arm that measures no row stops both rules on coverage
- a second Deem run under a new commit pair requalifies the column
- Jev runs before Deem and both model columns share the output report

**`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs`**

- a stub deem backend skips
- an unreachable deem health skips
- a different deem model skips and names it
- a bad deem health response skips
- a deem stub answering the gold intent keeps
- a deem stub abstaining stops on margin
- --jev --deem with a jev lacking a credential still runs the deem gate

**`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`**

- --deem without --out exits 2 before any output → the Jev arm refuses to run without an output directory
- a stub or unreachable deem backend skips the arm and leaves the rest byte-identical
- a deem stub that answers the label keeps
- a deem stub that answers the first alternative stops on margin
- a deem stub that loses to the baseline kills
- four failing deem calls in thirty rows stop on coverage → four failing jev calls in thirty rows stop on coverage
- the label gate blocks the deem arm before any call → the Jev arm stops at the label gate without invoking the stub
- with both switches the jev verdict prints before the deem verdict
- a deem stub with another model or an unreadable health answer skips with a details line

**`.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts`**

- stops on flips only for the rerun-sampled backend
- refuses a model arm without --out, a missing --outputs and a bad label value
- passes a healthy server and prints the commit pair
- skips a stub backend with the rest of the output byte-identical
- skips an unreachable server, a wrong model and a bad health body
- refuses untracked labeled outputs without --accept-payload and still runs the Deem gate
- records a skipped arm in report.json and writes no call log
- asks one noul per labeled output and prints keep
- stops with partial rows and no verdict on a changed commit pair or a refused backend
- marks an unparseable answer failed, stops on coverage and requalifies a changed pair → malformed Jev answers are failed calls and stop on coverage after requalification

**`.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/verdict-fallback.vitest.ts`**

- a fake health passes
- a stub backend skips byte-identically
- --deem without --out exits 2 before any call
- a skipped arm is recorded, no calls.jsonl
- report: requalify prints before the verdict → report requalifies a changed Jev identity before its verdict

**`.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs`**

- deem gate pass
- deem stub backend
- deem keep
- deem exit 4 changed pair
- requalify

**`.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts`**

- deem gate passes a fake health
- deem gate skips a stub backend
- deem gate skips an unreachable server
- deem arm marks a disagreeing pair unstable
- deem arm requalifies only when the stored commit pair differs
- report and calls.jsonl written once → writes one Jev report and one call record per arm request

**`.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts`**

- the Deem gate passes a fake health
- the Deem gate skips a stub backend
- a Deem exit 4 with a new pair stops the arm
- the funnel asks one noul per measured row and never decides
- a report.json is read back and requalifies a changed commit pair
- the finding id never reaches a logged call → a Jev calls log the row digest without the finding id
- 19 negatives spawn neither backend
- a report.json records the gate and the column → a Jev report records the gate and its finished column
- the Deem gate skips a stub backend byte-identically

**`.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-hint.vitest.ts`**

- --jev/--deem skip a report with no rater columns and leave the rest byte-identical
- --deem skips a column the rater skipped
- stub jev and cli-deem log nothing in any mode

**`.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts`**

- no headroom closes both arms after the label gate passes
- out missing refuses a model arm
- deem gate passes a fake health
- deem gate skips a stub backend byte-identically
- deem arm stops on a changed pair at exit 4
- oversize state is withheld → oversized Jev states are withheld without score calls
- deem arm counts a top-level score body as unmeasured → a top-level Jev score stays unmeasured

**`.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts`**

- skips a stub backend
- skips a model other than the pinned one
- skips a refused model reported on stderr
- skips when the health check is not reachable
- skips a health body that is not json
- prints the health line when the pinned torch backend answers
- refuses a passing deem gate without --out before any call
- bounds the paired gap on rows both columns decided
- prints no bound below two shared rows
- files columns, calibration, stops and the comparison
- rotates options, skips a cluster over the key cap, and records the commits
- stops when the backend refuses and keeps the calls already made
- stops when the model commit changes after a retryable exit
- gives options that share a description their key, so the client accepts them
- stops when health says the server is gone
- leaves a row out of the sign test when deem answers a key it was not offered
- prints the calibration line after a six-row choice arm and records each noul
- still calibrates when no row can move
- prints no verdict when the noul pass stops → a rejected Jev calibration pass records no calibration result
- prints the deem column from the real client against a scripted server

**`.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts`**

- runs health, then the call with the prompt on stdin
- skips the call when the health check fails
- asks every row three times inside timed children and records each call
- records a call the classifier cannot fully answer as unmeasured → records a Jev answer without full key coverage as unmeasured
- records a killed child at the timeout and stops on the latency p95
- stops the arm when the backend refuses
- skips the deem arm on a stub backend after one gate call
- runs the jev arm, then the deem gate and arm, when both gates pass
- builds the report from the census lines, the timing and both arm outcomes

**`.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts`**

- the deem gate passes a healthy stub
- a Deem column that answers each label keeps
- a Deem column that always answers the target stops on margin
- a Jev payload skip leaves the Deem output byte-identical

**`.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts`**

- skips a stub backend with the rest of the output byte-identical
- skips an unreachable server, a wrong model and a body that is not json
- refuses --deem without --out before any output or call
- asks three rotations per row and prints keep when the stub is right and both baselines abstain
- stops when the commit pair changes after exit 4, or when the backend refuses
- marks exit-1 calls unmeasured and stops on coverage → marks Jev exit-1 calls unmeasured and stops on coverage
- writes report.json whose deem column matches the stdout verdict → writes report.json whose Jev column matches the stdout verdict
- prints requalify before the verdict when the stored commit pair differs
- records a skipped arm and writes no call log

**`.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts`**

- the stub jev and cli-deem logs stay empty

**`.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts`**

- out missing: --deem without --out refuses before any call → a Jev run without --out is refused before any call
- out inside repo: a report directory under the repository is refused → a Jev output directory inside the repository is refused before any call
- deem gate happy: a healthy backend and the planned gate open the arm path
- deem gate edge: a stub backend skips the arm and leaves the census byte-identical
- verdict keep: 30 matching calls against 25 regex hits keep the column → verdict keep: a Jev column that clears the win rule keeps
- verdict kill: five losses with no win kill the column → verdict kill: five Jev losses with no win kill the column
- verdict stop (margin): two net correct calls sit under the ten-point margin → verdict stop (margin): two net Jev wins sit under the margin
- verdict stop (coverage): 26 measured rows stop the arm at the coverage floor → verdict stop (coverage): 26 measured Jev rows stop at the coverage floor
- deem edge (old answer shape): a top-level noul counts every row unmeasured → a top-level Jev answer stays unmeasured
- payload gate edge: without --accept-payload the jev arm is skipped and deem still runs
- stored-report requalify: a report from another commit pair prints the requalify line → a stored Jev identity requalifies before the verdict

**`.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts`**

- --deem without --out
- deem gate pass
- deem stub backend
- deem exit 4 new pair
- verdict keep → verdict keep
- verdict kill → verdict kill
- requalify → a changed Jev identity requalifies before the verdict
- unstable row → an unstable Jev row counts as a miss and adds its missing votes to flips
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max took the one-arm scorers in six batches, on Cline and on OpenCode Go after each 429. Luna 6 max took 023 and 027, which ran both arms side by side. Luna reviewed DeepSeek's batches and DeepSeek reviewed Luna's. The six P1 coverage findings were fixed in `13991d53f8`. A later sweep of all 153 removed tests restored 32 more in `0cf0eadc93`. DeepSeek reviewed that commit and its one P1, the goal-lint requalify line, was fixed in `0c1ca648e8`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Work from 001's inventory | One list of owners keeps the phases disjoint |
| Deem fields leave the default output (D2 amended) | A byte-identical default and a removed Deem could not both hold where a planned-calls line named both backends |
| Compare old and new code on one tree | 017 and 032 read the docs this phase edits, so a before-and-after run on a changing tree would mix two changes |
| Rejection tests use `--bogus` | Keeps the `--deem` string out of live code while still testing the unknown-flag path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Criterion 1 grep over the 99 assigned files | Nothing printed |
| Default output, old against new on one tree | `scratch/default-diff.txt`: 16 identical, 023, 027 and 030 lose only the Deem planned-calls field, 019 differs only in its advisor-child timing line, which differs between runs of identical code |
| `--deem` on each scorer | `scratch/deem-flag.txt`: 20 of 20 exit 2 through the unknown-flag path |
| Covering suites from the final state | 24 of 24 inventory suites 0 fail, and the 14 suites `0cf0eadc93` and `0c1ca648e8` changed pass 446 of 446. The reader lens script prints 36 PASS and 0 FAIL |
| Cross-family reviews | No P0. Six P1 fixed in `13991d53f8`, coverage sweep in `0cf0eadc93`, its review's one P1 fixed in `0c1ca648e8`. P2 in `goal.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **017 is slow.** Its default run takes about 70 minutes, so its comparison ran old and new in parallel.
<!-- /ANCHOR:limitations -->

---
