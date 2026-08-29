# Frozen directory manifest

Status: frozen for child 001 execution; the orchestrator owns closure.
Captured at HEAD: 719ad8f638c54084c3354ed53b0a0a8bfdafce56

Generation command:

    for root in .opencode/bin .opencode/hooks .opencode/plugins .opencode/scripts .opencode/commands/doctor/scripts .github/hooks/scripts .claude/statusline-command.sh .opencode/skills/sk-doc .opencode/skills/sk-design .opencode/skills/mcp-code-mode .opencode/skills/system-deep-loop/shared .opencode/skills/system-deep-loop/deep-improvement/scripts .opencode/skills/sk-prompt/sk-prompt-models/benchmarks .opencode/skills/system-spec-kit/mcp-server/benchmarks; do count=$(git ls-files -- "$root" | wc -l | tr -d ' '); printf '%s\t%s\n' "$count" "$root"; done

The command returned the following tracked-file inventory:

| Lane | Root | Tracked files |
|---|---|---:|
| A | .opencode/bin | 101 |
| A | .opencode/hooks | 52 |
| A | .opencode/plugins | 36 |
| A | .opencode/scripts | 23 |
| A | .opencode/commands/doctor/scripts | 13 |
| A | .github/hooks/scripts | 3 |
| A | .claude/statusline-command.sh | 1 |
| B | .opencode/skills/sk-doc | 425 |
| B | .opencode/skills/sk-design | 8,300 |
| B | .opencode/skills/mcp-code-mode | 62 |
| B | .opencode/skills/system-deep-loop/shared | 23 |
| B | .opencode/skills/system-deep-loop/deep-improvement/scripts | 182 |
| C | .opencode/skills/sk-prompt/sk-prompt-models/benchmarks | 309 |
| C | .opencode/skills/system-spec-kit/mcp-server/benchmarks | 57 |

Boundary rules:

- .opencode/skills/system-deep-loop/runtime remains owned by 020 and is not in this manifest.
- Benchmark fixture subjects remain frozen; harness and grader files remain in their lane.
- Symlinked mirrors are governed at their source path and are not duplicated in the inventory.
- dist and external output are reported separately from authored roots and are not edited by this child.

