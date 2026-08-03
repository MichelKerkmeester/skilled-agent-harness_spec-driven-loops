---
title: "Example: staging-only single-page publish"
description: "The approved publish path: confirmation, staging subdomain, single pageId, publish receipt, rollback plan."
trigger_phrases: ["webflow publish example", "webflow staging example"]
importance_tier: normal
contextType: example
version: 1.0.0.0
---

# Example: staging-only single-page publish

## Prompt

> "publish the 'About' page of the test site to the staging subdomain"

## Correct flow

1. **Discover + classify**: `publish_site` (PB) or `update_page_settings` with publishing-status
   change (PB).
2. **Confirmation**: operator confirmation with expected output (page URL on `*.webflow.io`) and
   rollback plan (re-publish prior content/snapshot).
3. **Execute**: body carries `publishToWebflowSubdomain` ONLY — never `customDomains`; pass the
   single `pageId` to limit blast radius; respect the 1-publish/min queue.
4. **Evidence**: publish receipt; verify the staged page.

## Why

Staging (`*.webflow.io`) and production (`customDomains`) are structurally separate publish
targets. Smoke flows are forbidden from touching production; a single page minimizes blast
radius.
