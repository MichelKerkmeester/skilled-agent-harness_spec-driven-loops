# Dimension

code-correctness

# Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:103`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:122`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:129`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:131`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:148`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:158`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:171`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:175`
- `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:57`
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:67`
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1117`
- `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh:41`
- `.opencode/skills/system-spec-kit/scripts/rules/check-sections.sh:45`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:45`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:71`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:84`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93`
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:120`

# Findings by Severity

## P0

None.

## P1

### DR-002-P1-001 [P1] Workflow-invariance test path-allowlists the public surfaces it claims to gate

- File: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93`
- Claim: The workflow-invariance gate is not code-correct for the public AI-facing surfaces listed in the implementation ledger because it scans those paths, then path-allowlists the entire `.opencode/agents/`, `.opencode/commands/`, root policy doc, and `system-spec-kit/SKILL.md` surfaces before asserting no banned vocabulary remains.
- Evidence: The spec requires `workflow-invariance.vitest.ts` to fail on private vocabulary in public surfaces [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:103`] and success requires no banned vocabulary in any public surface [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/spec.md:122`]. The resource map explicitly classifies `.opencode/agents/`, `.opencode/commands/spec_kit/`, and `system-spec-kit/SKILL.md` as AI-facing cleanup targets [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:129`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:131`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:148`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:158`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:171`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-template-greenfield-impl/resource-map.md:175`]. The test enumerates `.opencode/command`, `.opencode/agent`, and `SKILL.md` in `collectDefaultSurfaces()` [SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:45`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:49`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:50`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:59`], but `isLegacyPhaseCleanupDebt()` returns true for those same public roots [SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:71`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:77`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:78`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:79`]. `isAllowedHit()` then suppresses every non-extra hit in those paths before the assertion [SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:84`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:93`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:120`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:127`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:128`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:132`].
- Counterevidence sought: I checked whether the broad allowance was limited to generated fixtures or maintainer-only manifest files. It is not: the prefixes cover whole public runtime directories and root policy docs, whereas maintainer-only files already have narrow line-specific/path-specific allowances [SOURCE: `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:86`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:87`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:90`, `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:92`]. I also sampled current default surfaces with `rg "\b(preset|capabilit(?:y|ies)|kind|manifest)\b"`; current hits were low-confidence generic `capability` wording in `.opencode/agents/context.md`, so the finding is about the gate's false-negative behavior rather than relying on a single current text hit.
- Alternative explanation: The broad allowlist may have been intended as temporary cleanup debt while those public surfaces were being edited. That does not fit the final implementation state: the implementation summary says public prompts, commands, references, catalog, and playbook surfaces were cleaned and the workflow-invariance test now scans them directly, while the resource map marks these files as explicit cleanup targets.
- Finding class: cross-consumer
- Scope proof: `workflow-invariance.vitest.ts` has one central path-based allowance used by all file hits, so the defect affects every banned-token check for `.opencode/agents/`, `.opencode/commands/`, root policy docs, and `system-spec-kit/SKILL.md`; the test's extra-path sentinel only proves extra paths fail, not default public surfaces suppressed by `isLegacyPhaseCleanupDebt()`.
- Affected surface hints: ["workflow-invariance CI", "agent prompts", "spec_kit commands", "root policy docs", "system-spec-kit SKILL.md"]
- Recommendation: Replace the broad legacy-debt directory allowlist with narrow, documented exceptions for specific unavoidable strings or remove it entirely for cleaned public surfaces. Add a sentinel or fixture that proves a banned token inside a default public surface such as `.opencode/agents/` or `.opencode/commands/spec_kit/` fails the test.
- Final severity: P1
- Confidence: 0.91
- Downgrade trigger: Downgrade only if maintainers intentionally reclassify all of these paths as out-of-scope for workflow-invariance, or if a separate required CI gate scans the same default public surfaces without this broad allowlist.

## P2

None.

# Traceability Checks

- `spec_code`: Gap found. The test implementation does not enforce the public-surface invariant promised by REQ-002 and SC-003 for several default surfaces in the resource map.
- `checklist_evidence`: No `applied/T-*.md` directory exists for task-file cross-check in this packet; sampled spec, resource map, implementation summary, and test code instead.
- `resource_map_coverage`: Sampled resolver, renderer, scaffolder, validator, and workflow-invariance surfaces from the ledger. The new gap is limited to the workflow-invariance test gate; resolver/renderer/scaffolder samples did not produce an additional code-correctness finding this iteration.
- `overlay`: Agent and command public-surface coverage is present in the test input list but neutralized by the allowlist, so overlay coverage is partial.

# Verdict

CONDITIONAL. One new P1 code-correctness finding was recorded. The workflow-invariance gate can pass while ignoring the exact public surfaces it claims to protect, so release confidence depends on tightening that gate or proving equivalent coverage elsewhere.

# Next Dimension

template-rendering-correctness
