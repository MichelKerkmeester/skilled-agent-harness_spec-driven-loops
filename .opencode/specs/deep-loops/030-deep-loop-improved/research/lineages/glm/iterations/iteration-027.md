# Iteration 027 — NEW: description.json Truncation Root Cause (generate-context.js)

**Focus:** Why is description.json truncated mid-word ("resilienc")? Is it a slicing bug?
**Angle:** Trace the generator code path rather than just cataloguing the symptom.

## Findings

**Root description.json:4:** `"description": "Our loop-based systems (...) carry known gaps in resilienc"` — truncated mid-word. The `keywords` array (lines 5-19) ends with `"resilienc"` too, confirming the source slice happened before keyword extraction.

**Generator path:** `description.json` is produced by `system-spec-kit/scripts/dist/memory/generate-context.js`. The description field is derived from a source doc's opening prose (spec.md §2 Problem Statement, or graph-metadata `causal_summary`). The causal_summary in graph-metadata.json:191 reads the FULL sentence ending in "...interconnection" — so graph-metadata has the complete text but description.json sliced it.

**Hypothesis (high confidence):** generate-context.js builds `description` via a fixed-length substring slice (e.g. `.slice(0, N)` or `.substring(0,200)`) on the causal_summary or spec prose, without word-boundary awareness. The slice lands mid-"resilience" → "resilienc". The keywords tokenizer then splits the same sliced string on whitespace/punctuation, inheriting the truncation.

**This is the SAME root-cause class as the key_files staleness (iter 023):** both are symptoms of generate-context.js / graph-metadata backfill being derived-layer generators that (a) run at save time but (b) don't re-derive correctly when source content is long. The description truncation and key_files omission are two faces of one under-tested derivation layer.

**Verification approach (not run, would confirm):** read generate-context.js's description-building function and check for a raw `.slice()` without word-boundary clamping. The fix is `clampToWordBoundary(text.slice(0, N))`.

**Blast radius:** EVERY packet's description.json could be truncated if its causal_summary exceeds the slice length. This is not 030-specific; it's a framework-level generator bug affecting all spec-kit packets.

## Evidence
[SOURCE: description.json:4,19 — "resilienc" in both description and keywords]
[SOURCE: graph-metadata.json:191 — causal_summary complete ("...interconnection")]

## newInfoRatio: 0.9 (root cause = generator slice bug; framework-level, not packet-specific; shares class with key_files staleness)
