---
title: "sk-code-webflow v1.1.1.0, Template and Guide Pointers Resolve"
description: "The shipped Webflow templates and the HTML style guide now point at files and sections that exist, and the comment budget is labelled as this surface's setting."
trigger_phrases:
  - "sk-code-webflow v1.1.1.0"
  - "sk-code-webflow 1.1.1.0"
  - "webflow template pointers"
importance_tier: "normal"
contextType: "general"
version: 1.1.1.0
---

# v1.1.1.0, Template and Guide Pointers Resolve

The five copy-paste templates told adopters to read files under `references/webflow/`, a folder that no longer exists. Each pointer now names the live guide by its full path from the repository root, so a pointer copied into a project still finds its file. The HTML style guide and one template also sent readers to section numbers that the reference split had moved.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian` (Level 1)

## What's New at a Glance

- **Template pointers resolve.** Nine pointers across the five files under `assets/templates/` now name a file or folder under `.skilled/skills/sk-code/sk-code-webflow/references/`.
- **Section pointers match their targets.** The Action Routing Pattern pointer names section 2 of `shared-listener-and-weakmap.md`. The form validation pointers name section 5 of the JavaScript quick reference and section 4 of the CSS quick reference.
- **The comment budget is labelled.** The limit of five comments per ten lines is marked as the Webflow setting, with a link to the shared comment rule that owns comment density.
- **Link labels match their targets.** Five shared-tier links whose label showed an old path or an old file name now show the path they open.

## Upgrade

No migration required.
