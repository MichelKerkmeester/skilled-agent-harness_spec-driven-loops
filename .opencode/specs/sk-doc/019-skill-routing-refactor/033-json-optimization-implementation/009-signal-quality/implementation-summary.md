---
title: "Implementation Outcome: Intent-Signal Quality + Fallback Parity"
description: "Planned record for the intent-signal coverage floor, lexical-lane dedup, derivedKeywords path-token cleanup, advisor self-enrichment, the reconciliation gate, and the SQLite-vs-filesystem fallback parity tests. Not yet built."
trigger_phrases:
  - "intent signal quality outcome"
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
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/009-signal-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact intent_signals coverage floor (candidate: 8) confirmed at implementation time against the 006-pinned corpus"
      - "Whether path-token stripping drops key_files/source_docs segments entirely or extracts a reduced basename token"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Intent-Signal Quality + Fallback Parity

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not yet — implementation has not started |
| **Track** | sk-doc |
| **Depends on** | `003-derived-regenerator-migration`, `006-ci-compiler-accuracy-gates` |
| **Implements** | 029 research opportunity O6 (intent-signal quality) + the dropped fallback-parity finding |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase closes five evidence-cited gaps in the skill fleet's intent-signal inputs, confirmed by direct measurement against the checked-out tree: a per-skill `intent_signals` coverage floor (fleet today ranges 3-64, a ~21x spread, with `system-skill-advisor` itself at 4 — one of the thinnest); a dedup of `domains` vs `intentSignals` in the lexical lane's `scoreTokenOverlap` call, which currently double-counts any term an author lists in both fields; a scoring-oriented reduction of `key_files`/`source_docs` path entries feeding `derivedKeywords`, so generic path-segment tokens (`assets`, `patterns`, `md`, `js`) stop polluting derived-lane matches; targeted enrichment of `system-skill-advisor`'s own signal set with phrases about being routed *to* the advisor; and a new `intent_signals`<->`derived.trigger_phrases` reconciliation gate, motivated by a confirmed 0.037 Jaccard on `sk-code` — the two author-facing signal fields sharing almost no vocabulary despite describing the same skill. Separately, this phase adds SQLite-vs-filesystem fallback expected-degradation parity tests that lock today's documented but untested behavior: the filesystem projection always returns empty `edges` and never attaches `docTriggers`, regardless of whether it is reached via a legitimate first run (`source: 'filesystem'`) or a degraded SQLite-read failure (`source: 'filesystem-fallback'`).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three implementation phases: Setup captures a pre-change fleet-wide baseline (intent-signal counts, overlap counts, `sk-code`'s `derivedKeywords` set, per-root Jaccard, and a `score-routing-corpus.py` run against the 006-pinned corpus) and confirms the coverage floor and path-token-reduction strategy against that data. Implementation lands the lexical-lane dedup, the `derivedKeywords` reduction (applied identically on the SQLite and filesystem read paths to avoid introducing a new parity gap), the fleet JSON enrichment for the three sub-floor roots, the new reconciliation gate check (following the existing `checkCommandMetadata` pattern in `ci-skill-root-metadata.cjs`), and the fallback parity tests. Verification re-runs the routing-accuracy corpus and diffs against the baseline, runs the new and existing vitest suites, and runs `validate.sh --strict`. Every scorer-affecting change is corpus-gated per the parent program's guarded-rollout principle — this phase depends on 006 for that gate to exist and on 003 for the fleet's `derived` block to be uniformly migrated before path-token measurement is meaningful across every root.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The coverage floor is deliberately left as a confirmed-at-implementation-time candidate (8) rather than asserted as final in the spec, because the right number depends on measured routing-accuracy impact against the 006-pinned corpus, not on the fleet's current distribution alone. The `derivedKeywords` path-token reduction is scoped to a scoring-only change, explicitly layered on top of (not replacing) `metadata-sanitizer.ts`'s existing `pathLike` security/traversal check, so the two concerns — safety and scoring quality — stay separable. The fallback parity tests deliberately lock the *current* degradation contract (edges/docTriggers dropped in filesystem modes) as a regression guard rather than attempting to fix that gap in this phase — restoring that data is a larger change with its own blast radius, out of this phase's bounded scope.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — Status: Planned. Verification will consist of: (1) unit tests proving the lexical-lane dedup and the `derivedKeywords` path-token reduction each behave as specified; (2) a dry run of the new reconciliation gate confirming it flags the preserved pre-fix `sk-code` 0.037 Jaccard case; (3) new fallback-parity vitest coverage asserting the `sqlite`/`filesystem`/`filesystem-fallback` edges-and-docTriggers contract; (4) a before/after `score-routing-corpus.py` diff against the 006-pinned corpus with no unexplained regression; (5) `validate.sh <folder> --strict` reporting Errors:0. All `checklist.md` items are currently unchecked pending this run.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase does not restore `edges`/`docTriggers` to the SQLite-vs-filesystem fallback — it only locks the current degradation contract with tests, per its bounded scope. It does not pick the canonical `derived` producer (O1), ingest `command-metadata.json` into routing (O7), or build the parent-intent projection (O8) — those are separate phases. The coverage floor and path-token-reduction strategy are candidates pending implementation-time confirmation against the 006-pinned corpus, not final numbers fixed by this spec.
<!-- /ANCHOR:limitations -->
