---
title: "Feature Specification: Phase 31: debug-next-check"
description: "Test research R18 offline: with no caller seam in this repository, measure over an operator-labeled fixture of debug hypotheses whether a Jev or Deem choice of the cheapest next check beats the best constant answer, which includes the research's kill line of always read_code. A zero-call census prints the seam search and the constant baselines first, a 30-row label gate and a payload gate come before any call, and each backend column ends in one verdict line under a keep rule fixed here. Built and closed at its label gate on 2026-09-29, commit `ca40e3c2dc`."
trigger_phrases:
  - "debug next_check choice"
  - "score-debug-next-check"
  - "cheapest next check"
  - "debug hypothesis check choice"
  - "research r18 test phase"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 31: debug-next-check

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
| **Phase** | 31 of 35 |
| **Predecessor** | 030-fanout-merge-shadow-record |
| **Successor** | 032-citation-drift-scan |
| **Handoff Criteria** | The zero-call census has printed the seam search and, when the operator named a fixture, its label counts, each constant answer's accuracy and the headroom line. Then either the scorer printed `stop: fewer than 30 labeled rows` or `no headroom`, or a run past the gate printed one `verdict <backend>:` line per backend column that ran, or that backend's skip line. The caller seam and the reader stay open questions either way. The 2026-09-29 final runs read a 29-row synthetic fixture, so they printed `stop: fewer than 30 labeled rows` at exit 0 and closed there. A run past the gate waits on the operator's labeled fixture |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 31** of the cli-jev workflow integration specification. On 2026-09-29 the operator asked for "a phase per later item not yet planned or implemented so we can test everything". This phase tests research R18, the debug `next_check` choice, ranked 20th and `later` in `../007-classifier-deep-research/research/research.md` section 12 (judgment type `choice`, preferred backend either). The full record is `../001-deep-research/research/research.md` section 11, `### R18.`, with its promote line at `:1281`.

**Scope Boundary**: One new read-only measurement script in the `system-spec-kit` runtime, its vitest file and the skill docs parent D6 requires. It touches no agent, no debugging reference and no workflow, so every debug session runs exactly as today by construction.

**Dependencies**:
- Released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- The operator's labeled fixture (REQ-005). No model writes a label or a row.
- Phase 008 (`008-cli-classifier-hub`), Complete, and a server passing `cli-deem health`, for the Deem arm only. The Python `jev-cli` 0.6.2 and a credential that `jev auth status --provider P` resolves, for the Jev arm only.
- The build roles of parent D5 and the doc route of parent D6, in `plan.md`.

**Deliverables**:
- `score-debug-next-check.mjs`, built at 1,570 lines, with the zero-call census by default, a `--jev` arm and a `--deem` arm
- `runtime/tests/debug-next-check.vitest.ts` (proposed) against a synthetic fixture with stub `jev` and `cli-deem` binaries
- One census report and, past the gates, one report per model arm in a directory the operator names
- The `system-spec-kit` docs parent D6 names, written through sk-doc

**Changelog**:
- None. The parent packet has no `../changelog/` folder (checked 2026-09-29).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The vendored claude-jev integration asks one `choice` per debug hypothesis: which of `read_code`, `run_test`, `reproduce` or `instrument` is the cheapest way to confirm or rule it out (`../context/external repo's/claude-jev-main/src/domain/catalog/hypotheses.ts:10-15`, `:41-45`). This repository's debugging runs through a prompt. The `@debug` agent's Phase 3 asks each hypothesis for a "Validation Test" and ranks hypotheses by confidence, evidence, simplicity, reversibility and freshness (`.skilled/agents/debug.md:246-276`), and the shared methodology says to test one variable at a time (`.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:79-94`). No code line runs at that step, so nothing could spawn a call there.

The research parked R18 as `later` because it has no seam and no reader (`../007-classifier-deep-research/research/research.md:428`), and its kill line is that the choice loses to "always `read_code`". This leaf's search on 2026-09-29 confirms the gap. No tracked file outside `specs/` and outside the generated trigger-phrase fixture folder names `next_check` today (`git grep -l next_check -- ':!specs'` once printed nothing, and the final search excludes that folder and the census's own files). One tracked `debug-delegation.md` exists outside the template. No tracked spec file holds the agent's `### Hypothesis <n>` heading. So there is no mined corpus either. As the operator's brief says for a missing seam, this phase measures offline over a fixture corpus and records the seam as an open question. Only the operator can label which check settled a hypothesis, so it stops at a label gate, as 003 and 006 did (parent D4).

### Purpose

