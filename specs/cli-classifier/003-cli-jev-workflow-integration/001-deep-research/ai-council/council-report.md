## Multi-AI Council Report: review and re-synthesis of the Jev integration research (`research/research.md`)

### Task Classification
- **Type**: research review.
- **Council Seats Dispatched**: 3.
  - Critical / opus-max
  - Pragmatic-UX / opus-max
  - Creative-contrarian / opus-max
- **Dispatch Mode**: parallel, depth 0.
- **Vantage Integrity**: a native agent dispatch on a single model. All three seats are `opus-max` sub-agents on Claude Opus 5.5 at max effort, the same model as the synthesis under review. Diversity comes from lens and mandate only, and no seat was simulated.
- **Under review**: `research/research.md`, with 1 build-now, 1 next, 16 later, 32 drop and 3 dead ends. It proposed two Planned phases, `002-advisor-jev-tiebreak-arm` and `003-goal-verifier-jev-shadow`.
- **Evidence markers**:
  - **H**: the council host reopened the item itself during this run.
  - **Seat-reported**: a seat reopened it and the host did not.
  - Vendor claims and user reports are labeled as such.
  - Every `jev` means the Python `jev-cli` 0.6.2 unless the sentence names the npm `jevctl` 0.2.3.

### Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Critical: evidence and verdict audit | opus-max (Claude Opus 5.5 max, single model) | Every verdict rests on a reopened `file:line`. Tests the DeepSeek under-count, R1's power, R2's design and D5's failure paths | 74 |
| seat-002 | Pragmatic-UX: operator value and measured usefulness | opus-max (Claude Opus 5.5 max, single model) | What each item removes from or adds to the operator's day, the labor it needs and enablement UX under D5 | 70 |
| seat-003 | Creative-contrarian: too conservative or too timid | opus-max (Claude Opus 5.5 max, single model) | Where a bolder build passes the checklist today, gold as a product in its own right, and unexamined seams and new material | 70 |

### Strategy Comparison

| Dimension | Weight | seat-001 | seat-002 | seat-003 |
| --- | --- | --- | --- | --- |
| Correctness | 30% | 27 | 25 | 24 |
| Completeness | 20% | 16 | 18 | 18 |
| Elegance | 15% | 12 | 13 | 12 |
| Robustness | 20% | 18 | 14 | 17 |
| Integration | 15% | 13 | 13 | 13 |
| Pre-Critique Total | 100% | 86 | 83 | 84 |
| Post-Critique Adjustment | +/-10 | +1 | 0 | -2 |
| Final Total | 100% | 87 | 83 | 82 |

### Deliberation Notes
- **Round 1, independent findings.**
  - seat-001 found that R1's keep rule cannot fail. It also found a deterministic defect in the OpenCode goal heuristic that fails every long message, and function hooks already enabled in this repository.
  - seat-002 measured the operator's own usage. It counted 204 host compactions, most above 100 s, and 750 native Claude Code goal evaluations. The OpenCode plugin's default goal directory holds only Hermes records, none evaluated.
  - seat-003 reached the same R1 statistics finding independently and proposed a sign-test rule. It found the goal-criterion lint gap no lineage opened, the 195 Gate 3 labels as a Jev calibration and noise in the compaction brief's extractor.
- **Round 2, cross-critique.**
  - seat-001 missed operator usage and the absent caller behind R14.
  - seat-002 inferred OpenCode non-use from default directories only, and left R1's keep rule unfixed.
  - seat-003 claimed that no repository file references `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS`, and `.claude/settings.json:38` (H) refutes that.
  - Score changes: +1, 0 and -2.
- **Round 3, reconciliation.** Two of three seats agree on 19 of 21 items. The host ruled on two:
  - R14 is dropped on confirmed evidence of no runtime caller.
  - The compaction census is build-now, because two seats schedule it first. seat-001 dissents.

  The seam split over compaction resolves into one harness that scores both the host summary and the repository brief. Full record: `deliberations/round-001.md`.

### Winning Strategy
- **Leader**: seat-001 (Critical), 87 of 100.
- **Key strength**: verification discipline, and the two findings that most change the build: R1's keep rule cannot fail, and the clamp defect.
- **Complementary elements merged**:
  - From seat-002: the operator-usage evidence that re-aims ideas 3 and 4, the enablement UX (`show` surfacing, aligned skip lines, the repository scrubber) and the compaction value case.
  - From seat-003: the sign-test keep rule with an `inconclusive` outcome, the criterion-lint design with a stop rule, the conditional Gate 3 calibration arm, the brief-noise finding and the redaction gap.
- The final totals sit 5 points apart, so the plan merges elements from all three seats rather than adopting one seat's plan.

---

### 1. Verdict on the Synthesis

**It is sound in what it drops, too lenient in how it measures and aimed too narrowly in what it builds.** A targeted re-synthesis is warranted. A rerun of the 30 iterations is not.

