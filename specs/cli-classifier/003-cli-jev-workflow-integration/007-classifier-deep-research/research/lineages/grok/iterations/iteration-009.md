# Iteration 9: grok-09: Claims the survivors lean on

## Focus

Question H, wave 4. For each survivor from iterations 1–8, the vendor claim it would be using, the local number that replaces that claim, and the result that kills the survivor. Three gaps named in `steer.md` are recorded here and not re-derived: compact fail-open, no input-length cap, calibration not visible.

## Sibling check

Read before this file:

- Own iterations `research/lineages/grok/iterations/iteration-001.md` through `iteration-008.md`.
- `research/lineages/deepseek/iterations/iteration-003.md` (iteration 3, newest). Advisory is not a gate. No claim-table contest.
- `research/lineages/swe/iterations/iteration-001.md` (iteration 1, newest). Their client is build-now. This table does not adopt that. The disagreement is in grok-10.
- `research/lineages/mimo/iterations/`: no iteration file.
- `research/lineages/glm/iterations/`: no iteration file.

`steer.md` was read.

Prefix `P` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`.

## Findings

### Claim table

| Claim | Source | What replaces it here | Survivor that would lean on it | Kill if the claim fails |
|---|---|---|---|---|
| JevBench hard: Jev 74.1, Deem 9B 65.8, 231 items | `P/context/deem-main/docs/MODEL_CARD_9B.md:27-30`, vendor | Nothing. LOCAL did not run JevBench. The served model is 0.8B | None. Serving 9B is already dropped (N-grok-01-1) | Any arm that cited this row as the served model's accuracy |
| 0.8B long-policy 96.3%, trap 91.8% | 0.8B card, vendor, different runtime (iteration 1) | Nothing. `P/context/deem-local.md:52` says quality is unmeasured | N-grok-03-2, N-grok-04-2, N-grok-05-1 if they treated the card as this repo | A labeled set on this repo far below that figure. Until then they wait |
| 0.8B 362 ms, 0.9 GB int8, Rust CPU | 0.8B card, vendor | LOCAL p50 about 60 ms and footprint 3,368 MB, short synthetic inputs only (`deem-local.md:32-38`) | No keep rule. N-grok-04-1 already refuses to revive hooks from warm p95 | Spawn-included p95, still unmeasured, or a transcript-sized state |
| 9B long-state P50 788 ms at 3,200+ tokens | `MODEL_CARD_9B.md:35-36`, vendor, 9B only | Not a 0.8B number. Transcript latency on the served server is UNKNOWN (no length cap, `deem_server.py:203-211`) | None | An arm that used 788 ms as the 0.8B budget |
| typesafe-sdk is a drop-in | `deem_server.py:2-6`, vendor | The SDK's serialized JSON is not in this repo | N-grok-02-2, already dropped | A real SDK body that still sends `criteria` |
| deem-v2 macro acc 0.6788, flip 0.968 | `eval/tare/leaderboard.md:97-109`. Not the release, not the served commit | No local flip | N-grok-08-2 must not quote it | Using it as the served model's stability |
| Compaction fail-opens a missing answer to keep both | `R/jev-cli-main/src/vendor/compaction/compact.ts:284-285` | Not a vendor speed claim. The throw is the fix | N-grok-03-2 | Shipping the two nouls without the throw |
| No calibration file names `deem-0.8-v1`; health shows status, model, backend only | iteration 1 and `deem_server.py:772-777` | LOCAL temperature is 1.0 (`deem-local.md`) | N-grok-01-2 | A threshold on raw probabilities |
| `deem-ctl update` has no pin | iteration 7 | A stored commit pair, outside the server | N-grok-08-2, any keep rule | The commit pair changes and the rule still thresholds |
| The framework registry is what prompt-improve renders | iteration 5 | `sweep-benchmark.cjs:45-48` is a benchmark reader of that JSON. No other runtime reader in the `.skilled` search this iteration | N-grok-05-1's context-savings claim | The savings claim falls. The idea stays later only if a production renderer appears |
| `select_intents` / `classify_intents` already run as code | iteration 6 | A search of `.skilled` for those names in `js/ts/py/cjs/mjs` hit one archived regex over SKILL.md text (`source-model.cjs:183`) and no definition of `classify_intents` | N-grok-06-1 | The drop's premise ("code already does this") is unverified. The idea stays dropped because the seam is skill prose the main AI reads, and a choice would still need labels |

LOCAL speed and memory are measurements on this machine. They are not quality claims. The 17.9 GB 9B size is the orchestrator's figure in `research-angles.md` section 1, not a line in the vendored markdown.

### Which survivor waits on accuracy

N-grok-03-2, N-grok-04-2, and N-grok-05-1 judge text. They wait on a measured accuracy set for the served commit. LOCAL's p50 does not move them.

N-grok-07-1 (the client) and N-grok-08-2 (one-question flip) wait on a caller and on that one measurement. They must not threshold. An update that changes the commit pair kills a threshold even if yesterday's flip was low (N-grok-08-2's kill).

### Contrarian line per survivor

| Id | Verdict | Line that kills it |
|---|---|---|
| N-grok-01-2 | later | A calibration file names the served commit and the client stores that pair. Until then, no threshold |
| N-grok-03-2 | later | The missing-answer path still returns keep 1, or the boundary is not the only call site |
| N-grok-04-2 | later | R19 or R2's existing census kill already fired, or the arm still sends text to a hosted API |
| N-grok-05-1 | later, savings fallen | No production renderer reads the registry (this iteration's search) |
| N-grok-07-1 | later | A runtime caller appears and the stub check reads `backend` (ALL-4). Build-now from swe-01 is not adopted |
| N-grok-08-2 | later | Flip above 0.10, or the commit pair changes during the three calls |

### Idea

No new build. `N-grok-09-1` is the table above, verdict drop as a feature, because a table is not a phase.

- **Question:** H
- **Builds on:** iterations 1–8. `steer.md`.
- **Value:** stops a later phase from citing the 9B JevBench row or the 96.3% figure as this machine's result.
- **Seam:** none.
- **Metric, baseline, harness:** the table. Baseline is the card text. Harness: not a run.
- **Savings:** unmeasured.
- **Cost, latency, privacy:** none.
- **Two-backend gate:** no switch.
- **Rough LOC:** 0.
- **Verdict:** drop.
- **Confidence:** confirmed for the citations opened this iteration (`MODEL_CARD_9B.md:27-36`, `sweep-benchmark.cjs:45-48`). The earlier iterations' code claims are quoted as theirs.
- **Kill criterion:** a production renderer or a `classify_intents` module shows up outside SKILL.md and the benchmark tree. That reopens N-grok-05-1 or N-grok-06-1.

## Sources Consulted

- `P/context/deem-main/docs/MODEL_CARD_9B.md:18-37`
- `P/context/deem-local.md:32-52`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:40-49`
- `.skilled/specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/004-compiler-n1-shadow/compiler/source-model.cjs:183`
- Own iterations 1–8
- `steer.md`
- Sibling files named above

