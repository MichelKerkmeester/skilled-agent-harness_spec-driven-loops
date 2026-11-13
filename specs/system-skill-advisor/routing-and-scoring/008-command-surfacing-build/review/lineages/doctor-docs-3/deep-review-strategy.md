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
Narrow pass-three review of command surfacing for the doctor-docs area: the doctor scripts, routes, setup docs, playbook, feature catalog and routing-accuracy docs that the pass-two remediation commits changed.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
Files whose scope area is not doctor-docs, the sealed holdout prompt text, the four left items the pass-two tasks.md "Verifier follow-ups, coordinator" block names, code outside the changed lines and their callers, and pass-one or pass-two findings whose fix holds.

---

## 5. STOP CONDITIONS
Stop at legal convergence under the default severity-weighted rule or at maxIterations 4, whichever comes first. Stop early only on a blocked state-file read or a refused gateway append.

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
- P2 (Suggestions): 0
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
### `--eval` in the space-separated form is ruled out: `NODE_FLAGS_WITHOUT_RUN.has('--eval')` returns true and the reader stops. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `--eval` in the space-separated form is ruled out: `NODE_FLAGS_WITHOUT_RUN.has('--eval')` returns true and the reader stops.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--eval` in the space-separated form is ruled out: `NODE_FLAGS_WITHOUT_RUN.has('--eval')` returns true and the reader stops.

### `bash -o pipefail -c <script>` is ruled out as introduced: the removed `startsCommand` also failed it, so it is a pre-existing limit outside this pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `bash -o pipefail -c <script>` is ruled out as introduced: the removed `startsCommand` also failed it, so it is a pre-existing limit outside this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `bash -o pipefail -c <script>` is ruled out as introduced: the removed `startsCommand` also failed it, so it is a pre-existing limit outside this pass.

### `OpenCode has no prompt hook that writes one` is ruled out as a false claim: `persistAdvisorHookDiagnosticRecord` is imported only by `hooks/claude/user-prompt-submit.ts`, and no OpenCode plugin path calls it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `OpenCode has no prompt hook that writes one` is ruled out as a false claim: `persistAdvisorHookDiagnosticRecord` is imported only by `hooks/claude/user-prompt-submit.ts`, and no OpenCode plugin path calls it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenCode has no prompt hook that writes one` is ruled out as a false claim: `persistAdvisorHookDiagnosticRecord` is imported only by `hooks/claude/user-prompt-submit.ts`, and no OpenCode plugin path calls it.

### A bare `node <marker>` after `env -u NAME`, `env`, `/usr/bin/env`, `node -r`, a subshell, a brace group, `exec`, a background command and a backslash continuation is ruled out as a defect; all seven are tested and pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A bare `node <marker>` after `env -u NAME`, `env`, `/usr/bin/env`, `node -r`, a subshell, a brace group, `exec`, a background command and a backslash continuation is ruled out as a defect; all seven are tested and pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A bare `node <marker>` after `env -u NAME`, `env`, `/usr/bin/env`, `node -r`, a subshell, a brace group, `exec`, a background command and a backslash continuation is ruled out as a defect; all seven are tested and pass.

### A caller regression from the A10 detail change is ruled out: the doctor assets render rows and read states, and no asset reads the detail's leading count. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A caller regression from the A10 detail change is ruled out: the doctor assets render rows and read states, and no asset reads the detail's leading count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A caller regression from the A10 detail change is ruled out: the doctor assets render rows and read states, and no asset reads the detail's leading count.

### A clock reading (`<timestamp>`) for the embed backup folder is ruled out as a current defect: both changed documents and the engine use the plan digest. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A clock reading (`<timestamp>`) for the embed backup folder is ruled out as a current defect: both changed documents and the engine use the plan digest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A clock reading (`<timestamp>`) for the embed backup folder is ruled out as a current defect: both changed documents and the engine use the plan digest.

### A path-traversal finding on `--root` is ruled out: the joined names are constants from the runtime table, and the check only reads them. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A path-traversal finding on `--root` is ruled out: the joined names are constants from the runtime table, and the check only reads them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A path-traversal finding on `--root` is ruled out: the joined names are constants from the runtime table, and the check only reads them.

### A security finding on the reader is ruled out: it treats the settings file as data and never spawns a process. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A security finding on the reader is ruled out: it treats the settings file as data and never spawns a process.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A security finding on the reader is ruled out: it treats the settings file as data and never spawns a process.

