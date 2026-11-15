# Deep Review Strategy - Session Tracking

Runtime strategy for the `swe` fan-out lineage reviewing `specs/hooks/023-session-relaunch-loop`. Updated after every iteration.

---

## 2. TOPIC

Post-remediation deep review of the session relaunch loop packet: a runtime-neutral relaunch core (`lib/`), per-runtime arm/nudge adapters (Claude, Codex, Hermes, Pi, OpenCode), the `skilled-loop` wrapper, the `session-relaunch` CLI, tests, docs, and the packet's spec docs. Phase 005 (`005-deep-review-remediation`) claims all twelve P2 advisories from the archived review (`review-archive/20261018T184826Z/`, verdict PASS, 12 P2) are fixed with tests.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Re-implementing or patching findings (observation only; fixes are a separate follow-up phase).
- Reviewing files outside the declared review scope roots (adjacent 005-touched files such as `extract_structure.py`, `verify-iteration.cjs`, and the `pi-fast-mode` extension are baseline-adjacent context, not the review target).
- Re-litigating closed advisories that verify as fixed; regressions get new findings.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (3) reached: mandatory stop with `stopReason: maxIterationsReached` (stopPolicy=max-iterations; convergence before that is telemetry only).
- Confirmed active P0: immediate FAIL path at synthesis; iteration still completes its artifacts.
- State file corruption that cannot be reconstructed from JSONL + iteration files.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

[None yet]

---

## 9. WHAT FAILED

[None yet]

---

## 10. EXHAUSTED APPROACHES (do not retry)

[None yet]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS

[None yet]

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: D1 correctness
- Focus area: relaunch core state machine — `lib/relaunch-core.cjs`, `lib/killer.cjs`, `lib/nudge.cjs`, `lib/context-usage.cjs`, `bin/session-relaunch.cjs`, `bin/skilled-loop`
- Reason: highest blast radius; phase 005 rewrote the append log, killer takeover mutex, and armed-record restart paths that were the prior run's riskiest surface
- Rotation status: 0/4 dimensions covered
- Required evidence: file:line for every finding
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 46 scope files in `deep-review-config.json.reviewScopeFiles`; implementation core at `.skilled/hooks/session-relaunch/{lib,bin,claude,codex,hermes,pi}`, `.opencode/plugins/session-relaunch.js`, `.skilled/bin/skilled-loop`; packet docs under `specs/hooks/023-session-relaunch-loop/` and its five child phases; `scratch/contracts/interface-contract.md`; `scratch/run-ledger.md`.
- Behavior claims to verify: AC-001..AC-007 of `005-deep-review-remediation/acceptance-criteria.md` (each row Met with ledger/test citations); the 12 remediated advisories from the archived report's Active Finding Registry; the wrapper exit contract (`skilled-loop`), the balanced Skip suffix, and the interface-contract superseded-order fix.
- Prior review lineage: `review-archive/20261018T184826Z/` — 7 iterations on cli-pi deepseek-v4.1-flash, verdict PASS with 12 P2 advisories, archived when the packet was remediated. Its findings are the regression baseline for this lineage.
- Reuse and conventions: shared helpers now consolidated in `lib/nudge.cjs` (`plannedNotePath`, `relaunchThreshold`, `notePathFromSeed`, `SPEC_FOLDER_SKIP_SUFFIX_LEGACY`) and `lib/relaunch-core.cjs` (`ensureStateDir`, `liveKillerPid`, `findLoopChildPid`, `readProcessTable`).
- Review risks and gaps: no `resource-map.md` at spec root (coverage gate skipped); ledger evidence paths in AC rows may have drifted since `run-ledger.md` is a moving log; `.pi` TypeScript adapter cannot be exercised by `node --test` (has its own vitest surface, 21 tests claimed).
- Out of scope: `extract_structure.py`, `verify-iteration.cjs`, `reduce-state.cjs`, `pi-fast-mode` extension, and `durable-directory-manifest.json` are 005-adjacent files captured in the containment baseline but outside the relaunch-loop scope roots.

`resource-map.md not present. Skipping coverage gate`

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | spec.md + child specs vs implementation |
| `checklist_evidence` | core | pending | - | AC rows + tasks.md evidence pointers |
| `skill_agent` | overlay | notApplicable | - | target is a spec-folder, not a skill/agent packet |
| `agent_cross_runtime` | overlay | pending | - | cross-runtime adapter parity is a live concern here |
| `feature_catalog_code` | overlay | pending | - | feature-catalog leaf vs implementation |
| `playbook_capability` | overlay | pending | - | three relaunch playbooks vs executable reality |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/lib/killer.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/lib/nudge.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/lib/context-usage.cjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | - | - | - | pending |
| .skilled/bin/skilled-loop | - | - | - | pending |
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/claude/stop-arm.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/shared.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/stop-arm.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/context-nudge.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/codex/prompt-seed.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/hermes/context-nudge.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs | - | - | - | pending |
| .skilled/hooks/session-relaunch/pi/session-relaunch.ts | - | - | - | pending |
| .opencode/plugins/session-relaunch.js | - | - | - | pending |
| packet spec docs (parent + 5 phases + contract + ledger) | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Stop policy: max-iterations (convergence treated as telemetry; synthesis must record `stopReason: maxIterationsReached`)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-swe-1792349322065-8lohfl, parentSessionId=null, generation=1, lineageMode=new (requestedLineageMode=auto)
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Executor: cli-devin model=swe-2-max
- Started: 2026-10-18T18:53:01.000Z
<!-- MACHINE-OWNED: END -->
