---
title: "Feature Specification: Phase 28: plugin-kill-switch-coverage"
description: "Two OpenCode plugins sit outside the shared kill switches: system-speckit-completion reads only its own switch, and only the value 1, and the sk-vision plugin reads no switch at all. This phase routes both through the shared hook-flags resolver on OpenCode 1 and OpenCode 2."
trigger_phrases:
  - "plugin kill switch coverage"
  - "phase 28 plugin kill switch coverage"
  - "sk-vision kill switch"
  - "speckit completion master switch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 28: plugin-kill-switch-coverage

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/166-plugin-kill-switch-coverage` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 28 |
| **Predecessor** | 026-ci-and-test-runners |
| **Successor** | None |
| **Handoff Criteria** | Both plugins register nothing with `SYSTEM_HOOKS_DISABLED=1` or their concern switch set, on the v1 `server` and the v2 `setup`; the new tests fail on the old code; the two-version battery passes on CI at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the OpenCode v1 and v2 dual-compatibility packet. It closes item 5 of the open-work list that followed the post-merge fix groups: the two kill-switch gaps that `.opencode/plugins/ARCHITECTURE.md` records under its known gaps.

**Scope Boundary**: the two plugins' switch checks, their tests, and the doc lines that describe the gap. No change to the shared resolver, and no new switch names.

**Dependencies**:
- `.skilled/hooks/shared/hook-flags.cjs`, the shared resolver every other bridged plugin calls.
- The sk-vision build (`bun run build` in `vision-runtime`), which turns `src/plugin.ts` into the `dist/plugin.js` bundle that `.opencode/plugins/sk-vision.js` links to.

**Deliverables**:
- `system-speckit-completion.js` honors the master switch and its concern switch through the resolver.
- The sk-vision plugin honors the master switch and `SYSTEM_SK_VISION_DISABLED` on both hosts.
- A test per plugin that fails on the old code.
- `ARCHITECTURE.md` and the plugins README no longer list these two as gaps.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo's master switch `SYSTEM_HOOKS_DISABLED` silences every hook and plugin except three. `sk-git-message-gate.js` is switchless by design, because the commit and push rules carry no bypass. The other two are gaps. `system-speckit-completion.js` checks only `SYSTEM_SPECKIT_COMPLETION_DISABLED === '1'`, so the master switch, the older `MK_HOOKS_DISABLED`, values such as `true`, and the switch file `hook-flags.env` all leave its tool registered. The sk-vision plugin reads no switch at all, so on OpenCode 2 its `/vision` command and prompt hook register even with every hook switched off, and on OpenCode 1 only the plugin option `enabled: false` stops it.

### Purpose
An operator who sets the master switch, or a plugin's own concern switch, gets these two plugins registering nothing, on both OpenCode lines. Sixteen of the seventeen plugins now stop their work under the master switch; a few of those keep a status tool registered to report that they are off, as the plugins README describes. `sk-git-message-gate.js` stays switchless.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `system-speckit-completion.js`: replace the bare env check with `isHookEnabled('completion')`, the concern whose aliases already list `SYSTEM_SPECKIT_COMPLETION_DISABLED`.
- `vision-runtime/src/plugin.ts`: check `isHookEnabled('sk-vision')` in the v1 `server` and the v2 `setup`, the concern the Devin hook already uses. A disabled plugin returns only `dispose` on v1 and registers nothing on v2. If the resolver cannot be loaded, the plugin stays on, matching the resolver's own fail-open rule.
- Tests: the speckit-completion test gains the master switch, its alias on `server` and `setup`, and a truthy non-`1` value on `server`; the sk-vision plugin test gains the master and concern switches on `server` and `setup`.
- Docs: the kill-switch paragraph and the known-gaps list in `.opencode/plugins/ARCHITECTURE.md`, and any README line that repeats the gap.

### Out of Scope
- `sk-git-message-gate.js`, which also has no switch. It was not part of this item; recorded as a follow-up.
- The unloaded `hooks/opencode/sk-vision.ts` adapter. OpenCode loads `vision-runtime/dist/plugin.js`, so the switch belongs there.
- The Pi and Cursor sk-vision adapters, which are not OpenCode plugins.
- Committing the built bundle `hooks/opencode/sk-vision.js`, which is git-ignored and never committed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/system-speckit-completion.js` | Modify | Resolve the switch through `hook-flags.cjs` |
| `.opencode/plugins/tests/system-speckit-completion.test.cjs` | Modify | Master switch, alias and truthy value, on v1 and v2 |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modify | Switch check in `server` and `setup` |
| `.skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts` | Modify | Master and concern switch cases |
| `.opencode/plugins/ARCHITECTURE.md` | Modify | Drop the two gaps |
| `.opencode/plugins/README.md` | Modify | Only if it repeats the gap |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `system-speckit-completion` registers nothing with the master switch on | With `SYSTEM_HOOKS_DISABLED=1`, `server` returns `{}` and `setup` registers no tool; the new test fails on the old file |
| REQ-002 | The sk-vision plugin registers nothing with the master or its concern switch on | With `SYSTEM_HOOKS_DISABLED=1` or `SYSTEM_SK_VISION_DISABLED=1`, `server` returns only `dispose` and `setup` registers no command, hook or tool; the new tests fail on the old source |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both plugins still load and register normally with no switch set | The full plugin suite and the sk-vision suite pass; the two-version battery passes on CI at the pushed commit |
| REQ-004 | The docs no longer call these two plugins exceptions | `ARCHITECTURE.md` lists only `sk-git-message-gate.js` as switchless |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new test fails against the old code and passes against the new, recorded under `scratch/mutation/`.
- **SC-002**: The plugin suite stays at its baseline of 417 passing plus the new cases, and the sk-vision suite at 76 plus the new cases, with no failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The bundle reaches `hook-flags.cjs` through a relative path from `dist/` | A wrong path would leave the switch unread | Resolve from the bundle's real path, so the `.opencode/plugins/sk-vision.js` symlink does not shift it, and test the built bundle as well as the source |
| Risk | The `completion` concern also answers to `SYSTEM_COMPLETION_SENTINEL_DISABLED` | Switching off the sentinel also drops the completion tool | This is the resolver's existing alias design, which already groups both names under one concern; recorded, not changed |
| Risk | A switch read at plugin load ignores a later change | Changing the switch needs a restart | The same holds for every plugin that checks at load, such as `system-dist-freshness-guard.js` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
