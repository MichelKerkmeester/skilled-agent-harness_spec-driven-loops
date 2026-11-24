# Deep Review Strategy -- mcp-browser-use hub epic
Initialized from the deep-review strategy template; tracks dimension coverage, findings and focus across iterations.

## 1. REVIEW CHARTER
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder, phase parent + phases 001 to 014)
- Dimensions: correctness, security, traceability, maintainability
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- Stop conditions: severity-weighted new-findings ratio below 0.10 after the iteration floor, or 7 iterations
- Success criteria: no active P0; every phase goal criterion either evidenced or reported as not met

---

## 2. TOPIC
Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`: a phase parent (001 to 014) whose shipped work is the `mcp-browser-use` hub (three browser modes), the `mcp-tooling` relocation, advisor graph and compiled routing, per-mode playbooks, and the phase 014 remediation of the 2026-11-24 deep review, which also changed the shared advisor scorer.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Browser behaviour against live sites: no browser is launched by this review.
- The other six `mcp-tooling` modes beyond the relocation check.
- `mcp-code-mode` and `mcp-mobbin` playbook census warnings, which 014 left out of scope.
- Re-deciding operator decisions already recorded (D1 to D8 in the parent goal, Q001 to Q004 in 014).

---

## 5. STOP CONDITIONS
- Severity-weighted new-findings ratio below 0.10 after the iteration floor.
- 7 iterations reached.
- A hard blocker in the packet boundary (missing state, unresolvable target).

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
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading a criterion block, then re-checking only its command-checkable half: it settled most phase criteria in two commands and kept the tooling-only ones honestly unverified (iteration 1)
- Reading the confidence chain end to end instead of only the changed branch: that is where the P1 surfaced (iteration 2)
- Reading installer syntax with bash -n and then only the verification path (iteration 2)
- Comparing a documented keyword list against the router programmatically instead of eyeballing it: it found eight drifted words and proved the other two rows clean (iteration 4)
- Reading the compiled fixture and its canary cases before its code: ten minutes settled coverage, reject semantics and the activation hash (iteration 6)

---

## 9. WHAT FAILED

- Treating the routing replay corpus as coverage for the scorer change: its decline rows avoid every task-intent verb, so no recorded row walks the staging path (iteration 2)
- Reading the `rg` exit status through a pipe in iteration 1, so clean results rested on empty output rather than on the status (iteration 1; later passes read the status)
- Any attempt to execute the scorer or the compiled harness inside this lineage: both write outside the write surface, so the P1 rests on a source read plus a named downgrade trigger (iterations 2 and 6)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `browser-debugger-cli@alpha` residue: no match outside changelog and benchmark reports, which 014's criterion excludes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `browser-debugger-cli@alpha` residue: no match outside changelog and benchmark reports, which 014's criterion excludes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `browser-debugger-cli@alpha` residue: no match outside changelog and benchmark reports, which 014's criterion excludes.

### `mcp-tooling` relocation residue: two distinct greps, no match. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `mcp-tooling` relocation residue: two distinct greps, no match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mcp-tooling` relocation residue: two distinct greps, no match.

### AC-003, AC-004, AC-006, AC-007, AC-011, AC-012, AC-014, AC-015, AC-016, AC-018, AC-019, AC-020: each re-checked above, each holding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: AC-003, AC-004, AC-006, AC-007, AC-011, AC-012, AC-014, AC-015, AC-016, AC-018, AC-019, AC-020: each re-checked above, each holding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: AC-003, AC-004, AC-006, AC-007, AC-011, AC-012, AC-014, AC-015, AC-016, AC-018, AC-019, AC-020: each re-checked above, each holding.

### Aside and Bladebro router documentation: both rows match their vocabulary classes exactly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Aside and Bladebro router documentation: both rows match their vocabulary classes exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Aside and Bladebro router documentation: both rows match their vocabulary classes exactly.

### Credential leakage in `.utcp_config.json`: every manual that matters here carries an empty `env` and a pinned package. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Credential leakage in `.utcp_config.json`: every manual that matters here carries an empty `env` and a pinned package.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Credential leakage in `.utcp_config.json`: every manual that matters here carries an empty `env` and a pinned package.

### Duplicated installer helper: guarded by a parity test, so not an unchecked maintenance liability. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Duplicated installer helper: guarded by a parity test, so not an unchecked maintenance liability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicated installer helper: guarded by a parity test, so not an unchecked maintenance liability.

### Hub mode-registry shape (three modes, kinds, no transport axis): checked directly, holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Hub mode-registry shape (three modes, kinds, no transport axis): checked directly, holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hub mode-registry shape (three modes, kinds, no transport axis): checked directly, holds.

### Installer parity (`_utils.sh`): byte-identical, so REQ-001's premise is met in the tree. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Installer parity (`_utils.sh`): byte-identical, so REQ-001's premise is met in the tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Installer parity (`_utils.sh`): byte-identical, so REQ-001's premise is met in the tree.

### Installer parity, pin and lifecycle-script gating: read at source, syntax-checked, and consistent with their acceptance criteria. No finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Installer parity, pin and lifecycle-script gating: read at source, syntax-checked, and consistent with their acceptance criteria. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Installer parity, pin and lifecycle-script gating: read at source, syntax-checked, and consistent with their acceptance criteria. No finding.

