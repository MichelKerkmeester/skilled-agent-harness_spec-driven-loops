---
title: "Implementation Plan: Intent-Signal Quality + Fallback Parity"
description: "Phased plan for fixing intent-signal quality (coverage floor, lexical-lane dedup, derivedKeywords path-token noise, advisor self-enrichment, a reconciliation gate) and adding SQLite-vs-filesystem fallback expected-degradation parity tests, gated against the 006-pinned routing-accuracy corpus."
trigger_phrases:
  - "intent signal quality plan"
  - "fallback parity test plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/009-signal-quality"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 003 (fleet migration) and 006 (CI compiler + accuracy gates)"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/009-signal-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Intent-Signal Quality + Fallback Parity

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fix five concrete, evidence-cited intent-signal-quality gaps (O6) as one bounded, corpus-gated phase: a per-skill `intent_signals` coverage floor, dedup of `domains` vs `intentSignals` in the lexical lane, path-token noise removal from `derivedKeywords`, enrichment of the advisor's own thin signal set, and a new `intent_signals`<->`derived.trigger_phrases` reconciliation gate. Separately, lock the SQLite-vs-filesystem fallback's expected-degradation contract (`edges: []`, no `docTriggers`) with new parity tests so the current documented behavior can no longer drift silently. Every scorer-affecting change is measured against the 006-pinned routing-accuracy corpus before it merges.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Coverage floor | Every non-fixture skill root's `intent_signals` length >= the confirmed floor (candidate 8), including `system-skill-advisor` |
| No double-count | A shared `domains`/`intentSignals` term contributes once, not twice, to a skill's lexical score (unit-test asserted) |
| No path-token noise | `derivedKeywords` for a fixture mirroring `sk-code`'s 20 `key_files`/15 `source_docs` contains zero generic path-segment tokens |
| SQLite/filesystem parity | The identical `derivedKeywords` reduction runs in both `projectionFromRow` and `loadFilesystemProjection` — no new source-of-truth divergence |
| Reconciliation gate correctness | The new gate flags the pre-fix `sk-code` 0.037 Jaccard case in a dry run against the current fleet |
| Fallback parity locked | New/extended vitest asserts `edges: []` and no `docTriggers` for both `filesystem` and `filesystem-fallback` sources against a fixture with real SQLite edges/doc-triggers |
| Corpus regression | `score-routing-corpus.py` against the 006-pinned corpus shows no unexplained top-skill prediction change before/after |
| Structural validation | `validate.sh <folder> --strict` reports Errors:0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new subsystem. Five targeted edits inside the existing advisor scorer, plus one new fleet-gate check and new test coverage:

| Component | Change | Location |
|-----------|--------|----------|
| Lexical lane | Union + dedup `domains`/`intentSignals` before the combined `scoreTokenOverlap` call | `mcp-server/lib/scorer/lanes/lexical.ts:64-71` |
| Derived-keyword assembly | Reduce `key_files`/`source_docs` entries to a scoring-safe (path-noise-stripped) form before `phraseVariants`, applied identically on both read paths | `mcp-server/lib/scorer/projection.ts:216-221` (SQLite) and `:664-669` (filesystem) |
| Path-token reduction helper | New small helper (co-located with or adjacent to the existing `pathLike` security check) that extracts a scoring-safe token from a `key_files`/`source_docs` path entry, distinct from `metadata-sanitizer.ts`'s traversal/security check | `mcp-server/lib/skill-graph/metadata-sanitizer.ts:91-104` (existing seam), `mcp-server/lib/scorer/text.ts` (read-only reference for `phraseVariants`/`normalizeText`) |
| Fleet JSON enrichment | Raise `intent_signals` to the confirmed floor for the three currently-below roots, with routing-relevant (not padded) phrases | `mcp-code-mode/graph-metadata.json`, `system-skill-advisor/graph-metadata.json`, `system-spec-kit/graph-metadata.json` |
| Reconciliation gate | New sub-check following the existing `checkCommandMetadata`-at-`ci-skill-root-metadata.cjs:372` pattern, feeding `checkRoot`'s `violations.push(...)` at line 322 | `sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` |
| Fallback parity tests | New assertions on `edges`/`docTriggers` presence per `source` value, using a fixture SQLite DB with real edges and a doc-trigger row | `mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts` (extended) or a new sibling file |

