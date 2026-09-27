---
title: "Feature Specification: Phase 17: deem-search-narrowing-arm"
description: "Measure offline whether one classifier choice that picks a spec track, before ripgrep or the trigger-index lookup searches inside it, beats both zero-call searches at naming the right track. A zero-call default run prints the baseline first. A Deem arm (preferred) and a Jev arm each run only behind their own switch and checks, and each is kept only if it beats that baseline by a margin fixed here."
trigger_phrases:
  - "deem search narrowing arm"
  - "deem spec track narrowing"
  - "jev spec track narrowing"
  - "score-track-narrowing"
  - "track-level retrieval baseline"
  - "narrowing not reranking"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: deem-search-narrowing-arm

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-27 |
| **Amended** | 2026-09-27, a Jev arm added beside the Deem arm, per parent goal D1 (two backends) |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-deem-local-hardening |
| **Successor** | None |
| **Handoff Criteria** | The zero-call run has printed the test-set counts, both baselines' track accuracy on identical rows and either `no headroom` or the planned calls. Then a `--deem` run has printed `verdict deem: keep` or `verdict deem: stop (<reason>)` with a `calls.jsonl` holding the commit pair on every Deem line, or its `deem arm skipped:` line. A `--jev` run, when the operator asks for one, prints its own `verdict jev:` line or `jev arm skipped:` line. Nothing downstream consumes a verdict inside this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the Owner fixes and follow-ups found during the classifier research specification.

**Scope Boundary**: One new read-only measurement script beside the trigger-index lookup, its vitest file and one README row. It changes no lookup, generator, ripgrep recipe, index, hook or Gate 1 text, so every live search behaves as today by construction.

**Dependencies**:
- Phase 010 (`010-trigger-index-search-fixes`): a regenerated trigger index with no missing documents. The lookup baseline is only fair on a fresh index.
- Phase 008 (`008-cli-classifier-hub`): the proposed `cli-deem` client and its `health` check. The zero-call run and the Jev arm need neither, and the Deem arm is built only after 008 lands.
- For the Deem arm only: the local Deem server passing the Deem check.
- For the Jev arm only: the Python `jev-cli` 0.6.2 on `PATH` and a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise, as phase 002's gate says.