- **What holds.** Every drop that rests on a hook deadline, on authority kept in code, on a repository fact or on a missing consumer stands. That covers:
  - the 2500 ms advisor kill
  - the 3 s PreCompact hook
  - STOP, severity and merge authority
  - never a default score.

  D5 reopens none of them. D5 governs keys and defaults, and it cannot move a deadline. All three seats agree here, and the host reopened the deadline and default-score lines.
- **Too lenient.**
  - **R1's keep rule cannot fail.**
    - Its stability coefficient is `1 - sd/mean` over three passes (`benchmark-stability.cjs:102-108`, H). Only eligible rows vary, so a judge that picks at random still scores above 0.95 (derived by seats 001 and 003).
    - One net row moves held-out MRR by 0.0057 and flips "MRR rises".
    - The copied metric matches ids exactly (`score-outcome-rerank.mjs:85-93`, H), while the baseline capture matches through aliases (`capture-scorer-eval-baseline.mjs:70-76`, H).
    - A loss as designed is therefore not "a number that closes the live form". An underpowered loss is absence of evidence.
  - **R2's stability test has the same weakness.**
  - **R2 inherits a defect nobody saw.** The OpenCode heuristic clamps evidence at 1,200 characters with a trailing `...` and then reads that `...` as truncation. Every longer completion message becomes `not_met` (`opencode-goal.js:388`, `:475`, `:2199`, `:2209`, H).
- **Aimed too narrowly.**
  - **The build list follows harness readiness, not operator value.** It never looked at how the operator works.
  - **The operator's fourth idea (compaction) got no path.**
    - The synthesis dropped it on the 3 s PreCompact command hook. Yet this repository already enables Claude Code function hooks (`.claude/settings.json:38`, H), the route the vendored Jev compaction uses.
    - The measured cost sits exactly there: 204 host compactions in this project's transcripts, most above 100 s each (H count, p50 about 104.5 s seat-reported).
  - **The operator's third idea (goals) was aimed at a verifier with no recorded use.** Goals here run on Claude Code's native judge, with 750 evaluations counted (H). That judge "sees only the stored string" (`goal-set-string-playbook.md:55-57`, H). No lineage opened `sk-create-goal`, whose checker tests structure only (`check-goal.cjs:44-49`, H).
- **On 1 build-now against 32 drop.** The ratio is not the defect.

  The drops are right, and the council adds 7 more. The defect is that the only build can end in "no headroom" with no Jev number at all, while cheap measurable neighbors went unscheduled.

  The operator's "don't shy away from extensive logic if useful" is best served by real measurement logic, not by reviving live hook paths:
  - stronger statistics in 002
  - a compaction recall harness over local transcripts
  - a criterion lint in authoring
  - a goal-verifier baseline that tests a free fix before any Jev arm.

### 2. Per-Recommendation Review

