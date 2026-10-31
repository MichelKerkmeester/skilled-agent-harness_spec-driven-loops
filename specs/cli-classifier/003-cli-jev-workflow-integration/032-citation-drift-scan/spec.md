---
title: "Feature Specification: Phase 32: citation-drift-scan"
description: "Test offline whether a Jev or Deem noul that asks if a cited file:line window still shows what the citing sentence claims finds drifted skill-doc citations better than a zero-call identifier-overlap check. A zero-call census and dead check print first, the operator labels 20 live citations beside 20 constructed drifts, and each backend column ends in keep, kill or stop under a rule fixed here. Built and closed at its label gate on 2026-09-29, commit `c5d3ced36f`."
trigger_phrases:
  - "citation drift scan"
  - "cite-drift-scan"
  - "skill doc citation drift"
  - "file:line citation check"
  - "citation drift keep rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 32: citation-drift-scan

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 32 of 35 |
| **Predecessor** | 031-debug-next-check |
| **Successor** | 033-validator-residue-flagger |
| **Handoff Criteria** | The zero-call run has printed the citation census, the dead count and `stop: fewer than 40 labeled rows`. After the operator's labels, each backend whose gate passed would print one `verdict <backend>:` line from a live `--out` run with its `calls.jsonl`; the 2026-09-29 final runs stopped at the label gate instead, so no verdict line exists and that branch waits on the operator. No labels file is committed (parent D4). The verdict lines would go in `goal.md`'s log for the parent goal's log |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 32** of the cli-jev workflow integration specification. It is one of the test phases 019 to 035 that turn each item the round-3 synthesis parked as `later` into a measured verdict, per the operator on 2026-09-29: "I want a phase per later item not yet planned or implemented so we can test everything". Its item is R24, the citation-drift advisory scan (`../007-classifier-deep-research/research/research.md:844-863`).

**Scope Boundary**: One new read-only advisory script in sk-doc's shared scripts, its Node test, one labels file and the sk-doc docs that parent goal D6 requires. It edits no validator (`validate_document.py`, `validate.sh`, `check-ac-coverage.sh`, `validate_catalog_package.py`) and no cited file, so every existing check and every doc reads as today.

**Dependencies**:
- Phase 008 (`008-cli-classifier-hub`) is Complete (`ee3a1b057c`). Its `cli-deem` client and `health` check serve the Deem arm only.
- Phase 009 (`009-cli-jev-hub-move`) is Complete (`ea883967d4`). The Jev transport's contract now lives at `.skilled/skills/cli-classifier/cli-usage/SKILL.md`, and the Jev arm needs the Python `jev-cli` 0.6.2 on `PATH` with a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise.
- For the Deem arm only: the local Deem server passing the check in `.skilled/skills/cli-classifier/cli-deem/SKILL.md:49-57`.
- The operator's labels on 20 live citations (the label gate, REQ-004). No model writes a label.
- Release. Released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Phases 019 to 035 built in number order, and disjoint builds ran in parallel.

**Deliverables**:
- `cite-drift-scan.mjs`, built at 1,707 lines, with the census, the dead check, the identifier-overlap comparator, a `--draw` mode that writes the unlabeled sample, the label gate, a `--jev` arm and a `--deem` arm
- `test-cite-drift-scan.mjs`, built at 989 lines and 32 cases, against fixture docs and stub `jev` and `cli-deem` binaries
- `cite-drift-labels.jsonl` (proposed) with 40 drawn rows and no text. `--draw --seed <n>` writes it, and the build committed none: parent D4 stops the phase at its label gate, so the draw is the operator's first step
- One zero-call report; a live report per backend whose gate passed needs the operator's labels and 40 winnable rows, in a directory the operator names
- The sk-doc docs parent goal D6 names, written through sk-doc: `SKILL.md` and its Hermes copy, `README.md`, `changelog/v2.2.3.0.md`, one feature-catalog entry in `document-validation` and one manual-testing-playbook entry (SD-021)

