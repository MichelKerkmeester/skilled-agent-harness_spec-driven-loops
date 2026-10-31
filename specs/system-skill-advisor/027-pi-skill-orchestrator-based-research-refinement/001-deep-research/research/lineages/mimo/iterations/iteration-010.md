# Iteration 10 — Consolidation: ranked verdicts and citation verification

Focus: verify every citation this lineage has published, consolidate the 28 findings into one
ranked adopt/adapt/reject list, and confirm each RQ has an answer in the required shape.

## Citation verification record (REQ-004 discipline)

- **Mechanical check** [CONFIRMED]: all `path:line` citations across `iterations/*.md` and
  `deltas/*.jsonl` were extracted — 34 unique paths — and every file resolved (orchestrator paths
  relative to the phase folder `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/`,
  advisor paths relative to the repository root) with every cited line number inside the file's
  bounds. Result: 34/34 resolve, 0 out of range.
- **Content spot-check** [CONFIRMED]: 12 exact-line citations opened and matched to their claims:
  `search.ts:27` (+200 name equality), `search.ts:46` (1..8 clamp, default 5), `config.ts:45`
  (`catalogDescriptionMax: 160`), `catalog.ts:38` (`modelVisible` mapping),
  `profiles.ts:61-66` (`atomicWriteJson` tmp+rename), `index.ts:718` (manual-only load block),
  `render.ts:79-81` (80/120/120 caps), `cli-fallback.ts:533` (the observed timeout message
  verbatim), `user-prompt-submit.ts:106` (2500 ms default), `lane-registry.ts:9-13` (0.42/0.28/
  0.13/0.12/0.05 weights), `metadata-sanitizer.ts:11,34` (512-char drop-to-null),
  `prompt-advisor.ts:284-285` (additive input transform).
- **Failed citations**: none.

## Ranked verdict list (consolidation of F1-1 … F9-3)

Ranked by expected benefit over implementation cost and risk. Full evidence per finding is in the
iteration files; each row carries its finding id.

