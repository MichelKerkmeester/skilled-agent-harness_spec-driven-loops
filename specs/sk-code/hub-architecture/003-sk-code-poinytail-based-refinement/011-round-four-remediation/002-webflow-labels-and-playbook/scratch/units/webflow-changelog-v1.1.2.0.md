---
title: "sk-code-webflow v1.1.2.0, Link Labels Show Their Targets"
description: "Every link in the Webflow references and checklists now shows the path it opens instead of a file name from before the reference split, and the testing playbook root passes the document validator."
trigger_phrases:
  - "sk-code-webflow v1.1.2.0"
  - "sk-code-webflow 1.1.2.0"
  - "webflow link labels"
importance_tier: "normal"
contextType: "general"
version: 1.1.2.0
---

# v1.1.2.0, Link Labels Show Their Targets

Fifty-nine links across the Webflow references and checklists still showed a file name from before the reference split, such as `animation_workflows.md`, while the link itself opened a renamed file. Each label now shows the path the link opens, so a reader can tell where a link goes before following it. The testing playbook root now passes the document validator.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook` (Level 1)

&nbsp;

## What's New at a Glance

- **No label names a retired file.** Every link that showed an underscore file name now shows its target path. Every target still opens.
- **The playbook root opens with an overview.** `manual-testing-playbook.md` starts with a numbered overview section above its introduction.

&nbsp;

## Upgrade

No migration required.
