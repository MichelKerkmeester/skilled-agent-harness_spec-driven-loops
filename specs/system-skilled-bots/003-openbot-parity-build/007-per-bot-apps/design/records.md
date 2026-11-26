---
title: "Design: the apps declaration, the run record field and the filtered UTCP config"
description: "Every field this phase adds or writes: the apps frontmatter key, Posture.apps, HonoredPosture.apps, the four top-level keys of the filtered config with the one rewrite, the worktree copy, the child environment key and the checker line, each with its type, null rule, absent-key default and version rule."
trigger_phrases:
  - "apps declaration fields"
  - "filtered utcp config shape"
  - "posture apps run record"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The apps declaration, the run record field and the filtered UTCP config

This file fixes every shape this phase adds or writes. The packet-level record contract owns the run record's field table and the version rules, so this file cites it and does not copy it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"]

Six shapes are in play. Three are new keys, one is a new file, one is a copy of that file in a second place and one is an environment variable.

| Shape | Where it lives | Owner of the shape | Section |
|-------|----------------|--------------------|---------|
| `apps:` | `bots/<id>/BOT.md` frontmatter | this phase | 1 |
| `Posture.apps` | the parsed definition in memory | this phase | 2 |
| `posture.apps` | `<identity>/records/<runId>.json` | this phase, in the packet's run record table | 3 |
| `<runFolder>/utcp.json` | the run folder under the Skilled tree | this phase | 4 |
| `<worktree>/.utcp_config.json` | the run's own worktree root | this phase | 5 |
| `UTCP_CONFIG_FILE` | the child environment | this phase | 6 |

---

## 1. THE `apps:` DECLARATION

One frontmatter key on `BOT.md`. It is a list of connector server names, and each name must be a `manual_call_templates[].name` in the checkout's `.utcp_config.json`.

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `apps` | array of non-empty strings, or `null` | yes, and it is the default | 007 | 007 | `null`, which means no server |

The parse rules, in the order the parser applies them:

1. The key is absent, or its value is `null`. `Posture.apps` is `null`. No refusal.
2. The value is a list. Every entry must be a string of at least one character after no trimming, because a name is matched exactly. `Posture.apps` is the list as written, in declaration order, duplicates kept.
3. The value is anything else, or any entry is not a non-empty string. The definition is refused `apps-invalid`, and the detail names the offending entry or the value's type.

An empty list is a legal declaration and is not the same as an absent key. `apps: []` yields `Posture.apps` `[]`, so the run writes a config with no server and records `posture.apps: []`. An absent key yields `Posture.apps` `null`, so the run writes the same empty config and records the same `[]`. The two differ only in the parsed definition, which is what the checker reads to decide whether to resolve names at all.

A run whose `Posture.apps` is `null` writes `{"manual_call_templates": []}` without reading the source config, so a config that is missing or unparsable cannot widen it. A worktree run writes that same file into the tree root, because a child that found no file there would read the tree's own committed config and reach every server.

The key joins the parser's closed key set, so a definition that declares it stops being refused `definition.unknown-key`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92] The set is closed and an unknown key refuses the whole definition, which is why the key must be added before any bot can declare it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:233]

Sample frontmatter, the four legal forms:

```yaml
# absent: no server, the fail-closed default
isolation: worktree

# explicit null: the same meaning, written out
apps: null

# an empty declaration: no server, and the checker resolves nothing
apps: []

# one server
apps: [github]
```

The shipped template carries the second form, `apps: null`, with its default named in a comment. [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:21]

---

## 2. `Posture.apps` IN THE PARSED DEFINITION

The parser's posture block gains one field. The block is the author's declaration, so a field here is nullable and means "not declared". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:54]

| Field | Type | Null | Meaning |
|-------|------|------|---------|
| `isolation` | `'worktree' \| 'shared' \| null` | yes | the declared isolation, resolved against the repository default later |
| `sandbox` | `string \| null` | yes | the declared sandbox class |
| `secrets` | `string \| null` | yes | the declared secrets policy, recorded only |
| `apps` | `string[] \| null` | yes | the declared server names, `null` when the key is absent or `null` |

`Posture.apps` is the declaration and never the honored list. The honored list is section 3. A reader that wants to know what a run reached reads the record, not the definition.

---

## 3. `posture.apps` ON THE RUN RECORD

The run record's posture block is the honored posture, so its field is not nullable. The packet's run record table owns the row and this section states the same row with the detail a builder needs. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS"]

