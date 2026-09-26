# Proposed Re-Synthesis: Targeted Amendments to `research/research.md`

## About This Draft

**Status.** This is a draft from the council run of 2026-09-26, and it has not been applied. `research/research.md` is unchanged.

**How to apply.** Each block below names the lines it replaces, or the place it goes, in `research/research.md` as it stands at this run. Apply it only after the operator approves (see `council-report.md`, Implementation Steps 1 and 3).

**Evidence markers.**
- A plain `file:line` citation was reopened by the council host during this run.
- "Seat-reported" means a council seat reopened it and the host did not.
- Vendor claims and user reports are labeled as such.

**Package rule.** Every `jev` means the Python `jev-cli` 0.6.2 unless the sentence names the npm `jevctl` 0.2.3.

**Sections left unchanged:**
- §2 Scope, Method and Inputs
- §8 RQ6
- §10 disagreements 1, 2, 4, 5 and 6
- the Divergence Map
- §17 Convergence Report

---

## A. §1 Executive Summary (replaces lines 41 to 45)

- Jev still earns its first place here as an offline measurement, not a live feature.
  - D5 makes every feature opt-in and dormant unless `jev auth status` exits 0.
  - D5 moves no hook deadline, so every drop that rests on a deadline stands.
- Build now, both at zero calls first:
  - `002-advisor-jev-tiebreak-arm`, with a keep rule that can fail. A sign test runs over modal picks, a per-row flip rate is measured, and the run prints one of `keep`, `kill`, `inconclusive` or `underpowered`.
  - `004-compaction-recall-harness`, a census of the operator's own host compactions and of what the stock summary and the repository brief keep.
- Next:
  - `005-goal-criteria-jev-lint`, which lints goal criteria against the rule the goal evaluator depends on. It starts lexical, then gets labels.
  - The zero-call slice of `003-goal-verifier-jev-shadow`. It first tests a free fix for a clamp defect that fails every long completion message in the OpenCode heuristic.
- Compaction is re-aimed, not revived inside the 3 s hook.
  - Claude Code function hooks are already enabled in this repository (`.claude/settings.json:38`). They are the route the vendored npm `jevctl` compaction uses.
  - The measured cost sits there: 204 host compactions in this project's transcripts, most of them over 100 s.
- Goals are re-aimed at authoring.
  - Claude Code's native judge ran 750 evaluations, and it "sees only the stored string".
  - The OpenCode plugin's default state directory holds no evaluated record.
- Verdicts: 2 build-now, 3 next (one of them conditional), 14 later and 39 drop. The 3 dead-end approaches are recorded under What Not To Build. R11 folds into R19.

---

## B. §3 RQ1 (two item replacements)

**Item 1 (replaces line 108).**

1. **The 5dim grader seam (S22).** All three lineages found it in wave 1.
   - Through the runner, the grader kind defaults to `noop` (`run-benchmark.cjs:577`, `const graderKind = args.grader || 'noop';`). A default 5dim run therefore carries `noop`'s fixed D4 (What Not To Build row 9).
   - `mock` is the default only when `score-model-variant.cjs` is called directly (`:20-21`). Any unrecognized kind also becomes `mock` (`:211`).
   - D4 carries weight 0.15 (`:58`) and is the grader's score (`:300`). The deterministic `hallucination-flag` check is recorded but never feeds D4 (`:284`).
   - Confirmed.

**Item 6 (replaces line 113).**

6. **Per-turn grading drops.** This is the form the idea takes in the Pi post (`:231`). It has no gold, and it taxes every turn.
   - The 0.22-to-0.58 shift at Pi post `:1121` is meraGPT's "Decider 1", not Jev. It is no evidence about Jev. The same line reports a done gate scoring 0.16 against 0.90 (third-party report).
   - The vendor's own review run kept a planted false positive at 0.57 (claude-jev `README.md:85-93`).

---

## C. §4 RQ2 (new items 10 to 14, inserted after line 136)

10. **The old keep rule could not fail.**
    - The stability coefficient is `1 - sd/|mean|` over the passes, with sample sd (`benchmark-stability.cjs:102-108`).
    - Only eligible rows vary between reruns. An aggregate over all held-out rows therefore stays near 1 even when Jev's picks flip freely, and at these sizes a random picker clears 0.95 (derived independently by two council seats, and Inferred until R1's rows exist).
    - One net row moves held-out MRR by about 0.0057, so "MRR rises" can hold on a single lucky row.
    - R1's new rule replaces it.
11. **The metric and the baseline match gold differently.**
    - The rerank eval matches the gold id exactly (`score-outcome-rerank.mjs:85-93`). The baseline capture matches through aliases (`capture-scorer-eval-baseline.mjs:70-76`).
    - R1 matches through aliases too. Otherwise a row the baseline counts as right could score wrong in the arm.
    - Confirmed from code.
12. **The pinned env has a gap.**
    - The capture sets `process.env.VITEST = 'true'` (`capture-scorer-eval-baseline.mjs:43`), and 002's plan omits it (002 `plan.md:63`).
    - Without that setting, the baseline column may not reproduce 53/70.
    - The line is Confirmed. Its effect is Inferred.
13. **The census covers both files and both halves.**
    - The held-out half is a fixed lexical split (`score-outcome-rerank.mjs:118-121`).
    - Jev fits nothing, so the train half is not contaminated for the Jev arm. The comparator that learns outcome weights still scores on the held-out half only (Inferred).
    - The census therefore counts all 177 skill-firing labeled rows and all 64 skill-firing holdout rows.
14. **An underpowered census still yields a Jev number.** If fewer than 5 rows are decided, R21 runs a `noul` calibration on the 195 Gate 3 labels. 002 then always returns a per-call latency record.

---

## D. §5 RQ3

**Answer (replaces line 144).**

**Answer.** The OpenCode goal plugin is still the one live seam where a Jev verifier lens fits, but three facts reorder the work.

- Its heuristic fails every completion message longer than 1,200 characters through a clamp defect, and a free fix may cure that before any Jev arm.
- The operator's recorded goal use runs on Claude Code's native judge, not on this plugin.
- That judge sees only the stored goal string, so criterion quality at authoring is the seam the operator's goals actually pass through (R20, next).

R2's zero-call slice stays next. Its Jev arm and plugin shadow mode move to later, behind recorded OpenCode or Pi goal use.

**Table row "Claude and Codex" (replaces line 151).**

| Runtime | What judges completion today | Where | Jev fit |
|---|---|---|---|
| Claude and Codex | The native host goal command, which judges from the stored goal string only | `goal/README.md:81-82`, `goal-set-string-playbook.md:55-57` | No repository verifier to extend. Criterion quality at authoring reaches it (R20) |

**Item 1 (replaces line 153).**

1. **The vocabulary needs no mapping inside OpenCode.**
   - The plugin's verdicts are `met`, `not_met` and `blocked` (`opencode-goal.js:179`), and the `llm` prompt asks for exactly these (`:2232-2240`).
   - The shared goal-core returns `met`, `not-met` and `unclear` (`goal-core.cjs:601-619`). Any comparison across runtimes therefore needs a mapping.
   - Confirmed.

**New items 8 to 11 (inserted after line 159).**