| ID | Synthesis | Council | Seats 001 / 002 / 003 | Reason | Evidence reopened | Standing |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | build-now | **keep, modify: build-now** | build-now / build-now / build-now | Only item whose harness, corpus and baseline all exist. Its keep rule gets replaced (phase plan, 002) | `benchmark-stability.cjs:102-108` H, `score-outcome-rerank.mjs:85-93` H, `capture-scorer-eval-baseline.mjs:43`, `:70-76` H, 002 `plan.md:63` H, `scorer-eval-baseline.json:25-35` H | Code Confirmed. Power bounds derived |
| R2 | next | **modify: next for the zero-call slice. The Jev arm and plugin shadow mode move to later** | next / later / next | The zero-call slice matters more than stated because of the clamp defect. A free tail-window arm must be beaten before Jev gets credit. The Jev arm waits for recorded OpenCode or Pi goal use, since the plugin's default state directory shows only unevaluated Hermes records while the native judge ran 750 times | `opencode-goal.js:36-37`, `:388`, `:475`, `:2199`, `:2209` H. Main-checkout `.skilled/skills/.state/goal/*.json` H. Transcript `goal_status` count H | Defect Confirmed. Live frequency UNKNOWN. Non-use Inferred |
| R3 | later | **split: the cached lane drops, the suggested order stays later** | later / later / split | A cache hits only exact repeats (3.6% of long prompts, seat-reported), and a first ask still meets the 2500 ms kill. A served order needs R1's win plus a measured p95 under the advisor's remaining budget | `user-prompt-submit.ts:22-24`, `:105-125` (seat-reported, `:115` checked by the orchestrator) | Deadline Confirmed |
| R4 | later | **keep: later**, plus an optional zero-call claims column in 003 | later / drop / later | On Claude the advisory reaches only an async Stop hook and a log, so fewer false fires change little for the operator. The column costs nothing if 003 labels rows anyway | `completion-evidence-stop.cjs:132-139` H, `.claude/settings.json:162-177` H | Confirmed |
| R5 | later | keep: later | later x3 | 0 of 8 fixture cases reach the classifier | seat regex replays | Confirmed by seat count |
| R6 | later | keep: later | later x3 | No human-scored subset and no recorded harness run. The revival attempt failed on Q6 | reply-harness `README.md:3`, `:20` (seat-reported) | Confirmed |
| R7 | later | **keep, correct a fact** | later x3 | Through the runner the default grader is `noop` (a fixed 1.0), not `mock`. D4 carries no signal either way | `run-benchmark.cjs:577` H | Confirmed |
| R8 | later | keep: later, add a slice | later x3 | Target the inert-novelty windows first (DeepSeek-04). About half of lineage configs force max iterations, where an earlier stop changes nothing | `convergence.cjs:506-549` (seat-reported), config census (seat-003) | Mixed |
| R9 | later | keep: later | later x3 | Needs R8's signal | none new | unchanged |
| R10 | later | keep: later | later x3 | The gold is thinner still: 44 P0-born findings and 0 downgrades (seat-001 recount). Only 3 transition reasons mention a P0 downgrade (seat-002) | registry recounts (seat-reported) | Confirmed by seat counts |
| R11 | later | **merged into R19. Its Jev arm stays later** | re-target / drop, merge / keep, harness | The 3 s limit binds only the PreCompact command hook. The measured cost is the host summary, and the brief has its own extractor noise, so one harness measures both | `.claude/settings.json:38`, `:215-222` H, `compact-inject.ts:149-155` H | Confirmed |
| R12 | later | keep: later | later x3 | 3 clarify gold rows | `router.cjs:199-218` (seat-reported) | unchanged |
| R13 | later | keep: later | later x3 | No gold | none new | unchanged |
| R14 | later | **drop** | later / drop / later | `compareNextFocusShadow` has no runtime caller, only a re-export and one test, so a Jev choice would feed nothing | `next-focus/index.ts:13`, `next-focus.vitest.ts:474`, `next-focus-selection.ts:352` H | Confirmed |
| R15 | later | keep: later, widen | later / drop / later | Add the cross-body blind spot: same-point findings with different bodies are never compared (DeepSeek-05). Promote only with a labeled pair set and a named reader | `fanout-merge.cjs:341`, `:348-351` (seat-reported) | Confirmed by seats |
| R16 | later | keep: later | later x3 | No fetch matcher. The vendored `screen` is npm `jevctl` only | `.claude/settings.json` hook table H | Confirmed |
| R17 | later | keep: later | later x3 | npm `jevctl` recipe, no gold, owned by sk-git | none new | unchanged |
| R18 | later | keep: later | later / drop / later | No caller in this repository | none new | Inferred |

**Notable drops and dead ends (What Not To Build rows):**

| Row | Council | Reason | Evidence | Standing |
| --- | --- | --- | --- | --- |
| 1 live advisor call | keep drop, relabel, add a revival rule | The kill is Confirmed, but "a Jev call cannot fit" is Inferred until a latency exists. Revive a cluster-only call only if R1 keeps and its measured p95, spawn included, fits the advisor's remaining budget | `user-prompt-submit.ts:22-24`, `:105-125` (seat-reported) | Kill Confirmed, fit Inferred |
| 5 live PreCompact pass | keep drop, narrow the reason | Applies to the PreCompact command hook only. The function-hook route is enabled and handled by R19 | `.claude/settings.json:38`, `:215-222` H | Confirmed |
| 6 compaction on unless disabled | keep, restate as D5 | D5 makes default-off universal. The vendored hook compacts at 60% (npm `jevctl` `fast-jev.ts:27`) | H | Confirmed |
| 7 per-turn grade | keep, correct the citation | The 0.22-to-0.58 shift is meraGPT's "Decider 1", not Jev. The same line reports a working done gate (0.16 against 0.90) | Pi post `:1121` H | Confirmed |
| 9 default scores | keep, correct | The runner default is `noop`. `mock` is the direct-scorer default | `run-benchmark.cjs:577` H | Confirmed |
| 21 Gate 3 as a product | keep. The corpus feeds R21 | 127 `yes` and 68 `no` labels exist | `labeled-prompts.jsonl` H | Confirmed |
| 22 spec-level flags | keep, correct the reason | The flags do feed the level (auth +10, api +8, db +7, architectural +20). The drop stands on low stakes and no gold | `recommend-level.sh:36-47` H | Confirmed |
| 27 shared Jev helper | keep drop now, set the trigger | Extract a shared probe at the third certain caller, the R19 or R20 Jev arm. Align the skip messages now | 002 `spec.md:112`, `:131`, 003 `spec.md:121` H | Confirmed |
| 30 cache during reruns | keep | The per-row flip rate now replaces the aggregate coefficient, and a cache would force it to zero | `benchmark-stability.cjs:102-108` H | Confirmed |
| 31 sentinel live call | keep, correct the reason | On Claude the sentinel runs in an async 10 s Stop hook. The 1200 ms bound is OpenCode's. The drop stands on Q11 | `.claude/settings.json:162-177` H | Confirmed |
| 36 (new) jevcache.sh as a dependency | drop | It installs by `curl \| sh` and reads `JEV_API_KEY` outside the D5 gate. It can only hit exact repeats, and a cache during reruns breaks the flip rate | vendor site (host WebFetch summary) | Vendor claim |
| 37 (new) classifier.dev as a service | drop, keep the cascade pattern | Its keyless free tier conflicts with D5, and it adds a second egress vendor. A heuristic-then-Jev cascade becomes an offline table in 003 | vendor site (host WebFetch summary) | Vendor claim |
| 38 (new) Jev PostToolUse Bash-output filter | drop | Command output is the payload most likely to hold secrets. A deterministic filter needs no key. Whether a command hook can replace tool output is UNKNOWN | `.claude/settings.json:204-211` H | Confirmed seam |
| 39 (new) S12 git preflight, S21 executor demotion | drop | S12 decides on git facts, which a judgment must not replace. S21's scorer has no production caller. This answers open question 15 | `git-preflight-advisory.mjs:26-34`, `bayesian-scorer.ts` (seat-reported) | Confirmed by seat |
| 40 (new) R3 cached advisor lane | drop | See R3 | as R3 | Confirmed |
| 41 (new) R14 next-focus Jev comparator | drop | See R14 | as R14 | Confirmed |
| 42 (new) a global Jev switch | drop | Under D5 the key already is the global switch. Each feature keeps one switch, because each switch consents to a different payload class | seat-002 | Judgment |

