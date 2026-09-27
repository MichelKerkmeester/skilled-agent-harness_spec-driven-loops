# Iteration 4: grok-04: Which dropped rows a local model revives

## Focus

Question B. Classify every drop row in BASE1 (1–43) and BASE2 (44–72) by the reason that carries the drop, then test which of those reasons a local 0.8B removes. Warm latency is LOCAL's, spawn is unmeasured, so no live hook is claimed to fit.

## Sibling check

- `research/lineages/deepseek/iterations/iteration-001.md` (iteration 1). Read. Its Deem-available check is the one this lineage uses from here: `GET /health` passes only when `status` is `ok`, `backend` is not `stub`, and `model` is `deem-0.8-v1` (that file's N-deepseek-01-1). Probe budget 500 ms inside a hook, and a hook never starts the server (N-deepseek-01-2). Quoted as deepseek-01's. This iteration does not reopen `deem_server.py`.
- `research/lineages/mimo/iterations/`: no iteration file.
- `research/lineages/swe/iterations/`: no iteration file.
- `research/lineages/glm/iterations/`: no iteration file.

Prefix `B1` = `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md`. Prefix `B2` = `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md`. Prefix `P` = `specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research`.

## Findings

### Reason class

The class is the load-bearing clause in the row's Reason cell, read at `B1:1045-1087` and `B2:794-822`. A row can have a second clause. The class is the one that still stands if the other clause is removed.

| Class | Rows |
|---|---|
| latency/egress | 1, 5, 40, 44, 69, 72 |
| authority | 2, 11, 12, 13, 14, 15, 16, 19, 24, 29, 31, 39, 61, 63 |
| gold | 3, 4, 7, 20, 21, 22, 23, 32, 34, 35, 50, 59, 70 |
| surface | 17, 18, 25, 26, 27, 41, 46, 53, 62, 64 |
| default-score | 9, 47, 48, 56 |
| other | 6, 8, 10, 28, 30, 33, 36, 37, 38, 42, 43, 45, 49, 51, 52, 54, 55, 57, 58, 60, 65, 66, 67, 68, 71 |

72 rows, each once. Authority means a model answer would replace a repository fact, a frozen gate, or a human verdict. Surface means there is no seam, the package is the wrong one, or nobody reads the output. Other holds consent (6, 42), secrets (38, 43), a wrong measure (45, 54, 55, 57, 58, 71), and the rest of the non-fitting reasons.

### What a local 0.8B can change

LOCAL measured warm p50 about 60 ms and p95 62.8 to 78.5 ms on synthetic inputs (`P/context/deem-local.md:34-38`). Spawn inside a hook is unmeasured (`:50`). A local call removes egress of the payload. It does not remove a missing label, a code-owned decision, a default number, or a missing seam.

Rows whose class is authority, gold, surface, or default-score do not flip. That is 14 + 13 + 10 + 4 = 41 rows. The 25 "other" rows do not flip either: a local server does not make an always-on compactor opt-in (row 6), does not fix a 0.57 false positive (row 8), and does not make a regex see file contents (row 49).

### The six latency/egress rows, reopened

| Row | Stated reason | Against the warm p95 | Flips? |
|---|---|---|---|
| 1 | Advisor child killed at 2500 ms (`B1:1045`). Revival needs p95, spawn included, inside the remaining budget | Model p95 78.5 ms is under 2500 ms. Spawn is unknown, so the revival rule is not met | No |
| 5 | PreCompact command hook: 1800 ms internal, 3 s hook, one user report of 5.6 s (`B1:1049`) | Same gap. The function-hook route is R19, a different row | No |
| 40 | A cache hits 16 of 439 prompts, and a first ask still meets the 2500 ms kill (`B1:1084`) | The 3.6% figure is a repeat rate, not a latency. The first-ask half has the same spawn gap as row 1 | No |
| 44 | Per-request await, cache invalidation, pruning that survives an error (`B2:794`) | Iteration 3 opened `README.md:85` and `:87`. Local removes the API charge and the egress. Cache invalidation and the saved prune remain | No |
| 69 | Pi `turn_end` is awaited, so a call holds every turn (`B2:819`) | A local call still holds the turn for its duration. Shorter is not "does not hold" | No |
| 31 | The drop stands on Q11, done-gate authority, not on the 1200 ms bound (`B1:1075`) | Classed authority above. Listed here because the angle named it. The millisecond comparison does not touch the standing reason | No |
| 72 | Sends the goal off the machine and duplicates R20 (`B2:822`) | Local removes the egress half. "No new fact" remains | No |

None of rows 1, 5, 31, 40, 44, 69, or 72 flip. The warm p95 is evidence that the model pass itself is small. It is not evidence that a hook that spawns a client fits.

### High-sensitivity arms

Prefer Deem when both backends pass, for any later arm whose payload is repository text, a transcript, or goal evidence. That preference is deepseek-01's F10, quoted, and it matches parent D3: the served model is the 0.8B. Jev remains the preference when the feature needs the hosted provider's typed path and no field rewrite (iteration 2).

Local does not remove the reason these arms are offline:

- R2's Jev arm is not built when the better of the heuristic and the tail-window arm adds no false `met` and holds false `not_met` at or below 0.10 (`B2:259`). That kill is a measured error rate, not egress.
- R4 promotes when R2's rows exist, the regex cannot cut false fires without new misses, and a reader is named (`B2:738`).
- R8 promotes when a local replay shows the heuristic stops later than the derived gold and a five-lineage read confirms the gold (`B2:742`).
- R10 stays later because question 7 is answered no (`B2:744`) and row 50 found no usable narrative gold (`B2:800`).
- R15 promotes when a labeled pair set exists (`B2:747`).
- R19's census is zero-call (`B2:236-249`). The Jev arm is not built when fit throws on at least half the sessions, the offline reduction bound is under 0.25, or kept tokens exceed three times stock (`B2:249`). Local removes transcript egress for that arm once the census says to build it. It does not skip the census.

### Idea N-grok-04-1

- **Idea:** `N-grok-04-1`. Do not revive a live hook from rows 1, 5, 40, 44, or 69 because the warm p95 is under the hook budget. Type: none. This is a refusal.
- **Question:** B
- **Builds on:** those five rows, plus row 31 and row 72 which the angle also named. LOCAL:34-38 and LOCAL:50.
- **Value:** stops a speed number from reopening drops whose reason is spawn, cache, authority, or a hold on every turn.
- **Seam:** none to add.
- **Metric, baseline, harness:** spawn-included p95 of one `noul` from inside the advisor hook and inside PreCompact. Baseline: UNKNOWN (`deem-local.md:50`). Warm p95 is not that metric. Harness: a stub client whose spawn is timed, which deepseek-01's sleeping fixture would host. Not run.
- **Savings:** none. The saving is not building the live form.
- **Cost, latency, privacy:** a revived live call would send advisor prompts or transcripts to whichever backend the switch picked. Deem keeps them local. The Python `jev-cli` still needs a bearer key (iteration 2).
- **Two-backend gate:** no switch. With neither backend, behavior is exactly today's.
- **Rough LOC:** 0.
- **Verdict:** drop.
- **Confidence:** confirmed that the row texts do not say "the model pass is too slow" alone, except row 1 and row 5, whose revival text requires spawn. Inferred that spawn could be small enough. What would confirm a revival is a measured spawn-included p95, not this reading.
- **Kill criterion:** a measured spawn-included p95 for one question, from inside the advisor child, at or under the remaining budget after the 2500 ms kill, would reopen row 1's revival rule and only that rule. It would not reopen rows 5, 40, 44, or 69.

### Idea N-grok-04-2

- **Idea:** `N-grok-04-2`. When R19's arm or R2's Jev arm is built, its own switch prefers Deem if deepseek-01's health check passes, and prefers Jev only when that check fails and `jev auth status` exits 0. Type: `noul` for the compaction keeps, `choice` or `noul` for the verifier shadow, matching the arm. Not built in this phase.
- **Question:** B, H
- **Builds on:** `B2:249`, `B2:259`, deepseek-01's N-deepseek-01-1.
- **Value:** transcript and goal text stay on the machine when the local server is the one LOCAL measured.
- **Seam:** the arm scripts BASE2 already names. Not created here.
- **Metric, baseline, harness:** those arms' existing kill lines. This idea adds no metric.
- **Savings:** the egress, not tokens. Token savings stay the arm's census.
- **Cost, latency, privacy:** Deem: state stays local, no auth, CORS `*` is the operator's exposure (deepseek-01 F4, quoted). Jev: state leaves. A missing answer throws (row 9). A slow answer past the arm's own cap is `unmeasured`, not a score.
- **Two-backend gate:** per arm, default off, matching row 42 (no global switch). Neither available: the census still runs, the arm does not, output matches the no-key census.
- **Rough LOC:** the preference is a branch inside an arm that does not exist yet. Not sized here.
- **Verdict:** later.
- **Confidence:** confirmed as a preference, not as a claim that the arms should be built now.
- **Kill criterion:** R19's fit kill or R2's heuristic kill printing their fail line. The preference dies with the arm.

## Sources Consulted

- `B1:1039-1087`
- `B2:788-829`, `:236-259`, `:738-747`
- `P/context/deem-local.md:34-38`, `:50`
- `research/lineages/deepseek/iterations/iteration-001.md` findings F1–F4, F8–F10 and ideas N-deepseek-01-1, N-deepseek-01-2 (quoted)
- This lineage's iteration 3 for row 44's cache lines
- No `steer.md`

## Assessment

newInfoRatio: 0.70

Novelty: the class table and the non-flip against the warm p95 are new. The row texts are BASE1's and BASE2's.

Confidence: the class of each row is a reading of its Reason cell. A different reader could move row 19 into gold or row 38 into egress. What would change the flip column is a spawn measurement, which this iteration did not run.

Convergence telemetry: ratios 0.90, 0.95, 0.85, 0.70. Mean of the last three is 0.83, above 0.05. Mode is off. Continue.

## Reflection

What worked: classing the row before asking whether 60 ms matters. Most rows are not about speed.

What failed: mimo, swe, and glm have no iteration file yet, so the wave-2 contest is only against deepseek-01.

Ruled out: reviving rows 1, 5, 40, 44, and 69 from the warm p95. Ruled out: treating R2, R4, R8, R10, R15, or R19 as unblocked because the payload can stay local.

## Recommended Next Focus

grok-05. The first finding is the framework-label count: `sk-prompt` `SKILL.md` claims 7 frameworks and `framework-registry.json` holds 5.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| 41 rows are authority, gold, surface, or default-score, and a local model does not flip them | new classification of BASE texts | `B1:1045-1087`, `B2:794-822` |
| Rows 1 and 5 do not flip on a 78.5 ms model p95 | new against the revival rule | `B1:1045`, `:1049`, `deem-local.md:34-38`, `:50` |
| Row 44 does not flip | confirms iteration 3 | `B2:794` |
| Row 69 does not flip because the await still holds the turn | new | `B2:819` |
| R19 and R2 stay gated on their census kills | confirms BASE2 | `B2:249`, `:259` |

## Hand-off

- The Deem health check this lineage will cite is deepseek-01's: status, backend not stub, model `deem-0.8-v1`.
- Do not quote the warm p95 as a hook budget. Spawn remains UNKNOWN.
- glm, mimo, and swe had no iteration file at this read.
