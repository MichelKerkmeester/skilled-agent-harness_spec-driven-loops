---
title: "Deep Research Strategy - performance-5"
description: "Lineage-local strategy for the performance lane of segment five: hook latency, turn caps and brief cost on the built state at HEAD 84de3d600fa."
trigger_phrases:
  - "performance-5 strategy"
  - "hook latency turn caps brief cost"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - performance-5

## 1. OVERVIEW

Lineage `performance-5` of the segment-five fan-out in `009-ux-performance-cross-cli-research`. Lane: hook latency, turn caps and brief cost on the built state after phases 016 to 033 (HEAD `84de3d600fa`). Sibling lanes: `ux-5` (offer fit, decline and refusal safety, brief wording), `cross-cli-5` (per-runtime delivery and follow-through).

---

## 2. TOPIC

Segment five, command surfacing on the built state after phases 016 to 033 (HEAD 84de3d600fa): what still limits UX, performance and cross-CLI usefulness. This lineage measures only the performance lane: advisor hook latency per prompt, the behaviour-runner turn caps that ended 41 turns in the phase 033 untuned arm, and the byte/token cost of the brief and of a started command.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does the advisor hook cost per prompt on the built state after phases 016 to 033, and does any measured path exceed its runtime's hook budget?
- [x] What ended the 41 capped turns in the phase 033 untuned arm, and can a runtime-keyed wall-clock cap reduce them without changing the measured outcome?
- [x] What does one brief cost in bytes and tokens on the built state, and which remaining byte is removable without losing the offer contract?
- [x] Does the pre-model hook and brief cost consume a measurable share of a behaviour-runner turn's wall clock, so that it competes with the turn cap?
- [x] Which latency instrument reports the built state's true p95, and which path does it still miss (cold first prompt, in-process plugin, Codex adapter)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not re-running the before arm or any live behaviour arm; the phase 033 arena records are read, never regenerated.
- Not measuring semantic routing quality (typed recall, false offers); segment four owns those floors.
- Not editing the hook, the runner, the brief renderer or any tracked file. Read-only outside this lineage.
- Not deciding offer wording or decline safety; that is the `ux-5` lane.

---

## 5. STOP CONDITIONS

