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

### Status after reconciliation (2026-02-21)

| Area | Finding | File paths |
|---|---|---|
| 136 dead/unused | **Resolved (2026-02-21)** - unreachable benchmark checks and unused exports/types cleanup completed | `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` |
| 138 underwired | **Resolved (2026-02-21)** - artifact routing and mutation ledger are wired in runtime handler paths; targeted tests pass (`artifact-routing`, `memory-search-quality-filter`, `handler-memory-save`, `memory-save-extended`, `handler-memory-crud`, `memory-crud-extended`) | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts` |
| 138 deferred integration | **Resolved (2026-02-21)** - graph metrics are now surfaced via `memory_stats` handler path | `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` |

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
| 138 docs still reference non-canonical/non-existent config paths (`config/flags.ts`, `config/production.json`) and strict-true semantics | **Resolved (2026-02-21 reconciliation)** | `specs/003-system-spec-kit/138-hybrid-rag-fusion/checklist.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/tasks.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/003-unified-graph-intelligence/tasks.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/001-system-speckit-hybrid-rag-fusion/plan.md` |

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

- Residual spec/docs drift narrowed after 136/138/139 reconciliation pass; remaining gaps are outside this documentation-only scope.
- **Resolved (2026-02-21)** - comment/assertion drift fixed in pipeline integration test:
  - `.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts`

## 6) Prioritized remediation plan (P0/P1/P2)

| Priority | Action | Concrete file paths |
|---|---|---|
| **P0** | Reconcile feature-flag default semantics across 136/138 docs and verification artifacts to match runtime truth (or explicitly change runtime if docs are source of truth). | **Completed (2026-02-21)** — `specs/003-system-spec-kit/136-mcp-working-memory-hybrid-rag/implementation-summary.md`, `specs/003-system-spec-kit/136-mcp-working-memory-hybrid-rag/007-documentation-alignment/plan.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/checklist.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/tasks.md`, `specs/003-system-spec-kit/138-hybrid-rag-fusion/003-unified-graph-intelligence/{tasks.md,checklist.md,plan.md,decision-record.md}` |
| **P0** | Close Spec 139 verification drift: synchronize checklist with completed tasks and add missing completion artifact. | **Completed (2026-02-21)** — `specs/003-system-spec-kit/139-spec-kit-phase-system/checklist.md`, `specs/003-system-spec-kit/139-spec-kit-phase-system/tasks.md`, `specs/003-system-spec-kit/139-spec-kit-phase-system/implementation-summary.md` |
| **P1** | Expose graph metrics via `memory_stats` in runtime integration path. | **Completed (2026-02-21)** — `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts` |
| **P1** | Remove or justify proven dead/unused symbols and unreachable checks from 136 analysis set. | **Completed (2026-02-21)** — `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts`, `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` |
| **P2** | Clean residual wording/comment drift and run full-repo regression sweep once working tree stabilizes. | **Partially completed (2026-02-21)** — comment drift fix completed in `.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts`; full-repo regression sweep remains pending on dirty tree. |

## 7) Current confidence

- High confidence on fixed items listed in codex audit baseline and targeted test evidence.
- Medium confidence on residual underwiring/regression-risk areas until full-repo sweep is completed on a clean/stable tree.