Settle, on a counted number per backend, whether a Jev or Deem choice of the cheapest next check beats the best constant answer on operator-labeled debug hypotheses, with the seam search and the constant baselines printed first and nothing changed for anyone who passes neither `--jev` nor `--deem`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A zero-call census: the seam search (REQ-002) and, for an operator-named fixture, rows, label counts, each constant answer's accuracy and the headroom line.
- A fixture schema the operator fills outside the repository, and a label gate of at least 30 labeled rows (REQ-005).
- A payload gate for Jev, because the rows are the operator's own debug notes: Jev reads only rows the operator marked `jev_ok`, and Deem runs every row (REQ-007).
- A Jev arm behind `--jev` and a Deem arm behind `--deem`, each asking one `choice` over the four checks per row in three option orders, with one verdict per backend column under the Keep Rule (REQ-004, REQ-008).
- Jev first, then Deem (parent D1). No failover.
- The `system-spec-kit` skill docs parent D6 requires, through sk-doc (REQ-011). `system-spec-kit` owns the debugging methodology reference, so the script lives in its runtime beside `runtime/scripts/compaction-recall/`.

### Out of Scope

- Any caller in the debug workflow, any edit to `.skilled/agents/debug.md`, its runtime mirrors or `universal-debugging-methodology.md`, and any reordering of debug phases. A caller needs a named seam, a named reader, a `keep` and a later phase, and opening it is the operator's call.
- A model writing a fixture row or a label.
- Mining this repository for hypotheses. The census shows there is nothing to mine.
- A shared client, a global switch, the npm `jevctl` package and a dollar figure in any cost line.

### Files to Change