- Convergence at newInfoRatio 0.05 or below, or 8 iterations.
- Stop early if every remaining question needs a live arm, a build or a week of traffic that this read-only lane cannot create; record that as the honest bound.
- Stop if a required source file is missing after three retries on the same path.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does the advisor hook cost per prompt on the built state after phases 016 to 033, and does any measured path exceed its runtime's hook budget?
- What ended the 41 capped turns in the phase 033 untuned arm, and can a runtime-keyed wall-clock cap reduce them without changing the measured outcome?
- What does one brief cost in bytes and tokens on the built state, and which remaining byte is removable without losing the offer contract?
- Does the pre-model hook and brief cost consume a measurable share of a behaviour-runner turn's wall clock, so that it competes with the turn cap?
- Which latency instrument reports the built state's true p95, and which path does it still miss (cold first prompt, in-process plugin, Codex adapter)?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- aggregating the raw health records instead of trusting a prior segment's snapshot produced a four-day sample ten times larger than segment four's and exposed the 300 ms cliff, which no earlier segment reported. Counting exits in the run files instead of trusting the summary caught the 47-versus-41 discrepancy. (iteration 1)
- the step-reader's stored message timestamps turned an assumed-unmeasurable question into a bounded measurement. Reading the 20 sampled sessions end to end was worth more than any amount of aggregation over the exit codes. (iteration 2)
- testing the shape of the evidence before aggregating it caught a defect that two prior segments and iteration 1 all missed. The monotone 101-300 sweep is not a plausible prompt distribution, and one shape test separated it. (iteration 3)
- reading the probe history as a band rather than a point showed the built state has not regressed, and splitting by cache hit explained a 10x median difference that would otherwise look like a contradiction. (iteration 4)
- composing the bounds from four files produced a sharper claim than any one file — the risk is a probe ceiling, not the model load, and that reorders what a fix should target. (iteration 5)
- bucketing the bytes exposed a missing mode faster than reading the dedup code would have; the code then explained why the mode is missing. (iteration 6)
- splitting by cache hit produced the first honest uncached median of the segment and made the process-chain share computable. (iteration 7)
- splitting by runtime and cache state turned eight iterations of scattered numbers into one comparison where the outlier and the cause line up. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the OpenCode store read assumed sessions persist per project; the arena's projects were gone, so the cap's duration side is unmeasurable from the arm as it stands. (iteration 1)
- the first pass assumed the capped rows' sessions were gone because iteration 1 found the OpenCode store empty; the step-reader had already captured 20 sessions with timestamps. Checking the packet's own derived artifacts before concluding a measurement gap would have saved a pass. (iteration 2)
- iteration 1 trusted a folder-wide percentile. The failure was not arithmetic but provenance — it never asked which rows produced the number. (iteration 3)
- treating the phase 015 brief-cost artifact as joinable wasted a read; its schema is not the one its name implies. (iteration 4)
- no committed artifact records a cold hook wall time, so the composition remains an inference. (iteration 5)
- the cache field looked like a plausible split and is not one. (iteration 6)
- the settings read initially looked like one hook; reading all three commands changed the coverage claim. (iteration 7)
- early passes aggregated the folder and then aggregated real rows; both hid the per-runtime shape until it was split. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A runtime-keyed cap as the fix: it leaves the misclassification in place and gives zero help to the two runtimes that never capped. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A runtime-keyed cap as the fix: it leaves the misclassification in place and gives zero help to the two runtimes that never capped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A runtime-keyed cap as the fix: it leaves the misclassification in place and gives zero help to the two runtimes that never capped.

### Adding the three hook timeouts as a worst case: `timeout: 3` is a host kill, not a cost. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Adding the three hook timeouts as a worst case: `timeout: 3` is a host kill, not a cost.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding the three hook timeouts as a worst case: `timeout: 3` is a host kill, not a cost.

### Comparing a probe median to an organic median directly: 57.8 percent of organic live rows are cache hits, so the two medians measure different work. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Comparing a probe median to an organic median directly: 57.8 percent of organic live rows are cache hits, so the two medians measure different work.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing a probe median to an organic median directly: 57.8 percent of organic live rows are cache hits, so the two medians measure different work.

### Counting `null` exits as caps without qualification: one of the 20 null exits is the `fresh-skill-04` rebase row with a failed restore, so the cap count is 19 nulls plus 28 exit-143s. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting `null` exits as caps without qualification: one of the 20 null exits is the `fresh-skill-04` rebase row with a failed restore, so the cap count is 19 nulls plus 28 exit-143s.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `null` exits as caps without qualification: one of the 20 null exits is the `fresh-skill-04` rebase row with a failed restore, so the cap count is 19 nulls plus 28 exit-143s.

### Estimating the number of capped turns a longer cap would convert: the arm stores no duration for them, and the two sampled capped sessions disagree in shape (293 s active versus 61 s then waiting). That needs a re-run, not arithmetic. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Estimating the number of capped turns a longer cap would convert: the arm stores no duration for them, and the two sampled capped sessions disagree in shape (293 s active versus 61 s then waiting). That needs a re-run, not arithmetic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Estimating the number of capped turns a longer cap would convert: the arm stores no duration for them, and the two sampled capped sessions disagree in shape (293 s active versus 61 s then waiting). That needs a re-run, not arithmetic.

### Measuring cold-start cost from the current record: the unavailable path records 0 ms by construction, so the record cannot carry it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Measuring cold-start cost from the current record: the unavailable path records 0 ms by construction, so the record cannot carry it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring cold-start cost from the current record: the unavailable path records 0 ms by construction, so the record cannot carry it.

