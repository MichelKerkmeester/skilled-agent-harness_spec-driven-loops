---
title: "UX and Cost Lane, Segment Three: hook health default, brief cost and the cold path"
description: "Synthesis of the ux-cost-3 lineage, run against the built state of phases 011, 012 and 013: what a default hook-health record costs, what the live brief costs per prompt, and which three changes the lane can defend."
trigger_phrases:
  - "ux cost segment three"
  - "hook health default"
  - "brief cost after phases 011 012 013"
---

# UX and Cost Lane, Segment Three

Lane label `ux-cost-3`. Two carried questions from segment three: (c) the hook-health default, and (f) the brief and cold-path cost per prompt with any information-free cut. Five iterations, all measured on the working tree at HEAD (`320e7b64d4` plus the phase 011 to 013 changes), with the floors re-captured read-only at the start of the ranking. Executor: DeepSeek v4.1 flash at max effort through OpenCode Go.

## 1. What Was Measured

| Item | Value | Source |
|---|---|---|
| Diagnostic record, gated write | 196 bytes/record over 240 writes; live hook records average 201.7 bytes | `scratch/diagnostic-write-cost.mjs` |
| Diagnostic append cost | 0.26 ms median, 1.96 ms p95, 3.2 ms first (mkdir and chmod) | same |
| Hook latency, gate off vs on | paired delta median -4.69 ms over 30 pairs (p25 -57.57, p75 53.5) | `scratch/hook-latency-paired.mjs` |
| Health window | last 30 records (`MAX_HEALTH_RECORDS = 30`), file capped at 200, trimmed past 300 lines | `runtime/lib/metrics.ts:179-180` |
| Real uptake on this machine | 17 `-diagnostics.jsonl` files against 119 `-outcomes.jsonl` files | `$TMPDIR/speckit-skill-advisor-metrics` |
| Brief, live daemon, 44 typed rows | 44/44 carry command and policy, total 13,173 bytes, median 296, range 284 to 336 | `scratch/live-brief-cost.json` |
| Brief split | constant block 218 bytes (12 label + 206 hygiene), head 78 median, 118 max | `runtime/lib/render.ts:127-133` |
| Estimated tokens per prompt | 74 on a session's first prompt, 20 after it | derived at 4 bytes/token, the renderer's own divisor |
| Brief, sandboxed socket (the committed script) | median 361, min 361, max 408 — the outage line, not a brief | `scratch/brief-cost-head.json` |
| Embedder lane | warm 7.89 ms median, 9.85 ms p95, 335.7 MB loaded; cold unavailable (model loaded) | `scratch/embedder-cost-head.json` |
| Hook on 44 distinct typed prompts | 333.95 ms median, 547.86 ms p95, inside the 2,500 ms budget | `scratch/live-brief-cost.json` |
| Floors at HEAD, read-only | typed 24/44, false offers 0/35, typed combined 44/44, plain tune 23/45, holdout 1/44, reach top3 27/44 | `scratch/floor-baseline-head.txt` |

## 2. Answer to (c): the hook-health default

**Default the health subset on; keep the content subset behind `SKILL_ADVISOR_DEBUG`.**

Why the gate can move: it was added because diagnostics were written "even when no one was reading them" (`changelog/v0.3.0.0.md:20`). Since phase 011 `advisor_status` and `/doctor:setup` read them, so the premise is gone, and the gate is now the reason the reader shows nothing. On this machine 86% of workspace keys have never written a record.

Why health-only and not the full record: `buildAdvisorHookHealthSection` needs `status`, `freshness`, `durationMs` and `cacheHit` only (`metrics.ts:468-475`). It never reads `skillLabel`, which is the one field that records what the person works on, and the code comments the privacy reason for the file mode. A health-only record is about 120 bytes, keeps that field out, and leaves the p95, fail-open rate and cache-hit rate intact.

What it costs, measured: about 120 bytes per prompt and 0.26 ms of write time. The paired hook test found no wall-clock cost above noise. Growth is bounded at 200 records, so about 24 KB health-only and 40 KB full, in the OS temp directory, mode 0600 in a 0700 directory.

What it buys: `/doctor:setup` reports "p95 N ms over the last 30 prompts" instead of nothing. Today the field can only ever report one debug session's length, because the window is the last 30 records and only debug writes them.

Its bound, stated: the advisor leg runs `advisor_status --warm-only` and SKIPs when the daemon is not running (`doctor-setup.yaml:59`), and only the hook adapter writes records, so the change covers four of six runtimes (Claude, Codex, Cursor, Devin) and only when the daemon answers. OpenCode, Pi and DSH have no writer and no timer in their plugin envelopes.

## 3. Answer to (f): brief cost, cold path, and the cut

**The live brief costs 296 bytes (74 tokens) on a session's first prompt and 78 bytes (20 tokens) afterwards. There is no cut that loses no information.**