The two `derivedKeywords` assembly sites (`projectionFromRow`, `loadFilesystemProjection`) already duplicate logic by design (each reads from a different source: SQLite row vs on-disk JSON) — the path-token reduction is added to both rather than factored into a shared function only if doing so would require a larger refactor than this phase's bounded scope allows; a shared helper is preferred if it fits without touching either function's surrounding structure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm 003 and 006 have landed. Capture the pre-change fleet snapshot: `intent_signals` length per root, the `domains`/`intentSignals` overlap count per root, the `derivedKeywords` set for `sk-code` (the densest `key_files`/`source_docs` fixture), and a `score-routing-corpus.py` baseline run against the 006-pinned corpus. Confirm the coverage floor and the path-token reduction strategy (drop vs basename-extract) against this baseline data before writing code.

### Phase 2: Implementation

Land the lexical-lane dedup, the `derivedKeywords` path-token reduction (both read paths), the fleet `intent_signals` enrichment for the three sub-floor roots including `system-skill-advisor`, and the new reconciliation gate check. Add the fallback expected-degradation parity tests.

### Phase 3: Verification

Re-run `score-routing-corpus.py` against the 006-pinned corpus and diff against the Phase 1 baseline; review and justify or revert any changed top-skill prediction. Run the new vitest coverage and the extended `ci-skill-root-metadata.cjs` gate against the full fleet, confirming the reconciliation gate correctly flags the pre-fix `sk-code` case in a dry run captured before the fix (or against a preserved fixture reproducing it). Run `validate.sh <folder> --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit-level: a fixture skill with a deliberately overlapping `domains`/`intent_signals` entry proves the lexical-lane dedup (REQ-002); a fixture mirroring `sk-code`'s `key_files`/`source_docs` density proves `derivedKeywords` is free of generic path-segment tokens on both the SQLite and filesystem read paths (REQ-003). Gate-level: the extended `ci-skill-root-metadata.cjs` run against the current fleet must flag the pre-fix `sk-code` 0.037 Jaccard case (REQ-005) — captured as a fixture or a documented before-value so the gate's own correctness is provable after the fleet JSON is enriched and the live number changes. Fallback-parity: new vitest builds a fixture SQLite DB with real `skill_edges` rows and a doc-trigger entry for one skill, then asserts the `sqlite` source returns them and both `filesystem`/`filesystem-fallback` sources deterministically do not (REQ-006), locking today's documented degradation as a regression contract. Corpus-level: `score-routing-corpus.py` run before and after all lane/JSON changes against the 006-pinned 195+72+24 prompt corpus, with any prediction change reviewed individually (REQ-007) — this is the gate that catches an unintended routing regression from any of the above, since lane-scoring math changes are otherwise hard to bound by unit tests alone.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 003 (fleet migration to schema-version 2 `derived`, so `key_files`/`source_docs`/`key_topics` are populated consistently fleet-wide before path-token measurement is meaningful everywhere) and Phase 006 (CI compiler + routing-accuracy gates, so the pinned corpus and its scoring harness already exist for repeatable before/after measurement). Within this phase's own tooling: `better-sqlite3` (fixture DB construction for the fallback parity tests, already a project dependency per the existing `projection-fallback-049-005.vitest.ts`), and `sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs`/`command-metadata-schema.cjs` (the existing gate infrastructure the new reconciliation check extends).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change in this phase is a source-controlled edit to a TypeScript module, a JSON metadata file, a CommonJS gate script, or a test file — none touches the SQLite schema, a database migration, or generated build output. If the Phase 3 corpus regression check surfaces an unexplained routing regression, or if a live daemon session reports unexpected `advisor_recommend` behavior after this phase merges: (1) `git revert` the specific commit for the offending change (lexical dedup, `derivedKeywords` reduction, or a single fleet JSON file are each landed as separable, individually revertible commits per the parent program's guarded-rollout principle); (2) the fleet `intent_signals` JSON edits revert cleanly file-by-file with no cross-file coupling; (3) the new reconciliation gate check and fallback parity tests are additive-only and can be reverted or skipped without affecting any other gate in `ci-skill-root-metadata.cjs` or the existing `projection-fallback-049-005.vitest.ts` assertions. No downstream consumer (compiled route manifests, other skills' routing) depends on this phase's specific `derivedKeywords`/`intent_signals` values in a way that would make a revert unsafe — the routing-accuracy corpus gate (REQ-007) is precisely the mechanism that catches a bad change before it reaches that point.
<!-- /ANCHOR:rollback -->
