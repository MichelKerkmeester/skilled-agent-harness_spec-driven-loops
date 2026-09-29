---
title: "Feature Specification: Phase 30: fanout-merge-shadow-record"
description: "Test research R15 offline: find the cross-lineage finding pairs the fan-out merge decides near its 0.15 title line or never compares because their bodies differ, stop at the operator's pair-label gate, then measure whether a Jev or Deem same-or-different judgment matches the labels better than the merge's own decision. Each backend column ends in one verdict line under a keep rule fixed here, and the merge itself never changes."
trigger_phrases:
  - "fan-out shadow pair record"
  - "fanout merge pair labels"
  - "score-fanout-pairs"
  - "near-duplicate title line"
  - "research r15 test phase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 30: fanout-merge-shadow-record

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
| **Phase** | 30 of 35 |
| **Predecessor** | 029-p0-reread-order |
| **Successor** | 031-debug-next-check |
| **Handoff Criteria** | The zero-call census has printed the fan-out runs, the candidate pairs per class and the merge's decision on each class. Then either the scorer printed a label-gate stop line or `no headroom`, or a run past the gate printed one `verdict <backend>:` line per backend column that ran, or that backend's skip line. The reader of a shadow record stays an open question either way |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the cli-jev workflow integration specification. On 2026-09-29 the operator asked for "a phase per later item not yet planned or implemented so we can test everything". This phase tests research R15, the fan-out shadow pair record, ranked 17th and `later` in `../007-classifier-deep-research/research/research.md` section 12 (judgment type `noul`, preferred backend Deem). The full record is `../001-deep-research/research/research.md` section 11, `### R15.`, with its promote line at `:1278`. What Not To Build row 11 (`:1055`) drops replacing the collapse or making a model the live merge decision.

**Scope Boundary**: One new read-only pair script in the `system-deep-loop` runtime, its vitest file and the skill docs parent D6 requires. It calls the merge's exported functions on copies and never edits `fanout-merge.cjs`, so every fan-out merge stays exactly as today by construction.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 015 (`015-fanout-merge-and-steering-fixes`), Complete: it changed `fanout-merge.cjs` in `7de30fb16f`, which moved the cited lines.
- The operator's pair labels (REQ-005). No model writes a label.
- Phase 008 (`008-cli-classifier-hub`), Complete, and a server passing `cli-deem health`, for the Deem arm only. The Python `jev-cli` 0.6.2 and a credential that `jev auth status --provider P` resolves, for the Jev arm only.
- The build roles of parent D5 and the doc route of parent D6, in `plan.md`.

**Deliverables**:
- `score-fanout-pairs.cjs` (proposed) with the zero-call census by default, a pair-sheet writer, a `--jev` arm and a `--deem` arm (proposed switches)
- `tests/unit/score-fanout-pairs.vitest.ts` (proposed) against fixture lineage registries with stub `jev` and `cli-deem` binaries
- One census report and, past the label gate, one report per model arm in a directory the operator names
- The `system-deep-loop` docs parent D6 names, written through sk-doc

**Changelog**:
- None. The parent packet has no `../changelog/` folder (checked 2026-09-29).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A fan-out run merges its lineages' findings in `fanout-merge.cjs`. With near-duplicate dedup on, two findings collapse only when their body keys match and their title token overlap is at least 0.15 (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-354`, `:376-392`, `:399-402`). Two blind spots follow. Pairs just above or below 0.15 are split or merged on a rounding of word overlap. Pairs that say the same thing in different bodies are never compared, because the body gate runs first (DeepSeek `iteration-005.md:70`). And the near-duplicate pass runs only when `SPECKIT_FANOUT_NEAR_DUP_DEDUP` or the matching option is set (`:504-510`), so a default merge collapses exact content identity only.

The research parked R15 as `later` for two reasons: no labeled pair set exists, and no reader of a shadow record is named (`../007-classifier-deep-research/research/research.md:425`). The corpus is there: this leaf counted 59 tracked research fan-out runs and 46 review runs with two or more lineage registries on 2026-09-29. Their 230 research and 225 review lineage registries hold 4,396 and 1,299 findings. Only the operator can say whether two findings are the same, so this phase stops at a label gate, as 003 and 006 did (parent D4), and records the reader as an open question.

### Purpose

