---
title: "Lib: shared post-edit dispatch table"
description: "Runtime-neutral policy deciding which quality checker runs for an edited file, shared by the Claude and Codex hook adapters."
---

# Lib

---

## 1. OVERVIEW

`lib/` holds the one module that both hook adapters in `../hooks/` call. It centralizes the path-dispatch table so the Claude PostToolUse hook and the Codex PostToolUse hook cannot drift on which checker runs for a given edited file.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `post-edit-router.cjs` | Exports `resolveDispatch()` (a pure path resolver that maps an edited file to at most one checker: comment hygiene, flowchart, frontmatter-versions, placeholders or wikilinks) and `runChecks()` (spawns the resolved checker under a shared deadline and returns bounded, redacted findings). Also exports `runDistStalenessCheck()` for the dist-staleness coverage both adapters run unconditionally |

## 3. CONSUMERS

- `../hooks/claude-posttooluse.cjs`
- `../hooks/codex/post-edit-quality.cjs`

## 4. RELATED

- [`Scripts README`](../README.md)
- [`code-quality SKILL.md`](../../SKILL.md)
