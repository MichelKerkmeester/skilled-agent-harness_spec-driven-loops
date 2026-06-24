---
title: "Benchmark Results: True-Citation Ledger Density"
description: "Benchmarks the default-off SPECKIT_TRUE_CITATION_EMITTER against the 024 ledger-density prerequisite on the live corpus, read-only, then implements two refinements behind the flag and re-benchmarks. The firing trigger now threads the validated session id into the search_shown write, and the reference key now anchors on the memory title the assistant echoes rather than the bare integer id. The refined detector lifts real-transcript reference coverage from 7.24 percent to 15.79 percent and suppresses 9 prose-count false positives, and the refined emit pipe is proven separable end-to-end on a scratch copy. The verdict stays REFINE: the signal separation is materially better and the design is now sound, but the live ledger density a reranker could consume is still gated on the session backlog, the existing search_shown rows are all null-session and predate the firing-trigger fix. Flag-off byte-identity holds."
trigger_phrases:
  - "true citation ledger benchmark"
  - "SPECKIT_TRUE_CITATION_EMITTER density"
  - "citation ledger feasibility results"
  - "content anchor reference key"
  - "session id firing trigger"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: True-Citation Ledger Density

## Question
The 024 reranker research recorded a CONDITIONAL-GO on a demote-only Beta-posterior penalty and blocked the measured prod win on PREREQ-A ledger density: the gold-and-ledger intersection sat at 0.4 percent with the emitter off and a win needs it materially higher. The emitter mines the post-hoc transcript for the memory ids the assistant referenced after a search and writes used and not-used pairs to a shadow ledger, the real-citation signal the hollow `result_cited` flag lacks. Does `SPECKIT_TRUE_CITATION_EMITTER` reach the ledger density and the used-versus-unused signal separation the 024 demote-only reranker design needs to be safe and worthwhile?

## Method
- **Feature:** `SPECKIT_TRUE_CITATION_EMITTER` (default-off), `lib/feedback/true-citation-emitter.ts`. The emitter reconstructs the per-query shown universe from the live `search_shown` rows scoped by session id, mines the closing session transcript for the shown ids the assistant echoed, and writes one used or not-used pair per shown id.
- **Harness:** `scripts/citation-ledger-feasibility.mjs`, read-only over the live corpus. It backs the live database up read-only, measures the live `search_shown` ledger structure and the session-scoped firing-trigger ceiling, replays the emit pipe against a scratch copy, and runs the production detector twice over the same real transcript turns, once bare-id and once anchor-aware, so the coverage gap is the signal-separation lift.
- **Safety:** the live database is never opened for writes. The replay forces the flag on inside the harness process only, against a scratch copy. The live `true_citation_events` table is absent before and after the run.
- **Bar:** the 024 PREREQ-A density. The emitter earns its keep only if a real, session-scoped run can accumulate trustworthy used and not-used pairs.

## The two refinements, implemented behind the flag

### Refinement 1: firing trigger (handlers/memory-search.ts)
The first pass measured 0 session-scoped shown rows of 1711, because the `search_shown` write recorded `sessionId ?? null` and the live searches ran session-less. The write now threads the validated `effectiveSessionId`, the same value the dedup and consumption-log paths use, so a closing session can be reconstructed. The change is byte-identical when the emitter flag is off because the `search_shown` row is shadow-only and never reaches ranking.

### Refinement 2: reference key (lib/feedback/true-citation-emitter.ts)
The first pass showed the bare integer detector matched mostly prose counts (`8 packets`, `16/18 complete`). The detector now keys on the memory title anchor when present and demotes the bare integer id to a fallback used only for memories with no usable anchor. An anchored memory is referenced only when its title's distinctive words are all echoed, so a prose-count collision can no longer fabricate a positive. The anchors are looked up read-only from the `memory_index` titles during shown-set reconstruction.

## Results: the signal separation is materially better

### The refined emit pipe is provably separable on a scratch copy

| Replay segment | emitted | used | not-used | separation proven |
|----------------|---------|------|----------|-------------------|
| id-only fallback (no anchor) | 5 | 3 | 2 | true |
| anchor path (title echoed vs bare-id prose-count) | 2 | 1 | 1 | true |

The anchor segment is the decisive proof: a memory whose title is echoed by content is used, a memory mentioned only as a bare-id prose count is not-used. The refined pipe writes a trustworthy split.

