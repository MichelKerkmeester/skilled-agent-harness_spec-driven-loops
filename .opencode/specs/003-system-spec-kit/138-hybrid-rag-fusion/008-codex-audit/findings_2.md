# Codex Audit Findings (Consolidated: Specs 136, 138, 139)

Generated: 2026-02-21

Baseline used: `specs/003-system-spec-kit/138-hybrid-rag-fusion/008-codex-audit/findings_1.md` (same folder codex audit output).

## 1) Feature/default-enabled status (with mismatches)

| Spec | Documented status | Runtime/implementation status | Mismatch |
|---|---|---|---|
| `136-mcp-working-memory-hybrid-rag` | `SPECKIT_ADAPTIVE_FUSION` documented as default OFF; decision text says new capabilities default OFF | Rollout policy is opt-out (`unset` => enabled) and adaptive fusion calls `isFeatureEnabled()` | **Yes** - docs imply opt-in; runtime behavior is opt-out unless explicitly `false` |
| `138-hybrid-rag-fusion` | Root checklist/workstream docs claim graph flags default false + strict `=== 'true'` contract | `graph-flags.ts` + rollout policy implement default-enabled (unset => enabled) | **Yes (major)** - internal 138 docs conflict with runtime and with 138 implementation summary |
| `139-spec-kit-phase-system` | Feature flags marked N/A (CLI flag-gated: `--phase`, `--recommend-phases`) | Tasks show CLI flags implemented; checklist remains largely unchecked | **Process mismatch** - implementation/task state and verification state are out of sync |

Primary evidence:
- `specs/003-system-spec-kit/136-mcp-working-memory-hybrid-rag/implementation-summary.md`
- `specs/003-system-spec-kit/138-hybrid-rag-fusion/checklist.md`
- `specs/003-system-spec-kit/138-hybrid-rag-fusion/implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts`
- `specs/003-system-spec-kit/139-spec-kit-phase-system/checklist.md`
- `specs/003-system-spec-kit/139-spec-kit-phase-system/tasks.md`

## 2) Dead code / underwired modules

### Open findings

| Area | Finding | File paths |
|---|---|---|
| 136 dead/unused | Unreachable benchmark checks + unused exports/types still present | `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` |
| 138 underwired | Artifact routing + mutation ledger still reported as underwired in runtime integration paths | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` |
| 138 deferred integration | Graph metrics API exists but not surfaced via `memory_stats` handler path | `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` |

## 3) Test coverage gaps and misplaced tests

### Coverage gaps

- Full-repo bug sweep/test matrix still pending due dirty tree risk (called out in codex audit follow-up).
- Spec 139 still has explicit open test-fixture tasks (`T005`, `T028`, `T033`) and an unchecked verification checklist despite many completed tasks.

### Placement/path corrections already made in the audit

- Added tests in canonical folders:
  - `.opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts`
- `scripts/spec/test-validation.sh` was converted to compatibility wrapper; canonical suite is `scripts/tests/test-validation.sh`.

## 4) Script location/path-reference issues

| Issue type | Status | File paths |
|---|---|---|
| Install script path references (`install_scripts` vs `install_guides/install_scripts`) | Fixed in codex audit | `.opencode/install_guides/install_scripts/test/run-tests.sh` |
| Validation test script canonical location mismatch | Fixed with compatibility wrapper + docs update | `.opencode/skill/system-spec-kit/scripts/spec/test-validation.sh`, `.opencode/skill/system-spec-kit/scripts/spec/README.md` |
| 138 docs still reference non-canonical/non-existent config paths (`config/flags.ts`, `config/production.json`) and strict-true semantics | **Open** | `specs/003-system-spec-kit/138-hybrid-rag-fusion/checklist.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/tasks.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/003-unified-graph-intelligence/tasks.md` |

## 5) Bugs/misalignments vs workflows-code--opencode

### Fixed during audit

- Shebang/env consistency fixes in visual-explainer scripts:
  - `.opencode/skill/workflows-visual-explainer/scripts/validate-html-output.sh`
  - `.opencode/skill/workflows-visual-explainer/scripts/cleanup-output.sh`
- Dead-import/module-header cleanup:
  - `.opencode/skill/mcp-code-mode/mcp_server/index.ts`
- Runtime bug fix (`candidateStart` undefined telemetry path):
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`

### Remaining alignment gaps

- Spec/docs drift (especially 138/139) conflicts with implementation truth and weakens standards compliance.
- Contradictory test comments vs assertions (default false comment while assertions verify default true):
  - `.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts`

## 6) Prioritized remediation plan (P0/P1/P2)

| Priority | Action | Concrete file paths |
|---|---|---|
| **P0** | Reconcile feature-flag default semantics across 136/138 docs and verification artifacts to match runtime truth (or explicitly change runtime if docs are source of truth). | `specs/003-system-spec-kit/136-mcp-working-memory-hybrid-rag/implementation-summary.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/checklist.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/tasks.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/003-unified-graph-intelligence/tasks.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts` |
| **P0** | Close Spec 139 verification drift: synchronize checklist with completed tasks and add missing completion artifact. | `specs/003-system-spec-kit/139-spec-kit-phase-system/checklist.md`, `specs/003-system-spec-kit/139-spec-kit-phase-system/tasks.md`, `specs/003-system-spec-kit/139-spec-kit-phase-system/implementation-summary.md` |
| **P1** | Finish underwired runtime integrations (artifact routing + mutation ledger coverage in real handler paths; expose graph metrics via `memory_stats`). | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` |
| **P1** | Remove or justify proven dead/unused symbols and unreachable checks from 136 analysis set. | `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` |
| **P2** | Clean residual wording/comment drift and run full-repo regression sweep once working tree stabilizes. | `.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/implementation-summary.md`, `specs/003-system-spec-kit/139-spec-kit-phase-system/checklist.md` |

## 7) Current confidence

- High confidence on fixed items listed in codex audit baseline and targeted test evidence.
- Medium confidence on residual underwiring/drift areas until P0/P1 remediation is completed.
