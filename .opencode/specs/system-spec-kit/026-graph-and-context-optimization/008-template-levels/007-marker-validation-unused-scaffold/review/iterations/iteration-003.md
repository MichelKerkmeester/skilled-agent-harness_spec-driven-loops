# Deep Review Iteration 003 - template-rendering-correctness

## Dispatcher

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold

- Iteration: 3 of 5
- Dimension: template-rendering-correctness
- Session: `2026-05-04T08:16:07.000Z`
- Lineage: `new`, generation `1`
- Scope authority: only the approved 007 review packet was written; implementation and target spec files were read-only.

## Files Reviewed

- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json`
- `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl`
- `.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl`
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh`
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts`
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh`
- `.opencode/skills/system-spec-kit/scripts/renderers/template-renderer.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md`
- `.opencode/skills/sk-code-review/references/review_core.md`

## Findings - New

No new P0/P1/P2 findings were added for `template-rendering-correctness`.

The rendering evidence does not broaden F003. The marker producer remains a post-render scaffold finalizer, while F003 remains limited to validator consumers that count comment-only marker tokens as authored semantic evidence.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | Carry-forward F001/F003 remain active: the implementation intentionally appends marker comments after rendering [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-559], but the approved 007 packet still lacks authored marker-sweep purpose and validator consumers still count marker comments as evidence. |
| `checklist_evidence` | fail | This iteration found snapshot coverage for rendered manifest templates, not release checklist evidence for the 007 marker sweep. P1-001 remains active. |
| `resource-map` | skipped | Target `resource-map.md` is absent by configured review context. |
| `template-rendering-correctness` | pass-with-carry-forward | Manifest templates render inline-gated Level output through `copy_templates_batch` before finalization [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:113-159], and `create.sh` calls `finalize_scaffold_templates` only after the batch render completes [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:1522-1535]. |

## Integration Evidence

- Manifest templates are the template-source authority: `spec-kit-docs.json` maps core docs to `.tmpl` files and level contracts [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:52-124] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:126-160].
- The Level contract resolver validates manifest document names, level rows, section gates, and template versions before exposing required docs to shell callers [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:88-120] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:192-215].
- Shell scaffolding renders manifest templates through `inline-gate-renderer.sh` and writes the rendered output before returning created doc names [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:113-159]. The wrapper delegates to the TypeScript inline gate renderer without adding marker content [SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh:9-14].
- `renderInlineGates` strips inline gate marker lines and only emits active template content; it does not synthesize `SCAFFOLD_*` blocks [SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182-239]. Its CLI writes `.tmpl` inputs to `.md` outputs by removing the `.tmpl` suffix [SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:279-291].
- `create.sh` repositions `SPECKIT_TEMPLATE_SOURCE` immediately after frontmatter before appending scaffold markers [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:460-489] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:504-526]. The actual `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` blocks are appended after that pass [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-559].
- The generated 007 `spec.md` confirms this ordering: frontmatter closes at line 28, `SPECKIT_TEMPLATE_SOURCE` is line 29, and `SCAFFOLD_VALIDATION_COUNTS` is appended at line 240 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:240-253].
- The generated 007 `plan.md` confirms the same ordering for the Level 3 plan: `SPECKIT_TEMPLATE_SOURCE` is line 29 and `SCAFFOLD_AI_PROTOCOL_MARKERS` is appended at line 279 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:279-285].
- Golden snapshot tests render every manifest-required Level 1/2/3/3+ document, require `SPECKIT_TEMPLATE_SOURCE`, and assert inline gate markers are stripped [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:33-45]. They also cover the phase-parent template [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49-58].
- Inline-gate unit tests cover matching and non-matching blocks, nested gates, invalid levels, fenced-code preservation, unbalanced gates, and multi-file CLI output [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts:12-113].
- Resolver tests cover required doc contracts, higher-level addenda, phase-parent lean contracts, serialized template versions, defensive copies, and invalid level errors [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:8-61].

## Edge Cases

- A generated scaffold contains marker comments after rendering, but manifest snapshot tests intentionally stop at `renderInlineGates`; they prove template-source output, not post-finalization marker append behavior.
- `ensure_template_source_near_top` removes any existing `SPECKIT_TEMPLATE_SOURCE` occurrence and reinserts the first marker after the closing frontmatter fence [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:460-489]. If authored content later added another template-source marker, this function would normalize it rather than corrupt frontmatter.
- Broad duplicate guards for `SCAFFOLD_*` strings still mean an authored mention of those marker names could suppress append. This remains an edge case, not a new rendering finding, because manifest templates do not contain `SCAFFOLD_*` strings and the current generated target has the expected appended marker blocks.
- The general Mustache `template-renderer.ts` is not the scaffold path used by `create.sh`; it renders memory templates and strips configuration comments [SOURCE: .opencode/skills/system-spec-kit/scripts/renderers/template-renderer.ts:176-205]. No marker-source defect was found there.

## Confirmed-Clean Surfaces

- Manifest template sources do not contain `SCAFFOLD_*` marker blocks; marker blocks are post-render scaffold finalization only.
- Inline gate rendering strips `<!-- IF ... -->` / `<!-- /IF -->` controls from generated Level output and preserves fenced-code examples, so scaffold markers are not produced by gate syntax [SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182-239].
- Template-source placement is not corrupted by marker append in the observed 007 output: both `spec.md` and `plan.md` keep `SPECKIT_TEMPLATE_SOURCE` immediately after frontmatter and append scaffold markers near EOF [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:240-253] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:279-285].
- Golden snapshot coverage checks rendered manifest output for required docs and rejects leaked inline gates [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:33-45].

## Ruled Out

- Ruled out a template-source placement defect: marker finalization runs after `ensure_template_source_near_top`, and generated target files show the template-source marker directly after frontmatter.
- Ruled out a manifest-template contamination defect: the scoped manifest templates do not contain `SCAFFOLD_*` marker strings.
- Ruled out an inline-gate rendering defect for marker comments: inline gates are stripped by the renderer, while scaffold marker comments are appended by `create.sh` after rendering.
- Ruled out duplicating F003: this iteration found no evidence that rendering corrupts output; F003 remains a validator-consumer defect.
- Ruled out P0 severity: no exploit, credential exposure, destructive write, data loss, or release-blocking rendering corruption was observed in this dimension.

## Next Focus

- Dimension: `validator-coverage`
- Focus area: Verify validators catch the right surfaces and do not count marker comments as real executable documentation.
- Carry-forward: F001/P1-001, F002/P1-002, and F003/P1-003 remain active and should inform synthesis.