**Changelog**:
- The parent packet has no `../changelog/` folder, so there is no packet changelog to refresh at close. The skill changelog this phase writes is listed under Files to Change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill docs cite code as `file:line`, and agents follow those citations to decide what the code does. Nothing checks that a cited line still says what the citing sentence claims. Two neighbors check less: spec-kit's `AC_COVERAGE` resolves a `file:line` only inside a spec folder's acceptance criteria (`check-ac-coverage.sh:437`, `_ac_citation_resolves`), and the feature-catalog validator strips the line range and checks only that the path exists (`validate_catalog_package.py:494`, `:535`). The round-3 synthesis counted 500 citations in `.skilled/skills/**/*.md` by a path-aware pattern on 2026-09-27: 228 resolve in range, 4 point past the end of their file, 42 match more than one file by basename and 226 resolve nowhere (`research.md:478`). Drift inside a file, the right file with lines that no longer support the claim, needs a reader and is unmeasured (research question 50, `research.md:1173`).

The synthesis parked R24 as `later` for two reasons (`research.md:848`): no reader is named, and the dead share it counted is small, 4 of 232 resolvable citations. It also found the one property that makes R24 the cheapest later residue to measure: its labels can be manufactured by drifting a citation on purpose (`research.md:480`). This phase answers the "no reader" reason by staying offline and advisory, so no workflow depends on a reader before a verdict exists. It answers the "small share" reason by measuring drift, not dead lines, which the dead check already settles with zero calls.

### Purpose

Produce one verdict per backend column that settles whether a Jev or Deem `noul` finds drifted skill-doc citations better than a zero-call identifier-overlap check, under a keep rule fixed before the build, with a default run that makes zero model calls and prints the census and the dead count first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census of `file:line` citations in tracked `.skilled/skills/**/*.md`, fenced code skipped, resolved in the synthesis's order: the citing file's folder, the repository root, the skill root, then a unique basename (`research.md:478`). It prints per skill: citations, in range, past end, ambiguous and unresolved.
- A dead check with no model: a missing target or a line past the end of its file is `dead` and is never asked.
- A zero-call identifier-overlap comparator (REQ-005) beside flag-nothing, the state of every doc today.
- A `--draw` mode that writes 40 unlabeled rows with a recorded seed at a recorded commit: 20 live in-range citations for the operator and 20 constructed drifts labeled by construction (REQ-004).
- A Jev arm behind `--jev` and a Deem arm behind `--deem`, one `noul` per labeled row, each under its own gate, each with its own verdict column (REQ-006, REQ-007, REQ-010).
- Jev first, else Deem, per parent goal D1. With both switches set and both gates passing, both columns run, each with its own verdict. A failed gate never starts the other backend.
- A per-call `calls.jsonl` and a `report.json`, written to a directory the operator names.
- The sk-doc docs parent goal D6 requires (REQ-014).

### Out of Scope

- Any change to `validate_document.py`, `validate.sh`, `check-ac-coverage.sh` or `validate_catalog_package.py`, or any classifier inside them. Research row 97 keeps a validator's verdict a repository fact behind a frozen exit contract (`research.md:1047`). `validate_document.py` documents exits 0, 1 and 2 at `:18-21` and sets them at `:1691-1692`.
- A served or recurring form: a validator advisory line, a periodic report or a `--docs` or `--since` scope for changed docs. Each needs a named reader and a `keep` from this phase, and opening one is the operator's call.
- A 4-way verdict `choice`, folding drift into R20 or R22 or scanning every citation on every run (ruled out inside R24, `research.md:1079`).
- One `--cite-backend` flag. swe-06's single flag becomes two switches (research row 80, `research.md:1030`). No silent failover (row 81, `:1031`).
- A shared Jev or Deem client library. The script spawns `jev` and `cli-deem` as binaries (row 110, `:1060`).
- Editing any cited file or doc to fix a drift found here. Fixes go to each file's owner.
- Reading an untracked file, a `.env` file or anything outside `git ls-files`.
- A dollar figure in any cost line.

### Files to Change

