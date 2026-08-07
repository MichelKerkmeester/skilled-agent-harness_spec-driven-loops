# Deep Review Strategy — sol-rereview

## 2. TOPIC

Terminal remediation verification of the mcp-tooling six-mode hub routing surfaces against the prior 15-finding FAIL review.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — PASS in iteration 1; 13/13 hub, 49/49 packet, PASS 98 route-gold gate plus failing control
- [x] D2 Security — PASS in iteration 2; six fallback branches, inert/loud gold parsing, Figma export trust metadata, and design pairing are clean
- [x] D3 Traceability — PASS with one P2 advisory in iteration 3; all prior F001-F015 classes close
- [x] D4 Maintainability — PASS in iteration 4; generic semantics, hard-gate exits, legacy compatibility, and repeat benchmark are clean
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- No implementation changes.
- No review outside the named hub, six mode packets, route-gold harness, remediation packet, and prior review evidence.
- No web research or external systems.

## 5. STOP CONDITIONS

- Run exactly four iterations under `stopPolicy=max-iterations`; convergence is telemetry only before iteration 4.
- Synthesize after the fourth iteration even when clean.
- Any confirmed active P0 forces FAIL; P1 without P0 forces CONDITIONAL; P2-only remains PASS with advisories.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Prior F001-F005 and F008 are closed by source tracing, full replay, current benchmark, and a gate-failure control. |
| D2 Security | PASS | 2 | Prior F006/F007/F013/F014 are closed by source/test parity, parser controls, and explicit transport trust metadata. |
| D3 Traceability | PASS | 3 | F001-F015 close; SRR-P2-001 tracks incomplete discriminator help text. |
| D4 Maintainability | PASS | 4 | Shared harness contracts are generic, syntax-clean, compatibility-covered, and repeatable. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 1 active — SRR-P2-001
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Prior review supplies an exhaustive 15-finding closure matrix and exact source evidence.
- Iteration 1: direct producer-consumer tracing plus full replay matrices and a negative gate control gave high-confidence correctness closure.
- Iteration 2: the six fallback branches and parser controls aligned with regression tests; Figma's local-export nuance and design pairing are explicit.
- Iteration 3: exhaustive finding/evidence mapping closed the prior 15; one local P2 help-text drift remains.
- Iteration 4: shared-harness syntax, process-gate, fallback compatibility, and repeat-run metrics are clean.

## 9. WHAT FAILED

- None yet.

## 10. EXHAUSTED APPROACHES (do not retry)

- None yet.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Broad repository cleanup and unrelated dirty-worktree changes are out of scope.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Phase: synthesis
- Focus area: authoritative registry, planning trigger, dimension coverage, and terminal verdict
- Reason: maxIterations=4 reached with zero P0/P1 and one advisory P2
- Rotation status: 4 of 4 complete
- Required evidence: reduced registry/dashboard, synthesis resource map, final report, and completion record
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: hub `mode-registry.json`, `hub-router.json`, `SKILL.md`, metadata; 13 hub scenarios; six packet routers and 49 packet scenarios; route-gold harness scripts and post-remediation report.
- Behavior claims: fallback-only `defaultResource`; zero-score defer/no-load; provider vocabulary separation; exact one-mode resource isolation; route-gold auto-enforcement for hub skills; PASS 98 and 13/13 gold.
- Reuse and conventions: prior review at `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md`; remediation packet maps all F001-F015 to workstreams and evidence.
- Review risks and gaps: worktree is heavily dirty from the remediation and unrelated sessions; review uses the current filesystem as the intended terminal candidate and will not mutate it. Code-graph writes are disabled by the lineage write boundary; direct reads, exact searches, replay outputs, and cited fallback ledgers provide structural evidence.
- Resource map: `resource-map.md` not present; skipping the input coverage gate. A synthesis resource map will still summarize reviewed delta evidence inside the lineage packet.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | Remediation claims not yet replayed. |
| `checklist_evidence` | core | pending | — | Checked claims not yet sampled against current files. |
| `skill_agent` | overlay | notApplicable | — | Spec-folder target; no agent contract in scope. |
| `agent_cross_runtime` | overlay | notApplicable | — | Spec-folder target; no agent mirror target in scope. |
| `feature_catalog_code` | overlay | pending | — | Hub description/graph/registry parity pending. |
| `playbook_capability` | overlay | pass | 1 | Executable replay: hub 13/13 and packets 49/49 exact intent/resource matches. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File or surface | Dimensions Reviewed | Last Iteration | Findings | Status |
|-----------------|---------------------|----------------|----------|--------|
| Hub registry/router/SKILL/metadata | D1, D2, D3 | 3 | 1 P2 | complete with advisory |
| `manual_testing_playbook/hub_routing/` (13 scenarios) | D1, D3 | 3 | 0 | complete |
| Six packet SKILL routers + recall packs (49 scenarios) | D1, D2 | 2 | 0 | complete for behavior and trust boundaries |
| Route-gold harness and tests | D1, D2, D4 | 4 | 0 | complete |
| Remediation spec/checklist/summary + prior review | D3 | 3 | 0 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-sol-rereview-1784227058428-v8wtp3, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=feature_catalog_code,playbook_capability
- Writable root: `.opencode/specs/mcp-tooling/011-routing-remediation/review/lineages/sol-rereview` only
- Started: 2026-07-16T18:41:41Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

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
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A command-injection channel through route-gold frontmatter: parser outputs remain inert comparison strings. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A command-injection channel through route-gold frontmatter: parser outputs remain inert comparison strings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A command-injection channel through route-gold frontmatter: parser outputs remain inert comparison strings.

