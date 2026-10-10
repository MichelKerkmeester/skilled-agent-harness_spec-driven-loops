---
title: "Lib: shared post-edit dispatch table"
description: "Runtime-neutral policy deciding which quality checker runs for an edited file, shared by the Claude and Codex hook adapters."
---

# Lib

---

## 1. OVERVIEW

`lib/` is a pointer only. The shared post-edit dispatch module moved to `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, where the Claude, Codex and Devin adapters call it. It centralizes the path-dispatch table so those adapters cannot drift on which checker runs for a given edited file.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `post-edit-router.cjs`, now at `.skilled/hooks/post-edit-quality/lib/` and absent from this folder | Exports `resolveDispatch()` (a pure path resolver that maps an edited file to at most one checker: comment hygiene, flowchart, frontmatter-versions, placeholders or wikilinks) and `runChecks()` (spawns the resolved checker under a shared deadline and returns bounded, redacted findings). Also exports `runDistStalenessCheck()` for the dist-staleness coverage both adapters run unconditionally |

---

## 3. CONSUMERS

- `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`
- `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs`

---

## 4. RELATED

- [`Scripts README`](../README.md)
- [`sk-code-quality SKILL.md`](../../SKILL.md)
