---
title: "Deep Research: cli-and-deep-loop across the Skilled v4 release line"
description: "Ranked, cited findings for the CLI executors, the cli hubs and the deep-loop runtime across v4.0.0.0 to v4.0.2.0, from 26 generation-2 iterations plus 2 generation-1 iterations, with orchestrator severity corrections applied."
trigger_phrases:
  - "cli and deep loop v4 research findings"
importance_tier: "important"
contextType: "research"
---
# Deep Research: cli-and-deep-loop across the Skilled v4 release line

Spec: `specs/system-speckit/runtime-and-release/004-v4-release-line-research/003-cli-and-deep-loop` | Session: `2026-11-08T20:14:35.000Z` (generation 2, parent generation 1 archived at `research_archive/20261108T201434Z`) | Stop: depth rule cleared at iteration 26 (three consecutive iterations, 24 to 26, with no new verified P0 or P1), after reopens to ceilings of 20, 25 and 30; 26 iteration rows in generation 2; generation 1 held 2 productive rows and 1 `error` row

---

## 1. Executive Summary

The cluster works on the paths people use most, but the single-executor half of `/deep:research` and `/deep:review` has drifted away from the fan-out runner that owns the same contract in code. The worst defect is observed, not inferred: the single-executor `cli-opencode` branch passes `--pure`, which the installed OpenCode v2.2.5 rejects, so that branch fails every dispatch. The other strong defects also sit in the deep YAMLs: an executor kind the runtime admits (`cli-deepseek-harness`) has no dispatch branch, the branch selector reads `config.executor.type` while the config and runtime write `kind`, three dispatch ids use an unbound `{generation}` token, and the `cli-opencode` branch hardcodes the binary and passes the OpenCode-1-only `--pure` flag. The stop rule (`stopPolicy`, `minIterations`) has no code owner on the single-executor path, so it lives in YAML prose. Write containment snapshots the whole repository, so concurrent sibling runs quarantine each other's files, which this run observed directly. In confirm mode the lock is refreshed only before the operator gates, so a long wait at a gate lets another run reclaim the packet. The reducer counts state rows, not iterations, so a redispatch inflates the count. A review never reports release readiness, because the placeholder that would carry it is bound nowhere. The Pi classifier route never runs because it pins an exact Pi version that is no longer installed. Over-engineering is concentrated in the dark `branch-leases-waves` module (3,117 non-test lines with no runtime importer) and the unreachable `if_cli_copilot` branches.

Every finding below carries the orchestrator's verdict. Three executor-claimed P0s were downgraded to P1 because a careful executor can still work around them; a fourth (`--pure`) was downgraded while its harm was inferred and restored to P0 once the orchestrator observed it. One earlier P1 (the council having no dispatch runtime) was falsified by the reopened run.

---

## 2. Research Question and Scope

Read-only research over `.skilled/skills/cli-external-orchestration/**`, `.skilled/skills/cli-classifier/**`, `.skilled/skills/system-deep-loop/**` and `.skilled/commands/deep/**`, against every release note from v4.0.0.0 to v4.0.2.0 in `.skilled/changelog/skilled/`. Seven finding types were in scope: drift, misalignment, bug, improvement, UX, over-engineering and extension. Nothing outside this research folder was to be written.

---

## 3. Methodology

The run executed `deep-research-auto.yaml` one `phase_loop` pass at a time (ADR-001 in `decision-record.md`), so the orchestrator could read each iteration, open at least two of its citations and set the next focus before the next prompt render. Generation 1 ran on `cli-devin` `deepseek-v4-1-flash-max` until the Devin daily quota ran out at iteration 3. `cli-deepseek-harness` could not dispatch through the workflow (finding B1), so the run restarted as generation 2 on `cli-pi` `opencode-go/deepseek-v4.1-flash` with thinking at max. The depth checkpoint after iteration 10 extended the run to 15 because v4.0.0.14 and v4.0.0.15 were unread and P1s were still arriving. Iteration 15 re-verified every prior P1 at its cited line. The lead then reopened the run under the depth rule (D-13): iterations 16 to 20 settled the findings that rested on executor evidence alone and read the confirm-mode YAMLs, the council runtime and the per-executor hard rules. Iterations 21 to 26 read ground no earlier pass had touched: the cli-classifier and Jev transport, the review and council YAML pairs, reducer and gateway edge cases, the deep-review runtime, the /deep command docs and the remaining cli-external-orchestration packets.

