---
title: "Implementation Summary: repair the three RED system-spec-kit vitest suites (ADR-007 maintenance)"
description: "Records the honest green-up of outsourced-agent-handback, feature-flag-reference, and workflow-invariance vitest suites after the 699-file de-numbering reorg, including the MEMORY_DB_DIR dead-mapping removal and the ADR-006 logic-sync reconciliation."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-vitest-invariance-maintenance"
    last_updated_at: "2026-07-11T23:57:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 3 suites green (my own re-run); MEMORY_DB_DIR dead mapping removed + doc drift corrected"
    next_safe_action: "Complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl/031-vitest-invariance-maintenance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Repair the Three RED system-spec-kit vitest Suites

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 031-vitest-invariance-maintenance |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Restored three RED system-spec-kit vitest suites to green — honestly, without weakening the private-taxonomy-leak
invariant. `outsourced-agent-handback-docs`: fixed a stale numbered filename literal and added genuine
`recentContext` + save-gate parity content to the `cli-opencode` prompt-templates doc. `feature-flag-reference-docs`:
repointed the stale numbered doc literals and relocated env-var mapping assertions to the rows' real current homes
(the aggregate `feature_catalog.md`), and removed one assertion for a genuinely dead flag. `workflow-invariance`:
added a `node_modules` scan-scope guard, refreshed the stale de-numbering allowlist entries, and added justified,
token-specific allowlist rules for legitimate technical vocabulary — with an injected-leak tripwire proving the
invariant still bites.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Fanned out one fixer per suite under strict anti-false-green rules, then an independent adversarial auditor per
suite re-ran it and inspected the diff for gutted assertions / disabled invariants / masked leaks. The feature-flag
fixer surfaced a genuine finding: `MEMORY_DB_DIR` is read by zero source files repo-wide (dropped by an earlier
DB-path-resolver refactor), so its "source reads the symbol" assertion is unsatisfiable — the operator resolved it
by treating the flag as removed: the dead assertion was deleted and the stale `feature_catalog.md` rows that claimed
a source reads it were corrected to match the real precedence chain.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
`MEMORY_DB_DIR` was handled as OPTION A (removed flag) not OPTION B (restore code): it is read by no source, and the
catalog itself calls it "superseded", so docs+test were aligned to code reality rather than re-adding runtime
behavior. Scope grew from 4 to 5 files to include that `feature_catalog.md` doc-drift correction. The `decision-record`
reconciles the logic-sync gap where sk-doc/026 ADR-006 claimed system-spec-kit was excluded from de-numbering while
commit `5149f3abe5` de-numbered 699 of its files. The foreign-lane `it.fails.skip` was left byte-identical.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
Independently re-ran all three suites from the skill root: `feature-flag-reference-docs` 14 passed / 0 failed;
`outsourced-agent-handback-docs` 2 passed / 1 skipped (the foreign-lane test); `workflow-invariance` 2 passed / 0
failed. Injected-leak tripwire re-proven (planted `capability`/`preset` leak → suite FAILS → removed → green), so
the `BANNED` regex is byte-identical and still catches a real leak. No regression elsewhere: only 3 self-contained
test files and 2 docs changed (no runtime code); no other test reads the edited docs' content, and the DB-path
tests exercise the unchanged env vars. `git diff` confirms the `it.fails.skip` line is untouched and no scratch
artifact remains.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
`MEMORY_DB_DIR` was documented as a live legacy fallback but is unread by code; it is now removed from the live
env-var table (OPTION A) rather than restored in code. Two pre-existing, non-blocking observations surfaced by the
audit are left for a future pass (not introduced here): the invariance scanner still walks the singular
`.opencode/command`/`.opencode/agent` paths (renamed to plural elsewhere), leaving those trees unscanned; and
whole-file allowlist suppression on the large index docs is coarse. The full repo-wide vitest battery was not run —
the change surface (doc prose + two self-contained suites, zero runtime code) cannot affect other suites.
<!-- /ANCHOR:limitations -->