Settle, on a counted number per backend, whether a Jev or Deem same-or-different judgment on near-line and cross-body pairs matches the operator's labels better than the merge's own decision, with the pair census printed first and nothing changed for anyone who passes neither `--jev` nor `--deem`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census over tracked fan-out runs: every cross-lineage finding pair within one run, sorted into two candidate classes, `near-line` and `cross-body`, with the merge's decision on each pair under dedup on and dedup off (REQ-002, REQ-003).
- A pair sheet the operator fills, written only outside the repository (REQ-005), and a label gate of at least 40 labeled pairs with at least 10 cross-body ones.
- A Jev arm behind `--jev` and a Deem arm behind `--deem`, each asking one `noul` per labeled pair in both finding orders, with one verdict per backend column under the Keep Rule (REQ-004, REQ-008).
- Jev first, then Deem (parent D1). No failover.
- The `system-deep-loop` skill docs parent D6 requires, through sk-doc (REQ-011).

### Out of Scope

- Editing `fanout-merge.cjs`, `fanout-run.cjs` or any merged registry, and any live shadow record. What Not To Build row 11 drops a model as the merge decision, and the record keeps even a shadow out of the merge. Writing a record during real merges needs a named reader, a `keep` and a later phase, and opening it is the operator's call.
- A model writing a pair label.
- Changing the 0.15 threshold or the dedup default. Those are the owner's decisions.
- A shared client, a global switch, the npm `jevctl` package and a dollar figure in any cost line.

### Files to Change

