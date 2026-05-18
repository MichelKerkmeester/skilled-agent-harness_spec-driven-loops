# Deep Review Iteration 004 - validator-coverage

## Dispatcher

- Command: `/spec_kit:deep-review:auto`
- Target: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment`
- Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment`
- Iteration: 004 of 5
- Focus: validator-coverage
- Dimension: validator-coverage
- Canonical review dimension: maintainability
- Budget profile: verify
- Status: complete
- Write mode: recovery-ready; direct artifact writing was unavailable/disabled, so command manager materialized this content.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/review/deep-review-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/review/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/review/deep-review-strategy.md`
- `.opencode/skills/system-spec-kit/references/validation/path_scoped_rules.md`
- `.opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md`
- `.opencode/skills/system-spec-kit/references/validation/validation_rules.md`
- `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`
- `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-sections.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh`
- `.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/progressive-validation.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/validation-v13-v14-v12.vitest.ts`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Validation references are not registry-complete for the current validator surface** -- `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:16` -- The validation reference claims it documents "every validation rule enforced by the SpecKit system," but its rule summary covers a smaller legacy set of rules and omits currently registered validator rules such as `TEMPLATE_SOURCE`, `TEMPLATE_HEADERS`, `SECTION_COUNTS`, `SPEC_DOC_INTEGRITY`, `TOC_POLICY`, and operational runtime/canonical-save rules. The path-scoped reference repeats the same stale subset under "Implemented Rules." The live validator resolves its default rule set from `scripts/lib/validator-registry.json`, so agents using these references for coverage planning can miss enforced validators and severities even though runtime validation still executes them.
   - Evidence:
     - The reference claims complete rule coverage: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:16`.
     - The rule summary lists only a subset through `PHASE_PARENT_CONTENT`: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:41`.
     - `path_scoped_rules.md` lists only seven implemented rules: `.opencode/skills/system-spec-kit/references/validation/path_scoped_rules.md:67`.
     - The live registry includes additional enforced rules, including `SECTION_COUNTS`: `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:187`, `SPEC_DOC_INTEGRITY`: `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:195`, `TEMPLATE_SOURCE`: `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:203`, and `TEMPLATE_HEADERS`: `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:211`.
     - `validate.sh` reads the registry and emits all non-skip default rules from it: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:357`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:390`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:482`.
   - Impact: advisory maintainability/coverage issue. Runtime validation remains registry-backed, but the reference docs no longer provide reliable validator coverage guidance for agents or reviewers.
   - Recommendation: generate or verify the rule summary from `scripts/lib/validator-registry.json`, or add a test that asserts `validation_rules.md` and `path_scoped_rules.md` include all default non-skip registry rules with matching severity/category labels.
   - Finding class: matrix/evidence
   - Scope proof: `validate.sh` loads `scripts/lib/validator-registry.json` and derives default rules from non-skip registry entries; direct doc reads show the validation references describe only a legacy subset.
   - Affected surface hints: ["validation references", "validator registry", "agent validator coverage planning", "template compliance docs"]

## Traceability Checks

- `spec_code`: complete. Validation references were compared against `validate.sh`, the registry, representative rule scripts, and validator/template tests.
- `checklist_evidence`: partial-complete. Relevant validator and template test files were inspected for coverage shape; no direct docs-vs-registry parity test was found in the inspected surfaces.
- `skill_agent`: partial-complete. `SKILL.md` exposes the current exit-code taxonomy and primary validation command surface, but detailed rule coverage is delegated to validation references.
- `agent_cross_runtime`: deferred. Cross-runtime mirror parity remains reserved for iteration 005.

## Integration Evidence

- `validate.sh` registry integration:
  - `VALIDATOR_REGISTRY_JSON` points to `../lib/validator-registry.json` at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:22`.
  - `validator_registry_query()` loads and queries the registry at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:357`.
  - default rules are derived by filtering registry entries where `strict_only !== true` and `severity !== "skip"` at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:390`.
  - `get_rule_scripts()` enumerates those default rules at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:474`.
- Registry coverage:
  - `TEMPLATE_SOURCE` registered at `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:203`.
  - `TEMPLATE_HEADERS` registered at `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:211`.
  - `SECTION_COUNTS` registered at `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:187`.
  - `SPEC_DOC_INTEGRITY` registered at `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:195`.
- Template-system validator behavior:
  - `check-template-headers.sh` compares live documents against `template-structure.js` contracts at `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:63`.
  - `check-section-counts.sh` derives minimum expectations from the shared Level contract at `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:152`.
  - `check-files.sh` asks `template-structure.js` for required docs and has a phase-parent lean-trio branch at `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:41`.
- Test coverage context:
  - `template-structure.vitest.ts` verifies contract extraction and phase addenda behavior at `.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:62` and `.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:151`.
  - `level-contract-resolver.vitest.ts` verifies Level contract document sets at `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:9`.
  - `progressive-validation.vitest.ts` verifies validate/progressive baseline parity at `.opencode/skills/system-spec-kit/scripts/tests/progressive-validation.vitest.ts:207`.

## Edge Cases

- Direct artifact writing was unavailable/disabled; this iteration returned complete recovery-ready markdown, state JSONL, delta JSONL, and strategy-update instructions.
- The dispatch listed implementation-code context paths under `scripts/spec/check-*.sh`; the live rule scripts resolve under `scripts/rules/check-*.sh` through `validator-registry.json`. This was treated as scope-preserving path correction, not as a finding against the reviewed target.
- Prior P2-001 and P2-002 were not duplicated. This iteration focused on validator coverage and found a distinct docs-vs-registry coverage drift.
- Some rule script comments still describe historical severity labels, but active severity comes from `validator-registry.json` plus `validate.sh` result mapping. The finding is therefore scoped to reference coverage guidance, not runtime behavior.
- No P0/P1 was opened because runtime validation still uses the registry; the risk is agent/reviewer miscoverage, not a confirmed validation bypass.

## Confirmed-Clean Surfaces

- `validate.sh` uses the registry as the authoritative source for default rule selection and script resolution.
- `check-template-headers.sh` and `check-section-counts.sh` route structural checks through the live template/Level contract helper instead of relying solely on hardcoded prose tables.
- Phase-parent lean-trio behavior is represented in both docs and implementation for the rule scripts inspected.
- Existing tests cover template contract extraction, Level contract resolver behavior, and validate/progressive parity for representative cases.

## Ruled Out

- No validation exit-code mismatch reopened; the exit-code taxonomy remains aligned with prior iteration evidence and current `SKILL.md`.
- No P0/P1 validator bypass found; the live registry still drives default validator execution.
- No new finding opened for the dispatch's `scripts/spec/check-*.sh` paths; the registry-resolved live paths under `scripts/rules/` were reviewed as the implementation surface.
- No cross-runtime mirror finding attempted; reserved for iteration 005.

## Next Focus

- Dimension: cross-runtime-mirror-consistency
- Focus area: Check skill-facing guidance against command YAML and runtime mirror implications where this phase points agents.
- Reason: Validator coverage has one advisory P2 and no active P0/P1; the final configured dimension is cross-runtime mirror consistency.
- Rotation status: advance
- Blocked/productive carry-forward: Carry P2-001, P2-002, and P2-003 as advisory precision/coverage issues only. Do not retry validator docs-vs-registry coverage unless new evidence changes runtime behavior.
- Required evidence: direct file:line reads from `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/commands/spec_kit/deep-review.md`, `.opencode/agents/*.md` canonical surfaces, and runtime mirrors only where explicitly in scope.
