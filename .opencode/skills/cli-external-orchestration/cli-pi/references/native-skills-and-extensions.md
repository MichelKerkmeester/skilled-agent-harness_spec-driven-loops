---
title: "Pi Native Skills and Extensions"
description: "Confidence-labeled guidance for Pi's native SKILL.md, prompt-template, extension, and package resource surfaces."
trigger_phrases:
  - "pi native skills"
  - "pi skill discovery"
  - "pi prompt templates"
  - "pi extensions"
  - "pi resource loader"
importance_tier: important
contextType: implementation
version: 1.2.0.0
---

# Pi Native Skills and Extensions

This reference covers Pi's own resource model, which is distinct from this repository's skill system.

Confidence rule: anything marked **Per Pi docs, unconfirmed** is documentation-only for this packet. The local contract pin is the authority for live observations: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

## 1. OVERVIEW

### Core Principle

Pi's own resource model (skills, prompt templates, extensions) is a separate consumer contract from this repository's own skill system. Confidence rule: anything marked **Per Pi docs, unconfirmed** is documentation-only; the local contract pin and phases 012/013 are the authority for live observations.

### Purpose

Separates Pi-native skill/prompt-template/extension discovery from this repo's own OpenCode skill packet, and tracks which of those surfaces have moved from documented-only to live-confirmed.

### When to Use

- Deciding whether a claim about Pi's resource discovery is backed by a live test or only by Pi's own documentation
- Checking whether prompt templates or extensions are safe to treat as confirmed before relying on them
- Planning the remaining native-skill-discovery verification work

---

## 2. NATIVE SKILLS

