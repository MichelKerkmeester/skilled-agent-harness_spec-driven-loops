# Deep Review Iteration 002 - code-correctness

## Dispatcher

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold

- Iteration: 2 of 5
- Dimension: code-correctness
- Session: `2026-05-04T08:16:07.000Z`
- Lineage: `new`, generation `1`
- Scope authority: only the approved 007 review packet was written; implementation and target spec files were read-only.

## Files Reviewed

- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-sections.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh`
- `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md`
- `.opencode/skills/sk-code-review/references/review_core.md`

## Findings - New

### P1 Findings

- **F003**: Scaffold marker comments are counted as authored validator evidence - `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:61` - `create.sh` appends comment-only `REQ-*`, `**Given**`, and AI-protocol marker text, while the validators grep the full markdown without stripping HTML comments, allowing scaffold marker comments to satisfy section-count and AI-protocol checks.

### P1-003 [P1] Scaffold marker comments are counted as authored validator evidence

- File: `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:61`
- Evidence: `create.sh` appends `SCAFFOLD_VALIDATION_COUNTS` as an HTML comment containing `REQ-003` through `REQ-008` and six `**Given**` lines [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-546]. The target scaffold contains those exact comment-only requirement and scenario tokens [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:240-253]. `check-section-counts.sh` then counts requirements with `grep -cE "REQ-FUNC-|REQ-DATA-|REQ-"` and scenarios with `grep -c "\*\*Given\*\*"` directly against `spec.md`, without excluding HTML comments [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:55-75]. For Level 3/3+, the same rule requires 8 requirements and 6 scenarios [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:160-172], while the authored target requirements only contain placeholder `REQ-001` and `REQ-002` rows [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:112-123].
- Evidence: `create.sh` appends `SCAFFOLD_AI_PROTOCOL_MARKERS` as an HTML comment in Level 3+ `plan.md` with `AI EXECUTION`, `Pre-Task Checklist`, `Execution Rules`, `Status Reporting Format`, and `Blocked Task Protocol` [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:548-559]. The target plan contains those tokens only in that marker comment [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:279-285]. `check-ai-protocols.sh` accepts those strings via direct grep scans of `plan.md` and `tasks.md`, again without stripping comments [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:54-119], and uses the resulting component score to decide Level 3/3+ protocol completeness [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:147-193].
- Impact: The scaffold marker producer is idempotent, but downstream validators treat the marker comments as real authored evidence. A scaffold-only packet can therefore appear to meet requirement/scenario count and AI-protocol assumptions even when the real executable sections are still placeholders, weakening strict validation and release-readiness signals.
- Finding class: `cross-consumer`
- Scope proof: Checked the marker producer (`create.sh`), all declared validator consumers in the scoped `scripts/rules/check-*.sh` set, the target generated marker blocks, and the scaffold/template tests in scope. The same comment-counting pattern affects the section-count and AI-protocol consumers; other rules either inspect structural files/headers/anchors or explicitly strip fenced blocks and do not consume these marker tokens as semantic evidence.
- Affected surface hints: `["scaffold marker emission", "SECTION_COUNTS validator", "AI_PROTOCOL validator", "strict validation release-readiness"]`
- Recommendation: Preserve marker emission if scaffold snapshots need it, but update semantic validators to ignore `SCAFFOLD_*` HTML comment blocks or explicitly classify them as scaffold-only sentinels instead of authored requirements, scenarios, or AI execution protocol content.

```json
{"findingId":"F003","claim":"Scaffold marker comments are counted as authored validator evidence.","evidenceRefs":[".opencode/skills/system-spec-kit/scripts/spec/create.sh:528-559",".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:55-75",".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:160-172",".opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:54-119",".opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:147-193",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:112-123",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/spec.md:240-253",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold/plan.md:279-285"],"counterevidenceSought":"Checked the marker append guards in create.sh, the section-count and AI-protocol grep consumers, the target scaffold output, placeholder/template/anchor/frontmatter/file/source validators, and scaffold/template tests for an explicit comment-stripping or scaffold-marker exception path; none was found for these semantic consumers.","alternativeExplanation":"The marker comments may be intentional bootstrap sentinels to let fresh scaffold packets clear non-authoring count checks, but strict validation currently cannot distinguish that scaffold-only bypass from real authored content.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 if the validator contract is changed to explicitly treat SCAFFOLD_* comments as non-release scaffold sentinels and strict/release-readiness validation rejects or ignores them when authoring evidence is required.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | The implementation emits marker comments intentionally [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-559], but validators consume those comment tokens as semantic evidence [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:55-75] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:54-119]. |
| `checklist_evidence` | fail | P1-001 remains active; this iteration adds code-level evidence that marker comments can mask missing authored validation evidence instead of resolving the scaffold checklist gap. |
| `resource-map` | skipped | Target `resource-map.md` is absent by configured review context. |

## Integration Evidence

- `create.sh` appends `SCAFFOLD_VALIDATION_COUNTS` only when `spec.md` exists and the marker string is not already present [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-546].
- `create.sh` derives `doc_level_num="${doc_level/+/}"` and appends `SCAFFOLD_AI_PROTOCOL_MARKERS` only when `plan.md` exists, the numeric level is at least 3, and the marker string is absent [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:548-559].
- The idempotence guards are behaviorally adequate for repeated scaffold finalization, but their marker strings are broad string-presence checks, not semantic validation barriers [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-549].
- No scoped consumer was found that strips HTML comments before counting `REQ-*`, `**Given**`, or AI-protocol strings for these two validators [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:55-75] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:54-119].

