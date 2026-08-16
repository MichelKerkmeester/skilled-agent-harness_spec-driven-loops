---
title: "Feature Specification: sk-vision 004 opencode adapter"
description: "Put the forked plugin on .opencode/plugins/sk-vision.js as a real file, restore event/chat.message/tool/dispose hooks, and keep 2s auto-inspect grace without awaiting full GPU."
trigger_phrases:
  - "sk-vision opencode adapter"
  - "sk-vision opencode plugin"
  - "sk-vision auto inspect"
  - "sk-vision image attach"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter"
    last_updated_at: "2026-08-16T07:10:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Added plugin re-export bytes and proof commands."
    next_safe_action: "Author .opencode/plugins/sk-vision.js after 003 emits dist/plugin.js."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/plugins/sk-vision.js"
      - ".opencode/plugins/README.md"
      - ".opencode/plugins/mk-communication-projection.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-004-opencode-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Load path is a real file in .opencode/plugins/, not a repo opencode.json plugin array."
      - "Auto-inspect is 2s grace; never a full GPU await."
---
# Feature Specification: sk-vision 004 opencode adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 5 |
| **Predecessor** | `003-runtime-fork` (`dist/plugin.js` or documented substitute) |
| **Successor** | `005-pi-adapter` (same `sk_vision_*` names and `<SK-VISION>` envelope) |
| **Handoff Criteria** | OpenCode loads `.opencode/plugins/sk-vision.js` without a repo `opencode.json` `plugin` array. 13 `sk_vision_*` tools register. Auto-inspect injects a guarded block with the dump 2s cap. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode discovers plugins from `.opencode/plugins/*.js`, not from a repo-root `opencode.json` `plugin` array. The dump's `"plugin": ["./src/plugin.ts"]` pattern does not apply here. Without a real adapter file, the forked factory never loads and attachments never auto-inspect.

### Purpose
Add a thin real-file adapter that default-exports the skill package plugin, restores the four dump hooks, and keeps auto-inspect from blocking prompt delivery.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/plugins/sk-vision.js` as a **real file** (not a symlink). Analog: `.opencode/plugins/mk-communication-projection.js` importing `../skills/sk-communication/cli-communication-projection/dist/index.js`. Import target: `../skills/sk-vision/vision-runtime/dist/plugin.js` (or source if this child proves OpenCode loads it). Canonical factory stays in the skill.
- Update `.opencode/plugins/README.md` with an inventory row and config keys.
- Restore dump hooks from `../context/src/plugin.ts`:
  - `event`: `message.part.updated` fire-and-forget preload
  - `chat.message`: injector, 2s grace, never a full GPU await
  - `tool`: 13 `sk_vision_*` tools
  - `dispose`: `client.close()`
- Keep `autoInspect` default on. Other config: `enabled`, `python`, `timeoutMs`, `fetchTimeoutMs`, `reverseSearch`. Yandex stays opt-in via the reverse tool / `always` flag.
- Inject `<SK-VISION>` (the 003 envelope) on image attach. Image text is untrusted observation.

### Out of Scope
- Pi extension (005).
- Changing JSON-RPC methods or Python runtime.
- Editing repo root `opencode.json`.
- Installing `@opencode-ai/plugin` unless this child chooses to turn that unknown into confirmed types.
- GPU attach smoke when 003 recorded SKIP.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/sk-vision.js` | Create | Real-file default export |
| `.opencode/plugins/README.md` | Modify | Inventory row |

### Tool names (must match 003)

`sk_vision_inspect`, `sk_vision_detect`, `sk_vision_point`, `sk_vision_ocr`, `sk_vision_status`, `sk_vision_segment`, `sk_vision_metadata`, `sk_vision_crop`, `sk_vision_zoom`, `sk_vision_colors`, `sk_vision_diff`, `sk_vision_annotate`, `sk_vision_reverse`.

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: `003-runtime-fork` has no `dist/plugin.js` and no documented `tsc` substitute; you are about to `ln -s` this plugin (Pi is the symlink host, not OpenCode); you are about to edit repo-root `opencode.json`; you are about to copy dump `context/opencode.json`; you are about to add a `plugin` array; you are about to await full GPU in `chat.message`; you are about to invent `sk_vision_query`.

Analog (real file importing skill `dist/`): `.opencode/plugins/mk-communication-projection.js` lines 17–22 import `../skills/sk-communication/cli-communication-projection/dist/index.js` and line 361 `export default async function`. Dump factory with the four hooks: `../context/src/plugin.ts` (copied into `vision-runtime/src/plugin.ts` by 003). 2s grace lives in dump `../context/src/opencode/attachments.ts` around the `Promise.race` with `2_000`; 004 keeps that by re-exporting the built factory, not by rewriting it.