### Measuring the dedup's amortized effect from this data: nine head-only rows cannot support a share. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Measuring the dedup's amortized effect from this data: nine head-only rows cannot support a share.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring the dedup's amortized effect from this data: nine head-only rows cannot support a share.

### OpenCode SQLite store as a turn-duration source for phase 033: the sessions do not exist in any of the five databases. Candidate for "Exhausted Approaches" only for this arm; a future run must record durations itself. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: OpenCode SQLite store as a turn-duration source for phase 033: the sessions do not exist in any of the five databases. Candidate for "Exhausted Approaches" only for this arm; a future run must record durations itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: OpenCode SQLite store as a turn-duration source for phase 033: the sessions do not exist in any of the five databases. Candidate for "Exhausted Approaches" only for this arm; a future run must record durations itself.

### Per-runtime cached medians on Devin and Codex: four and two rows respectively, too few to read. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Per-runtime cached medians on Devin and Codex: four and two rows respectively, too few to read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-runtime cached medians on Devin and Codex: four and two rows respectively, too few to read.

### Ranking any performance fix above the turn-cap fix: the cap removed 47 judgeable rows, while every latency cell sits inside its budget. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Ranking any performance fix above the turn-cap fix: the cap removed 47 judgeable rows, while every latency cell sits inside its budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking any performance fix above the turn-cap fix: the cap removed 47 judgeable rows, while every latency cell sits inside its budget.

### Reading a cold first-prompt cost from the health records: the fail-open branch writes 0 ms, so the record cannot carry it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reading a cold first-prompt cost from the health records: the fail-open branch writes 0 ms, so the record cannot carry it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading a cold first-prompt cost from the health records: the fail-open branch writes 0 ms, so the record cannot carry it.

### Reading the advisor leg as the prompt's hook cost: two more hook commands run and are not in its record. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reading the advisor leg as the prompt's hook cost: two more hook commands run and are not in its record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the advisor leg as the prompt's hook cost: two more hook commands run and are not in its record.

### Reading the folder's raw percentiles as hook cost: 86.6 percent of the rows are generated. Any future measurement must filter sweeps or read a single workspace. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading the folder's raw percentiles as hook cost: 86.6 percent of the rows are generated. Any future measurement must filter sweeps or read a single workspace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the folder's raw percentiles as hook cost: 86.6 percent of the rows are generated. Any future measurement must filter sweeps or read a single workspace.

### Reading turn duration from the run lines: the record has no duration field and the arena sessions are gone from the store, so the cap's cost per turn is not recoverable. Replaced by the exit census and the cap constants. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading turn duration from the run lines: the record has no duration field and the arena sessions are gone from the store, so the cap's cost per turn is not recoverable. Replaced by the exit census and the cap constants.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading turn duration from the run lines: the record has no duration field and the arena sessions are gone from the store, so the cap's cost per turn is not recoverable. Replaced by the exit census and the cap constants.

### Reading Vibe's 742 ms p95 as a runtime cost: 49 rows is too small a sample and its rows are not from a controlled arm. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading Vibe's 742 ms p95 as a runtime cost: 49 rows is too small a sample and its rows are not from a controlled arm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading Vibe's 742 ms p95 as a runtime cost: 49 rows is too small a sample and its rows are not from a controlled arm.

### Reconstructing the brief's token count from a tokenizer: no tokenizer is committed for this brief and the renderer's own 4-characters-per-token estimate is the contract, so a second estimate would add noise, not evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reconstructing the brief's token count from a tokenizer: no tokenizer is committed for this brief and the renderer's own 4-characters-per-token estimate is the contract, so a second estimate would add noise, not evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reconstructing the brief's token count from a tokenizer: no tokenizer is committed for this brief and the renderer's own 4-characters-per-token estimate is the contract, so a second estimate would add noise, not evidence.