### 3. New Recommendations

#### R19. Compaction recall harness, then an offline Jev deletion arm (absorbs R11)

| Field | Record |
|---|---|
| **Verdict** | **build-now for the zero-call census. The Jev arm stays later.** seat-001 dissents and would rank the whole item later |
| **What Jev judges** | Nothing in the first slice. In the later arm, per old tool call, two `noul` questions: keep the call, and keep its result verbatim. Batched with `jev run` on the Python `jev-cli` 0.6.2, as a port of the npm `jevctl` 0.2.3 procedure |
| **Seam** | Host compaction, recorded as `compactMetadata` in local Claude Code transcripts. The function-hook route (`.claude/settings.json:38` H, npm `jevctl` `plugin/hooks/fast-jev.ts:269`, `claude-code.d.ts:7285` `precompute` trigger H). The repository brief (`compact-inject.ts:117-176` H, budget `shared.ts:14`) |
| **Value** | This is the operator's fourth idea at the seam where the cost is paid. There are 204 host compactions in this project's transcripts (H). Of the 154 whose duration the host could read, none was under 60 s and 97 were at or above 100 s. The seat reports a p50 of 104.5 s and 373 minutes in total. The census alone answers two questions with numbers: whether a Jev deletion pass can fit these sessions, and what the stock summary and the brief lose |
| **Metric, baseline and harness** | The zero-call baseline, per compaction: <br>- wall time <br>- pre and post tokens <br>- the estimated placeholder-state size against the 25,000-token budget (npm `jevctl` `compact.ts:24` H) <br>- rule-derived must-survive recall for both the stock summary and the brief: identifiers and files used after the boundary that appeared before it, files written through Write or Edit, the bound spec folder and the last user instruction <br>- the brief's attention-noise share. <br><br>Harness: one new read-only script (proposed name `score-compaction-recall.mjs`). Keep threshold for the later arm, fixed now (proposed): p50 at most 30 s, recall no lower than stock, kept tokens at most 3 times stock and a fallback rate of at most 20% |
| **Stop boundary** | The arm is not built if fewer than half the points fit 25,000 tokens without collapse, or if the kept-token lower bound exceeds 3 times stock. The vendored library throws "history too large for Jev" past the budget (npm `jevctl` `state.ts:304-305` H) |
| **Cost, latency and privacy** | The census makes zero calls and nothing leaves the machine. It reads transcripts from a directory the operator names and prints counts only, never transcript text. The later arm sends whole-session prose and tool inputs, the highest payload class in this research. It needs a fail-closed scrubber and an enablement notice |
| **Opt-in and no-key behavior under D5** | The census needs no key and never spawns `jev`. The arm runs behind its own flag (proposed `--jev`) after the D5 gate. With no key it prints the skip line and the census stays unchanged. The vendored npm `jevctl` hook reads `TYPESAFE_API_KEY` from its plugin options, the environment or the settings `env` (`plugin/hooks/fast-jev.ts:237-253`, H), and it runs unless `compaction` is `false` (`:75`, H). The upstream fast-jev-compaction plugin it was adapted from (`:2-3`) behaves the same way, per its vendor page. Both bypass the D5 gate, so the council advises against installing either before the census reports. On any error the vendored hook falls back to the built-in summary (`:283-285`, H), which is the fail-open shape a port should keep |
| **Smallest slice** | The census over 10 to 20 sessions the operator names |
| **Fitness checklist** | <br>- Q1 fails until the census runs, which is acceptable because the census is the slice. <br>- Q8: it reads an undocumented host format, so it must fail loudly on an unknown shape. <br>- Q9 and Q11 fail for the arm without a scrubber, a notice and the operator's acceptance. <br>- Q12: the arm needs a port to the Python `jev-cli`, because D5 refuses the npm package. <br>- Q14: the function-hook API is early access. <br>- The rest pass. |

