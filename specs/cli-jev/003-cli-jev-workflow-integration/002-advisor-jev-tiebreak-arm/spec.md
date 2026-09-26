---
title: "Build Phase: Offline Advisor Jev Tie-Break Arm"
description: "Measure, offline and by hand, whether a Python jev-cli choice over the skill advisor's near-tie cluster beats the scorer's own order on held-out rows. The default run is a zero-call census plus a baseline column, and the Jev arm runs only behind --jev with a key that resolves."
trigger_phrases:
  - "advisor jev tie-break arm"
  - "jev choice near-tie cluster"
  - "score-jev-tiebreak"
  - "advisor ambiguity cluster jev"
  - "jev arm skipped no credential"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Build Phase: Offline Advisor Jev Tie-Break Arm

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-26 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-goal-verifier-jev-shadow |
| **Handoff Criteria** | The census has printed eligible and movable row counts, and either it reported no headroom or the arm has produced both columns, a stability coefficient and a per-call JSONL with a wall time for every call. 003's plugin mode reads that latency record |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the cli-jev workflow integration specification. It builds recommendation R1, the only build-now item in `../001-deep-research/research/research.md` (section 11, `### R1.`, and section 13, `### 002-advisor-jev-tiebreak-arm`).

**Scope Boundary**: One new, read-only measurement script beside the existing routing-accuracy evals. It changes no existing file, serves nothing and never runs inside a hook, so every live advisor path behaves as today by construction.

**Dependencies**:
- The built advisor `dist` under `.skilled/skills/system-skill-advisor/runtime/dist/`, which the script imports as `score-outcome-rerank.mjs:35-38` does
- For the arm only: the Python `jev-cli` 0.6.2 on PATH and a credential that `jev auth status` resolves. Neither is needed for the default run

**Deliverables**:
- `score-jev-tiebreak.mjs` with a zero-call census and baseline column by default, and a `--jev` arm
- A report and a per-call JSONL in a directory the operator names, from one keyed run

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nobody has measured whether a Jev `choice` would order the skill advisor's near-tie cluster better than its own fused scores. The advisor already names its near-ties: `applyAmbiguity` gives every passing recommendation within 0.05 of the passing top, on score or on confidence, an `ambiguousWith` list (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:7-8`, `:44-58`). Inside that cluster the fused order decides which skill comes first. A live Jev call in the advisor cannot be tested at all, because the prompt hook kills the advisor child at 2500 ms. The recorded baselines leave room to improve: holdout top-1 is 53/70 = 0.7571, and the ambiguity slice is 18/24 = 0.75 at tau 0.03 (`routing-accuracy/scorer-eval-baseline.json:25-35`). How many held-out rows have the gold skill inside the cluster but not first is UNKNOWN.

### Purpose

Produce a number that settles whether a Python `jev-cli` `choice` over the advisor's near-tie cluster beats the scorer's own order on held-out rows, at zero calls and zero behavior change for anyone who has no Jev key or does not pass `--jev`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A census, with zero Jev calls, of eligible rows (the passing top has an `ambiguousWith` cluster) and movable rows (the gold skill is in the cluster but not first), for the held-out half of the labeled corpus and for the 70-row holdout file. It reports both the live 0.05 cluster and membership in the frozen tau 0.03 slice.
- A baseline column: the scorer's own order, scored with MRR, right@1 and right@3 on the held-out half, and alias-aware top-1 on the holdout file.
- A Jev arm behind `--jev`: one `jev choice` per eligible row per pass over the cluster keys plus `none`, Jev's pick moved first inside the cluster, three passes, and the same metrics on identical rows.
- A per-call JSONL and a report written to a directory the operator names.

### Out of Scope