### A hidden default-resource load on zero-score packet routes: source branches, regression cases, and 49-row replay all agree on empty resource assembly. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A hidden default-resource load on zero-score packet routes: source branches, regression cases, and 49-row replay all agree on empty resource assembly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A hidden default-resource load on zero-score packet routes: source branches, regression cases, and 49-row replay all agree on empty resource assembly.

### A remediation-specific branch in the shared replay consumer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A remediation-specific branch in the shared replay consumer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A remediation-specific branch in the shared replay consumer.

### A report-only route-gold failure that exits successfully. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A report-only route-gold failure that exits successfully.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A report-only route-gold failure that exits successfully.

### A silent Figma workspace-write posture: the registry and packet explicitly scope local writes to operator-selected export paths with no silent overwrite. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A silent Figma workspace-write posture: the registry and packet explicitly scope local writes to operator-selected export paths with no silent overwrite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A silent Figma workspace-write posture: the registry and packet explicitly scope local writes to operator-selected export paths with no silent overwrite.

### Breaking legacy eager-default behavior for undeclared routers. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Breaking legacy eager-default behavior for undeclared routers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Breaking legacy eager-default behavior for undeclared routers.

### F009: all six modes appear in graph signals, entities, edge contexts, and causal summary. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: F009: all six modes appear in graph signals, entities, edge contexts, and causal summary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: F009: all six modes appear in graph signals, entities, edge contexts, and causal summary.

### F010: all three phase-007 documents carry the bounded amendment and real evidence paths. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: F010: all three phase-007 documents carry the bounded amendment and real evidence paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: F010: all three phase-007 documents carry the bounded amendment and real evidence paths.

### F011: the index and filesystem agree on 13 unique scenario files and one holdout per mode. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: F011: the index and filesystem agree on 13 unique scenario files and one holdout per mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: F011: the index and filesystem agree on 13 unique scenario files and one holdout per mode.

### Nondeterministic current hub scoring across repeated runs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Nondeterministic current hub scoring across repeated runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Nondeterministic current hub scoring across repeated runs.

### Reopening the six prior correctness classes: ruled out by source-level producer/consumer tracing, 62/62 exact replay rows, current PASS 98 benchmark evidence, and the negative hard-gate control. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reopening the six prior correctness classes: ruled out by source-level producer/consumer tracing, 62/62 exact replay rows, current PASS 98 benchmark evidence, and the negative hard-gate control.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening the six prior correctness classes: ruled out by source-level producer/consumer tracing, 62/62 exact replay rows, current PASS 98 benchmark evidence, and the negative hard-gate control.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Phase: synthesis - Focus area: authoritative registry, planning trigger, coverage status, and terminal verdict - Reason: all four required dimensions are complete and `maxIterations=4` is reached - Rotation status: 4/4 dimensions complete Review verdict: PASS

<!-- /ANCHOR:next-focus -->
