# Iteration 3 — mimo-03: Is any OpenCode or Pi goal verifier in use, and how long is its evidence? (questions 19 and 23)

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790457982528-yjdrdz`
**Focus Area:** `mimo-03` — Is any OpenCode or Pi goal verifier in use, and how long is its evidence?
**Angle question:** Do any goal state directories the operator uses hold a verifier verdict, how long is the evidence, and what does the operator see when the heuristic disagrees? This settles council disagreement D2.

## Sibling check

Read before starting, per the W2 contract:
- `../grok/iterations/iteration-005.md` (grok's newest, iteration 5).
- `../deepseek/iterations/iteration-005.md` (deepseek's newest, iteration 5).
- `../swe/iterations/iteration-001.md` (swe's newest so far, iteration 1).

Push-past, each grounded in a count or code line I opened myself:
- grok-005 prints the R2 Jev arm's kill as `r2 jev arm not built: no recorded OpenCode or Pi verifier use`. **That kill has already fired**: my count below finds zero verifier verdicts in every store the operator's configs resolve to. grok and I agree, and my agreement rests on the record counts, not on grok's file.
- swe-001's function 15 (`verdict`, swe-001:64) codifies BASE's `underpowered` trigger only (movable < 5). Contested with mimo-01's power table: the trigger misses substantive underpower (20 movable rows still need a 0.80 win rate). The function needs a second condition, `q80 > plausible win rate`, before 002's spec freezes.
- deepseek-005 gives R2's shadow mode a once-per-session gate and notes unknown `OPENCODE_GOAL_VERIFIER` values fall back silently to `heuristic` (`opencode-goal.js:226-229`). My UX finding below (the nudge is invisible to the operator) makes the shadow record the *only* surface the operator ever sees of heuristic disagreement; that argues the record must print in the chat slice, not just the JSONL.

## Grounding opened this iteration

- `.opencode/plugins/opencode-goal.js:30-50` — `DEFAULT_STATE_DIR = process.env.OPENCODE_GOAL_STATE_DIR || fileURLToPath(new URL('../skills/.state/goal/', import.meta.url))`, `DEFAULT_MAX_EVIDENCE_CHARS = 1200`, `DEFAULT_MAX_OBJECTIVE_CHARS = 4000`, `DEFAULT_MAX_REASON_CHARS = 280`, `DEFAULT_MAX_AUTO_TURNS = 8`, `DEFAULT_VERIFIER_TIMEOUT_MS = 30000`; the comment: "both engines must land in the same place or one session's records become invisible to the other".
- `.opencode/plugins/opencode-goal.js:179,2310,2335-2340,2429` — verifier verdict vocabulary `met|not_met|blocked`, the `not_met` fallbacks, and `not_met` incrementing `iterations` for auto-continuation.
- `.skilled/hooks/goal/lib/goal-core.cjs:39-43,171-177,527,1305` — `STATE_DIR_ENV`, `STATE_SUBDIR = '.skilled/skills/.state/goal'`, the resolution order (env override then repo-root default), and `lastVerifierVerdict: 'not_evaluated'` as the fresh-record default.
- `.skilled/hooks/goal/pi/goal-context.ts:34,220-240` — `lastVerifierVerdict` on the Pi goal type; the `turn_end` handler runs `verifyGoalHeuristic` and, when the verdict is not `met`, sends `goal-verify-nudge` with `display: false`, failing open on any error.
- `.opencode/skills -> ../.skilled/skills` symlink (`ls -la .opencode/`), so the plugin's default resolves into the same store goal-core names.
- Stores read: the main checkout's `.skilled/skills/.state/goal/` and this worktree's `.skilled/skills/.state/goal/`; `node -e` record walks, counts and string lengths only, never content. `OPENCODE_GOAL_STATE_DIR` is unset in this environment. No repository module run, no `jev` call of either package, no `.env` opened.

## Counts (numbers and field names only)

**Question 19: every goal state directory the operator's configs resolve to, and its verdicts.**

| Store | Records | runtime | lastVerifierVerdict | status |
|---|---|---|---|---|
| main checkout `.skilled/skills/.state/goal/` (5 files) | 5 | hermes 5 | `not_evaluated` 5 | active 5 |
| worktree `.skilled/skills/.state/goal/` | 0 | — | — | — |

Record fields: `boundAtMs,boundBy,createdAt,createdAtMs,goalId,goalPrompt,lastActivityAtMs,lastResentSliceHash,lastVerifierReason,lastVerifierSource,lastVerifierVerdict,objective,packetPath,revision,runtime,startedAtMs,status,tokenBudget,turnsUsed,updatedAt,updatedAtMs,usageSource,workspace`. All 5 records carry `lastVerifierReason` length 0, `revision` 1, `turnsUsed` 0, objective lengths 745–1,022 characters.

Two engines, one store, confirmed: the plugin default `../skills/.state/goal/` crosses the `.opencode/skills -> ../.skilled/skills` symlink to `.skilled/skills/.state/goal`, and `goal-core.cjs:43` names the same `STATE_SUBDIR`; `OPENCODE_GOAL_STATE_DIR` is unset, so no third location exists here. The store schema carries the verifier triple (`lastVerifierSource`, `lastVerifierVerdict`, `lastVerifierReason`) but **no record has ever been evaluated**: zero records hold a verdict of any kind, zero records come from OpenCode or Pi at all (all 5 are hermes), and no record carries an evidence string.

**Question 23: evidence over 1,200 characters.** With zero OpenCode/Pi records there is no live evidence to measure — the count is 0 observations, not a rate. The closest live proxy is Claude Code's native judge: of 610 `goal_status` reason strings (mimo-02's walk), **75 (12.3%) exceed 1,200 characters**, p90 1,226, max 2,221. The clamp limit is `DEFAULT_MAX_EVIDENCE_CHARS = 1200` (`opencode-goal.js:40`). BASE's 55.0% figure is a different artifact (pre-verdict assistant texts); both proxies say the clamp boundary is a live surface, and mine is the one that matches the field the heuristic actually clamps.

**Question 5, operator labor.** The heuristic's disagreement rate with native pre-labels is exactly R2's zero-call slice output and is UNKNOWN today. The labor model is fixed: adjudication minutes = rows × disagreement rate × minutes per row. Sensitivity at 2 minutes per row: 30–50 rows with a 10%–30% disagreement rate cost **6–30 minutes**; with no pre-labels at all it is 60–100 minutes. BASE's D2 note stands: native records pre-label the rows, so only disagreements take operator time — which makes the disagreement rate the single number R2's slice must print first.

## Per-idea records

### Idea 1: `R2` — goal verifier zero-call slice, shadow mode behind recorded use

| Field | Record |
|---|---|
| **Idea** | `R2`: zero-call slice first (tail-window heuristic vs goal-core parity vs native pre-labels), then an opt-in shadow `jev` verdict, Python `jev-cli` 0.6.2. |
| **Builds on** | BASE R2 and D2; questions 19, 23, 30 (R2's reshaping). |
| **Value** | The slice pre-labels heuristic errors with zero calls; the shadow mode would compare a Jev verdict with the heuristic behind `OPENCODE_GOAL_VERIFIER=jev` (deepseek-005's seam). The operator's decision is whether a goal needs adjudication before the auto-continuation burns turns. |
| **Seam** | `.opencode/plugins/opencode-goal.js:2335-2340` (verdict fallbacks), `:2429` (`not_met` increments `iterations`, up to `DEFAULT_MAX_AUTO_TURNS` 8); `.skilled/hooks/goal/lib/goal-core.cjs:527` (verdict default). Opened this iteration. |
| **Metric, baseline, harness** | Slice: error counts (blocking-pattern false `not_met`, clamp-error count) against native `goal_status` pre-labels. Shadow: agreement, flip rate, latency. Baseline: heuristic only; recorded verdicts today: **0**. |
| **Cost, latency, privacy** | Slice: zero calls. Shadow: one call per verified goal inside `DEFAULT_VERIFIER_TIMEOUT_MS = 30000`; goal evidence leaves the machine only under the flag and the key gate. |
| **Key gate and no-key behavior (D5)** | Unchanged: flag-gated, skip line, verdict path byte-equal to heuristic with no key (deepseek-005's test shape). |
| **Rough LOC** | BASE estimate stands. |
| **Verdict** | **next for the zero-call slice; the Jev arm and plugin shadow mode stay later and are now blocked by evidence, not by policy.** Council disagreement D2 resolves: the arm waits on recorded OpenCode or Pi verifier use, and the recorded use is zero — grok-005's kill line for the arm is true today. |
| **Confidence** | Confirmed by counts: zero verdicts, zero OpenCode/Pi records, `display: false` on the nudge. Inferred: that shadow mode would ever see use; what would confirm: one recorded OpenCode or Pi goal session. |

### Idea 2: `N-mimo-03-1` — a recorded-use tripwire that prints when the arm unblocks (no Jev call)

| Field | Record |
|---|---|
| **Idea** | 003's zero-call slice ends its report with one line: `r2 jev arm not built: no recorded OpenCode or Pi verifier use (0 of N records hold a verdict)`, and the line's condition is re-evaluated by a cheap count over the state store. The day a verdict exists, the line changes and names the record. |
| **Builds on** | D2's settlement and grok-005's kill wording. |
| **Value** | The operator never has to remember to check whether the precondition arrived; the arm's unblocking is observable, dated and countable, instead of a standing assumption. It makes the "behind recorded use" clause falsifiable. |
| **Seam** | The store's `lastVerifierVerdict` field (`goal-core.cjs:527`, `:1305`) is the tripwire's input; the print sits at the end of the slice report. |
| **Metric, baseline, harness** | Records-with-verdict / total records, printed; baseline today 0/5. |
| **Cost, latency, privacy** | One directory read; zero calls; nothing leaves the machine. |
| **Key gate and no-key behavior (D5)** | Not a call path; it prints in the default (no-key) run and is the no-key behavior's closing line. |
| **Rough LOC** | 10–15 LOC in the slice script. |
| **Verdict** | **build-now, inside the zero-call slice.** It is one line that keeps a later clause honest. |
| **Confidence** | Confirmed: the field exists and defaults to `not_evaluated` (`goal-core.cjs:1305`). |

### Idea 3: `N-mimo-03-2` — `verifier_shadow` as a visible one-line record, not a buried JSONL field (UX)

| Field | Record |
|---|---|
| **Idea** | When shadow mode eventually runs, the shadow verdict lands in the goal state record as `verifier_shadow` beside `lastVerifierVerdict`, and the chat slice prints one line only when shadow and heuristic disagree: `[goal_verify] shadow=met heuristic=not_met`. |
| **Builds on** | The `verifier_shadow` field in the phase-003 plan (angle text) and the invisibility finding below. |
| **Value** | Today the operator sees **nothing** when the heuristic disagrees with reality: the Pi nudge is sent with `display: false` (`goal-context.ts:233-237`), and `not_met` silently consumes auto-turns (`opencode-goal.js:2429`, cap 8). A visible disagreement line is the only operator-side surface that changes behavior; silence on agreement keeps it cheap. |
| **Seam** | `.skilled/hooks/goal/pi/goal-context.ts:228-238` (the hidden nudge) and `goal-core.cjs:527` (record fields). Opened this iteration. |
| **Metric, baseline, harness** | Disagreement lines printed per session; baseline: 0 (no shadow exists; the nudge is invisible by construction). |
| **Cost, latency, privacy** | Print only; the verdict text is already local. |
| **Key gate and no-key behavior (D5)** | Dormant without the key: with no key there is no shadow value and no line, exactly today's behavior. |
| **Rough LOC** | 15–25 LOC across the slice of 003 that writes the record and the chat-slice printer. |
| **Verdict** | **next.** It ships with the shadow mode, not before; but the print-on-disagreement decision should be written into 003's spec now, while its cost is one line of text. |
| **Confidence** | Confirmed: `display: false` and the continuation counter are in code. Inferred: that a visible line changes operator behavior; what would confirm: one session of shadow use. |

## Ruled out this iteration

- Opening record content (goal text, prompts, reasons): the contract caps this at counts, lengths and field names; objective and reason strings were measured, never read.
- Searching home-directory Claude transcripts for OpenCode/Pi verifier use: those are Claude Code's native judge (`goal_status`), a different judge than the plugin's verifier; mixing them would restate BASE's item 9 confusion in reverse.
- Running the plugin or goal-core to see the nudge fire: repository modules are off-limits here; the code path was read instead.
- Any `jev` call of either package: forbidden by contract.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| Question 19 answered: zero verifier verdicts in any store the operator uses; the 5 records are all `runtime: hermes`, all `not_evaluated`, `lastVerifierReason` length 0 | new (BASE left it UNKNOWN) | store walks, counts above |
| No OpenCode or Pi goal session exists at all in the shared store; 003's Jev arm is blocked by absent recorded use, and D2 resolves to "stop at the zero-call slice" | new; settles D2 | same counts |
| Both engines land in one store: the plugin default crosses the `.opencode/skills -> ../.skilled/skills` symlink to the same `STATE_SUBDIR` goal-core names | confirms the "same place" design with new evidence | `opencode-goal.js:36-38`, `goal-core.cjs:43`, `ls -la .opencode/` |
| The Pi verify nudge is invisible to the operator (`display: false`) and `not_met` silently increments the continuation counter up to 8 turns | new (BASE's UX picture had the nudge as if seen) | `goal-context.ts:233-237`, `opencode-goal.js:2429`, `:42` |
| Question 23: unmeasurable live (0 records); the closest proxy is 75 of 610 native `goal_status` reasons (12.3%) over the 1,200-char clamp, p90 1,226 | new | TX length walk + `opencode-goal.js:40` |
| Operator labor model: 6–30 minutes for 30–50 rows at a 10–30% disagreement rate; the rate is R2's first printed number | new | sensitivity arithmetic above; rate UNKNOWN |
| grok-005's kill line for the R2 Jev arm is true today, verified by count not by agreement | confirms a sibling claim with new evidence | the record counts; `../grok/iterations/iteration-005.md:36` |
| swe-001's `underpowered` clause (swe-001:64) misses substantive underpower | contests a sibling claim | mimo-01's power table |

## Hand-off

- The synthesis's D2 row: resolve as "003 stops at its zero-call slice; the arm unblocks only on recorded OpenCode or Pi verifier use, currently 0 of 5 records", citing this iteration's counts.
- swe-03/swe-05: the tripwire (N-mimo-03-1) and the shadow print line (N-mimo-03-2) belong in 003's spec text; swe owns the code shape.
- mimo-04 picks up the usage side: whether goals are being set at all in real sessions (transcript tool-name counts) sizes R2's reach.
- Anyone quoting question 23 must say which artifact they measured: evidence strings (0 observed), native reasons (12.3% over 1,200) or pre-verdict texts (BASE's 55.0% proxy).
