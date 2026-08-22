---
title: "Implementation Plan: Command-gated vision activation and runtime teardown"
description: "Make sk-vision opt-in in OpenCode and Pi via a /vision command, remove default auto-inject and tool advertisement, and tear the local runtime down after each call."
trigger_phrases:
  - "sk-vision command-gated plan"
  - "sk-vision /vision teardown plan"
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
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown/plan.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/plugin.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-023-command-gated-vision-and-runtime-teardown"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Command-gated vision activation and runtime teardown

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (OpenCode plugin + Pi hook), Markdown command, Bun build |
| **Framework** | `@opencode-ai/plugin` (command/chat hooks + SDK client); `@earendil-works/pi-coding-agent` extension API |
| **Storage** | Plugin source in `vision-runtime/src`; Pi hook in `hooks/pi`; command in `.opencode/commands` |
| **Testing** | `vitest`/`bun:test` in `vision-runtime`; typecheck; live smoke tests in OpenCode and Pi |

### Overview
Turn sk-vision opt-in in the two in-process hosts. In OpenCode, drop the default tool and auto-inject registration and add a `command.execute.before` handler that runs `/vision` against the latest session image, then closes the runtime. In Pi, drop the default injection and tool advertisement and register a native `/vision` command that prompts for a question when none is given. The shared runtime contract is untouched; only new callers and teardown calls are added.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause and host mechanics confirmed. Evidence: two-pass investigation cited plugin/command/tool/teardown APIs by file:line.
- [x] Direction and open questions resolved with the operator. Evidence: spec §7 Answered Questions.

### Definition of Done
- [ ] Default OpenCode + Pi sessions inject nothing and advertise no tools. Evidence: smoke tests + grep.
- [ ] `/vision` works in both hosts (arg and bare forms). Evidence: smoke tests.
- [ ] Runtime torn down after each call. Evidence: process check.
- [ ] Typecheck + unit tests green; dist rebuilt fresh. Evidence: command output.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in activation through a command entry point instead of always-on hooks. Vision work is driven directly by the command handler (not by exposing tools to the model), and the runtime is a short-lived resource opened and closed within the handler.

### Key Components
- **OpenCode `command.execute.before`** — fires on `/vision`; fetches the latest image via `PluginInput.client.session.messages()`, runs a query or a full inspect, injects the result as command parts, closes the runtime in `finally`.
- **`.opencode/commands/vision.md`** — the command entrypoint that makes `/vision` a recognized command and carries the argument hint.
- **Pi `registerCommand("vision", ...)`** — native handler; bare form calls `ctx.ui.input(...)` for the question, then runs and tears down.
- **Teardown** — `RuntimeClient.close()` (shutdown RPC + SIGKILL fallback) per call by default; optional warm `PhotonProvider.unload()` + idle-timeout behind a flag.

### Data Flow
User `/vision <q>` → command handler → SDK fetch latest image → materialize → runtime query/inspect → inject evidence part → `client.close()` (runtime process exits).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: De-risk (smoke test)
- [ ] Confirm `command.execute.before` fires for a markdown-defined command in a live OpenCode session; if not, switch to the one-minimal-tool fallback. Evidence: live run.

### Phase 1: OpenCode off-by-default + command
- [ ] Remove default `tool`/`event`/`chat.message` registration in `plugin.ts` (gate behind `SK_VISION_AUTOINSPECT`).
- [ ] Create `src/opencode/command.ts` (image fetch + run + teardown) and wire `command.execute.before`.
- [ ] Create `.opencode/commands/vision.md`.
- [ ] Rebuild dist.

### Phase 2: Pi off-by-default + command
- [ ] Remove default injection + tool advertisement in `hooks/pi/sk-vision.ts`.
- [ ] Add `registerCommand("vision", ...)` with `ctx.ui.input` for the bare form and per-run teardown; keep a GPU-free image capture.

### Phase 3: Verify
- [ ] Typecheck + unit tests; grep proofs; live smoke tests in both hosts; process-gone check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | `vision-runtime` compiles | `tsc --noEmit` |
| Unit | Command handler + teardown paths | `vitest` / `bun:test` |
| Static | Default return no longer registers tools/inject | grep |
| Live (OpenCode) | `/vision` fires, zero tools, evidence returned, runtime gone | OpenCode session + process check |
| Live (Pi) | bare `/vision` prompts, runs, tears down | Pi session + process check |
| Regression | Cursor/Devin MCP + shared runtime unchanged | diff review of untouched files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command.execute.before` fires for md command | Runtime | To verify (Phase 0) | Fall back to one minimal tool |
| OpenCode SDK `session.messages()` | Runtime | Confirmed | Cannot fetch image in-process |
| Pi `ctx.ui.input` + `registerCommand` | Runtime | Confirmed | No interactive bare `/vision` |
| `RuntimeClient.close()` / `PhotonProvider.unload()` | Local | Confirmed | No teardown |
| `bun run scripts/build.ts` | Local | Available | OpenCode loads stale bundle |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `/vision` regresses either host, or the command hook does not fire and the fallback is not yet in place.
- **Procedure**: set `SK_VISION_AUTOINSPECT=1` to restore the previous auto-inject and tool behavior without a code change; if needed, `git revert` the packet's commits and rebuild dist. All changes are git-tracked and confined to `plugin.ts`, new `command.ts`, `vision.md`, and the Pi hook.
<!-- /ANCHOR:rollback -->
