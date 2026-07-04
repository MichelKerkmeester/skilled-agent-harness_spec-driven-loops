# Deep Review Strategy - Session Tracking Template

## 2. TOPIC
Review of the `/goal` OpenCode plugin spec folder and its shipped implementation: `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal_opencode.md`, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, the plugin test suite, and the phase child specs under `.opencode/specs/deep-loops/032-goal-opencode-plugin/`.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Do not modify code or spec docs under review.
- Do not run the full verification command set as a release gate; tests are sampled for baseline only.
- Do not audit external dependencies (`@opencode-ai/plugin/tool`).
- Do not evaluate OpenCode runtime internals beyond the plugin contract surface.

## 5. STOP CONDITIONS
- Max iterations (10) reached.
- Convergence signals treated as telemetry only before iteration 10.
- Any confirmed P0 finding forces a FAIL iteration verdict and a final CONDITIONAL/FAIL synthesis.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet -- populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | [PASS/CONDITIONAL/FAIL] | [N] | [1-sentence result] |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`.]
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated]

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: correctness
- Files: `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md`, `.opencode/plugins/mk-goal.js`, `.opencode/commands/goal_opencode.md`
- Why: Begin with spec-vs-code alignment and core logic claims before security and traceability passes.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- Parent spec reports phases 001-008 and 010-014 complete; phase 009 in progress (separate session); phases 015-021 planned.
- `resource-map.md` is not present at the spec-folder root; coverage gate is skipped.
- Baseline test sample: `node .opencode/plugins/tests/mk-goal-state.test.cjs` passed 21/21.
- Phase 016 (`plugin-correctness-fixes`) is planned and documents a four-reviewer audit dossier with findings F1-F12 and command-contract mismatches D1-D3; current code is the pre-fix baseline for that phase.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Compare spec.md normative claims against mk-goal.js and goal_opencode.md |
| `checklist_evidence` | core | pending | - | Verify checked completion claims in phase checklists have evidence |
| `skill_agent` | overlay | notApplicable | - | Target is a spec-folder, not a skill package |
| `agent_cross_runtime` | overlay | notApplicable | - | Target is a spec-folder, not an agent |
| `feature_catalog_code` | overlay | pending | - | Compare feature catalog entry against shipped capability |
| `playbook_capability` | overlay | pending | - | Compare manual testing playbook scenarios against executable reality |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md` | - | - | - | pending |
| `.opencode/plugins/mk-goal.js` | - | - | - | pending |
| `.opencode/commands/goal_opencode.md` | - | - | - | pending |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | - | - | - | pending |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | - | - | - | pending |
| `.opencode/plugins/tests/mk-goal-export-contract.test.cjs` | - | - | - | pending |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes/spec.md` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-kimi-review-1783146823455-7q45s6, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-07-04T08:33:43Z
<!-- MACHINE-OWNED: END -->
