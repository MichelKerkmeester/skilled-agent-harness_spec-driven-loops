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

- Copy and adapt a shape for the target action; each section names the exact action it follows
  (see `references/action-reference.md`).
- Top-level parameter names match the action's required-parameter list; where the reference does
  not define a nested shape, the example marks it illustrative — confirm it via `tool_info` on
  the pinned version at the first authenticated session.
- `siteId`/`pageId` are required on all page-building tools in addition to listed params.

### Surface provenance

The payload shapes in this file follow the **remote action reference**
(`references/action-reference.md`, official Webflow MCP docs fetched **2026-08-03**, remote
surface `com.webflow/mcp` 2.0.0). They must be **re-verified when the pinned server version
changes**: re-run discovery (`list_tools()`) and `tool_info` on the pinned version before relying
on any parameter name or nesting shown here.

---

## 2. AGENT INSTRUCTIONS — CREATE A RULE (`create_instruction`)

```json
{
  "site_id": "<test-site-id>",
  "kind": "rule",
  "path": "guidelines/publish-policy",
  "markdown": "# Publish policy\nAlways publish to the staging subdomain (`publishToWebflowSubdomain`); never `customDomains`."
}
```

---

## 3. CMS — CREATE A DRAFT COLLECTION ITEM (`create_collection_items`)

```json
{
  "collection_id": "<collection-id>",
  "request": { "fieldData": { "name": "Draft post", "slug": "draft-post", "body": "Draft content" } }
}
```

`data_cms_tool` is not a page-building tool, so no `siteId` is required — the contract is
`collection_id` + `request{fieldData}`.

---

## 4. VARIABLES — CREATE A COLOR VARIABLE (`create_color_variable`)

```json
{
  "siteId": "<test-site-id>",
  "pageId": "<page-id>",
  "variable_collection_id": "<variable-collection-id>",
  "variable_name": "Brand primary",
  "value": { "r": 30, "g": 60, "b": 90, "a": 1 }
}
```

`siteId`/`pageId` are the page-building global parameters; `variable_collection_id`,
`variable_name`, and `value` are the action's required parameters.

---

## 5. SITEMAP — BULK NOINDEX PAGES (`bulk_update_pages_sitemap_status`)

```json
{
  "site_id": "<test-site-id>",
  "pages": [
    { "page_id": "<page-id-1>", "includeInSitemap": false },
    { "page_id": "<page-id-2>", "includeInSitemap": false }
  ]
}
```

Top-level names follow the contract (`site_id`, `pages[]`); the nested item shape is
**illustrative** — the reference defines only `pages[]`, so confirm the item schema via
`tool_info` on the pinned version before sending.

---

## 6. PUBLISH — STAGING SUBDOMAIN ONLY (`publish_site`)

```json
{
  "site_id": "<test-site-id>",
  "publishToWebflowSubdomain": true,
  "pageId": "<page-id>"
}
```

`site_id` is the only required parameter in the remote action reference; `publishToWebflowSubdomain`
and `pageId` are the publish-body options the PB gate enforces (staging-first, single page when
possible). Never include `customDomains` in automated or smoke flows.

---

## 7. RELATED RESOURCES

- [`../references/action-reference.md`](../references/action-reference.md) — required parameters per action
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
