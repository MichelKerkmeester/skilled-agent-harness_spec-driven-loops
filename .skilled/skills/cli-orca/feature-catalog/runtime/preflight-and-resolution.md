---
title: "Executable resolution and versioned preflight"
description: "Resolves exactly one Orca executable per session and captures version evidence before any version-sensitive command runs."
trigger_phrases:
  - "orca executable resolution"
  - "orca versioned preflight"
  - "orca-cli guide authority"
  - "orca-ide screen reader resolution"
version: 1.0.0.0
---

# Executable resolution and versioned preflight (cli-orca)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The cli-orca skill resolves exactly one Orca executable per session in a fixed order and keeps it for the whole task, then captures version evidence before relying on any flag. The order exists because on Linux outside an Orca-managed terminal the bare name `orca` normally resolves to the GNOME Orca screen reader, so the runtime picks a more specific candidate first.

---

## 2. HOW IT WORKS

The resolution order is: `ORCA_CLI_COMMAND` when it is set, then `orca-dev` from an Orca development checkout whose session exposes `ORCA_DEV_REPO_ROOT`, then `orca-ide` on Linux outside an Orca-managed terminal, then `orca` otherwise. Orca exports `ORCA_CLI_COMMAND` for managed WSL sessions, which is why the environment override leads. The session never falls through to another executable after the selected one fails, because a fallthrough could silently target a different Orca build, and `ORCA` in guide examples is a placeholder to substitute, never a literal command.

The preflight captures the resolution evidence before any version-sensitive command: `command -v`, `--version`, `--help`, `agent-context --json`, and the version-matched guide through `orca skills get <name> --full`, where `<name>` is the official skill such as `orca-cli`. The `agent-context --json` call is a local command-registry read and is safe in headless contexts. When a runtime command reports that Orca is not running, start it with `orca open --json` and retry, and if the CLI is missing say so explicitly instead of inspecting source files first.

The binary-matched guide outranks every local document and every official discovery stub. A command or flag the installed guide does not show is reported as unknown, flags frozen from a stub are never used when the installed guide or `--help` output differs, and any flag claim is reported together with the Orca version and the guide command that backed it. When a guide reference flag is rejected or the guide version does not match the running binary, the request escalates instead of being guessed through.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-orca/SKILL.md` | Runtime contract | States the resolution order, the preflight evidence capture, the guide-authority rules and the NEVER rules against executable switching and stub-frozen flags. |
| `.skilled/skills/cli-orca/references/orca-cli-reference.md` | Preflight | Records the resolution and preflight section, the placeholder substitution rule and the deliberately-unknown boundary for local claims. |
| `.skilled/skills/cli-orca/references/session-and-runtime.md` | Runtime contract | Holds the resolution detail, runtime-state checks, session binding and handoff receipts behind the preflight. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Test harness | Fleet gate proving the cli-orca root carries a byte-fresh leaf manifest, so the references the preflight loads are declared routing targets. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py` | Test harness | Package completion gate running the skill package checks for the standalone skill root. |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Node test | Document validator that classifies catalog leaves and enforces the Validation And Tests table contract they carry. |
| `.skilled/skills/cli-orca/references/troubleshooting.md` | Reference | Fail-closed recovery for the escalation cases the preflight raises, including a missing executable and a guide mismatch. |

---

## 4. SOURCE METADATA

- Group: Runtime
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runtime/preflight-and-resolution.md`

Related references:
- [feature-catalog.md](../feature-catalog.md): the package index linking this leaf
- [../../references/session-and-runtime.md](../../references/session-and-runtime.md): the runtime-state checks and receipt contract behind the preflight
