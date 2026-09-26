---
round: 1
seat: seat-001
executor: opus-max
lens: "Critical: evidence and verdict audit"
status: ok
timestamp: 2026-09-26T00:00:00.000Z
simulated: false
---

# seat-001: Critical / opus-max (Claude Opus 5.5 max)

## Mandate
Every verdict kept, moved or dropped rests on a `file:line` reopened during this run. Risk focus: verdicts the evidence does not support in either direction, claims marked Confirmed that are really inferred, and measurements that cannot answer the question they were designed to answer. Vantage: single model (Claude Opus 5.5 max), shared by all three seats. Diversity comes from lens only.

## Confidence
74

## Scope note (recorded by the council host)
The seat reported that one command wrote and then deleted `/tmp/claude-501-crit.txt`, a criteria-count scratch file, which breaks the brief's no-write rule. Nothing under the repository root was written. The seat also skipped the trigger-index lookup and the skill advisor, because the brief forbade running repository scripts.

## Seat Output

### 1. Headline verdict

The synthesis is sound in direction and mostly well grounded. It is too lenient in the two measurements it would actually run and too conservative on compaction. It also missed a deterministic goal-verifier defect that reshapes R2.

- **What held when reopened.** These all held:
  - the 2500 ms SIGKILL with its `{}` fail-open
  - the plugin's binary heuristic, its silent unknown-mode fallback and its error-to-`blocked` path
  - the pinned corpus hashes and the 5-row abstention ceiling
  - the reviewer fixtures: 8 cases, all `fail`. The seat's own replay of the verdict regex finds `VERDICT: FAIL` in all 8.
  - the zero-downgrade P0 census. A deduplicated recount gives 44 P0-born findings against the synthesis's 45, and zero downgrades either way.

  The no-new-surface decision and "never a default score" also hold.
- **Too lenient.** R1's keep rule cannot separate an effect from noise:
  - its stability bar passes a judge that flips a coin
  - "MRR rises" has no floor
  - right@3 barely constrains a reorder inside the top 3.

  R2 reuses the same aggregate stability test. Two claims marked Confirmed are inferences. The first is that the 2500 ms kill "rules out" a live call (`research.md:393`). The second is that a default 5dim run carries a mock D4. Through the runner it carries `noop`, a fixed 1.0.
- **Missed.** The OpenCode goal heuristic returns `not_met` for any evidence text over 1200 characters. Its own clamp appends `...` and its truncation check then fires (`opencode-goal.js:382-389`, `:1107`, `:2209-2211`). R1's planned metric copy would also import exact id matching. That misses the 16 of 64 skill-firing holdout rows whose gold labels only match through alias groups.
- **Too conservative.** The compaction drop rests on this repository's 3 s PreCompact command hook. Yet the repository already enables Claude Code function hooks (`.claude/settings.json:38`), and that is the route the vendored compaction uses. The operator's fourth idea got no measurement path. A goal-criterion lint, a cheap and measurable goal-side idea, is absent.
- **The 1 build-now against 32 drop tension.** By the seat's classification (judgment), 17 of the 32 drops are live, authoritative or default-on forms, or failure-path rules, of ideas that survive elsewhere in offline or shadow form. The other 15 drop an idea outright. The four ideas map to:
  - R1 (advisor, build-now)
  - R2 (goal, next)
  - R5 to R7 (grading, later)
  - R11 (compaction, later).

  The restraint follows the operator's own "usefulness that's measured" priority, and the evidence does not support a large build today. It does support one larger measured bet: compaction replay with a zero-call stop boundary (N2 in section 7).

### 2. Per-recommendation review