## Assessment

newInfoRatio: 0.60

Novelty: the JevBench row was missing from iteration 1. The registry's only runtime reader found here is the benchmark sweeper. The intent-scorer drop's premise is unverified.

Confidence: confirmed for the files opened this iteration. Carry-forward rows are quoted.

Convergence telemetry: last three 0.80, 0.80, 0.60. Mean 0.73. Mode is off. One iteration remains.

## Reflection

What worked: separating vendor claims, LOCAL measurements, and code facts.

What failed: the `.skilled` search is not the whole repository. A renderer outside `.skilled` would reopen N-grok-05-1.

Ruled out: using JevBench 65.8, the 96.3% card figure, deem-v2's flip, or LOCAL p50 as a quality number.

## Recommended Next Focus

grok-10. One phase, one line, and the disagreement with swe-01.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Jev 74.1 vs Deem 9B 65.8 is a 9B vendor row | new in this lineage's table | `MODEL_CARD_9B.md:27-30` |
| Registry JSON is read by the benchmark sweeper | new | `sweep-benchmark.cjs:45-48` |
| No `classify_intents` definition in `.skilled` code | new | search this iteration |
| Judgment survivors wait on labels, not on p50 | carried, now explicit | `deem-local.md:52` |

## Hand-off

- grok-10 uses this table. No judgment arm ships on a card percentage.
- The synthesis must not treat N-grok-06-1's "code already does this" as confirmed.
- N-grok-05-1's byte savings are not a production saving on the evidence here.
