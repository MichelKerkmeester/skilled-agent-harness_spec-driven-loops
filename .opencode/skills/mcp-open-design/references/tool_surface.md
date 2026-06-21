---
title: "Open Design MCP Tool Surface"
description: "The full Open Design stdio MCP tool surface (~18 tools, not the 8 in --help) classified read-only / mutating / destructive, plus the surface / gate / omit exposure policy and the live-verification requirement."
trigger_phrases:
  - "open design mcp tools"
  - "od tools list"
  - "open design tool surface"
  - "od start_run gate"
  - "open design mutating tools"
importance_tier: "normal"
contextType: "implementation"
---

# Open Design MCP Tool Surface

> **IMPORTANT:** The `od mcp --help` text lists only a documentation subset of 8 tools. The running stdio server registers ~18, including mutating and destructive ones. **Always verify the live `tools/list`** before promising a tool exists or is read-only, and gate every mutating or destructive verb.

---

## 1. OVERVIEW

### Core Principle
Surface read-only tools freely, gate every mutating or destructive verb behind confirmation plus an explicit target plus a rollback note, and omit the most dangerous verbs from the default path. The help text undercounts the surface, so the live `tools/list` is the only source of truth.

### When to Use
- Decide whether an Open Design MCP tool is safe to call unprompted, must be gated, or should be kept out of the default path.
- Confirm the real tool count and names before relying on a tool the help text does not show.

### Key Sources
- [od_cli_reference.md](od_cli_reference.md) - the CLI verb surface and the daemon model.
- [mcp_wiring.md](mcp_wiring.md) - getting these tools wired into an agent.

Claims are tagged **[CONFIRMED]** (read from the registered tool definitions or run) or **[INFERRED]**. The tool names and classes below were read directly from the registry. **[CONFIRMED - read]**

---

## 2. THE FULL TOOL SURFACE (~18, NOT 8)

The stdio server returns the entire tool-definitions array, not the documentation subset in `--help`. This is what an opencode or Claude Code MCP client sees. Annotations come from the registry: `readOnlyHint:true` (read-only), `readOnlyHint:false` (mutating), `destructiveHint:true` (destructive). **[CONFIRMED - read registry]**

### Read-only (11)

`list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files` (literal substring match), `list_files`, `list_skills`, `list_plugins`, `list_agents`, `get_run`.

These are always safe to surface. `get_active_context` returns what the user has open now. The `project` argument defaults to the active Open Design project, which expires after roughly 5 minutes of inactivity. Responses stamp `usedActiveContext` so you can tell when the fallback was used. **[CONFIRMED]**

### Mutating (5)

`create_artifact` (rejects an existing target), `write_file` (overwrites or tolerates an existing file), `create_project`, `start_run`, `cancel_run`.

`start_run` is the most significant: it is the headless equivalent of the in-app chat box, and it is **multi-turn**. Calling it fires **turn 1 only**, which spawns the inner agent (`claude` / `codex` / `gemini`, per `list_agents`; `opencode` also works, verified live, and needs an explicit `--model`) and returns a GenUI discovery question-form, ending `awaiting_input` with **zero files**. Answering the form (with `od ui respond` or a follow-up message) fires the **build run** that writes the design files and gives the project an `entryFile` plus a `previewUrl`. Poll `get_run(runId)`, then fetch with `get_artifact`. `cancel_run` aborts. **[CONFIRMED - live-verified this session]**

`create_artifact` and the CLI `od artifacts create` only **add a single file** to a project. They do NOT spawn a run, do NOT produce a rendered design, and do NOT update the project preview. The visible-design path is the multi-turn `start_run` flow above, never an artifact write. **[CONFIRMED - live-verified this session]**

### Destructive (2)

`delete_file`, `delete_project`. Both carry `destructiveHint:true` and require an explicit `project` **and** `confirm:true`. There is **no** active-project fallback for these. **[CONFIRMED - read registry]**

---

## 3. THE SURFACE / GATE / OMIT POLICY

This policy is the spine of how the skill exposes the surface. It spans both the MCP tools above and the `od` CLI write verbs (see [od_cli_reference.md](od_cli_reference.md) Section 4).

### Surface freely (read-only)

Call these without ceremony:

- MCP: `list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents`, `get_run`.
- CLI: `od tools design-systems read`, `od files list`, `od files read`, `od skills list`, `od design-systems list`, `od doctor`, `od daemon status`, and the `list`/`view`/`show` forms of `od automation`, `od memory tree`, and `od ui`.

