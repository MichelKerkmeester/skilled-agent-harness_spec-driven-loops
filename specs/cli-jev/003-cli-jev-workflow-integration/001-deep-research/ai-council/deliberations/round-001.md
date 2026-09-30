# Multi-AI Council Deliberation round-001

Review of `research/research.md` (Jev typed judgments across `.skilled`). One round with three seats, dispatched in parallel at depth 0. Every seat ran on Claude Opus 5.5 at max effort. Host: the council agent, which reopened each load-bearing claim before scoring.

---

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Critical: evidence and verdict audit | opus-max (Claude Opus 5.5 max, single model) | Every verdict rests on a reopened `file:line`. Tests the DeepSeek under-count, R1's statistical power, R2's design and D5's failure paths | 74 |
| seat-002 | Pragmatic-UX: operator value and measured usefulness | opus-max (Claude Opus 5.5 max, single model) | What each item removes from or adds to the operator's day, the operator labor it needs and enablement UX under D5 | 70 |
| seat-003 | Creative-contrarian: too conservative or too timid | opus-max (Claude Opus 5.5 max, single model) | Where a bolder build passes the checklist today, gold as a product in its own right, and seams and new material nobody examined | 70 |

**Vantage integrity.** Single model. All three seats and the synthesis under review are Claude Opus 5.5. Agreement among them is one model family agreeing with itself, so it counts as corroboration only where it rests on code or counts that a reader can recheck. No external AI system took part, and no seat was simulated.

---

## Pass 1: Independent Extraction

**seat-001 (Critical).**
- **Verdict.** Sound in direction. Too lenient in the two measurements it would run. Too conservative on compaction. It missed a goal-verifier defect.
- **Key findings:**
  - R1's keep rule cannot fail. The aggregate stability coefficient passes a coin-flipping judge, one net row flips "MRR rises", right@3 is nearly vacuous, the metric matches ids exactly and the env list omits `VITEST=true`.
  - The OpenCode heuristic returns `not_met` for any evidence over 1,200 characters (the clamp defect).
  - The repository already enables Claude Code function hooks, which is the route the vendored Jev compaction uses.
  - The `noop` default in the runner, a wrong level-flag reason and a Pi-post misattribution are fact corrections.
  - The DeepSeek loss happened in the lineage reducer. It lost engineering detail, not ideas.
- **New items:** a goal-criterion lint (later) and a compaction fidelity replay on the function-hook route (later).
- **Phases:** 002 and 003 modified. Adds `004-goal-criterion-jev-lint` and `005-compaction-fidelity-replay`.

**seat-002 (Pragmatic-UX).**
- **Verdict.** Right on what not to build. Wrong on what to build first, because the build list follows harness readiness rather than operator value.
- **Key findings, from local counts:**
  - 204 host compactions with a p50 of about 104.5 s.
  - 750 Claude Code `goal_status` evaluations, against 6 goal-state records in the plugin's default directory, all Hermes and all unevaluated.
  - R4, R14 and R15 feed readers that do not exist.
  - The D5 enablement steps, a `verifier_shadow=` field in `show`, the repository scrubber for session payloads, and skip messages that diverge between 002 and 003.
- **New items:** a compaction replay census (build-now census, next arm) and goal-criterion checkability (next).
- **Changes:** demotes R2 to later, and drops R4, R11, R14, R15 and R18.
- **Phase order:** compaction first, then 002, then the criterion lint, then 003 parked.

**seat-003 (Creative-contrarian).**
- **Verdict.** Nearly every drop is right. The only build-now item is too lenient. It is too conservative in three cheap places.
- **Key findings:**
  - The same R1 statistics finding as seat-001, reached on its own, with a sign-test keep rule.
  - The 195 Gate 3 labels as the one Jev calibration available today.
  - The goal-criteria lint, since no lineage opened `sk-create-goal`.
  - Deterministic noise in the compaction brief extractor.
  - A likely gap in the redaction regex for underscore-prefixed secret names.
  - The failed revivals of S03, S07, S08, S10, S12, S15 and S21 are recorded.
- **New items:** a goal-criteria lint (next), a Gate 3 calibration arm inside 002 (build-now) and a compaction brief recall harness (next).
- **Phases:** 002 and 003 modified. Adds `004-goal-criteria-jev-lint` and `005-compaction-brief-recall-harness`.

---

## Host Verification (claims reopened before scoring)