---

## 4. Strongest Findings

| # | Finding | Type | Sev | Evidence the orchestrator opened | Release |
|---|---------|------|-----|----------------------------------|---------|
| 0 | The single-executor `cli-opencode` branch passes `--pure` in both auto YAMLs and both confirm YAMLs; OpenCode v2.2.5 rejects it, so every dispatch on that branch fails | bug | P0 | `deep-research-auto.yaml:1619`, `deep-review-auto.yaml:1547`; ran `opencode run --pure ...` from a temp dir: `Unrecognized flag: --pure in command opencode run`; without the flag: `PONG` | v4.0.0.13 |
| 1 | `cli-deepseek-harness` is an admitted executor kind with no `if_cli_deepseek_harness` branch; the shared builder throws `cli-deepseek-harness requires a lineage directory` when the single-executor path calls it | bug | P1 | `deep-research-auto.yaml:1579` (six `if_cli_*` keys, no default); `fanout-run.cjs:3002`; reproduced the throw with `buildLineageCommand(...{env,cwd})` | v4.0.2.0 |
| 2 | Branch gates read `config.executor.type` while the config template and the runtime reader use `kind` | drift | P1 | `deep-research-auto.yaml:1198`, `:1204`, `:1248`; `executor-config.ts` `normalizeExecutorConfigInput` treats `type` as a deprecated alias | v4.0.0.3 |
| 3 | Write containment snapshots `git status` over the whole repository, so a sibling run's write lands in this run's quarantine | bug | P1 | `write-containment.ts:1133-1143`; `cli-classifier.zip` appears in the quarantine manifests of children 001, 003 and 005 | v4.0.0.16 |
| 4 | v4.0.0.8 says every script refuses unknown options; 7 of 27 deep-loop scripts do, and the append gateway accepts any `--key` | drift | P1 | `v4.0.0.8.md:69`; `append-mode-event.cjs:58-72`; `status.cjs --bogus-flag` returns `Unknown option`; `grep -l` count 7 of 27 | v4.0.0.8 |
| 5 | `minIterations` and the single-executor `stopPolicy` have no code owner; `convergence.cjs` has zero references | misalignment | P1 | `rg -c 'stopPolicy\|minIterations' convergence.cjs` printed 0; `fanout-run.cjs` owns `stopPolicy` for fan-out only | v4.0.0.3 |

---

## 5. Bugs

