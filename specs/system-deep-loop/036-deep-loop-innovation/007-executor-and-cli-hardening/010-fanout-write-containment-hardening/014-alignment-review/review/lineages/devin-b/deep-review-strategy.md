# Deep Review Strategy - Lineage devin-b (fan-out lane)

## 1. OVERVIEW

Lineage-local strategy for fan-out lane `devin-b` (cli-devin, deepseek-v4-flash-max), one of three lanes (devin-a/b/c) each running 5 iterations of the 15-iteration alignment review of the remediated deep-loop tree. Convergence is OFF; the stop policy is max-iterations. All state lives under `review/lineages/devin-b/`.

## 2. TOPIC

Fifteen-iteration alignment review: sk-code and OpenCode, feature catalog and playbooks, SKILL.md against references and assets, deep-loop commands and agents, architecture, against the repo rules. Lane devin-b covers the six alignment dimensions of spec `014-alignment-review` across 5 iterations.

## 3. REVIEW DIMENSIONS (remaining)

Six alignment lanes from spec.md §3 (each iteration maps onto one or two lanes plus the four severity-coverage dimensions):

- [x] Lane A: sk-code and OpenCode alignment (`.opencode/skills/sk-code/` vs deep-loop runtime, command YAMLs, OpenCode surfaces) -- PASS (iter 1, 3x P2)
- [x] Lane B: Feature catalog and playbook alignment (`feature-catalog/`, `manual-testing-playbook/` vs runtime as shipped) -- CONDITIONAL (iter 2, F006 P1)
- [x] Lane C: SKILL.md against references and assets (system-deep-loop, its modes, cli-external-orchestration, sk-code) -- PASS (iter 3, 2x P2)
- [x] Lane D: Deep-loop command alignment (four command YAMLs, compiled contracts vs runtime scripts) -- PASS (iter 4, 2x P2)
- [x] Lane E: Deep-loop agent alignment (.opencode/.claude/.codex/.pi agent definitions vs command contracts) -- PASS (iter 5, parity confirmed)
- [x] Lane F: General architecture (shared-checkout containment, fan-out runner, merge/reducers, dispatch adapters) -- PASS (iter 5, F011 P2)

Severity-coverage dimensions (contract model):

- [ ] D1 Correctness, logic errors, broken invariants, wrong behavior vs claims
- [ ] D2 Security, path handling, env precedence, trust boundaries, secrets exposure
- [ ] D3 Traceability, spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, patterns, clarity, documentation quality, dead paths

## 4. NON-GOALS

- Re-reviewing the seven original fixes and six remediations line by line (the first review did that; this pass reads alignment across surfaces).
- Surfaces outside deep-loop, cli-external-orchestration, sk-code and the repo rules.
- Implementing fixes; findings are reported only.
- Modifying any file outside `review/lineages/devin-b/`.

## 5. STOP CONDITIONS

- maxIterations = 5 reached (mandatory stop per workflow config).
- Convergence mode is OFF: convergence signals are telemetry only, never a stop trigger.
- A confirmed P0 that cannot be verified against the repository halts that finding's recording until evidence is re-read.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Lane A: sk-code + OpenCode alignment | PASS (3x P2) | 1 | Hub prose lags registry (surfaces); cache path not in containment carve-outs; no P0/P1 |
| Lane B: feature catalog + playbook alignment | CONDITIONAL (1x P1, 2x P2) | 2 | Review loop protocol missing containment rules (REQ-006 partial); runtime catalog stale kind claim + missing containment entry |
| Lane C: SKILL.md vs references and assets | PASS (2x P2) | 3 | Hub SKILL.md lane/count prose contradicts registries (5 modes, 2 improvement lanes; 7 CLI modes) |
| Lane D: deep-loop command alignment | PASS (2x P2) | 4 | REQ-006 behaviorally complete; stale inline containment comments; compiled README count wrong |
| Lane E+F: agent alignment + general architecture | PASS (1x P2) | 5 | Agent mirrors in parity; containment architecture shipped per REQ-001..004; adapter list omits cli-hermes |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 10 active
- **Delta this iteration:** +0 P0, +0 P1, +1 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Registry-vs-prose diffing: comparing mode-registry.json/leaf-manifest.json machine lists against SKILL.md/ROUTER.md prose surfaces surfaced F001/F003 fast (iteration 1).
- Cross-surface write-path check: reading containment carve-outs alongside sk-code write-scope notes found F002 without running any tooling (iteration 1).
- REQ-mandated migration replay: grepping for the exact two-rules vocabulary across both loop protocols and the hub pointer proved F006 (absence) faster than reading whole docs (iteration 2).
- Hub-vs-runtime catalog cross-check: comparing the hub feature-catalog index against the runtime catalog index found F005 (runtime inventory gap) (iteration 2).
- Numeric-claim sweep: extracting every count claim (lanes, modes, kinds) from hub prose and diffing against registry/leaf-manifest counts found F007/F008 in one pass (iteration 3).
- Comment-vs-code drift check: reading inline YAML containment comments against the shipped default found F009 without running the runner (iteration 4).
- Cross-runtime mirror parity grep: diffing the pi mirror and codex TOML against the opencode agent for route-proof wording closed lane E cleanly (iteration 5).

