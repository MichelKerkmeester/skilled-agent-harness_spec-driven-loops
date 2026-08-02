---
title: "Example: draft-safe page settings update"
description: "Draft-write session: update page settings without publishing. No confirmation gate; scope check only."
trigger_phrases: ["webflow draft example", "webflow page settings"]
importance_tier: normal
contextType: example
version: 1.0.0.0
---

# Update page settings (DW class, no publish)

## Scenario

The user asks: "Update the SEO description of the About page in the test site."

## Flow

1. Discover tools; scope check (`pages:write`).
2. Read the current page metadata (RO) to capture the before-state.
3. Update draft settings **without touching the publish status field**:
   ```ts
   await call_tool_chain({ tool: "webflow.webflow.data_pages_tool", action: "update_page_settings", params: { pageId: "<id>", seoDescription: "..." } });
   ```
4. Report the change; **explicitly state that nothing was published**.

## Guardrails

- If the payload includes a publishing-status field, treat the action as PB class → operator confirmation + staging-first.
- CMS drafts: choose the queued/drafted target explicitly — CMS mutations are not implicitly draft-safe.
