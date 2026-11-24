---
title: Deep Review Strategy - mcp-browser-use hub (claude2 lineage)
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
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
Review: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (spec-folder). Operator focus: the 8 commits main..HEAD that build the browser-use parent hub (hub scaffold, Chrome DevTools + Aside relocation, Bladebro mode, two-stage advisor routing, nested sub-track support in system-spec-kit, end-to-end verification). Pure renames of moved spec packets are out of scope; edited and added files only. Scope: 277 files pre-bound from review-scope-files.txt.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Pure R100 renames of moved spec packets.
- Modifying any reviewed file (read-only review).
- Running repo tooling that writes outside the lineage directory.

---

## 5. STOP CONDITIONS
- stopPolicy=max-iterations: run exactly 5 iterations; convergence is telemetry only.
- Terminal synthesis carries stopReason maxIterationsReached.

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
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Live resolver probes (`resolve.cjs --hub mcp-browser-use --prompt ...`) turned vocabulary hypotheses into confirmed findings in one call each (iteration 1)
- Diffing the new hub's compiler/router against the 003-mcp-tooling sibling isolated exactly what changed (iteration 1)
- Merge-base diffs (`main...HEAD`) plus running the mutation-class guard settled installer-move coverage quickly (iteration 2)
- Reading 005 Known Limitations against hub-router.json notes and parent status rows surfaced status drift and contradicted design notes (iteration 3)
- Grepping the shared constant and predicate across every spec-kit tool exposed the duplicated invariant in one call (iteration 4)
- Re-running the P1 probe through the documented front door compiled-route.cjs confirmed it holds on the real caller path (iteration 5)

---

## 9. WHAT FAILED
- Nothing failed in iteration 1; compiled-route-sync.cjs (1164 lines, 1-line diff) left unread as low-yield (iteration 1)
- Two-dot `main..HEAD` diffs are misleading on this branch: they show main's newer doctor/overlay commits as reversions; use the merge base (iteration 2)
- feature_catalog_code overlay not run in iteration 3 (budget); carry to iteration 5 (iteration 3)
- Running nested-subtrack.vitest.ts was not possible inside the lineage write limit; relied on reading (iteration 4)
- Advisor CLI not run (daemon writes outside the lineage); stage-one evidence rests on diffs and 005 replays (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A browser alias stranded on `mcp-tooling` at stage one: none in the diffs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A browser alias stranded on `mcp-tooling` at stage one: none in the diffs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A browser alias stranded on `mcp-tooling` at stage one: none in the diffs.

### Catalog entry citing missing files: all cited files exist. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Catalog entry citing missing files: all cited files exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catalog entry citing missing files: all cited files exist.

### Gold-tuning without an operator decision: MT-H04 change is operator-approved and documented. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Gold-tuning without an operator decision: MT-H04 change is operator-approved and documented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Gold-tuning without an operator decision: MT-H04 change is operator-approved and documented.

### Manifest identity drift: resolved policy hash and generation equal the manifest's selectedPolicy. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Manifest identity drift: resolved policy hash and generation equal the manifest's selectedPolicy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Manifest identity drift: resolved policy hash and generation equal the manifest's selectedPolicy.

### Missing acceptance evidence in 003: every row cites observed output. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Missing acceptance evidence in 003: every row cites observed output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing acceptance evidence in 003: every row cites observed output.

### Missing-mode crash in `route()`: every routerSignals mode exists in mode-registry destinations (compiler fails closed otherwise). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing-mode crash in `route()`: every routerSignals mode exists in mode-registry destinations (compiler fails closed otherwise).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing-mode crash in `route()`: every routerSignals mode exists in mode-registry destinations (compiler fails closed otherwise).

### Mixed-track check gap at level 2: intentional and documented. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Mixed-track check gap at level 2: intentional and documented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mixed-track check gap at level 2: intentional and documented.

### New mutating script without a manifest row: none; guard passes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: New mutating script without a manifest row: none; guard passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New mutating script without a manifest row: none; guard passes.

### Pre-commit/guard pattern drift after the move: all three copies of the pattern match. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Pre-commit/guard pattern drift after the move: all three copies of the pattern match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pre-commit/guard pattern drift after the move: all three copies of the pattern match.

### Working-tree vs commit parity drift for depth > 2: both emit `NESTED_TOO_DEEP` only for declared folders. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Working-tree vs commit parity drift for depth > 2: both emit `NESTED_TOO_DEEP` only for declared folders.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Working-tree vs commit parity drift for depth > 2: both emit `NESTED_TOO_DEEP` only for declared folders.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Manifest identity drift for mcp-browser-use: served hash equals selectedPolicy (iteration 1, evidence: activation/mcp-browser-use/manifest.json)
- Missing-mode crash in router route(): compiler fails closed (iteration 1, evidence: registry-compiler.cjs ROUTER_SIGNAL_MISSING)
- Pre-commit / mutation-class guard drift after the mode move: guard passes, patterns aligned (iteration 2)
- Cookie/credential leakage in the Bladebro live benchmark: redacted (iteration 2)
- MT-H04 gold change: operator-approved in 006 decision-record (iteration 3)
- Hub metadata drift between registry/router/leaf manifest: consistent (iteration 3)
- Working-tree vs commit reader parity past depth 2: consistent (iteration 4)
- Stage-one browser alias stranded on mcp-tooling: none (iteration 5)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (max iterations reached, synthesis next) - Focus area: synthesis. Carry forward C2-I1-P1-001 as the one active required fix. - Reason: stopPolicy max-iterations, 5 of 5 complete. - Rotation status: all four dimensions covered, plus one cross-reference pass. - Verdict basis: C2-I1-P1-001 remains active. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate. Prior context: packet decision-record.md and 006-verification/decision-record.md describe the end-to-end verification; review-archive/ holds an earlier review that is not read as evidence here.

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
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-claude2-1795300286921-qfagh7, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-21T22:32:22Z
<!-- MACHINE-OWNED: END -->

---
