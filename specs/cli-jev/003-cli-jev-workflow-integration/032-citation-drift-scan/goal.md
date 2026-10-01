---
title: "Goal: Phase 32: citation-drift-scan"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "citation drift scan goal"
  - "cite-drift-scan completion criteria"
  - "citation drift keep rule"
  - "skill doc citation drift verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan"
    last_updated_at: "2026-09-29T23:35:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Build c5d3ced36f committed; phase closed at its label gate"
    next_safe_action: "Operator: label the 20 live rows, then run the two backend arms"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/plan.md"
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
# Goal: Phase 32: citation-drift-scan

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem `noul` finds drifted `file:line` citations in skill docs better than a zero-call identifier-overlap check, through one read-only sk-doc script whose default run makes zero model calls and prints the census and dead count first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `cite-drift-scan.mjs` and `cite-drift-labels.jsonl` in `.skilled/skills/sk-doc/shared/scripts/`, new `scripts/tests/test-cite-drift-scan.mjs`, two README rows and, per parent D6, sk-doc's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. No validator and no cited file changes |
| D2 | Labels: 40 rows drawn with a recorded seed at a recorded commit, read with `git show`. 20 live citations the operator labels, 20 constructed by moving the window 60 lines, labeled by construction. No model writes a label. Until 40 exist every run prints `stop: fewer than 40 labeled rows` |
| D3 | The baseline is the better of flag-nothing and identifier overlap on identical rows. Dead citations are settled with no model. Only tracked files are read, never `.env` |
| D4 | Keep rule per column, in order: at least 90 percent of rows measured, precision at least 0.8 else `kill (precision)`, a 10-point gain, a one-sided sign test below 0.05 and a Jev flip rate of at most 0.10 over 3 reruns (a Deem `noul` holds by its commit pair). Baseline above 0.90 prints `no headroom`, and under 5 winnable rows `underpowered`. Offline only |
| D5 | Jev first, else Deem. A Jev arm runs behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A Deem arm runs behind `--deem` after `cli-deem health` passes. A failure prints one skip line and changes nothing. One `--provider P`, no key in any file, no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` exits 0, prints `citations=` and `dead=` and either `stop: fewer than 40 labeled rows` or a `baseline:` and headroom line, and stub `jev` and `cli-deem` first on `PATH` log zero calls
- [x] With `--deem --out <dir>` and a stub health reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub `jev` whose `auth status --provider official` exits 3 it prints the `jev` path and provider, then `jev arm skipped: no credential`. Each exits 0 with its other output byte-identical to the default run
- [x] `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` exits 0 with at least 18 passed and 0 failed
- [x] After the operator labels 20 live rows, each backend whose gate passed printed one `verdict <backend>:` line of `keep`, `kill (precision)` or `stop (<reason>)` from a live `--out` run with a `calls.jsonl` holding `wallMs` and `exitCode` on every line, or the zero-call run printed `no headroom` or `underpowered`. The 2026-09-29 runs stopped at the label gate; the live branch waits on the operator (parent D4)
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and `validate_document.py` exits 0 on each changed sk-doc doc. The playbook index is the one changed doc that fails `validate_document.py`; its three errors match HEAD (pre-existing)
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec authoring | Done | 2026-09-29, docs only, from `../007-classifier-deep-research/research/research.md:844-863` (R24), `:460-480` (validators), `:1030`, `:1047`, `:1079` and `:1173`, plus swe-06's and mimo-08's lineage iterations, with the initial Status Planned |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: design and briefs c2 to c7, c8f, c8g and d8a to d10h from `scratch/w4-build/briefs/`, run by the CLI executors of parent D5. The code steps and both fixes ran on DeepSeek V4.1 Flash through Cline (`--thinking xhigh`), each checked by the test file, the last `tests 32`, `pass 32`, `fail 0`; the docs ran on Pi `llmgateway/mimo-v2.6-pro` at `high`, written from `scratch/w4-session/docs/facts.txt`. Committed as `c5d3ced36f`, 18 files with the route remint, not pushed. Source: `SE` sections 1 and 5 |
| Baseline | Done | `run-script-tests.sh` holds 26 PASS and 3 FAIL lines with `1 failing: test_rename_tooling_fixture_harness.py`; `test-frontmatter-version.mjs` printed `PASS` with 23 passed and 0 failed, captured before any 032 file existed. Source: `../w4-build/baseline/`; `SE` section 1 |
| Session verification from the final state | Done | With logging stubs first on `PATH`: the default run exits 0 in 171 s with `citations=357 in_range=208 past_end=2 ambiguous=44 unresolved=103 refused=0 dead=2 commit=709b1078ee5d`, two `cite dead:` lines, `margin: 0.10`, the keep rule line and `stop: fewer than 40 labeled rows`, and the stub log was never written; `--deem --out <dir>` with a stub backend adds only `deem arm skipped: stub backend` after one health call; `--jev --out <dir>` with `auth status` exit 3 adds only the identity line and `jev arm skipped: no credential`; neither writes a file; `--deem` without `--out` exits 2 before any call with no stdout; the key grep exits 1 and the Python comment hygiene checker exits 0 on the script and its test. Source: `SE` section 2 |
| Label gate stop recorded | Done | The draw wrote 40 rows at `709b1078ee5d` with seed 20260929 into the session scratchpad; no labels file is committed (parent D4), so the default run ends `stop: fewer than 40 labeled rows` and the phase closes there. Source: `SE` section 2 |
| Tests | Done | `test-cite-drift-scan.mjs` prints `tests 32`, `pass 32`, `fail 0`; the sk-doc suite holds 26 PASS and 3 FAIL lines, the same one failing file as the baseline; `test-frontmatter-version.mjs` prints `PASS` with 23 passed and 0 failed. Source: `SE` sections 1 and 2 |
| Docs and packages | Done | Eight docs landed and `validate_document.py` exits 0 on each but the playbook index, whose three errors match HEAD; `parent-skill-check.cjs` prints `OK ... 0 warnings`; the catalog package prints `violations=6`, HEAD's count; the playbook package `scenarios=27`, `violations=0`, one advisory warning; `ci-leaf-manifest-freshness.cjs` `checked=15 fresh=15 failed=0`; README verdict parity `PARITY PASS`; README manifest `manifest=reproducible`. Source: `SE` sections 1 and 4 |
| Review and fixes | Done | Code, read by Pi MiMo: `VERDICT: FAIL`, 1 P0 (polarity, fixed by c8f and c8g, recheck `VERDICT: PASS`), 1 P1 (gates under the label gate, ruled against) and 3 P2. Docs, read by DeepSeek on Cline: `VERDICT: FAIL`, 1 P1 and 4 P2, all closed by f1, recheck `VERDICT: PASS`. Six P2 findings are below, not chased (parent D5). The SHA-1 over each review's files was equal before and after. Source: `SE` section 3 |
| Commit | Done | `c5d3ced36f` feat(sk-doc): the script, its test, the 13 docs and hub files and the Hermes copy, 16 files staged; the route remint staged both manifests, 18 files in all, not pushed. The staged set passed the key grep (exit 1). After the commit `compiled-route-guard.cjs` lists `sk-doc` fresh. The trigger index follows in its own commit. Source: `SE` section 5 |
| Closure pass | Done | 2026-09-29: this pass ticked the six criteria, set Status Complete in `spec.md` and `implementation-summary.md`, and recorded the evidence here and in `tasks.md`. Gate results are in `implementation-summary.md` Verification |
| Open for the operator | Open | 1. The 40-row draw, then the operator's `supports`, `partial` or `contradicts` label on each of the 20 live rows, then a live Deem run and a Jev run on the operator's yes. 2. The six P2 findings below. 3. A reader for a drift report once a keep exists, and any served form. Source: `SE` section 6 |

### Deviations and findings

| Item | Note |
|------|------|
| Seam reopened | R24's seam row says nothing checks skill-doc citations. Reopened 2026-09-29: two neighbors check less. `check-ac-coverage.sh:437` resolves a `file:line` only in spec-folder acceptance criteria, and `validate_catalog_package.py:494` strips the line range and checks the path only. Neither reads whether the line supports its sentence, so the seam stays "none" |
| Cite corrected | swe-06 cites `validate_document.py:1520-1537` for the exit contract. Today it is documented at `:18-21` and set at `:1691-1692` |
| Two switches | swe-06's single `--cite-backend deem\|jev\|none` becomes `--jev` and `--deem` (research row 80) |
| Ruling: refused against unresolved (2026-09-29) | REQ-003's "a target outside `git ls-files`" is an untracked file that exists on disk, which the code refuses; a citation that matches no tracked path and no file on disk is `unresolved`, a count the census carries (`refused=0 unresolved=103`). The catalog entry said refused for both, and the session ruled the code follows the design. Fix f1 corrected the entry, and `spec.md` now says so. Source: `SE` section 3; `review-docs-ds.md` P1 |
| Design step 8 deviation | `shared/scripts/README.md` gets one row, for the script, which names `cite-drift-labels.jsonl` as the file `--draw` writes by default. The design's second row would describe a file that does not exist until the operator draws it. Source: `SE` section 1; `notes.md` |
| Playbook index (2026-09-29) | Step `d10h` made its edit and then reported BLOCKED: `validate_document.py --type playbook` exits 1 with three `missing_required_section` errors. The session ran the same command on HEAD's copy: the same three errors, exit 1. They predate this phase, and restructuring the index is outside the frozen scope. The playbook package prints `scenarios=27`, `violations=0`. Source: `SE` section 1; `d10h.last.txt` |
| Fix c8f and c8g (P0) | The drift flag's polarity was inverted: `noul` gives the probability that the window still shows the cited fact, so a row is drifted when that probability is below 0.5, but both arms flagged at 0.5 or above. c8f flags below the threshold and inverts both Brier inputs; c8g moves the seven test expectations with it. Recheck `VERDICT: PASS`; `tests 32`, `pass 32`, `fail 0`. Source: `SE` section 3; `review-code-pi.md` |
| P1 ruled against (2026-09-29) | The backend gates run under the label gate, so `--deem --out <dir>` below 40 labels still calls `cli-deem health`. The goal's criterion 2 and the design's proof plan run the gates on an unlabeled tree, and a gate check calls no model, so the gates stay where they are. Source: `SE` section 3 |
| Fix f1 (docs P1) | The catalog entry said a citation to a path outside the tracked files is refused. It now says an untracked file that exists on disk is refused and a citation that matches no tracked path counts as `unresolved`, it drops the labels-file source row, it takes `version: 2.2.0.0`, and it corrects the draw printing and refusal wording. Recheck `VERDICT: PASS`. Source: `SE` section 3; `recheck-ds.md` |
| Versions and ids read at doc time (ruling 2) | The newest changelog at build time was `v2.2.2.0.md`, so the phase wrote `changelog/v2.2.3.0.md` and set 2.2.3.0 in the five hub version fields, checked by `parent-skill-check.cjs` printing `OK`. The playbook's highest id was SD-020, so the scenario took SD-021 in a new `document-validation/` category. Source: `rulings.md` 2; `facts.txt`; `SE` section 1 |
| Labels file not committed (2026-09-29) | The session drew 40 rows with seed 20260929 into its scratchpad and committed no labels file, so the operator's first step is the draw (parent D4). The catalog leaf's Implementation table names only the script. Source: `SE` section 2; `notes.md` |
| P2 1: draw refusal breadth | The draw refusal keys on any non-null `labeler`, so a file holding only construction labels (every draw writes 20) blocks a second `--draw` with "operator labels present". The catalog entry now says so. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 2: request target | The request's `target` is the bare path, where REQ-009 names `path:line`. The citing sentence usually carries the line. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 3: verdict tests | Two verdict tests feed counts that cannot occur together, and nothing covers `stop (sign test)`, `stop (flips)` or disagreeing Jev reruns. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 4: skill line over-counts | `doc.split('/')[2]` counts every folder under `.skilled/skills/` as a skill, so a real run prints an all-zero `skill .state:` line. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 5: `--out` message | The no-`--out` message names both switches whichever one was given; the spec asks only for exit 2 before any call. Recorded, not chased (parent D5). Source: `SE` section 3 |
| P2 6: default run duration | The default run takes about 3 minutes, since it reads every tracked doc at its commit. Recorded, not chased (parent D5). Source: `SE` section 3 |
| No build-evidence.md | The build left no `scratch/w4-build/build-evidence.md`, so `SE` and its `notes.md` are the phase's build record. Source: `SE` header; this closure pass |
| Premise corrections at close | `spec.md`'s Status and description now say Complete, its handoff row records the gate stop, and its script, test, labels, changelog and playbook rows name what was built. `plan.md`'s roster states parent D5 as amended on 2026-09-29 and its step 7 records that no labels file is committed. `tasks.md`'s notation carries the closure record. Recorded by this closure pass |
| Live Jev run (2026-10-01) | The operator said yes in chat to a live run on the labels phase 042 wrote (operator-delegated, parent D4). Jev passed its check, so only the Jev arm ran (parent D1). `cite-drift-scan.mjs --jev --out ~/.skilled/.labels/runs/032-jev-20261001` at `fccdc47725eb`, exit 0: `planned calls: 121`, 121 lines in `calls.jsonl`, `column jev: rows=40 measured=40 unmeasured=0 latency_p50_ms=326 latency_p95_ms=423`, `brier jev: 0.1053`, `verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7 labels_sha256=2cbfddfc199d jev_version=0.6.2 provider=official model=jev-1.13.0`. Jev gets 35 of 40 rows right against identifier-overlap's 13. The output stays outside the repository because `calls.jsonl` holds doc text |
<!-- /ANCHOR:log -->