#### R20. Goal-criteria lint

| Field | Record |
|---|---|
| **Verdict** | **next.** The first slice costs zero calls |
| **What Jev judges** | In the later arm, two `noul` questions per criterion: can it be checked from its own text, and does it name one observable result? Asked with the Python `jev-cli` 0.6.2 |
| **Seam** | `check-goal.cjs:44-49` (four structural checks, H). The rule at `sk-create-goal/SKILL.md:121-122` (H). The runner at `create-goal-auto.yaml:221` (H). The evaluator sees only the stored string (`goal-set-string-playbook.md:55-57`, H) |
| **Value** | A criterion the evaluator cannot check leaves completion open, and the rule has no machine check. This packet's own parent `goal.md:107` breaks it (H). The lint reaches every runtime through `/create:goal` |
| **Metric, baseline and harness** | Precision and recall per rule, against about 100 operator labels stratified from roughly 1,375 criterion lines outside `z_archive` (seat counts). Baseline: a zero-call lexical lint. The base rate is disputed. seat-002's strict regex flags 21 of 1,387, where seat-003's one-lens sample found 7 of 25, and the labels settle it. Stop if the violation rate is under 5%. Keep the Jev arm only if it beats the lexical lint by at least 0.2 F1, with precision at least 0.8 and a flip rate of at most 0.10 (proposed). seat-002's finding that native-judge reasons rarely blame an unverifiable criterion (31 of 576) is why this is next rather than build-now |
| **Cost, latency and privacy** | About 600 offline calls for the arm. Committed repository text only (low) |
| **Opt-in and no-key behavior under D5** | It is a separate script, not a fifth check inside check-goal's gate. The Jev arm runs behind its own flag after the D5 gate. check-goal's exit code never changes, and with no key the output is byte-identical to today |
| **Smallest slice** | The lexical lint plus about 100 labels, with zero calls |
| **Fitness checklist** | <br>- Q1 fails until the labels exist, which is acceptable because the labels are the slice. <br>- Q8: a later advisory inside check-goal needs sk-create-goal's owner. <br>- The rest pass. |

#### R21. Gate 3 calibration arm, conditional inside 002

| Field | Record |
|---|---|
| **Verdict** | **next, conditional.** It runs only when R1's census prints `underpowered`. Single-seat, and bounded by the host |
| **What Jev judges** | One `noul` per labeled prompt: "does this request require writing a file" (proposed wording) |
| **Seam** | `labeled-prompts.jsonl` `gate3_triggers`, with 127 `yes` and 68 `no` (H). Classifier baseline F1 0.9843 (research.md, digest H3) |
| **Value** | 002 still returns Jev's per-call latency p50 and p95, a flip rate and calibration when the advisor leaves no headroom. Every later item waits on that latency |
| **Metric, baseline and harness** | Accuracy, F1, Brier score and per-row flip rate over 3 reruns. This is a calibration, not a race, so row 21 stands |
| **Cost, latency and privacy** | 585 short calls. The payload is the same corpus prompts R1 already sends |
| **Opt-in and no-key behavior under D5** | Runs under R1's flag and gate, with no new flag |
| **Smallest slice** | About 40 to 60 lines of code in `score-jev-tiebreak.mjs` (proposed name from 002) |
| **Fitness checklist** | All pass. The risk is scope creep in 002, bounded by the `underpowered` condition |

### 4. Re-Ranked List and Phase Plan

**Re-ranked list.**

| Rank | ID | Tier | Phase |
|---|---|---|---|
| 1 | R1 advisor tie-break arm (modified) | build-now | 002 |
| 2 | R19 compaction recall census | build-now (the Jev arm later) | 004 |
| 3 | R20 goal-criteria lint | next | 005 |
| 4 | R2 goal-verifier zero-call slice (modified) | next (the Jev arm and shadow mode later) | 003 |
| 5 | R21 Gate 3 calibration arm | next, conditional | 002 |
| 6 to 19 | R3 suggested order, R4, R5, R6, R7, R8, R9, R10, R12, R13, R15, R16, R17 and R18 | later | not phased |

