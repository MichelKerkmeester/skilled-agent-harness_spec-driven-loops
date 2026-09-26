---
description: Find which files or lines best answer a question, by meaning (jev find)
argument-hint: <question> [in <glob or file>]
allowed-tools: Bash(jev:*), Bash(npx jevctl:*), Read, Glob, Grep
---

Use the `jev` skill's `find` command for: $ARGUMENTS

1. Determine the query and the candidate set. If the user named a glob or directory, expand it
   with Glob. If not, choose a sensible set from the conversation (for example source files under
   `src/`, or the docs folder). Keep it to at most 250 files; for larger sets, narrow by extension
   or directory first, or run several calls. For one long file, use `--lines @file` to rank lines.
2. Run `jev find "<query>" --files <paths...> --json -k 5` (or `--lines`) and parse the result.
3. If `exists_verdict` is `absent`, say that nothing in the set answers the question and suggest
   where else to look. If `partial`, present the top hits with that caveat.
4. Otherwise present the top hits with their probabilities, then open the best one with Read and
   continue the user's task from there.
