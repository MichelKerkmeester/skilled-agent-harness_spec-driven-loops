---
title: "mcp-mobbin Examples"
description: "Worked Code Mode walkthroughs for the mcp-mobbin transport: a limit-1 smoke search, a platform-filtered flow-pattern research pass, and an element-intent query, each opening with the mandatory tool_info confirmation of the discovery-confirmed callables (2026-07-16 fixture) and keeping the OAuth steps SKIP-valid with exact commands."
version: 1.0.0.0
---

# mcp-mobbin Examples

Worked, end-to-end Code Mode walkthroughs for the `mcp-mobbin` transport. Every example targets the live tool contract in [`../references/tool-surface.md`](../references/tool-surface.md) — the only tool-surface authority these examples trace to.

> **Read before running.** The `mobbin` manual is registered in `.utcp_config.json`, and the Code Mode callables are **CONFIRMED by live pre-auth discovery 2026-07-16** ([`../references/discovery-fixture-2026-07-16.json`](../references/discovery-fixture-2026-07-16.json)): `mobbin.mobbin_search_screens`, `mobbin.mobbin_search_flows`, and `mobbin.mobbin_search_sections` (registry names dotted `mobbin.mobbin.<tool>`). Every walkthrough still opens with the **mandatory per-session `tool_info` confirmation** and fails closed on drift from the fixture baseline. Live CALLS additionally require operator-completed browser OAuth on a paid Mobbin plan (Pro, Team, or Enterprise) — until then, the OAuth-gated steps in each walkthrough are **SKIP-valid** with the exact commands recorded for later.

---

## 1. THE WALKTHROUGHS

| # | File | What it demonstrates | Live access needed |
|---|---|---|---|
| 1 | [`smoke-search-limit-1.md`](./smoke-search-limit-1.md) | The smallest possible verification: `tool_info` confirmation, then one screen search at `limit: 1`, checking `screens[]`, `failed[]`, and inline-image arrival | Yes (SKIP-valid) |
| 2 | [`platform-flow-research.md`](./platform-flow-research.md) | Platform-filtered flow-pattern research: a journey-shaped query on `platform: "web"`, sequence reconstruction labeled as inference, `mobbin_url` citations | Yes (SKIP-valid) |
| 3 | [`element-intent-query.md`](./element-intent-query.md) | An element-intent query compared across apps: component-plus-context phrasing, `app_name` comparison, the no-invented-tools boundary | Yes (SKIP-valid) |

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
// Confirmed 2026-07-16 (fixture). Whatever tool_info returns this session supersedes it.
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
// Fail closed if the name, schema, or tool set differs from the three-tool
// fixture baseline in references/tool-surface.md - never improvise a call on drift.
```

---

## 3. SHARED RULES

- `query` comes from the user's actual words; `platform` is exactly `ios` or `web` (infer or ask); `limit` starts at 5 (`1` for smoke) and never exceeds ~15 without asking.
- Cite every used reference by its `mobbin_url`; report `failed[]` and missing images as partial success.
- The `deep` question is resolved: `mode: "deep" | "standard"` is a real `search_screens` input (2026-07-16 fixture) — use it deliberately for nuanced queries; preserve unknown response fields.
- Budget the documented rate limit (60 requests per 60 seconds per user); on 429 honor `Retry-After`, then exponential backoff with jitter.
- Anything design-affecting loads `sk-design` first; these examples produce evidence, never verdicts.

---

## 4. RELATED RESOURCES

- [`../references/tool-surface.md`](../references/tool-surface.md) - the single-tool contract every example traces to.
- [`../SKILL.md`](../SKILL.md) - the runtime rules the examples operate under.
