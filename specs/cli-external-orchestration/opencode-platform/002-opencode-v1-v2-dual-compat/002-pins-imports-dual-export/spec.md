---
title: "Feature Specification: Phase 2: pins-imports-dual-export"
description: "Makes the 11 mechanical OpenCode plugins load on v1 1.19.3 and v2 2.0.32 with v1 behaviour unchanged, and pins both package folders to the target versions."
trigger_phrases:
  - "pins imports dual export"
  - "phase 2 pins imports dual export"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: pins-imports-dual-export

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/143-opencode-dual-compat-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 11 |
| **Predecessor** | 001-unknowns-and-baseline |
| **Successor** | 003-hard-plugins |
| **Handoff Criteria** | `opencode2 api GET /api/plugin` lists the 11 mechanical plugins as active, the v1 load capture shows each one loaded, the plugin suite meets its phase 1 floor and each ported plugin has a v2 registration case that failed before its port. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The 11 mechanical plugins, the two package folders and their lock files, one identity helper and two core modules under `.opencode/plugins/lib/`, the nine test files that call a default export and one v2 registration test file. The five hard plugins (phase 3) and the dispatch guards (phase 5) are outside the boundary.

**Dependencies**:
- Phase 1 closed, with `001-unknowns-and-baseline/baseline.json` and the decision changes written into the parent spec.
- npm registry access for the pinned installs. A block stops the installs and is recorded as a finding (task T002).
- Three orchestrator decisions recorded before any install or port (task T003). They cover the import-site split, the reading of "guards" and the placement of the `@opencode/plugin` dev dependency.
- The phase 1 verdict on Q7, which asks whether a zod JSON Schema satisfies `Tool.ValueSchema`. The helper waits on that verdict (task T007).

**Deliverables**:
- Both package folders pinned, with regenerated lock files.
- `.opencode/plugins/lib/tool-identity.js`, which replaces the `@opencode-ai/plugin/tool` import in `system-speckit-completion.js`.
- The 11 mechanical plugins, each with a `{ id, setup, server }` default export.
- Two core modules, `classifier-injection-screen-core.js` and `sk-code-post-edit-quality-core.js`, which hold the test seams that were on the two plugin entry modules.
- `.opencode/plugins/tests/v2-registration.test.cjs`, with one case per ported plugin.
- The nine test files moved to the new export shape, with the plugin suite still at or above the phase 1 floor.

**Executor (D6)**: GPT-6 Luna max fast through cli-codex writes the code, with `--sandbox workspace-write`. DeepSeek V4.1 Flash max through cli-devin reviews it. The orchestrator runs the installs, the tests and the v1 and v2 checks, because the codex sandbox blocks local sockets.

**Frozen decisions that bind this phase**: The parent goal carries decisions D1 to D8. This table records what each one means for phase 2.

| ID | Effect on this phase |
|----|----------------------|
| D1 | Each of the 11 plugins gains a `{ id, setup, server }` default export. The v1 `server` entry keeps the current function and its hook bodies. |
| D2 | `opencode.json` is not touched. Phase 4 owns it. |
| D3 | No child dispatch runs in this phase. The v2 reads use `api GET` with the raw query. |
| D4 | No step stops, starts or restarts the v2 background service. |
| D5 | Both package folders pin `@opencode-ai/plugin` to exactly 1.19.3, declare `zod`, and list `@opencode/plugin` 2.0.32 as a type-only dev dependency. Task T004 tests whether that placement is safe on v1. |
| D6 | Code goes to Luna through cli-codex. Review goes to DeepSeek through cli-devin. The orchestrator reruns every test. |
| D7 | Every changed plugin, the helper, the core modules and the new test follow the sk-code OPENCODE surface. |
| D8 | No public compatibility claim is written in this phase. |
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 11 mechanical plugins export one default function, which is the v1 `server` entry. Research iteration 14 shows that a definition exporting only one entry point is a silent no-op on the other host (`research/iterations/iteration-014.md`, finding F1). v2 therefore does not run these plugins.

