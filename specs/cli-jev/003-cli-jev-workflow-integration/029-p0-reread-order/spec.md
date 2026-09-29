---
title: "Feature Specification: Phase 29: p0-reread-order"
description: "Test research R10 offline: count the archived P0 findings and their downgrades with zero calls, stop at the operator's label gate until 20 P0 negatives are labeled, then measure whether a Jev or Deem severity choice separates real P0s from false ones better than the recorded severity. Each backend column ends in one verdict line under a keep rule fixed here, with the reread order and a validity funnel reported beside it."
trigger_phrases:
  - "p0 reread order"
  - "severity replay"
  - "score-severity-replay"
  - "validity funnel log"
  - "research r10 test phase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 29: p0-reread-order

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 29 of 35 |
| **Predecessor** | 028-confirm-mode-stop-hint |
| **Successor** | 030-fanout-merge-shadow-record |
| **Handoff Criteria** | The zero-call census has printed the registry counts, the severity transitions, the P0 population and the rejected-P0 phrase counts. Then either the scorer printed `stop: fewer than 20 labeled P0 negatives` or `no headroom`, or a run past the gate printed one `verdict <backend>:` line per backend column that ran, or that backend's skip line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the cli-jev workflow integration specification. On 2026-09-29 the operator asked for "a phase per later item not yet planned or implemented so we can test everything". This phase tests research R10, the severity replay, P0 reread order and validity funnel log, ranked 14th and `later` in `../007-classifier-deep-research/research/research.md` section 12 (judgment type `choice`, `score` or `noul`, preferred backend Deem). The full record is `../001-deep-research/research/research.md` section 11, `### R10.`, with its promote line at `:1275`. Round 2 answered its open question 7 "no" (`../004-deep-research-expansion/research/research.md:101`, `:138`) and added What Not To Build row 50 (`:800`).

**Scope Boundary**: One new read-only replay script in the `system-deep-loop` runtime, its vitest file and the skill docs parent D6 requires. It never writes or gates a severity, never reorders a registry and edits no review workflow, so every review verdict stays as today by construction.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- The operator's labels (REQ-005). No model writes a label.
- Phase 008 (`008-cli-classifier-hub`), Complete, for the Deem arm's `cli-deem`. For the Deem arm only: a server passing `cli-deem health`.
- For the Jev arm only: the Python `jev-cli` 0.6.2 on `PATH` and a credential that `jev auth status --provider P` resolves, P being `JEV_PROVIDER` when set and `official` otherwise.
- The build roles of parent D5 and the doc route of parent D6, in `plan.md`.

**Deliverables**:
- `score-severity-replay.cjs` (proposed) with the zero-call census by default, a label-sheet writer, a `--jev` arm and a `--deem` arm (proposed switches)
- `tests/unit/score-severity-replay.vitest.ts` (proposed) against fixture registries with stub `jev` and `cli-deem` binaries
- One census report and, past the label gate, one report per model arm in a directory the operator names
- The `system-deep-loop` docs parent D6 names, written through sk-doc

**Changelog**:
- None. The parent packet has no `../changelog/` folder (checked 2026-09-29).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A deep-review P0 blocks release. The review protocol asks every P0 to survive an adversarial self-check, with rejected P0s downgraded and their rationale written in the iteration narrative, and a FAIL verdict reads only confirmed P0s (`.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:61-63`, `:75`). R10 asks whether a classifier could read P0s in likely-real-first order and flag the false ones, so fewer P0s get reread.

The research parked R10 as `later` because it has no gold (`../007-classifier-deep-research/research/research.md:422`). The registries hold no negative class: this leaf counted 412 tracked `deep-review-findings-registry.json` files on 2026-09-29, holding 2,852 findings, 95 of them at P0 across 36 registries (17 registries hold two or more). Their transitions record 44 entries into P0 at discovery and 0 out of P0 (What Not To Build row 35, `../001-deep-research/research/research.md:1079`). The narrative has none either: over 3,270 tracked review iteration files, grok-04's five rejected-P0 phrases (`../004-deep-research-expansion/research/lineages/grok/iterations/iteration-004.md:48-66`) match 0, 1, 1, 1 and 1 files, and the hits are one quoted changelog and one focus heading, not a rejected finding. That repeats round 2's dead end (row 50). The record's bar is 20 labeled P0 negatives. Only the operator can supply them, so this phase stops at a label gate, as 003 and 006 did (parent D4).

### Purpose

