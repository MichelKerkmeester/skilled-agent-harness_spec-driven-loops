---
title: "Example: Platform-Filtered Flow-Pattern Research"
description: "A worked mcp-mobbin flow-research walkthrough: tool_info confirmation of the INFERRED callable, a journey-shaped query on platform web at limit 5, sequence reconstruction labeled as inference, and mobbin_url citations throughout."
version: 1.1.0.0
---

# Example: Platform-Filtered Flow-Pattern Research

Research how real products run a **forgot-password recovery on the web** — the flow-intent workflow from [`../references/tool_surface.md`](../references/tool_surface.md) §2 (workflow 3), with the platform filter applied per §1's hard constraints. The contract returns screens, never an ordered flow object, so every sequence claim in the output is labeled inference.

---

## 1. PRECONDITIONS

- `doctor.sh` reports `OK 'mobbin' manual registered`; fresh Code Mode session.
- **Operator OAuth completed** on a paid plan. If not: record `SKIP: operator OAuth pending — trigger any first mobbin.* call in a fresh Code Mode session and complete the browser authorization`, and stop. SKIP is a valid result.

---

## 2. STEP 1 — MANDATORY CALLABLE CONFIRMATION

```typescript
call_tool_chain({
  code: `
    const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
    return { success: true, data: info, errors: [], timestamp: new Date().toISOString() };
  `
});
```

The name is **INFERRED**; the live answer supersedes it. Fail closed on drift (see the smoke example for the drift protocol).

---

## 3. STEP 2 — THE PLATFORM-FILTERED FLOW QUERY

The journey and the target step become the `query`; the platform is `web` because the user asked about web products (had the request been ambiguous, the correct move is to **ask**, not default — tool_surface.md §1).

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "forgot password recovery flow",
      platform: "web",
      limit: 5
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

There is no `search_flows` tool to reach for — flow research is a query intent over `search_screens`, full stop.

---

## 4. STEP 3 — RECONSTRUCT, LABELED AS INFERENCE

Inspect the returned `screens[]` and inline images (correlated by `index`):

1. Group screens by `app_name` — sequence can only be inferred **within** one app's screens, never across apps.
2. Where one app contributes multiple screens with a coherent progression (request form -> email-sent confirmation -> reset form), order them — and write the ordering as `inference from visual evidence`, never as retrieved fact.
3. Where evidence does not support an order, present the screens as unordered pattern examples.

**Output discipline:** every screen used is cited by its `mobbin_url`; `failed[]` entries and missing images are reported as partial success; the inference label appears on every sequence claim.

---

## 5. WIDENING AND HANDOFF

Five results too thin for the journey? Ask before widening (never past ~15 just for variety), and budget the 60-per-60s rate window across follow-up queries — on 429, honor `Retry-After`, then exponential backoff with jitter (tool_surface.md §3). If the findings will drive a design decision (choosing a recovery pattern for your product), load `sk-design` first: this walkthrough produces cited evidence, and the verdict belongs to the design skill.
