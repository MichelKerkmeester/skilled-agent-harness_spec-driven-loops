---
title: "Tasks: Phase 59: cross-cli-map-refresh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cross cli map refresh tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 59: cross-cli-map-refresh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-derive every fact from the tree rather than the map: `git ls-tree` for the agent, plugin, command, prompt, hook-link and extension counts, and the two generator `--check` runs for the totals they own, which printed 194 mirrors across 8 trees and 32 hooks with 19 Pi extensions resolving (`.skilled/CROSS-CLI.md`)
- [x] T002 Scaffold this phase folder from the templates and bind the parent phase map row for 059 (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Brief 1: correct the plugin SDK claim to the tree's fact that no plugin imports it at run time, that two plugins name it only in JSDoc type comments and that `.opencode/package.json` supplies those types - `.opencode/plugins/*.js` - and state the dual-version facts the map never carried, that both OpenCode versions load the same 17 plugins through one `{ id, setup, server }` default export, that both register every `*.md` file under a `commands/` folder at any depth so a non-command file there is named `.markdown`, and that the Dual-Version Battery runs on both versions while Plugin Tests runs the unit tests once (`.skilled/CROSS-CLI.md`)
- [x] T004 Brief 1, continued: replace the stale counts - agents 11 plus the Claude-only `Explore.md`, OpenCode plugins 16 authored files plus the `sk-vision.js` link, commands and prompts 38, Pi prompts 38 generated plus the authored `goal-pi.md` and `vision.md`, hook links 27 for Claude and 22 each for Codex and Cursor and 25 for Devin, Pi extension links 19 plus one shared adapter under `extensions/lib/`, mirrors 194 across 8 trees, hook registry 32 (`.skilled/CROSS-CLI.md`)
- [x] T005 Brief 1, continued: drop `.codex/AGENTS.md` and `.devin/config.local.json`, name `.devin/config.json` in its place, describe `.claude/settings.local.json` as git-ignored, and add the missing entries - `repo-rules` links in every runtime, `.opencode/scripts`, `.opencode/package-lock.json`, `.devin/skills`, `pi-blackhole-config.json`, `pi-cache-optimizer-config.json` and `types/` - with the sentence that each generator's `--check` prints the live count and the live count wins (`.skilled/CROSS-CLI.md`)
- [x] T006 Read-only DeepSeek review rounds, then fix their findings: separate sessions that did not write the edit checked every count against `git ls-tree` and the two `--check` runs, and every path the map names against disk. Round 1 returned FAIL with 1 P1 (the Pi prompt count) and 4 P2s; round 2 returned PASS with 3 P2s, two fixed in pass 4 and one left as written because it is the map's level of detail (`.skilled/CROSS-CLI.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run `validate_document.py` over the map and require no error (`.skilled/CROSS-CLI.md`)
- [x] T008 Run the markdown link check over the map, so every relative and repository path it names resolves (`.skilled/CROSS-CLI.md`)
- [x] T009 Validate strictly, this phase first and then 082 recursively: `validate.sh 059-cross-cli-map-refresh --strict` then `validate.sh 082-opencode-v1-v2-dual-compat --recursive` (`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/`)
- [ ] T010 Push to main and record CI at the pushed commit (`.skilled/CROSS-CLI.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every task marked `[x]`: T010 stays open until the commit is on main and CI has run on it
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every count in the map matches the tree, every path it names resolves, and the read-only review finds no wrong number
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The map itself**: See `.skilled/CROSS-CLI.md`
- **The generator totals**: See `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/`
<!-- /ANCHOR:cross-refs -->

---
