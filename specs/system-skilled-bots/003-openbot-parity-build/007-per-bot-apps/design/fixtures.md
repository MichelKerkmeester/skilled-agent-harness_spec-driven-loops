---
title: "Design: the apps test fixtures and the matrix they cover"
description: "The declaration by config-state matrix with one row per case, the golden files beside this document, the literal tree of the checker defect fixture and the verify commands that run today."
trigger_phrases:
  - "apps test fixtures"
  - "apps declaration matrix"
  - "apps-unknown-server fixture"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The apps test fixtures and the matrix they cover

Two fixture sets. The runtime suite reads the goldens in `fixtures/` beside this document. The checker suite reads a defect fixture under the checker's own `scripts/fixtures/` folder, whose literal tree is section 4.

---

## 1. THE MATRIX

Every row is one case the runtime suite must cover. The declaration axis is the `apps:` value. The config axis is the state of the checkout's `.utcp_config.json`.

| # | Declaration | Config state | Expected outcome | Refusal detail |
|---|-------------|--------------|------------------|----------------|
| 1 | absent | present, three servers | `Posture.apps` `null`, `posture.apps` `[]`, the written file holds no template | none |
| 2 | `null` | present, three servers | the same as row 1 | none |
| 3 | `[]` | present, three servers | `Posture.apps` `[]`, `posture.apps` `[]`, the written file holds no template | none |
| 4 | `[github]` | present, three servers | `posture.apps` `["github"]`, the written file holds one template | none |
| 5 | `[github, notion, figma]` | present, three servers | `posture.apps` in source order, the written file holds three templates | none |
| 6 | `[figma, github]` | present, three servers | `posture.apps` `["github", "figma"]`, source order and not declaration order | none |
| 7 | `[github, github]` | present, three servers | `posture.apps` `["github"]`, the duplicate resolves once | none |
| 8 | `[nosuchserver]` | present, three servers | refused | `apps-unknown-server: nosuchserver` |
| 9 | `[github, nosuchserver]` | present, three servers | refused, and the detail names `nosuchserver` and not `github` | `apps-unknown-server: nosuchserver` |
| 10 | `[GitHub]` | present, three servers | refused, because the match is case-sensitive | `apps-unknown-server: GitHub` |
| 11 | `[chrome_devtools]` | present, holding `chrome_devtools_1` and `chrome_devtools_2` | refused, because a prefix is a different name | `apps-unknown-server: chrome_devtools` |
| 12 | `[github]` | missing | refused | `utcp-config-missing: <absolute path>` |
| 13 | `[github]` | malformed JSON | refused | `utcp-config-invalid: <parse message>` |
| 14 | `[github]` | present, no `manual_call_templates` key | refused | `apps-unknown-server: github` |
| 15 | absent | missing | the run proceeds, `posture.apps` `[]` | none |
| 16 | `apps: github` | present, three servers | refused at parse | `apps-invalid: apps: expected a list of server names` |
| 17 | `apps: [""]` | present, three servers | refused at parse | `apps-invalid: apps: entry 0 is not a non-empty string` |
| 18 | `apps: [1]` | present, three servers | refused at parse | `apps-invalid: apps: entry 0 is not a non-empty string` |
| 19 | absent | malformed JSON | the run proceeds, `posture.apps` `[]`, the written file holds no template, and the source config is never read | none |
| 20 | `[]` | missing | the run proceeds, `posture.apps` `[]`, the written file holds no template, and the source config is never read | none |

Rows 1 to 15 are the resolver's. Rows 16 to 18 are the parser's and belong to the definition suite, which is why the runtime suite asserts them through `parseDefinition` and not through `resolveApps`.

Three rows are outside the matrix because they are about the run and not the declaration:

| # | Case | Expected outcome |
|---|------|------------------|
| 21 | a worktree run declaring `[github]` | `<worktree>/.utcp_config.json` holds one template, and the tree's own file is back after the run |
| 22 | a shared run declaring `[github]` | refused `apps-unenforceable`, class `author`, exit 4, no filtered config written |
| 23 | a worktree run killed between the write and the restore, then the next open of that tree | the tree's own file is back before the next run writes anything |

Row 23 is the case this phase adds for a run killed before the restore. It is the one row the plan's integration table gains.

Rows 19 and 20 are the fail-closed default. A run that declares nothing writes `{"manual_call_templates": []}` without reading the source config, so a config that is missing or unparsable cannot widen it, and a worktree run writes that same file into the tree root. Without the worktree write the child would read the tree's own committed config and reach every server, which is the fail-open case the matrix exists to rule out.

---

## 2. THE GOLDEN FILES

Each file is the literal sample of one section of `records.md`. A test reads a golden and compares it with what the module produced, key by key and type by type.

| File | Section | What it is | Read by |
|------|---------|------------|---------|
| `utcp-source.json` | records 4.4 | a three-server source config with one relative dotenv path | the resolver, as the config it reads |
| `utcp-filtered-one.json` | records 4.4 | the filtered copy for `apps: [github]` | the writer, compared byte for byte |
| `utcp-filtered-none.json` | records 4.4 | the filtered copy for a bot that declares nothing | the writer, compared byte for byte |
| `run-record.posture.json` | records 3 | the posture block of a worktree run declaring `[github]` | the record validator, and the record assertion |
| `run-record.posture-shared.json` | records 3 | the posture block of a shared run declaring nothing | the record validator, and the shared-run assertion |

The source config is three servers and not the repository's fourteen, so a test reads a file it can hold in one screen. The rule is the same at fourteen, and the repository's own config is the fourteen-server case the checker runs against.