Owner of every code path below: `system-deep-loop`. The code follows sk-code's OpenCode route and the docs go through sk-doc's modes (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` | Create | Census, pair classes, the merge's decisions, pair sheet, label gate, both arms and the Keep Rule. Proposed name. About 450 to 600 LOC (estimate) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` | Create | Fixture-registry, parity, stub-`jev` and stub-`cli-deem` cases |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modify | One row for the new script |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modify | Parent D6: one sentence naming the offline pair replay and saying the merge is unchanged |
| `.skilled/skills/system-deep-loop/runtime/README.md` | Modify | Parent D6: one line naming the script, its zero-call default, the label gate and the two switches |
| `.skilled/skills/system-deep-loop/runtime/changelog/v<next>.md` | Create | Parent D6, through `sk-create-changelog`. The newest file at planning is `v1.5.0.1.md` |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` and `feature-catalog.md` | Create, Modify | Parent D6: one entry (proposed name) beside `fanout-merge.md` and its index row |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-pair-replay.md` and `manual-testing-playbook.md` | Create, Modify | Parent D6: the census, the label-gate stop and a stub-backend skip, plus the index row |
| Generated copies (the Hermes `SKILL.md`, leaf manifests, trigger index) | Regenerate | Only when their own checks report them stale after the doc edits |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Read only | Its exports `mergeResearchRegistries` and `mergeReviewRegistries` decide the baseline |
| `specs/**/{research,review}/lineages/*/` registries | Read only | The pair corpus |
| `<operator-named label file>`, `<operator-named report dir>/` | Read, Create at run time | The labels, and `report.json` with `calls.jsonl` from a model run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--jev` or `--deem` the script prints the census and the label-gate state, never spawns `jev` or `cli-deem` and writes no file unless `--out` or `--write-pair-sheet` names one. Logging stub binaries first on `PATH` log nothing |
| REQ-002 | The pair classes are fixed rules | A run is a tracked `research/lineages/` or `review/lineages/` folder with two or more lineage registries. A pair is two findings from different lineages of one run. `near-line`: equal body keys and a title token overlap from 0.05 up to but not including 0.30. `cross-body`: different body keys and a token overlap of at least 0.5 over the title, or over the finding text when either title is empty. The body key and overlap follow `fanout-merge.cjs:345-354` and `:358-392` for selection only, with a parity test (REQ-011). The bands are proposed and fixed here. The census prints runs, pairs and each class per kind |
| REQ-003 | The baseline is the merge's own decision | For each candidate pair the script calls the exported `mergeResearchRegistries` or `mergeReviewRegistries` on a two-registry copy holding only that pair, once with `enableNearDuplicateDedup: true` and once without, and reads whether the pair collapsed. Collapsed means "same". On the labeled pairs the baseline is whichever of the two decisions matches more labels, dedup off on a tie, because that is today's default. When it matches more than 90 percent, the scorer prints `no headroom` and runs no arm |
| REQ-004 | The Keep Rule is fixed here, before any model run, per backend column | See the Keep Rule below. The verdict line prints on stdout and in that column of `report.json` |
| REQ-005 | The label gate stops every arm until enough pairs are labeled | `--write-pair-sheet <path>` (proposed) writes at most 60 pairs per class, first by SHA-256 of the pair key, each with both findings' text, lineages, run path and an empty `label`, and refuses a path inside the repository with exit 2. `--labels <file>` (proposed) accepts `same` or `different` and names any other value by row with exit 2. Fewer than 40 labeled pairs prints `stop: fewer than 40 labeled pairs`, and fewer than 10 labeled `cross-body` pairs prints `stop: fewer than 10 labeled cross-body pairs`. Either stop runs no arm and exits 0. No model writes a label |
| REQ-006 | Each arm is dormant unless its own switch is set and its gate passes | Jev: an identity line with the `jev` path and P first, then `command -v jev` (`jev arm skipped: jev not on PATH`), `jev --version` printing exactly `jev 0.6.2` (`jev arm skipped: version` plus a details line) and `jev auth status --provider P` exiting 0 (`jev arm skipped: no credential`). One `jev auth test --provider P`, and the same P on every judgment. Deem: `cli-deem health` within 2,000 ms printing backend, model id and commit pair, else `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. Each skip leaves the census and the other column byte-identical and exits 0. The script never starts the server |
| REQ-007 | No key, and published text only for Jev | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script returns no match. A Jev request carries the fixed `-q` instruction and the two findings' text, and goes only for a pair whose two registries exist at `origin/main` (`git cat-file -e origin/main:<path>`, proposed). Other pairs are `unmeasured_unpublished` in the Jev column. Deem runs every pair |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The call shape is fixed and shared | Each pair goes to `jev noul --provider P` or `cli-deem noul` on stdin with `-q "Do these two findings describe the same problem?"` (proposed wording, fixed before any run) and the state `Finding A:` then `Finding B:`. Deem asks twice, in the orders AB and BA. Jev asks three times, AB, BA and AB, with no answer cache. An answer is "same" at a probability of 0.5 or more. The modal answer decides, and a Deem pair whose two orders disagree is `unstable` and counts as wrong |
| REQ-009 | Every call and exit has one handling, and the cost prints first | The Deem arm prints "nothing leaves the machine", planned calls and a wall-time estimate at 65.6 ms labeled as the 2-option p50 of `deem-local.md`. The Jev arm prints the payload class (published fan-out finding text), planned calls and estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call with pair key, order, wall ms, exit code, backend, probability and a status of `measured`, `unmeasured`, `unmeasured_timeout` or `unmeasured_unpublished`, with the commit pair on Deem lines and version, provider and model on Jev lines. Exits follow phase 002's handling: Deem 1 or HTTP 400 `unmeasured`, 2 stop, 3 `deem arm stopped: backend refused`, 4 one health recheck (`model commit changed mid-run` or `server gone`), 130 `interrupted`. Jev 1 `unmeasured`, 2 stop, 3 after the gate `jev arm stopped: key rejected`, 4 one backoff retry, past 90 s `unmeasured_timeout`, 130 `interrupted`. A stopped arm prints no verdict. `--jev` or `--deem` without `--out` exits 2 before any call |
| REQ-010 | A keep holds only for what it was measured on, and names its reader | The report records the Deem commit pair or the Jev version, provider and model per column, and a later run on a different one prints `requalify: model commit changed` or `requalify: model changed` first. Every verdict line ends `reader=none named` until the operator names a reader in a later amendment |
| REQ-011 | Tests cover every public surface, and the docs stay true (parent D6) | `score-fanout-pairs.vitest.ts` exits 0 with a happy path and one edge case each: the run walker skips a one-lineage run, each class catches its fixture pair and misses a pair outside its band, the parity case shows the selection's body key agrees with the merge's own collapse on fixtures, the baseline reads both merge decisions, the pair sheet refuses a path inside the repository, the gate prints both stop lines, `no headroom` prints above 90 percent, the Jev gate passes a stub and skips on exit 3, the Deem gate passes a fake health and skips a stub backend byte-identically, a Deem pair with disagreeing orders is `unstable`, an unpublished pair is withheld from Jev and the verdict prints `keep`, `kill` and `stop (coverage)`. `SKILL.md`, both READMEs, the changelog, the catalog entry and the playbook entry each name the script, the gate and both switches, and `validate_document.py` exits 0 on each |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the labeled pairs. A column's M measured pairs are those whose calls all returned a probability. On a measured pair the column is right when its modal answer equals the label, and `unstable` is wrong. The baseline (REQ-003) is right when its decision equals the label. A and B count the pairs the column and the baseline get right among the M pairs. W counts the pairs only the column gets right and L those only the baseline gets right. F sums each pair's answers that differ from its modal answer, one for an `unstable` Deem pair, and C is the column's measured calls.

**Thresholds, in this order.** The first that applies sets the verdict.
1. Coverage: `10*M >= 9*K`, else `verdict <backend>: stop (coverage)`.
2. Kill: the exact one-sided binomial P(X >= L) for X ~ Binomial(W + L, 0.5) below 0.05 prints `verdict <backend>: kill`.
3. Margin: `10*(A-B) >= M`, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W + L is 0, else `stop (sign test)`.
5. Flips: `10*F <= C`, else `stop (flips)`.
6. Otherwise `verdict <backend>: keep`.

**The line.** `verdict <backend>: keep|kill|stop (<reason>) K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f> p=<p> baseline=<dedup-on|dedup-off> reader=none named`, then `model=<id> model_commit=<sha> source_commit=<sha>` for Deem and `jev_version=<v> provider=<p> model=<m>` for Jev. A stub, fake-server or vitest verdict never counts. A change to this rule after the first model run voids every earlier verdict.

**What a keep means.** It holds for the pair or model on its line only. The record's promote line also needs a named reader, so a keep alone never promotes R15, and the merge stays unchanged.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any label or call, the operator reads how many near-line and cross-body pairs the recorded fan-out runs hold and how the merge decides each class with dedup on and off.
- **SC-002**: Past the gate, one run per model arm prints one verdict line per backend column with what it was measured on. At the gate the phase closes on its stop line.
- **SC-003**: A run with neither switch, or with every requested gate failing, calls nothing and changes no merge.

### Proof Plan

1. `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` with logging stubs first on `PATH`: exit 0, lines `runs:`, `pairs:`, `class near-line:`, `class cross-body:` and `merge decisions:`, and no stub log.
2. `--write-pair-sheet <tmp outside the repo>` writes at most 60 pairs per class with an empty `label`. Boundary: a path inside the repository exits 2 and writes nothing.
3. `--jev --deem --out <tmp> --labels <fixture with 39 pairs>` prints `stop: fewer than 40 labeled pairs` and no stub logs a call. Boundary: 40 pairs with 9 cross-body print `stop: fewer than 10 labeled cross-body pairs`, and a passing fixture with a stub `cli-deem health` reporting `stub` prints `deem arm skipped: stub backend`.
4. From `.skilled/skills/system-deep-loop/runtime`, `npx vitest run tests/unit/score-fanout-pairs.vitest.ts` exits 0 with at least 22 passed tests and 0 failed.
5. `git diff --stat .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` is empty, `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script prints nothing and `git status --porcelain` is the same before and after every run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's pair labels | No model arm can run without them | The gate stops cleanly, and the phase can close there |
| Risk | No reader for a shadow record | A keep cannot promote R15 | Every verdict line says `reader=none named`, and the open question stays in section 7 |
| Risk | The selection copy of the body key drifts from the merge | Wrong classes | The baseline comes from the merge's own exports, and a parity test pins the selection to them |
| Risk | Many findings carry none of the merge's body fields, so they fall back to whole-record identity and never near-collapse | Med | The census prints how many findings reach the title rule per kind, so the operator sees how small the near-line class is |
| Risk | Research findings rarely have titles | Cross-body pairs among them rely on text overlap | REQ-002 falls back to the finding text when a title is empty |
| Dependency | Published text for Jev | Registries committed only on this branch are withheld from Jev | Counted as `unmeasured_unpublished`, and a sunk coverage prints `stop (coverage)` |
| Dependency | Shared doc files with phases 027, 028 and 029 | Parallel builds would collide | The doc steps run one after another |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Who reads a shadow pair record? UNKNOWN. The record's promote line needs one. Candidates the operator could name are the synthesis step that reads the merged registry and the `system-deep-loop` owner reviewing the dedup default. Neither exists as a reader today.
- Did past merges run with near-duplicate dedup on? UNKNOWN from the registries alone. The census reports both decisions, so the answer does not change the measurement.
- Are 40 labels with 10 cross-body enough? They are fixed here so the build cannot tune them. A one-sided sign test at 0.05 needs at least 5 discordant pairs, all won, so a small labeled set can still pass or fail. Widening them is an amendment before the first model run.
<!-- /ANCHOR:questions -->

---