Owner of every path below: `sk-doc`. The script sits beside `frontmatter-version.mjs`, the shared scripts' existing Node file, and its test beside `test-frontmatter-version.mjs`. Code follows sk-code's OpenCode route, and the docs go through sk-doc's modes (parent goal D6). Code comments carry no spec path, phase number or requirement id. Every name below is proposed.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Create | Census, resolution rule, dead check, identifier-overlap comparator, `--draw`, label gate, `--jev` and `--deem` arms and the per-column verdicts. Built at 1,707 lines (the plan estimated 400 to 500; swe-06 estimated 180 for the scan alone) |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Create | `node --test` cases on fixture docs with stub `jev` and `cli-deem` binaries. Built at 989 lines and 32 cases |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` | Create at draw time | 40 drawn rows, no text. `--draw --seed <n>` writes ids, hashes and constructed labels. The build committed no labels file (parent D4); the operator draws, then fills the 20 live labels |
| `.skilled/skills/sk-doc/shared/scripts/README.md` | Modify | One row for the script, naming the labels file as the default file `--draw` writes (design step 8 deviation) |
| `.skilled/skills/sk-doc/scripts/tests/README.md` | Modify | One row for the test file |
| `.skilled/skills/sk-doc/SKILL.md` and its Hermes copy `.hermes/skills/sk-doc/SKILL.md` | Modify and regenerate | One sentence naming the offline scan, its zero-call default and its two switches. The copy is regenerated with `sync-skills-hermes.cjs` |
| `.skilled/skills/sk-doc/README.md` | Modify | One line naming the script, its default and its switches |
| `.skilled/skills/sk-doc/changelog/v2.2.3.0.md` | Create | The next version after `v2.2.2.0`, through `sk-create-changelog`, with 2.2.3.0 set in the five hub version fields |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md` and `feature-catalog/feature-catalog.md` | Create and Modify | One entry (`version: 2.2.0.0`) and its index block, through `sk-create-feature-catalog` |
| `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md` and `manual-testing-playbook/manual-testing-playbook.md` | Create and Modify | Scenario SD-021, covering the zero-call run and a stub-backend skip, plus its index rows, through `sk-create-manual-testing-playbook`. The build chose `document-validation/` |
| `<operator-named report dir>/` | Create at run time | `report.json`, and `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **The default run makes zero model calls.** | Without `--jev` or `--deem`, the script prints the census, the dead count, the label-gate line or both comparators' accuracy with the headroom line, never spawns `jev` or `cli-deem` and writes no file. Stub `jev` and `cli-deem` binaries first on `PATH`, each logging one line per call, log nothing |
| REQ-002 | **The census counts citations the synthesis's way.** | The pattern matches `<path>.<ts\|cjs\|mjs\|js\|py\|md\|json\|sh>:<n>` and `:<n>-<m>` in prose outside fenced code. Each match resolves against the citing file's folder, the repository root, the skill root, then a unique basename, and only against `git ls-files`. The report prints per skill and in total: citations, in range, past end, ambiguous and unresolved, with the HEAD commit |
| REQ-003 | **Dead citations need no call, and nothing private is read.** | A resolved target that is missing, or a line past its end, is `dead`, is printed as `cite dead: <doc>:<line> -> <target>:<line>` and is never asked. A target outside `git ls-files`, or any basename starting `.env`, is never opened and is counted as `refused`. A citation that matches no tracked path and no file on disk counts as `unresolved`, not `refused` |
| REQ-004 | **The labels exist before any model verdict, and no model writes one.** | `--draw --seed <n>` writes `cite-drift-labels.jsonl` with 40 rows `{id, doc, doc_line, target, target_line, window_start, window_end, commit, claim_sha12, window_sha12, kind, verdict, labeler}` and no text. 20 rows are live in-range citations sampled across skills with `verdict` and `labeler` null. 20 rows are constructed from 20 other live citations: the window moves 60 lines down the same file, wrapping, never within 20 lines of the cited line, with `verdict` `contradicts` and `labeler` `construction`. Every row is read at its recorded `commit` with `git show`, so a later edit never moves a label. `--draw` refuses to overwrite a file that holds a non-null operator label. Until 40 rows carry a verdict, every run prints `stop: fewer than 40 labeled rows` and no arm calls, even with a switch set |
| REQ-005 | **Both comparators are scored on identical rows, and the better one is the baseline.** | Flag-nothing never flags. Identifier overlap flags a row as drifted when none of the citing sentence's code-shaped tokens, backticked spans split on non-identifier characters with the target's own basename removed, appears in the window from 10 lines above to 10 lines below the cited line. A sentence with no such token is not flagged. Labels map `supports` to clean and `partial` or `contradicts` to drifted. The baseline method is whichever comparator is right on more labeled rows, flag-nothing on a tie |
| REQ-006 | **The keep rule is fixed before any model run and applies per backend column.** | See the Keep Rule below. Changing it after the first model run is an amendment that voids every earlier verdict |
| REQ-007 | **The Deem arm is dormant unless `--deem` is set and the Deem check passes.** | With `--deem`, `cli-deem health` (on `PATH`, else the repo copy under `node`, as `score-track-narrowing.mjs:1076-1080` does) runs once within 2,000 ms and prints the backend, the model id and the commit pair. A failure prints one of `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with a details line naming the id found or `deem arm skipped: bad health response`, leaves the zero-call output and any Jev column byte-identical and exits 0. The script never starts the server and passes `cli-deem` no key |
| REQ-008 | **The Jev arm is dormant unless `--jev` is set and the Jev gate passes.** | With `--jev`, one identity line prints first: the resolved `jev` path and the provider P. Then `command -v jev` (else `jev arm skipped: jev not on PATH`), `jev --version` printing exactly `jev 0.6.2` (else `jev arm skipped: version` and a details line with the version found and the binary's path) and `jev auth status --provider P` exiting 0 (else `jev arm skipped: no credential`). Each skip leaves the zero-call output and any Deem column byte-identical and exits 0. The same `--provider P` goes to one `jev auth test --provider P` at the start of the arm and to every judgment |
| REQ-009 | **No key in any file, and the payload stays bounded.** | The script never reads, stores, logs or passes a key and holds no key literal or key variable name. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' cite-drift-scan.mjs` returns no match. A request carries only the fixed `-q` instruction and, on stdin, the citing sentence, the target `path:line` and the window lines, all from tracked committed files |
| REQ-010 | **The phase is read-only and offline.** | A default run and each model run leave `git status --porcelain` as it was, except a report directory the operator named inside the repository. No cited file, doc or validator changes. The build's changed paths are the Files to Change rows and this phase folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | **The call shape is fixed.** | Each labeled non-dead row gets `noul` with the one instruction `-q "Does the cited code window still show what the citing sentence claims?"`, printed verbatim with its SHA-256 before any call. The state is JSON `{sentence, target, window}` on stdin, closed after writing. The answer is the probability of yes. A row is flagged drifted when that probability is below 0.5, fixed here. Research C7 forbids choosing a threshold from the run it judges, and the served Deem reports temperature 1.0 (`deem-local.md:53`), so the report also prints the Brier score of each column and never lets it decide. Jev asks each row 3 times with no answer cache. Deem asks once, because a repeat returns the same answer (`deem-local.md:92`) |
| REQ-012 | **Every call and exit has one handling, and the operator sees the cost first.** | Before its first call the Deem arm prints "nothing leaves the machine", the planned calls and an estimated wall time at the `noul` p50 of 60.5 ms (`deem-local.md:38`). Before `jev auth test` the Jev arm prints the payload class (committed skill-doc sentences and tracked-file windows), the planned calls (3 per row plus 1) and the estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call with row id, rerun index, `wallMs`, `exitCode`, backend, probability, flag and a status of `measured`, `unmeasured` or `unmeasured_timeout`. Deem lines add `modelId`, `modelCommit` and `sourceCommit`. Jev lines add the `jev` version, provider and model, the last two from `jev auth test --provider P`. Exits follow 017's REQ-008 table (`../017-deem-search-narrowing-arm/spec.md:148`): Deem 1 or HTTP 400 `unmeasured`, 2 stops the arm, 3 `deem arm stopped: backend refused`, 4 one health recheck then `deem arm stopped: model commit changed mid-run` or `deem arm stopped: server gone`. Jev 1 or a malformed answer `unmeasured`, 2 stops the arm, 3 after the gate `jev arm stopped: key rejected`, 4 one backoff retry, a spawn past 90 s `unmeasured_timeout`. 130 stops either arm as `interrupted`. A stopped arm prints finished rows as `partial` and no verdict. `--jev` or `--deem` without `--out <dir>` exits 2 before any call |
| REQ-013 | **A keep holds only for what it was measured on.** | The report records the Deem commit pair or the Jev version, provider and model per column. A later run on a different Deem pair prints `requalify: model commit changed`, and one on a different Jev provider or model prints `requalify: model changed`, before its verdict |
| REQ-014 | **Tests cover every public surface, and the changed skill's docs stay true to the code (parent goal D6).** | `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` exits 0 with at least 18 cases, a happy path and one edge case each: extraction and fenced-code skip, resolution and an ambiguous basename, dead check and a line past the end, refusal of an untracked or `.env` target, the comparator's flag and its no-token case, `--draw` reproducibility and its refusal to overwrite labels, the label gate at 39 rows, the default run's zero stub calls, the Deem gate pass and stub-backend skip, the Jev gate pass and `no credential` skip, `--out` required, one `--provider` on every stub `jev` call, Deem exit 4 with a changed pair, Jev exit 3 after the gate and the verdicts `keep`, `kill (precision)`, `stop (coverage)` with 2 of 10 rows unmeasured and `stop (margin)`, plus a `requalify` line. sk-doc's `SKILL.md`, `README.md`, one changelog file, one catalog entry and one playbook entry each name the script, its zero-call default and both switches, and `validate_document.py` exits 0 on each. No doc names a verdict the runs did not print |