Tally:
- **build-now**: 2
- **next**: 3
- **later**: 14, plus the Jev arms of R2, R19 and R20
- **drop**: 39. That is 32 plus 7 new rows: jevcache, classifier.dev, the Bash filter, S12 and S21, the cached lane, R14 and a global switch.
- **dead ends**: 3.

R11 folds into R19.

**Phase plan (4 phases, in build order).** 002 and 003 are Planned children from an approved plan, so each change to them is an amendment the operator approves (D7, PLAN-WORKFLOW LOCK). The council edited neither.

| Order | Slug | Action | Items | First slice | Observable check |
|---|---|---|---|---|---|
| 1 | `002-advisor-jev-tiebreak-arm` | keep, modify | R1, R21 | An alias-aware census over all 177 skill-firing labeled rows and 64 skill-firing holdout rows, with cluster and top-3 columns. Zero-call comparator arms: confidence order inside the cluster, always-second and the outcome-weighted rerank. The env includes `VITEST=true` | With no key, counts print per file and the baseline prints 53/70. With a key, the report prints: <br>- wins, losses and ties <br>- the exact sign-test p <br>- one verdict line: `keep`, `kill`, `inconclusive` or `underpowered` <br>- the per-row flip rate <br>- p50 and p95 latency <br>- R21's accuracy, F1 and Brier score whenever it ran |
| 2 (beside 1) | `004-compaction-recall-harness` | add | R19, with R11 folded in | The zero-call census over 10 to 20 sessions the operator names | One row per compaction prints wall time, pre and post tokens, the 25,000-token fit estimate, summary and brief recall and the brief noise share. The output contains no transcript text. A stub `jev` placed first on PATH logs no call. `git status` shows only the new script and its report |
| 3 | `005-goal-criteria-jev-lint` | add | R20 | The lexical lint plus about 100 operator labels | Per-rule violation rate and lexical precision and recall print. check-goal's exit codes are unchanged across all active goals. A stub `jev` logs no call |
| 4 | `003-goal-verifier-jev-shadow` | keep, modify | R2, with R4's claims column | Rows taken as ingested, where possible the native `goal_status` records pre-labeled by the host judge, with the operator adjudicating disagreements. The heuristic baseline, a tail-window heuristic arm, goal-core parity and a count of clamp errors, all with zero calls | Confusion tables for the heuristic and the tail-window arm print on identical rows, with the truncation-error count. The Jev arm and the plugin mode do not start until OpenCode or Pi goal records with a verdict exist |

**Amendments for 002:**
- **REQ-004:** the census covers all skill-firing rows in both files, with alias-aware matching.
- **REQ-005:** the enumerated env adds `VITEST=true`, which the capture sets at `capture-scorer-eval-baseline.mjs:43`.
- **REQ-007:** keep only when all three hold:
  - Jev beats the best zero-call comparator.
  - It wins an exact one-sided sign test at 0.05 over modal picks from 3 reruns.
  - right@3 does not fall.

  Losses significant at the same level print `kill`. Fewer than 5 decided rows print `underpowered`, and anything else prints `inconclusive`. Only `kill` closes R3.
- **REQ-008:** a per-row flip rate of at most 0.10 replaces the aggregate coefficient.
- **REQ-009:** record the pick probability and the `none` probability per call.
- **REQ-012:** unresolved, so the veto stays for now (see Dissent).
- **Skip messages:** the lines match 003's `jev arm skipped: <check>`, and a present but rejected key prints its own line (proposed wording: `jev arm stopped: key rejected`).
- **R21:** added as conditional.

**Amendments for 003:**
- **REQ-002:** adds the tail-window arm and the clamp-error count.
- **REQ-006 (d):** becomes a per-row flip rate.
- **REQ-009:** adds confidence and a heuristic-then-Jev cascade table.
- **T001:** prefers native `goal_status` records with operator adjudication.
- **Slice 2:** gated on recorded OpenCode or Pi goal use and on a unit case that settles the redaction gap (`opencode-goal.js:474`).
- **`show`:** gains a `verifier_shadow=` field (proposed) next to `verifier_source=`.

### 5. Re-Synthesis

**Warranted: yes, a targeted amendment.** All three seats agree. The tiers mostly stand, but 002 and 003 would inherit the measurement flaws, and the compaction and goal analyses are aimed at the wrong seams. The draft of every changed section is `ai-council/proposed-resynthesis.md`, and `research.md` is untouched.

