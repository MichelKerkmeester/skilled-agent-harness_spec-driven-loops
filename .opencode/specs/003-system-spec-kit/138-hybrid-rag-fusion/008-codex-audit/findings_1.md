# Codex Audit Findings

Generated: 2026-02-21

## Skill Routing

- `workflows-code--opencode` (confidence `0.95`, uncertainty `0.35`)

## Delegated Audit (5 Parallel Codex Agents)

- Spec 136 feature/default/test mapping
- Spec 138 feature/default/test mapping
- Spec 139 phase-system mapping
- Test coverage matrix across `system-spec-kit` + `mcp_server`
- Script location + `workflows-code--opencode` alignment scan

## Scope

- `.opencode/specs/003-system-spec-kit/136-mcp-working-memory-hybrid-rag/`
- `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/`
- `.opencode/specs/003-system-spec-kit/139-spec-kit-phase-system/`
- `.opencode/skill/system-spec-kit/mcp_server/`
- `.opencode/skill/system-spec-kit/scripts/`
- `.opencode/install_guides/install_scripts/`

## Implemented Fixes

1. `create.sh` phase defaults and parent append mode
   - Default `--phase` count set to 3
   - Added `--parent` parsing + validation
   - Added append-mode numbering/predecessor handling for new child phases
   - Added safer handling for empty parent file arrays in phase JSON/text output
   - File:
     - `.opencode/skill/system-spec-kit/scripts/spec/create.sh`

2. Reinitialize path keeps graph channel wiring
   - `context-server` now stores `unifiedGraphSearchFn` in db-state setup
   - Prevents graph channel dropping on `reinitializeDatabase()`
   - Files:
     - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
     - `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`

3. Quality filter behavior made explicit and testable
   - Added `resolveQualityThreshold` helper (camelCase + snake_case parity)
   - Added test exports for quality helpers
   - File:
     - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`

4. Degraded contract alignment
   - `adaptive-fusion` `retry_recommendation` now uses enum values instead of boolean
   - Aligned with typed retry contract semantics used elsewhere
   - Files:
     - `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts`
     - `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`

5. Incorrect install script test paths fixed
   - Updated usage/docs path references
   - Fixed `PROJECT_ROOT` mount path for Docker test runner
   - Updated script target path from `install_scripts` -> `install_guides/install_scripts`
   - File:
     - `.opencode/install_guides/install_scripts/test/run-tests.sh`

6. Script location cleanup
   - `scripts/spec/test-validation.sh` now acts as compatibility wrapper
   - Canonical test suite remains in `scripts/tests/test-validation.sh`
   - Updated spec scripts inventory docs to point to tests location
   - Files:
     - `.opencode/skill/system-spec-kit/scripts/spec/test-validation.sh`
     - `.opencode/skill/system-spec-kit/scripts/spec/README.md`

7. `workflows-code--opencode` alignment fixes
   - visual-explainer scripts now use canonical env-based shebang
   - mcp-code-mode entrypoint cleaned up for dead imports + clearer module header
   - Files:
     - `.opencode/skill/workflows-visual-explainer/scripts/validate-html-output.sh`
     - `.opencode/skill/workflows-visual-explainer/scripts/cleanup-output.sh`
     - `.opencode/skill/mcp-code-mode/mcp_server/index.ts`

8. Python test import path reliability
   - `test_dual_threshold` now loads `skill_advisor.py` via explicit module path loader
   - File:
     - `.opencode/skill/system-spec-kit/scripts/tests/test_dual_threshold.py`

## New Tests Added (Correct Folders)

- `.opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts`

## Validation Executed

- `bash -n` on modified shell scripts: PASS
- `bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh`: PASS (5/5)
- `python3 -m pytest .opencode/skill/system-spec-kit/scripts/tests/test_dual_threshold.py -q`: PASS (71)
- `npm run test -- tests/adaptive-fusion.vitest.ts tests/memory-search-quality-filter.vitest.ts tests/db-state-graph-reinit.vitest.ts`: PASS (30)

## Follow-up Fix (Post-audit Continuation)

9. `memory-search` telemetry variable bug
   - Fixed undefined `candidateStart` reference in post-search telemetry path
   - Added local `pipelineStart` timing anchor and used it for latency calculation
   - File:
     - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`

## Follow-up Validation

- `npm run test -- tests/memory-search-quality-filter.vitest.ts tests/handler-memory-search.vitest.ts`: PASS (15)
- `npx tsc --noEmit`: confirms `candidateStart` error resolved; remaining TS errors are in unrelated/pre-existing areas

## Follow-up Implementation (User-selected: 1 + 2)

10. Artifact routing wired into live `memory_search` pipeline
   - Added query/concepts routing resolution in handler flow
   - Applied artifact-class weighting in post-search pipeline (`spec/plan/tasks/checklist/memory`)
   - Added artifact-class max-result cap when detected class is not `unknown`
   - Exposed routing metadata in response (`artifactRouting` + `artifact_routing`)
   - Files:
     - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
     - `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts`

11. Mutation ledger wired into memory save/update/delete handlers
   - `memory_save`: append-only ledger entries for create/update/reinforce paths
   - `memory_delete`: ledger entries for single delete and per-memory bulk delete
   - `memory_update`: ledger entry after metadata update path
   - Added safe initialization + non-fatal append behavior (`initLedger` + guarded append)
   - Files:
     - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
     - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts`
     - `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts`

## Additional Validation (for 1 + 2)

- `npm run test -- tests/memory-search-quality-filter.vitest.ts tests/handler-memory-search.vitest.ts`: PASS (19)
- `npm run test -- tests/artifact-routing.vitest.ts`: PASS (35)
- `npm run test -- tests/handler-memory-crud.vitest.ts tests/memory-crud-extended.vitest.ts`: PASS (82)
- `npm run test -- tests/handler-memory-save.vitest.ts tests/memory-save-extended.vitest.ts`: PASS (42), skipped (13)

## Remaining Gaps / Follow-up

1. Artifact routing and mutation ledger in 138 still appear underwired in runtime integration paths.
2. 138 and 139 spec docs still have some implementation-state drift.
3. Full-repo bug sweep should still be run separately with complete test matrix due large dirty working tree.

## Confidence

- High confidence for changed files and executed test suites.
- Medium confidence for untouched areas flagged above.
