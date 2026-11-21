# Deep Review Strategy - opus-medium lineage

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
Review: specs/system-skilled-doctor/007-overlay-framework-root-layout (spec-folder). Focus: the overlay framework/root layout change end to end, Skilled 57c01fb4c11..d42bafc890c (merged 063daaee2c1, plus 1653734af7d, 10c36989450) and ai-speckit 64cfee51628..ad3246feba2. Frontier nodes owned: F-1-002 (engine sibling overlay folder + path safety), F-1-004 (docs vs code), F-1-006 (Barter relayout/move to overlays/), F-1-008 (packet traceability).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing anything (read-only review).
- Unrelated Skilled subsystems outside the overlay engine, doctor overlay docs, overlay-guard hook, Barter overlay layout and this packet.

---

## 5. STOP CONDITIONS
- Legal convergence, or 24 iterations.
- Every owned frontier node reviewed across the four dimensions.

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
- P1 (Required): 0
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Comparing how Skilled's guard and Barter's hooks locate the folder (iteration 14)
- Grepping for the one predicate the phase-001 bug class depends on (iteration 13)
- Following a regression the close-out record names back to the test that should have caught it (iteration 12)
- Resolving each runtime copy of a hook to its realpath before judging root detection (iteration 7)
- Reading the workflow YAML as the agent would execute it (iteration 6)
- Tracing every overlay-folder write back to resolveOverlayDir (iteration 5)
- Checking each AC status cell against its own Then clause and the legend (iteration 4)
- rg for the old folder name, filtering spec-track and index hits (iteration 3)
- Mapping each release-note bullet to its engine line (iteration 2)
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### .index/*.json hits: generated retrieval index content from spec paths. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .index/*.json hits: generated retrieval index content from spec paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .index/*.json hits: generated retrieval index content from spec paths.

### `specs/skilled-barter-overlays/` hits: a spec track name, not the folder. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `specs/skilled-barter-overlays/` hits: a spec track name, not the folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `specs/skilled-barter-overlays/` hits: a spec track name, not the folder.

### A second, divergent definition of the layout rule in the docs: every doc restates the adoptSource rule. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: A second, divergent definition of the layout rule in the docs: every doc restates the adoptSource rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second, divergent definition of the layout rule in the docs: every doc restates the adoptSource rule.

### Close-out commit list mismatch with git history. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Close-out commit list mismatch with git history.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Close-out commit list mismatch with git history.

### Duplicate layout rules: layoutMoves, adopt and relayout all call adoptSource, so the framework/root rule has one definition. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Duplicate layout rules: layoutMoves, adopt and relayout all call adoptSource, so the framework/root rule has one definition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate layout rules: layoutMoves, adopt and relayout all call adoptSource, so the framework/root rule has one definition.

### Engine paths still keyed tree-relative against the overlay folder: grep for relativeKey/relative(root, overlayRoot|manifestPath|statePath|lockPath) finds only :503 (display), :4588 (in-tree branch only), :5813 (guarded by the sibling branch) and :6382 (in-tree branch only). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Engine paths still keyed tree-relative against the overlay folder: grep for relativeKey/relative(root, overlayRoot|manifestPath|statePath|lockPath) finds only :503 (display), :4588 (in-tree branch only), :5813 (guarded by the sibling branch) and :6382 (in-tree branch only).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Engine paths still keyed tree-relative against the overlay folder: grep for relativeKey/relative(root, overlayRoot|manifestPath|statePath|lockPath) finds only :503 (display), :4588 (in-tree branch only), :5813 (guarded by the sibling branch) and :6382 (in-tree branch only).

### Fixture leakage between parallel sibling runs. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Fixture leakage between parallel sibling runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixture leakage between parallel sibling runs.

### Guard bypass by writing through the sibling folder into the tree: candidates are canonicalized before the containment test (:4131, :5531). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Guard bypass by writing through the sibling folder into the tree: candidates are canonicalized before the containment test (:4131, :5531).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Guard bypass by writing through the sibling folder into the tree: candidates are canonicalized before the containment test (:4131, :5531).

### Missing createdDirs for the overlay area in rollback: ruled out as above. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing createdDirs for the overlay area in rollback: ruled out as above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing createdDirs for the overlay area in rollback: ruled out as above.

