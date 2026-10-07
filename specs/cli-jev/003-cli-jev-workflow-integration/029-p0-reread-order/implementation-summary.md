---
title: "Implementation Summary"
description: "Complete at its label gate. score-severity-replay.cjs counts the archived P0 findings and their transitions with zero model calls, writes the P0 label sheet outside the repository and stops at stop: fewer than 20 labeled P0 negatives until the operator labels 20 P0 negatives; past the gate its --jev and --deem arms print one verdict per backend column under the Keep Rule. The 33 tests cover the census, the label gate, both gates, the Keep Rule, the reread order and the funnel, and no run has printed a verdict line. Built as 2239858286."
trigger_phrases:
  - "p0 reread order implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order"
    last_updated_at: "2026-09-30T06:03:26Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build committed as 2239858286, closed at its label gate"
    next_safe_action: "Operator: name a label-sheet path, then label 20 P0 negatives"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-session/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-p0-reread-order"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A label-sheet path outside the repository, 20 labeled P0 negatives, then a live Deem run and a Jev run on the operator's yes"
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
| **Spec Folder** | 029-p0-reread-order |
| **Status** | Complete |
| **Completed** | 2026-09-30, at its label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how many P0 findings the tracked deep-review registries hold, how many ever moved into P0 and out of it, and how many labels the measurement needs, then hand that P0 list to the operator as a label sheet. Once the operator labels 20 P0 findings as not real, a `--jev` or `--deem` run has one verdict per backend column waiting under the Keep Rule fixed in `spec.md` section 4, with the reread order and a validity funnel reported beside it. The phase closes at the label gate: no labels file exists, so every run prints `stop: fewer than 20 labeled P0 negatives` and no verdict line has printed. No severity, registry or review gate changed, so every review runs as today.

### Phase 29: p0-reread-order

**The script.** `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` (1,817 lines, Node CommonJS, standard library only) runs with `node` from the repository root. Its usage is `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--deem] [--out <dir>]`. From the final state, with logging stubs for `jev` and `cli-deem` first on `PATH`, the default run exits 0 in 3 s and prints:

```text
registries: 413
findings: 2771 (P0 96, P1 1298, P2 1377, other 0)
transitions: P1 -> P0 2
transitions: P1 -> P1 19
transitions: P1 -> P2 6
transitions: P1 -> resolved 11
transitions: P2 -> P1 2
transitions: P2 -> P2 6
transitions: P2 -> resolved 5
transitions: none -> P0 45
transitions: none -> P1 879
transitions: none -> P2 938
p0 rows: 95 in 37 registries (one 21, two or more 16)
phrases: 3270 review iteration files; "downgraded from P0" 0; "from P0 to P1" 1; "from P0 to P2" 1; "retracted from P0" 1; "P0 was retracted" 1
labels needed: 20 P0 negatives among 95 P0 rows
labels: none
labeled: 0 (real 0, P1 0, P2 0, not_a_finding 0)
labels dropped: 0
baseline: right 0 of 0
question: Which severity does this review finding deserve?
margin: 0.10
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C
power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031
stop: fewer than 20 labeled P0 negatives
```

The counts read the live tree, so a later run may differ. The census walks every tracked `deep-review-findings-registry.json` file and reads its `openFindings` and `resolvedFindings`, dedupes P0 rows by registry and finding id, counts the transitions by `from` and `to`, and counts grok-04's five rejected-P0 phrases over tracked `iterations/iteration-*.md` files. One of the 95 P0 rows comes from a test fixture registry under `deep-review/scripts/tests/fixtures/`. The run spawns only `git`, writes no file and never starts a backend. `--write-label-sheet <path>` writes one JSONL row per P0 finding with `registry`, `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`, refuses a path inside the repository with exit 2 and writes nothing, and the sheet written outside the repository holds 95 rows, every `label` empty. `--labels <file>` reads the filled sheet back, drops empty labels, rejects any other unknown value by row with exit 2, and applies the 20-negative gate. `--jev` and `--deem` each need `--out <dir>` and run one backend behind its own gate, Jev first, then Deem (parent D1), each regardless of the other's outcome; a failed gate prints one skip line and never starts the other backend in its place. Below the gate both switches print `<backend> arm skipped: label gate`, call no stub and write only `report.json`. The state sent for a row is its title, dimension, evidence refs and recommendation, never the finding id, and no key or credential is read or written. A bad invocation exits 2 before any call, and a skipped or stopped arm still exits 0. No real run has printed a `verdict` line, so the script claims none.

