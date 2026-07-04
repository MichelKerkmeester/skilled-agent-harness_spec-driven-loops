# Iteration 8: deep-ai-council Identity and Mirror Claims

## Focus

Inspect deep-ai-council docs for mode, runtime identity, and TOML mirror drift after phase 010.

## Findings

1. `deep-ai-council/SKILL.md` says runtime mirrors dispatch `@ai-council` as the primary agent identity and lists `.opencode/agents/ai-council.toml` as one of three agent files. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:431-432]
2. The `primary agent identity` claim contradicts phase 010 and current frontmatter: `.opencode/agents/ai-council.md` is `mode: subagent`, and direct top-level invocation is rejected. [SOURCE: .opencode/agents/ai-council.md:4] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60]
3. The `.opencode/agents/ai-council.toml` claim contradicts current filesystem state and the 014 charter's removed TOML mirror requirement. [SOURCE: glob .opencode/agents/ai-council.toml -> no files found] [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:56]
4. `deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md` expects the user-visible outcome `@deep-ai-council` is the current runtime name; current registry says the dispatched agent remains `ai-council`. This appears pre-031 but still contradicts the current registry and phase 010's `ai-council.md` target. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md:25-31] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66-72]

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/01--runtime-routing-and-rename/runtime-agent-renamed-to-deep-ai-council.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/agents/ai-council.md`
- `010-ai-council-subagent-only/implementation-summary.md`

## Assessment

- newInfoRatio: 0.65
- Novelty: identified a high-priority stale line in the deep-ai-council SKILL plus older identity-test drift.
- Confidence: high for `deep-ai-council/SKILL.md:432`; medium for manual playbook identity drift as a 031-caused finding because it likely predates phase 010.

## Reflection

- Worked: registry read separated packet name `deep-ai-council` from agent identity `ai-council`.
- Failed: historical identity drift may not have been caused by packet 031; flag separately if prioritizing 031-only fixes.
- Ruled out: README lines about `ai-council/**` artifacts are current, not stale. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/README.md:71-78]

## Recommended Next Focus

Run a negative sweep of top-level READMEs and general docs to avoid over-flagging neutral mentions.
