---
title: "Tasks: Auto re-mint a hub routing manifest at commit time"
description: "The measure, build and prove steps for the pre-commit re-mint gate."
trigger_phrases:
  - "route remint tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Auto re-mint a hub routing manifest at commit time

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:tasks -->
## Tasks

- [x] T001 Read the manifest compiler to find the declared hash inputs
- [x] T002 Probe one file class at a time against the route guard to find the real trigger set
- [x] T003 Add the gate block to the pre-commit hook, patterned on the mirror-parity gate
- [x] T004 Prove the three cases against the real hook and restore the tree
<!-- /ANCHOR:tasks -->

---

<!-- ANCHOR:verification -->
## Verification

Gate: `bash -n .opencode/scripts/git-hooks/pre-commit` clean, then the three cases below run against the hook itself, then `node .opencode/bin/compiled-route-guard.cjs` reports every hub fresh.

- No routing input staged: zero `route-remint` output.
- A nested mode `SKILL.md` staged: both manifests re-minted and staged, hub fresh.
- The same input staged and unstaged at once: exit 1 with the file named.
<!-- /ANCHOR:verification -->
