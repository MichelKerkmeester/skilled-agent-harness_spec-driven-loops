---
description: Scan the repository, or a change, for security vulnerabilities with Supercov.
argument-hint: "[patch] [path] [--base ref]"
disable-model-invocation: true
allowed-tools: Bash(npx supercov security:*) Bash(npx supercov docs:*)
---

Run `npx supercov security $ARGUMENTS`. With no arguments it checks every source file; `patch` limits it to what a change introduced. Report each finding with its file, line and CWE class, most severe first.

A user who set `TYPESAFE_API_KEY` has opted in to sending source to TypeSafe, so run it without asking again. If the key is missing the command says so: tell the user how to set it, then review the code by hand and say Supercov did not check it. `npx supercov docs security` has every option for the installed version.
