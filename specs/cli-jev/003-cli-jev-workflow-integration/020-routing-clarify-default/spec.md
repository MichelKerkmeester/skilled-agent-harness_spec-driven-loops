---
title: "Feature Specification: Phase 20: routing-clarify-default"
description: "Test research R12 offline: whether a Jev or Deem choice picks the right default among a compiled hub router's clarify alternatives more often than the first alternative the router lists. R12 waited on gold, since the canary fixtures hold 3 clarify rows and none names a right answer. A zero-call census counts clarify outcomes over committed prompts and writes unlabeled rows, and the phase stops at a 30-row label gate. Built and closed at that label gate on 2026-09-29, commit 65c71719ac."
trigger_phrases:
  - "routing clarify default"
  - "clarify suggested default"
  - "score-clarify-default"
  - "compiled routing clarify census"
  - "r12 clarify gold"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 20: routing-clarify-default

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
| **Phase** | 20 of 35 |
| **Predecessor** | 019-advisor-suggested-order |
| **Successor** | 021-stage2-leaf-route-replay |
| **Handoff Criteria** | The zero-call census has printed clarify counts per hub and per source and written the unlabeled rows. The phase then closes at its label gate: the scorer prints `stop: fewer than 30 labeled rows` on the unlabeled file and its keep rule is proven on synthetic labels. Past the gate, outside this phase's completion, each model run the operator asks for prints `verdict jev:` or `verdict deem:` with `keep`, `kill` or `stop (<reason>)`. A `keep` serves nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the cli-jev workflow integration specification. It tests research R12, a suggested default on a compiled-routing `clarify`. The sources are `../007-classifier-deep-research/research/research.md` section 12 (the R12 row of the carried table, open question 10 and What Not To Build rows 19 and 84) and the full record in `../001-deep-research/research/research.md` section 11 (`### R12.`). On 2026-09-29 the operator asked for one phase per later item "so we can test everything".

**Scope Boundary**: One new read-only script beside sk-doc's compiled-routing scenario validator, its test and the docs parent D6 requires. It loads each hub's compiled engine read-only, never edits a router, a canary fixture, a playbook or the front door, and serves nothing.

**Dependencies**:
- The compiled routing runtime at `.skilled/bin/lib/compiled-routing/`, read only, and sk-doc's `validate-compiled-routing-scenarios.cjs` exports, imported read only.
- Phase 008 (`008-cli-classifier-hub`), Complete, for `cli-deem` on the Deem arm only.
- The operator's labels past the gate. This phase closes at the label gate, as 003 and 006 did under parent D4, and no model writes a label.
- Release: released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 021 also changes `sk-create-skill`'s `SKILL.md`, README and changelog, so the two builds share paths and run one after the other.
- Build roles: parent D5 (`plan.md` section 4). Skill docs: parent D6.