The `env_file_path` in both filtered goldens is `/repo/.env`, which is what `.env` resolves to from a source config at `/repo/.utcp_config.json`. A test that runs in a temporary folder substitutes its own absolute path and compares the rest.

---

## 3. THE CHECKER'S CLEAN FIXTURE

The clean fixture is the baseline the new invariant must not break. It holds one bot, `nightly-digest`, with `isolation: shared` and no `apps` key.

```text
.skilled/skills/system-skilled-bots/scripts/fixtures/clean/
  bots/config.json
  bots/nightly-digest/BOT.md
```

`bots/config.json`:

```json
{
  "identity": "local/tool"
}
```

`bots/nightly-digest/BOT.md`:

```markdown
---
id: nightly-digest
trigger: {kind: cron, expression: "0 9 * * *"}
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: local-only
---
Summarize the commits merged since the last run into a short digest.
```

The fixture declares no `apps`, so the new invariant prints no line for it and the checker's output is unchanged. That is what makes the clean run the proof that the invariant refuses nothing the old checker passed.

---

## 4. THE CHECKER'S DEFECT FIXTURE

One new folder beside the clean one, named for the invariant it proves. It is a copy of the clean fixture with one key added, so the only difference between a pass and a fail is the declaration.

```text
.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/
  .utcp_config.json
  bots/config.json
  bots/nightly-digest/BOT.md
```

`.utcp_config.json`, one `github` template, so the checker's root resolves a config and the invariant can fail:

```json
{
  "load_variables_from": [],
  "tool_repository": { "tool_repository_type": "in_memory" },
  "tool_search_strategy": { "tool_search_strategy_type": "tag_and_description_word_match" },
  "manual_call_templates": [
    { "name": "github", "call_template_type": "mcp", "config": { "mcpServers": { "github": { "transport": "stdio", "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github@latest"], "env": {} } } } }
  ]
}
```

The checker's root is the fixture folder, so without this file `resolveApps` would refuse `utcp-config-missing` and the checker would print the `INFO` line `design/records.md` section 7 fixes instead of the `FAIL` line the fixture exists to prove.

`bots/config.json`, identical to the clean fixture's:

```json
{
  "identity": "local/tool"
}
```

`bots/nightly-digest/BOT.md`, the clean fixture's file with `apps` added:

```markdown
---
id: nightly-digest
trigger: {kind: cron, expression: "0 9 * * *"}
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
apps: [github, nosuchserver]
delivery: local-only
---
Summarize the commits merged since the last run into a short digest.
```

Two names, one the repository config holds and one it does not. The expected line names `nosuchserver` and not `github`, so the fixture proves the detail is selective and not a blanket complaint.

The fixture declares `isolation: shared`, which the runner would refuse `apps-unenforceable`. That is deliberate: the checker audits the definition and never the run, so the fixture proves the invariant on the shortest path and the isolation refusal is the runtime suite's row 22.

The expected output, with the two lines the checker prints before the failure:

```text
PASS: config: bots/config.json reads cleanly
PASS: identity: local/tool (from config)
FAIL: apps-unknown-server: bots/nightly-digest/BOT.md: nosuchserver
```

The exit is 1. The two `PASS` lines are the checker's existing config and identity lines and this phase adds none.

---

## 5. VERIFY COMMANDS

Every command below runs from the repository root with no tty and prints what the line says. The two commands that read the checker's fixtures run after the build creates them, and `tasks.md` carries them on the task that creates each.

The five goldens parse:

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/fixtures
for f in *.json; do node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" || echo "BAD $f"; done
echo "5 goldens parse"
```

The filtered goldens carry the source's four top-level keys, one template and none and an absolute dotenv path that still ends with the source's relative one:

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/fixtures
node -e '
const fs = require("fs")
const path = require("path")
const src = JSON.parse(fs.readFileSync("utcp-source.json", "utf8"))
const one = JSON.parse(fs.readFileSync("utcp-filtered-one.json", "utf8"))
const none = JSON.parse(fs.readFileSync("utcp-filtered-none.json", "utf8"))
const keys = Object.keys(src).sort().join(",")
if (Object.keys(one).sort().join(",") !== keys) throw new Error("one: keys differ")
if (Object.keys(none).sort().join(",") !== keys) throw new Error("none: keys differ")
if (one.manual_call_templates.length !== 1) throw new Error("one: template count")
if (none.manual_call_templates.length !== 0) throw new Error("none: template count")
if (one.manual_call_templates[0].name !== "github") throw new Error("one: name")
const rel = src.load_variables_from[0].env_file_path
const got = one.load_variables_from[0].env_file_path
if (!path.isAbsolute(got)) throw new Error("one: dotenv path is not absolute")
if (!got.endsWith(rel)) throw new Error("one: dotenv path does not end with the source path")
console.log("4 top-level keys, 1 template and 0 templates, absolute dotenv path")
'
```

The two posture goldens carry the field this phase adds, and the shared one carries the empty list:

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/fixtures
node -e '
const fs = require("fs")
const one = JSON.parse(fs.readFileSync("run-record.posture.json", "utf8"))
const shared = JSON.parse(fs.readFileSync("run-record.posture-shared.json", "utf8"))
if (JSON.stringify(one.posture.apps) !== JSON.stringify(["github"])) throw new Error("worktree apps")
if (JSON.stringify(shared.posture.apps) !== JSON.stringify([])) throw new Error("shared apps")
if (shared.posture.isolation !== "shared") throw new Error("shared isolation")
console.log("worktree apps github, shared apps empty")
'
```
