---
title: "Feature Specification: Phase 3: hard-plugins"
description: "Ports the five hard plugins, whose v2 trigger differs in kind, so each one loads and behaves on OpenCode 2.0.32 as well as on 1.19.3."
trigger_phrases:
  - "hard plugins"
  - "phase 3 hard plugins"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: hard-plugins

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/143-opencode-dual-compat-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 11 |
| **Predecessor** | 002-pins-imports-dual-export |
| **Successor** | 004-agents-commands-config |
| **Handoff Criteria** | All five hard plugins show as active on v2 and load on v1. Each has a v2 registration case that failed before its port. The completion sentinel and the spec gate each pass a v2 behaviour test. `sk-vision` is rebuilt and loads on both versions, or phase 1 recorded the blocker. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The five hard plugins, their core modules, the `sk-vision` source and its rebuilt bundle and the test files that read or call those five plugins. The 11 mechanical plugins (phase 2), the dispatch guards (phase 5) and the agent and config files (phase 4) are outside the boundary.

**Dependencies**:
- Phase 2 closed. Its helper `.opencode/plugins/lib/tool-identity.js` and its pins are in place, and the phase 2 plugin suite count is the floor for this phase.
- Phase 1 verdicts on Q5 (`session.idle` delivery), Q6 (`session.compacted` delivery), Q7 (zod against `Tool.ValueSchema`), Q11 (the `sk-vision` source and build), and the v2 reload question.
- The orchestrator's four decisions in task T003: the class of `system-skill-advisor`, the home of each seam, the `sk-vision` named export and the `sk-vision` package pin.
- The `@opencode/plugin` 2.0.32 type declarations in `.opencode/node_modules/`, read in task T004.

**Deliverables**:
- Five default exports, each `{ id, setup, server }`, with the v1 `server` body unchanged.
- Five v2 legs. Each leg uses only the hooks that the 2.0.32 types declare.
- Core modules for the seams that leave the default exports.
- `.opencode/plugins/tests/v2-hard-plugins.test.cjs`, with one registration case per plugin, a behaviour case for the completion sentinel and one for the spec gate.
- An `sk-vision` port that owns its command through `ctx.command.transform`, rebuilt into `dist/plugin.js`, or a recorded blocker.

**Executor (D6)**: GPT-6 Luna max fast through cli-codex writes the code, with `--sandbox workspace-write`. DeepSeek V4.1 Flash max through cli-devin reviews it. The orchestrator runs the installs, the builds, the tests and the v1 and v2 checks.

**Frozen decisions that bind this phase**: The parent goal carries decisions D1 to D8. This table records what each one means for phase 3.

| ID | Effect on this phase |
|----|----------------------|
| D1 | Each of the five plugins default-exports `{ id, setup, server }`. The default export carries no other key, so seams leave the default export. |
| D2 | `opencode.json` is not touched. Phase 4 owns it. |
| D3 | No child dispatch runs in this phase. The v2 reads use `api GET` with the raw query. |
| D4 | No step stops, starts or restarts the v2 background service. |
| D5 | The pins from phase 2 stay. The `sk-vision` package keeps its own pin until the orchestrator decides (see Open Questions). |
| D6 | Code goes to Luna through cli-codex. Review goes to DeepSeek through cli-devin. The orchestrator reruns every test and build. |
| D7 | Every changed plugin, core module and test follows the sk-code OPENCODE surface. The `sk-vision` source follows the same surface. |
| D8 | No public compatibility claim is written in this phase. |
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five plugins need more than a wrapper to run on v2. Research section 3 gives the reason for each. The completion sentinel reads assistant text, and v2 offers no message read, so it must cache that text from the event stream (`research/research.md`, the sentinel row). The `opencode-goal` plugin must rebuild its deadline and abort wrapper (the `opencode-goal` row). The `sk-vision` plugin owns its command through `ctx.command.transform`, and it loses a server-side toast on v2 (the `sk-vision` row). The spec gate ports directly (the `system-spec-gate` row).

