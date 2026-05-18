# Deep Review Iteration 003 - Template Rendering Correctness

## Dispatcher

- Command: `/spec_kit:deep-review:auto /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment --max-iterations=5`
- Iteration: 003 of 005
- Focus dimension: `template-rendering-correctness`
- Canonical review dimension: `correctness`
- Budget profile: `verify`
- Packet root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review`
- State read:
  - `review/deep-review-config.json`
  - `review/deep-review-state.jsonl`
  - `review/deep-review-findings-registry.json`
  - `review/deep-review-strategy.md`
  - `.opencode/skills/sk-code-review/references/review_core.md`
- Prior findings:
  - Active P0: 0
  - Active P1: 0
  - Active P2: 1
  - Prior P2-001: `--path` docs omit `create.sh` `/tmp` test-fixture exception.
- Write note: LEAF review evidence was completed read-only. Artifact materialization is delegated to the command manager because this execution context disallowed direct file writes.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-strategy.md`
- `.opencode/skills/system-spec-kit/assets/template_mapping.md`
- `.opencode/skills/system-spec-kit/references/templates/template_guide.md`
- `.opencode/skills/system-spec-kit/references/templates/level_specifications.md`
- `.opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/templates/README.md`
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json`
- `.opencode/skills/system-spec-kit/templates/manifest/*.md.tmpl` gate inventory
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts`
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh`
- `.opencode/skills/system-spec-kit/scripts/renderers/template-renderer.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts`
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Lazy research document contract cannot be rendered through the shared contract-doc helper path** -- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:119` / `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:205` -- The manifest registers the lazy document as public output `research/research.md` while mapping it to template file `research.md.tmpl` [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:119`; SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:120`]. The resolver exposes lazy add-on docs as contract data [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:20`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:205`], but the shell template helper maps a contract document name directly to `manifest/${template_name}.tmpl` except for the phase-parent `spec.md` special case [SOURCE: `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:205`; SOURCE: `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:210`]. Therefore a generic consumer attempting to render the resolver-provided lazy doc name `research/research.md` through the same helper contract path would look for `templates/manifest/research/research.md.tmpl`, while the actual template is `templates/manifest/research.md.tmpl`. Current docs mitigate this by instructing agents to render the template file directly for research output [SOURCE: `.opencode/skills/system-spec-kit/assets/template_mapping.md:107`], and default scaffold flow excludes lazy docs from batch rendering [SOURCE: `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:265`], so this is advisory rather than a blocking scaffold failure.
   - Finding class: cross-consumer
   - Scope proof: The lazy `research/research.md` row appears in manifest Level lazy docs for Levels 1, 2, 3, and 3+; `manifest.documents["research/research.md"].template` points to `research.md.tmpl`; `template-utils.sh` resolves non-phase doc names by appending `.tmpl` to the public doc path instead of consulting the manifest document-template mapping.
   - Affected surface hints: ["manifest lazyAddonDocs", "level-contract resolver consumers", "template-utils helper path", "optional research rendering docs", "deep-research lazy artifact creation"]
   - Recommendation: Either include document-template mapping in the serialized resolver contract and have shell helpers consult `manifest.documents[doc].template`, or add an explicit `_manifest_template_path` mapping for `research/research.md -> research.md.tmpl`; add a regression test covering lazy doc rendering by public document name.

## Traceability Checks

- `spec_code`: complete. Manifest Level rows, resolver contract exposure, shell helper path resolution, inline renderer behavior, and create-flow batch rendering were checked against implementation surfaces.
- `checklist_evidence`: partial-complete. Existing renderer and resolver tests were read for coverage of gate expression behavior, CLI output naming, Level contract serialization, and lazy-doc exposure.
- `skill_agent`: partial-complete. Skill-facing and template docs were checked where they instruct agents how to render optional templates and how scaffold/validation flows use Level contracts.
- `agent_cross_runtime`: deferred. Cross-runtime mirror parity remains reserved for the configured `cross-runtime-mirror-consistency` iteration.
- `feature_catalog_code`: notApplicable. No feature catalog surfaces were in this iteration's declared focus.
- `playbook_capability`: notApplicable. No playbook surfaces were in this iteration's declared focus.

## Integration Evidence

- `.opencode/skills/system-spec-kit/templates/README.md` documents that `manifest/spec-kit-docs.json` maps Levels to docs and `manifest/*.md.tmpl` files are rendered by inline gates [SOURCE: `.opencode/skills/system-spec-kit/templates/README.md:37`; SOURCE: `.opencode/skills/system-spec-kit/templates/README.md:38`].
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` includes all expected core/addon template versions and document rows [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:5`; SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:52`].
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts` supports Levels `1`, `2`, `3`, `3+`, and `phase`, rejects unknown levels, strips matched gate markers, detects unbalanced gates, and writes `*.md.tmpl` outputs as `*.md` in `--out-dir` mode [SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:15`; SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:32`; SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:234`; SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:287`].
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh` wraps the TypeScript renderer through the local `tsx` loader [SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh:9`; SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh:14`].
- `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts` validates Level names, document names, section gates, and exposes defensive contract copies [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:60`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:113`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:192`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:203`].
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh` normal scaffold flow resolves the Level contract and renders only required core plus required addon docs through `copy_templates_batch` [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1504`; SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1522`; SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1527`].
- `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts` covers matching/non-matching blocks, whitespace suppression, multi-level lists, boolean expressions, fenced-code preservation, unbalanced gates, and multi-file CLI output [SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts:13`; SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts:38`; SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts:71`; SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts:87`].
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts` covers required docs, higher-Level add-ons, phase-parent contract, serialization, defensive copies, and invalid levels [SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:9`; SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:17`; SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:23`; SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:30`].

## Edge Cases

- Artifact writing was unavailable in this execution context; complete markdown and JSONL recovery content was returned for command-manager materialization.
- Prior P2-001 about `--path` docs was not duplicated; this iteration focused on template rendering correctness.
- The lazy `research/research.md` issue is downgraded to P2 because normal `create.sh` scaffolding excludes lazy docs, and current agent-facing docs instruct direct rendering from `research.md.tmpl`.
- Manifest document-template mappings themselves are internally complete: no `manifest.documents[*].template` entries were missing on disk.
- Inline gate marker inventory did not show unbalanced `<!-- IF ... -->` / `<!-- /IF -->` pairs for the manifest templates inspected.

## Confirmed-Clean Surfaces

- Required core/addon manifest templates for Levels 1, 2, 3, 3+, and phase-parent are present on disk.
- Manifest-backed Level rows align with the resolver's expected required/addon contract for core scaffolded docs.
- Inline renderer supports all configured render Levels and has tests for multi-level lists, boolean expressions, nested gates, code-fence preservation, unbalanced marker rejection, and multi-file output.
- Phase-parent rendering has an explicit shell helper exception that maps phase `spec.md` to `phase-parent.spec.md.tmpl`.
- `template_guide.md`, `level_specifications.md`, `template_compliance_contract.md`, and `templates/README.md` consistently describe the manifest-backed architecture and phase-parent lean template path.

## Ruled Out

- No P0/P1 template-rendering correctness defect found in required scaffold flow.
- No finding opened for required Level 1/2/3/3+ template absence; required core/addon templates exist.
- No finding opened for inline gate parser mismatch; renderer and tests cover supported Level expressions and unbalanced marker handling.
- No finding opened for phase-parent template mapping; helper and create flow explicitly handle `phase` `spec.md` rendering.
- No escalation of prior P2-001 warranted during this dimension.

## Next Focus

- Dimension: validator-coverage
- Focus area: Validation docs and validator/script behavior, especially whether documented compliance contracts are covered by rule scripts and tests.
- Reason: Template-rendering-correctness is now covered with one advisory P2 and no active P0/P1; the next configured dimension is validator coverage.
- Rotation status: advance
- Blocked/productive carry-forward: Productive surfaces include `validate.sh`, validation rule scripts, `template_compliance_contract.md`, `validation_rules.md`, and resolver/manifest checks. Carry P2-001 and P2-002 as advisory documentation/render-contract precision issues only.
- Required evidence: direct file:line reads from validation docs, validator registry/rules, and relevant tests; avoid retrying exhausted `agent_cross_runtime` checks until the cross-runtime mirror iteration.
