# Alignment Iteration 2

- Lane: sk-code::code::.github/workflows/routing-registry-drift.yml, .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py, .opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs, .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts, .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts, .opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py, .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py, .opencode/skills/system-skill-advisor/mcp-server/tests/command-bridges-drift-guard.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/command-metadata-e2e.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/routing-golden-prompts.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/executor-delegation-cache.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/lexical-candidate-dedup.vitest.ts, .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/projection-fallback-049-005.vitest.ts, .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike/scratch/project-router-vocab.cjs
- Authority: sk-code / code
- Status: complete
- Findings: 7 (new ratio 1)

## Artifacts Checked

- .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs
- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts
- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts
- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts
- .opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs
- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py
- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py
- .opencode/skills/system-skill-advisor/mcp-server/tests/command-bridges-drift-guard.vitest.ts

## Findings - P0

_none_

## Findings - P1

- P1: The test file opens section 7 before adding a later section 6b, violating sequential numbered-section organization. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:468] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs:476]
- P1: Compiler path validation uses normpath and string-prefix checks rather than canonical realpath containment, so symlinked source_docs, key_files, or entity paths can escape the intended roots. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:355] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:366] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:392]
- P1: Runtime module loading catches broad Exception instead of specific exceptions, contrary to the Python creation standard. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:231]
- P1: Public Python helpers canonical_skill_id and skill_matches_alias lack required Google-style docstrings. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2624] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:2628]
- P1: Exported lexical-lane functions lack TSDoc comments required for public TypeScript APIs. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts:38] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/mcp-server/lib/scorer/lanes/lexical.ts:54] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/lexical.ts:99]
- P1: Exported projection functions lack TSDoc comments required for public TypeScript APIs. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:554] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:714] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:732]
- P1: Large TypeScript modules omit numbered code-section dividers required by the sk-code organization standard. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:1] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:1]

## Findings - P2

_none_

## Summary

P0=0, P1=7, P2=0; standards drift found in section ordering, path canonicalization, exception specificity, Python API documentation, and TypeScript documentation/organization.

## Next Focus

Resolved by partition-corpus on the next iteration.


_Narrative synthesized by the read-only-leaf writer from the structured iteration record._