**Deliverables**:
- `score-track-narrowing.mjs` (proposed) with the zero-call baseline, a `--deem` arm and a `--jev` arm (proposed switches)
- `tests/score-track-narrowing.vitest.ts` (proposed) against a fixture corpus and stub `cli-deem` and `jev` binaries
- One zero-call report and, when the baseline leaves headroom, one `--deem` report with its `calls.jsonl`, plus a `--jev` report when the operator passes `--jev`, in a directory the operator names

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The committed trigger-index lookup finds exact wording and little else. The captured probes in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json` score a hit on 16 of 20 Latin exact queries, 1 of 20 Latin paraphrases (only "check the quality gates") and 0 of 20 distractors. CJK scores 0 of 20 in all three variants, and stemming scores 4 of 5 (re-counted from the fixture by this leaf on 2026-09-27). The fixture is marked "boundary evidence only; never a lexical pass criterion", so these counts describe the gap and are not a pass bar. Deem and Jev judge among options. They do not retrieve or write text, so they cannot rerank a paraphrase that returns no candidate.

The research dropped reranking the lookup for "no counted misrank" (`../007-classifier-deep-research/research/research.md:1038`, row 88, and `:449`). This phase is narrowing, not reranking: one `choice` picks which of the 16 spec tracks under `specs/` a question is about, and the existing search then runs inside that track. The paraphrase gap above is now counted, which row 88 lacked. The skill advisor already routes questions to the 15 skill hubs, so the new part is spec tracks.

### Purpose
Produce one track-level number per backend that settles whether a Deem or Jev pick of the spec track beats ripgrep and the trigger-index lookup at naming the right track, under a keep rule fixed before the build, with a zero-call run that prints the baseline first and changes nothing for anyone who passes neither `--deem` nor `--jev`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A test set at no labeling cost. Each live packet's `description.json` description is a question and its track, the first path segment under `specs/`, is the answer. Placeholder descriptions and descriptions that name a track or hub are dropped (REQ-002).
- Two zero-call baselines scored at track level on identical rows: ripgrep on the question's own words and the trigger-index lookup (REQ-003). The better of the two is the baseline.
- A headroom line and the planned call count, printed before any model call.
- A Deem arm behind `--deem` and a Jev arm behind `--jev`. Each asks one `choice` per question per option order over the 16 tracks plus `none`, in three option orders, under a pre-registered keep rule applied to its own column (REQ-004, REQ-007, REQ-012).
- Deem is preferred. The plan's live run is `--deem`. Jev runs only when the operator passes `--jev`, for example when Deem is not available. With both switches set and both checks passing, both columns run, each with its own verdict.
- A secondary line for the 20 Latin paraphrase probes, reported for every method and never deciding a verdict (REQ-010).
- A per-call JSONL, shared by both arms, and a report written to a directory the operator names.

### Out of Scope
- Reranking lookup candidates. Row 88 dropped it, and this phase does not reopen it.
- Any hook, Gate 1 change or served narrowing. The phase is offline only. Serving a pick needs a later phase and a `keep`.
- Failover between backends. A failed check prints its skip line and never starts the other arm (research row 81).
- Sending anything to Jev beyond the question text and the 17 option keys and track descriptions. No file contents and no path appear in a Jev request unless the question itself holds one.
- Narrowing over skill hubs. The skill advisor already routes to skills.
- Document-level recall inside the picked track. The lookup's `--spec-folder` scope and a `specs/<track>` ripgrep root already exist (`lookup-trigger-index.mjs:104-108`, `:176`, `rg-wrapper.mjs:210`). Measuring the second step waits on a `keep`.
- Editing `lookup-trigger-index.mjs`, `generate-trigger-index.mjs`, `lib/`, `rg-wrapper.mjs`, the committed index or its fixtures. Phase 010 owns index freshness and the lookup's miss shape.
- Starting, stopping or reconfiguring the Deem server, or raising `DEEM_N_ORDERS`. The operator runs `deem-ctl`, and phase 016 owns server hardening.
- A shared Deem or Jev client library, or a global backend switch. The script spawns `cli-deem` and `jev` as binaries, as the shared gate contract says.
- The npm `jevctl` package. It also installs a `jev` binary, and the version check skips it.
- A dollar figure in any cost line.

### Files to Change

Owner of every path below: `system-spec-kit`, its `runtime/cli/retrieval/` package. The build follows that owner's contracts: the retrieval `README.md`, the `lib/` primitives it reuses rather than copies, the `cli` vitest project in `.skilled/skills/system-spec-kit/vitest.config.ts` and the repository's code standards through `sk-code`. Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Create | Test-set builder, both baselines, headroom line, the `--deem` and `--jev` arms and the per-column verdicts. Proposed name. About 450 to 550 LOC (estimate) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Create | Fixture-corpus, stub-`cli-deem` and stub-`jev` cases. The `cli` vitest project includes only `tests/**/*.vitest.ts` under `runtime/cli` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | One script row, one tree line, and a note that the script reads the probe queries of `semantic-probes.json`, which `:78` lists as having no runtime reader |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Read only | The fresh index from phase 010 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json` | Read only | The 20 Latin paraphrase probes and their exact trigger phrases |
| `specs/*/description.json` and `specs/**/description.json` | Read only | Track option descriptions and packet questions |
| `<operator-named report dir>/` | Create at run time | `report.json`, and `calls.jsonl` from a run with a model arm |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **The default run makes zero model calls.** Without `--deem` or `--jev`, the script prints the test-set counts per track, both baselines' track accuracy on identical rows, the paraphrase-probe line and the headroom line, never spawns `cli-deem` or `jev` and writes no file. Stub `cli-deem` and `jev` binaries first on `PATH`, each logging one line per call, log nothing |
| REQ-002 | **The test set keeps track names out of the questions and the answer out of the search.** Questions are the descriptions of live packet folders under `specs/`, skipping `z_archive`, `scratch`, `research` and `context` trees and each track's own root. A description is dropped as a placeholder when it is empty, starts with `[`, starts with `Phase <n>:`, equals the folder slug or has fewer than 5 tokens. It is dropped as a leak when its normalized text contains any multi-word track slug or skill hub name as a phrase, for example `sk design` or `cli jev`. Each track keeps at most 20 rows, the first 20 by SHA-256 of the folder path. The report prints kept, placeholder and leak counts per track, plus a residual-exposure count of kept rows that contain their own track's last slug segment as a token. Both baselines ignore every candidate path inside the question's own folder or its descendants, so a question never finds its own `spec.md` |
| REQ-003 | **Both baselines are scored at track level on identical rows.** Lookup: `lookup()` from `lookup-trigger-index.mjs` with limit 0 on the committed index. The pick is the track of the first row in the lookup's own order that has a score above 0 and a path under `specs/`. Ripgrep: the question's distinct normalized tokens of 3 or more characters, each run through the path-only recipe of `lib/rg-lane.mjs` over the `specs` root. Each file scores the number of distinct tokens it matches. The pick is the track of the top file, ties going to the track with the most files at that score, then to track name order. No scoring candidate is an abstention and counts as a miss. The better of the two accuracies is the baseline. The report prints the index `manifestHash` |
| REQ-004 | **The keep rule and margin are fixed before the build, and apply per backend column.** `verdict <backend>: keep` needs all three on the rows that backend measured: its top-1 track accuracy at least 10 percentage points above the baseline on the same rows, an exact one-sided sign test over discordant rows at p below 0.05 and a flip rate across its three calls per row of at most 0.10. Otherwise the script prints `verdict <backend>: stop (margin)`, `stop (sign test)` or `stop (flips)`, naming the first condition that failed. A baseline above 0.90 makes a 10-point gain impossible, so the zero-call run prints `no headroom` and neither arm makes a call. The margin prints as a constant before any call |
| REQ-005 | **The Deem arm is dormant unless `--deem` is set and the Deem check passes.** With `--deem`, `cli-deem health` applies the pinned check within 2,000 ms: HTTP 200, `status` `ok`, model `deem-0.8-v1` and a `torch` or `ensemble:` backend with no `stub`. It prints the backend, the model id and the commit pair. Failures print `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with a details line naming the id found, or `deem arm skipped: bad health response`. Each skip leaves the zero-call output and any Jev column byte-identical and exits 0. The script never starts the server and passes `cli-deem` no key |
| REQ-006 | **The phase is read-only and offline.** After a default run and each model run, `git status --porcelain` lists only the new script, its vitest file, the README and, if the operator named one inside the repository, the report directory. The index, its fixtures, the lookup, the generator, `lib/`, every hook and `AGENTS.md` are unchanged |
| REQ-012 | **The Jev arm is dormant unless `--jev` is set and phase 002's Jev gate passes.** With `--jev`, one identity line prints first: the resolved `jev` path and the provider P, `JEV_PROVIDER` when set and `official` otherwise. Then check 1, `command -v jev`, failing prints `jev arm skipped: jev not on PATH`. Check 2, `jev --version` printing exactly `jev 0.6.2`, failing prints `jev arm skipped: version` and one details line with the version found and the binary's path. Check 3, `jev auth status --provider P` exiting 0, failing prints `jev arm skipped: no credential`. Each skip leaves the zero-call output and any Deem column byte-identical and exits 0. The same `--provider P` goes to check 3, to one `jev auth test --provider P` at the start of the arm and to every judgment |
| REQ-013 | **No key in any file, and nothing extra leaves the machine.** The script never reads, stores, logs or passes a key and holds no key literal or key variable name. `jev` resolves its own key, and `cli-deem` takes none. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' score-track-narrowing.mjs` returns no match, and no spawned argument list carries a key. A Jev request carries only the question text on stdin and the 17 option keys and track descriptions as `-o` pairs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | **The call shape is fixed and shared.** Each question goes to `cli-deem choice` or `jev choice --provider P` on stdin, closed after writing, with 17 options: the 16 tracks plus `none`. That is under Deem's cap of 26 (`deem_server.py:166`). `jev-cli` sets no option cap of its own (`jev_cli/__init__.py:352`, `:378`), and the service's cap is UNKNOWN, so a rejection surfaces as exit 1 and an `unmeasured` row. Each track option's description is that track's root `description.json` description, verbatim, and the report prints one SHA-256 over the option set. Both arms use the same three option orders: the tracks in name order with `none` last, then that list rotated left by one, then by two. Each order is a fresh call with no answer cache, so for Jev the three orders are also its three reruns. The modal pick over the three is the row's pick. Three different picks make the row `unstable`, and `none` is an abstention. Both count as misses. The flip rate is non-modal picks over all measured calls |
| REQ-008 | **Every call and exit has one handling, and the operator sees the cost first.** Before its first call the Deem arm prints "nothing leaves the machine", its planned calls (rows times 3) and an estimated wall time at 65.6 ms per call, labeled as the 2-option p50 from `deem-local.md`. Before `jev auth test` the Jev arm prints the payload class (committed packet descriptions, fixture probe text and track descriptions), its planned calls (rows times 3, plus 1) and the estimated input tokens, never a dollar figure. One `calls.jsonl` holds one line per call from either arm with row id, order index, wall time in ms, exit code, backend, the picked key, its probability, the `none` probability and a status of `measured`, `unmeasured` or `unmeasured_timeout`. Deem lines add model id, model commit and source commit. Jev lines add the `jev` version, provider and model, the last two from `jev auth test --provider P`. Deem exits: 1 or HTTP 400 marks the row `unmeasured`, 2 stops the arm, 3 prints `deem arm stopped: backend refused`, 4 rechecks health once (a changed pair prints `deem arm stopped: model commit changed mid-run`, a gone server prints `deem arm stopped: server gone`, a passing recheck retries the row once) and 130 stops the arm as `interrupted`. Jev exits: 1, unparseable stdout or a key outside the submitted set marks the row `unmeasured`, 2 stops the arm, 3 after the gate prints `jev arm stopped: key rejected`, 4 gets one backoff retry then `unmeasured`, a spawn past 90 s is killed and marked `unmeasured_timeout` and 130 stops the arm as `interrupted`. A stopped arm prints finished rows as `partial`. Unmeasured rows leave that column and are counted. The report prints p50 and p95 per column. `--deem` or `--jev` without `--out <dir>` exits 2 before any call |
| REQ-009 | **A keep holds only for what it was measured on.** The report records, per column, the Deem commit pair or the Jev `jev` version, provider and model. A later run on a different Deem pair prints `requalify: model commit changed`, and one on a different Jev provider or model prints `requalify: model changed`, before its own verdict |
| REQ-010 | **The paraphrase probes are reported, never decisive.** For each of the 20 Latin paraphrase rows in `semantic-probes.json`, the gold is the set of tracks holding a scoring `specs/` row for the matching exact query on the fresh index. Probes with an empty gold set are counted and skipped. The line prints hits for the lookup, ripgrep and each model column that ran, where a pick inside the gold set is a hit |
| REQ-011 | **Tests cover every changed surface.** `score-track-narrowing.vitest.ts` exits 0 with a happy path and one edge case each: the test set builds stratified rows and drops a leaking description, the lookup baseline picks a track and ignores the question's own folder, the ripgrep baseline picks the track of the file matching the most distinct tokens, the default run logs no stub call and prints `no headroom` on a saturated fixture, the Deem gate passes a fake health and a stub backend skips with byte-identical output, the Jev gate passes a stub whose `auth status --provider P` exits 0 and prints `jev arm skipped: no credential` when it exits 3, and the verdict prints `keep` on stub answers and `stop (margin)` on a small gain. Also: a Deem exit 4 whose recheck shows a new pair prints `deem arm stopped: model commit changed mid-run`, a stored pair that differs prints `requalify: model commit changed`, a Jev exit 3 after the gate prints `jev arm stopped: key rejected`, and in a stub run that passes the Jev gate every logged `jev` call carries the same `--provider` value. That is at least 17 cases |

