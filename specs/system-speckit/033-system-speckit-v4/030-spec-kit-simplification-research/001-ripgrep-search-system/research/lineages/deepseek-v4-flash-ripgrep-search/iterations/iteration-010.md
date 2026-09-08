# Iteration 010 — Consolidation: severity roll-up, ledger close, open-question audit

**Focus:** Merge the round-two ledger (V/N/REV rows) into a clean severity table with a single recommendation vehicle per row; audit the four round-one open questions against what 006 did and what this round adds; verify no round-one count was reused and every count in this ledger is measured in this tree.

**Method:** Re-read my own iterations 1-9; dedupe V/N rows; map each to the owning 006 requirement or to a NEW surface; count final severities; confirm write-surface compliance.

## Final ledger (this round)

### P1 rows — INCOMPLETE 006 FIXES (remediation verification finds)

| ID | Path:line | Claimed vs actual | Vehicle |
|----|-----------|-------------------|---------|
| **V1** | `commands/speckit/assets/search-presentation.txt:106` (vs `:60`) | §3 free-text matchClass mapping still `exact`/`containment`/`token-coverage`; code and §2 emit five labels | One-line mapping + example-row fix (share V2's edit) |
| **V2** | `search-presentation.txt:105` vs `retrieval/lib/rg-lane.mjs:69-72,391-394` | §3 evidence-field names `title`/`description`/`anchor` don't exist; emitted `title-or-description`/`anchor-marker` undocumented | Same edit pass: emit names verbatim |

### P1 rows — NEW FINDINGS (round-one gaps)

| ID | Path:line | Finding | Vehicle |
|----|-----------|---------|---------|
| **N1** | `runtime/data/trigger-index.json` census; `retrieval-conventions.md:260`; `lib/normalize.mjs:131-150` | 352 single-token phrases, 2,245 postings, 826 owning docs — the §8 "two or more tokens" rule is violated at scale; these keys can never rank | judge negative class + diagnostics count (see N4/N6) |
| **N2** | census vs `lib/grep-convention.mjs:149-155` | 175 docs own a phrase from §8's own warn list; validator flags them WARN only; generator has no quality gate | escalate-or-count decision; N5/N6 make it observable |
| **N3** | index keys 'ation','tion','009',…; owner `…/001-copilot-hook-gap-deep-review-remediation/research.md:5-12` | Junk fragment/numeric phrases from a repo-wide frontmatter sweep are indexed and pass every existing check | judge gains numeric-only + path-fragment classes |
| **N4** | `lib/grep-convention.mjs:742-781`; `CATEGORY_SEVERITY :88-100` | No negative class, no category, no severity exists for the single-token/numeric/fragment classes the rule §8 names | add 2 classes; both retrofit + validator inherit |
| **N5** | `doctor-speckit-retrieval.yaml:138-139` vs `:180-182` | corpus_pollution severity high but detection screens ≤5 packets only when already flagged stale — fresh pair = never screened | full-index phrase census in one read (no corpus walk) |
| **N7** | `repo-rules/*.md` (164 phrases) vs `lib/corpus.mjs:16`; `retrieval-conventions.md:264-281` | 164 author-declared trigger phrases unreachable by Gate 1; §9 root table silent on repo-rules/ | decision: index repo-rules OR retire the frontmatter + document the exclusion |

### P2 rows

| ID | Finding | Vehicle |
|----|---------|---------|
| **V3** | README architecture diagram still draws retrofit box + "All six scripts" | delete box, five scripts, pointer to ops |
| **V4** | Three different recipe counts (README "three"; conventions §10 "Section 2 recipes"; wrapper RECIPES=3 of 4) | align §10 wording |
| **V5** (number conflict? no — V5 is positive) | — | — |
| **V8** | EXCLUSIONS derivation shortlist item unexecuted; test-guarded tradeoff | carry; derive-or-document |
| **V9** | `**/tests/fixtures/**` EXCLUSIONS row redundant + undocumented in §9 | drop row or add §9 sentence |
| **V10** | doctor pair check covers 2 of 4 generated artifacts; AGENTS.md:477 names two | extend to 3 reads; name all four |
| **N6** | diagnostics carry structure counts, no quality counts | add phraseQuality bucket via shared judge |
| **N9** | 3-char gate floor lets 'the'/'and' flood the candidate scan (mirrored, unbounded) | document in §4/§7 |
| **N10** | 8-token cap drops last (often distinctive) tokens; discard order is first-seen | document in §5 |
| **N11** | save-path freshness is doc-level wording in commands; the gate lives in runtime tests | no change; note |
| **V13** | phrase-variants still default-published 2.87 MB, no reader | opt-in flag + README row (carried F1.9) |
| **V17** | every Gate 1 lookup hashes 3.85 MB unless --no-index-hash | keep (decision confirmed); note size |

### Verified-positive (record only) — V5, V6, V7, V11, V12, V14, V15, V16, V18, V19, V20
### Re-verified decisions (no re-list) — REV-1..REV-5 (incl. F6.2 parked as unverifiable)

**Severity totals: 0 P0 · 8 P1 · 12 P2 · 11 verified-positive · 5 re-verified decisions.**

## Round-one open questions audit

1. **promptSetHash parity arm** — 006 decided keep-reserved; REV-2 adds evidence (probes already pin the hash at fixture level) — re-open with the "land tiny check or delete both" shape.
2. **grep-convention migration acceptance** — 006 moved (not deleted) the retrofit; no formal acceptance record found in this round's surface. Still open; the relocation was scoped correctly for the open question.
3. **Fixture hash pins exemption-or-refresh** — 006 documented frozen-only. Still open as an owner decision; the doctor ignores them by design (REV-1).
4. **Whole-corpus regeneration owner** — AGENTS.md:477 names the generator + doctor as verifier; no CI/owner still. Carried.

**Round-two new open questions:** (a) repo-rules index-or-retire decision (N7); (b) single-token/numeric/fragment enforcement decision (N1-N4) with the 826-doc blast radius; (c) doctor pollution screen full-census implementation (N5); (d) F6.2's context.md location (REV-3); (e) tests/fixtures row (V9); (f) 4-artifact pair check (V10).

## Write-surface compliance

All writes: `specs/system-speckit/035-spec-kit-simplification-research/001-ripgrep-search-system/research/lineages/deepseek-v4-flash-ripgrep-search/` only. No repo file touched; no validate.sh / node / git executed; two of round one's findings identified as worktree-artifact candidates (foreign-worktree fixture hash; F6.2's unavailable source).

## Open questions

See audit above; the synthesis carries the full list.
