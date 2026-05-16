---
title: "Implementation Summary: 026/003/011 z_archive memory indexing"
description: "Actuals for the 1-line scope fix + 5-iter deep-research audit + 4-commit doc/test propagation."
trigger_phrases:
  - "026/003/011 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/011-z-archive-memory-indexing"
    last_updated_at: "2026-05-16T13:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Backfilled post-execution"
    next_safe_action: "Memory save + close packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000113003"
      session_id: "113-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 026/003/011 z_archive memory indexing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Status | Complete |
| Branch | main |
| Source-fix commit | b062b12b4 |
| Research-converged commit | 12302d853 |
| Final-doc commit | 58e3f3646 |
| Total commits | 6 |
| Wall-clock | ~90 min (research loop 6 min, apply 30 min, plan/tasks/summary 10 min) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

- Removed `compileSegmentPattern('z_archive')` from `EXCLUDED_FOR_MEMORY` in `lib/utils/index-scope.ts`. z_archive content is now indexed (2618 rows in `memory_index`) and deprioritized via the pre-existing 0.1 decay multiplier in `shared/scoring/folder-scoring.ts:ARCHIVE_MULTIPLIERS`.
- Updated 4 test assertions across 2 vitest files to reflect the new behavior; 159 tests pass.
- Rewrote 5 docs in `026/003-continuity-memory-runtime/010-memory-indexer-invariants/` to remove stale "z_archive is excluded" claims and cite packet 113 (commit b062b12b4) as the design-clarification source.
- Updated 2 STALE-DESCRIPTIVE doc surfaces (`doctor_update.yaml` FIX-13 comment + `memory-save.ts:220` error-recovery message).
- Authored a new "Index scope vs scoring decay" SSOT section in `mcp_server/lib/utils/README.md` documenting the binary-exclusion vs multiplicative-decay distinction and the rule that paths with an `ARCHIVE_MULTIPLIERS` entry stay out of `EXCLUDED_FOR_MEMORY`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

- Operator surfaced the contradiction during a routine reindex follow-up: `EXCLUDED_FOR_MEMORY` was overriding the `ARCHIVE_MULTIPLIERS` decay design.
- Phase 1: parallel Explore agents (Sonnet/Opus) produced a baseline inventory of 14 hits across docs and tests.
- Phase R: cli-devin SWE-1.6 deep-research loop (10 iter cap, 0.95/0.12 convergence) ran 5 iters then early-exited on 4 consecutive 0.0 new-info ratios. Loop confirmed Phase 1 was already comprehensive; added 1 mechanical detail (specific length-check assertion in test). 4-runtime mirrors, constitutional rules, eval ground-truth, and 026 sibling packets all yielded zero new hits.
- Phase A: main agent applied the remediation TSV in severity order. Per-row atomic commits. Rebuild dist after the `memory-save.ts` edit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Decay-only for z_archive** (operator-confirmed). Scope-exclusion was redundant; the decay multiplier 0.1 is the correct deprioritization mechanism.
- **z_future stays excluded** (operator-confirmed). Speculative content with no decay multiplier defined; indexing at 1.0 would surface unproven ideas as authoritative.
- **external/ stays excluded** (operator-confirmed). Vendor / third-party code outside repo authority.
- **Don't auto-recurse the rule** for z_archive on code-graph scope (`EXCLUDED_FOR_CODE_GRAPH` still excludes it). Code graph has no decay multiplier; structural answers about archived code aren't generally useful.
- **Add post-script comments** to historical 010-memory-indexer-invariants docs rather than rewriting history. The docs were correct at their time of writing; the design clarification is a later evolution.
- **Skip the formal synthesis dispatch** after the loop converged in 5 iters. Inventory was small enough (12 actionable rows) that main-agent synthesis was lower-latency than another cli-devin invocation.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `npx vitest run tests/index-scope.vitest.ts tests/full-spec-doc-indexing.vitest.ts` | 159 / 159 pass |
| `SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/z_archive/%'` | 2618 rows |
| `getArchiveMultiplier('/specs/foo/z_archive/bar')` | 0.1 (intact) |
| `validate.sh --strict` on packet 113 | PASS (after this commit lands plan/tasks/summary) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- `EXCLUDED_FOR_CODE_GRAPH` still includes z_archive — not a regression, code graph has no decay multiplier so structural exclusion is the only deprioritization mechanism it has. Deferred to a future packet if structural archive queries become valuable.
- The 12 doc fixes in this packet are post-scripts and clarifications, not history rewrites — historical packet 010's analyses remain accurate for their snapshot in time.
<!-- /ANCHOR:limitations -->