### Recovering the durations of the 45 unsampled capped turns from the OpenCode store: iteration 1 already established the sessions are gone; only the step-reader's 20 sampled sessions survive. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Recovering the durations of the 45 unsampled capped turns from the OpenCode store: iteration 1 already established the sessions are gone; only the step-reader's 20 sampled sessions survive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recovering the durations of the 45 unsampled capped turns from the OpenCode store: iteration 1 already established the sessions are gone; only the step-reader's 20 sampled sessions survive.

### Separating sweeps from real rows by timestamp: both land in the same minutes, so shape (monotone, exact span, 200 rows) is the only reliable discriminator. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Separating sweeps from real rows by timestamp: both land in the same minutes, so shape (monotone, exact span, 200 rows) is the only reliable discriminator.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Separating sweeps from real rows by timestamp: both land in the same minutes, so shape (monotone, exact span, 200 rows) is the only reliable discriminator.

### Splitting brief bytes by `cacheHit`: a cache hit describes the recommendation cache, not the directive lifecycle, so the two fields do not partition the same population. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Splitting brief bytes by `cacheHit`: a cache hit describes the recommendation cache, not the directive lifecycle, so the two fields do not partition the same population.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Splitting brief bytes by `cacheHit`: a cache hit describes the recommendation cache, not the directive lifecycle, so the two fields do not partition the same population.

### The phase 008 committed cost script needs the model unloaded to reproduce the cold numbers, and unloading is a process action this read-only lane may not take. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The phase 008 committed cost script needs the model unloaded to reproduce the cold numbers, and unloading is a process action this read-only lane may not take.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The phase 008 committed cost script needs the model unloaded to reproduce the cold numbers, and unloading is a process action this read-only lane may not take.

### The phase 015 `brief-cost-live.json` is not a rows array in the shape the filename suggests, so it could not be joined to the organic brief set; the 1,234 organic brief rows carry the same quantity. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The phase 015 `brief-cost-live.json` is not a rows array in the shape the filename suggests, so it could not be joined to the organic brief set; the 1,234 organic brief rows carry the same quantity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The phase 015 `brief-cost-live.json` is not a rows array in the shape the filename suggests, so it could not be joined to the organic brief set; the 1,234 organic brief rows carry the same quantity.

### The shim's compiled dispatcher could not be timed without running it, which this lane may not do. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The shim's compiled dispatcher could not be timed without running it, which this lane may not do.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The shim's compiled dispatcher could not be timed without running it, which this lane may not do.

### Treating 2,500 ms as the cold cost: it is the cascade probe's ceiling, and the measured cold work is 690 ms. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating 2,500 ms as the cold cost: it is the cascade probe's ceiling, and the measured cold work is 690 ms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 2,500 ms as the cold cost: it is the cascade probe's ceiling, and the measured cold work is 690 ms.

### Treating 270.6 bytes as a per-session upper bound: it is the per-prompt cost in a fresh-session population. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating 270.6 bytes as a per-session upper bound: it is the per-prompt cost in a fresh-session population.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 270.6 bytes as a per-session upper bound: it is the per-prompt cost in a fresh-session population.

### Treating the 2,218 ms maximum as a live-path worst case: it is an unavailable row, and the live maximum is 1,538 ms. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the 2,218 ms maximum as a live-path worst case: it is an unavailable row, and the live maximum is 1,538 ms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 2,218 ms maximum as a live-path worst case: it is an unavailable row, and the live maximum is 1,538 ms.

### Treating the 300 s cap as a stuck detector: four sampled completions land within 10 s of it, and one capped session was still emitting messages at 293 s. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the 300 s cap as a stuck detector: four sampled completions land within 10 s of it, and one capped session was still emitting messages at 293 s.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 300 s cap as a stuck detector: four sampled completions land within 10 s of it, and one capped session was still emitting messages at 293 s.

### Treating the ledger's hook column as a prompt's total hook latency: two non-advisor hooks run outside it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the ledger's hook column as a prompt's total hook latency: two non-advisor hooks run outside it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the ledger's hook column as a prompt's total hook latency: two non-advisor hooks run outside it.