| Key | Type | Null | Owner | Lands | Absent reads as |
|-----|------|------|-------|-------|-----------------|
| `posture.apps` | array of strings, the honored server names, `[]` when none was declared | no | 007 | 007 | `[]` |

The four rules that decide the value:

1. The value is the resolved list, in the source config's `manual_call_templates` order and never in declaration order, so two bots that declare the same names in a different order record the same list.
2. A bot that declares no `apps` records `[]`. A bot that declares `apps: []` records `[]`. The record cannot tell the two apart, and nothing needs it to.
3. A run refused before dispatch still writes a record, and that record carries the posture block the seed already holds, so `posture.apps` is `[]` there and never a partial list. The refusal is read from `exit.reason`, not from a missing posture block.
4. A record written before this phase has no `posture.apps` and reads as `[]`. The record validator checks the posture block's shape and its named fields and keeps any other key, so no validator change is needed and `schemaVersion` stays `1`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"]

Sample posture block on a run of a bot declaring `apps: [github]`:

```json
{
  "posture": {
    "isolation": "worktree",
    "sandbox": "workspace-write",
    "executorKind": "cli-codex",
    "model": null,
    "apps": ["github"]
  }
}
```

Sample posture block on a shared run of a bot declaring nothing:

```json
{
  "posture": {
    "isolation": "shared",
    "sandbox": "read-only",
    "executorKind": "cli-opencode",
    "model": null,
    "apps": []
  }
}
```

The second sample is the limit the packet decision D5 confirms. The record says `[]` and the child reads the repository config, because a shared run's working directory is the checkout and the project pin resolves there. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D5]

---

## 4. `<runFolder>/utcp.json`, THE FILTERED CONFIG

One file per run, written before dispatch and never rewritten during the run. Its path is `<runFolder>/utcp.json`, where `<runFolder>` is the run folder the runner already resolves. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:365]

The file is the source config with one list filtered. Every top-level key is copied verbatim, and the only rewrite is one path inside `load_variables_from`. That is this phase's decision G6 in `../goal.md`, and it is why the file carries no key of its own.

| Key | Type | Rule |
|-----|------|------|
| `load_variables_from` | array of `{variable_loader_type, env_file_path}` | copied, and each `env_file_path` is rewritten as the absolute path it resolves to from the source config's folder |
| `tool_repository` | object | copied verbatim |
| `tool_search_strategy` | object | copied verbatim |
| `manual_call_templates` | array of template entries | filtered to the honored names, in source order and `[]` when the bot declares none |

A top-level key the source config does not hold is not invented, and a key it holds is never dropped. The four keys above are the ones the repository config holds today. [SOURCE: .utcp_config.json:2] [SOURCE: .utcp_config.json:8] [SOURCE: .utcp_config.json:11] [SOURCE: .utcp_config.json:14]

### 4.1 A `manual_call_templates` entry

An entry is copied whole and never reshaped. Its three keys are the source's.

| Key | Type | Rule |
|-----|------|------|
| `name` | string | the server name a declaration is matched against, exactly and case-sensitively |
| `call_template_type` | string | copied verbatim, `mcp` in every entry today |
| `config` | object | copied verbatim, including any `env` block and any `${VAR}` placeholder inside it |

The `config` block may hold a `${VAR}` placeholder. A placeholder is not a value, so the copy holds no credential. Resolving it is the Code Mode server's job at call time, against the environment the child already has. The rule is NFR-S01 in `../spec.md` section L2.

### 4.2 The `load_variables_from` rewrite

A relative `env_file_path` resolves against the folder of the config file that names it. The copy sits in the run folder, so a relative path copied unchanged would point at a file that is not there. Each entry keeps its `variable_loader_type` and its `env_file_path` is written as the absolute path it resolves to from the source config's folder.

| Source entry | Written entry, source config at `/repo/.utcp_config.json` |
|--------------|-----------------------------------------------------------|
| `{"variable_loader_type": "dotenv", "env_file_path": ".env"}` | `{"variable_loader_type": "dotenv", "env_file_path": "/repo/.env"}` |
| `{"variable_loader_type": "dotenv", "env_file_path": "/etc/bots/env"}` | `{"variable_loader_type": "dotenv", "env_file_path": "/etc/bots/env"}` |

An absolute path is left as written, because resolving it against the source folder would change it. The rewrite adds no key and drops none, so the entry's shape is the source's.

### 4.3 No version key

The file carries no `schemaVersion` and no `version`. A version key would be a top-level key the source config does not hold, which D6 forbids, and it would make the copy a different shape from the file the Code Mode server already reads. The file's version is the source config's shape, and a change to that shape is a change to the source config, not to this copy.