| ID | Synthesis verdict | Your call | Resulting tier | Reason | Evidence you reopened | Confirmed or inferred |
|---|---|---|---|---|---|---|
| R1 | build-now | keep, modify design | build-now | Only item whose harness, corpus and baseline exist, and the census costs nothing. As designed the keep rule cannot tell a real effect from noise (below) | `score-outcome-rerank.mjs:47`, `:85-88`, `:118-121`, `:149-150`, `ambiguity.ts:22-36`, `benchmark-stability.cjs:86-108`, capture `:43`, `aliases.ts:12` | Code Confirmed, power bounds derived |
| R2 | next | keep, modify | next | The zero-call slice is worth more than stated, because the heuristic fails every long message by construction. The Jev arm must beat a free tail-window arm, not the current heuristic | `opencode-goal.js:382-389`, `:1107`, `:2199`, `:2209-2211`, `:3359-3385` | Code Confirmed, live frequency Inferred |
| R3 | later | keep | later | Serves a pick R1 has not measured and needs a producer. A vendor cache (jevcache) sits outside D5's gate and exact-match keys rarely hit on free-text prompts | `user-prompt-submit.ts:22-24`, `:109-126` | Deadline Confirmed, hit rate Inferred |
| R4 | later | keep | later | Shares R2's rows. The sentinel reads the last 400 characters because claims end a turn, which is the design R2's evidence window lacks | `completion-evidence-sentinel.cjs:64-70`, `:90-94` | Confirmed |
| R5 | later | keep | later | No current case reaches the classifier | `reviewer-scorer.cjs:117-123`, four reviewer fixtures (8 cases, 8 recorded outputs, 8 regex hits) | Confirmed by count |
| R6 | later | keep | later | The judge slot is empty and the model step belongs to the operator | `reply-harness/README.md:3`, `:20` | Confirmed |
| R7 | later | keep, correct a fact | later | A default runner run uses `noop` (D4 fixed at 1.0). `mock` is only the direct-scorer default. Either way D4 carries no signal | `run-benchmark.cjs:435`, `:577`, `score-model-variant.cjs:208-211`, `:222-224`, `:253` | Confirmed |
| R8 | later | keep, add a slice | later | Local replay first. Add DeepSeek-04's cheaper target: the inert-novelty windows. 12 tracked files under 10 spec folders mention `novelty_signal_inert` | `convergence.cjs:480-486`, `stopping-clock-shadow.ts:10-19`, `reduce-state.cjs:965-989` | Confirmed |
| R9 | later | keep | later | Needs R8's calibrated signal | `deep-research-confirm.yaml:1316-1322` | Confirmed |
| R10 | later | keep | later | No negative class. Recount deduplicated per registry: 1834 findings, 44 P0-born, all still P0, 0 downgrades | `completion-criteria.md:61-63`, `:75`, 409 registries | Confirmed |
| R11 | later | modify (re-target) | later | Move from brief selection to history pruning on the function-hook route this repository enables. The 3 s argument does not bind that route (N2) | `.claude/settings.json:38`, `:215-222`, `compact-inject.ts:1-8`, `shared.ts:11-14` | Repo facts Confirmed, host API a vendor artifact |
| R12 | later | keep | later | Clarify is a bounded set under `ambiguityDelta` with 3 gold rows | `router.cjs:199-205` | Confirmed |
| R13 | later | keep | later | No gold | `alignment-validator.ts:73-75` | Confirmed seam |
| R14 | later | keep | later | Comparator exists, no focus gold | `next-focus-selection.ts:351-356` | Confirmed |
| R15 | later | keep, widen | later | Add DeepSeek-05's blind spot. The body-key gate runs first, so same-point findings with different bodies are never compared | `fanout-merge.cjs:341`, `:348-351` | Confirmed |
| R16 | later | keep | later | No fetch matcher exists. The vendored `screen` is npm `jevctl` 0.2.3 only, which D5's version gate refuses | `.claude/settings.json` hook table | Confirmed |
| R17 | later | keep | later | Recipe exists for npm `jevctl` only, D5 refuses that package and no seam was opened | vendored `recipes.md:5-11` | Vendor shape Confirmed |
| R18 | later | keep | later | No caller in this repository | vendored `hypotheses.ts:41-45` | Vendor shape Confirmed |

**R1 in detail: can the keep rule separate an effect from noise?** No.

1. **Sample.** The held-out half is 88 gold rows: 177 gold rows split by sorted id (`score-outcome-rerank.mjs:47`, `:118-121`, counted). About 19 of them are wrong today. That figure is derived: 152/195 correct includes 13 correct abstentions, so 38 gold rows are wrong corpus-wide. Movable rows are a subset of those 19 and are UNKNOWN until the census.
2. **"MRR rises" has no floor.** One net fix from rank 2 to rank 1 moves held-out MRR by 0.5/88 = 0.0057, and that flips `keep` under the copied rule (`:149-150`, 002 REQ-007).
3. **"right@3 does not fall" is nearly vacuous.** The cluster is passing recommendations within 0.05 of the passing top (`ambiguity.ts:22-36`). A reorder inside the top 3 cannot move gold out of the top 3.
4. **The stability bar cannot fail.** The coefficient is `1 - sd/mean` with sample sd over 3 passes (`benchmark-stability.cjs:86-108`), computed on Jev-column MRR, and non-eligible rows keep the fused order (002 `plan.md:77`). A coin-flipping judge on 20 two-member clusters gives per-pass MRR sd of about sqrt(20 × 0.0625)/88 = 0.013. That puts the coefficient near 0.985 at a mean near 0.85, and near 0.97 even with all 88 rows eligible. A random picker clears 0.95. Derived from the Confirmed formula, and the magnitude is Inferred.
5. **Half the usable rows are unused.** The train half exists to fit the outcome fold (`:17-20`, `:58-75`). A zero-shot arm fits nothing, so restricting it to the held-out half halves its power with no leakage benefit.
6. **No free comparator.** Zero-call tie-breaks exist and any of them could win on its own:
   - confidence order inside the cluster
   - always-second
   - the expected value of a random pick
   - the outcome-weighted rerank the same script already implements (`:129-133`).

   If the fused order is worse than chance on eligible rows, any reorder wins, and a Jev "win" then says nothing about Jev.
