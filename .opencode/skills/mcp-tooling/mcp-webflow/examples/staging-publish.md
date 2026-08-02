---
title: "Example: staging-only single-page publish"
description: "Publish-class session: operator confirmation, staging subdomain only, publish receipt, rollback plan."
trigger_phrases: ["webflow publish example", "webflow staging publish"]
importance_tier: important
contextType: example
version: 1.0.0.0
---

# Staging-only single-page publish (PB class)

## Scenario

The user asks: "Publish the About page so we can review it."

## Flow

1. **Confirm the target is the test site** (dedicated test workspace per the frozen D7 pattern) and the token carries `sites:write`.
2. **Operator confirmation required** — state exactly what will happen: single page, staging subdomain, no production domains.
3. **Publish to the staging subdomain only**:
   ```ts
   await call_tool_chain({ tool: "webflow.webflow.data_sites_tool", action: "publish_site", params: {
     siteId: "<test-site-id>",
     publishToWebflowSubdomain: true,   // NEVER customDomains in smoke
     pageIds: ["<about-page-id>"],
   }});
   ```
4. **Evidence**: publish receipt + the `*.webflow.io` URL for review.
5. **Rollback plan**: re-publish the prior content from the captured before-state (or Designer version-history snapshot re-publish).

## Guardrails

- `customDomains` is **forbidden** in smoke flows.
- One publish queue per minute — respect it.
- The user must confirm the destination is the test site, not a production site.
