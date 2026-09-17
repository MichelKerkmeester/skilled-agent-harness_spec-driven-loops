---
title: "Example: limit-1 Smoke Search"
description: "The smallest useful mcp-mobbin walkthrough: re-confirm the discovery-confirmed callable with tool_info, run one screen search at limit 1, and verify the response shape against the fixture-declared schema without widening anything."
version: 1.0.0.0
---

# Example: limit-1 Smoke Search

The minimum end-to-end verification of the Mobbin transport: one confirmed callable, one call, one screen. This is the same smoke check the post-registration checklist in `../assets/utcp-mobbin-manual.md` carries as its live item, worked as a full walkthrough. Contract authority: [`../references/tool-surface.md`](../references/tool-surface.md) §1 (the one tool, hard constraints).

---

## 1. PRECONDITIONS

- `bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` reports `OK 'mobbin' manual registered`.
- Fresh Code Mode session (manuals load at startup).
- **Operator OAuth completed** on a paid plan (Pro, Team, or Enterprise). If not: record `SKIP: operator OAuth pending — trigger any first mobbin.* call in a fresh Code Mode session and complete the browser authorization`, and stop here. SKIP is a valid result.

---

## 2. STEP 1 — MANDATORY CALLABLE CONFIRMATION

The callable below is **CONFIRMED by live discovery 2026-07-16** (`../references/discovery-fixture-2026-07-16.json`; registry name `mobbin.mobbin.search_screens`). Re-confirm per session, fail closed on drift.

```typescript
call_tool_chain({
  code: `
    const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
    return { success: true, data: info, errors: [], timestamp: new Date().toISOString() };
  `
});
```

**Expected:** the fixture-matching schema for `search_screens` under the `mobbin` manual (`query`, `platform`, and the optional `mode`/`limit`/`exclude_screen_ids`/`image_format` — the `deep` mode is a known, confirmed input). **On drift** from the three-tool fixture baseline (different names, extra tools, a mutation-capable tool): stop, record the dated finding, and route it to a reviewed packet update — do not improvise a call.

---

## 3. STEP 2 — THE SMOKE CALL

One call, one result, no widening. The name used is whatever Step 1 returned (shown here as the prediction).

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "onboarding welcome screen",
      platform: "ios",
      limit: 1
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

---

## 4. STEP 3 — VERIFY THE DOCUMENTED SHAPE

Check the response against the documented baseline (tool-surface.md §1):

- `screens` is an array with 1 entry carrying `index`, `id`, `app_name`, `mobbin_url`, `image_url`, `platform`.
- `failed` is present (an empty array is the clean result; entries are partial success to report, not discard).
- Exactly one inline image block follows the metadata, correlated by `index`. Whether `call_tool_chain` passes it faithfully is one of the packet's open questions — record what you observe as a dated finding.
- Any field beyond the documented set is preserved untouched and noted.

**Success looks like:** one cited screen (`mobbin_url` retained as provenance) and a confirmed response shape. **Failure modes:** HTTP 401 (OAuth not actually complete — operator step, escalate), entitlement denial (relay the provider's message verbatim; MCP starts at Pro), HTTP 429 (honor `Retry-After`, then backoff with jitter).

---

## 5. WHAT THIS EXAMPLE NEVER DOES

No `deep` parameter, no second image-download call, no `search_apps`/`search_flows`/`search_elements`, no widening past `limit: 1` (this is a smoke test), no design verdict, and no edit to `.utcp_config.json` or `~/.mcp-auth` under any failure.
