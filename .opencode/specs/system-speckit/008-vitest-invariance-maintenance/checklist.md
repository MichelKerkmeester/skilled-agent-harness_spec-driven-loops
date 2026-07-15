---
title: "Verification Checklist: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred de-numbering"
description: "Verification Date: 2026-07-11"
trigger_phrases:
  - "verification"
  - "checklist"
  - "vitest"
  - "invariance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/008-vitest-invariance-maintenance"
    last_updated_at: "2026-07-11T20:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 3 suites green + verified; checklist closed with evidence"
    next_safe_action: "Complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/031-vitest-invariance-maintenance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred de-numbering

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` - [evidence: REQ section filled in `spec.md`]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` - [evidence: 3-suite repair phases in `plan.md`]
- [x] CHK-003 [P0] Baseline RED counts captured before edits - [evidence: `vitest run` pre-fix — feature-flag 14/15 failed, outsourced 2 failed + 1 skipped, invariance 1 failed]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Suite (a) `149-` stale literal replaced with the disk-resolved de-numbered filename - [evidence: `git diff` shows only line 64 `149-outsourced-agent-memory-capture.md` -> `outsourced-agent-memory-capture.md`; `ls` confirms the renamed file exists]
- [x] CHK-011 [P0] `recentContext` + save-gate parity content added to `prompt_templates.md` as real content (not a stubbed assertion) - [evidence: parity assertion passes against the actual doc; block mirrors the code-backed `RecentContextEntry` schema]
- [x] CHK-012 [P0] Suite (b) mapping-row assertions grounded in real content: 7 relocated to the aggregate `feature_catalog.md` (verified rows), and 1 (`MEMORY_DB_DIR`) removed as a genuinely dead mapping - [evidence: `git diff`; each of the 7 rows read + confirmed, `MEMORY_DB_DIR` unread by any source repo-wide]
- [x] CHK-013 [P0] Suite (b) numbered-doc content assertions repointed to resolvable de-numbered paths (none silently deleted except the dead `MEMORY_DB_DIR`) - [evidence: `vitest run` 14 passed, assertions intact]
- [x] CHK-014 [P0] Suite (c) `node_modules/` scan guard excludes nested dependency trees - [evidence: `git diff` on `walk()`; ~11 spurious hits cleared]
- [x] CHK-015 [P0] Suite (c) stale de-numbering allowlist entries refreshed (3 renamed, 4 deleted-file entries removed) - [evidence: `git diff` on allowlist, each verified against disk]
- [x] CHK-016 [P0] Suite (c) technical-vocab allowlist entries justified (21 per-file endsWith + 3 token-specific predicates), each confirmed legit vocabulary not a leak - [evidence: inline rationale; auditor re-classified all hits, 0 real leaks masked; `workflow-invariance.vitest.ts` stays 2/2 green]
- [x] CHK-017 [P0] No assertion gutted, no invariant disabled, no broad token ban-lift - [evidence: `BANNED` regex byte-identical (`git diff`), both `it()` run, adversarial audit PASS]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Suite (a) `outsourced-agent-handback-docs.vitest.ts` green - [evidence: `vitest run` 2 passed / 1 skipped / 0 failed]
- [x] CHK-021 [P0] Suite (b) `feature-flag-reference-docs.vitest.ts` green (14 tests; the dead `MEMORY_DB_DIR` mapping removed, not force-passed) - [evidence: `vitest run` 14 passed / 0 failed]
- [x] CHK-022 [P0] Suite (c) `workflow-invariance.vitest.ts` green - [evidence: `vitest run` 2 passed / 0 failed]
- [x] CHK-023 [P0] Injected-leak proof: a temporary taxonomy token makes suite (c) FAIL, then reverted - [evidence: planted `capability`/`preset` leak -> RED 1/2 -> removed -> GREEN 2/2, re-proven independently by the auditor]
- [x] CHK-024 [P1] Only these suites flipped RED->green, no new failures elsewhere - [evidence: only 2 self-contained `.vitest.ts` + 2 docs changed, zero runtime code; `rg` confirms no other test reads the edited docs' content]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The ~120 invariance hits triaged into stale (~3), spurious-node_modules (~11), legitimate-vocab (~40+) - [evidence: auditor classification of all hits against the `workflow-invariance.vitest.ts` scanner output]
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg` over the scan root before allowlisting - [evidence: every remaining hit read + classified against the `workflow-invariance.vitest.ts` allowlist]
- [x] CHK-FIX-003 [P0] Consumer inventory: test + doc only, no runtime symbol consumers changed - [evidence: `git diff --stat`, no `.ts`/`.cjs` source under `mcp_server/lib` or `core` touched]
- [x] CHK-FIX-004 [P0] Invariant adversarial case executed: injected NEW leak still fails the scanner - [evidence: `vitest run` on the planted leak → RED 1/2, then reverted → 2/2 green]
- [x] CHK-FIX-005 [P1] The 3 hit-classes x their distinct remedies documented - [evidence: `decision-record.md` + this checklist]
- [x] CHK-FIX-006 [P1] Suite (c) passes independent of local `node_modules/` layout - [evidence: the guard skips any `node_modules` path segment deterministically]
- [x] CHK-FIX-007 [P1] Evidence pinned to the fix diff, not a moving range - [evidence: `git diff` on the 5 changed files]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced - [evidence: `git diff` review — doc/test edits only]
- [x] CHK-031 [P0] `vitest-recovery-followup`-owned `it.fails.skip` (~L26) byte-identical - [evidence: `git diff` shows only line 64 changed, L26 untouched]
- [x] CHK-032 [P1] Scope held to the intended files (5: the 3 suites + `prompt_templates.md` + `feature_catalog.md`; the 5th added for the `MEMORY_DB_DIR` doc-drift correction) - [evidence: `git diff --stat`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized - [evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` all reflect the same 3-suite repair flow + the MEMORY_DB_DIR resolution]
- [x] CHK-041 [P1] `decision-record.md` records the ADR-006 logic-sync gap + anti-false-green principle + MEMORY_DB_DIR resolution - [evidence: decision-record present]
- [x] CHK-042 [P2] README updated (if applicable) - N/A, no README affected
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp/scratch output - [evidence: `find` for tripwire/scratch files returns none]
- [x] CHK-051 [P1] Tripwire scratch surfaces cleaned before completion - [evidence: both fixer and auditor removed their planted surfaces; `git status` clean of new files]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 (N/A) |

**Verification Date**: 2026-07-11 — all three suites green by independent re-run; invariant tripwire re-proven.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
