---
title: "sk-code-obsidian v0.1.3.0, Asset List Matches the Shipped Checklists"
description: "Section 4 of the Obsidian SKILL now lists the seven checklists the packet ships instead of three files that do not exist, and the playbook root carries the overview section the document validator requires."
trigger_phrases:
  - "sk-code-obsidian v0.1.3.0"
  - "sk-code-obsidian 0.1.3.0"
  - "obsidian asset list"
importance_tier: "normal"
contextType: "general"
version: 0.1.3.0
---

# v0.1.3.0, Asset List Matches the Shipped Checklists

Section 4 of `SKILL.md` offered three on-demand checklists that the packet never shipped, while its own resource map already named the real files. The list now names the seven checklists under `assets/`, so a reader who follows it opens a real file. The playbook root also gains an overview heading, which clears the blocking error the document validator reported.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/004-webflow-and-obsidian` (Level 1)

## What's New at a Glance

- **Section 4 lists real files.** The renderer, comment grammar and debug checklist lines are gone. Seven lines now name `comment-banner-checklist.md`, `folder-docs-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`, `screenshot-coverage-checklist.md`, `modal-coverage-checklist.md` and `verification-checklist.md`.
- **The playbook and README use the current names.** The playbook honesty note, three scenario triage steps, one scenario's expected result and two README pointers no longer name the old reference and checklist files. Each now names the file the packet ships.
- **The playbook root validates.** `manual-testing-playbook.md` now opens with `## 1. OVERVIEW`, so `validate_document.py` reports it valid. The one warning left says that no document type rule matches a playbook root, which the validator decides and the file cannot change.

## Upgrade

No migration required.