**The tests.** `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts` (1,048 lines, 33 cases) runs the script against fixture registries and iteration files in temp directories with stub `jev` and `cli-deem` binaries first on `PATH` and an injected `git` runner. It covers the census counts and transitions, the phrase counter, an unreadable registry, a duplicate row, the finding id never entering the row state, the label sheet outside the repository and its refusal inside, an unknown label, the gate at 19 and 20 negatives, `no headroom`, the default run's zero calls, both gates passing and skipping, a Deem exit 4 with a changed pair, an unpublished row withheld from Jev, `keep`, `kill` and `stop (coverage)`, the reread order and the funnel. From `runtime`, `npx vitest run tests/unit/score-severity-replay.vitest.ts` prints `Tests 33 passed (33)`, against the goal's floor of 22.

**The docs (parent D6, through sk-doc).** `.skilled/skills/system-deep-loop/SKILL.md` (one sentence in the section 3 Backend paragraph naming the script, the gate and both switches) with its regenerated Hermes copy, `runtime/README.md` (one line in the section 3 consumer paragraph), `runtime/scripts/README.md` (one table row), `runtime/changelog/v1.8.0.0.md`, the catalog leaf `runtime/feature-catalog/scoring/severity-replay.md` (Feature ID F058) with its index block in `feature-catalog.md`, and the playbook leaf `runtime/manual-testing-playbook/scoring/severity-replay.md` (DLR-058) with its index rows. `validate_document.py` exits 0 on each. The hub `SKILL.md` `version:` (3.0.1.0) and the hub changelog stay unchanged, since the release note lives in `runtime/changelog/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | Created | The census, label sheet and reader, the label gate, the baseline and headroom, both arms, the Keep Rule and the report-only lines, 1,817 lines. Briefs c1 to c7, c2f, c5f and c8f |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts` | Created | 33 cases over every public surface with fixture registries, iteration files and stub backends, 1,048 lines. Briefs c1 to c7, c2f and c5f |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modified | One sentence in the section 3 Backend paragraph naming the script, the gate and both switches. Brief d9, fix f1 |
| `.hermes/skills/system-deep-loop/SKILL.md` | Regenerated | The Hermes copy of the hub `SKILL.md`, in sync |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modified | One line naming the script, its zero-call default, the label gate and both switches. Brief d10 |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modified | One row for the script. Brief d8 |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.8.0.0.md` | Created | The next runtime changelog entry after 028's `v1.7.0.0.md`. Brief d11 |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md` | Created | The catalog leaf, Feature ID F058. Brief d12 |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md` | Modified | The index H3 block and the counts. Brief d13 |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md` | Created | Scenario DLR-058 covering the census run, the label-gate stop and a stub-backend skip. Brief d14 |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md` | Modified | The scenario index row and the counts. Brief d15 |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md`, `deep-research.contract.md` and `deep-review.contract.md` | Regenerated | Recompiled from this phase's staged tree, since they hash the hub `SKILL.md` |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` and `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json` | Regenerated | The pre-commit route-remint gate re-minted them |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The build and session records: design, rulings, briefs, logs, evidence and facts, untracked |

`2239858286` feat(deep-loop) holds 16 files, 3,193 insertions and 11 deletions: the script, its test, the eight docs, the Hermes copy, the three recompiled contracts and the two re-minted activation manifests. Not pushed. The trigger index follows in its own commit.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written and released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. The session wrote every brief in `scratch/w4-build/briefs/` and ran the build through CLI executors. Parent D5, amended on 2026-09-29, allows only Pi writes with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The design ran on Devin `deepseek-v4-1-flash-max` before its daily quota ran out; code steps c1 to c7 and every code fix ran on DeepSeek V4.1 Flash through Cline, each checked by the test file, and the docs d8 to d15 ran on Pi MiMo at `high`, written from `scratch/w4-session/docs/facts.txt`.

The build deviated from the design in three places, each logged in `goal.md`. After c2 the check failed 1 of 12: design section 3's `no headroom` case (30 labeled rows, 28 real) cannot reach the headroom check, because the label gate runs first and 2 negatives are fewer than 20. Ruling 5 and the test-only fix c2f use K 201, 20 negatives and 181 real (1810 > 1809). c5 failed 1 of 27 with `ReferenceError: stubs is not defined` in a case table, and the test-only fix c5f closed it. The last code step printed `Tests 33 passed (33)`.

