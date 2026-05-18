# Deep Review Strategy: 013 Doctor Update Orchestrator (phase parent + 001 + 002)

## Review Charter

**Target**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/`
**Type**: spec-folder (phase parent with 2 children: `001-doctor-commands`, `002-sandbox-testing-playbook`)
**Session**: `2026-05-11T05-55-00Z-rm8-013-deepseek`
**Executor**: cli-opencode + `deepseek/deepseek-v4-pro` (variant=high) — running under hardened iteration prompt (RM-8 mitigation) inside isolated git worktree
**Max iterations**: 10 | **Convergence threshold**: 0.10
**Dispatch context**: post-RM-8 prompt hardening (commit `ab9f25ae5`). Worktree at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/013-doctor-review` so any scope violation is blast-radius-contained.

## Scope (24 files)

### Parent control files
- `spec.md`, `description.json`, `graph-metadata.json`, `handover.md`, `resource-map.md`

### 001-doctor-commands (Level 2/3)
- Spec: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `resource-map.md`
- Metadata: `description.json`, `graph-metadata.json`
- Implementation surfaces: 5 isolated `/doctor:*` commands + unified `/doctor:update` orchestrator. Sub-areas: `ai-council/`, `dispatch/`.

### 002-sandbox-testing-playbook (Level 3)
- Spec: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `resource-map.md`, `handover.md`
- Metadata: `description.json`, `graph-metadata.json`
- Implementation surface: Docker sandbox + 25-scenario manual playbook. Sub-area: `dispatch/`.

## Review Dimensions (risk-ordered)

| Order | Dimension | Focus |
|-------|-----------|-------|
| 1 | **correctness** | Spec-code alignment, requirement traceability, command implementation against doctor command surface contract; sandbox playbook scenarios actually exercise the implementation |
| 2 | **security** | Doctor commands touch installation/update flow + Docker sandbox; check for arbitrary command exec, path traversal, privilege escalation, secrets in test fixtures |
| 3 | **traceability** | spec_code (requirements → implementation files), checklist_evidence (acceptance criteria → verification), skill_agent (doctor commands → @doctor agent if exists), playbook_capability (002 scenarios → 001 surfaces) |
| 4 | **maintainability** | Cross-runtime mirror consistency (.opencode/.claude/.codex/.gemini); doc-code drift; phase-parent control file discipline (lean trio policy) |

## Traceability Protocols

- **Core**: `spec_code` (requirement → implementation evidence), `checklist_evidence` (criterion → verification artifact)
- **Overlay**: `skill_agent` (commands → owning skill), `agent_cross_runtime` (4-runtime mirror integrity), `feature_catalog_code` (resource-map → actual paths), `playbook_capability` (sandbox scenarios → exercised command surface)

## Iteration Plan

- **Iteration 1 (inventory)**: Build artifact map across parent + 2 children; identify implementation files referenced; estimate dimension coverage cost.
- **Iterations 2-5**: Risk-ordered deep passes — correctness first (P0 candidates), then security.
- **Iterations 6-7**: Traceability — `spec_code` and `checklist_evidence` for both child phases; `playbook_capability` cross-check (do 002 scenarios actually exercise 001 commands?).
- **Iterations 8-9**: Maintainability — cross-runtime mirror, doc-code drift, resource-map accuracy.
- **Iteration 10**: Adversarial self-check on accumulated P0/P1; downgrade scrutiny; ensure findings registry well-formed for synthesis.

## Known Context

- **Parent purpose** (from parent `spec.md`): "Phase parent for the doctor command surface and the manual testing playbook that exercises it. 5 isolated `/doctor:*` commands plus the unified `/doctor:update` orchestrator (child 001) ship the runtime; a Docker sandbox + 25-scenario manual playbook (child 002) ships the validation harness."
- **001 status**: completion_pct unknown at strategy time; check `implementation-summary.md` continuity.
- **002 status**: completion_pct unknown at strategy time; check `implementation-summary.md` continuity.
- **Resource map**: parent aggregate at `resource-map.md` (created by `codex` 2026-05-10T07:28:30Z, completion_pct=100). Coverage gate applicable — cross-check `target_files` from any `applied/T-*.md` against `resource-map.md`.
- **RM-8 hardened prompt** in effect: agent is bound to allowed-write paths only (this strategy.md, state log, findings registry, iteration narratives, deltas). Any out-of-scope mutation must be emitted as a `scope_violation` finding instead of executed.

## Stop Conditions (in order of precedence)

1. **Hard stop**: `iteration_count >= 10` → max_iterations_reached (terminal)
2. **All-clean stop**: All 4 dimensions reviewed AND p0_count == 0 AND p1_count == 0 AND coverage_age >= 1 AND all quality gates pass
3. **Convergence stop**: weighted_stop_score >= 0.60 from rolling-average (w=0.30) + MAD noise floor (w=0.25) + dimension coverage (w=0.45)
4. **Stuck recovery**: stuck_count >= 2 triggers granularity pivot or dimension switch

## Verdict Mapping

| Verdict | Condition |
|---------|-----------|
| **PASS** | activeP0 == 0 AND activeP1 == 0 AND all gates pass; `hasAdvisories=true` if P2 findings remain |
| **CONDITIONAL** | activeP0 == 0 AND activeP1 > 0 (remediable but blocking) |
| **FAIL** | activeP0 > 0 |
