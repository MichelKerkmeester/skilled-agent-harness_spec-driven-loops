# Iteration 7: Salvage Filename Convention

## Focus

Inspect salvage writer and naming-collision hypothesis.

## Findings

- `fanout-salvage.cjs` writes missing iteration markdown as `iteration-${iterNum}.md`, which is non-padded and conflicts with the canonical `iteration-NNN.md` convention used elsewhere. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:111] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:112] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:138]
- Phase `009/003` correctly scopes a RED test for `iteration-001.md` vs `iteration-1.md`, but those tasks remain pending. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes/tasks.md:53] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes/tasks.md:55]

## Novelty

newInfoRatio: 0.64. Still live with a precise fix path.
