---
title: "Feature Specification: Command-gated vision activation and runtime teardown"
description: "Stop sk-vision from auto-triggering in OpenCode and Pi: remove always-on auto-inject and default tool advertisement, reach vision only through a smart /vision command, and tear the local model runtime down after every use."
trigger_phrases:
  - "sk-vision command-gated activation"
  - "sk-vision /vision command"
  - "sk-vision auto-inject disable"
  - "sk-vision runtime teardown memory creep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown"
    last_updated_at: "2026-08-22T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Design locked from two-pass investigation; authoring 023."
    next_safe_action: "Smoke-test OpenCode command hook, then build."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown/spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/plugin.ts"
      - ".opencode/skills/sk-vision/vision-runtime/src/opencode/attachments.ts"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-023-command-gated-vision-and-runtime-teardown"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Command-gated vision activation and runtime teardown

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `022-opencode-plugin-runtime-resolution` |
| **Handoff Criteria** | In OpenCode and Pi, sk-vision no longer auto-injects and no longer advertises its tools by default; vision runs only when the user invokes `/vision`; the local model runtime is shut down after each call. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

sk-vision reaches OpenCode and Pi as an in-process plugin, Cursor and Devin as an MCP stdio server, and is intentionally unregistered in Claude Code. Today the OpenCode plugin and the Pi hook both register their tools at load and inject a local-vision "evidence" block on every image-bearing turn regardless of the active model. A model that can already see images (GPT, Claude, Gemini) still gets sk-vision volunteering — the reported irritant.

**Deliverables**: an off-by-default posture in OpenCode and Pi, a smart `/vision` command as the single activation path, no default tool advertisement, and deterministic teardown of the Python/GPU runtime after each use. Cursor/Devin (MCP) are out of scope.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In OpenCode, sk-vision is "always on" in two ways. First, the plugin factory registers its full tool set once at session load, so every model — GPT via the OpenAI provider included — sees the `sk_vision_*` tools on every turn; the plugin API offers no per-model or per-turn way to hide them. Second, on any turn that carries an image or PDF, the attachment hook auto-injects a local-vision "evidence" block and spins the local GPU regardless of whether the active model can already see the image. The code even computes whether the model is text-only but never uses that result to decide whether to inject. Pi carries an equivalent always-on injection in its own hook. Separately, the local Python model runtime persists after use, which risks memory and GPU creep.

### Purpose
Make sk-vision opt-in in OpenCode and Pi: nothing fires automatically, the tools do not clutter the default tool list, and vision is reached only through a `/vision` command that runs on the user's images and then releases the runtime. This removes the redundant activation on capable models while preserving sk-vision's value on demand, and eliminates the lingering-process memory cost.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- OpenCode: stop registering the tool set and the auto-inject hooks by default; add a `command.execute.before` handler for `/vision`; add a `.opencode/commands/vision.md` entrypoint.
- Pi: stop the default injection and default tool advertisement; register the tools hidden (callable, not advertised); add a native `.pi/prompts/vision.md` command that drives the hidden tool with per-call teardown.
- Cursor: add a native `.cursor/commands/vision.md` command that drives the already-registered `sk_vision_inspect` MCP tool.
- Command-mirror scope: exclude `vision.md` from the Claude mirror and protect the Cursor/Pi natives from prune (`command-scope.cjs`), following the `goal-*` precedent.
- `/vision` behavior: `/vision <question>` answers the question against the most-recent image; bare `/vision` auto-reads that image (OpenCode) or asks/full-reads (Cursor/Pi).
- Deterministic runtime teardown after each `/vision` call; a reversibility flag to restore old auto-inject; a teardown-mode flag.

