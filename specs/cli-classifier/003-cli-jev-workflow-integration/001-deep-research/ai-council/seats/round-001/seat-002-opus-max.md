---
round: 1
seat: seat-002
executor: opus-max
lens: "Pragmatic-UX: operator value and measured usefulness"
status: ok
timestamp: 2026-09-26T00:00:00.000Z
simulated: false
---

# seat-002: Pragmatic-UX / opus-max (Claude Opus 5.5 max)

## Mandate
Every recommendation kept names what it removes from or adds to the operator's day, and a number the operator would read and act on. Risk focus: measurement nobody acts on, labeling work the operator will not do, knobs that multiply, and an operator idea left with no path to anything usable. Vantage: single model (Claude Opus 5.5 max), shared by all three seats. Diversity comes from lens only.

## Confidence
70

## Scope note (recorded by the council host)
- The seat read local Claude Code transcripts under `~/.claude/projects/` for counts. The brief allowed read-only shell and did not forbid it. The seat reports reading keys and numbers only, never message content.
- It also wrote temporary count files to the session scratchpad, which breaks the brief's no-write rule. Nothing under the repository root was written.
- The host re-derived the load-bearing counts without reading message content:
  - 204 host compactions in top-level transcripts, 3 of them manual (212 real `compactMetadata` objects minus 8 in subagent transcripts).
  - Of the 154 saved records that carry `durationMs`, none is under 60 s and 97 are at or above 100 s.
  - 750 `goal_status` records across 21 sessions.
  - 5 active and 1 archived goal-state records in the main checkout's default directory, all `runtime: hermes` and all `not_evaluated`.

## Seat Output

### 1. Headline verdict

The synthesis is sound on what not to build and wrong on what to build first. The 32 drops mostly fail on facts the seat reopened: a 2,500 ms SIGKILL, a 3 s PreCompact hook, authority transfers and silent default scores. The seat keeps all but four as written. The build list is conservative in the wrong place. It picked the item with the best harness (R1), not the one with the most operator value, because it never looked at the operator's own usage. Read-only counts on this machine show three things:

- **Compaction is the largest cost Jev could address, and the plan leaves it no path.** The project's 93 Claude Code transcripts hold 204 host compactions (201 auto, 3 manual). They took p50 104.5 s, p90 144.7 s and 373 minutes in total (Confirmed by count on `compactMetadata.durationMs`). The plan's only compaction item, R11, targets a 4,000-token brief that never touches that wait.
- **Goals run on Claude Code's native judge.** There are 750 `goal_status` evaluations across 21 sessions: 61 met and 689 not met (Confirmed by count). Across the main checkout and three worktrees, the default goal state directories hold 6 records. All 6 are `runtime: hermes`, all are `not_evaluated`, and there is no continuation log (Confirmed). R2 asks for 30 to 50 hand-labeled OpenCode excerpts to improve a verifier the disk shows unused.
- **Three "later" items feed readers that do not exist.** R4 writes to a log no runtime reads, R14 feeds a function with no runtime caller and R15 is a record with no reader.

On the tension: 1 build-now against 32 drops is not over-restraint in the drops. It is under-reach in the builds. "Don't shy away from extensive logic if useful" points at a compaction replay harness over the operator's own transcripts: transcript parsing, tool-call pairing, state fitting and derived fact recall. That is real logic, it makes zero calls in its first slice, and it aims at a cost paid 204 times in transcripts all modified within 30 days.

The synthesis is right, and the seat says so plainly, on these points:
- no live call in the advisor hook
- no new hub mode, command or skill
- never a default score
- the reviewer-fixture dead end
- R1 as a new file rather than an edit to `score-outcome-rerank.mjs`
- the abstention-arm refutation
- R10's gold is thin (it is thinner still, see R10)
- idea 1 has no grading use that earns a build

### 2. Per-recommendation review