Per Pi docs, unconfirmed: Pi implements the Agent Skills standard and loads skills from global, project, package, settings, and explicit CLI locations. See [Pi skills documentation](https://pi.dev/docs/latest/skills).

Per Pi docs, unconfirmed: directories containing SKILL.md can be discovered recursively in skill locations, while some root markdown files are treated as individual skills. Do not use this as proof that this hub's nested packet shape will flatten safely inside Pi.

Per Pi docs, unconfirmed: Pi reads a skill's description at startup and loads the full SKILL.md on demand. The documented model is progressive disclosure, but this packet has not live-verified the resulting prompt content in a successful provider session.

Per Pi docs, unconfirmed: explicit --skill paths are additive and can be used with discovery controls. Check the installed help before relying on a flag in a future version.

---

## 3. REPOSITORY SKILL VERSUS PI SKILL

The repository's cli-pi SKILL.md is an OpenCode skill packet. Pi's native SKILL.md surface is a separate consumer contract.

| Concern | This repository | Pi-native surface |
|---|---|---|
| Advisor identity | Hub graph metadata | Not part of Pi's documented skill standard |
| Routing | mode-registry.json and hub-router.json | Per Pi docs, unconfirmed resource discovery |
| Runtime guard | hard_rules and self-invocation guard | Per Pi docs, unconfirmed loading behavior |
| References | Packet-local references directory | Per Pi docs, unconfirmed skill-relative resources |
| Verification | parent-skill-check and package validator | Per Pi docs, unconfirmed Pi validation warnings |

Do not copy this packet into Pi and assume the hub's single advisor identity survives. That bridge belongs to a separate integration.

---

## 4. PROMPT TEMPLATES

**Confirmed (phases 012/013):** Pi discovers flat, non-recursive markdown files under `.pi/prompts/` and exposes each as a slash command named after the file. This repo mirrors all 36 canonical `.opencode/commands/**/*.md` files this way; `sync-prompts-pi.cjs --check` reports `36 prompts are in sync`. Argument substitution — including `$ARGUMENTS` as a documented alias for `$@` — was live-confirmed in a real generated prompt file during a live session (phase 013, scenario PI-008). See [RPC documentation](https://pi.dev/docs/latest/rpc) for how prompt-template commands surface in `get_commands` output.

Per Pi docs, unconfirmed: full path-precedence rules across every documented discovery location (global, project, package, settings, explicit CLI path) beyond the project-local `.pi/prompts/` location this packet actually populates.

Use [prompt-templates.md](../assets/prompt-templates.md) for caller-side dispatch templates, and see [pi-tools.md](./pi-tools.md) §4 for the sibling-comparison framing of this surface.

---

## 5. EXTENSIONS

**Confirmed (phase 012):** Pi auto-discovers project-local `.pi/extensions/*.ts` files with no settings-file registration required. This repo has 6 real extension files (`spec-gate-enforce`, `spec-gate-classify`, `dispatch-preflight-lint`, `dispatch-audit`, `post-edit-quality`, `mcp-route-guard`), each a plain `ExtensionFactory` calling `pi.on(event, handler)` against this repo's own shared guard-core modules. A live `pi --offline --approve` session loaded all 6 without a startup error. Every guard wraps its call in try/catch and fails open — a guard-core exception must never block work it merely observes.

The local pin also confirmed that Pi discovered a project-local `.pi/extensions/probe.ts` and failed the whole session when it exported an invalid value; replacing the stub with a callable default factory removed that specific validation error. This means an invalid extension is fail-closed at startup — distinct from, and orthogonal to, the fail-open discipline of the 6 real extensions' own internal guard logic above.

**Live-firing-confirmed (2026-07-28):** the extension API exposes 33 named lifecycle events (including block-capable `tool_call`), confirmed via a direct read of the installed package's `types.d.ts`, and a probe-instrumented authenticated session captured `session_start`, `input`, `tool_call`, `tool_result`, and `session_shutdown(quit)` actually firing mid-dispatch with side-effect evidence (playbook scenario PI-020). Only `session_compact` remains untraced; it fires solely on manual `/compact`, the context threshold, or overflow recovery in an interactive session.

Per Pi docs, unconfirmed: loading from user, CLI-flag, or package locations (only the project-local `.pi/extensions/` location has been built and tested), and inspecting structured system-prompt data. See [Pi extensions documentation](https://pi.dev/docs/latest/extensions).

Extension safety rules:

1. Review source before enabling it.
2. Keep the extension path explicit.
3. Test invalid exports in an isolated directory.
4. Capture startup errors.
5. Do not rely on a warning if the session can fail closed.

---

## 6. CLI RESOURCE FLAGS

The installed help contains these resource controls:

| Flag | Meaning |
|---|---|
| --extension, -e | Load an extension path |
| --no-extensions, -ne | Disable extension discovery |
| --skill | Load a skill path |
| --no-skills, -ns | Disable skills discovery |
| --prompt-template | Load a prompt template path |
| --no-prompt-templates, -np | Disable prompt-template discovery |
| --theme | Load a theme path |
| --no-themes | Disable theme discovery |

The names are confirmed by the local help capture. Their full precedence rules are not all confirmed by the pin.

---

## 7. SETTINGS AND PACKAGES

Per Pi docs, unconfirmed: package manifests can declare extensions, skills, prompts, and themes, and conventional package directories can be auto-discovered. See [Pi packages](https://pi.dev/docs/latest/packages).

The local pin confirmed that pi install modifies project settings and that --approve is required for an untrusted project-local install. It did not confirm every package-manifest filter.

Treat package resource loading as a trust boundary:

- A package can add executable extension code.
- A package can add instructions and prompts.
- A package can add skills that influence model behavior.
- A package can modify settings.
- A package can change the effective tool surface.

---

## 8. DISCOVERY VERIFICATION PLAN

Done (phases 012/013):

- ~~Create one uniquely named prompt template.~~ 36 real prompt templates built and `--check`-verified in sync.
- ~~Add one valid extension and one invalid extension.~~ 6 valid extensions built and live-loaded without a startup error; the prior phase's invalid-extension probe already confirmed the fail-closed startup path.
- ~~Start Pi in print mode.~~ Live-executed for the prompt/agent/extension load checks above.

Still open — needs a credentialed provider session:

1. Create one uniquely named skill at each candidate location (global, project, package, settings, explicit CLI path).
2. Record which slash commands appear in a live session and confirm precedence when the same name exists at more than one location.
3. Compare project and global resources.
4. Confirm whether nested hub packets flatten when Pi's own skill discovery walks `.opencode/skills/`.
5. Capture a `session_compact` firing trace from a long interactive session (every other registered event was live-traced in playbook scenario PI-020, per §5).
6. Start Pi in JSON and RPC modes against a real provider (both remain doc-grounded, not live-executed, for this specific verification plan).

Until the remaining items are done, preserve the phrase documented but unconfirmed for native skill discovery specifically — prompt templates and extensions have moved from that status to confirmed, per §4/§5 above.

---

## 9. OPERATIONAL CHECKLIST

- [ ] Is this a Pi-native resource question or a repository-skill question?
- [ ] Is the claim backed by the local pin or labeled unconfirmed?
- [ ] Is the resource path explicit?
- [ ] Is project trust understood?
- [ ] Is extension code reviewed?
- [ ] Is the consumer print, JSON, or RPC?
- [ ] Is the failure path captured?
- [ ] Is the hub's single advisor identity preserved?

