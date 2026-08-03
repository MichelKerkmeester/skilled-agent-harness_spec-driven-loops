---
title: "Capability: Publish and deploy (site, collection items, workflows)"
description: "Webflow publish/deploy capability card: publish_site, publish_collection_items, run_workflow — staging-first gates, the 1-per-minute queue, and rollback posture."
trigger_phrases: ["webflow publish", "webflow staging", "webflow deploy", "webflow workflow"]
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Capability: Publish and deploy (site, collection items, workflows)

## 1. OVERVIEW

Explicitly deploys Webflow content to live or staging: site publish, CMS item publish, and
workflow execution.

## 2. HOW IT WORKS

# Publish and deploy
## Capabilities

| Action | Class | Gate |
|--------|-------|------|
| `publish_site` | PB | operator confirmation; body must carry `customDomains` (production) OR `publishToWebflowSubdomain` (staging); optional single `pageId`; one successful publish per minute |
| `publish_collection_items` | PB | operator confirmation; staging-first; 1/min queue |
| `update_page_settings` with publishing-status change | PB | operator confirmation |
| `run_workflow` | DP | operator confirmation; workflow id + inputs; blast radius depends on the workflow definition |

## Safety-critical semantics

- **Staging vs production is structural**: `publishToWebflowSubdomain` (`*.webflow.io`) is the
  only publish target allowed from smoke/test flows — production `customDomains` is forbidden
  there. A single `pageId` limits blast radius.
- Publishing multiple staged pages to staging, then staging to production, publishes all staged
  changes — never mix targets accidentally.
- Rollback = re-publish prior content/snapshot; Designer version history for page-level work.
- Script registration ships with site publish (publish-adjacent — treat as gated).

## Example prompts

- "publish the 'About' page to the staging subdomain" → confirmation + `publishToWebflowSubdomain` + `pageId`
- "run the 'Weekly report' workflow" → confirmation + named inputs + blast-radius note
- Production publish from any automated flow → REFUSED (fail closed)

## 3. SOURCE FILES

### Implementation

- [`../references/action-reference.md`](../references/action-reference.md) — groups: `Sites`, `CMS`
- [`../references/tool-surface.md`](../references/tool-surface.md) — local OSS baseline where applicable
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates

### Validation And Tests

- See `../manual-testing-playbook/` for the relevant scenarios.

## 4. SOURCE METADATA

| Field | Value |
|-------|-------|
| Surface | remote (action-reference) + local OSS where noted |
| Authority | developers.webflow.com/mcp/tools/* (2026-08-03) |
| Version | 1.1.0.0 |
