# Iteration 004 — KQ4: Which output fields the contract should mandate

**Focus:** Which fields must the contract mandate so conversational answers are
comparable and trustworthy? (DeepSeek showed confidence 0.36; Kimi showed similarity
0.68 for the same row.) [SOURCE: grounding-evidence.md:42-45]
**Status:** complete · **newInfoRatio:** 0.50

---

## The trust defect, diagnosed
For the *same retrieval row*, two models rendered **different metrics with different
semantics**: DeepSeek `confidence 0.36`, Kimi `similarity 0.68`. These are not the same
number on the same scale — one is a model-asserted confidence, the other a retrieval
similarity. A reader cannot compare or trust either without knowing which is which. The
command contract already solved this for `--command` output but **has not propagated the
rule to conversational/natural output**.

## What the command contract already mandates (the template to extend)
The `MEMORY:SEARCH` retrieval envelope is explicit and should be the *single* metric law
for every surface:

| Mandated field | Rule | Source |
| --- | --- | --- |
| Query echo | `MEMORY:SEARCH "<query>"` | search.md:58-60 |
| Intent | `intent=<detected_intent>` + `INTENT=` footer | search.md:59,68 |
| Result count | `results=<count>` + `RESULTS=` footer | search.md:59,68 |
| Score | **0–1 similarity, two decimals** (`0.79`, never `79.44`; divide %-scaled by 100) | search.md:71; search_presentation.txt:76 |
| Id | `#<id>` from `result.id`/`memory_id` | search_presentation.txt:78 |
| Title | `<title>` from `result.title` | search_presentation.txt:79 |
| Status | `STATUS=OK RESULTS=<count> INTENT=<intent>` footer | search.md:68 |

The field-mapping table is unambiguous: the score slot maps from
`result.score | result.similarity | normalized relevance` and MUST render as a 0–1
similarity to two decimals. [SOURCE: search_presentation.txt:70-79]

## The mandate (answer to KQ4)
**One score, one scale, one name.** The contract must mandate:
1. **`similarity` (0–1, two decimals)** as the *only* ranking metric — not `confidence`,
   not percentage. DeepSeek's `confidence 0.36` violated this twice over (wrong name +
   plausibly a model-asserted number rather than the retrieval `similarity`). Kimi's
   `0.68 similarity` is contract-correct in name and scale. So the contract already
   *implies* Kimi was right; it must say so **for conversational output too**.
2. **The five core slots on every surface**: query echo, similarity, id, title, and the
   STATUS footer with `RESULTS`/`INTENT`. These make any answer parseable and
   cross-model comparable regardless of `--command` vs natural conversation.
3. **Promote the genuinely-useful extras into named optional fields** rather than leaving
   them to latitude (KQ2): Kimi's `requestQuality` / `citationPolicy`
   [SOURCE: grounding-evidence.md:17-18] are valuable — define them as *named optional*
   trailing fields (`requestQuality=…`, `citationPolicy=…`) so when present they are
   comparable, and absence is unambiguous.
4. **Constitutional rows are context, not ranked hits** — exclude `isConstitutional` /
   `importanceTier=constitutional` from the scored block; list under a separate
   `Constitutional rules` heading. [SOURCE: search_presentation.txt:91-94] This is an
   existing rule that conversational answers also dropped/varied on (MiMo surfaced them
   well; others may not) — mandate it everywhere.

## Surface-parity rule (the actionable contract change)
Add to the presentation contract: *"The field set and scale defined in §2 (similarity
0–1 two decimals; query/id/title/STATUS) are mandatory on ALL surfaces — `--command`,
direct prompt, and natural conversation. Never render `confidence`, percentage scores, or
a model-asserted metric in place of the retrieval `similarity`."* This closes the
DeepSeek/Kimi divergence by law, not by hope.

## Ruled out this iteration
- **"Let each model pick its most informative metric"** — refuted: that is precisely what
  produced the confidence-vs-similarity divergence and made the two answers
  non-comparable. Informativeness belongs in *named optional* fields, not in a swapped
  primary metric.
- **"Percentage scores are fine if consistent"** — refuted by the explicit contract:
  scores are 0–1 to two decimals; %-scaled must be divided by 100.
  [SOURCE: search.md:71; search_presentation.txt:76]

## Next focus
Iteration 5 → KQ5: per-model prompt-framework fit, and whether the right framework
reduces the command-adherence gap; consolidate all five into synthesis.
