---
title: "Feature Specification: Phase 59: cross-cli-map-refresh"
description: "`.skilled/CROSS-CLI.md` is the map of how the seven runtime folders derive from `.skilled/`, and it has drifted from the tree it describes: it says every plugin imports the plugin SDK when none imports it at run time and two only name it in JSDoc type comments, never mentions OpenCode 2 or the `.markdown` rule or the dual-version CI, lists two files that do not exist, carries counts from before several surfaces were added, and omits entries a reader needs. This phase corrects the map so a reader can trust it, without changing any runtime folder or generator."
trigger_phrases:
  - "cross cli map refresh"
  - "phase 59 cross cli map refresh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 59: cross-cli-map-refresh

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-22 |
| **Branch** | `worktrees/204-cross-cli-map-refresh` |
| **Parent Spec** | ../spec.md |
| **Phase** | 59 of 59 |
| **Predecessor** | 057-v4-0-0-13-reliability-fixes |
| **Successor** | None |
| **Handoff Criteria** | `.skilled/CROSS-CLI.md` matches the tree, passes `validate_document.py`, and a read-only review finds no wrong number |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 59** of the OpenCode v1 and v2 dual compatibility packet. It is a docs phase over one file, run last, after the OpenCode 1 and 2 work closed and the packet's earlier phases changed the surfaces the map describes.

**Scope Boundary**: `.skilled/CROSS-CLI.md` and nothing else. No runtime folder, generator, plugin, hook or skill is edited, and no suite is changed.

**Dependencies**:
- The git tree itself: `git ls-tree` for each count the map states, since a count that is right today is what the map is for.
- The two generator `--check` runs that print the live totals: `sync-runtime-mirrors.cjs` reports 194 mirrors across 8 trees and `sync-hook-registrations.cjs` reports 32 hooks across 4 registration files with 19 Pi extensions resolving.
- The OpenCode 1 and 2 dual-version work this packet completed, which the map did not mention: both versions load the same 17 plugins, both register every `*.md` file under a `commands/` folder at any depth, and the Dual-Version Battery and Plugin Tests workflows check both.

**Deliverables**:
- `.skilled/CROSS-CLI.md`, with the corrected plugin SDK claim, the OpenCode 2 paragraph, the corrected counts, the removed files that do not exist and the missing entries.
- This phase's four docs, filled from the scaffold.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/CROSS-CLI.md` exists so a reader can tell, for any surface, whether a runtime links it, generates it or authors it, and that answer decides where an edit belongs. The map has drifted from the tree: it says every plugin imports the plugin SDK when none imports it at run time and two only name it in JSDoc type comments, it never mentions OpenCode 2, the `.markdown` naming rule for non-command files in `commands/` or the dual-version CI, it lists `.codex/AGENTS.md` and `.devin/config.local.json` where the second file is `config.json` and neither exists, and it omits `.claude/settings.local.json` being git-ignored. Its counts predate several surfaces: agents, plugins, commands and prompts, Pi prompts, the four hook link counts, Pi's extension links, the mirror total and the hook registry all read low, and `repo-rules` links, `.opencode/scripts`, `.opencode/package-lock.json`, `.devin/skills` and three Pi entries appear nowhere.

### Purpose
Bring the map back in line with the tree, so a reader who follows it lands on a real file and a real count.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The plugin SDK claim: no `.opencode/plugins/*.js` imports the plugin SDK at run time; two name it only in JSDoc type comments, and `.opencode/package.json` supplies those types. `.opencode/plugins/` holds 16 authored plugin files plus `sk-vision.js`, a link to the built bundle.
- OpenCode 2 coverage: the same 17 plugins load on both versions through the dual export, both versions register every `*.md` file under `commands/` at any depth so a non-command file there is named `.markdown`, and two workflows check both versions.
- Every count in sections 2 and 4: agents 11 plus the Claude-only `Explore.md`, OpenCode plugins 17, commands and prompts 38, Pi prompts 40, hook links 27 for Claude and 22 each for Codex and Cursor and 25 for Devin, Pi extension links 19 plus one shared adapter under `extensions/lib/`, runtime mirrors 194 across 8 trees, hook registry 32.
- The files that do not exist: drop `.codex/AGENTS.md` and `.devin/config.local.json`, name `.devin/config.json`, and say that `.claude/settings.local.json` is a per-machine file git ignores rather than a map entry.
- The missing entries: `repo-rules` links in every runtime, `.opencode/scripts`, `.opencode/package-lock.json`, `.devin/skills`, and Pi's `pi-blackhole-config.json`, `pi-cache-optimizer-config.json` and `types/`.
- The statement that each generator's `--check` prints the live count and the live count wins, so the kept counts are a snapshot rather than a promise.
- One writing brief and one separate read-only review round whose findings are fixed rather than waived.