| Claim | Seat | Host check | Result |
| --- | --- | --- | --- |
| Function hooks are enabled in this repository | 001, 002 | `.claude/settings.json:38` sets `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` to `"1"` | Confirmed |
| "No repository file references `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS`" | 003 | Same line | **Refuted** |
| Heuristic fails any evidence over 1,200 characters | 001 | `opencode-goal.js:42` (1200), `:382-389` (`clampText` appends `...`), `:463-476` (`redactEvidence` clamps at capture), `:1107` (capture), `:2199` (re-clamp) and `:2209` (truncation check on a trailing `...`) | Confirmed from code. Live frequency UNKNOWN |
| The plugin carries its own heuristic, a copy of goal-core's | 001 | `opencode-goal.js:25` imports only `appendPacketLog`. `:2197-2230` mirrors `goal-core.cjs:596-619`, which returns `unclear` or `not-met` where the plugin returns `not_met` | Confirmed |
| Runner default grader is `noop` | 001 | `run-benchmark.cjs:577` (`args.grader \|\| 'noop'`) | Confirmed. research.md's "default 5dim run carries a mock D4" holds only for the direct scorer |
| Stability coefficient is `1 - sd/mean` over passes | 001, 003 | `benchmark-stability.cjs:86-108` | Confirmed. That it cannot fail is derived arithmetic |
| Rerank metric matches ids exactly, capture matches aliases | 001 | `score-outcome-rerank.mjs:85-93`, `capture-scorer-eval-baseline.mjs:70-76` | Confirmed |
| 002's env list omits `VITEST=true` | 001 | `capture-scorer-eval-baseline.mjs:43` sets it. 002 `plan.md:63` cites `:35-46` but its enumerated list leaves it out | Confirmed |
| 204 host compactions, p50 about 104.5 s | 002 | 212 `compactMetadata` objects under this project's transcripts, 8 of them in subagent transcripts, so 204. Of the 154 records whose duration the host could read, none was under 60 s and 97 were at or above 100 s | Count Confirmed. p50 above 100 s derived on the readable subset. Exact p50 is seat-reported |
| 750 native `goal_status` evaluations across 21 sessions | 002 | Count over this project's transcripts | Confirmed |
| Plugin goal-state records are all Hermes and unevaluated | 002 | The main checkout's `.skilled/skills/.state/goal/` holds 5 active records plus 1 archived. The active 5 are all `"runtime": "hermes"` with `lastVerifierVerdict` `not_evaluated`. The worktree holds none. The default path is `opencode-goal.js:36-37`, overridable by `OPENCODE_GOAL_STATE_DIR` | Confirmed for the default directory. Non-use of OpenCode goals inferred |
| `compareNextFocusShadow` has no runtime caller | 002 | Callers: `next-focus/index.ts:13` (re-export) and `next-focus.vitest.ts:474` (test) only | Confirmed |
| Skip messages diverge between 002 and 003 | 002 | 002 `spec.md:112` "jev arm refused: expected jev 0.6.2" and `:131` "jev arm skipped: no credential", against 003 `spec.md:121` "jev arm skipped: <check>" | Confirmed |
| The plugin's stderr writer is gated | 002 | `opencode-goal.js:839` is its only `process.stderr.write` | Confirmed site. The gate condition was not reopened |
| The native judge sees only the stored string | 002 | `goal-set-string-playbook.md:55-57` | Confirmed |
| `check-goal.cjs` tests structure only | all | `check-goal.cjs:44-49` (four checks), `sk-create-goal/SKILL.md:121-122`. A search of `.skilled` scripts for "self-contained" or "without opening another file" found no criterion check | Confirmed |
| The auto workflow runs check-goal | 002, 003 | `create-goal-auto.yaml:221` | Confirmed |
| The packet's own goal criterion depends on another file | 003 | Parent `goal.md:107` ("Each phase in the synthesis's proposed list...") | Confirmed |
| Gate 3 labels exist: 127 yes and 68 no | 003 | `labeled-prompts.jsonl`: 127 `"gate3_triggers":"yes"`, 61 compact `"no"` plus 7 spaced `"no"` at `:189-195` | Confirmed |
| Attention extractor noise list is JavaScript-only | 003 | `compact-inject.ts:149-155` | Confirmed. Observed noise is one seat's single observation |
| Redaction keyword rule misses `SERVICE_TOKEN=` style names | 003 | `opencode-goal.js:474` is `\b(api[_-]?key\|token\|password\|secret)` with the `gi` flags. `_` is a word character, so there is no boundary inside `SERVICE_TOKEN` | Derived from the regex, not executed. Needs one unit case |
| Vendored fast-jev defaults and fallbacks | 002, 003 | `fast-jev.ts:26-31` (60%, reduction 0.25), npm `jevctl` `compact.ts:24` (25,000-token state), `state.ts:304-305` (throws "history too large"), `plugin/hooks/README.md:47` (falls back to the built-in summary), `claude-code.d.ts:7285` (`precompute` trigger), `CHANGELOG.md:59` (needs function hooks) | Confirmed as npm `jevctl` 0.2.3 vendored code |
| Level flags feed the level | 001 | `recommend-level.sh:36-47` (auth +10, api +8, db +7, architectural +20) | Confirmed. research.md's reason "no decision reads" is wrong |
| The 0.22-to-0.58 report is not about Jev | 001 | Pi post `:1121` names meraGPT's "Decider 1" and also reports a working done gate (0.16 against 0.90) | Confirmed |
| Stop hooks are async, and the only PostToolUse Bash hook is a 5 s audit | 003 | `.claude/settings.json:162-177`, `:204-211` | Confirmed |