Settle, on a counted number per backend, whether a Jev or Deem severity choice separates real P0s from false ones better than the recorded severity, once the operator has labeled at least 20 P0 negatives, with the census printed first and nothing changed for anyone who passes neither `--jev` nor `--deem`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census over tracked review registries and review iteration files: registries, findings by severity, the transitions matrix, the P0 population and grok-04's phrase counts (REQ-002).
- A label sheet the operator fills: the P0 rows with their registry, finding id, title, dimension and evidence refs and an empty label, written only to a path outside the repository (REQ-005).
- A label gate: `stop: fewer than 20 labeled P0 negatives` until the operator's file holds 20 rows labeled other than `real`.
- A Jev arm behind `--jev` and a Deem arm behind `--deem`, each asking one `choice` over `P0`, `P1`, `P2` and `not_a_finding` per labeled row in three option orders, with one verdict per backend column under the Keep Rule (REQ-004, REQ-008).
- Two report-only lines per column, never deciding: the reread order and a validity funnel of one `noul` per row (REQ-010).
- Jev first, then Deem (parent D1). No failover.
- The `system-deep-loop` skill docs parent D6 requires, through sk-doc (REQ-011).

### Out of Scope

- Writing, gating or reordering any severity, registry or verdict. What Not To Build row 15 drops a model that writes or gates severity. A live form would be a non-gating shadow beside the reviewer-blind adapter (`runtime/lib/blinded-adjudication/mode-adapters.ts:59`, `:63-72`), which needs a later phase and a `keep`, and opening it is the operator's call.
- A model writing a label, and mining the narrative for gold again. Round 2 settled it (row 50).
- Editing `completion-criteria.md`, any review workflow, `mode-adapters.ts` or any archived registry.
- A shared client, a global switch, the npm `jevctl` package and a dollar figure in any cost line.

### Files to Change