The `tool` helper comes from `@opencode-ai/plugin/tool`. In v1 it is an identity function, and its `schema` property is zod (`research/iterations/iteration-011.md`, findings F1 and F2). One mechanical plugin imports it, and the two hard plugins import it too. Once the import goes, zod must be declared directly. Both package folders still pin `@opencode-ai/plugin` to 1.18.34, and neither declares zod.

### Purpose
Each of the 11 plugins loads and runs on v2 as well as v1. The v1 hook bodies stay as they are. Both package folders carry the pins that phases 3 to 11 build on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The pins from D5 in `.opencode/package.json` and `.skilled/package.json`, with installs that regenerate both lock files.
- A local identity helper that stands in for the `tool` import in `system-speckit-completion.js`. It sets `tool.schema` to zod, as v1 does.
- A `{ id, setup, server }` default export for each of the 11 plugins. The `server` entry keeps the current function. The `setup` entry builds the v2 leg on `ctx.tool.hook`, `ctx.event.subscribe` and `ctx.session.hook("context")` where a plugin needs them.
- Module state created inside `setup` and reset in its cleanup. Per-session state keyed by session ID.
- The test seams of `classifier-injection-screen` and `sk-code-post-edit-quality` move into their new core modules. The seams of `cli-dispatch-audit` and `system-speckit-completion` are removed, because no test reads them and their core modules already export the same values.
- The nine test files that call a default export of one of the 11 plugins move to the new shape. The hard-plugin tests do not change.
- A v2 registration case for each ported plugin.