- **B1, P1.** No single-executor branch for `cli-deepseek-harness` (Strongest 1). A run configured with that kind matches no `if_cli_*` branch and has no default, so it dispatches nothing. Verify: `rg -n "if_cli_" .skilled/commands/deep/assets/deep-research-auto.yaml`.
- **B2, P1 (claimed P0).** Three dispatch ids use bare `{generation}` (`deep-research-auto.yaml:1327`, `:1428`, `:1530`) while the rest of the file uses `{config.lineage.generation}` (`:1253`, `:1816`). `{generation}` is bound only at `:329`. Downgraded: a careful runner can still bind it.
- **B3, P0 (observed).** The `if_cli_opencode` branch passes `--pure` unconditionally (`deep-research-auto.yaml:1619`; review at `deep-review-auto.yaml:1547`; both confirm YAMLs carry the same argv) and hardcodes `command: 'opencode'` while `fanout-run.cjs:2391` resolves the binary. On OpenCode v2.2.5, `opencode run --pure` fails with `Unrecognized flag: --pure in command opencode run`. The model placeholder is unguarded at `:1600`, unlike `if_cli_codex`.
- **B4, P2 (claimed P1, earlier claim falsified).** The council does have a dispatch runtime: `orchestrate-session.cjs:359` defines `dispatchSeat` and `:791` injects it. What remains is that `executor.mode` (`external-cli`) is inert: only `compile-command-contracts.cjs:110` names it, and seats always run through `runSeatSubprocess`.
- **B5, P1.** A fan-out launched with `stopPolicy=max-iterations` and no per-lineage cap fails every lineage only after it has run (`findMaxIterationsPolicyViolation` in `fanout-run.cjs`).
- **B6, P2 (claimed P1).** `deep-review-auto.yaml:208` and `:231` pass the raw review focus into a double-quoted shell argument before `step_normalize_review_focus` (`:486`) runs. A newline inside double quotes is legal shell and `fanout-run.cjs:163` normalizes, so harm needs an unescaped quote the YAML already says to escape.
- **B7, P2.** `package_skill.py --strict` without `--check` packages instead of validating and writes `<skill>.zip` into the working directory. This run reproduced it by accident (decision D-08).
- **B8, P2.** The fan-out builder enforces 12 of the 13 dsh hard rules; `no-repo-root-dotenv` has no check (`hard-rules.json`, cwd set from `options.lineageDir`). The same class recurs for other executors: `cli-codex/SKILL.md:165` says always pass `service_tier="fast"`, but `fanout-run.cjs:2335-2337` adds it only when the config sets it; `cli-devin/SKILL.md:243` requires `--` before every print-mode prompt, but `fanout-run.cjs:2807` builds `[-p, prompt, --model, model]`; the warn-level claude-code permission rule is neither enforced nor reported.
- **B9, P1.** In confirm mode the only lock refresh (`deep-research-confirm.yaml:633`) runs before the operator gates (`gate_pre_iteration` at `:1109`), and a transient lock expires after twice its 30-minute TTL (`loop-lock.ts:640`). An operator who waits past 60 minutes at a gate lets another run reclaim the packet while the first is live.
- **B11, P1.** The Pi classifier route pins `PI_PACKAGE_VERSION = '0.99.2'` (`jev-transport.mjs:36`) and compares it exactly (`:374`); the installed Pi is 1.5.0, so the documented Pi-first route never runs and the fallback to the `jev` CLI is silent.
- **B12, P1.** `deep-review-auto.yaml:2490` passes `{release_readiness_state}` to the closeout, but nothing in the file binds it, and the config writes `releaseReadinessState: "in-progress"` once (`:541`), so a review never reports readiness.
- **B13, P1.** `deep-ai-council-confirm.yaml` has no `post_dispatch_validate` block, while the auto twin has one, so confirm-mode council rounds run unvalidated.
- **B14, P1.** The reducer counts iteration rows, not iterations (`reduce-state.cjs:2610`), and takes the last appended row as the latest (`:2520`). A redispatch leaves two rows; the sibling 004 run showed 22 rows for 20 iterations, with numbers skipping 16 and 20.
- **B15, P1.** Delta corruption is fail-open (`reduce-state.cjs:1656-1663` warns and pads with null rows), while state-log corruption fails closed with exit 2.
- **B16, P1 (executor evidence only).** The review YAML carries two restart implementations, and the live one (`deep-review-auto.yaml:186`) loses lineage bookkeeping.
- **B10, P2.** A council seat that times out rejects with a bare `Error` (`orchestrate-session.cjs:318`) and drops its captured stdout and stderr, which the non-zero-exit path keeps.

---

## 6. Drift between notes, code and docs

