---
description: Compact a session transcript without summarizing; show what Jev would drop (jev compact)
argument-hint: [@transcript.jsonl] [--goal <task>]
allowed-tools: Bash(jev:*), Bash(npx jevctl:*), Bash(ls:*), Read
---

Use the `jev` skill's `compact` command for: $ARGUMENTS

1. Find the transcript. If none is given, use the newest `*.jsonl` under
   `~/.claude/projects/<current project dir>/` (the current session). Pass it as `@path`.
2. Run `jev compact @path --json` (add `--goal "..."` if the user states the ongoing task) and
   parse the result. Add `--out <file>` if the user wants the compacted transcript saved.
3. Report the reduction percentage, messages before and after, and the counts of kept, truncated,
   and dropped calls. List the dropped calls by tool with their P(call)/P(result) so the user can
   judge the decisions. If `worth_it` is false, say the reduction is below the minimum and that
   the hook would have fallen back to the built-in summary.