- The 218-byte constant block is the comment-hygiene directive. It is paid once per session, because both the hook and the OpenCode plugin drop it on a same-content repeat and emit the head alone (`hooks/lib/directive-lifecycle.ts:148-150`, `.opencode/plugins/system-skill-advisor.js:73-80`). Trimming it was eliminated in segment one and this lane adds no fact that reopens it.
- The head is six fields in 78 bytes: provenance (10), freshness (6), skill, command, policy (8), scores (10), pass marker (6). Dropping freshness, the scores and the pass marker saves 22 bytes — 7.4% of a first-message brief — and removes live-vs-stale, certainty and threshold status. Fails the question's own test.
- The token cost that matters is the started command's document: median 4,524 bytes, about 1,131 tokens (segment one, `research.md:83`). The brief is 1.7% of it at steady state. A 22-byte cut cannot change a start decision a 4.5 KB document does not.
- Cold path: the embedder's warm cost is 7.89 ms against a 750 ms deadline; the cold first call (538.53 ms, phase 008) and the true cold first prompt (611 to 844 ms, phase 010) are both already inside budget and fail open 0 of 5. This run could not take a fresh cold sample because the model was loaded and unloading it would be an ollama control action. Recorded as a gap, not replaced by inference.

**Measurement defect found, and it is the actionable half of (f):** `measure-brief-cost.mjs` reports 361 bytes at HEAD because its fresh socket directory cannot reach the live daemon and every row becomes the `Advisor: outage (fail_open)` line. At phase 011 the same script read 299; the brief did not grow by 62 bytes — the arm changed. The same four rows measured both ways: 361 sandboxed with no command, 286 to 308 live with command and policy.

## 4. Ranked Recommendations

Ranked by expected gain per unit of risk. Floors to leave untouched: typed recall 24 of 44, false offers 0 of 35, scorer `[160,50,21,5]`.

### Rank 1 — Default a health-only diagnostic record

| Field | Value |
|---|---|
| Files | `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` (a `requireDebug` option on `persistAdvisorHookDiagnosticRecord`, already supported by `writeBoundedJsonl`), `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` (`emitDiagnostic` omits `skillLabel` and `errorDetails` when the variable is unset), `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` (one case) |
| Measurable gain | Hook health present on every hook-shaped install instead of 17 of 136 workspace keys; the window becomes the last 30 prompts instead of one debug session; `advisor_status.hookHealth.invocations` goes from absent to 1 after one prompt with no environment |
| Cost | about 120 bytes and 0.26 ms per prompt, 200-record cap, no skill id |
| Verify | `env -u SKILL_ADVISOR_DEBUG` one hook payload, then `node .skilled/bin/skill-advisor.cjs advisor_status --format json --timeout-ms 500 --warm-only \| jq .data.hookHealth.invocations` prints 1; the new vitest case asserts the default record has no `skillLabel` and the debug record does; a 250-write fixture leaves 200 lines; `capture-command-routing-baseline.mjs` still prints 24/44 and 0/35 |
| Floor risk | none: no renderer, scorer, corpus or policy path is touched; the change is one writer option and one record field list |
| Bound | four of six runtimes, and only when the daemon answers |

### Rank 2 — Make the brief-cost script refuse a degraded arm

| Field | Value |
|---|---|
| Files | `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs`; one `node:test` fixture under `runtime/tests/scripts/` using `--root` with a two-row corpus and a stub hook |
| Measurable gain | The committed check stops reporting 361 bytes where the live brief is 296 (a 22% error) and starts reporting `liveRows` and `medianHeadBytes` (78) beside the first-message number. Reproducible across daemon states |
| Cost | about 15 lines and one fixture |
| Verify | With a daemon holding the workspace, run it: exit 2 and `{"error":"degraded_brief","liveRows":0}`. With no daemon, or with the checkout's socket, `{"rows":44,"liveRows":44,"medianBytes":296,"medianHeadBytes":78}`. The fixture asserts both with a stub hook |
| Floor risk | none: a measurement script, no product path |

### Rank 3 — Carry the health section's age

| Field | Value |
|---|---|
| Files | `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts`, `runtime/schemas/advisor-tool-schemas.ts`, `runtime/tests/handlers/advisor-status.vitest.ts`; the doctor leg text in `.skilled/commands/doctor/assets/doctor-setup.yaml` |
| Measurable gain | A section written at install day can no longer read as current; the one case rank 1 does not cover (a Codex install whose hooks are unapproved, or a plugin-only runtime) shows an old timestamp instead of a silent green |
| Cost | zero bytes per prompt, one field, one display line |
| Verify | A fixture writes one record with a fixed timestamp and `advisor_status` returns it as `hookHealth.lastRecordAt`; the schema parse test covers the new field; the doctor leg prints `last at <time>` |
| Floor risk | none at runtime; one build-coupling risk, because `hookHealth` is a `.strict()` schema and an older `dist` will throw on the new key. It must land with a rebuild and its parse test |