**Deliverables**:
- `score-clarify-default.cjs` (proposed) with the zero-call census, the unlabeled-row writer, the scorer, the label gate, a `--jev` arm and a `--deem` arm (proposed switches)
- `tests/score-clarify-default.test.cjs` (proposed) with synthetic hubs, synthetic labels and stub backends
- One census report and one unlabeled rows file in directories the operator names
- The sk-doc docs of section 3, written through sk-doc

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When a compiled hub router finds near-tied modes it answers `clarify` with a short list of alternatives and suggests no default. In `cli-external-orchestration` the router sorts the tied modes by tie-break index, keeps at most four entries with `none_of_these` last, and asks "Which external CLI executor should handle this dispatch?" (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:62-72`, `:199-218`). `cli-classifier` has the same block at the same lines, asking "Which classifier transport should resolve this request?" (`008-cli-classifier/lib/router.cjs:62-72`). `sk-doc` does the same at `007-sk-doc/lib/router.cjs:149-166`, called at `:220`, `:230` and `:256`, and `sk-design` at `009-sk-design/lib/canary-router.cjs:154-170`, called at `:290` and `:300`. `system-deep-loop`'s clarify lists two checklist sentences, not modes (`002-system-deep-loop/lib/canary-router.cjs:202-213`). `mcp-tooling` never clarifies (`003-mcp-tooling/lib/router.cjs:107-112`), and `sk-code`'s router has no clarify branch.

R12 would suggest one alternative as the default. The research parked it as later for one reason: no gold. Recounted on 2026-09-29, the seven hubs' canary fixtures hold 86 cases with 3 `clarify` and 11 `defer` expectations, and all 3 clarify rows carry `expectedIntents` of `defer` or `unknown`, never a right alternative. No record says how often clarify happens in real use (research question 10): the front door prints one JSON line and persists nothing (`.skilled/bin/compiled-route.cjs:25-51`). A served default also has no seam today, because `compiledRoute` returns only action, selection kind, targets and identity and drops the alternatives (`014-runtime-engine/lib/compiled-route.cjs:96-108`).

Two committed sources can supply gold with no labeling: hub playbook scenarios carry an `expected_workflow_mode`, 83 files across the seven hubs with 9 of them `UNKNOWN` or null (recounted at the build, 2026-09-29, which found 83 where this spec first counted 82), and a clarify whose alternatives include that mode has a right answer. The census found 2 mode-alternative rows over 359 committed prompts and none with gold (`gold_in_alternatives=0`), so the 30-row gate cannot be reached from committed prompts alone.

### Purpose

Count clarify outcomes over committed prompts with zero calls, build the clarify gold that R12 lacks up to a 30-row label gate, and past that gate settle on counted numbers per backend whether a model's pick beats the router's first alternative as the default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census. Each prompt goes through its hub's compiled engine with `loadHubEngine` and the engine's own `evaluate` (`compiled-route.cjs:55-86`, exported at `:110`), reading `decision.clarify.alternatives`. Sources, each counted apart: the 86 canary cases in `009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`, the hub playbook scenarios parsed with `parseScenario` (`validate-compiled-routing-scenarios.cjs:170`) and the advisor corpus's 241 skill-firing rows (`labeled-prompts.jsonl`, `holdout-prompts.jsonl`) routed to the compiled hub their gold skill belongs to. The report prints per hub and source: prompts, unparsed prompts, route, clarify, defer and reject counts, clarify rows with mode alternatives against checklist alternatives, and rows whose committed mode gold is one of the alternatives.
- A real-use count behind `--transcripts <dir>` (proposed). It counts front-door output lines holding `"action":"clarify"` against the other actions, per hub, in the directory the operator names, and prints counts only, never text. Without the flag it prints `real clarify rate: not measured`.
- An unlabeled rows writer behind `--rows-out <file>` (proposed): one JSON line per clarify row with mode alternatives, holding id, hub, source, the committed prompt, the alternatives, `gold` from the playbook when present and an empty `label`.
- A scorer over a rows file. A labeled row has an operator `label` or a committed `gold`, and its value is one of the row's alternatives or `none_of_these`. Under 30 labeled rows it prints `stop: fewer than 30 labeled rows` and runs nothing further.
- The zero-call baseline: the first alternative the router lists, which is its tie-break order.
- A Jev arm behind `--jev` and a Deem arm behind `--deem` (proposed), past the label gate: one `choice` per labeled row per option order over the row's alternatives, three left rotations.
- Jev first, then Deem (parent D1). With both switches set, the Jev column runs first. A failed gate never starts the other backend.
- The Keep Rule in section 4, fixed here, and the docs parent D6 requires.

### Out of Scope

- A live judgment in the front door or any router. What Not To Build rows 19 and 84 stay dropped: the front door has one stdout shape and a legacy fallback, and a model never replaces a deterministic router.
- Changing `compiledRoute`'s output to carry the alternatives, or adding a clarify event log. Both are the routing owner's seam changes, recorded as open questions.
- Editing a router, `resolve.cjs`, a canary fixture, a playbook scenario or a `mode-registry.json`.
- Rows built from transcripts. The transcript count prints numbers only. Adding transcript text to a rows file is an operator decision that brings the payload gate of the risks table.
- Writing a label. Labels are the operator's, past the gate (parent D4's rule for 003 and 006).
- A shared client, a global switch, the npm `jevctl` or a dollar figure.

### Files to Change

Owner of every code path below: `sk-doc`, whose `sk-create-skill` mode owns the compiled-routing scenario validators. Code follows sk-code's OpenCode route and the docs go through sk-doc (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Create | Census, transcript count, rows writer, scorer, label gate, both arms and verdicts. Proposed name. About 350 to 450 LOC (estimate) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | Create | `node --test` cases on synthetic hubs, synthetic labels and stub `jev` and `cli-deem` |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`, the hub routers and canary fixtures | Read only | The engines and their gold |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs` | Read only | `parseScenario` and `walkScenarioFiles`, imported |
| `.skilled/skills/*/manual-testing-playbook/**`, `system-skill-advisor/runtime/scripts/routing-accuracy/*-prompts.jsonl` | Read only | Prompts and committed gold |
| `<operator-named report dir>/`, `<operator-named rows file>` | Create at run time | `report.json`, the rows file and `calls.jsonl` from a model run |
| `sk-create-skill/SKILL.md`, `sk-create-skill/README.md`, `sk-create-skill/changelog/v<next>.md` | Modify, Create | Parent D6, through sk-doc: the script, its zero-call default, its gate and its two switches |
| `sk-create-skill/manual-testing-playbook/` entry and `manual-testing-playbook.md` | Create, Modify | Parent D6: a census scenario and the label-gate stop, with the index row |
| `.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md` and `feature-catalog.md` | Create, Modify | Parent D6: sk-create-skill ships no catalog, so the entry goes in the sk-doc hub catalog, as 006 filed sk-create-goal's. Proposed name |
| `sk-create-skill/scripts/README.md`, `scripts/tests/README.md` | Modify | One row each |
| `.hermes/skills/sk-create-skill/SKILL.md`, sk-doc `leaf-manifest.json` and `leaf-aliases.json`, the trigger index | Regenerate | By their generators after the doc edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The census makes zero model calls and changes nothing | Without `--jev` or `--deem` the script prints the census and never spawns `jev` or `cli-deem`. Stub binaries first on `PATH` log nothing. `git status --porcelain` is the same before and after, except operator-named outputs inside the repository |
| REQ-002 | The label gate stops the phase | On a rows file with fewer than 30 labeled rows the scorer prints `stop: fewer than 30 labeled rows (<n> labeled)`, exits 0 and runs no arm, even with `--jev` or `--deem`. A label outside the row's alternatives and `none_of_these` is rejected by row id with exit 2 |
| REQ-003 | Each arm is dormant unless its switch is set and its gate passes | Jev: an identity line with the `jev` path and provider P, then `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0, else `jev arm skipped: jev not on PATH`, `version` with a details line or `no credential`. Deem: `cli-deem health` within 2,000 ms, else `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. A skip leaves the other output byte-identical and exits 0 |
| REQ-004 | No key and no private text | The script never reads, logs or passes a key. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' score-clarify-default.cjs` returns no match. A Jev request carries the committed prompt on stdin, the fixed `-q` instruction and the options only. The transcript count prints no text |
| REQ-005 | The census reports what it could not read | Every prompt the parser or the engine could not take is counted as unparsed per hub and source, never dropped silently |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The call shape is fixed | Options are the row's mode alternatives plus `none_of_these`. Each mode's description is its packet `SKILL.md` frontmatter `description`, found through the hub's `mode-registry.json` `packet` field, verbatim and hashed (proposed). `none_of_these` reads "None of these modes". The `-q` instruction is "Which workflow mode should handle this request?" (proposed), printed verbatim before the first call. Three left rotations, each a fresh call with no answer cache. The modal pick is the row's pick, and three different picks make it `unstable` |
| REQ-007 | Every call and exit has one handling | `calls.jsonl` holds row id, order index, wall ms, exit code, backend, pick, its probability and a status of `measured`, `unmeasured` or `unmeasured_timeout`, with the commit pair on Deem lines and the `jev` version, provider and model on Jev lines. Exits follow 002's handling for both backends, a Jev spawn past 90 s is `unmeasured_timeout`, and a stopped arm prints finished rows `partial` and no verdict. `--jev` or `--deem` without `--out <dir>` exits 2 before any output |
| REQ-008 | The operator sees the cost first | Jev prints the payload class (committed canary, playbook and routing-corpus prompts and mode descriptions), planned calls (3 times the labeled rows, plus 1) and estimated input tokens. Deem prints "nothing leaves the machine", planned calls and a wall estimate at its measured p50. No dollar figure |
| REQ-009 | Tests cover every public surface | `node --test` on the test file exits 0 with a happy path and one edge case each: the census on a synthetic hub counts a clarify and an unparsed prompt, checklist alternatives are kept apart from mode alternatives, the transcript count finds a clarify line and prints no text, the rows writer leaves every `label` empty, the gate prints its stop at 29 labeled rows and passes at 30, a foreign label exits 2, both gates pass a stub and print each skip line with byte-identical output, and the verdict prints `keep`, `kill`, `stop (margin)` and `stop (coverage)` on synthetic labels. At least 16 cases |
| REQ-010 | The changed skill's docs stay true to the code (parent D6) | The docs of section 3 name the script, its zero-call default, the 30-row gate and the two switches, and `validate_document.py` exits 0 on each |

### Keep Rule (fixed 2026-09-29, before any model run)

Each backend column is judged on its own inputs. Changing this rule after the first model run is an amendment that voids every earlier verdict.

**Inputs.** K: the labeled rows, at least 30. M: rows whose three calls each returned a submitted key. On a measured row the column is right when its modal pick equals the label, and `unstable` counts as wrong. The baseline is right when the router's first alternative equals the label. A counts the M rows the column gets right and B the rows the baseline gets right. W counts rows only the column gets right and L rows only the baseline gets right. F sums each row's non-modal picks.

**Thresholds, checked in this order.** Before any call, when the baseline is right on more than 90 percent of the K rows, the script prints `no headroom` and neither arm calls.
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: the exact one-sided P(X >= L) for X ~ Binomial(W+L, 0.5) at or below 0.05 prints `kill`.
3. Margin: `10*(A-B) >= M`, a gain of at least 10 points, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W+L is 0, else `stop (sign test)`.
5. Flips: `10*F <= 3*M`, a flip rate of at most 0.10, else `stop (flips)`.
6. Otherwise `keep`.

**The verdict line.** `verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<K> M=<M> A=<A> B=<B> W=<W> L=<L> F=<F> p=<p>`, with `model= model_commit= source_commit=` on Deem and `jev_version= provider= model=` on Jev, on stdout and in `report.json`. Before any call the script prints `margin: 0.10` and one `keep rule:` line.

**What a verdict means.** A `keep` serves nothing: a served default needs the front door's output contract changed, a later phase and the operator's call. A `kill` closes that backend's suggested default at that identity. A stub or synthetic verdict never counts.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With zero calls, the operator reads how often each compiled hub answers `clarify` on committed prompts, how many of those rows already carry gold and, on request, how often clarify appeared in their own sessions.
- **SC-002**: The operator has an unlabeled rows file to label and a tested scorer that refuses to judge below 30 labels.
- **SC-003**: Past the gate, each model run gives one verdict per column, and a run with neither switch calls nothing.

### Proof Plan

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` and `STUB` a directory of logging `jev` and `cli-deem` stubs.

1. `PATH="$STUB:$PATH" node $S --report <dir> --rows-out <file>` prints per-hub and per-source counts, `real clarify rate: not measured`, exits 0, and both stub logs stay empty. Boundary: the 3 canary clarify rows appear, and `system-deep-loop`'s row is counted under checklist alternatives.
2. `node $S --score <file>` on the unlabeled file prints `stop: fewer than 30 labeled rows (<n> labeled)` and exits 0. With `--deem --out <dir>` added it prints the same stop and no stub call.
3. On a synthetic file of 30 labeled rows, a stub `cli-deem` answering the label on every row prints `verdict deem: keep`, and one answering the first alternative prints `stop (margin)`.
4. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' $S` exits 1.
5. `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` exits 0 with at least 16 passing tests.

**Kill criterion.** A `kill` closes that backend's suggested default. `stop: fewer than 30 labeled rows`, `no headroom`, `stop (<reason>)` and every skip line close nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Committed prompts were written to route cleanly, so the census may find few clarify rows | High. The gate may stay shut on committed text alone | The census count is the answer. Transcript-derived rows are the operator's choice and carry the payload gate below |
| Risk | Transcript text holds the operator's conversation | High if sent to Jev | Rows come from committed text by default. If the operator adds transcript rows, Jev needs the payload-acceptance and redaction gate that 003's D9 names, with secrets stripped by the operator. Deem runs when that gate is not accepted |
| Risk | Front-door output lines may not appear in transcripts in a countable shape | Med | The count reports lines matched per file, and a zero is reported as zero, never extrapolated |
| Risk | `parseScenario` expects an `Exact prompt` block or a `Prompt:` line and may miss some hub scenarios | Med | REQ-005 counts every unparsed prompt |
| Dependency | The operator's labels | The model arms cannot run | The phase closes at the gate. The labels are the operator's, after this phase |
| Dependency | Phase 021 shares `sk-create-skill`'s docs | Two builds touching one `SKILL.md` would collide | The builds run one after the other |
| Dependency | The served Deem, or a Jev credential for provider P | That column cannot run | Skip line, exit 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How often does clarify happen in real use (research question 10)? The transcript count answers it for the directory the operator names. A durable count needs a clarify event log, which is the routing owner's seam.
- Would a served default fit the front door? `compiledRoute` drops the alternatives today (`compiled-route.cjs:96-108`), so serving one needs that owner to change the output contract first.
- Is the 10-point margin right with as few as 30 rows? At 30 rows a 10-point gain is 3 rows. It is fixed here so the build cannot tune it.
<!-- /ANCHOR:questions -->

---