### Surface but GATE (confirmation + explicit target + rollback note)

Before any of these, state the effect and a one-line rollback, name the explicit target project or name, and stop for confirmation:

- MCP: `create_artifact`, `create_project`, `start_run`, `cancel_run`.
- CLI: `od artifacts create`, `od files write`, `od media generate`, `od research search`, `od automation create/run/…`, `od ui respond/revoke/prefill`, `od memory tree edit/move`, `od plugin install/…`, `od diagnostics export`, `od daemon start`, `od project create`.

### OMIT from the default path (reference docs only)

Keep these out of the normal flow. Reach for them only on an explicit, specific user request:

- MCP: `delete_file`, `delete_project` (destructive), and `write_file` (overwrites).
- CLI: `plugin publish/login/trust`, `daemon stop` `[UNVERIFIED]`, `db vacuum` `[UNVERIFIED]` (neither appears in the confirmed `od --help` verb table; confirm with a live `od --help` before relying on them), raw connector `execute`, and desktop import or auth internals.

The investigation reached this gating posture two independent ways (a code read of the registry and an adversarial cross-check), and the stricter gating wins where they differed. **[CONFIRMED - cross-validated]**

---

## 4. THE HARD RULE: VERIFY LIVE, GATE MUTATIONS

The three biggest accuracy risks for this surface are CLI naming (there is no `od` shim), daemon transport (socket discovery, not a fixed `:7456`), and **MCP tool-surface drift** (the help text undercounts). All three must be hedged.

1. **Always verify the live `tools/list`** before promising a tool's name or its read-only status. The `od mcp --help` subset is documentation, not the registered surface. **[CONFIRMED]**
2. **Gate every mutating or destructive verb** behind explicit user confirmation, an explicit target project or name, and a one-line rollback note. This covers `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`, and the `od artifacts/media/automation/ui/memory/plugin` write verbs.
3. **Never run a destructive verb** (`delete_file`, `delete_project`) without an explicit project and `confirm:true` plus user approval, and never via the active-project fallback.
4. **Read Open Design content live, never cache it into a repo.** Reuse a system's `tokens.css`/`components.html` at build time in the target app, not by vendoring Open Design's files (its per-source licenses would attach).

---

## 5. THE GENERATION FLOW (GATED, MULTI-TURN)

Generation is **multi-turn, not one-shot**. The headless loop runs over the MCP tools (plus `od ui` to answer the form) once wired:

```text
create_project        # (gated) only if the user wants a new project
  -> start_run(prompt, [skill], [agent], [model], [inputs])   # (gated) TURN 1: returns a
  |                                                            #   discovery question-form, 0 files, awaiting_input
  -> answer the form                                          # (gated) od ui list/show -> od ui respond,
  |                                                            #   or send a follow-up message. THIS fires the build.
  -> get_run(runId)   # (read-only) poll the build run until complete
  -> get_artifact     # (read-only) fetch the result; the project now has entryFile + previewUrl
```

Turn 1 alone produces **no design**. A run left `awaiting_input` is unfinished. The build that writes `index.html` and gives the project its `previewUrl` only fires once the discovery form is answered (`od ui respond --run <runId> <surfaceId> --value ... | --value-json ... | --skip`, or a follow-up message). `od artifacts create` is not part of this flow: it adds a file but never renders a design.

Confirm the mutating steps (`create_project`, `start_run`, and the `od ui respond` that fires the build) with an explicit target and a rollback note before running them. Polling and fetching are read-only and safe. See [od_cli_reference.md](od_cli_reference.md) Section 5.

---

## 6. ESCALATION

- **The desktop app is not running.** Every tool call proxies to the daemon the app hosts. Offer to have the user open the app, or to start a standalone daemon with `od --no-open`.
- **A verb returns an auth error.** Local reads work without a cloud account, but generation, media, research, and plugin-publish may need a `vela login` or configured providers. Surface the requirement, and do not paste credentials into prompts. **[INFERRED per-verb, needs a live check]**
- **A mutating or destructive run is requested.** Describe the effect and the rollback, then stop and wait for confirmation.

---

## 7. REFERENCES

- [od_cli_reference.md](od_cli_reference.md) - the CLI verb surface, daemon model, and exact commands.
- [mcp_wiring.md](mcp_wiring.md) - wiring these tools into opencode and Claude Code.
- [SKILL.md](../SKILL.md) - the skill contract these references support.