### Out of Scope
- Any runtime folder or generator: this phase edits one markdown file, so no symlink, generated file, hook or script changes.
- Removing the counts in favour of pointing at the generators, because the counts are what the map is for; they stay, with the live-count rule stated beside them.
- Code, suites and CI workflows.
- `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` beyond the phase map and handoff rows for this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/CROSS-CLI.md` | Modify | Corrected plugin SDK claim, OpenCode 2 and `.markdown` coverage, corrected counts, removed non-existent files, added missing entries, live-count rule |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 059 and the 057 to 059 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The plugin SDK claim matches the tree: no plugin imports it at run time, two name it only in JSDoc type comments, and `.opencode/package.json` supplies those types. | The map says the types come from `package.json`; `.opencode/plugins/` holds 16 authored `.js` files plus the `sk-vision.js` link, no file imports `@opencode-ai/plugin` at run time, and `grep -l '@opencode-ai/plugin' .opencode/plugins/*.js` returns the two files whose only use is a JSDoc type comment. |
| REQ-002 | OpenCode 2, the `.markdown` rule and the dual-version CI are stated. | The map says both versions load the same 17 plugins, that both register every `*.md` file under a `commands/` folder at any depth so a non-command file there is named `.markdown`, and that the OpenCode Dual-Version Battery and OpenCode Plugin Tests workflows check both. |
| REQ-003 | Every count in the map matches `git ls-tree` or a generator's `--check` output. | Agents 11 plus the Claude-only `Explore.md`, OpenCode plugins 17, commands and prompts 38, Pi prompts 40, hook links 27 for Claude and 22 for Codex and Cursor and 25 for Devin, Pi extension links 19 plus one shared adapter under `extensions/lib/`, mirrors 194 across 8 trees, hook registry 32; each equals the tree, and `sync-runtime-mirrors.cjs --check` prints 194 and `sync-hook-registrations.cjs --check` prints 32. |
| REQ-004 | No file the map names is missing, and no existing file is left out of a list it belongs in. | `.codex/AGENTS.md` and `.devin/config.local.json` appear nowhere; `.devin/config.json` is named; `.claude/settings.local.json` is described as git-ignored rather than listed as map content. Every path the map names resolves on disk. |
| REQ-005 | The missing entries appear where a reader would look for them. | `repo-rules` links are named for every runtime that has one, and `.opencode/scripts`, `.opencode/package-lock.json`, `.devin/skills`, `pi-blackhole-config.json`, `pi-cache-optimizer-config.json` and `types/` each appear under their runtime. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The map keeps its counts and says how to check them. | The counts stay in sections 2 and 4, next to a sentence saying each generator's `--check` prints the live count and the live count wins. |
| REQ-007 | The map passes the content validator. | `validate_document.py` on `.skilled/CROSS-CLI.md` reports no error. |
| REQ-008 | A separate read-only reviewer checks every number, and its findings are fixed. | A read-only session that did not write the file compares each count and each named path against `git ls-tree` and the two `--check` runs, and `implementation-summary.md` records its verdict and any findings fixed. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who follows any path or count in the map lands on a real file and a real number.
- **SC-002**: A reader learns from the map that two OpenCode versions read the same `commands/` folder, so a non-command file there is named `.markdown`.
- **SC-003**: The map states how to re-check its counts, so the next drift is caught by running a generator rather than by re-reading the tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The git tree at the commit this phase reads | High | Every count was read from `git ls-tree` and the two `--check` runs in the same session that writes the edit, and the review round re-read them |
| Dependency | `sync-runtime-mirrors.cjs --check` and `sync-hook-registrations.cjs --check` | Med | Both were run before writing, printing 194 mirrors across 8 trees and 32 hooks, so the two totals have a source other than the doc they replace |
| Risk | A count is right when written and stale when read | Med | The map keeps the counts and states that each generator's `--check` prints the live count and that the live count wins |
| Risk | A corrected claim is corrected into a different wrong claim | High | A separate read-only reviewer that did not write the edit checks every number against the tree, and its findings are fixed rather than waived |
| Risk | Adding OpenCode 2 detail turns the map into a tutorial | Low | The detail is one paragraph in section 3 and one sentence on the `.markdown` rule, at the depth of the sections beside it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked on 2026-10-22 to fix the map's gaps, and named the corrections to make.
<!-- /ANCHOR:questions -->

---
