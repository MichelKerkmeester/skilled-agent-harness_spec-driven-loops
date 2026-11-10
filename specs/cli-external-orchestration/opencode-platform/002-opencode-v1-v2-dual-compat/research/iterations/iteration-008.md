# Iteration 008 — A7: dual-key config and v1 tolerance probe

## Focus

Can one `opencode.json` and one agent frontmatter block carry both v1 and v2 keys without either
version breaking or misreading them? Probe project at
`specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a7-probe/` (git-initialised).

## Actions Taken

1. **Schema pre-read (v2 ground truth).** From `scratch/cli-help/v2-openapi.json`:
   `Config.InfoEncoded` top-level keys are
   `$schema, shell, model, default_agent, update, share, enterprise, username, permissions, policies,
   agents, snapshots, watcher, formatter, lsp, media, tool_output, mcp, compaction, skills, commands,
   instructions, references, websearch, plugins, worktree, warming, providers, experimental` with
   `additionalProperties: false`. `plugin` and `permission` are **absent** at top level.
   `Permission.Ruleset` = array of `{action, resource, effect}`, `effect` ∈ `allow|deny|ask`.
   `mcp` = `{timeout?, servers?}` with `additionalProperties: false`.
   `Config.AgentEncoded` = `model, request, system, description, mode, hidden, color, steps, disabled,
   permissions`, `additionalProperties: false` — no `permission`, `prompt`, `temperature`, `tools`.
2. **Dual-key `opencode.json` + dual-key `.opencode/agents/probe.md` + a v1 plugin**, then
   `opencode debug config` / `debug agent probe` in the probe dir with `</dev/null`.
3. **Per-key isolation on v1** (5 variants: `plugin`+`plugins`; `permission`+`permissions`;
   `permission` alone; `mcp` both shapes; `mcp.servers` alone).
4. **v2 leg:** `opencode2 debug config` (document listing), `opencode2 debug agents` (19 agents),
   and `opencode2 api GET "/api/agent?location%5Bdirectory%5D=<encoded>"` twice.
5. **v2 frontmatter discriminator:** `debug agents` once with the dual block and once with the
   v2-only block (`permission:` removed), comparing the `probe` agent object field by field.

## Findings

### F1 — v1 1.19.3 hard-rejects the v2 `permissions` config key, and the whole project dies (P0)

`opencode debug config` in the probe dir:

```
Error: Configuration is invalid at .../scratch/a7-probe/opencode.json
↳ V2 permissions are not supported by OpenCode V1. Use V1 "permission" rules or run opencode2. permissions
```

This is a **purpose-built guard**, not a schema accident: OpenAI-authored text names the key, names
the remedy, and names `opencode2`. Diagnostic scope is the whole document — every other v1 command
in that project fails too (`opencode debug agent probe` returned the same config error instead of an
agent). A single `opencode.json` carrying `permissions:` is therefore not "tolerated with a warning"
on v1; it makes the project unusable.

### F2 — v1 silently ignores `plugins` (plural) and silently accepts `plugin` (singular) (P1)

Variant `{"plugin":[...], "plugins":["@acme/v2-plural-plugin"]}` resolved to
`plugin: ["file://…/orca-opencode-status.js", "file://…/a7-probe/.opencode/plugin/v1-singular.js"]`
with `plugin_origins` listing both as `global` and `local`. The probed plugin printed
`A7 v1-singular plugin invoked` — so `plugin` is loaded. `@acme/v2-plural-plugin` never appears in
the resolved `plugin` array and produced **no warning and no error**. No `plugins` key survives in
the resolved config at all.

Consequence: `plugins:` is a **silent no-op on v1**. That is the worst failure mode for a shared
file — an install that declares its v2 plugins would look healthy on v1 while loading nothing.

### F3 — `mcp.servers` is the one v2 shape v1 genuinely tolerates: it unwraps it (P1, surprising)

Input `{"mcp":{"v1shape":{...},"servers":{"v2shape":{...}}}}` resolved to

```
"mcp": { "v1shape": { "type": "local", "command": [...] },
         "v2shape": { "type": "local", "command": [...], "enabled": true } }
```