- **D1, P1 (claimed P0).** The canonical state-log row keeps 7 fields (`type`, `iteration`, `run`, `status`, `newInfoRatio`, `ruledOut`, `timestamp`) of the 14-field record the leaf contract requires, so `focus`, `mode` and `answeredQuestions` vanish. Observed: every generation-2 row reads `"focus":"undefined"`, and the strategy left three answered questions unticked.
- **D2, P1.** The gateway refresh drops writer rows: after four iterations the state log held one `containment_contested` row, one `containment_violation` row and no `iteration_start` rows.
- **D3, P1.** v4.0.0.8 unknown-option claim (Strongest 4).
- **D4, P2.** `executor-config.ts:250` still justifies the `glm-5.3-flash` fan-out slot by flat-price billing that `v4.0.0.0.md:226` retracts.
- **D5, P2.** `cli-pi/references/cli-reference.md:201` cites `fanout-run.cjs:2390` for the 20 MB stdout cap; that line is now inside `buildNativeLineageCommand`.
- **D6, P2.** `cli-external-orchestration/ROUTER.md` is 1.7.11.0 against 1.8.0.0 everywhere else; `cli-classifier/ROUTER.md` is 0.8.5.0 against 0.8.9.0. The doctor excludes ROUTER.md from the comparison, so `version:` means two things.
- **D7, P2.** v4.0.1.0 says SKILL.md links ROUTER.md in one line; the cluster SKILL.md files reference it 13, 8 and 7 times.
- **D8, P2.** v4.0.0.0 rosters drifted: 21 Cursor ids became 29 (`executor-config.ts:353`), six Pi ids became ten (`:222`), and the "seven bridges" line names Hermes, which v4.0.2.0 removed.
- **D9, P2.** The largest v4.0.0.15 change in the cluster, the fanout-stress playbook restructure, is absent from the note.
- **D10, P2.** The dsh packet allows a lineage cwd inside the repository while the v4.0.2.0 note says every dsh command starts outside it; the combined patch-existence error does not name the missing file; the note says three patches while the builder can add five.
- **D12, P2.** Council `deep-mode.md` attributes four stop reasons to `evaluateCouncilCostGuards`, which emits three of them plus an undocumented `two_consecutive_stable_rounds`; `execution_provenance.effective.model` is hardcoded null.
- **D13, P2.** Iterations 1 to 16 cited the auto YAMLs under the skill's `assets/` folder; they live only at `.skilled/commands/deep/assets/`. This synthesis uses the real path.
- **D14, P2.** Documented controls nothing reads: `--lineage-timeout-hours` (`research.md:117`, parsed at `fanout-run.cjs:3330`, passed by none of the six YAMLs), the council `mode` input (`deep-ai-council-auto.yaml:25`), and the Jev switches `JEV_FEATURE_VERDICT_FALLBACK` and `JEV_FEATURE_HALLUCINATION_GRADER` (`v4.0.0.3.md:251`, defined nowhere).
- **D15, P2.** Review docs and reducer disagree: `REQUIRED_DIMENSIONS` is hardcoded (`reduce-state.cjs:21`), the contract's FAIL-on-gate rule is never read, `findingsSummary` semantics differ from `state-jsonl.md`, and `deep-review/SKILL.md:287` names a script that does not exist. The deep-loop ROUTER.md is 1.6.7.0 against 1.6.23.0, and the alias registry trails the router.
- **D16, P2.** The cursor read-only isolation (`fanout-run.cjs:2678-2687`) is undocumented, and the doc's read-only example omits the mandatory `--trust`; OpenCode's `--standalone` requirement and the flash-max effort pin are documented inconsistently.
- **D11, P2.** The transient-lock note at `deep-research-auto.yaml:288` promises reclaim when the owner is known dead, but `loop-lock.ts:641` sets `ownerDead=false` for every transient holder, and the acquire steps (`:286`, review `:322`) omit `--owner-pid` on purpose. A crashed run blocks the packet for up to two lock TTLs.

---

## 7. Misalignment with sk-code, sk-doc and Skilled canon

- **M1, P1.** `minIterations` and single-executor `stopPolicy` have no code owner (Strongest 5). The ledger schema marks `deep_research.min_iterations_guard_pass` reserved because no workflow stages it.
- **M2, P1.** Three advertised Jev phrases appear twice each in both ROUTER.md files and zero times in `cli-classifier/hub-router.json`, so stage-one routing cannot reach them. `defaultMode: null` is documented fail-closed design, not a defect.
- **M3, P1.** Hub intent vocabulary exists as three unjoined copies (ROUTER.md INTENT_SIGNALS, `hub-router.json` vocabularyClasses, `mode-registry.json` aliases), and `advisor_recommend` on "opencode go route this task" ranks `sk-code` (0.7833) over `cli-external-orchestration` (0.3161).
- **M4, P1.** Persona injection contradicts itself: `cli-external-orchestration/SKILL.md:189` and `:217` require the resolved persona on every dispatch, and the prompt-pack template carries only the route line.
- **M5, P1.** The leaf tool-call budget is a static line (`prompt-pack-iteration.md.tmpl:36`) duplicated in two docs, while `config.maxToolCallsPerIteration` exists and is never rendered.
- **M6, P2.** Documented convergence math (three-signal model) and the implemented composite (`convergence.cjs:329`) disagree, and the feature catalog's Implementation table lists only markdown.

