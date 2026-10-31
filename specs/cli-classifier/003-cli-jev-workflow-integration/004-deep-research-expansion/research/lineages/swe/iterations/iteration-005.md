# Iteration 005 — swe-05: Build order in code: files, LOC, tests, switches and rollback per phase

- **Wave:** W3 (own iterations 1–4 re-read; newest sibling of each lineage read)
- **Maps to:** RQ7, RQ1.
- **Executor:** cli-devin model=swe-2-max (inline, no dispatch)
- **Date:** 2025-12-02

## Focus Area

swe-05 — the build order rendered in code terms: ordered phases with exact files, functions, LOC, tests, switch names and rollback sentences; the first PR-sized slice and its observable check; what becomes shared at the third caller; code-level failure modes and the printed line for each; each phase's kill rule.

## Sibling Check

- `lineages/deepseek/iterations/iteration-005.md`: failure matrix + kill table + F6 order (redaction report → the two censuses → 002's arm → 006 lint + 003 slice → conditional arms). Adopted wholesale; this iteration adds the per-file/LOC/test decomposition underneath it.
- `lineages/grok/iterations/iteration-005.md`: single-phase selection = 002's zero-call census; `planned_n != request_list_length` dry-run line (N-grok-04-2) adopted into the arm's pre-flight; vendor dollar figures replaced by `planned calls: N, about T input tokens`.
- `lineages/mimo/iterations/iteration-002.md`: lint placement inside `create-goal-auto.yaml` (N-mimo-02-2) and `rubric`-versioned labels adopted into Phase 4a.
- Own iterations 1–4 re-read: R1 function decomposition + sign-test table (001), census parser + estimator + replay design (002), driver path + missing tail-window arm + redaction diffs (003), parser-copy design + skip-line table + label schema (004).

## Findings

### Q1 — Ordered phases in code

**Phase 0 (owner report, not a build):** the two redaction diffs — `opencode-goal.js:474` `\b`→`(?<![A-Za-z0-9])`; `secret-scrubber.ts:128` same plus `service` in the prefix set — each with its unit case (swe-03 Q3). No Jev flag; lands before any egress, *after* the censuses is fine (grok-05 F5 wording). Rollback: revert two regex lines + two tests.

**Phase 1 — 002 census slice (`score-jev-tiebreak.mjs`, ~180 LOC of its ~330 total).** Dir: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`. Functions: `loadCorpus` (three JSONL corpora, counts 195/70/24 asserted), `classifyRows` (eligible/movable/`gold_demoted` per swe-01 — alias membership via `mergedSkillForAlias`/`skillMatchesAlias` copied from `capture-scorer-eval-baseline.mjs:49,70-76`), `reprintBaseline` (deterministic env of `:35-46`; must print `53/70`), `signTest` (min-wins table from swe-01), `report`. **Switch:** none — census is the default run. **Tests** (vitest): baseline reproduces `53/70` against pinned `scorer-eval-baseline.json`; movable/gold_demoted accounting on a synthetic corpus; `no headroom` on zero-movable. **Rollback:** delete the file and its report; corpora and baseline are read-only (REQ-006).

**Phase 2 — 005 census (`score-compaction-recall.mjs`, ~730 LOC, swe-02 table).** Dir: `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/`. Functions: `parseTranscript`+closed `KNOWN_TYPES` stop rule, `toMessages`, `estimateTokens`/`fitState` port, `collectToolCalls` port, five must-survive rules, `--replay` hook into built `compact-merger`, `report`. **Switch:** none; `--replay` is the only flag (no `jev` anywhere). **Tests** (6): boundary+missing-written-file → 1 violation; unknown `type` → named-error non-zero exit; malformed JSONL → same; **zero-compaction dir → `compactions=0`, exit 0**; all-rules-satisfied → 0 violations; oversized → `fitError` recorded. **Rollback:** delete the directory and reports.

**Phase 3 — 002 billed arm (+~350 LOC on the same file).** Functions: `gate()` — ordered `command -v jev` → `--version`===`jev 0.6.2` → `auth status`===0 (002 REQ-002, split `skipped:`/`refused:` per swe-04's table); `preflight()` — prints payload class + `planned calls: N` reconciled against the request list (grok's `planned_n != request_list_length`); `askJev(row)` — spawn with `-s -` stdin (swe-01's fix of plan.md:71), per-call wall-clock cap (see Q4 gap), exit map per REQ-010; `rerunLoop` ×3; `stability` = `1−stddev/mean ≥ 0.95` (`benchmark-stability.cjs:102-108`); `calls.jsonl` writer (REQ-009). **Switch:** `--jev`. **Tests:** stub `jev` on PATH — gate-exit-3, exit-4-once-retry, exit-2-stop, key∉set→`unmeasured`, keyless run byte-identical to census. **Kill:** `verdict: kill` (sign test favors scorer) closes R3; `baseline mismatch`/`missing_answer_in_win_row` void the run. **Rollback:** delete file+reports; `git status` clean (REQ-006).

**Phase 4a — 006 lexical lint (~200 LOC lint + ~80 scorer + labels file + ~90 LOC tests, swe-04).** Dir: `.skilled/skills/sk-doc/sk-create-goal/scripts/`. `lint-goal-criteria.cjs`: goal-slice imports + parser copies (~60) + `rule4DanglingRefs` + `rule5ExternalFile` + scratch-skipping walker; `score-goal-lint.cjs` joins `goal-criteria-labels.jsonl` (`text_sha`-pinned, `stale` counted). **Switch:** none (advisory, always exit 0); optional one line in `create-goal-auto.yaml` before `step_check` (:220-221) — owner: sk-doc. **Kill:** `r20 jev arm not built: labeled_violation_rate<0.05`. **Rollback:** delete script+test+labels+workflow line; `check-goal.cjs` byte-unchanged.

**Phase 4b — 003 zero-call slice (~280 scorer + ~140 fixture builder + ~7 tests, swe-03).** Files: `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs`, `build-verifier-fixture.cjs`, `verifier-labeled-set.jsonl`, test file. Functions: `runHeuristicArm` (`__test.writeGoalAtomic`+`maybeVerifyGoal`, mkdtemp stateDir — zero new exports), `runTailWindowArm` (**addition** — 003's docs omit it, D-a), `runGoalCoreParityArm` (`goal-core.cjs:1611` export), `normalizeVerdict` (REQ-005 + `unclear` kept as own row), attribution via the five reason strings. **Switch:** none until `--jev`. **Kill:** `stop: fewer than 30 rows`; `stop: no headroom`; `stop: no reachable rows`. **Rollback:** delete the three files + report; plugin untouched.

**Phase 5 — conditional arms (all later):** R21 rides Phase 3 only on `verdict: underpowered`; R19 arm only past census clearance + Phase 0 + operator payload acceptance + Q18; R20 arm only past ≥5% labeled rate; R2 arm + `OPENCODE_GOAL_VERIFIER=jev` shadow only with recorded verifier use — **currently zero** (swe-03 census: 5/5 `not_evaluated`) so presently unbuildable. Shadow is the only live-path touch (deepseek-05): `VALID_VERIFIER_MODES` :134 + branch :231-234 + session-cached gate + bounded async spawn + `appendGoalJsonl` shadow record + `show` `verifier_shadow=` field (BASE R-l — missing from 003's file list, D-c). Rollback: remove the enum value, its branch, shadow call, two doc rows — unknown value falls back to `heuristic` (:226-229).

### Q2 — First PR-sized slice and its observable check

**002's census slice** (Phase 1): smallest stop-line-bearing artifact (grok-05 F1/N-1 concur). Observable check: `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` prints corpus counts, `holdout top-1: 53/70`, eligible/movable/`gold_demoted` per split, and one of `no headroom` / `verdict: underpowered` / a movable count; `git status --porcelain` shows only the script + report dir; a stub `jev` first on PATH leaves an empty invocation log (REQ-001).

### Q3 — What becomes shared at the third caller, and when

- **The Jev client wrapper** (probe + bounded spawn + exit map + strict parse, ~60–80 LOC per deepseek-07): caller 1 = Phase 3's `askJev`, caller 2 = Phase 4b's optional Jev arm, caller 3 = whichever of R19's/R20's arms is built first — **extraction happens at that third arm's build, not before** (BASE three-caller rule; What-Not-To-Build row 27).
- **The skip-line vocabulary** is shared by *text* across R1/R19/R20/R2 now (swe-04's table) and deliberately never becomes a helper — three consumers each own their copies.
- **Nothing else qualifies:** the transcript parser has one consumer (005), the label scorer one (006), the goal-state driver one (003). `clampText`'s defect fix would be a shared change but belongs to the plugin/goal-core owners, reported — not adopted.

### Q4 — Code-level failure modes and their printed lines

| Phase | Failure mode | Printed line |
|---|---|---|
| 1 census | corpus sha/count drift | `baseline mismatch: comparison void` |
| 1 census | <5 movable rows | `verdict: underpowered` (closes nothing) |
| 2 census | unknown record shape | `unknown record shape: <t> at <file>:<line>`, non-zero exit |
| 2 census | **replay version skew — no existing line** | **new: print `replay_version=<sha256[:12] of built compact-merger.js>` on every replayed row, or `replay_unavailable: dist missing`; without it a rebuilt merger silently produces a different brief than hook-time** |
| 2 census | state over 25k ceiling | `fitError: history too large for Jev` per boundary row |
| 3 arm | gate fails | `jev arm skipped: jev not on PATH` / `jev arm refused: expected jev 0.6.2` / `jev arm skipped: no credential` |
| 3 arm | **spawn that never exits (hang) — no existing line** | **new: REQ-009/010 record wall time and map exit codes but name no per-call cap; add spawn `timeout` + `unmeasured_timeout` status — a hanging `jev` currently hangs the arm forever (003 fixed this class at :49's 30 s; 002 did not)** |
| 3 arm | exit 3 mid-run | `jev arm stopped: key rejected`, rows `partial` |
| 3 arm | missing answer in a win row | report illegal — `r1 not served: missing_answer_in_win_row` |
| 4a lint | label line edited after labeling | `stale=N` in scorer output |
| 4a lint | scratch fixture enters corpus | walker excludes `**/lineages/**/scratch/**`; counted separately (swe-04) |
| 4b slice | <30 valid rows | `stop: fewer than 30 rows` |
| 4b slice | all false-`not_met` rows wrapper-held | `stop: no reachable rows` |
| 5 shadow | key rejected mid-session | one line, shadow disabled for session (REQ-011) |
| 5 shadow | shadow error reaching `blocked` catch | **must never happen** — shadow errors skip the record only (:2378-2386 is verdict-authoritative) |

### Q5 — Kill rules in code terms

| Phase | Kill (printed result) |
|---|---|
| 1/3 (R1) | `baseline mismatch: comparison void`; `verdict: kill` (sign test at α<0.05 favors scorer on movable rows); `verdict: underpowered` closes nothing and starts nothing |
| 2 (R19 census) | `unknown_record_shape` on >50% of sampled sessions; any transcript text in the report; `fit_throws>=50%` or `offline_reduction_upper_bound<0.25` closes the *arm* only |
| 4a (R20) | `r20 jev arm not built: labeled_violation_rate<0.05`; `r20 jev arm not built: command was jev verify` |
| 4b (R2 slice) | `stop: fewer than 30 rows` |
| 5 (arms/mode) | `r2 jev arm not built: no recorded OpenCode or Pi verifier use` — **currently firing** (5/5 `not_evaluated`, swe-03); `r21 not built: r1 was not underpowered`; any added false `met` in R2's keep rule |

## Ruled Out

- **Extracting the Jev client wrapper before the third caller** — rejected per the three-caller rule; the skip-line vocabulary stays text-shared forever (swe-04).
- **Merging the two censuses into one script** — rejected: different owners (advisor vs spec-kit), different input domains (corpora vs transcripts), and each must be independently deletable for rollback.
- **Starting 003's slice before 002's latency record** — BASE :1259 + proof-plan step 5: a shadow that mostly times out measures nothing; order holds.
- **Putting the redaction fix inside any Jev phase** — rejected (grok-05 F5): it is an owner-facing two-line diff, not a phase; coupling it to a phase would gate an unrelated security fix on a research schedule.

## New Information

- **Two failure modes no printed line reports**: (a) replay version skew on 005's `--replay` (fix: `replay_version=` per row / `replay_unavailable`), (b) a never-exiting `jev` spawn on 002's arm (fix: per-call timeout + `unmeasured_timeout` status — 003's 30 s `DEFAULT_VERIFIER_TIMEOUT_MS` :49 is the existing pattern 002 lacks). [SOURCE: this iteration; 002 REQ-009/010 vs opencode-goal.js:49]
- **Census/arm LOC split for 002**: ~180 census / ~350 arm of the ~330–530 total — the two halves land as separate commits with separate kills. [SOURCE: swe-01 + this decomposition]
- **D2 is settled by count**: 5/5 records `not_evaluated` ⇒ the R2 arm/plugin mode kill rule fires *today*; "recorded verifier use" is not a maybe. [SOURCE: swe-03 census]

## Metrics

- **newInfoRatio:** 0.75 — synthesis iteration: the order itself adopts deepseek-05/grok-05, but the file/LOC/test/switch/rollback decomposition, the two unreported failure modes, and the census/arm commit split are new.
- **Novelty justification:** renders the sibling-agreed build order into an implementable table where every phase carries its exact files, switches, printed failure lines and kill predicates — and surfaces two failure modes no printed line currently reports.

## Hand-off to Synthesis

All five swe angles are closed. The lineage's deliverable to round-2 synthesis: (1) the decided-universe + `-s -` + power-table corrections to R1, (2) the Q25 negative answer + replay design + `detectSpecFolder` defect for R19, (3) the driver path + missing tail-window arm + zero-recorded-verifier-use for R2, (4) parser-copy + scratch-corpus + skip-line table for R20, (5) this build order with per-phase kills.