### Keep Rule (fixed 2026-09-29, before any model run)

Inputs, per backend column. K counts labeled non-dead rows. M counts the rows that backend measured: every call returned a probability after REQ-012's handling. On a measured row the backend's flag is its modal flag over its calls. A counts measured rows the backend gets right and B the measured rows the baseline method gets right (REQ-005). W counts rows only the backend gets right and L rows only the baseline gets right. TP and FP count the backend's drifted flags that are and are not labeled drifted. F sums each Jev row's non-modal flags, 3 minus the count of its most common flag.

The script checks five conditions in this order and prints the first that fails.

1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Precision, the synthesis's kill line (`research.md:857`): TP+FP at least 1 and `5*TP >= 4*(TP+FP)`, a precision of at least 0.8, else `kill (precision)`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points over the baseline method, else `stop (margin)`.
4. Sign test: the exact one-sided binomial p of W or more successes in W+L fair trials is below 0.05, with p 1 when W+L is 0, else `stop (sign test)`.
5. Stability: for Jev, `10*F <= 3*M`, a flip rate of at most 0.10 over 3 reruns, else `stop (flips)`. A Deem `noul` has no option order to permute and repeats itself exactly, so its stability is its commit pair, as 006 set for its Deem arm (`../006-goal-criteria-lint/spec.md:166`), and the report prints `flips: not applicable (deem noul)`.

