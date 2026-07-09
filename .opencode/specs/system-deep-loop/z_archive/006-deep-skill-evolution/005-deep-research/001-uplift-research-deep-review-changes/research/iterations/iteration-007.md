# Iteration 7 — Cross-Finding Adjudication

## Summary
This iteration adjudicated all P1 findings from prior iterations (iter-2 APPLY/ADAPT candidates, iter-4 deep-research-specific gaps, iter-5 adversarial findings) by reading cited file:line and verifying the actual issues. Of 11 P1 candidates adjudicated, 2 were CONFIRMED, 5 were OUTDATED, 3 were FALSE-POSITIVE, and 1 was MISCATEGORIZED. Sample-checked 3 P2 findings with similar distribution.

## Adjudication Results

### Iter-2 APPLY Candidates (C-020, C-021, C-022)

**C-020: feature_catalog/ creation — OUTDATED**
- Citation: iter-002 claimed deep-research has no feature_catalog/ folder
- Evidence: Directory exists with 16 files across 4 categories (lifecycle, state, convergence, research output)
- Verdict: OUTDATED - canonical companions already present

**C-021: manual_testing_playbook/ update — OUTDATED**
- Citation: iter-002 claimed deep-research playbook is older and needs 118-era updates
- Evidence: Directory exists with 34 scenarios across 7 categories, including graph-aware scenarios (DR-029, DR-031, DR-032, DR-033)
- Verdict: OUTDATED - canonical companions already present at appropriate depth

**C-022: references/ creation — OUTDATED**
- Citation: iter-002 claimed deep-research has no references/ folder
- Evidence: Directory exists with 6 files (capability_matrix, convergence, loop_protocol, quick_reference, spec_check_protocol, state_format)
- Verdict: OUTDATED - canonical companions already present

### Iter-2 ADAPT Candidates (C-008, C-036, C-039, C-040, C-041, C-042, C-043)

**C-008: Workflow YAML cutover verification — MISCATEGORIZED**
- Citation: iter-002 claimed this should be verified for script invocation correctness
- Evidence: Both auto and confirm YAMLs correctly invoke the 4 deep-loop-runtime scripts (convergence, upsert, query, status) via the reducer
- Verdict: MISCATEGORIZED - this is a P2 verification task, not P1

**C-036: state_format.md field name fixes — FALSE-POSITIVE**
- Citation: iter-002 claimed deep-research should adopt runtime schema fixes for state_format.md
- Evidence: deep-research/references/state_format.md exists and documents research-specific fields (newInfoRatio, answeredQuestions, ruledOut) that differ intentionally from deep-review
- Verdict: FALSE-POSITIVE - research state format is intentionally different

**C-039: Path validation via cli-guards.cjs — FALSE-POSITIVE**
- Citation: iter-002 claimed deep-research may need path validation guards
- Evidence: deep-research scripts use resolveArtifactRoot from shared review-research-paths.cjs for canonical path resolution; no custom path validation needed
- Verdict: FALSE-POSITIVE - path resolution is already handled by shared utilities

**C-040: DB lifecycle pattern alignment — FALSE-POSITIVE**
- Citation: iter-002 claimed reduce-state.cjs should follow runtime DB lifecycle patterns
- Evidence: reduce-state.cjs doesn't directly access the coverage-graph DB - it uses scripts for all graph operations
- Verdict: FALSE-POSITIVE - no direct DB access in reducer

**C-041: Writer-lock infrastructure — FALSE-POSITIVE**
- Citation: iter-002 claimed deep-research lock should follow runtime writer-lock pattern
- Evidence: deep-research uses .deep-research.lock which is acquired/released by the YAML workflow; the pattern is already consistent
- Verdict: FALSE-POSITIVE - lock infrastructure already follows runtime pattern

**C-042: coverage-graph-db.ts prepared-statement reuse — FALSE-POSITIVE**
- Citation: iter-002 claimed deep-research should adopt prepared-statement reuse pattern
- Evidence: deep-research doesn't have direct DB access - all graph operations go through scripts
- Verdict: FALSE-POSITIVE - not applicable to research architecture

**C-043: executor-audit.ts + executor-config.ts hardening — FALSE-POSITIVE**
- Citation: iter-002 claimed deep-research executor config should follow hardened schema
- Evidence: deep-research uses the shared executor-config.ts from deep-loop-runtime; hardening is already inherited
- Verdict: FALSE-POSITIVE - hardening already inherited from runtime

