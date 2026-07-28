# Deep Review Iteration 002

## Dimension

Correctness. This pass checked relocated import depths, runtime adapter payload translation, fail-open behavior, shared-core regressions, and multi-file edit handling.

## Files Reviewed

- `.opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:21-112`
- `.opencode/runtime-hooks/dispatch/codex/dispatch-audit-posttooluse.mjs:21-113`
- `.opencode/runtime-hooks/dispatch/devin/dispatch-preflight-lint.mjs:20-100`
- `.opencode/runtime-hooks/dispatch/devin/dispatch-audit-posttooluse.mjs:20-100`
- `.opencode/runtime-hooks/mcp-route-guard/codex/mcp-route-guard.cjs:25-72`
- `.opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:29-122`
- `.opencode/runtime-hooks/mcp-route-guard/devin/mcp-route-guard.cjs:20-71`
- `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:19-163`
- `.opencode/runtime-hooks/post-edit-quality/devin/post-edit-quality.cjs:20-150`
- `.opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs:23-105`
- `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs:107-164,474-552`
- `.codex/hooks.json:53-110`
- `.devin/hooks.v1.json:51-123`

## Findings by Severity

### P0

None.

### P1

#### R2-P1-001: Codex multi-file patches run post-edit quality checks for only the first file

- File: `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:48`
- Evidence: `firstPatchPath()` returns one match from the first `*** Add/Update/Delete File:` or `*** Move to:` header at lines 48-52. `filePathFrom()` and `main()` preserve that singular value at lines 55-60 and 116-138, then invoke `resolveDispatch()` and `runChecks()` once. The live PostToolUse registration runs once per `apply_patch` call at `.codex/hooks.json:92-97`, while one patch body may contain several file operations. Every file after the first therefore receives no post-edit checker or dist-staleness check.
- Finding class: cross-consumer
- Scope proof: Exact search found no Codex-adapter regression covering multiple patch headers. The passing 46 Node tests and 38 Vitest tests cover the shared cores and Claude adapter, not this singular Codex path extraction branch.
- Affected surface hints: `Codex apply_patch adapter`, `post-edit quality router`, `dist-staleness check`
- Recommendation: Extract all changed file headers, de-duplicate them, and run the bounded dispatch/dist checks for each existing path within one shared deadline.

#### Claim Adjudication: R2-P1-001

- Claim: A Codex `apply_patch` call containing multiple file headers checks only its first changed file.
- Evidence refs: `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:48-60`, `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:116-150`, `.codex/hooks.json:92-97`
- Counterevidence sought: Searched the changed scope for alternate path iteration, repeated adapter invocation, and multi-header adapter tests; reviewed the PostToolUse matcher and all passing post-edit tests.
- Alternative explanation: Codex could invoke PostToolUse separately for each file in a patch, or constrain every `apply_patch` call to one file. The configured hook is tool-call scoped and the accepted patch grammar permits multiple file sections, so neither containment is established.
- Final severity: P1
- Confidence: 0.94
- Downgrade trigger: Downgrade to P2 if live Codex evidence proves one PostToolUse invocation per changed file, or if the runtime rejects multi-file patch bodies before this adapter runs.

### P2

None new.

## Traceability Checks

- `spec_code`: partial. Relocated adapters load, runtime registrations resolve, and shared behavior suites pass; the Codex multi-file branch does not preserve per-edited-file quality coverage.
- `checklist_evidence`: pending for the traceability dimension.
- `skill_agent`: partial, unchanged from iteration 1.
- `agent_cross_runtime`: partial. Payload translations were inspected across Codex, Cursor, and Devin; live-runtime replay remains outside this iteration.
- `feature_catalog_code`: pending.
- `playbook_capability`: pending.

## Verdict

CONDITIONAL. One P1 correctness defect degrades Codex post-edit quality coverage for multi-file patches. Import resolution, runtime wiring, fail-open handling, syntax, and all exercised shared-core regressions passed.

## Next Dimension

Security: inspect trust boundaries around hook payload paths, command parsing, transcript reads, log writes, and fail-open behavior under hostile input.

Review verdict: CONDITIONAL
