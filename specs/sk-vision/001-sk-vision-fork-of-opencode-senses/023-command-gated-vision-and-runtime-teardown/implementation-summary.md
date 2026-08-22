---
title: "Implementation Summary: Command-gated vision activation and runtime teardown"
description: "Closeout tracker for making sk-vision opt-in via /vision in OpenCode and Pi, removing default auto-inject and tool advertisement, and tearing the runtime down after each call."
trigger_phrases:
  - "sk-vision command-gated summary"
  - "sk-vision /vision teardown summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown"
    last_updated_at: "2026-08-22T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Doc sweep + changelog v0.2.0.0 + version bump; validators 0."
    next_safe_action: "Operator smoke-tests /vision in OpenCode, Cursor, Pi."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown/implementation-summary.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/opencode/command.ts"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-023-command-gated-vision-and-runtime-teardown"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-command-gated-vision-and-runtime-teardown |
| **Status** | In Progress |
| **Level** | 2 |

The code is implemented across OpenCode and Pi and independently verified (typecheck/tests/build all exit 0; dist rebuilt; scope + comment-hygiene clean). The skill-doc sweep, the first changelog entry, and the version bump are complete and validated. Status stays In Progress because the live host smoke tests are operator-run (not testable from a Claude session). The docs describe the primary command-hook design, so a fallback to the one-minimal-tool path would need a minor doc revision.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented via a GPT-5.6-Luna (xhigh, fast) cli-codex worker, then independently verified.

| Area | Change | File |
|------|--------|------|
| OpenCode default posture | Default return registers ONLY `command.execute.before`; `tool`/`event`/`chat.message` gated behind `SK_VISION_AUTOINSPECT="1"` | `vision-runtime/src/plugin.ts` |
| OpenCode command | `/vision <q>` queries the latest session image; bare `/vision` runs a full inspect (scene+caption+OCR); errors surface as `SK_VISION_ERROR`; teardown in `finally` | `vision-runtime/src/opencode/command.ts` (new) |
| Reuse | Extracted the image-materialize helper to a free `materializeImagePart` export (behavior-preserving; class delegates to it) | `vision-runtime/src/opencode/attachments.ts` |
| Command entrypoint | `/vision` description + argument-hint | `.opencode/commands/vision.md` (new) |
| Pi default posture | Shared client + 13 tools + auto-inject registered ONLY when `SK_VISION_AUTOINSPECT="1"`; default advertises no tools and injects nothing | `hooks/pi/sk-vision.ts` |
| Pi command | Native `registerCommand("vision")`: `/vision <q>` queries; bare `/vision` prompts via `ctx.ui.input` then queries; fresh client per call; teardown in `finally`; `session_shutdown` backstop | `hooks/pi/sk-vision.ts` |
| Teardown | `SK_VISION_TEARDOWN` = `close` (default hard-close) / `unload` / `keep`, honored in both hosts | both command handlers |
| Build | `dist/plugin.js` + `hooks/opencode/sk-vision.js` regenerated | `vision-runtime/dist` |

### Cross-runtime command surface (added)

`/vision` is now a first-class command in OpenCode, Cursor, and Pi, following the `goal-*` per-runtime precedent (excluded from Claude; Devin has no command surface). Each host reaches sk-vision its own way.

| Runtime | `/vision` mechanism | File |
|---------|---------------------|------|
| OpenCode | Plugin `command.execute.before` hook injects a `<SK-VISION COMMAND>` block | `.opencode/commands/vision.md` (native) |
| Cursor | Prompt command drives the `sk_vision_inspect` MCP tool (registered in `.cursor/mcp.json`) | `.cursor/commands/vision.md` (native) |
| Pi | Prompt command drives a hidden (registered-but-not-advertised) `sk_vision_inspect` tool with per-call teardown | `.pi/prompts/vision.md` (native) |
| Mirror scope | `vision.md` excluded from Claude mirror; Cursor/Pi natives protected from prune | `runtime-mirrors/command-scope.cjs` |

The Pi hook was reworked: default mode registers the tools hidden and tears a fresh runtime down after each call; the code-registered `registerCommand("vision")` was removed in favor of the prompt file; auto-inspect mode is unchanged. Trade-off: Pi's bare `/vision` no longer opens a UI input box (prompt files cannot) — the agent asks in-chat or returns a full read.

### Documentation and changelog (added)

