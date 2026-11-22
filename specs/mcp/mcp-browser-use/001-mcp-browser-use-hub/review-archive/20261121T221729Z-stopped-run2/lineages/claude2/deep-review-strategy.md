# Deep Review Strategy - claude2 lineage

Lineage claude2 of the fan-out review of the browser-use hub packet.

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
Review: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (spec-folder). Focus: the 8 commits main..HEAD that build the browser-use parent hub (hub scaffold, Chrome DevTools + Aside relocation, Bladebro mode, advisor routing at both stages, nested sub-track support in system-spec-kit, end-to-end verification). Pure renames of moved spec packets are out of scope.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Pure renames of moved spec packets (git R100 moves).
- Fixing anything: review only.
- Live browser behaviour (no browser launched).

---

## 5. STOP CONDITIONS
- stopPolicy=max-iterations: run all 5 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Probing the live router in-process via harness loadSnapshot()+evaluateRoute with crafted prompts turned scoring doubts into confirmed cases (iteration 1)
- Reading the lane rule against the same file's R-SEC rules and the registered .utcp manual exposed the npx contradiction (iteration 2)
---

## 9. WHAT FAILED

- Running skill_advisor.py with a bare prompt did not yield parseable JSON; stage-one runtime probing deferred (iteration 1)
- Nothing blocked in iteration 2 (iteration 2)
---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Discovery-only classes leaking into mode scoring: ruled out, `browser automation for this site` defers via the canary case and no routerSignal references the discovery classes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Discovery-only classes leaking into mode scoring: ruled out, `browser automation for this site` defers via the canary case and no routerSignal references the discovery classes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Discovery-only classes leaking into mode scoring: ruled out, `browser automation for this site` defers via the canary case and no routerSignal references the discovery classes.

### Mutation-class guard missing the new hub path: ruled out, hook, guard and manifest updated together and the guard passes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Mutation-class guard missing the new hub path: ruled out, hook, guard and manifest updated together and the guard passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mutation-class guard missing the new hub path: ruled out, hook, guard and manifest updated together and the guard passes.

### Secrets in committed benchmark reports: ruled out by pattern scan (cookie/token/password/bearer/email). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secrets in committed benchmark reports: ruled out by pattern scan (cookie/token/password/bearer/email).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets in committed benchmark reports: ruled out by pattern scan (cookie/token/password/bearer/email).

### Stale compiled policy: ruled out, hash recomputed and matches the manifest. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stale compiled policy: ruled out, hash recomputed and matches the manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale compiled policy: ruled out, hash recomputed and matches the manifest.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Stale compiled policy: hash recomputed equals live manifest (iteration 1, evidence: compiled-route-guard.cjs exit 0)
- Secrets in committed benchmark reports: pattern scan clean (iteration 2, evidence: rg over mcp-browser-use benchmark reports)
- Mutation-class guard gap for the new hub path: guard passes and test reads hook regex (iteration 2, evidence: check-mcp-mutation-class.sh exit 0)
---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: traceability - Focus area: packet docs (spec.md, goal.md, decision-record.md, phase 002-006 spec/tasks/implementation-summary/acceptance-criteria) against the shipped hub; SKILL.md/ROUTER.md/README of the hub; graph-metadata.json and description.json; feature catalog and playbook wiring; stale "not run on this host" claims - Reason: the verification phase claims alignment findings were closed; check that claim against files - Rotation status: correctness (1), security (2) done; traceability, maintainability remain - Required evidence: file:line on both sides of each mismatch Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
No prior review of this packet. The 006-verification phase claims alignment findings were closed in commit c7f38f295d2.

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
277 files in review-scope-files.txt; per-file state tracked in iteration narratives.
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-claude2-1795298930568-k8qdqy, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-21T22:10:27.093Z
<!-- MACHINE-OWNED: END -->

---