8. **A clamp defect fails every long completion message.**
   - Evidence is redacted at capture (`opencode-goal.js:1107`). Redaction ends in `sanitizeInlineText` (`:475`), which clamps to 1,200 characters (`:42`) and appends `...` (`:382-389`).
   - The heuristic clamps again (`:2199`). It then reads a trailing `...` as truncation and returns `not_met` (`:2209`).
   - Evidence longer than 1,200 characters after sanitizing can therefore never reach `met`. It fails at the blocking check (`:2205`) or at the truncation check.
   - goal-core carries the same truncation check (`goal-core.cjs:607`) and returns `unclear` there.
   - Confirmed from code. How often live evidence runs that long is UNKNOWN.
   - The free fix R2 must test before any Jev arm gets credit is a tail-window arm: the same checks run on the last 1,200 characters, with no appended marker.
9. **Recorded use points at Claude Code's native judge.**
   - This project's Claude Code transcripts hold 750 `goal_status` records across 21 sessions (council host count).
   - The plugin's default state directory resolves to `skills/.state/goal/` beside the plugin (`opencode-goal.js:36-37`). In the main checkout, `.skilled/skills/.state/goal/` holds 5 active records and 1 archived record. All six are `runtime: hermes` and `not_evaluated`.
   - A custom `OPENCODE_GOAL_STATE_DIR` could hold other records. OpenCode non-use is therefore Inferred, not Confirmed.
10. **Criterion quality has no machine check.**
    - `sk-create-goal` requires "three to seven self-contained criteria", each "checkable without opening another file" (`sk-create-goal/SKILL.md:121-122`).
    - `check-goal.cjs` runs four structural checks only: missing binding row, placeholder, criteria count and parent budget (`check-goal.cjs:44-49`). `/create:goal` runs it (`create-goal-auto.yaml:221`).
    - This packet's own parent `goal.md:107` has a criterion that depends on another file.
    - Confirmed. R20 is the lint.
11. **A likely redaction gap before any egress.**
    - The keyword rule `\b(api[_-]?key|token|password|secret)\s*[:=]` (`opencode-goal.js:474`) needs a word boundary before the keyword, and `_` is a word character.
    - So `SERVICE_TOKEN=` or `TYPESAFE_API_KEY=` would pass unredacted, unless the value trips the generic 48-character rule (`:473`).
    - Derived from the regex. A unit case settles it before R2's second slice sends anything.

**Lineage position (append to line 161).** The council review of 2026-09-26 keeps next for the zero-call slice only. The Jev arm and the plugin mode wait on recorded use. seat-002 would park 003 entirely.

---

## E. §6 RQ4 Compaction (replaces lines 169 to 177)

**Answer.** There are two compaction seams, and the first synthesis examined only one.

- The PreCompact command hook writes a brief under a 3 s limit. No live Jev pass fits it.
- The host's own summary is where the measured cost sits. Claude Code function hooks can replace that summary, and they are already enabled in this repository.

Nothing yet measures what either seam keeps. Build the zero-call recall census first (R19, build-now). Build the offline Jev deletion arm only if the census shows it can fit and has room to win.

1. **Two seams.**
   - **The PreCompact command hook.** It precomputes a brief and caches it for SessionStart, and its stdout is not injected on PreCompact (`compact-inject.ts:1-8`). The internal budget is 1800 ms (`shared.ts:12`), the merge warns above 1500 ms (`compact-inject.ts:353-354`) and the hook times out at 3 s (`.claude/settings.json:215-222`). Confirmed.
   - **The host summary.** Claude Code writes its own summary at compaction.
     - A function hook on `session.compact` can return messages that replace it. The vendored npm `jevctl` hook does exactly that (`plugin/hooks/fast-jev.ts:269-287`).
     - Function hooks need `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` (npm `jevctl` `CHANGELOG.md:59`), and this repository already sets it (`.claude/settings.json:38`).
     - The hook types include a `precompute` trigger (npm `jevctl` `claude-code.d.ts:7285`).
     - Confirmed. Whether Claude Code bounds a function hook's run time is UNKNOWN.
2. **The measured cost is the host summary.**
   - This project's Claude Code transcripts hold 212 `compactMetadata` records. 8 of them are in subagents, which leaves 204 top-level, and 3 of those were manual.
   - The council host could read 154 durations. None was under 60 s, and 97 were at or above 100 s (council host count).
   - A seat reports a p50 of about 104.5 s and 373 minutes in total (seat-reported).
   - The one Jev compaction timing, 5.6 s against 44.8 s for an LLM summarizer, is a user report and was not reproduced (Hermes post `:18-27`).
3. **The vendored library has hard limits.**
   - The whole placeholder state must fit 25,000 tokens (npm `jevctl` `src/vendor/compaction/compact.ts:24`). Past that it throws "history too large for Jev" (`state.ts:304-305`).
   - The hook falls back to the built-in summary on any error, or when the reduction is under 25% (`fast-jev.ts:26-31`, `:277-285`).
   - It auto-compacts at 60% of context (`:27`, `:289-303`).
   - Confirmed. R19's census estimates whether this operator's sessions fit.
4. **The brief has its own noise.**
   - The path extractor keeps the first 20 paths it matches (`compact-inject.ts:117-176`).
   - The attention extractor's noise list holds only JavaScript built-ins (`:149-155`).
   - One observation, not a measurement: this council's own post-compaction brief listed "The", "Jev" and "Confirmed" as its top attention terms.
5. **The tests check mechanics.** The precompact tests do not check what survives (`hook-precompact.vitest.ts:29-60`). Confirmed. R19 fills the gap row "Compaction recovery quality".
6. **The prompt-cache hazard, restated.**
   - The brief rewrites no history (`compact-inject.ts:1-8`).
   - A host-summary replacement does rewrite history, but at the compaction boundary, where the host summary already breaks the cache.
   - The vendored hook's auto-compact at 60% would add compactions, and each extra one breaks the cache. Inferred.
7. **Vendored patterns that carry over.**
   - Off by default, with an egress warning (pi-jev `README.md:35-37`).
   - A missing judgment keeps the item (pi-jev `context.ts:118-126`).
   - Any error falls back to the host summary (`fast-jev.ts:283-285`).
   - The anti-pattern under D5 is the npm `jevctl` hook itself. It runs unless `compaction` is `false` (`fast-jev.ts:75`), and it reads `TYPESAFE_API_KEY` outside any gate (`:237-253`).
8. **A cheaper move still comes first.** Measure the brief's 4000-token budget (`shared.ts:14`) inside R19's census. It is a value change with no Jev call (MiMo-03).

---

## F. §7 Table (two rows replaced, two rows added)

Replace the Gate 3 row (line 196) and the last row (line 203). Add the two new rows at the end.

| Judgment point | Decided today by | Evidence | What Jev could add | Verdict |
|---|---|---|---|---|
| Gate 3 write classification | Code classifier at F1 0.9843 | H3 (digest). `labeled-prompts.jsonl` holds 127 `yes` and 68 `no` | A calibration record, not a product: per-call latency, F1, Brier score and flip rate on labeled prompts | Drop as a product. The corpus is R21's calibration input |
| Git preflight, MCP route guard, executor demotion | Code | `git-preflight-advisory.mjs:26-34`, `bayesian-scorer.ts` (seat-reported), seam map S13 | S12 decides on git facts, and S21's scorer has no production caller | Drop all three. S13 by DeepSeek-05, S12 and S21 by the council review |
| What survives host compaction | The host's own summarizer | `.claude/settings.json:38`, transcript counts (section 6) | A `noul` keep-or-drop per old tool call, offline | Build-now census, later Jev arm (R19) |
| Goal criterion checkability | Nobody. `check-goal.cjs` checks structure only | `check-goal.cjs:44-49`, `sk-create-goal/SKILL.md:121-122` | A `noul` per criterion beside a lexical lint | Next (R20) |