### Out of Scope
- Devin — the sk-vision MCP tool is registered, but Devin has no command surface (per its `SYNC.md`), so it uses the tool directly with no `/vision` command.
- Claude — no sk-vision integration, so `/vision` is excluded from the Claude command mirror.
- Changing the shared runtime contract: `runtime/client.ts`, `photon.ts`, `runtime.py`, and `tools.ts` behavior are not modified (only new callers added).
- Removing the now-unused auto-inject code paths (kept behind a flag for reversibility).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/plugin.ts` | Update | Remove default `tool`/`event`/`chat.message` registration (gate behind `SK_VISION_AUTOINSPECT`); add `command.execute.before` for `/vision` |
| `.opencode/skills/sk-vision/vision-runtime/src/opencode/command.ts` | Create | `/vision` handler: fetch latest session image via SDK, run query or full inspect, tear runtime down in `finally` |
| `.opencode/commands/vision.md` | Create | `/vision` command entrypoint (description, argument-hint) |
| `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts` | Update | Remove default injection + default tool advertisement; register tools hidden with per-call teardown; remove `registerCommand("vision")` in favor of the prompt file |
| `.opencode/skills/sk-vision/vision-runtime/dist/*` | Update | Rebuilt artifacts (`bun run scripts/build.ts`) |
| `.cursor/commands/vision.md` | Create | Cursor-native `/vision` driving the `sk_vision_inspect` MCP tool |
| `.pi/prompts/vision.md` | Create | Pi-native `/vision` driving the hidden `sk_vision_inspect` tool |
| `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/command-scope.cjs` | Update | Exclude `vision.md` from Claude mirror; register Cursor/Pi natives |

### Verification evidence
- Typecheck and unit tests green in `vision-runtime`.
- Grep proves the default OpenCode return no longer registers `tool`/`chat.message`/`event` unless `SK_VISION_AUTOINSPECT` is set.
- Manual smoke test in a live OpenCode session: `/vision` fires the command hook and returns evidence with zero `sk_vision_*` tools listed; the runtime process is gone after the call.
- Manual smoke test in a live Pi session: bare `/vision` prompts for a question, runs, and the runtime is torn down.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No default auto-inject | With no flags set, an image-bearing turn in OpenCode and Pi produces no sk-vision injection |
| REQ-002 | No default tool clutter | With no flags set, no `sk_vision_*` tool is advertised to the model in OpenCode; Pi tools are hidden |
| REQ-003 | Smart `/vision` | `/vision <question>` answers it against the latest image; bare `/vision` auto-reads (OpenCode) or prompts then runs (Pi) |
| REQ-004 | Runtime teardown | After each `/vision` call the local Python/GPU runtime is shut down (no lingering process by default) |
| REQ-005 | Other hosts untouched | Cursor/Devin MCP path and the shared runtime contract are unchanged; Pi/OpenCode edits do not regress them |
| REQ-006 | Reversible | An env flag restores the previous auto-inject behavior without a code change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Default OpenCode session lists zero `sk_vision_*` tools and injects nothing on an image turn. Evidence: live smoke test + grep of `plugin.ts` default return.
- [ ] Default Pi session injects nothing and hides the tools. Evidence: live smoke test + source grep.
- [ ] `/vision <question>` returns an evidence block answering the question; bare `/vision` auto-reads (OpenCode) / prompts then runs (Pi). Evidence: live smoke tests.
- [ ] No sk-vision runtime process remains after a `/vision` call with default teardown. Evidence: process check after the call.
- [ ] `SK_VISION_AUTOINSPECT=1` restores the old behavior. Evidence: live smoke test.
- [ ] Typecheck + unit tests green; dist rebuilt and fresh. Evidence: command output + freshness guard clean.
- [ ] Cursor/Devin MCP tool surface and shared runtime unchanged. Evidence: no diff to `mcp/server.ts`, `tools.ts`, `photon.ts`, `runtime/client.ts` behavior, `runtime.py`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `command.execute.before` may not fire for a markdown-defined command (inferred, not yet live-verified) | The zero-tool OpenCode path fails | Smoke-test first; fall back to registering one minimal `sk_vision` tool driven by the command |
| Risk | Hard teardown adds model-load latency to each call | Slower repeat calls | Offer a warm `unload`+idle-timeout mode behind `SK_VISION_TEARDOWN`; default stays hard-close per the no-creep requirement |
| Risk | Editing shared modules could regress Cursor/Devin | Broken MCP hosts | Confine edits to `plugin.ts`, new `command.ts`, and `hooks/pi/sk-vision.ts`; do not touch `tools.ts`/`mcp/server.ts`/runtime contract |
| Dependency | `vision-runtime/dist` rebuilt via `bun run scripts/build.ts` | OpenCode loads stale bundle otherwise | Rebuild and confirm freshness guard clean |
| Dependency | OpenCode SDK `session.messages()` returns image parts | Cannot fetch the image in-process | Confirmed available in the plugin `PluginInput.client`; reuse existing materialize logic |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Default posture — gate to text-only models, or off-by-default opt-in? **A**: Off-by-default, opt-in via `/vision` (operator choice).
- **Q**: Bare `/vision` in OpenCode, which cannot pop a text dialog from a command hook? **A**: Auto-read the latest image (scene + caption + OCR); zero tools. Pi keeps the interactive prompt.
- **Q**: Teardown default? **A**: Hard shutdown after each call (no memory creep); warm/idle mode behind a flag.
- **Q**: Scope? **A**: OpenCode + Pi; Cursor/Devin unchanged.
- **Q**: "Related images"? **A**: The most-recent image in the session.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
