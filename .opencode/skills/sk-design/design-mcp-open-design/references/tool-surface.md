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
version: 1.4.0.6
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
- [od-cli-reference.md](od-cli-reference.md) - the CLI verb surface and the daemon model.
- [mcp-wiring.md](mcp-wiring.md) - getting these tools wired into an agent.

Claims are tagged **[CONFIRMED]** (read from the registered tool definitions or run) or **[INFERRED]**. The tool names and classes below were read directly from the registry. **[CONFIRMED - read]**

---

## 2. THE FULL TOOL SURFACE (~18, NOT 8)

The stdio server returns the entire tool-definitions array, not the documentation subset in `--help`. This is what an opencode or Claude Code MCP client sees. Annotations come from the registry: `readOnlyHint:true` (read-only), `readOnlyHint:false` (mutating), `destructiveHint:true` (destructive). **[CONFIRMED - read registry]**

### Read-only (11)

`list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files` (literal substring match), `list_files`, `list_skills`, `list_plugins`, `list_agents`, `get_run`.

These are registry read-only, meaning they do not write workspace state. Registry read-only is not the same as unguarded: the two-axis classification below decides whether the output is guarded or pure transport. `get_active_context` returns what the user has open now. The `project` argument defaults to the active Open Design project, which expires after roughly 5 minutes of inactivity. Responses stamp `usedActiveContext` so you can tell when the fallback was used. **[CONFIRMED]**

### Mutating (5)

`create_artifact` (rejects an existing target), `write_file` (overwrites or tolerates an existing file), `create_project`, `start_run`, `cancel_run`.

`start_run` is the most significant: it is the headless equivalent of the in-app chat box, and it is **multi-turn**. Calling it fires **turn 1 only**, which spawns the inner agent (`claude` / `opencode` / `gemini`, per `list_agents`; `opencode` also works, verified live, and needs an explicit `--model`) and returns a GenUI discovery question-form, ending `awaiting_input` with **zero files**. Answering the form (with `od ui respond` or a follow-up message) fires the **build run** that writes the design files and gives the project an `entryFile` plus a `previewUrl`. Poll `get_run(runId)`, then fetch with `get_artifact`. `cancel_run` aborts. **[CONFIRMED - live-verified this session]**

`create_artifact` and the CLI `od artifacts create` only **add a single file** to a project. They do NOT spawn a run, do NOT produce a rendered design, and do NOT update the project preview. The visible-design path is the multi-turn `start_run` flow above, never an artifact write. **[CONFIRMED - live-verified this session]**

### Destructive (2)

`delete_file`, `delete_project`. Both carry `destructiveHint:true` and require an explicit `project` **and** `confirm:true`. There is **no** active-project fallback for these. **[CONFIRMED - read registry]**

### Two-axis decision classification

The registry's read-only/mutating/destructive hints answer only one question: whether a call writes. The design precondition needs two independent axes:

- **`feedsDesignDecision`** - Does the tool's output inform a design choice, such as a UI, design system, visual artifact, prototype, motion, or build brief? This is an advisory per-tool judgment made explicit, not a runtime probe of a specific call.
- **`mutatesWorkspace`** - Does the tool write or change project, run, file, or artifact state? This is the mechanical write axis.

Decision rule: **guarded = `feedsDesignDecision OR mutatesWorkspace`**. Pure transport is the complement: **exempt = neither axis**. A new, unclassified, or axis-indeterminate tool is guarded by default until both axes are explicitly tagged.

