---
title: "Implementation Summary: Phase 12: derive-status-explicit-bypass-fix"
description: "Closed the explicit-status bypass in deriveStatus, wired the orchestrator's enforcement flag, and backfilled regression coverage."
trigger_phrases:
  - "derive status explicit bypass fix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/015-derive-status-explicit-bypass-fix"
    last_updated_at: "2026-07-06T18:49:54.442Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Shipped and tested"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-012-derive-status-bypass-20260702"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 049-derive-status-explicit-bypass-fix |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed the explicit-status bypass in `deriveStatus` (T2-P1-001), wired the MCP validation orchestrator's enforcement flag (T2-P1-002), added the missing orchestrator-level regression test (T2-P1-003), added the advisory direct-parser edge-case tests (T2-P2-001), and amended phase 010's `spec.md` REQ wording to state the completion-evidence requirement now covers explicit-status claims too — all findings from `../047-generated-metadata-status-integrity/review/review-report.md`'s Target 2 audit, an independent adversarial review of phase 010's own shipped fix.

### deriveStatus's Explicit-Status Branch No Longer Bypasses the Completion-Evidence Gate

`deriveStatus` ranks docs `implementation-summary.md` > `checklist.md` > `tasks.md` > `plan.md` > `spec.md` and used to return any doc's own explicit `status:` frontmatter/table value immediately — including `complete` — before phase 010's completion-evidence fallback ever ran. That let a folder claim `complete` from a bare status field with zero supporting evidence, the exact defect class phase 010 was meant to close, reachable via a different code path. The fix narrows the early return to non-`complete` values only; a `complete` claim now falls through to the same evidence-gated derivation every other path already uses. Non-`complete` explicit statuses (`in_progress`, `planned`, `blocked`) are unaffected since they carry no equivalent false-positive risk.

### The MCP Validation Orchestrator Now Enforces the Gate Identically to the CLI Bridge

`orchestrator.ts`'s `validateGeneratedMetadataIntegrity` never passed `statusCompletionConsistencyEnforced` through to `resolveGeneratedMetadataIntegrity`, so `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true` had no effect via that entrypoint even though the CLI bridge (`scripts/validation/generated-metadata-integrity.ts`, the path `validate.sh` actually uses) was already wired correctly. Added the same one-line wiring, mirroring the existing pattern exactly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Narrowed `deriveStatus`'s explicit-status early return to exclude `complete` claims. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modified | Wired `statusCompletionConsistencyEnforced: isStatusCompletionConsistencyGateEnabled()` into the existing `resolveGeneratedMetadataIntegrity` call. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Modified | Fixed the pinned-bypass test (split into without-evidence/with-evidence pair); fixed the canonical happy-path fixture that unintentionally relied on the same bypass; added 5 new P2 advisory tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts` | Modified | Added 2 new tests exercising the real `validateFolder()` orchestrator entrypoint directly. |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md` | Amended | REQ-001/REQ-002/REQ-005 now state the completion-evidence requirement applies to explicit-status `complete` claims too. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the current `deriveStatus` and `orchestrator.ts` source directly against the review's line citations to confirm both defects still existed exactly as described before touching anything. The `deriveStatus` fix is a one-condition narrowing (`frontmatterStatus && frontmatterStatus !== 'complete'`); traced the fall-through path by hand for every affected scenario (genuinely complete leaf folders, phase parents with no `implementation-summary.md`, checklist-present folders, already-complete folders regenerating from a self-preserving `existingStatus`) before running anything, to rule out regressing folders that are already correctly marked complete. Running the existing suite immediately surfaced two tests relying on the old bypass — the review's own cited pinned test, plus one more the review hadn't flagged (the file's own default happy-path fixture, which incidentally hit the same bug pattern) — both fixed with minimal, scoped fixture changes rather than loosened assertions. The orchestrator wiring reused the CLI bridge's already-correct pattern verbatim. `npm run build` (composite `tsc --build`) was run after both source edits since `scripts`' TypeScript project resolves `mcp_server` via its compiled `dist/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate only `complete` claims, not all explicit statuses | Only a `complete` claim can mask incomplete work as done; `in_progress`/`planned`/`blocked` carry no equivalent false-positive risk and gating them would be unnecessary scope. |
| Let a `complete` claim fall through to existing derivation logic rather than adding a new evidence check | The no-checklist fallback and checklist-present branch already implement the exact evidence gate needed; duplicating that logic for the explicit-status case would risk the two paths drifting apart. |
| Fixed the fixture instead of loosening the assertion, for both the cited pinned test and the newly-discovered default-fixture case | The old assertions encoded the bug as correct behavior; changing what the test expects while leaving the vulnerable fixture unchanged would have hidden the same regression class from the suite. |
| Wrote the orchestrator-level test against the real `validateFolder()` export, not just `resolveGeneratedMetadataIntegrity` directly | T2-P1-003's own finding was that no test exercised the actual MCP entrypoint; testing the lower-level function alone would not have caught the orchestrator wiring gap in the first place. |
| Amended phase 010's spec.md rather than leaving the contradiction between REQ wording and shipped behavior undocumented | The review's own Spec Seed named this gap explicitly; a dated amendment note keeps the record honest about what changed and why, without rewriting phase 010's own history. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `graph-metadata-schema.vitest.ts` (standalone, after the `deriveStatus` fix) | PASS: 33/33 |
| `generated-metadata-integrity.vitest.ts` (standalone, after the orchestrator wiring) | PASS: included in the 9-file run below |
| Targeted 9-file suite (every file referencing the touched modules) | PASS: 9 files, 119 tests (108 baseline + 11 new) |
| `mcp_server` TypeScript build (`npm run build`, composite `tsc --build`) | PASS: clean |
| `test-phase-system.sh` (unaffected by this phase, re-run as a cross-check) | PASS: 8/8 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`tests/feature-flag-reference-docs.vitest.ts` (14 tests) fails in this repo state, unrelated to this phase.** `ENOENT` on missing feature-catalog files (e.g. `273-1-search-pipeline-features-speckit.md`). Confirmed pre-existing: the test file was last touched 2026-06-05 (commit `41fb6f11a5`), has zero overlap with any file this phase modified, and fails for a reason (missing files elsewhere in the repo) no change in this phase could cause or fix. Excluded from this phase's targeted-suite claim; not remediated here, out of scope.
2. **The 213-folder bulk-correction backlog from phase 010 remains deferred**, unaffected by this phase.
3. **Whether `orchestrator.ts` is a supported/reachable validation entrypoint at all** (the review's own downgrade trigger for T2-P1-002/003) was not independently re-litigated; this phase wires it correctly regardless of that open question.
4. **`validate.sh --strict` reports a `SECTION_COUNTS` warning** on this folder's `spec.md`. Confirmed pre-existing and unrelated: the identical warning reproduces on `046-drift-audit-deep-history-correction`, a long-committed, unrelated sibling phase - a repo-wide threshold miscalibration for lean Level-1 docs, not a content gap in this phase.
<!-- /ANCHOR:limitations -->

---
