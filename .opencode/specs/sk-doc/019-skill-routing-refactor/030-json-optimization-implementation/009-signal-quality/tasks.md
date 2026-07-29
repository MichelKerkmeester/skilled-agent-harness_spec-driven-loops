---
title: "Task Breakdown: Intent-Signal Quality + Fallback Parity"
description: "Tasks for the intent-signal coverage floor, lexical-lane dedup, derivedKeywords path-token cleanup, advisor self-enrichment, the reconciliation gate, and the SQLite-vs-filesystem fallback parity tests."
trigger_phrases:
  - "intent signal quality tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/009-signal-quality"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 003 and 006"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/009-signal-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Intent-Signal Quality + Fallback Parity

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Confirm 003 (fleet migration) and 006 (CI compiler + accuracy gates) have landed; re-confirm this phase's `file:line` citations still match the checked-out tree
- [ ] T-02 Capture the pre-change fleet snapshot: `intent_signals` length per root (current: `mcp-code-mode` 3, `system-skill-advisor` 4, `system-spec-kit` 5, `sk-prompt` 9, `system-deep-loop` 15, `sk-doc` 18, `sk-git` 21, `sk-design` 27, `cli-external-orchestration` 29, `mcp-tooling` 50, `sk-code` 64) and per-root `domains`/`intentSignals` overlap counts
- [ ] T-03 Capture the `derivedKeywords` set produced today for `sk-code` (20 `key_files`, 15 `source_docs` entries) as the path-token-noise baseline
- [ ] T-04 Capture per-root `intent_signals`<->`derived.trigger_phrases` Jaccard (current: `sk-code` 0.037, `sk-prompt` 0.11, `system-spec-kit` 0.42) as the reconciliation-gate baseline
- [ ] T-05 Run `score-routing-corpus.py` against the 006-pinned corpus (195 labeled + 72 holdout + 24 ambiguity prompts) and save the baseline predictions for the Phase 3 diff
- [ ] T-06 Confirm the coverage floor (candidate 8) and the path-token reduction strategy (drop vs basename-extract) against the T-02/T-03 data
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-07 Dedup `domains` vs `intentSignals` in `scoreLexicalLane` (`lexical.ts:64-71`) before the combined `scoreTokenOverlap` call
- [ ] T-08 Add the scoring-oriented path-token reduction for `key_files`/`source_docs` entries feeding `derivedKeywords`, applied identically in `projectionFromRow` (`projection.ts:216-221`) and `loadFilesystemProjection` (`projection.ts:664-669`)
- [ ] T-09 Enrich `mcp-code-mode/graph-metadata.json`, `system-skill-advisor/graph-metadata.json`, and `system-spec-kit/graph-metadata.json` `intent_signals` to the confirmed floor with routing-relevant phrases (advisor's own set specifically covers being routed *to*, per REQ-004)
- [ ] T-10 Add the `intent_signals`<->`derived.trigger_phrases` reconciliation check to `ci-skill-root-metadata.cjs`, following the `checkCommandMetadata`-at-line-372 pattern feeding `checkRoot`'s `violations.push(...)` at line 322
- [ ] T-11 Add the SQLite-vs-filesystem fallback expected-degradation parity tests (fixture DB with real `skill_edges` rows and a doc-trigger entry; assert `edges`/`docTriggers` present for `source: 'sqlite'` and absent for `source: 'filesystem'`/`'filesystem-fallback'`) in `projection-fallback-049-005.vitest.ts` or a new sibling file
- [ ] T-12 Add the unit test proving REQ-002 (shared `domains`/`intentSignals` term scores once) and the unit test proving REQ-003 (no generic path-segment tokens survive in `derivedKeywords` for the `sk-code`-mirroring fixture)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-13 Re-run `score-routing-corpus.py` against the 006-pinned corpus and diff against the T-05 baseline; review and justify or revert any changed top-skill prediction
- [ ] T-14 Run the extended `ci-skill-root-metadata.cjs` against the full fleet; confirm the reconciliation gate flags the preserved pre-fix `sk-code` 0.037 case (fixture or documented before-value)
- [ ] T-15 Run the new/extended vitest suite (fallback parity, lexical dedup, derivedKeywords path-token) and the existing scorer test suite for regressions
- [ ] T-16 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict`; confirm Errors:0
- [ ] T-17 Update packet continuity (`implementation-summary.md`, `_memory.continuity`) with the final corpus-diff result and gate output
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All non-fixture skill roots meet the confirmed `intent_signals` floor; lexical-lane double-counting is fixed and unit-tested; `derivedKeywords` is free of generic path-segment tokens on both read paths; the reconciliation gate exists and correctly flags the pre-fix `sk-code` case; fallback expected-degradation is locked by new tests; the 006-pinned routing-accuracy corpus shows no unexplained regression; `validate --strict` reports Errors:0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Research `../../029-skill-json-optimization-research/research/research.md` (§3 O6)
<!-- /ANCHOR:cross-refs -->