## Edge Cases

- Level 1 and Level 2 scaffolds still receive `SCAFFOLD_VALIDATION_COUNTS` in `spec.md`; that marker can influence the lower section-count thresholds even though `SCAFFOLD_AI_PROTOCOL_MARKERS` is correctly gated to Level 3+ plans.
- A packet that explicitly documents `SCAFFOLD_VALIDATION_COUNTS` or `SCAFFOLD_AI_PROTOCOL_MARKERS` before finalization would suppress marker append because the duplicate guard is a broad `grep -q` string check. That is not a separate finding here because generated templates do not appear to mention those strings before append.
- This is not a P0: the issue weakens validation truthfulness but does not create security exposure, destructive mutation, or data loss.

## Confirmed-Clean Surfaces

- Marker append is idempotent for normal generated scaffold reruns because both append blocks check for the marker string before writing [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:528-549].
- AI-protocol marker emission is level-gated to numeric Level 3 and Level 3+ documents through `doc_level_num` and `-ge 3` [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/create.sh:548-559].
- Placeholder validation filters fenced code blocks and searches only explicit placeholder forms, so the scaffold marker comments do not create a placeholder-rule bypass by themselves [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh:54-90].
- Template source, frontmatter, files, anchors, sections, and template-header validators inspect structural contracts rather than treating the scaffold marker strings as their primary pass condition [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh:56-95] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh:37-144] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-files.sh:41-109] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:91-166] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-sections.sh:40-81] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:149-204].

## Ruled Out

- Ruled out duplicating P1-001/P1-002; this iteration's code-correctness evidence introduces a distinct validator-consumer issue rather than changing the prior alignment or metadata findings.
- Ruled out a marker-emission idempotence defect for normal reruns because both append blocks are guarded by marker-presence checks.
- Ruled out a Level-gating defect for `SCAFFOLD_AI_PROTOCOL_MARKERS`; the AI-protocol marker is intentionally limited to Level 3+ by numeric level comparison.
- Ruled out a P0 severity because no exploit, credential exposure, destructive write, or data-loss behavior was observed in this review dimension.

## Assessment

Dimensions addressed: correctness, code-correctness

## Next Focus

- Dimension: `template-rendering-correctness`
- Focus area: Verify scaffold marker behavior does not corrupt rendered Level output, template-source placement, or manifest/template contract snapshots.
- Carry-forward: F001/P1-001, F002/P1-002, and F003/P1-003 remain active and should inform synthesis.
