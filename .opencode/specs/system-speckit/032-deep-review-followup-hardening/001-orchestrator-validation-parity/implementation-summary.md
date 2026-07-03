---
title: "Implementation Summary: Orchestrator Validation Parity"
description: "Focused implementation evidence for the strict-aware registry filter, started-work exemption, and bridge unit coverage."
trigger_phrases:
  - "orchestrator validation parity implementation"
  - "strict only registry filter evidence"
  - "started work exemption evidence"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-deep-review-followup-hardening/001-orchestrator-validation-parity"
    last_updated_at: "2026-07-03T06:00:44Z"
    last_updated_by: "gpt-5.5-opencode"
    recent_action: "Implemented focused source and unit-test scope"
    next_safe_action: "Orchestrator runs full-suite comparison, rebuild, bash validation, and live proofs"
    blockers:
      - "Orchestrator verification pending for T007-T010"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/validation-orchestrator-bridge.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gpt-5.5-032-001-orchestrator-parity-impl"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-speckit/032-deep-review-followup-hardening/001-orchestrator-validation-parity` |
| **Completed** | Not complete; orchestrator verification pending |
| **Level** | 3 |
| **Focused Implementation Timestamp** | 2026-07-03T06:00:44Z |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The TypeScript orchestrator now matches the shell contract for the two focused parity gaps covered by this child. Strict-only registry entries are eligible when validation runs strict, skip-severity entries are still suppressed in every mode, and unstarted numbered spec folders no longer need `implementation-summary.md` before work begins.

### Strict-Aware Registry Filtering

`runRegistryShellRules` now computes the strict flag once and delegates eligibility to `shouldRunRegistryShellRule`. That helper excludes `severity: skip` in all modes, excludes `strict_only` rules only outside strict mode, and keeps native-rule suppression unchanged.

### Started-Work Exemption

`validateFileExists` now uses `requiredDocsForLevel` for non-phase folders. The helper checks `checklist.md` and `tasks.md` for anchored completed list items only, so a task-notation table containing backticked `[x]` stays not-started while a real `- [x]` or `- [X]` item requires `implementation-summary.md`.

### Focused Unit Coverage

`validation-orchestrator-bridge.vitest.ts` covers strict and non-strict filter behavior, skip-severity exclusion, shell-status mapping, path-traversal rejection, and the started-work exemption with real temporary fixture folders.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The pre-edit validation-area gate was empty, so no concurrent `lib/validation/` edits blocked the focused source change. The implementation touched only `orchestrator.ts`, added the requested focused vitest file, and updated this spec folder; dist, build, full-suite vitest, bash validation suite, and live proofs were intentionally left to the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the fix inside native TypeScript validation | This matches ADR-001 and avoids rerouting the affected checks back to shell execution. |
| Keep phase-parent `FILE_EXISTS` handling on the old path | Phase parents have separate lean-trio rules and must not inherit numbered-folder completion-doc heuristics. |
| Export `__testables` seams for bridge helpers | The focused test needs direct coverage for private mapping, filtering, and path-resolution behavior without invoking the full validation suite. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-edit gate: `git status --porcelain .opencode/skills/system-spec-kit/mcp_server/lib/validation/ | grep -v "^??"` | PASS: empty output. |
| Focused vitest: `npx vitest run --no-coverage tests/validation-orchestrator-bridge.vitest.ts` | PASS after fixture correction: 1 file passed, 7 tests passed. |
| Mutation check: unconditional `strict_only` exclusion restored temporarily | TRUE RED: strict-filter test failed with `expected [ 'BASE_RULE' ] to deeply equal [ 'BASE_RULE', 'STRICT_RULE' ]`; restored and reran green. |
| Comment hygiene: `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh ...` per modified TypeScript file | PASS: both commands exited 0 with no output. Initial invalid `bash` invocation failed because the file has a Python shebang and accepts one file per run; resolved by running through `python3`. |
| Alignment drift: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/validation` | PASS: scanned 5 files, 0 findings, 0 errors, 0 warnings. |

### Orchestrator Verification Pending

| Pending Item | Owner | Status |
|--------------|-------|--------|
| T007 full mcp_server vitest suite comparison | Orchestrator | Not run by implementer per task boundary. |
| T008 dist rebuild gate and single rebuild | Orchestrator | Not run by implementer per task boundary; dist untouched. |
| T009 post-rebuild bash validation suite | Orchestrator | Not run by implementer per task boundary. |
| T010 live proof for strict-only execution and packet 030 child 007 | Orchestrator | Not run by implementer per task boundary. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime proof pending** The focused vitest file proves the TypeScript source behavior, but validate.sh still needs the orchestrator-owned rebuild and live checks before the packet can move to Complete.
2. **Dist untouched** The implementer did not run `npm run build` and did not modify any `dist/` directory.
3. **Full-suite comparison pending** The full mcp_server vitest suite was not run because it is explicitly outside this implementer scope.
<!-- /ANCHOR:limitations -->
