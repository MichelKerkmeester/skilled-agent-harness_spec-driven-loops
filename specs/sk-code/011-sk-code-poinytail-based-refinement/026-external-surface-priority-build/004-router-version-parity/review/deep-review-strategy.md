---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
commits 9d1168bf3a and 95698b591b on branch worktrees/128-router-version-parity (diff 455f2a2d8c..95698b591b): doctor check 13a no longer compares a hub ROUTER.md version with SKILL.md, a new invariants test pins that, both create-changelog YAML twins stop copying the release version into ROUTER.md, and frontmatter-versioning.md says the doctor compares only the three JSON routing files.

Dimensions, risk-ordered: correctness, security, traceability, maintainability. Max iterations 5, convergence threshold 0.1, stop policy max-iterations. The full diff is specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/scratch/review-diff.patch.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The ROUTER.md version presence and format rule in root-router-contract.cjs (kept, out of scope in spec.md).
- Checks 13b, 13d and the retired 13c.
- The ROUTER.md version values the six hubs carry today.

---

## 5. STOP CONDITIONS
- Five iterations (stop policy max-iterations; convergence is telemetry only).

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
- P1 (Required): 4
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Exact-search cross-consumer sweep over `.skilled/commands` and `.skilled/skills/sk-doc` for `ROUTER.md` version claims, checked against tasks.md T002/CHK-FIX-002: surfaced three live claims the build-time inventory missed (iteration 1)
- Security sweep over every changed hunk plus the parse/regex helpers and test runner: eight security bug classes checked with direct-read evidence — 13a narrowing removes no guard, messages are validated or escaped, the version regex is linear, and the diff removes one file read (iteration 2)
- Maintainability direct-read pass over the five changed files: comment vs follower set, dead-code check, pass-message accuracy, test name/fixture alignment with VP-2/T1, stale-13a-reference search, doc/code consistency and the Section 4 raise all read clean; zero new findings (iteration 4)

---

## 9. WHAT FAILED
- Build-time inventory scope (Known Context, section 13) claimed only the two YAML lines, the standard paragraph and one historical entry; three live docs claim release parity, so that sweep was too narrow (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- T1 test vacuity: ruled out; `stage1Router()` emits `version: ${VERSION}` so the replace mutates ROUTER.md (iteration 1, evidence: parent-skill-check-invariants.test.cjs:107,441)
- JSON parity regression: ruled out; three JSON followers retained and the existing mismatch FAIL case stands (iteration 1, evidence: test.cjs:515)
- Security impact: ruled out; version metadata only, no auth/injection/secret surface (iteration 1, evidence: parent-skill-check.cjs:1855)
- Security dimension sweep (iteration 2): auth bypass, injection, ReDoS, path traversal, secret exposure, supply chain, tamper-detection regression and test isolation all ruled out — 13a is a diagnostic metadata check, FOUR_PART_VERSION is linear, interpolated values are validated or JSON.stringify-escaped, and the diff removes one file read and adds none (evidence: parent-skill-check.cjs:1843, parent-skill-check.cjs:150, parent-skill-check-invariants.test.cjs:441)
- YAML twin divergence: ruled out; identical removals (iteration 1, evidence: create-changelog-auto.yaml:665, create-changelog-confirm.yaml:600)
- Maintainability sweep (iteration 4): comment drift, dead code, stale message, stale 13a test assertion, doc/code drift and version-raise conformance all ruled out — the comment matches the JSON-only follower set, `markdownVersion` still serves the authority, no test keeps the removed comparison, and the standard's paragraph and 1.0.4.0 raise match the code and Section 4 (evidence: parent-skill-check.cjs:1839, parent-skill-check.cjs:1844, parent-skill-check.cjs:1850, parent-skill-check.cjs:1866, parent-skill-check-invariants.test.cjs:441, frontmatter-versioning.md:122, frontmatter-versioning.md:124)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Operator ruling: a hub ROUTER.md keeps its own version, as frontmatter-versioning.md section 1 already says for every doc but SKILL.md. Precedent: check 13c (README version) was retired the same way. Goal and decisions: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/goal.md. Same-class inventory grep at build time found only the two YAML lines, the standard's paragraph and a historical changelog entry (sk-doc/sk-create-changelog/changelog/v1.3.4.0.md:24, left as history). Iteration 1 correction: three live claims remain uncorrected and unrecorded — sk-doc/SKILL.md:17, sk-create-changelog/SKILL.md:261, sk-create-skill/references/skill/examples-and-maintenance.md:181 (finding R1-P1-001; tasks.md T002 and CHK-FIX-002 stay open).

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
| `spec_code` | core | partial | 1 | REQ-001/002 met; REQ-003/004 contradicted by three live docs; REQ-005 unverified |
| `checklist_evidence` | core | partial | 1 | tasks.md T002 and CHK-FIX-002 open; goal criterion 1 greps statically hold |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
- .skilled/commands/doctor/scripts/parent-skill-check.cjs
- .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs
- .skilled/commands/create/assets/create-changelog-confirm.yaml
- .skilled/commands/create/assets/create-changelog-auto.yaml
- .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/spec.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/goal.md

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/commands/create/assets/create-changelog-*.yaml | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md | D1, D2, D3 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/SKILL.md:17, sk-create-changelog/SKILL.md:261, examples-and-maintenance.md:181 | D3 | 1 | 0 P0, 1 P1, 0 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-13T07:13:05.484Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-13T07:13:05.484Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