7. **Two build traps.** The rerank metric matches ids exactly (`:85-88`). 16 of the 64 skill-firing holdout rows (`sk-deep-*`, `deep-*`, `command-spec-kit`) and the 13 `memory:save` corpus rows match only through alias groups (`aliases.ts:12`, capture `:70-76`). Separately, 002's enumerated env (`plan.md:63`) omits `VITEST=true`, which both the capture and the slice set (`capture-scorer-eval-baseline.mjs:43`, `derive-ambiguity-slice.mjs:51`). Without it, REQ-005's 53/70 check may void the arm.
8. **REQ-012's veto has no named failure mode.** The frozen slice dates from 2026-07-07 (`derive-ambiguity-slice.mjs:36`). It measures raw score over all candidates (`:62-66`), while ranking uses an adjusted score (`fusion.ts:749-776`), so 11 of its 24 margins are negative. A gain concentrated there is where near-ties live, not an artifact. 12 of its 19 gold rows sit in the held-out half, counted with C-locale sort standing in for `localeCompare`.

**Is "a loss closes the live form with a number" sound?** No.

- The live advisor call is already closed by the 2500 ms kill, so R1 can only bear on R3's served forms.
- An underpowered loss is absence of evidence, not evidence of absence.
- A loss covers one configuration only: description-only option text, one fixed question and an unconditional override. DeepSeek-02 left the option text open as a variable (`iteration-002.md:87`).

**What would make R1 decisive (all proposed):**

- Score every gold row Jev can be asked about: both halves plus the 64 holdout rows, with alias-aware matching in the metric and in the census.
- Take the majority pick per row over 3 passes and count fixes against breaks. Pre-register an exact two-sided sign test at 0.05 plus a minimum net MRR gain. The smallest winning splits are 6-0 (p 0.031), 8-1 (0.039) and 10-2 (0.039).
- Allow four outcomes: `keep`, `kill` (a significant loss, or an upper bound below the minimum), `inconclusive` and `underpowered` (fewer than 6 movable rows). Only `kill` closes R3.
- Measure stability as per-row pick agreement on eligible rows (at least 0.9). Record the pick and `none` probabilities per call, as DeepSeek-08 had it (`iteration-008.md:31`, `:33`).
- Jev must beat the best zero-call comparator. Report the tau 0.03 split, but do not veto on it.

**R2 in detail.**

1. **Vocabularies.** The plugin uses `met`, `not_met` and `blocked` (`opencode-goal.js:179`), and its heuristic never emits `blocked` (`:2197-2230`, `:2308-2317`). The core uses `met`, `not-met` and `unclear`, and `not-met` only for blocking language (`goal-core.cjs:586-619`). R2 measures the plugin heuristic (003 REQ-002), so "needs no mapping" holds for OpenCode only. 003 adds normalization anyway (REQ-005).
2. **The defect.** Ingestion clamps evidence at 1200 characters with a trailing `...` (`:1107`, `:463-476`, `:382-389`). The heuristic re-clamps at the hard-coded 1200 (`:2199`) and then treats that `...` as truncation (`:2209-2211`). The core carries the same check and returns `unclear` (`goal-core.cjs:606-607`). This is Confirmed from code, and its live frequency is UNKNOWN.
3. **Consequences.**
   - Error attribution will likely show this check dominating false `not_met` on long final messages.
   - A Jev arm fed the same clamped head of the message cannot see a trailing completion claim either.
   - A zero-call tail-window heuristic is the build-nothing comparator and must be an arm in the report, since 003 excludes heuristic changes (`spec.md:89`).
4. **Transfer to live sessions.** Rows must be the full last assistant text as ingested, not hand-trimmed excerpts. A curated set gives per-class error rates, not live frequency. Live frequency for each goal's last check can come at zero calls from `lastVerifierReason` in the operator's goal state and its archive (`:2420-2427`, `:1142-1146`). The continuation log cannot provide it, because it records decision reasons such as `cooldown` and `prompt_async_sent` (`:869-878`, `:2637-2640`).
5. **Wrapper headroom.** 003 holds only the length and blocking checks (REQ-004, `spec.md:122`). Headroom therefore exists, but mostly on the check a free fix removes.
6. **Offline drive works.** `maybeVerifyGoal`, `setGoal` and `readGoal` are exported (`:3377-3380`), and options carry `stateDir` and `verifierMode` (`:249`, `:254-256`). It writes state, so it must point at a temporary directory. Run only the heuristic through it. The plugin turns a throw into `blocked` and an invalid verdict into `not_met` (`:2335`, `:2378-2386`), so the Jev arm should spawn `jev` directly.
7. **REQ-006(d) is weak too.** A coin-flip judge on 15 asked binary rows gives an sd near 1.9 on a correct count near 40, a coefficient near 0.95. Use per-row agreement. A false keep costs less here, because the shadow mode never acts.

