---
title: "Example: staging-only single-page publish"
description: "The approved publish path: confirmation, staging subdomain, single pageId, publish receipt, rollback plan."
trigger_phrases:
  - "webflow publish example"
  - "webflow staging example"
  - "webflow staging publish flow"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Example: staging-only single-page publish - Worked Example

The approved publish path: operator confirmation, staging subdomain, single pageId, publish receipt, rollback plan.

---

## 1. OVERVIEW

### Purpose

Show the only publish flow allowed from smoke/test contexts: staging-first with a single page.

### Usage

Use when a publish is genuinely required. Confirmation must precede the call; the body carries `publishToWebflowSubdomain` + `pageId`; never `customDomains`.

---

## 2. EXAMPLE SESSION

**Prompt**: "publish the 'About' page of the test site to the staging subdomain."

**Correct flow**:

1. Discover + classify: PB.
2. Confirmation: expected URL on `*.webflow.io` + rollback plan (re-publish prior content/snapshot).
3. Execute with `publishToWebflowSubdomain` only + single `pageId`; respect the 1-publish/min queue.
4. Evidence: publish receipt; verify the staged page.

---

## 3. RELATED RESOURCES

- [`../../feature-catalog/content/publish-deploy.md`](../../feature-catalog/content/publish-deploy.md)
- [`../../manual-testing-playbook/safety-gate/pubgate.md`](../../manual-testing-playbook/safety-gate/pubgate.md)
