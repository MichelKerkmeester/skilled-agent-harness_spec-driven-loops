---
title: "Command bridges"
description: "Authored command-bridge inputs, compatibility evidence and the generated projection consumed by advisor scoring surfaces."
trigger_phrases:
  - "command bridges"
  - "generated command bridge projection"
  - "command bridge compatibility"
---

# Command bridges

---

## 1. OVERVIEW

`command-bridges/` is the source boundary for command metadata that is not yet represented uniformly by every scoring surface. The deriver combines live skill metadata with the authored compatibility inputs and writes the generated JSON projection.

The doctor commands are a third source: the deriver reads `.skilled/commands/doctor/_routes.yaml` and writes one bridge per doctor route and per standalone doctor command and per MCP sub-route.

---

## 2. CONTENTS

| File | Responsibility | Authority |
|---|---|---|
| `allow-list.json` | Records compatibility bridges for live commands without command metadata. | Authored input |
| `command-bridges.generated.json` | Stores the derived command-bridge projection. | Generated, do not edit |
| `derive-command-bridges.cjs` | Reads live metadata and authored inputs, validates uniqueness and writes the projection. | Authored deriver |
| `scoring-compatibility.json` | Holds TypeScript and Python scoring compatibility mappings. | Authored input |
| `shadow-diff.md` | Records comparison evidence between generated and live bridge authorities. | Authored evidence |

---

## 3. DERIVATION FLOW

```text
skill command metadata files
allow-list.json + scoring-compatibility.json
.skilled/commands/doctor/_routes.yaml
                         |
                         v
              derive-command-bridges.cjs
                         |
                         v
              command-bridges.generated.json
```

The deriver also updates generated projection blocks in the live TypeScript and Python scoring sources. It writes a generated block of runnable doctor command strings into `lib/render.ts`. The generated JSON and generated source blocks are outputs, not hand-edited inputs.

---

## 4. DOCTOR BRIDGES

Ids are `command-doctor-<command>-<target>` when the doctor command owns more than one route, and `command-doctor-<command>` otherwise. `skillId` and `ownerMode` come from the router's `skill_agent` tag. A router without the tag fails the deriver with a named error.

The runnable string is the command plus its target when the command owns more than one route. A standalone entry may set `runnable`, as `/doctor:env` does with `/doctor:env list`.

A new route needs a hand-written entry in both the `typescript` and `python` lists in `scoring-compatibility.json`. Each entry carries only `inventoryId`, `order`, `id` (equal to `inventoryId`) and an empty `description`.

The deriver fills the TypeScript name, keywords, intent signals and domains from the manifest, and the Python slash marker from the runnable string. A route marked `default_target` in `_routes.yaml` also gets the bare command (for example `/doctor:ci`) as a TypeScript keyword and a Python slash marker, so the bare typed command reaches it. A typed `<command> <target>` names that target, so the bare command inside it does not also match the default target. Python matches a doctor bridge only on a typed slash command.

A doctor bridge passes on its own wording (an explicit-author phrase match). When none passes and no `/doctor:` command was typed, the scorer asks `/doctor:helper`'s own ranker, `doctor-helper-match.cjs`, whether the prompt describes a doctor problem. If it does, `command-doctor-helper` passes, and `/doctor:helper` then names the command. With no skill passing, a ranker score of 10 or more is enough, or 6 or more when the prompt names a problem. Beside a passing skill, the prompt must name a wrong state or a health check, such as `is not registered`, `never converges` or `turn off`. A `/doctor:` command counts as typed when the prompt starts with `/doctor:` or when it directly follows `run`, `execute`, `start`, `launch`, `use` or `kick off` outside quotes and backticks. A quoted command or a bare mid-sentence mention does not count. A typed command puts its own passing bridge first. A prompt that contains one of a bridge's `lead_phrases` also puts that passing bridge first, so `check my environment variables` leads with `/doctor:env`. For other prompts, a passing skill keeps first place and passing doctor bridges sit right after the second passing skill or the only passing skill. This keeps a doctor line within the CLI's three shown results. A typed command shows its matching runnable string on the top line. A skill-first brief shows `Also: /doctor:<command> <target>` on the second line. The Python fallback matches a doctor bridge only on a typed slash command.

Each `mcp_subroutes` entry becomes the bridge `command-doctor-mcp-<sub_action>`, with the runnable string `/doctor:mcp <sub_action>` and its owner from the `skill_agent` tag in `mcp.md`. Every derived doctor bridge is active in both scorers, and `doctor-phrase-reach.cjs` proves each one.

Check every admitted phrase with `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`.

---

## 5. HUMAN EDIT BOUNDARY

Humans may edit `allow-list.json`, `derive-command-bridges.cjs`, `scoring-compatibility.json` and `shadow-diff.md`. Regenerate `command-bridges.generated.json` after changing an authored input or the deriver. Do not edit the generated JSON directly.

---

## 6. VALIDATION

Run the deriver in check mode from the repository root:

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
```

---

## 7. RISK KEYS AND COMMAND POLICY

The command tree `.skilled/commands/<namespace>/<name>.md` owns which commands exist. The deriver fails when a command file has no `command-metadata.json` entry and no doctor route. It fails again when a declaration names a command with no file. Allow-list rows sit outside this check.

A `command-metadata.json` entry and a doctor route or action carry the same risk keys. A value outside the accepted set fails the deriver before any policy is derived.

| Risk key | Accepted values | Applies to |
|---|---|---|
| `mutating` | `read-only`, `add-only`, `mutates` | Every metadata entry and every doctor route or action |
| `gate3_location` | A non-empty string naming what the command writes | Required on every metadata entry |
| `ask_first` | `settings`, `outside-repo`, `spend`, `relaunch` | Optional on both records |
| `write_scope` | `spec-folder` | Optional on both records |

`derivePolicy` reads those keys in order and stops at the first match.

| Step | Condition | Policy |
|---|---|---|
| 1 | `ask_first` lists at least one reason | `ask` |
| 2 | A doctor route or action classed `mutates` | `ask` |
| 3 | `mutating` is `read-only` | `run` |
| 4 | `mutating` is `add-only` with `write_scope` set to `spec-folder` | `run` |
| 5 | Any other record | `start` |

`commandPolicies` in `command-bridges.generated.json` holds one record per command, or one record per route or action for a doctor command. Each record carries five keys: `command`, `route`, `mutating`, `askFirst`, `policy`. Nothing scores on it yet.

A metadata entry for a command that an allow-list row already carries adds no second bridge entry. The deriver keeps the allow-list row and drops the metadata entry, so one command keeps one id.

---

## 8. RELATED

- [`Skill-advisor scripts`](../README.md)
