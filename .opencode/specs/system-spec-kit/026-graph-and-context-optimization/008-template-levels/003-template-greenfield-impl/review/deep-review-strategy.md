# Deep Review Strategy - 003-template-greenfield-impl

## 1. OVERVIEW

### Purpose
Run /spec_kit:deep-review:auto for the pinned phase child with review focus on implementation code, not docs-only cross-references.

### Command Invocation
`/spec_kit:deep-review:auto /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl --max-iterations=5`

## 2. TOPIC
Review: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 implementation-spec-alignment
- [ ] D2 code-correctness
- [ ] D3 template-rendering-correctness
- [ ] D4 validator-coverage
- [ ] D5 cross-runtime-mirror-consistency
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Do not modify implementation files under review.
- Do not review only spec.md / plan.md / tasks.md; use resource-map.md as the primary implementation ledger.

## 5. STOP CONDITIONS
- Stop at maxIterations=5, or earlier only if the workflow convergence detector allows STOP.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Initialization loaded resource-map.md as authoritative implementation scope.

## 9. WHAT FAILED
- None yet.

## 10. EXHAUSTED APPROACHES (do not retry)
None yet.

## 11. RULED OUT DIRECTIONS
None yet.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Dimension: implementation-spec-alignment
Focus area: Manifest/resolver/renderer/scaffolder/validator implementation surfaces from resource-map.md.
Reason: First pass should verify that the implemented files match packet ADRs and resource-map promises before narrower correctness passes.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- resource-map.md present: true. It is the authoritative file ledger for implementation-code review.
- Implementation summary says the shipped system uses one Level-driven template path, resolver-backed source, inline gate renderer, validator migration, legacy template removal, and public surface cleanup.
- Primary implementation-code scope count: 114.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Compare spec/ADR claims to implementation files. |
| `checklist_evidence` | core | pending | - | Check completed gates against files/tests where sampled. |
| `template_rendering` | overlay | pending | - | Resolver + inline renderer + manifest templates. |
| `validator_coverage` | overlay | pending | - | Shell validators + TS validator mirror. |
| `command_yaml` | overlay | pending | - | Command markdown/YAML public surfaces. |
| `skill_assets` | overlay | pending | - | Skill docs/references/assets/catalog/playbook surfaces. |
| `agent_cross_runtime` | overlay | pending | - | Agent prompt surfaces and runtime consistency when in ledger. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/agents/` | pending | - | - | pending |
| `.opencode/agents/context.md` | pending | - | - | pending |
| `.opencode/agents/debug.md` | pending | - | - | pending |
| `.opencode/agents/deep-research.md` | pending | - | - | pending |
| `.opencode/agents/deep-review.md` | pending | - | - | pending |
| `.opencode/agents/improve-agent.md` | pending | - | - | pending |
| `.opencode/agents/improve-prompt.md` | pending | - | - | pending |
| `.opencode/agents/orchestrate.md` | pending | - | - | pending |
| `.opencode/agents/review.md` | pending | - | - | pending |
| `.opencode/agents/ultra-think.md` | pending | - | - | pending |
| `.opencode/agents/write.md` | pending | - | - | pending |
| `.opencode/commands/spec_kit/` | pending | - | - | pending |
| `.opencode/commands/spec_kit/assets/` | pending | - | - | pending |
| `.opencode/commands/spec_kit/complete.md` | pending | - | - | pending |
| `.opencode/commands/spec_kit/deep-research.md` | pending | - | - | pending |
| `.opencode/commands/spec_kit/deep-review.md` | pending | - | - | pending |
| `.opencode/commands/spec_kit/plan.md` | pending | - | - | pending |
| `.opencode/commands/spec_kit/resume.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/SKILL.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/mcp_server/tests/thin-continuity-record.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-canonical-save.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-folder-naming.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-level.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-links.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-normalizer-lint.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-phase-links.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-phase-parent-content.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-priority-tags.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-sections.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/rules/check-toc-policy.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/archive.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/check-template-staleness.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/quality-audit.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/templates/README.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/templates/compose.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/templates/wrap-all-templates.sh` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/templates/wrap-all-templates.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-detection/phase-blocked-by-level/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/mixed-levels/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/template-mustache-sections.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/test-template-comprehensive.js` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/test-template-system.js` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/.hashes/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/README.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/addendum/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/changelog/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/context-index.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/core/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/debug-delegation.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/examples/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/handover.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/level_1/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/level_2/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/level_3+/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/level_3/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/README.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/context-index.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/phase_parent/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/research.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/resource-map.md` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/scratch/` | pending | - | - | pending |
| `.opencode/skills/system-spec-kit/templates/stress_test/` | pending | - | - | pending |
| `AGENTS.md` | pending | - | - | pending |
| `AGENTS_Barter.md` | pending | - | - | pending |
| `CLAUDE.md` | pending | - | - | pending |
| `README.md` | pending | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Session lineage: sessionId=rvw-2026-05-04T07-58-22-255Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Review target type: spec_folder
- Started: 2026-05-04T07:58:22.255Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
[None yet]

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Core / checklist_evidence**: Partial. No `applied/T-*.md` files were present, so this pass used the spec, tasks, manifest, validators, and resource map as the authoritative evidence set. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Core / checklist_evidence**: Partial. No `applied/T-*.md` files were present, so this pass used the spec, tasks, manifest, validators, and resource map as the authoritative evidence set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core / checklist_evidence**: Partial. No `applied/T-*.md` files were present, so this pass used the spec, tasks, manifest, validators, and resource map as the authoritative evidence set.

### **Core / spec_code**: Gap. REQ-004 and SC-005 require zero validator regressions, but current shell validation can pass template-source/header/section checks without inspecting manifest-declared lazy docs that exist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Core / spec_code**: Gap. REQ-004 and SC-005 require zero validator regressions, but current shell validation can pass template-source/header/section checks without inspecting manifest-declared lazy docs that exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core / spec_code**: Gap. REQ-004 and SC-005 require zero validator regressions, but current shell validation can pass template-source/header/section checks without inspecting manifest-declared lazy docs that exist.

### **Overlay / agent_cross_runtime**: Partial. MCP validation collects the lazy docs, while shell strict validation does not, creating inconsistent validator coverage by runtime path. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Overlay / agent_cross_runtime**: Partial. MCP validation collects the lazy docs, while shell strict validation does not, creating inconsistent validator coverage by runtime path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay / agent_cross_runtime**: Partial. MCP validation collects the lazy docs, while shell strict validation does not, creating inconsistent validator coverage by runtime path.

### **Overlay / skill_agent**: Gap. `handover.md`, `debug-delegation.md`, and `research/research.md` are owned by command/agent/workflow surfaces; shell validators skipping them leaves exactly those cross-runtime/generated surfaces under-covered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Overlay / skill_agent**: Gap. `handover.md`, `debug-delegation.md`, and `research/research.md` are owned by command/agent/workflow surfaces; shell validators skipping them leaves exactly those cross-runtime/generated surfaces under-covered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay / skill_agent**: Gap. `handover.md`, `debug-delegation.md`, and `research/research.md` are owned by command/agent/workflow surfaces; shell validators skipping them leaves exactly those cross-runtime/generated surfaces under-covered.

### **Resource Map Coverage**: Sampled. No `applied/T-*.md` target files existed to cross-check; resource-map validator surfaces were sampled and the gap is within validator/public-surface coverage. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Resource Map Coverage**: Sampled. No `applied/T-*.md` target files existed to cross-check; resource-map validator surfaces were sampled and the gap is within validator/public-surface coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Resource Map Coverage**: Sampled. No `applied/T-*.md` target files existed to cross-check; resource-map validator surfaces were sampled and the gap is within validator/public-surface coverage.

### `agent_cross_runtime`: gap. Root runtime mirrors expose `@create`, but the `.opencode/agents/create.md` prompt was not synchronized with the agent heading vocabulary used by the rest of the prompt set. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime`: gap. Root runtime mirrors expose `@create`, but the `.opencode/agents/create.md` prompt was not synchronized with the agent heading vocabulary used by the rest of the prompt set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: gap. Root runtime mirrors expose `@create`, but the `.opencode/agents/create.md` prompt was not synchronized with the agent heading vocabulary used by the rest of the prompt set.