| Rank | Verdict | Recommendation | Findings | Why |
|------|---------|----------------|----------|-----|
| 1 | ADOPT | Read `disable-model-invocation` into the projection; demote manual-only skills with a visible reason | F8-3 | The only pattern with a hard cross-runtime consequence (Pi refuses the load) and zero advisor handling today |
| 2 | ADOPT | Name-mention rank-1 pin, verb/slash-gated | F6-1 | Highest-intent prompt class; the extension guarantees it, the advisor only votes on it |
| 3 | ADOPT | Pull recovery beside push: name the `advisor_recommend` CLI in the fail-open fallback, and/or a recommend-backed model tool on hook runtimes | F3-1, F9-1 | Turns the observed `fail_open` timeout class into a self-healing turn; the surface and the tool precedent already exist |
| 4 | ADOPT | Adopt the 5/8 result-cap + 160-char description shape for any pull result | F7-1 | Proven constants, zero design cost |
| 5 | ADOPT | Hard deadline race around the in-process Pi advisor call | F9-2 | Every other adapter hard-bounds its call; the prompt path must not overshoot 2500 ms |
| 6 | ADOPT | Delivered-byte accounting for the brief + default-on dedup where supported | F2-1 | Cost claims become measured; dedup already exists in two runtimes |
| 7 | ADOPT | Candidate-count line ("N skills indexed") in the brief/stub | F1-2 | Cheapest unit of the lazy-catalog design, constant size |
| 8 | ADOPT | Explicit "no in-scope skill matched" line instead of silent absence | F4-3 | Removes the did-the-advisor-run misreading |
| 9 | ADAPT | Soft scope preference (active hub/mode family) with the global pool always open | F4-1 | Preference-with-fallback, never restriction; the advisor is advisory |
| 10 | ADAPT | Pull surface backed by the advisor scorer, not substring search | F3-2 | Same handler and thresholds as the push keeps push/pull consistent |
| 11 | ADAPT | Whole-brief bound: count the constant directive block in the accounting | F7-2 | The "80-token brief" is ~138 tokens worst case today |
| 12 | ADAPT | Truncate-and-keep for ranking signal metadata instead of drop-to-null | F7-3 | Partial signal beats none; matches the extension's ingestion philosophy |
| 13 | ADAPT | Negation-aware `depends_on` derivation assist in edge maintenance | F5-2 | Keeps graph-causal weights (0.35) truthful without silent writes |
| 14 | ADAPT | Graph-health (missing/cycle) gaps on the `advisor_status` trust surface | F5-3 | Operator visibility without model-context noise |
| 15 | ADAPT | Static Pi import-shape contract guard (deep-import ban) for the hook surface | F8-4 | Catches Pi refactors at test time |
| 16 | ADAPT | Document the boundary: zero-catalog-data brief invariant; catalog replacement only on system-prompt-owning surfaces (Pi first) | F1-1, F2-2 | Prevents both double-payment and an impossible in-hook design |
| — | REJECT | Brief-replaces-catalog inside the advisor | F1-3 | Cannot safely delete prompt content it does not own |
| — | REJECT | Importing the extension's cost machinery | F2-3 | Advisor policy-skip + cache + dedup already dominate |
| — | REJECT | Pull replacing push | F3-3 | Trades a reported transport failure for silent non-discovery |
| — | REJECT | Authorization set + load gate at brief time | F4-2 | Nothing to gate; only replace-on-change hygiene transfers |
| — | REJECT | Dependency bundle in the brief | F5-1 | Loading-layer concern; the body carries its own dependency guidance |
| — | REJECT | The extension's raw substring ranker | F6-2 | Strictly subsumed by the advisor's lanes |
| — | REJECT | Importing deterministic tie-breaks | F6-3 | Already present (`fusion.ts:306,749-776`); keep as a tuning invariant |
| — | REJECT | Warn-not-delete and tmp+rename transplants | F8-1, F8-2 | Property-equivalent patterns already exist here |

## RQ coverage map

| RQ | Answer (one line) | Findings |
|----|-------------------|----------|
| RQ1 | Pi pays ~1.4K tokens eager catalog + ~130-180 token brief per delivered turn; the stub/brief disciplines transfer, catalog removal is Pi-extension-only | F1-1..F1-3, F2-1..F2-3 |
| RQ2 | Push failures are timed-out transport with a defined envelope (observed line traced to `cli-fallback.ts:533`); pull-beside-push is the transferable design | F3-1..F3-3, F9-1 |
| RQ3 | The advisor has denylist + hub anchoring but no session scope; adopt soft preference with bounded fallback | F4-1..F4-3 |
| RQ4 | The advisor uses edges only as score multipliers; no bundle belongs in the brief; derivation and graph-health are the transferable halves | F5-1..F5-3 |
| RQ5 | The extension's ranker is subsumed except name-mention dominance, which the advisor lacks as a pin | F6-1..F6-3 |
| RQ6 | 5/8 + 160-char is the right pull-result shape; the brief's cap undercounts its directive block; ingestion should truncate not drop | F7-1..F7-3 |
| RQ7 | Two robustness patterns are already equivalent here; `disable-model-invocation` blindness is the real gap; contract guards and deadline races close the rest | F8-1..F8-4, F9-2 |

## Ruled out this iteration

- Re-running any measurement — the numbers in iteration 2 were measured once from disk and are
  stable for this comparison.
- Weakening any earlier verdict without new evidence — none of the iteration 9 evidence moved a
  verdict from adopt/adapt to reject or back.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| All 34 cited paths resolve; all cited line numbers in range | CONFIRMED (mechanical check, this iteration) | — |
| 12 sampled citations state exactly what their findings claim | CONFIRMED (opened this iteration) | — |
| The ranked order reflects benefit-over-cost judgment | INFERRED (author judgment) | Operator re-ranking; no measurement in this phase prices implementation cost |
