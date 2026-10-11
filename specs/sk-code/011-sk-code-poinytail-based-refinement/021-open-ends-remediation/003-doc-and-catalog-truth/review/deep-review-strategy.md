# Deep Review Strategy - Doc and Catalog Truth

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
The ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde: the frontmatter-version engine, packager and post-edit router now treat only SKILL.md as a versioned doc; the version line was dropped from 2,845 child docs; the versioning standard and templates were rewritten; the catalog validator checks two-column File tables; the citation scanner resolves skill runtime/ and scripts/ paths and prints an overlap advisory; the playbook validator reports unresolved backticked paths and keeps its whole report when piped; stale anchors and paths in playbooks and catalogs were corrected; five skills were bumped

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- DV-R5, DV-R7, PC-R1, PC-R2 and PC-R8 to PC-R10: closed in the research, not built here.
- The two other open-ends remediation phases built in other worktrees, and the release notes file v4.0.0.4.md.
- The roughly 5,400 historical citations from specs/ into stripped child docs: dated records, left as they are.
- The engine's option parsing in frontmatter-version.mjs, which another phase edits.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: run all 5 iterations; convergence is telemetry only.

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
- P2 (Suggestions): 8
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
### agent_cross_runtime: the Claude hook and OpenCode plugin share one router; the spawn policy is runtime-neutral argv arrays, unchanged by the scope narrowing. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: agent_cross_runtime: the Claude hook and OpenCode plugin share one router; the spawn policy is runtime-neutral argv arrays, unchanged by the scope narrowing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: the Claude hook and OpenCode plugin share one router; the spawn policy is runtime-neutral argv arrays, unchanged by the scope narrowing.

### checklist_evidence: the change set's verification claims reproduced by command output in this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence: the change set's verification claims reproduced by command output in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: the change set's verification claims reproduced by command output in this iteration.

### checklist_evidence: the security evidence above was reproduced by command output in this iteration (diff read, numstat arithmetic, spawn-site reads); no checklist tick is claimed from iteration 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence: the security evidence above was reproduced by command output in this iteration (diff read, numstat arithmetic, spawn-site reads); no checklist tick is claimed from iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: the security evidence above was reproduced by command output in this iteration (diff read, numstat arithmetic, spawn-site reads); no checklist tick is claimed from iteration 1.

### feature_catalog_code: the catalog validator's docstring contract for path extraction matches the observed behavior of `_extract_checkable_path` and its call site. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: feature_catalog_code: the catalog validator's docstring contract for path extraction matches the observed behavior of `_extract_checkable_path` and its call site.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: the catalog validator's docstring contract for path extraction matches the observed behavior of `_extract_checkable_path` and its call site.

### playbook_capability: the backtick check emits warning-level issues only, so the strict exit-code path is unchanged in meaning; the `process.exitCode` fix preserves the report when piped. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: playbook_capability: the backtick check emits warning-level issues only, so the strict exit-code path is unchanged in meaning; the `process.exitCode` fix preserves the report when piped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: the backtick check emits warning-level issues only, so the strict exit-code path is unchanged in meaning; the `process.exitCode` fix preserves the report when piped.

### skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability: see traceabilityChecks in the iteration record; template and README gaps recorded as R1-P2-001/002. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability: see traceabilityChecks in the iteration record; template and README gaps recorded as R1-P2-001/002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability: see traceabilityChecks in the iteration record; template and README gaps recorded as R1-P2-001/002.

### skill_agent: the router's fail-open contract (never blocks the observed edit, never writes to stdout/stderr) is intact at the changed predicate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: skill_agent: the router's fail-open contract (never blocks the observed edit, never writes to stdout/stderr) is intact at the changed predicate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: the router's fail-open contract (never blocks the observed edit, never writes to stdout/stderr) is intact at the changed predicate.

### spec_code: engine scope and anchor rule match the rewritten standard; verify/gate green over the full SKILL.md population. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code: engine scope and anchor rule match the rewritten standard; verify/gate green over the full SKILL.md population.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: engine scope and anchor rule match the rewritten standard; verify/gate green over the full SKILL.md population.

### spec_code: the engine's narrowed scope (SKILL.md only) matches the rewritten standard's document classes and the gate description [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:81]; the router mirror states the same rule [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code: the engine's narrowed scope (SKILL.md only) matches the rewritten standard's document classes and the gate description [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:81]; the router mirror states the same rule [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: the engine's narrowed scope (SKILL.md only) matches the rewritten standard's document classes and the gate description [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:81]; the router mirror states the same rule [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:131].

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
- comment_hygiene on the six changed scripts: no artifact ids or spec paths in comments (iteration 4, evidence: rg over the changed scripts)
- two-column catalog path checking: walker guard plus min_cells=2 call are correct and regression-tested (iteration 4, evidence: validate_catalog_package.py:310, test_validate_catalog_package.py:179-191)
- versioned-doc membership divergence: documented split at standard line 32 and DV-R7; remaining template gap tracked as R1-P2-001 (iteration 4, evidence: frontmatter-versioning.md:32, spec.md:134)
- test coverage of the new behaviors: each changed behavior has a named regression test (iteration 4, evidence: test-frontmatter-version.mjs:96, validate-playbook-package.test.cjs:283, test-cite-drift-scan.mjs:448)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Source research: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/research.md (DV-R1 to R4, R6 built) and 003-playbook-catalog-truth/research/research.md (PC-R3 to R7 built).
- Commit range: 0039903bde..HEAD on worktrees/114-rem-doc-catalog-truth. The version-line strip (31888d05bb) touched 2,845 child docs mechanically; review it by sampling and by the verify/gate/package numbers, not file by file.
- Before: frontmatter-version verify exit 1 on 14/14 skills; after: exit 0 on 14/14; gate and package_skill --check --strict exit 0 on 14/14 before and after.
- computeForFile's child-doc W branch is now unreachable; it was left in place on purpose because another phase owns that file's option parsing.
- The playbook backtick check is report-only (warning BACKTICK_PATH_UNRESOLVED, about 225 live warnings); the citation overlap advisory is opt-in (--overlap).

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
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | none | 0 | 0 | pending |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py` | none | 0 | 0 | pending |
| `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/scripts/tests/test_validate_catalog_package.py` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md` | none | 0 | 0 | pending |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md` | none | 0 | 0 | pending |
| `.skilled/skills/sk-doc/changelog/v2.3.5.0.md` | none | 0 | 0 | pending |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/spec.md` | none | 0 | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-021-003-doc-catalog-truth-20261011T195710Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-11T19:57:10Z
- Stop policy: max-iterations
<!-- MACHINE-OWNED: END -->

---