- Any live, served or hook-time Jev call in the advisor. The hook kills the child at 2500 ms, and serving a pick before this phase measures it is on the synthesis's what-not-to-build list.
- Editing `score-outcome-rerank.mjs`. Its header promises a read-only eval of outcome weights (`:17-23`) and its flip rule decides that flag (`:149-150`), so a network arm would change what it means.
- Writing `scorer-eval-baseline.json`, the corpus files or the advisor ratchet. They are pinned by hash (`scorer-eval-baseline.json:5-7`) and a network arm is not deterministic.
- An answer cache across passes. Cached answers make the flip rate zero by construction.
- A shared Jev client helper, a new command or a `cli-jev` mode. This script is the only caller.
- The npm `jevctl` package. It also installs a `jev` binary, with a different exit contract, and the arm refuses it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Create | The census, the baseline column and the `--jev` arm, about 150 to 200 LOC. Proposed name from the research |
| `routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` | Read only | The rows scored and the frozen tau 0.03 slice |
| `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/*.js` | Read only | The built scorer, projection and alias helpers the script imports |
| `<operator-named report dir>/` | Create at run time | `report.json` and `calls.jsonl` from a keyed run. Outside the repository unless the operator names a path inside it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero Jev calls | Without `--jev`, the script prints the census and the baseline column and never spawns `jev`. A stub `jev` placed first on PATH that appends one line per invocation to a log leaves that log empty |
| REQ-002 | The arm is gated, in order, before any call: `command -v jev`, then `jev --version` printing exactly `jev 0.6.2`, then `jev auth status` exiting 0, and only when `--jev` is set | With `--jev` and `jev auth status` exiting 3, stdout contains `jev arm skipped: no credential`, the census and baseline match the default run and no judgment runs. With no `jev` on PATH the arm prints `jev arm skipped: jev not on PATH`. With a `jev` whose version line is not `jev 0.6.2`, such as the npm `jevctl`, the arm prints `jev arm refused: expected jev 0.6.2` and makes no further call. Every gate failure still exits 0 with the census and baseline intact |
| REQ-003 | The script never handles a credential | It never reads, stores, logs or passes a key. `jev` resolves its own from the credential store or an exported `TYPESAFE_API_KEY`. `grep -n API_KEY score-jev-tiebreak.mjs` returns no match, and no spawned argument list carries a key |
| REQ-004 | The census counts headroom per split | The report prints eligible and movable counts for the held-out half and the holdout file, at the live 0.05 cluster and within the frozen tau 0.03 slice. Zero movable held-out rows prints `no headroom` and the arm does not run, even with `--jev` |
| REQ-005 | The baseline column reproduces the recorded baseline | Under the capture's deterministic env (`SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, an empty `SYSTEM_SKILL_ADVISOR_DB_DIR`, the filesystem projection, as `capture-scorer-eval-baseline.mjs:35-46` sets it) and its alias-aware match (`:70-76`), holdout top-1 prints 53/70. Any other number prints `baseline mismatch: comparison void` and the arm does not run |
| REQ-006 | The script is read-only | After a default run and a keyed run, `git status --porcelain` lists only `score-jev-tiebreak.mjs` and, if the operator named one inside the repository, the report directory. The corpus files and `scorer-eval-baseline.json` are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The arm reports both columns on identical rows | The report carries MRR, right@1 and right@3 for the scorer column and the Jev column on the same held-out rows, the delta, the unmeasured-row count beside each metric and a `keep` verdict that is true only when Jev MRR is higher and Jev right@3 is not lower, the rule at `score-outcome-rerank.mjs:149-150` |
| REQ-008 | The arm is stable over three passes | The arm runs three passes with no answer cache and prints a stability coefficient, 1 minus stddev over mean of the Jev column's MRR, as `benchmark-stability.cjs` defines it with its 0.95 threshold. Below 0.95 the report marks the gain as not counted |
| REQ-009 | Every call is recorded | `calls.jsonl` has one line per spawned `jev` call with row id, pass, wall time in ms, exit code, `jev` version, provider, model, the answer key or none and a status of `measured`, `abstained` or `unmeasured`. Provider and model come from one `jev auth test` at the start of the arm |
| REQ-010 | Every exit code has one handling | Exit 0 with a key in the submitted set is a pick. `none` keeps the scorer's order and counts as an abstention. Exit 1, or a key outside the submitted set, marks the row `unmeasured`. Exit 2 marks the row `unmeasured` and stops the arm, because it means the script built a bad command. Exit 3 stops the arm and reports finished rows as `partial`. Exit 4 gets one backoff retry, then the row is `unmeasured`. Exit 130 stops the arm as `interrupted`. No path writes a default score |
| REQ-011 | The operator sees the cost before the first billed call | Before `jev auth test`, the arm prints the payload class (routing corpus prompts and skill projection descriptions) and the planned call count, eligible rows times three passes plus one |
| REQ-012 | The win is not a tau 0.03 artifact | The report splits the Jev column's gain into rows inside and outside the frozen tau 0.03 slice. A gain found only inside that slice is reported as not kept |

### Edge Cases

