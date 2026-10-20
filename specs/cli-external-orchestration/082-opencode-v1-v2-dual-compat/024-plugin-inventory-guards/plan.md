---
title: "Implementation Plan: Phase 24: plugin-inventory-guards"
description: "Read the plugin folder into an inventory with a manifest of named exceptions, drive the two v2 suites from it, add guards for unmapped hooks and unrouted event names, observe v2 event delivery on a private host, and correct the docs. Mutation probes in temporary copies prove each new guard fails."
trigger_phrases:
  - "plugin inventory guards plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 24: plugin-inventory-guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS tests over ESM OpenCode plugins |
| **Framework** | Node built-in test runner |
| **Storage** | A JSON manifest beside the tests |
| **Testing** | The plugin suite, mutation probes in temporary copies, both doctor battery families |

### Overview
One helper reads `.opencode/plugins` and the manifest, and every v2 suite takes its plugin list from it. A new inventory test guards the folder, the bridge's skipped hooks and the event names plugins handle. A probe plugin on a private OpenCode 2.0.32 host records which event names arrive, and the manifest files each unrouted name under what was observed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
An inventory read from disk, a test that it equals what is declared, and a manifest of named exceptions.

### Key Components
- **`tests/helpers/plugin-inventory.cjs`**: lists the `.js` files, treats a file as bridged when it contains `dualPlugin('<stem>'`, and reports unlisted files, manifest entries with no file and files that are both bridged and listed.
- **`tests/plugin-inventory.json`**: `nativeDual` (sk-vision with its reason), `skippedHooks` (empty) and `events` split into `passThrough`, `notDelivered` and `unverified`.
- **`tests/plugin-inventory.test.cjs`**: the folder check, a probe-folder check of the three problem messages, the skipped-hook check per bridged plugin and the two event-name checks.
- **`lib/v2-bridge.js`**: exports `MAPPED_HOOKS`, `EVENT_ALIASES` and `EVENT_MAPPINGS` so the event check reads the real tables.

### Data Flow
The helper reads the folder. `v2-registration.test.cjs` loops over every bridged stem. `v2-hard-plugins.test.cjs` keeps its hand-written behavior cases and checks them against the inventory. The inventory test imports each bridged plugin, runs `setup` on a stub context and compares `cleanup.skippedKeys` with the manifest, then scans each plugin's source for `type === '<name>'` comparisons and checks each name against the bridge tables and the manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The baseline is the plugin suite at 397 passed and both battery families (`scratch/baseline/`). Each new or changed test is proven by a mutation in a temporary copy of the worktree (`scratch/mutation/`). The suite and both batteries are rerun after the change and after the main merge. The v2 battery runs from a clone outside the main checkout, because inside a nested worktree OpenCode 2 also loads the main checkout's plugins and reports duplicate plugin IDs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The fix list in `../014-post-merge-deep-research/research/research.md`, rows 6, 7, 8 and 30, and OpenCode 2.0.32 for the observation.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commits. The bridge change is one export line, and no plugin behavior changed.
<!-- /ANCHOR:rollback -->

---