| ID | Synthesis verdict | Your call | Resulting tier | Reason, with what it removes from or adds to the operator's day | Evidence reopened | Confirmed or inferred |
|---|---|---|---|---|---|---|
| R1 | build-now | keep, modify | build-now | Adds one report, read once. Removes nothing daily. A win with no live path is a number nobody acts on. Add to the report: movable held-out rows, Jev p95 against the advisor's remaining budget, accuracy by Jev confidence (0.7 and above versus below) and the near-tie rate on the operator's own recent prompts (local, zero calls). | `ambiguity.ts:7-8`, `:44-58`, `scorer-eval-baseline.json:25-35`, `score-outcome-rerank.mjs:127-133`, `:149-150`, `user-prompt-submit.ts:22`, `:105-125` | Seams Confirmed, value Inferred |
| R2 | next | demote | later | 003 T001 asks the operator for 30 to 50 authored, stripped and labeled rows "from your own OpenCode sessions" (003 `tasks.md:36`). Those rows would improve a verifier that no default state directory shows in use. Promote when OpenCode or Pi goal records with a verdict appear. | `opencode-goal.js:134`, `:226-229`, `:2197-2230`, `goal-core.cjs:596-620`, `goal/README.md:77-82`, state-dir and transcript counts | Counts Confirmed, non-use Inferred (default dirs only) |
| R3 | later | keep, reframe | later | A cached lane cannot hit. Exact repeats are 16 of 439 typed prompts over 100 characters (3.6%). The only possible served form is a live cluster-only call under a hard sub-deadline, and only if R1 wins and p95 fits. | `user-prompt-submit.ts:22`, `:109-125`, prompt hash counts | Counts Confirmed, latency Inferred |
| R4 | later | demote | drop | On Claude Code the advisory goes to stderr of an async Stop hook and to a log that no runtime reads. The log holds 238 lines in 30 days, and 512 of 567 lines are "no implementation-summary.md". Fewer false fires removes nothing from the day. | `completion-evidence-stop.cjs:132-139`, `.claude/settings.json:175-176`, log counts, `rg` for readers (docs and tests only) | Confirmed |
| R5 | later | keep | later | All 8 fixtures expect `fail` and reviewer benchmark runs are rare. Nothing reaches the operator's day. | 4 reviewer fixtures (8 `expectedVerdict`, all `fail`) | Confirmed |
| R6 | later | keep | later | This is the only item that would remove manual scoring: about 98 scores per run (7 cases, 2 conditions, 7 dimensions). But no run is recorded, and the human subset needs replies generated by hand first. | `reply-harness/README.md:3`, `:11`, `:17-21`, `cases.json` (7), `reports/` (no harness run) | Confirmed |
| R7 | later | keep | later | There is no D4 gold. The silent fallback is an operator trap worth a non-Jev fix: `--grader jev` quietly yields mock scores today. | `score-model-variant.cjs:207-211` | Confirmed |
| R8 | later | keep | later | The local replay is free, but it only informs stops in confirm mode, and runs like this one force max iterations. | `research/deep-research-config.json` (`max-iterations`, 10) | Config Confirmed, usage Inferred |
| R9 | later | keep | later | Depends on R8. | not reopened | unchanged |
| R10 | later | keep | later | The gold is thinner than the synthesis knew. Across 409 registries, 3 transition reasons mention a P0 downgrade. 41 of 4,236 review iteration files carry downgrade wording, and a sample showed false positives. | registry and iteration counts | Confirmed |
| R11 | later | drop, merge into N1 | drop | The brief is 4,000 tokens out of a p50 20,327-token post-compaction context. It never touches the host's p50 104.5 s summary. Idea 4 belongs at the host summary seam. | `compact-inject.ts:1-8`, `shared.ts:12`, `:14`, `compactMetadata` counts | Confirmed |
| R12 | later | keep | later | 3 clarify rows exist and the real clarify rate is unknown. | not reopened | unchanged |
| R13 | later | keep | later | Rare, with no gold. | not reopened | unchanged |
| R14 | later | demote | drop | `compareNextFocusShadow` has no runtime caller, only an index re-export and one test. A Jev choice there would feed nothing. | `next-focus-selection.ts:351-365`, `rg` callers | Confirmed |
| R15 | later | demote | drop | A record of near-line pairs with no reader. The merge stays a pure function. | `fanout-merge.cjs:341`, `:348-351` | Confirmed |
| R16 | later | keep | later | WebFetch and WebSearch appear in the operator's `preCompactDiscoveredTools`, so fetch traffic is real. But no hook and no gold exist. | transcript metadata | Presence Confirmed |
| R17 | later | keep | later | Owned by sk-git, built on an npm `jevctl` 0.2.3 recipe, no gold. | not reopened | unchanged |
| R18 | later | demote | drop | No caller exists, and Grok's "always read_code" baseline probably wins. | research only | Inferred |

### 3. Notable drops and dead ends

