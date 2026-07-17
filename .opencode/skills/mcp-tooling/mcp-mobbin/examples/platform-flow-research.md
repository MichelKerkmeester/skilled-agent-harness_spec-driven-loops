---
title: "Example: Platform-Filtered Flow-Pattern Research"
description: "A worked mcp-mobbin flow-research walkthrough: tool_info re-confirmation of the discovery-confirmed callables, a journey-shaped query through the live search_flows tool (search_screens fallback) on platform web, returned-ordering discipline, and mobbin_url citations throughout."
version: 1.0.0.0
---

# Example: Platform-Filtered Flow-Pattern Research

Research how real products run a **forgot-password recovery on the web** — the flow-intent workflow from [`../references/tool-surface.md`](../references/tool-surface.md) §2 (workflow 3), with the platform filter applied per §1's hard constraints. Since 2026-07-16, live discovery lists a dedicated `search_flows` tool returning ordered flow objects; this walkthrough uses it first, with `search_screens` as the screens-level fallback. Any sequence claim beyond the tool's returned ordering is labeled inference.

---

## 1. PRECONDITIONS

- `doctor.sh` reports `OK 'mobbin' manual registered`; fresh Code Mode session.
- **Operator OAuth completed** on a paid plan. If not: record `SKIP: operator OAuth pending — trigger any first mobbin.* call in a fresh Code Mode session and complete the browser authorization`, and stop. SKIP is a valid result.

---

## 2. STEP 1 — MANDATORY CALLABLE CONFIRMATION

```typescript
call_tool_chain({
  code: `
    const info = await tool_info({ tool_name: "mobbin.mobbin_search_flows" });
    return { success: true, data: info, errors: [], timestamp: new Date().toISOString() };
  `
});
```

The name is **CONFIRMED** (2026-07-16 fixture: registry `mobbin.mobbin.search_flows`); this session's live answer still supersedes it. Fail closed on drift (see the smoke example for the drift protocol).

---

## 3. STEP 2 — THE PLATFORM-FILTERED FLOW QUERY

The journey and the target step become the `query`; the platform is `web` because the user asked about web products (had the request been ambiguous, the correct move is to **ask**, not default — tool-surface.md §1).

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_flows({
      query: "forgot password recovery",
      platform: "web",
      limit: 3
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

`search_flows` is live-discovered (2026-07-16) and returns flow objects — `name`, `actions[]`, `screen_count`, and per-screen previews ordered by `position`, plus `page`/`has_next_page` pagination (`page` max 20). For screens-level pattern research, `search_screens` with a journey-shaped query remains available.

---

## 4. STEP 3 — USE THE RETURNED ORDERING; LABEL ANYTHING BEYOND IT

Inspect the returned flows and their per-screen preview images:

1. The `screens[].position` ordering within each flow is retrieved fact — present it as such, per flow and per `app_name`.
2. Anything you interpolate beyond the returned previews (states between screens, skipped steps, cross-app generalizations) is written as `inference from visual evidence`, never as retrieved fact.
3. Where evidence does not support a claim, present the screens as unordered pattern examples.

**Output discipline:** every flow and screen used is cited by its `mobbin_url`; missing images are reported as partial success; the inference label appears on every claim beyond the returned ordering.

---

## 5. WIDENING AND HANDOFF

Five results too thin for the journey? Ask before widening (never past ~15 just for variety), and budget the 60-per-60s rate window across follow-up queries — on 429, honor `Retry-After`, then exponential backoff with jitter (tool-surface.md §3). If the findings will drive a design decision (choosing a recovery pattern for your product), load `sk-design` first: this walkthrough produces cited evidence, and the verdict belongs to the design skill.