The `mutatesWorkspace = Y` column equals the configured `guardedTools` projection for the seven mutating/destructive MCP tools: `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, and `delete_project`. This table is the source; the configured list is a projection of the write axis. Design-feeding reads are guarded by the `feedsDesignDecision` axis even when the registry marks them read-only.

| Tool | feedsDesignDecision | mutatesWorkspace | guarded | feedsDesignDecision rationale |
|------|:---:|:---:|:---:|---|
| `list_projects` | N | N | N (EXEMPT) | Returns only project identifiers and names: bare inventory, no design substance. |
| `list_files` | N | N | N (EXEMPT) | Returns filenames in a project: inventory of names, not contents. |
| `list_skills` | N | N | N (EXEMPT) | Capability listing: names available skills, delivers no design content. |
| `list_plugins` | N | N | N (EXEMPT) | Capability listing: names plugins, delivers no design content. |
| `list_agents` | N | N | N (EXEMPT) | Capability listing: names inner agents, delivers no design content. |
| `get_active_context` | Y | N | Y (GUARDED) | Returns the active project/context the design work is grounded in, surfacing live design state. |
| `get_project` | Y | N | Y (GUARDED) | Returns one project's design-bearing state, including entry file, preview URL, and design linkage. |
| `get_artifact` | Y | N | Y (GUARDED) | Returns a design artifact; the output is design content. |
| `get_run` | Y | N | Y (GUARDED) | Returns the run result, including the generated design; this is the canonical read-only-but-design-feeding tool. |
| `get_file` | Y (ambiguous) | N | Y (GUARDED, receipt-exemptible) | May return design files such as tokens, components, or generated output; deny-by-default keeps it guarded absent a non-design-use receipt. |
| `search_files` | Y (ambiguous) | N | Y (GUARDED, receipt-exemptible) | Literal substring matches can surface design-file content; guarded by default, exempt only with a non-design-use receipt. |
| `create_artifact` | Y | Y | Y (GUARDED) | Writes a design file into a project. |
| `write_file` | Y | Y | Y (GUARDED) | Overwrites or writes file content, including design content. |
| `create_project` | N | Y | Y (GUARDED) | Creates a new project handle; guarded on the mutation axis. |
| `start_run` | Y | Y | Y (GUARDED) | Fires the build that writes the design; guarded on both axes. |
| `cancel_run` | N | Y | Y (GUARDED) | Control mutation that aborts a run; guarded on the mutation axis. |
| `delete_file` | N | Y | Y (GUARDED) | Destructive mutation; guarded on the mutation axis. |
| `delete_project` | N | Y | Y (GUARDED) | Destructive mutation; guarded on the mutation axis. |

Resulting sets:

- **Guarded (13):** the seven `mutatesWorkspace = Y` tools, the four intrinsic design reads (`get_active_context`, `get_project`, `get_artifact`, `get_run`), and the two ambiguous reads (`get_file`, `search_files`) that are guarded by default and receipt-exemptible.
- **Exempt pure transport (5):** `list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents`.

Ambiguous reads (`get_file`, `search_files`) are tagged `feedsDesignDecision = Y (ambiguous)`: guarded by default, exempt only when the caller supplies a non-design-use receipt stating the output will not feed a design decision. This refines the older flat "read-only is always safe" bucket: `list_projects` is pure transport because it returns identifiers only, while file reads and searches can carry design substance.

---

## 3. THE SURFACE / GATE / OMIT POLICY

This policy is the spine of how the skill exposes the surface. It is derived from the two-axis table above and spans both the MCP tools and the `od` CLI write verbs (see [od-cli-reference.md](od-cli-reference.md) Section 4).

### Surface freely (pure transport)

Call these without ceremony:

- MCP: `list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents`.
- CLI: `od tools design-systems read`, `od files list`, `od files read`, `od skills list`, `od design-systems list`, `od doctor`, `od daemon status`, and the `list`/`view`/`show` forms of `od automation`, `od memory tree`, and `od ui`.

For CLI reads, apply the same two-axis rule by intent: bare inventory is pure transport; output that feeds a design decision must satisfy the design precondition.

### Surface but GATE

Guarded means either the output feeds a design decision or the call mutates workspace state:

- Design-feeding reads require the design precondition before their output is used to shape UI, design systems, artifacts, prototypes, motion, or briefs.
- Mutations require confirmation plus an explicit target plus a rollback note.
- Ambiguous reads (`get_file`, `search_files`) are guarded by default and become pure transport only with a non-design-use receipt.

Before any of these, state the effect and a one-line rollback, name the explicit target project or name, and stop for confirmation:

- MCP: `create_artifact`, `create_project`, `start_run`, `cancel_run`.
- CLI: `od artifacts create`, `od files write`, `od media generate`, `od research search`, `od automation create/run/…`, `od ui respond/revoke/prefill`, `od memory tree edit/move`, `od plugin install/…`, `od diagnostics export`, `od daemon start`, `od project create`.

Before using the output of any of these design-feeding reads to inform a design decision, satisfy the design precondition:

- MCP: `get_active_context`, `get_project`, `get_artifact`, `get_run`, `get_file`, `search_files`.
- CLI: any read that returns design-system, component, token, artifact, preview, or generated-file content.

### OMIT from the default path (reference docs only)

Keep these out of the normal flow. Reach for them only on an explicit, specific user request:

- MCP: `delete_file`, `delete_project` (destructive), and `write_file` (overwrites).
- CLI: `plugin publish/login/trust`, `daemon stop` `[UNVERIFIED]`, `db vacuum` `[UNVERIFIED]` (neither appears in the confirmed `od --help` verb table; confirm with a live `od --help` before relying on them), raw connector `execute`, and desktop import or auth internals.

The investigation reached this gating posture two independent ways (a code read of the registry and an adversarial cross-check), and the stricter gating wins where they differed. **[CONFIRMED - cross-validated]**

---

## 4. THE HARD RULE: VERIFY LIVE, GATE MUTATIONS

The three biggest accuracy risks for this surface are CLI naming (there is no `od` shim), daemon transport (socket discovery, not a fixed `:7456`), and **MCP tool-surface drift** (the help text undercounts). All three must be hedged.

1. **Always verify the live `tools/list`** before promising a tool's name or its read-only status. The `od mcp --help` subset is documentation, not the registered surface. **[CONFIRMED]**
2. **Gate every design-feeding read, mutating verb, or destructive verb** according to the two-axis table. Design-feeding reads require the design precondition; mutating or destructive verbs require explicit user confirmation, an explicit target project or name, and a one-line rollback note. This covers `get_active_context`, `get_project`, `get_artifact`, `get_run`, `get_file`, `search_files`, `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project`, and the `od artifacts/media/automation/ui/memory/plugin` write verbs.
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
  -> get_run(runId)   # guarded design read: poll the build run until complete
  -> get_artifact     # guarded design read: fetch the result; the project now has entryFile + previewUrl
```

