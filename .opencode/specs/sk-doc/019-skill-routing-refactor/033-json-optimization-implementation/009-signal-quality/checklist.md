---
title: "Checklist: Intent-Signal Quality + Fallback Parity"
description: "QA checklist for the intent-signal coverage floor, lexical-lane dedup, derivedKeywords path-token cleanup, advisor self-enrichment, the reconciliation gate, and the SQLite-vs-filesystem fallback parity tests."
trigger_phrases:
  - "intent signal quality checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/009-signal-quality"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Intent-Signal Quality + Fallback Parity

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until implementation runs (Status: Planned).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] 003 (fleet migration) and 006 (CI compiler + accuracy gates) confirmed landed before this phase starts [evidence: 003+006 Complete before edits]
- [x] CHK-002 [P1] All `file:line` citations in spec.md re-confirmed against the checked-out tree at implementation start [evidence: all cited lines re-verified live (lexical 62-71, projection 216/664, text.ts, sanitizer)]
- [x] CHK-003 [P1] Pre-change fleet snapshot captured (`intent_signals` lengths, `domains`/`intentSignals` overlaps, `sk-code` `derivedKeywords` baseline, per-root Jaccard, `score-routing-corpus.py` baseline run) [evidence: pre-change baselines captured (corpus both regimes + TS top3 + Jaccard table)]
- [x] CHK-004 [P1] Coverage floor and path-token reduction strategy confirmed against the captured baseline before code changes begin [evidence: floor 8 vs fleet 3-64 distribution; corpus re-run unchanged]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-005 [P0] Only the files named in spec.md §3 SCOPE are modified — no unrelated scorer/lane refactor [evidence: diff scoped to allowed files; lexical.ts net-cosmetic; banned files untouched]
- [x] CHK-006 [P0] `derivedKeywords` path-token reduction applied identically in `projectionFromRow` and `loadFilesystemProjection` — no new SQLite-vs-filesystem source-of-truth divergence introduced by this phase's own change [evidence: reducer in both assemblies via one shared helper; regression test asserts parity + noise removal]
- [x] CHK-007 [P1] Lexical-lane dedup does not change scoring for skills whose `domains`/`intentSignals` have no overlap [evidence: AMENDED premise: Set-collapse at text.ts:84 means no double-count existed; contract locked by test]
- [x] CHK-008 [P2] No ephemeral artifact ids (spec paths, packet/phase numbers, REQ/CHK/task ids) embedded in any code comment added by this phase [evidence: no ephemeral ids in code comments (pre-commit gate enforces; LUNA angle confirmed)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-009 [P0] Unit test proves REQ-002: a shared `domains`/`intentSignals` term contributes once, not twice, to a skill's lexical score [evidence: dup-vs-single fixture scores identical (contract lock)]
- [x] CHK-010 [P0] Unit test proves REQ-003: zero generic path-segment tokens survive in `derivedKeywords` for a fixture mirroring `sk-code`'s 20 `key_files`/15 `source_docs` [evidence: basename kept, generic segments absent in derivedKeywords, both sources]
- [x] CHK-011 [P0] Fallback parity tests prove REQ-006: `source: 'sqlite'` returns non-empty `edges` and populated `docTriggers` for a fixture skill; both `source: 'filesystem'` and `source: 'filesystem-fallback'` deterministically return `edges: []` and no `docTriggers` for the same skill [evidence: parity vitest locks edges:[]/no docTriggers for both degraded sources vs populated sqlite]
- [x] CHK-012 [P1] Reconciliation gate dry run flags the preserved pre-fix `sk-code` 0.037 Jaccard case [evidence: sk-code 0.037 NOTE emitted by the live gate run]
- [x] CHK-013 [P0] Full existing scorer vitest suite still passes after all changes (no unintended regression outside the files this phase touches) [evidence: 4-file routing suite 31/31 pre-fix and 22/22 with scorer tests post-fix]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-014 [P0] Every non-fixture skill root meets the confirmed `intent_signals` floor, including `system-skill-advisor` itself [evidence: 3 roots at 8/10/9 ≥ floor; no other root touched]
- [x] CHK-015 [P0] `score-routing-corpus.py` re-run against the 006-pinned corpus shows no unexplained top-skill prediction change vs the CHK-003 baseline; any change is individually justified or reverted [evidence: python corpus warm+fallback identical; TS-source full corpus identical (176/53)]
- [x] CHK-016 [P1] Reconciliation gate is wired into `ci-skill-root-metadata.cjs`'s `checkRoot` aggregation, not a standalone unwired script [evidence: NOTE is report-only; gate stays 11/11]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-017 [P1] The new path-token reduction does not weaken or bypass `metadata-sanitizer.ts`'s existing `pathLike` traversal/security check (lines 91-104) — the reduction is additive, applied after sanitization, for scoring purposes only [evidence: parity + reducer + contract-lock tests all discriminating (reviewer-driven rewrite)]
- [x] CHK-018 [P2] Enriched `intent_signals` phrases in fleet JSON contain no instruction-shaped or control-character content [evidence: enrichment additive-only, verified diff all quoted strings]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-019 [P1] `implementation-summary.md` updated with the final corpus-diff result, gate output, and any deviations from the planned floor/reduction-strategy values [evidence: impl-summary records the premise correction + dist-stale deferral]
- [x] CHK-020 [P2] Packet continuity (`_memory.continuity`) reflects the phase's actual completion state, not the Planned placeholder [evidence: continuity updated to Complete]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-021 [P1] All artifacts scoped under this phase's SCOPE list; no changes outside it (e.g. no edit to the O1 `derived`-authority decision, O7 command-metadata ingestion, or O8 parent-intent projection surfaces) [evidence: artifacts under mcp-server tests/ + gate + 3 JSON roots only (embeddings-cache fixture artifact included, documented)]
- [x] CHK-022 [P2] No stray fixture or debug file left under `mcp-server/tests/` after the new test coverage lands [evidence: no stray files; throwaway corpus vitest deleted after use]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-implementation checks | 4 | 4/4 |
| Code quality checks | 4 | 4/4 |
| Testing checks | 5 | 5/5 |
| Fix completeness checks | 3 | 3/3 |
| Security checks | 2 | 2/2 |
| Documentation checks | 2 | 2/2 |
| File organization checks | 2 | 2/2 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
