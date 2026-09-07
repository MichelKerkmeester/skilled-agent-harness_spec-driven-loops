# Iteration 007 — Lookup static re-verification + edge behaviors

**Focus:** Round one executed the lookup on real and edge inputs. This run re-reads the CLI statically: exit-code mapping, `--limit 0` documentation (006 fix), token floors (gate 3 vs score 2), the 8-token cap order, scope-filter exactness, and the 0.8 coverage floor's interaction with below-floor query tokens — plus one observed characteristic round one recorded as render-noise only.

**Method:** Full read of `lookup-trigger-index.mjs` + `lib/normalize.mjs`; statically derive candidate sets for stopword-shape prompts; check each documented contract line against code.

## Findings

### V15 — EXIT-CODE AND PARSING CONTRACT HOLDS (verified, positive)

- **Path:line:** `lookup-trigger-index.mjs:312-323` (main: parse errors → 2; load errors → 2; results.length>0 → 0 else 1); `:165-166` (bare `--` literal mode); `:197-204` (`--limit` requires `/^\d+$/` — no silent parseInt truncation); `:206-208` (unknown flag → throw); header `:27` ("--limit 0 lifts the cap")
- **Claimed vs actual:** 006's `--limit 0` documentation landed verbatim in the header; the strict numeric check is present; exit contract matches the documented 0/1/2 map used by AGENTS.md:83, the doctor, and search.md:55-62.
- **Severity:** verified-positive; record only.

### N9 — THE 3-CHAR GATE FLOOR LETS STOPWORD-SHAPE TOKENS ('the', 'and') FLOOD THE CANDIDATE SCAN — MIRRORED, BUT UNBOUNDED (P2, observed characteristic)

- **Path:line:** `lib/normalize.mjs:26` (MIN_QUERY_TOKEN_LENGTH=3), `:93-104` (queryTokens — no stopword filtering, `stopWords: []` at :39), lookup candidate scan `lookup-trigger-index.mjs:83-91` (`phrase.includes(token)`)
- **Claimed vs actual:** A prompt containing 'the' or 'and' (3 chars, above floor, not in any stop list) admits EVERY phrase key containing the substring — 'the' matches 'the', 'another', 'there', 'thesis', 'theme', … — because `includes()` is substring, and substring 'the' appears in a large fraction of the 35,453 keys. The answer remains correct (scorePhrase filters to partial/0 after), but `candidatePhraseCount` and the scan cost spike for exactly the queries a user is most likely to type. Conventions §7 documents ambient-config neutrality, and the index serializes stopWords: [] — the retired lane mirrored is documented; the observable effect is not.
- **Severity:** P2 — performance/observability note, not a correctness break (verified by static derivation; code path is O(keys) substring scan).
- **Recommendation:** Document in retrieval-conventions.md §4/§7 one sentence: "the candidate floor keeps tokens ≥3 chars; function-word tokens like 'the' are not filtered, so a stopword-heavy prompt scans a large candidate set and scores most of it partial" — or admit the index-level stopWords for the gate only (would break SQL-lane parity, so prefer documentation).

### N10 — FIRST-8 TOKEN CAP DROPS THE LAST (OFTEN DISTINCTIVE) TOKENS OF A LONG PROMPT (P2, observed characteristic)

- **Path:line:** `lib/normalize.mjs:96-104` (eligible.slice(MAX_QUERY_TOKENS) → discardedTokens 'beyond-max-query-tokens'); lookup gate uses only `tokens` (first 8 by first-seen order)
- **Claimed vs actual:** A 12-word prompt keeps the first 8 tokens in first-seen order; token 12 — possibly the distinctive one — never gates. Discarded tokens are REPORTED (`discardedTokens` in the answer), so a caller can see it; the result set is still correct for the tokens kept. The mirror claims "keeps only this many LIKE terms" — behavior is documented as a mirror, but no document tells callers that token ORDER of discard is first-seen, not importance.
- **Severity:** P2 — a caller scoring the answer may not notice; add one sentence to retrieval-conventions.md §5 or the lookup README: "when a prompt exceeds 8 distinct ≥3-char tokens, the first 8 in first-seen order gate; the rest are listed in `discardedTokens` and never match."
- **Recommendation:** Documentation row; alternatively reorder by token length descending would break the SQL mirror — prefer doc.

### V16 — SCOPE FILTER EXACTNESS AND TRAILING-SLASH NORMALIZATION (verified, positive)

- **Path:line:** `lookup-trigger-index.mjs:99-105` (specFolderMatches: folder === specFolder || startsWith(specFolder + '/') — no `specs/a` matching `specs/ab` false prefix); `:140-145` (normalizeSpecFolder trims trailing slashes, empty → null)
- **Claimed vs actual:** Prefix correctness holds; `--spec-folder specs/system-speckit` narrows to the track; a file path passed instead of a folder simply matches no document (folder compared to document's parent dir) — silent-empty, consistent with the contract's "a document is in scope when its own folder is the requested folder or a descendant".
- **Severity:** verified-positive; record only. (Side note: a user passing a FILE path gets exit 1 with no diagnostic — the same "empty vs error" discipline as ripgrep; acceptable, flagged as observed behavior.)

### V17 — INDEX-HASH COST IS BORNE ON EVERY GATE 1 LOOKUP (P2, carried with new numbers)

- **Path:line:** `lookup-trigger-index.mjs:75-79` (loadIndex hashes the file bytes unless hashIndex false); index file = 3,845,716 bytes (this tree); presentation §2 prints `index <indexHash short>` (search-presentation.txt:55-57)
- **Claimed vs actual:** Every Gate 1 invocation (AGENTS.md:83 instructs `--json` with NO `--no-index-hash`) hashes 3.8 MB before returning candidates; round one's kept decision ("the presentation asset prints indexHash, so the hash stays") stands, but the cost is real and the router never opts out. The presentation's `--no-index-hash`-less example at search.md:45-49 matches the root doc's invocation.
- **Severity:** P2 — unchanged from round one; recorded here as re-measured (3.85 MB) with the opt-out documented as existing.
- **Recommendation:** Keep; consider `--no-index-hash` in the router lane ONLY if the presentation display of indexHash is dropped — round one's decision remains correct.

## Ruled out this pass

- Score-floor degeneration re-litigation: round one's F2.7 (0.8 floor → full-coverage requirement for ≤4-token queries) is code-verified again in this tree (normalize.mjs:150-152: coverage < 0.8 → null) — the stated behavior is unchanged by 006; nothing new to re-list.
- Exact-match short circuit: `normalizedPhrase === normalizedQuery` before the size guard (normalize.mjs:131 vs 133-135) — a single-token phrase CAN exact-match a single-token prompt; consistent with L2's documented claim ("can only ever match by exact equality" — verified accurate, NOT an overstatement).

## Open questions

1. Should `discardedTokens` reason `beyond-max-query-tokens` appear in the presentation asset's trigger display so callers see why a long prompt matched less? (Presentation §2 shows no discarded-token row.)
