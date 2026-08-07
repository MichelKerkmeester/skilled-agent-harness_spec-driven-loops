# Iteration 2: External-Shell Smoke Design

## Focus
KQ1 decisive smoke evidence.

## Findings
- The research command must load setup and YAML workflow only after required inputs are bound; the markdown file must not dispatch agents itself [SOURCE: .opencode/commands/deep/research.md:19-37].
- `cli-opencode` self-invocation blocks calls from OpenCode unless the prompt is explicit parallel-detached, so a clean command-owned smoke must run from a genuine external shell with no `OPENCODE_*` session context [SOURCE: .opencode/skills/cli-opencode/SKILL.md:319-322].
- Registered commands must use `opencode run --command`, not raw slash text, or the command template is not expanded [SOURCE: .opencode/skills/cli-opencode/SKILL.md:271].

## Sources Consulted
Deep research command, cli-opencode skill.

## Assessment
newInfoRatio: 0.86. The execution environment contract became concrete.

## Reflection
Ruled out another nested parent-session smoke.

## Recommended Next Focus
Classify whether reported symptoms are routing failures, latency failures, or setup failures.
