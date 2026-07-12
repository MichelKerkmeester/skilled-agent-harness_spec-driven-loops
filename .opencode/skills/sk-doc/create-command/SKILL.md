---
name: create-command
description: Scaffold OpenCode slash commands with explicit argument hints, allowed tools, and router/presentation separation.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.1.0
---

<!-- Keywords: create-command, slash command, opencode command, argument-hint, allowed-tools, command router, presentation contract, thin router, command scaffold -->

# Create Command

`create-command` is the command-authoring workflow packet of the `sk-doc` parent hub. It creates and improves OpenCode slash commands under `.opencode/commands/` with executable workflows, precise frontmatter, required input gates, least-privilege tools, and router/presentation separation when needed.

This SKILL.md contains the core creation workflow. Use the `references/` route map (`references/README.md`), `assets/command_template.md`, `assets/command_router_template.md`, `assets/command_presentation_template.md`, and `../shared/` only for exhaustive examples, edge cases, and validator implementation detail.

This packet is lean and self-contained. The advisor identity lives at the `sk-doc` hub root; do not add packet-local `graph-metadata.json`.

---

## 1. WHEN TO USE

Use this packet when the request involves:

- Creating a new OpenCode slash command.
- Refactoring a command into a thin router plus owned presentation asset.
- Adding or fixing command frontmatter, especially `argument-hint` and `allowed-tools`.
- Designing command argument handling with `$ARGUMENTS`.
- Authoring a namespace command such as `/namespace:action`.
- Separating visible prompts, dashboards, result templates, or next-step wording into a presentation contract.
- Checking whether a workflow should be a command instead of a skill, agent, or one-off task.

Do not use this packet when:

- The request is to create a skill. Use `create-skill`.
- The request is to create an agent. Use `create-agent`.
- The task is reference documentation rather than an executable workflow.
- The task is one-time work that does not need a reusable slash command.
- The command already exists and the user only wants runtime debugging.
- The requested workflow is destructive or externally privileged but lacks confirmation and rollback requirements.

---

## 2. SMART ROUTING

Keyword triggers: `create command`, `slash command`, `opencode command`, `argument-hint`, `allowed-tools`, `command template`, `router presentation split`, `thin router`, `presentation contract`, `$ARGUMENTS`, `:auto`, `:confirm`.

These triggers route a request into this command-authoring packet. When the true surface is a skill, an agent, or non-command reference documentation, hand off to the sibling `sk-doc` packet named in the "Do not use this packet when" list above instead of proceeding here. When the surface is a slash command, stay in this packet and continue to the creation workflow below.

---

## 3. HOW IT WORKS: CREATION WORKFLOW

Follow these steps in order.

### Step 1: Decide Whether A Command Is Correct

Create a command only when the workflow is repeatable and has defined steps.

Use a command when the workflow:

- Automates a multi-step process.
- Needs repeatable execution across sessions.
- Needs `$ARGUMENTS` parsing or mode routing.
- Needs user-controlled execution pace such as `:auto` or `:confirm`.
- Needs confirmation gates for destructive or privileged actions.
- Benefits from explicit tool restrictions.

Use a skill instead when the content is reusable reference knowledge, domain guidance, standards, or patterns shared by multiple workflows. Do not create a command for one-off work.

### Step 2: Resolve Invocation And Path

Determine the command invocation before writing:

- Root command: `.opencode/commands/<command>.md` becomes `/<command>`.
- Namespace command: `.opencode/commands/<namespace>/<action>.md` becomes `/<namespace>:<action>`.
- Namespace and action names use lowercase hyphen-case.

For grouped related actions, prefer a namespace directory:

```text
.opencode/commands/
└── <namespace>/
    ├── <action1>.md
    ├── <action2>.md
    └── <action3>.md
```

### Step 3: Read Existing Files First

Before editing an existing command or owned asset, read it completely enough to understand current behavior. Preserve behavior unless the user explicitly asks to change it.

For new commands, inspect nearby commands in the same namespace when available so structure and vocabulary match the command family.

### Step 4: Classify The Command Type

Choose the smallest command type that fits:

| Type | Use When | Typical Shape |
| --- | --- | --- |
| Simple | Single action, few arguments | One `.md` file, direct steps |
| Workflow | Multi-step process with checkpoints | One `.md` file with overview, instructions, recovery |
| Mode-based | Supports `:auto` / `:confirm` | Thin router plus owned assets when complex |
| Router | Thin dispatcher: verify agent, resolve mode/args, hand off to owned assets | Router `.md` plus owned presentation `.txt` and optional workflow YAML or scripts |
| Argument dispatch | Multiple action keywords or query forms | ASCII routing tree plus handlers |
| Destructive | Deletes data or irreversible changes | Explicit confirmation, affected-state display, recovery guidance |
| Namespace | Related commands grouped together | Directory under `.opencode/commands/` |

