2,3c2,3
< title: "Scripts: comment-hygiene and dist-staleness checkers"
< description: "The code-quality skill's standalone checkers plus the hook adapters and shared dispatch table that wire them into editor tool calls."
---
> title: "Scripts: comment-hygiene, dist-staleness and ceiling-report checkers"
> description: "The code-quality skill's standalone checkers, including the ceiling-marker report, plus the hook adapters and shared dispatch table that wire them into editor tool calls."
12c12
< `scripts/` owns the `code-quality` skill's two standalone checkers (comment hygiene and dist staleness) and the two subfolders that turn them into per-edit warnings: `hooks/` (the Claude Code and Codex CLI PostToolUse adapters) and `lib/` (the shared runtime-neutral dispatch table both adapters call).
---
> `scripts/` owns the `code-quality` skill's three standalone checkers (comment hygiene, dist staleness and the ceiling-marker report) and the two subfolders that turn them into per-edit warnings: `hooks/` (the Claude Code and Codex CLI PostToolUse adapters) and `lib/` (the shared runtime-neutral dispatch table both adapters call).
22a23,24
> | `ceiling-report.sh` | Python report behind a `.sh` entrypoint that lists the `ceiling:` and `intentional-limit:` comment markers, tags the ones with no trigger or no measurable trigger, and exits 0 when it runs |
> | `ceiling-report.test.sh` | Bash test harness with fixture cases for the ceiling report |
33a36
> bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh
36c39
< Expected: `All comment hygiene test cases passed`.
---
> Expected: `All comment hygiene test cases passed` and `All ceiling report test cases passed`.