### Amendment Trace (2026-09-27)

Source: parent goal D1, "Two backends: every feature runs on Jev or Deem, dormant unless one is available", relayed by the coordinator. A Deem-only plan left the feature dormant when Jev was available and Deem was not. IDs were kept and REQ-012 and REQ-013 were added.

| ID | Deem-only wording | Now |
|----|-------------------|-----|
| REQ-001 | Without `--deem` | Without `--deem` or `--jev` |
| REQ-004 | One verdict, order-flip rate | One verdict per backend column, flip rate across the three calls |
| REQ-005 | Never fails over to Jev | Leaves any Jev column byte-identical. Failover is out of scope |
| REQ-007 | `cli-deem choice` only | The same 17 options and three orders for both, which double as Jev's three reruns |
| REQ-008 | Deem notice, records and exits | Adds the Jev payload notice, Jev record fields and phase 002's Jev exit handling |
| REQ-009 | Commit pair | Adds the Jev version, provider and model |
| REQ-010 | Deem under `--deem` | Each model column that ran |
| REQ-011 | 13 cases | 17 cases, adding the Jev gate, key-rejected and provider-consistency cases |
| REQ-012 | New | Phase 002's Jev gate |
| REQ-013 | Part of NFR-S01 | No key in any file, and a Jev request carries only the question and the options |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any model call, the operator reads how many clean questions each track has, how often ripgrep and the lookup name the right track and whether a 10-point gain is reachable.
- **SC-002**: One `--deem` run prints `verdict deem: keep` or `verdict deem: stop (<reason>)`, with the commit pair and a per-call record, so the narrowing idea is settled on a counted number. A `--jev` run, when the operator asks for one, gives the same for Jev.
- **SC-003**: A run with neither switch, or with every requested check failing, changes nothing and calls nothing. A machine with only Jev available can still run the measurement with `--jev`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 010's fresh index | A stale index weakens the lookup baseline and flatters the model arms | The build confirms freshness first (plan step 1) and the report prints the index `manifestHash`. Main already carries three index rebuilds from 2026-09-27 (`eaa02a56f5`, `04193b88d7`, `dd0933eeff`) that this branch lacks, so a merge reruns the zero-call baseline |
| Dependency | Phase 008's `cli-deem` | The Deem arm cannot be built or run before it lands | The zero-call run and the Jev arm do not wait on it. Tests use a stub `cli-deem` |
| Dependency | The served Deem instance, or a Jev credential for provider P | That backend's arm cannot run | Each arm prints its skip line. The operator runs `deem-ctl start` or sets a key, never the script |
| Risk | Track sizes are uneven: `system-speckit` holds about 1,109 live packets and `cli-orca` 2 (counted by this leaf, rough filter) | Med | At most 20 rows per track. Small tracks keep all their rows and the report prints per-track counts |
| Risk | Descriptions leak the track name | Med | The leak filter drops multi-word slugs and hub names, about 187 of 1,968 live descriptions (rough count). The residual-exposure count shows what single tokens remain |
| Risk | Lexical baselines find the question's own packet | High without the rule | Own-folder exclusion (REQ-002) |
| Risk | Some track descriptions are thin, for example `system-skill-advisor`'s "This track owns the skill-advisor subsystem's specs" | Med | Descriptions are used verbatim and hashed, so the number measures the zero-authoring setup. Rewriting them to suit the test is out of scope |
| Risk | A 17-option request with long descriptions is slower than the measured 2-option Deem p50 | Low | Each arm reports its own p50 and p95. The Deem estimate is labeled as a 2-option figure |
| Risk | Question text leaves the machine on the Jev arm | Low. The questions are committed packet descriptions and fixture probes, authored in this repository | The Jev arm runs only on the operator's `--jev`, prints its payload class first and sends nothing but the question and the options (REQ-013) |
| Risk | The Jev service rejects 17 options | Low. Its cap is UNKNOWN | A rejection is exit 1 and an `unmeasured` row, counted in the report, never a pick |
| Risk | A Deem update or a Jev model change lands mid-run or between runs | Low | Deem's exit 4 recheck stops the arm with finished rows `partial`. A keep holds only for what it was measured on (REQ-009) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The zero-call run finishes in one sitting on this Mac and prints its wall time. The ripgrep baseline caches each token's result across questions, and its total cost is UNKNOWN until the build measures it.
- **NFR-P02**: Each arm sends one request at a time. For Deem, about 777 calls at 65.6 ms is about 51 s (2-option estimate). Jev latency is UNKNOWN until its arm runs.