---

## G. §9 RQ7 Cost and Restraint

**New subsection, inserted after the Privacy table (after line 253).**

**D5, the opt-in and key gate (decided after this synthesis).**

- **Dormant without a key.** Every feature is opt-in and dormant unless a key is present.
  - The gate runs `command -v jev`, then `jev --version` printing `jev 0.6.2`, then `jev auth status` exiting 0.
  - `jev auth status` exits 3 with no key. It checks presence, not validity. It prints no key and spends no quota.
- **Presence is not validity.** A present but rejected key passes the gate and fails on the first billed call. Each feature prints its own line for that case (proposed wording: `jev arm stopped: key rejected`), and it marks the affected rows unmeasured, never scored.
- **One switch per feature.** Under D5 the key already is the global switch. Each feature keeps its own flag, because each flag consents to a different payload class (see the table above). A second global switch adds nothing.
- **One skip-line form everywhere.** The form is `jev arm skipped: <check>`, where `<check>` names the failed step (003 `spec.md:121`). 002's `jev arm refused: expected jev 0.6.2` and `jev arm skipped: no credential` (002 `spec.md:112`, `:131`) align to it.
- **D5 moves no deadline.** No drop that rests on a hook deadline reopens.
- **A shared probe waits for its third certain caller** (What Not To Build row 27).

**Privacy table.**

The R11 row becomes "History fragments | Highest | R19 arm (R11 folded in)". Add these rows:

| Payload | Sensitivity | Where |
|---|---|---|
| Transcript counts and timings, no text | Nothing leaves the machine | R19 census |
| Whole-session prose and tool inputs | Highest. Needs a fail-closed scrubber and an enablement notice | R19 arm |
| Committed goal criteria | Low | R20 |
| Gate 3 corpus prompts | Low, the same class as R1 | R21 |

**Order, free numbers first (replaces lines 266 to 274).**

1. The R1 and R19 censuses, with zero calls, side by side.
2. The R1 arm: the first billed calls and the first latency record. R21 joins it if the census prints `underpowered`.
3. The R20 lexical lint and its labels, with zero calls.
4. The R2 zero-call slice: rows as ingested, with the heuristic and tail-window arms.
5. The R20 Jev arm, only past its stop rule.
6. The R19 Jev arm, only past its stop boundary and with a scrubber.
7. The R2 Jev arm and plugin shadow mode, only with recorded OpenCode or Pi goal use.

Nothing else gets built until one of these produces a number.

---

## H. §10 Disagreements 3 and 7 (resolution cells)

**Disagreement 3, the Resolution cell.**
- The question is unresolved on data.
- R1 now prints `kill` only for a loss significant at 0.05, and only `kill` closes R3. `inconclusive` and `underpowered` close nothing, and the report says so.
- For the other closed-set ideas, a `kill` is evidence against, not a verdict.

**Disagreement 7, the "Stronger evidence" and "Resolution" cells.**
- No decision reads a defer log.
- The level script does read the spec-level flags (`recommend-level.sh:36-47`: auth +10, api +8, db +7, architectural +20), so "no decision reads either output" was wrong for the flags.
- Resolution: drop both. The flags drop on low stakes and on missing gold, not on a missing reader.

---

## I. §11 Recommendations

**Table (replaces lines 359 to 378).**

| Rank | ID | Recommendation | Verdict | Jev type | Phase |
|---|---|---|---|---|---|
| 1 | R1 | Offline advisor tie-break arm, with a keep rule that can fail | build-now | `choice` | 002 |
| 2 | R19 | Compaction recall harness, then an offline Jev deletion arm (R11 folded in) | build-now for the census, later for the arm | `noul`, batched with `run` | 004 |
| 3 | R20 | Goal-criteria lint | next | `noul` | 005 |
| 4 | R2 | Goal verifier measurement, then an opt-in shadow mode | next for the zero-call slice, later for the Jev arm and mode | `choice` | 003 |
| 5 | R21 | Gate 3 calibration arm | next, only if R1 prints `underpowered` | `noul` | 002 |
| 6 | R3 | Advisor suggested order inside the cluster (cached lane dropped) | later | `choice` | not phased |
| 7 | R4 | Completion-claim offline audit | later | `noul` | not phased |
| 8 | R5 | Reviewer verdict classification fallback | later | `choice` | not phased |
| 9 | R6 | Reply-harness blinded judge | later | `score` | not phased |
| 10 | R7 | D4 hallucination grader kind (citation failed) | later | `noul` or `score` | not phased |
| 11 | R8 | Stop second-rater replay, Jev arm | later | `score` | not phased |
| 12 | R9 | Confirm-mode stop suggestion | later | none at use time | not phased |
| 13 | R10 | Severity replay, P0 reread order and a validity funnel log | later | `choice`, `score` or `noul` | not phased |
| 14 | R12 | Compiled-routing clarify suggested default | later | `choice` | not phased |
| 15 | R13 | Alignment below-50 suggestion | later | `choice` | not phased |
| 16 | R15 | Fan-out shadow pair record | later | `noul` | not phased |
| 17 | R16 | Injection screen on fetched text | later | `noul` | not phased |
| 18 | R17 | PR-claims advisory report | later | `noul` | not phased |
| 19 | R18 | Debug `next_check` choice | later | `choice` | not phased |

R11 is folded into R19. R14 is dropped (What Not To Build row 41).

### R1. Offline advisor tie-break arm (full replacement, lines 380 to 405)

