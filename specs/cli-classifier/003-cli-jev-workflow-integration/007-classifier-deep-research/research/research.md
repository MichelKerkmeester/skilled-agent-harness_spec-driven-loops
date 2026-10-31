---
title: "Deep Research Round 3: Classifier Models, Jev Hosted and Deem Local [cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research]"
description: "Round 3 synthesis of five non-Claude lineages over the round-2 synthesis. R1's zero-call census stays the first build. Deem joins as a local second backend behind a pinned health check, and cli-deem is a small Node client in a new cli-classifier hub. No round-1 or round-2 drop flips on a free local model alone."
trigger_phrases:
  - "classifier round 3 synthesis"
  - "deem local backend verdict"
  - "cli-deem client shape"
  - "cli-classifier hub phases"
  - "two-backend gate deem jev"
importance_tier: "important"
contextType: "research"
---

# Deep Research Round 3: Classifier Models, Jev Hosted and Deem Local

Final synthesis of round 3 for `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`, written on 2026-09-27 by a fresh Opus 5.5 max leaf (phase `goal.md:54`, D7). It extends the round-2 synthesis at `../004-deep-research-expansion/research/research.md` (BASE2 below) and the round-1 re-synthesis at `../001-deep-research/research/research.md` (BASE1 below). It never silently overrides either: the section after section 1 lists every change against BASE2.