---

## Strategy Comparison

| Dimension | Weight | seat-001 Critical | seat-002 Pragmatic-UX | seat-003 Creative-contrarian |
| --- | --- | --- | --- | --- |
| Correctness | 30% | 27 | 25 | 24 |
| Completeness | 20% | 16 | 18 | 18 |
| Elegance | 15% | 12 | 13 | 12 |
| Robustness | 20% | 18 | 14 | 17 |
| Integration | 15% | 13 | 13 | 13 |
| Pre-Critique Total | 100% | 86 | 83 | 84 |
| Post-Critique Adjustment | +/-10 | +1 | 0 | -2 |
| Final Total | 100% | 87 | 83 | 82 |

**Scoring notes.**
- **Correctness.** seat-001 reopened every line it relied on and produced the one finding no other seat had, the clamp defect. seat-002's usage counts hold, but "OpenCode goals unused" rests on default directories only. seat-003 carries one refuted claim.
- **Completeness.** seat-002 covered all four operator ideas and the enablement UX. seat-003 covered the widest set of seams and new material. seat-001 left operator usage unexamined.
- **Robustness.** seat-001 and seat-003 carried the statistics. seat-002 changed R1's report but left its keep rule untouched.

---

## Pass 2: Cross-Critique (HUNTER, SKEPTIC and REFEREE)

The scores sit within 5 points, so cross-critique was required.

**Against seat-001.**
- **HUNTER, with seat-002's lens.** It kept R2 at next and R14 at later without asking whether anyone uses the OpenCode verifier, or whether the next-focus comparator has a caller. Both answers are now confirmed: the default state directory holds only Hermes records, and `compareNextFocusShadow` has no runtime caller.
- **SKEPTIC.** Its mandate was evidence integrity, not usage, and a later verdict costs nothing. The R14 miss is real but small. The R2 miss is a matter of lens, not a flaw.
- **REFEREE.** -1 for R14. +2 because the clamp defect was confirmed and it changes 003's design. Net +1.

**Against seat-002.**
- **HUNTER, with seat-001's lens.** The R2 demotion treats "no plugin records in the default directory" as proof of non-use. `OPENCODE_GOAL_STATE_DIR` can move them (`opencode-goal.js:36`), the seat could not query OpenCode's own store, and old records may have been swept. Dropping R11 as "the wrong seam" also ignores seat-003's finding that the brief has its own measurable noise.
- **HUNTER, with seat-003's lens.** R1's keep rule stays unfixed, so a random picker still passes.
- **SKEPTIC.** The usage counts are the only operator-grounded evidence in the whole council, and every one the host rechecked held. The seat labeled non-use as Inferred.
- **REFEREE.** -2 for the inferred non-use and the R11 conflation. +2 for confirmed usage evidence that changes the phase order. Net 0.

**Against seat-003.**
- **HUNTER, with seat-001's lens.** It says no repository file references `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS`, and `.claude/settings.json:38` does. Its Gate 3 calibration arm widens 002 with no stop condition.
- **SKEPTIC.** The refuted claim does not change seat-003's compaction verdict, which rests on gold, egress and D5 rather than on the flag. The calibration arm is bounded, at 40 to 60 lines of code.
- **REFEREE.** -1 for the refuted claim. -1 for the unbounded scope. Net -2.

**Consensus check.** The seats did not converge on one plan. They split on compaction's seam and tier, on R2's tier and on the phase order, so there is no sign of false consensus. They do agree on every drop, and the synthesis agrees too. That is four readings by one model. The host counts it as corroboration only where a drop rests on a deadline, an authority rule or a count the host reopened. It does for rows 1, 5, 9, 21 and 22 and the R1 statistics.

---

## Pass 3: Reconciliation

