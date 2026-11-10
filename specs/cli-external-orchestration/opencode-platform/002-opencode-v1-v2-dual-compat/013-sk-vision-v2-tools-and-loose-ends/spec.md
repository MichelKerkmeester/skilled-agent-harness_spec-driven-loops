---
title: "Feature Specification: Phase 13: sk-vision-v2-tools-and-loose-ends"
description: "OpenCode 2 never calls sk-vision's `server` entry, so its 13 `sk_vision_*` tools were missing there. The OpenCode 2 grace path had no test, a stale comment named the wrong bundle, and closing the runtime client did not stop a startup still provisioning. This phase closes all four."
trigger_phrases:
  - "sk vision v2 tools and loose ends"
  - "phase 13 sk vision v2 tools and loose"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: sk-vision-v2-tools-and-loose-ends

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `scaffold/013-sk-vision-v2-tools-and-loose-ends` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-sk-vision-v2-prompt-hook |
| **Successor** | None |
| **Handoff Criteria** | With `SK_VISION_AUTOINSPECT=1`, a private OpenCode 2.0.32 server lists the 13 `sk_vision_*` tools and one of them runs; with it off, none is listed. Every new test fails on the old code, every touched suite is at or above its baseline and recursive strict validation prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the OpenCode v1 and v2 dual compatibility packet. It closes the open items phase 012 recorded: limitations 1, 3 and 4 in its implementation summary, and the stale bundle comment.

**Scope Boundary**: The sk-vision runtime source (`vision-runtime/src/plugin.ts`, `src/opencode/tools.ts` and `src/runtime/client.ts`) and their tests, two source comments, one sentence each in the plugin and hooks READMEs, and this packet's records.

**Dependencies**:
- Phase 12 gave sk-vision's OpenCode 2 `setup` entry the automatic-inspection gate this phase reuses.
- OpenCode 2.0.32's `@opencode/plugin` types: `Context.tool`, its `transform` and `ToolEditor.add`.

**Deliverables**:
- The 13 tools registered on OpenCode 2 under the same gate as OpenCode 1.
- Tests for the OpenCode 2 grace path.
- Two corrected comments.
- A `RuntimeClient.close()` that stops a startup still provisioning.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On OpenCode 1, sk-vision's `server` entry returns the 13 `sk_vision_*` tools when `SK_VISION_AUTOINSPECT=1`. OpenCode 2 calls only `setup`, so the tools were missing there. The evidence block that phase 12 attaches still pointed the model at them.

Phase 12 also left three smaller gaps. The 2-second grace for models off the text-only list had no OpenCode 2 test. The banner in `hooks/opencode/sk-vision.ts` said the plugin links to that bundle, but the links point at `vision-runtime/dist/plugin.js`. And `RuntimeClient.close()` returned while a `uv` or `pip` provisioning step was still running, so a later step could still start the runtime.

### Purpose
OpenCode 2 gets the same tools as OpenCode 1 under the same gate. The grace path is proved by tests, the comments say what loads, and closing the client stops its startup.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adapt the existing tool definitions to OpenCode 2's tool shape and register them in `setup` through `ctx.tool.transform`.
- Unit tests for the grace path on OpenCode 2 and in `AttachmentInjector.evidenceText`.
- Correct the banner in `hooks/opencode/sk-vision.ts` and the matching comment in `scripts/build.ts`.
- Stop an in-flight provisioning step in `RuntimeClient.close()` and keep a closed client from spawning.
- The plugin README sentence that said the tools register on OpenCode 1 only.