Conventions used throughout:
- Every `jev` is the Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps, unless the sentence names the npm `jevctl` 0.2.3 vendored under `../context/external repo's/jev-cli-main`. Their exit codes disagree, so no sentence here mixes them.
- "Deem" is the served `LibertAIDAI/deem-0.8-v1` in bf16, unless the sentence names the 9B.
- D1 to D3 are the parent's decisions (`../goal.md:49-51`). D1 is the two-backend gate, which BASE2 called D5.
- Names marked "proposed" do not exist yet.
- Each load-bearing claim carries one mark: confirmed (from code or a count run for this file), inferred (with what would confirm it), lineage-reported (a lineage's count not rerun here) or UNKNOWN.
- Prices, latencies and accuracy figures from READMEs, model cards, websites and posts are vendor claims or user reports. None was reproduced here.

## Table of Contents

1. Executive Summary
   - Changes From the Round-2 Synthesis
2. Scope, Method and Inputs
3. A: Deem on this Mac and `cli-deem`
4. B: The drops that flip
5. C: Context reduction
6. D: Validators
7. E: sk-prompt
8. F: sk-design
9. G: Open discovery
10. H: Order, savings, cost and kill criteria
11. Cross-Lineage Agreement
12. Recommendations
   - What Not To Build
   - Divergence Map
13. Open Questions
14. Proposed Build Phases
15. Citation Verification Ledger
16. Evidence Quality and Caveats
17. References
18. Convergence Report

---

## 1. Executive Summary

- **Start with R1's zero-call census in `002-advisor-jev-tiebreak-arm`, unchanged.** It needs no backend, no key and no label, and its power line says before any call whether any classifier can earn a `keep` on the advisor's near-ties.
- **Deem is a second, local backend, not yet a proven one.** The served 0.8B answers a warm call in about 60 to 80 ms on synthetic input, deterministically, with nothing leaving the machine. It is uncalibrated and unmeasured on this repository, and its first accuracy number costs about 12 s: R21's 195 Gate 3 labels, run under `--deem`.
- **The wire is settled from code, so `cli-deem` is a small Node client (new R23), not a wrapper or a translator.** Deem answers `jev-cli`'s `choice` and `score` with HTTP 400 and names its answer fields differently. The client opens a new `cli-classifier` hub (phase 008), and `cli-jev` moves in later (phase 009).
- **No drop flips on a free local model alone.** None of the 72 rows rests on cost or quota, and every later item still waits on gold, a seam or a reader. Only row 1 reopens, to later, as R3's live Deem form.
- **Verdicts:** 2 build-now, 4 next, 18 later and 1 drop, with R11 folded and 4 new ids (R23 to R26). Phases 002, 003, 005 and 006 take Deem as a second backend with its own switch and health check.

---

## Changes From the Round-2 Synthesis

BASE2 is `../004-deep-research-expansion/research/research.md`. Every row below rests on code or a count reopened for this file, or says lineage-reported. Section 15 holds the citation results.

### Changed verdicts, ranks and phases

| # | Item | Old state | New state | Reason | Evidence |
|---|---|---|---|---|---|
| V1 | Verdict counts | 2 build-now, 3 next, 15 later, R14 dropped, R11 folded. What Not To Build: 64 drop rows and 8 dead ends | 2 build-now, 4 next, 18 later, R14 dropped, R11 folded. What Not To Build: 99 drop rows and 11 dead ends | R23 joins at next, R24 to R26 at later, rows 73 to 110 are added | This section |
| V2 | R21, the Gate 3 calibration | next, conditional on `underpowered`, Jev only, rank 5 | next, rank 5. The Deem half runs on every `--deem` run. The Jev half stays conditional | A Deem pass needs no key, sends nothing off the machine and takes about 12 s, and the Gate 3 labels are the only labeled set that can measure Deem today | 195 labels, 127 `yes` and 68 `no` (BASE2). `deem-local.md:34-38`. 002 `spec.md:143` |
| V3 | R23, the `cli-deem` client and the `cli-classifier` hub | Absent | next, new, rank 4 | D2 requires the hub and the transport, and the wire rules out a wrapper | Section 3. `../goal.md:50` |
| V4 | R20, the goal-criteria lint | Rank 4, next | Rank 6, still next | R23 and R21 need no operator labor, while R20 waits on a rubric and about 100 labels | Section 10 |
| V5 | R24 citation-drift scan, R25 stage-2 leaf replay, R26 validator-residue flagger | Absent | later, new, ranks 22 to 24 | Each fails Q1 or has no named reader today | Sections 6 and 9 |
| V6 | Phases 002, 003, 005 and 006 | Gated on Jev alone | Two-backend text, line by line. All four amended | D1 | Section 14 |
| V7 | New build phases | None past 006 | `008-cli-classifier-hub` (the hub minted with `cli-deem`) and `009-cli-jev-hub-move` (the move, gated on a kept Deem result) | D2. The move touches 81 files under the hub and 48 files that name it | Section 14. Counted today |
| V8 | Build order | Censuses, 002's arm, the rubric and 006, 003's arms, later arms | Censuses, then 008, then 002's `--deem` arm with R21, then 002's `--jev` arm, then the rubric and 006, then 003's arms, then 009, later arms last | A Deem number needs only the client | Section 10 |
| V9 | What Not To Build | Rows 1 to 72 | Rows 73 to 110 added. Row 1 reopens to later. Row 25 changes by D2. Rows 5, 27, 29, 30, 38, 40, 42, 68, 69 and 72 gain Deem evidence | Section 4 | What Not To Build |
| V10 | Open questions | 38 | 52. Questions 2, 3, 13, 17, 24 and 30 change status, question 31 is resolved and questions 39 to 52 are new | Section 13 | Section 13 |

### Changed records

| # | Record | Old state | New state | Reason | Evidence |
|---|---|---|---|---|---|
| C1 | The shared gate contract | Three Jev checks | Two halves. The Jev half is BASE2's, with `--provider P` on every check and call as D1 now states. The Deem half is `cli-deem health` (proposed): a pinned `/health` check within 2,000 ms offline or 500 ms in a hook. No feature starts the server | D1 | deepseek-01 (N-deepseek-01-1 to -3), deepseek-02 (N-deepseek-02-2), deepseek-04's allowlist. `deem_server.py:137-154`, `:772-777`, `:1000` |
| C2 | Deem records | None | Every Deem record carries the backend, the model id, the model commit and the source commit | The model id is a launch label that survives an update, so only the commit pair names the weights | `deem-ctl:28`, `:119`, `:101-103`, `:151`. glm-01 (N-glm-01-2), deepseek-02 (N-deepseek-02-3) |
| C3 | Requalification | None | A keep holds only for the commit pair it was measured on. After a change, the keep rule reruns in full on the same harness. A change is not a kill. A failed requalification goes to `deem-ctl rollback`, which holds the release | D3 keeps Deem current, and an update can land every six hours | `deem-ctl:145-202`, `:206-225`. glm-01, deepseek-02 |
| C4 | Stability clauses (BASE2 C1, C20 and C24, 002 REQ-008, 003 REQ-006 (d), 006 REQ-013) | 3 reruns, aggregate flip rate at most 0.10 | Jev unchanged. A Deem `choice` uses 3 option orders with the order-flip rate at most 0.10. A Deem `noul` or `score` has no rerun clause, and its stability is the commit pair | Deem returned the same answer in 40 of 40 repeats | `deem-local.md:90`. deepseek-05 (N-deepseek-05-1) |
| C5 | R1 arms | `--jev` only | `--jev` and `--deem` (proposed), each its own column and verdict. The Deem arm asks at most 25 cluster keys plus `none` and prints larger clusters as unmeasured | The torch backend reads at most 26 letters | `deem_server.py:166`, `:222-230`. glm-01 (N-glm-01-1), glm-02 (N-glm-02-2) |
| C6 | Backend comparison (R1 and R21) | None | Only on identical decided rows, with a one-sided confidence bound on the paired gap, over 265 distinct corpus rows | About 137 rows per arm resolve a 0.10 gap (lineage-reported), so R1's rows cannot compare backends and R21's can | mimo-03 (N-mimo-03-1), the mimo lead's correction |
| C7 | R21's Deem half | None | One pass of 195 `noul` calls printing accuracy, F1, Brier score, a 5-bin ECE and a fitted temperature beside 0.9843. No threshold is set on raw Deem probabilities before it runs | The served model runs at temperature 1.0 | `deem-local.md:27`. grok-01 (N-grok-01-2), mimo-03 |
| C8 | Kill lines | The Jev family | Adds `deem arm skipped: <check>`, `deem arm stopped: server gone` and `deem arm stopped: model commit changed mid-run` (proposed) | An update restarts the server and can land mid-run | `deem-ctl:175-190`. deepseek-08 (N-deepseek-08-2), deepseek-09 (N-deepseek-09-1) |
| C9 | R19's later arm | Jev, behind redaction cases and the operator's payload acceptance | Deem preferred. For Deem the redaction and payload preconditions drop, batches cap at 32 calls (64 questions) and a latency and context check at fitted-state size comes first | Nothing leaves the machine, and the server refuses more than 64 questions | `deem_server.py:656-659`, `:995-997`. grok-04 (N-grok-04-2), swe-04 (N-swe-04-1) |
| C10 | R2's later arm and shadow mode | Jev only | Deem preferred. For Deem the redaction and 002-latency preconditions drop, and the tail-window gate and the rows stay. The shadow value names its backend, `jev` or `deem` (proposed) | The payload is the operator's conversation | grok-04 (N-grok-04-2), deepseek-10 (N-deepseek-10-1) |
| C11 | R3's promote condition | R1 prints `keep`, and a p95 with the spawn included fits the advisor budget | R1 prints `keep` on the backend the live form uses, and a health-plus-call p95 measured inside the advisor child fits the budget. A live form never starts the server and skips on a refused connection | The advisor child is already a Node process, so the added cost is the connection and the call | `user-prompt-submit.ts:109-117`, `deem-local.md:81-87`. deepseek-04 (N-deepseek-04-3), deepseek-05 |
| C12 | R20's later arm | Jev | Either backend, Deem preferred. The lexical lint itself never takes a classifier | The lint's value is that it is deterministic | deepseek-10, F5 |
| C13 | R22 | later, with drafts as a privacy concern | later. With Deem nothing leaves the machine, so the draft note drops. Q1 still fails | No labels | `hvr_scan.py:17-21` |
| C14 | Payload notice | Payload class, planned calls, estimated input tokens | For a Deem arm: "nothing leaves the machine", planned calls and an estimated wall time at the measured p50 | Deem has no charge and no egress | `deem-local.md:34-38` |
| C15 | 002's Out of Scope line on a shared helper | A shared Jev client helper | A shared Jev or Deem client library. Scripts spawn `jev` and `cli-deem` as binaries, so the binary is the shared piece | BASE1 row 27 | 002 `spec.md:97`. glm-05 (its row 78) |

### Corrected claims

| # | Where | Claim | Correction | Evidence |
|---|---|---|---|---|
| K1 | grok-03, and the swe lead's DEFECT line | The vendored compaction fails open at `compact.ts:284-285`: a missing batch answer keeps the call and its result | Refuted. Every candidate lands in a batch or `batchCalls` throws (`compact.ts:76-100`), and `askBatch` reads each answer through `noulAnswer`, which throws on a missing one (`compact.ts:120-135`, `request.ts:69-83`). The default reaches only pinned calls, which keep anyway (`compact.ts:110`). BASE2 section 4 stands | Reopened today |
| K2 | grok-10 | D3 vetoes any new classifier phase | D3 limits this round to research plus serving Deem. D2 still requires the hub and `cli-deem` as Planned phases | Orchestrator correction. `../goal.md:50-51` |
| K3 | mimo-06 | The sk-design router is a keyword scorer | sk-design routes through compiled routing, default-on. Rule 6 at `sk-design/SKILL.md:202-203` is stale | Orchestrator's live route. `resolve.cjs:36-44`, serving manifest `:12` |
| K4 | mimo-01 | Tool-call, Read and re-read counts for Q2 to Q4 | Void. The dedupe rule in the angles file (ALL-7) was an incomplete rule, misapplied to content blocks. Token usage stands. mimo-02's recount replaces the void counts | Orchestrator correction. mimo lead, review of iteration 1 |
| K5 | glm-04, and glm-05's row 82 | The sk-prompt selection matrix is deterministic today | It takes two judged inputs: a complexity from 1 to 10 in overlapping ranges and a primary need. The drop stands on no gold and low use | `sk-prompt/SKILL.md:307-315` |
| K6 | glm-05's row 86 | Voice and placeholder flags recur 9 and 8 times a week | Corpus-lifetime counts, not weekly. The drop stands | mimo-02, lineage-reported |
| K7 | mimo-04, mimo-07 and mimo-09 | The stage-2 replay saves about 6.3 MB a week | It saves `ROUTER.md` reads: 68,335 plus 613,586 bytes over 40 days, about 119 KB a week. The chosen leaves still load | mimo lead's correction on `results-mimo-04-buckets.txt:47`, `:55`, lineage-reported |
| K8 | mimo-03, mimo-09 and mimo-10 | 289 comparison rows | 265 distinct rows: all 24 ambiguity prompts sit inside `labeled-prompts.jsonl` | mimo lead's `comm`, lineage-reported |
| K9 | mimo-08 and mimo-09 | The validator-residue population is empty | A path artifact: edit paths are absolute and folder tokens relative. 193 passing invocations are followed by edits elsewhere | mimo lead's correction, lineage-reported |
| K10 | swe-06 | 456 `file:line` citations in skill docs | 403 by swe-06's own pattern, rerun today. A path-aware pattern finds 500 | Section 6 |
| K11 | glm-02 | The hub adds one routing hop and 10 to 12 KB | That assumed a nested hub, which the rule against a second skill-shaped `graph-metadata.json` forbids. As modes of one hub, the hop count does not change (my reading) | `parent-skill-check.cjs:268-275`, `skill-hub-routing.md:51` |
| K12 | deepseek-07 | 53 files move and 39 files reference `cli-jev` | 81 files sit under the hub, 59 of them in `cli-usage`. 48 files outside `specs/` name `cli-jev`, plus the compiled route map | Counted today. `compiled-route.cjs:35` |
| K13 | grok-08 (N-grok-08-2) | Print the flip rate of 3 reruns of one fixed `choice` before any Deem threshold | Void. Reruns of one input measure nothing on a deterministic server | `deem-local.md:90` |
| K14 | The grok lead's steer | The md-generator `isPass` rule sits at `validate.ts:466-479` | No 80-point rule exists in the code. `isValidationPass` passes on zero hard failures (`validate.ts:699-701`, exit at `:765`). The 80-point rule lives only in the docs, a doc and code mismatch for the owner | `quality-checklist.md:29`, `:476-477`, `SKILL.md:309` |
| K15 | deepseek-01 (N-deepseek-01-1) | Deem passes when `backend` is present and not `stub` | An allowlist: `torch`, or a name starting `ensemble:` that contains no `stub`, as `deem-ctl` checks | `deem-ctl:64-70`. deepseek-02, deepseek-04 |
| K16 | BASE2 | The key gate is D5 | The parent renumbered its decisions. The two-backend gate is D1, and D1 now names the provider | `../goal.md:49`, `:130` |

### Handed-over questions

| Question | Status | Evidence | What remains |
|---|---|---|---|
| 3, per-call latency | Partly answered for Deem: p50 60.2 to 65.6 ms and p95 62.8 to 80.0 ms with one client on synthetic input, and a p95 of 281.3 ms with four clients | `deem-local.md:34-38`, `:85-87` | Jev latency, and Deem at real payload sizes (questions 41 and 42) |
| 13, provider and model per call | Answered for Deem: each answer names the launch label (`deem_server.py:894`) and the commit pair comes from disk. Open for Jev | Section 3 | Jev, at build time |
| 17, redaction | Open for Jev egress. It is not a precondition for any Deem arm | C9, C10 | Unchanged for Jev |
| 24, can a deletion pass fit | Open, now with the 64-question cap for a Deem arm | `deem_server.py:995-997` | R19's census |
| 30, cross-family corroboration | Partly resolved further | Section 11 | An operator read |
| 31, the provider in check 3 | Resolved by the operator: D1 names the provider | `../goal.md:49`, `:130` | None |

Everything not listed in this section is unchanged from BASE2. That covers the records of R3 to R18 apart from the notes in section 12 and BASE2's open questions not named above. It also covers What Not To Build rows 2 to 4, 6 to 24, 26, 28, 31 to 37, 39, 41, 43 to 67, 70 and 71.

---

## 2. Scope, Method and Inputs

**Scope.** Questions A to H in the `Research Brief` section of `spec.md` (`spec.md:104-126`), under the parent's D1 to D3 (`../goal.md:49-51`). Round 3 asks where a classifier model, Jev hosted or Deem local, cuts the main AI's context and manual review work.

**Lineages.** Durations come from the runner's own `completed` events in `research/observability-events.jsonl`, never from lineage timestamps. All five started at 06:27:32Z to 06:27:33Z by the runner's clock.

| Label | Model and effort | Executor | Lens | Iterations | Runner duration | Runner events |
|---|---|---|---|---|---|---|
| `grok` | `grok-4.7-xhigh-fast`, no effort tier (Grok 4.7 lists no MAX tier) | cli-cursor | Outside patterns and the vendored material | 10 | 949,076 ms (15.8 min), done 06:43:21Z | `timestamp_anomaly`: 10 anomalous and 1 untimestamped of 12 state records |
| `deepseek` | `deepseek-v4.1-flash`, max | cli-pi (`llmgateway`) | Seams, gating and failure paths | 10 | 1,675,845 ms (27.9 min), done 06:55:28Z | None |
| `mimo` | `mimo-v2.6-pro`, high | cli-pi (`llmgateway`) | UX and measurement | 10 | 4,482,080 ms (74.7 min), done 07:42:14Z | One `stall_detected` at 06:33:02Z. One `timestamp_anomaly` (1 of 12) |
| `swe` | `swe-2-max` | cli-devin | Code-level slice design | 10 | 3,389,670 ms (56.5 min), done 07:24:02Z | None |
| `glm` | `glm-5.3-flash`, max | cli-pi (`llmgateway`) | The contrarian | 5 | 3,244,855 ms (54.1 min), done 07:21:38Z | One `stall_detected` at 06:33:03Z |

**Run configuration.** `research/deep-research-config.json`: 10 iterations per lineage (glm 5), stop policy `max-iterations`, `convergenceMode` off and concurrency 5. The run launched at 2026-09-27T06:27:32Z from HEAD `506e4e6430`, with the preparation committed in `525ec8244a` and `506e4e6430`. All 45 iteration files exist, and every lineage's state log ends with `stopReason` `maxIterationsReached`. The runner logged 241 events: 5 `started`, 225 `progress`, 2 `stall_detected` (300 s quiet warnings, each followed by completion), 2 `timestamp_anomaly`, 5 `completed` and 2 `metadata_refresh_ok`. None is a containment event, and `orchestration-summary.json` records 5 of 5 succeeded with `completed_with_containment_advisory` at 0.

**Waves** (`context/research-angles.md:131-768`):
- **W1, independent:** iterations 1 to 3 of grok, deepseek, mimo and swe, plus glm-01. Each declares that it read no round-3 sibling file.
- **W2, cross-read:** iterations 4 to 6, plus glm-02 and glm-03.
- **W3, new skills and workflows:** iterations 7 and 8, plus glm-04.
- **W4, order and kills:** iterations 9 and 10, plus glm-05.
- The speeds differed by a factor of almost five. grok finished before most W2 files existed, so grok-04 to grok-06 saw only deepseek-01 or deepseek-02, and grok-07 to grok-10 saw deepseek-02 or -03 and swe-01. The slower lineages read grok-10 and deepseek-10 as the newest files for most of their run. Section 11 names each sibling read.

**Leads and steering.** One Opus 5.5 high lead per lineage reviewed each iteration and wrote only its own `steer.md`. Reads the leads confirmed: grok 7 and 8, deepseek 4, 7 and 8, mimo 2 to 5 and 8 (the file's opening or a copy older than the newest review), glm 4 (it printed "no `steer.md`" but followed it) and swe none. My own reading adds grok 9 and 10, which say "`steer.md` was read" (`grok/iterations/iteration-009.md:17`, `iteration-010.md:15`). mimo 6, 7, 9 and 10 say "`steer.md` unchanged", which fits an older copy. I treat them as unsteered except where they follow a named point. glm-05 says no `steer.md` ever landed while it ran (`glm/iterations/iteration-005.md:12`), which contradicts its lead's report for glm-04. I count glm-04 as steered, as the brief says.

**Deem as measured.** Model commit `8cbabbb`, source commit `6755b30`, unchanged during the run (`deem-local.md:71`, `:77`). `~/.local/share/deem/models/` lists only `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21` and `current` today (listed, read-only). No `previous` or `held` file exists, so a rollback would exit 2 today (`deem-ctl:207`).

**What I read.** All 45 iteration files, the five lineage `research.md` files and all five `steer.md` files in full. The merged state: `findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json`, `orchestration-status.log`, `observability-events.jsonl` and the config. Each lineage's state log, registry, strategy and decoded audit and effect ledgers. This phase's `spec.md`, `plan.md`, `goal.md`, `context/research-angles.md` and `context/deem-local.md`. BASE2 in full, and BASE1's section 9 and What Not To Build. The fitness checklist (`../001-deep-research/context/repo-rules-digest.md:52-108`). The Deem server, its MCP server and its primitives under `context/deem-main/`. `deem-ctl` in both versions: the pre-run copy the lineages cited (`deem-ctl.prefix`, 208 lines) and the live file (250 lines). The vendored Python `jev-cli` source, the transport skill and the four Planned phase specs. Every code file in section 15.

**What I verified, and how.**
- Every `file:line` under a build-now or next recommendation was reopened, and R24's counts were rerun (section 15). R25's and R26's seams rest on lineage counts, marked lineage-reported in their records.
- Counts were rerun read-only with `rg`, `find` and `node -e` one-liners that print numbers only. No file was written besides this one:
  - the 77 N ids across the 45 iteration files
  - the `cli-jev` footprint: files under the hub, under `cli-usage` and outside `specs/` that name it
  - the load-bearing reason of every What Not To Build row, by a grep for cost, quota, price and charge terms
  - `file:line` citations in skill docs, by swe-06's pattern and by a path-aware pattern with resolution
  - the lineage audit and effect ledgers, base64-decoded and searched for advisory, containment and violation markers
  - the sk-prompt framework registry and the byte sizes of `SKILL.md` and `patterns-evaluation.md`
  - Jev, Deem, `cli-classifier` and `cli-deem` mentions in the four Planned phases
  - the lineage directories and logs, searched for calls to port 8300 and for `jev` invocations
- The orchestrator's corrections were applied over any lineage or lead: the ALL-7 dedupe rule, compiled sk-design routing, D3 not vetoing `cli-deem`, Deem's determinism, the post-run measurements, the changed `deem-ctl`, the launch facts and glm's self-edits of its iterations 2 and 3.

**Not run.** No `jev` of either package, not even `--version`. No call to the Deem server, its MCP server or `deem-ctl`: all three were read and never run. No `.env` file was opened. No `validate.sh`, `generate-context.js`, test suite or install. No git write. No transcript recount: mimo's transcript figures are lineage-reported, spot-read in its results files. No hook was timed. No compiled route was replayed: the sk-design route is the orchestrator's live check.

**Deviations, recorded.**
- **Gate 5.** The repository's `AGENTS.md` makes loading the rule files of `REPO RULES.md` a hard block before a first write, while the brief said "Load nothing else". I loaded the nine rule files its trigger table names for this write, reads only. I did not load the Human Voice Rules, which the prose rule reaches through sk-doc, because the brief routed this artifact away from sk-doc.
- **No scratch file.** BASE2 wrote five count scripts. Every count here ran as a one-liner.

---

## 3. A: Deem on this Mac and `cli-deem`

### Serving

| Item | Value | Source |
|---|---|---|
| Model | `LibertAIDAI/deem-0.8-v1`, Hugging Face commit `8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21`, root `model.safetensors`, 1.4 GB | `deem-local.md:20` |
| Precision | bf16 | `deem-local.md:21` |
| Server | Deem's Python server, source commit `6755b30bf6bbd9a81f8db6ba42cc0fd62c9f4719` | `deem-local.md:22` |
| Device | `mps`, set by hand because the server's `auto` picks only `cuda` or `cpu` | `deem-local.md:24` |
| Endpoint | `127.0.0.1:8300`: `POST /v1/systemone`, `GET /health`, `GET /v1/models` | `deem-local.md:25`, `deem_server.py:845-860`, `:866-904` |
| Model id | `deem-0.8-v1`, a launch label set by `deem-ctl`. The server's own default is `deem-1.5` | `deem-ctl:28`, `:119`, `deem_server.py:107`, `:929-931` |
| Calibration | None loaded, so every answer reports temperature 1.0 | `deem-local.md:27`, `deem_server.py:486-489` |
| Location | `~/.local/share/deem/`, 2.1 GB, nothing in any repository or on `PATH` | `deem-local.md:28` |
| Exposure | No authentication and `Access-Control-Allow-Origin: *`. Localhost only, but any page in the operator's browser can send requests. It exposes compute, not data | `deem_server.py:809`, `:837`, `deem-local.md:73` |

### Measured speed and memory

Measured by the orchestrator on synthetic inputs, one question per request. Confirmed as recorded, not rerun here.

| Measurement | p50 | p95 | Source |
|---|---|---|---|
| `choice`, 2 options, 1 client | 60.3 ms | 78.5 ms | `deem-local.md:36` |
| `score`, 3 levels | 60.2 ms | 64.5 ms | `deem-local.md:37` |
| `noul` | 60.5 ms | 62.8 ms | `deem-local.md:38` |
| `GET /health` and parse, inside a running process | 0.4 ms | 0.9 ms | `deem-local.md:81` |
| Fresh `node` process, spawn only | 26.0 ms | 30.8 ms | `deem-local.md:82` |
| Fresh `node` process, spawn plus `/health` fetch | 46.0 ms | 47.4 ms | `deem-local.md:83` |
| `choice`, 1 client, after the run | 65.6 ms | 80.0 ms | `deem-local.md:85` |
| `choice`, 2 concurrent clients | 119.9 ms | 144.2 ms | `deem-local.md:86` |
| `choice`, 4 concurrent clients | 245.5 ms | 281.3 ms | `deem-local.md:87` |
| `DEEM_N_ORDERS` 1, 2 and 4, 2 options | 60.2, 94.3 and 166.5 ms | not given | `deem-local.md:93-97` |

- **Memory.** Resident set 814 MB, physical footprint 3,368 MB with MPS memory included, about 10 s from start to healthy (`deem-local.md:42-44`). The footprint stays resident while the server runs, which is the operator's call (question 45).
- **One request at a time.** The server holds one lock around inference (`deem_server.py:201`, `:236`), so throughput stays at 14.9 to 16.1 requests per second from one to four clients (`deem-local.md:85-89`). An offline batch that holds the server delays any live call behind it. A live form therefore needs a short client timeout and skips when it expires (inferred design rule, confirmed by nothing yet).
- **Deterministic.** The same request returned the same answer in 40 of 40 repeats at every setting (`deem-local.md:90`). A flip test must change the input, the option order or the model commit.
- **Option orders.** `DEEM_N_ORDERS` is server-wide (`deem_server.py:985`), permutes `choice` questions only (`:660-666`) and costs 1.6 to 2.8 times the latency. `score` and `noul` have no order dimension. A caller that wants order averaging sends its own permuted requests (row 102).
- **Caps.** At most 26 options on the torch backend, refused with HTTP 400 `unsupported_option_count` (`deem_server.py:166`, `:222-230`). At most 64 questions per request by default (`:656-659`, `:995-997`). Bodies up to 8 MiB (`:109`). The 0.8B's context limit is UNKNOWN: no measurement used a long state (question 41).

### The 0.8B against the 9B, from published numbers

Every figure here is a vendor claim. Deem's card reports 96.3% long-policy hold-out accuracy for the 0.8B and gives no JevBench score for it (`deem-local.md:52`). glm-05 quotes a Tare figure of 0.6788, a different kind of number (lineage-reported). Nobody serves the 9B, and the operator chose the 0.8B for RAM, about 1.6 GB against 18 to 20 GB (`../goal.md:131`). How the two compare on this repository's judgments is UNKNOWN, because nothing here ran either on its labels. grok-01's case for reopening the 9B drops (row 107).

### Accuracy against Jev, as designed

No accuracy number exists for either backend here. The design, from mimo-03 with its lead's corrections:
1. Both backends answer the same rows, and only rows both decided enter the comparison (C6).
2. The deciding line is a one-sided confidence bound on the paired gap, never the observed gap.
3. The corpus has 265 distinct rows, not 289 (K8).
4. About 137 rows per arm resolve a 0.10 accuracy gap and about 431 a 0.05 gap (`results-mimo-03-power.txt`, lineage-reported). R21's 195 labels can therefore resolve about a 0.10 gap, and R1's decided rows, bounded at 55 movable, cannot compare backends at all.
5. Deem runs first, because it is free and local. Jev runs only with a key and the D1 checks.
6. Calibration comes before any threshold. With 195 rows, a 5-bin ECE (about 100 rows) and a single temperature fit (about 50 rows) are feasible (`results-mimo-03-power.txt`, lineage-reported).

### The wire, settled from code

The orchestrator saw Deem's server answer the System One shape, and Deem's docstring calls it a drop-in for `typesafe-sdk` (`deem_server.py:2-6`). The Python `jev-cli` reaches it unchanged for `noul` and `run` only. Confirmed from both sides of the code:

| Surface | What `jev-cli` sends or reads | What Deem expects or returns | Result |
|---|---|---|---|
| `noul` request | `type` and `instructions`, no `criteria` (`__init__.py:364-369`) | a `NoulQuestion` from `instructions` (`deem_server.py:546-547`) | Reaches Deem unchanged |
| `choice` request | the options as `criteria`, a KEY to DESCRIPTION object (`__init__.py:378`, `:367-368`) | an `options` list (`deem_server.py:534-540`) | HTTP 400, which `jev` maps to exit 1 (`__init__.py:295-296`) |
| `score` request | the levels as `criteria`, a list (`__init__.py:378`) | a `levels` list (`deem_server.py:541-545`) | HTTP 400, exit 1 |
| `run` | the request file passes through, with `model` added (`__init__.py:373-376`) | Deem-shaped questions | Works when the file is written in Deem's shape |
| `noul` answer | `--value` reads `answer["noul"]` (`__init__.py:389-393`) | `value` (`deem_server.py:618`) | `--value` raises a `KeyError` and exits 1 (`__init__.py:438-440`). Plain JSON carries `value`, so a reader expecting `noul` breaks |
| `choice` answer | `choice` | `choice` (`deem_server.py:598`) | Matches |
| `score` answer | `score` | `level` (`deem_server.py:606`) | `--value` exits 1 |
| Credential | `--provider custom` needs `JEV_API_KEY` or exits 3, and always sends a bearer (`__init__.py:18-39`, `:90-109`, `:280`) | No authentication (`deem_server.py:866-904`) | A placeholder key works in a script. On an agent's command line the dispatch guard refuses an inline `JEV_API_KEY=` (`dispatch-rule-checks.mjs:114`, `:287-290`) |
| Endpoint | `--provider custom` without an endpoint exits 2 (`__init__.py:253-265`) | `/v1/systemone` | The guard also requires one (`dispatch-rule-checks.mjs:280-284`) |
| Stopped or loading server | a connection error maps to exit 4 (`__init__.py:298-299`) | the port is bound only after the model loads (`deem_server.py:962-1000`) | Exit 4, so a loading server looks absent |
| Over 26 options, over 64 questions | not checked by `jev` | HTTP 400 (`deem_server.py:222-230`, `:656-659`) | Exit 1 |

Four lineages settled the wire the same way from code: grok-02, swe-01 and glm-01 in W1, then deepseek-06 in W2 from its own read. The orchestrator's inferred gap is confirmed.

### The Deem check, the second half of D1

Adopted from deepseek-01 (N-deepseek-01-1 to -3), amended by deepseek-02 (N-deepseek-02-2) and the allowlist in deepseek-04, with the model pin kept:

```text
Deem is available for this run when all hold:
  GET http://127.0.0.1:8300/health answers HTTP 200 within 2,000 ms (offline) or 500 ms (hook)
  the body is a JSON object with status "ok"
  backend is "torch", or starts with "ensemble:" and contains no "stub"
  model is "deem-0.8-v1"
Then record the commit pair:
  model commit  = basename of readlink ~/.local/share/deem/models/current
  source commit = git -C ~/.local/share/deem/src rev-parse HEAD
Never start the server from a feature or a hook.
```

- **Why each clause.** The stub answers `status` `ok` with uniform logits and a `noul` of 0.5 for everything (`deem_server.py:137-154`, `:978-983`). Without the backend clause a feature would read the stub's 0.5 as a judgment, which is BASE1 row 9's default score. `deem-ctl`'s own check refuses the stub but pins no model (`deem-ctl:64-70`). The pin catches a server launched without `DEEM_MODEL_ID`, which reports `deem-1.5` (`deem_server.py:107`), and a foreign server on the port.
- **Budgets hold with room.** An in-process parse costs 0.4 ms p50 and a fresh spawn plus fetch 46.0 ms p50 (`deem-local.md:81-83`), against 2,000 ms and 500 ms (derived).
- **A cold server is refused, not awaited.** The server binds its port only after the weights load (`deem_server.py:1000`), so for about 10 s after a start the check sees a refused connection and the feature skips (confirmed from code, deepseek-01 F6).

### The lifecycle, from the live `deem-ctl`

| Action | What it does | Exit | Lines |
|---|---|---|---|
| `start` | Launches the server with the resolved `models/current` checkpoint, `DEEM_DEVICE=mps`, the pinned model id and `HF_HUB_OFFLINE=1`, then waits up to 120 s for the stub-refusing health check | 0, or 4 | `deem-ctl:109-125`, `:72-81` |
| `stop` | Kills the recorded pid and removes the pid file, without waiting for the process to exit | 0 | `deem-ctl:127-132` |
| `status` | Health, then the short model and source commits | 0 | `deem-ctl:236-243` |
| `update [--check]` | Compares the Hugging Face and GitHub heads with the local ones, skips a held release, downloads beside the live one, stops, switches, then proves the new version with a start and one real `choice` even when the server was stopped | 0, 2, 3 or 4 | `deem-ctl:145-182` |
| update failure | Restores the previous version and exits 3, or exits 4 when the restored version does not start | 3, 4 | `deem-ctl:183-189` |
| update success | Stops again if it was stopped, records the previous version, clears the hold, keeps only the live and previous models | 0 | `deem-ctl:190-201` |
| `rollback` | Needs a previous version on disk, switches back, holds the rejected release, removes the previous record, restarts if it was running | 0, 2 or 4 | `deem-ctl:206-225` |
| Schedule | `com.skilled.deem-update` runs `deem-ctl update` every 21,600 s and at login | none | the plist, read-only |

The lineages cited the pre-run copy, which updated unproven while the server was stopped (prefix `:160-173`), swallowed a failed restore (prefix `:171`) and had no rollback. The live file closes all three (`deem-local.md:101-109`). One small risk remains: `stop` does not wait for exit, so a stop followed at once by a start could race on the port (inferred from `deem-ctl:127-132`, confirmed by nothing).

### How a measured keep survives an update

1. Every Deem record carries the model id and the commit pair (C2). The id alone never counts as provenance, because an update keeps it (`deem-ctl:28`).
2. A keep holds for the pair it was measured on (C3).
3. When the pair changes, the feature's keep rule reruns in full on the same harness before any served or later use. A change is not a kill.
4. A run that sees the pair change mid-run stops with `deem arm stopped: model commit changed mid-run` (proposed), and its finished rows print as `partial`.
5. A release that passes the smoke decision but answers worse fails its requalification, and the operator runs `deem-ctl rollback`, which holds that release until a newer one lands (`deem-ctl:204-225`).

### Verdict: a client, not a wrapper or a translator

| Route | What it is | Verdict | Why |
|---|---|---|---|
| Wrapper | `jev --provider custom --endpoint http://127.0.0.1:8300/v1/systemone` with a placeholder key (N-swe-01-2) | Drop (row 75) | It cannot serve `choice` or `score`, it changes the answer fields, it pays key ceremony for an authless server and the dispatch guard refuses its inline key |
| Translator | A patched wheel, a JSON-rewriting proxy or a `deem` branch in `provider_request` (N-swe-01-3, N-grok-02-1) | Drop (row 76) | A fork of a pinned package that its next upgrade overwrites, or a second daemon for four field renames |
| Client | A Node standard-library client, `cli-deem` (N-swe-01-1, N-deepseek-06-1, N-grok-07-1) | Build, as R23 | It posts Deem's own shape and emits `jev-cli`'s answer shape |

The client's contract, all names proposed:
- **One file**, `cli-deem.mjs`, with no dependency (Q12). swe-01 estimates about 170 LOC (lineage estimate).
- **Subcommands** `health`, `noul`, `choice`, `score` and `run`, with `jev`-like flags: `-q`, `-s` (stdin when absent), `-o KEY=DESCRIPTION`, `-l DESCRIPTION` and `--value`.
- **Requests in Deem's shape.** `choice` sends the descriptions as the `options` list and maps the chosen string back to its key, refusing duplicate descriptions. `score` sends `levels`.
- **Answers in `jev-cli`'s shape.** `value` becomes `noul`, `level` becomes `score` and `choice` becomes the key. The probabilities are rekeyed too. Readers written for `jev` output work unchanged.
- **Caps before sending.** More than 26 options, or more than 64 questions in a `run` request, exits 2 with a named message.
- **No key.** No bearer, no `--provider`.
- **Exit codes that mirror `jev-cli`.** 0 success. 1 an unexpected response or HTTP 400. 2 a usage or config error. 3 a refused backend: the stub, or a model id other than `deem-0.8-v1` in the health body or in an answer's `model` field (`deem_server.py:894`). 4 unreachable, a timeout or a 5xx. 130 interrupted.
- **`health`** applies the Deem check and prints the backend, the model id and the commit pair.

---

## 4. B: The drops that flip

**Verdict: nothing flips on the backend alone.** Deem removes cost, quota and egress, and it shrinks a warm call's latency to about 60 to 80 ms. No What Not To Build row rests on cost or quota: a grep of rows 1 to 72 for cost, quota, price, charge and billing terms finds only a red-flag phrase in rows 1 and 64, "a tax on every turn" in row 7 and row 52, which forbids printing a dollar figure (confirmed, rerun today). Every later item waits on gold, a seam or a reader. One row reopens: row 1, to later, as R3's live Deem form.

**How to read the table.** The reason column names the load-bearing reason: cost, quota, latency, egress, no gold, authority (Q8, Q11), no seam or no reader. "Method" marks a row that drops a way of measuring rather than a feature, where no backend applies. A row whose reason includes no gold, authority or no seam never flips on the backend alone. The Deem column says whether a local Deem removes the reason, keeps it or leaves it unknown.

### BASE1 rows 1 to 43

| Row | Idea | Load-bearing reason | Deem | New verdict |
|---|---|---|---|---|
| 1 | A live call in the advisor prompt hook | Latency (the 2,500 ms kill), plus the revival rule's need for R1's `keep` | Removes the latency for a warm server: about 20 ms of health plus 80 ms p95 per call with one client, 281 ms p95 with four (derived from `deem-local.md:83-87`). Keeps the need for a measured win | **Reopens to later**, as R3's live Deem form (C11) |
| 2 | A fused live lane, or writing `passes_threshold` or `ambiguousWith` | Authority | Keeps | Stays dropped |
| 3 | Serving a routing pick before R1 measures it | No gold (no measured win) | Keeps | Stays dropped |
| 4 | An abstention arm | No gold (the ceiling is 5 false fires) | Keeps | Stays dropped |
| 5 | A live pass in the PreCompact command hook | No seam (PreCompact stdout is not injected, `compact-inject.ts:8`), latency and no gold | Removes per-call latency only: at 65.6 ms at most 27 serial calls fit the 1,800 ms budget (derived), against two questions per unpinned tool call. Keeps the missing seam and the missing gold | Stays dropped, re-judged with measured numbers |
| 6 | Compaction that runs unless disabled | Authority (D1: one switch per feature) | Keeps | Stays dropped |
| 7 | A per-turn response grade | No gold and no reader | Keeps | Stays dropped |
| 8 | Dropping a review finding live below a `noul` of 0.5 | Authority | Keeps | Stays dropped |
| 9 | A failure path that returns a number | Authority (a default score) | Keeps. Deem's stub answers 0.5 for every `noul`, which the check refuses | Stays dropped |
| 10 | Aborting a whole run on one failed judgment | Method | Not applicable | Stays dropped |
| 11 | Replacing the near-duplicate collapse | Authority | Keeps | Stays dropped |
| 12 | A judgment in the dispatch guard, linter, route guard or Gate 3 sanitizer | Authority, inside 5 s budgets | Latency removed, authority kept | Stays dropped |
| 13 | Any input to STOP legality | Authority | Keeps | Stays dropped |
| 14 | The council verdict-delta measure | Authority | Keeps | Stays dropped |
| 15 | Writing or gating finding severity | Authority | Keeps | Stays dropped |
| 16 | Overriding the goal heuristic | Authority | Keeps | Stays dropped |
| 17 | A goal drift judgment | No reader | Keeps | Stays dropped |
| 18 | A verifier on Cursor or Devin | No seam | Keeps | Stays dropped |
| 19 | A live judgment in the compiled-routing front door | No gold (13 clarify and defer rows), latency and a one-shape stdout contract | Latency removed, the gold and the contract kept | Stays dropped |
| 20 | A shadow log of defer disagreements | No reader, no gold | Keeps | Stays dropped |
| 21 | Gate 3 classification as a product | No gold for a gain (F1 0.9843 leaves at most 4 errors) | Keeps. R21 is a calibration, not a product | Stays dropped |
| 22 | Spec-level risk flags | No gold | Keeps | Stays dropped |
| 23 | A retrievability score | No gold | Keeps | Stays dropped |
| 24 | A second opinion on playbook verdicts | Authority | Keeps | Stays dropped |
| 25 | A new `cli-jev` hub mode, a `jev-judge` command or a new skill | No seam for a decision (Q6, Q13) | Not a backend question | **Changed by D2**, an operator decision: a second transport mode in a new hub is required (R23). A judge command and any other skill stay dropped |
| 26 | A measurement harness command family | No reader (a forwarding wrapper) | Keeps | Stays dropped |
| 27 | A shared client helper now | Method (two callers are not a pattern) | Scripts spawn `jev` and `cli-deem`, so the binary is the shared piece | Stays dropped, gains evidence (row 110) |
| 28 | A supercov smell command | No gold | Keeps | Stays dropped |
| 29 | A classifier arm in the advisor ratchet baseline | Authority (a pinned, deterministic ratchet) | Deem is local and deterministic, but D3 updates its weights, so a pinned baseline would drift | Stays dropped, gains evidence |
| 30 | An answer cache during reruns | Method (a cache zeroes the flip rate) | Deem's determinism does the same to reruns, so Deem stability uses option orders or commits (C4) | Stays dropped, gains evidence |
| 31 | A live completion-claim judgment or done-gate authority | Authority | Keeps | Stays dropped |
| 32 | PR-claims verification as a merge gate | No gold, authority | Keeps | Stays dropped |
| 33 | Dead end: Harness B as written | Method | Not applicable | Stays dropped |
| 34 | Dead end: reviewer fixtures as three-way gold | No gold | Keeps | Stays dropped |
| 35 | Dead end: registry `transitions` as P0 gold | No gold | Keeps | Stays dropped |
| 36 | jevcache.sh as a dependency | Authority (a key outside the gate) and method | Not applicable | Stays dropped |
| 37 | classifier.dev as a service | Egress to a second vendor | Deem is not a vendor. The row concerns classifier.dev only | Stays dropped |
| 38 | A PostToolUse filter on Bash output | Egress, authority and no confirmed seam to replace tool output | Removes the egress half only | Stays dropped, gains evidence (row 85) |
| 39 | Git preflight or executor demotion | Authority, no caller | Keeps | Stays dropped |
| 40 | R3's cached advisor lane | Latency (a first ask meets the kill), no gold (exact repeats only) | A warm call makes a cache pointless | Stays dropped. The live path is row 1's reopening |
| 41 | R14's next-focus comparator | No seam (no runtime caller) | Keeps | Stays dropped |
| 42 | A global switch | Authority (D1) | Keeps. It also covers a global Deem switch | Stays dropped, gains evidence (row 80) |
| 43 | A key in the tracked settings file | A committed secret | Deem has no key | Stays dropped for Jev |

### BASE2 rows 44 to 72

| Row | Idea | Load-bearing reason | Deem | New verdict |
|---|---|---|---|---|
| 44 | pi-jev-context's per-request filter | Latency on every request, prompt-cache invalidation, persisted pruning and egress | Removes the egress and the charge. Keeps the cache risk and the per-request await | Stays dropped (grok-03, glm-05) |
| 45 | Dead end: the fit column as host `preTokens` | Method | Not applicable | Stays dropped |
| 46 | Shelling npm `jevctl` subcommands | Authority (D1 pins the Python package) | Not applicable | Stays dropped (row 77 adds `TYPESAFE_BASE_URL`) |
| 47 | npm `rerank` as the modal pick | Authority (a missing answer becomes 0) | Keeps: the bug lives in the caller | Stays dropped (grok-03, glm-05) |
| 48 | Sending a clamped or cut prompt | Method | Deem refuses over-cap questions with HTTP 400, which a caller counts | Stays dropped |
| 49 | claude-jev's path rule as the redaction fix | No seam (it never sees file content) | Not applicable to Deem, which sends nothing off the machine | Stays dropped for Jev (grok-03, glm-05) |
| 50 | Dead end: narrative-mined P0 gold | No gold | Keeps | Stays dropped |
| 51 | Parking R19's census | Method | Not applicable | Stays dropped |
| 52 | A dollar figure in a cost line | Method (vendor prices) | Deem has no charge at all | Stays dropped |
| 53 | Refactoring `score-outcome-rerank.mjs` for R1 | Authority (a frozen eval) | Keeps | Stays dropped |
| 54 | Cluster membership from recomputed margins | Method | Not applicable | Stays dropped |
| 55 | R19 estimator shortcuts | Method | Not applicable | Stays dropped |
| 56 | A skip-with-warning transcript parser | Method | Not applicable | Stays dropped |
| 57 | Dead end: R19's brief from PreCompact records | No seam | Keeps | Stays dropped |
| 58 | Injecting `options.supervisorVerifier` | No seam | Keeps | Stays dropped |
| 59 | Dead end: the goal store as R2's evidence | No gold | Keeps | Stays dropped |
| 60 | Collapsing `unclear` into `not_met` | Method | Not applicable | Stays dropped |
| 61 | R20's lint inside `check-goal.cjs` | Authority | Keeps | Stays dropped |
| 62 | R20 reaching native `/goal` strings | No seam | Keeps | Stays dropped |
| 63 | Judgments in the projection, permission, guard and checker surfaces | Authority, and no gold for `/prompt:improve` | Removes egress only | Stays dropped |
| 64 | Harness plumbing surfaces as seams | No seam | Keeps | Stays dropped |
| 65 | Fixing redaction inside a build phase | Authority (the owners' fix) | Not applicable | Stays dropped |
| 66 | Merging the R1 and R19 censuses | Method | Not applicable | Stays dropped |
| 67 | Reporting the key's origin | Method | Deem has no key | Stays dropped |
| 68 | Widening R21's trigger to a power threshold | Method (not countable before the arm) | Moot for Deem: R21's Deem half runs on every `--deem` run | Stays dropped for Jev, gains evidence |
| 69 | Awaiting a call inside Pi's `turn_end` | Latency (it holds every turn) | Shrinks the hold to roughly 0.1 s per turn with one client but not to zero. R2's arm has no measured accuracy | Stays dropped. A detached form is R2's later shape |
| 70 | Counting scratch fixtures in R20's population | Method | Not applicable | Stays dropped |
| 71 | Dead end: a watched or unattended split | Method | Not applicable | Stays dropped |
| 72 | An R2 arm over the stored goal string | Duplication of R20 (Q3) and egress | Removes the egress, keeps the duplication | Stays dropped, gains evidence |

### BASE2's later items and its one drop

| Item | Load-bearing reason for later | Deem | New verdict |
|---|---|---|---|
| R3, the advisor order inside the cluster | Latency, and no measured win until R1 keeps | Removes the latency half (C11) | Stays later, with row 1 folded in and an amended promote condition |
| R4, the completion-claim audit | No gold, no reader | Keeps | Stays later |
| R5, the reviewer verdict fallback | No gold (no recorded misses) | Keeps | Stays later |
| R6, the reply-harness judge | No gold | Keeps | Stays later |
| R7, the D4 hallucination grader | No gold, and the silent `mock` fallback | Keeps | Stays later |
| R8, the stop second-rater replay | No gold confirmed | Keeps | Stays later |
| R9, the confirm-mode stop suggestion | Waits on R8 | Keeps | Stays later |
| R10, the severity replay | No gold (question 7 answered no) | Keeps | Stays later |
| R12, the clarify suggested default | No gold | Keeps | Stays later |
| R13, the alignment below-50 suggestion | No gold | Keeps | Stays later |
| R15, the fan-out shadow pair record | No gold, no reader | Keeps | Stays later |
| R16, the injection screen | No seam | Keeps | Stays later |
| R17, the PR-claims report | No gold, no reader | Keeps | Stays later |
| R18, the debug `next_check` choice | No seam, no reader | Keeps | Stays later |
| R22, the HVR reader-needed lens | No gold, and egress for drafts | Removes the egress half only | Stays later (C13) |
| R2's model arm and shadow mode | The tail-window gate, labels, egress and 002's latency | Removes the egress and latency preconditions | Stays later (C10) |
| R19's model arm | The census stop line, egress and the payload. Question 18 for a live form | Removes the egress and payload preconditions, adds the batch cap and a context check | Stays later (C9) |
| R20's model arm | Labels and a violation rate of at least 5% | Keeps | Stays later (C12) |
| R14, the next-focus comparator (drop) | No seam | Keeps | Stays dropped |

**Reopened by the re-rank: one** (row 1, to later, through R3). Changed by an operator decision rather than the backend: row 25. Gained Deem evidence without a verdict change: rows 5, 27, 29, 30, 38, 40, 42, 68, 69 and 72.

---

## 5. C: Context reduction

**Verdict: no seam yields a counted context saving from a classifier today.** The one counted prize with a real seam is compaction, and R19's census prices it with zero calls. Every other seam lacks gold, a seam or a saving large enough to matter.

**The yardstick.** Per assistant message, the carried context has a p50 of 384,219 and a p95 of 887,519 cache-read tokens, over 66,498 message ids in 93 main-session transcript files from 2026-08-18 to 2026-09-27 (mimo-01, lineage-reported). Usage is deduplicated by message id, which stands after the ALL-7 correction (K4). The corrected tool counts over the same files are Bash 58,109, Edit 3,301, Read 1,984, Write 1,503, Agent 956, AskUserQuestion 519 and Monitor 282 (`results-mimo-01-recount.txt`, lineage-reported).

| Seam | Deadline | Headroom | Counted baseline | Net saving | Verdict |
|---|---|---|---|---|---|
| Skill routing, hub stage (the advisor prompt hook) | Child killed at 2,500 ms, advisor given 2,200 ms, hook 3 s (`user-prompt-submit.ts:22-24`, `:105-108`, `.claude/settings.json:110`) | The advisor's own spend is UNKNOWN. A warm Deem health check plus `choice` adds about 100 ms p95 with one client and about 300 ms with four (derived) | 0 recorded `ambiguousWith` events (BASE2 C28) | None in context: a tie-break reorders, it removes no text | R3, later |
| Leaf routing, stage 2 (`ROUTER.md` leaves) | None: the main AI reads the file | Not a deadline question | 68,335 plus 613,586 bytes of `ROUTER.md` reads over 40 days, about 119 KB a week (K7, lineage-reported) | At most about 30,000 tokens a week at 4 bytes a token (estimate), and the cheaper fix is a deterministic replay | R25, later |
| Retrieval reranking (the trigger-index lookup) | A cold synchronous CLI with a fixed exit contract (deepseek-04 F3, lineage-reported) | Not measured | No counted misrank | UNKNOWN | Drop, row 88 |
| File relevance and re-reads | None | Not a deadline question | 1,777 re-reads over 40 days: 1,497 partial, 292 after a compaction, 1,076 before an edit and a remainder of 84 (mimo-04, lineage-reported) | At most 84 reads over 40 days, and no gold for "needed" | Drop, row 86 |
| Compaction keep or drop | PreCompact: 1,800 ms inside a 3 s hook, and its stdout is not injected (`shared.ts:12`, `compact-inject.ts:8`, `:494`, `.claude/settings.json:222`). The `precompute` function-hook budget is UNKNOWN (question 18) | No live seam replaces the host summary from a command hook | 212 boundaries in 93 main-session files and 14 in subagent files, a p50 wait of about 104 s (005 `spec.md:66`) | UNKNOWN until the census prints its reduction upper bound | R19: census build-now, arm later |
| Tool-output pruning | The Bash PostToolUse hook runs a 5 s audit (`.claude/settings.json:210`) | No confirmed way to replace tool output (BASE1 row 38) | Tool results of 217.9 MB from Bash and 154.0 MB from Read over 40 days (mimo-04, lineage-reported) | UNKNOWN, with no gold | Drop, row 86 |
| Stored hook output | None | Not context | 546.2 MB of stored `hook_success` over 40 days (glm-03, lineage-reported) | None in context: the store is host-owned | Drop, row 87 |
| The compaction brief (R11, folded into R19) | The SessionStart brief hook: p50 285 ms (BASE2) | Unchanged | Brief 703 to 4,426 characters, p50 1,906 (BASE2) | Measured by R19's brief column | Unchanged |

**Deem's effect on these seams.** It removes the egress half of rows 38 and 44 and makes a warm call fast. It adds nothing on the seams that lack gold. For hooks, deepseek-04's two-path rule is adopted as a measurement rule (N-deepseek-04-1): a caller that already runs in Node pays the connection and the call, and a shell caller also pays a spawn (26.0 ms p50, `deem-local.md:82`). PreCompact work belongs off the critical path (N-deepseek-04-2), which leaves only the `precompute` trigger for any live form of R19.

---

## 6. D: Validators

**Verdict: the validators leave judgment residue, and none of it has labeled negatives today, so no classifier ranks above later here.** The residue with the cleanest judgment is citation drift (R24). The residue with an existing label source is correctness and traceability in review findings (R26), but those labels mark positives only. Two gaps need no model at all and go to their owners.

| Surface | What it checks | Residue after it passes | Classifier fit |
|---|---|---|---|
| spec-kit `validate.sh` | 40 rules in `validator-registry.json`: 20 authored-template, 14 operational-runtime and 6 structural (counted). `AC_COVERAGE` is info level | `AC_COVERAGE` accepts any `file:line` shape and counts it, but never checks that the file or line exists (`check-ac-coverage.sh:291`, `:327`, `:346`). Whether the cited evidence proves the criterion | The existence check needs no model (N-deepseek-03-3): an owner report for spec-kit. Proof quality has no labels |
| `check-goal.cjs` | Four structural checks (`:44-49`), a frozen exit contract (`:693`, `:697`) | Criterion wording under `sk-create-goal` rules 4 and 5 | R20's lexical lint, next. Its model arm is later on either backend |
| sk-doc `validate_document.py` | 13 document types from `template-rules.json`. Structure enforcement is on by default, with an opt-out variable (`:540-545`) | An undetected type falls back to README rules without a notice (`:255-256`) | None: an owner report for sk-doc |
| sk-doc `quick_validate.py` | Skill and command packages | A non-fully-qualified MCP tool token fails a command but only warns for a skill (`:246-251`) | None: an owner report for sk-doc |
| DQI, `extract_structure.py` | A score with bands at 90, 75 and 60 (`:1132-1143`) | Whether a marginal band is fair (swe-02) | No labels |
| `hvr_scan.py` | The voice rules a machine can settle, reporting the rest as reader-needed with the subtotal as a floor (`:17-21`) | The reader-needed categories | R22, later |
| Frontmatter | 3,658 `description:` lines in skill docs (counted. swe-06 counted 3,551) | Whether a description fits its body (swe-02) | Subjective, no labels |
| `file:line` citations in skill docs | Nothing checks them today | Whether line N still says what the citing sentence claims | R24, later |
| Command, skill and agent docs | Template and package checks. 12 agent files in `.claude/agents/` | Whether an agent's tool list is least-authority (swe-02) | Needs intent inference, no labels |
| Review findings | None: correctness and traceability have no validator | Which passages hold a correctness or traceability defect. 2,075 finding rows, 320 correctness and 337 traceability (mimo-02, lineage-reported) | R26, later. The rows mark positives only |
| sk-design md-generator `validate.ts` | Passes on zero hard failures (`:699-701`, exit at `:765`) | The docs promise an 80-point gate the code lacks (K14) | None: an owner report for sk-design |

**The citation count, rerun today.** swe-06's own pattern finds 403 `file:line` citations in `.skilled/skills/**/*.md`, not 456 (K10). A path-aware pass over code and doc extensions finds 500. Resolving each against the citing file's folder, the repository root, the skill root and then a unique basename: 228 resolve in range, 4 point past the end of their file, 42 match more than one file by basename and 226 resolve nowhere. The unresolvable ones cluster in sk-code (132) and system-spec-kit (77), mostly illustrative example paths. So 4 of 232 resolvable citations are dead by line count (confirmed by this count). Drift inside a file, the right file with lines that no longer say the claim, needs a reader and is unmeasured.

**The precision a classifier would need.** An advisory line an author acts on needs a named reader and a precision of at least 0.8 measured on labels that include negatives. BASE2 set 0.8 for R20's workflow line and R22's keep. Only R20's population can get such labels soon, once the operator adopts a rubric (question 34). R24's labels can be manufactured by drifting citations on purpose (swe-06), which makes it the cheapest later residue to measure.

---

## 7. E: sk-prompt

**Verdict: no classifier. Two docs fixes go to the skill's owner.**
- **The label set is not settled.** The prose promises 7 frameworks (`sk-prompt/SKILL.md:3`, `:12`, `:38`), while `assets/framework-registry.json` holds 5 ids: `rcaf`, `race`, `cidi`, `tidd-ec` and `costar` (counted). CRISPE and CRAFT have no registry template.
- **The pick is judged, not computed.** The selection matrix maps a complexity from 1 to 10 (in overlapping ranges) and a primary need to a framework (`SKILL.md:307-315`). Both inputs are the AI's judgment, so glm's "deterministic today" is wrong (K5).
- **CLEAR is a 50-point sum with a 40-point threshold** (`SKILL.md:321`). No labeled scores exist.
- **The prize is a read, and it is small.** A run reads `SKILL.md` (23,081 bytes) and `references/patterns-evaluation.md` (36,580 bytes), 59,661 bytes in all (counted). Use is about 3.5 runs a week, 20 `prompt-improver` dispatches in 40 days (the mimo lead's count, lineage-reported).
- **The cheaper fix.** Reconcile 7 against 5, then tell the skill to read only the selected framework's section (N-glm-04-1). At about 3.5 runs a week that saves at most roughly 25,000 tokens a week (estimate at 4 bytes a token), with no model and no gold.
- **Drops.** A `choice` picker over the 5 ids (N-grok-05-1, row 89) and a CLEAR classifier (N-grok-05-2, row 90) have no labeled picks or scores. mimo-09 prices such labels at 4 to 5 hours each (lineage-reported).

---

## 8. F: sk-design

**Verdict: no classifier. Mode routing is compiled, and the one scored gate is deterministic.**
- **Routing.** `compiled-route.cjs --hub sk-design` returned action `route` to `sk-design-chart` in the orchestrator's live check. sk-design is a default-on hub (`resolve.cjs:36-44`) in the serving manifest (`serving-closure.manifest.json:5-13`). Rule 6 at `sk-design/SKILL.md:202-203` says the opposite and is stale: an owner report (K3). Picking leaf files inside a mode is still the main AI reading prose.
- **The in-mode intent classifier is pseudocode.** `classify_intents` appears only in `sk-design-fundamentals/SKILL.md:197`, with no code behind it. Replacing it with a `choice` over its intents (N-grok-06-1) drops (row 84).
- **No routing accuracy number exists.** No hub Lane C run was archived (`sk-design/benchmark/README.md:26-27`). The playbooks hold 58 files, 53 scenarios plus 5 indexes (counted). A replay through the compiled router (N-mimo-06-1) would be a routing check with no classifier, which belongs to the routing owner (row 93).
- **Rubric scoring is unmeasured.** The md-generator's gate is a hard-failure count (`validate.ts:699-701`), and a `claimsScore` below 80 only prints an advisory (`:729-732`). The docs describe an 80-point `isPass` (`quality-checklist.md:29`, `:476-477`, `SKILL.md:309`, `assets/design-md-prompt-template.md:74`), and `report-gen.ts:196-199` labels 80 as "Pass" in the report only. Deem or Jev on the checklist, the diagnosis table or the gate drops (row 91).
- **swe-05's port and fallback drop.** A deterministic port of the embedded pseudocode routers saves nothing unless the block leaves the loaded text, and 0 of 9 corpus prompts are zero-score for the packet they reach (swe-05, lineage-reported, row 94).

---

## 9. G: Open discovery

| Candidate | Lineage | Measured value | Verdict |
|---|---|---|---|
| `cli-deem` client in a `cli-classifier` hub | swe-01, deepseek-06, deepseek-07, grok-07, swe-07, glm-02 | Unmeasured until a Deem arm runs. Its tests are its first harness | R23, next |
| Citation-drift advisory scan | swe-06, mimo-08 | Counted: 403 or 500 citations, 4 of 232 resolvable ones dead. Drift unmeasured. Reader cost 8 to 15 hours per full audit (swe-06's estimate, lineage-reported). No reader named | R24, later |
| Stage-2 leaf-route replay | swe-03, glm-03, mimo-07 | About 119 KB a week of `ROUTER.md` reads (K7, lineage-reported) | R25, later |
| Validator-residue flagger | mimo-02, glm-04, mimo-08 | 62 post-pass findings a week (mimo-02's arithmetic, lineage-reported). No labeled negatives | R26, later |
| `/doctor:classifier` | mimo-07 | None: it forwards to `deem-ctl status` and `jev auth status` | Drop, row 98 |
| A Tare quality gate in `deem-ctl update` | glm-01, grok-08 | None here. The published figures are vendor claims of different kinds | Drop, row 74 |
| A background `precompute` pass | deepseek-08 | Unmeasured. Needs question 18 answered | Folded into R19's later arm |
| Deem as an MCP server | grok-03 | Negative: 2,225 bytes of tool schemas in every tool list (grok-03, lineage-reported) | Drop, row 78 |
| A vendor-claim table | grok-09 | None as a feature | Drop as a build, kept as the caveat list in section 16 (row 99) |
| A leaf-intent `choice` for sk-doc | swe-03 | Unmeasured. Needs R25's replay first | Folded into R25 |
| A read ledger for re-reads | mimo-04 | At most 84 avoidable reads over 40 days | Drop, row 86 |

---

## 10. H: Order, savings, cost and kill criteria

### Order

Free numbers first, the local backend second, the billed backend third, labels fourth, later arms last.
1. **The three censuses, with zero calls and zero labels:** 002's census (R1), 005's census (R19) and 003's Pi census (R2). Unchanged from BASE2.
2. **008, `cli-deem` and the `cli-classifier` hub (R23).** Its tests use a fake server, so it makes no call to the real one. The orchestrator runs its one live smoke.
3. **002's `--deem` arm and R21's Deem half.** The first local accuracy on 195 labels and a `choice` verdict on the advisor's near-ties. Nothing leaves the machine.
4. **002's `--jev` arm,** only with a key and the D1 checks. R21's Jev half runs only on `underpowered`. The redaction fixes land before any Jev egress, as BASE2 set.
5. **The rubric (question 34), then 006's lexical lint and its labels.**
6. **003's zero-call arms,** which need the operator's adjudication.
7. **009, the `cli-jev` move,** once a Deem arm has printed a result the operator keeps.
8. **Later arms, each past its own line:** R19's, R2's and R20's, Deem preferred for all three. Live forms come last and only past their conditions.

This is BASE2's order with two insertions: the client before any Deem number, and the move after one. It matches deepseek-10's census-first principle and swe-09's client-first, hub-last order. It departs from deepseek-10's "client and hub at step 2" only by splitting the move out.

### Savings against counted baselines

| Survivor | Context tokens | AI passes | Minutes | Source |
|---|---|---|---|---|
| R1 census and arms | None: a measurement | None | Operator: 5 to 10 to read one report (BASE2, lineage-reported). Machine: the Deem arm about 47 s (derived) | BASE2, `deem-local.md:85` |
| R19 census | None until the census prints its reduction bound | None | Operator: 17 to 32 for the 3-session read (BASE2, lineage-reported) | BASE2 |
| R2 Pi census and arms | None directly. A clamp fix could remove up to 253 of 1,457 hidden nudges in Pi (BASE2 count) | Up to 253 nudge turns | Operator: 16 to 40 (BASE2, lineage-reported) | BASE2 |
| R23 client and hub | None directly: an enabler | None | None | Section 3 |
| R21 calibration | None: a measurement | None | Machine: Deem about 12 s (derived) | `deem-local.md:38` |
| R20 lint | None directly. Fewer criteria the native judge cannot check | UNKNOWN | Operator: 55 to 65 plus 10 for the rubric (BASE2, lineage-reported) | BASE2 |
| sk-prompt docs fix (owner report) | At most about 25,000 a week (estimate) | None | None | Section 7 |
| R25 (later) | At most about 30,000 a week (estimate) | None | About 30 of pinning review (mimo-07, lineage-reported) | Section 5 |

mimo-09's pattern holds after its corrections: every zero-call slice survives an operator who gives no minutes, the first judged feature costs about 80 minutes of labels and later judged features 3.5 to 5 hours each (mimo-09, lineage-reported).

### Cost per backend

| Item | Jev calls | Deem calls | Deadline or cap | What leaves the machine |
|---|---|---|---|---|
| R1 census | 0 | 0 | none | nothing |
| R1 arm | at most 723 plus 1 `jev auth test`, 90 s cap per call | at most 723 (241 rows times 3 option orders), about 47 s at 65.6 ms p50 (derived) | none: a person runs it | Jev: corpus prompts and skill descriptions (low). Deem: nothing |
| R21 | about 585, only on `underpowered` | 195, one pass, about 12 s (derived) | as R1 | as R1 |
| R19 census | 0 | 0 | none | nothing |
| R19 arm (later) | one per batch, UNKNOWN until the census | one per batch of at most 32 calls, latency at fitted-state size UNKNOWN | offline none. Any live form: UNKNOWN budget | Jev: the fitted session history (highest). Deem: nothing |
| R2 arm (later) | at most 150, 50 rows times 3 reruns | at most 150, 50 rows times 3 option orders | 30 s plugin budget for a live form (`opencode-goal.js:49`) | Jev: the operator's conversation (highest). Deem: nothing |
| R20 arm (later) | about 600 | about 200, no reruns | none | committed criteria (low) |
| R22 (later) | one per flagged section and category | the same | none | Jev: document prose. Deem: nothing |

Money is not the constraint for either backend: Jev costs cents at the vendor's claimed price (BASE2), and Deem costs electricity. Operator minutes and, for Jev, egress are the constraints.

### Kill lines, one string family

BASE2's lines stand for every Jev arm. The Deem lines are added, all proposed, each printed from its script and fixed in its phase spec before the build.

| Phase | Printed line | Effect |
|---|---|---|
| 002, 003, 005, 006 | `deem arm skipped: <check>`, with a details line where one applies | Nothing else changes |
| Every Deem arm | `deem arm stopped: server gone` | Finished rows print as `partial` |
| Every Deem arm | `deem arm stopped: model commit changed mid-run` | Finished rows print as `partial`, and the next run requalifies |
| 002 | `verdict: kill` on the Deem column | Closes R3's live Deem form. A Jev `kill` closes the Jev form |
| Any Deem keep | `requalify: model commit changed` | The keep is suspended until its rule reruns on the same harness |
| 008 | The per-hub check fails, or a replayed Deem request routes elsewhere | Revert the hub commit |
| 009 | Any canary case or hub-routing scenario routes differently after the move | Revert the move commit |

---

## 11. Cross-Lineage Agreement

Only wave 1 counts as independent: iterations 1 to 3 of grok, deepseek, mimo and swe, plus glm-01. An agreement counts only when neither lineage's `steer.md` suggested it before the iteration ran and the iteration read it. A later agreement is reported by whether the lineage cited code or counts it opened itself, and counts as neither kind of corroboration. Agreement inside one lineage never counts, and agreement between a baseline and my own reading is a Claude reading.

### Independent and unsteered, wave 1

| # | Agreement | Lineages | Grounding | Against BASE2 |
|---|---|---|---|---|
| A1 | The Python `jev-cli`'s `custom` provider is not a thin route to Deem: `choice` and `score` fail on field names, and the answer fields differ | grok-02, swe-01, glm-01 | Each opened both sides: `__init__.py:364-369` and `:389-393` against `deem_server.py:534-547` and `:594-621` | New ground. Confirms the orchestrator's inferred gap |
| A2 | Deem answers must record which weights produced them, and a measured rule must requalify after an update | deepseek-02 (N-deepseek-02-3), glm-01 (N-glm-01-2) | Both opened the pre-run `deem-ctl` and the server's health code | New ground |
| A3 | Validator residue gets at most an advisory once labels exist and never touches a validator's verdict | deepseek-03, swe-02 | deepseek-03 from `validator-registry.json` and `check-goal.cjs`. swe-02 from the sk-doc scripts | Extends BASE2's R20 and R22 stance |
| A4 | No context-reduction classifier is build-now | grok-03, mimo-01 | grok-03 from the vendored compaction and MCP code. mimo-01 from its own transcript counts | Agrees with BASE2 rows 5, 38 and 44 |

**Steered in wave 1.** glm-01 (N-glm-01-1) and mimo-03 (N-mimo-03-1) both put a Deem scorer on R1's already-designed rows, with R21 as the calibration set. mimo-03 read its lead's steer on method first (`mimo/iterations/iteration-003.md:5`), so this counts as steered.

**Disagreement in wave 1.** grok-02 proposed a translator inside `jev-cli` (N-grok-02-1, next), while swe-01 built a separate client and dropped the translator (N-swe-01-3). The code settles it for the client (section 3).

### After cross-reading, citing code or counts the lineage opened itself

| # | Agreement | Lineages | Grounding |
|---|---|---|---|
| G1 | `cli-deem` is a separate client, not a wrapper or a translator | deepseek-06 (W2), grok-07 (W3), glm-05 (W4) | deepseek-06 reopened `__init__.py` and reached the client from the failure side. grok-07 changed its own grok-02 verdict after reading swe-01 and its steer, citing `jev-cli` lines it opened. glm-05 cites `deem_server.py:809-811` and `__init__.py:288` |
| G2 | No drop flips on the backend alone | grok-04 (W2), deepseek-05 (W2), glm-05 (W4) | grok-04's own 72-row reason table. deepseek-05 from the seam code. glm-05 reread rows 44, 47 and 49 itself |
| G3 | 002's `:92` line needs "Jev or Deem" | glm-02 (W2), deepseek-05 (W2) | Each from 002's spec. Neither read the other, so they arrived separately, but in wave 2 |
| G4 | Row 1 revives only with R1's `keep`, whatever the latency | grok-04 (N-grok-04-1), deepseek-04 (N-deepseek-04-3) and deepseek-05 | deepseek-05 read grok-04 and contested its "spawn-included" wording by code: the advisor child already runs in Node |
| G5 | The hub move's blast radius, counted | deepseek-07, glm-02, swe-07 | Each counted files itself. Their counts differ from mine (K12) |
| G6 | The stage-2 replay is the cheaper fix for leaf routing | glm-03 (from swe-03's trace), mimo-07 | mimo-07 counted the baseline itself, later corrected by its lead (K7) |
| G7 | No classifier picks the sk-prompt framework now | grok-05, mimo-05 | grok-05 counted the label sets. mimo-05 counted uses |
| G8 | No model routes sk-design modes | grok-06, swe-05 | grok-06 from the hub files. swe-05 from its own corpus count |
| G9 | R20's lexical lint never takes a classifier | deepseek-10 (F5), swe-09 | deepseek-10 from `check-goal.cjs`. swe-09 read deepseek-10 and its own swe-02 map |

### After cross-reading, citing a sibling only

| # | Agreement | Lineage | Source |
|---|---|---|---|
| S1 | The Deem check's allowlist | grok-04 to grok-07, swe-08 | deepseek-01, deepseek-02 and deepseek-04's lead correction |
| S2 | Mint the hub only on a second caller | swe-07 | glm-02 |
| S3 | The 59,661-byte sk-prompt read | glm-04 | grok-05 |
| S4 | The Deem stop lines | deepseek-09, deepseek-10 | grok-10 |
| S5 | Review tables hold gold for the residue flagger | glm-04 | mimo-02 |

### Where a lead's steer preceded the agreement

- mimo-03's comparison design, and mimo-04's split of re-reads before pricing, followed their lead's steer (`mimo/iterations/iteration-003.md:5`, `iteration-004.md:6`).
- grok-07's switch from a translator to a client followed its steer's "three-route note" and swe-01 (`grok/iterations/iteration-007.md:5`, `:72`).
- grok-08's Tare verdict, and grok-09's and grok-10's records of the compact path, followed their steer (`iteration-008.md:14`, `iteration-009.md:5`).
- deepseek-04's allowlist followed its lead's correction. deepseek-07 and deepseek-08 read the steer (`deepseek/iterations/iteration-004.md:12`, `:29`).
- glm-04 followed its steer by its lead's report, while glm's own iterations say none landed.
The findings stay each iteration's evidence, not the lead's authority.

### Found by one lineage, and what verification showed

| Finding | Lineage | Verification |
|---|---|---|
| The model id needs a pin, because nothing ties it to the weights | deepseek-01 | Confirmed: `deem_server.py:107`, `:929-931` |
| A loading server is indistinguishable from an absent one | deepseek-01 | Confirmed: `deem_server.py:962-1000` |
| The stub passes `status` alone and is refused only on `backend` | deepseek-01 | Confirmed: `deem_server.py:137-154`, `:772-777` |
| The compaction default fails open | grok-03 | Refuted: K1 |
| Deem's MCP tool schemas cost 2,225 bytes in every tool list | grok-03 | Not reopened, lineage-reported. The MCP tools require `state` (`deem_mcp.py:60`, confirmed) |
| 0 of 9 corpus prompts are zero-score for their packet | swe-05 | Not rerun, lineage-reported |
| A citation-drift scan can manufacture its labels | swe-06 | Confirmed as a design property. Count corrected (K10) |
| The stage-2 replay is the cheaper fix | glm-03 | Plausible. Its saving is small (K7) |
| The sk-prompt 7-versus-5 mismatch | grok-05 | Confirmed: `SKILL.md:3`, `:12`, `:38` against 5 registry ids |
| The idle footprint needs an operator decision | deepseek-02 | Confirmed as a question (question 45) |
| The dispatch guard refuses an inline `JEV_API_KEY=` | this synthesis | Confirmed: `dispatch-rule-checks.mjs:114`, `:287-290` |
| The server caps a request at 64 questions | this synthesis | Confirmed: `deem_server.py:656-659`, `:995-997` |
| The md-generator's `isPass` exists only in docs | this synthesis | Confirmed: K14 |
| The route engine maps `cli-jev` to its rollout package | this synthesis | Confirmed: `compiled-route.cjs:35`, `compiled-route-sync.cjs:59` |

### Disagreements

1. **`cli-deem`'s shape.** grok-02 wanted a translator in `jev-cli`. swe-01, deepseek-06, grok-07 and glm-05 want a client. The code decides it: `jev-cli` hard-codes `criteria` and the `noul` and `score` answer keys (`__init__.py:364-369`, `:389-393`), a patch is a fork of a pinned package and the guard refuses the wrapper's inline key.
2. **When to mint the hub and move `cli-jev`.** deepseek-07 and deepseek-10 put the hub at step 2. glm-02 and swe-07 wait for a second caller. grok-10 would build no phase, which the orchestrator corrected (K2). swe-09 builds the client first and the hub last. This file mints the hub with the client in 008, because the client needs a home and D2 names that home. It moves `cli-jev` in 009 only after a Deem result is kept. That pays the move's 48-file cost only when the second transport has proven it stays.
3. **The compaction default.** grok-03 and the swe lead call `compact.ts:285` a fail-open. BASE2 and the code say it is inert (K1).
4. **The validator-residue flagger.** glm-04 calls it the one survivor, because the review tables carry severity and dimension labels. Those rows are findings, so they label positives only: precision needs passages judged clean too. It stays later (R26).
5. **The stage-2 replay.** glm-03 says build-now, and mimo-07 made it its measured workflow. The prize is about 119 KB a week, so it stays later (R25).
6. **The sk-prompt picker.** grok-05 says later. glm-04 says drop, for the wrong reason (K5). It drops on no gold and low use.
7. **Row 1's revival test.** grok-04 wrote "spawn-included p95". deepseek-05 showed the advisor child spawns no client, because it already runs in Node. The measured added cost is about 20 ms of health and 80 ms of call (C11).
8. **A Deem flip test.** grok-08 would print 3 reruns. Determinism makes that void (K13).
9. **`/doctor:classifier`.** mimo-07 says next. It forwards two existing commands, so it drops (row 98).
10. **The validator-residue population.** mimo-08 and mimo-09 found it empty. Its lead showed a path artifact and 193 real cases (K9).

### Cross-family corroboration of BASE2's calls

- **R1, census first.** glm-01 (W1) reached it from BASE2's own record, quoting its lines rather than reopening the code, so it is agreement, not corroboration. mimo-03 (W1) recomputed the power table from the corpus files it counted, but read its steer on method first. swe-10 (W4) derived the census as the first PR-sized slice from 002's spec and code, after cross-reading. Three families support the call, and none of them meets the strict rule of wave 1, unsteered and code-grounded.
- **R19, census before arm.** swe-04 (W2) designed the deletion arm as a 005 amendment behind the printed stop line, grounded in 005's spec and the vendored code. grok-03 (W1) contested one detail, and the code refutes it (K1). Supported after cross-reading by one family.
- **R2.** No lineage recounted the Pi nudges. deepseek-10 amended 003's text. No new corroboration.
- **R20, the lint kept apart from `check-goal.cjs`.** deepseek-03 (W1, unsteered) kept `check-goal.cjs` read-only from its own read of the code. That is independent corroboration of the separation, one family. deepseek-10 (W4) adds that the lint never takes a classifier.

Question 30 therefore stays partly resolved. This synthesis is itself a Claude reading.

---

## 12. Recommendations

Ranked by value to the operator against cost, latency, privacy and risk, smallest measurable slice first. A Deem-backed recommendation ranks above later only when its first slice makes zero calls or a measured accuracy set exists for it. File names, switch names and printed lines marked "proposed" do not exist yet.

| Rank | ID | Recommendation | Verdict | Judgment type | Preferred backend | Phase |
|---|---|---|---|---|---|---|
| 1 | R1 | Offline advisor tie-break, census first | build-now | `choice` | Both, as separate columns. Deem runs free first | 002 |
| 2 | R19 | Compaction recall census, then an offline deletion arm (R11 folded in) | build-now for the census, later for the arm | `noul`, batched with `run` | Deem, for privacy | 005 |
| 3 | R2 | Goal verifier: Pi census and zero-call arms, then an opt-in shadow | next for the slice, later for the arm and mode | `choice` | Deem, for privacy | 003 |
| 4 | R23 | `cli-deem` Node client in a new `cli-classifier` hub, then the `cli-jev` move (new) | next | transport | Deem only | 008, 009 |
| 5 | R21 | Gate 3 calibration | next. Deem half always under `--deem`, Jev half only on `underpowered` | `noul` | Deem first | 002 |
| 6 | R20 | Goal-criteria lint | next for the lint, later for the arm | `noul` | Deem for the later arm | 006 |
| 7 | R3 | Advisor suggested order inside the cluster (row 1 folded in) | later | `choice` | Deem for a live form | not phased |
| 8 | R4 | Completion-claim offline audit | later | `noul` | Deem | not phased |
| 9 | R5 | Reviewer verdict classification fallback | later | `choice` | either | not phased |
| 10 | R6 | Reply-harness blinded judge | later | `score` | either | not phased |
| 11 | R7 | D4 hallucination grader kind | later | `noul` or `score` | either | not phased |
| 12 | R8 | Stop second-rater replay | later | `score` | Deem, for archived evidence | not phased |
| 13 | R9 | Confirm-mode stop suggestion | later | none at use time | none | not phased |
| 14 | R10 | Severity replay, P0 reread order and a validity log | later | `choice`, `score` or `noul` | Deem | not phased |
| 15 | R12 | Compiled-routing clarify suggested default | later | `choice` | Deem | not phased |
| 16 | R13 | Alignment below-50 suggestion | later | `choice` | either | not phased |
| 17 | R15 | Fan-out shadow pair record | later | `noul` | Deem | not phased |
| 18 | R16 | Injection screen on fetched text | later | `noul` | Deem | not phased |
| 19 | R17 | PR-claims advisory report | later | `noul` | either | not phased |
| 20 | R18 | Debug `next_check` choice | later | `choice` | either | not phased |
| 21 | R22 | HVR reader-needed lens | later | `noul` | Deem | not phased |
| 22 | R24 | Citation-drift advisory scan (new) | later | `noul` | Deem | not phased |
| 23 | R25 | Stage-2 leaf-route replay (new) | later | none, then `choice` on ties | Deem | not phased |
| 24 | R26 | Validator-residue flagger (new) | later | `noul` | Deem | not phased |
| none | R11 | Compaction brief selection pass | folded into R19 | `noul` or `run` | as R19 | 005 |
| none | R14 | Next-focus shadow comparator | drop (row 41) | `choice` | none | none |

Totals: 2 build-now (R1, R19), 4 next (R2, R23, R21, R20), 18 later, 1 drop (R14) and R11 folded. Four ids are new: R23 to R26.

### The shared two-backend gate contract

Every model arm below follows this contract. Only the switch names differ.
- **Switches.** Each arm has one switch per backend, `--jev` and `--deem` (proposed). No global switch exists (row 80). Without a switch a script spawns neither `jev` nor `cli-deem`, which stub binaries placed first on `PATH` prove by logging nothing.
- **Jev half.** BASE2's contract, unchanged: an identity line, then `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0, with the same `--provider P` on every later call (D1, `../goal.md:49`, `:130`). BASE2's skip lines, stop line and exit handling stand.
- **Deem half.** Once per run, or once per session for a live form: `cli-deem health` (proposed) applies the check in section 3 within 2,000 ms offline or 500 ms in a hook. It prints the backend, the model id and the commit pair. Failures print `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` plus a details line with the id found, or `deem arm skipped: bad health response`. No feature starts the server.
- **Preference.** Each recommendation names its preferred backend in the table above. The default is Deem for any payload drawn from the operator's sessions, because nothing leaves the machine. Jev runs where a Jev number is the point, as in R1's Jev column. A run uses one named backend per column and never fails over silently (row 81).
- **After the Deem gate.** Exit 1 or HTTP 400 marks the row `unmeasured`. Exit 2 stops the arm, because the script built a bad command. Exit 3, a refused backend on an answer, prints `deem arm stopped: backend refused` (proposed). Exit 4 triggers one recheck of health and the commit pair: a changed pair prints `deem arm stopped: model commit changed mid-run` and an unreachable server prints `deem arm stopped: server gone` (both proposed), with finished rows `partial`. A passing recheck with the same pair retries the row once, then marks it `unmeasured`. Exit 130 stops the arm as `interrupted`. No path writes a default score or verdict.
- **Records.** Each Deem call record carries the backend, the model id, the model commit, the source commit, the wall time and, for `choice`, the option order (C2).
- **Stability.** Jev uses 3 reruns with an aggregate flip rate of at most 0.10. A Deem `choice` uses 3 option orders with the same bound. A Deem `noul` or `score` has no rerun clause, and its stability is the commit pair (C4).
- **Requalification.** A keep holds for the commit pair it was measured on. A new pair reruns the keep rule in full on the same harness before any served or later use (C3).
- **Payload notice.** Jev prints its payload class, planned calls and estimated input tokens, never a dollar figure. Deem prints "nothing leaves the machine", planned calls and an estimated wall time at the measured p50 (C14).
- **No secret.** Jev resolves its own key. Deem takes none, and the client sends no bearer.
- **Neither backend.** The zero-call output is byte-identical to a run without switches, and the script exits 0. Each first live form ships a fixture proving that (N-deepseek-09-2).

### R1. Offline advisor tie-break, census first

| Field | Record |
|---|---|
| **Verdict** | **build-now, unchanged, rank 1.** The census needs no backend, no key and no label, and it tells the operator with a number whether any classifier can earn a `keep` here. Change from BASE2: a `--deem` arm joins the `--jev` arm. |
| **What the classifier judges** | A `choice` over the passing top skill, its `ambiguousWith` members and an explicit `none` key, each option described by the skill's projection description. Jev: `jev choice` in the Python `jev-cli` 0.6.2. Deem: `cli-deem choice` (proposed), which posts the descriptions as Deem's `options` list and maps the pick back to its key. |
| **Seam** | `ambiguity.ts:22-36`, `:44-58`, reopened today. The eval template, gold match and env are BASE2's, also reopened (`score-outcome-rerank.mjs:40-51`, `capture-scorer-eval-baseline.mjs:35-46`, `:70-76`). Deem's option cap: `deem_server.py:166`, `:222-230`. |
| **Value** | Which skill goes first on a near-tie, decided with a number. A Deem `keep` is the only way R3's live form comes back (row 1). A `kill` on either backend closes that backend's served forms. |
| **Metric, baseline and harness** | BASE2's: holdout top-1 53/70, ambiguity slice 18/24 and full corpus 152/195 (`scorer-eval-baseline.json`). The census is the harness. The four-outcome rule per backend, with option orders as Deem's stability clause (C4). A backend comparison only on identical decided rows, with a one-sided bound (C6). |
| **Savings** | None directly: it is a measurement. It decides whether R3's served order is worth building. |
| **Cost, latency and privacy per backend** | Census: 0 calls. Jev arm: at most 723 calls plus 1 `jev auth test`, 90 s per call (proposed), with corpus prompts and skill descriptions leaving the machine (low). Deem arm: at most 723 local calls, about 47 s at the measured 65.6 ms p50 (derived), nothing leaving the machine. Clusters of more than 25 members print as unmeasured on Deem. |
| **Two-backend gate and no-backend behavior** | `--jev` and `--deem` (proposed), each its own. With both set and both passing, both arms run as separate columns, because the point is two measurements. Each gate follows the shared contract. With neither switch, or with both gates failing, the census prints byte-identical and nothing is spawned, exactly as today. |
| **Smallest slice** | The census alone: `score-jev-tiebreak.mjs` (proposed in 002) with its test cases 1 to 4, about 180 LOC (BASE2). The Deem arm adds about 60 to 100 LOC and three stub-server test cases (estimate). To undo this: delete the script, its test and its reports. |
| **Keep or kill rule** | BASE2's four-part `keep` per backend: an exact one-sided sign test at 0.05 over decided rows, a win over each comparator, no fall in right@3 and an aggregate flip rate of at most 0.10, which for Deem is the order-flip rate. `kill` means the sign test favors the scorer. A Deem `keep` holds only for its commit pair (C3). |
| **Fitness checklist** | Passes all 15, as in BASE2. Q12: the Deem arm adds no package, only 008's client. Q14: 002 is amended, not replaced. |
| **Confidence** | Confirmed from code or counts: the cluster rule, the baselines and the movable bound (BASE2), the wire, the 26-option cap, Deem's determinism and its latency on synthetic input. Inferred: that a Deem `choice` is stable across option orders and that few clusters exceed 25 members. The census column and the arm confirm or refute both. |
| **Lineage agreement** | glm-01 (W1) and mimo-03 (W1, steered) put a Deem scorer on this census. swe-10 (W4) made the census the first PR. glm-02 and deepseek-05 (W2) wrote the `:92` amendment separately. Against BASE2: agrees on the verdict and extends it with a second arm. |
| **Citation check** | Resolved (section 15, groups A, C, E and K). |

### R19. Compaction recall census, then an offline deletion arm (R11 folded in)

| Field | Record |
|---|---|
| **Verdict** | **build-now for the zero-call census, later for the arm, unchanged, rank 2.** Change from BASE2: Deem becomes the preferred arm backend, with new preconditions of its own (C9). |
| **What the classifier judges** | Nothing in the census. The later arm asks two `noul` questions per unpinned tool call, keep the call and keep its result, in batched `run` requests. Deem: `cli-deem run` (proposed) with Deem-shaped questions, at most 32 calls a batch. Jev: `jev run`, as BASE2 set it. |
| **Seam** | Host compaction as the transcripts record it, and the recorded `SessionStart:compact` brief (BASE2). PreCompact stdout is not injected (`compact-inject.ts:8`). The vendored procedure: `compact.ts:76-100`, `:120-135`, `:284-285`, `request.ts:69-83`. Deem's question cap: `deem_server.py:656-659`, `:995-997`. |
| **Value** | 226 boundaries, each a wait the operator absorbs, p50 about 104 s (005 `spec.md:66`). The census says with numbers whether a deletion pass can fit these sessions and what the stock summary and the brief keep. |
| **Metric, baseline and harness** | BASE2's census columns. No harness exists besides the census. |
| **Savings** | UNKNOWN until the census prints its offline reduction upper bound, which caps the arm's saving. |
| **Cost, latency and privacy per backend** | Census: 0 calls, nothing leaves the machine. Deem arm: one call per batch of at most 32 tool calls, with latency and fit at fitted-state size UNKNOWN (question 41), nothing leaving the machine. Jev arm: one call per batch, the fitted session history leaving the machine, the highest payload class. |
| **Two-backend gate and no-backend behavior** | The census has no switch and never spawns `jev` or `cli-deem`. The later arm: `--deem` or `--jev` (proposed), preferring Deem when both pass, because the payload is the operator's own sessions. A Jev arm keeps BASE2's redaction and payload preconditions. With neither, the census is byte-identical and the host's compaction is untouched, exactly as today. A live form, if ever built, uses only `precompute`, never starts the server and falls back to the stock summary on any error. |
| **Smallest slice** | The census over 10 to 20 sessions: `score-compaction-recall.mjs` (proposed in 005), about 690 to 730 LOC plus fixtures (swe-02, lineage estimate). To undo this: delete the script directory and its report. |
| **Keep or kill rule** | BASE2's: the census is void on unknown shapes in more than half the sessions or on any transcript text in its report. The arm is not built on `fit_throws>=50% OR offline_reduction_upper_bound<0.25` or on kept tokens above 3 times stock. A Deem arm also requalifies on a commit change. |
| **Fitness checklist** | Q1 fails until the census runs, acceptable because the census is the slice. Q9 and Q11 bind the Jev arm only. Q7 binds any live form. The rest pass. |
| **Confidence** | Confirmed: the boundary counts (BASE2), PreCompact's stdout rule, the inert default and the question cap. Inferred: that the 0.8B can read a fitted state near 25,000 tokens. One timed long-state call would confirm it (question 41). |
| **Lineage agreement** | swe-04 (W2) designed the arm as a 005 amendment behind the stop line. grok-03 (W1) proposed the two-`noul` shape and misread the default (K1). deepseek-08 (W3) added the `precompute` route. glm-03 (W2) ran it through its threshold. Against BASE2: agrees, and corrects one lineage claim. |
| **Citation check** | Resolved (section 15, groups D and H). One lineage drift: the swe lead's `compact.ts:283-284` sits at `:284-285`. |

### R2. Goal verifier: Pi census and zero-call arms, then an opt-in shadow

| Field | Record |
|---|---|
| **Verdict** | **next for the zero-call Pi census and arms, later for the model arm and shadow mode, unchanged, rank 3.** Change from BASE2: Deem becomes the preferred arm backend, and the egress precondition drops for it (C10). |
| **What the classifier judges** | Nothing in the slice. The later arm is a `choice` over `met`, `not_met` and `blocked`: Deem through `cli-deem choice` over 3 option orders, or Jev through `jev choice` over 3 reruns. |
| **Seam** | BASE2's: `goal-context.ts:221-244`, `goal-core.cjs:290-297`, `:596-620`, `opencode-goal.js:2197-2230`, `:2378-2380`, all reopened today. |
| **Value** | BASE2's: 1,457 hidden verdict nudges in 28 Pi sessions, 253 of them from the truncation branch the clamp feeds. |
| **Metric, baseline and harness** | BASE2's Pi census and three zero-call arms. |
| **Savings** | Up to 253 nudge turns if the clamp fix alone removes them (BASE2's count). UNKNOWN until the arms run. |
| **Cost, latency and privacy per backend** | Slice: 0 calls. Deem arm: at most 150 local calls. Jev arm: at most 150 calls, with the operator's conversation leaving the machine (highest). A shadow mode: one call per verification inside the 30 s plugin budget (`opencode-goal.js:49`). |
| **Two-backend gate and no-backend behavior** | The slice has no switch. The later arm: `--deem` or `--jev` (proposed), Deem preferred for privacy. The shadow mode: `OPENCODE_GOAL_VERIFIER=jev` or `=deem` (proposed), each with its own check once per session, the Deem check at 500 ms and never starting the server. A failed check prints one enablement line and behaves exactly as `heuristic`. With neither backend, every verdict equals today's. A Pi form never awaits inside `turn_end`. |
| **Smallest slice** | The Pi census: `count-pi-goal-nudges.mjs` (proposed in 003), 80 to 120 LOC. To undo this: delete the script. The plugin stays untouched. |
| **Keep or kill rule** | BASE2's: `stop: fewer than 30 rows`. If the tail-window arm meets the stop rule, the clamp fix goes to the owners and no model arm is built. A later arm keeps only under 003's REQ-006, with the order-flip clause for Deem. |
| **Fitness checklist** | BASE2's: Q1 fails until the rows exist, Q7 binds Pi, Q9 binds the Jev arm only and Q11 leaves the heuristic in authority. |
| **Confidence** | BASE2's. The Deem arm's accuracy stays UNKNOWN until R21 reports. |
| **Lineage agreement** | grok-04 (N-grok-04-2) prefers Deem for this arm. deepseek-10 amended 003. No lineage recounted the Pi nudges. Against BASE2: agrees and extends. |
| **Citation check** | Resolved (section 15, group K). The Pi nudge counts are BASE2's, not recounted. |

### R23. `cli-deem` Node client in a new `cli-classifier` hub, then the `cli-jev` move (new)

| Field | Record |
|---|---|
| **Verdict** | **next, new, rank 4.** D2 requires the hub and the transport, every Deem arm needs the client and its first slice makes no call to the real server. |
| **What the classifier judges** | Nothing itself. It carries `noul`, `choice`, `score` and `run` to the local Deem and returns `jev-cli`'s answer shape. |
| **Seam** | Deem's request shape (`deem_server.py:519-550`), answer shape (`:594-621`), health (`:772-777`), caps (`:222-230`, `:656-659`) and lock (`:201`, `:236`). `jev-cli`'s answer shape (`__init__.py:389-393`). For the move: `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19`, `:37`, `resolve.cjs:36-44`, `serving-closure.manifest.json:5-13` and `dispatch-audit.mjs:46`, `:234`, `:237`. |
| **Value** | Any script or agent can ask the local Deem through one transport and read the answer as it reads `jev`'s, with no second parser. |
| **Metric, baseline and harness** | The client's tests: each refusal case exits with its code and line (a stub, a wrong model, a refused connection, an HTTP 400 or a request over a cap). A translation round trip holds. Baseline: 0 runtime Deem callers in the repository. For the move: the 7 canary cases and the hub-routing scenarios route the same before and after. |
| **Savings** | None directly: an enabler. |
| **Cost, latency and privacy per backend** | Deem only: about 65 to 80 ms a call plus a 26 ms node spawn (`deem-local.md:82`, `:85`). Nothing leaves the machine. |
| **Two-backend gate and no-backend behavior** | No switch of its own: it is a transport, and each caller keeps its own switch. `cli-deem health` implements the Deem check. With no server, every subcommand exits 4 and changes nothing. With neither backend, no caller invokes it. |
| **Smallest slice** | 008: the new hub root and the `cli-deem` packet with `cli-deem.mjs` (proposed, about 170 LOC by swe-01's estimate) and its tests against an in-test fake server (about 150 LOC, estimate). To undo this: delete `.skilled/skills/cli-classifier/` and regenerate the advisor indexes. |
| **Keep or kill rule** | Kill 008 if the per-hub check fails or a replayed Deem request routes elsewhere. Retire `cli-deem` and never build 009 if no Deem arm prints a result the operator keeps. |
| **Fitness checklist** | Q6, a new file and a new hub: required by D2, with four Planned callers (002, 003, 005, 006). The red flag "a wrapper that only forwards arguments" does not fire, because the client translates fields and enforces caps (my judgment). Q12: Node standard library only. Q13: one hub for both classifier transports, per D2. Q14: 009 moves a Planned surface only after an evidence gate. |
| **Confidence** | Confirmed: the wire gap, the field names and the caps. Inferred: that the move routes identically, which the canary replay confirms. |
| **Lineage agreement** | swe-01 (W1) designed the client, glm-01 (W1) showed the wrapper is not thin and grok-02 (W1) wanted a translator (disagreement 1). deepseek-06 (W2) and grok-07 (W3) reached the client after cross-reading. deepseek-07, swe-07 and glm-02 counted the hub. New against BASE2. |
| **Citation check** | Resolved (section 15, groups A, C and E). |

### R21. Gate 3 calibration

| Field | Record |
|---|---|
| **Verdict** | **next, rank 5.** Change from BASE2: the Deem half runs on every `--deem` run, because it is free and it gives every Deem-backed recommendation its first measured accuracy set. The Jev half stays conditional on `underpowered`. |
| **What the classifier judges** | One `noul` per labeled prompt: does this request require writing a file (proposed wording). Deem through `cli-deem noul`, Jev through `jev noul --provider P`. |
| **Seam** | The Gate 3 labels in `labeled-prompts.jsonl` (127 `yes` and 68 `no`, recounted today) and the classifier's archived F1 of 0.9843. |
| **Value** | Deem's first local accuracy, F1, Brier score, 5-bin ECE and fitted temperature, plus a latency record on real prompts. For Jev, a latency and a calibration when a key exists. |
| **Metric, baseline and harness** | Accuracy, F1, Brier and ECE beside 0.9843. A calibration, not a race (BASE1 row 21 stands). |
| **Savings** | None directly: a measurement. |
| **Cost, latency and privacy per backend** | Deem: 195 local calls in one pass, about 12 s (derived), nothing leaving the machine. Jev: about 585 calls over 3 reruns, with corpus prompts leaving the machine (low). |
| **Two-backend gate and no-backend behavior** | No switch of its own: it runs under R1's `--deem` and `--jev` gates. With neither, nothing runs and the census is unchanged. |
| **Smallest slice** | About 40 to 60 LOC inside `score-jev-tiebreak.mjs` (BASE2), plus about 20 for the temperature fit (estimate). To undo this: remove the branch. |
| **Keep or kill rule** | None of its own: it reports numbers. No threshold on raw Deem probabilities is set before it runs (N-grok-01-2). A Deem result holds for its commit pair only. |
| **Fitness checklist** | All pass. The scope it adds to 002 is one branch. |
| **Confidence** | Confirmed: the label counts. Inferred: that accuracy on a write-intent question predicts accuracy on other judgments, which each arm's own labels would test. |
| **Lineage agreement** | grok-01 (W1) set calibration before any threshold. mimo-03 (W1, steered) designed the comparison on these rows. glm-01 (W1) chose the census rows as the only harness. Against BASE2: extends it. |
| **Citation check** | Resolved: the label counts were recounted today (section 15, group K). |

### R20. Goal-criteria lint

| Field | Record |
|---|---|
| **Verdict** | **next, rank 6, down from 4.** The lint is unchanged, and the later model arm may run on either backend, Deem preferred (C12). |
| **What the classifier judges** | Nothing in the lint. The later arm asks two `noul` questions per criterion: can it be checked from its own text, and does it name one observable result. |
| **Seam** | `check-goal.cjs:44-49` and the parser BASE2 cites. The rules at `sk-create-goal/SKILL.md:121-122`, reopened today. |
| **Value** | BASE2's: a criterion the judge cannot check leaves completion open. |
| **Metric, baseline and harness** | BASE2's: about 100 labels under an adopted rubric, and the lint's per-rule precision and recall. |
| **Savings** | UNKNOWN: fewer criteria the native judge cannot check. |
| **Cost, latency and privacy per backend** | The lint: 0 calls. A Deem arm: about 200 local calls, no reruns. A Jev arm: about 600 calls. Committed text only (low). |
| **Two-backend gate and no-backend behavior** | The lint has no switch, always exits 0 and leaves `check-goal.cjs` byte-identical. The later arm: `--deem` or `--jev` (proposed), each with its gate. With neither, the lexical findings print with a skip line, exactly as the lint alone. |
| **Smallest slice** | The rubric, then `lint-goal-criteria.cjs`, `score-goal-lint.cjs`, the test and the labels, about 370 LOC (swe-04, lineage estimate). To undo this: delete the scripts, the test and the labels. |
| **Keep or kill rule** | BASE2's: stop when the labeled violation rate under the adopted rubric is under 5%. A later arm keeps only with an F1 gain of at least 0.2 over the lint and a precision of at least 0.8. For Deem, stability is the commit pair. |
| **Fitness checklist** | Q1 fails until the labels exist, acceptable because the labels are the slice. |
| **Confidence** | BASE2's. |
| **Lineage agreement** | deepseek-03 (W1, unsteered) kept `check-goal.cjs` read-only from its own read. deepseek-10 (W4) and swe-09 keep the lint free of any classifier. Against BASE2: agrees on the tier and drops two ranks. |
| **Citation check** | Resolved for `check-goal.cjs:44-49` and `sk-create-goal/SKILL.md:110`, `:121-122` (groups F and K). The parser and walker lines are carried from BASE2. |

### R24. Citation-drift advisory scan (new)

| Field | Record |
|---|---|
| **Verdict** | **later, new, rank 22.** The judgment is clean and its labels can be manufactured, but no reader is named and the dead share counted today is small. |
| **What the classifier judges** | One `noul` per citation: does the cited window still show what the citing sentence claims. Either backend, Deem preferred. |
| **Seam** | None today: nothing checks skill-doc citations. swe-06 proposed `sk-doc/shared/scripts/cite-drift-scan.mjs` (proposed). |
| **Value** | Agents follow a citation to the wrong lines less often. |
| **Metric, baseline and harness** | Counted today: 500 citations by a path-aware pattern, 228 in range and 4 past the end of their file. Drift is unmeasured. Harness: about 40 labeled citations, some made by drifting a citation on purpose (swe-06). |
| **Savings** | UNKNOWN. swe-06 estimates 8 to 15 hours for a full manual audit (lineage-reported). |
| **Cost, latency and privacy per backend** | The dead check: 0 calls. Deem: about 228 local calls, one per in-range citation, about 15 s (derived). Jev: the same count, with committed doc text leaving the machine (low). |
| **Two-backend gate and no-backend behavior** | Its own `--deem` and `--jev` (proposed). swe-06's single `--cite-backend` flag, valued `deem`, `jev` or `none`, becomes these two switches (row 80). The dead check always runs, with no model. With neither backend it prints the dead count and `cite-scan: skipped (no backend)` (proposed), and exits 0. |
| **Smallest slice** | The dead check with the resolution rule, about 100 LOC (estimate), no model. To undo this: delete the script. |
| **Keep or kill rule** | Kill below a precision of 0.8 on the labeled set, or when no reader acts on a report within a month of its first run (proposed). |
| **Fitness checklist** | Fails "a report nobody reads" until sk-doc's owner names the reader, which is why it is later. |
| **Confidence** | Confirmed: the counts. Inferred: the drift rate, which the labels would measure. |
| **Lineage agreement** | swe-06 (W2) designed it and rated it next, gated on about 40 labels. This file lowers it to later, because no reader is named. mimo-08 (W3) made it its workflow after reading swe-06. glm-05 cited it. New against BASE2. |
| **Citation check** | Resolved, with swe-06's count corrected (K10). |

**Promote when.** sk-doc's owner names the reader (a validator advisory line or a periodic report) and about 40 labels exist.

### R25. Stage-2 leaf-route replay (new)

| Field | Record |
|---|---|
| **Verdict** | **later, new, rank 23.** A deterministic replay is the cheaper fix for leaf routing, and its counted prize is small. |
| **What the classifier judges** | Nothing in the replay. A later tie-break among leaves could be a `choice`, only where the replay ties (N-swe-03-1). |
| **Seam** | The machine blocks in hub `ROUTER.md` files, beside the compiled stage-1 machinery (glm-03, from swe-03's trace). |
| **Value** | The main AI stops reading `ROUTER.md` to pick leaves. |
| **Metric, baseline and harness** | Baseline: about 119 KB a week of `ROUTER.md` reads (K7, lineage-reported). Harness: the replay over sk-doc's 34 playbook scenarios with typed `expected_leaf_resources`, scoring leaf-set F1 and exact match (swe-03, lineage-reported). |
| **Savings** | At most about 30,000 tokens a week (estimate). |
| **Cost, latency and privacy per backend** | The replay: 0 calls. A later tie-break: one call per scenario, 34 for sk-doc, about 2 s on Deem (swe-03's estimate). Jev sends the task text off the machine. |
| **Two-backend gate and no-backend behavior** | swe-03's single `--backend` flag, valued `deem`, `jev` or `none`, becomes two switches (row 80). With neither, the deterministic keyword arm runs alone and no classifier arm is printed. |
| **Smallest slice** | `leaf-route-replay.cjs` (proposed by swe-03), offline, zero calls, with a keyword arm and a hand-recorded prose-model arm. To undo this: delete it. |
| **Keep or kill rule** | Fixed before the build: a classifier arm is built only if it beats the keyword arm on leaf-set F1 over the 34 rows (swe-03's gate). The replay itself is dropped if its keyword arm scores below the hand-recorded prose-model arm (proposed). |
| **Fitness checklist** | Q1 is met by the gold rows. It fails on value: the saving is small against a p50 carry of 384,219 tokens per message. |
| **Confidence** | Lineage-reported baseline. |
| **Lineage agreement** | swe-03 (W1) designed the replay. glm-03 (W2) called it the cheaper fix, citing swe-03. mimo-07 (W3) counted its baseline. New against BASE2. |
| **Citation check** | Not reopened beyond the lead-corrected counts. |

**Promote when.** The routing owner asks for a stage-2 replay, or a recount shows `ROUTER.md` reads well above about 119 KB a week.

### R26. Validator-residue flagger (new)

| Field | Record |
|---|---|
| **Verdict** | **later, new, rank 24.** Correctness and traceability have no validator, but the review rows label positives only. |
| **What the classifier judges** | One `noul` per passage and category, correctness or traceability, over a document that passed its validators. |
| **Seam** | The deep-review findings tables, as a column beside severity and dimension (glm-04). |
| **Value** | A reviewer sees candidate defects the validators cannot see. |
| **Metric, baseline and harness** | 2,075 finding rows (320 correctness and 337 traceability) and 62 post-pass findings a week (mimo-02, lineage-reported). No labeled negatives. |
| **Savings** | UNKNOWN. |
| **Cost, latency and privacy per backend** | One call per passage and category. Deem: local. Jev: document text leaves the machine. |
| **Two-backend gate and no-backend behavior** | Its own switches. With neither, the review table is exactly as today, with no column. |
| **Smallest slice** | A labeled set of passages judged clean, zero calls. |
| **Keep or kill rule** | glm-04's: precision below 0.8, or true flags a week below the reading cost of the false ones, kills it. |
| **Fitness checklist** | Fails Q1 until negatives are labeled. |
| **Confidence** | Lineage-reported counts. |
| **Lineage agreement** | mimo-02 (W1, steered) counted it. glm-04 (W3) chose it, citing mimo-02. mimo-08 (W3) measured its population, which its lead corrected (K9). New against BASE2. |
| **Citation check** | Not reopened, lineage-reported. |

**Promote when.** About 50 passages judged clean exist beside the finding rows, and a reviewer names what the column changes.

### R3 to R18 and R22, carried from BASE2

Their records stand in BASE2 section 11. Round 3 changes only the notes below.

| ID | Verdict | Round-3 note | Promote when |
|---|---|---|---|
| R3 | later | Row 1 folds in as its live Deem form. A warm Deem call fits the advisor budget on synthetic input (C11) | R1 prints `keep` on the backend the live form uses, and a health-plus-call p95 measured inside the advisor child fits the budget, with the server never started by the hook |
| R4 | later | Deem removes egress for session excerpts. No gold | BASE2's condition |
| R5 | later | None | BASE2's condition |
| R6 | later | None | BASE2's condition |
| R7 | later | None | BASE2's condition |
| R8 | later | Deem removes egress for archived findings. No gold | BASE2's condition |
| R9 | later | None | BASE2's condition |
| R10 | later | None | BASE2's condition |
| R12 | later | Deem removes latency on the routing path, not the missing gold or the one-shape stdout contract | BASE2's condition |
| R13 | later | None | BASE2's condition |
| R15 | later | None | BASE2's condition |
| R16 | later | None | BASE2's condition |
| R17 | later | None | BASE2's condition |
| R18 | later | None | BASE2's condition |
| R22 | later | With Deem, draft prose stays on the machine (C13) | BASE2's condition |
| R11 | folded into R19 | None | Not separately promotable |
| R14 | drop, row 41 | None | Only if a runtime caller of `compareNextFocusShadow` exists and a focus gold is named |

### Lineage ideas and where they went

The lineages named 77 new ideas (counted today): grok 17, deepseek 26, mimo 13, swe 12 and glm 9. swe-02's five residues (R-a to R-e) carry no N id and are covered in section 6.

| N id | Idea | Disposition | Where |
|---|---|---|---|
| N-grok-01-1 | Reopen the 9B | Dropped | Row 107 |
| N-grok-01-2 | No threshold before a calibration | Adopted | R21, C7 |
| N-grok-02-1 | A translator inside `jev-cli` | Dropped, superseded by grok-07 | Row 76 |
| N-grok-02-2 | npm `jevctl` against Deem through `TYPESAFE_BASE_URL` | Dropped | Row 77 |
| N-grok-03-1 | Deem as an MCP server for context reduction | Dropped | Row 78 |
| N-grok-03-2 | R19's arm as two `noul` per call with the missing-answer throw | Folded into R19's later arm. The throw already exists (K1) | R19 |
| N-grok-04-1 | No live hook revived on the warm p95 alone | Adopted as a drop | Row 79 |
| N-grok-04-2 | R19's and R2's arms prefer Deem when its check passes | Adopted | C9, C10 |
| N-grok-05-1 | A `choice` over the 5 registry ids | Dropped | Row 89 |
| N-grok-05-2 | No classifier on CLEAR or inside `/prompt:improve` | Adopted as a drop | Row 90 |
| N-grok-06-1 | No `choice` in place of the intent scorer | Adopted as a drop, premise corrected (K3) | Row 84 |
| N-grok-06-2 | No classifier on the sk-design checklist, diagnosis table or gate | Adopted as a drop | Row 91 |
| N-grok-07-1 | A separate client for Deem | Adopted | R23 |
| N-grok-08-1 | Keep R1's flip cap over a Tare gate | Adopted as a drop | Row 100 |
| N-grok-08-2 | A 3-rerun flip print before any Deem threshold | Void | K13, row 101 |
| N-grok-09-1 | A vendor-claim table | Dropped as a build, kept as caveats | Row 99, section 16 |
| N-grok-10-1 | Ship no new classifier phase | Rejected: D2 requires the phases | K2 |
| N-deepseek-01-1 | One Deem availability probe | Adopted, amended | Section 3, C1 |
| N-deepseek-01-2 | Probe budgets of 2,000 ms and 500 ms, never starting the server | Adopted | Section 3, C1 |
| N-deepseek-01-3 | Skip lines and a backend preference | Adopted | Gate contract |
| N-deepseek-02-1 | The lifecycle as docs over `deem-ctl` | Adopted | R23, the `cli-deem` packet |
| N-deepseek-02-2 | A backend allowlist plus the model pin | Adopted | Section 3, K15 |
| N-deepseek-02-3 | The commit pair on every record | Adopted | C2 |
| N-deepseek-02-4 | The idle footprint as an operator decision | Carried as a question | Question 45 |
| N-deepseek-02-5 | A smoke decision on start | Superseded in part by the live update proof (`deem-ctl:180-189`) | Section 3 |
| N-deepseek-03-1 | A criterion-quality advisory | Folded into R20's later arm | R20 |
| N-deepseek-03-2 | A placeholder-in-spirit advisory | Dropped, as its own lineage rated it | Row 95 |
| N-deepseek-03-3 | An `AC_COVERAGE` existence check with no model | Owner report for spec-kit | Section 6, question 48 |
| N-deepseek-04-1 | The two-path budget rule | Adopted as a measurement rule | Section 5, C11 |
| N-deepseek-04-2 | PreCompact work off the critical path | Adopted as a constraint | R19 |
| N-deepseek-04-3 | Row 1 revives only on connect plus call and R1's `keep` | Adopted | C11, section 4 |
| N-deepseek-05-1 | A flip comes from a changed input, order or commit | Adopted | C4 |
| N-deepseek-05-2 | The `:92` amendment in 002 | Adopted | Section 14 |
| N-deepseek-06-1 | A separate Node client | Adopted | R23 |
| N-deepseek-06-2 | Two probes, and `custom` is not a Deem check | Adopted | Gate contract |
| N-deepseek-07-1 | The minimum hub | Adopted | R23, phase 008 |
| N-deepseek-07-2 | An ordered move | Adopted | Phase 009 |
| N-deepseek-08-1 | A background `precompute` pass | Folded into R19's later arm, behind question 18 | R19 |
| N-deepseek-08-2 | Deem kill lines | Adopted | C8, section 10 |
| N-deepseek-09-1 | A failure table for both backends | Adopted | Gate contract |
| N-deepseek-09-2 | A no-behavior-change fixture with the first live form | Adopted | Gate contract |
| N-deepseek-10-1 | The two-backend amendments to 002, 003, 005 and 006 | Adopted with changes | Section 14 |
| N-deepseek-10-2 | The hub step decides the third probe | Resolved: the `cli-deem` binary is the shared probe | R23, row 110 |
| N-mimo-01-1 | Tool-output pruning | Dropped | Row 86 |
| N-mimo-01-2 | Re-read avoidance | Dropped | Row 86 |
| N-mimo-02-1 | A validator-residue flagger | Kept as later | R26 |
| N-mimo-03-1 | A two-backend comparison on the same rows | Adopted | C6, R1, R21 |
| N-mimo-04-1 | A compaction arm | Folded into R19's later arm | R19 |
| N-mimo-04-2 | A re-read ledger | Dropped, as a classifier and as a ledger | Row 86 |
| N-mimo-04-3 | A hook retention cap | Dropped | Row 87 |
| N-mimo-05-1 | A marked-week sk-prompt usage tally | Dropped: its lead's count gives about 3.5 runs a week, and the docs fix waits on no finer count | Row 89 |
| N-mimo-06-1 | A replay of the 53 sk-design playbook scenarios | Not adopted here: a routing check for the routing owner | Row 93 |
| N-mimo-07-1 | `/doctor:classifier` | Dropped | Row 98 |
| N-mimo-08-1 | A citation-drift label workflow | Kept as later | R24 |
| N-mimo-09-1 | The measurement-first order | Adopted, with the client and the move inserted | Section 10 |
| N-mimo-10-1 | Kill criteria as printed numbers | Adopted | Section 10 |
| N-swe-01-1 | `cli-deem` as a thin standard-library client | Adopted | R23 |
| N-swe-01-2 | The `custom`-provider wrapper | Dropped | Row 75 |
| N-swe-01-3 | A translator or proxy | Dropped | Row 76 |
| N-swe-03-1 | A leaf-intent `choice` for sk-doc | Folded into R25 | R25 |
| N-swe-03-2 | An offline leaf-route replay runner | Kept as later | R25 |
| N-swe-04-1 | An offline deletion arm as a 005 amendment | Folded into R19's later arm | R19, section 14 |
| N-swe-05-1 | A deterministic port of the pseudocode routers | Dropped | Row 94 |
| N-swe-05-2 | A classifier on the zero-score fallback | Dropped | Row 94 |
| N-swe-06-1 | A citation-drift advisory scan | Kept as later | R24 |
| N-swe-07-1 | The hub mint, gated on caller count | Adopted in two phases | R23, phases 008 and 009 |
| N-swe-08-1 | The probe contract now, a shared file at the third caller | Adopted: the binary is the shared file | R23, row 110 |
| N-swe-10-1 | The census as the first PR | Adopted | R1 |
| N-glm-01-1 | The 0.8B as the census's second scorer | Adopted as R1's `--deem` arm | R1, C5 |
| N-glm-01-2 | Answer provenance and requalification | Adopted | C2, C3 |
| N-glm-02-1 | Mint the hub on a second caller | Adapted: the hub is minted with the client, and the move waits on a kept result | R23 |
| N-glm-02-2 | 002's one-word amendment and the census-internal scorer | Adopted | Section 14 |
| N-glm-03-1 | The stage-2 deterministic replay | Kept as later | R25 |
| N-glm-03-2 | A four-part threshold for context proposals | Used as a reading aid, not adopted as a rule, because the checklist is the operator's | Section 5 |
| N-glm-03-2b | A retention cap on stored hook output | Dropped | Row 87 |
| N-glm-04-1 | The sk-prompt docs fix | Owner report | Section 7 |
| N-glm-04-2 | The correctness and traceability residue flagger | Kept as later | R26 |

---

## What Not To Build

This is the workflow's eliminated-alternatives section. Rows 1 to 72 stand as BASE1 and BASE2 wrote them, except the rows listed after the table. Rows 73 to 110 consolidate every idea the five lineages dropped or ruled out, plus the lineage ideas this synthesis drops against their lineage's own verdict (rows 76, 86, 87, 89, 93, 94, 98 and 101) and two drops this synthesis adds (rows 102 and 108). Rows 101, 104 and 109 are dead ends, and the rest are dropped ideas. Totals: 99 drop rows and 11 dead ends.

| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |
|---|---|---|---|---|---|
| 73 | Lowering the six-hourly update cadence as the reproducibility fix | Any cadence switches the weights before a quality comparison. A keep survives an update only through requalification (C3), and polling costs nothing | Red flag "a symptom fix" | `deem-ctl:175-182` (live), the plist's `StartInterval` of 21,600 s, `deem-local.md:20` | glm-01, glm-05 (its row 73) |
| 74 | A Tare-harness quality gate inside `deem-ctl update` | It needs labels this repository lacks and a harness it does not own. The card's 96.3% and Tare's 0.6788 are vendor claims of different kinds. Requalification per feature plus `deem-ctl rollback` covers a release that answers worse | Q1, Q12 | `deem-local.md:52-53`, `deem-ctl:204-225` | glm-01, glm-05 (its row 74) |
| 75 | The `--provider custom` wrapper as `cli-deem`, with a placeholder or stored key | It cannot serve `choice` or `score`, it changes the answer fields and it pays key ceremony for a server with no authentication. The dispatch guard refuses its inline key, and `jev auth set --provider custom` would store a key that authenticates nothing. swe-01 kept it as a documented path for `run`-only callers, which the guard also blocks on an agent's command line | Q6, red flag "a wrapper that only forwards arguments" | `__init__.py:90-109`, `:253-265`, `:280`, `:364-369`, `:389-393`, `dispatch-rule-checks.mjs:114`, `:287-290` | swe-01 (N-swe-01-2), grok-02, deepseek-06, glm-02, glm-05 (its row 75) |
| 76 | A translator: a patched `jev-cli` wheel, a JSON-rewriting proxy or a `deem` branch in `provider_request` | A patch forks a pinned package, and the next upgrade overwrites it. A proxy is a second supervised daemon for four field renames. Both keep the 60 s call timeout | Q6, Q12, Q14 | `__init__.py:221-235`, `:288`. D1 pins `jev 0.6.2` (`../goal.md:49`) | swe-01 (N-swe-01-3), grok-02 (N-grok-02-1, rated next), grok-07, deepseek-06, glm-05 (its row 76) |
| 77 | Driving the npm `jevctl` at Deem through `TYPESAFE_BASE_URL`, or keeping it as a third hub transport | D1 pins the Python `jev-cli`. `jevctl`'s exit 2 is a tripped `--fail-on` rather than a usage error. Its schema requires `criteria` before the SDK sees the question | Q12, Q14 | npm `errors.ts:2-9` (BASE2 row 46). The schema claim is grok-02's (lineage-reported) | grok-02 (N-grok-02-2), grok-07 |
| 78 | Deem as an MCP server for context reduction, or as a probe target | Its tool schemas add about 2,225 bytes to every tool list, it has no health route and its tools take the state on every call | Q3, Q6 | `deem_mcp.py:60`. The byte count is grok-03's (lineage-reported) | grok-03 (N-grok-03-1), deepseek-01, swe-08, grok-07, glm-03, glm-05 (its row 79) |
| 79 | Reviving a live hook on the warm p95 alone | Rows 1, 5, 40, 44 and 69 rest on gold, seams or a measured win as well as speed. Row 1 reopens only to later, behind R1's `keep` | Q1, Q3 | Section 4, `deem-local.md:83-87` | grok-04 (N-grok-04-1), deepseek-04 (N-deepseek-04-3), deepseek-05, glm-05 |
| 80 | A global Deem switch (deepseek-01's `DEEM_ENABLED`), or one `--backend` flag shared by several phases or arms | D1 and BASE1 row 42 require one switch per feature. A shared flag cannot state a per-feature preference and hides which backend produced a row. swe-03's and swe-06's single flags become two switches here | Q7, Q8 | `../goal.md:49`, BASE1 row 42 | deepseek-01, deepseek-10. swe-03 and swe-06 by this synthesis |
| 81 | Silent failover between backends | It changes the judging model under a result row and hides a disagreement. Each form prints its skip line instead | Q11, red flag "a default that papers over a missing value" | `deepseek/iterations/iteration-009.md:94-98` | deepseek-09. grok-08 refuses a Jev fallback for its own measurement |
| 82 | The repository supervising Deem: starting, restarting, keeping warm or evicting it from a hook or a feature | The server is the operator's (D3). A cold start takes about 10 s and a warm server holds 3,368 MB, the operator's call. A supervisor adds a daemon and breaks "with neither, exactly today" | Q6, Q7, Q10 | `deem-local.md:42-44`, `deem_server.py:1000`, `deem-ctl:109-132` | deepseek-01, deepseek-02, deepseek-08 |
| 83 | Widening the advisor's 2,500 ms kill or the PreCompact 1,800 ms budget to fit a spawning call | The constants are pinned by tests (deepseek-05, lineage-reported) and documented, no parent decision allows a change and a call from inside Node needs no widening | Q8, Q14 | `user-prompt-submit.ts:22-24`, `:105-108`, `shared.ts:12` | deepseek-05 |
| 84 | A Deem `choice` in place of a deterministic router: the compiled router's stdout path, the fused scorer, `COMMAND_INTENTS`, the sk-design mode router or `classify_intents` | Each path is deterministic with frozen failure modes, or is pseudocode no code runs. Mode routing is compiled and default-on, sk-design included | Q3, Q8, Q11 | `resolve.cjs:36-44`, `serving-closure.manifest.json:12`, `compiled-route.cjs:87-92`, `sk-design-fundamentals/SKILL.md:197` | deepseek-05, swe-03, swe-05, grok-06 (N-grok-06-1), mimo-06, glm-05 (its row 84) |
| 85 | A classifier PostToolUse filter on Bash output, on either backend | The blocker is capability, whether a command hook can replace tool output at all, plus redaction. Deem removes only the egress half | Q1, Q8 | `.claude/settings.json:210`, BASE1 row 38 | deepseek-04 |
| 86 | Tool-output pruning and re-read avoidance, by classifier or by a read ledger | No confirmed seam replaces tool output, and no gold says what a turn needed. Of 1,777 re-reads over 40 days, at most 84 remain once partial, post-compaction and pre-edit reads are set aside | Q1, Q3 | Section 5 (mimo-04, lineage-reported), BASE1 row 38 | mimo-01 (N-mimo-01-1 and N-mimo-01-2, rated later), mimo-04 (N-mimo-04-2, the ledger rated build-now), glm-03, glm-05 (its rows 80 and 88) |
| 87 | A retention cap on stored hook output | The 546.2 MB of stored `hook_success` is host-owned storage rather than carried context. No owner is named | Q8 | Section 5 (glm-03, lineage-reported) | mimo-04 (N-mimo-04-3, rated later), glm-03 (N-glm-03-2b, rated later) |
| 88 | Reranking the trigger-index lookup's candidates | No counted misrank, and the lookup is a cold synchronous CLI with a fixed exit contract | Q1, Q8 | deepseek-04 F3 and deepseek-05 (lineage-reported) | deepseek-04, deepseek-05, glm-03, glm-05 (its row 81) |
| 89 | A `choice` picker over the sk-prompt frameworks, or a standing usage census | No labeled picks exist, the prose promises 7 frameworks while the registry holds 5 and the matrix inputs are judged. Use is about 3.5 runs a week, and the docs fix needs no model and no finer count | Q1, Q3, Q4 | `sk-prompt/SKILL.md:3`, `:12`, `:38`, `:307-315`. 5 ids in `assets/framework-registry.json` (counted) | grok-05 (N-grok-05-1, rated later), mimo-05 (N-mimo-05-1, rated next), glm-04, glm-05 (its row 82) |
| 90 | A CLEAR-score classifier, or any classifier inside `/prompt:improve` | CLEAR is the skill's own 50-point sum with a 40-point threshold, and no labeled scores exist | Q1, Q3 | `sk-prompt/SKILL.md:321`, BASE2 row 63 | grok-05 (N-grok-05-2), glm-04, glm-05 (its row 83) |
| 91 | Deem or Jev on the sk-design checklist, the diagnosis table or the md-generator gate, including jev-review's five `noul` axes | The gate is a hard-failure count in code, and the 80-point `isPass` exists only in the docs (K14). No labeled design scores exist | Q1, Q8, Q11 | `validate.ts:699-701`, `:729-732`, `quality-checklist.md:29`, `:476-477` | grok-06 (N-grok-06-2), glm-04 |
| 92 | Classifiers on the other validator residue: description fit, agent tool lists and marginal DQI bands (swe-02's R-b, R-c and R-e) | Each judgment is subjective with no labels, and tool-list fit needs intent inference | Q1 | Section 6. `swe/iterations/iteration-002.md:69-72` | swe-02, swe-06 (which chose citation drift instead) |
| 93 | Publishing an sk-design routing accuracy number here, or a keyword-router replay over its playbooks | No hub Lane C run was archived, and a routing replay with no classifier belongs to the routing owner | Q1, Q8 | `sk-design/benchmark/README.md:26-27`. 58 playbook files, 53 scenarios (counted) | mimo-06 (N-mimo-06-1, rated build-now), grok-06, swe-05, glm-05 (its row 85) |
| 94 | swe-05's deterministic port of the embedded pseudocode routers, and a classifier on the zero-score fallback | A port saves nothing unless the block leaves the loaded text. 0 of 9 corpus prompts are zero-score for the packet they reach, and the corpus shows no ties | Q3, Q6 | swe-05's corpus count (lineage-reported) | swe-05 (N-swe-05-1 rated build-now, N-swe-05-2 rated later) |
| 95 | Voice, placeholder and placeholder-in-spirit flaggers | The counts behind them, 9 and 8, cover the corpus's whole life, not a week (K6). `check-goal.cjs` already checks literal template placeholders | Q3 | `check-goal.cjs:36-43`, `:46`. mimo-02's counts (lineage-reported) | deepseek-03 (N-deepseek-03-2), mimo-02, glm-05 (its row 86) |
| 96 | A template-alignment classifier | Template alignment is already mechanized, so a classifier would compete with a script, not with a reader | Q3, Q4 | `validator-registry.json` (20 authored-template rules, counted), `template-rules.json` (13 types, counted), `hvr_scan.py:17-21` | mimo-02, swe-02, glm-05 (its row 87) |
| 97 | A classifier inside `validate.sh`, `validate_document.py` or a 5 s hook guard, or one that sets or upgrades a validator's verdict | A rule's verdict is a repository fact behind a frozen exit contract, and BASE1 row 12 keeps the guards deterministic | Q8, Q11 | `check-goal.cjs:693`, `:697`, BASE1 row 12. swe-02's `validate_document.py` exit lines (lineage-reported) | deepseek-03, swe-02 |
| 98 | `/doctor:classifier`, a two-backend status command | It forwards `deem-ctl status` and `jev auth status --provider P`, and before any feature has run it prints empty records | Q6, red flag "a wrapper that only forwards arguments" | `deem-ctl:236-243`, `__init__.py:419-421` | mimo-07 (N-mimo-07-1, rated next) |
| 99 | A vendor-claim table as a feature, or any vendor figure used as a quality number | A table is not a phase. JevBench, the 96.3% card figure, Tare's flips and synthetic latency say nothing about this repository's judgments. The content survives as the caveat list in section 16 | Q1, Q6 | `deem-local.md:52`. grok-09's table (lineage-reported) | grok-09 (N-grok-09-1), grok-10 |
| 100 | A Tare conditioned permutation gate in place of R1's flip cap, or copying Tare's negation-paired accuracy, automation rate or calibration adapter | They count different events, need pairs or targets this corpus lacks or read Deem training data. For Jev the rerun cap stays. For Deem, C4 makes a plain order-flip rate the stability clause, because reruns of a deterministic server always agree. That goes further than grok-08's column-only line | Q1, Q12 | `deem-local.md:90`. grok-08's reading of the vendored Tare code (lineage-reported) | grok-08 (N-grok-08-1) |
| 101 | Dead end: a 3-rerun flip test of one fixed `choice` on Deem before any threshold | The server returned the same answer in 40 of 40 repeats, so reruns of one input measure nothing (K13) | Q2 | `deem-local.md:90` | grok-08 (N-grok-08-2, rated later) |
| 102 | Raising `DEEM_N_ORDERS` on the served instance | It is server-wide, permutes only `choice` and costs every caller 1.6 to 2.8 times the latency, while its benefit here is unmeasured. A caller that wants order averaging sends its own permuted requests | Q1, Q8 | `deem_server.py:660-666`, `:985`, `deem-local.md:91-99` | This synthesis |
| 103 | A nested `cli-jev` hub under `cli-classifier`, or an alias from `cli-jev` to its new place | A second skill-shaped `graph-metadata.json` below a root is rejected, and metadata-class hubs have no alias path. As two modes of one hub the hop count does not change (K11) | Q8, Q13 | `parent-skill-check.cjs:268-275`, `skill-hub-routing.md:51` | deepseek-07 (the alias), glm-02 (the nested form it priced) |
| 104 | Dead end: swe-07's move, which `git mv`s only `cli-usage` and then runs `rm -rf .skilled/skills/cli-jev` | It deletes the hub's other 22 files, among them `manual-testing-playbook/`, `benchmark/`, `changelog/` and `shared/`. Phase 009 moves the whole hub with `git mv` and merges the hub files | Q10 | `swe/iterations/iteration-007.md:151`, the swe lead's DEFECT line (`swe/steer.md:115`). 81 hub files against 59 in `cli-usage` (counted) | swe-07 |
| 105 | Moving `cli-jev` first and fixing its references after | The advisor loses the hub's vocabulary the moment the graph moves, and the dispatch audit's tests break before the fix. A skeleton-first order has no such window | Q8, Q10 | `compiled-route.cjs:35`, `dispatch-audit.mjs:46`, `:234`, `:237` | deepseek-07 |
| 106 | Getting a host `precompute` dispatch by installing the vendored npm plugin | BASE1 refuses the vendored plugin, and function hooks are early access. A background pass reproduces the shape without it | Q12, Q14 | deepseek-08's reading of the vendored hook types (lineage-reported). BASE1 rows 5, 6 and 43 | deepseek-08 |
| 107 | Serving the 9B this round | D3 chose the 0.8B for RAM, about 1.6 GB against 18 to 20 GB, and no shared published judgment shows the 9B beating the 0.8B on a number this repository uses | Q1, Q12 | `../goal.md:131`. grok-01's card reading (lineage-reported) | grok-01 (N-grok-01-1) |
| 108 | Pinning Deem's weights to the measured commit to keep a keep valid | D3 keeps Deem current with its releases. Requalification per commit pair (C3) and `deem-ctl rollback` keep a measured result honest without freezing the model | Q14 | `../goal.md:51`, `:131`, `deem-ctl:204-225` | This synthesis |
| 109 | Dead end: treating `compact.ts:285` as a fail-open to fix | The default is inert. Every candidate is batched or `batchCalls` throws, and a missing answer throws in `noulAnswer` (K1) | Q2 | `compact.ts:76-100`, `:110`, `:120-135`, `request.ts:69-83` | grok-03, and the swe lead's steer |
| 110 | A shared Jev or Deem client library inside 002, or a shared probe file before a third caller | 002's Out of Scope freezes it. Scripts spawn `jev` and `cli-deem` as binaries, so the binary is the shared piece | Q6, red flag "DRY this up across two call sites" | 002 `spec.md:97`, BASE1 row 27 | glm-05 (its row 78), swe-07, swe-08 |

**Baseline rows round 3 changes.**
- **Row 1** reopens to later, as R3's live Deem form (C11). A warm health check plus a `choice` costs about 20 ms and 80 ms p95 with one client, 281 ms p95 with four (`deem-local.md:83-87`). R1's `keep` stays the gate.
- **Row 5** is re-judged with measured numbers and stands. At 65.6 ms at most 27 serial calls fit the 1,800 ms budget against two questions per unpinned tool call. PreCompact stdout is still not injected (`compact-inject.ts:8`).
- **Row 25** changes by D2, an operator decision rather than the backend: a second transport mode in a new hub is required (R23). A judge command and any other new skill stay dropped.
- **Rows that gain Deem evidence without a verdict change:** 27 (row 110), 29 (D3 updates the weights, so a pinned ratchet would drift), 30 (determinism does to reruns what a cache does, C4), 38 (row 85), 40 (a warm call makes a cache pointless, deepseek-04), 42 (row 80), 68 (moot for Deem), 69 (a local call still holds each turn about 0.1 s) and 72 (Deem removes the egress, not the duplication).

**Restated without change.** grok-03 and glm-05 restated rows 44, 47 and 49. grok-06 restated row 28. deepseek-03 restated row 12. None brought evidence that moves them.

**Not carried.** glm-05's row 77, "mint the `cli-classifier` hub now", is not a drop here: D2 requires the hub, and phase 008 mints it with its first caller.

**Ruled out inside a kept design.** These alternatives were dropped inside a recommendation this file keeps, so they carry no row number.

| Ruled out | Where it belongs | Lineage |
|---|---|---|
| One judgment over a whole document | R22 and R26 ask per section and per rule | swe-02 |
| A `choice` over about 180 raw leaf ids, reusing the trigger index as the leaf scorer or touching system-deep-loop's replay-only `ROUTER.md` | R25 works at intent level with a map lookup | swe-03 |
| A deletion tool apart from the census, or one 3-way `choice` in place of two `noul` answers per call | R19's later arm | swe-04 |
| Folding citation drift into R20 or R22, a 4-way verdict `choice` or scanning every citation on every run | R24 | swe-06 |
| Renaming `cli-usage` to `cli-jev`, or `router_state: active` on the new hub's first day | Phases 008 and 009 | swe-07 |
| One probe fusing both backends, a cached health result across runs or hunting other providers' keys | The shared gate contract | swe-08 |
| Preferring a backend because it needs no rewrite | The shared gate contract names preference by payload | grok-07 |
| Shipping the client as the only phase, or a judgment arm resting on the 96.3% card figure | Section 14 and row 99 | grok-10 |
| An advisor result cache under a local backend | BASE1 row 40 stands | deepseek-04 |

---

## Divergence Map

**No divergent pivots happened in round 3.** The run set `convergenceMode` off with a max-iterations stop, and every iteration took its assigned angle (`context/research-angles.md:131-768`). The merged registry's `iterationsCompleted` of 5, against 45 iteration files on disk, is a merge artifact, not evidence.

**Saturated directions.**
- Zero-call slices first: every lineage that ordered the work starts with a census.
- No live Deem or Jev form now: no lineage proposed one without R1's `keep`, and deepseek, grok and glm each refused the warm p95 as a reason.
- A client, not a wrapper: four lineages reached it from code (A1, G1).
- One switch per feature, never a global one and never a silent failover.
- Deem's answers need provenance: deepseek and glm reached the commit pair independently (A2).

**Contested ideas.** The ten disagreements in section 11. Code or a measurement settles disagreements 1, 3, 7, 8 and 10. Disagreements 2, 4, 5, 6 and 9 are judgment calls this file makes and records.

**Failures.**
- The refuted fail-open (K1), the D3 veto (K2) and the stale sk-design premise (K3).
- mimo-01's void tool counts (K4) and the path artifact behind the empty residue population (K9).
- Counts that shrank on rerun: 456 citations to 403 (K10), 53 and 39 files to 81 and 48 (K12) and 289 rows to 265 (K8).
- The void rerun flip test (K13) and the phantom `isPass` line (K14).
- The merge: 57 key findings kept from 65 source findings, none of them grok's, 0 ruled-out directions, 5 of 45 iterations counted and a resource map with 0 references.
- No record shows whether any lineage called the server or `jev` (question 52).

**Remaining frontier.**
- Deem's first accuracy and calibration on the 195 labels (question 39), and whether its `choice` beats the scorer (question 40).
- The 0.8B at real payload sizes and a cold server inside a hook (questions 41 and 42).
- The numbers the censuses exist to produce: movable rows, compaction fit and recall and the clamp's share of Pi verdicts.
- The function-hook budget (question 18) and the rubric (question 34).
- Gold nobody has built: a D4 set, a human-scored reply subset, a clarify gold, HVR labels and now labeled negatives for R24 and R26.

---

## 13. Open Questions

Questions 1 to 38 carry forward from BASE2 with their round-3 status. Only questions 2, 3, 13, 17, 24, 30 and 31 change. Questions 39 to 52 are new.

| # | Question | Status | What would resolve it |
|---|---|---|---|
| 1 | How many rows across the labeled corpus and the holdout file are movable? | Open, bounded at 55 | R1's census |
| 2 | Does a Python `jev-cli` `choice` beat the scorer's order and each zero-call comparator on those rows? | Open, now asked per backend column. The Deem half is question 40 | R1's `--jev` arm |
| 3 | What are the per-call latency p50 and p95 of the Python `jev-cli` here? | Open for Jev. For Deem, measured on synthetic input: p50 60.2 to 65.6 ms and p95 62.8 to 80.0 ms with one client, 281.3 ms p95 with four (`deem-local.md:34-38`, `:85-87`) | R1's `calls.jsonl` or R21's run for Jev. Questions 41 and 42 for Deem at real sizes |
| 4 | How far does an R1 loss reach? | Open | A `kill` from R1, then R2's Jev arm as a second closed-set measurement |
| 5 | What are the goal heuristic's error rates, and how many false `not_met` come from the blocking pattern and from the clamp? | Partly answered for Pi: 314 blocking-language and 253 truncation-branch verdicts among 1,457. Rates need labels | R2's zero-call arms with the clamp-error count |
| 6 | Do live reviewer outputs miss the verdict line often enough for a classifier to matter? | Open | One reviewer run on cases without `reviewer_output` |
| 7 | Do iteration narratives hold rejected-P0 downgrades usable as severity gold? | Answered no (BASE2 C27) | None |
| 8 | Does the derived stop gold match the iteration prose? | Open | MiMo's five-lineage manual read (BASE1) |
| 9 | What is the completion sentinel's real false-fire rate? | Open | Its advisory log in the main checkout, plus labeled excerpts |
| 10 | How often do clarify outcomes happen in real use? | Open | A count of real clarify events, then a 30-row gold |
| 11 | Would a Jev pass break a provider prompt cache? | Open. pi-jev-context's README warns that filtering can, and users report it for per-prompt model switching | A cache-hit comparison, only if a Pi pruning pass is ever proposed (row 44 drops it) |
| 12 | What is the H2 rerank baseline today? | Open | R1's baseline column |
| 13 | Can provider and model be recorded per call from the Python `jev-cli` output? | Open for Jev: `jev auth test` reports the `official` provider's model unless given `--provider`. Answered for Deem: each answer names the launch label (`deem_server.py:894`), and the commit pair comes from disk (C2) | Reading one Jev judgment's JSON at build time |
| 14 | Is any routing corpus prompt private? | Open | The corpus authoring history |
| 15 | Do git preflight (S12) and executor demotion (S21) have any Jev fit? | Answered in BASE1: no fit (row 39) | None |
| 16 | How many rows have the gold in the top 3 but not first? | Open | R1's census, top-3 column |
| 17 | Do the redaction rules, in their real modules, catch `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=`? | Open for Jev egress, in three modules. No Deem arm waits on it, because nothing leaves the machine (C9, C10) | One unit case per module with fixture values under 48 characters |
| 18 | Does Claude Code bound a `session.compact` function hook's run time in production, and at what? | Unresolved | One timed run with a stub hook on 2.1.283, or a host reference |
| 19 | Does the operator run OpenCode or Pi goals with a verifier? | Resolved yes for Pi (1,457 nudges). Open for OpenCode | Question 36 |
| 20 | Should R1 veto on the tau 0.03 slice? | Answered in BASE1: report the split, no veto | None |
| 21 | How often does the live advisor set `ambiguousWith`? | Resolved at 0 recorded. No shadow sink file exists | Enabling the shadow sink, if R1 keeps |
| 22 | What share of goal criteria cannot be checked from their own text? | Partly resolved, reframed as a rubric question | Question 34, then about 100 labels |
| 23 | How often does live OpenCode or Pi evidence exceed 1,200 characters? | Partly resolved. No length is recorded. At most 253 of Pi's non-`met` verdicts can come from over-long evidence without blocking language | Question 32 |
| 24 | Can a Jev deletion pass fit these sessions at all? | Open, now for either backend. A Deem arm also meets the 64-question cap (question 51) and an unknown context limit (question 41) | R19's census fit column, then one timed Deem call at fitted-state size |
| 25 | Does the transcript record the brief the PreCompact hook prepared? | Resolved yes, at 218 of 222 boundaries | None |
| 26 | Did the DeepSeek registry loss drop a finding that would change a verdict? | Resolved: no verdict change | None |
| 27 | Does rule-derived must-survive recall agree with an operator's reading? | Unresolved, design ready | The operator's 3-session read after R19's census |
| 28 | Does Pi await async `turn_end` handlers? | Resolved yes | None |
| 29 | Does the operator watch host compaction waits? | Partly resolved: ill-posed on this record format. mimo-04 finds `entrypoint` `cli` and `userType` `external` on all 209 boundaries it counted (lineage-reported) | Operator answer |
| 30 | Would a model family other than Claude reach the same calls on R1, R19 and R2? | Partly resolved further. R1 has three supporting families, none unsteered and code-grounded in wave 1. R19 has one after cross-reading. R2 has none (section 11) | An operator read of the three calls |
| 31 | Should D5's check 3 pass the provider the arm will use? | Resolved: the operator amended the gate, and D1 now names the provider (`../goal.md:49`, `:130`) | None |
| 32 | How many of Pi's 253 truncation-branch verdicts are clamp artifacts, and how many genuinely trail off? | Open | A zero-call pass over the Pi session files that prints, per nudge, the length of the turn text behind it, lengths only |
| 33 | What do the hidden nudges cost in context, and do they change what the model does next? | Open | A character count of nudges per session, then an operator read of a few turns that follow one |
| 34 | Which rubric does the operator adopt for rules 4 and 5? | Open | An operator decision among mimo-02's round-2 readings, before any label |
| 35 | Are the 12 boundaries without a recovered-context brief the 12 cancelled `SessionStart:compact` hooks? | Open | Pairing each unbriefed boundary with its attachment status, counts only |
| 36 | Does OpenCode's own session history show the goal verifier running? | Open | A read-only count over OpenCode's session database, which neither synthesis queried |
| 37 | Will the plugin and goal-core owners take the clamp fix? | Open | An owner decision. R2's tail-window arm shows the effect first |
| 38 | Does the operator still run Pi goals? All 1,457 nudges fall between 2026-07-29 and 2026-08-10 | Open | Operator answer, or the Pi census rerun later |
| 39 | What are Deem's accuracy, F1, Brier score, 5-bin ECE and fitted temperature on the 195 Gate 3 labels? | New, open | R21's Deem half: one pass of 195 local calls, about 12 s |
| 40 | Does a Deem `choice` beat the scorer's order on R1's rows, and does its pick hold across 3 option orders? | New, open | R1's `--deem` column |
| 41 | What is the 0.8B's usable context, and its latency at a fitted state near 25,000 tokens? | New, open. Only one-question synthetic calls were timed | One timed call at that size on synthetic content, run by the orchestrator |
| 42 | What does a cold, loading or busy server cost a hook? | New, open. A loading server refuses connections (`deem_server.py:1000`), and a busy one queues behind its lock | A timed Deem check against a stopped server, during the 10 s load and behind an offline batch |
| 43 | How much of the advisor's 2,200 ms does the advisor itself spend? | New, open (deepseek lead's WEAK-CLAIM) | Timing the advisor child over the corpus prompts |
| 44 | Should the server's open CORS and missing authentication be closed? | New, open. Any page in the operator's browser can send it requests (`deem-local.md:73`) | An operator decision: a patch to Deem or a proxy |
| 45 | Should the 3,368 MB footprint stay resident, or should the server run only when a feature needs it? | New, open | An operator decision (N-deepseek-02-4) |
| 46 | Which option-order scheme does 002's REQ-008 pre-register for a Deem `choice`? | New, open. Rotations, a reversal or seeded shuffles would all serve | Fixed in the amended REQ-008 before the arm runs |
| 47 | Will sk-design's owner reconcile the md-generator's 80-point docs with its hard-failure gate, and retire the stale rule 6? | New, open | An owner decision (K3, K14) |
| 48 | Will spec-kit's owner add an existence check to `AC_COVERAGE`? | New, open. It needs no model | An owner decision (N-deepseek-03-3) |
| 49 | Should 009's move wait on a Deem result the operator keeps? | New, open. This file recommends yes | An operator decision when 008 lands |
| 50 | How many skill-doc citations drifted inside their file? | New, open. 4 of 232 resolvable citations are dead by line count | R24's about 40 labels, or a labeled read of a sample |
| 51 | Does the 64-question cap bind R19's batches? | New, open | R19's census, which prints tool calls per boundary |
| 52 | Did any lineage call the Deem server or `jev`? | New, UNKNOWN. The server's access log is off unless `DEEM_ACCESS_LOG` is set (`deem_server.py:794-800`), `server.log` was rewritten after the run and the lineage logs hold no tool transcript. The lineage logs show 0 calls to port 8300 and 0 `jev` invocations | Nothing after the fact. A later run can enable the access log for its duration |

---

## 14. Proposed Build Phases

Six build phases, four existing and two new, all under `specs/cli-jev/003-cli-jev-workflow-integration/`. 002, 003, 005 and 006 stay Planned, and each change below is an amendment the operator approves before their docs change. None of the four names Deem, `cli-classifier` or `cli-deem` today: 0 mentions in each `spec.md` (counted). `004-deep-research-expansion` and this phase are research phases. New build phases number from 008, two of a possible six. No separate measurement-only phase is needed, because each phase's first slice is its own zero-call measurement and 008's first slice runs against a fake server.

**The shared replacement text.** Every Jev-only gate line below takes this text, with the phase's own switch and skip-line prefix:

> Each model arm has two switches, `--jev` and `--deem` (proposed), and each backend runs only when its own check passes, once per run. Jev: the D1 checks with one `--provider P` on every check and call, as today. Deem: `cli-deem health` (proposed, phase 008) applies the pinned check within 2,000 ms and prints the backend, the model id and the commit pair. Its failures print `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. The script never starts the Deem server. With neither switch set, or with every gate failing, the output is byte-identical to the default run and no binary is spawned.

### 002-advisor-jev-tiebreak-arm (Planned, amended)

**Take Deem: yes.** R1's Deem column is free, local and deterministic, and R21's Deem half gives this repository its first local accuracy set. The folder keeps its name, because a rename is churn with no reader.

| Line in 002 `spec.md` | Today | Two-backend replacement |
|---|---|---|
| `:3` | A Python `jev-cli` `choice`, and the arm runs only behind `--jev` | "...whether a `choice` from the Python `jev-cli` or the local Deem... Each model arm runs only behind its own switch, `--jev` or `--deem`, when its backend's checks pass" |
| `:35` | A keyed run produces one verdict line or the conditional calibration | "...or a run under `--jev` or `--deem` produced one verdict line per backend column, R21's Deem calibration or the conditional Jev calibration..." |
| `:49` | Arm dependency: `jev-cli` 0.6.2 and a credential | Add: "For the Deem arm only: `cli-deem` from phase 008 and a server passing the Deem check. Neither is needed for the default run" |
| `:52`, `:53` | A `--jev` arm, stub-`jev` test cases | "...a `--jev` arm, a `--deem` arm, R21's Deem half and the conditional Jev calibration", tested with stub-`jev` and fake-server cases |
| `:73` | No change for anyone without a key or `--jev` | "...changes no behavior for anyone who passes neither `--jev` nor `--deem`" |
| `:86` | The Jev arm | Add: "A Deem arm behind `--deem`: one `cli-deem choice` per eligible row per option order, over at most 25 cluster keys plus `none`, 3 option orders and the same four-outcome verdict in its own column. Larger clusters print as unmeasured" (C5) |
| `:87` | R21 only on `underpowered` | "R21's Deem half runs on every `--deem` run beside the `choice` arm. The Jev half runs only when the census prints `underpowered`" |
| `:92` | No live Jev call in the advisor | "Any live, served or hook-time Jev or Deem call in the advisor" (N-deepseek-05-2, N-glm-02-2) |
| `:97` | No shared Jev client helper, `--jev` is its own switch | "A shared Jev or Deem client library, a global switch, a new command or a hub mode. This script is the only caller, and `--jev` and `--deem` are its own switches. It spawns `jev` and `cli-deem` as binaries" (C15) |
| REQ-001 `:125` | Zero Jev calls by default, one stub | "Zero Jev or Deem calls by default. Stub `jev` and `cli-deem` binaries, first on PATH, leave their logs empty" |
| REQ-002 `:126` | Three Jev checks | Keep them, and add the Deem half from the shared text. Each half is independent, and a skip leaves the census and the other column byte-identical |
| REQ-003 `:127` | No credential handled | Add: "`cli-deem` takes no key, and the script passes it none" |
| REQ-004 `:128` | The census columns | Add: "the count of clusters with more than 25 members, which the Deem arm prints as unmeasured" |
| REQ-007 `:136` | One verdict | "One verdict per backend column. A comparison between the columns uses only rows both decided, with a one-sided bound on the paired gap" (C6) |
| REQ-008 `:137` | Three passes, flip rate at most 0.10 | Jev unchanged. For Deem, 3 option orders fixed in this requirement (question 46) replace the passes, the order-flip rate must be at most 0.10 and three different picks make a row `unstable` (C4) |
| REQ-009 `:138` | `jev` version and provider per call | For Deem: backend `deem`, the model id, the model commit, the source commit and the option order, with the pair taken from `cli-deem health` (C2) |
| REQ-010 `:139` | Jev exit handling | Add the Deem exits from the shared gate contract in section 12: 1 or HTTP 400 `unmeasured`, 2 stops the arm, 3 `deem arm stopped: backend refused`, 4 one recheck, then `deem arm stopped: server gone` or `deem arm stopped: model commit changed mid-run` with finished rows `partial`, 130 `interrupted` |
| REQ-011 `:140` | Payload class, planned calls, tokens | For Deem: "nothing leaves the machine", the planned calls and an estimated wall time at the measured p50 (C14) |
| REQ-014 `:143` | Jev calibration on `underpowered` | Add the Deem half: 195 `noul` calls in one pass, printing accuracy, F1, Brier score, a 5-bin ECE and a fitted temperature beside 0.9843, with no threshold on raw probabilities before it runs (C7) |
| Edge cases `:147-156` | Jev cases | Add: a stub backend, a model other than `deem-0.8-v1`, a loading server that refuses connections, an update mid-run, a cluster of more than 25 and a busy server that serves one request at a time |
| SC-003 `:186` | No Jev key or no `--jev` | "A machine with no Jev key and no Deem server, or a run with neither switch, sees no new behavior and no call" |
| Proof `:192`, `:195`, `:196` | Stub `jev` only | Step 1 adds a stub `cli-deem` that logs no call. Step 4 adds each Deem skip line and exits 3 and 4 after the Deem gate. Step 5 adds a `--deem` run against a fake server that prints its own column, its order-flip rate and the commit pair |
| Kill `:199` | `verdict: kill` closes R3's served order | "`verdict: kill` on a backend's column closes that backend's served forms of R3" |
| `:210`, `:216` | A Jev credential. Cost of 723 judgments plus 1 | Add: "or a Deem server passing its check", and "Deem: at most 723 local calls, about 47 s, plus R21's 195, about 12 s" |

Keep rule, latency and cost for Deem: the order-flip clause replaces reruns, a keep holds per commit pair (C3), there is no latency line because the arm is offline and the cost line counts calls and seconds, never money. **Status: amended.**

### 003-goal-verifier-jev-shadow (Planned, amended)

**Take Deem: yes, preferred for the later arm and shadow mode,** because the payload is the operator's own conversation and Deem keeps it on the machine. The zero-call slices do not change.

| Line in 003 `spec.md` | Today | Two-backend replacement |
|---|---|---|
| `:3` | A key-gated Jev arm and a `jev` shadow mode | "...A gated `choice` arm on Deem or Jev and a shadow mode that names its backend follow only past a gate fixed before the build" |
| `:48` | The Jev arm behind `--jev`, a shadow `jev` value | "...a model arm built only past REQ-014's gate, behind `--deem` or `--jev` and its backend's check. Slice 2 is a shadow value, `deem` or `jev` (proposed), in scope only on that arm's keep" |
| `:53` | The Jev arm waits on 002's latency record | "The Jev arm waits on 002's latency record. A Deem arm waits on none, because a warm call measured 60 to 80 ms against a 30 s budget (`opencode-goal.js:49`)" |
| `:54` | `jev-cli` 0.6.2 for the Jev arm | Add: "`cli-deem` from phase 008 and a server passing the Deem check, for the Deem arm only" |
| `:97` | A Jev `choice` arm over 3 reruns | "A `choice` arm behind `--deem` or `--jev`, under the wrapper rule: Jev over 3 reruns, Deem over 3 option orders" |
| `:98` | `OPENCODE_GOAL_VERIFIER=jev` | "`OPENCODE_GOAL_VERIFIER=deem` or `=jev` (proposed), naming the backend its keep was measured on" |
| Files `:124-129` | Jev only | The scorer adds `--deem` through `cli-deem`, its tests add a fake server, the plugin's mode set at `:134` and its branch at `:226-234` take both values and the doc rows at `goal-plugin.md:70` and `ENV-REFERENCE.md:337` list both |
| REQ-003 `:146` | The Jev gate | Keep it, and add the Deem half from the shared text. Deem needs no key |
| REQ-006 `:149` | (d) aggregate flip rate over 3 reruns | For Deem, (a) to (c) hold on each of 3 option orders and (d) is the order-flip rate at most 0.10 |
| REQ-007 `:150` | No egress before the redaction cases | "Applies to the Jev arm. A Deem arm sends nothing off the machine and prints that line with its planned calls" |
| REQ-014 `:151` | Three conditions for the Jev arm | "For a Deem arm only the tail-window condition remains. The redaction cases and 002's latency record gate the Jev arm. The plugin mode is built only on the arm's keep, for the backend that kept" |
| REQ-009 `:158` | Per-call Jev record | Deem lines carry the backend, the model id, the commit pair and the option order |
| REQ-010 `:159` | A Jev shadow spawn | "The shadow call spawns `cli-deem` or `jev` per the mode value, after the heuristic verdict is applied" |
| REQ-011 `:160` | The gate once per session | For Deem: the check runs once per session within 500 ms and never starts the server. A failed check writes one enablement line, and the mode then behaves exactly as `heuristic`. A passing one names Deem and says nothing leaves the machine. A changed commit pair disables the shadow for the session with one line |

**Status: amended.**

### 004-deep-research-expansion and 007-classifier-deep-research (research)

Research phases, not build phases. This file is 007's synthesis.

### 005-compaction-recall-harness (Planned, amended)

**Take Deem: only for the later arm.** The census stays zero-call and its stop line is unchanged. The amendment is text: a later arm names its backend, and a Deem arm drops the egress preconditions but gains the batch cap and a context check (C9).

| Line in 005 `spec.md` | Today | Two-backend replacement |
|---|---|---|
| `:3`, `:66`, `:70` | "zero Jev calls", "a Jev deletion pass" | "zero model calls", "a deletion pass on either backend" |
| `:43` | Never spawns `jev` | "never spawns `jev` or `cli-deem`" |
| `:48` | A later Jev arm | "A later model arm waits on the conditions in section 3" |
| `:91` | Any Jev arm, with the D5 gate, redaction, payload acceptance and 002's latency | "Any model arm... a later amendment with its own `--deem` and `--jev` switches. A Jev arm keeps every condition listed here. A Deem arm needs the Deem check, batches of at most 32 tool calls (64 questions, `deem_server.py:995-997`) and one timed call at fitted-state size first (question 41). It needs no redaction cases and no payload acceptance, because nothing leaves the machine" |
| `:92` | Any live form | Add: "A live Deem form would only ever use the `precompute` trigger, and no form starts the server" |
| REQ-001 `:122` | No Jev code path, one stub | "The census makes zero model calls and has no model code path. Stub `jev` and `cli-deem` binaries leave their logs empty" |
| `:157`, `:166`, `:182` | Stub `jev`, no run spawns `jev` | Name both binaries |
| `:165`, `:212` | "a Jev deletion pass" | "a deletion pass on either backend" |

**Status: amended.**

### 006-goal-criteria-lint (Planned, amended)

**Take Deem: only for the later arm. The lint itself takes no classifier** (deepseek-10 F5, C12): its value is that it is deterministic.

| Line in 006 `spec.md` | Today | Two-backend replacement |
|---|---|---|
| `:3` | A Jev arm stays dormant without a key | "A model arm on Deem or Jev is built only past the stop rule and stays dormant without its backend" |
| `:9`, `:149`, `:191` | `r20 jev arm not built: labeled_violation_rate<0.05` | `r20 model arm not built: labeled_violation_rate<0.05` (proposed), because the stop is the same for both backends |
| `:47` | Latency record, redaction and D5 for a later Jev arm | "For a later Jev arm: 002's latency record, the redaction cases and the D1 checks. For a later Deem arm: `cli-deem` from phase 008 and the Deem check" |
| `:53`, `:86` | A Jev arm behind `--jev` | "A model arm behind `--deem` or `--jev`" |
| `:72` | Zero Jev calls | "zero model calls" |
| REQ-006 `:140` | Zero Jev calls, one stub | "Zero model calls. Stub `jev` and `cli-deem` binaries log nothing without a switch" |
| REQ-012 `:151` | The D5 gate | Keep it, and add the Deem half from the shared text |
| REQ-013 `:152` | About 600 Jev calls over 3 reruns | "Jev: two `noul` over 3 reruns, about 600 calls. Deem: two `noul` in one pass, about 200 local calls, no rerun clause, its stability the commit pair. Keep on either backend only with an F1 gain of at least 0.2 over the lint and a precision of at least 0.8, plus the flip rate for Jev" |
| Stop rule item 3 `:170` | Latency record and redaction for any arm | "For a Jev arm: 002's latency record and the redaction cases. A Deem arm needs neither" |
| SC-002 `:179`, proof `:189` | No Jev key, stub `jev` | "no Jev key and no Deem server", stub `jev` and `cli-deem` |

**Status: amended.**

### 008-cli-classifier-hub (new)

| Field | Record |
|---|---|
| **Scope** | Mint the `cli-classifier` hub with `cli-deem` as its first mode: a Node standard-library client for the local Deem server. `cli-jev` stays where it is |
| **Recommendations** | R23. It serves the Deem arms of R1, R21, R2, R19 and R20 |
| **Why its own folder** | D2 requires the hub and the transport, every Deem arm depends on the client and it is the only phase that touches the advisor graph and the hub registries |
| **First slice** | `cli-deem.mjs` (proposed) with tests against an in-test fake server: a stub backend refused, a wrong model id, a refused connection, an HTTP 400, 27 options, 65 questions, the answer round trip and duplicate descriptions. Then the orchestrator's one live `cli-deem health`, which should print `torch`, `deem-0.8-v1` and the pair `8cbabbb` and `6755b30` |
| **Likely files** | New `.skilled/skills/cli-classifier/` root: `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, a generated `leaf-manifest.json` and a changelog (swe-07's list, lineage-reported). New packet `cli-deem/`: `SKILL.md`, references for the wire, for the lifecycle over `deem-ctl` and for the model pin, `scripts/cli-deem.mjs` and its test. Regenerated: the advisor graph and the trigger index. All names proposed |
| **Switch and two-backend gate** | No switch of its own: it is a transport, and each caller keeps its own switch. `cli-deem health` is the Deem half of D1. With no server, every subcommand exits 4 and changes nothing |
| **Lifecycle** | The packet documents `deem-ctl` and never reimplements it: install per `deem-local.md`, then `start`, `status` and `update`. An update lands on a new Hugging Face or GitHub commit and is proven by one real decision. `rollback` holds a rejected release. A measured keep survives an update only by requalification on its commit pair (C2, C3) |
| **Dependency** | None. Nothing calls the real server except the orchestrator's smoke |
| **Rough size** | About 170 LOC of client and 150 of tests (swe-01, lineage estimate), plus the hub files |
| **Kill criterion** | The per-hub check fails, or a replayed Deem request routes elsewhere. Revert the hub commit |
| **Observable check** | `parent-skill-check` given the hub path passes, a two-stage route replay sends a Deem prompt to `cli-deem`, the tests pass and `git status` shows only the new hub and the regenerated indexes |

### 009-cli-jev-hub-move (new)

| Field | Record |
|---|---|
| **Scope** | Move `cli-jev` into `cli-classifier` as mode `cli-jev` over its unchanged packet folder `cli-usage`, beside `cli-deem`. system-deep-loop is the precedent: mode `research` over packet `deep-research` |
| **Recommendations** | R23's second half, and D2 |
| **Why its own folder** | It touches 81 files under the hub, 48 files that name it and generated routing artifacts. It needs its own rollback |
| **First slice** | Record the route replay of the 7 canary cases and the 3 hub-routing scenarios as the baseline. Then `git mv` the whole hub, merge its hub files into the new root and update every literal list in one commit |
| **Likely files** | `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19` and `:37`, `resolve.cjs:36-44`, `serving-closure.manifest.json:5-13`, `dispatch-audit.mjs:46`, `:234` and `:237`, the rollout package `009-parent-hub-rollout/008-cli-jev`, the `.hermes` mirrors, the agents that name it, the advisor graph and fixtures, the trigger index and the README. Changelogs stay as written |
| **Switch and two-backend gate** | None: a routing identity change. No feature gains a switch |
| **Dependency** | 008, and a Deem arm result the operator keeps (question 49) |
| **Rough size** | 81 files moved and about 48 edited (counted) |
| **Kill criterion** | Any canary case or hub-routing scenario routes differently after the move. Revert the move commit |
| **Observable check** | `parent-skill-check` passes with two modes, the replay matches the baseline, `hub-router.json`'s ordered bundle becomes reachable and `rg` finds no stale `.skilled/skills/cli-jev/` path outside changelogs |

**Do 002's census first.** It needs no backend, no key and no label, and its power line decides with a number whether any classifier can earn a `keep` on the advisor's near-ties. 005's census and 003's Pi census also make no call and can run beside it. Then 008, because it turns every Deem number that follows, R21's calibration and R1's Deem column, into about a minute of local compute with nothing leaving the machine.

### Not phased (later), with what would promote each

| Item | Promote when |
|---|---|
| R2's model arm and shadow mode (inside 003) | The tail-window arm leaves false `not_met` it cannot fix. For Jev also the redaction cases and 002's latency record |
| R19's model arm (inside 005) | The census clears its stop line. For Deem, one timed call at fitted-state size. For Jev, the redaction cases and the operator's acceptance of the payload. A live form also needs question 18 |
| R20's model arm (inside 006) | The labeled violation rate under the adopted rubric is at least 5%, and the lint's F1 leaves room for a 0.2 gain |
| R3 | R1 prints `keep` on the backend the live form uses, and a health-plus-call p95 measured inside the advisor child fits the budget (C11) |
| R4 to R10, R12, R13 and R15 to R18 | As in section 12's carried table |
| R22 | About 50 labeled passages exist and an author names the decision it would change |
| R24 | sk-doc's owner names the reader and about 40 labeled citations exist |
| R25 | The routing owner asks for a stage-2 replay, or a recount shows larger `ROUTER.md` reads |
| R26 | About 50 passages judged clean exist and a reviewer names what the column changes |
| R14 (dropped) | Only if a runtime caller of `compareNextFocusShadow` exists and a focus gold is named |

---

## 15. Citation Verification Ledger

Every row not marked "not reopened" was checked on 2026-09-27 in worktree `.worktrees/069-cli-jev-workflow-integration`, read-only. "Cited by" names who cites the row, with their own line range in parentheses where it differs. "synthesis" marks a citation this file adds. Results: **resolved** (the lines hold what the claim needs), **drifted** (right file, wrong lines, right lines given), **failed** (the lines do not hold what the claim needs), **count** (a count rerun today, figure given) and **not reopened** (carried, never checked here).

Totals: 167 rows. 136 citations checked: 130 resolved, 2 drifted and 4 failed. Of the failed rows, one is a lead's citation (row 123) and three hold four dead skill-doc citations the count found (rows 110 to 112). No recommendation rests on a failed citation. 23 counts rerun. 8 rows not reopened.

### A. Deem server and library (`context/deem-main/`)

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 1 | `serve/deem_server.py:2-6` | synthesis | resolved | The docstring calls the server a drop-in for `typesafe-sdk` |
| 2 | `deem_server.py:107` | deepseek-01 | resolved | Default model id `deem-1.5`, so the pin catches a server launched without `DEEM_MODEL_ID` |
| 3 | `deem_server.py:109` | synthesis | resolved | 8 MiB body cap |
| 4 | `deem_server.py:115-121` | synthesis | resolved | `RequestError` answers HTTP 400 |
| 5 | `deem_server.py:137-154` | brief, deepseek-01 | resolved | The stub backend answers uniformly, `noul` 0.5, named at `:145` |
| 6 | `deem_server.py:165-166` | synthesis, the swe lead | resolved | Torch backend name and its 26-letter option alphabet |
| 7 | `deem_server.py:201`, `:236` | orchestrator | resolved | One lock around inference |
| 8 | `deem_server.py:222-230` | synthesis, the swe lead (`:224-230`) | resolved | `unsupported_option_count` above 26 options |
| 9 | `deem_server.py:270`, `:273-274` | deepseek-02, deepseek-04 | resolved | Ensemble backend names |
| 10 | `deem_server.py:486-489` | synthesis | resolved | Temperature 1.0 with no calibration loaded |
| 11 | `deem_server.py:519-550` | brief (`:535`, `:542`), glm-01 (`:535-548`) | resolved | `choice` needs `options` (`:534-540`), `score` needs `levels` (`:541-545`), `noul` takes `instructions` (`:546-547`) |
| 12 | `deem_server.py:594-621` | brief (`:606`, `:618`), glm-01 (`:602-608`) | resolved | Answer keys: `choice` at `:598`, `level` at `:606`, `value` at `:618` |
| 13 | `deem_server.py:656-659` | synthesis | resolved | 64-question cap |
| 14 | `deem_server.py:660-666` | synthesis | resolved | Order averaging permutes `choice` questions only |
| 15 | `deem_server.py:772-777` | brief, deepseek-01 | resolved | The health body: status, backend and model |
| 16 | `deem_server.py:794-800` | synthesis | resolved | Access log off unless `DEEM_ACCESS_LOG` is set |
| 17 | `deem_server.py:809`, `:837` | `deem-local.md:73`, deepseek-01 (`:809-811`, `:837-839`), glm-05 (`:809-811`) | resolved | `Access-Control-Allow-Origin: *` |
| 18 | `deem_server.py:845-860` | synthesis | resolved | GET routes |
| 19 | `deem_server.py:866-904` | synthesis | resolved | POST handler with no authentication. The answer's `model` at `:894` |
| 20 | `deem_server.py:929-931` | synthesis | resolved | `--model-id` |
| 21 | `deem_server.py:962-977` | synthesis | resolved | Backend construction |
| 22 | `deem_server.py:978-983` | deepseek-01 (`:972-977`) | drifted | The stub fallback without a checkpoint sits at `:978-983` |
| 23 | `deem_server.py:985` | `deem-local.md:91` | resolved | `DEEM_N_ORDERS`, default 1 |
| 24 | `deem_server.py:995-997` | synthesis | resolved | `DEEM_MAX_QUESTIONS` |
| 25 | `deem_server.py:1000` | deepseek-01 (`:1000-1005`) | resolved | The server binds its port after the weights load |
| 26 | `serve/deem_mcp.py:60` | the grok lead's steer | resolved | MCP tools require state, instructions and options |
| 27 | `src/deem/primitives.py:48` | synthesis | resolved | The library documents 255 options, which the torch server narrows to 26 (rows 6 and 8) |
| 28 | `src/deem/primitives.py:98-99` | synthesis | resolved | `criteria` is metadata that never reaches the prompt |
| 29 | `src/deem/format.py:296-304` | synthesis | resolved | Options render as lettered lines |

### B. `deem-ctl`, `deem-local.md` and the schedule

Live file `~/.local/share/deem/bin/deem-ctl` (250 lines), pre-run copy `deem-ctl.prefix` (208 lines) in the orchestrator's scratchpad.

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 30 | `deem-ctl:28` | synthesis | resolved | `MODEL_ID` `deem-0.8-v1` |
| 31 | `deem-ctl:64-70` | deepseek-04 (its lead's correction), swe-08 (`:59-66`, pre-run) | resolved | Backend allowlist with no model pin. Pre-run copy `:60-66` |
| 32 | `deem-ctl:72-81` | synthesis | resolved | Waits up to 120 s for health |
| 33 | `deem-ctl:85-89` | synthesis | resolved | The smoke decision |
| 34 | `deem-ctl:101-103` | synthesis | resolved | The model commit from the `current` link |
| 35 | `deem-ctl:109-125` | deepseek-02 (`:105-121`, pre-run) | resolved | Start: `DEEM_MODEL_ID` at `:119`, `HF_HUB_OFFLINE` at `:120` (pre-run `:116`) |
| 36 | `deem-ctl:127-132` | deepseek-02 (`:123-128`, pre-run) | resolved | Stop does not wait for the process to exit |
| 37 | `deem-ctl:134-139` | synthesis | resolved | `switch_to` |
| 38 | `deem-ctl:145-202` | deepseek-02 (`:137-183`, pre-run), glm-01 (`:163`, `:167`, pre-run) | resolved | Held skip `:157-160`, download `:164-173`, stop and switch `:175-178`, proof `:180-182`, restore `:183-189`, record `:190-192`, prune `:195-201` |
| 39 | `deem-ctl.prefix:160-173` | deepseek-02, deepseek-04 | resolved | The pre-run update skipped the smoke decision on a stopped server |
| 40 | `deem-ctl.prefix:171` | deepseek-04 | resolved | The pre-run restore swallowed its own failure. Fixed live at `:185-186` |
| 41 | `deem-ctl:204-225` | synthesis | resolved | Rollback: exit 2 at `:207` and `:210`, hold at `:219`, previous removed at `:220`, exit 4 at `:221-223` |
| 42 | `deem-ctl:236-243` | synthesis | resolved | Status |
| 43 | `com.skilled.deem-update` plist | glm-01 (`:12-13`) | resolved | Content read: `deem-ctl update` every 21,600 s and at load. glm-01's line numbers not checked |
| 44 | `deem-local.md:20-28` | brief | resolved | Install facts |
| 45 | `deem-local.md:34-44` | brief, every lineage | resolved | Speed and memory |
| 46 | `deem-local.md:52-53`, `:71`, `:73`, `:77` | brief | resolved | The card figure, the commits, the exposure and the post-run commits |
| 47 | `deem-local.md:81-99` | orchestrator | resolved | Post-run measurements, determinism at `:90` |
| 48 | `deem-local.md:101-109` | orchestrator | resolved | The lifecycle fixes after the run |
| 49 | `~/.local/share/deem/models/` | synthesis | count | One model directory plus `current`. No `previous` or `held` file |

### C. Python `jev-cli` 0.6.2 and the dispatch guard

`specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py` (447 lines).

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 50 | `__init__.py:18-39` | synthesis | resolved | Provider table, `custom` included |
| 51 | `__init__.py:44-47` | synthesis | resolved | `CliError` exit codes |
| 52 | `__init__.py:90-109` | synthesis, grok-02 | resolved | `custom` needs `JEV_API_KEY`, exit 3 without it |
| 53 | `__init__.py:221-235` | synthesis, swe-01 (`:224-235`) | resolved | `provider_request`, where a translation branch would sit |
| 54 | `__init__.py:236-250` | synthesis | resolved | `normalize_response` |
| 55 | `__init__.py:253-265` | synthesis | resolved | `custom` without an endpoint exits 2 |
| 56 | `__init__.py:274-302` | synthesis | resolved | Bearer at `:280`, 60 s timeout at `:288`, HTTP code at `:295-296`, URLError to exit 4 at `:298-299` |
| 57 | `__init__.py:288` | glm-05 | resolved | The 60 s read timeout |
| 58 | `__init__.py:307` | the parent goal, BASE2 | resolved | `JEV_PROVIDER` |
| 59 | `__init__.py:327` | synthesis | resolved | Version string |
| 60 | `__init__.py:338-339` | the parent goal, BASE2 (`:339`) | resolved | `auth` subcommands default `--provider` to `official` at `:339` |
| 61 | `__init__.py:343-360` | synthesis | resolved | Arguments for `noul`, `choice` and `score` |
| 62 | `__init__.py:364-369` | brief, glm-01 | resolved | `question_request` sends options as `criteria` |
| 63 | `__init__.py:372-386` | glm-01 (`:381-382`) | resolved | `request_for`: `run` passes through at `:373-376`, `criteria` at `:378` |
| 64 | `__init__.py:389-393` | brief | resolved | `primary_value` reads `noul` or `score` |
| 65 | `__init__.py:419-421` | synthesis | resolved | `auth status` |
| 66 | `__init__.py:430-431`, `:438-440` | synthesis | resolved | `--value` and its `KeyError` exit |
| 67 | `dispatch-rule-checks.mjs:114`, `:287-290` | synthesis | resolved | The guard refuses an inline `JEV_API_KEY=` |
| 68 | `dispatch-rule-checks.mjs:280-284` | synthesis | resolved | The guard requires an endpoint for `custom` |

### D. Hooks and settings

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 69 | spec-kit `hooks/claude/user-prompt-submit.ts:22`, `:24`, `:105-108` | synthesis, deepseek-04 | resolved | `CHILD_TIMEOUT_MS` 2500 and the 300 ms start margin |
| 70 | spec-kit `hooks/claude/user-prompt-submit.ts:109-117` | deepseek-04, deepseek-05 | resolved | The advisor child already runs in Node |
| 71 | spec-kit `hooks/claude/shared.ts:12` | synthesis | resolved | `HOOK_TIMEOUT_MS` 1800 |
| 72 | `compact-inject.ts:8`, `:494` | synthesis | resolved | PreCompact stdout is not injected. Two identical copies, in `.skilled/hooks/session-lifecycle/claude/` and spec-kit's `runtime/hooks/claude/` |
| 73 | `.claude/settings.json:103-116` | deepseek-01 | resolved | UserPromptSubmit hooks at 3 s (`:110`, `:115`) |
| 74 | `.claude/settings.json:215-222` | deepseek-01, 005 `spec.md:92` | resolved | PreCompact at 3 s (`:222`), block `:213-224` |
| 75 | `.claude/settings.json:200`, `:210` | synthesis, deepseek-04 | resolved | PostToolUse: Write or Edit, and the 5 s Bash audit |
| 76 | `.claude/settings.json:169-176` | synthesis | resolved | Stop hooks |
| 77 | `.opencode/plugins/opencode-goal.js:49` | 003 `spec.md:151` | resolved | 30 s verifier timeout |
| 78 | `.opencode/plugins/opencode-goal.js:134`, `:226-234` | 003 `spec.md:126` | resolved | The verifier mode set and its branch |

### E. Routing and the hub

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 79 | `resolve.cjs:36-44` | orchestrator | resolved | Default-on hubs, sk-design included |
| 80 | `serving-closure.manifest.json:5-13` | orchestrator | resolved | sk-design at `:12` |
| 81 | engine `compiled-route.cjs:35` | synthesis | resolved | `cli-jev` maps to `009-parent-hub-rollout/008-cli-jev` |
| 82 | engine `compiled-route.cjs:87-92` | swe-03 | resolved | `normalizeTargets` expects destinations, not leaf lists |
| 83 | `compiled-route-sync.cjs:59` | synthesis | resolved | The rollout literal |
| 84 | `compiled-route-guard.cjs:40-50` | deepseek-07 | resolved | Hub list at `:45`, `cli-jev` at `:47` |
| 85 | `compiled-routing-flag.ts:19`, `:37` | deepseek-07 | resolved | Hub literals |
| 86 | `dispatch-audit.mjs:46`, `:234`, `:237` | deepseek-07 (`:46`) | resolved | Hub literals |
| 87 | `cli-jev/hub-router.json:8-11` | glm-02, glm-05 | resolved | The ordered bundle is unreachable while the hub has one mode (`:10`) |
| 88 | `cli-jev/mode-registry.json` | synthesis | resolved | Mode `cli-usage` over packet `cli-usage`. system-deep-loop maps mode `research` to packet `deep-research` |
| 89 | `parent-skill-check.cjs:268-275` | glm-02 (through K11) | resolved | A second skill-shaped `graph-metadata.json` below a root is rejected |
| 90 | `skill-hub-routing.md:51` | synthesis | resolved | Metadata-class modes have no advisor entry of their own |
| 91 | `skill-root-metadata-contract.cjs:45-55`, `:316-330` | swe-07 | resolved | The contract governs the metadata file set per class. It does not show that a hub root rejects a script file, so row 110 does not rest on swe-07's reading |
| 92 | `009-parent-hub-rollout/` packages | synthesis | count | `008-cli-jev` and `009-sk-design` among them |
| 93 | `canary-cases.v1.json` | swe-03 | count | 7 cases |
| 94 | The `cli-jev` footprint | deepseek-07 (53 and 39), glm-02, swe-07 | count | 81 files under the hub, 59 in `cli-usage`, 48 outside `specs/` that name it |
| 95 | front door `.skilled/bin/compiled-route.cjs:40-48` | deepseek-04 | not reopened | The legacy sentinel. Not load-bearing here |

### F. Validators

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 96 | `validator-registry.json` | deepseek-03 | count | 40 rules: 20 authored-template, 14 operational-runtime and 6 structural |
| 97 | `check-ac-coverage.sh:291`, `:327`, `:346` | deepseek-03 | resolved | Counts `file:line` shapes and never checks that the target exists |
| 98 | `check-goal.cjs:44-49` | BASE2, deepseek-03 | resolved | Four structural checks |
| 99 | `check-goal.cjs:36-43`, `:46` | deepseek-03 (`:32-42`) | resolved | The literal placeholder table and its check. deepseek-03's range overlaps it |
| 100 | `check-goal.cjs:681`, `:693`, `:697` | synthesis | resolved | The frozen exit contract |
| 101 | `validate_document.py:255-256` | synthesis | resolved | An undetected type falls back to README rules |
| 102 | `validate_document.py:540-545` | synthesis | resolved | Structure enforcement on by default, with an opt-out |
| 103 | `quick_validate.py:246-251` | synthesis | resolved | An MCP token rule fails a command and warns for a skill |
| 104 | `extract_structure.py:1132-1143` | swe-02 | resolved | DQI bands at 90, 75 and 60 |
| 105 | `hvr_scan.py:17-21` | BASE2, glm-04 | resolved | Reader-needed categories and the floor |
| 106 | `template-rules.json` | synthesis | count | 13 document types |
| 107 | `.claude/agents/` | swe-02 | count | 12 agent files |
| 108 | `description:` lines in skill docs | swe-06 (3,551) | count | 3,658 |
| 109 | `file:line` citations in `.skilled/skills/**/*.md` | swe-06 (456) | count | 403 by swe-06's pattern. 500 path-aware: 228 in range, 4 past the end, 42 ambiguous, 226 unresolved |
| 110 | `exhausted-approach-respect.md` citing `.skilled/commands/deep/research.md:307-317` | synthesis | failed | Dead: the target has 160 lines |
| 111 | `pause-sentinel-halt.md` citing `.skilled/commands/deep/research.md:176-185` | synthesis | failed | Dead: the target has 160 lines |
| 112 | `session-capturing-pipeline-quality-coverage.md` citing `tests/memory-pipeline-regressions.vitest.ts:67` and `:109` | synthesis | failed | Dead: the target has 63 lines. Two citations |

### G. sk-prompt and sk-design

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 113 | `sk-prompt/SKILL.md:3`, `:12`, `:38` | grok-05, glm-04 | resolved | The prose promises 7 frameworks |
| 114 | `sk-prompt/SKILL.md:307-315` | grok-05, glm-04 (`:309-315`) | resolved | The selection matrix takes judged inputs |
| 115 | `sk-prompt/SKILL.md:321` | grok-05 | resolved | CLEAR: 50 points, threshold 40 |
| 116 | `sk-prompt/assets/framework-registry.json` | grok-05 | count | 5 ids, read by `sweep-benchmark.cjs` |
| 117 | `sk-prompt/SKILL.md` and `references/patterns-evaluation.md` | grok-05 | count | 23,081 and 36,580 bytes |
| 118 | `sk-design/SKILL.md:202-203` | orchestrator | resolved | Rule 6 says the opposite of the live route, so it is stale |
| 119 | `sk-design-fundamentals/SKILL.md:197` | grok-06, grok-09 | resolved | `classify_intents` exists only as pseudocode |
| 120 | `sk-design/benchmark/README.md:26-27` | grok-06 | resolved | No hub Lane C run was archived |
| 121 | sk-design playbooks | grok-06, mimo-06 | count | 58 files: 53 scenarios and 5 indexes |
| 122 | md-generator `validate.ts:699-701`, `:729-737`, `:765` | synthesis | resolved | Hard-failure gate, `claimsScore` advisory and exit |
| 123 | md-generator `validate.ts:466-479` | the grok lead's steer | failed | No 80-point rule sits there. The gate is at `:699-701` (K14) |
| 124 | md-generator `report-gen.ts:196-199` | synthesis | resolved | 80 labeled "Pass" in the report only |
| 125 | md-generator `quality-checklist.md:29`, `:476-477`, `SKILL.md:309`, `assets/design-md-prompt-template.md:74` | synthesis | resolved | The docs' 80-point `isPass` |

### H. Vendored npm compaction

`specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/vendor/compaction/`.

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 126 | `compact.ts:76-100` | synthesis (K1) | resolved | Every candidate is batched or `batchCalls` throws |
| 127 | `compact.ts:104-118` | synthesis | resolved | Pinned calls keep, at `:110` |
| 128 | `compact.ts:120-135` | synthesis | resolved | `askBatch` reads every answer through `noulAnswer` |
| 129 | `compact.ts:284-285` | grok-03 | resolved | The `??` default, which only pinned calls reach. grok-03's fail-open claim is refuted (K1) |
| 130 | `compact.ts:284-285` | the swe lead (`:283-284`) | drifted | One line off |
| 131 | `request.ts:69-83` | synthesis | resolved | `noulAnswer` throws on a missing answer |

### I. Run facts and counts

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 132 | Iteration files and state logs | brief | count | 45 files. Every state log ends `maxIterationsReached` |
| 133 | `research/observability-events.jsonl` | synthesis | count | 241 events: 5 started, 225 progress, 2 stall, 2 timestamp anomaly, 5 completed, 2 metadata refresh |
| 134 | Runner durations | synthesis | count | grok 949,076 ms, deepseek 1,675,845, mimo 4,482,080, swe 3,389,670, glm 3,244,855 |
| 135 | N ids in the iterations | synthesis | count | 77: grok 17, deepseek 26, mimo 13, swe 12, glm 9 |
| 136 | What Not To Build rows 1 to 72 | synthesis | count | 0 rest on cost or quota |
| 137 | `research/findings-registry.json`, `resource-map.md` | synthesis | count | 57 of 65 source findings kept, 0 from grok, 19 resolved questions, 0 ruled-out directions, `iterationsCompleted` 5. The resource map lists 0 references |
| 138 | Lineage audit and effect ledgers, base64-decoded | synthesis | count | No advisory, containment, violation or quarantine marker. mimo's audit ledger holds 14 authorization decision frames against 2 in each other lineage |
| 139 | Lineage logs | synthesis | count | 0 calls to port 8300 and 0 `jev` invocations. No tool transcript is kept |
| 140 | `spec.md` of 002, 003, 005 and 006 | synthesis | count | 0 mentions of Deem, `cli-classifier` or `cli-deem` in each |
| 141 | This phase's `goal.md:86` | synthesis | resolved | The fan-out recorded no containment advisory |
| 142 | `../goal.md:49-54`, `:126`, `:130-131` | synthesis | resolved | D1 to D6, an earlier round's containment row and the two 2026-09-27 amendments |
| 143 | `spec.md:104-126`, `context/research-angles.md:131-768` | brief | resolved | The research brief and the wave map |
| 144 | `../001-deep-research/context/repo-rules-digest.md:52-108` | brief | resolved | Q1 to Q15 and the red flags |

### J. Planned phase lines and lineage files

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 145 | 002 `spec.md:3` to `:216` | synthesis | resolved | Each line section 14 amends holds the text quoted there. `:97` is the shared-helper line |
| 146 | 003 `spec.md:3` to `:160` | synthesis | resolved | As J1 |
| 147 | 005 `spec.md:3` to `:212`, stop line `:168-178` | synthesis | resolved | As J1 |
| 148 | 006 `spec.md:3` to `:191` | synthesis | resolved | As J1 |
| 149 | `swe/iterations/iteration-007.md:151` | the swe lead | resolved | The `rm -rf` step (row 104) |
| 150 | `swe/steer.md:115` | synthesis | resolved | The lead's DEFECT line on the 22 lost files |
| 151 | `deepseek/iterations/iteration-009.md:94-98` | synthesis | resolved | The failover drop (row 81) |
| 152 | mimo-01's count scripts | mimo-01 | not reopened | Void counts (K4) |
| 153 | mimo's transcript figures: carry, tool counts, re-reads and hook output | mimo-01, mimo-02, mimo-04, glm-03 | not reopened | Lineage-reported, spot-read in mimo's results files |
| 154 | glm-03's `sk-doc/ROUTER.md:145-152` | glm-03 | not reopened | Not load-bearing |
| 155 | deepseek-01's `deem_server.py:120-129` | deepseek-01 | not reopened | Covered by row 4 |
| 156 | grok-03's 2,225-byte schema count | grok-03 | not reopened | Lineage-reported (row 78) |
| 157 | swe-05's 0 of 9 zero-score prompts | swe-05 | not reopened | Lineage-reported (row 94) |
| 158 | swe-03's 34 sk-doc leaf-gold scenarios | swe-03 | not reopened | Lineage-reported (R25) |

### K. BASE2 seams under the ranked records

Reopened today because R1, R2, R20 and R21 cite them.

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 159 | `system-skill-advisor/runtime/lib/scorer/ambiguity.ts:22-36`, `:44-58` | BASE2 (R1) | resolved | The cluster rule, and where `ambiguousWith` is set |
| 160 | `routing-accuracy/score-outcome-rerank.mjs:40-51` | BASE2 (R1) | resolved | The corpus loader R1 copies: skill-firing rows only |
| 161 | `routing-accuracy/capture-scorer-eval-baseline.mjs:35-46`, `:70-76` | BASE2 (R1), 002 REQ-005 | resolved | The capture's env and the alias-aware match |
| 162 | `routing-accuracy/scorer-eval-baseline.json` | BASE2 (R1) | count | Holdout 53/70, ambiguity slice 18/24, full corpus 152/195 |
| 163 | `routing-accuracy/labeled-prompts.jsonl` | BASE2 (R21) | count | 195 rows: 127 `yes` and 68 `no` for Gate 3 |
| 164 | `.skilled/hooks/goal/pi/goal-context.ts:221-244` | BASE2 (R2) | resolved | Pi's `turn_end` runs goal-core's heuristic and sends a hidden nudge |
| 165 | `.skilled/hooks/goal/lib/goal-core.cjs:290-297`, `:596-620` | BASE2 (R2) | resolved | The clamp appends `...`, and the heuristic's truncation branch reads it |
| 166 | `.opencode/plugins/opencode-goal.js:2197-2230`, `:2378-2380` | BASE2 (R2) | resolved | The plugin heuristic, and a verifier failure mapped to `blocked` |
| 167 | `sk-doc/sk-create-goal/SKILL.md:110`, `:121-122` | BASE2 (R20) | resolved | The handoff rule, and rules 4 and 5 |

---

## 16. Evidence Quality and Caveats

**Independence.**
- Four agreements are independent and unsteered in wave 1 (A1 to A4). One wave-1 agreement is steered: glm-01 with mimo-03, because mimo-03 read its lead's steer on method first.
- After cross-reading, nine agreements rest on code or counts the lineage opened itself (G1 to G9) and five cite a sibling only (S1 to S5). None of the fourteen counts as corroboration.
- Every place where a lead's steer preceded an agreement is listed in section 11: mimo-03 and mimo-04, grok-07 to grok-10, deepseek-04, deepseek-07, deepseek-08 and glm-04. The findings there stay each iteration's evidence, not the lead's authority.
- Steer reads are inconsistent. I add grok 9 and 10 to the brief's list, because both say they read `steer.md`. glm-05 says no `steer.md` ever landed while its lead reports that glm-04 followed one. I count glm-04 as steered.

**One Claude layer.** The two baselines, the five leads and this synthesis are all Claude Opus 5.5. Where my reading agrees with a baseline, that is one lens, not corroboration.

**Timestamps and self-report.** grok's state log has 10 anomalous and 1 missing timestamp among 12 records, and mimo's has 1 anomaly in 12. Order here comes from iteration numbers and the runner's events. Each lineage's `newInfoRatio` is self-report: grok's values lie between 0.6 and 0.95, deepseek's, swe's and glm's between 0.7 and 0.9 and mimo's between 0.75 and 1.0. New information was judged from each iteration's New against baseline table and the code.

**Two packages.** Every `jev` here is the Python `jev-cli` 0.6.2 unless the sentence names the npm `jevctl` 0.2.3. Their exit codes disagree, and rows 77 and 99 keep the `jevctl` points apart.

**Vendor claims.** The card's 96.3%, Tare's 0.6788, the JevBench figures, the 9B's RAM figure and every Jev price are vendor claims, never reproduced here. Deem's latencies are the orchestrator's measurements on synthetic input. Deem's quality on this repository's judgments is unmeasured, so any lineage accuracy claim for the 0.8B is inferred or a vendor claim.

**Containment advisories: none in round 3.** The runner logged no containment event, `orchestration-summary.json` records `completed_with_containment_advisory` at 0, this phase's `goal.md:86` records none and the decoded lineage ledgers hold no advisory, containment, violation or quarantine marker. Each lead wrote only its own `steer.md`, and mimo's count scripts and results files sit inside its own lineage directory. The parent goal's containment row (`../goal.md:126`) records an earlier round.

**mimo's authorization frames.** mimo's audit ledger holds 14 `authorization.decision.recorded` frames against 2 in each other lineage, 12 of them recorded under the operator's actor. The ledger alone does not say why. They are not containment advisories.

**Private data.** A pattern scan of all 45 iterations and of mimo's results files found no quoted transcript, reply or goal-state text. mimo's results files hold counts and committed review-table cell values. No iteration is listed for quoting private text, and none of this file's figures carries any.

**Call containment is unverifiable.** The lineage logs show 0 calls to port 8300 and 0 `jev` invocations, but they keep no tool transcript, the server's access log is off by default and `server.log` was rewritten after the run (question 52).

**The merge under-counts again.** The merged registry keeps 57 of 65 source findings with none from grok, 0 ruled-out directions and `iterationsCompleted` 5 of 45. The resource map lists 0 references. This file rests on the iteration files, never on the merge.

**Files that changed under the lineages.** `deem-ctl` changed after the run, so lineage line numbers refer to the pre-run copy and section 3 describes the live file. glm edited its own iterations 2 and 3, and its lead reviewed them before that cleanup. I read the current files. swe's lineage `research.md` repeats counts corrected in K10 and K12. The runner's `skippedCount` values, 14, 26, 53, 55 and 73, are uninterpreted here.

**Judgment calls, recorded.**
- R23 at next, rank 4, above R21, because R21's Deem half needs the client.
- The hub minted with the client in 008 and the move held for a kept Deem result in 009 (disagreement 2).
- R24, R25 and R26 at later, against their lineages' next or build-now.
- Deem preferred for any payload drawn from the operator's sessions.
- Rows 102 and 108 are this file's own drops, and row 100's order-flip clause goes further than grok-08.

**Adjacent defects, for their owners.**
- spec-kit: `AC_COVERAGE` never checks that a cited file or line exists (`check-ac-coverage.sh:291`, `:327`, `:346`).
- sk-design: rule 6 at `SKILL.md:202-203` is stale, `classify_intents` exists only as pseudocode and the md-generator's 80-point `isPass` lives only in its docs.
- sk-prompt: the prose promises 7 frameworks while the registry holds 5.
- sk-doc: an undetected document type falls back to README rules without notice, and the MCP-token rule fails a command but only warns for a skill. Four skill-doc citations point past the end of their files (section 15, rows 110 to 112).
- The operator: Deem's open CORS with no authentication (question 44), and `deem-ctl stop` does not wait for the process to exit, so a quick restart could race on the port (inferred).
- The deep-research workflow: the merge under-count and the empty resource map.

**Deviations.** Gate 5 loaded the nine rule files `REPO RULES.md` names for this write, read-only, although the brief said to load nothing else. No scratch file was written: every count ran as a one-liner.

---

## 17. References

**Inputs, relative to this phase.**
- `scratch/synthesis-brief.md`, `spec.md`, `plan.md`, `goal.md`, `context/research-angles.md` and `context/deem-local.md`.
- `research/lineages/{grok,deepseek,mimo,swe,glm}/iterations/iteration-*.md` (45 files), each lineage's `research.md`, `steer.md`, state log, registry, strategy and audit and effect ledgers.
- `research/findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json`, `orchestration-status.log`, `observability-events.jsonl` and `deep-research-config.json`.
- BASE2 `../004-deep-research-expansion/research/research.md`, BASE1 `../001-deep-research/research/research.md` and the checklist `../001-deep-research/context/repo-rules-digest.md`.
- The parent `../goal.md` and the Planned specs `../002-advisor-jev-tiebreak-arm/spec.md`, `../003-goal-verifier-jev-shadow/spec.md`, `../005-compaction-recall-harness/spec.md` and `../006-goal-criteria-lint/spec.md`.

**Deem.**
- `context/deem-main/serve/deem_server.py`, `serve/deem_mcp.py`, `src/deem/primitives.py` and `src/deem/format.py`.
- `~/.local/share/deem/bin/deem-ctl` (live), `~/Library/LaunchAgents/com.skilled.deem-update.plist` and the pre-run copy `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/17193ad8-031f-432d-a47f-2b525f70e851/scratchpad/r3/deem-ctl.prefix`.

**Jev.**
- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py` and `.skilled/skills/cli-jev/`.
- The vendored npm `jevctl` compaction: `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/vendor/compaction/compact.ts` and `request.ts`.

**Hooks, plugins and dispatch.**
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`, `shared.ts` and `compact-inject.ts`, plus `.skilled/hooks/session-lifecycle/claude/compact-inject.ts`.
- `.claude/settings.json` and `.opencode/plugins/opencode-goal.js`.
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` and `dispatch-audit.mjs`.

**Routing and hubs.**
- `.skilled/bin/compiled-route.cjs`, `compiled-route-sync.cjs` and `compiled-route-guard.cjs`.
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and `compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` and `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`.
- `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/repo-rules/skill-hub-routing.md` and `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs`.

**Advisor and goal seams.**
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs`, `capture-scorer-eval-baseline.mjs`, `scorer-eval-baseline.json` and `labeled-prompts.jsonl`.
- `.skilled/hooks/goal/pi/goal-context.ts`, `.skilled/hooks/goal/lib/goal-core.cjs` and `.skilled/skills/sk-doc/sk-create-goal/SKILL.md`.

**Validators.**
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` and `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh`.
- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`.
- `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `quick_validate.py` and `extract_structure.py`, identical to the copies under `sk-doc/scripts/`.
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` and `.skilled/skills/sk-doc/shared/assets/template-rules.json`.

**sk-prompt and sk-design.**
- `.skilled/skills/sk-prompt/SKILL.md`, `references/patterns-evaluation.md` and `assets/framework-registry.json`.
- `.skilled/skills/sk-design/SKILL.md`, `benchmark/README.md` and `sk-design-fundamentals/SKILL.md`.
- `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/validate.ts` and `report-gen.ts`, `references/quality-checklist.md`, `SKILL.md` and `assets/design-md-prompt-template.md`.

---

## 18. Convergence Report

The deep-research workflow appends the convergence report under this heading after this synthesis.

- Stop reason: maxIterationsReached, for every lineage
- Total iterations: 45 (grok 10, deepseek 10, mimo 10, swe 10, glm 5)
- Questions answered: 8 / 8 (A to H)
- Remaining questions: none of A to H. Section 13's open questions stay open
- Last iteration of each lineage: grok-10, "If only one phase ships" (newInfoRatio 0.6, self-reported); deepseek-10, "The two-backend amendments" (0.7); mimo-10, "Kill criteria as printed numbers" (0.8); swe-10, "The first PR-sized slice" (0.7); glm-05, "What not to build, round 3" (0.7)
- Convergence threshold: 0.05, unused, because convergence mode was off and each lineage was forced to its cap
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
- Synthesis event: `synthesis_incomplete` (ledger sequence 1), failing invariant `count_only_state_findings_not_reconstructed`. The lineage state records carry 173 count-only findings, and the merge registry rebuilt 57 from 65 source findings, as in rounds 1 and 2. This synthesis read all 45 iteration files directly, so the gap is in the merge, not in this file.
