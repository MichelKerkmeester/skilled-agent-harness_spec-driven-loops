# Deep Review Strategy: 001-template-level-consolidation-research

## Review Target
- **Target**: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/001-template-level-consolidation-research
- **Type**: spec_folder (investigation-only packet; deep-research loop completed)
- **Scope Note**: This packet authored no code changes. Review focuses on the system-spec-kit implementation artifacts (templates, scripts, validators) that were investigated, auditing their current quality against the packet's research findings and recommendations.

## Review Charter
Audit the system-spec-kit template, generation, validation, and runtime-mirroring implementation code for alignment with the PARTIAL consolidation recommendation, correctness of current behavior, template rendering determinism, validator coverage gaps, and cross-runtime consistency.

## Running Findings Count
- P0: 0 | P1: 16 | P2: 10

## Dimension Status

| Dimension | Status | Score | Completed At |
|-----------|--------|-------|-------------|
| implementation-spec-alignment | **COMPLETE** | 8/10 | Iteration 001 |
| code-correctness | **COMPLETE** | 7/10 | Iteration 002 |
| template-rendering-correctness | **COMPLETE** | 7/10 | Iteration 003 |
| validator-coverage | **COMPLETE** | 6/10 | Iteration 004 |
| cross-runtime-mirror-consistency | **COMPLETE** | 7/10 | Iteration 005 |

### Iteration 001 Key Discovery
The implementation has already been migrated from CORE+ADDENDUM+compose.sh to a manifest-based architecture. Key implications for remaining dimensions:
- Dimensions 2-3 must target `inline-gate-renderer.ts/.sh` instead of `compose.sh`
- Dimension 3 must target `templates/manifest/*.tmpl` instead of `templates/level_N/`
- The "byte-equivalence repair" referenced in research.md may be moot if level dirs were already deleted

### Dimension Queue (Adjusted)
1. ~~**implementation-spec-alignment**~~ — COMPLETE (Iteration 001, P1=4, P2=2)
2. **code-correctness** — Are there logic bugs, error-handling defects, or behavioral issues in the scripts? Does `inline-gate-renderer.ts` produce deterministic output?
3. **template-rendering-correctness** — Are the `templates/manifest/*.tmpl` files correctly gated? Do ANCHOR tags survive inline-gate-renderer processing intact?
4. **validator-coverage** — Does the validation suite provide adequate coverage of manifest-based level requirements? Are there gaps?
5. **cross-runtime-mirror-consistency** — Do `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` mirror each other consistently? Are template-path references consistent across runtimes?

## Known Context
- Deep-research loop converged at iteration 10 (newInfoRatio 0.04) with recommendation: PARTIAL
- No code changes were made — this is investigation-only
- Resource map (research/resource-map.md) lists scripts, templates, configs, agents, skills, and spec artifacts
- resource-map.md not present at spec folder root; skipping coverage gate
- Implementation files are read-only during this review

## Review Scope Files
- `.opencode/skills/system-spec-kit/scripts/templates/compose.sh` — shell composer
- `.opencode/skills/system-spec-kit/scripts/templates/wrap-all-templates.sh` — ANCHOR injection
- `.opencode/skills/system-spec-kit/scripts/templates/wrap-all-templates.ts` — ANCHOR injection (TS)
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh` — spec folder creator
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh` — copy_template
- `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` — template structure reader
- `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh` — level validator
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh` — header validator
- `.opencode/skills/system-spec-kit/scripts/spec/check-template-staleness.sh` — staleness check
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` — master validator
- `.opencode/skills/system-spec-kit/scripts/tests/template-rendered-parity.vitest.ts` — parity test
- `.opencode/skills/system-spec-kit/templates/` — template tree
- `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` — runtime agents

