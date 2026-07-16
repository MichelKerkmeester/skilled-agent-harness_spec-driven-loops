---
title: "Example: Screen Image Fetch (Image Last)"
description: "Worked Code Mode walkthrough of the screenshot lane: fetch a raw screen image for one materially relevant screen, thumbnail before full, never response_format on the image tool, with the mandatory tool_info confirmation first."
trigger_phrases:
  - "refero screen image example"
  - "refero screenshot fetch"
  - "refero image walkthrough"
version: 1.1.0.0
---

# Example: Screen Image Fetch (Image Last)

A worked walkthrough of the funnel's last resort: *"The text metadata cannot settle whether this onboarding screen uses a progress rail — show me the screenshot."* Images are requested only when text cannot answer, `thumbnail` before `full`, for **one** materially relevant screen. Every tool and argument traces to [`references/tool-surface.md`](../references/tool-surface.md).

> **The one no-`response_format` tool.** `refero_get_screen_image` returns raw screenshot image content and **never** takes `response_format`. Passing it is a documented mistake; the other seven text-returning tools carry it conditionally (a `tool_info` runtime check).

---

## Step 0 — Verify the wiring (always runs; no auth needed)

```bash
bash .opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh
# -> OK 'refero' manual registered in .utcp_config.json (read-only; never edited)
```

## Step 1 — Confirm the callable (MANDATORY; live discovery is OAuth-gated)

```typescript
const info = await tool_info({ tool_name: "refero.refero_refero_get_screen_image" });
// Confirm the doubled-prefix name and that the live schema takes screen_id + image_size
// (and no response_format). Fail closed on drift.
```

**SKIP-valid:** without operator-completed OAuth (Pro or higher), record `SKIP (auth blocker)` with the exact command above; unauthenticated calls return HTTP 401.

## Step 2 — Earn the image: the screen must already be materially relevant

The screen UUID comes from an earlier metadata-first search (see [metadata-first-lookup.md](metadata-first-lookup.md)); the image lane never starts with an image.

## Step 3 — Thumbnail first

```typescript
call_tool_chain({
  code: `
    const thumb = refero.refero_refero_get_screen_image({
      screen_id: "<uuid>",
      image_size: "thumbnail"                        // the default; always tried first
    });
    return thumb;                                    // raw screenshot image content
  `
});
```

**SKIP-valid** with the auth blocker.

## Step 4 — Full size only if the thumbnail cannot answer

```typescript
call_tool_chain({
  code: `
    const full = refero.refero_refero_get_screen_image({
      screen_id: "<uuid>",
      image_size: "full"
    });
    return full;
  `
});
```

**SKIP-valid** with the auth blocker.

---

## Expected outcome

- The image was the last step of a funnel, not the first: search -> shortlist -> detail -> similar -> thumbnail -> full.
- `image_size` was the only optional argument used; `response_format` never appeared on this tool.
- The screenshot served as visual evidence cited alongside the screen's `refero_url` — it was not cached, copied into this repo, or treated as raw material to reproduce.
- In an unauthenticated environment: Step 0 passed and Steps 1, 3, 4 were recorded as SKIP with the auth blocker.