### Old folder path in Barter docs. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Old folder path in Barter docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Old folder path in Barter docs.

### Phase 002 negative control overstated: the summary's 245/238/7 numbers match the capture. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Phase 002 negative control overstated: the summary's 245/238/7 numbers match the capture.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 002 negative control overstated: the summary's 245/238/7 numbers match the capture.

### Pin mismatch between the packet and the Barter manifest: ruled out by rev-parse. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Pin mismatch between the packet and the Barter manifest: ruled out by rev-parse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pin mismatch between the packet and the Barter manifest: ruled out by rev-parse.

### Playbook scenario registered in the index but missing from the leaf manifests: both manifests list it. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Playbook scenario registered in the index but missing from the leaf manifests: both manifests list it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Playbook scenario registered in the index but missing from the leaf manifests: both manifests list it.

### Raising any P2 to P1: no finding names an in-contract input or a real caller that fails today. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Raising any P2 to P1: no finding names an in-contract input or a real caller that fails today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising any P2 to P1: no finding names an in-contract input or a real caller that fails today.

### Relayout overwriting when two off-layout sources map to the same layout path: refused by the claimed map (:6158-6161). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Relayout overwriting when two off-layout sources map to the same layout path: refused by the claimed map (:6158-6161).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relayout overwriting when two off-layout sources map to the same layout path: refused by the claimed map (:6158-6161).

### Run-id traversal reaching a write: the engine refuses before any read or write (:5340). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Run-id traversal reaching a write: the engine refuses before any read or write (:5340).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Run-id traversal reaching a write: the engine refuses before any read or write (:5340).

### Runtime copies of the git-write gate computing the wrong root from their own path: the four runtime hook copies are links, and the .vibe copy is an adapter that imports the .skilled core. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Runtime copies of the git-write gate computing the wrong root from their own path: the four runtime hook copies are links, and the .vibe copy is an adapter that imports the .skilled core.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime copies of the git-write gate computing the wrong root from their own path: the four runtime hook copies are links, and the .vibe copy is an adapter that imports the .skilled core.

### Secret leakage through the scratch run captures. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Secret leakage through the scratch run captures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret leakage through the scratch run captures.

### SKD-013 grep miscount: ruled out, JSON output is indented. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: SKD-013 grep miscount: ruled out, JSON output is indented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SKD-013 grep miscount: ruled out, JSON output is indented.

### Sources left on the old layout: ruled out, zero sources outside framework/ and root/. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Sources left on the old layout: ruled out, zero sources outside framework/ and root/.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sources left on the old layout: ruled out, zero sources outside framework/ and root/.

### Status or capture printing a tree-relative path for a sibling source. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Status or capture printing a tree-relative path for a sibling source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Status or capture printing a tree-relative path for a sibling source.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Close-out commit list mismatch (iteration 12)
- Phase 002 negative control overstated: numbers match (iteration 9)
- Secret leakage in packet evidence (iteration 8)
- Vibe gate copy wrong root depth: it imports the core (iteration 7)
- Rollback run-id traversal reaching a write (iteration 6)
- Guard bypass through the sibling folder: canonical match (iteration 5)
- Barter pin mismatch: equal to 063daaee2c1 (iteration 4)
- specs/skilled-barter-overlays hits are a track name (iteration 3)
- Barter guard blocking every edit: adapter is fail-open (iteration 3)
- SKD-013 grep miscount: status --json is indented (iteration 2)
- Relayout overwrite on shared target: claimed map refuses it (iteration 2)
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: none outstanding - Reason: recovery pass found no new issue; synthesis when convergence allows Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Target pointers: .skilled/commands/doctor/scripts/overlay-engine.cjs, .skilled/commands/doctor/scripts/tests, .skilled/hooks/overlay-guard, .skilled/commands/doctor docs, .skilled/skills/system-skilled-doctor, barter/ai-speckit (nested repo), packet 007 child phases 001-005.
- resource-map.md not present; skipping coverage gate.

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
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 24
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-opus-medium-1795182837437-sws2tv, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-20T13:55:22.121Z
<!-- MACHINE-OWNED: END -->