| Field | Record |
|---|---|
| **Verdict** | **build-now.** It is the only idea whose harness, corpus and recorded baselines all exist today. It changes no shared contract, and its first phase costs zero Jev calls. Its keep rule can now fail |
| **What Jev judges** | A `choice`, Python `jev-cli` 0.6.2. The keys are the passing top skill, its `ambiguousWith` members and a `none` key. Each description is the skill's projection `description` (`types.ts:43`, `projection.ts:49`), and the state is the prompt text. Each call records the pick probability and the `none` probability |
| **Seam** | `ambiguity.ts:44-58` writes `ambiguousWith` on passing recommendations within 0.05, on score or on confidence (`:7-8`, `:22-36`), after `fusion.ts:785-789` sets the threshold. Eval template: `score-outcome-rerank.mjs:96-121`. Gold matching follows the capture's alias rule (`capture-scorer-eval-baseline.mjs:70-76`), not the eval's exact match (`score-outcome-rerank.mjs:85-93`) |
| **Value** | It decides, with a number, which skill goes first when the advisor's own scores call a near-tie. Today the fused order decides. A `keep` is the evidence a served order (R3) needs. A `kill` closes the live form of the operator's second idea with a number. `inconclusive` and `underpowered` close nothing, and the report says so |
| **Metric, baseline and harness** | **Metrics:** H2 MRR and right@3, plus H1 top-1, all alias-aware. <br>**Baselines:** holdout top-1 53/70 and ambiguity slice 18/24 at tau 0.03 (`scorer-eval-baseline.json:25-35`). <br>**Census:** zero calls, over all 177 skill-firing labeled rows and all 64 skill-firing holdout rows, with cluster and top-3 columns. <br>**Zero-call comparators on identical rows:** confidence order inside the cluster, always-second and the outcome-weighted rerank. <br>**Jev arm:** 3 reruns, one modal pick per row. Each eligible row scores win, loss or tie against the scorer's order. <br>**Outcome rule, fixed before the build:** <br>- `keep` needs three things: an exact one-sided sign test at 0.05 favoring Jev, a Jev MRR above every zero-call comparator, and no fall in right@3. <br>- `kill` when losses beat wins at the same level. <br>- `underpowered` when fewer than 5 rows are decided. <br>- `inconclusive` otherwise. <br>**Stability:** `keep` also needs a per-row flip rate across reruns at or below 0.10, which replaces the aggregate coefficient. <br>**Also reported:** a split by Jev's recorded pick probability, the near-tie rate, and a live-path line comparing the measured p95 against the advisor's remaining budget (What Not To Build row 1). The tau 0.03 veto stays for now (section 12, question 20). <br>**Gap rows filled:** "Jev latency and cost per call", "Jev judgment accuracy against gold" and "Judgment stability" |
| **Cost, latency and privacy** | One call per eligible row per rerun. The ceiling is 241 rows times 3 reruns, 723 calls, and the real count is the census's eligible rows. That is about $0.06 at the vendor-claimed price (inferred arithmetic on a vendor claim). R21 adds 585 short calls only when it runs. No deadline applies, because a person runs it. Corpus prompts and cluster skill descriptions leave the machine |
| **Opt-in and no key** | D5 (section 9). No existing file changes. <br>- **Default run:** the census, the baseline column and the comparators, with zero calls. <br>- **Jev arm:** runs only behind an explicit flag (proposed name `--jev`), and prints its payload class and call count before the first call. <br>- **Gate failures:** each failed gate step prints `jev arm skipped: <check>`. A present key that fails on the first call prints its own line (proposed wording `jev arm stopped: key rejected`). <br>- **Failure paths:** exit 4 gets one backoff retry and then marks the row `unmeasured`. Exit 1, exit 2 or a key outside the submitted set also mark the row `unmeasured`, and exit 2 stops the arm. <br>- **Other rules:** a `none` answer keeps the scorer's order and counts as an abstention. No path returns a default score |
| **Smallest slice** | One new file, `score-jev-tiebreak.mjs` (proposed name), in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`. <br>- It imports the built `dist` scorer and copies the eval's split and metric functions, with alias-aware matching. <br>- It sets the capture's pinned env, including `VITEST=true` (`capture-scorer-eval-baseline.mjs:43`). <br>- About 250 to 320 LOC, estimated. <br>To undo this, delete the script and its reports |
| **Fitness checklist** | Passes all 15. <br>- Q3: the census is the build-nothing test. <br>- Q4: a separate file keeps the rerank eval's meaning. <br>- Q8: it never writes the corpus or `scorer-eval-baseline.json`. <br>- Q11: a measurement, never served. <br>- Q15: the no-key run is the edge case |
| **Confidence** | **Confirmed from code:** the cluster rule, the split, the metrics, the baselines, the 2500 ms kill, the stability formula and the exact-id match. <br>**Derived:** that the old keep rule could not fail. <br>**Inferred:** that movable rows exist and that a `choice` beats the fused order. The census and the arm confirm or refute both |
| **Lineage agreement** | Unchanged. The council review (2026-09-26) found the keep-rule defect in two seats independently, seat-001 and seat-003 |
| **Citation check** | Resolved. Grok-02's H5 label drifts to H2 |

**Proof plan, written before the build.**

1. With no key, the script prints eligible and movable counts per file and per split, with cluster and top-3 columns.
   - Boundary: zero movable rows in both files means the report says "no headroom" and the arm does not run.
2. The baseline column reproduces 53/70 under the pinned env, `VITEST=true` included.
   - Boundary: any other number voids the comparison.
3. The zero-call comparators print MRR, right@1 and right@3 on identical rows.
4. With a key and the flag, the per-call JSONL records, for every call: wall time, exit code, `jev` version, provider, model, pick probability and `none` probability.
   - Boundary: an exit 4 row is `unmeasured`, never a pick.
5. The report prints wins, losses and ties, the exact sign-test p, the per-row flip rate and exactly one verdict line.
   - Boundary: `keep` needs a flip rate at or below 0.10.
6. If the verdict is `underpowered`, R21 runs and prints accuracy, F1, Brier score and flip rate on the Gate 3 labels.
7. `git status` shows no change outside the new script and its report directory.

**Kill criterion.**
- Only a `kill` closes R3 and the live form.
- `inconclusive` and `underpowered` close nothing.
- For the other closed-set ideas, a `kill` is evidence, not a verdict (section 10, disagreement 3).

### R2. Goal verifier measurement, then an opt-in shadow mode (full replacement, lines 407 to 430)

| Field | Record |
|---|---|
| **Verdict** | **next for the zero-call slice. The Jev arm and the plugin shadow mode are later.** <br>- The clamp defect (section 5, item 8) makes the zero-call slice worth more than first stated. <br>- The Jev parts wait on recorded OpenCode or Pi goal use, because the operator's recorded goals run on Claude Code's native judge (section 5, item 9) |
| **What Jev judges** | Later arm only: a `choice`, Python `jev-cli` 0.6.2, over `met`, `not_met` and `blocked` (`opencode-goal.js:179`). The descriptions follow the `llm` prompt (`:2234-2237`) |
| **Seam** | Unchanged (`opencode-goal.js:134`, `:226-234`, `:2197-2230`, `:49`, `:135`, `goal-core.cjs:603-604`). The slice also covers: <br>- the clamp path (`:42`, `:382-389`, `:463-476`, `:1107`, `:2199`, `:2209`) <br>- goal-core parity (`goal-core.cjs:601-619`) |
| **Value** | The decision "is this goal done" in OpenCode autonomous mode. The first slice also shows whether the clamp defect, rather than the heuristic's logic, drives the false `not_met`, and whether a free fix removes them |
| **Metric, baseline and harness** | **Rows:** taken as ingested, after capture redaction and the clamp, with raw length kept. Native Claude Code `goal_status` records are preferred where they carry evidence. The host judge's verdict pre-labels each row, and the operator adjudicates disagreements. <br>**Zero-call arms:** <br>- the heuristic as shipped <br>- a tail-window arm, running the same checks on the last 1,200 characters with no appended marker <br>- goal-core parity, `verifyGoalHeuristic` on the same rows, with `unclear` mapped for comparison <br>**Columns:** per-check error attribution, the clamp-error count and an optional claims column for R4. <br>**Stop rule:** unchanged, but applied to the better of the heuristic and the tail-window arm. <br>**Later Jev arm:** <br>- The keep threshold is unchanged, measured against the best zero-call arm. <br>- Stability becomes a per-row flip rate at or below 0.10. <br>- Each call records its confidence. <br>- A cascade table prints as offline analysis: heuristic first, then Jev only on rows the heuristic calls `not_met` without blocking language |
| **Cost, latency and privacy** | The zero-call slice sends nothing. Later arms are as first stated: at most 150 offline calls, then one call per verification inside the 30 s budget. The payload is the operator's conversation, the most sensitive in this research |
| **Opt-in and no key** | The zero-call slice needs no key. The later slices sit under D5 and their own flag, and the proposed `OPENCODE_GOAL_VERIFIER=jev` mode is unchanged. Two additions: <br>- `show` prints a `verifier_shadow=` field (proposed name) beside `verifier_source=`, so the operator sees whether the shadow ran. <br>- A unit case for `opencode-goal.js:474` passes before slice 2 sends anything |
| **Smallest slice** | The labeled rows and one zero-call scorer that drives `maybeVerifyGoal`, or one `__test` entry (`opencode-goal.js:3359-3385`). The tail-window arm is about 10 lines. About 120 to 170 LOC plus 30 to 50 rows, estimated |
| **Fitness checklist** | Q1 fails until the rows exist, which is acceptable because the rows are the slice. <br>- Q8: a clamp fix belongs to the plugin owner and is reported, not made, here. <br>- Q9 and Q11 as first stated, for the later slices only |
| **Confidence** | **Confirmed:** the clamp path, the mode switch, the vocabularies and the fallback paths. <br>**Inferred:** OpenCode non-use, and the live frequency of long evidence |
| **Lineage agreement** | As first stated. Council review: seat-001 and seat-003 at next, seat-002 would park it |
| **Citation check** | Resolved |

**Proof plan, written before the build.**

1. At least 30 rows, each with an objective, the evidence as ingested, its raw length and one label.
2. The heuristic, tail-window and goal-core arms print confusion tables on identical rows, with per-check attribution and the clamp-error count.
   - Boundary: the stop rule.
3. If the tail-window arm meets the stop rule, report the clamp fix to the plugin owner and build no Jev arm.
4. Only with recorded OpenCode or Pi goal use: the Jev arm under the wrapper rule, with 3 reruns and the cascade table.
5. Only past the threshold: the plugin shadow mode.
   - Boundary: with no key, a `jev`-mode session reaches the same verdicts as `heuristic` mode, plus one log line per verification.

### R3 (field edits)

- **Verdict.** later, for the suggested order inside the cluster only.
  - The cached lane drops (What Not To Build row 40).
  - A cache hits only exact repeats, 3.6% of long prompts (seat-reported), and a first ask still meets the 2500 ms kill (`user-prompt-submit.ts:22-24`).
- **Smallest slice.** Promote only if R1 prints `keep` and its measured p95, spawn included, fits the advisor's remaining budget.

### R4 (field edits)

- **Metric.** R2's zero-call slice carries an optional claims column. R4's labels therefore come free once 003 labels its rows.
- **Lineage agreement, appended.** seat-002 would drop R4. On Claude the advisory reaches only an async Stop hook and a log (`completion-evidence-stop.cjs:132-139`, `.claude/settings.json:162-177`).

### R7 (Value field)

- Through the runner, the default grader is `noop`, a fixed D4 (`run-benchmark.cjs:577`).
- `mock` is the default only for a direct call of `score-model-variant.cjs` (`:20-21`), or for an unrecognized kind (`:211`).
- A cheap real D4 would make its 0.15 weight mean something.

### R8 (Smallest slice, appended)

- Target inert-novelty windows first (DeepSeek-04).
- About half of lineage configs force max iterations, and there an earlier stop changes nothing (seat-reported census).

### R11 (replaces the record)

- Folded into R19.
  - The brief-selection question becomes R19's brief column.
  - The Jev pass becomes R19's later arm.
- The 3 s limit binds only the PreCompact command hook.

### R14 (replaces the record)

- Dropped (What Not To Build row 41).
- `compareNextFocusShadow` has no runtime caller. The only references are a re-export (`next-focus/index.ts:13`) and one test (`next-focus.vitest.ts:474`). A Jev `choice` there would feed nothing.

### R15 (Value field, appended)

- Add the cross-body blind spot. Findings on the same point with different bodies are never compared (`fanout-merge.cjs:341`, `:348-351`, DeepSeek-05).
- Promote only with a labeled pair set and a named reader.

### R19. Compaction recall harness, then an offline Jev deletion arm (new)

| Field | Record |
|---|---|
| **Verdict** | **build-now for the zero-call census. The Jev arm is later.** It is the operator's fourth idea, at the seam where the measured cost sits |
| **What Jev judges** | Nothing in the census. <br>In the later arm, two `noul` questions per old tool call: keep the call, and keep its result verbatim. They are batched with `run` on the Python `jev-cli` 0.6.2, as a port of the npm `jevctl` procedure |
| **Seam** | Host compaction, recorded as `compactMetadata` in local Claude Code transcripts. The function-hook route (`.claude/settings.json:38`, npm `jevctl` `plugin/hooks/fast-jev.ts:269-287`, `claude-code.d.ts:7285`). The repository brief (`compact-inject.ts:117-176`, budget `shared.ts:14`) |
| **Value** | 204 host compactions, most of them over 100 s (section 6, item 2). The census answers two questions with numbers: <br>- whether a deletion pass could fit these sessions <br>- what the stock summary and the brief each lose |
| **Metric, baseline and harness** | **Per compaction, zero calls:** <br>- wall time <br>- pre and post tokens <br>- the estimated placeholder-state size against 25,000 tokens <br>- the brief's attention-noise share <br>- rule-derived must-survive recall, for both the stock summary and the brief <br>**Must-survive items:** identifiers and files used after the boundary that appeared before it, files written through Write or Edit, the bound spec folder and the last user instruction. <br>**Later arm, proposed keep threshold fixed now:** p50 at most 30 s, recall no lower than stock, kept tokens at most 3 times stock and a fallback rate of at most 20% |
| **Cost, latency and privacy** | The census makes zero calls. It reads only a transcript directory the operator names, prints counts only and never prints transcript text. The later arm sends whole-session prose and tool inputs, the highest payload class here. It needs a fail-closed scrubber, an enablement notice and the operator's acceptance |
| **Opt-in and no key** | The census needs no key and never spawns `jev`. The arm runs behind its own flag (proposed `--jev`), after the D5 gate. With no key it prints the skip line, and the census is unchanged. The vendored npm `jevctl` hook and the upstream plugin read `TYPESAFE_API_KEY` outside the D5 gate (`fast-jev.ts:237-253`), so installing either waits for the census |
| **Smallest slice** | The census over 10 to 20 sessions the operator names. One read-only script (proposed name `score-compaction-recall.mjs`) |
| **Fitness checklist** | <br>- Q1 fails until the census runs, which is acceptable because the census is the slice. <br>- Q8: it reads an undocumented host format, so it must fail loudly on an unknown shape. <br>- Q9 and Q11 fail for the arm until a scrubber, a notice and acceptance exist. <br>- Q12: the arm needs a Python `jev-cli` port. <br>- Q14: the function-hook API is early access. <br>- The rest pass |
| **Confidence** | **Confirmed:** the enabled env, the vendored limits and fallback, and the transcript counts. <br>**Seat-reported:** the p50. <br>**Inferred:** that recall differs enough to matter. The census confirms or refutes it |
| **Lineage agreement** | None. This is a council addition (seat-002 and seat-003). seat-001 would rank it later |
| **Citation check** | Resolved by the council host |

**Proof plan.**

1. One row per compaction prints wall time, pre and post tokens, the 25,000-token fit estimate, summary recall, brief recall and the brief's noise share.
   - Boundary: an unknown record shape stops the run with a named error.
2. The output contains no transcript text, and a stub `jev` placed first on PATH logs no call.
3. `git status` shows only the new script and its report.
4. **Stop boundary for the arm.** It is not built if either of these holds:
   - fewer than half the compaction points fit 25,000 tokens without collapse
   - the kept-token lower bound exceeds 3 times stock.

### R20. Goal-criteria lint (new)

| Field | Record |
|---|---|
| **Verdict** | **next.** The first slice costs zero calls |
| **What Jev judges** | In the later arm, two `noul` questions per criterion, asked with the Python `jev-cli` 0.6.2: <br>- Can this criterion be checked from its own text? <br>- Does it name one observable result? |
| **Seam** | `check-goal.cjs:44-49`, the rule at `sk-create-goal/SKILL.md:121-122` and the runner at `create-goal-auto.yaml:221`. The evaluator sees only the stored string (`goal-set-string-playbook.md:55-57`) |
| **Value** | A criterion the evaluator cannot check leaves completion open, and the rule has no machine check. The lint reaches every runtime through `/create:goal` |
| **Metric, baseline and harness** | **Labels:** about 100 operator labels, stratified from about 1,380 criterion lines outside `z_archive` (seat counts). Precision and recall are scored per rule. <br>**Baseline:** a zero-call lexical lint. <br>**Stop rule:** stop if the violation rate is under 5%. <br>**Keep rule for the Jev arm, proposed:** it beats the lexical lint by at least 0.2 F1, with precision at least 0.8 and a flip rate at most 0.10. <br>**Base rate, disputed:** 1.5% by strict regex (21 of 1,387) against 7 of 25 in a one-lens sample. The labels decide. Native-judge reasons rarely blame an unverifiable criterion (31 of 576, seat-reported), which is why this item is next, not build-now |
| **Cost, latency and privacy** | About 600 offline calls for the arm. Committed repository text only, which is low sensitivity |
| **Opt-in and no key** | A separate script, not a fifth check inside `check-goal.cjs`. The Jev arm runs behind its own flag after the D5 gate. `check-goal.cjs`'s exit code never changes. With no key the output is byte-identical to today |
| **Smallest slice** | The lexical lint plus about 100 labels, with zero calls |
| **Fitness checklist** | <br>- Q1 fails until the labels exist, which is acceptable because the labels are the slice. <br>- Q8: an advisory inside `check-goal.cjs` later needs sk-create-goal's owner. <br>- The rest pass |
| **Confidence** | **Confirmed:** the rule, the missing check and one violating criterion in this packet. <br>**Disputed:** the base rate |
| **Lineage agreement** | None. This is a council addition (seat-003, with seat-002 corroborating) |
| **Citation check** | Resolved by the council host |

**Proof plan.**

1. The per-rule violation rate prints, along with lexical precision and recall against the labels.
2. `check-goal.cjs` exit codes are unchanged across all active goals.
3. A stub `jev` logs no call.

### R21. Gate 3 calibration arm (new, conditional, inside 002)

| Field | Record |
|---|---|
| **Verdict** | **next, conditional.** It runs only when R1's census prints `underpowered`. Single-seat (seat-003), bounded by the host |
| **What Jev judges** | One `noul` per labeled prompt: "does this request require writing a file" (proposed wording) |
| **Seam** | `labeled-prompts.jsonl` `gate3_triggers`: 127 `yes` and 68 `no`. The classifier baseline is F1 0.9843 (H3, digest) |
| **Value** | 002 still returns Jev's per-call latency, flip rate and calibration when the advisor leaves no headroom. Every live idea waits on that latency |
| **Metric, baseline and harness** | Accuracy, F1, Brier score and per-row flip rate over 3 reruns. It is a calibration, not a race, so What Not To Build row 21 stands |
| **Cost, latency and privacy** | 585 short calls. The same corpus prompts R1 already sends |
| **Opt-in and no key** | Runs under R1's flag and gate. It adds no new flag |
| **Smallest slice** | About 40 to 60 LOC inside `score-jev-tiebreak.mjs` (proposed name) |
| **Fitness checklist** | All pass. The risk is scope creep in 002, bounded by the `underpowered` condition |
| **Confidence** | **Confirmed:** the label counts. **Inferred:** that the latency record generalizes to other payloads |
| **Lineage agreement** | None. This is a council addition (seat-003) |
| **Citation check** | Resolved by the council host |

---

## J. What Not To Build

**Intro (replaces line 708).** Rows 1 to 32 and 36 to 42 are dropped ideas, and rows 33 to 35 are dead-end approaches. Rows 36 to 42 were added by the council review of 2026-09-26.

**Changed reasons.**

- **Row 1.**
  - The child is killed at 2500 ms and the hook returns `{}`, and the advisor gets 2200 ms of that. The kill is Confirmed.
  - That a Jev call cannot fit is Inferred until a latency exists.
  - Revival rule: a cluster-only call comes back to review only if R1 prints `keep` and its measured p95, spawn included, fits the advisor's remaining budget.
- **Row 5.**
  - The idea becomes "a live keep-or-drop pass inside the PreCompact command hook".
  - Append: this drop covers the command hook only. The function-hook route, which replaces the host summary, is R19.
- **Row 6.**
  - D5 makes every Jev feature opt-in and dormant without a key.
  - The vendored hook breaks that in three ways. It runs unless `compaction` is `false` (`fast-jev.ts:75`), it reads `TYPESAFE_API_KEY` outside the D5 gate (`:237-253`) and it auto-compacts at 60% of context (`:27`).
- **Row 7.**
  - No gold, and a tax on every turn.
  - The 0.22-to-0.58 shift at Pi post `:1121` is meraGPT's "Decider 1", not Jev. It is no longer cited against Jev.
  - The evidence becomes Pi post `:231`.
- **Row 9, appended.** `noop` is the runner's default grader (`run-benchmark.cjs:577`), so every default 5dim run through the runner already carries its fixed score.
- **Row 21, appended.** The corpus is R21's calibration input, and a calibration is not a product.
- **Row 22.**
  - The level script reads the flags (`recommend-level.sh:36-47`: auth +10, api +8, db +7, architectural +20), so a Jev flag would change a level.
  - It drops on low stakes and on missing gold for which level a packet should have had, not on a missing reader.
  - The evidence becomes `recommend-level.sh:36-47`.
- **Row 27.**
  - Zero callers today.
  - Extract a shared probe at the third certain caller, which is whichever of the R19 or R20 Jev arms is built first.
  - Align the skip lines now (section 9).
- **Row 30.**
  - Identical cached answers make the per-row flip rate zero by construction.
  - The evidence becomes `benchmark-stability.cjs:102-108`.
- **Row 31.**
  - On Claude, the completion sentinel runs inside an async 10 s Stop hook (`.claude/settings.json:162-177`).
  - The 1200 ms bound and the host-blocking spawn apply to OpenCode (`completion-evidence-sentinel.cjs:90-94`).
  - The drop stands on Q11: done-gate authority stays with code.

**New rows.**

| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |
|---|---|---|---|---|---|
| 36 | jevcache.sh as a dependency | It installs by `curl \| sh` and reads `JEV_API_KEY` outside the D5 gate. It hits only exact repeats, and a cache during reruns zeroes the flip rate | Q7, Q9, Q12 | Vendor site (vendor claim) | Council |
| 37 | classifier.dev as a service | Its keyless free tier conflicts with D5, and it adds a second egress vendor. Its heuristic-then-model cascade survives as an offline table in R2 | Q9, Q12 | Vendor site (vendor claim) | Council |
| 38 | A Jev PostToolUse filter on Bash output | Command output is the payload most likely to hold secrets. A deterministic filter needs no key. Whether a command hook can replace tool output is UNKNOWN | Q9, Q11 | `.claude/settings.json:204-211` | Council |
| 39 | Jev at git preflight (S12) or executor demotion (S21) | S12 decides on git facts, and S21's scorer has no production caller | Q11, "never let a judgment stand in for a repository fact" | `git-preflight-advisory.mjs:26-34`, `bayesian-scorer.ts` (seat-reported) | Council (seat-003) |
| 40 | R3's cached advisor lane | Exact repeats only (3.6%, seat-reported), and a first ask meets the 2500 ms kill | Q1, Q7 | `user-prompt-submit.ts:22-24` | Council |
| 41 | R14's next-focus Jev comparator | No runtime caller of `compareNextFocusShadow` | "a report nobody reads" | `next-focus/index.ts:13`, `next-focus.vitest.ts:474` | Council host |
| 42 | A global Jev switch | Under D5 the key already is the global switch. One switch per feature keeps consent per payload class | Q6 | Section 9 | Council (seat-002) |

---

## K. §12 Open Questions

**Changed rows.**

| # | Question | What would resolve it |
|---|---|---|
| 1 | How many rows, across the labeled corpus and the holdout file, are movable, with the gold inside the cluster but not first? (`kq-eligible-rows`) | R1's census over both files, zero calls |
| 2 | Does a Python `jev-cli` `choice` beat the scorer's order and every zero-call comparator on those rows? | R1's arm: 3 reruns and the sign test |
| 3 | What are the per-call latency p50 and p95 of the Python `jev-cli` here? (`kq-latency-p95`) | R1's per-call JSONL, or R21's run |
| 4 | How far does an R1 loss reach? | A `kill` from R1, then R2's Jev arm, which is now later behind recorded goal use |
| 5 | What are the goal heuristic's error rates, and how many false `not_met` come from the blocking pattern and from the clamp defect? | R2's zero-call slice |
| 15 | Do S12 and S21 have any Jev fit? | Answered by the council review: no fit (What Not To Build row 39) |

**New rows.**

| # | Question | What would resolve it |
|---|---|---|
| 16 | How many holdout rows have the gold in the top 3 but not first? | R1's census, top-3 column |
| 17 | Does `opencode-goal.js:474` let `SERVICE_TOKEN=` and `TYPESAFE_API_KEY=` values through? | One unit case |
| 18 | Does Claude Code bound a `session.compact` function hook's run time, and at what? | The hook API reference, or one timed run with a stub |
| 19 | Does the operator run OpenCode or Pi goals with a verifier? | Goal state records with a verdict, in any state directory the operator uses |
| 20 | Are 11 of the 24 frozen ambiguity-slice margins negative, and should R1 veto on the tau 0.03 slice? | Reopening the frozen slice (seat-001's count, not reopened by the council host) |
| 21 | How often does the live advisor set `ambiguousWith` on real prompts? | A count from the advisor's shadow sink or hook log |
| 22 | What share of goal criteria cannot be checked from their own text? | R20's labels. The estimates disagree: 1.5% by strict regex against about 28% in a 25-row sample |
| 23 | How often does live OpenCode goal evidence exceed 1,200 characters? | Evidence lengths from the plugin's packet log, if the plugin is in use |

---

## L. §13 Proposed Build Phases (replaces lines 804 to 851)

Four phases, all under `specs/cli-jev/003-cli-jev-workflow-integration/`.
- 002 and 003 are Planned children, so each change to them below is an amendment the operator approves before their docs change.
- 004 and 005 are new.
- No separate measurement-only phase is needed, because each phase's first slice is its own measurement.

### 002-advisor-jev-tiebreak-arm (keep, modify)

| Field | Record |
|---|---|
| **Scope** | Measure, offline and by hand, whether a Python `jev-cli` `choice` over the near-tie cluster beats the scorer's order and the zero-call comparators, under a keep rule that can fail |
| **Recommendations** | R1. R21 runs only when the census prints `underpowered` |
| **First slice** | An alias-aware census over both files, with cluster and top-3 columns, plus the zero-call comparators. The env includes `VITEST=true` |
| **Likely files** | New: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (proposed name). Read only: `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and the built `dist` scorer |
| **Dependency** | The advisor `dist` is built first |
| **Rough size** | 250 to 320 LOC in one file (estimate) |
| **Observable check** | With no key: per-file counts, the baseline at 53/70 and the comparator metrics. With a key: wins, losses and ties, the exact p, one verdict line out of `keep`, `kill`, `inconclusive` and `underpowered`, the flip rate, p50 and p95, plus R21's metrics when it ran. `git status` shows only the new script and its reports |

