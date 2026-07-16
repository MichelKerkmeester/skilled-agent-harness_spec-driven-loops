---
title: "Implementation Summary"
description: "False-now documentation drift was corrected or confirmed in place for the four scoped surfaces, with historical records left untouched."
trigger_phrases:
  - "implementation summary"
  - "false-now doc corrections"
  - "retention forgetting"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections"
    last_updated_at: "2026-07-06T18:49:54.085Z"
    last_updated_by: "opencode"
    recent_action: "Summarize false-now corrections"
    next_safe_action: "Run final validation"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/029-memory-search-intelligence/feature-flags.md"
      - ".opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "false-now-doc-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-false-now-doc-corrections |
| **Completed** | 2026-07-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The false-now correction pass aligned current reader-facing docs with shipped behavior while preserving historical phase evidence. One source document needed a patch; three cited surfaces were already in the requested corrected state when read in this session.

### Before And After Evidence

| Surface | Before | After |
|---------|--------|-------|
| Retention survivor table | Requested drift was `SPECKIT_RETENTION_FORGETTING_V1` at `feature-flags.md:23`; session read found line 23 already corrected. | `.opencode/specs/system-speckit/029-memory-search-intelligence/feature-flags.md:23` names `SPECKIT_RETENTION_FORGETTING`. |
| Track-C supersession | `.opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md:112-116` said Track C was proposed, not run, and no code had landed with no pointer to later measured results. | `.opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md:114` adds the supersession pointer to the later landed thirteen-switch benchmark section. |
| Retention final tally row | `.opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md:181` named `SPECKIT_RETENTION_FORGETTING_V1`. | `.opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md:183` names `SPECKIT_RETENTION_FORGETTING`. |
| Soft-delete catalog | Requested drift was a claim that recall surfaces do not filter tombstoned rows by default; session read found line 20 already corrected. | `.opencode/skills/system-spec-kit/feature_catalog/mutation/soft-delete-tombstones-and-active-purgeable-partitions.md:20` states search, list, triggers, stats, and dedup reads exclude soft-deleted rows by default. |
| Envelope fidelity comment | Requested drift was `gated dark` / `Off by default`; session read found the comment already corrected. | `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1350-1352` states default-on behavior and `SPECKIT_ENVELOPE_FIDELITY=false` opt-out. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/specs/system-speckit/029-memory-search-intelligence/benchmark-status.md` | Modified | Add supersession note and fix live retention flag name. |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/spec.md` | Created | Capture scoped requirements and acceptance. |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/plan.md` | Created | Capture implementation and verification path. |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/tasks.md` | Created | Track execution and verification tasks. |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/implementation-summary.md` | Created | Record before/after evidence. |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/description.json` | Created | Generated packet metadata. |
| `.opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections/graph-metadata.json` | Created | Generated graph metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation read each cited file first, patched only `benchmark-status.md`, and left ENV_REFERENCE aliases, archives, phase-history material, and the protected phase-027 envelope-fidelity summary untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave already-corrected cited files unchanged | The worktree already had the requested final text, so editing them would create unnecessary churn. |
| Add a supersession pointer instead of deleting Track-C text | The earlier section is historical context; the requested fix was a one-line pointer to later measured evidence. |
| Fix only current/live `_V1` drift | Historical phase docs can accurately mention old default-off or graduated flag names. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n 'SPECKIT_RETENTION_FORGETTING_V1' .opencode/specs/system-speckit/029-memory-search-intelligence/feature-flags.md` | PASS: no output, 0 hits. |
| Old soft-delete contradiction grep | PASS: no output, 0 hits for `do NOT filter tombstoned rows by default` / equivalent stale wording. |
| New soft-delete shipped-behavior grep | PASS: line 20 contains the active-row exclusion sentence. |
| `rg -n 'gated dark|Off by default' .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | PASS: no output, 0 hits. |
| `python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | PASS: no output. Initial `bash` invocation failed because the `.sh` file is a Python script; rerun with `python3` passed. |
| `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_alignment_drift.py --root .opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections` | PASS: `[alignment-drift] PASS`, 0 findings. A broader 028-scope run failed on unrelated invalid JSON result artifacts outside this change scope. |
| `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js ... --level 1` | PASS: `description.json created`. |
| `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js <spec-folder>` | PASS: created 1 `graph-metadata.json`. The recipe's older `scripts/dist/spec-folder/backfill-graph-metadata.js` path was absent; the current CLI lives under `scripts/dist/graph/`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/029-memory-search-intelligence/005-speckit-surface-alignment/001-false-now-doc-corrections --strict` | PASS after metadata refresh and normalized `description.json` specFolder field. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical `_V1` mentions remain by design.** They are accurate historical records or protected alias/deprecation references, not current live guidance.
<!-- /ANCHOR:limitations -->
