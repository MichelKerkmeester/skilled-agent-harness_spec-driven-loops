# Deep Review Iteration 004 - validator-coverage

## Dispatcher

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=implementation-spec-alignment,code-correctness,template-rendering-correctness,validator-coverage,cross-runtime-mirror-consistency
BINDING: specFolder=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep

- Iteration: 4 of 5
- Dimension: validator-coverage
- Session: `2026-05-04T08:16:07.000Z`
- Lineage: `new`, generation `1`
- Scope authority: only the approved 007 review packet was written; reviewed implementation and target spec files remained read-only.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md`
- `.claude/skills/sk-deep-review/references/quick_reference.md`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts`
- `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-sections.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-frontmatter.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh`
- `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh`
- `.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/checklist.md`

## Findings - New

### F004 [P1] Active validation path omits the semantic marker validators

- File: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1019`
- Evidence: `validate.sh` calls `run_node_orchestrator` before the legacy shell rule path [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:1018-1023], and `run_node_orchestrator` exits with the Node orchestrator's status after invoking it [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:836-858]. The Node orchestrator only pushes file, placeholder, template-source, template-shape, priority, frontmatter, spec-doc sufficiency, section-presence, level, and graph metadata entries [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:355-366]; it has no `SECTION_COUNTS`, `AI_PROTOCOLS`, or `AI_PROTOCOL` implementation. The registry still declares `AI_PROTOCOLS` and `SECTION_COUNTS` as `error` authored-template rules [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:123-128] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:187-192].
- Impact: Strict validation can report template/header failures while never exercising the exact semantic validators that F003 depends on, so a regression test for marker comments cannot be enforced through the current default validation path.
- Finding class: cross-consumer
- Scope proof: Reviewed the default validator dispatcher, Node orchestrator rule list, validator registry, semantic shell validators, target marker output, and relevant test files. This is not a duplicate of F003: F003 is the shell-rule comment-counting behavior; F004 is the default orchestration/test-coverage blind spot that bypasses those rules.
- Affected surface hints: ["validate.sh dispatcher", "Node validation orchestrator", "SECTION_COUNTS rule", "AI_PROTOCOLS rule", "strict validation"]
- Recommendation: Either port `SECTION_COUNTS` and `AI_PROTOCOLS` behavior into the Node orchestrator or make `validate.sh` continue to execute registered shell semantic validators after the Node path, then add negative fixtures proving `SCAFFOLD_*` HTML comments do not satisfy authored requirements, scenarios, or AI protocol evidence.

```json
{
  "findingId": "F004",
  "claim": "The active validation path omits the semantic marker validators that should guard against comment-only scaffold evidence.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/spec/validate.sh:836-858",
    ".opencode/skills/system-spec-kit/scripts/spec/validate.sh:1018-1023",
    ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:355-366",
    ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:123-128",
    ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:187-192",
    ".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:55-75",
    ".opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:54-119"
  ],
  "counterevidenceSought": "Checked validate.sh fallback ordering, Node orchestrator entries, registry metadata, scoped Vitest tests, legacy shell validation tests, and target strict-validation output for any active SECTION_COUNTS or AI_PROTOCOLS execution path.",
  "alternativeExplanation": "The Node orchestrator may be intended as a newer replacement for the legacy shell rules, but then it still needs equivalent semantic rule coverage or the registry should not advertise those rules as active error validators.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade only if the command contract intentionally excludes SECTION_COUNTS and AI_PROTOCOLS from default strict validation and release-readiness relies on a separate documented validation command that is covered by tests."
}
```

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | Carry-forward F001/F003 remain active, and F004 adds that the default validation dispatcher bypasses the semantic rules that would prove the marker-comment fix [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:1018-1023]. |
| `checklist_evidence` | fail | The target checklist remains scaffold evidence only; D4 found no negative marker-comment fixture proving comments are rejected as authored evidence. |
| `resource_map` | skipped | Target `resource-map.md` is absent by configured review context. |
| `validator-coverage` | fail | `AI_PROTOCOLS` and `SECTION_COUNTS` are registered as active error validators [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:123-128] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:187-192], but the active Node validation path does not run or implement them [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:355-366]. |

## Integration Evidence

- `validate.sh` prefers the Node orchestrator whenever it is available; the function builds the Node command, forwards `--strict`/`--json`, runs it, and exits with that status [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:836-858]. The main routine calls this before `run_all_rules` and `run_strict_validators`, so the shell registry path is unreachable on the default Node-orchestrated path [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:1018-1023].
- The Node orchestrator has explicit rule entries for file existence, placeholders, template source, headers, anchors, priority tags, frontmatter, spec-doc sufficiency, section presence, level detection, and graph metadata [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:355-366]. Search found no `SECTION_COUNTS`, `AI_PROTOCOLS`, or `AI_PROTOCOL` token in that file.
- The shell `SECTION_COUNTS` rule counts `REQ-*` and `**Given**` directly from `spec.md` [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:55-75] and enforces Level 3/3+ minimums for requirements and scenarios [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:160-197].
- The shell `AI_PROTOCOL` rule greps `plan.md` and `tasks.md` for `AI EXECUTION`, `Pre-Task Checklist`, `Execution Rules`, `Status Reporting`, and `Blocked Task` tokens [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:54-119], then requires Level 3+ protocol components [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh:147-193].
- The generated 007 target contains the exact comment-only marker tokens that those shell rules count: `SCAFFOLD_VALIDATION_COUNTS` carries `REQ-003` through `REQ-008` and six `**Given**` rows [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/spec.md:240-253], while `SCAFFOLD_AI_PROTOCOL_MARKERS` carries AI protocol keywords in `plan.md` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-fleet-marker-validation-sweep/plan.md:279-285].
- The scoped Vitest coverage does not cover this semantic validator gap. `scaffold-golden-snapshots.vitest.ts` renders manifest templates and asserts frontmatter/template-source plus stripped inline gates [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:33-58]. `template-structure.vitest.ts` covers template path resolution, header/anchor order, and phase addenda [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/template-structure.vitest.ts:43-178]. `validation-rule-metadata.vitest.ts` covers memory quality rule metadata, not spec validator registry parity [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts:12-102].
- Legacy shell validation tests mention `check-ai-protocols.sh` and `check-section-counts.sh`, but only as isolated expected pass/warn cases [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh:733-752] or rule-existence checks [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-validation-system.js:1468-1486]. They do not provide negative fixtures for HTML comments or `SCAFFOLD_*` marker blocks.

## Edge Cases

- If operators force `SPECKIT_VALIDATE_LEGACY=1`, the shell validators can still run, but default strict validation exits through the Node orchestrator before those rules. This review focuses on the default path used by release/readiness validation.
- `SECTIONS_PRESENT` in the Node orchestrator is not equivalent coverage: it records section presence as covered by manifest anchors [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:364], while F003/F004 concern semantic requirement, scenario, and AI protocol evidence counts.
- Comment stripping exists for some structural validators, such as fenced block stripping in anchor and template helpers, but not for the semantic grep consumers reviewed here. That supports F003 while F004 remains the coverage path that fails to exercise those consumers.

## Confirmed-Clean Surfaces

- Placeholder detection does not create the marker-comment defect; it filters fences and searches explicit placeholder syntax, not requirement or AI-protocol evidence tokens [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh:54-90].
- Template-source validation is correctly scoped to `SPECKIT_TEMPLATE_SOURCE` headers near the top of spec docs and does not treat marker comments as authoring evidence [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh:56-96].
- Template header and anchor validators compare template structure and required anchors; they are not the semantic count gates for requirements, scenarios, or AI protocol components [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh:53-147] [SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:181-215].

## Ruled Out

- Ruled out duplicating F003: F003 remains the shell semantic validator behavior that counts comment-only marker tokens; F004 is the active default validation path and test coverage gap that prevents that behavior from being guarded.
- Ruled out a new placeholder or template-source finding; those validators do not consume `REQ-*`, `**Given**`, or AI-protocol marker text as authored evidence.
- Ruled out a P0 severity: the issue is a release-readiness validation gap, not an exploit, credential exposure, destructive write, or data-loss path.
- Ruled out adequate negative fixture coverage in the scoped tests; the reviewed tests cover rendering, template structure, metadata, isolated legacy pass/warn cases, and rule existence, but not comment-only scaffold evidence rejection.

## Next Focus

- Dimension: `cross-runtime-mirror-consistency`
- Focus area: Check command/agent/mirror wording only where it affects the marker validation sweep or deep-review execution contract.
- Carry-forward: F001/P1-001, F002/P1-002, F003/P1-003, and F004/P1-004 remain active for synthesis.