Research marks `system-skill-advisor` as mechanical (the `system-skill-advisor` row, labelled "Mechanical"). The brief places it with the hard plugins, so this phase follows the brief and asks the orchestrator to confirm the class (see Open Questions). Research also records that no v2 compaction signal is proven for this plugin (`research/research.md` line 305, which cites iteration 018).

### Purpose
Each of the five plugins loads and behaves on v2 as well as v1. Each port keeps its v1 behaviour, and each v2 leg is proven by a test that fails before the port.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The v2 leg of `system-completion-sentinel`. It caches assistant text per session from the `session.idle` event stream, because v2 has no message read.
- The v2 leg of `system-spec-gate`. It reads the prompt with `session.hook("prompt")`, injects with `session.hook("context")` and denies with `tool.hook("execute.before")`.
- The v2 leg of `system-skill-advisor`. It reacts to the compaction event, injects with `session.hook("context")` and uses `ctx.tool.transform`. Its import moves to the helper from phase 2.
- The v2 leg of `opencode-goal`. It rebuilds the prompt queue on `ctx.session.prompt` with `delivery: "queue"`, and it rebuilds the deadline and abort wrapper.
- The `sk-vision` port. The command moves to `ctx.command.transform` in `.skilled/skills/sk-vision/vision-runtime/src/`. The bundle is rebuilt into `dist/plugin.js`.
- Defensive guards that return null on v2 become positive capability checks. The phase audits each one that it touches.
- The seams that leave the default exports, one core module each.
- Test changes for the five plugins, including the six `opencode-goal` test files and the `system-skill-advisor` test.