### The anchor key more than doubles real reference coverage

| Reference-realism metric | Bare-id detector | Anchor-aware detector |
|--------------------------|------------------|------------------------|
| distinct shown ids matched | 22 of 304 | 48 of 304 |
| shown-id reference coverage | 0.0724 | **0.1579** |
| coverage over the 254 anchored ids | n/a | 0.1890 |

Scanned 13417 real assistant turns. The anchor-aware detector matches 48 distinct shown ids where the bare-id detector matched 22, a coverage lift from 7.24 percent to 15.79 percent. The assistant echoes a memory's title, not its database id, so the title is the truer reference key.

### The anchor key suppresses prose-count false positives
The anchor detector rejected 9 ids the bare detector matched: `16`, `26`, `20924`, `21800`, `6100`, `4811`, `4807`, `3467`, `3342`. These are bare-id matches whose titles were not echoed, the prose-count collisions the refinement removes from the used class. The bare-id matches still skew short and noisy.

| Matched id digit length (bare detector) | Distinct ids matched |
|-----------------------------------------|----------------------|
| 1 | 1 |
| 2 | 2 |
| 3 | 6 |
| 4 | 10 |
| 5 | 3 |

| Bare-id collision sample | Context (a prose count, not a citation) |
|--------------------------|------------------------------------------|
| 8 | "GPT-5.5 x5 converged + Opus 4.8 x10" |
| 8 | "Resolve the 8 questions" |
| 8 | "all 8 questions resolved" |

### The live density a reranker could consume is still gated on the session backlog

| Live ledger metric | Value |
|--------------------|-------|
| `search_shown` rows | 1711 |
| session-scoped shown rows | **0** |
| session-scoped fraction | **0.0000** |
| `true_citation_events` table present | false |

| Feasibility gate | Value |
|------------------|-------|
| refined pipe proven separable | true |
| anchor-aware reference coverage | 0.1579 |
| prose-count false positives suppressed | 9 |
| signal separation improved | true |
| **live ledger density reachable today** | **false** |

The signal separation is now trustworthy, but the firing trigger only helps searches that run AFTER the handler fix. The existing 1711 `search_shown` rows are all null-session and predate the change, so a session-scoped emit still reconstructs nothing from the backlog. The density a reranker could consume stays at zero until session-carrying, anchor-resolvable rows accumulate.

## Verdict: REFINE

The verdict stays REFINE, but the picture is materially stronger than the first pass. The two named blocks are now fixed in code behind the default-off flag:

- The **reference key** block is resolved and measured. The anchor-aware detector lifts real reference coverage from 7.24 percent to 15.79 percent and suppresses 9 prose-count false positives, so the used class is now trustworthy enough for a demote-only reranker to lean on the not-used negative.
- The **firing trigger** block is fixed at the write site. New searches that carry a validated session now record a reconstructable `search_shown` row, so the emitter can fire on future sessions.

The residual block is not a code gap, it is a data backlog: the live ledger is empty and the existing shown rows predate the session fix, so the density the 024 reranker needs cannot be measured until real session-carrying, anchor-resolvable traffic accumulates. This is why the verdict is REFINE not GRADUATE: the design is sound and the signal is now trustworthy, but the measured density a reranker would consume is still zero on the live corpus today. It is not CUT, because the refinements turned a noisy, never-firing emitter into a sound one that earns a real used-versus-unused separation when it fires.

The honest next step is to leave the emitter behind the flag, let session-carrying traffic accumulate a real ledger, then re-run the 024 density check on that ledger and decide graduation on the accumulated numbers.

## Default-off byte-identity
With `SPECKIT_TRUE_CITATION_EMITTER` off the emit is a no-op that returns `{ emitted: 0, used: 0, notUsed: 0 }` and does not create the `true_citation_events` table, verified in-process against the freshly built dist. The firing-trigger change is byte-identical when off because the `search_shown` row is shadow-only and never reaches ranking. The reference-key change lives entirely inside the flag-gated emit path. Both refinements are byte-identical when the flag is off.

## Reproduce
`node scripts/citation-ledger-feasibility.mjs` rebuilds `results/metrics.json` from the live corpus, read-only. Set `CITATION_LEDGER_SAMPLE` to change the recent-transcript sample size, default 60.