The `servers` level is **removed** and its children promoted to real servers, with `enabled: true`
filled in. A second variant with `servers` alone produced `mcp: {v2shape: {…}}` and no server named
`servers`. So v1 1.19.3 carries an explicit v2-MCP compatibility shim, and `mcp.servers.<name>` is
the only config shape proven safe on both hosts. `mcp.<name>` (the v1 shape) was not observed in the
v2 leg, so its v2 behaviour stays UNVERIFIED.

### F4 — v1 forwards unknown agent frontmatter keys into the agent's provider `options` (P0)

Dual block (`permission:` map + `permissions:` list + `steps` + `hidden` + `color` + `disabled`)
resolved on v1 to:

```
"agent": { "probe": { "description": "...", "mode": "subagent",
  "permission": {"edit":"allow","bash":"allow"},
  "permissions": [ {"action":"edit","resource":"*","effect":"allow"} ],
  "steps": 5, "hidden": false, "color": "#ff0000", "disabled": false,
  "prompt": "A7 probe body. Reply with PROBE-OK.",
  "options": { "permissions": [ {...} ], "disabled": false } } }
```

`permissions` and `disabled` appear **twice**, the second time inside `options`. `options` is v1's
provider-request passthrough, so those two keys are candidates for the outbound model payload — a
request-time 400 rather than a load-time error. `steps`, `hidden` and `color` do **not** leak, so v1
recognises them as first-class agent fields. This closes the iteration-5 open question
("does v1 forward unknown frontmatter keys?") with a **yes, and to a dangerous place**.

### F5 — v2 mirrors the leak in the opposite direction: `permission:` diverts sibling keys into `request.body` (P0)

The same `probe.md`, read by `opencode2 debug agents`, yields two different objects depending on one
key.

Dual block (contains `permission:`):

```
"id":"probe", "request": { "settings":{}, "headers":{},
  "body": { "permissions":[{"action":"edit","resource":"*","effect":"allow"}], "disabled": false } },
"system":"A7 probe body. Reply with PROBE-OK.", "description":"A7 dual-key probe agent",
"mode":"subagent", "hidden":false, "color":"#ff0000", "steps":5
```

No top-level `permissions`; the Ruleset and `disabled` have moved into `request.body`, which is v2's
provider-passthrough (`Config.AgentEncoded.request.body`).

v2-only block (identical minus `permission:`):

```
"id":"probe", "request": { "settings":{}, "headers":{}, "body": {} },
… "hidden":false, "color":"#ff0000", "steps":5,
"permissions":[{"action":"*","resource":"*","effect":"allow"}, …]   ← top-level, honoured
```

So the v1-only key `permission:` is what corrupts the v2 parse: it is absent from
`Config.AgentEncoded` (`additionalProperties: false`), yet v2 does **not** reject the agent — it
registers it and misfiles the sibling v2 keys as provider request body. The two hosts leak each
other's keys into each other's provider passthrough, symmetrically:

| Host | unknown key | destination | Effect |
|---|---|---|---|
| v1 | `permissions`, `disabled` | agent `options` | provider body |
| v2 | presence of `permission:` | `request.body` (taking `permissions`, `disabled` with it) | provider body |

Control: the repo's `markdown` agent (no unknown keys) resolves on v2 with
`request.body: {"temperature": 0.1}`, confirming `request.body` is the legitimate mapping target and
that the probe's contents are a leak, not a mapping.

### F6 — A shared agent frontmatter is viable, but only in the v1 shape plus three benign extras (P1)

Proven field by field:

| Frontmatter key | v1 1.19.3 | v2 2.0.32 |
|---|---|---|
| `description`, `mode` | accepted, applied | accepted, applied |
| `permission:` (map) | accepted, applied | **poisons the parse** (F5) |
| `permissions:` (list) | accepted, **leaks to `options`** | accepted when alone |
| `disabled:` | leaks to `options` | not isolated (UNVERIFIED alone) |
| `steps:`, `hidden:`, `color:` | top-level, no leak | top-level, honoured |
| `temperature` | mapped to `options` by design | mapped to `request.body` by design |

Recommendation: the shared block is `description`, `mode`, `steps`, `hidden`, `color`, plus v1's own
`permission:` map and v1's `tools` / `temperature` when needed — and **never** `permissions:` or
`disabled:`. Per-version permission semantics cannot be expressed in one file: v2 users get the
translated cascade (F7), not their Ruleset.