**Amendments to the Planned docs:**
- **REQ-004:** the census covers both files, with alias-aware matching.
- **REQ-005:** the env adds `VITEST=true`.
- **REQ-007:** the outcome rule above.
- **REQ-008:** the per-row flip rate.
- **REQ-009:** per-call pick and `none` probabilities.
- **REQ-012:** unchanged for now.
- **Skip lines:** aligned to section 9.
- **R21:** added as conditional.

### 004-compaction-recall-harness (add, beside 002)

| Field | Record |
|---|---|
| **Scope** | Measure host compactions, and what the stock summary and the repository brief keep, over transcripts the operator names, with zero calls. Then decide on an offline Jev deletion arm |
| **Recommendations** | R19, with R11 folded in |
| **First slice** | The census over 10 to 20 sessions |
| **Likely files** | New: one read-only script (proposed name `score-compaction-recall.mjs`). Its directory is chosen at build time from system-spec-kit's hook-script layout, which this review did not map. It writes nothing under the transcript directory |
| **Dependency** | None. The operator names the sessions |
| **Rough size** | 200 to 300 LOC (estimate, Inferred) |
| **Observable check** | One row per compaction, with the fields in R19's proof plan. No transcript text in the output. A stub `jev` placed first on PATH logs no call. `git status` shows only the new script and its report |

