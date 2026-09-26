---
description: Fact-check claims against evidence with Jev (jev verify)
argument-hint: <claims or @file> against <evidence or @file>
allowed-tools: Bash(jev:*), Bash(npx jevctl:*), Read, Glob
---

Use the `jev` skill's `verify` command to check claims against evidence. Arguments: $ARGUMENTS

1. Work out the claims and the evidence from the arguments and the conversation. If the user gave
   a document or diff to check a text against, the text being checked supplies the claims and the
   document is the evidence. Split compound statements into one checkable claim each. If the
   arguments are unclear, ask one question rather than guessing.
2. Write long inputs to temp files and pass them as `@file`. Use `--evidence` once per source so
   results name the supporting source.
3. Run `jev verify ... --json --fail-on none` and parse the result.
4. Report a short table: claim, verdict, confidence, action. Call out every `contradicted` and
   `unsupported` claim with the supporting evidence id when present, and list `review` items as
   needing a human look. Finish with the summary counts.