### 4.4 Sample

Source config, three servers, one relative dotenv path:

```json
{
  "load_variables_from": [{ "variable_loader_type": "dotenv", "env_file_path": ".env" }],
  "tool_repository": { "tool_repository_type": "in_memory" },
  "tool_search_strategy": { "tool_search_strategy_type": "tag_and_description_word_match" },
  "manual_call_templates": [
    { "name": "github", "call_template_type": "mcp", "config": { "mcpServers": { "github": { "transport": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github@latest"], "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}" } } } } },
    { "name": "notion", "call_template_type": "mcp", "config": { "mcpServers": { "notion": { "transport": "stdio", "command": "npx", "args": ["-y", "@notionhq/notion-mcp-server"], "env": { "NOTION_TOKEN": "${NOTION_TOKEN}" } } } } },
    { "name": "figma", "call_template_type": "mcp", "config": { "mcpServers": { "figma": { "transport": "stdio", "command": "figma-ds-cli", "args": ["mcp"], "env": {} } } } }
  ]
}
```

The filtered copy for `apps: [github]`, written to `<runFolder>/utcp.json`:

```json
{
  "load_variables_from": [{ "variable_loader_type": "dotenv", "env_file_path": "/repo/.env" }],
  "tool_repository": { "tool_repository_type": "in_memory" },
  "tool_search_strategy": { "tool_search_strategy_type": "tag_and_description_word_match" },
  "manual_call_templates": [
    { "name": "github", "call_template_type": "mcp", "config": { "mcpServers": { "github": { "transport": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github@latest"], "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}" } } } } }
  ]
}
```

The filtered copy for a bot that declares nothing, written to the same path:

```json
{
  "load_variables_from": [{ "variable_loader_type": "dotenv", "env_file_path": "/repo/.env" }],
  "tool_repository": { "tool_repository_type": "in_memory" },
  "tool_search_strategy": { "tool_search_strategy_type": "tag_and_description_word_match" },
  "manual_call_templates": []
}
```

Both samples are golden files beside this one: `fixtures/utcp-filtered-one.json` and `fixtures/utcp-filtered-none.json`, over the source `fixtures/utcp-source.json`. The source is a three-server sample rather than the repository's fourteen, so a test reads a file it can hold in one screen. The rule is the same at fourteen.

### 4.5 The file mode

The run folder is 0700 and the file is written through the runtime's atomic write, so it carries the process umask inside that folder. The packet's run root tree records the same mode. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "2.2 The run root in the Skilled tree"] The file holds no credential, so it needs no narrower mode than its folder.

---

## 5. `<worktree>/.utcp_config.json`, THE WORKTREE COPY

A run with its own worktree gets the same bytes at `<worktree>/.utcp_config.json`. That path is the one the five project MCP configs already pin, so the pin resolves to the filtered file without touching the pins or the doctor check. [SOURCE: .mcp.json:9] [SOURCE: .claude/mcp.json:9] [SOURCE: .codex/config.toml:17] [SOURCE: opencode.json:29] [SOURCE: .cursor/mcp.json:9]

| Property | Rule |
|----------|------|
| Path | `<worktree>/.utcp_config.json`, the worktree root and not a subfolder |
| Content | byte-identical to `<runFolder>/utcp.json` |
| Written | after the tree exists and before dispatch |
| Restored | after the child exits, from the copy the runner took before it wrote |
| Restored on next open | when a tree is found holding the filtered file at the next open of that tree, it is restored before anything else is written |

The restore is what keeps the working tree the operator commits holding the repository config. A commit the child makes during the run is not rewritten, because the restore writes the working tree and never a commit. The bounded impact is that such a commit holds a subset of the servers and no credential, so it narrows a later run rather than leaking one.

The next-open restore covers the one case the after-exit restore cannot: a run killed between the write and the restore. The tree is left holding the filtered file, and the next run that opens that tree restores it before it writes anything, so the filtered file never becomes the base a later run copies from.

### 5.1 Which file each executor kind reads

The pin is a relative path, so the file it resolves to is decided by the child's working directory. One row per kind, so no builder assumes a kind reads the filtered file when it does not.