### 005-goal-criteria-jev-lint (add)

| Field | Record |
|---|---|
| **Scope** | Lint goal criteria for self-containedness and one observable result. Lexical first, then labeled, and the Jev arm only past the stop rule |
| **Recommendations** | R20 |
| **First slice** | The lexical lint plus about 100 operator labels |
| **Likely files** | New: one script beside `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` (proposed placement). `check-goal.cjs` is read only |
| **Dependency** | None. The labels are the operator's, about 15 minutes of work (seat-002 estimate) |
| **Rough size** | 120 to 200 LOC (estimate) |
| **Observable check** | Per-rule violation rate and lexical precision and recall print. `check-goal.cjs` exit codes are unchanged across all active goals. A stub `jev` logs no call |

### 003-goal-verifier-jev-shadow (keep, modify)

| Field | Record |
|---|---|
| **Scope** | Give the OpenCode goal verifier its first measured error rates, and test a free fix for the clamp defect, all with zero calls. The Jev arm and the plugin shadow mode follow only with recorded OpenCode or Pi goal use |
| **Recommendations** | R2, plus R4's optional claims column |
| **First slice** | Rows as ingested, pre-labeled from native `goal_status` records where possible and adjudicated by the operator. The heuristic, tail-window and goal-core arms, with the clamp-error count |
| **Likely files** | New: a labeled JSONL fixture and one offline scorer beside `.skilled/hooks/goal/lib/` (proposed paths). Only if promoted: `.skilled/plugins/opencode-goal.js`, `.skilled/hooks/goal/goal-plugin.md` and the plugin tests |
| **Dependency** | The Jev arm waits on recorded OpenCode or Pi goal use and on a passing redaction unit case. Soft: 002's latency record |
| **Rough size** | 30 to 50 rows and 120 to 170 LOC for the zero-call slice, then 60 to 100 LOC for the plugin mode if promoted |
| **Observable check** | Confusion tables for all three zero-call arms on identical rows, with the clamp-error count. The Jev arm and the plugin mode do not start until goal records with a verdict exist |

