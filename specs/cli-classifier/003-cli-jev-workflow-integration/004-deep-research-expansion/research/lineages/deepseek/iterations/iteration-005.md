---
title: "Iteration 5 — deepseek-05: Failure modes and kill criteria for the survivors, engineering view"
trigger_phrases: []
---

# Iteration 5 — deepseek-05: Failure modes and kill criteria for the survivors

## Focus

Angle **deepseek-05** (W3): *Failure modes and kill criteria for the survivors, engineering view.* Maps to RQ7. W3: all four of my own iterations and the newest file of each other lineage were read first; the sibling check names them.

## Sibling check

- Read `research/lineages/grok/iterations/iteration-005.md` (iteration 5, grok's cap). It read my `iteration-002.md` and contests its "25,000-token fit estimate (unchanged)" column; it also schedules my N-deepseek-01-3 to doc-writing time. Both are addressed below.
- Read `research/lineages/swe/iterations/iteration-001.md` (SWE's first file; its own sibling check read nothing). It adds three R1 code findings I adopt into the failure table: the decided universe must be movable rows only with `gold_demoted` reported apart; the exact sign-test tail table; and the missing `-s -` flag in 002's planned invocation.
- `research/lineages/mimo/iterations/` still holds only iteration-001.md (read in my iteration 3; power table and flip-rate resolution).
- My own iterations 001 to 004 were re-read in this context: the gate matrix (001), the transcript records (002), the Pi await and lint placement (003), the missed-seam scan (004).

## Actions Taken

1. Verified grok's fit-column claim in the vendored source: `buildFittedState` shrinks in **stages** until `tokens <= maxStateTokens` and carries a `stage` field (`state.ts:191-214`, `:225`), throws "history too large for Jev" past the limit (`:305`), and `DEFAULT_OPTIONS` sets `maxStateTokens: 25_000` with `keepThreshold: 0.5`, `preserveRecentMessages: 6`, `maxRequestTokens: 30_000` (`compact.ts:19-27`). I accept the correction; details in F5.
2. Searched the frozen-contract callers named in F2 (verifier mode, create workflow, pinned corpora).
3. Composed the failure matrix and kill criteria from the lines opened across all five iterations; no new repository module was run.

## Findings

**F1 (answers angle question 1). Failure matrix for every survivor: what prints, and what state persists.** The Python `jev-cli` 0.6.2 exit taxonomy is the column set (deepseek-01 F6); "slow" is per-surface.

| Survivor | exit 3 mid-run | exit 4 / slow call | Malformed answer | Wrong package on PATH | State that persists |
|---|---|---|---|---|---|
| **R1 arm** (002) | Stops the arm; finished rows `partial`; proposed line `jev arm stopped: key rejected` (002 REQ-010 as amended) | One backoff retry, then the row is `unmeasured`; no deadline applies, a person runs it | Row `unmeasured`; no default score | Check 2 refuses before any call: `jev arm skipped: <check>` plus found version and binary path (N-deepseek-01-1) | `calls.jsonl` rows with `measured`/`abstained`/`unmeasured`; no pick written for a failed call |
| **R21** (rides R1) | R1's stop; the calibration stops with it | R1's retry rule | Row unmeasured, excluded from accuracy/F1/Brier | R1's refusal; no second identity check | R1's call records only |
| **R19 census** | Not applicable: zero calls, never spawns `jev` | Not applicable | Not applicable | Not applicable | The report file only |
| **R19 later arm** | Same contract as R1 by inheritance (N-deepseek-01-3, doc-time) | Same as R1 | Batch row unmeasured | Same refusal | Batch call records; census output unchanged |
| **R20 lexical lint** | Not applicable: zero calls | Not applicable | Not applicable | Not applicable | Report/labels only |
| **R20 later arm** | Same as R1 by inheritance | Same as R1 | Criterion unmeasured | Same refusal | Criterion call records |
| **R2 zero-call slice** | Not applicable: never spawns `jev` | Not applicable | Not applicable | Not applicable | Fixture rows and the confusion tables |
| **R2 later arm** | Same as R1 by inheritance | Same as R1 | Row unmeasured | Same refusal | Per-call JSONL |
| **R2 plugin shadow mode** | Disables the shadow for the session, one line (003 REQ-011) | Exit 4, timeout or malformed answer skip that one shadow record | Same | Gate runs once per session; unknown `OPENCODE_GOAL_VERIFIER` values fall back silently today (`opencode-goal.js:226-229`) | Shadow JSONL records for completed calls only; the verdict path is untouched |

The one asymmetry worth naming: the OpenCode plugin's live form, not any offline script, is the only survivor whose failure could alter today's user-visible behavior — and only if its errors reach the catch that returns `blocked` (`opencode-goal.js:2378-2380`, deepseek-03 F3). [SOURCE: 002 `spec.md` REQ-002/REQ-010; 003 `spec.md` REQ-003/REQ-011; deepseek-01 F6/F8; deepseek-03 F3]

**F2 (answers angle question 2). Frozen-contract touches, by search, with owners and callers.**

| Survivor | Contract touched | Owner | Callers found |
|---|---|---|---|
| R1, R21 | None. Reads `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and the built `dist` scorer; must never write the corpora or `scorer-eval-baseline.json` (pinned sha256, 002 REQ-006) | system-skill-advisor | New file only |
| R19 census | None. Reads host transcripts; writes its own report | — (host format is unofficial, not a repo contract) | New file only |
| R19 later live form (if ever) | `.claude/settings.json` (tracked, operator-owned) and the early-access function-hook API (`claude-code.d.ts:3024-3026`) | operator / Anthropic host | Edit requires operator consent; `:3024-3026` is not a repo contract |
| R20 script | None (`check-goal.cjs` read-only; exit codes frozen) | sk-create-goal | `SKILL.md:110`, `create-goal-auto.yaml` step_check, templates, tests |
| R20 print placement inside the authoring flow | `create-goal-auto.yaml` (workflow asset) | sk-doc / `/create:goal` | Referenced by `.skilled/commands/create/goal.md` and `commands/create/assets/tests/fixtures/emitted-name-contract.json` |
| R2 zero-call slice | None. New fixture and scorer | — | New files only |
| R2 later plugin mode | `VALID_VERIFIER_MODES` (one in-module consumer: `normalizeVerifierMode` at `opencode-goal.js:249`), the documented env table (`goal-plugin.md:64-74`) and the `show` fields (`:101-103`) | goal plugin | The mode dispatch itself, the docs and the plugin tests; no cross-module caller |

The freeze risk is therefore concentrated in exactly two places: R2's plugin mode (an enum value plus documentation, with the plugin tests as the safety net) and R20's placement (one step in a workflow asset whose owner is sk-doc). Everything else is additive files. [SOURCE: searches this iteration; `opencode-goal.js:226-249`; `.skilled/hooks/goal/goal-plugin.md:64-74`, `:101-103`; `.skilled/commands/create/goal.md`; round-1 seam data]

**F3 (answers angle question 4). Which failure could change today's behavior with no key — and the tests that prove it cannot.**

- **The plugin mode is the only contender.** With `OPENCODE_GOAL_VERIFIER=jev` set and no key, today the unknown value silently falls back to `heuristic` (`opencode-goal.js:226-229`); after the feature, the requirement is one enablement line naming the failed check and verdicts byte-equal to `heuristic`, with zero `jev` spawns. Test: run the plugin's existing suite with the mode set, no key and a stub `jev` first on PATH that appends every invocation to a log; assert the log stays empty, the verdicts equal the `heuristic` column, and no `blocked` verdict carries a Jev reason.
- **Every offline survivor's no-key test is the same stub-PATH log**, per 002 REQ-002's boundary: without its flag the log must stay empty and the output byte-identical to the pre-feature run.
- **One misconfiguration can make "no key" false:** the settings-`env` placement both vendors' docs suggest (`docs/auth.md`) passes the Python gate because it reads `TYPESAFE_API_KEY` from the environment first (deepseek-01 F4/F5). The test that surfaces it: N-deepseek-01-2's key-origin line, asserted with and without the variable exported. This is a visibility fix, not a behavior change.
- **A slow call cannot change no-key behavior anywhere**: offline arms run only under the flag; the plugin shadow is async and skipped on timeout; the Pi form must not await inside `turn_end` (deepseek-03 F6). [SOURCE: `opencode-goal.js:226-229`, `:2378-2380`; deepseek-01 F4/F5; deepseek-03 F6; 002 REQ-002]

**F4 (answers angle question 5). Kill criteria, as printed results, one per survivor.**

| Survivor | Printed kill |
|---|---|
| R1 arm | `verdict: kill` (sign test favors the scorer at 0.05) closes R3's served order and the live form. `baseline mismatch: comparison void` stops the arm before any call. `no headroom` and `verdict: underpowered` close nothing. A win row that contained a missing answer makes the report illegal (missing-answer clause; swe-01/grok-03 lineage findings) |
| R19 census | `unknown_record_shape` on more than half the sampled sessions, or any transcript text in the report (grok-05). Coverage: the brief column prints how many boundaries carry the SessionStart:compact attachment; under 50% marks the replay fallback as the path |
| R19 later arm | `arm not built: fit_throws>=50% OR offline_reduction_upper_bound<0.25` (grok-05), plus my earlier stop boundary: kept tokens more than 3× stock, p50 above 30 s, or fallback rate above 20% |
| R20 lexical lint | The Jev arm is not built when the labeled violation rate is under 5%; any path that shells an npm-only subcommand (`command was jev verify`) kills the design, since D5 refuses the npm package |
| R2 zero-call slice | Fewer than 30 valid rows prints `stop: fewer than 30 rows` and ends the phase there |
| R2 Jev arm / plugin mode | `no recorded OpenCode or Pi verifier use`, or evidence that is only the stored goal string, keeps both unbuilt; any added false `met` fails the keep whatever else improves |
| R21 | Runs only if R1 prints `underpowered`; a missing answer counted as a value voids it (`missing_answer_counted`) |

**F5 (sibling contest resolved; my iteration-002 column corrected).** grok-05 is right that the R19 fit column must not compare host `preTokens` with the vendored 25,000-token ceiling. I verified in the vendored source: the ceiling applies to the **fitted state** that `buildFittedState` produces after staged shrinking, and the fitted state reports its own `stage` (`state.ts:191-214`, `:225`, `:305`; `compact.ts:19-27`). The census's fit column is therefore: local `estimateTokens` over the modeled placeholder state, the stage reached, and whether the build throws — never a subtraction from `preTokens`. My iteration-002 phrasing "the 25,000-token fit estimate (unchanged)" is corrected by this row; the census stays build-now. I also accept grok-05's scheduling note on N-deepseek-01-3: it is a doc-time action for 005 and 006, not a build item. [SOURCE: `external repo's/jev-cli-main/src/vendor/compaction/state.ts:191-214`, `:225`, `:305`; `compact.ts:19-27`; grok-05 F3]

**F6 (answers angle question 3; order by dependency, engineering view).**

1. **Redaction unit cases.** Precondition of any egress, no Jev switch (grok-04's N-1, BASE row; both regexes fail today). Rollback: revert the prefix change in the two expressions.
2. **002's census and 005's census, side by side.** Zero calls; the only slices that can end their idea with a number and no key. Rollback: delete each script and its report.
3. **002's billed arm,** after the baseline matches 53/70, the stub tests pass and the missing-answer clause is in. This is where the first latency record is born; R21 rides it. Rollback: delete the script and its reports; no file outside the report directory changes.
4. **006's lexical lint and 003's zero-call slice.** Zero calls. Rollback: delete the lint script and labels; delete the fixture and scorer.
5. **Later arms only past their kills** (R21 conditional; R19/R20/R2 arms gated as F4). Rollback of the plugin mode, if ever built: remove the mode value, its branch and the doc-table row; the plugin tests return to their current state.

This matches grok-05's order with one wording change: the redaction fix "lands before any egress", not before the censuses — the censuses may run first.

## Per-Idea Records

### R1 (and R21) — engineering view

- **Idea:** R1 as BASE records it, now with swe-01's code findings folded in: decided universe = movable rows only, `gold_demoted` reported apart; exact sign-test tail (min-wins table); `-s -` on every call; ~330 LOC.
- **Builds on:** BASE R1/R21; swe-001; deepseek-01 F6-F8.
- **Value / Seam / Metric / Cost / Gate:** as deepseek-01 and BASE; unchanged by this pass.
- **Failure modes:** F1's first two rows; the only state on a failure is a call record's status.
- **Kill:** F4's first row.
- **Verdict:** **build-now** (unchanged), with the decided-universe and `-s -` fixes pre-registered.
- **Confidence:** confirmed from code across two lineages; whether any movable rows exist stays UNKNOWN until the census.

### R19 (census and later arm) — engineering view

- **Idea:** as BASE R19 with the fit column corrected (F5) and the brief column read-first (deepseek-02).
- **Failure modes:** census cannot fail open into sending; it fails into a named error on unknown shapes. The later arm inherits R1's exit handling by reference.
- **Kill:** F4's R19 rows.
- **Verdict:** **census build-now; arm later** (unchanged).
- **Confidence:** record shapes confirmed on one transcript; the fit estimate is a model of the vendored state build, so its accuracy is UNKNOWN until the census prints stages.

### R20 — engineering view

- **Idea:** lexical lint next; Jev arm behind the 5% rate; print placement in the authoring flow decided with sk-doc (F2).
- **Failure modes:** zero calls in the lint; the arm inherits R1's handling. No state beyond the report.
- **Kill:** F4's R20 rows.
- **Verdict:** **next** (unchanged); the placement decision is an owner conversation, not a build dependency.
- **Confidence:** caller list confirmed by search; base rate still disputed (mimo-02's sample is the decider).

### R2 — engineering view

- **Idea:** zero-call slice next; later arm and plugin mode gated as BASE; Pi form must not await inside `turn_end`; OpenCode errors must stay out of the `blocked` catch.
- **Failure modes:** F1's last row; the only live-path change is the plugin mode, tested by F3's stub run.
- **Kill:** F4's R2 rows.
- **Verdict:** **next for the slice; later for the rest** (unchanged).
- **Confidence:** all failure paths confirmed from code; verifier use remains the gating unknown.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| Per-survivor failure matrix with what prints and what persists | confirms BASE §9 with per-arm state detail | F1 sources |
| Frozen touches: only R2's plugin enum and R20's placement touch owned contracts; callers named by search | new | F2 |
| The plugin mode is the only no-key behavior risk; the stub-parity test and the key-origin line are its proofs | new | F3 |
| Kill criteria as printed results for all five survivors, integrating sibling kills | new synthesis; F5 corrects my earlier column | F4, F5 |
| Fit column = staged fitted-state estimate + stage, never `preTokens` vs 25,000 | contest resolved in grok's favor; verified in vendored code | `state.ts:191-214`; `compact.ts:19-27` |
| R1's decided universe must be movable rows only with `gold_demoted` apart | confirms/extend swe-01 with my lens | swe-001; BASE R1 |

## Hand-off

- Synthesis: this closes deepseek's five angles. The build order, the failure matrix and the kill table are the engineering view the synthesis's RQ7 section can adopt; the two text-level corrections (fit column, decided universe) belong in 005's and 002's amendments.
- No new open question is minted; the remaining unknowns are the ones deepseek already logged (question 18 production budget, 19 verifier use, 25 coverage across sessions, power/movable rows, HVR labels).