### The command-bridges README's field list is ruled out as stale: the suite reads the interface and asserts every name appears in the sentence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The command-bridges README's field list is ruled out as stale: the suite reads the interface and asserts every name appears in the sentence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The command-bridges README's field list is ruled out as stale: the suite reads the interface and asserts every name appears in the sentence.

### The contract tests are not tautologies: each newly asserted sentence was absent before the change, so each test failed on the pre-change tree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The contract tests are not tautologies: each newly asserted sentence was absent before the change, so each test failed on the pre-change tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The contract tests are not tautologies: each newly asserted sentence was absent before the change, so each test failed on the pre-change tree.

### The holdout README disclosure is ruled out as a documentation defect: the ratchet compares `holdoutSha256` (`tests/parity/scorer-eval-baseline-ratchet.vitest.ts:248`), the baseline was recaptured in the same commit as the deletion, and `--numstat` reports 0 added and 1 deleted for the sealed file. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The holdout README disclosure is ruled out as a documentation defect: the ratchet compares `holdoutSha256` (`tests/parity/scorer-eval-baseline-ratchet.vitest.ts:248`), the baseline was recaptured in the same commit as the deletion, and `--numstat` reports 0 added and 1 deleted for the sealed file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The holdout README disclosure is ruled out as a documentation defect: the ratchet compares `holdoutSha256` (`tests/parity/scorer-eval-baseline-ratchet.vitest.ts:248`), the baseline was recaptured in the same commit as the deletion, and `--numstat` reports 0 added and 1 deleted for the sealed file.

### The playbook's absolute persistence path is ruled out as inconsistent: every sibling playbook resolves `<skill>/benchmark/reports/<dated-run-label>/` under its own skill folder, which is what this sentence names. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The playbook's absolute persistence path is ruled out as inconsistent: every sibling playbook resolves `<skill>/benchmark/reports/<dated-run-label>/` under its own skill folder, which is what this sentence names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The playbook's absolute persistence path is ruled out as inconsistent: every sibling playbook resolves `<skill>/benchmark/reports/<dated-run-label>/` under its own skill folder, which is what this sentence names.

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
- None: all four dimensions are covered, the convergence ratio is 0 for the last three iterations and the only open finding is the carried P1. Synthesis follows. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Base commit `ec1869dae8`, head `1ca14a4498`. Pass two closed 27 P2 findings in `017-review-pass-two-remediation`; pass three reviews only the doctor-docs files those remediation commits changed, one `git diff ec1869dae8..HEAD` per file, plus their callers. The sealed holdout file is checked by `--numstat` only and the diff reports 0 added and 1 deleted. Doctor suites and the hook-wiring check run green on the final tree.

### Bounded Context Snapshot

- Target pointers: the 16 doctor-docs files in `reviewScopeFiles`, the doctor embed engine `agents-md-embed.cjs`, the setup workflow `doctor-setup.yaml`, the A10 manifest and the routing-accuracy scripts the READMEs describe.
- Behavior claims: T031/T032/T033 doctor contracts, T034/T044 launch reader, T035 A10 count, T008 bridge README fields, T018 to T021 and T043 routing-accuracy README, T022/T023 playbook persistence, T030 catalog anchors, plus the holdout retirement and baseline recapture outside those tasks.
- Reuse and conventions: the doctor checks print one line per runtime or one row per id and exit nonzero on a finding; docs name the exact file and line a reader must open.
- Review risks and gaps: the pass-two verifier reports are not re-read as findings; only the four coordinator-left items stay out of scope; no caller outside the declared area may be broadened into a code finding.

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
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/doctor/scripts/hook-wiring-check.cjs | pending | - | 0 | pending |
| .skilled/commands/doctor/scripts/agents-md-check.cjs | pending | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs | pending | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs | pending | - | 0 | pending |
| .skilled/commands/doctor/_routes.yaml | pending | - | 0 | pending |
| .skilled/commands/doctor/assets/doctor-agents-md-embed.yaml | pending | - | 0 | pending |
| .skilled/commands/doctor/setup.md | pending | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs | pending | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs | pending | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md | pending | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md | pending | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | pending | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/README.md | pending | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts | pending | - | 0 | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md | pending | - | 0 | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md | pending | - | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-doctor-docs-3-1794593402980-zhrui5, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T19:20:00Z
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