### Out of Scope
- Closing the server-side toast and the global command observer for `sk-vision`. Research marks both as irreducible on v2 (the `sk-vision` row).
- The 11 mechanical plugins, which phase 2 ported.
- `opencode.json`, agents and commands. Phase 4 owns them.
- The dispatch guards and the cli-opencode code. Phases 5 and 6 own them.
- The `sk-vision.js` symlink in `.opencode/plugins/`. It stays as it is.
- Any change to the `sk-vision` package pin, unless the orchestrator decides it in T003.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/system-completion-sentinel.js` | Modify | Wrap the default export at line 119. Add the v2 leg. Move the seam at line 170 to its core module. |
| `.opencode/plugins/system-spec-gate.js` | Modify | Wrap the default export at line 168. Add the v2 leg. Move the seam at line 301 to its core module. |
| `.opencode/plugins/system-skill-advisor.js` | Modify | Replace the `tool` import at line 24 with the phase 2 helper. Wrap the default export at line 935. Add the v2 leg. |
| `.opencode/plugins/opencode-goal.js` | Modify | Replace the `tool` import at line 16 with the phase 2 helper. Wrap the default export at line 3187. Add the v2 leg. Move the seam at lines 3364 to 3390 to its core module. |
| `.opencode/plugins/lib/completion-sentinel-core.js` | Create | Holds the symbols that the sentinel seam exposed. The path is a proposal, and T003 confirms it. |
| `.opencode/plugins/lib/system-spec-gate-core.js` | Create | Holds the symbols that the spec gate seam exposed. Created only if T003 keeps the seam. |
| `.opencode/plugins/lib/opencode-goal-core.js` | Create | Holds the symbols that the goal seam exposed. |
| `.opencode/plugins/tests/system-completion-sentinel.test.cjs` | Modify | Read the four `__test.core` references at lines 60, 86, 105 and 130 from the core module. |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modify | Change the default calls at lines 182, 509, 562 and 586 to `.server`. Change the function-type check at line 276. Replace the module stub at line 58 with the helper import. |
| `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs`, `opencode-goal-continuation.test.cjs`, `opencode-goal-lifecycle.test.cjs`, `opencode-goal-state.test.cjs`, `opencode-goal-supervisor.test.cjs`, `opencode-goal-tool-path.test.cjs` | Modify | Change the default calls to `.server`. The six files make 58 calls in total. |
| `.opencode/plugins/tests/opencode-goal-export-contract.test.cjs`, `opencode-goal-render-parity.test.cjs` | Modify | Read the seam from the core module. The export contract keeps its pinned key list. |
| `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | Create | One registration case per plugin, a sentinel behaviour case, a spec gate behaviour case, a goal queue case and an advisor payload case. |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modify | Register the command through `ctx.command.transform` on v2, and keep `command.execute.before` for v1. The named export at line 13 follows the T003 decision. |
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/` | Modify | The command module that `plugin.ts` imports as `./opencode/command.js`. Changed only as the port needs. |
| `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` | Build output | Rebuilt by `bun run build`. The folder `dist/` is gitignored. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `opencode2 api GET /api/plugin` lists all five hard plugins as active. |
| REQ-002 | The v1 plugin load capture lists all five loaded, with no `failed to load plugin` line. |
| REQ-003 | Each of the five plugins has a v2 registration case. Each case fails before the port and passes after it. |
| REQ-004 | The completion sentinel has a v2 behaviour test. It caches assistant text per session from the `session.idle` events. The test fails before the port and passes after it. |
| REQ-005 | The spec gate has a v2 behaviour test. It denies through `tool.hook("execute.before")`. The test fails before the port and passes after it. |
| REQ-006 | `sk-vision` is rebuilt from its source and loads on v1 and v2. If it cannot, phase 1 recorded its blocker, and this phase names it. |
| REQ-007 | The plugin suite reports zero failures and a pass count at or above the phase 2 floor. |
| REQ-008 | No step stops, starts or restarts the v2 background service. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The `opencode-goal` port enqueues prompts with `delivery: "queue"`, and a test asserts the payload. |
| REQ-010 | The `system-skill-advisor` port registers its context hook and its tool transform on v2, and a test asserts the payload. |
| REQ-011 | Each defensive guard that returned null on v2 is replaced by a positive capability check, and a grep audit lists each replacement. |
| REQ-012 | Each of the five default exports carries only `id`, `setup` and `server`. No seam key remains on a default export. |
| REQ-013 | `git status --porcelain` changes stay inside the file list in section 3. |
| REQ-014 | The DeepSeek review finds no open P0 or P1 item against `sk-code/sk-code-opencode`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five hard plugins show as active on v2, and each loads on v1 with no failed-to-load line.
- **SC-002**: The completion sentinel and the spec gate each pass a v2 behaviour test, and each test failed before the port.
- **SC-003**: `sk-vision` loads on both versions from a rebuilt bundle, or the phase 1 blocker is named here.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 closed, with its helper and its suite floor | Without them the imports and the floor do not exist. | Task T001 checks the phase 2 closure and copies the floor. |
| Dependency | Phase 1 verdict on Q5 (`session.idle` delivery) | The sentinel behaviour test depends on live delivery of that event. | Task T002 copies the verdict. If Q5 is unknown, the sentinel behaviour test is recorded as blocked, not skipped. |
| Dependency | Phase 1 verdict on Q6 (`session.compacted` delivery) | The skill advisor's compaction leg depends on that event. | Task T002 copies the verdict. |
| Dependency | Phase 1 verdict on Q11 and its build | `sk-vision` cannot be ported without its source and a build. | Task T002 copies the verdict. A blocked build is recorded in `sk-vision-blocked.txt`. |
| Dependency | The orchestrator's four decisions (T003) | The class of the skill advisor and the seam homes change the files touched. | Tasks T009 to T016 wait for T003. |
| Risk | Research classes `system-skill-advisor` as mechanical, but the brief places it here | Phase 3 may port a plugin that phase 2 should have ported. | Follow the brief unless the orchestrator confirms the research class in T003. |
| Risk | No v2 compaction signal is proven for the skill advisor (`research/research.md` line 305) | The compaction leg may never fire on v2. | The v2 leg is built on the event named in T002. The behaviour test is not claimed without a live capture. |
| Risk | `opencode-goal.js` is 143 KB, and its port touches many functions | One dispatch would produce a large, hard to review diff. | Split the port into three dispatches (T012a to T012c). The goal suites run after each dispatch. |
| Risk | `sk-vision` exports a named `SkVisionPlugin` beside its default (`src/plugin.ts` lines 13 and 90) | The loader comments warn that a stray named export drops the whole file. | T003 decides whether the named export stays. The v1 and v2 load captures decide whether it is safe. |
| Risk | `sk-vision` pins `@opencode-ai/plugin` 1.17.15 and `@opencode-ai/sdk` 1.17.15 (`package.json` lines 17 and 18), outside the D5 target | A bundle built against 1.17.15 may behave differently on 1.19.3. | T003 decides whether to repin. The v1 and v2 load captures test the bundle as it is. |
| Risk | Seams on default export objects would break the plain `{ id, setup, server }` shape | A fourth key on the default export would fail the plugin check. | Seams move to core modules, and the export-contract test reads the core module (REQ-012). |
| Risk | v2 keeps one module state for every session in the daemon | Goal state or sentinel text could leak between sessions. | State lives inside `setup`, is keyed by session ID and resets in cleanup. |
| Risk | A defensive guard returns null on v2 and hides a missing capability | The plugin appears to work while a hook is never registered. | REQ-011 replaces each null guard with a positive capability check, and the registration cases fail when a hook is missing. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The v1 hook bodies stay as they are, so the v1 path adds no work.
- **NFR-P02**: The v2 legs register each hook once, at load time.

### Security
- **NFR-S01**: The spec gate denies on v2 through `tool.hook("execute.before")`, and the behaviour test asserts that the denial reaches the caller.
- **NFR-S02**: The `sk-vision` build uses the lock file that its package commits, and it does not pull a newer SDK.

### Reliability
- **NFR-R01**: Each port changes one plugin, and the registration cases and the plugin suite run before the next port.
- **NFR-R02**: A v2 leg does not swallow a registration error. A missing hook fails the registration case.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The sentinel with no assistant text yet caches nothing and reports nothing.
- The spec gate with a tool name it does not know passes the call through, as v1 does.
- The goal with a deadline that passes while a prompt waits in the queue clears the queued prompt and keeps the goal state.

### Error Scenarios
- `sk-vision` build failure: the phase records the build output and the blocker, and the port stays on v1 only.
- A v2 event that never fires: the behaviour test reports the missing event, and the phase records the gap.
- Concurrent access: two sessions never share a cache entry, because every cache is keyed by session ID.

### State Transitions
- Partial completion: ported plugins keep their change. The rest stay v1 only, and the implementation summary lists them.
- Session expiry: the sentinel cache and the goal state drop with the session that owns them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Five plugins, up to three core modules, one `sk-vision` source and bundle and about 70 test call sites. |
| Risk | 22/25 | Unproven v2 signals, a shared daemon state, a named export and a version pin in `sk-vision`. |
| Research | 14/20 | Research sections 3 and 9 and the iterations behind the sentinel, goal and `sk-vision` rows. |
| **Total** | **58/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **The class of `system-skill-advisor`.** Research marks it mechanical (the `system-skill-advisor` row in section 3). The brief places it here. This spec follows the brief. The orchestrator confirms the class in T003, and a mechanical verdict would move the plugin to phase 2.
- **The homes of the seams.** This spec moves each seam to a core module, one per plugin. The orchestrator confirms the homes in T003. The alternative keeps a seam on the default object, which breaks the plain shape in REQ-012.
- **The `sk-vision` named export and package pin.** The named export `SkVisionPlugin` at `src/plugin.ts` line 13 sits beside the default at line 90. The package pins 1.17.15 for the plugin and the SDK. The orchestrator decides in T003 whether to remove the named export and whether to repin.
- **The `sk-vision` command on v1.** This spec keeps `command.execute.before` for v1 and adds `ctx.command.transform` for v2. The orchestrator confirms that both hosts register the same command.
<!-- /ANCHOR:questions -->
