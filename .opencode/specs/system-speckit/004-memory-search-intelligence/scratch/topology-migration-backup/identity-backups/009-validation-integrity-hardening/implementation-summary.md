---
title: "Implementation Summary: Validation-Gate Hardening"
description: "Status SHIPPED. Validation-gate hardening added advisory disk/status rules, a shared status classifier, evidence-content calibration, and a report-only strict-pass freshness sweep."
trigger_phrases:
  - "validation gate hardening"
  - "evidence cited redesign"
  - "scaffold never touched complete match"
  - "strict pass freshness sweep"
  - "metadata disk path consistency"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/009-validation-integrity-hardening"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-validation-integrity-hardening |
| **Status** | Shipped |
| **Completed** | Yes |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Validation-gate hardening is built. The implementation adds staged disk/status integrity rules, shares status classification across rules, recalibrates evidence detection to evaluate substantive content, and adds a report-only strict-pass freshness sweep plus scheduled/manual workflow.

### Delivered: Validation-Gate Fixes

The work adds one shared status classifier (`scripts/lib/status-classifier.sh`), two new rule modules (`check-metadata-disk-consistency.sh`, `check-status-cross-doc-consistency.sh`) staged behind default-off rollout flags, a narrow fix to `check-scaffold-never-touched.sh` so complete-equivalent statuses are handled consistently, a content-substance redesign of `check-evidence.sh`, and a periodic re-validation sweep entrypoint plus scheduled workflow that reports `validate.sh --strict` regressions on completion-claiming folders.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh` | Added | Shared status classifier for complete/planned/in-progress buckets |
| `.opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh` | Added | Advisory-by-default disk-path consistency rule |
| `.opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency-helper.cjs` | Added | Disk-path comparison helper for JSON metadata surfaces |
| `.opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh` | Added | Advisory-by-default spec/implementation status comparison rule |
| `.opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh` | Modified | Uses the shared classifier instead of a literal complete-prefix match |
| `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh` | Modified | Scores completed item evidence by substance rather than marker shape |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registers new rule ids |
| `.opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts` | Added | Report-only strict-pass freshness sweep |
| `.github/workflows/strict-pass-freshness-sweep.yml` | Added | Scheduled and manual report-only workflow |
| `.opencode/skills/system-spec-kit/scripts/tests/validation-gate-hardening.vitest.ts` | Added | Fixture coverage for classifier, staged flags, evidence, scaffold status, and sweep errors |
| `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts` | Modified | Adds rollout flags to the flag-ceiling/default-off coverage |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation.sh` | Modified | Makes validation JSON parsing robust to mixed stdout/stderr |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Modified | Makes extended validation JSON parsing robust to mixed stdout/stderr |
| `.opencode/skills/system-spec-kit/scripts/tests/test-scripts-modules.js` | Modified | Fixes legacy ESM/CommonJS test entry |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modified | Records shipped state and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as minimal additive rule modules and targeted fixes over the existing `validate.sh` registry contract. The two corpus-wide detectors remain advisory by default and become enforcing only when their environment flags are set to `true`. The sweep is report-only and rejects roots outside the repository.

The broader report-only subtree sweep over `.opencode/specs/system-speckit/004-memory-search-intelligence` exceeded 180 seconds with no output, so it was not counted as pass evidence. The implemented sweep behavior is instead covered by the named vitest fixture and should be run in CI or with a longer local timeout when a full subtree report is needed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stage disk-path and status-consistency rules behind default-off rollout flags rather than shipping them as hard errors | The corpus has confirmed, large-scale existing drift; a hard error would flood `--strict` with new failures before the underlying data is fixed |
| Ship scaffold-status and evidence fixes without a flag | Both are narrow corrections to existing rule logic, proven against targeted known-good and known-bad fixtures |
| Give status rules one shared status classifier instead of two independent implementations | A second bespoke implementation would risk the same complete-status drift recurring |
| Treat the sweep as report-only and separate from the sibling planned sweep | The sibling sweep is planned/unbuilt, while this phase needs a narrow completion-claim freshness report now |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scripts typecheck/build/validation/legacy | PASSED — `npm run typecheck && npm run build && npm run test:validation && npm run test:legacy` |
| MCP typecheck/build/targeted vitest | PASSED — `npm run typecheck && npm run build && npx vitest run tests/flag-ceiling.vitest.ts ../scripts/tests/validation-gate-hardening.vitest.ts` |
| Named hardening vitest | PASSED — 6/6 tests with `npx vitest run ../scripts/tests/validation-gate-hardening.vitest.ts --reporter=verbose` |
| Known-good packet strict validation | PASSED — `validate.sh ...032-boot-integrity-rebuild-maintenance-marker --strict --no-recursive`, Errors 0 Warnings 0 |
| Broader subtree report-only sweep | INCONCLUSIVE — timed out after 180 seconds with no output; not used as completion evidence |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Staged enforcement remains disabled by default.** The disk-path and status-consistency rules intentionally stay advisory unless their flags are explicitly set to `true`.
2. **Full subtree sweep runtime needs CI or a longer local timeout.** The attempted memory-search subtree sweep timed out after 180 seconds and produced no report.
3. **Remote workflow dispatch was not run.** The workflow file is new and uncommitted, so remote `workflow_dispatch` is not available until the change exists on the remote branch.
<!-- /ANCHOR:limitations -->