**The three declared judgment calls.**

- **(a) Kill radius.** The direction is right: a routing loss says little about severity or goal verdicts, whose inputs and gold differ. But R1 as designed cannot produce a decisive loss, so even "kills R3 outright" needs the outcome rule above. Modify.
- **(b) R2 as next.** Supported, for a reason the synthesis did not have: the zero-call slice will likely surface a no-Jev fix. The Jev arm's expected value is lower than `research.md:414-420` implies. Keep.
- **(c) Defer log and spec-level flags.** Both drops hold. The level-flag reason, "no decision reads either output" (`research.md:351`), is wrong: each flag adds points that set the level (`recommend-level.sh:19-22`, `:36-47`). The correct reason is low stakes (one documentation tier), no gold and the same task text an agent already reads.

### 3. Notable drops and dead ends

| Row | Synthesis verdict | Your call | Resulting tier | Reason | Evidence you reopened | Confirmed or inferred |
|---|---|---|---|---|---|---|
| 1 | drop | keep, relabel | drop | The kill is Confirmed, and both Pi lineage logs show the advisor itself failing open at 2504 ms. That a Jev call "cannot fit" is Inferred, since no latency exists | `user-prompt-submit.ts:22-24`, `:109-126`, deepseek and mimo `logs/` | Kill Confirmed, fit Inferred |
| 5 | drop | keep, narrow | drop, PreCompact only | Right for the command hook. Section 6 generalizes it to the whole idea, but the function-hook route is enabled here and was never examined | `.claude/settings.json:38`, `:215-222`, `compact-inject.ts:1-8` | Confirmed |
| 7 | drop | keep | drop | Stands on no gold and a per-turn tax. The 0.22-to-0.58 report on the cited line concerns meraGPT's "Decider 1", whose relation to Jev is UNKNOWN. The same line reports a done gate that worked (0.16 against 0.90), and the synthesis omits it | Pi post `:231`, `:1121` | Third-party report |
| 9 | drop | keep, correct | drop | The runner's default grader is `noop`, a fixed 1.0, not `mock` | `run-benchmark.cjs:577`, `score-model-variant.cjs:208-209` | Confirmed |
| 14 | drop | keep | drop | Reopened: a 0.20 threshold on adjudicator verdict deltas, marked "proposed" | deep-ai-council `convergence-signals.md:56-58` | Confirmed |
| 21 | drop | keep | drop | Reopened the archived baseline: tp 125, fp 2, fn 2, tn 66 | archived `routing-baseline.json:52` | Confirmed, archived |
| 22 | drop | keep, fix reason | drop | The flags feed the level, so "no decision reads it" is wrong. Drop on low stakes and no gold | `recommend-level.sh:19-22`, `:36-47` | Confirmed |
| 30 | drop | keep, note | drop | Correct, but the measure it protects cannot fail at this size. Switch to per-row agreement | `benchmark-stability.cjs:86-108` | Formula Confirmed, magnitude derived |
| 35 | dead end | keep | dead end | Recount: 44 P0-born against 45, still zero downgrades | 409 registries | Confirmed |
| new-a jevcache.sh | not examined (bare URL) | drop | drop | A cache defeats the stability reruns. Its sidecar holds `JEV_API_KEY` outside D5's `jev 0.6.2` gate. `curl \| sh` is an install that needs a yes. Exact keys rarely repeat on prompts, and "only a hash leaves" cannot hold on a miss (Inferred) | `external websites/jevcache.md:1`, material digest `:20` | Vendor claim |
| new-b classifier.dev | not examined | drop | drop | A keyless free tier violates D5, it adds a second egress vendor and a new secret, and the Smart tier mixes in a reasoning model | `external websites/classifier dev.md:1` | Vendor claim |
| new-c PostToolUse Bash-output filter | not examined | drop | drop | Every Bash output would leave the machine, and D5 allows no secret. It taxes every Bash call. A deterministic filter (the blog's own hard-protect list) comes first. Whether a command hook can replace tool output is UNKNOWN | `.claude/settings.json:193`, Blog `:56-58` | Third-party report |

### 4. D5 impact

- **Presence, not validity** (`cli-usage/SKILL.md:101-103`, `:172`, `providers-and-models.md:145-148`). A rejected key passes the gate and surfaces as exit 3 on the first billed call.
  - **R1.** Its first billed call is `jev auth test`, which doubles as the validity check. The arm stops with zero rows, and research.md and 002 call that `partial`. It deserves its own line, `jev arm stopped: key rejected` (proposed).
  - **R2's plugin mode as research.md wrote it** (`:417`). A missing key or a failure gives one log line and no shadow record per verification. With a present but rejected key, every idle would spend a failing billed attempt and log a line. That is the failure path D5 changes. 003 already latches it off per session (REQ-011, `spec.md:134`, `:144`).
- **Gate cost.** The gate is a shell builtin plus two Python spawns, with UNKNOWN latency. Offline it does not matter. Any hook-time feature must run the gate once per session, asynchronously in OpenCode (`completion-evidence-sentinel.cjs:90-93`).
- **"Jev gets no secret" has two readings.**
  - The integration never handles the key. 002 REQ-003 satisfies this by letting `jev` resolve its own credential.
  - No secret content reaches the payload. R2's live shadow sends conversation text. The plugin already strips common secret shapes before storing evidence (`opencode-goal.js:463-476`), which research.md did not cite. That is a pattern list, not a guarantee.
- **Cost increases.** D5 refuses npm `jevctl` 0.2.3, so the vendored `compact`, `verify` and `screen` implementations are unusable as-is. R11 and N2, R16 and R17 each need a port to the Python `jev-cli` 0.6.2.
- **No drop reopens.** D5 hardens rows 6 and 9 and forecloses classifier.dev's keyless tier. The exact `jev 0.6.2` pin makes every feature dormant after a `jev-cli` upgrade, and the refusal line must say so (002 does).

### 5. DeepSeek under-count finding

**Mechanism.** DeepSeek's state records carry only `findingsCount` (6, 6, 7, 6, 5, 5, 6, 6, 5, 5 = 57). Its own lineage `findings-registry.json` already holds 8, all with a null iteration and titles that read like its synthesis headlines. So the loss happened in the lineage reducer before the merge. That cause is Inferred, and reading that reducer's parser would confirm it. The merged count of 85 (DeepSeek 8, Grok 22, MiMo 55) is Confirmed.

**Did it bias the synthesis?** Not in attribution. research.md names DeepSeek 152 times against MiMo 151 and Grok 104, and it cites all ten DeepSeek iterations by number (counted). It did in detail. DeepSeek's engineering refinements, which are what would make R1 decisive, fell out.

Omitted or reweighed, for the R1 design:

1. The per-call `prob` and `noneProbability`, plus a flip rate beside the coefficient (`iteration-008.md:31`, `:33`). Both are absent from R1, and 002 REQ-009 records only the key.
2. A 10 s per-call wrapper timeout, and the caution that `JEV_TIMEOUT_MS` belongs to npm `jevctl` (`iteration-008.md:31`, `iteration-009.md:37`, `:88`). Omitted.
3. Option-text variants as an open variable (`iteration-002.md:87`). Omitted, and it bears on the kill radius.

For the R2 design:

4. "Two verdict vocabularies must be mapped" (`iteration-003.md:66`). research.md contradicts it at `:153` without discussing it. The contradiction is true only outside OpenCode.
5. The 1200-character evidence cap (`iteration-003.md:70`). research.md reduces it to "capped as the plugin already does". Neither saw the `...` interplay.
6. "Log once" on no key (`iteration-009.md:39`). research.md specified a line per verification. 003 later adopted DeepSeek's shape.

For the later items:

7. The reducer rejects unknown record fields, so R8 needs an explicit schema change (`iteration-004.md:62`).
8. Target the inert-novelty windows first (`iteration-004.md:82`).
9. Fan-out's cross-body blind spot (`iteration-005.md:70`).
10. Final adjudicated severity as gold (`iteration-005.md:32-39`). Unaddressed. It measures agreement with the reviewer, not truth, the trap MiMo-08 names at `:56`.

On tiers:

11. Level flags: DeepSeek said later (`iteration-006.md:52-61`), and the synthesis dropped them on the same evidence.
12. The D4 grader as an independent second build (`iteration-010.md:38-45`). Correctly held at later on MiMo-08's code correction.

**Fairness spot checks.**

- **MiMo-02** came through whole except its older top-3 ceiling (0.9026 on a 72-row holdout, `:20`), which bounds R1's headroom.
- **MiMo-08** lost its operator gold-sanity check (`:56`), and its garbled "flip rate above the 0.95 line" (`:27`) was carried as the coefficient.
- **Grok-08** came through whole.
- **Grok-10's** explicit tier for the routing arm, "next. Not build-now" (`:63`), is not surfaced. research.md's "all three, independent" is true for R1's shape only.

All three lineages lost something. DeepSeek lost more, but the seat read all ten of its iterations and only two each of the others, so the counts are not comparable one for one.

**Verdict impact.** No tier changes. Items 1, 3 and 6 change designs: R1's stability test and kill radius, and R2's failure path, which 003 has already fixed.

### 6. New material assessment

- **`check-goal.cjs`, Confirmed.** `CHECKS` holds exactly four structural checks: missing binding row, placeholder, criteria count and parent budget (`:44-49`, bodies at `:236`, `:288`, `:326-336`, `:338`). None reads a criterion's content. The rule exists as prose only (`sk-create-goal/SKILL.md:121-122`, repeated at `:106`), and the parent goal states the cost: "nothing dereferences a path" (`goal.md:99-101`). The lint belongs on the list:
  - **Tier:** later for the Jev arm, with a zero-call regex census first that may end the work (N1).
  - **Pool:** 1375 criteria across 307 non-archived goal files. 330 mention a path-like token and 44 use cross-reference phrasing (grep counts, a rough proxy).
- **jevcache.sh** (vendor claims, section 3 row new-a). The one legitimate use would be a local record-and-replay ledger that reproduces a finished R1 or R2 report without re-billing. That is not needed now. Drop.
- **classifier.dev** (vendor claims, row new-b). No recommended seam needs zero-shot HTTP classification that the pinned Python `jev-cli` 0.6.2 lacks. Vendor accuracy on news and emotion sets says nothing about these judgments. Drop.
- **fast-jev-compaction blog** (third-party summary of a README). It changes the compaction analysis.
  - This repository already sets `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` to `"1"` (`.claude/settings.json:38`, added 2026-09-19 in `beb1a0bcc64`), and no repository code registers a function hook yet (searched).
  - The vendored hook replaces `/compact` through `session.compact`, which the vendored type reference says can return its own messages and fire on a `precompute` trigger (`fast-jev.ts:1-10`, `claude-code.d.ts:3312-3322`, a vendor artifact written by Claude Code 2.1.274).
  - The deadline argument therefore does not bind that route, and the relevant comparison in the user report is 5.6 s against 44.8 s for an LLM summary.
  - The real blockers are no fidelity harness, whole-session egress and D5's refusal of the npm implementations. Result: R11 re-targeted as N2. The blog's separate Bash-output filter is dropped (row new-c).

### 7. New recommendations (0 to 4)

**N1. Goal-criterion self-containment check (advisory)**

- **Verdict:** later. A zero-call regex census comes first and may end the work.
- **What Jev judges:** a `noul` per criterion, "can a reader check this from its own text without opening another file", with the Python `jev-cli` 0.6.2. It is one lens and never gates anything.
- **Seam:** `check-goal.cjs:44-49` and the rule at `SKILL.md:121-122`. Proposed home: a new sibling script, not a fifth `CHECKS` entry, because check-goal is a completion gate (`goal.md:108`).
- **Value:** it catches criteria an evaluator cannot check, before the goal is set.
- **Metric, baseline and harness:** none exists. The operator labels 60 criteria stratified by the three grep strata. Score the regex arm at zero calls and the Jev arm on precision and recall against those labels.
- **Cost, latency and privacy:** authored repository text, low sensitivity. About 60 calls for the labeled set, cents at the vendor-claimed price (inferred arithmetic). No deadline applies.
- **Opt-in and no-key behavior under D5:** its own flag (`--jev`, proposed) plus the D5 gate. Keyless, it prints only the regex findings. It never changes check-goal's exit code.
- **Smallest slice:** the regex census plus the 60 labels, with zero calls.
- **Fitness checklist:**
  - Q1 fails until the labels exist, which is acceptable because the labels are slice 1.
  - Q3 is answered by the regex arm.
  - Q8 and Q11 pass by keeping it in a separate, advisory file.
  - The rest pass.

**N2. Compaction fidelity replay on the function-hook route (re-targets R11)**

- **Verdict:** later, with a zero-call baseline that decides whether any Jev arm gets built.
- **What Jev judges:** per old tool call, a pair of `noul` questions, keep the call and keep the result verbatim, in Python `jev run` batches. This ports the vendored mechanism.
- **Seam:** `.claude/settings.json:38` with the host's `session.compact` (vendored types `:3312-3322`). It is distinct from `compact-inject.ts:1-8` and the 3 s timeout at `settings.json:215-222`.
- **Value:** the operator's fourth idea in its literal form, with survivors kept verbatim.
- **Metric, baseline and harness:** must-survive fact recall at equal or smaller context. The baseline costs zero calls: score the summaries that earlier compactions already wrote into the operator's own transcripts.
- **Cost, latency and privacy:** the highest egress in this research. D5 requires redaction first, and the plugin's `redactEvidence` list is a starting layer. The `precompute` trigger should hide latency (inferred from vendor types).
- **Opt-in and no-key behavior under D5:** off by default, its own switch, dormant without the gate. On any failure it falls back to the built-in summary (vendored `plugin/hooks/README.md:47`).
- **Smallest slice:** 10 recorded sessions with 5 to 10 operator-authored facts each, zero calls, nothing leaving the machine. Stop if recall is at least 0.9 (proposed).
- **Fitness checklist:**
  - Q1 fails until the baseline exists, which is slice 1.
  - Q9 fails unless redaction and an enablement notice exist, which makes it acceptable only with both.
  - Q10 passes, since one switch reverts it.
  - Q12 passes only as a Python port.
  - Q14 is at risk, since the early-access host API may change.

### 8. Proposed phases after 002 and 003

1. **`002-advisor-jev-tiebreak-arm` (keep, modify).**
   - First slice: an alias-aware census over all gold rows, plus zero-call comparator arms.
   - Check: census counts per split, 53/70 under an env that includes `VITEST=true`, and one report line reading `keep`, `kill`, `inconclusive` or `underpowered` from the pre-registered sign test.
   - Amend REQ-008 to per-row agreement, REQ-009 to record probabilities, and REQ-012 to report the split without vetoing on it.
2. **`003-goal-verifier-jev-shadow` (keep, modify).**
   - First slice: a zero-call census of `lastVerifierReason` in the operator's goal state and archive. Then take rows as ingested, then add a tail-window heuristic arm.
   - Check: confusion tables for the heuristic, the tail-window heuristic and Jev on identical rows, with the truncation-error count printed.
   - Amend the keep test to run against the best free arm, and report the clamp defect as an adjacent finding.
3. **`004-goal-criterion-jev-lint` (add, later, proposed).**
   - First slice: the regex census plus 60 labels.
   - Check: regex precision and recall print, and check-goal's exit codes are unchanged.
4. **`005-compaction-fidelity-replay` (add, later, proposed).**
   - First slice: fact recall of existing summaries on 10 sessions, with zero calls.
   - Check: recall per session and a stop line at the threshold, with no network activity.

### 9. Re-synthesis

A targeted amendment is warranted rather than a full re-run. The tiers stand except R11's re-target, but 002 and 003 would inherit the flaws. Sections to change:

- **Section 1 and section 6, R11 and What Not To Build row 5:** the function-hook route and a corrected drop reason.
- **Section 4 item 5, R1's record, proof plan and kill criterion:** the decisive design from section 2, alias matching and the env.
- **Section 5 items 1, 5 and 7, and R2's record and proof plan:** the clamp defect, the free arm, ingestion-true rows, the reason census and the scope of "needs no mapping".
- **Section 3 item 1 and R7:** the `noop` default. **Section 9:** the rejected-key paths.
- **Section 10:** disagreement 3 (outcome rule) and disagreement 7 (level-flag reason). **What Not To Build:** notes on rows 1 and 7 plus three new rows.
- **Sections 12, 14, 15 and 17:** four open questions, the recount, the DeepSeek omissions, Grok's tier, D5 postdating the synthesis and the loss happening at lineage level.

### 10. Assumptions, evidence gaps and the alternative you challenged

- **Assumptions:**
  - D5's "no secret" is read both ways.
  - C-locale sort stands in for `localeCompare` in the slice-overlap count.
  - The seat's ERE mirror of the JS verdict regex matches its behavior.
  - The power figures are bounds until the census runs.
- **Gaps (UNKNOWN):**
  - the census counts
  - the live frequency of clamped evidence
  - whether Claude Code here is 2.1.274 or later, and the function-hook time budget
  - whether the scorer emits `command-memory-save` (the bridge files suggest it does)
  - Decider 1's identity
  - every jevcache and classifier.dev claim.

  The seat deliberately did not read the operator's goal state or transcripts.
- **Alternatives challenged:**
  - That an R1 loss is evidence at all: weakened by the power analysis.
  - That compaction dies on deadlines: overturned for the function-hook route.
  - Its own clamp finding: it may be deliberate ("ambiguous or mixed evidence always stays open", `:2198`). Even so, it produces a false `not_met` by construction for long completion messages, so a free arm must be tested before Jev gets any credit.
  - A jevcache-backed R3: rejected.

### 11. Confidence

74.

- **High confidence:** the code facts, because every line the seat relied on was reopened.
- **Medium confidence:** the power bounds (they depend on unknown census counts) and the clamp's real-world impact (its frequency is unknown).
- **Low confidence:** everything from vendors.
- **Shared blind spot:** all three seats run on Claude Opus 5.5, so this reading is one lens. The power analysis and the tier calls are the parts most exposed to that.

### 12. Evidence ledger

- **Synthesis and packet:**
  - `research.md:39-45`, `:126-136`, `:153-159`, `:171-177`, `:341-351`, `:380-430`, `:706-746`, `:1043-1049`, `:1133`
  - `goal.md:55`, `:99-101`, `:108`, `:142`
  - 002 `spec.md:111-127` and `:131-133`, `plan.md:63-64` and `:77`
  - 003 `spec.md:80-93`, `:119-135`, `:144`, `:162-166`
  - digests: `repo-rules-digest.md:52-87`, `measurement-digest.md:27-32` and `:128-139`, `jev-material-digest.md:20` and `:30`
- **Advisor:**
  - `score-outcome-rerank.mjs:17-23`, `:40-51`, `:58-81`, `:85-133`, `:149-159`: split, exact matching, arms, flip rule
  - `ambiguity.ts:7-58`: cluster rule
  - `fusion.ts:749-789` (adjusted-score sort, then ambiguity) and `:862-887` (passing-only list)
  - `scorer-eval-baseline.json:3-35`
  - `capture-scorer-eval-baseline.mjs:35-46` (`VITEST` at `:43`), `:70-76` (alias match), `:94-99` (unknown and false-fire counting)
  - `derive-ambiguity-slice.mjs:11-19`, `:35-36`, `:51`, `:62-66`, `:76`
  - `aliases.ts:5-19`
  - corpora 195/18, 70/6 and 24/5, sha256 matching the pins, 11 negative margins
  - `benchmark-stability.cjs:20-28`, `:86-109` (sample sd)
  - `user-prompt-submit.ts:20-26`, `:103-126`
- **Goal:**
  - `opencode-goal.js`:
    - config and verdicts: `:36-49`, `:71-72`, `:134-136`, `:179`, `:226-234`, `:249-302`
    - clamping and redaction: `:382-389`, `:414-420`, `:452-476`
    - logging and evidence intake: `:869-878`, `:1091-1119`, `:1264-1266`
    - verification path: `:2197-2241`, `:2308-2459`, `:2636-2700`
    - idle handling and test exports: `:3257-3288`, `:3359-3385`
  - `.skilled/plugins` symlink
  - `goal-core.cjs:60-66`, `:128-133`, `:580-620`
  - `completion-evidence-sentinel.cjs:58-95`, `:111-120`
- **Compaction and hooks:**
  - `.claude/settings.json:21-22`, `:34`, `:38`, `:193`, `:215-222`, plus the full hook table
  - `compact-inject.ts:1-10`, `shared.ts:10-17`
  - vendored `fast-jev.ts:1-30` and `:70-100`, `plugin/hooks/README.md:1-60`, `claude-code.d.ts:3312-3326` and `:10300-10340`
  - Blog `:1-105`
- **cli-jev:**
  - `cli-usage/SKILL.md:94-104`, `:160-176`
  - `providers-and-models.md:56-64`, `:142-150`, `:164-168`
  - `cli-reference.md:26-30`
- **Goal authoring:**
  - `check-goal.cjs:1-80`, `:236`, `:288`, `:326-356`
  - `sk-create-goal/SKILL.md:105-135`
  - criteria census (307, 1375, 330, 44)
- **Other seams:**
  - `reviewer-scorer.cjs:115-124` and the four reviewer fixtures
  - 409 registries recounted
  - `reply-harness/README.md:3`, `:20`
  - `score-model-variant.cjs:20-21`, `:207-226`, `:253`, and `run-benchmark.cjs:435`, `:577`
  - `convergence.cjs:480-486`, `stopping-clock-shadow.ts:10-19`, `reduce-state.cjs:960-992`
  - `deep-research-confirm.yaml:1316-1322`, `completion-criteria.md:61-63`, `:75`
  - `router.cjs:199-205`, `alignment-validator.ts:73-75`, `next-focus-selection.ts:351-356`, `fanout-merge.cjs:341`, `:348-351`
  - `recommend-level.sh:15-50`, `:100-112`
  - deep-ai-council `convergence-signals.md:50-64`, archived `routing-baseline.json:44-56`
  - vendored `recipes.md:5-11`, `hypotheses.ts:41-45`
  - Pi post `:229-233`, `:1119-1123`
  - `external websites/jevcache.md:1`, `classifier dev.md:1`
- **Lineages:**
  - DeepSeek iterations 001 to 010 in full, MiMo-02 and MiMo-08, Grok-08 and Grok-10
  - merged registry (85: 8, 22 and 55), DeepSeek's lineage registry (8) and its state counts (57)
  - `fail_open` at 2504 ms in the deepseek and mimo logs, none in grok's
  - 12 `novelty_signal_inert` files and 181 lineage directories with deltas