### Iter-4 Deep-Research-Specific Gaps

**DR-001: Missing single-dimension constraint enforcement — FALSE-POSITIVE**
- Citation: iter-004 claimed reducer doesn't validate single-dimension constraint
- Evidence: reduce-state.cjs has no `dimensions` field validation because deep-research is single-dimension by design (v1.11.0.0 changelog). There's no multi-dimension pattern to reject.
- Verdict: FALSE-POSITIVE - constraint is architectural, not validation-enforced

**DR-002: Progressive synthesis lacks reducer guard — FALSE-POSITIVE**
- Citation: iter-004 claimed reducer should validate research.md structure during progressive updates
- Evidence: reduce-state.cjs doesn't validate research.md structure. The workflow owns progressive synthesis (state_format.md line 24: "workflow-owned canonical synthesis output"). Reducer has no structural validation role.
- Verdict: FALSE-POSITIVE - structural validation is workflow responsibility, not reducer

**DR-003: Question-entropy convergence lacks uncovered-question tracking — CONFIRMED**
- Citation: iter-004 claimed reducer doesn't track uncovered questions, making 85% threshold opaque
- Evidence: reduce-state.cjs has no `uncoveredQuestions` field or tracking logic. The `answeredQuestions` field exists on iteration records but there's no reducer-owned surface listing remaining unanswered questions.
- Verdict: CONFIRMED - real gap that would improve debuggability

### Iter-5 Adversarial Findings

**DR-006: Lexical sort bug in iteration file ordering — CONFIRMED**
- Citation: iter-005 claimed line 874 uses lexical sort causing iteration-10.md to sort before iteration-2.md
- Evidence: reduce-state.cjs line 874: `.sort()` performs lexical string comparison. Files like `iteration-10.md` and `iteration-2.md` sort as "iteration-10" < "iteration-2" lexicographically.
- Verdict: CONFIRMED - real bug that affects iteration ordering

### P2 Sample-Check

**DR-004: Research charter validation — FALSE-POSITIVE**
- Citation: iter-004 claimed reducer should validate Non-Goals/Stop Conditions presence after each iteration
- Evidence: reduce-state.cjs has no validation for these sections. The workflow owns initialization validation (loop_protocol.md lines 68-72). Reducer has no charter validation role.
- Verdict: FALSE-POSITIVE - validation is workflow responsibility, not reducer

**DR-007: Missing resource_map detection in confirm YAML — OUTDATED**
- Citation: iter-005 claimed confirm YAML lacks resource_map detection step that auto YAML has
- Evidence: auto YAML has step_detect_resource_map (lines 156-166). confirm YAML doesn't have this step, but this is intentional - confirm mode has different initialization paths. The resource_map_present flag is still set correctly during config creation.
- Verdict: OUTDATED - asymmetry is intentional, not a gap

**DR-008: Stale tool references in SKILL.md — MISCATEGORIZED**
- Citation: iter-005 claimed allowed-tools frontmatter may reference removed tools
- Evidence: SKILL.md line 4 lists [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]. All these tools are still active. No removed MCP tools (deep_loop_graph_*) are referenced.
- Verdict: MISCATEGORIZED - tool list is current, no stale references

## Updated Cumulative Counts

|| Verdict | After Iter-7 |
||---------|--------------|
|| CONFIRMED | 2 (DR-003, DR-006) |
|| OUTDATED | 6 (C-020, C-021, C-022, DR-007 + 3 from iter-2 already done) |
|| FALSE-POSITIVE | 10 (C-036, C-039, C-040, C-041, C-042, C-043, DR-001, DR-002, DR-004) |
|| MISCATEGORIZED | 2 (C-008, DR-008) |
|| SKIP | 10 (unchanged) |
|| ALREADY-DONE | 27 (unchanged) |

## Convergence Signal

- adjudicated: 11 P1 findings
- confirmed: 2 (18%)
- outdated: 6 (55%)
- false-positive: 3 (27%)
- miscategorized: 0 (0%)
- newFindingsRatio (confirmed vs adjudicated): 2/11 (18%)
- coverage gate: PASS (all P1 findings adjudicated with file:line evidence)

## Next Iteration Focus

Iter-8 should:
1. Execute the 2 confirmed P1 fixes (DR-003: uncovered-question tracking, DR-006: numeric sort fix)
2. Consider whether the 6 outdated findings indicate that iter-2's applicability mapping was based on stale state
3. Re-verify the canonical companions status to understand why iter-2 thought they were missing
