---
title: "Implementation Summary: Phase 21: stage2-leaf-route-replay"
description: "Complete at its replay verdict stop. The zero-call leaf-route replay, its ROUTER.md read recount, its prose comparison and both gated tie-break arms are built and committed as fcacc26bf3. The run scored 55 of 56 committed gold rows at mean F1 0.9209 with 2 tied rows and printed replay verdict: stop (prose arm covers 0 of 55 rows). The prose file, the transcript recount and every model run wait on the operator."
trigger_phrases:
  - "leaf route replay summary"
  - "leaf-route-replay status"
  - "r25 closure"
  - "stage2 replay verdict"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay"
    last_updated_at: "2026-09-29T18:05:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at its replay verdict stop: build fcacc26bf3, 6 of 6 goal criteria ticked"
    next_safe_action: "Operator records prose rows and a transcript directory, then asks for a model run"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/scratch/w4-session/session-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/scratch/w4-build/design.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-021-stage2-leaf-route-replay"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 21: stage2-leaf-route-replay

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-stage2-leaf-route-replay |
| **Status** | Complete |
| **Completed** | 2026-09-29, at the replay verdict stop (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With zero model calls you can now read how well each hub's `ROUTER.md` keyword block alone picks the leaves the playbooks name as gold, how many rows it leaves tied, and what a model tie-break would have to beat. The phase closes at the replay verdict stop, so no prose file, no transcript recount and no live model run exist here.

### Phase 21: stage2-leaf-route-replay

**The script.** `leaf-route-replay.cjs` (1,693 lines) in `.skilled/skills/sk-doc/sk-create-skill/scripts/` parses each hub's `ROUTER.md` machine block, runs the keyword rules ported from the retired replay (`AMBIGUITY_DELTA = 1`, word boundaries for `review`, `lcp`, `inp` and `cls`, weighted scores, every intent within one point of the top, `UNKNOWN` on no hit), converts each kept intent's `RESOURCE_MAP` paths to typed pairs through `dualReadLegacyResource`, loads the committed gold with `parseScenario` and `walkScenarioFiles`, and scores leaf-set precision, recall, F1 and exact match per row and per hub. It reads committed files only, writes only under `--report` or `--out`, and spawns nothing without `--jev` or `--deem`.

**The zero-call run.** `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report <dir>` with stub `jev` and `cli-deem` first on `PATH` exited 0, never created a stub log, and wrote only `report.json`:

```text
hub=sk-doc gold=25 unscored=1 unknown=3 unresolvable=0 tied=2 precision=0.8132 recall=0.8746 f1=0.8259 exact=19
hub=mcp-tooling gold=15 unscored=1 unknown=0 unresolvable=0 tied=0 precision=1.000 recall=1.000 f1=1.000 exact=15
hub=system-deep-loop gold=6 unscored=14 unknown=0 unresolvable=0 tied=0 precision=1.000 recall=1.000 f1=1.000 exact=6
hub=cli-external-orchestration gold=5 unscored=19 unknown=0 unresolvable=0 tied=0 precision=1.000 recall=1.000 f1=1.000 exact=5
hub=sk-design gold=4 unscored=0 unknown=0 unresolvable=0 tied=0 precision=1.000 recall=1.000 f1=1.000 exact=4
hub=sk-code gold=1 unscored=1 surface slice not replayed
hub=cli-classifier stage1-only
total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49
router reads: not measured
replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a
```

The scorer counts 55 of the 56 gold rows because sk-code's one gold row is unscored, a surface the phase does not port. The design's proof table expected the stop at `N=56`. The recount prints `router reads: not measured` without `--transcripts <dir>`, and behind the flag it prints counts and bytes per hub and ISO week, never text. The replay verdict stays at the coverage stop until the operator supplies a prose file covering at least 90 percent of the 55 scored rows.

**The arms.** Behind `--jev` or `--deem`, each arm passes its own gate (`jev 0.6.2` with `jev auth status --provider P` exit 0, or `cli-deem health` within 2,000 ms), else prints one skip line, leaves the rest of the output byte-identical and exits 0. A passing arm prints its payload and cost lines, then asks one `choice` per tied row over the kept intents plus `none_of_these` in three left rotations, records every spawn in `calls.jsonl`, and ends in `verdict <backend>: keep`, `kill` or `stop (<reason>)` under the Keep Rule fixed in `spec.md` section 4. Jev runs first and a failed Jev gate leaves the Jev arm dormant and still runs the Deem gate and arm (rulings item 5, parent D1 over the phase spec's other reading). No model was called in this build: the tests prove every arm path on stubs.

**The tests.** `tests/leaf-route-replay.test.cjs` (771 lines, 37 `node:test` cases) covers each public surface with a happy path and an edge case, including `no headroom at 4 improvable rows`, a printed `verdict deem: keep`, a printed `verdict deem: stop (margin)`, every skip line set, the `--out` refusal before output, the recount and the prose parser.

**The nine docs (parent D6, through sk-doc).** `sk-create-skill/SKILL.md`, `README.md`, `changelog/v1.5.0.0.md`, `scripts/README.md`, `scripts/tests/README.md`, the playbook scenario `manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md` (SKL-008) with its index row, and the sk-doc hub catalog entry `feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` with its index rows. Each passed `validate_document.py` with `Total issues: 0`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | Created | Parser, keyword arm, leaf conversion, gold loader, scorer, recount, replay verdict, both gated arms and the column verdict, 1,693 lines. Briefs c1 to c7 |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | Created | 37 tests, 771 lines. Briefs c1 to c7 and fixes f1 and f2 |
| `sk-create-skill/scripts/README.md`, `scripts/tests/README.md` | Modified | One row each. Briefs d15a and d15b |
| `sk-create-skill/SKILL.md`, `README.md` | Modified | The script, its zero-call default, its recount, its prose arm and its two switches. Briefs d08 and d09 |
| `sk-create-skill/changelog/v1.5.0.0.md` | Created | The changelog entry. Brief d10 |
| `sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md` | Created | Scenario SKL-008. Brief d11 |
| `sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | Modified | The SKL-008 index row and coverage sentences. Briefs d12 and f3 |
| `sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` | Created | The hub catalog entry. Briefs d13 and f3 |
| `sk-doc/feature-catalog/feature-catalog.md` | Modified | The catalog index rows. Briefs d14 and f3 |
| `.hermes/skills/sk-create-skill/SKILL.md` | Regenerated | In `fcacc26bf3` after the pre-commit route-remint gate |
| `activation/sk-doc/manifest.json` (two copies) | Regenerated | Re-minted by the pre-commit route-remint gate |
| `scratch/w4-build/`, `scratch/w4-session/` | Created | The design, rulings, baselines, briefs, logs and the session record |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, this file | Modified | This closure pass recorded the evidence and corrected the stale premises |

`fcacc26bf3` holds 14 files: the script, its test, the nine docs, the Hermes copy and the two `activation/sk-doc/manifest.json` copies the pre-commit route-remint gate re-minted. It is not pushed. No `ROUTER.md`, map, manifest source, playbook source scenario or compiled engine changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. The parent directive was amended the same day to drop Claude leaves (parent `goal.md`, row "Directive amendment: no Claude leaves"), so the session ran the build itself from `scratch/w4-build/briefs/` under parent D5: code briefs c1 to c7 on Devin DeepSeek (`deepseek-v4-1-flash-max`), docs briefs d08 to d15b on Pi MiMo (`llmgateway/mimo-v2.6-pro`, high, 255 s to 1,023 s), each exit 0 with `STATUS: DONE`.

The session then reran the proof plan from the final state: the zero-call replay with stubs first on `PATH`, the key grep, the comment hygiene checker, the test file and the whole `scripts/tests/` folder, `validate_document.py` on all nine docs and the generators. It sent the result to a second model family for review, split by author family: Pi MiMo on the code DeepSeek wrote and DeepSeek on the docs MiMo wrote. Both returned `VERDICT: FAIL` with one P1 each and eight P2s in total. Three fix briefs followed: f1 (DeepSeek) added the three untested Deem gate skip lines, f2 (DeepSeek) added the `readProse` happy path, and f3 (Pi MiMo) made three doc sentences true to the code. Both rechecks returned `VERDICT: PASS`. The session committed the build as `fcacc26bf3`, with `compiled-route-guard.cjs` exiting 0 after the commit ("All hubs fresh or excused"). This closure pass recorded the evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Port the retired keyword rules, not restore the file | The old file carried a benchmark lane that was retired on purpose. The scoring is all this phase needs |
| Judge the tie-break on tied rows only | Untied rows score the same in both arms and would only dilute the margin |
| Baseline is the better of the union and the first tied intent | A model has to beat the best free answer, not only today's union |
| Count transcript reads as numbers only | The promote rule needs a recount, and the operator's session text must not leave the machine or land in a report |
| Close at the replay verdict stop | Parent D4 and parent criterion 2: a phase that prints its verdict line from the final state is Complete, and only the operator records prose rows |
| The Replay Rule, the Keep Rule and the 0.10 margin were frozen before any run | The build cannot tune them, and a change after the first model run voids every verdict |
| Record the review's P2 findings and fix none | Parent D5 as amended on 2026-09-29: fix P0 and P1, record P2 |
| A keep serves nothing | Serving a replay needs the routing owner and a later phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The session ran the build checks from the final state before the commit. `SE` is `scratch/w4-session/session-evidence.md`, this phase's build and session record. There is no `build-evidence.md`, because the session ran the build itself.

| Check | Result |
|-------|--------|
| Zero-call replay, stub `jev` and `cli-deem` first on `PATH` | Exit 0, the stub log never created, `<dir>` holds only `report.json`. `hub=sk-doc gold=25 unscored=1 unknown=3 tied=2 f1=0.8259 exact=19`; mcp-tooling, system-deep-loop, cli-external-orchestration and sk-design each `f1=1.000` with every gold row exact; `hub=sk-code gold=1 unscored=1 surface slice not replayed`; `hub=cli-classifier stage1-only`; `total gold=56 scored=55 tied=2 mean_f1=0.9209 exact=49`; `router reads: not measured`; `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a` (`SE` section 2, `scratch/w4-build/replay-run.txt`) |
| `node --test leaf-route-replay.test.cjs` | `tests 37, pass 37, fail 0`, exit 0, including `no headroom`, a printed `verdict deem: keep` and `verdict deem: stop (margin)` (`SE` section 2) |
| sk-create-skill `node --test` dir, baseline then final | Baseline `pass 46, fail 1`; final `tests 80, pass 79, fail 1`. +34 tests, all pass, the same pre-existing `skill-root-metadata-contract.test.cjs` failure (`SE` section 2, `scratch/w4-build/baseline/node-test.txt`) |
| Key grep, `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script | Exit 1 (`SE` section 2) |
| `git status --porcelain` before and after the run | Differ only by `?? .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/`, phase 031's concurrent path. This phase wrote nothing (`SE` section 2) |
| Comment hygiene on the script and its test | Exit 0 (`SE` section 2) |
| `validate_document.py` on the nine changed docs | Exit 0, `Total issues: 0` each, the playbook index with `--type playbook` and the catalog index with `--type feature_catalog` (`SE` section 2) |
| Generators | `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` OK; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS: verdict diff is empty`; `sync-skills-hermes.cjs` regenerated the Hermes copy (`SE` section 2) |
| Catalog package, `--package sk-doc` | `violations=7` before the fixes, `violations=6` after, against a HEAD extract. The one new warning was `phantom_root_row` at `feature-catalog.md:52`, closed by f3. The package validator refuses `sk-create-skill` as a playbook package root, at HEAD too, so no playbook package check runs for it (`SE` section 2) |
| Cross-family review | Pi MiMo on the code DeepSeek wrote and DeepSeek on the docs MiMo wrote, both `VERDICT: FAIL` with 1 P1 each; SHA-1 over the 11 reviewed files `55a6ac43...` unchanged before and after both runs. f1 and f2 closed the code P1s, f3 closed three doc sentences, and both rechecks returned `VERDICT: PASS` with SHA-1 `29b3b34d...` unchanged. DeepSeek on the docs reran the plain run, the key grep and `validate.sh --strict` (`SE` section 3) |
| Build commit | `fcacc26bf3` feat(sk-create-skill), 14 files, not pushed. Before the commit `node --test` on the test file gave `pass 37`; after it `compiled-route-guard.cjs` exit 0 ("All hubs fresh or excused") (`SE` section 4) |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | Exit 0, `failed=0`. Rerun after every doc edit; the final run is recorded in the handback |
| Closure pass: `validate.sh <this phase> --strict` | `RESULT: PASSED`, 0 `RESULT: FAILED`. Rerun after every doc edit |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)` |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | `packet_budget=unknown` by design for a phase child, `packet_durable_chars` at or under 4000 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The prose file is the operator's.** No committed record holds per-leaf prose picks, so the replay verdict stays at `stop (prose arm covers 0 of 55 rows)` until a prose file covers at least 90 percent of the 55 scored rows. T018 and parent D4 put it outside this phase's completion.
2. **The transcript recount has not run.** `--transcripts <dir>` waits for a directory the operator names, so the line stays `router reads: not measured` and the research's 119 KB a week stays unchecked.
3. **Every model run waits on the operator.** One `--deem --out <dir>` run and, on the operator's flag, one `--jev --out <dir>` run. No model was called in this build: every run used the logging stubs.
4. **Serving is not in this phase.** A `keep` serves nothing. A served stage-2 replay needs the routing owner and a later phase.
5. **Six review P2 findings are recorded, not fixed** (parent D5): the `kill` and `stop (coverage)` verdicts are tested only as `decideVerdict` labels, never as a printed `verdict <backend>:` line; a `jev auth test` exit 2 stops with `jev arm stopped: auth test failed` where the exit map gives exit 2 `usage error`; the README names the switches but not the gate commands or the skip lines; a `jev auth test` spawn past 90 s is recorded `unmeasured` where REQ-007 says `unmeasured_timeout`; no test drives the Jev arm to a verdict line; `readProse`'s JSDoc and one test name still say "counted" for the unparsed lines, which `main` does not print.
6. **The stale sentences remain.** Seven `ROUTER.md` files still say "the deterministic router-replay parses" their block, although the script that did was deleted on 2026-09-11. Rewriting them is the hub owners' call (`spec.md` section 7, open question 1).
7. **The trigger index is stale.** `generate-trigger-index.mjs --check` exits 1 and names this phase's new catalog entry and changelog among the stale docs. Regeneration writes outside this phase folder, so it is left to the orchestrator.
8. **`../changelog/` has no directory.** `spec.md`'s Changelog note asks for a parent changelog refresh at close, but the parent folder holds no `changelog/` and this closure pass may write only this folder's docs.
9. **Five recorded deviations stand.** The scorer counts 55 scored rows where the design's proof table expected `N=56`, because sk-code's one gold row is unscored; the gate order with both switches follows rulings item 5 and parent D1 over the phase spec's reading; f3 fixed doc sentences that rated P2 because the goal asks for docs true to the code; the zero-call report went to the session scratchpad rather than an operator-named directory; and the run's `git status --porcelain` diff came from phase 031's concurrent `debug-next-check/` step.
<!-- /ANCHOR:limitations -->

---