---

## 8. Operator and AI-user friction

- **U1, P1.** An executor quota error is recorded as a canonical `error` iteration that counts toward `maxIterations`. Observed in generation 1: Devin `resource_exhausted` consumed iteration 3.
- **U2, P1.** The state summary's focus line has no producer (`last_focus` at `deep-research-auto.yaml:619`), so every prompt in this run said the focus was undefined.
- **U3, P2.** A ~100-line dispatch body is copied into the cursor, devin and pi branches with the comment that they have no branch of their own.
- **U4, P2.** Review-focus errors name the internal `reviewFocus` field, not the `--review-focus` flag (`fanout-run.cjs:161`, `:168`).
- **U5, P2.** For typed `/deep:research :auto` and `/deep:review :auto` prompts the advisor's top result returns `compiledRoute.action=defer` with no targets.
- **U6, P2.** Release tags point at generated-artifact chore commits, so `git diff <tag>^..<tag>` over cluster paths shows 0 files for v4.0.0.4, v4.0.0.5 and v4.0.0.12. Anyone auditing a release by tag sees nothing (kept P1 in the iteration as an inferred method trap; recorded here as P2 because no tool depends on it).
- **U7, P2.** `summarizeSnapshots` returns only counts, so a failed fan-out cannot quote why in the aggregate.
- **U8, P2.** The council's `stability_score` is a divergence (0 means converged) that reads like a quality score; and a failed single-executor dispatch cannot be attributed to a branch because `dispatchId` does not name it.

---

## 9. Over-engineering to cut

- **O1, P1.** `runtime/lib/branch-leases-waves` has 3,117 non-test lines and only two type-only importers (`substrate-ports.ts:10`, `conditional-fanin/types.ts:19`). Its suite tests dead code.
- **O2, P1.** `if_cli_copilot` exists at `deep-review-auto.yaml:1239`, `deep-review-confirm.yaml:1317` and `deep-research-confirm.yaml:1190`, but no `EXECUTOR_KINDS` member can select it.
- **O3, P2.** The review-focus normalization contract is implemented three times (`deep-review-presentation.txt:69`, `deep-review-auto.yaml:486`, `fanout-run.cjs:161`).
- **O4, P2.** `orchestration-status.log` is a strict subset of `observability-events.jsonl`.
- **O5, P2.** Idea-lifecycle events map to no-op reducers (`deep-research-reducer.ts:151-158`).
- **O7, P2.** `two_consecutive_stable_rounds` is unreachable: no production caller passes `consecutiveStableRounds` (computed only in `adjudicator-verdict-scoring.cjs:167-176`). The dispatch rules exist three times (`hard-rules.json`, SKILL.md prose, builder branches) with no parity check.
- **O8, P2.** `runtime/lib/deep-review-reducers` is 3,281 lines with no importer outside itself and a second severity model the live reducer never reads; `which()` is copied into two Jev modules.
- **O6, P2.** The 28-entry Cursor roster exists twice, byte-identical (`executor-config.ts:353`, `fanout-run.cjs:2562`), and the DSH roster is split the same way.

---

## 10. Improvements

- **I1.** Add a shared `parseArgs(argv, {allowed})` in `runtime/lib` that emits the documented JSON error and exit code, and adopt it in the 20 hand-rolled scripts.
- **I2.** Pass `--config-json` to `convergence.cjs` and emit `minIterationsNotReached` and `stopPolicySuppressed` from code.
- **I3.** Scope the containment baseline to paths a lane could plausibly own, or record the sibling run ids active at snapshot time, so concurrent runs stop quarantining each other.
- **I4.** Render `config.maxToolCallsPerIteration` into the prompt pack instead of the static line.

---

## 11. Extension opportunities

- **E1.** Export one argv builder (binary resolution plus per-kind assembly) from `fanout-run.cjs` and have every single-executor branch consume it; this closes B1, B2, B3 and U3 together.
- **E2.** A typed `executor_switch` event with a per-kind fallback list, so a quota error migrates the run instead of burning an iteration and forcing a generation restart.
- **E3.** A static contract test over every `if_*` executor branch that extracts each `config.executor.*` path from `skip_when`, `branch_on` and the dispatch facts and asserts it exists in the executor schema; it would have caught Strongest 2. The confirm YAMLs' `confirm_parity` block could be enforced the same way.