Turn 1 alone produces **no design**. A run left `awaiting_input` is unfinished. The build that writes `index.html` and gives the project its `previewUrl` only fires once the discovery form is answered (`od ui respond --run <runId> <surfaceId> --value ... | --value-json ... | --skip`, or a follow-up message). `od artifacts create` is not part of this flow: it adds a file but never renders a design.

Confirm the mutating steps (`create_project`, `start_run`, and the `od ui respond` that fires the build) with an explicit target and a rollback note before running them. Polling and fetching are read-only on the write axis, but guarded on the design-feeding axis when their output informs design decisions. See [od-cli-reference.md](od-cli-reference.md) Section 5.

---

## 6. ESCALATION

- **The desktop app is not running.** Every tool call proxies to the daemon the app hosts. Offer to have the user open the app, or to start a standalone daemon with `od --no-open`.
- **A verb returns an auth error.** Local reads work without a cloud account, but generation, media, research, and plugin-publish may need a `vela login` or configured providers. Surface the requirement, and do not paste credentials into prompts. **[INFERRED per-verb, needs a live check]**
- **A mutating or destructive run is requested.** Describe the effect and the rollback, then stop and wait for confirmation.

---

## 7. REFERENCES

- [od-cli-reference.md](od-cli-reference.md) - the CLI verb surface, daemon model, and exact commands.
- [mcp-wiring.md](mcp-wiring.md) - wiring these tools into opencode and Claude Code.
- [SKILL.md](../SKILL.md) - the skill contract these references support.
