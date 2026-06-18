# Review Iteration 002 — Registry advisorRouting correctness

- **Model**: gpt-5.5-fast xhigh
- **Seat**: r02
- **clean**: True
- **findings**: 0

## Analysis

I’ll do this as a read-only review and verify the registry against the actual Python/TS sources before reporting anything.
SKILL ROUTING: `sk-code-review` recommended at confidence 0.9025, so I’m loading its review guidance.
I found no memory trigger matches. I’m narrowing to the three live sources of truth: registry JSON, Python advisor map, and TS aliases/projection.
The registry and Python map are readable. The referenced `deep-loop-workflows/shared/aliases.ts` path does not exist, so I’m locating the live alias source imported by the drift guard.
The live alias source is under `system-skill-advisor/mcp_server/lib/scorer/aliases.ts`, matching the drift-guard import, not under `deep-loop-workflows/shared`.
The direct map checks are matching so far. I’m also checking the referenced packet skill names against the actual nested `SKILL.md` files so a bad `packetSkillName` is not missed.
The packet skill names in the registry line up with actual nested skill `name:` fields, including the `ai-council` folder exception. I’m doing one final invariant spot-check for the graph-metadata keystone before closing.
One graph-metadata keystone exists under `deep-loop-workflows`. I’m checking git status for the reviewed files so the review is grounded in committed/worktree state.
The reviewed files are clean in the worktree, and the recent history shows the shipped packet commits touching this slice. I’m checking the local test entrypoint before deciding whether a focused routing test can be run safely.
The test entrypoint is `vitest run`; I’m locating the deep routing parity tests so I can run only the relevant review slice.
A focused relevant test set exists. I’m running only the drift guard and deep routing parity tests, not the full suite.
The focused routing guard tests passed: 3 files, 19 tests. I’m checking whether that run changed any reviewed files before finalizing.
Findings: none.

Reviewed evidence:
- Registry has `advisorRouting` for all 8 modes with valid classes and `packetSkillName`: `.opencode/skills/deep-loop-workflows/mode-registry.json:28`, `:42`, `:58`, `:74`, `:92`, `:110`, `:125`, `:141`.
- Registry lexical projection matches Python `DEEP_ROUTING_MODE_BY_KEY`: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2320`.
- Registry lexical+alias-fold projection matches TS `DEEP_MODE_BY_CANONICAL`: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:96`.
- Registry `legacyAliases` match `RAW_ALIAS_GROUPS` for routed modes: aliases source at `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:13`, `:20`, `:27`, `:39`; registry counterparts at `.opencode/skills/deep-loop-workflows/mode-registry.json:45`, `:61`, `:77`, `:96`.
- Exactly one `advisorDefaultMode` is present and it is `agent-improvement`: `.opencode/skills/deep-loop-workflows/mode-registry.json:95`.
- Drift guard is not vacuous for this slice: it checks valid routing blocks, Python map projection, TS projection, default count, and alias equality at `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:67`, `:80`, `:86`, `:90`, `:95`.
- Focused verification passed: `npm test -- routing-registry-drift-guard.vitest.ts routing-parity-deep-skills.vitest.ts routing-parity-deep-council.vitest.ts` returned 3 test files passed, 19 tests passed.

===REVIEW-JSON===
{"slice":"mode-registry-advisorRouting","findings":[],"clean":true}
===END===

## Findings (structured)

```json
[]
```
