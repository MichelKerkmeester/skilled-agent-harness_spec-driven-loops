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
version: 1.0.0.0
---

# Pi Native Skills and Extensions

This reference covers Pi's own resource model, which is distinct from this repository's skill system.

Confidence rule: anything marked **Per Pi docs, unconfirmed** is documentation-only for this packet. The local contract pin is the authority for live observations: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

## 1. NATIVE SKILLS

Per Pi docs, unconfirmed: Pi implements the Agent Skills standard and loads skills from global, project, package, settings, and explicit CLI locations. See [Pi skills documentation](https://pi.dev/docs/latest/skills).

Per Pi docs, unconfirmed: directories containing SKILL.md can be discovered recursively in skill locations, while some root markdown files are treated as individual skills. Do not use this as proof that this hub's nested packet shape will flatten safely inside Pi.

Per Pi docs, unconfirmed: Pi reads a skill's description at startup and loads the full SKILL.md on demand. The documented model is progressive disclosure, but this packet has not live-verified the resulting prompt content in a successful provider session.

Per Pi docs, unconfirmed: explicit --skill paths are additive and can be used with discovery controls. Check the installed help before relying on a flag in a future version.

## 2. REPOSITORY SKILL VERSUS PI SKILL

The repository's cli-pi SKILL.md is an OpenCode skill packet. Pi's native SKILL.md surface is a separate consumer contract.

| Concern | This repository | Pi-native surface |
|---|---|---|
| Advisor identity | Hub graph metadata | Not part of Pi's documented skill standard |
| Routing | mode-registry.json and hub-router.json | Per Pi docs, unconfirmed resource discovery |
| Runtime guard | hard_rules and self-invocation guard | Per Pi docs, unconfirmed loading behavior |
| References | Packet-local references directory | Per Pi docs, unconfirmed skill-relative resources |
| Verification | parent-skill-check and package validator | Per Pi docs, unconfirmed Pi validation warnings |

Do not copy this packet into Pi and assume the hub's single advisor identity survives. That bridge belongs to a separate integration.

## 3. PROMPT TEMPLATES

Per Pi docs, unconfirmed: Pi loads markdown prompt templates and exposes them as slash commands. See [RPC documentation](https://pi.dev/docs/latest/rpc), which describes prompt-template commands in get_commands output.

Per Pi docs, unconfirmed: prompt-template expansion accepts arguments after a slash command. The argument substitution behavior and path precedence remain unverified for this packet.

Use [prompt-templates.md](../assets/prompt-templates.md) for caller-side dispatch templates. It is not a claim that Pi will auto-discover these files.

## 4. EXTENSIONS

The local pin confirmed that Pi discovered a project-local .pi/extensions/probe.ts and failed the session when it exported an invalid value. Replacing the stub with a callable default factory removed that specific validation error. This means an invalid extension can be fail-closed for a session.

Per Pi docs, unconfirmed: extensions are TypeScript or JavaScript modules that register commands, hooks, tools, providers, or prompt changes. See [Pi extensions documentation](https://pi.dev/docs/latest/extensions).

Per Pi docs, unconfirmed: extensions can be loaded from project, user, CLI, or package locations and can inspect structured system-prompt data. Treat those details as source guidance until a successful-path test confirms them.

Extension safety rules:

1. Review source before enabling it.
2. Keep the extension path explicit.
3. Test invalid exports in an isolated directory.
4. Capture startup errors.
5. Do not rely on a warning if the session can fail closed.

## 5. CLI RESOURCE FLAGS

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

## 6. SETTINGS AND PACKAGES

Per Pi docs, unconfirmed: package manifests can declare extensions, skills, prompts, and themes, and conventional package directories can be auto-discovered. See [Pi packages](https://pi.dev/docs/latest/packages).

The local pin confirmed that pi install modifies project settings and that --approve is required for an untrusted project-local install. It did not confirm every package-manifest filter.

Treat package resource loading as a trust boundary:

- A package can add executable extension code.
- A package can add instructions and prompts.
- A package can add skills that influence model behavior.
- A package can modify settings.
- A package can change the effective tool surface.

## 7. DISCOVERY VERIFICATION PLAN

When a successful provider session is available:

1. Create one uniquely named skill at each candidate location.
2. Create one uniquely named prompt template.
3. Add one valid extension and one invalid extension.
4. Start Pi in print, JSON, and RPC modes.
5. Record which commands appear.
6. Record path and precedence.
7. Compare project and global resources.
8. Confirm whether nested hub packets flatten.

Until then, preserve the phrase documented but unconfirmed in any derived packet guidance.

## 8. OPERATIONAL CHECKLIST

- [ ] Is this a Pi-native resource question or a repository-skill question?
- [ ] Is the claim backed by the local pin or labeled unconfirmed?
- [ ] Is the resource path explicit?
- [ ] Is project trust understood?
- [ ] Is extension code reviewed?
- [ ] Is the consumer print, JSON, or RPC?
- [ ] Is the failure path captured?
- [ ] Is the hub's single advisor identity preserved?