| Kind | Config file | Pin present | Child working directory | Which file wins |
|------|-------------|-------------|-------------------------|-----------------|
| `native` | none, the runtime spawns no CLI | not applicable | the run's worktree, or the checkout for a shared run | the filtered file on a worktree run, the repository config on a shared run |
| `cli-codex` | `.codex/config.toml` | yes | the run's worktree | the filtered file on a worktree run, the repository config on a shared run |
| `cli-claude-code` | `.claude/mcp.json` | yes | the run's worktree | the same |
| `cli-opencode` | `opencode.json` | yes | the run's worktree | the same |
| `cli-cursor` | `.cursor/mcp.json` | yes | the run's worktree | the same |
| `cli-devin` | `.devin/mcp_config.json` | yes | the run's worktree | the same |
| `cli-pi` | `.pi/mcp.json` | yes | the run's worktree | the same |
| `cli-deepseek-harness` | `.dsh/patches/mcp-code-mode.patch.yml` | yes, in the patch | the run's worktree | the same |
| `cli-mistral-vibe` | `.vibe/config.toml` | no, the file holds no MCP block | a temporary lineage folder, not the tree | neither the filtered file nor the checkout's config, because the relative pin resolves inside the temporary folder |

Two consequences a builder must not undo. The seven config files that hold the pin are `.mcp.json`, `.claude/mcp.json`, `.codex/config.toml`, `opencode.json`, `.cursor/mcp.json`, `.devin/mcp_config.json` and `.pi/mcp.json`, and `.dsh/patches/mcp-code-mode.patch.yml` carries it for the harness. `.vibe/config.toml` holds none, and `cli-mistral-vibe` starts its child in a temporary folder, so that kind reads neither copy. `apps` narrows the eight kinds whose child starts in the tree and not `cli-mistral-vibe`, which is the limit `../spec.md` section 6 names.

No test proves a kind reads the filtered file, because that needs a live executor. The suite proves the file is written at the path the pin names, and the pin's own presence is the `/doctor:mcp` check's, which this phase leaves unchanged.

---

## 6. `UTCP_CONFIG_FILE` IN THE CHILD ENVIRONMENT

One variable, set on every dispatched run.

| Property | Rule |
|----------|------|
| Name | `UTCP_CONFIG_FILE` |
| Value | the absolute path of `<runFolder>/utcp.json` |
| Secret | no, it is a path inside the run folder |
| Admitted by | the per-dispatch key list `dispatchEnvKeys`, never a prefix rule and never a widened kind list |
| Inherited | yes, by every run, and the project pin overrides it |

The key is admitted per dispatch because the executor's per-kind list is the only place that says which keys a caller may name. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1498] A prefix rule would admit any future caller's key built from a bot-controlled name, which is this phase's decision G5 in `../goal.md`.

The variable is set on every run, including a shared run that declares no `apps`. On a shared run the project pin overrides it, so the child reads the checkout's config. The variable still names the run's evidence, which is why it is set rather than omitted.

---

## 7. THE CHECKER LINE

The checker prints one line per finding, in the form `PASS|FAIL|INFO: <id>: <message>`. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:112]

| Property | Rule |
|----------|------|
| Invariant id | `apps-unknown-server` |
| Line | `FAIL: apps-unknown-server: bots/<id>/BOT.md: <names>` |
| Message | the unknown names, comma separated, in declaration order |
| Exit | 1, because a hard invariant failed |
| Printed when | a definition declares at least one name the checkout's `.utcp_config.json` does not hold |
| `INFO` line | `INFO: apps-unknown-server: <path> is not there, so no server name can be checked` |
| `INFO` printed when | a definition declares `apps` and the checkout has no `.utcp_config.json`. The exit is unchanged, because a checkout defect is not a definition defect |

The id joins the hard invariant list, so the checker's own audit reports it like every other hard invariant. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:39] A definition that declares no `apps` prints no line for this id. A checkout with no `.utcp_config.json` prints the `INFO` line above and does not fail the invariant, because there is no name to check against and the checker's job is the definition. The runner refuses that case as `apps-refused`, so the run still stops.

---

## 8. VERSION RULES

| Shape | Version | Why |
|-------|---------|-----|
| `apps:` in `BOT.md` | none | a definition carries no version of its own, and the document `version` key describes the file |
| `Posture.apps` | none | in memory only |
| `posture.apps` on the run record | `schemaVersion` stays `1` | an added key keeps the version, and a reader takes the absent key as `[]` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"] |
| `<runFolder>/utcp.json` | none | the copy carries the source config's keys verbatim, so a version key would be a key the source does not hold |
| `<worktree>/.utcp_config.json` | none | the same bytes as the run-folder copy |
| `UTCP_CONFIG_FILE` | none | an environment variable |

No shape here is a closed key list, so no revert step is needed. A runtime built before this phase reads a record with `posture.apps` and keeps the key, and it reads a definition that declares `apps` as `definition.unknown-key`, which is the refusal this phase removes.