- **No key.** `jev auth status` exits 3. With `--jev` the output says `jev arm skipped: no credential`, and the rest of the run is byte-identical to the default run. Confirmed live on 2026-09-26: `jev auth status` exits 0 for a stored key or an exported `TYPESAFE_API_KEY`, exits 3 with none, never prints the key and spends no quota.
- **A bad key.** `auth status` checks presence, not validity, so a rejected key passes the gate. It surfaces as exit 3 on the first billed call, `jev auth test` or the first `choice`. The arm stops and reports the finished rows as `partial`.
- **The wrong `jev`.** The npm `jevctl` also installs a `jev` binary, and its exit 2 means a tripped `--fail-on` gate. The version gate refuses anything but `jev 0.6.2` before any exit code is read.
- **Exit 4.** Rate limit, 5xx or timeout. One backoff retry, then `unmeasured`. Never read as a judgment.
- **Exit 1 or 2.** Exit 1 marks the row `unmeasured`. Exit 2 also stops the arm.
- **A malformed answer.** Stdout that does not parse, or a `choice` key that was not submitted, marks the row `unmeasured`.
- **A `none` answer.** Jev declines every cluster key. The scorer's order stands and the row counts as an abstention, reported apart from `unmeasured`.
- **Unmeasured rows.** They leave both columns, so the comparison stays on identical rows, and their count prints beside each metric.
- **Stdin.** The script always feeds the prompt text to stdin and closes it, since `jev` reads stdin to EOF and would hang on an inherited terminal.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator knows, from one keyed run, whether a Jev `choice` inside the near-tie cluster beats the scorer's order on held-out MRR and right@3, or knows from a zero-call census that no headroom exists.
- **SC-002**: A machine with no Jev key, or a run without `--jev`, sees no new behavior and no call.

### Proof Plan

Written before the build, from the research's R1 proof plan.

1. `node score-jev-tiebreak.mjs` with no key prints eligible and movable row counts per split. Boundary: zero movable held-out rows means the report says `no headroom` and the work stops there.
2. The baseline column on the holdout file reproduces 53/70 under the pinned env. Boundary: any other number means a stale `dist` or a different scorer, and the comparison is void.
3. With a key and `--jev`, the report carries MRR, right@1 and right@3 for both columns on identical rows, and `calls.jsonl` carries wall time, exit code, `jev` version, provider and model for every call. Boundary: an exit 4 row is `unmeasured`, never a pick.
4. Three passes give a stability coefficient of at least 0.95. Boundary: below that, a mean gain does not count.
5. `git status` shows no change outside the new script and its report directory. Boundary: any write to the corpus, `scorer-eval-baseline.json` or the ratchet fails the arm.

**Kill criterion.** If the arm does not beat the scorer's order on held-out MRR or right@3, the served forms of this idea (research R3) are dropped. For the other closed-set `choice` ideas a loss is evidence, not a verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor `dist` build | The script cannot import the scorer, or scores with a stale one | Build `dist` first. REQ-005 voids the comparison when the baseline is not 53/70 |
| Dependency | A Jev credential | The arm cannot run | The default run needs none. The arm skips with `jev arm skipped: no credential` and the operator sets a key |
| Risk | Headroom is small: at most 6 rows can move on the ambiguity slice and 17 on the holdout | Med | The census counts movable rows before any call and stops at zero |
| Risk | Corpus prompts and skill descriptions leave the machine | Low. Both are authored in this repository, and prompt provenance was not checked | The arm prints the payload class before the first call. It sends no secret and no session content |
| Risk | Two eligibility rules, the live 0.05 cluster and the frozen tau 0.03 slice | Med | Report both. REQ-012 refuses a win found only in the tau 0.03 slice |
| Risk | A reordered MRR gain that is noise | Med | Three passes, no answer cache and the 0.95 stability threshold |
| Risk | Cost | Low | The ceiling is 88 held-out rows plus 64 skill-firing holdout rows, times 3 passes, for 456 calls, about $0.05 at the vendor-claimed price (inferred arithmetic on a vendor claim) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many held-out rows are movable? The census answers it with zero calls.
- Can provider and model be read from each `choice` output, or only from `jev auth test`? Reading one judgment's JSON at build time answers it. The plan records them from `auth test` until then.
- Is any routing corpus prompt private? The corpus authoring history answers it. The operator decides before the first keyed run.
<!-- /ANCHOR:questions -->

---