| Section | Change |
|---|---|
| §1 Executive Summary | New verdict counts and the two build-now items. Compaction and goals re-aimed. D5 recorded |
| §3 item 1 | `noop` is the runner default. `mock` is the direct-scorer default |
| §4 | R1 statistics and the replacement keep rule, alias matching, the env gap and R21 |
| §5 | The clamp defect, "needs no mapping" limited to OpenCode, the usage evidence, the Jev-arm gate and the redaction gap |
| §6 | Rewritten. Two seams (the PreCompact command hook and the function-hook host summary), the measured cost, the brief noise and R19 |
| §7 | The Gate 3 row becomes a calibration input (R21). S12 and S21 get no-fit verdicts |
| §9 | New D5 subsection: the gate, presence against validity, the rejected-key line, one switch per feature and the payload scrubber |
| §10 | Disagreement 3 gets the outcome rule. Disagreement 7's level-flag reason is corrected |
| §11 | New table. R1, R2, R3, R4, R7, R11 and R14 records change. R19, R20 and R21 are added |
| What Not To Build | Reasons change for rows 1, 5, 6, 7, 9, 21, 22, 27, 30 and 31. Rows 36 to 42 are added |
| §12 | New open questions: holdout top-3 headroom, the redaction regex, the function-hook deadline, OpenCode goal use, the tau 0.03 margins and the live near-tie rate |
| §13 | The four-phase plan above |
| §14 and §15 | Ledger rows 144 to 161. D5 postdates the synthesis. The same-model council caveat. The DeepSeek loss likely sits in the lineage reducer (seat-001, Inferred) |
| §16 | Adds the new sources: check-goal, the goal-string playbook, the vendored hook, fast-jev-compaction, jevcache.sh, classifier.dev and the local transcripts, which are used for counts only |
| Unchanged | §2, §8, the Divergence Map, §17 |

---

### Recommended Plan

1. **Keep the synthesis's restraint.** All 32 drops stand, plus 7 more. Change how the kept items measure and where the builds aim.
2. **Build now, both at zero calls first.**
   - 002, with a keep rule that can fail and an `underpowered` fallback (R21) that still yields Jev latency.
   - 004, the compaction recall census over the operator's own transcripts.
3. **Next.**
   - 005, a goal-criteria lint that starts lexical and labeled.
   - 003's zero-call slice, which tests a free tail-window fix for the clamp defect before any Jev arm.
4. **Later, behind named gates.**
   - The Jev arms for R19 and R20 wait on their census and labels.
   - 003's Jev arm and plugin shadow mode wait on recorded OpenCode or Pi goal use.
   - A served advisor order waits on R1's `keep` and a measured p95.
5. **Everything stays under D5.** Every feature is opt-in and dormant unless `jev auth status` exits 0, and each feature keeps one switch. The skip lines read the same everywhere, and no feature returns a default score.
6. **A Jev answer is one lens.** It never becomes a verdict or a permission.

### Implementation Steps
1. **Step 1**: Put the 002 and 003 amendments in section 4 to the operator for approval, then edit those phase docs. (Source: seat-001, seat-003, seat-002)
2. **Step 2**: Scaffold `004-compaction-recall-harness` and `005-goal-criteria-jev-lint` as Planned children, each with `spec.md`, `plan.md`, `tasks.md`, `goal.md`, binding rows and a key gate. Write each goal criterion so it can be checked from its own text. (Source: seat-002, seat-001, seat-003)
3. **Step 3**: If the operator approves, apply `proposed-resynthesis.md` to `research.md` as a targeted amendment. Fix parent `goal.md:107` so it names the phase slugs itself. (Source: all seats)
4. **Step 4**: File the adjacent defects with their owners, not in this packet:
   - the clamp defect, with the goal plugin owner
   - the redaction regex unit case
   - the brief extractor noise, with system-spec-kit
   - the silent `--grader` fallback, with the deep-improvement owner.

   (Source: seat-001, seat-003)
5. **Step 5**: Replay `ai-council/gateway-replay-events.jsonl` through the append gateway. Then run strict validation on the packet. (Source: council host)

