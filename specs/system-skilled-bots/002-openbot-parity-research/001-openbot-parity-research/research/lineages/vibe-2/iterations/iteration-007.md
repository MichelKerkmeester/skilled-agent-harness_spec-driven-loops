# Iteration 7: Connector registry design — naming a bot's apps without an OAuth server

## Focus

Broadening pass. The frontier is drained (F-1-004 and all four children answered, F-3-009 at the depth cap), so this iteration takes the next angle the evidence opened: the smallest connector registry skilled bots can add on top of MCP and Code Mode, so a bot's apps are named, granted per bot and recorded, without building an OAuth server.

## Actions Taken

1. Read `.utcp_config.json` for the current MCP server declaration surface.
2. Read `.mcp.json` and `.skilled/bin/mcp-code-mode-launcher.cjs` for the launch path.
3. Read `dispatch.ts`'s environment allowlist for the existing filtering machinery.
4. Re-read `definition.ts`'s frontmatter key set and `run-record.ts`'s posture block against the design.

## Findings

1. Skilled's connector surface is **one repo-wide UTCP config with 14 MCP servers**, each declared as a `manual_call_templates` entry with `call_template_type: mcp` and a `config.mcpServers` block. [SOURCE: .utcp_config.json:1]
2. Server environment comes from **one dotenv file**: `load_variables_from` with `variable_loader_type: dotenv` and an `env_file_path`. That is the current secret path — one shared file for every server and every bot. [SOURCE: .utcp_config.json:2]
3. The MCP surface is reached through **one launcher**: `.mcp.json` declares a single `code_mode` server that runs `.skilled/bin/mcp-code-mode-launcher.cjs` with `UTCP_CONFIG_FILE`. [SOURCE: .mcp.json:1]
4. The launcher **resolves a Node interpreter and hands off** to the MCP server under it; it is 181 lines and does no per-bot filtering. [SOURCE: .skilled/bin/mcp-code-mode-launcher.cjs:1]
5. The runner **already has an environment allowlist**: `commonlyAdmittedKeys` derives the keys every executor kind admits, and `commonEnv` gives a precheck only that part. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:191]
6. So the smallest registry is a **per-run filtered UTCP config**: the runner writes a temporary config containing only the servers the bot's `apps:` list names, and points `UTCP_CONFIG_FILE` at it. That is one file write and one environment variable, using machinery that already exists.
7. The grant belongs in **BOT.md frontmatter beside `posture`**, because `FRONTMATTER_KEYS` is already the closed set of bot fields and `apps` is one more. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92]
8. The record belongs on **`HonoredPosture` beside `secretsUsed`**, so one block answers "what could this run reach and what did it use". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123]
9. OpenBot's **per-action grant is the model to copy at the smallest scale**: "Each app comes with the actions it offers and the Bots that may use each one." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5203]
10. **No OAuth server is needed for a small team**: OpenBot's own OAuth client is the exception for vendors that refuse dynamic registration, and turnstone's per-user OAuth is opt-in and dark by default. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5626] [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md:5]

## The smallest change, with size and risk

**Shape.** One frontmatter key, one filtered-config writer, one record field, one checker invariant.

- `apps: [github, notion]` in `BOT.md` frontmatter — names that must exist in the repo's UTCP config. A name that does not exist is a refusal with a named reason, the way every other definition defect is.
- A `connectors.ts` writer that reads `.utcp_config.json`, keeps only the named templates, and writes the result to the run folder as `utcp.json`. The runner sets `UTCP_CONFIG_FILE` to that path for the child only.
- `HonoredPosture.apps: string[]` — the granted names, written at dispatch, so the run record answers "what could this run reach".
- A checker invariant: a bot whose `apps` names a server absent from the repo config fails before dispatch.

**Size.** Roughly 150–250 lines plus tests: one frontmatter key, one writer, one record field, one invariant. No new service, no OAuth server, no database.

**Risk.** The residual risk is a bot that reaches a service through a shell command instead of MCP, which the filter cannot stop. That is the same residual risk as the secret store, and the same mitigation applies: the run record names what was granted, so an audit can compare the grant against the diff.

## Ruled Out

- Building an OAuth server: it is the largest single piece of OpenBot's app layer and the one a small team can skip, because a shared account or a key covers the common case.
- Per-person connections: they need a sign-in surface and a session store. A small team on one host can share one account per app, which is OpenBot's own `shared` account mode.
- A connector catalogue: none of the eight repos ships one that a small team would use, and the UTCP config already names the servers this team actually has.

## Dead Ends

- Looking for an existing per-bot MCP filter: there is none. The launcher is a pass-through, so the filter has to be added at the config-file level rather than inside the launcher.

## Edge Cases

- Ambiguous input: "connector registry" could mean a catalogue of available apps or a record of granted ones. Selected interpretation: the record of granted ones, because the catalogue already exists as the UTCP config.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .utcp_config.json:1-40
- .mcp.json:1-15
- .skilled/bin/mcp-code-mode-launcher.cjs:1-40
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:185-215
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92-107
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5203
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5626
- specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md:5

## Assessment

- New information ratio: 0.9
- Questions addressed: the smallest connector registry on top of MCP and Code Mode
- Questions answered: the smallest connector registry on top of MCP and Code Mode

## Reflection

- What worked and why: reading the *config* files rather than the code. The whole connector surface is two JSON files and a 181-line launcher, so the design question became "what is the smallest thing to add to these two files", which is a much smaller question than "how do we build a connector layer".
- What did not work and why: looking for a per-bot filter inside the launcher assumed the launcher knows about bots; it does not, and it should not, because the filter belongs where the bot definition is read.
- What I would do differently: check the frontmatter key set first. `FRONTMATTER_KEYS` is the closed list of what a bot may declare, so any new per-bot fact has exactly one home and the design is decided by that list.

## Recommended Next Focus

Bot computer design: what is the smallest thing skilled bots can add beyond a git worktree that gives a bot a place to run commands and keep files between tasks, and what does a terminal genuinely cannot give that a container or a desktop shell would?
