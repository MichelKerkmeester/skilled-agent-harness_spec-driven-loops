# Deep Review Strategy

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
Double-check the staged (uncommitted) rename in this worktree of sk-code-opencode to sk-code-skilled, code-opencode to code-skilled, and the sk-code surface id OPENCODE to SKILLED. Verify against `git diff --cached HEAD`: (1) no OpenCode runtime name was rewritten (.opencode/, cli-opencode, the opencode binary, the runtime id OPENCODE outside the sk-code hub); (2) no live reference to the old identity remains outside the documented exclusions (this packet's docs, .jsonl/.out/.err/.log machine records in specs/, benchmark JSON reports, OPENCODE in spec history); (3) hub routing (mode-registry.json, hub-router.json, graph-metadata.json, leaf-manifest.json, SKILL.md, ROUTER.md), the advisor plugin surface detection, doctor pins, tests and fixtures are mutually consistent; (4) renamed spec folders have consistent description.json/graph-metadata.json identity and no broken relative links; (5) the changelog symlink and hermes mirror are correct. Report P0/P1/P2 findings with path:line evidence.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing findings: the review target is read-only.
- Re-deriving the rename plan: phase 001 research owns it.
- Behavior of the sk-code surface beyond its name.

---

## 5. STOP CONDITIONS
- Stop policy `max-iterations`: run all 3 iterations; convergence is telemetry only.
- Any P0 found is recorded, not fixed.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
Iteration 002 (security): staged-diff added-line scan plus live-tree walks separated runtime-name preservation from surface-identity residuals; symlink readlink/existence and JSON+link validation on 32 renamed spec metadata files were decisive.

---

## 9. WHAT FAILED
None yet.

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
- Runtime-name rewrite (.opencode/, cli-opencode, opencode binary): ruled out - 16 added .opencode/ refs, zero cli-skilled, OPENCODE only in runtime contexts.
- Changelog symlink / hermes mirror drift: ruled out - code-skilled symlink resolves; mirror regenerated with canonical-source banner.
- Renamed spec-folder metadata identity/links: ruled out - 32 files valid, 0 old tokens, 0 missing links.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
maintainability

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Rename plan and safe patterns: `specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/research.md` (§4 patterns, §6 order).
- Implementation and gate evidence: `002-skill-and-routing-rename/implementation-summary.md`, `scratch/baseline/` and `scratch/after/` logs; `003-markdown-reference-sweep/implementation-summary.md`.
- Operator decisions (2026-10-18): rename history too except machine records; rename spec folders; rename surface id OPENCODE to SKILLED inside the sk-code hub.
- Full scope list: `review/scope-files.txt` (278 paths: live changed files outside specs/ plus renamed spec packets' metadata).
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: the staged diff (`git diff --cached HEAD`), `review/scope-files.txt`.
- Behavior claims: phase 002 REQ-001..REQ-005 and phase 003 REQ-001..REQ-003.
- Reuse and conventions: identity patterns require `code` directly before `opencode`; generated artifacts rebuilt by their own tools.
- Review risks and gaps: 2,830-file diff is too large to read whole; sample with `rg` and targeted reads.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
Pending.

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
First 40 of 278 scope paths; full list in `review/scope-files.txt`.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .hermes/skills/sk-code-obsidian/SKILL.md | - | - | - | pending |
| .hermes/skills/sk-code-quality/SKILL.md | - | - | - | pending |
| .hermes/skills/sk-code-review/SKILL.md | - | - | - | pending |
| .hermes/skills/sk-code-skilled/SKILL.md | - | - | - | pending |
| .hermes/skills/sk-code-webflow/SKILL.md | - | - | - | pending |
| .hermes/skills/sk-code/SKILL.md | - | - | - | pending |
| .hermes/skills/system-spec-kit/SKILL.md | - | - | - | pending |
| .opencode/plugins/system-skill-advisor.js | - | - | - | pending |
| .pi/extensions/README.md | - | - | - | pending |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json | - | - | - | pending |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json | - | - | - | pending |
| .skilled/bin/tests/compiled-route-surface-hint.test.cjs | - | - | - | pending |
| .skilled/changelog/sk-code/code-skilled | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.1.2.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.0.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.0.0.10.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.0.0.6.md | - | - | - | pending |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/sk-code-setup-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs | - | - | - | pending |
| .skilled/commands/speckit/assets/speckit-complete.yaml | - | - | - | pending |
| .skilled/hooks/goal/README.md | - | - | - | pending |
| .skilled/hooks/goal/goal-plugin.md | - | - | - | pending |
| .skilled/skills/README.txt | - | - | - | pending |
| .skilled/skills/sk-code/README.md | - | - | - | pending |
| .skilled/skills/sk-code/ROUTER.md | - | - | - | pending |
| .skilled/skills/sk-code/SKILL.md | - | - | - | pending |
| .skilled/skills/sk-code/benchmark/README.md | - | - | - | pending |
| .skilled/skills/sk-code/changelog/v1.4.0.0.md | - | - | - | pending |
| .skilled/skills/sk-code/changelog/v2.1.0.0.md | - | - | - | pending |
| .skilled/skills/sk-code/changelog/v2.2.4.0.md | - | - | - | pending |
| .skilled/skills/sk-code/changelog/v2.2.5.0.md | - | - | - | pending |
| .skilled/skills/sk-code/description.json | - | - | - | pending |
| .skilled/skills/sk-code/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md | - | - | - | pending |
| .skilled/skills/sk-code/graph-metadata.json | - | - | - | pending |
| .skilled/skills/sk-code/hub-router.json | - | - | - | pending |
| .skilled/skills/sk-code/leaf-manifest.json | - | - | - | pending |
| .skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-18T20:00:06Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-18T20:00:07.159Z
- Stop policy: max-iterations
- Dimension queue: correctness → security → traceability → maintainability
<!-- MACHINE-OWNED: END -->

---
