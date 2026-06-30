# Deep Review Strategy - 123-agent-loops-improved (native lineage)

## 1. OVERVIEW

### Purpose
Persistent brain for the deep-review session over the `123-agent-loops-improved` phase-parent packet. Tracks dimension coverage, findings, exhausted approaches, and next focus. Read by the orchestrator and every `@deep-review` LEAF agent.

## 2. TOPIC
Review target: `.opencode/specs/deep-loops/030-agent-loops-improved` (phase-parent spec-folder, 8 child phases 001-008). The packet implements loop-system improvements across deep-loop-runtime, deep-loop-workflows, system-spec-kit commands/agents, and interconnection/UX/testing hardening. This native lineage reviews the OWNED implementation surfaces (excluding node_modules and vendored external/ references).

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness — Logic errors, off-by-one, wrong return types, broken invariants, state-machine bugs, concurrency/race in async file ops, error-handling gaps
- [ ] D2 Security — Command injection in executor/CLI dispatch, path traversal in artifact resolution, secrets exposure, unsafe deserialization, sandbox/permission bypass, prompt-injection surface
- [ ] D3 Traceability — Spec/code alignment, checklist evidence, cross-reference integrity across commands↔YAML↔agents↔skills, runtime mirror parity
- [ ] D4 Maintainability — Patterns, clarity, documentation quality, dead code, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Reviewing vendored `external/` reference codebases (loop-cli-main, kasper) — they are inputs, not products.
- Reviewing `node_modules/` dependencies.
- Implementing fixes — this loop is observation-only; findings route to `/speckit:plan`.
- Re-reviewing the child-phase spec docs' prose quality in depth (traceability checks cite them; correctness/security target the code).

## 5. STOP CONDITIONS
- `maxIterations` (50) reached — stop_policy=max-iterations makes convergence telemetry-only until the ceiling.
- Unrecoverable error or 3+ consecutive failed iterations.
- Operator pause sentinel (`review/.deep-review-pause`).

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| _(none yet)_ | | | |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
_(populated after iteration 1)_

## 9. WHAT FAILED
_(populated after iteration 1)_

## 10. EXHAUSTED APPROACHES (do not retry)
_(none yet)_

## 11. RULED OUT DIRECTIONS
_(none yet)_

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- **Iteration 1 (inventory pass):** Build artifact map of the owned implementation surfaces; identify file types, hotspots, and complexity. Establish the cross-reference baseline (commands↔YAML↔agents↔scripts). Inventory only — record structural observations, defer deep findings.
- **Subsequent iterations:** rotate D1 Correctness → D2 Security → D3 Traceability → D4 Maintainability, then broaden angles per surface (runtime core, then scripts, then commands/YAML, then deep-improvement benchmark suite). Because stop_policy=max-iterations, keep broadening the angle each pass rather than synthesizing early.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- resource-map.md not present; skipping coverage gate.
- Prior archived review runs exist under `review_archive/` (separate sessions) — not merged into this fresh native lineage.
- This is a native lineage in an active fan-out (`review/lineages/`); codex/glm sibling lineages ran concurrently. This lineage writes only to `review/lineages/native/`.
- Spec is a phase-parent: root `spec.md` + 8 child phases. Phases 001-007 marked Complete; 008 In Progress.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | | commands/YAML/agents/scripts ↔ spec scope claims |
| `checklist_evidence` | overlay | pending | | child checklist.md evidence rows |
| `skill_agent` | overlay | pending | | skills ↔ agents ↔ commands wiring |
| `agent_cross_runtime` | overlay | pending | | .opencode/agents vs .claude/.codex mirrors |
| `feature_catalog_code` | overlay | pending | | |
| `playbook_capability` | overlay | pending | | |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Key owned surfaces (representative; LEAF agents enumerate within each):

**deep-loop-runtime core (lib):** `lib/deep-loop/` (artifact-root, atomic-state, bayesian-scorer, continuity-thread, evidence-contract, executor-audit, executor-config, fallback-router, jsonl-repair, lifecycle-taxonomy, loop-lock, observability-events, permissions-gate, post-dispatch-validate, prompt-pack, runtime-capabilities, sleep) · `lib/council/` (adjudicator-verdict-scoring, convergence, cost-guards, council-graph-db, council-graph-query, multi-seat-dispatch, round-state-jsonl, session-state-hierarchy) · `lib/coverage-graph/` (coverage-graph-db, -query, -signals)

**deep-loop-runtime scripts:** convergence, fanout-merge, fanout-pool, fanout-run, fanout-salvage, loop-lock, query, status, upsert (+ lib/cli-guards)

**deep-loop-workflows scripts:** deep-review/reduce-state · deep-research/reduce-state · deep-context/{reduce-state,loop-lock} · deep-ai-council/* · deep-improvement/{agent-improvement,model-benchmark,skill-benchmark,shared}/* · shared/synthesis/resource-map

**commands:** `commands/deep/*.md` + `assets/*.yaml|txt` · `commands/speckit/*.md` + `assets/*.yaml|txt`

**agents:** `.opencode/agents/*.md` (13 agents)
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 50
- Convergence threshold: 0.01 (telemetry-only; stop_policy=max-iterations)
- stop_policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-06-30T08:01:03Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: scan 9-11 / verify 11-13 / adjudicate 8-10 tool calls (max 13)
- Severity threshold: P2
- Review target type: spec-folder (phase-parent)
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- artifact_dir: review/lineages/native
- Started: 2026-06-30T08:01:03Z
<!-- MACHINE-OWNED: END -->
