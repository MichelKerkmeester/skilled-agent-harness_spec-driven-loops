---
title: "Benchmark Results: True-Citation Ledger Density"
description: "Benchmarks the default-off SPECKIT_TRUE_CITATION_EMITTER against the 024 ledger-density prerequisite on the live corpus, read-only. The emit pipe is proven separable on a scratch copy (3 used, 2 not-used), but the live search_shown corpus carries 0 session-scoped shown rows of 1711, so a real session-scoped emit fires on nothing, and the bare integer detector matches mostly number noise (7.24 percent shown-id coverage dominated by short-id collisions like 8 and 16 in prose counts). The live true_citation_events table is absent, so the live ledger density a reranker could consume is zero. Verdict REFINE: the firing trigger and the reference key each need a named change before the emitter earns its ledger."
trigger_phrases:
  - "true citation ledger benchmark"
  - "SPECKIT_TRUE_CITATION_EMITTER density"
  - "citation ledger feasibility results"
  - "session scoped firing trigger zero"
  - "bare integer reference noise"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: True-Citation Ledger Density

## Question
The 024 reranker research recorded a CONDITIONAL-GO on a demote-only Beta-posterior penalty and blocked the measured prod win on PREREQ-A ledger density: the gold-and-ledger intersection sat at 0.4 percent with the emitter off and a win needs it materially higher. The emitter mines the post-hoc transcript for the memory ids the assistant referenced after a search and writes used and not-used pairs to a shadow ledger, the real-citation signal the hollow `result_cited` flag lacks. Does `SPECKIT_TRUE_CITATION_EMITTER` reach the ledger density and the used-versus-unused signal separation the 024 demote-only reranker design needs to be safe and worthwhile?

## Method
- **Feature:** `SPECKIT_TRUE_CITATION_EMITTER` (default-off), `lib/feedback/true-citation-emitter.ts`. The emitter reconstructs the per-query shown universe from the live `search_shown` rows scoped by session id, mines the closing session transcript for the shown ids the assistant echoed, and writes one used or not-used pair per shown id.
- **Harness:** `scripts/citation-ledger-feasibility.mjs`, read-only over the live corpus. It backs the live database up read-only, measures the live `search_shown` ledger structure and the session-scoped firing-trigger ceiling, replays the emit pipe against a scratch copy, and scans recent real transcripts for the bare integer reference hit rate.
- **Safety:** the live database is never opened for writes. The replay forces the flag on inside the harness process only, against a scratch copy. The live `true_citation_events` table is absent before and after the run.
- **Bar:** the 024 PREREQ-A density. The emitter earns its keep only if a real, session-scoped run can accumulate used and not-used pairs at all on the live corpus.

## Results: the pipe works, the live density is zero

### The emit pipe is provably separable on a scratch copy
A controlled shown set under a real session id, three ids echoed in a synthetic post-search turn and two not echoed, ran through `emitTrueCitationsForSession` against the scratch copy.

| Replay metric | Value |
|---------------|-------|
| pairs emitted | 5 |
| used | 3 |
| not-used | 2 |
| separation proven | true |

The pipe writes a correct used-versus-unused split when a session-scoped shown set and an id-echoing turn coincide. The mechanism is sound. Any zero below is an input gap, not a code defect.

### The live shown universe is populated but session-blind

| Live ledger metric | Value |
|--------------------|-------|
| `search_shown` rows | 1711 |
| distinct queries | 380 |
| distinct memory ids | 304 |
| mean shown-set size | 4.50 |
| session-scoped shown rows | **0** |
| session-scoped fraction | **0.0000** |
| distinct non-null sessions | 0 |
| `true_citation_events` table present | **false** |

The shown universe exists, but every one of the 1711 `search_shown` rows carries a null or empty session id. The production search handler records the row with `queryId = String(_evalQueryId ?? _searchStartTime)` and `sessionId ?? null`, and the live rows are all bare millisecond timestamps with a null session, the non-eval prod branch that supplies no session id. The emitter scopes its reconstruction by session id and the session-stop hook mines the closing session, so a real session-scoped emit reaches 0 of 1711 rows. The firing-trigger ceiling is zero.

