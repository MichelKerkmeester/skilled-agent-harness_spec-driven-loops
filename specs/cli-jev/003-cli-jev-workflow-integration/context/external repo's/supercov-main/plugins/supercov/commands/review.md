---
description: Check a branch or uncommitted change for security and quality problems it introduced, with Supercov.
argument-hint: "[--base ref]"
disable-model-invocation: true
allowed-tools: Bash(npx supercov security:*) Bash(npx supercov quality:*) Bash(npx supercov runs:*)
---

Run `npx supercov security patch $ARGUMENTS` and `npx supercov quality patch $ARGUMENTS`. Without a range they review uncommitted work, or the whole branch when the tree is clean. If `npx supercov runs latest` shows a coverage run, add `--run latest` to the security check to show which flagged files no test runs.

Report only what the change introduced: security findings first, with file and line, then quality. A user who set `TYPESAFE_API_KEY` has opted in, so run it without asking again. If the key is missing, say so, tell the user how to set it, and review the diff by hand, saying Supercov did not check it.