#### Step 1 — prove the import target exists

```bash
test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js
```

#### Step 2 — write `.opencode/plugins/sk-vision.js` as a regular file

Preferred bytes (thin re-export, same pattern as the analog's skill-`dist/` import):

```javascript
'use strict';

export { default } from '../skills/sk-vision/vision-runtime/dist/plugin.js';
```

If OpenCode fails to load a re-export, use an explicit default function that calls the skill factory and returns its hooks object. Do not put GPU logic in this file. Canonical factory stays in the skill package.

```bash
test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js
```

The loaded factory MUST still expose dump hooks from `context/src/plugin.ts`:

| Hook | Contract |
|------|----------|
| `event` | `message.part.updated` fire-and-forget preload; never stall the TUI |
| `chat.message` | injector; wait at most 2000ms; never await the full GPU run |
| `tool` | the 13 `sk_vision_*` names only |
| `dispose` | `client.close()` |

Config keys to document (defaults from dump): `enabled`, `autoInspect` (default on), `python`, `timeoutMs`, `fetchTimeoutMs`, `reverseSearch`. Yandex stays opt-in.

#### Step 3 — README inventory row

Add one row to `.opencode/plugins/README.md` section 2 CONTENTS table:

`sk-vision.js` | Local vision adapter: default-exports `vision-runtime/dist/plugin.js`. Registers 13 `sk_vision_*` tools. Auto-inspect uses a 2s grace and never awaits full GPU.

#### Step 4 — proof (no opencode.json plugin array)

```bash
test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js
rg -n "from '\\.\\./skills/sk-vision/vision-runtime/dist/plugin.js'|from \"\\.\\./skills/sk-vision/vision-runtime/dist/plugin.js\"" .opencode/plugins/sk-vision.js
rg -n 'plugin' opencode.json
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter --strict
```

`opencode.json` must not gain a `plugin` array for this skill. GPU attach smoke runs only if 003 `load` smoke passed; otherwise SKIP.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-001**: Discovery: `.opencode/plugins/sk-vision.js` MUST exist as a regular file (`test -f` and `test ! -L`) that default-exports the skill plugin factory.
- **REQ-002**: Tools: the plugin MUST register the 13 `sk_vision_*` names listed in Scope. No `senses_*` aliases.
- **REQ-003**: Auto-inspect: on image attach, inject a guarded `<SK-VISION>` block. Wait at most 2000ms. Never block the prompt on the full GPU run.
- **REQ-004**: Preload: `event` / `message.part.updated` MAY fire-and-forget a preload; it MUST NOT stall the turn.
- **REQ-005**: Dispose: `dispose` MUST call `client.close()`.
- **REQ-006**: README: `.opencode/plugins/README.md` MUST list `sk-vision.js` and the config keys in Scope.

### Non-Functional Requirements
- **NFR-001**: Repo root `opencode.json` MUST NOT gain a `plugin` array for this skill.
- **NFR-002**: GPU attach smoke runs only if 003 `load` smoke passed; otherwise record SKIP.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js`
- [ ] File imports from `../skills/sk-vision/vision-runtime/dist/plugin.js` (or the documented substitute).
- [ ] `rg -n 'plugin' opencode.json` does not show a new `plugin` array added for sk-vision.
- [ ] README inventory row exists.
- [ ] Tool names in the loaded plugin match the 13-name list.
- [ ] Auto-inspect path documented with 2s cap.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Assumption | Impact | Mitigation |
|-------------------|--------|------------|
| Missing `dist/plugin.js` | High | 003 handoff required; do not invent a dump-style `src/plugin.ts` repo plugin entry |
| Auto-inspect awaits full GPU | High | Hard 2s grace; dump `chat.message` contract |
| Symlink instead of real file | High | Analog is `mk-communication-projection.js`; Pi is the symlink host |
| `@opencode-ai/plugin` types not installed | Medium | Treat dump `plugin.ts` as confirmed; npm types stay unknown unless this child installs them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Symlink or real file?
  - **A**: Real file. Pi uses a relative symlink; OpenCode plugins in this repo are real JS adapters.
- **Q**: Register in `opencode.json`?
  - **A**: No. Directory discovery only.

### Open Questions
- None. Published `@opencode-ai/plugin` `.d.ts` remains unknown unless this child installs the package.
<!-- /ANCHOR:questions -->
