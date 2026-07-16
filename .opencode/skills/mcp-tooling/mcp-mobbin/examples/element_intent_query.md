---
title: "Example: Element-Intent Query Compared Across Apps"
description: "A worked mcp-mobbin element-research walkthrough: tool_info re-confirmation of the discovery-confirmed callable, a component-plus-context query at limit 5, behavior analyzed within returned screens and compared across app_name values, with the no-invented-tools boundary held."
version: 1.1.1.0
---

# Example: Element-Intent Query Compared Across Apps

Research how real iOS apps present a **bottom-sheet destructive confirmation** — the element-intent workflow from [`../references/tool_surface.md`](../references/tool_surface.md) §2 (workflow 4), with the app-comparison lens from workflow 1 layered on top. There is no `search_elements` or element-detail tool: the element's behavior is observed **within** the returned screens, and the comparison runs over the `app_name` field of one result set.

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

The name is **CONFIRMED** (2026-07-16 fixture: registry `mobbin.mobbin.search_screens`) and re-confirmed here per session; drift from the fixture baseline fails closed.

---

## 3. STEP 2 — THE ELEMENT-INTENT QUERY

Component plus context plus state is the whole recipe: name the element (`bottom sheet`), the job (`destructive confirmation`), and let the platform come from the request (`ios`).

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "bottom sheet destructive confirmation",
      platform: "ios",
      limit: 5
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

---

## 4. STEP 3 — ANALYZE WITHIN SCREENS, COMPARE ACROSS APPS

For each returned screen (image correlated to its record by `index`):

1. **Within the screen:** observe the element's placement, the destructive action's visual weight, the cancel affordance, and any friction (confirmation text, hold-to-confirm) visible in the inline image.
2. **Across apps:** compare those observations over the distinct `app_name` values in `screens[]` — repeats are signal (a convention), meaningful differences are signal too (a divergence worth noting).
3. **Boundary:** anything not visible in a returned screen stays unknown. No detail tool exists to fetch interaction specs, and none is invented; unanswered questions are stated as unanswered.

**Output discipline:** every observation cites its screen's `mobbin_url`; `failed[]` is reported as partial success; multiple results are comparison evidence, never a chooser — "which app does it best" is an `sk-design` verdict, not a transport output.

---

## 5. VARIATIONS

- Same element, different state: `"bottom sheet form validation error"` — one new call, same discipline.
- Same element, other platform: rerun with `platform: "web"` as a **separate call** (the platform value is exactly `ios` or `web`; there is no combined filter).
- Budget check: each variation spends the same 60-per-60s rate window; on 429 honor `Retry-After`, then exponential backoff with jitter (tool_surface.md §3).