### Treating the p95 290 ms as the hook's work time: the 240-299 ms plateau with a 300 ms cliff shows a deadline shapes the distribution. Reporting 290 ms as "typical cost" would misstate it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the p95 290 ms as the hook's work time: the 240-299 ms plateau with a 300 ms cliff shows a deadline shapes the distribution. Reporting 290 ms as "typical cost" would misstate it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the p95 290 ms as the hook's work time: the 240-299 ms plateau with a 300 ms cliff shows a deadline shapes the distribution. Reporting 290 ms as "typical cost" would misstate it.

### Using `freshness: stale` (13 rows) as a cold indicator: stale rows have p50 374 ms, but the population is too small and marks a stale brief, not a cold daemon. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Using `freshness: stale` (13 rows) as a cold indicator: stale rows have p50 374 ms, but the population is too small and marks a stale brief, not a cold daemon.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `freshness: stale` (13 rows) as a cold indicator: stale rows have p50 374 ms, but the population is too small and marks a stale brief, not a cold daemon.

### Using `summary-arm.json`'s `cappedOfferRows` as the cap's cost: it counts only the five offer rows, so it understates the 26 OpenCode caps by an order of magnitude. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using `summary-arm.json`'s `cappedOfferRows` as the cap's cost: it counts only the five offer rows, so it understates the 26 OpenCode caps by an order of magnitude.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `summary-arm.json`'s `cappedOfferRows` as the cap's cost: it counts only the five offer rows, so it understates the 26 OpenCode caps by an order of magnitude.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Counting `null` exits as caps without qualification: one of the 20 null exits is the `fresh-skill-04` rebase row with a failed restore, so the cap count is 19 nulls plus 28 exit-143s. (iteration 1)
- OpenCode SQLite store as a turn-duration source for phase 033: the sessions do not exist in any of the five databases. Candidate for "Exhausted Approaches" only for this arm; a future run must record durations itself. (iteration 1)
- Reading turn duration from the run lines: the record has no duration field and the arena sessions are gone from the store, so the cap's cost per turn is not recoverable. Replaced by the exit census and the cap constants. (iteration 1)
- Reconstructing the brief's token count from a tokenizer: no tokenizer is committed for this brief and the renderer's own 4-characters-per-token estimate is the contract, so a second estimate would add noise, not evidence. (iteration 1)
- Treating the p95 290 ms as the hook's work time: the 240-299 ms plateau with a 300 ms cliff shows a deadline shapes the distribution. Reporting 290 ms as "typical cost" would misstate it. (iteration 1)
- A runtime-keyed cap as the fix: it leaves the misclassification in place and gives zero help to the two runtimes that never capped. (iteration 2)
- Estimating the number of capped turns a longer cap would convert: the arm stores no duration for them, and the two sampled capped sessions disagree in shape (293 s active versus 61 s then waiting). That needs a re-run, not arithmetic. (iteration 2)
- Recovering the durations of the 45 unsampled capped turns from the OpenCode store: iteration 1 already established the sessions are gone; only the step-reader's 20 sampled sessions survive. (iteration 2)
- Treating the 300 s cap as a stuck detector: four sampled completions land within 10 s of it, and one capped session was still emitting messages at 293 s. (iteration 2)
- Using `summary-arm.json`'s `cappedOfferRows` as the cap's cost: it counts only the five offer rows, so it understates the 26 OpenCode caps by an order of magnitude. (iteration 2)
- Measuring cold-start cost from the current record: the unavailable path records 0 ms by construction, so the record cannot carry it. (iteration 3)
- Reading the folder's raw percentiles as hook cost: 86.6 percent of the rows are generated. Any future measurement must filter sweeps or read a single workspace. (iteration 3)
- Separating sweeps from real rows by timestamp: both land in the same minutes, so shape (monotone, exact span, 200 rows) is the only reliable discriminator. (iteration 3)
- Treating the 2,218 ms maximum as a live-path worst case: it is an unavailable row, and the live maximum is 1,538 ms. (iteration 3)
- Using `freshness: stale` (13 rows) as a cold indicator: stale rows have p50 374 ms, but the population is too small and marks a stale brief, not a cold daemon. (iteration 3)
- Comparing a probe median to an organic median directly: 57.8 percent of organic live rows are cache hits, so the two medians measure different work. (iteration 4)
- Reading Vibe's 742 ms p95 as a runtime cost: 49 rows is too small a sample and its rows are not from a controlled arm. (iteration 4)
- The phase 015 `brief-cost-live.json` is not a rows array in the shape the filename suggests, so it could not be joined to the organic brief set; the 1,234 organic brief rows carry the same quantity. (iteration 4)
- Reading a cold first-prompt cost from the health records: the fail-open branch writes 0 ms, so the record cannot carry it. (iteration 5)
- The phase 008 committed cost script needs the model unloaded to reproduce the cold numbers, and unloading is a process action this read-only lane may not take. (iteration 5)
- Treating 2,500 ms as the cold cost: it is the cascade probe's ceiling, and the measured cold work is 690 ms. (iteration 5)
- Measuring the dedup's amortized effect from this data: nine head-only rows cannot support a share. (iteration 6)
- Splitting brief bytes by `cacheHit`: a cache hit describes the recommendation cache, not the directive lifecycle, so the two fields do not partition the same population. (iteration 6)
- Treating 270.6 bytes as a per-session upper bound: it is the per-prompt cost in a fresh-session population. (iteration 6)
- Adding the three hook timeouts as a worst case: `timeout: 3` is a host kill, not a cost. (iteration 7)
- Reading the advisor leg as the prompt's hook cost: two more hook commands run and are not in its record. (iteration 7)
- The shim's compiled dispatcher could not be timed without running it, which this lane may not do. (iteration 7)
- Per-runtime cached medians on Devin and Codex: four and two rows respectively, too few to read. (iteration 8)
- Ranking any performance fix above the turn-cap fix: the cap removed 47 judgeable rows, while every latency cell sits inside its budget. (iteration 8)
- Treating the ledger's hook column as a prompt's total hook latency: two non-advisor hooks run outside it. (iteration 8)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Segment four (built state at `087888ec4a`, after phases 014 and 015) closed these performance numbers:

- Hook duration over 1,828 records on 2026-11-13: median 178 ms, p95 294 ms, p99 396 ms, max 893 ms, none over 1,000 ms. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:170]
- Live brief on 44 typed rows: median 306 B, p95 337 B, max 350 B; head line median 88 B, p95 119 B, max 132 B; directive block 217 B, about 71 percent of a brief. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:167]
- Segment four declined the in-process degraded scorer: 0 of 1,283 real records took the local scorer; worst composed path 568.2 ms against a 2.5 s budget. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:92]
- Phase 033's untuned arm evidence adds: pooled gained 25, lost 15, p 0.0769 across 140 paired rows; opencode delivery unknown in both arms; 41 capped turns; sk-git rows that move HEAD cannot be measured by the runner. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:1]

### Bounded Context Snapshot

- Hook path: spec-kit shim -> advisor hook -> advisor CLI -> daemon; three Node starts on Claude.
- Behaviour runner: `runtime/scripts/routing-accuracy/run-command-behaviour.mjs`, `CAP_MS` keyed by prompt kind (300,000 chat turn, 900,000 started turn) in segment four's reading.
- Brief renderer: `runtime/lib/render.ts`.
- Health records: `runtime/lib/metrics.ts` writes per-prompt rows including duration, brief bytes and degraded flags.
- Phase 033 evidence: `033-untuned-arm-arena-run/scratch/arm-evidence.txt`, plus its session records.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Current generation: 1
- Started: 2026-11-16T03:57:11.000Z