The session then reran the proof plan from the final state, with logging stubs first on `PATH` and every output in its own scratchpad. The default run exits 0 in 3 s with the census block above and `stop: fewer than 20 labeled P0 negatives`, and the stub log was never written. `--jev --deem --out <dir>` and `--jev --out <dir>` each added only the matching `<backend> arm skipped: label gate`, called no stub and wrote only `report.json`. `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call and with no stdout. `--write-label-sheet specs/inside-sheet.jsonl` exits 2 with `refusing to write the label sheet inside the repository` and writes no file; outside the repository the sheet holds 95 rows, every `label` empty. `git status --porcelain` was equal before and after, the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test. The runtime suite run with the staged state, leaving out 030's in-progress test file, printed 127 files passed and 2,489 tests passed; after 028 it held 126 files and 2,456 tests, so this phase adds one file and its 33 tests and no failure.

Both cross-family reviews are read only, split by author family, with the SHA-1 over each review's files equal before and after. Pi MiMo reviewed the code (`review-code-pi.md`, 879 s) and printed `VERDICT: PASS`, REQ-001 to REQ-010 met and REQ-011 not checked since the docs were not yet written, with 6 P2. DeepSeek on Cline reviewed the docs (`review-docs-ds.md`, 398 s) and printed `VERDICT: FAIL`, 1 P1 and 6 P2. The P1: REQ-011 wants each of `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry to name the script, the gate and both switches, and the hub sentence named only the script; f1 (Pi MiMo) rewrote it to name the stop line, `--jev`, `--deem`, `--out <dir>` and the backend gates. The session also fixed the last P2 even though it was rated P2: a JSDoc comment gave `P2-001` as an example of an id shape, and although its reason was sound and the hygiene checker passed it, the repository bans finding ids in code comments and an id-shaped literal falls in that class; c8f (DeepSeek, the code's author) keeps the reason without the literal. The session had ruled the other way after the code review, and this reverses that ruling. The rechecks printed `VERDICT: PASS`: Pi MiMo on c8f (271 s) and DeepSeek on f1 (73 s), checking all six docs REQ-011 names. The other five P2 findings are recorded, not chased (parent D5).

The session committed the build as `2239858286`, 16 files, not pushed. The staged set passed the key grep (exit 1); the pre-commit route-remint gate re-minted `system-deep-loop` and staged both manifests, and after the commit `compiled-route-guard.cjs` lists `system-deep-loop` fresh. The trigger index follows in its own commit. This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gold comes from the operator's labels, not the narrative | Round 2 found no usable rejected-P0 row in 3,271 iteration files, and the registries record no downgrade out of P0 (0 transitions out). Fewer than 20 non-`real` labels stops every arm |
| Never send the finding id | Ids such as `P2-001` carry the recorded severity, which would let a model copy the baseline; the row state is the title, dimension, evidence refs and recommendation |
| Close at the label gate | Parent D4 and parent criterion 2: a phase that prints its gate stop from the final state is Complete, and only the operator labels. T017 and T018 stay `[B]`, and the completion rows were amended to carve them out |
| Two switches, one provider, no failover | Parent D1 and D5: Jev first, then Deem, each behind its own gate, and a failed gate never starts the other backend |
| Read only, no severity writes | A served severity needs a `keep`, a reviewer naming what it changes and a later phase; opening one is the operator's call |
| Fix P0 and P1, record P2 | Parent D5 as amended on 2026-09-29. The doc P1 is closed and rechecked, and six P2 findings are recorded |
| Recompile the contracts in the build commit | The three compiled deep command contracts hash the hub `SKILL.md`, and the pre-commit route-remint gate needs the staged state fresh |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The orchestrator session reran the proof plan from the final state before the commit. The build left no `build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the session-run facts in `scratch/w4-session/docs/facts.txt`.

| Check | Result |
|-------|--------|
| Default run on the real tree, stubs first on `PATH` | Exit 0 in 3 s with `registries: 413`, `findings: 2771 (P0 96, P1 1298, P2 1377, other 0)`, the transition lines, `p0 rows: 95 in 37 registries (one 21, two or more 16)`, the `phrases:` line, `labels needed: 20 P0 negatives among 95 P0 rows`, the baseline, question, margin, keep rule and power lines, and `stop: fewer than 20 labeled P0 negatives`; the stub log was never written (`SE` section 2) |
| `--jev --deem --out <dir>`, `--jev --out <dir>` and `--deem` without `--out` | Each `--out` run adds only its own `<backend> arm skipped: label gate`, calls no stub and writes only `report.json`; `--deem` without `--out` exits 2 with `--deem needs --out <dir> so every call is recorded`, before any call and with no stdout (`SE` section 2) |
| `--write-label-sheet` inside and outside the repository | Inside the repository: exit 2 with `refusing to write the label sheet inside the repository` and no file. Outside: exit 0 with 95 rows, every `label` empty (`SE` section 2; `facts.txt`) |
| `npx vitest run tests/unit/score-severity-replay.vitest.ts` from `runtime` | `Tests 33 passed (33)`, exit 0, against goal criterion 3's floor of 22 (`SE` section 2) |
| The runtime suite | 127 files passed and 2,489 tests passed, with 030's in-progress test file left out; after 028 it held 126 files and 2,456 tests, so this phase adds one file and its 33 tests and no failure (`SE` section 2) |
| Key grep, `git status` and comment hygiene | The key grep exits 1 with no match; `git status --porcelain` was equal before and after each run; the Python comment hygiene checker exits 0 on the script and its test (`SE` section 2) |
| `validate_document.py` on the changed docs | Exit 0 on all eight docs (the two index files with `--type feature_catalog` and `--type playbook`), and fix f1's recheck re-read all six docs REQ-011 names (`SE` section 2; `notes.md`) |
| Generators and packages | `sync-skills-hermes.cjs` regenerated the Hermes copy and the session staged it; `recompile-contracts.sh` printed `[CONTRACT DRIFT] OK commands=3` with the new hub digest; the catalog package added one `packet_history_metadata` warning on the F058 line, a line every runtime entry carries; the playbook package printed `PASS ... scenarios=57 ... violations=0`, one scenario more than 028's 56; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible` (`SE` section 4) |
| Cross-family review | Pi MiMo on the code `VERDICT: PASS` (REQ-001 to REQ-010 met, 6 P2); DeepSeek on Cline on the docs `VERDICT: FAIL` (1 P1, 6 P2), closed by f1 and c8f with rechecks `VERDICT: PASS`. The SHA-1 over each review's files was equal before and after (`SE` section 3) |
| Build commit | `2239858286` feat(deep-loop), 16 files, 3,193 insertions and 11 deletions, not pushed (`SE` section 5) |
| Trigger index | Follows in its own commit after the build commit (`SE` section 5) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0; `graph-metadata.json` re-derived |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 lines matching `RESULT: FAILED`, `Errors: 0  Warnings: 0` |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_durable_chars=3718`; `packet_budget=unknown` by design for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are the operator's, and every verdict waits.** No labels file exists. The final run prints `stop: fewer than 20 labeled P0 negatives` and calls nothing, so T017 (a label-sheet path the operator names outside the repository) and T018 (the gated model runs) stay `[B]`, and parent D4 puts that outside this phase's completion.
2. **No verdict line exists.** The default run and every gated run stopped at the label gate, so the Keep Rule's verdict path is pinned only on fixtures and no real column has been measured.
3. **No reader is named.** A `keep` here serves nothing. The synthesis promotes R10 once a reviewer names what a reread order would change.
4. **Serving is not in this phase.** A keep wires nothing, and any served form needs a later phase and the operator's call.
5. **Six review P2 findings are recorded, not fixed** (parent D5): the `USAGE` comment says the line prints whenever the run cannot start, but nothing prints it; a timed-out or exit-1/4 `jev auth test` stops as `usage error` and logs `unmeasured`, where REQ-009 gives `unmeasured_timeout` past 90 s; `recorded` ranks only rows carrying a P0 probability, not the registry's own order; the label-sheet refusal is lexical, not realpath, so a symlink into the tree gets past it; the `an unreadable registry exits 2` test asserts only the `loadRegistries` throw, never `main`'s exit 2; and one of the 95 P0 rows comes from a test fixture registry under `deep-review/scripts/tests/fixtures/`.
6. **No `build-evidence.md`.** The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record.
7. **Premise corrections at close.** `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, its deliverables and Files to Change rows name what was built, REQ-008 cites `convergence.md:399-401` (398 is the table separator), and its generated-copies row names the Hermes copy, the two activation manifests and the three recompiled contracts. `plan.md`'s roster states parent D5 and its step 6 records the gate stop. `tasks.md`'s notation carries the closure record, and its completion rows carve out T017 beside T018 (parent D4).
<!-- /ANCHOR:limitations -->

---