### Out of Scope
- The five hard plugins: `system-completion-sentinel`, `system-spec-gate`, `system-skill-advisor`, `opencode-goal` and `sk-vision`. The brief ports them in phase 3 because their v2 trigger differs in kind. Their two `@opencode-ai/plugin/tool` import sites stay as they are in this phase, unless the orchestrator amends the split (see Open Questions).
- The dispatch guards, which phase 5 owns. The brief says "guards (005)". This spec reads that as the dispatch rule code. The three plugins whose names end in `-guard` stay in this phase, because the brief lists them among the 11 mechanical plugins.
- `opencode.json`, agents and commands. Phase 4 owns them.
- The cli-opencode code. Phase 6 owns it.
- The plugin README and other docs. Phase 10 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/package.json` | Modify | Pin `@opencode-ai/plugin` to exactly 1.19.3, declare `zod`, and list `@opencode/plugin` 2.0.32 as a type-only dev dependency (D5). |
| `.opencode/package-lock.json` | Modify | Regenerated by `npm install` in `.opencode/`. |
| `.skilled/package.json` | Modify | The same pins as `.opencode/package.json`. |
| `.skilled/package-lock.json` | Modify | Regenerated by `npm install` in `.skilled/`. |
| `.opencode/plugins/lib/tool-identity.js` | Create | Identity helper for `tool`, with `tool.schema` set to zod. It matches the v1 `tool.js` shape. |
| `.opencode/plugins/lib/classifier-injection-screen-core.js` | Create | Holds `SCREEN_TOOL`, `MAX_PENDING_ADVISORIES`, `MAX_SESSIONS`, `UNKNOWN_SESSION` and `sessionIdOf`, moved out of the entry module. |
| `.opencode/plugins/lib/sk-code-post-edit-quality-core.js` | Create | Holds `PLUGIN_DIR`, `MUTATING_TOOLS`, `MAX_CALL_IDS`, `MAX_PENDING_FINDINGS`, `filePathFromArgs`, `createCorrelationMap` and `formatFinding`, moved out of the entry module. |
| `.opencode/plugins/system-speckit-completion.js` | Modify | Replace the `tool` import at line 28 with the helper. Wrap the default export. Remove the `__test` seam at line 90. |
| `.opencode/plugins/classifier-injection-screen.js`, `cli-dispatch-audit.js`, `sk-code-post-edit-quality.js`, `session-cleanup.js`, `mcp-route-guard.js`, `codex-hooks-watchdog.js`, `sk-git-message-gate.js`, `sk-git-preflight-advisory.js`, `system-deep-loop-guard.js`, `system-dist-freshness-guard.js` | Modify | Wrap each default export as `{ id, setup, server }` and add the v2 `setup` leg. The `__test` seam of `cli-dispatch-audit.js` is removed. The seams of the other two move to their core modules. |
| `.opencode/plugins/tests/classifier-injection-screen.test.cjs`, `sk-code-post-edit-quality.test.cjs`, `system-deep-loop-guard.test.cjs`, `system-dist-freshness-guard.test.cjs`, `system-speckit-completion.test.cjs`, `mcp-route-guard.test.cjs`, `sk-git-message-gate.test.cjs`, `session-cleanup.test.cjs`, `source-root-consumers.test.cjs` | Modify | Call `.server` where a test calls the default export. Replace the `typeof default === 'function'` checks with the object shape. Read the two moved seams from their core modules. |
| `.opencode/plugins/tests/v2-registration.test.cjs` | Create | One v2 registration case per ported plugin. The file name is a proposal. |
| `.opencode/plugins/system-skill-advisor.js`, `opencode-goal.js`, `tests/system-skill-advisor.test.cjs` | Not changed here | These hold the other two `@opencode-ai/plugin/tool` import sites and one test stub. Phase 3 owns them unless the orchestrator amends the split. |

### Recorded Deviations

Four deviations were recorded during the phase and are reflected in the file list above where they widen it.

- Decision 8: one shared bridge, `.opencode/plugins/lib/v2-bridge.js`, builds every v2 `setup` leg from the unchanged v1 `server`, instead of 11 hand-written setup bodies.
- Decision 10: the scope adds `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`, the import-time `argv[1]` fix for the Bun-compiled v2.
- Decision 9: tool results convert to the v2 `{ content, metadata }` shape. A live v2 `execute` of a bridged tool is not yet observed, and the call is owed before phase 3 closes.
- Decision 13: v2 session event delivery is unit-tested and type-checked, not observed live.

**Status note:** All ten acceptance rows are Met, so the status above is Complete.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `opencode2 api GET /api/plugin` lists each of the 11 mechanical plugins as active. |
| REQ-002 | The v1 plugin load capture shows each of the 11 loaded, with no `failed to load plugin` line. |
| REQ-003 | The plugin suite passes at or above the phase 1 floor, with zero failures. |
| REQ-004 | Each ported plugin has a v2 registration case. The case fails against the unported copy and passes against the ported copy. |
| REQ-005 | No step stops, starts or restarts the v2 background service. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Both package folders pin `@opencode-ai/plugin` to exactly 1.19.3, declare `zod`, and list `@opencode/plugin` 2.0.32 as a dev dependency. Both lock files are regenerated. |
| REQ-007 | `@opencode-ai/plugin/tool` appears only in the files that phase 3 owns after this phase. |
| REQ-008 | Each of the 11 entry modules exports only its default, and none carries a `__test` seam. |
| REQ-009 | `git status --porcelain` changes stay inside the file list in section 3. |
| REQ-010 | The DeepSeek review finds no open P0 or P1 item against `sk-code/sk-code-opencode`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 plugins show as active on v2, and each loads on v1 with no failed-to-load line.
- **SC-002**: The plugin suite is green, and its pass count is at or above the phase 1 floor.
- **SC-003**: Each v2 registration case fails against the unported copy and passes against the ported copy.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | npm registry access for the pinned versions | Without it the pins cannot install. | Task T002 tests the registry. A block stops this phase and is recorded. |
| Dependency | The phase 1 floor in `001-unknowns-and-baseline/baseline.json` | Without it the suite count has no floor. | Task T001 copies the floor into `scratch/baseline-floor.txt`. The phase starts only after phase 1 closes. |
| Dependency | The orchestrator's three decisions (import sites, guards, dev dependency placement) | Changing the import split widens the files touched in this phase. | Task T003 records the decisions. Tasks T005 and T010 wait for them. |
| Dependency | The phase 1 verdict on Q7 | The helper must match what v2 accepts for tool arguments. | Task T007 waits for that verdict. |
| Risk | The `@opencode/plugin` dev dependency is installed on v1 | Research iteration 11 rejects a 2.x pin in `.opencode/package.json` because v1 auto-installs that file. Whether v1 installs a dev dependency is not established. | Task T004 checks it in a throwaway copy. If v1 installs it, the entry moves to `.skilled/package.json` only, and the orchestrator amends D5. |
| Risk | v2 reloads a changed plugin file only after a restart | The v2 check would read a stale plugin set, and D4 forbids a restart. | Phase 1 answers this question. Task T026 uses that answer. A blocked read is recorded as blocked, not restarted. |
| Risk | v2 activation is not request-scoped, so module state is shared | State could leak between sessions (research iteration 14, finding F5). | State lives inside `setup`, is keyed by session ID and resets in cleanup (L2). |
| Risk | The v2 daemon keeps the environment it started with | A registration case that reads the environment passes or fails by accident (research iteration 14, findings F2 and F8). | The registration cases build a stub context and set no environment variable. |
| Risk | A named export drops the whole plugin file | Several entry modules already warn about this in their comments, for example `classifier-injection-screen.js`. A new named export would break a plugin on load. | The wrap adds no named export. Task T027 greps for any `export` line other than the default. |
| Risk | A test calls the default export after the wrap | The call fails because the default is now an object. | Each test file changes in the same task as its plugin. Task T027 greps for leftover direct calls. |
| Risk | A moved seam breaks a reader | A test reads a symbol from the old entry module. | The two readers move in the same task as their seam (T011 and T013). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The wrap adds no work to the v1 hook path. The v1 hook bodies stay as they are.
- **NFR-P02**: The v2 `setup` leg registers each hook once at load time, and not once per event.

### Security
- **NFR-S01**: The identity helper returns its argument and adds no behaviour.
- **NFR-S02**: The installs use the committed lock files, so a version in a lock file does not float to a newer release.

### Reliability
- **NFR-R01**: Each dispatch changes one plugin, and the plugin suite runs before the next dispatch.
- **NFR-R02**: The v2 `setup` leg does not swallow a registration error. A missing hook on the context fails the registration case.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A plugin with no event hook makes no `ctx.event.subscribe` call.
- A default export without `id`, `setup` or `server` fails the registration case for that plugin.
- Each wrapped file grows by one export block and one `setup` leg. This phase sets no size limit.

### Error Scenarios
- External service failure: the npm registry refuses a pinned version. The install stops, and the block is recorded.
- Network timeout: the install is retried once. A second failure is recorded as a finding.
- Concurrent access: two dispatches never change the same plugin file. Dispatches run one at a time.

### State Transitions
- Partial completion: plugins already ported keep their change. The rest stay v1 only, and the implementation summary lists them.
- Session expiry: this phase holds no session across dispatches, so this case cannot arise.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 11 plugins, two core modules, two package folders and their lock files, a helper, nine test files and a new registration file. |
| Risk | 18/25 | The v1 hook path, the D5 dev dependency question, the v2 reload question and the shared v2 state. |
| Research | 8/20 | The inputs come from research sections 3 and 9 and from iterations 11 and 14. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Import sites in phase 3 files.** The brief's scope-in says to replace the three `@opencode-ai/plugin/tool` imports here. Its scope-out puts two of those files, `system-skill-advisor.js` and `opencode-goal.js`, in phase 3. This spec replaces only the import in `system-speckit-completion.js`. If the orchestrator wants all three replaced here, task T010 widens to those two files and to the test stub, and phase 3 starts from there.
- **The word "guards" in the brief.** The brief scopes out "guards (005)". This spec reads that as the dispatch rule code, and it keeps the three `-guard` plugins in this phase. The orchestrator confirms the reading in task T003.
- **The `@opencode/plugin` dev dependency on v1.** Research iteration 11 rejects a 2.x pin in `.opencode/package.json`. Task T004 settles whether v1 installs a dev dependency from that file. If it does, the orchestrator amends D5.
<!-- /ANCHOR:questions -->