If the command combines patterns, parse mode first, then dispatch remaining arguments.

### Step 5: Choose The Output Package Shape

For a simple or medium command, create or update:

```text
.opencode/commands/<command>.md
```

For a namespace command, create or update:

```text
.opencode/commands/<namespace>/<action>.md
```

For a split mode-based workflow command, create or update:

```text
.opencode/commands/<namespace>/<action>.md
.opencode/commands/<namespace>/assets/<namespace>_<action>_presentation.txt
.opencode/commands/<namespace>/assets/<namespace>_<action>_auto.yaml
.opencode/commands/<namespace>/assets/<namespace>_<action>_confirm.yaml
```

Use `_auto.yaml` and `_confirm.yaml` only for workflow-backed families that route execution into workflow assets. Direct-router families dispatch directly to tools/scripts and do not need workflow YAML.

For a compiled-stub router, the `.md` is a generated thin stub carrying the `render-command-contract` marker; its section shape is rendered from a compiled source at invocation, not authored in the file. Do not hand-write section headings into a compiled stub, and keep its owned presentation/workflow assets alongside it:

```text
.opencode/commands/<namespace>/<action>.md            # compiled stub (render-command-contract marker)
.opencode/commands/<namespace>/assets/<namespace>_<action>_presentation.txt
```

### Step 6: Author Frontmatter First

Every command starts with YAML frontmatter.

Required:

```yaml
---
description: Action-oriented single-line description
---
```

Recommended when applicable:

```yaml
argument-hint: "<required> [optional] [--flag]"
allowed-tools: Read, Write, Edit, Bash
```

Rules:

- Keep `description` single-line, action-oriented, and concise.
- Target descriptions at or under 110 characters.
- Do not use YAML block scalars for `description`.
- Use `argument-hint` whenever the command expects user input.
- Use `<angle-brackets>` only for required arguments.
- Use `[square-brackets]` for optional arguments.
- List every tool the command actually uses in `allowed-tools`.
- Do not add broad tools just in case.
- For MCP tools in `allowed-tools`, use fully qualified names such as `mcp__<server>__<tool>`.
- Bare tool names such as `memory_context` belong in prose only, not `allowed-tools`.

### Step 7: Add Mandatory Input Gates

If `argument-hint` contains any required `<argument>`, add the mandatory gate immediately after frontmatter, before all other content.

The gate must:

- Check whether `$ARGUMENTS` is empty, undefined, or whitespace-only.
- Ignore mode suffixes when determining whether required content exists.
- Stop immediately when required input is missing.
- Ask a context-specific question with clear options or expected reply format.
- Wait for the user response.
- Use only `$ARGUMENTS` or the user's explicit answer as the input.
- Forbid inference from context, screenshots, conversation history, or open files.

For multi-input commands, use a blocking phase pattern:

- Phase 1: input collection.
- Phase 2: prerequisite/context verification.
- Phase status verification table.
- Violation self-detection block.

Every workflow command with blocking phases must include violation self-detection: if a required phase was skipped, stop, state the violation, return to the phase, and complete it properly.

### Step 8: Write The Command Body

Use executable, instruction-oriented sections. Commands are workflows, not long reference manuals.

Common section order:

1. Title and purpose.
2. Contract.
3. Workflow overview or argument routing.
4. Instructions.
5. Failure recovery and error handling when needed.
6. Examples.
7. Status output patterns or completion report.

Use these conventions:

- H1: plain command title, or a blocking semantic title for mandatory gates.
- H2: `## N. SECTION-NAME`, using full integers only.
- H3 steps: `### Step N: Description`.
- Do not use decimal steps such as `1.5` or `2.5`.
- Put sub-activities in bullets under a numbered step.
- Use dividers between major sections when they improve scanability.
- Return structured statuses such as `STATUS=OK`, `STATUS=FAIL ERROR="<message>"`, or `STATUS=CANCELLED ACTION=cancelled`.

Approved common H2 section names include:

- `PURPOSE`
- `CONTRACT`
- `WORKFLOW OVERVIEW`
- `INSTRUCTIONS`
- `ARGUMENT ROUTING`
- `REFERENCE`
- `EXAMPLES`
- `RELATED COMMANDS`
- `TOOL SIGNATURES`
- `USER INPUT`

Approved canonical H2 section names for router commands (see Step 11):