### Out of Scope
- Any change to the OpenCode 1 `server` entry or its tools.
- A second implementation of the tools for OpenCode 2. The adapter reuses the OpenCode 1 definitions.
- The paste-time preload and the server-side toast, as in phase 12.
- Untracking or ignoring `hooks/opencode/sk-vision.js`. Another branch carries that `.gitignore` change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/tools.ts` | Modify | `toV2Tools`, the OpenCode 2 tool adapter |
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/tools.test.ts` | Create | Four adapter tests |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modify | Tool registration in `createSetup`, after the prompt hook |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` | Modify | Tool registration and grace tests |
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.test.ts` | Modify | Two `evidenceText` grace tests |
| `.skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts` | Modify | `close()` stops provisioning |
| `.skilled/skills/sk-vision/vision-runtime/src/runtime/client.test.ts` | Create | Four close-during-startup tests |
| `.skilled/skills/sk-vision/hooks/opencode/sk-vision.ts`, `vision-runtime/scripts/build.ts` | Modify | The bundle comments |
| `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` | Build output | Rebuilt by `bun run build`. The folder is gitignored |
| `.opencode/plugins/README.md` | Modify | The tools sentence |
| `.skilled/skills/sk-vision/hooks/README.md` | Modify | Section 4, the hook-bundle sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `SK_VISION_AUTOINSPECT=1`, OpenCode 2 lists the 13 `sk_vision_*` tools and a model can run one. |
| REQ-002 | Without `SK_VISION_AUTOINSPECT=1`, OpenCode 2 lists none of them, and OpenCode 1's `server` entry is unchanged. |
| REQ-003 | `RuntimeClient.close()` stops a startup still provisioning: no runtime spawns, the provisioning step exits and `ready` settles. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A failed tool registration leaves the command and the prompt hook working, and a failed prompt hook leaves no tool registered. |
| REQ-005 | Tests prove that a model off the text-only list gets the 2-second grace on OpenCode 2. |
| REQ-006 | The two bundle comments name the file OpenCode loads. |
| REQ-007 | Every new test fails on the old code, every touched suite is at or above its baseline, and the README says what holds. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a private OpenCode 2.0.32 server, the tool list holds 13 `sk_vision_*` ids with the flag on and none with it off, and a prompt that asks for `sk_vision_status` returns the runtime's status.
- **SC-002**: The sk-vision suite rises by the new tests with zero failures, and the plugin, v2 and battery checks hold.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode 2.0.32 accepts a zod 4.1.8 schema as tool input | Without it the tools would need hand-written JSON Schema | Read from the published types and proved by a live probe that registered a zod tool and a JSON Schema tool |
| Risk | Killing a provisioning step leaves a half-built venv | Med | The next start finds `moondream` missing and provisions again, and `uv venv` replaces an existing venv (checked on uv 0.8.3) |
| Risk | OpenCode 2 reaches plugin tools through its code-mode `execute` tool, not directly | Low | The live run shows the model calling `sk_vision_status` through `execute` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: With automatic inspection off, `setup` builds no client and registers no tools.
- **NFR-P02**: `close()` waits at most about 2 seconds for a provisioning step before it forces the step to exit.

### Security
- **NFR-S01**: The tools run the same code as on OpenCode 1. The adapter adds no file or network access.
- **NFR-S02**: No secret or server password appears in any log or proof file.

### Reliability
- **NFR-R01**: Every registration failure fails open, and disposal removes whatever was registered.
- **NFR-R02**: A closed client never starts the runtime.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a host with no `ctx.tool` gets no tools, and `setup` carries on.
- Maximum length: not applicable. The tool count is fixed at 13.
- Invalid format: a tool result that is a string passes through. An object result keeps its metadata, and its attachments become file content items.

### Error Scenarios
- External service failure: `ctx.tool.transform` rejecting is caught and logged only under `SK_VISION_DEBUG=1`.
- Network timeout: not applicable. Registration is local to the host.
- Concurrent access: `close()` during provisioning stops the step and settles `ready` with a shutdown error and no error toast.

### State Transitions
- Partial completion: a provisioning step that ignores SIGTERM gets SIGKILL after 2 seconds, and `close()` waits for it to exit.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three source files, three test files, two comments and one README line |
| Risk | 8/25 | A plugin API change on one host behind an opt-in flag, and a process-lifecycle change |
| Research | 6/20 | The v2 tool shape had to be read from the published types and probed live |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None left open by this phase. Luna's four round-4 P2s are recorded as limitations in the implementation summary.
<!-- /ANCHOR:questions -->

---
