---
title: "mcp-mobbin Examples"
description: "Worked Code Mode walkthroughs for the mcp-mobbin transport: a limit-1 smoke search, a platform-filtered flow-pattern research pass, and an element-intent query, each opening with the mandatory tool_info confirmation of the INFERRED callable and keeping the OAuth steps SKIP-valid with exact commands."
version: 1.1.0.0
---

# mcp-mobbin Examples

Worked, end-to-end Code Mode walkthroughs for the `mcp-mobbin` transport. Every example targets the single documented tool contract in [`../references/tool_surface.md`](../references/tool_surface.md) — the only tool-surface authority these examples trace to.

> **Read before running.** The `mobbin` manual is registered in `.utcp_config.json`, but the Code Mode callable `mobbin.mobbin_search_screens` is **INFERRED** from the `{manual}.{manual}_{tool}` convention and has never been observed live. Every walkthrough therefore opens with the **mandatory `tool_info` confirmation** and fails closed on drift. Live calls additionally require a fresh Code Mode session (manuals load at startup) and operator-completed browser OAuth on a paid Mobbin plan (Pro, Team, or Enterprise) — until then, the OAuth-gated steps in each walkthrough are **SKIP-valid** with the exact commands recorded for later.

---

## 1. THE WALKTHROUGHS

| # | File | What it demonstrates | Live access needed |
|---|---|---|---|
| 1 | [`smoke_search_limit_1.md`](./smoke_search_limit_1.md) | The smallest possible verification: `tool_info` confirmation, then one screen search at `limit: 1`, checking `screens[]`, `failed[]`, and inline-image arrival | Yes (SKIP-valid) |
| 2 | [`platform_flow_research.md`](./platform_flow_research.md) | Platform-filtered flow-pattern research: a journey-shaped query on `platform: "web"`, sequence reconstruction labeled as inference, `mobbin_url` citations | Yes (SKIP-valid) |
| 3 | [`element_intent_query.md`](./element_intent_query.md) | An element-intent query compared across apps: component-plus-context phrasing, `app_name` comparison, the no-invented-tools boundary | Yes (SKIP-valid) |

---

## 2. SHARED PREFLIGHT (EVERY EXAMPLE)

**Step A — wiring state (shell, read-only, always runnable):**

```bash
bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh
# expect: OK 'mobbin' manual registered in .utcp_config.json
#         OK Bridge shape present: npx mcp-remote -> https://api.mobbin.com/mcp
```

**Step B — OAuth (operator-only; SKIP-valid until completed):**

There is no agent-side command. The operator triggers any first `mobbin.*` call in a fresh Code Mode session and completes the browser authorization on a paid account (auth state persists under `~/.mcp-auth`). Record `SKIP: operator OAuth pending` when it has not happened.

**Step C — callable confirmation (inside Code Mode; MANDATORY before any call):**

```typescript
// The INFERRED prediction. Whatever tool_info returns supersedes it.
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
// Fail closed if the name, schema, or tool set differs from the single-tool
// baseline in references/tool_surface.md - never improvise a call on drift.
```

---

## 3. SHARED RULES

- `query` comes from the user's actual words; `platform` is exactly `ios` or `web` (infer or ask); `limit` starts at 5 (`1` for smoke) and never exceeds ~15 without asking.
- Cite every used reference by its `mobbin_url`; report `failed[]` and missing images as partial success.
- Never hardcode the disputed `deep` parameter; preserve unknown response fields.
- Budget the documented rate limit (60 requests per 60 seconds per user); on 429 honor `Retry-After`, then exponential backoff with jitter.
- Anything design-affecting loads `sk-design` first; these examples produce evidence, never verdicts.

---

## 4. RELATED RESOURCES

- [`../references/tool_surface.md`](../references/tool_surface.md) - the single-tool contract every example traces to.
- [`../SKILL.md`](../SKILL.md) - the runtime rules the examples operate under.