### `overlay`: partial. Agent mirrors are mostly synchronized, but the create-agent mirror remains stale. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `overlay`: partial. Agent mirrors are mostly synchronized, but the create-agent mirror remains stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `overlay`: partial. Agent mirrors are mostly synchronized, but the create-agent mirror remains stale.

### `resource_map_coverage`: gap. No `applied/T-*.md` files were present to cross-check; direct scope audit shows the resource-map agent table omits an exposed agent file under the scoped `.opencode/agents/` directory. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `resource_map_coverage`: gap. No `applied/T-*.md` files were present to cross-check; direct scope audit shows the resource-map agent table omits an exposed agent file under the scoped `.opencode/agents/` directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `resource_map_coverage`: gap. No `applied/T-*.md` files were present to cross-check; direct scope audit shows the resource-map agent table omits an exposed agent file under the scoped `.opencode/agents/` directory.

### `spec_code`: gap. ADR-005/workflow-invariance cleanup requires public AI-facing surfaces to avoid private taxonomy vocabulary, and this AI-facing prompt still uses the old capability heading. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: gap. ADR-005/workflow-invariance cleanup requires public AI-facing surfaces to avoid private taxonomy vocabulary, and this AI-facing prompt still uses the old capability heading.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: gap. ADR-005/workflow-invariance cleanup requires public AI-facing surfaces to avoid private taxonomy vocabulary, and this AI-facing prompt still uses the old capability heading.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
correctness

<!-- /ANCHOR:next-focus -->
