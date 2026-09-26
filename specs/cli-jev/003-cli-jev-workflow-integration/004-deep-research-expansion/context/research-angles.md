# Research Angles, Round 2

Twenty angles for four lineages, five iterations each. Round 2 deepens and widens the round-1 re-synthesis. It does not repeat it.

Path prefixes used below:
- `PHASE/` = `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/`
- `ROUND1/` = `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/`
- `BASE` = `ROUND1/research/research.md`, the round-1 re-synthesis. It is the baseline for every angle. Section numbers such as "BASE §12" refer to it, and ids R1 to R21, row numbers under What Not To Build and questions 1 to 30 are its own.
- `COUNCIL` = `ROUND1/ai-council/council-report.md`
- `CTX/` = `specs/cli-jev/003-cli-jev-workflow-integration/context/`
- `R/` = `CTX/external repo's/`
- `ADV/` = `.skilled/skills/system-skill-advisor/runtime/`
- `TX/` = this project's local Claude Code transcripts, `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`
- Seam ids `S01` to `S26` are in `ROUND1/context/seam-map.md`. Harness ids `H1` to `H15` are in `ROUND1/context/measurement-digest.md`. Checklist questions `Q1` to `Q15` and the red flags are sections 3 and 4 of `ROUND1/context/repo-rules-digest.md`.

---

## 1. Where round 2 starts

Every angle starts from one of these, never from a fresh list.

**Build-now and next items in BASE §11:**
- **R1**, build-now: the offline advisor tie-break arm with a keep rule that can fail (phase 002).
- **R19**, build-now for the census: the compaction recall census, then a later offline Jev deletion arm (proposed phase 005).
- **R20**, next: the goal-criteria lint (proposed phase 006).
- **R2**, next for its zero-call slice: the goal verifier arms and the clamp defect (phase 003).
- **R21**, next and conditional: the Gate 3 calibration arm inside 002.

**Questions BASE §12 hands to round 2**, all ten covered below:
- 30: other model families on R1's keep rule, R19's rank and R2's reshaping
- 22: the criteria-lint base rate
- 18: the `session.compact` function-hook budget
- 19 and 23: OpenCode or Pi verifier use, and its evidence length
- 25: whether the transcript records the injected brief
- 26: the round-1 DeepSeek registry loss
- 28: whether Pi awaits async `turn_end` handlers
- 7: narrative-mined P0 gold
- 21: how often the live advisor sets `ambiguousWith`

**The council's open disagreements** (BASE, Changes section): D2 on parking 003 and D5 on the criteria-lint base rate are still open. D1 carries a spot-check question, open question 27.

---

## 2. The four lenses

**`grok`: contrarian and outside patterns.** It runs on cli-cursor with `grok-4.7-xhigh-fast` and owns the referenced material under `CTX/`: the five vendored repos, the two websites, the three posts and the operator's ideas file. For each vendored pattern, say what to adopt under the key gate and what is an anti-pattern here, with the vendored `file:line`. Offer the bold version of an idea, then argue the case against it. Every idea you keep gets a kill criterion, written as the measured result that would drop it.

**`mimo`: UX and measurement.** It runs on cli-pi with `mimo-v2.6-pro` at high. For each idea, say what the operator sees, decides or types differently, what the default is, and what the operator must read or label. Then design the proof: the metric, the baseline, the harness and the arithmetic. Where a count answers a question, produce the count.

**`swe`: code-level slice design.** It runs on cli-devin with `swe-2-max`. Turn each build-now and next item into a first slice: exact files, function names and signatures, imports, test cases with their fixtures, rough LOC per function and the keep or kill rule as checkable logic. Find the cases the baseline's rules leave undefined.

**`deepseek`: seams, the key gate and failure paths.** It runs on cli-pi with `deepseek-v4.1-flash` at max. Find the exact call site, the hook contract and its deadline, the process boundary a `jev` subprocess crosses and every failure path: no key, exit 3, exit 4, a malformed answer, a slow call and the wrong package on PATH. Name the callers and frozen contracts each idea touches, found by search.

---

## 3. Waves

| Wave | Iterations | Rule |
|---|---|---|
| W1 | 1 and 2 | **Independent.** Read no file under `PHASE/research/lineages/<other>/`. You may read anything from round 1, your own lineage's earlier iteration and any code. Only agreement found in W1 counts as corroboration in the synthesis |
| W2 | 3 and 4 | **Cross-read, then push past.** First read the newest existing iteration file of each of the other three lineages at `PHASE/research/lineages/<other>/iterations/`. Push past what it found, contest it with code, or say plainly that you agree and why. An agreement counts only when you cite code or a count you opened yourself. If a sibling has no file yet, say so and go on |
| W3 | 5 | **Build order, cost, failure modes and kill criteria from your lens.** Read the newest iteration of the other three lineages and all of your own first |

Lineages run concurrently, so a sibling's newest file may be older than your own iteration. Name every sibling file you read by path and iteration number in a **Sibling check** section. A W1 iteration writes one line instead: `Independent: no round-2 sibling file read.`

---

## 4. The per-iteration contract

Every iteration follows this contract, in addition to the workflow's own iteration shape.