**Amendments to the Planned docs:**
- **REQ-002:** adds the tail-window arm and the clamp-error count.
- **REQ-006 (d):** becomes a per-row flip rate.
- **REQ-009:** adds confidence and the cascade table.
- **T001:** prefers native `goal_status` records.
- **Slice 2:** gated on use and on the redaction unit case.
- **`show`:** gains `verifier_shadow=` (proposed name).

**Build order.** Do 002 and 004 first, side by side. Both cost zero calls until their censuses report. 002's per-call latency is still the number every live idea waits on.

### Not phased (later), with what would promote each (replaces the table at lines 834 to 851)

| Item | Promote when |
|---|---|
| R2 Jev arm and plugin mode | Recorded OpenCode or Pi goal use exists. The zero-call slice leaves false `not_met` that the tail-window arm cannot fix. The redaction unit case passes |
| R19 Jev arm | The census clears its stop boundary and a scrubber exists. A live hook form also needs question 18 answered and the operator's acceptance of the payload |
| R20 Jev arm | The lexical violation rate is at least 5%, and its F1 leaves room for a 0.2 gain |
| R3 suggested order | R1 prints `keep`, and its measured p95 fits the advisor's remaining budget |
| R4 completion-claim audit | R2's rows exist with the claims column, and the regex cannot cut false fires without new misses |
| R5, R6, R7, R9, R10, R12, R13, R16, R17, R18 | Unchanged |
| R8 stop replay Jev arm | Unchanged. The first slice targets inert-novelty windows |
| R15 fan-out pair record | A labeled pair set that includes cross-body pairs exists, and a reader is named |

