---
title: "Scenario PAIR-DATA-001: data-family runs transport-only"
description: "Data-family operations do not require sk-design; the negative pairing check."
trigger_phrases: ["webflow playbook pairing data", "webflow data family"]
importance_tier: normal
version: 1.0.0.0
---

# PAIR-DATA-001: Data-family runs transport-only

## Objective

Verify the pairing boundary: CMS CRUD, analytics, scripts, workflows, webhooks, comments run
transport-only — no `sk-design` load is required (and none should be forced).

## Steps

1. Ask: "create a draft CMS item in the 'Blog' collection".
2. Observe whether `sk-design` is loaded.

## Expected

- The data-family draft-write executes without `sk-design` (DW class, scope check only).
- Designer-family prompts (PAIR-001) still load `sk-design` — the boundary holds both ways.

## Evidence

Frozen pairing rule (decision record): Designer-family → sk-design; Data-family transport-only.
