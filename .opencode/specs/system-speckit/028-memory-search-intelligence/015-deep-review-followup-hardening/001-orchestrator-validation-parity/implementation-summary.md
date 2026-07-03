---
title: "Implementation Summary: Orchestrator Validation Parity"
description: "Focused implementation evidence for the strict-aware registry filter, node-rule bridge, started-work exemption, and bridge unit coverage."
trigger_phrases:
  - "orchestrator validation parity implementation"
  - "strict only registry filter evidence"
  - "started work exemption evidence"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/001-orchestrator-validation-parity"
    last_updated_at: "2026-07-03T07:34:06Z"
    last_updated_by: "gpt-5.5-opencode"
    recent_action: "Implemented node-rule bridge follow-up"
    next_safe_action: "Orchestrator runs rebuild, bash validation, and live proofs"
    blockers:
      - "Orchestrator verification pending for T007-T010"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/validation-orchestrator-bridge.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gpt-5.5-032-001-orchestrator-parity-impl"
      parent_session_id: null
    completion_pct: 65
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
| **Spec Folder** | 001-orchestrator-validation-parity |
| **Completed** | Not complete; orchestrator verification pending |
| **Level** | 3 |
| **Focused Implementation Timestamp** | 2026-07-03T07:34:06Z |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The TypeScript orchestrator now matches the shell contract for the focused parity gaps covered by this child. Strict-only registry entries are eligible when validation runs strict, `validation/*.ts` registry entries resolve to compiled `scripts/dist/validation/*.js` siblings and run through node, skip-severity entries are still suppressed in every mode, and unstarted numbered spec folders no longer need `implementation-summary.md` before work begins.

### Strict-Aware Registry Filtering

`runRegistryShellRules` now computes the strict flag once and delegates eligibility to `shouldRunRegistryShellRule`. That helper excludes `severity: skip` in all modes, excludes `strict_only` rules only outside strict mode, and keeps native-rule suppression unchanged.

### Node Rule Bridge

`resolveRegistryRuleScript` now accepts direct-child `validation/*.ts` registry paths and maps them to compiled `scripts/dist/validation/*.js` files behind the same containment guard style as shell rules. `runRegistryShellRules` routes eligible shell rules to bash and eligible validation rules to node, parsing the tab-separated bridge output even when the rule exits non-zero for expected strict signaling.

### Started-Work Exemption

`validateFileExists` now uses `requiredDocsForLevel` for non-phase folders. The helper checks `checklist.md` and `tasks.md` for anchored completed list items only, so a task-notation table containing backticked `[x]` stays not-started while a real `- [x]` or `- [X]` item requires `implementation-summary.md`.

### Focused Unit Coverage

`validation-orchestrator-bridge.vitest.ts` covers strict and non-strict filter behavior including a node strict-only entry, skip-severity exclusion, shell-status mapping, shell and validation path-traversal rejection, `validation/*.ts` compiled-path resolution, one real `EVIDENCE_MARKER_LINT` node execution, and the started-work exemption with real temporary fixture folders.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation touched only `orchestrator.ts`, the focused vitest file, and this spec folder; dist, build, full-suite vitest, bash validation suite, and live proofs were intentionally left to the orchestrator.
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
| Focused vitest baseline: `npx vitest run tests/validation-orchestrator-bridge.vitest.ts` | PASS: 1 file passed, 9 tests passed. |
| Mutation check: temporary wrong dist-validation root | TRUE RED: focused vitest failed 2 tests because `validation/evidence-marker-lint.ts` resolved to `null` and the real node-rule execution test could not resolve the compiled script; restored and reran green: 1 file passed, 9 tests passed. |
| Comment hygiene: `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts" ".opencode/skills/system-spec-kit/mcp_server/tests/validation-orchestrator-bridge.vitest.ts"` | PASS: exited 0 with no output. |
| Alignment drift: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root ".opencode/skills/system-spec-kit/mcp_server"` | PASS: scanned 1192 files, 0 errors, 1 unrelated non-blocking warning in `scripts/evals/generate-known-item-ground-truth.cjs`. |

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