### Prerequisites
- The advisor `dist` is built before 002 runs.
- For any Jev arm only: the Python `jev-cli` 0.6.2 is on PATH (an install needs the operator's yes), and `jev auth status` exits 0. No zero-call slice needs either.
- The operator names a transcript directory for 004, and labels about 100 criteria for 005 (about 15 minutes, seat-002 estimate, Inferred).
- The operator approves the amendments to the Planned phases 002 and 003.

### Plan Confidence
- **Overall**: 72%
- **Strategy Agreement**: high on the drops, on R1's modification, on adding the lint and the compaction harness, and on "no drop reopens under D5". Moderate on tiers and order.
- **Consensus Quality**: moderate. All three seats and the synthesis are one model family, so agreement counts as corroboration only where it rests on code or counts the host reopened. Those include the deadlines, the default grader, the stability formula, the clamp path, the usage counts and the lint gap.
- **Risk Level**: low. Planning only, every first slice makes zero calls, and all egress waits behind D5 plus a per-feature switch.

#### Dissent
1. **seat-001** would rank the compaction harness later, not build-now. The host ruled with seats 002 and 003, who schedule its zero-call slice first.
2. **seat-002** would park 003 entirely and drop R4, R15 and R18. The council kept 003's zero-call slice at next, because the clamp defect is real, and kept the other three at later (two of three).
3. **seats 001 and 003** kept R14 at later. The host dropped it on a confirmed absent runtime caller, which neither seat checked.
4. **The tau 0.03 veto in R1 is unresolved.** seat-001 would report the slice without vetoing on it, because 11 of 24 frozen margins are negative (not reopened by the host). seat-003 keeps the veto, and the status quo holds until someone checks.
5. **The criterion-lint base rate is unresolved.** The estimates are 1.5% (seat-002's strict regex) against about 28% (seat-003's 25-row sample, one lens). The labeled slice decides, and the lint stops below 5%.

### Dropped Alternatives
- **seat-002's order** (score 83 of 100): compaction first, 003 parked and R4, R15 and R18 dropped. It was not adopted whole. Its usage evidence re-aimed the plan, but parking 003 would discard a zero-call fix for a confirmed defect.
- **seat-003's unconditional Gate 3 arm and brief-only harness** (score 82 of 100): the arm became conditional, and the brief harness merged into R19. The host summary carries the measured cost.
- **seat-001's compaction tier** (score 87 of 100): later, with operator-authored fact sets first. Rule-derived recall at zero labor comes first instead, and operator facts become a later spot check.

### Risks & Mitigations
- **The council is one model.** Every seat is Claude Opus 5.5. Load-bearing claims were grounded in reopened code and counts. A second model family could check the phase plan before building if the operator wants a different vantage.
- **R1 may be underpowered.** The census prints `underpowered` instead of a false keep or kill, and R21 still yields a latency record.
- **The compaction census reads private transcripts.** It reads only a directory the operator names, prints counts, never text, and makes no network call.
- **The function-hook API is early access.** The census does not depend on it. Any later arm must fail loudly if the API changes.
- **Session payloads may carry secrets.** Before any egress, a unit case settles the `opencode-goal.js:474` gap, and payloads route through the repository's fail-closed scrubber (seat-002, coverage Inferred).
- **Operator labor.** Labels come in order of cost: none for 002 and 004, about 100 one-line labels for 005, then 003's rows prefilled from native records.

### Adjacent Defects (reported, not fixed)
1. **The clamp defect.** The OpenCode goal heuristic calls any evidence over 1,200 characters truncated (`opencode-goal.js:388`, `:475`, `:2199`, `:2209`, H). goal-core carries the same truncation check (`goal-core.cjs:607`, H).
2. **A likely redaction gap.** Names such as `SERVICE_TOKEN=` and `TYPESAFE_API_KEY=` may pass `opencode-goal.js:474` unredacted. Derived from the regex, it needs a unit case.
3. **Brief extractor noise.** The attention noise list is JavaScript built-ins only (`compact-inject.ts:149-155`, H).
4. **Planned-phase gaps.** 002 `plan.md:63` omits `VITEST=true`, and the skip lines in 002 and 003 diverge (H).
5. **Errors in research.md.**
   - `:108` says "mock D4". The runner default is `noop`.
   - `:153` says "needs no mapping", which holds for OpenCode only.
   - Row 22's reason is wrong.
   - Row 7's citation is misattributed.
6. **A goal criterion that breaks its own rule.** Parent `goal.md:107` depends on another file.

### Persistence Note
- **The contract assumes node.** The council contract says to persist through `persist-artifacts.cjs` and to record state events through the append gateway. Both need `node`, and this agent has no Bash.
- **What was written.** The artifacts were written with Write in the writer's own shapes. `ai-council-state.jsonl` was left unwritten, because only the gateway may write it.
- **What the orchestrator replays.** The events sit in `gateway-replay-events.jsonl` for replay through `append-mode-event.cjs --mode ai-council`. Replay them one line at a time, in file order.
  - Each `timestamp` is null. The replayer sets it at replay time.
  - Each `bytes` and `checksum` in the `artifact_written` events is null. The replayer computes the byte count and a `sha256:` checksum from the file on disk.
  - A refusal (exit 2) stops the replay at that line, and the refusal's named check is reported.
- **Proposed contract fix.** In `.claude/agents/ai-council.md` §16, add one line: "When the runtime grants no shell, write artifacts with Write in the writer's shapes, leave `ai-council-state.jsonl` untouched and list the state events in `gateway-replay-events.jsonl` for the caller to append through the gateway."

### Planning-Only Boundary
- No file outside `ai-council/` was modified by the Multi-AI Council. `research.md`, every spec doc and all code are unchanged.
- **Seat scratch files.**
  - seat-001 wrote and deleted a scratch file under `/tmp`.
  - seat-002 left temporary count files in the session scratchpad.
  - seat-003 left `scratchpad/criteria.txt` there.

  None of them is under the repository.
- This report is a recommendation for the operator to review, or to hand off to an implementation agent.