Owner of every code path below: `system-deep-loop`. The code follows sk-code's OpenCode route and the docs go through sk-doc's modes (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` | Create | Census, label sheet, label gate, both arms, the Keep Rule and the report-only lines. Proposed name. About 450 to 600 LOC (estimate) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts` | Create | Fixture-registry, stub-`jev` and stub-`cli-deem` cases |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modify | One row for the new script |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modify | Parent D6: one sentence naming the offline severity replay and saying no severity changes |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modify | Parent D6: one line naming the script, its zero-call default, the label gate and the two switches |
| `.skilled/skills/system-deep-loop/runtime/changelog/v<next>.md` | Create | Parent D6, through `sk-create-changelog`. The newest file at planning is `v1.5.0.1.md` |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md` and `feature-catalog.md` | Create, Modify | Parent D6: one entry (proposed name) and its index row |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md` and `manual-testing-playbook.md` | Create, Modify | Parent D6: the census, the label-gate stop and a stub-backend skip, plus the index row |
| Generated copies (the Hermes `SKILL.md`, leaf manifests, trigger index) | Regenerate | Only when their own checks report them stale after the doc edits |
| `specs/**/deep-review-findings-registry.json`, review `iterations/iteration-*.md` | Read only | The census corpus |
| `<operator-named label file>`, `<operator-named report dir>/` | Read, Create at run time | The labels, and `report.json` with `calls.jsonl` from a model run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--jev` or `--deem` the script prints the census and the label-gate state, never spawns `jev` or `cli-deem` and writes no file unless `--out` or `--write-label-sheet` names one. Logging stub binaries first on `PATH` log nothing |
| REQ-002 | The census is a fixed rule | Registries are tracked `deep-review-findings-registry.json` files, findings are their `openFindings` and `resolvedFindings`, and a P0 row is a finding whose `severity` is `P0`. The census prints registries, findings by severity, the transitions matrix by `from` and `to`, P0 rows, registries with one and with two or more P0 rows and, over tracked review `iterations/iteration-*.md` files, the file count and hits for each of grok-04's five phrases. It ends `labels needed: 20 P0 negatives among <n> P0 rows` |
| REQ-003 | The baseline and headroom come before any call | On the K labeled P0 rows the baseline is the recorded severity, so it calls every row real and is right on the rows labeled `real`. When it is right on more than 90 percent of K, a 10-point gain cannot fit, and the scorer prints `no headroom` and runs no arm |
| REQ-004 | The Keep Rule is fixed here, before any model run, per backend column | See the Keep Rule below. The verdict line prints on stdout and in that column of `report.json` |
| REQ-005 | The label gate stops every arm until 20 negatives exist | `--write-label-sheet <path>` (proposed) writes one JSON line per P0 row with `registry`, `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`, and refuses a path inside the repository with exit 2. `--labels <file>` (proposed) reads the filled file, whose `label` must be `real`, `P1`, `P2` or `not_a_finding`, and names any other value by row with exit 2. Fewer than 20 rows labeled other than `real` prints `stop: fewer than 20 labeled P0 negatives`, runs no arm and exits 0. No model writes a label |
| REQ-006 | Each arm is dormant unless its own switch is set and its gate passes | Jev: an identity line with the `jev` path and P first, then `command -v jev` (`jev arm skipped: jev not on PATH`), `jev --version` printing exactly `jev 0.6.2` (`jev arm skipped: version` plus a details line) and `jev auth status --provider P` exiting 0 (`jev arm skipped: no credential`). One `jev auth test --provider P`, and the same P on every judgment. Deem: `cli-deem health` within 2,000 ms printing backend, model id and commit pair, else `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. Each skip leaves the census and the other column byte-identical and exits 0. The script never starts the server |
| REQ-007 | No key, no severity leak and published text only for Jev | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script returns no match. The state of a row is its title, dimension, evidence refs and recommendation. The finding id is never sent, because ids such as `P2-001` carry the severity. A Jev request goes only for a row whose registry exists at `origin/main` (`git cat-file -e origin/main:<path>`, proposed), and other rows are `unmeasured_unpublished` in the Jev column. Deem runs every row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The call shape is fixed and shared | Each row goes to `jev choice --provider P` or `cli-deem choice` on stdin with `-q "Which severity does this review finding deserve?"` (proposed wording, fixed before any run) and four options: `P0`, `P1` and `P2` with the verbatim descriptions of `deep-review/references/convergence/convergence.md:398-400`, and `not_a_finding=The cited evidence does not show a defect` (proposed). Three option orders, the list above, then rotated left by one, then by two, with no answer cache, so for Jev the three orders are also its three reruns. The modal pick is the key at least two orders name, three different keys make the row `unstable` |
| REQ-009 | Every call and exit has one handling, and the cost prints first | The Deem arm prints "nothing leaves the machine", planned calls and a wall-time estimate at 65.6 ms labeled as the 2-option p50 of `deem-local.md`. The Jev arm prints the payload class (published review registry text), planned calls and estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call with row key, order index, wall ms, exit code, backend, the pick or probability, and a status of `measured`, `unmeasured`, `unmeasured_timeout` or `unmeasured_unpublished`, with the commit pair on Deem lines and version, provider and model on Jev lines. Exits follow phase 002's handling: Deem 1 or HTTP 400 `unmeasured`, 2 stop, 3 `deem arm stopped: backend refused`, 4 one health recheck (`model commit changed mid-run` or `server gone`), 130 `interrupted`. Jev 1 `unmeasured`, 2 stop, 3 after the gate `jev arm stopped: key rejected`, 4 one backoff retry, past 90 s `unmeasured_timeout`, 130 `interrupted`. A stopped arm prints no verdict. `--jev` or `--deem` without `--out` exits 2 before any call |
| REQ-010 | The reread order and the validity funnel are reported, never decisive | Order: for each registry with two or more labeled rows, the rank of its first `real` row when rows sort by the column's mean `P0` probability, against the registry's own order, printed as `order <backend>: registries=<n> first_real_rank=<x> recorded=<y>`. Funnel: one `noul` per measured row, `-q "Does the cited evidence show the defect this finding claims?"` (proposed), one call per backend with no rerun because it never decides, printed as `funnel <backend>: asked=<n> measured=<m> yes=<y> no=<z>` with yes at a probability of 0.5 or more. A third line prints how many negatives the column put in their labeled class. None of these lines enters the Keep Rule |
| REQ-011 | Tests cover every public surface, and the docs stay true (parent D6) | `score-severity-replay.vitest.ts` exits 0 with a happy path and one edge case each: the census counts a fixture's P0 rows and transitions, the phrase counter finds a planted phrase, the label sheet writes outside the repository and refuses a path inside, the label reader rejects an unknown label, the gate prints its stop line at 19 negatives and passes at 20, `no headroom` prints above 90 percent, the finding id never reaches a logged call, the Jev gate passes a stub and skips on exit 3, the Deem gate passes a fake health and skips a stub backend byte-identically, a Deem exit 4 with a new pair stops the arm, an unpublished row is withheld from Jev and the verdict prints `keep`, `kill` and `stop (coverage)`. `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry each name the script, the gate and both switches, and `validate_document.py` exits 0 on each |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the labeled P0 rows. A column's M measured rows are those with three submitted keys. On a measured row the column is right when its modal pick is `P0` and the label is `real`, or its modal pick is `P1`, `P2` or `not_a_finding` and the label is not `real`. `unstable` counts as wrong. The baseline is right on every row labeled `real`. A and B count the rows the column and the baseline get right among the M rows. W counts the negatives only the column gets right, and L the real P0s only the baseline gets right. F sums each row's non-modal picks, and C is the column's measured calls, 3M.

**Thresholds, in this order.** The first that applies sets the verdict.
1. Coverage: `10*M >= 9*K`, else `verdict <backend>: stop (coverage)`.
2. Kill: the exact one-sided binomial P(X >= L) for X ~ Binomial(W + L, 0.5) below 0.05 prints `verdict <backend>: kill`.
3. Margin: `10*(A-B) >= M`, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W + L is 0, else `stop (sign test)`.
5. Flips: `10*F <= C`, else `stop (flips)`.
6. Otherwise `verdict <backend>: keep`.

**The line.** `verdict <backend>: keep|kill|stop (<reason>) K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f> p=<p>`, then `model=<id> model_commit=<sha> source_commit=<sha>` for Deem and `jev_version=<v> provider=<p> model=<m>` for Jev. A later run on a different pair or model prints `requalify: model commit changed` or `requalify: model changed` first. A stub, fake-server or vitest verdict never counts. A change to this rule after the first model run voids every earlier verdict.

**What a keep means.** It holds for the pair or model on its line only and serves nothing. A shadow severity beside the reviewer needs a later phase, and opening it is the operator's call.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any label or call, the operator reads how many P0 findings exist, how many were ever downgraded and how many labels the gate needs.
- **SC-002**: Past the gate, one run per model arm prints one verdict line per backend column with what it was measured on. At the gate the phase closes on its stop line.
- **SC-003**: A run with neither switch, or with every requested gate failing, calls nothing and changes no registry.

### Proof Plan

1. `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` with logging stubs first on `PATH`: exit 0, lines `registries:`, `findings:`, `transitions:`, `p0 rows:`, `phrases:` and `labels needed:`, and no stub log.
2. `--write-label-sheet <tmp outside the repo>` writes one line per P0 row with an empty `label`. Boundary: a path inside the repository exits 2 and writes nothing.
3. `--jev --deem --out <tmp> --labels <fixture with 19 negatives>` prints `stop: fewer than 20 labeled P0 negatives` and no stub logs a call. Boundary: 20 negatives pass the gate, and a stub `cli-deem health` reporting `stub` prints `deem arm skipped: stub backend`.
4. From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-severity-replay.vitest.ts` exits 0 with at least 22 passed tests and 0 failed.
5. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script prints nothing, and `git status --porcelain` is the same before and after every run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 20 labeled P0 negatives | The operator may label all 95 P0 rows and still find fewer than 20 | The phase then closes on the stop line, which is itself R10's answer: the negative class is too rare to measure |
| Risk | P0 rows are rare and clustered, 95 in 36 registries | Med | K is every labeled row. The census prints per-registry counts so the operator sees the clustering |
| Risk | A label read in hindsight disagrees with what the reviewer knew then | Med | The label sheet carries the evidence refs the reviewer cited, and the operator labels against those |
| Risk | The finding id leaks the severity | High without the rule | REQ-007 never sends it, and a test checks the logged calls |
| Dependency | Published text for Jev | Registries committed only on this branch are withheld from Jev | Counted as `unmeasured_unpublished`, and a sunk coverage prints `stop (coverage)` |
| Dependency | Shared doc files with phases 027, 028 and 030 | Parallel builds would collide | The doc steps run one after another |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Do 20 P0 negatives exist among the 95 P0 rows? Only the operator's labels answer it.
- Is a binary real-or-not verdict the right bar, or should the exact class of a negative count? The Keep Rule uses the binary one, and the report prints exact-class agreement on negatives beside it.
- Would anyone reread P0s in the arm's order? The reviewer's self-check is a prompt step, so a reader for the order is UNKNOWN until a later phase names one.
<!-- /ANCHOR:questions -->

---