All five passing prints `verdict <backend>: keep`. Counts stay integers and p is exact. Before any call the script prints `margin: 0.10` and one `keep rule:` line naming all five thresholds. When the baseline method is right on more than 90 percent of the K rows, a 10-point gain cannot fit, so the zero-call run prints `no headroom` and neither arm calls. When fewer than 5 rows are ones the baseline gets wrong, the sign test cannot reach 0.05, because 0.5 to the fourth power is 0.0625, so it prints `underpowered` and neither arm calls. The verdict line prints on stdout and in that column of `report.json` with K, M, A, B, W, L, TP, FP, F, p and what the column was measured on (REQ-013). The synthesis's second kill clause, no reader acting on a report within a month of its first run (`research.md:857`), needs a served report, so it binds the later phase that would serve one. A stub, fake-server or test keep never counts. This phase is offline only: serving or wiring a pick needs a later phase and a `keep`, and opening it is the operator's call.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any model call and before any label, the operator reads how many skill-doc citations exist, how many are dead and how the sample is drawn.
- **SC-002**: After the labels, one live run per available backend prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` with a per-call record, so R24 is settled on a counted number. Jev runs first, else Deem.
- **SC-003**: A run with neither switch, or with every requested gate failing, changes nothing and calls nothing.

### Proof Plan

1. `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` with stub `jev` and `cli-deem` first on `PATH` exits 0, prints `citations=` and `dead=` lines and `stop: fewer than 40 labeled rows`, and both stub logs stay empty. Boundary: a stub log line fails REQ-001.
2. The same with `--deem --out <tmp>` and a stub health reporting backend `stub` prints `deem arm skipped: stub backend`, and with `--jev --out <tmp>` and a stub whose `auth status --provider official` exits 3 prints the identity line then `jev arm skipped: no credential`. `diff` against run 1 shows only those lines.
3. `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` exits 0 with at least 18 passed and 0 failed.
4. After the operator's labels: one `--jev --out <dir>` run when the Jev gate passes and one `--deem --out <dir>` run when the Deem gate passes. Each prints one verdict line, and every `calls.jsonl` line holds `wallMs` and `exitCode`, with `modelCommit` and `sourceCommit` on Deem lines and `provider` and `model` on Jev lines.
5. `git status --porcelain` is the same before and after each run, and the key grep of REQ-009 returns no match.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's 20 live labels | No verdict can print | The build stops at the label gate with the drawn file and the gate line, the way 003 and 006 closed. About 40 minutes at mimo-08's 2 minutes a row (estimate) |
| Dependency | Phase 008's `cli-deem` and a served Deem | The Deem arm cannot run | The arm prints its skip line. The operator runs `deem-ctl`, never the script |
| Dependency | `jev` 0.6.2 and a credential for provider P | The Jev arm cannot run | The arm prints its skip line |
| Risk | Live drift is rare, and swe-06 said it could be near zero | Med. The sample could hold few live positives | The 20 constructed rows guarantee positives. The census and the live labels report the live share, so a keep states the prevalence it was measured at |
| Risk | A constructed window still supports its claim, because the same identifier repeats in the file | Med. A wrong construction label | The operator may relabel any constructed row at the gate, and the report counts relabeled rows |
| Risk | Deem's only measured `noul` so far carried close to no signal: R21's calibration printed F1 0.4432 against 0.9843 and a fitted temperature at the top of its grid (`../002-advisor-jev-tiebreak-arm/implementation-summary.md:104`, `:107`) | Med | The keep rule can fail, and a `kill` or `stop` is a result this phase exists to record |
| Risk | Precision on a sample with 20 constructed positives overstates live precision | Med | The report prints the sample's prevalence beside the census's live counts. A served form must remeasure at live prevalence |
| Risk | Counts moved between lineages: 456, then 403 by swe-06's own pattern, then 500 path-aware (K10, `research.md:114`) | Low | The census prints today's counts with the HEAD commit and never reuses a research number |
| Risk | Citing sentences and windows leave the machine on the Jev arm | Low. Committed skill docs and tracked files, in a public repository (parent goal log, "Conflict: 002 corpus privacy against D7") | Tracked files only, `.env` refused, payload line first (REQ-003, REQ-009, REQ-012). None of it is the operator's private text, so 003's payload-acceptance gate (D9, `../003-goal-verifier-jev-shadow/goal.md:64`) does not bind this offline run. A served form over private text would need that gate, with Deem running when it is not accepted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Who reads a drift report? The synthesis promotes R24 when sk-doc's owner names the reader, a validator advisory line or a periodic report (`research.md:863`). This phase measures without one. A `keep` here is the evidence that question needs, and the answer is the operator's.
- Is the 60-line wrapping offset a fair construction? It is fixed here so the build cannot tune it. Changing it is an amendment before the draw.
- Is the 10-line window right for the identifier-overlap comparator? The same rule holds: fixed here, amended only before the first model run.
- Should a later recurring form scan only changed docs (`--docs` or `--since`, swe-06's recurring path)? Out of scope until a `keep` exists.
<!-- /ANCHOR:questions -->

---
