---
description: Rank the repository's files by code smells, or check what a change introduced, with Supercov.
argument-hint: "[patch] [path] [--base ref]"
disable-model-invocation: true
allowed-tools: Bash(npx supercov quality:*) Bash(npx supercov docs:*)
---

Run `npx supercov quality $ARGUMENTS`. With no arguments it ranks every source file by named code smells; `patch` reports what a change introduced. Start with the weakest file and say which smells fired.

A user who set `TYPESAFE_API_KEY` has opted in to sending source to TypeSafe, so run it without asking again. If the key is missing the command says so: tell the user how to set it, then answer from reading the code and say Supercov did not check it. `npx supercov docs quality` has every option for the installed version.