### Security
- **NFR-S01**: No key is read, logged or passed (REQ-013). `cli-deem` takes none and `jev` resolves its own.
- **NFR-S02**: Egress is low and bounded. Deem sends nothing off the machine. The Jev arm sends committed packet descriptions or fixture probe text as the question, plus the 17 option keys and committed track descriptions, and nothing else: no file contents and no path outside the question text.

### Reliability
- **NFR-R01**: The zero-call output is deterministic: the same index and tree give byte-identical output, with no seed.
- **NFR-R02**: No path writes a default pick, score or verdict. A missing answer is `unmeasured`, never `none`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a track with no clean question keeps its option and prints 0 rows. It cannot win or lose a row.
- Maximum length: 17 options sit under Deem's 26-option cap. Past 25 tracks plus `none`, the script exits 2 before any call.
- Invalid format: an unreadable `description.json` is skipped and counted as a placeholder.

### Error Scenarios
- External service failure: a check fails and that arm prints its skip line with the census and the other column unchanged.
- Network timeout: `cli-deem` exits 4 and the arm rechecks once. `jev` exits 4 and gets one backoff retry, and a hang is killed at 90 s.
- Wrong `jev`: the npm `jevctl` also installs a `jev` binary that prints a bare version. Check 2 skips it before any exit code is read.
- Bad key: check 3 tests presence, not validity, so a rejected key surfaces as exit 3 on `jev auth test` or the first judgment and prints `jev arm stopped: key rejected`.
- Concurrent access: another caller's batch delays Deem calls behind the server lock. The report prints what it measured, never a corrected figure.

### State Transitions
- Partial completion: a stopped arm prints finished rows as `partial` and no verdict for its column.
- Session expiry: not applicable. The run holds no session state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two new files and one README edit, about 450 to 550 LOC plus tests (estimate) |
| Risk | 7/25 | Offline and read-only. The Jev arm adds a keyed external call behind its own switch |
| Research | 8/20 | Leak rules, baseline definitions and the margin are fixed here. Runtime cost is measured at build |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Is the 10-point margin right? It is fixed here so the build cannot tune it. Changing it is an amendment to this spec before the first model run.
- Does the residual-exposure count stay small? Brand tokens such as `jev` or `orca` can remain after the phrase filter. The zero-call run prints the count, and a large one argues for masking those tokens in a later amendment.
- Does the Jev service accept 17 options? `jev-cli` sets no cap, and the service's cap is UNKNOWN. The first `--jev` run answers it.
<!-- /ANCHOR:questions -->

---
