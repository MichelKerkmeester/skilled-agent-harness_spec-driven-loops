---
title: "Implementation Plan: Phase 13: sk-vision-v2-tools-and-loose-ends"
description: "Adapt sk-vision's OpenCode 1 tool definitions to OpenCode 2's tool editor and register them in `setup` under the same gate, test the OpenCode 2 grace path, correct two bundle comments, and make `RuntimeClient.close()` stop a startup still provisioning."
trigger_phrases:
  - "sk vision v2 tools and loose ends plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: sk-vision-v2-tools-and-loose-ends

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, bundled by Bun |
| **Framework** | OpenCode plugin API: `@opencode-ai/plugin` 1.17.15 for OpenCode 1, `@opencode/plugin` 2.0.32 shapes declared locally for OpenCode 2 |
| **Storage** | None |
| **Testing** | `bun test`, `tsc --noEmit`, the plugin `node --test` suites, the doctor battery and a live private `opencode2 serve` |

### Overview
`skVisionTools` builds the 13 tool definitions OpenCode 1 takes from `server`. The plan adds `toV2Tools`, which maps each one to OpenCode 2's `{ name, description, input, execute }` shape and its `{ content, metadata }` result. `createDefaultAutoInspect` returns them next to the evidence function, and `createSetup` adds them through `ctx.tool.transform` after it registers the prompt hook. Separately, `RuntimeClient` tracks its provisioning child, and `close()` stops it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: the tool editor shape was read from the published 2.0.32 types and probed live

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing at or above the baseline
- [x] Docs updated (spec, plan, tasks and the plugin README)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One set of tool definitions, two host adapters. OpenCode 1 takes the record from `server`, and OpenCode 2 gets the same definitions through its tool editor.

### Key Components
- `toV2Tools(tools)`: the OpenCode 2 adapter. The input is `tool.schema.object(args)`, a zod Standard Schema. A string result becomes `content`. An object result keeps `metadata`, and its attachments become `{ type: "file", uri, mime, name }` items after the text.
- `createSetup`'s tool block: runs after the prompt hook registers, fails open, and is disposed before the command registration.
- `RuntimeClient`: the `closed` flag and the `provisioning` child. `close()` sends SIGTERM, escalates to SIGKILL after 2 seconds and waits for the exit.

### Data Flow
`setup` runs → the command registers → `createDefaultAutoInspect` returns null when the flag is off → otherwise the prompt hook registers → `ctx.tool.transform` adds the 13 tools → the model calls one through OpenCode 2's code-mode `execute` tool → the OpenCode 1 `execute` runs → `toV2Tools` maps its result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `tools.ts` `skVisionTools` | OpenCode 1 tool record | Unchanged. `toV2Tools` reads it | `tools.test.ts` compares output with the OpenCode 1 call |
| `plugin.ts` `createSetup` | OpenCode 2 `setup` entry | Update: registers the tools after the prompt hook | Four registration tests and the live run |
| `plugin.ts` `server` | OpenCode 1 entry | Unchanged | The v1 battery and the plugin suite |
| `client.ts` `RuntimeClient` | Starts and stops the Python runtime on both versions | Update: `close()` stops provisioning | Three tests in `client.test.ts` |
| `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | Asserts sk-vision's v2 registrations | Unchanged: without the flag, no tools register | Plugin suite count |
| `.opencode/plugins/README.md` | Says where the tools register | Update | Read against the code |

Matrix axes: automatic inspection on or off, `ctx.tool` present or absent, `transform` resolves or rejects, the prompt hook resolves or rejects, the tool result is a string or an object, provisioning is running, ignoring SIGTERM, or done when `close()` runs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The adapter, tool registration, the grace path and close during startup | `bun test` |
| Mutation | Each new test run against the old or reverted code | `scratch/mutation/` |
| Integration | sk-vision's OpenCode 2 registrations and the plugin suite | `node --test .opencode/plugins/tests/` |
| Manual | The tool list with the flag off and on, and one `sk_vision_status` call, on a private OpenCode 2.0.32 server | `scratch/proof/run-probe.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2.0.32 `ctx.tool.transform` and `ToolEditor.add` | External | Green | No way to register plugin tools on OpenCode 2 |
| A non-text-only model on the private server | External | Red | No live run of the grace path. Unit tests and a mutation cover it instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The tools break OpenCode 2 sessions, or `close()` hangs.
- **Procedure**: Unset `SK_VISION_AUTOINSPECT`, which removes the tools. For a code rollback, revert the phase commit and rebuild the bundle.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baselines, types, probe) ──► Core (adapter, registration, close, tests) ──► Verify (mutation, suites, live run, review)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 1 hour |
| Verification | Med | 2 hours |
| **Total** | | **3 to 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: not needed, no data changes
- [x] Feature flag configured: `SK_VISION_AUTOINSPECT` gates the tools
- [x] Monitoring alerts set: not applicable, `SK_VISION_DEBUG=1` logs a failed registration

### Rollback Procedure
1. Unset `SK_VISION_AUTOINSPECT` in the environment that starts OpenCode 2.
2. Revert the phase commit and run `bun run build` in `vision-runtime`.
3. Rerun the sk-vision and plugin suites.
4. No stakeholder notice: the flag is opt-in.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
