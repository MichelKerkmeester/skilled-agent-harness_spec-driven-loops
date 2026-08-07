# Iteration 006: Agent runtime mirrors

## Focus

Audit `.opencode/agents`, `.claude/agents`, and `.codex/agents` for duplication, conversion drift, and inventory mismatch.

## Findings

1. Each runtime carries 13 full agent definitions. Codex files identify `.opencode/agents/*.md` as their conversion source, while both Markdown runtime READMEs list only 12 agents and omit the present `deep-alignment.md`. The expected packaging copies have already produced an observable CAT-5 inventory drift, making the three-copy topology CAT-6 maintenance overhead. [SOURCE: file:.codex/agents/deep-research.toml:2] [SOURCE: file:.opencode/agents/README.txt:11] [SOURCE: file:.opencode/agents/README.txt:23] [SOURCE: file:.claude/agents/deep-alignment.md:2]

## Sources Consulted

- `.opencode/agents/README.txt:1-23`
- `.claude/agents/README.txt:1-23`
- `.codex/agents/deep-research.toml:1-15`
- `git ls-files .opencode/agents .claude/agents .codex/agents`

## Assessment

- New information ratio: 0.71
- Confidence: high for drift and copy count; runtime-specific frontmatter differences are expected.

## Reflection

Raw `diff` output was not interpreted as corruption because runtime permissions differ. The missing README entry is the concrete drift symptom.

## Recommended Next Focus

Inspect root configuration, symlinks, and duplicate runtime state paths.