1. **Find your angle.** Your label is the last path segment of `config.fanout_lineage_artifact_dir` (`grok`, `mimo`, `swe` or `deepseek`). Iteration N takes angle `<label>-0N`: iteration 3 of the SWE lineage takes `swe-03`. Set Focus Area to that angle's id and title.
2. **One bounded angle.** Stay on it. If its questions are answered early, go deeper on them, not wider.
3. **Budget.** About 12 tool calls. Spend them on opening code and counting, not on rereading BASE or the digests.
4. **Cite.** Every claim carries a repo-relative `file:line` that you opened in this iteration. A claim you take from BASE, COUNCIL or a digest without reopening it is quoted as theirs: "BASE says", not "the code says".
5. **Read-only outside your lineage directory.**
   - Write only inside `PHASE/research/lineages/<label>/`. Your iteration lands at `PHASE/research/lineages/<label>/iterations/iteration-00N.md`, and any scratch file stays inside your lineage directory.
   - Read-only commands such as `rg`, `find`, `jq`, `wc` and node or python one-liners that read data files are allowed.
   - Do not run any repository module, test suite, `validate.sh`, `generate-context.js`, ratchet, eval script or install. Make no network call and no git write.
6. **No live `jev` call** of either package: no judgment, no `jev auth test`, no `jev auth status` and nothing sent to a Jev endpoint. Reason from code, docs and recorded reports.
7. **Name the two packages apart** in every sentence about `jev`.
   - The Python `jev-cli` 0.6.2 is what `.skilled/skills/cli-jev/cli-usage/` wraps.
   - The npm `jevctl` 0.2.3 is vendored research material at `R/jev-cli-main`.
   - Both install a `jev` command, and their exit codes disagree: exit 2 is a usage error with no quota spent in the Python `jev-cli`, and a tripped `--fail-on` gate in `jevctl`.
8. **Never open a `.env` file**, vendored or not.
9. **Private data gives numbers and names only.**
   - Transcripts under `TX/` and goal state records are the operator's.
   - Report counts, lengths, field names and record types. Never copy prompt, reply or tool text into an iteration.
10. **Vendor claims stay labeled.** A cost, latency or accuracy figure from a README, website or post is a vendor claim or a user report. The two website files hold only a URL, so say so rather than describe the site.
11. **New information only.**
    - An iteration that restates a BASE or COUNCIL finding without new evidence counts as no new information.
    - Every iteration ends its findings with a **New against baseline** table: `| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |`.
    - Be honest in that table: a restated row is allowed but earns nothing.
12. **Ids.** Never mint an `R` id. Refer to BASE items by their ids. Name a new idea `N-<angle id>-<k>`, for example `N-swe-03-1`, so the synthesis can trace it.
13. **Key gate on every idea (parent goal D5).**
    - Every recommendation is opt-in and dormant unless three checks all pass: `command -v jev`, `jev --version` printing `jev 0.6.2`, and `jev auth status` exiting 0.
    - With no key it behaves exactly as today, and says so in one line.
    - Each feature keeps its own switch. No global switch, and no path returns a default score.
14. **Hand-off.** End with a **Hand-off** section: the open threads the next iteration of your lineage must pick up, one line each.

### The per-idea record

Fill one block for every idea the iteration assesses, including ideas it drops.

| Field | What goes in it |
|---|---|
| **Idea** | Its id (a BASE `R` id or `N-<angle>-<k>`), one line on what Jev judges, and the type: `noul`, `choice`, `score` or `run` |
| **Builds on** | The BASE item or section-12 question it starts from |
| **Value** | The decision that gets cheaper, faster or more accurate, and for whom |
| **Seam** | `file:line` where the call or script sits, opened in this iteration |
| **Metric, baseline, harness** | The number that moves, today's value with its citation or UNKNOWN, and the harness id or the smallest missing harness |
| **Cost, latency, privacy** | Calls per use, the deadline it must meet, and what leaves the machine |
| **Key gate and no-key behavior** | Its own switch, where the three D5 checks run, and exactly what prints and what happens when any check fails, on exit 3, on exit 4 and on a malformed answer |
| **Rough LOC** | Lines of code and the files touched |
| **Verdict** | build-now, next, later or drop, with one sentence of reason |
| **Confidence** | Confirmed from code or a count, or inferred plus what would confirm it |

---

## 5. The angles

### W1: independent grounding (iterations 1 and 2)

