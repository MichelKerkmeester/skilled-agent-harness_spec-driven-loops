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

Each hub's `mode-registry.json` is a fourth source: the deriver reads the `command` of every mode and writes the `MODE_COMMANDS` table the advisor uses to attach a slash command to a hub recommendation.

---

## 2. CONTENTS

| File | Responsibility | Authority |
|---|---|---|
| `command-bridges.generated.json` | Stores the derived command-bridge projection. | Generated, do not edit |
| `derive-command-bridges.cjs` | Reads live metadata and authored inputs, validates uniqueness and writes the projection. | Authored deriver |
| `scoring-compatibility.json` | Holds TypeScript and Python scoring compatibility mappings. | Authored input |
| `shadow-diff.md` | Records comparison evidence between generated and live bridge authorities. | Authored evidence |

---

## 3. DERIVATION FLOW

```text
skill command metadata files
scoring-compatibility.json
.skilled/commands/doctor/_routes.yaml
hub mode-registry.json files
                         |
                         v
              derive-command-bridges.cjs
                         |
                         v
              command-bridges.generated.json
```

The deriver also updates generated projection blocks in the live TypeScript and Python scoring sources. Its `GENERATED COMMAND ROWS` block in `lib/command-attach.ts` holds `COMMAND_ROWS`, one row per id a scorer can return for an enabled entry, covering the entry id and every enabled runtime id. Each row carries the runnable slash command, its derived policy and the owning skill. The same block holds `COMMAND_POLICIES`, one policy per runnable string, so a surface that attaches a command can name its policy without a second lookup. It writes the `MODE_COMMANDS` block into the same file, one row per hub mode that names a command, and fails when a mode names a command with no file under `.skilled/commands/`. Each TypeScript bridge in `lib/scorer/projection.ts` carries an `ownerSkill`, the skill that owns its command. The generated JSON and generated source blocks are outputs, not hand-edited inputs.

Each bridge row with TypeScript enabled also carries an `embeddingText`, the plain sentence a scoring vector is built from. A Python-only row carries none. A metadata row leads with its `userIntent.job` sentence and adds every `userIntent.ownedSignals` phrase, because both are written in the asker's voice. The entry `description` stands in for the job only when the record states no job. A doctor row builds it from the router frontmatter `description` and the `trigger_phrases` of the route. The deriver drops each slash command string before the parts are joined, because a name left in would hand the scorer a second copy of the token it already matches literally. The field is derived on every run and never authored, so edit the sources rather than the JSON.

---

## 4. DOCTOR BRIDGES

Ids are `command-doctor-<command>-<target>` when the doctor command owns more than one route, and `command-doctor-<command>` otherwise. `skillId` and `ownerMode` come from the router's `skill_agent` tag. A router without the tag fails the deriver with a named error.

The runnable string is the command plus its target when the command owns more than one route. A standalone entry may set `runnable`, as `/doctor:env` does with `/doctor:env list`.

A new route needs a hand-written entry in both the `typescript` and `python` lists in `scoring-compatibility.json`. Each entry carries only `inventoryId`, `order`, `id` (equal to `inventoryId`) and an empty `description`.

The deriver fills the TypeScript name, keywords, intent signals and domains from the manifest, and the Python slash marker from the runnable string. A route marked `default_target` in `_routes.yaml` also gets the bare command (for example `/doctor:ci`) as a TypeScript keyword and a Python slash marker, so the bare typed command reaches it. A typed `<command> <target>` names that target, so the bare command inside it does not also match the default target. Python matches a doctor bridge only on a typed slash command.

A doctor bridge passes on its own wording (an explicit-author phrase match). When none passes and no `/doctor:` command was typed, the scorer asks `/doctor:helper`'s own ranker, `doctor-helper-match.cjs`, whether the prompt describes a doctor problem. If it does, `command-doctor-helper` passes, and `/doctor:helper` then names the command. With no skill passing, a ranker score of 10 or more is enough, or 6 or more when the prompt names a problem. Beside a passing skill, the prompt must name a wrong state or a health check, such as `is not registered`, `never converges` or `turn off`. A `/doctor:` command counts as typed when the prompt starts with `/doctor:` or when it directly follows `run`, `execute`, `start`, `launch`, `use` or `kick off` outside quotes and backticks. A quoted command or a bare mid-sentence mention does not count. A typed command puts its own passing bridge first. A prompt that contains one of a bridge's `lead_phrases` also puts that passing bridge first, so `check my environment variables` leads with `/doctor:env`. For other prompts, a passing skill keeps first place and passing doctor bridges sit right after the second passing skill or the only passing skill. This keeps a doctor line within the CLI's three shown results. A typed command shows its matching runnable string on the top line. A skill-first brief shows `Also: /doctor:<command> <target>` on the second line. The Python fallback matches a doctor bridge only on a typed slash command.

Each `mcp_subroutes` entry becomes the bridge `command-doctor-mcp-<sub_action>`, with the runnable string `/doctor:mcp <sub_action>` and its owner from the `skill_agent` tag in `mcp.md`. Every derived doctor bridge is active in both scorers, and `doctor-phrase-reach.cjs` proves each one.

Check every admitted phrase with `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`.

Every command bridge, not only a doctor bridge, passes on its own wording. `requireCommandPhraseAnchor` in `lib/scorer/fusion.ts` drops a passing command row below threshold unless the explicit-author lane matched one of its phrases or its slash string. The one other way in is meaning: a real embedder cosine of at least 0.72 against the row's `embeddingText` vector, with a 0.02 lead over the next command row. That needs the local embedder, so without it every command row passes on its wording alone. A prompt that asks for no change rules out every command on meaning, and a read-only question admits only a bridge marked `readOnly`.

---

## 5. STANDALONE SKILL COMMANDS

A standalone skill has a `command-metadata.json` and no `mode-registry.json`, as `sk-prompt` and `system-spec-kit` do. Its commands are active in both scorers by construction and need no row in `scoring-compatibility.json`. The deriver builds each row from the metadata entry:

- TypeScript: the `userIntent.ownedSignals` phrases become the keywords and intent signals, the command's namespace and `command` become the domains, and a `read-only` `mutating` class sets `readOnly: true`.
- Python: the slash markers are the command with and without its leading slash, and `owningSkill` is the skill.

A command needs at least two `userIntent.ownedSignals`, or the deriver fails. A hand row in `scoring-compatibility.json` still wins where one exists. Generated rows take orders after the highest hand-written order.

---

## 6. HUMAN EDIT BOUNDARY

Humans may edit `derive-command-bridges.cjs`, `scoring-compatibility.json` and `shadow-diff.md`. Regenerate `command-bridges.generated.json` after changing an authored input or the deriver. Do not edit the generated JSON directly.

---

## 7. VALIDATION

Run the deriver in check mode from the repository root:

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
```

---

## 8. RISK KEYS AND COMMAND POLICY

The command tree `.skilled/commands/<namespace>/<name>.md` owns which commands exist. The deriver fails when a command file has no `command-metadata.json` entry and no doctor route. It fails again when a declaration names a command with no file.

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

---

## 9. RELATED

- [`Skill-advisor scripts`](../README.md)