---

## 12. Recommendations

1. Remove `--pure` from every `if_cli_opencode` branch now (B3, P0), then fix B1, B2 and B3's binary resolution through E1: they are the defects every single-executor run crosses.
2. Rename the YAML gates to `config.executor.kind` (Strongest 2) in the same change.
3. Scope write containment (I3) before running sibling loops in parallel again.
4. Give `convergence.cjs` the stop rule (I2) and stop counting quota errors as iterations (U1, E2).
5. Delete `branch-leases-waves` and the `if_cli_copilot` branches (O1, O2), or wire them to a caller.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| "No code component owns the stop policy" | False for fan-out: `fanout-run.cjs` validates and passes `stopPolicy` | `normalizeStopPolicy` in `fanout-run.cjs` | 3, corrected in 4 |
| "`defaultMode: null` is a misconfiguration" | Documented fail-closed design | `cli-classifier/hub-router.json:5`, `:27-31` | 5 |
| "Mode `aliases` are dead code" | `executor-delegation.ts:212` reads them | `executor-delegation.ts:212`, `:357` | 6 |
| Cutting the divergent pivot and the legacy projection | Both are live, with 26 production import sites for the pivot | iteration 7 import scan | 7 |
| "Sibling writes appear as contested" | Contested needs a dirty baseline; a clean-at-baseline path is a plain violation | `isContested` in `write-containment.ts` | 4, 15 |
| Transient lock as an accidental omission | Deliberate: `loop-lock.cjs:183-186` marks owner-less locks transient | `loop-lock.cjs:183-186` | 15 |
| "The council external-cli mode has no dispatch runtime" | `dispatchSeat` is defined and injected | `orchestrate-session.cjs:359`, `:791` | 10, falsified in 16 |
| `cli-deepseek-harness` as the first fallback executor | The single-executor builder throws without a lineage directory | `fanout-run.cjs:3002` | generation 1 iteration 3 |

---

## Divergence Map

No divergent pivots ran: the registry records 0 completed pivots, 0 failed pivots and 0 audited overrides. Breadth came from orchestrator steering by release instead. Saturated: the single-executor YAML branches (iterations 1, 8, 9, 10, 15) and convergence (3, 4). Remaining frontier: the confirm-mode YAMLs, which were read only for the copilot branch, and the ai-council runtime beyond dispatch.

---

## 13. Open Questions

- Does any supported environment still run OpenCode 1, where `--pure` is valid? If none does, B3 has no safe configuration.
- Two strategy questions were investigated but stayed unticked, because the state log drops `answeredQuestions` (D1).

---

## 14. Release Coverage

| Release | Read in | Finding types found |
|---------|---------|---------------------|
| v4.0.0.0 | g2 1, 13 | drift (D4, D8), UX |
| v4.0.0.1 | g2 12 | verified, no defect (keyword removed, rosters clean) |
| v4.0.0.2 | g2 8, 9 | improvement (O6, Cursor roster duplication) |
| v4.0.0.3 | g2 3, 9, 10 | bug (B3), misalignment (M1, M4), UX |
| v4.0.0.4 | g2 14 | no cluster claim; tag trap (U6) |
| v4.0.0.5 | g2 14 | no cluster claim; tag trap (U6) |
| v4.0.0.6, v4.0.0.7 | g2 1, 2 | drift (retired-packet fixture paths, stamp check), over-engineering |
| v4.0.0.8 | g2 12 | drift (D3), improvement (I1) |
| v4.0.0.9 | g2 12 | drift (D6), hub integrity verified clean |
| v4.0.0.10, v4.0.0.11 | g2 12 | no cluster claim |
| v4.0.0.12 | g2 14 | no cluster claim; tag trap (U6) |
| v4.0.0.13 | g1 2, g2 8 | bug (B3 binary resolution) |
| v4.0.0.14 | g2 11 | bug (B6), over-engineering (O3), UX (U4) |
| v4.0.0.15 | g2 11 | drift (D9), UX (U5), advisor claim verified |
| v4.0.0.16 | g2 1, 4, 9, 13 | bug (3 in section 4), UX (U3), lane resume verified |
| v4.0.1.0 | g2 5, 14 | misalignment (M2), drift (D7), hub canon PASS |
| v4.0.2.0 | g1 1, 2, g2 1 | bug (B1, B8), drift (D10) |
| Confirm-mode YAMLs | g2 18 | bug (B9), drift (B3 and Strongest 2 repeated) |
| Council runtime | g2 16, 19 | bug (B10), drift (D12), over-engineering (O7), UX (U8) |
| Per-executor hard rules | g2 20 | drift (B8 extension) |
| cli-classifier and Jev transport | g2 21 | bug (B11), drift (D14), over-engineering (O8) |
| Review and council YAML pairs | g2 22 | drift (B12, B13, B16) |
| Reducer and gateway edge cases | g2 23 | bug (B14, B15) |
| deep-review runtime | g2 24 | drift (D15), over-engineering (O8) |
| /deep command docs, deep-loop hub | g2 25 | drift (D14, D15) |
| cli-external-orchestration packets | g2 26 | drift (D16) |

