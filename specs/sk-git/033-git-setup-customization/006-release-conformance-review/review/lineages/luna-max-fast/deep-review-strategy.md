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
Review: v4.0.0.11 release conformance for /doctor:git setup and its hardening

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
Implementation of findings; files outside the 25 manifest entries; unrelated doctor commands.

---

## 5. STOP CONDITIONS
Continue through all five iterations. Stop only at maxIterationsReached or an unrecoverable tool error.

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
- P1 (Required): 1
- P2 (Suggestions): 17
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Changelog structure: pass.** Both release entries validate with zero issues. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Changelog structure: pass.** Both release entries validate with zero issues.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Changelog structure: pass.** Both release entries validate with zero issues.

### **Changelog voice: pass.** Both HVR scans report zero hard blockers. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Changelog voice: pass.** Both HVR scans report zero hard blockers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Changelog voice: pass.** Both HVR scans report zero hard blockers.

### **Code drift guards: pass with warnings.** All four guards pass. Alignment-drift reports 278 non-blocking warnings and no errors. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Code drift guards: pass with warnings.** All four guards pass. Alignment-drift reports 278 non-blocking warnings and no errors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Code drift guards: pass with warnings.** All four guards pass. Alignment-drift reports 278 non-blocking warnings and no errors.

### **Command discovery: pass.** All searched command listings and cross-repo references name setup consistently, and the root README includes it in the sk-git verification guidance. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Command discovery: pass.** All searched command listings and cross-repo references name setup consistently, and the root README includes it in the sk-git verification guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Command discovery: pass.** All searched command listings and cross-repo references name setup consistently, and the root README includes it in the sk-git verification guidance.

### **Documented output: partial.** The source renderer appends status counters that the README and catalog leaf omit. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Documented output: partial.** The source renderer appends status counters that the README and catalog leaf omit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Documented output: partial.** The source renderer appends status counters that the README and catalog leaf omit.

### **Existing documentation drift: partial.** R4-P2-001 still applies because the README and feature-catalog leaf describe a bare STATUS line while the renderer appends counters. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Existing documentation drift: partial.** R4-P2-001 still applies because the README and feature-catalog leaf describe a bare STATUS line while the renderer appends counters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Existing documentation drift: partial.** R4-P2-001 still applies because the README and feature-catalog leaf describe a bare STATUS line while the renderer appends counters.

### **Feature catalog package: partial.** The package validator reports zero violations, while its document-structure check warns that section 3 is missing. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Feature catalog package: partial.** The package validator reports zero violations, while its document-structure check warns that section 3 is missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Feature catalog package: partial.** The package validator reports zero violations, while its document-structure check warns that section 3 is missing.

### **Human Voice Rules: partial.** Three target documents return hard punctuation blockers, listed above. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Human Voice Rules: partial.** Three target documents return hard punctuation blockers, listed above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Human Voice Rules: partial.** Three target documents return hard punctuation blockers, listed above.

### **Readme references: partial.** The reference checker reports path errors that are inconclusive for slash-command and repository-root examples; no concrete broken setup link was confirmed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Readme references: partial.** The reference checker reports path errors that are inconclusive for slash-command and repository-root examples; no concrete broken setup link was confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Readme references: partial.** The reference checker reports path errors that are inconclusive for slash-command and repository-root examples; no concrete broken setup link was confirmed.

### **Regression tests: pass.** The Node suite passes 44/44 and the shell suite passes 50/50 with all test temporary output contained under this lineage. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Regression tests: pass.** The Node suite passes 44/44 and the shell suite passes 50/50 with all test temporary output contained under this lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Regression tests: pass.** The Node suite passes 44/44 and the shell suite passes 50/50 with all test temporary output contained under this lineage.

### **Route and command discovery: pass.** Fourteen doctor routes validate; setup appears in the expected listings. Two duplicate-flag warnings are informational. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Route and command discovery: pass.** Fourteen doctor routes validate; setup appears in the expected listings. Two duplicate-flag warnings are informational.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Route and command discovery: pass.** Fourteen doctor routes validate; setup appears in the expected listings. Two duplicate-flag warnings are informational.

### `bash -n .github/scripts/check-gate-inputs.sh` — passed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `bash -n .github/scripts/check-gate-inputs.sh` — passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `bash -n .github/scripts/check-gate-inputs.sh` — passed.

### `bash .github/scripts/check-gate-inputs.sh` — exited 0; `files=39 inputs_resolved=218 dynamic_inputs=9 twin_pairs=243 failures=0`; `RESULT: PASSED`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `bash .github/scripts/check-gate-inputs.sh` — exited 0; `files=39 inputs_resolved=218 dynamic_inputs=9 twin_pairs=243 failures=0`; `RESULT: PASSED`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `bash .github/scripts/check-gate-inputs.sh` — exited 0; `files=39 inputs_resolved=218 dynamic_inputs=9 twin_pairs=243 failures=0`; `RESULT: PASSED`.

### `node --check .skilled/commands/doctor/scripts/git-setup-check.cjs` — passed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `node --check .skilled/commands/doctor/scripts/git-setup-check.cjs` — passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `node --check .skilled/commands/doctor/scripts/git-setup-check.cjs` — passed.

### `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool codex --json` — exited 0; all 11 checks reported PASS and overall status was `OK`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool codex --json` — exited 0; all 11 checks reported PASS and overall status was `OK`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool codex --json` — exited 0; all 11 checks reported PASS and overall status was `OK`.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Review the manifest's cross-repository command, skill, and setup references, including all repo listings that mention doctor commands or `/doctor:git` targets. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
The lead steer limits scope to the 25 paths in goal-file-manifest.txt and orders the passes: code, command surface, skill docs, cross-repo references, then changelogs and final cross-check. The review is read-only. Validators must not write outside this lineage.

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
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/doctor/scripts/git-setup-check.cjs | pending | — | 0 | pending |
| .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs | pending | — | 0 | pending |
| .github/workflows/gate-inputs.yml | pending | — | 0 | pending |
| .github/scripts/check-gate-inputs.sh | pending | — | 0 | pending |
| .github/scripts/tests/check-gate-inputs.test.sh | pending | — | 0 | pending |
| .skilled/commands/doctor/git.md | pending | — | 0 | pending |
| .skilled/commands/doctor/assets/doctor-git-setup.yaml | pending | — | 0 | pending |
| .skilled/commands/doctor/assets/doctor-git-presentation.txt | pending | — | 0 | pending |
| .skilled/commands/doctor/_routes.yaml | pending | — | 0 | pending |
| .skilled/commands/doctor/scripts/README.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/SKILL.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/README.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/assets/commit-message-template.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/feature-catalog/feature-catalog.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/scripts/hooks/README.md | pending | — | 0 | pending |
| README.md | pending | — | 0 | pending |
| .skilled/commands/README.txt | pending | — | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md | pending | — | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md | pending | — | 0 | pending |
| .hermes/skills/sk-git/SKILL.md | pending | — | 0 | pending |
| .skilled/skills/sk-git/changelog/v1.9.0.0.md | pending | — | 0 | pending |
| .skilled/changelog/skilled/v4.0.0.11.md | pending | — | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1; telemetry only because stopPolicy is max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-max-fast-1792125954096-ldhndm, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-16T04:49:36Z
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
