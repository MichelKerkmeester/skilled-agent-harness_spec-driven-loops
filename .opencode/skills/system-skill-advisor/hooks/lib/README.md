---
title: "Hooks Lib: Skill Advisor CLI Fallback"
description: "Warm-daemon CLI fallback that the skill-advisor prompt hook falls back to when the in-process advisor brief comes back empty."
---

# Hooks Lib: Skill Advisor CLI Fallback

---

## 1. OVERVIEW

`hooks/lib/` holds the CLI fallback path for the `system-skill-advisor` prompt hook. When the in-process advisor brief returns `fail_open` or a degraded, unavailable-freshness result, this module probes the warm advisor daemon socket, shells out to `.opencode/bin/skill-advisor.cjs advisor_recommend`, and reshapes the CLI response back into the same `AdvisorHookResult` envelope the hook already understands, so a cold in-process path does not have to mean a silent miss.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `skill-advisor-cli-fallback.ts` | Probes the warm daemon socket, spawns the advisor CLI with a bounded timeout, parses its JSON payload, and normalizes the result (and retryable exit/reason codes) into an `AdvisorHookResult`. |

## 3. CONSUMERS

- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`

## 4. TESTS

- `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`

## 5. RELATED

- [`../claude/README.md`](../claude/README.md)
