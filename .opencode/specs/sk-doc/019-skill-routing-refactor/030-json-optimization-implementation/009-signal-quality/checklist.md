---
title: "Checklist: Intent-Signal Quality + Fallback Parity"
description: "QA checklist for the intent-signal coverage floor, lexical-lane dedup, derivedKeywords path-token cleanup, advisor self-enrichment, the reconciliation gate, and the SQLite-vs-filesystem fallback parity tests."
trigger_phrases:
  - "intent signal quality checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/009-signal-quality"
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
- [ ] CHK-001 [P0] 003 (fleet migration) and 006 (CI compiler + accuracy gates) confirmed landed before this phase starts [evidence: 003/006 packet status]
- [ ] CHK-002 [P1] All `file:line` citations in spec.md re-confirmed against the checked-out tree at implementation start [evidence: re-grep each cited location]
- [ ] CHK-003 [P1] Pre-change fleet snapshot captured (`intent_signals` lengths, `domains`/`intentSignals` overlaps, `sk-code` `derivedKeywords` baseline, per-root Jaccard, `score-routing-corpus.py` baseline run) [evidence: tasks.md T-02 through T-05 output saved]
- [ ] CHK-004 [P1] Coverage floor and path-token reduction strategy confirmed against the captured baseline before code changes begin [evidence: tasks.md T-06]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-005 [P0] Only the files named in spec.md §3 SCOPE are modified — no unrelated scorer/lane refactor [evidence: `git diff --stat` scoped to lexical.ts, derived.ts, projection.ts, metadata-sanitizer.ts, ci-skill-root-metadata.cjs, fleet graph-metadata.json files, and test files only]
- [ ] CHK-006 [P0] `derivedKeywords` path-token reduction applied identically in `projectionFromRow` and `loadFilesystemProjection` — no new SQLite-vs-filesystem source-of-truth divergence introduced by this phase's own change [evidence: diff of `projection.ts:216-221` and `:664-669` shows matching logic]
- [ ] CHK-007 [P1] Lexical-lane dedup does not change scoring for skills whose `domains`/`intentSignals` have no overlap [evidence: unit test asserting unchanged score for a non-overlapping fixture]
- [ ] CHK-008 [P2] No ephemeral artifact ids (spec paths, packet/phase numbers, REQ/CHK/task ids) embedded in any code comment added by this phase [evidence: manual review of new comments]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-009 [P0] Unit test proves REQ-002: a shared `domains`/`intentSignals` term contributes once, not twice, to a skill's lexical score [evidence: new/extended vitest, `lexical.ts` coverage]
- [ ] CHK-010 [P0] Unit test proves REQ-003: zero generic path-segment tokens survive in `derivedKeywords` for a fixture mirroring `sk-code`'s 20 `key_files`/15 `source_docs` [evidence: new/extended vitest, `projection.ts` coverage]
- [ ] CHK-011 [P0] Fallback parity tests prove REQ-006: `source: 'sqlite'` returns non-empty `edges` and populated `docTriggers` for a fixture skill; both `source: 'filesystem'` and `source: 'filesystem-fallback'` deterministically return `edges: []` and no `docTriggers` for the same skill [evidence: `projection-fallback-049-005.vitest.ts` (extended) or new sibling file]
- [ ] CHK-012 [P1] Reconciliation gate dry run flags the preserved pre-fix `sk-code` 0.037 Jaccard case [evidence: gate output against a fixture or documented before-value]
- [ ] CHK-013 [P0] Full existing scorer vitest suite still passes after all changes (no unintended regression outside the files this phase touches) [evidence: `vitest run` output, system-skill-advisor mcp-server]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-014 [P0] Every non-fixture skill root meets the confirmed `intent_signals` floor, including `system-skill-advisor` itself [evidence: fleet-wide re-scan post-change]
- [ ] CHK-015 [P0] `score-routing-corpus.py` re-run against the 006-pinned corpus shows no unexplained top-skill prediction change vs the CHK-003 baseline; any change is individually justified or reverted [evidence: before/after diff, tasks.md T-13]
- [ ] CHK-016 [P1] Reconciliation gate is wired into `ci-skill-root-metadata.cjs`'s `checkRoot` aggregation, not a standalone unwired script [evidence: `checkRoot` at line 322 calls the new sub-check]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-017 [P1] The new path-token reduction does not weaken or bypass `metadata-sanitizer.ts`'s existing `pathLike` traversal/security check (lines 91-104) — the reduction is additive, applied after sanitization, for scoring purposes only [evidence: code review confirms `sanitizeDerivedMetadata` still runs unchanged before the new reduction]
- [ ] CHK-018 [P2] Enriched `intent_signals` phrases in fleet JSON contain no instruction-shaped or control-character content [evidence: existing `INSTRUCTION_SHAPED_PATTERN`/`CONTROL_CHAR_PATTERN` sanitizer checks pass on the new entries]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-019 [P1] `implementation-summary.md` updated with the final corpus-diff result, gate output, and any deviations from the planned floor/reduction-strategy values [evidence: implementation-summary.md `## Verification`]
- [ ] CHK-020 [P2] Packet continuity (`_memory.continuity`) reflects the phase's actual completion state, not the Planned placeholder [evidence: frontmatter `completion_pct` and `recent_action` updated]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-021 [P1] All artifacts scoped under this phase's SCOPE list; no changes outside it (e.g. no edit to the O1 `derived`-authority decision, O7 command-metadata ingestion, or O8 parent-intent projection surfaces) [evidence: `git status`/`git diff --stat`]
- [ ] CHK-022 [P2] No stray fixture or debug file left under `mcp-server/tests/` after the new test coverage lands [evidence: `git status` clean outside intended additions]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-implementation checks | 4 | 0/4 |
| Code quality checks | 4 | 0/4 |
| Testing checks | 5 | 0/5 |
| Fix completeness checks | 3 | 0/3 |
| Security checks | 2 | 0/2 |
| Documentation checks | 2 | 0/2 |
| File organization checks | 2 | 0/2 |

**Verification Date**: Not yet run (Status: Planned)
<!-- /ANCHOR:summary -->
