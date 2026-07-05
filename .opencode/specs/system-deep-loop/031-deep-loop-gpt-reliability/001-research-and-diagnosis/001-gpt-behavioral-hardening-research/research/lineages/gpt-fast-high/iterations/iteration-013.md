# Iteration 13: External Shell Preflight Conditions

## Focus
KQ1/KQ6 execution preflight.

## Findings
- `cli-opencode` requires provider preflight via `opencode providers list` before first dispatch [SOURCE: .opencode/skills/cli-opencode/SKILL.md:186-197].
- Self-invocation guard checks `OPENCODE_*`, parent process, and lock files [SOURCE: .opencode/skills/cli-opencode/SKILL.md:54-61].
- Non-interactive runs require closed stdin `</dev/null` [SOURCE: .opencode/skills/cli-opencode/SKILL.md:269].

## Sources Consulted
cli-opencode skill.

## Assessment
newInfoRatio: 0.38. The benchmark can fail closed on environment contamination.

## Reflection
Preflight conditions are part of acceptance, not setup trivia.

## Recommended Next Focus
Add benchmark negative controls.