### The bare integer detector matches mostly number noise

| Reference-realism metric | Value |
|--------------------------|-------|
| transcripts sampled | 60 |
| assistant turns scanned | 13376 |
| turn reference rate | 0.0865 |
| distinct shown ids ever referenced | 22 of 304 |
| shown-id reference coverage | **0.0724** |

The detector keys on a word-boundary match of the bare integer memory id in the assistant text. The 7.24 percent coverage is mostly collision, not citation. The matched ids skew short, and the sampled context shows the matches are ordinary prose counts.

| Matched id digit length | Distinct ids matched |
|-------------------------|----------------------|
| 1 | 1 |
| 2 | 2 |
| 3 | 6 |
| 4 | 10 |
| 5 | 3 |

| Matched id | Sampled context (a prose count, not a citation) |
|------------|--------------------------------------------------|
| 8 | "scale to the remaining 8 packets" |
| 8 | "All 8 prompts built" |
| 8 | "deep \| 5 (should be 8) with stale filenames" |
| 16 | "Round 1 is 16/18 complete" |
| 16 | "all 16 edits applied and 6/6 verified" |

The assistant cites a memory by its content, its title, or its spec path, not by its database integer id. The few standalone integer matches are counts in prose, so even the 7.24 percent overstates the real citation signal.

### Density reachable on the live corpus

| Feasibility gate | Value |
|------------------|-------|
| pipe proven separable | true |
| session-scoped shown rows | 0 |
| real transcript reference coverage | 0.0724 |
| **live ledger density reachable** | **false** |

A real used or not-used pair needs both a session-scoped shown set AND an assistant turn that echoes a shown id. On the live corpus the first gate is hard zero and the second is near-zero collision noise, so the live ledger density a reranker could consume is zero. This is consistent with 024: the gold-and-ledger intersection was 0.4 percent with the emitter off, and enabling the emitter as built would not lift it because the emitter cannot fire on the session-blind corpus.

## Verdict: REFINE

The emitter is not GRADUATE: the live ledger density it can reach is zero, so a demote-only reranker would still earn 0.000 by construction, the same block 024 recorded. It is not CUT either: the emit pipe is provably correct and the design is the right shape, the signal it produces is exactly the shown-but-unused negative the corpus lacks. The block is two named input gaps, both fixable behind the existing default-off flag.

REFINE means the feature shows promise but a named change is required first. Two changes, in order:

1. **Firing trigger, the gating block.** The production `search_shown` write must carry a stable session id so the emitter's session-scoped reconstruction can reach the shown universe. Today `handlers/memory-search.ts` records the row with `sessionId ?? null` and the live corpus is all-null, so the session-scoped emit fires on nothing. The smallest fix plumbs the validated `sessionId` into the `search_shown` feedback rows, the same value the dedup and consumption-log paths already thread, so a closing session has a non-empty set to reconstruct. This decides WHEN the emitter fires, which is the open question this benchmark surfaces.
2. **Reference key, the signal-quality block.** The detector must key on a token the assistant actually echoes. The bare integer memory id matches mostly prose counts, so even a firing emitter would write a noisy split. The fix anchors the reference on the memory content or title the assistant cites, or threads the explicit memory ids the search response already surfaces into the detector rather than mining them from free text. This raises the precision of the used class so a demote-only reranker can trust the not-used negative.

With both changes the emitter can begin to accumulate real, session-scoped, content-anchored pairs, and a follow-up density re-benchmark against the 024 PREREQ-A bar can decide graduation on real numbers. The reference-key change is the larger one and is the right candidate for its own phase.

## Default-off byte-identity
With `SPECKIT_TRUE_CITATION_EMITTER` off the emit is a no-op that returns `{ emitted: 0, used: 0, notUsed: 0 }` and does not create the `true_citation_events` table, verified in-process. The feature is byte-identical when off, so both refinements land safely behind the existing flag.

## Reproduce
`node scripts/citation-ledger-feasibility.mjs` rebuilds `results/metrics.json` from the live corpus, read-only. Set `CITATION_LEDGER_SAMPLE` to change the recent-transcript sample size, default 60.
