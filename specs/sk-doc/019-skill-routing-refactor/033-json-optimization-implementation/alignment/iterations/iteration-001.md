# Alignment Iteration 1

- Lane: sk-code::code::.github/workflows/routing-registry-drift.yml, .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py, .opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts, .opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py, .opencode/skills/system-skill-advisor/mcp-server/tests/command-bridges-drift-guard.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/command-metadata-e2e.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/routing-golden-prompts.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation-cache.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/lexical-candidate-dedup.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts, .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike/scratch/project-router-vocab.cjs
- Authority: sk-code / code
- Status: complete
- Findings: 5 (new ratio 1)

## Artifacts Checked

- .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs
- .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
- .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs
- .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py
- .opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs
- .opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs
- .opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs
- .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs

## Findings - P0

_none_

## Findings - P1

- P1: Ephemeral artifact label appears in a code comment, violating the hard comment-hygiene rule. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:9] [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md:239]
- P1: The CommonJS strict-mode directive is not immediately after the boxed header as required by the JavaScript creation standard. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:21] [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md:56]
- P1: Choreography resource validation joins an authored path directly to repoRoot without containment validation, so ../ paths can escape the repository and pass when an external file exists. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:324] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs:187] [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/organization-security-and-examples.md:139]
- P1: Hub manifest generation joins mode.packet directly to skillDir without the containment guard used for standalone packets, allowing a registry packet path to enumerate resources outside the skill root. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:169] [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/organization-security-and-examples.md:139]

## Findings - P2

- P2: Several exported CommonJS functions lack the required JSDoc documentation, including exports from freshness, root-metadata, manifest-generation, and derived-regenerator modules. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:75] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:552] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:271] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:255] [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md:401]

## Summary

P0=0, P1=4, P2=1; four required conformance/security findings and one documentation finding.

## Next Focus

Resolved by partition-corpus on the next iteration.


_Narrative synthesized by the read-only-leaf writer from the structured iteration record._
