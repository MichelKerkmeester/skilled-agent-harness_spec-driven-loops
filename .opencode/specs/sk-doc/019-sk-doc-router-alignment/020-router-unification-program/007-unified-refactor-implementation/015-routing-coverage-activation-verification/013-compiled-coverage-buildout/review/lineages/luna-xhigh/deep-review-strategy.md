---
title: Deep Review Strategy - Compiled Coverage Buildout
description: Review strategy for the detached compiled-routing coverage lineage.
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review the compiled-routing coverage build-out and default-on claims for the packet.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, logic errors, state transitions, invariants, and edge cases
- [ ] D2 Security, trust boundaries, path handling, and unsafe exposure
- [ ] D3 Traceability, spec/code alignment, checklist evidence, and cross-reference integrity
- [ ] D4 Maintainability, pattern compliance, clarity, and safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Do not modify review targets or canonical packet documents.
- Do not re-run or alter the default-on rollout.
- Do not treat stale planning prose as stronger than verified implementation evidence.

## 5. STOP CONDITIONS
- Run all 10 iterations because stop policy is max-iterations; convergence is telemetry only.
- Stop only on unrecoverable state corruption, repeated executor failure, or the hard iteration ceiling.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
None yet.

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- P0 (Critical): 0 active
- P1 (Major): 0 active
- P2 (Minor): 0 active
- Delta this iteration: +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Initialization captured the full implementation and packet-document scope.

## 9. WHAT FAILED
- No failed review approach recorded yet.

## 10. EXHAUSTED APPROACHES (do not retry)
None yet.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
None yet.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Dimension: correctness. Focus on compiled-route manifest refresh, resolver cohort selection, and parity-harness invariants.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
### Bounded Context Snapshot
- Target pointers: the 35 files listed in `deep-review-config.json`, especially compiled manifest, resolver, per-hub compiler/router/fixture files, parity harness, and packet docs.
- Behavior claims: all seven hubs are compiled-serving with zero drift; default-on cohort is reversible; frozen scorer files remain unchanged.
- Reuse and conventions: sk-design is the reference compiled router; `SPECKIT_COMPILED_ROUTING=0` is the fleet kill-switch.
- Review risks and gaps: planning documents retain stale planned/blocked states; LUNA-HIGH acceptance coverage is incomplete in the packet's own checklist.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | pending | - | Pending traceability pass |
| checklist_evidence | core | pending | - | Pending traceability pass |
| feature_catalog_code | overlay | pending | - | Pending traceability pass |
| playbook_capability | overlay | pending | - | Pending traceability pass |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Scope is defined in `deep-review-config.json`; no files reviewed yet.
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-xhigh-1784691838667-iv78vk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=feature_catalog_code, playbook_capability
- Started: 2026-07-22T03:54:41.300Z
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
- P1 (Required): 2
- P2 (Suggestions): 2
- Resolved: 1

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Frozen scorer files are explicitly treated as immutable evidence inputs. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Frozen scorer files are explicitly treated as immutable evidence inputs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Frozen scorer files are explicitly treated as immutable evidence inputs.

### Invalid flag values do not enable compiled serving. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Invalid flag values do not enable compiled serving.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Invalid flag values do not enable compiled serving.

### Missing implementation evidence for the six-commit delivery is not the issue; the issue is inconsistent lifecycle state and unresolved required checklist rows. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Missing implementation evidence for the six-commit delivery is not the issue; the issue is inconsistent lifecycle state and unresolved required checklist rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing implementation evidence for the six-commit delivery is not the issue; the issue is inconsistent lifecycle state and unresolved required checklist rows.

### Missing or malformed state returns legacy behavior rather than throwing into the routing path. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Missing or malformed state returns legacy behavior rather than throwing into the routing path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing or malformed state returns legacy behavior rather than throwing into the routing path.

### Missing SD-015 test coverage is disproved by the named positive and negative tests. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Missing SD-015 test coverage is disproved by the named positive and negative tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing SD-015 test coverage is disproved by the named positive and negative tests.

### No evidence of a parity guard that collapses all non-route outcomes into a false pass was found; explicit regression tests cover both failure and match cases. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No evidence of a parity guard that collapses all non-route outcomes into a false pass was found; explicit regression tests cover both failure and match cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No evidence of a parity guard that collapses all non-route outcomes into a false pass was found; explicit regression tests cover both failure and match cases.

### No new serving-path security or correctness defect was found in this maintainability pass. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new serving-path security or correctness defect was found in this maintainability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new serving-path security or correctness defect was found in this maintainability pass.

### No path traversal or symlink escape finding was confirmed in the reviewed manifest and resolver boundaries. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No path traversal or symlink escape finding was confirmed in the reviewed manifest and resolver boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No path traversal or symlink escape finding was confirmed in the reviewed manifest and resolver boundaries.

### Parity classification retains drift for real route/resource mismatches rather than masking them. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Parity classification retains drift for real route/resource mismatches rather than masking them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parity classification retains drift for real route/resource mismatches rather than masking them.

### Sync verification exercises all hubs and reports zero spec-tree reads. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Sync verification exercises all hubs and reports zero spec-tree reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sync verification exercises all hubs and reports zero spec-tree reads.

### The fleet kill-switch and default-on truth table are tested across all seven hubs. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The fleet kill-switch and default-on truth table are tested across all seven hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The fleet kill-switch and default-on truth table are tested across all seven hubs.

### The packet records the incomplete LUNA-HIGH acceptance sweep as a follow-up rather than silently claiming full acceptance coverage. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The packet records the incomplete LUNA-HIGH acceptance sweep as a follow-up rather than silently claiming full acceptance coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The packet records the incomplete LUNA-HIGH acceptance sweep as a follow-up rather than silently claiming full acceptance coverage.

### The reviewed tests preserve the distinction between a real route/resource drift and a matched non-route decision. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The reviewed tests preserve the distinction between a real route/resource drift and a matched non-route decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reviewed tests preserve the distinction between a real route/resource drift and a matched non-route decision.

### Unsafe activation roots and manifest links are rejected. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Unsafe activation roots and manifest links are rejected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unsafe activation roots and manifest links are rejected.

### Unsafe hub identity handling was not a finding in this pass; the refresh path delegates identity validation to `canonicalManifestPath` and explicitly returns `unsafe-path` on failure at `.opencode/bin/lib/compiled-route-manifest.cjs:545-549`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Unsafe hub identity handling was not a finding in this pass; the refresh path delegates identity validation to `canonicalManifestPath` and explicitly returns `unsafe-path` on failure at `.opencode/bin/lib/compiled-route-manifest.cjs:545-549`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unsafe hub identity handling was not a finding in this pass; the refresh path delegates identity validation to `canonicalManifestPath` and explicitly returns `unsafe-path` on failure at `.opencode/bin/lib/compiled-route-manifest.cjs:545-549`.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: convergence - focus area: whole-packet disposition and finding persistence - reason: regression evidence is adequate; final pass must ensure findings are neither duplicated nor silently dropped Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
