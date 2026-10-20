---
title: "Implementation Plan: Phase 30: nested-worktree-battery"
description: "The battery's v2 read detects an ancestor `.opencode/plugins` folder and, only then, starts its private server with OpenCode 2's project walk off and the root's own `.opencode` as the config folder, so the root's plugins are judged instead of failing as duplicates of the outer checkout's."
trigger_phrases:
  - "nested worktree battery plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 30: nested-worktree-battery

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (the doctor battery), Markdown docs |
| **Framework** | None |
| **Storage** | None; the private v2 server's database lives in a temporary folder |
| **Testing** | `node --test`, with a fake `opencode2` script for the real `readV2` path |

### Overview
OpenCode 2.0.32 merges the `.opencode` folder of every ancestor directory, so in a worktree nested inside the main checkout the outer checkout's 17 plugins register first and the worktree's 17 fail as duplicate IDs. The battery now finds any ancestor plugin folder and, only in that case, starts its private server with `OPENCODE_CONFIG_PROJECT_DISABLE=1` and `OPENCODE_CONFIG_DIR=<root>/.opencode`, the two switches OpenCode 2 reads. The plugin-active result names each ancestor folder in an `isolated:` line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed by a private-server read, a plain-clone comparison and the OpenCode 2 source
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing, with each new test failing on a mutant
- [x] Docs updated (spec/plan/tasks, ARCHITECTURE.md, the worktree reference)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A pure helper chooses the private server's environment, and the v2 legs learn whether the read was isolated.

### Key Components
- **`ancestorPluginDirs(root)`**: walks from the root's parent to the filesystem root and lists each `<dir>/.opencode/plugins` that exists.
- **`v2ServerEnv(env, root, temp)`**: builds the private server's environment and adds the two switches only when that list is non-empty.
- **`readV2`**: starts the private server with the environment `v2ServerEnv` builds and returns `shadowing` beside the reads.
- **`legPluginActive(..., shadowing)`**: puts one `isolated:` line per ancestor folder first in its details, and fails on any entry whose source sits in an ancestor folder, since such an entry means OpenCode 2 ignored the switches.
- **`allowedCommandSources(..., isolated)`**: stops allowing an ancestor's commands when the read was isolated, so an ancestor-only command fails command-listed there.

### Data Flow
`readV2` asks `v2ServerEnv` for the environment (its helper `ancestorPluginDirs` resolves the root to its real path before walking), starts `opencode2 serve` with it, reads the plugin, skill and command endpoints, and returns `shadowing` beside the reads. `legsForV2` passes `shadowing` to `legPluginActive`, and for an isolated read builds the command allowlist with the root's own `.opencode` as the config folder and the ancestor walk off. With no ancestor plugin folder, `shadowing` is empty and every leg judges exactly as before.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The fake `opencode2` script answers the way OpenCode 2 does: under an outer checkout with the walk on, the outer plugin is active and the root's copy fails with `Duplicate plugin ID`; with the walk off and the config folder set to the root's `.opencode`, only the root's plugin, skills and commands load; with the walk off and no config folder, none do. A second mode models an OpenCode 2 that ignores the switches, returning the outer plugin and an outer-only command beside the root's. Eight mutation runs each fail at least one test: m1 the old battery, m2 isolation for every root, m3 no config folder, m4 the walk left on, m5 no realpath, m6 no ancestor-entry check, m7 the ancestor command walk left on under isolation, m8 the allowlist built from the caller's config folder. The live checks run the real battery on both families in worktree 169 and in a plain clone under the scratchpad, and read OpenCode 1's `plugin_origins` in the worktree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

OpenCode 2.0.32 reads `OPENCODE_CONFIG_PROJECT_DISABLE` (alias `OPENCODE_DISABLE_PROJECT_CONFIG`) and `OPENCODE_CONFIG_DIR`, shown in `scratch/rootcause/summary.txt`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The battery then fails v2 plugin-active in a nested worktree again, as it did before; CI and plain checkouts are unaffected either way.
<!-- /ANCHOR:rollback -->

---