### F7 — v2 reads the v1 `permission` map and translates it, including a `bash`→`shell` rename (P1)

`opencode2 debug config`'s document projection for the **repo root** `opencode.json` (whose real
content is `permission: {edit, bash, webfetch, doom_loop, external_directory}`) reported:

```
"info": { "$schema": …, "permissions": [
  {"action":"edit","resource":"*","effect":"allow"},
  {"action":"shell","resource":"*","effect":"allow"},
  {"action":"webfetch","resource":"*","effect":"allow"},
  {"action":"doom_loop","resource":"*","effect":"allow"},
  {"action":"external_directory", … } ] }
```

So 2.0.32 carries a v1-permission→Ruleset migration, and the v1 action name `bash` becomes the v2
action name `shell`. That makes the v1 map the **portable** spelling — but the translation means a
shared file cannot express a v2 Ruleset (resource-scoped, per-action `ask`/`deny`) without breaking
v1 (F1). Treat the projection as evidence of a translator, not of exact runtime semantics; the
`bash`→`shell` mapping still needs one behavioural check (a denied `bash` staying denied on v2).

### F8 — `opencode2 debug agents` is the v2 agent-registration oracle, and v2 follows the `.opencode/agents` symlink (P1)

19 agents returned from inside the probe dir: the 12 repo project agents (`ai-council`, `code`,
`context`, `debug`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`,
`prompt-improver`, `review`), the builtins (`build`, `general`, `explore`, `compaction`, `title`,
`summary`, `plan`), and `probe`. The repo agents arrive through
`Public/.opencode/agents → ../.skilled/agents` from two directories up, so v2 walks ancestor
directories **and** follows the directory symlink. This resolves the v2-registration-oracle asymmetry
that iteration 7 could not find for commands: for agents, a real oracle exists and is `debug agents`.

## Questions Answered

None of the five strategy key questions closes on this iteration's evidence alone. Key question 2
("Can one set of agent, command, skill and opencode.json files serve both versions, and where must
they diverge?") is now answered for **three of its four legs** — commands (iteration 7), agents and
`opencode.json` (this iteration) — with the skill leg still unprobed. It is deliberately left
unticked rather than claimed on three quarters of the evidence.

## Questions Remaining

- **The skill leg of key question 2.** No skill has been probed on either host. Skills are `.md` +
  frontmatter under `.opencode/skills`; v2's `Config.InfoEncoded` has a `skills` key while v1 reads a
  directory. Discovery filter, frontmatter tolerance, and the `sk-*` router contract are unverified.
- Does v2 honour `plugin` (singular) at all, or drop it silently like v1 drops `plugins`? The v2
  document projection never shows it, so this needs a load-side probe (a plugin that prints), not
  `debug config`.
- Does v2 accept `mcp.<name>` (the v1 MCP shape), or does a v1-only MCP server simply disappear on
  v2? Unobserved in this iteration.
- Is `disabled: false` alone (without a sibling `permission:`) clean on v2, and is it dropped or
  honoured on v1? Moot for the recommended shape, but it is the one unmeasured cell of F6.
- Does a v2 Ruleset's resource scoping and `deny`/`ask` survive the v1 `permission` map path, i.e. is
  F7's translation semantically faithful? Only a behavioural test settles it.
- All prior open questions from iterations 1-7 remain open (v2 event scheme, `session.messages`
  signature, `ctx.tui`, v2 flat-plugin discovery, v2 `run --format json`, compaction events,
  `session.idle`, `Reload` mixin, `sk-vision.js` symlink, `/name args` in `run`,
  `POST /api/session/{id}/command`, v2 unknown command frontmatter keys, v2 `!`cmd`` and `@path`).

## Next Focus

A8: the skill leg — probe `.opencode/skills` discovery and frontmatter tolerance on both hosts
(`opencode debug skill` on v1, `opencode2 debug skill` or the equivalent v2 endpoint), then state the
final divergence list for key question 2.

## SCOPE VIOLATIONS

None. All writes landed in `scratch/a7-probe/` (explicitly authorised for this iteration) and in this
iteration's two research artifacts. No repo file outside the packet was touched; the probe only
*read* the ancestor `Public/opencode.json` and the `.opencode/agents` symlink.
