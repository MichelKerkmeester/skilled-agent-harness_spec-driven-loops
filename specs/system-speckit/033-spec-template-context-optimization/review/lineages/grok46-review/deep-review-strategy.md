# Deep Review Strategy - Session Tracking

Fan-out lineage `grok46-review`. Artifact directory bound from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not run.

## 1. OVERVIEW

Independent review of spec folder `034-spec-template-context-optimizations` after claimed four-phase implementation and sibling-lineage remediation. Stop policy is `max-iterations` (5); convergence is telemetry only until the ceiling.

## 2. TOPIC

Review of spec folder 034-spec-template-context-optimizations: six 033-recommendation optimizations (research-template gating, template consolidation + read guard, AC_COVERAGE promotion, scope-adherence rule, memory_search token budget).

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Implementing fixes during this review
- Re-running the sibling `pi-flash-review` findings as truth without re-verification
- Reviewing 033 research itself except as cited evidence
- Touching any path outside this lineage directory
- Memory save / `generate-context.js` (writes the spec packet)
- Coverage-graph sqlite upsert (writes outside the lineage)

## 5. STOP CONDITIONS

- Hard stop: `maxIterations` (5) reached under `stopPolicy: max-iterations`
- Convergence votes before iteration 5 are telemetry only; broaden the next review angle instead of synthesizing early
- Pause sentinel `.deep-review-pause` if present

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

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Direct command evidence over sibling-lineage claims: vitest + validate.sh + renderer line counts contradicted stale summary text (iteration 1)
- Scope discovery from spec.md Files to Change plus packet docs, without a goal-file-manifest

## 9. WHAT FAILED

