---
title: "Webflow MCP example payloads"
description: "Example payload shapes for Webflow MCP actions (agent instructions, CMS items, variables, sitemap bulk, staging publish) built from the official required-parameter lists."
trigger_phrases:
  - "webflow example payloads"
  - "webflow payload shapes"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Example payloads (research-inventory shapes)

> Example payload shapes for Webflow MCP actions, built from the official required-parameter
> lists (`references/action-reference.md`). These are **shapes, not live-verified payloads** —
> the exact schema must come from `tool_info` on the pinned version at the first authenticated
> session. `siteId`/`pageId` are required on all page-building tools in addition to listed params.

## Agent instructions — create a rule

```json
{
  "site_id": "<test-site-id>",
  "kind": "rule",
  "path": "guidelines/publish-policy",
  "markdown": "# Publish policy\nAlways publish to the staging subdomain (`publishToWebflowSubdomain`); never `customDomains`."
}
```

## CMS — create a draft collection item

```json
{
  "siteId": "<test-site-id>",
  "collection_id": "<collection-id>",
  "request": { "fieldData": { "name": "Draft post", "slug": "draft-post", "body": "Draft content" } }
}
```

## Variables — create a color variable

```json
{
  "siteId": "<test-site-id>",
  "pageId": "<page-id>",
  "value": { "r": 30, "g": 60, "b": 90, "a": 1 }
}
```

## Sitemap — bulk noindex pages

```json
{
  "siteId": "<test-site-id>",
  "pageIds": ["<page-id-1>", "<page-id-2>"],
  "sitemapStatus": "noindex"
}
```

## Publish — staging subdomain only

```json
{
  "site_id": "<test-site-id>",
  "publishToWebflowSubdomain": true,
  "pageId": "<page-id>"
}
```

Never include `customDomains` in automated or smoke flows.