**Agreements (at least two of three seats, and none contradicted by host evidence):**
1. R1 stays build-now. Its keep rule is replaced. All three seats agree, and seats 001 and 003 reached the statistics independently.
2. A goal-criterion lint is added. All three seats propose it, and seats 002 and 003 place it at next. The first slice costs zero calls and the Jev arm comes later. It lives in a separate script, not inside check-goal's gate (seats 001 and 003).
3. A compaction harness is added. All three seats propose one. The research's compaction reasoning is too narrow, because the 3 s PreCompact limit does not bind the function-hook route this repository enables (seats 001 and 002, confirmed by the host).
4. No drop reopens under D5. D5 hardens rows 6 and 9 (all three seats).
5. jevcache as a dependency, classifier.dev as a service and a Jev PostToolUse Bash-output filter all drop (all three seats).
6. R3's cached lane drops. It can only hit exact repeats, and a first ask still meets the 2500 ms kill (all three seats in substance).
7. R5, R6, R7, R8, R9, R10, R12, R13, R16 and R17 stay later (all three seats, with fact corrections to R7).
8. A targeted re-synthesis is warranted. A full rerun is not (all three seats).
9. The shared Jev probe helper stays dropped now. It is extracted at the third certain caller. The skip messages are aligned now (seats 002 and 003).

**Resolved disagreements (host rulings, with reasons):**

| Topic | Positions | Ruling | Why |
| --- | --- | --- | --- |
| R2 tier | 001 next, 003 next, 002 later | **next for the zero-call slice. The Jev arm and the plugin shadow mode move to later, behind a usage gate** | Two seats keep the measurement, and the clamp defect makes the zero-call slice worth more than research.md said. seat-002's usage evidence was confirmed by the host, which removes the case for spending labels and calls on a verifier with no recorded use |
| Compaction seam | 001 host summary through the function hook, 002 host summary replay, 003 repository brief harness | **One harness scores both the host summary and the repository brief on the same local transcripts** | The seams do not compete. The host summary carries the measured wait. The brief carries a confirmed extractor weakness |
| Compaction tier | 001 later, 002 build-now census, 003 next and beside 002 | **build-now for the zero-call census. The Jev arm stays later** | Two seats schedule the zero-call slice at the front. It costs nothing, sends nothing and can close idea 4 with a number. seat-001 dissents |
| R11 | 001 re-target, 002 drop and merge, 003 keep and correct | **Merged into the compaction harness. Its Jev arm stays later** | All three move R11 off its PreCompact framing |
| R14 | 001 later, 003 later, 002 drop | **drop** | Host-confirmed new evidence overrides the tally: the "shadow comparator" has no runtime caller, so a Jev choice there would feed nothing. Seats 001 and 003 never checked callers |
| R4, R15, R18 | 002 drop, 001 and 003 later | **later** | Two of three. seat-002's "no reader" point goes into each promote-when line |
| Gate 3 calibration arm | 003 only | **Adopted as conditional inside 002: it runs only when R1's census prints `underpowered`** | It fixes a real flaw in the plan: 002 can finish with no Jev latency number, which every later item waits on. Single-seat, and the host bounded it |
| tau 0.03 veto in R1 | 001 report without vetoing, 003 keep the veto | **Unresolved. The veto stays until the host checks seat-001's 11-of-24 negative-margin count** | The claim was not reopened, so the status quo holds |
| Phase order | 001: 002, 003, 004, 005. 002: compaction, 002, lint, 003. 003: 002 with brief harness beside it, labels, 003 last | **002 and the compaction census in parallel, then the criterion lint, then 003's zero-call slice** | Labor rises in that order: none, none, about 100 one-line labels, then 30 to 50 excerpts. Value evidence rises the other way |

**Adjacent defects found. Reported to their owners, not fixed here:**
1. **The clamp defect.** The OpenCode goal heuristic calls any evidence over 1,200 characters truncated (`opencode-goal.js:388`, `:475`, `:2199`, `:2209`). The same check exists in goal-core (`goal-core.cjs:607`, returning `unclear`).
2. **A likely redaction gap** for underscore-prefixed names such as `SERVICE_TOKEN=` (`opencode-goal.js:474`). It is derived from the regex and needs a unit case.
3. **Brief extractor noise.** The attention list's noise words are JavaScript built-ins only (`compact-inject.ts:149-155`).
4. **Planned-phase gaps.** 002 `plan.md:63` omits `VITEST=true`, and the skip messages in 002 and 003 diverge.
5. **research.md errors.**
   - `:153` says the vocabulary "needs no mapping", which holds for OpenCode only.
   - `:108` says a default 5dim run carries a mock D4. The runner default is `noop`.
   - Row 22's reason is wrong.
   - Row 7's citation is misattributed.
6. **A goal criterion that breaks its own rule.** Parent `goal.md:107` points at another file.

---

## Convergence Decision

- **Signal.** `two-of-three-agree`. It holds on 19 of the 21 items judged, R1 to R18 plus the three new items. Two items were settled by host ruling on confirmed evidence: R14 (drop) and the compaction census tier (build-now, seat-001 dissenting).
- **Blocking findings.** Cross-critique raised no new high-severity finding that blocks the plan. The refuted seat-003 claim changes no verdict.
- **Host convergence score:** 0.86.
- **Decision.** Converged. The council report is written.