## 9. WHAT FAILED
- Counting catalog entries from the index prose (55 claimed vs 54 summed) produced a non-finding; the count discrepancy is not attributable and was dropped after checking (iteration 2).

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated]

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis phase: compile review-report.md (9 sections), finalize registry + dashboard, emit synthesis_complete event with stopReason maxIterationsReached.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.opencode/skills/sk-code/` (SKILL.md, mode-registry.json, references, surface evidence packets), `.opencode/skills/system-deep-loop/` (hub SKILL.md, runtime/, deep-research/, deep-review/, cli-external-orchestration modes), `.opencode/commands/deep/assets/*.yaml` + `assets/compiled/`, `.opencode/agents/` + `.claude/agents/` + `.codex/agents/` + `.pi/agents/` (deep-research, deep-review, deep-improvement, orchestrate), repo rules (AGENTS.md, repo-rules/), parent packet `045-fanout-write-containment-hardening`.
- Behavior claims: parent spec REQ-001..REQ-008 (preserve-by-default quarantine, baseline-content restore, outcome separation `completed_with_containment_advisory`, churn sampler, worktree removal per ADR-007); review spec REQ-001 (15 iterations, state records carrying `target_agent`/`resolved_route`/`agent_definition_loaded`/`mode`), REQ-002 (executor fallback order), REQ-003 (findings verified against the repo, bound to a phase or recorded as reviewed).
- Reuse and conventions: review-mode-contract.yaml taxonomy (4 dimensions, P0/P1/P2, verdicts, 6 cross-reference protocols); deep-review state format (config immutable, JSONL append-only, strategy mutable, iteration write-once, registry/dashboard auto-generated); the repo AGENTS.md gate discipline (this lineage writes only inside `review/lineages/devin-b/`).
- Risk areas and context gaps: this is a fan-out lane; sibling lanes devin-a/devin-c are writing in parallel into their own lineage dirs (no shared state to corrupt). The `review/` root holds only the parent config and orchestration logs. `resource-map.md` is NOT present in the review target, so the Resource Map Coverage Gate is skipped. No prior lineage state exists (fresh init).
- Out of scope: surfaces outside the six lanes; other skills named only where a lane crosses into them.

`resource-map.md not present. Skipping coverage gate`

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 2 | REQ-006 migration incomplete: review loop protocol lacks containment rules (F006); YAML inline behavior migrated (iter 4) |
| `checklist_evidence` | core | pending | - | review target acceptance criteria are scaffolded (Unmet), no checked claims to verify yet |
| `skill_agent` | overlay | partial | 3 | Routing mechanics align across both hubs; hub prose count claims drift (F007, F008) |
| `agent_cross_runtime` | overlay | pass | 5 | Mirrors in parity (pi mirror, codex TOML vs opencode agent) |
| `feature_catalog_code` | overlay | fail | 2 | Stale kind claim (F004) and missing containment entry (F005) in runtime catalog |
| `playbook_capability` | overlay | pass | 2 | WC-001 scenario exists and matches preserve-by-default behavior |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .opencode/skills/sk-code/SKILL.md | correctness, maintainability | 1 | 0 P0, 0 P1, 2 P2 | complete (F001, F003) |
| .opencode/skills/sk-code/mode-registry.json | correctness, traceability | 1 | 0 P0, 0 P1, 1 P2 | complete (F001, F002 evidence) |
| .opencode/skills/sk-code/ROUTER.md | maintainability | 1 | 0 P0, 0 P1, 1 P2 | complete (F003) |
| .opencode/skills/sk-code/leaf-manifest.json | traceability | 1 | none | complete (clean) |
| opencode.json | correctness | 1 | none | complete (clean) |
| .opencode/agents/deep-review.md | traceability | 1 | none | partial (route-proof field check done; full agent contract in lane E) |
| .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | traceability | 1 | 0 P0, 0 P1, 1 P2 | partial (F002 evidence; full containment review in lane F) |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts | traceability | 1 | none | partial (carve-out API read; full review in lane F) |
| .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md | maintainability | 2 | 0 P0, 0 P1, 1 P2 | complete (F004) |
| .opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md | traceability | 2 | 0 P0, 0 P1, 1 P2 | complete (F005) |
| .opencode/skills/system-deep-loop/feature-catalog/fanout-write-containment/fanout-write-containment.md | traceability | 2 | none | complete (clean) |
| .opencode/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md | traceability | 2 | none | complete (clean) |
| .opencode/skills/system-deep-loop/manual-testing-playbook/write-containment/shared-checkout-run.md | traceability | 2 | none | complete (clean) |
| .opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | traceability | 2 | none | complete (clean; containment rules present at 287-290) |
| .opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | traceability | 2 | 0 P0, 1 P1, 0 P2 | complete (F006: rules absent) |
| .opencode/skills/system-deep-loop/SKILL.md | traceability | 2 | 0 P0, 0 P1, 1 P2 | partial (F006 evidence: pointer at :128; full lane C in iter 3) |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | maintainability | 2 | none | complete (clean; EXECUTOR_KINDS authority) |
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md | traceability | 2 | none | complete (clean; REQ-006 satisfied) |
| .opencode/skills/system-deep-loop/mode-registry.json | maintainability | 3 | none | complete (clean; 5 modes authority) |
| .opencode/skills/system-deep-loop/leaf-manifest.json | traceability | 3 | none | complete (clean; matches registry) |
| .opencode/skills/system-deep-loop/ROUTER.md | maintainability | 3 | none | complete (clean; two lanes) |
| .opencode/skills/cli-external-orchestration/SKILL.md | maintainability | 3 | 0 P0, 0 P1, 1 P2 | complete (F008) |
| .opencode/skills/cli-external-orchestration/leaf-manifest.json | traceability | 3 | none | complete (clean; 7 modes) |
| .opencode/commands/deep/assets/deep-review-auto.yaml | correctness, security, traceability | 4 | 0 P0, 0 P1, 1 P2 | complete (F009 evidence) |
| .opencode/commands/deep/assets/deep-research-auto.yaml | correctness, security, traceability | 4 | 0 P0, 0 P1, 1 P2 | complete (F009 evidence) |
| .opencode/commands/deep/assets/deep-review-confirm.yaml | correctness, security, traceability | 4 | none | complete (clean) |
| .opencode/commands/deep/assets/deep-research-confirm.yaml | correctness, security, traceability | 4 | none | complete (clean) |
| .opencode/commands/deep/assets/compiled/README.md | maintainability | 4 | 0 P0, 0 P1, 1 P2 | complete (F010) |
| .opencode/agents/deep-research.md + deep-review.md + deep-improvement.md + orchestrate.md | traceability, correctness | 5 | none | complete (clean; route-proof fields present for loop agents) |
| .pi/agents/deep-review.md + .codex/agents/deep-review.toml + .claude/agents/deep-review.md | traceability | 5 | none | complete (parity confirmed) |
| .opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs | correctness, security | 5 | none | complete (clean; CONTAINMENT_ADVISORY_STATUS wired) |
| .opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | maintainability | 5 | 0 P0, 1 P1, 1 P2 | complete (F006, F011) |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5 (lineage cap; parent run 15 across three lanes)
- Convergence threshold: 0.10 (telemetry only; convergenceMode=off)
- Rolling STOP threshold: 0.08 (not enforced; stop policy is max-iterations)
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-devin-b-1789432854146-6hhsgk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-09-15T00:40:55Z
<!-- MACHINE-OWNED: END -->
