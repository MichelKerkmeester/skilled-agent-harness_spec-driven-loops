# Iteration 6: Removed OpenCode TOML Mirror Requirement in Core Docs

## Focus

Find core deep-loop docs that still require `.opencode/agents/*.toml` mirrors even though the 014 charter records that mirror requirement as removed and the current workspace has no matching files.

## Findings

1. The current workspace has no `.opencode/agents/*.toml` files, while it has `.opencode/agents/*.md` files. [SOURCE: glob .opencode/agents/*.toml -> no files found] [SOURCE: glob .opencode/agents/*.md -> .opencode/agents/ai-council.md and peers]
2. The 014 audit charter explicitly names `.opencode/agents/*.toml` mirrors as removed obsolete requirements. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:56]
3. `deep-research/SKILL.md` still says OpenCode runtime path resolution includes `.opencode/agents/*.toml`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:17-20]
4. `deep-review/SKILL.md` still says OpenCode runtime uses `.opencode/agents/*.toml` when running directly in OpenCode. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/SKILL.md:16-20]
5. `deep-context/SKILL.md` still says the native seat has a `.opencode/agents/deep-context.toml` mirror and mandates updating it alongside `.opencode/agents/deep-context.md`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279-287] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:302]
6. `deep-loop-runtime/SKILL.md` still describes every deep-loop agent as one canonical source plus two mirrors, including `.opencode/agents/<name>.toml`, and says missing that mirror silently fails dispatch. [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:253-261]

## Sources Consulted

- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md`
- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `014-skill-doc-drift-audit/spec.md`
- Current filesystem globs for `.opencode/agents/*.toml` and `.opencode/agents/*.md`

## Assessment

- newInfoRatio: 0.80
- Novelty: high; found a multi-doc stale cluster around the removed mirror requirement.
- Confidence: high that docs mismatch current filesystem and 014 charter. Confidence is medium on exact phase ownership because the mirror removal is not represented by a separate phase implementation summary in the inspected set.

## Reflection

- Worked: current filesystem check was decisive.
- Failed: no standalone phase summary for TOML mirror removal was found.
- Ruled out: references to `.claude/agents/*.md` remain valid; `.claude/agents/ai-council.md` was not present in this workspace, but the audited stale claim is specifically the removed `.opencode/agents/*.toml` requirement.

## Recommended Next Focus

Check deep-improvement scanner docs, which may encode the same TOML surface in references/assets and code-facing READMEs.