---

## M. §14 Citation Verification Ledger (new rows 144 to 161, appended after line 1003)

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 144 | `benchmark-stability.cjs:102-108` | Council | resolved | `1 - sd/|mean|`, sample sd |
| 145 | `score-outcome-rerank.mjs:85-93`, `:118-121` | Council | resolved | Exact id match. Lexical split |
| 146 | `capture-scorer-eval-baseline.mjs:43`, `:70-76` | Council | resolved | `VITEST=true`. Alias matching |
| 147 | 002 `plan.md:63` | Council | resolved | Env list omits `VITEST` |
| 148 | `run-benchmark.cjs:577` | Synthesis section 3, council | resolved, fact corrected | The runner default is `noop`, not `mock` |
| 149 | `opencode-goal.js:36-37`, `:42`, `:382-389`, `:463-476`, `:1107`, `:2197-2230` | Council | resolved | The clamp defect path |
| 150 | `goal-core.cjs:601-619` | Council | resolved | `met`, `not-met`, `unclear`. Truncation check at `:607` |
| 151 | `.claude/settings.json:38`, `:162-177`, `:193-213`, `:215-222` | Council | resolved | Function hooks on. Async 10 s Stop hooks. PostToolUse. PreCompact at 3 s |
| 152 | `check-goal.cjs:44-49`, `sk-create-goal/SKILL.md:121-122`, `create-goal-auto.yaml:221`, `goal-set-string-playbook.md:55-57` | Council | resolved | A criterion rule with no machine check |
| 153 | `labeled-prompts.jsonl` `gate3_triggers` | Council | resolved | 127 `yes`, 68 `no` (61 compact and 7 spaced `no` rows) |
| 154 | `compact-inject.ts:117-176`, `:149-155` | Council | resolved | 20-path cap. JavaScript-only noise list |
| 155 | npm `jevctl` `fast-jev.ts:26-31`, `:75`, `:237-253`, `:269-287` | Council | resolved | Defaults. On unless disabled. Key read outside any gate. `session.compact` handler |
| 156 | npm `jevctl` `compact.ts:24`, `state.ts:304-305`, `plugin/hooks/README.md:47`, `CHANGELOG.md:59`, `claude-code.d.ts:7285` | Council | resolved | Budget, throw, fallback, env and the `precompute` trigger |
| 157 | `recommend-level.sh:36-47` | Council | resolved | Flags feed the level. Row 22 and disagreement 7 corrected |
| 158 | Pi post `:1121` | Synthesis section 3, row 7 | misattributed | meraGPT's "Decider 1", not Jev |
| 159 | `next-focus/index.ts:13`, `next-focus.vitest.ts:474` | Council | resolved | The only references to `compareNextFocusShadow` |
| 160 | 002 `spec.md:112`, `:131`, 003 `spec.md:121` | Council | resolved | The skip lines diverge |
| 161 | Parent `goal.md:107` | Council | resolved | A criterion that depends on another file |

**Tally, appended.** The council checked 18 rows: 17 resolved and 1 misattributed. One earlier fact, row 148, was corrected.

---

## N. §15 Evidence Quality and Caveats (addenda)

- **D5 postdates this synthesis.** The opt-in and key gate (section 9) was decided after it. It changes defaults and skip lines, not deadlines, so no drop reopens.
- **The council review is one model.** The three seats and the first synthesis all ran on Claude Opus 5.5. Their agreement counts as corroboration only where it rests on code or counts the council host reopened.
- **The DeepSeek undercount.**
  - The merged registry holds 8 of DeepSeek's 57 findings (orchestrator count).
  - The loss likely sits in the lineage reducer, since DeepSeek's state records carry no findings arrays (Inferred, seat-001).
  - This synthesis read DeepSeek's findings from iteration markdown, which limits the damage. Whether any finding was missed is UNKNOWN.
- **Two packages, appended.** R19's later arm ports an npm `jevctl` procedure to the Python `jev-cli`. It depends on no npm `jevctl` behavior at run time.
- **Adjacent defects, appended (reported and not fixed).**
  - The clamp defect (section 5, item 8).
  - The likely redaction gap (section 5, item 11).
  - The brief's extractor noise (section 6, item 4).
  - 002's missing `VITEST` and the divergent skip lines.
  - Parent `goal.md:107`.
  - This document's own errors, corrected in this amendment: section 3 item 1, section 5 item 1, row 7, row 22, row 31 and disagreement 7.

---

## O. §16 References (new sources, appended)

- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`
- `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`
- npm `jevctl` `plugin/hooks/fast-jev.ts`, the vendored copy under `context/external repo's/jev-cli-main/`
- fast-jev-compaction, <https://github.com/tamaratran/fast-jev-compaction>, named at npm `jevctl` `fast-jev.ts:2-3`
- The fast-jev-compaction blog post named in the orchestrator's brief
- The jevcache.sh and classifier.dev vendor sites, read by the council host (vendor claims)
- This project's local Claude Code transcripts, used for counts only and never quoted
