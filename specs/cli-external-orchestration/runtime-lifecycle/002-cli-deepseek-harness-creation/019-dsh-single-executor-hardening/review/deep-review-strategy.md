# Deep Review Strategy

## 2. TOPIC
Uncommitted C6 executor-identity change: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts, .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs, .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts, .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts, .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts, .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts, .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts (type: files). Spec folder: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Files outside the seven named files, except as cross-references (the four deep YAML callers, executor-audit.vitest.ts).
- Fixing anything: the review target is read-only.

---

## 5. STOP CONDITIONS
- maxIterations = 1: the loop stops after iteration 1 with maxIterationsReached.
- Any new P0 is recorded and blocks a clean verdict.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Live state-log inspection: the run's own `iteration_start` row proves the gateway path in production, not only in a fixture. (iteration 1)
- Diff-first targeting with exact-anchor reads: the 120-line diff plus the new end-to-end test carried the correctness evidence without reading unchanged bodies. (iteration 1)

---

## 9. WHAT FAILED
- Whole-repo `writeFirstRecordExecutor` content search: the first search exceeded the output cap; a path-scoped `rg` over the four deep YAML callers succeeded. (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Command injection through the new spawn** -- ruled out: argv-only `spawnSync`, no shell, fixed mode constants [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Command injection through the new spawn** -- ruled out: argv-only `spawnSync`, no shell, fixed mode constants [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Command injection through the new spawn** -- ruled out: argv-only `spawnSync`, no shell, fixed mode constants [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1103].

### **Direct write being dropped by a refresh** -- ruled out by the gateway path plus the live row [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening/review/deep-review-state.jsonl:3]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Direct write being dropped by a refresh** -- ruled out by the gateway path plus the live row [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening/review/deep-review-state.jsonl:3].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Direct write being dropped by a refresh** -- ruled out by the gateway path plus the live row [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening/review/deep-review-state.jsonl:3].

### **Duplicate opening rows on a sequential re-audit** -- ruled out by the test's second `writeFirstRecordExecutor` call and the single-row assertion [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts:116]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Duplicate opening rows on a sequential re-audit** -- ruled out by the test's second `writeFirstRecordExecutor` call and the single-row assertion [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts:116].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Duplicate opening rows on a sequential re-audit** -- ruled out by the test's second `writeFirstRecordExecutor` call and the single-row assertion [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts:116].

### **Schema rejection of the optional executor field** -- ruled out by the `executor: 'json'` optional-field rule and the passing research projection test [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:641]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Schema rejection of the optional executor field** -- ruled out by the `executor: 'json'` optional-field rule and the passing research projection test [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:641].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Schema rejection of the optional executor field** -- ruled out by the `executor: 'json'` optional-field rule and the passing research projection test [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:641].

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Direct write being dropped by a refresh: ruled out -- the ledger path routes through the gateway and the live row survived the rebuild (iteration 1, evidence: review/deep-review-state.jsonl:3).
- Command injection through the new spawn: ruled out -- argv-only `spawnSync` with fixed mode constants (iteration 1, evidence: executor-audit.ts:1103).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None -- `maxIterations=1` is reached. Advisory follow-ups only: add a spawn timeout, replace the synthetic focus/strategy digests with real references or mark them synthetic, and make the repository-root resolution installation-depth independent.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Continuity ladder: no handover.md. implementation-summary.md says C6 Option A (executor identity in the state log) was planned in plan.md E14 to E22 and is the change under review. The pre-dispatch audit writeFirstRecordExecutor now takes sessionId and, on a ledger-backed state log, sends an iteration_start row through the append gateway so it survives the projection refresh. resource-map.md not present; skipping coverage gate. Iteration 1 added live evidence: the run's own state log line 3 carries the executor row after a projection refresh.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | REQ-009 implemented at the producer; live row and test agree. |
| `checklist_evidence` | core | pass | 1 | New test covers T028/T029 in both modes and the refusal edge. |
| `skill_agent` | overlay | partial | 1 | SKILL.md/changelog modified outside the seven-file target; not code-reviewed. |
| `agent_cross_runtime` | overlay | partial | 1 | Four YAML callers checked; research placeholder resolution deferred. |
| `feature_catalog_code` | overlay | notApplicable | 1 | No catalog in the declared target. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook in the declared target. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | all | 1 | 2 | reviewed |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | all | 1 | 0 | reviewed |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts | all | 1 | 1 | reviewed |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts | all | 1 | 0 | reviewed |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts | all | 1 | 0 | reviewed |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts | all | 1 | 0 | reviewed |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts | all | 1 | 0 | reviewed |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10 (stop policy: convergence)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-14T22:08:20.484Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-14T22:08:20.484Z
<!-- MACHINE-OWNED: END -->