- `ROUTER CONTRACT`
- `OWNED ASSETS`
- `MODE ROUTING`
- `EXECUTION TARGETS`
- `PRESENTATION BOUNDARY`
- `WORKFLOW SUMMARY`

### Step 9: Implement Argument Dispatch When Needed

For commands with multiple entry points, include an ASCII routing tree based on `$ARGUMENTS`.

Route by:

- Empty arguments.
- First-word action keywords, case-insensitive.
- Natural-language query patterns.
- Single ambiguous words.
- Flags and options.

Then define one handler section per action. Show example routing in a table so future maintainers can verify behavior quickly.

### Step 10: Implement Mode Routing When Needed

For commands supporting `:auto` and `:confirm`, document mode detection:

| Pattern | Mode | Behavior |
| --- | --- | --- |
| `/command:auto` | Autonomous | Execute without user approval gates |
| `/command:confirm` | Interactive | Pause at each step for user approval |
| `/command` | Prompt | Ask user to choose execution mode |

Autonomous mode self-validates at checkpoints, makes informed decisions, and records significant decisions.

Interactive mode pauses after each step for approval, presents options such as approve, review details, modify, skip, or abort, and records user decisions.

If the mode-based command is large or has visible dashboards/prompts/results, use the router/presentation split.

### Step 11: Author The Router As A First-Class Command Type

A router is a first-class command type, not a loose refactor. Its `.md` is a thin dispatcher: verify the orchestrating agent, resolve mode and arguments, then hand off to owned assets (a presentation `.txt`, optional `_auto.yaml` / `_confirm.yaml`, or scripts). It carries no inline dashboards, prompts, or result templates.

**Detection signature.** The validator treats a command as a router when any of:

- a `render-command-contract` marker is present (the compiled-stub variant, which has no authored section requirements); or
- a `Presentation Boundary` section is present; or
- two or more of `{Router Contract, Owned Assets, Mode Routing, Execution Targets}` co-occur.

**Minimal core vs recommended.** A router must include the blocking core only: `Owned Assets` and `Presentation Boundary`. The remaining canonical sections — `Router Contract`, `Mode Routing`, `Execution Targets`, `Workflow Summary` — are recommended and surface as non-blocking warnings when absent. Author the full shape for new routers; the minimal core lets incremental migrations land without failing.

**Canonical vocabulary (numbered `## N.`, full integers).** Use exactly these H2 names, in this order, for a fully-shaped router:

```text
## 1. ROUTER CONTRACT
## 2. OWNED ASSETS
## 3. MODE ROUTING
## 4. EXECUTION TARGETS
## 5. PRESENTATION BOUNDARY
## 6. WORKFLOW SUMMARY
```

Do not invent divergent synonyms (`Routing Assets`, `Workflow Routing`, `Execution Order`); the validator alias-normalizes those as a safety net, but the authored end state is the canonical names above.

**Ownership boundary.** The router owns: the mandatory input gate or Phase 0, the owned-assets table, mode resolution, argument routing, execution-target selection, the presentation boundary, and a short workflow summary. The presentation asset owns: startup prompts and consolidated setup questions, auto fail-fast display text, dashboard and checkpoint layouts, success and failure result templates, and next-step suggestions. The router must not contain inline startup-question wording, dashboard templates, result templates, or next-step wording when a presentation asset exists. The split is behavior-preserving: move display content, do not change routing semantics.

**Variants (one type, differing only by hand-off — not by required sections):**

- Workflow-YAML-backed — routes execution into `_auto.yaml` / `_confirm.yaml` workflow assets (for example the deep-large and speckit families).
- Direct-dispatch-script — dispatches directly to tools or scripts, no workflow YAML (for example the skill-benchmark, doctor, and memory families).
- Compiled-stub — a generated stub carrying the `render-command-contract` marker whose contract is rendered at invocation; exempt from authored section requirements (for example research, review, and ai-council).

Use `assets/command_router_template.md` for the canonical numbered router skeleton, and `assets/command_presentation_template.md` for the full presentation asset skeleton.

### Step 12: Add Destructive-Action Safety

For commands that delete data or make irreversible changes, include:

- Frontmatter that makes destructive intent visible when appropriate.
- Confirmation by default.
- `--confirm` only when explicitly designed to skip the prompt.
- Affected-state display before execution.
- Clear list of items that will be deleted or changed.
- Execution logging.
- Completion verification.
- Recovery or rebuild guidance.
- `STATUS=CANCELLED ACTION=cancelled` when the user aborts.

Do not ship destructive commands without confirmation and recovery design.

### Step 13: Validate Before Delivery

Before publishing or claiming the command is valid, verify:

- `description` exists, is action-oriented, and is single-line.
- `argument-hint` exists when arguments are expected.
- `allowed-tools` lists only tools actually used.
- Required `<arguments>` have a mandatory gate immediately after frontmatter.
- The gate forbids inference and waits for explicit input.
- Section numbering uses full integers only.
- H2 headers follow `## N. SECTION-NAME`.
- Instructions are actionable.
- Examples cover two or three likely invocations.
- Status output uses a structured pattern.
- Thin routers contain no presentation templates when a presentation asset exists.
- Router commands carry the blocking core (`OWNED ASSETS` + `PRESENTATION BOUNDARY`) and use the canonical numbered vocabulary from Step 11; remaining router sections are present or intentionally left as warnings.

Run shared validators when available:

```bash
python3 ../shared/scripts/validate_document.py <command-file.md> --type command
python3 ../shared/scripts/extract_structure.py <command-file.md>
```

Exit code `0` from `validate_document.py` is required before stating that the command document is structurally valid. If validation cannot be run, say that explicitly.

---

## 4. RULES

Always:

1. Read existing target files before editing.
2. Use the smallest command type that fits the workflow.
3. Put executable workflow steps in the command, not only in references.
4. Use `argument-hint` for expected user input.
5. Add a mandatory gate for required arguments.
6. Keep `description` concise, single-line, and invocation-oriented.
7. Keep `allowed-tools` least-privilege and accurate.
8. Use fully qualified MCP tool IDs in `allowed-tools`.
9. Keep presentation text in the presentation asset when using a split.
10. Validate with shared create-quality-control scripts before delivery.
11. Keep this nested packet free of `graph-metadata.json`.

Never:

1. Never create a command for one-off work that does not need reuse.
2. Never skip mandatory gates for required arguments.
3. Never infer missing required input from context or conversation history.
4. Never use broad `allowed-tools` just in case.
5. Never put dashboards, startup prompts, or result templates inside a thin router when a presentation asset exists.
6. Never omit confirmation gates for destructive or irreversible actions.
7. Never turn a command into long reference documentation.
8. Never add advisor identity metadata inside this nested packet.
9. Never claim structural validity without running validation or stating it was not run.

Escalate if:

1. The command name, namespace, or invocation contract is unclear.
2. Required arguments cannot be safely defaulted.
3. The command would perform destructive work without explicit confirmation requirements.
4. Tool permissions are broader than the workflow appears to need.
5. Router logic and presentation wording cannot be separated without changing behavior.
6. The request belongs to a skill, agent, or one-off task instead of a slash command.

---

## 5. SUCCESS CRITERIA

A command produced through this packet is complete when:

- The correct component type was chosen: the workflow genuinely warrants a slash command rather than a skill, agent, or one-off task.
- Frontmatter is well-formed: a single-line, action-oriented `description`, an `argument-hint` whenever user input is expected, and a least-privilege `allowed-tools` list using fully qualified MCP tool IDs.
- Every required `<argument>` has a mandatory input gate immediately after frontmatter that forbids inference and waits for explicit input.
- The body is executable and instruction-oriented, with full-integer `## N. SECTION-NAME` headings, actionable steps, two or three example invocations, and structured status output.
- Router commands keep the blocking core (`OWNED ASSETS` plus `PRESENTATION BOUNDARY`), use the canonical numbered vocabulary, and hold no presentation templates when a presentation asset exists.
- Shared validation was run: `validate_document.py` exits `0`, or its absence is stated explicitly rather than assumed.

---

## 6. DEEP DETAIL REFERENCES

Use these only for overflow detail, long examples, and exact skeletons:

- `references/README.md` - overflow route map for this packet; indexes the single-concern reference files below.
- `references/worked_example.md` - the canonical file contract plus a fully worked split command (router `.md` and presentation `.txt`).
- `references/router_presentation_split.md` - router/presentation ownership, the before/after split transformation, and the behavior-preserving rule.
- `references/argument_hints_and_modes.md` - argument-hint design patterns, `:auto`/`:confirm` mode design, and frontmatter/description budget tips.
- `references/common_pitfalls.md` - command-vs-skill-vs-agent selection and the common command-authoring mistakes table.
- `assets/command_template.md` - exhaustive command type templates, examples, vocabulary, and validation checklist.
- `assets/command_router_template.md` - canonical numbered router skeleton with variant call-outs.
- `assets/command_presentation_template.md` - full `_presentation.txt` skeleton for split command families.
- `../shared/references/core_standards.md` - shared document quality standards.
- `../shared/references/validation.md` - shared validation expectations.
- `../shared/scripts/validate_document.py` - blocking structure validation.
- `../shared/scripts/extract_structure.py` - structure extraction for review.