The skill docs were swept to the command-gated model by a GPT-5.6-Luna (xhigh, fast) cli-codex worker, then independently re-validated. Fourteen docs now describe the off-by-default posture, the per-host `/vision` command, runtime teardown, and the `SK_VISION_AUTOINSPECT` / `SK_VISION_TEARDOWN` flags: SKILL.md, README.md, hooks/README.md, the feature-catalog root plus its three host-adapter leaves, the manual-testing-playbook root plus its two host-adapter leaves and the auto-inspect-guarantee scenario, and two new command scenarios (`opencode-vision-command.md`, `pi-vision-command.md`). The first local changelog entry lives at `changelog/v0.2.0.0.md` and the SKILL.md version moved from 0.1.3.1 to 0.2.0.0. A stale SKILL.md self-check that grepped `pi.registerTool` (now a single wrapper) was corrected to count tool definitions, so the row's command returns 13 again.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The code was implemented by a GPT-5.6-Luna (xhigh, fast) worker dispatched through cli-codex with a fenced allowed-write-path set, then independently re-verified from the orchestrating session (typecheck/tests/build re-run, scope sweep, comment-hygiene grep). The shared runtime contract (`tools.ts`, `mcp/server.ts`, `photon.ts`, `runtime/client.ts` behavior, `runtime.py`) was not modified — only new callers and existing-method calls (`close`/`unload`/`query`) were added — so Cursor/Devin (MCP) remain untouched.

The one inferred assumption remains: that OpenCode's `command.execute.before` fires for a markdown-defined command and its returned `parts` reach the model. This is not testable from a Claude session, so it is the first operator smoke test; if it fails, the fallback is to register one minimal `sk_vision` tool driven by the command (a bounded change to `plugin.ts` + `command.ts`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Opt-in via `/vision`, not model-gated auto-inject | Operator wants no auto-activation; a command is the single, predictable entry point |
| OpenCode bare `/vision` = auto-read (zero tools) | A command hook cannot pop a text dialog; auto-reading the latest image is the useful zero-tool default |
| Pi bare `/vision` = interactive prompt | Pi exposes `ctx.ui.input`, so it can ask for the question in one flow |
| Hard teardown after each call (default) | Operator requires no memory/GPU creep; warm/idle mode stays available behind a flag |
| Keep old auto-inject behind `SK_VISION_AUTOINSPECT` | Reversible without a code change; lowest blast radius |
| Do not touch `tools.ts`/`mcp/server.ts`/runtime contract | Protects the shared runtime and the Cursor/Devin MCP hosts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck (`bun run typecheck`) | PASS — exit 0 (re-run independently) |
| Unit tests (`bun test`) | PASS — 20 pass / 0 fail, exit 0 |
| Build (`bun run build`) | PASS — exit 0; `dist/plugin.js` + hooks bundle regenerated |
| Default-return grep (no tools/inject) | PASS — OpenCode default returns only `command.execute.before`; Pi default registers no tools |
| Comment hygiene | PASS — zero spec-path/id markers in the changed files |
| Cursor/Devin + shared runtime unchanged | PASS — only 5 files changed; `tools.ts`/`mcp/server.ts`/`client.ts`/`photon.ts`/`runtime.py` untouched |
| Scope (no foreign writes) | PASS — worker changed only the allowed paths; concurrent `mcp-obsidian` work left untouched |
| Runtime-mirror sync `--check` | PASS — 171 mirrors in sync; no Claude vision mirror; Cursor/Pi natives recognized |
| Pi-prompt sync `--check` | PASS — 35 prompts in sync |
| Cursor MCP tool wired | PASS — `.cursor/mcp.json` registers `sk-vision` (4 servers); `mcp__sk-vision__sk_vision_inspect` resolves |
| Command file presence | PASS — OpenCode/Cursor/Pi `vision.md` present; `.claude/commands/vision.md` absent |
| Skill docs updated (14 files) | PASS — command-gated model + env flags; `validate_document.py` 0 issues each |
| Feature-catalog package | PASS — `validate_catalog_package.py --package sk-vision`, 0 violations |
| Manual-testing-playbook package | PASS — `validate-playbook-package.cjs --package sk-vision`, 27 scenarios, 0 violations |
| Changelog + version bump | PASS — `changelog/v0.2.0.0.md` created; SKILL.md `version` 0.1.3.1 to 0.2.0.0 |
| Packet strict validate | PASS — `validate.sh --strict` Errors 0 / Warnings 0 |
| OpenCode live smoke (`/vision` arg + bare) | PENDING — operator-run |
| Cursor live smoke (`/vision` arg + bare) | PENDING — operator-run |
| Pi live smoke (`/vision` arg + bare) | PENDING — operator-run |
| Runtime process gone after call | PENDING — operator-run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- That `command.execute.before` fires for a markdown-defined command is inferred from the plugin types and needs a live smoke test; the one-minimal-tool fallback covers the failure case.
- Live OpenCode/Pi behavior cannot be exercised from a Claude session; those smoke tests are operator-run.
- Hard teardown adds model-load latency to each `/vision` call; the warm/idle mode behind `SK_VISION_TEARDOWN` trades a little residency for speed.
- `dist/` artifacts are gitignored build output; a fresh checkout must run `bun run scripts/build.ts`.
- `description.json` / `graph-metadata.json` are generator-produced, not hand-authored.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:commit-status -->
## COMMIT STATUS

Nothing in this packet is committed. The docs are authored; implementation, rebuild, smoke tests, and doc updates remain. Committing is withheld until the operator asks.
<!-- /ANCHOR:commit-status -->
