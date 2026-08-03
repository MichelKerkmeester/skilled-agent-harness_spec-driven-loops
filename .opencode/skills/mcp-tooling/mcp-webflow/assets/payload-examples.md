---
title: "Webflow MCP Payload Examples"
description: "Example payload shapes for Webflow MCP actions (agent instructions, CMS items, variables, sitemap bulk, staging publish) built from the official required-parameter lists."
trigger_phrases:
  - "webflow payload examples"
  - "webflow example payloads"
  - "webflow request shapes"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Webflow MCP Payload Examples - Payload Shapes

Example payload shapes for Webflow MCP actions, built from the official required-parameter lists.

---

## 1. OVERVIEW

### Purpose

Show the request shapes an agent sends for representative Webflow MCP actions so operators and
agents can recognize correct payloads before the first authenticated session.

### Usage

- Copy and adapt a shape for the target action.
- These are **shapes, not live-verified payloads** — the exact schema must come from `tool_info`
  on the pinned version at the first authenticated session.
- `siteId`/`pageId` are required on all page-building tools in addition to listed params.

---

## 2. AGENT INSTRUCTIONS — CREATE A RULE

```json
{
  "site_id": "<test-site-id>",
  "kind": "rule",
  "path": "guidelines/publish-policy",
  "markdown": "# Publish policy\nAlways publish to the staging subdomain (`publishToWebflowSubdomain`); never `customDomains`."
}
```

---

## 3. CMS — CREATE A DRAFT COLLECTION ITEM

```json
{
  "siteId": "<test-site-id>",
  "collection_id": "<collection-id>",
  "request": { "fieldData": { "name": "Draft post", "slug": "draft-post", "body": "Draft content" } }
}
```

---

## 4. VARIABLES — CREATE A COLOR VARIABLE

```json
{
  "siteId": "<test-site-id>",
  "pageId": "<page-id>",
  "value": { "r": 30, "g": 60, "b": 90, "a": 1 }
}
```

---

## 5. SITEMAP — BULK NOINDEX PAGES

```json
{
  "siteId": "<test-site-id>",
  "pageIds": ["<page-id-1>", "<page-id-2>"],
  "sitemapStatus": "noindex"
}
```

---

## 6. PUBLISH — STAGING SUBDOMAIN ONLY

```json
{
  "site_id": "<test-site-id>",
  "publishToWebflowSubdomain": true,
  "pageId": "<page-id>"
}
```

Never include `customDomains` in automated or smoke flows.

---

## 7. RELATED RESOURCES

- [`../references/action-reference.md`](../references/action-reference.md) — required parameters per action
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