### Missing canary coverage for a mode or a decision kind: all three modes, a bundle, two defers and a reject are present. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Missing canary coverage for a mode or a decision kind: all three modes, a bundle, two defers and a reject are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing canary coverage for a mode or a decision kind: all three modes, a bundle, two defers and a reject are present.

### Packet version versus newest changelog entry: all four agree. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Packet version versus newest changelog entry: all four agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet version versus newest changelog entry: all four agree.

### Prompt-text reject on a word match: deliberately scoped to caller constraints and covered by a paired case. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Prompt-text reject on a word match: deliberately scoped to caller constraints and covered by a paired case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-text reject on a word match: deliberately scoped to caller constraints and covered by a paired case.

### Re-raising the deferred MBU-PB-04 row: the criteria that 014 and the parent goal set are scoped so that it does not block them, and it is disclosed in the replay report; it is listed as follow-up work in synthesis instead. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-raising the deferred MBU-PB-04 row: the criteria that 014 and the parent goal set are scoped so that it does not block them, and it is disclosed in the replay report; it is listed as follow-up work in synthesis instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-raising the deferred MBU-PB-04 row: the criteria that 014 and the parent goal set are scoped so that it does not block them, and it is disclosed in the replay report; it is listed as follow-up work in synthesis instead.

### Removing the bare `har` token: no `har` entry remains in the scorer modules, and the two replay rows that mention a HAR still pass through other evidence, so the removal did not strand them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Removing the bare `har` token: no `har` entry remains in the scorer modules, and the two replay rows that mention a HAR still pass through other evidence, so the removal did not strand them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing the bare `har` token: no `har` entry remains in the scorer modules, and the two replay rows that mention a HAR still pass through other evidence, so the removal did not strand them.

### REPL command injection through the Aside example: guarded at the splice, both characters that could break out are refused. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REPL command injection through the Aside example: guarded at the splice, both characters that could break out are refused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REPL command injection through the Aside example: guarded at the splice, both characters that could break out are refused.

### Shell injection through the Aside task example: bash array, no re-splitting. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Shell injection through the Aside task example: bash array, no re-splitting.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection through the Aside task example: bash array, no re-splitting.

### Silent vocabulary drift inside the compiled path: the class lookup fails closed. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Silent vocabulary drift inside the compiled path: the class lookup fails closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Silent vocabulary drift inside the compiled path: the class lookup fails closed.

### Stale activation manifest: its policy hash matches the serving policy the replay records. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Stale activation manifest: its policy hash matches the serving policy the replay records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale activation manifest: its policy hash matches the serving policy the replay records.

### Uncovered hub scripts in the mutation guard: manifest, hook route and discovery globs all name the hub. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Uncovered hub scripts in the mutation guard: manifest, hook route and discovery globs all name the hub.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Uncovered hub scripts in the mutation guard: manifest, hook route and discovery globs all name the hub.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Bare har token removal: no har entry remains in the scorer modules and the two replay rows that mention a HAR pass through other evidence (iteration 2)

- Hub mode-registry shape: three modes with the required kinds, no transport-axis key (iteration 1)
- mcp-tooling relocation residue: two greps, no match (iteration 1)
- Installer parity premise: both _utils.sh copies byte-identical (iteration 1)
- browser-debugger-cli@alpha residue: no match outside changelog and benchmark reports (iteration 1)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
The loop stopped at invocation 6 with `stuckRecovery`: two consecutive passes added no finding (ratios 1, 1, 1, 1, 0, 0) while the P1 remains. No further reading of this tree will change the picture; the next move belongs to the operator. Recommended: decide the scorer naming-anchor rule first (`PI2-I2-P1-001`), then land the four row-level P2s in one pass. See `review-report.md` §4 for the order.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior packet continuity (goal.md, spec.md, `review/review-report.md` of the 2026-11-24 run) names the claimed state: all 14 phases Complete, seven parent goal criteria hold, 014 fixed every deep review finding at its source, and a follow-up review runs after the 014 commit.

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
| `spec_code` | core | partial | 2 | 014 scorer contract not fully met: a bare hint satisfies the naming test | Hub registry matches the 002 criteria: three modes, required kinds |
| `checklist_evidence` | core | partial | 1 | Two ticked criteria unevidenced in the tree: parent 014 progress row, research lane row |
| `skill_agent` | overlay | pass | 2 | Hub SKILL.md and ROUTER.md state the own-Chrome rule the router applies |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | pass | 1 | Catalog tree present for every mode |
| `playbook_capability` | overlay | pass | 1 | Three playbook roots with recorded runs dated after 005 |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Scope discovery bound 507 files in `review-scope-files.txt`. Coverage is tracked by group: packet docs (parent + 14 phases), hub skill root, the three mode packets, advisor runtime (scorer, baselines, tests), doctor scripts, git hooks, changelogs and benchmark reports.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md (parent) | D3 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md | D3 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| .skilled/skills/mcp-browser-use/mode-registry.json | D3 | 1 | clean | complete |
| .skilled/skills/mcp-tooling/mode-registry.json | D3 | 1 | clean | complete |
| .skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh | D3, D1 | 2 | clean | complete |
| .skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh, doctor.sh | D1 | 2 | clean | complete |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/{fusion.ts,scoring-constants.ts,lanes/lexical.ts} | D1 | 2 | 1 P1, 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10 (severity-weighted new-findings ratio)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-2-1795504079797-ay97sx, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T08:08:00Z
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