## What Worked
- **Iteration 001**: Glob + grep pattern for detecting absent files (compose.sh, wrap-all-templates) was definitive. Directory listing of templates/ conclusively proved core/, addendum/, and level_N/ don't exist. The manifest system was discovered by reading through create.sh's actual code path (copy_templates_batch) and tracing into template-utils.sh's _manifest_template_path.
- **Iteration 002**: Side-by-side comparison of `copy_template` vs `copy_templates_batch` error-handling patterns revealed the `!` operator pitfall. Reading `template-structure.js` alongside `level-contract-resolver.ts` exposed path-resolution inconsistency. `inline-gate-renderer.ts` determinism confirmed through pure-function analysis. Bash verification confirmed `scripts/node_modules/tsx` exists (wrapper works despite variable name).
- **Iteration 003**: Rendered all 12 .tmpl files through inline-gate-renderer.ts across all 5 supported levels. Cross-referenced rendered ANCHOR IDs against spec-kit-docs.json sectionGates per level. Verified ANCHOR tag integrity — tags survive gate processing intact at all levels. Confirmed checklist.md.tmpl, phase-parent.spec.md.tmpl, and plan.md.tmpl produce correct anchor sets matching their contracts. Verified fenced code blocks correctly suppress gate processing.
- **Iteration 004**: Tracing validate.sh → check-anchors.sh → template-structure.js compare → loadTemplateContract confirmed the entire ANCHOR validation chain derives contracts from template content alone. The sectionGates cross-reference gap was pinpointed: `loadLevelContract` returns `sectionGates` at line 153 of template-structure.js, but `loadTemplateContract` (lines 420-501) never consumes it. validate.sh --verbose run confirmed the validator detects user-doc issues (missing fix-completeness anchor) but is blind to template/contract drift. Validator-registry.json analysis confirmed 31 rules with correct dispatch; none target sectionGate→template consistency.
- **Iteration 005**: Cross-runtime mirror consistency audit completed across all 4 runtimes (.opencode/, .claude/, .codex/, .gemini/). All 4 runtimes have the same agent set (11 agents each). But terminology drift found between .opencode/ canonical and .claude/.gemini/ mirrors — specific lines 179 and 311 in the code agent differ in wording ("resolved route" vs "detected stack", "router-selected guidance set" vs "overlay"). Stale templates/level_1/ references found in 2 workflow YAML files. No compose.sh or CORE+ADDENDUM stale references remain in any agent file. The .codex/ mirror uses TOML format (runtime-appropriate) and aligns with .opencode/ canonical terminology. AGENTS.md and CLAUDE.md confirmed clean of stale template-path references.

## What Failed
- **Iteration 002**: `copy_templates_batch` error swallowing (P1-001) — the `if ! cmd; then return $?` pattern returns 0 on failure. Verifying this required checking Bash `!` operator semantics across versions. Not a tool failure, but a structural correctness gap that took deep analysis to confirm.
- **Iteration 003**: Vitest test suite could not execute due to `vitest/config` module resolution failure in root vitest.config.ts. This is a configuration issue, not related to the review target. The test file (inline-gate-renderer.vitest.ts) was reviewed manually instead. Also discovered: spec.md.tmpl Level 3/3+ blocks are missing ANCHOR wrappers for risk-matrix and user-stories despite sectionGates declaring them. tasks.md.tmpl and implementation-summary.md.tmpl use `level:3+` gates that exclude Level 3 by design but sectionGates expect Level 3 content. ANCHOR:questions is misplaced in L3/L3+ blocks, wrapping 4 independent ANCHOR blocks inside it.
- **Iteration 004**: Confirmed validator coverage gap: sectionGates declarations and actual template ANCHOR content can diverge without detection. `loadTemplateContract()` extracts ANCHORs from template content only, never cross-references `assertSectionGates()` output. `parseAnchoredSections()` uses first-match closing-tag strategy, making nested ANCHOR blocks structurally invisible. No integration test exists to render all templates at all levels and verify ANCHOR output matches sectionGates contracts. The 3 P1 findings from iter 3 (missing risk-matrix/user-stories ANCHORs, misplaced /ANCHOR:questions, gate-level conflicts) would all pass undetected through `validate.sh`.
- **Iteration 005**: Two P1 findings on cross-runtime consistency: (1) .claude/ and .gemini/ code agent mirrors have terminology drift vs .opencode/ canonical (P1-005-001) — "detected stack"/"overlay" instead of "resolved route"/"router-selected guidance set"; (2) stale templates/level_1/ references in create_agent_auto.yaml and create_agent_confirm.yaml (P1-005-002). Two P2 findings: (3) .codex/ TOML format variance is undocumented; (4) .claude/ and .gemini/ code agent line 40 leaks "OpenCode runtime layer" language. The .gemini/agents/ directory was initially miscounted (10 vs actual 11) — glob re-verification confirmed parity. No compose.sh/CORE+ADDENDUM stale refs found anywhere.

## Exhausted Approaches
None yet.

## Next Focus
- **Status**: ALL DIMENSIONS COMPLETE (5/5)
- **Final Verdict**: CONDITIONAL — 0 P0, 16 P1, 10 P2
- **Recommended Next Step**: Proceed to remediation planning (`/spec_kit:plan`) for the 16 P1 findings. Key remediation targets: (1) regenerate .claude/ and .gemini/ code agent mirrors from .opencode/ canonical (P1-005-001), (2) update stale level_1/ references in workflow YAMLs (P1-005-002), (3) integrate sectionGates cross-validation into validator (P1-004-001/002/003), (4) fix misplaced/missing ANCHOR tags in spec.md.tmpl (P1-003-001/002), (5) fix template-utils.sh error-handling (P1-002-001/002/003), (6) update spec.md to reflect manifest architecture (P1-001-001/002).

## Max Iterations
5