Owner of every code path below: `system-spec-kit`. The code follows its runtime's contracts, the runtime's own vitest config and sk-code's OpenCode route. The docs go through sk-doc's modes (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Create | Seam search, fixture reader, constant baselines, label and payload gates, both arms and the Keep Rule. Built at 1,570 lines, against a 350 to 450 LOC estimate |
| `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | Create | Synthetic-fixture, stub-`jev` and stub-`cli-deem` cases, beside phase 005's `compaction-recall.vitest.ts`. Built with 31 cases in 752 lines |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modify | One row for the new folder |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Parent D6: one sentence naming the offline measurement and saying no debug step changes |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Parent D6: one line naming the script, its zero-call default, the gates and the two switches |
| `.skilled/skills/system-spec-kit/changelog/v<next>.md` | Create | Parent D6, through `sk-create-changelog`. The newest file at planning is `v4.3.0.0.md`, and the version reads the newest file present at doc time (ruling 2). Built as `v4.6.0.0.md` |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md` and `feature-catalog.md` | Create, Modify | Parent D6: one entry (proposed name) and its index row |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md` and `manual-testing-playbook.md` | Create, Modify | Parent D6: the census, the label-gate stop and a stub-backend skip, plus the index row. Built as scenario 463 |
| Generated copies (the Hermes `SKILL.md`, leaf manifests, trigger index) | Regenerate | Only when their own checks report them stale after the doc edits |
| `<operator-named fixture>`, `<operator-named report dir>/` | Read, Create at run time | The labeled rows, and `report.json` with `calls.jsonl` from a model run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero model calls | Without `--jev` or `--deem` the script prints the census, never spawns `jev` or `cli-deem` and writes no file unless `--out` names one. Logging stub binaries first on `PATH` log nothing |
| REQ-002 | The seam search is a fixed rule | The census prints `seam: none` unless a tracked file outside `specs/` names `next_check`, then the counts of tracked `debug-delegation.md` files outside `templates/` and of tracked spec files holding a `### Hypothesis <n>` heading, as `mined rows: 0` when both give no row. It never reads a transcript or a session file |
| REQ-003 | The baselines and headroom come before any call | On the labeled rows the script prints the accuracy of each constant answer, `read_code`, `run_test`, `reproduce` and `instrument`. The baseline is the best of the four, ties to `read_code`, the research's kill line. When it is right on more than 90 percent of labeled rows, the scorer prints `no headroom` and runs no arm |
| REQ-004 | The Keep Rule is fixed here, before any model run, per backend column | See the Keep Rule below. The verdict line prints on stdout and in that column of `report.json` |
| REQ-005 | The label gate stops every arm until 30 rows are labeled | `--fixture <file>` (proposed) names a JSON lines file outside the repository, and a path inside exits 2. Each row holds `id`, `symptom`, `claim`, `evidence`, `label` and `jev_ok`. `label` must be one of the four keys, and any other value is named by row id with exit 2. Fewer than 30 labeled rows prints `stop: fewer than 30 labeled rows`, runs no arm and exits 0. No model writes a row or a label |
| REQ-006 | Each arm is dormant unless its own switch is set and its gate passes | Jev: an identity line with the `jev` path and P first, then `command -v jev` (`jev arm skipped: jev not on PATH`), `jev --version` printing exactly `jev 0.6.2` (`jev arm skipped: version` plus a details line) and `jev auth status --provider P` exiting 0 (`jev arm skipped: no credential`). One `jev auth test --provider P`, and the same P on every judgment. Deem: `cli-deem health` within 2,000 ms printing backend, model id and commit pair, else `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. Each skip leaves the census and the other column byte-identical and exits 0. The script never starts the server |
| REQ-007 | No key in any file, and the payload gate holds Jev | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` on the script returns no match. The rows are the operator's debug notes, so Jev reads only rows whose `jev_ok` is `true`, set by the operator after stripping secrets. Other rows are `unmeasured_withheld` in the Jev column. With no accepted row the Jev arm prints `jev arm skipped: payload not accepted`. Deem keeps the payload on the machine and runs every row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The call shape is fixed and shared | Each row goes to `jev choice --provider P` or `cli-deem choice` on stdin with `-q "What is the cheapest way to confirm or rule out this hypothesis?"`, adapted from `hypotheses.ts:43` and fixed before any run, the state `Symptom:`, `Hypothesis:` and `Evidence:` lines and the four options with their descriptions verbatim from `hypotheses.ts:11-14`. Three option orders, the list in that file's order, then rotated left by one, then by two, with no answer cache, so for Jev the three orders are also its three reruns. The modal pick is the key at least two orders name, and three different keys make the row `unstable` |
| REQ-009 | Every call and exit has one handling, and the cost prints first | The Deem arm prints "nothing leaves the machine", planned calls and a wall-time estimate at 65.6 ms labeled as the 2-option p50 of `deem-local.md`. The Jev arm prints the payload class (operator debug notes marked `jev_ok`), planned calls and estimated input tokens, never a dollar figure. `calls.jsonl` holds one line per call with row id, order index, wall ms, exit code, backend, pick, its probability and a status of `measured`, `unmeasured`, `unmeasured_timeout` or `unmeasured_withheld`, with the commit pair on Deem lines and version, provider and model on Jev lines, and no row text. Exits follow phase 002's handling: Deem 1 or HTTP 400 `unmeasured`, 2 stop, 3 `deem arm stopped: backend refused`, 4 one health recheck (`model commit changed mid-run` or `server gone`), 130 `interrupted`. Jev 1 `unmeasured`, 2 stop, 3 after the gate `jev arm stopped: key rejected`, 4 one backoff retry, past 90 s `unmeasured_timeout`, 130 `interrupted`. A stopped arm prints no verdict. `--jev` or `--deem` without `--out` exits 2 before any call |
| REQ-010 | A keep holds only for what it was measured on | The report records the Deem commit pair or the Jev version, provider and model per column, and a later run on a different one prints `requalify: model commit changed` or `requalify: model changed` first |
| REQ-011 | Tests cover every public surface, and the docs stay true (parent D6) | `debug-next-check.vitest.ts` exits 0 with 31 cases and one edge case each: the default run logs no stub call and `--jev` without `--out` exits 2, the seam search prints `seam: none` on a clean tree, names a planted `next_check` file and leaves out the census's own files, the fixture reader accepts a valid row and rejects an unknown label and a path inside the repository, the gate stops at 29 rows and passes at 30, the constant baselines pick the best and tie to `read_code`, `no headroom` prints above 90 percent, the payload gate withholds a row without `jev_ok` and skips Jev with none accepted, the Jev gate passes a stub and skips on exit 3, the Deem gate passes a fake health and skips a stub backend byte-identically, a Deem exit 4 with a new pair stops the arm, no logged call carries row text in `calls.jsonl` and the verdict prints `keep`, `kill` and `stop (coverage)`. `SKILL.md`, the README, the changelog, the catalog entry and the playbook entry each name the script, the gates and both switches, and `validate_document.py` exits 0 on each |

### Keep Rule (fixed 2026-09-29, before any model run)

**Inputs.** K is the labeled rows. A column's M measured rows are those with three submitted keys. On a measured row the column is right when its modal pick equals the label, and `unstable` is wrong. The baseline (REQ-003) is right when its constant answer equals the label. A and B count the rows the column and the baseline get right among the M rows. W counts the rows only the column gets right and L those only the baseline gets right. F sums each row's non-modal picks, and C is the column's measured calls, 3M. For the Jev column K counts only rows marked `jev_ok`, so withheld rows never sink its coverage.

**Thresholds, in this order.** The first that applies sets the verdict.
1. Coverage: `10*M >= 9*K`, else `verdict <backend>: stop (coverage)`.
2. Kill: the exact one-sided binomial P(X >= L) for X ~ Binomial(W + L, 0.5) below 0.05 prints `verdict <backend>: kill`. This is the research's kill line, a loss to the best constant.
3. Margin: `10*(A-B) >= M`, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W + L is 0, else `stop (sign test)`.
5. Flips: `10*F <= C`, else `stop (flips)`.
6. Otherwise `verdict <backend>: keep`.

**The line.** `verdict <backend>: keep|kill|stop (<reason>) K=<k> M=<m> A=<a> B=<b> W=<w> L=<l> F=<f> p=<p> baseline=<key>`, then `model=<id> model_commit=<sha> source_commit=<sha>` for Deem and `jev_version=<v> provider=<p> model=<m>` for Jev. A stub, fake-server or vitest verdict never counts. A change to this rule after the first model run voids every earlier verdict.

**What a keep means.** It holds for the pair or model on its line only. The record's promote line also needs a caller seam and a reader, so a keep alone never promotes R18, and the debug workflow stays unchanged.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any label or call, the operator reads that no seam and no mined corpus exist, and, once a fixture is named, how well each constant answer does.
- **SC-002**: Past the gates, one run per model arm prints one verdict line per backend column with what it was measured on. At the gate the phase closes on its stop line, as it did: the 2026-09-29 final runs printed `stop: fewer than 30 labeled rows` at exit 0, and no run printed a verdict line.
- **SC-003**: A run with neither switch, or with every requested gate failing, calls nothing, and no Jev call ever carries a row the operator did not accept.

### Proof Plan

1. `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` with logging stubs first on `PATH`: exit 0, lines `seam: none` and `mined rows: 0`, and no stub log.
2. `--fixture <synthetic outside the repo with 29 labeled rows> --jev --deem --out <tmp>`: `stop: fewer than 30 labeled rows`, and no stub logs a call. Boundary: a fixture path inside the repository exits 2.
3. A 30-row synthetic fixture prints four `constant <key>:` lines and a `baseline:` line. Boundary: a fixture where `read_code` is right on 28 of 30 prints `no headroom`. With rows lacking `jev_ok`, `--jev` prints `jev arm skipped: payload not accepted`, and a stub `cli-deem health` reporting `stub` prints `deem arm skipped: stub backend`.
4. From `.skilled/skills/system-spec-kit/runtime`, `npx vitest run tests/debug-next-check.vitest.ts` exits 0 with at least 22 passed tests and 0 failed, the invocation phase 005 used for its own test file there.
5. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script prints nothing, `git status --porcelain` is the same before and after every run and `git diff --stat .skilled/agents/` is empty at close.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's labeled fixture | No model arm can run without it | The gate stops cleanly, and the phase can close there |
| Risk | The fixture comes from memory, not recorded sessions, since the repository holds none | Med | The census says `mined rows: 0`, and the report names the fixture's SHA-256 so a verdict is tied to one row set |
| Risk | Rows hold private notes | High for egress | The payload gate withholds every row not marked `jev_ok`, and `calls.jsonl` holds no row text |
| Risk | The best-constant baseline is picked on the same rows it is scored on | Low | It can only make the baseline harder to beat, and it includes the research's `read_code` kill line |
| Risk | No seam and no reader | A keep cannot promote R18 | The open questions keep both, and the keep line says a keep changes no workflow |
| Dependency | Owner placement | `system-spec-kit` owns the methodology reference, not the `@debug` agent | The operator can move the script to another owner before the build, which is an amendment |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where would a caller live? UNKNOWN. The debug step is a prompt (`.skilled/agents/debug.md:246-276`), so a caller would be a new script or hook that the agent invokes, and no such line exists. The record's promote line needs it named.
- Who reads a logged `next_check`? UNKNOWN. The record's promote line needs a reader named with the caller.
- Are 30 labeled rows enough? They match phase 003's floor, `stop: fewer than 30 rows` (`../003-goal-verifier-jev-shadow/spec.md:160`). Widening them is an amendment before the first model run.
- Should the script live under `system-spec-kit`? It owns the debugging methodology reference. The operator may prefer another owner.
<!-- /ANCHOR:questions -->

---