---

## 15. Verification Log

The orchestrator opened at least two citations per iteration; the full per-iteration record is the Steering Log in `decision-record.md`. Commands run by the orchestrator, with their output:

- `node status.cjs --bogus-flag` printed `{"status":"error","error":"Unknown option: --bogus-flag","code":"INPUT_VALIDATION"}`.
- `grep -l -i "unknown option" runtime/scripts/*.cjs | wc -l` printed 7, against 27 scripts.
- `sed -n '1133,1143p' write-containment.ts` shows `readStatusEntries({ repoRoot })` filtered only by artifact containment.
- `buildLineageCommand` called with `{ env, cwd }` for `cli-deepseek-harness` threw `cli-deepseek-harness requires a lineage directory`.
- `opencode run --pure --model opencode-go/deepseek-v4.1-flash 'Reply with exactly: PONG'` from a scratchpad temp dir printed `ERROR Unrecognized flag: --pure in command opencode run`; the same call without `--pure` printed `PONG` (OpenCode v2.2.5).
- `pi --version` printed 1.5.0 against `PI_PACKAGE_VERSION = '0.99.2'` at `jev-transport.mjs:36`.
- `grep -n release_readiness_state deep-review-auto.yaml` found only `:2490`; `grep -c post_dispatch_validate` printed 1 for the council auto YAML and 0 for its confirm twin.
- `sed -n '313,320p' orchestrate-session.cjs` shows the bare timeout `Error`; `deep-research-confirm.yaml` has one `loop-lock.cjs refresh` at `:633`.

---

## 16. Convergence Report

- Stop reason: depth rule cleared (lead's rule: three consecutive iterations with no new verified P0 or P1)
- Total iterations: 26 (generation 2), plus 3 generation-1 rows archived
- Questions answered: 9 / 11
- Remaining questions: 2 (investigated, unticked; see section 13)
- Last 3 iteration summaries: run 24: deep-review runtime (0.62); run 25: /deep command docs and hub routing (0.58); run 26: cli-external-orchestration packets (0.54)
- Depth rule score at close: 3 of 3 clean (24, 25, 26); the last new verified P1s came at iteration 23
- Convergence threshold: 0.05 (telemetry only under `--stop-policy=max-iterations`)
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

---

Late P1 claims in the last three iterations, by id, with the outcome `decision-record.md` records for each:

| Finding | Iteration | Outcome |
|---------|-----------|---------|
| f-iter024-001 | 24 | Narrowed to P2, folded into D15: the review YAML admits only the four canonical dimensions |
| f-iter024-002 | 24 | Falsified as P1: `state-format.md` names `resolvedFindings`; kept as a P2 gap in `state-jsonl.md` |
| f-iter025-002 | 25 | Confirmed and graded P2, folded into D14 with the other documented-but-inert controls |
| f-iter026-003 | 26 | Graded P2, folded into D16: the isolation is intended, only the docs omit it |

## 17. References

- Iterations: `research/iterations/iteration-001.md` to `iteration-026.md`; generation 1 under `research_archive/20261108T201434Z/iterations/`.
- Registry: `research/findings-registry.json`; deltas: `research/deltas/`.
- Decisions, executor switches and the steering log: `decision-record.md`.