- Treating pi-flash-review F001 (red snapshots) as still true: current tree is green (iteration 1)

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when a review approach has been tried from multiple angles without yielding new findings]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: D2 Security
- Files: check-scope-adherence.sh, check-ac-coverage.sh, memory-search.ts, inline-gate-renderer.ts CLI, memory-context.ts comparison
- Why: Trust boundaries of shipped changes. F001–F003 are doc-state issues; next pass looks for exploitable or unsafe behavior in the new rule and budget code.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Target pointers: packet docs under `specs/system-speckit/034-spec-template-context-optimizations/`; implementation surfaces listed in spec.md §3 Files to Change (templates, renderer, AC_COVERAGE, scope-adherence, memory_search).
- Behavior claims: REQ-001 L1 research render collapse with L3+ byte-identical; REQ-002 byte-identical consolidation; REQ-003 rendered-view read guard; REQ-004 AC_COVERAGE default-on advisory; REQ-005 scope-adherence warn rule; REQ-006 memory_search token budget.
- Reuse and conventions: existing `renderInlineGates` / `inline-gate-renderer`; `validate.sh` rule loop; shared `enforceTokenBudget` / `getTokenBudget`.
- Review risks and gaps: packet claims Complete/uncommitted; sibling pi-flash-review was CONDITIONAL then remediations claimed; `tasks.md` still shows open implementation tasks while checklist is fully checked; `implementation-summary.md` still lists REQ-005 contract as an open question; golden-snapshot claim conflicts between checklist (6/6 pass) and implementation-summary (4 failures, pre-existing).
- Out of scope: 033 refutation list; deep-loop reducer/findings-registry changes; memory_context budget (already shipped).

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | | |
| `checklist_evidence` | core | pending | | |
| `skill_agent` | overlay | notApplicable | 0 | Target type is spec-folder, not skill |
| `agent_cross_runtime` | overlay | notApplicable | 0 | Target type is spec-folder, not agent |
| `feature_catalog_code` | overlay | pending | | Advisory overlay for spec-folder |
| `playbook_capability` | overlay | pending | | Advisory overlay for spec-folder |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/system-speckit/034-spec-template-context-optimizations/spec.md | | | | pending |
| specs/system-speckit/034-spec-template-context-optimizations/plan.md | | | | pending |
| specs/system-speckit/034-spec-template-context-optimizations/tasks.md | | | | pending |
| specs/system-speckit/034-spec-template-context-optimizations/checklist.md | | | | pending |
| specs/system-speckit/034-spec-template-context-optimizations/implementation-summary.md | | | | pending |
| specs/system-speckit/034-spec-template-context-optimizations/decision-record.md | | | | pending |
| specs/system-speckit/034-spec-template-context-optimizations/description.json | | | | pending |
| .opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl | | | | pending |
| .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl | | | | pending |
| .opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl | | | | pending |
| .opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl | | | | pending |
| .opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl | | | | pending |
| .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json | | | | pending |
| .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts | | | | pending |
| .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts | | | | pending |
| .opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh | | | | pending |
| .opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh | | | | pending |
| .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json | | | | pending |
| .opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts | | | | pending |
| .opencode/skills/system-spec-kit/references/templates/template-guide.md | | | | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Stop policy: max-iterations (convergence is telemetry until the ceiling)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-grok46-review-1786566874028-sks2q2, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-08-12T20:38:24Z
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
- P1 (Required): 6
- P2 (Suggestions): 11
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Byte-identical / snapshot gate still red: [vitest 10/10 pass under the packet's cited config], [scaffold-golden-snapshots.vitest.ts] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Byte-identical / snapshot gate still red: [vitest 10/10 pass under the packet's cited config], [scaffold-golden-snapshots.vitest.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Byte-identical / snapshot gate still red: [vitest 10/10 pass under the packet's cited config], [scaffold-golden-snapshots.vitest.ts]

### description.json missing level: [description.json has `"level": "2"`; validate DESCRIPTION_SHAPE passed], [description.json:2] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: description.json missing level: [description.json has `"level": "2"`; validate DESCRIPTION_SHAPE passed], [description.json:2]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: description.json missing level: [description.json has `"level": "2"`; validate DESCRIPTION_SHAPE passed], [description.json:2]

### Expecting feature_catalog to list every new helper: catalog already points at validator-registry for the new rules. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Expecting feature_catalog to list every new helper: catalog already points at validator-registry for the new rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting feature_catalog to list every new helper: catalog already points at validator-registry for the new rules.

### Forcing shared `enforceTokenBudget` as a security defect: [ADR-005], [decision-record.md] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Forcing shared `enforceTokenBudget` as a security defect: [ADR-005], [decision-record.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Forcing shared `enforceTokenBudget` as a security defect: [ADR-005], [decision-record.md]

### git diff injection via MK_SCOPE_BASE: [`git diff --name-only "$scope_base" --` uses `--` to stop option parsing], [check-scope-adherence.sh:55] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: git diff injection via MK_SCOPE_BASE: [`git diff --name-only "$scope_base" --` uses `--` to stop option parsing], [check-scope-adherence.sh:55]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: git diff injection via MK_SCOPE_BASE: [`git diff --name-only "$scope_base" --` uses `--` to stop option parsing], [check-scope-adherence.sh:55]

### Looking for a `--stdout` flag in the renderer: usage is `--out-dir` or omit it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a `--stdout` flag in the renderer: usage is `--out-dir` or omit it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `--stdout` flag in the renderer: usage is `--out-dir` or omit it.

### Looking for a playbook file named for SCOPE_ADHERENCE: none. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a playbook file named for SCOPE_ADHERENCE: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a playbook file named for SCOPE_ADHERENCE: none.

### Looking for a shared `*-core.md.tmpl` include: none exists; consolidation is inline gating per file. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a shared `*-core.md.tmpl` include: none exists; consolidation is inline gating per file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a shared `*-core.md.tmpl` include: none exists; consolidation is inline gating per file.

### memory_search command injection / secret leakage: [no exec/spawn/eval/credential APIs in memory-search.ts], [rg over handler] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: memory_search command injection / secret leakage: [no exec/spawn/eval/credential APIs in memory-search.ts], [rg over handler]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: memory_search command injection / secret leakage: [no exec/spawn/eval/credential APIs in memory-search.ts], [rg over handler]

### plan.md vs tasks.md phase-number collision as an unmarked defect: [tasks.md:35 now has an explicit Phase-numbering note distinguishing lifecycle stages from impl phases P1–P4], [tasks.md:35] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: plan.md vs tasks.md phase-number collision as an unmarked defect: [tasks.md:35 now has an explicit Phase-numbering note distinguishing lifecycle stages from impl phases P1–P4], [tasks.md:35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: plan.md vs tasks.md phase-number collision as an unmarked defect: [tasks.md:35 now has an explicit Phase-numbering note distinguishing lifecycle stages from impl phases P1–P4], [tasks.md:35]

### Red golden snapshots on the current tree: [iter 1 vitest 10/10], [scaffold-golden-snapshots + research-template-gating] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Red golden snapshots on the current tree: [iter 1 vitest 10/10], [scaffold-golden-snapshots + research-template-gating]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Red golden snapshots on the current tree: [iter 1 vitest 10/10], [scaffold-golden-snapshots + research-template-gating]

### Renderer --out-dir as a sandbox escape: [operator-chosen output directory; writes use basename only], [inline-gate-renderer.ts:279-290] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Renderer --out-dir as a sandbox escape: [operator-chosen output directory; writes use basename only], [inline-gate-renderer.ts:279-290]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Renderer --out-dir as a sandbox escape: [operator-chosen output directory; writes use basename only], [inline-gate-renderer.ts:279-290]

### REQ-001 L1 collapse missing: [L1 render is 175 lines], [inline-gate-renderer.sh --level 1] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: REQ-001 L1 collapse missing: [L1 render is 175 lines], [inline-gate-renderer.sh --level 1]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-001 L1 collapse missing: [L1 render is 175 lines], [inline-gate-renderer.sh --level 1]

### REQ-001 L1 collapse: [175-line L1 render], [inline-gate-renderer.sh --level 1] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-001 L1 collapse: [175-line L1 render], [inline-gate-renderer.sh --level 1]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-001 L1 collapse: [175-line L1 render], [inline-gate-renderer.sh --level 1]

### REQ-003 missing read path: [template-guide.md:82 omits --out-dir to print STDOUT; equivalent to --stdout], [template-guide.md:77-85] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-003 missing read path: [template-guide.md:82 omits --out-dir to print STDOUT; equivalent to --stdout], [template-guide.md:77-85]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-003 missing read path: [template-guide.md:82 omits --out-dir to print STDOUT; equivalent to --stdout], [template-guide.md:77-85]

### REQ-004 hard-failing --strict: [validate.sh --strict exit 0 with AC_COVERAGE still RULE_STATUS=pass], [validate output] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-004 hard-failing --strict: [validate.sh --strict exit 0 with AC_COVERAGE still RULE_STATUS=pass], [validate output]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-004 hard-failing --strict: [validate.sh --strict exit 0 with AC_COVERAGE still RULE_STATUS=pass], [validate output]

### Shared enforceTokenBudget reuse as a security defect: [ADR-005 accepted after verifying different truncation strategies], [decision-record.md:86] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Shared enforceTokenBudget reuse as a security defect: [ADR-005 accepted after verifying different truncation strategies], [decision-record.md:86]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shared enforceTokenBudget reuse as a security defect: [ADR-005 accepted after verifying different truncation strategies], [decision-record.md:86]

### Sibling claim that research.md.tmpl has no automated render proof: [`research-template-gating.vitest.ts` asserts L1/L2/L3/3+/phase gating and marker leak], [research-template-gating.vitest.ts:22-50] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Sibling claim that research.md.tmpl has no automated render proof: [`research-template-gating.vitest.ts` asserts L1/L2/L3/3+/phase gating and marker leak], [research-template-gating.vitest.ts:22-50]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sibling claim that research.md.tmpl has no automated render proof: [`research-template-gating.vitest.ts` asserts L1/L2/L3/3+/phase gating and marker leak], [research-template-gating.vitest.ts:22-50]

### Sibling F010 phase-number collision as unmarked: [tasks.md:35 Phase-numbering note], [tasks.md:35] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Sibling F010 phase-number collision as unmarked: [tasks.md:35 Phase-numbering note], [tasks.md:35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sibling F010 phase-number collision as unmarked: [tasks.md:35 Phase-numbering note], [tasks.md:35]

### Template source not shrinking: [spec+plan+tasks+implementation-summary = 1314 lines, matching the packet's 2,931 → 1,314 claim], [wc -l] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Template source not shrinking: [spec+plan+tasks+implementation-summary = 1314 lines, matching the packet's 2,931 → 1,314 claim], [wc -l]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Template source not shrinking: [spec+plan+tasks+implementation-summary = 1314 lines, matching the packet's 2,931 → 1,314 claim], [wc -l]

### Treating F005 (pi-flash duplicated budget helper) as still open: ADR-005 records it as an intentional split. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating F005 (pi-flash duplicated budget helper) as still open: ADR-005 records it as an intentional split.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating F005 (pi-flash duplicated budget helper) as still open: ADR-005 records it as an intentional split.

### Treating sibling pi-flash-review F001 (red snapshots) as still true: current tree is green; that finding is historical. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating sibling pi-flash-review F001 (red snapshots) as still true: current tree is green; that finding is historical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating sibling pi-flash-review F001 (red snapshots) as still true: current tree is green; that finding is historical.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Hard stop: `iteration_count >= 5`. Enter phase_synthesis. Do not dispatch another iteration. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