#### grok-01: Vendored compaction against R19: `jevctl compact`, the fast-jev hook, pi-jev-context and the two posts
- **Wave:** W1
- **Maps to:** RQ2, RQ5. Questions 18 and 30 (R19's rank).
- **Open first:**
  - `R/jev-cli-main/docs/compact.md`, `R/jev-cli-main/src/core/compact.ts`, `R/jev-cli-main/src/vendor/compaction/compact.ts`, `state.ts`, `request.ts`
  - `R/jev-cli-main/plugin/hooks/fast-jev.ts`, `R/jev-cli-main/plugin/hooks/compaction/`
  - `R/pi-jev-context-main/README.md`, `src/index.ts`, `src/context.ts`
  - `CTX/social posts/Blog - Claude Code Compaction Without a Lossy Summary.md`, `CTX/social posts/Reddit - Integrated the Jev context engine into Hermes.md`
  - BASE §6, R19, What Not To Build rows 5, 6 and 43
- **Questions:**
  1. The npm `jevctl` documents a staged shrink (tool inputs truncated, texts abridged, old messages collapsed) toward `--max-state-tokens 25000`, and `worth_it: false` below `--min-reduction 0.25`. Read the staging code. Does it answer BASE's fit question, given that every compaction here started at 450,019 tokens or more, or does it confirm the fear that a pass rarely fits?
  2. `jev compact` reads a Claude Code session log directly and names "audit what a compaction would drop" as a use. Is an offline per-transcript audit, ported to the Python `jev-cli` `run`, the right shape for R19's later arm? What does D5 demand of such a port?
  3. pi-jev-context hides content rather than deleting it, and keeps a branch-aware cache. For this repository's Pi surface, is reversible hiding a better fit than deletion, and what is the prompt-cache risk (BASE question 11)?
  4. The strongest outside case against R19 at build-now. Which vendor or user claim, if true, makes the census unnecessary, and what local number would test it?
  5. Adopt or anti-pattern: list each compaction pattern with its vendored `file:line` and your verdict under the key gate. End with a kill criterion for the census and for the arm.
- **New information:** a code-cited mechanism in the vendored procedure that BASE did not use (the staging, `worth_it`, reversible hiding, the cache), a change to R19's rank argued from code by a non-Claude family, or a concrete port requirement. Restating rows 5, 6 or 43 is not new.

#### grok-02: Done gates and verification outside: what the Pi post, `jevctl verify` and claude-jev teach R2 and R20
- **Wave:** W1
- **Maps to:** RQ3, RQ5. Question 30 (R2's reshaping), and question 22 from the contrarian side.
- **Open first:**
  - `CTX/social posts/Reddit - I think i found the best use case for JEV and PI.md`: the done gate, and the lines BASE cites (`:231`, `:1121`)
  - `R/jev-cli-main/docs/verify.md`, `src/core/verify.ts`, `docs/screen.md`, `src/core/screen.ts`, `docs/classify.md`
  - `R/claude-jev-main/skills/jev/SKILL.md`, `R/claude-jev-main/src/domain/catalog/review.ts`
  - `CTX/external websites/classifier dev.md` (a URL only)
  - `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:117-123`, `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`
  - BASE §5, R2 and R20
- **Questions:**
  1. The Pi post reports a working done gate. What exactly did it judge: the stored goal, the last reply or the diff? Which of those does Claude Code's native judge see here, given that it "sees only the stored string"?
  2. `jevctl verify` checks claims against evidence. Does it map better to a criterion-level check (R20) or to a turn-level verdict (R2)? Cite the code path.
  3. Contrarian: if the native judge sees only the stored string, is a lint at authoring time worth more than any verifier arm? Is R2's zero-call slice aimed at a runtime nobody uses? Argue both sides from code, and let question 19's answer decide later.
  4. classifier.dev's cascade pattern survives in BASE only as an offline table in R2, and the local file holds only a URL. What do the npm `jevctl` `classify` and `screen` code show about thresholds and "unsure" bands that R2's cascade table should copy or avoid?
  5. Adopt or anti-pattern for each done-gate and verification pattern, with a kill criterion for R20's Jev arm and for R2's Jev arm.
- **New information:** a pattern with a code citation that changes R2's or R20's design, an evidenced argument that moves R2 relative to R20, or a failure the outside authors conceded that BASE does not carry.

#### mimo-01: Is R1 powered? A zero-call headroom estimate from committed data
- **Wave:** W1
- **Maps to:** RQ4. Questions 30 (R1's keep rule) and 21.
- **Open first:**
  - `ADV/scripts/routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `scorer-eval-baseline.json`
  - `ADV/scripts/routing-accuracy/derive-ambiguity-slice.mjs`, `score-outcome-rerank.mjs`, `capture-scorer-eval-baseline.mjs`
  - `ADV/lib/scorer/ambiguity.ts`, `ADV/lib/shadow/shadow-sink.ts` (the sink path is resolved at `:35-36`)
  - BASE §4 and R1
- **Questions:**
  1. From committed fields only, without running the scorer, what lower and upper bounds on movable rows can you derive? Starting points: the 24-row tau 0.03 slice at 18/24 and the holdout at 53/70. Does the bound already make `underpowered` the likely outcome?
  2. Given that bound, the smallest win count with zero losses that prints `keep`, and the true win rate at which the exact one-sided sign test at 0.05 reaches 80% power. Show the arithmetic.
  3. What flip rate can 3 reruns resolve per row, and does the 0.10 cap mean anything at the row count you derived?
  4. Question 21: count how often the live advisor sets `ambiguousWith`, from the shadow sink or any hook log, numbers only. If R1 keeps, how often would a served order fire?
  5. The operator's view of R1's report: which lines print, in what order, and which single line decides.
- **New information:** a numeric bound on movable rows with its derivation, a power figure, or a live ambiguity count. Restating the four outcomes is not.

#### mimo-02: The criteria-lint base rate, an independent sample (question 22)
- **Wave:** W1
- **Maps to:** RQ3. Question 22 (council disagreement D5).
- **Open first:**
  - `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:117-123` (rules 4 and 5 sit at `:121-122`), `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`
  - `goal.md` files under `specs/`, excluding `z_archive`
  - `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`, `.skilled/commands/create/assets/create-goal-auto.yaml`
  - BASE R20 and the D5 row of the Changes section
- **Questions:**
  1. Draw a stratified sample of at least 40 criterion lines, stratified by track and by goal kind, with the seed and the method recorded. Score each against rule 4 (self-contained) and rule 5 (checkable without opening another file). Report the share with a Wilson 95% interval, and list the sample as `path:line` so the operator can relabel it.
  2. Where does your estimate fall against 1.5% (strict regex) and about 28% (a 25-row reading)? Which method difference explains the gap?
  3. What does a violating criterion cost? Count native `goal_status` records under `TX/` whose `reason` field blames the criterion (numbers only), against BASE's seat-reported 31 of 576.
  4. Where would the lint print in `/create:goal`, so the operator sees it before the goal is set, and what is its default?
  5. Is R20's 5% stop rule the right threshold given your interval?
- **New information:** the first non-Claude estimate of the base rate, with an interval and a relabelable sample. A restated range is not.

#### swe-01: R1 as code: `score-jev-tiebreak.mjs` function by function
- **Wave:** W1
- **Maps to:** RQ1, RQ4. Question 30 (R1's keep rule).
- **Open first:**
  - `ADV/scripts/routing-accuracy/score-outcome-rerank.mjs`: metrics at `:85-93`, split and fold at `:119-123`, flip rule at `:150`, runs on import at `:159`
  - `ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:35-46` and `:70-76`, `derive-ambiguity-slice.mjs`
  - `ADV/lib/scorer/ambiguity.ts:7-8` and `:22-58`, `ADV/lib/scorer/fusion.ts:749-789`
  - `.skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/benchmark-stability.cjs:102-108`
  - `specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md`, `plan.md`, `tasks.md`
  - BASE R1 and R21
- **Questions:**
  1. List the functions (name, signature, rough lines), the imports from the built `dist` scorer, and which eval functions must be copied because the eval exports nothing and runs on import.
  2. Write the census, modal pick, `unstable`, per-row flip rate, sign test and four-outcome logic as pseudocode that a reviewer can check line by line against BASE's rule. Name every case the rule leaves undefined: a tie on reciprocal rank, an all-`none` row, a comparator with no rows, a gold outside the cluster.
  3. The test cases and their fixtures: a stub `jev` first on PATH that logs no call, a baseline mismatch, zero movable rows, fewer than 5 movable rows, an exit 4 row, exit 2 stopping the arm, and a key outside the submitted set.
  4. Where do 002's `spec.md`, `plan.md` and `tasks.md` diverge from BASE's proposed amendments today (`VITEST=true`, alias-aware matching, skip lines, the flip rate)? List each divergence by line.
  5. LOC per function and in total, plus R21's increment.
- **New information:** an undefined case in the keep rule, a function-level size that moves the 250 to 320 LOC estimate, or a plan divergence BASE did not list.

#### swe-02: R19's census as code: `score-compaction-recall.mjs` over the transcript format
- **Wave:** W1
- **Maps to:** RQ1, RQ2. Questions 25 and 30 (R19).
- **Open first:**
  - One or two transcripts under `TX/`, for record types and field names only: `compactMetadata` and the records around a compact boundary
  - `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:117-178` and `:284`, `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts:12-14`
  - `R/jev-cli-main/src/vendor/compaction/state.ts` and `compact.ts`: the placeholder state and its token estimate
  - BASE R19 and its proof plan
- **Questions:**
  1. The record types and fields the parser needs, and the exact rule that stops the run on an unknown record shape.
  2. How to estimate the placeholder-state size that an npm `jevctl`-style pass would send, reusing the vendored estimator's formula (cite it) and sending nothing.
  3. Question 25: after a compact boundary, does the transcript record the brief the PreCompact hook injected? Answer with record types and field names only. If not, what does replaying `buildMergedCompactResult` need that the transcript lacks?
  4. The must-survive rules as functions, each with one synthetic fixture: identifiers used after the boundary that appeared before it, files written through Write or Edit, the bound spec folder and the last user instruction. For open question 27, what the census prints per session so the operator's 3-session spot check can agree or disagree with each rule-derived item without reading transcript text in the report.
  5. LOC per function and in total, where the script lives, and its test cases, including a transcript directory with zero compactions.
- **New information:** the record-shape answer to question 25, a size estimator tied to vendored code, or a must-survive rule the recorded fields cannot support.

#### deepseek-01: The key gate as code: probes, the package collision and every failure path
- **Wave:** W1
- **Maps to:** RQ1, RQ5, RQ7.
- **Open first:**
  - `.skilled/skills/cli-jev/cli-usage/SKILL.md:80-110` and `:195-225`, `.skilled/skills/cli-jev/cli-usage/references/cli-reference.md`, `providers-and-models.md`
  - `R/jev-cli-main/src/versionCheck.ts`, `src/cli.ts`, `src/errors.ts`, `src/credentials.ts`, `docs/auth.md`
  - The gate and skip-line lines in `../002-advisor-jev-tiebreak-arm/spec.md` and `../003-goal-verifier-jev-shadow/spec.md`
  - The D5 subsection in BASE §9
- **Questions:**
  1. For each of the three checks: what does it cost in spawn time, network and quota, and what does it print on failure? Answer for the Python `jev-cli` 0.6.2 and for the npm `jevctl` 0.2.3 when it sits first on PATH. Does `jevctl`'s version check fetch anything when `--version` runs?
  2. What does `jev --version` print for each package? Is an exact match on `jev 0.6.2` enough to refuse `jevctl`, or can a wrapper or a future version slip through?
  3. The exit-code matrix for both packages, and what R1, the R19 arm, the R20 arm and the R2 arm each do on every code.
  4. Where does `jev auth status` read its key from? Can a key placed in `.claude/settings.json` `env` satisfy it by accident (What Not To Build row 43)?
  5. When does the gate run: once per run, once per session or once per call? When must a mid-run key rejection (exit 3 on a billed call) stop an arm, and what state persists?
- **New information:** a network or quota side effect of a probe, a gap in the version check, or an exit path BASE left undefined.

#### deepseek-02: The compaction seams: the function-hook budget and the transcript after a compact boundary (questions 18 and 25)
- **Wave:** W1
- **Maps to:** RQ2. Questions 18 and 25.
- **Open first:**
  - `.claude/settings.json:38` (`CLAUDE_CODE_ENABLE_FUNCTION_HOOKS`) and `:215-222` (PreCompact)
  - `R/jev-cli-main/plugin/hooks/types/claude-code.d.ts`: `:2337-2356`, `:3024-3026`, `:3320-3322`, `:3799-3818` and BASE's `:10177-10178`
  - `R/jev-cli-main/plugin/hooks/fast-jev.ts:26-31`, `:75`, `:237-253` and `:269-303`
  - The installed Claude Code: resolve `command -v claude`, read its version and any bundled types or docs, and run nothing else
  - `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`, `shared.ts`
- **Questions:**
  1. Question 18: trace the ten-second budget text to its source. Does the installed Claude Code carry a type or doc that states a production budget for `session.compact`? Which Claude Code version does the vendored `claude-code.d.ts` describe?
  2. On overrun, throw or a malformed result, what does the host do, and does its own summary still run in time?
  3. Question 25, from the seam side: the record types written after a compact boundary, field names only. Is the injected PreCompact brief among them?
  4. Could the `precompute` trigger move a pass off the critical path? What does it cost in egress when the compaction never happens?
  5. The degrade path of a live form under D5: which check runs where, and what the operator sees on each failure.
- **New information:** a budget number with its source, a record-shape answer, or a precompute cost argument. Restating K6 is not.

### W2: cross-read and push past (iterations 3 and 4)

Before starting, read the newest existing iteration of each of the other three lineages and fill the Sibling check.

#### grok-03: Routing and ranking outside: `jevctl route`, `rerank` and `classify`, claude-jev pick, and jevcache.sh, against R1 and R21
- **Wave:** W2
- **Maps to:** RQ4, RQ5. Questions 30 (R1's keep rule) and 21.
- **Open first:**
  - `R/jev-cli-main/docs/route.md`, `rerank.md`, `classify.md`, `match.md`, `src/core/route.ts`, `rerank.ts`
  - `R/claude-jev-main/src/application/pick-option.ts`, `rank-hypotheses.ts`, `src/domain/catalog/options.ts`
  - `CTX/external websites/jevcache.md` (a URL only)
  - The Pi post's per-prompt switching lines (`:464`, `:743`, `:761` per `ROUND1/context/jev-material-digest.md` §6)
  - BASE R1, R3, R21, and rows 1, 30, 36 and 40
  - mimo-01's and swe-01's iterations, if they exist
- **Questions:**
  1. Do the npm `jevctl` `rerank` or `route` shapes, a score per option or a single pick, fit R1's sign test over modal picks better than a `choice`? Would either change the per-row flip-rate definition?
  2. How do the vendored routers handle a no-match option and ties, and does R1's `none` key as an abstention match that handling?
  3. Contrarian on R1's keep rule: name a judge that passes all four `keep` conditions and still should not be served, or a real gain the rule would call `inconclusive`.
  4. What would jevcache.sh's answer cache do to R1's flip rate and to a live R3? Does any cache use survive D5 and row 30?
  5. Adopt or anti-pattern for each routing pattern, and a kill criterion for R21's calibration arm.
- **New information:** a vendored ranking mechanic mapped onto R1 with code lines, a counterexample to the keep rule, or a push past mimo-01's and swe-01's numbers.

#### grok-04: Egress, secrets, budgets and review funnels: claude-jev, supercov and jev-review against the redaction gap and R10's gold (question 7)
- **Wave:** W2
- **Maps to:** RQ5, RQ7. Question 7.
- **Open first:**
  - `R/claude-jev-main/src/infrastructure/fs-source-reader.ts`, `src/domain/budget.ts`
  - `R/supercov-main/docs/quality.md`, `R/supercov-main/crates/supercov-cli/src/quality/properties.json`
  - `R/jev-review-main/src/review/workflow.ts`, `judgments.ts`, `codebase-judgments.ts`, `src/domain/config.ts`
  - `R/jev-cli-main/src/provider.ts`, `R/pi-jev-context-main/src/jev.ts`
  - `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:120-130`, `.opencode/plugins/opencode-goal.js:463-475`
  - Archived deep-review iterations under `specs/**/review/`
- **Questions:**
  1. claude-jev refuses secret-looking files before any send. Would its rule catch `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=`, which both local regexes miss? Name the smallest rule the two redaction unit cases should assert.
  2. supercov prints a cost estimate and offers a dry run before a billed pass. Which arms (R1, the R19 arm, the R20 arm, the R2 arm) should print a planned call count and payload class before the first billed call, and in what exact line?
  3. jev-review's staged funnel with caps and a no-issue escape: does it give R10 a usable shape once gold exists? Is its whole-run abort still the only anti-pattern here?
  4. Question 7: count rejected-P0 downgrades with a written rationale in archived deep-review iteration narratives, not in `transitions`. Give the count, the exact search and the files, so R10 either gains a gold source or stays later.
  5. The vendored "refuse rather than truncate" budget rule against the clamp defect's `...` behavior: what does it suggest for the owners' fix?
- **New information:** a count for question 7, a redaction rule checked on paper against both regexes, or an announcement line with a vendored source.

#### mimo-03: Is any OpenCode or Pi goal verifier in use, and how long is its evidence? (questions 19 and 23)
- **Wave:** W2
- **Maps to:** RQ3. Questions 19, 23 and 30 (R2's reshaping). Council disagreement D2.
- **Open first:**
  - An `rg` for `OPENCODE_GOAL_STATE_DIR` and `.state/goal` across the repository and the runtime configs (`opencode.json`, `.opencode/`, `.pi/`)
  - `.opencode/plugins/opencode-goal.js:36-49`, `.skilled/hooks/goal/pi/goal-context.ts`
  - The main checkout's `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/.state/goal/`
  - BASE §5 and R2
- **Questions:**
  1. List every goal state directory that the operator's configs and the plugins resolve to. Count records by `runtime`, `lastVerifierVerdict` and `status`.
  2. For records that carry a verifier verdict: the evidence length distribution, and the share over 1,200 characters.
  3. If no directory holds a verdict, what would the operator have to do for 003's Jev arm ever to unblock? Should 003 stop at its zero-call slice? This settles D2.
  4. What does the operator see today when the OpenCode heuristic says `not_met`, and when Pi nudges on `unclear`? What would a `verifier_shadow=` field change for them?
  5. Operator labor: from the heuristic's disagreement rate with the native pre-labels, estimate the adjudication minutes for 30 to 50 rows.
- **New information:** record counts outside the default directory, an evidence-length distribution, or a labor estimate from a count.

#### mimo-04: What the operator actually runs: usage-ranked seams nobody examined (RQ6)
- **Wave:** W2
- **Maps to:** RQ6. Also sizes R19 through open question 29.
- **Open first:**
  - `TX/*.jsonl`: counts of tool names, slash commands, skill invocations and hook event names only, never content
  - `.skilled/commands/`
  - `ROUND1/context/seam-map.md` (S01 to S26)
  - BASE §8 and What Not To Build
- **Questions:**
  1. Rank commands, skills and hook events by how often they appear in the transcripts. Which of the top ten have no seam in S01 to S26 and no row in BASE?
  2. For each unexamined high-frequency surface: what typed judgment does it make today, by code or by a model, and who reads the result?
  3. Which one passes Q1 to Q15 today for a Jev lens, with its metric, its harness or the smallest missing harness, and a per-idea record?
  4. Open question 29: split the host compactions by whether a user turn followed within a minute (numbers only), to size R19's value to the operator.
  5. The one decision the operator makes most often that a Jev lens could pre-answer, and why nobody has measured it.
- **New information:** a usage count that re-ranks a seam, or a seam absent from both the seam map and BASE, with its checklist result.

#### swe-03: R2's zero-call slice and the two redaction unit cases as code
- **Wave:** W2
- **Maps to:** RQ1, RQ3. Questions 23 and 30 (R2's reshaping).
- **Open first:**
  - `.opencode/plugins/opencode-goal.js`: `:42`, `:382-389`, `:414-420`, `:463-475`, `:1107`, `:2197-2230` and `:3359-3385`
  - `.skilled/hooks/goal/lib/goal-core.cjs:290-297` and `:596-620`, `goal-core.test.cjs`, `.opencode/plugins/tests/`
  - `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:120-130` and its tests
  - `../003-goal-verifier-jev-shadow/spec.md`, `plan.md`, `tasks.md`
  - BASE R2
- **Questions:**
  1. Drive `maybeVerifyGoal` through `MkGoalPlugin.__test` against a temporary state directory, or add one `__test` export for the heuristic? Which is smaller, which touches a frozen contract, and what is the call path of each?
  2. The tail-window arm and the goal-core parity arm as functions, including the mapping of `not-met` and `unclear`.
  3. The two redaction unit cases: exact inputs, expected outputs, the test file each lands in, and the smallest regex change that makes them pass. That change is reported to the owners, not made.
  4. The fixture row schema, and the pre-label join from native `goal_status` records by field names only.
  5. LOC and test count, and every divergence between 003's docs and BASE's proposed amendments.
- **New information:** a concrete test file with inputs, a smaller driver path, an undefined mapping, or a push past mimo-03's counts.

#### swe-04: R20's lint as code, and one skip-line contract across R1, R19 and R20
- **Wave:** W2
- **Maps to:** RQ1, RQ3. Question 22.
- **Open first:**
  - `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` (its criterion parsing and `:44-49`) and its tests
  - `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:117-123`, the goal template under `.skilled/skills/sk-doc/sk-create-goal/assets/`
  - `.skilled/commands/create/assets/create-goal-auto.yaml:221`
  - mimo-02's sample, if it exists
  - BASE R20 and the D5 subsection of §9, `../002-advisor-jev-tiebreak-arm/spec.md:112` and `:131`, `../003-goal-verifier-jev-shadow/spec.md:121`
- **Questions:**
  1. Can the lint reuse `check-goal.cjs`'s criterion parser without changing its exit codes? Name the function, or show why the lint must copy it.
  2. The lexical rules as functions, each with at least three positive and three negative examples drawn from real criterion lines (`path:line`).
  3. The label file schema, and the scorer for per-rule precision and recall.
  4. One skip-line contract as a string table, shared by text rather than by a helper: the exact line for each failing D5 check and each exit code, across R1, R19 and R20.
  5. LOC, tests, placement and the rollback sentence.
- **New information:** rules with real examples, a parser-reuse finding, the skip-line table, or a push past mimo-02's sample.

#### deepseek-03: Goal seams across runtimes: Pi `turn_end`, the clamp path and where a lint plugs in (question 28)
- **Wave:** W2
- **Maps to:** RQ3. Questions 28 and 30 (R2's reshaping).
- **Open first:**
  - `.skilled/hooks/goal/pi/goal-context.ts:220-240`
  - The installed Pi runtime under `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/`, which `command -v pi` resolves to. Read it only
  - `.skilled/hooks/goal/lib/goal-core.cjs:290-297` and `:596-620`, `.opencode/plugins/opencode-goal.js`, `.skilled/hooks/goal/goal-plugin.md`
  - `.skilled/commands/create/assets/create-goal-auto.yaml:221`, `.skilled/commands/goal-opencode.md`
- **Questions:**
  1. Question 28: does Pi await async `turn_end` handlers? Cite the dispatch code in the installed runtime.
  2. Restate the clamp path from the cited lines in your own reading. Does any line contradict BASE's K5?
  3. Where would R20's lint run so that every runtime's goal is linted before it is set: the `/create:goal` runner, the callers of `check-goal.cjs`, or the native `/goal` string path? Name the callers by search.
  4. The failure paths of R2's later plugin mode: which errors reach the catch that turns an error into `blocked`?
  5. Is goal-core's vocabulary (`not-met`, `unclear`) a seam risk for any R2 arm, and where exactly?
- **New information:** a Pi dispatch answer, a contradiction of BASE, or a caller list BASE lacks.

#### deepseek-04: Missed seams: the round-1 DeepSeek registry loss and hook surfaces outside the seam map (question 26, RQ6)
- **Wave:** W2
- **Maps to:** RQ6. Question 26.
- **Open first:**
  - `ROUND1/research/lineages/deepseek/iterations/iteration-001.md` to `iteration-010.md`, `ROUND1/research/lineages/deepseek/findings-registry.json`
  - BASE §11 and What Not To Build, `ROUND1/context/seam-map.md`
  - Hooks: `.skilled/hooks/post-edit-quality/`, `.skilled/hooks/session-lifecycle/`, `.skilled/hooks/directive-lifecycle/`, `.skilled/hooks/permission-policy/`
  - Plugins: `.opencode/plugins/sk-communication-projection.js`, `.opencode/plugins/system-deep-loop-guard.js`, `.hermes/plugins/repo-guards/`
  - Skills and commands: `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`, `.skilled/skills/sk-code/sk-code-review/scripts/`, `.skilled/commands/rewrite/response.md`, `.skilled/commands/prompt/improve.md`
- **Questions:**
  1. Question 26: read DeepSeek's round-1 findings against BASE. List any finding with no record, no drop row and no mention, and say whether it would change a verdict.
  2. For each surface above: what judgment does it make today, by code or by a model, inside what deadline, and who reads the result?
  3. Which of them hosts a typed judgment Jev could make as one lens, with a harness or the smallest missing one?
  4. Which are repository facts Jev must not replace? Drop them with the reason from code.
  5. The one missed seam with the best checklist result, as a per-idea record.
- **New information:** a lost round-1 finding that matters, or a seam absent from S01 to S26 and from BASE, with a checklist pass or a reasoned drop.

### W3: build order, cost, failure modes and kill criteria (iteration 5)

Read all your own iterations and the newest iteration of each other lineage first.

#### grok-05: The contrarian build order and kill list across all four lineages
- **Wave:** W3
- **Maps to:** RQ7. Closes question 30 from the contrarian side.
- **Open first:** your iterations 1 to 4, the newest of the other three lineages, BASE §11 and §13, COUNCIL Dissent, `ROUND1/context/repo-rules-digest.md` §3 and §4, `.skilled/repo-rules/prevent-overengineering.md`.
- **Questions:**
  1. If only one phase ships, which one, and what first-slice result would kill the rest of the program?
  2. A kill criterion for each build-now and next item, written as a printed result rather than an intention.
  3. Which round-2 proposal from any lineage fails a checklist question or a red flag, and which one?
  4. Which vendor claims does the order still lean on, and what local number replaces each?
  5. Where you disagree with the other lineages' orders, with code evidence.
- **New information:** a kill criterion or order change grounded in round-2 code or counts. A re-ranking by opinion is not new.

#### mimo-05: Measurement-first build order, operator labor and the cost of a day
- **Wave:** W3
- **Maps to:** RQ7.
- **Open first:** your iterations 1 to 4, the newest of the other three lineages, BASE §9 and §13, `ROUND1/context/measurement-digest.md` §3 and §4.
- **Questions:**
  1. Which slice produces a usable number soonest, and what exactly does the operator read when it does?
  2. Operator labor per phase in minutes (labels, spot checks, adjudication), and which phase fails if the operator gives none.
  3. The cost of each Jev arm in calls and in dollars, with vendor claims labeled, and the announcement line each prints before its first billed call.
  4. Which measurements must come before which, for example 002's latency record before any live form?
  5. Kill criteria from the measurement view: the printed number that stops each phase.
- **New information:** labor or cost figures derived from round-2 counts, or an ordering constraint BASE lacks.

#### swe-05: Build order in code: files, LOC, tests, switches and rollback per phase
- **Wave:** W3
- **Maps to:** RQ7, RQ1.
- **Open first:** your iterations 1 to 4, the newest of the other three lineages, BASE §13, `../002-advisor-jev-tiebreak-arm/` and `../003-goal-verifier-jev-shadow/`.
- **Questions:**
  1. The ordered phases, each with files, functions, LOC, tests, its switch name and its rollback sentence.
  2. The first PR-sized slice and its observable check.
  3. What becomes shared code at the third caller, and exactly when that happens.
  4. The code-level failure modes of each phase, and the printed line that reports each.
  5. The kill rule of each phase in code terms.
- **New information:** a size or dependency that changes the order, or a failure mode no printed line reports.

#### deepseek-05: Failure modes and kill criteria for the survivors, engineering view
- **Wave:** W3
- **Maps to:** RQ7.
- **Open first:** your iterations 1 to 4, the newest of the other three lineages, BASE §9 and §13.
- **Questions:**
  1. For each survivor, on exit 3, exit 4, a malformed answer, a slow call, the wrong package on PATH and a key rejected mid-run: what prints, and what state persists?
  2. Which survivors touch a frozen contract? Name the owner and the callers, found by search.
  3. The build order by dependency, with each step's rollback sentence.
  4. Which failure could change today's behavior with no key, and the test that proves it cannot?
  5. A kill criterion for each survivor.
- **New information:** an unhandled failure path, or a contract touch BASE missed.

---

## 6. Coverage

### Angles to research questions

| Angle | Wave | RQ1 slice | RQ2 compaction | RQ3 goals and lint | RQ4 R1 power | RQ5 vendored material | RQ6 missed seams | RQ7 order and cost |
|---|---|---|---|---|---|---|---|---|
| grok-01 | W1 | | x | | | x | | |
| grok-02 | W1 | | | x | | x | | |
| grok-03 | W2 | | | | x | x | | |
| grok-04 | W2 | | | | | x | | x |
| grok-05 | W3 | | | | | | | x |
| mimo-01 | W1 | | | | x | | | |
| mimo-02 | W1 | | | x | | | | |
| mimo-03 | W2 | | | x | | | | |
| mimo-04 | W2 | | | | | | x | |
| mimo-05 | W3 | | | | | | | x |
| swe-01 | W1 | x | | | x | | | |
| swe-02 | W1 | x | x | | | | | |
| swe-03 | W2 | x | | x | | | | |
| swe-04 | W2 | x | | x | | | | |
| swe-05 | W3 | x | | | | | | x |
| deepseek-01 | W1 | x | | | | x | | x |
| deepseek-02 | W1 | | x | | | | | |
| deepseek-03 | W2 | | | x | | | | |
| deepseek-04 | W2 | | | | | | x | |
| deepseek-05 | W3 | | | | | | | x |

### Angles to the questions handed to round 2

| Question | Angles |
|---|---|
| 30: other families on R1's keep rule, R19's rank and R2's reshaping | R1: mimo-01, swe-01, grok-03. R19: grok-01, swe-02. R2: grok-02, mimo-03, swe-03, deepseek-03. Closed by grok-05 |
| 22: criteria-lint base rate | mimo-02 (independent sample), swe-04 (rules with real examples), grok-02 (contrarian) |
| 18: `session.compact` production budget | deepseek-02, grok-01 |
| 19: OpenCode or Pi verifier in use | mimo-03 |
| 23: evidence length over 1,200 characters | mimo-03, swe-03 |
| 25: does the transcript record the injected brief | swe-02, deepseek-02 |
| 26: DeepSeek registry loss | deepseek-04 |
| 28: does Pi await async `turn_end` | deepseek-03 |
| 7: narrative-mined P0 gold | grok-04 |
| 21: live `ambiguousWith` rate | mimo-01, grok-03 |

### Required spreads

- **Angles that work directly in `CTX/`:** grok-01 (the npm `jevctl` compaction, pi-jev-context, the blog and the Hermes post), grok-02 (the Pi post, `jevctl verify`, claude-jev, classifier.dev), grok-03 (the `jevctl` routers, claude-jev pick, jevcache.sh), grok-04 (claude-jev, supercov, jev-review). deepseek-01, deepseek-02 and swe-02 also read vendored code. Every one of these records what to adopt under the key gate and what is an anti-pattern here.
- **Angles that hunt for missed seams (RQ6):** mimo-04 (usage-ranked surfaces) and deepseek-04 (the registry loss and hook surfaces outside the seam map).
- **Council disagreements:** D2 goes to mimo-03 and D5 to mimo-02. Open question 27, rule-derived recall, is the spot-check design in swe-02. Open question 29, watched waits, is in mimo-04.