## 5. Not Recommended, With the Closing Measurement

- **Trimming the comment-hygiene directive.** 218 bytes, once per session, and the only carrier of the repo hard block in a brief-only session. Segment one eliminated it; this lane's 218-byte measurement changes the number, not the disposition.
- **Any head cut.** 22 bytes maximum, each field load-bearing; the document dominates at 1,131 tokens.
- **Warming the embedder or holding `keep_alive`.** Declined at segment-two ranks 16 and 18; warm is 7.89 ms and cold is 538.53 ms against a 750 ms deadline, so there is no new fact.
- **Extending health to OpenCode, Pi and DSH now.** Their envelopes carry `freshness`, `cacheHit` and `skillLabel` but no duration and no writer, so it is a new timer plus a writer on three adapters — a separate phase, not a rider on rank 1.
- **Reporting the cost script's 361 bytes anywhere.** It is the failure message. Any brief-cost figure must name its arm.

## 6. Convergence Report

| Iteration | Focus | newInfoRatio | Status |
|---|---|---|---|
| 1 | Hook-health default and its cost | 0.88 | complete |
| 2 | Brief and cold-path cost, and the cut | 0.82 | complete |
| 3 | Ranking, verification, floor risk | 0.60 | complete |
| 4 | Change sites, tests, schema constraints | 0.72 | complete |
| 5 | Per-runtime bytes and health reachability | 0.58 | complete |

- Stop reason: `all_questions_answered`. KQ1, KQ2 and KQ3 are each answered with a command or a `file:line`, and iteration 5's own next-focus line is "none".
- Convergence threshold 0.05 was **not** reached: the last ratio is 0.58. The stop is coverage-based, not novelty-based, and is reported as such rather than rounded to `converged`.
- Iterations used: 5 of 6. No iteration was skipped and none was recorded thin.
- Edge conditions: one contradictory-evidence case (block versus paired latency, resolved by the paired design), one partial-success case (the cold embedder sample), one corrected risk rating (rank 3 from "zero risk" to "one build-coupling risk").

## 7. Gaps and Confidence

- The cold embedder sample is UNKNOWN in this run: the model was loaded and unloading it would be an ollama control action. The committed 538.53 ms stands as prior evidence.
- The hook latency numbers here (334 ms median on 44 distinct typed prompts) are higher than phase 008's 175.74 ms median, which counted cache hits; the two measure different populations and neither is wrong.
- The `measure-brief-cost.mjs` defect is confirmed by a same-row A/B, not inferred. Its repair is rank 2.
- The privacy reading is from the record schema and file modes, not from a logs audit. A logs audit would need the operator's own metrics root, which this run read only for counts.
- 17 of 136 is one machine's metric root, not a fleet sample. It is used as a signal about the gate's effect, not as a population estimate.
- Scope note: two gateway stdout/stderr captures were written to `/tmp/syn.out` and `/tmp/syn.err` while finding the accepted synthesis envelope. No repository file outside this lineage directory was created or modified; the only other writes were the gateway's and reducer's own into this directory, and the scratch measurement sandboxes under `scratch/tmp-*`.

## 8. Sources

- Iterations: `iterations/iteration-001.md` to `iteration-005.md`; deltas `deltas/iter-001.jsonl` to `iter-005.jsonl`.
- Measurements: `scratch/diagnostic-write-cost.mjs`, `scratch/hook-latency-paired.mjs`, `scratch/hook-health-cost.mjs`, `scratch/brief-ab.mjs`, `scratch/live-brief-cost.mjs`, `scratch/floor-baseline-head.txt`, `scratch/brief-cost-head.json`, `scratch/embedder-cost-head.json`.
- Code: `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts`, `runtime/lib/render.ts`, `runtime/handlers/advisor-status.ts`, `runtime/schemas/advisor-tool-schemas.ts`, `runtime/scripts/measure-brief-cost.mjs`, `runtime/scripts/measure-embedder-cost.mjs`, `hooks/claude/user-prompt-submit.ts`, `hooks/lib/directive-lifecycle.ts`, `.opencode/plugins/system-skill-advisor.js`, `.pi/extensions/prompt-advisor.ts`, `.skilled/commands/doctor/assets/doctor-setup.yaml`.
- Built state: `011-typed-command-delivery-and-guards/implementation-summary.md`, `012-plain-offer-reach/implementation-summary.md`, `013-attribution-and-install-reach/implementation-summary.md`, `011/scratch/brief-cost.json`, `011/scratch/hook-health.json`, `012/scratch/live-heads.txt`.
- Prior segments: `009-ux-performance-cross-cli-research/research/research.md`, `research-segment-2.md`.