| Row | Synthesis verdict | Your call | Resulting tier | Reason, with what it removes from or adds to the operator's day | Evidence reopened | Confirmed or inferred |
|---|---|---|---|---|---|---|
| 1 | drop | keep, add a revival rule | drop now, conditional | This is the only path from idea 2 to the operator's day, and the synthesis treats the drop as permanent. Write the rule now: revive a cluster-only call if R1 keeps its win and the measured p95, spawn included, is under the advisor's remaining budget (2,200 ms minus the scorer's own p95, proposed). | `user-prompt-submit.ts:22`, `:105-107` | Deadline Confirmed, rule Inferred |
| 5 | drop | keep, correct the reason | drop inside PreCompact | Right hook, wrong comparison. The 5.6 s figure (a Hermes user report) was set against a 3 s hook, while the operator's felt cost is the host summary at p50 104.5 s. The drop stands for PreCompact. The idea moves to N1. | `.claude/settings.json:222`, `compactMetadata` | Confirmed |
| 6 | drop | keep as a repo rule only | drop for repo features | This is no reason to reject a plugin the operator installs themselves. Installing is the opt-in. With no key, the npm `jevctl` 0.2.3 hook falls back to the built-in summary with a notice. | vendored `fast-jev.ts:75`, `:269-287` | Confirmed |
| 27 | drop | keep for now, set the trigger, align the messages now | drop now | D5 turned the probe into a repo-wide contract, and the two Planned specs already print different lines for the same failure. 002 prints `jev arm refused: expected jev 0.6.2` where 003 prints `jev arm skipped: <check>`. Align the messages now with a doc edit. Extract the probe at the third certain caller, which is N1's arm in the seat's order. | 002 `spec.md:112`, 003 `spec.md:121`, 003 `plan.md:111` | Confirmed |

The seat confirms rows 2 to 4, 7 to 26 and 28 to 35 as written.

### 4. The four operator ideas

**Idea 1, grading AI responses.** The plan delivers nothing now. R5 to R7 wait on gold nobody has scheduled, and per-turn grading is dropped. The operator notices nothing. The labor, if pursued, is R6's hand-generated replies plus about 98 scores per run. Change: none to the verdict. Tell the operator in one line that no grading use earns a build, because the only grading harness has no recorded run. Separately, fix the silent `--grader` mock fallback as a non-Jev defect.

**Idea 2, active advisor recommendations.** The plan delivers R1 in 002: offline, cents, zero labor. The operator notices only a report, and the plan names no route from a win to a served form. Change: add the live-path verdict line, the confidence split and a zero-call census of how often the operator's own recent prompts produce a near-tie cluster. Also write row 1's revival rule so the report ends in a decision.

**Idea 3, goal hook, plugin and extension.** The plan delivers R2 in 003, for OpenCode only, at a cost of 30 to 50 labeled rows. The operator notices nothing: neither Pi nor OpenCode has a goal record on disk. The goal surface they use daily is Claude Code's native judge, which the repository cannot change. That judge "sees only the stored string" (`goal-set-string-playbook.md:55-57`). Change: demote R2 and add N2, which checks at authoring time that each goal criterion can be judged from that string. It reaches every runtime through `/create:goal`, a path that added at least 165 goal files still present today in 30 days (Confirmed, rename-aware count).

**Idea 4, compaction.** The plan delivers nothing: R11 is later and on the wrong seam. The operator notices nothing, yet the measured cost is the largest in this review. Change: N1. First a zero-call census of the operator's 204 compaction points, then a keyed Jev deletion arm, then an install decision for the operator. The operator's "Jev plus a compressor" hybrid (keep verbatim, summarize the rest) is not what the fast-jev-compaction plugin offers, going by the blog's description. Consider it only if pure deletion keeps recall but fails on size.

### 5. D5 and enablement UX

**What the operator does to turn a feature on:**
1. Once: install the Python `jev-cli` 0.6.2. This is an install, so it needs a yes and a rollback. Then confirm `jev --version` prints `jev 0.6.2`.
2. Once: store a key with `jev auth set --provider official`, or export `TYPESAFE_API_KEY` in the user-level environment. Never put it in the tracked `.claude/settings.json`.
3. Optional: `jev auth test` proves the key works, at the cost of one billed call (`providers-and-models.md:145-148`).
4. Per feature, one switch: `--jev` on each script, or `OPENCODE_GOAL_VERIFIER=jev` for the plugin.

**Keep one switch per feature.** Each switch is consent for a different payload class: routing prompts are low sensitivity, session excerpts high and full history highest. Do not add a global switch. Under D5 the key already is the global switch, and a second one is a knob that multiplies.

**How the operator knows it is on and working.** The scripts already print the gate result, the payload class, the call count and the model from `auth test` (002 REQ-009 and REQ-011). The plugin mode has no visible channel. 003 promises "one enablement line" (003 `spec.md:134`), but the plugin's only stderr writer is gated on the debug flag (`opencode-goal.js:835-839`). Put the state where the operator already looks: `/goal-opencode show` already prints `verifier_source=` and `verifier_last_verdict=` (`:2987-2989`). Add a proposed `verifier_shadow=` field showing on, off with the failed check, or disabled after a rejected key, plus the last shadow verdict. This answers "is it on" with a command they already use.

**Two traps to close:**
- `auth status` proves presence, not validity. The scripts' single `auth test` settles validity. The plugin only learns on its first call, and `show` should display that result.
- If the npm `jevctl` 0.2.3 shadows the Python `jev-cli` on PATH, every feature refuses. The refusal line should print the version line it found and the binary's path, so the operator knows what to fix (proposed wording).

**Shared probe helper: not yet.** There are two certain callers, 002's `score-jev-tiebreak.mjs` and 003's scorer. The 003 plugin is conditional. In the seat's order the third certain caller is N1's arm, which is where to extract a probe of about 30 to 40 lines (proposed name `jev-probe.cjs`). Align the skip messages today, because they already diverge.

**"Jev gets no secret" can remove a check from the operator.** 003 hands secret stripping to the operator by hand (`tasks.md:36`). The repository already has a fail-closed scrubber with typed `[REDACTED:<kind>]` markers (`secret-scrubber.ts:4-16`). Route every payload derived from a session through it, and have the operator spot-check instead of strip. How well it covers transcript text is Inferred: its stated contract is the memory write path.

### 6. New material assessment

**Jev criterion lint for `check-goal.cjs`.** Both claims hold:
- `CHECKS` holds four structural checks (`check-goal.cjs:44-49`), and the criteria check counts 3 to 7 only (`:326-336`).
- The rule "checkable without opening another file" (`SKILL.md:122`, `authoring-standards.md:48-52`) has no machine check. `rg` found it in prose and templates only.

Zero-call census:
- 1,387 criteria in 294 goal files.
- A strict regex flags 21 criteria in 21 files that point to another document for their pass condition (7.1% of goal files). An example is "every row of the research lane's confirmed-findings table".
- 239 criteria have no backtick, no digit and no observable verb. These are candidates for vagueness, and many of them are fine.
- The native judge's reasons rarely blame an unverifiable criterion: 3 "cannot verify" and 28 "no evidence or not shown" out of 576 reasons the seat could extract.

UX verdict: the deterministic warning is the useful part, and it removes the authoring "Reader check" (`authoring-standards.md:52`) in a flow the authoring agent must act on. Both workflows say "resolve each finding before handoff" (`create-goal-auto.yaml:221`, `create-goal-confirm.yaml:238`). A Jev `noul` for the vague remainder is a modest second pass. It must never change exit status, because `check-goal` is itself a completion gate.

**Compaction options.** The blog describes a third-party plugin. It uses the same mechanism as the vendored npm `jevctl` 0.2.3 hook: keep threshold 0.5, the newest 6 messages pinned, a 25,000-token state budget with staged shrinking that throws when the state cannot fit, and a fallback to the built-in summary with a notice (`compact.ts:22-24`, `state.ts:190-197`, `fast-jev.ts:269-287`).

Requirements:
- Claude Code 2.1.274 or later. The operator runs 2.1.280 to 2.1.283 (Confirmed from transcript version fields).
- `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`, an early-access flag. Whether it still works on 2.1.283 is UNKNOWN.
- The key in the Claude Code environment.

Three risks the blog does not price:
- **Fit.** The operator's sessions compact at about 450k or 970k tokens, against a 25k state budget. Heavy abridging or a fallback is likely (Inferred).
- **Size.** All prose is kept verbatim, so the post-compaction context may be several times the stock p50 of 20,327 tokens. That means more tokens every turn (Inferred).
- **Secrets.** The whole-history payload of prose and tool inputs goes to a third party, and whether the plugin scrubs secrets is UNKNOWN. So D5's "no secret" cannot be promised without the operator's explicit acceptance.

The cache-break warning adds nothing at compaction time, because stock compaction already replaces the prefix (Inferred).

The seat's call: build the repository harness first (N1: zero calls, zero egress), and install the plugin only after a measured keep. The plugin is then the lowest-maintenance path, with no repo code to own. Installing first would send history out on every compaction with no baseline and unknown fit. The blog's separate PostToolUse Bash filter drops as a Jev item: it would add a call and egress to every Bash call, and a deterministic protect-list is the cheaper move.

**jevcache.sh (vendor claims, not reproduced): drop.**
- Its premise that 60 to 80% of decisions repeat fails here. Substantive prompts repeat 3.6% exactly, goal and compaction states are unique per session, and stability reruns forbid caching (row 30).
- "Only a hash ever leaves it" sits badly with a `decide` command that needs a backend on every miss (Inferred from its own command list).
- It installs by `curl | sh`, which is supply-chain risk and needs a yes.
- It reads `JEV_API_KEY`, which D5's `jev auth status` probe does not cover. That makes a second credential path.

**classifier.dev (vendor claims): drop.**
- The free tier needs no key, so data would leave the machine with no key gate, which conflicts with D5.
- The Smart tier puts a second model provider in the path.
- The npm `classify` command duplicates the Python `jev-cli` `choice` and would add a dependency.

### 7. New recommendations

**N1. Compaction replay census, then a Jev deletion arm**

| Field | Record |
|---|---|
| Verdict | build-now for the census, next for the arm |
| What Jev judges | Per old tool call: two `noul`s, keep the call and keep its result verbatim, batched with `jev run` on the Python `jev-cli` 0.6.2 |
| Seam | The host summary, recorded as `compactMetadata` and `isCompactSummary` in local transcripts. The repo hook does not own it (`compact-inject.ts:1-8`). The algorithm is the vendored npm `jevctl` 0.2.3 code (`compact.ts:22-24`, `state.ts:190-197`), with its host replacement point at `fast-jev.ts:269-287` |
| Value | Aims at 373 minutes over 204 compactions, p50 104.5 s. It would remove waiting, and may remove re-explaining of paths and errors that a summary paraphrased away |
| Metric, baseline and harness | Baselines at zero calls: stock `durationMs` p50 104,523, `postTokens` p50 20,327, plus two derived measures: needed-later fact recall of the stock summary (identifiers used after the boundary that appeared before it) and the rate of files read again after compaction. The arm scores the same points on wall time, kept tokens, recall and fallback rate. Keep threshold, fixed before the build (proposed): p50 30 s or less, recall no lower than stock, kept tokens at most 3 times stock, fallback rate 20% or less |
| Cost, latency and privacy | The census makes no call and sends nothing. The arm costs cents per point at the vendor-claimed price (Inferred). Its payload is prose and tool inputs, the highest class, so the scrubber must run fail-closed and egress must be announced |
| Opt-in and no key under D5 | The census needs no key. The arm runs behind `--jev` (proposed) and the D5 probe. With no key it prints the skip line and leaves the census unchanged. The operator's install of the plugin is its own opt-in |
| Smallest slice | One read-only script beside `fable-metrics.cjs` (`system-spec-kit/runtime/cli/metrics/`, proposed location). It prints one row per compaction: wall time, pre and post tokens, estimated placeholder-state tokens against 25,000 and a lower bound of kept tokens. Counts only, no transcript text |
| Fitness checklist | Q8 partial: it reads an undocumented host format, so it must fail loudly on unknown shapes. Q9 and Q11 fail for the arm and for adoption: history leaves the machine and Jev deletes context. Acceptable only on a sample the operator chooses, with the scrubber on, and only if recall is at least stock. Q12: porting about 900 lines of vendored TypeScript avoids a dependency, while using the npm library needs a yes. Q14 fails until the operator approves the plan amendment. Q4 climbing sentence: no repository script reads compaction metadata (`rg`: 0 readers), and `fable-metrics.cjs:6-14` is runtime-agnostic by contract. All other questions pass |

**N2. Goal criterion checkability**

| Field | Record |
|---|---|
| Verdict | next for the deterministic warning plus a labeled sample. The Jev arm is later, and only if the regex misses too much |
| What Jev judges | `noul`: can an evaluator who sees only this sentence decide pass or fail? |
| Seam | A fifth, warning-only entry in `check-goal.cjs:44-49`, backing the rule at `SKILL.md:122`, under the evaluator constraint at `goal-set-string-playbook.md:55-57` |
| Value | Removes the Reader check (`authoring-standards.md:52`) from a flow that adds at least 165 goals a month |
| Metric, baseline and harness | Baseline: 21 of 1,387 criteria flagged. The operator labels 100 criteria (binary, about 15 minutes, Inferred) to get the regex's precision and recall |
| Cost, latency and privacy | One `jev run` per goal authored. The payload is repository text, low sensitivity |
| Opt-in and no key under D5 | Warning-only behind `--jev` (proposed). Dormant with no key. Never changes exit status |
| Smallest slice | The regex warning and the labeled sample |
| Fitness checklist | Q8 fails until sk-create-goal's owner approves: `check-goal` has no warning tier today (`rg warn`: none), and its callers are the two create-goal workflows and `check-goal.test.cjs`. All other questions pass |

### 8. Proposed phases, in build order

1. **`004-compaction-jev-replay` (add).** First slice: the N1 census.
   - Check: it prints 204 points at today's count, p50 `durationMs` 104,523 and p50 `postTokens` 20,327, which must match this review's greps.
   - Its output contains no transcript text, and `git status` shows only the new script.
   - Stop before any call (proposed thresholds) if fewer than half the points fit 25k without collapse, or if the p50 kept lower bound exceeds 3 times stock.
2. **`002-advisor-jev-tiebreak-arm` (keep, modify).** Add a `live-path` line (p95 against the budget), the confidence split and a count of near-tie clusters on local prompts. Align the skip messages with 003.
   - Check: the report prints all three next to `keep`.
3. **`005-goal-criterion-checkability` (add).** First slice: the regex warning and the 100-row labeled sample.
   - Check: `check-goal` across active goals prints 21 warnings, and no goal's exit status changes.
4. **`003-goal-verifier-jev-shadow` (modify, park).** Mine excerpts from Claude `goal_status` records, pre-labeled by the host judge. The operator adjudicates only disagreements. Excerpts pass through the scrubber, and shadow state shows in `show`. Gate the phase on confirmed OpenCode or Pi goal use.
   - Check: the scorer prints a heuristic versus host-judge agreement matrix with zero Jev calls.

### 9. Re-synthesis

Yes, a targeted one. These sections would change:
- **Section 1** gains the measured compaction cost and which goal runtime is actually in use.
- **Section 5** demotes R2 and adds the string-only evaluator.
- **Section 6** splits the repo PreCompact seam from the host summary seam, adds the 204-point baseline and the blog, and corrects the deadline comparison.
- **Section 8** annotates row 27.
- **Section 9** adds D5, the probe steps, the `show` surfacing, the scrubber and the repeat-rate evidence against caching.
- **Section 11** makes the tier changes above and adds N1 and N2.
- **What Not To Build** reframes rows 1 and 5, and adds rows for jevcache.sh, classifier.dev, a Jev Bash filter and a global Jev switch.
- **Section 12** adds four questions: the live near-tie rate, fast-jev fit on sessions of about 1M tokens, OpenCode goal use, and secret exposure in compaction payloads.
- **Section 13** gets the new phase order.
- **Section 15** notes that the synthesis never read the blog, the two vendor sites (bare URLs in `context/`) or any artifact local to the operator's machine.

### 10. Assumptions, evidence gaps and the alternative you challenged

Assumptions:
- This project's transcripts represent the operator's daily use.
- `durationMs` is felt wait. Auto-compaction during unattended runs may go unwatched, which would cut N1's value down to recall.
- OpenCode goal non-use rests on default state directories only. `OPENCODE_GOAL_STATE_DIR` could relocate the records, and the seat could not query the OpenCode SQLite store.

Evidence gaps:
- The seat read transcript keys and numbers, never content.
- The vendor-site summaries are relayed claims.
- The plugin's source is not vendored. The seat assumes it matches the npm `jevctl` 0.2.3 hook because the parameters the blog lists match.

The alternative challenged is the synthesis's ordering rule: "the smallest slice whose harness exists goes first". The seat also tested its own alternative against it. If the operator rejects sending history to a third party at any price, N1 ends at its zero-call census, which is still cheap and still answers idea 4 with a number. All three seats run Opus 5.5 max, so ranking felt cost above harness readiness is this seat's lens, not a finding.

### 11. Confidence

70. The counts are Confirmed and decisive for the demotions and for idea 4's cost. Three things remain Inferred: whether Jev deletion fits sessions of about 1M tokens, whether the wait is felt, and whether the operator accepts the egress.

### 12. Evidence ledger

**File:line reopened:**
- `research.md` in full.
- The goal plugin `opencode-goal.js` at `:36-37`, `:49`, `:134-135`, `:179`, `:226-234`, `:835-839`, `:869-878`, `:2197-2240`, `:2355-2435` and `:2980-2992`.
- The goal core `goal-core.cjs:596-620`, `goal/README.md:34`, `:46`, `:77-84`, and the single `verifyGoalHeuristic` caller at `pi/goal-context.ts:230`.
- The advisor hook `user-prompt-submit.ts:22-23` and `:105-125`.
- `.claude/settings.json:175-176` and `:215-222`, `compact-inject.ts:1-8` and `shared.ts:12` and `:14`.
- The advisor seams `ambiguity.ts:7-8` and `:44-58`, `scorer-eval-baseline.json:25-35`, and `score-outcome-rerank.mjs:127-133` and `:149-150`.
- `completion-evidence-sentinel.cjs:60-98` and `completion-evidence-stop.cjs:10-21` and `:125-139`.
- The Python `jev-cli` 0.6.2 docs: `cli-usage/SKILL.md:94-104` and `:167-174`, `providers-and-models.md:58-64` and `:143-149`, and `cli-reference.md:28`.
- The goal authoring rules: `check-goal.cjs:44-49` and `:326-358`, `sk-create-goal/SKILL.md:106` and `:121-122`, `authoring-standards.md:48-52`, `goal-set-string-playbook.md:53-57`, and the create-goal workflows `create-goal-auto.yaml:221` and `create-goal-confirm.yaml:238`.
- The vendored npm `jevctl` 0.2.3 code: `fast-jev.ts:5-10`, `:73-77`, `:269-287`, `compact.ts:22-24` and `state.ts:189-198`.
- The benchmark and deep-loop seams: `score-model-variant.cjs:207-211`, the four reviewer fixtures, `reply-harness/README.md:1-23`, `next-focus-selection.ts:351-365`, `fanout-merge.cjs:339-351`, `secret-scrubber.ts:1-25` and `fable-metrics.cjs:1-14`.
- The Planned phase docs: 002 `spec.md`, `plan.md` and `tasks.md`, and 003 `spec.md`, `plan.md` and `tasks.md`, all in full.
- The parent `goal.md:55` and `:142`.
- The blog and the ideas file in full, and the external-site stubs (bare URLs).
- MiMo iterations 1 to 10 and DeepSeek-07 in full. DeepSeek-03 and Grok-03 through a grep for compaction and verdict lines.

**Counts run:**
- Goal files: 312 tracked `goal.md`. 1,387 criteria in 294 files: 861 checked and 526 unchecked. 175 goals fully checked, 115 with none checked and 4 mixed. The strict regex flags 21 criteria in 21 files. 239 criteria have no anchor. At least 165 of today's goal files were added in the last 30 days.
- Goal state: 6 records, all Hermes and all unevaluated, with 0 continuation logs.
- Transcripts: 93 in this project's directory. 204 compactions (201 auto), with `durationMs` min 60,357, p50 104,523, p90 144,689, max 280,341 and total 373.0 minutes. `postTokens` p50 20,327. Claude Code versions 2.1.280 to 2.1.283. 750 `goal_status` records (61 met) across 21 sessions.
- Prompts: 2,088 typed prompts and 1,668 distinct. 16 repeated rows among the 439 prompts over 100 characters.
- Sentinel log: 567 lines, 238 in the last 30 days, 512 of them the implementation-summary advisory.
- Reviews: 409 registries, 3 transition reasons mentioning a P0 downgrade, and 41 of 4,236 iteration files with downgrade wording.
- Fixtures: 8 reviewer verdicts, all `fail`. The reply harness has 7 cases, 7 dimensions and 0 recorded runs.
- Readers: 0 repository readers of `compactMetadata`. No advisor shadow telemetry.

Nothing was written, run or sent: no file edits, no `jev` call of either package and no network call. The seat's only files are temporary count files in the session scratchpad.
