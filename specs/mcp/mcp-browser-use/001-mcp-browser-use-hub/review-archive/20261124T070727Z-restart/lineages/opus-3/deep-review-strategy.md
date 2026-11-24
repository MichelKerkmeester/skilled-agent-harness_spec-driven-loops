---
title: "Deep Review Strategy: mcp-browser-use hub (lineage opus-3)"
description: "Lineage opus-3 strategy for the fan-out deep review of the mcp-browser-use hub epic."
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
Review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder, phases 001-013) and the 470 shipped files in `review-scope-files.txt`. Operator focus: every phase's shipped work against its goal criteria.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not re-running live browser sessions (Bladebro, Aside, bdg): recorded runs are checked as evidence only.
- Not judging the other six mcp-tooling modes beyond D3 (unchanged) and 010's pointer edits.
- No fixes: findings only.

---

## 5. STOP CONDITIONS
- maxIterations=7 reached.
- All four dimensions covered, core protocols spec_code and checklist_evidence recorded, and the convergence script returns STOP.

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
- P1 (Required): 2
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Re-running each phase goal criterion as its literal command against the current tree: surfaced the 013-induced installer-test regression (iteration 1)
- Comparing the safety-rule block against the rest of the same SKILL.md, not only against the spec: verbatim parity hid a lane-rule contradiction (iteration 2)
- Rerunning later-phase goal commands verbatim: confirmed 006-010/013 and exposed one non-durable count criterion (iteration 3)
- Reading the last phase's commit file list against packet changelogs: found unreleased script changes (iteration 4)
- Replaying recorded acceptance prompts, then near-paraphrases: shows evidence holds only on tuned strings (iteration 5)
- Tabulating open boxes vs status across all phases, then replaying the outlier's own evidence file live (iteration 6)
- Following a routing leak to its highest-impact mode and checking the packet gate after routing (iteration 7)

---

## 9. WHAT FAILED

- Trusting the ticked goal boxes: 005 c1 is ticked against its own evidence and 003/004 are unticked though Complete (iteration 1)
- Pattern scan for secrets and debug-port exposure: clean, low yield (iteration 2)
- Phase criteria gated on validate.sh --recursive cannot be re-run inside the lineage contract (iteration 3)
- Version-match checks (parent-skill-check 13d) cannot detect an edited-in-place release note (iteration 4)
- None new (iteration 5)
- checklist_evidence cannot reach pass while goal state contradicts phase state (iteration 6)
- None new (iteration 7)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `eval "$op"` in `mcp-chrome-devtools/references/session-management.md:653`: a doc helper whose operations are caller-supplied literals; no untrusted input path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `eval "$op"` in `mcp-chrome-devtools/references/session-management.md:653`: a doc helper whose operations are caller-supplied literals; no untrusted input path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `eval "$op"` in `mcp-chrome-devtools/references/session-management.md:653`: a doc helper whose operations are caller-supplied literals; no untrusted input path.

### A route-to-real-browser escalation: routing selects a packet, and the packet's R-SEC-1 gate is independent of how the request arrived. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A route-to-real-browser escalation: routing selects a packet, and the packet's R-SEC-1 gate is independent of how the request arrived.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A route-to-real-browser escalation: routing selects a packet, and the packet's R-SEC-1 gate is independent of how the request arrived.

### Advisor drift since 006 on the recorded corpus: confidences are identical to the recorded values (0.8255, 0.8299/0.8298, 0.9161). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Advisor drift since 006 on the recorded corpus: confidences are identical to the recorded values (0.8255, 0.8299/0.8298, 0.9161).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Advisor drift since 006 on the recorded corpus: confidences are identical to the recorded values (0.8255, 0.8299/0.8298, 0.9161).

### Aside `curl | bash`: official, operator-gated installer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Aside `curl | bash`: official, operator-gated installer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Aside `curl | bash`: official, operator-gated installer.

### Browser mode ids in mcp-tooling's own six root files: none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Browser mode ids in mcp-tooling's own six root files: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Browser mode ids in mcp-tooling's own six root files: none.

### Duplicate changelog trees: the `.skilled/changelog/mcp-browser-use/*` entries are symlinks. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Duplicate changelog trees: the `.skilled/changelog/mcp-browser-use/*` entries are symlinks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate changelog trees: the `.skilled/changelog/mcp-browser-use/*` entries are symlinks.

### Recorded-run tallies disagreeing with goal claims: Bladebro 4/1 and Aside 10/5 match exactly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Recorded-run tallies disagreeing with goal claims: Bladebro 4/1 and Aside 10/5 match exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recorded-run tallies disagreeing with goal claims: Bladebro 4/1 and Aside 10/5 match exactly.

### Regression of the out-of-domain leak since 005: the hit set and confidences match the recorded file. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Regression of the out-of-domain leak since 005: the hit set and confidences match the recorded file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regression of the out-of-domain leak since 005: the hit set and confidences match the recorded file.

### Remaining positional-JSON `bdg cdp` calls in the hub or in sk-code, mcp-tooling, mcp-code-mode: none. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Remaining positional-JSON `bdg cdp` calls in the hub or in sk-code, mcp-tooling, mcp-code-mode: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Remaining positional-JSON `bdg cdp` calls in the hub or in sk-code, mcp-tooling, mcp-code-mode: none.

### Stale `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` paths under `.skilled` outside changelog/benchmark reports: none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stale `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` paths under `.skilled` outside changelog/benchmark reports: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` paths under `.skilled` outside changelog/benchmark reports: none.

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
- Dimension: none (iteration cap reached). Synthesis follows. - Focus area: synthesis. Carry R1-P1-001 and R2-P1-001 as the release blockers for CONDITIONAL. - Reason: max iterations. - Rotation status: all four dimensions covered; correctness and traceability twice, security twice. - Required evidence: none.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Parent `goal.md` claims all seven completion criteria checked; `spec.md` metadata says 005 is Partial with REQ-003/008/009 not met as written.
- Prior generation (archived under `review-archive/20261124T044326Z-restart/`) exists; this lineage does not inherit its findings.
- resource-map.md not present; skipping coverage gate.

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
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-opus-3-1795495435655-lf6jf3, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-24T04:46:07.987Z
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
