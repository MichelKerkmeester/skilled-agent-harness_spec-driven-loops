Thin router for the deep-research loop. This command verifies the runtime agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, artifact-writing behavior, convergence detection, synthesis, and memory save behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoint text, success output, failure output, examples, or next-step prompts.

> **Code Graph ownership:** `code_graph_query` and `code_graph_context` stay stable MCP tool IDs; implementation and docs now live under `.opencode/skills/system-code-graph/`.

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates — do them in order, skip neither):**
> 1. Run Phase 0: dispatch-context check (below)
> 2. Run the Unified Setup Phase (BLOCKED gate) through the presentation contract and resolve:
>    - `research_topic`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
>    - `stop_policy` (default `convergence` unless `--stop-policy=max-iterations` is present)
>    - `dry_run` (default false unless `--dry-run` is present)
> 3. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `deep_research_auto.yaml`
>    - Confirm: `deep_research_confirm.yaml`
> 4. Execute the YAML workflow step by step using those resolved values
>
> This command is **general-agent based** — it orchestrates the deep-research loop. Gate 1 (dispatch-context check) and Gate 2 (the BLOCKED Unified Setup Phase) are HARD BLOCKS; neither may be skipped.

### PHASE 0: DISPATCH-CONTEXT CHECK

**STATUS: ☐ CHECKED**

```
This gate checks actual dispatch context, not self-reported capability -- the prior
self-assessment version of this check produced a confirmed false-positive block (a
capable agent judged itself "uncertain" on an abstract question and hard-stopped).

CHECK: was this file invoked directly as /deep:research (typed by the user, or an
explicit Task delegation naming this exact command) -- as opposed to another agent
pasting this file's raw content into a Task-dispatch prompt as inline ad hoc
instructions for a worker to follow (that worker should follow its own dispatch
prompt, not re-run this command's full setup contract)?

├─ YES, or no concrete evidence of the pasted-inline case:
│   └─ general_agent_verified = TRUE → Continue to the Unified Setup Phase (also a HARD BLOCK)
│
└─ NO, with concrete evidence this file's content was pasted inline rather than
   invoked as the command itself:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ DIRECT INVOCATION REQUIRED                              │
    │   │                                                            │
    │   │ This command orchestrates the deep-research loop and runs  │
    │   │ general-agent based.                                       │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:research [arguments]                               │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"

Default on ambiguity: PROCEED. Do not block on an inability to introspect abstract
capability (e.g. "can I orchestrate a workflow") -- that question is unanswerable
from the inside and is what caused the original false-positive block. Block only on
concrete evidence of the pasted-inline case above.
```

**Phase Output:**
- `general_agent_verified = ________________`

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`
  - `dry_run` is normalized to `true` or `false`; absence means `false`

For `:confirm` or no suffix, the consolidated setup prompt in the presentation contract MUST be the first visible response. For `:auto`, do not emit the consolidated setup prompt by default; use the auto setup resolution rules in the presentation contract and fail fast when required fields cannot be resolved.

> **Canonical mode syntax:** use attached command suffixes (`/deep:research:auto`, `/deep:research:confirm`) and keep AGENTS, skills, and quick references synchronized to this entrypoint.

> **Note:** Late-INIT `spec.md` detection and bounded `spec.md` mutations follow
> `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/spec_check_protocol.md`.
> Acquire `{spec_folder}/research/.deep-research.lock` before `folder_state` classification and keep `research/research.md` as the source of truth for any generated findings sync.
> Targeted strict validation after deep-research spec mutations uses the Node validation orchestrator; the current strict path is designed for fast packet checks and was measured at about 108ms for a fresh Level 3 packet on the local harness.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep_research_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_research_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_research_confirm.yaml` |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `execution_mode = INTERACTIVE`; no suffix sets `execution_mode = ASK`.
2. Treat `--max-iterations`, `--convergence`, `--lineage-timeout-hours`, `--stop-policy`, `--dry-run`, `--spec-folder`, `--executor`, `--model`, `--config-dir`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`, `--label`, `--count`, `--executors`, `--concurrency`, and `--no-resource-map` as workflow inputs, not execution modes.
3. For `:auto`, resolve setup from `$ARGUMENTS` flags, any `PRE-BOUND SETUP ANSWERS:` marker block, scope-extracted spec-folder paths, and the presentation contract's default resolution table. When all required fields are resolved, persist `{artifact_dir}/deep-research-config.json`, bind runtime YAML placeholders, and load `.opencode/commands/deep/assets/deep_research_auto.yaml`.
4. In `:auto`, ask a targeted Tier-2 question only for `spec_folder` when the topic is present, names no resolvable spec folder, and the folder choice is ambiguous. Missing `research_topic` is absence, not ambiguity; use the named-missing-inputs fail-fast format from the auto-mode contract and do not load YAML.
5. For `:confirm`, use the presentation contract's consolidated setup prompt to bind missing setup values, then load `.opencode/commands/deep/assets/deep_research_confirm.yaml`.
6. For no suffix, use the presentation contract's consolidated setup prompt to choose execution mode and bind missing setup values, then route the resolved interactive choice to the matching YAML.
7. Lightweight read-only discovery for related spec folders or prior memory may support setup, but it must feed the single consolidated prompt and never split setup questions.
8. After the selected workflow asset is loaded, execute it step by step using the resolved setup values.

### Lineage Timeout Flag

`--lineage-timeout-hours <N>` raises the per-lineage wall-clock timeout ceiling above the default 4 hours for long, high-effort, forced-depth fan-out runs; omit it to keep the 4h default.

### Stop Policy Flag

`--stop-policy <convergence|max-iterations>` selects whether convergence may stop the loop early. The default `convergence` stops at legal convergence or `config.maxIterations`, whichever comes first; `max-iterations` treats convergence as telemetry only and forces the loop to continue until `config.maxIterations`, which is useful for forced-depth runs.

### Dry-Run Flag

`--dry-run` is a first-class flag on the confirm flow, not a third execution mode. It still performs real setup resolution, artifact-root resolution, focus selection, prompt rendering, and convergence reads when those steps can run without side effects.

When `dry_run=true`, the confirm YAML emits `dry_run_halt` JSONL preview lines to terminal output instead of appending to the live state log, and halts before executor dispatch, persistent state mutation, reducer refresh, or child-lineage spawn. A fresh packet will stop at the first persistent state boundary; an existing packet can read current state and convergence signals, render the next prompt for preview, then stop before dispatch.

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_research_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_research_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep_research_presentation.txt`:

- Startup-question wording, consolidated setup prompt text, and reply format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display references.
- Dashboard/checkpoint layout, workflow overview display, convergence-threshold explanation, and user-facing examples.
- Success and failure result templates, error-handling display, and memory-integration result wording.
- Next-step suggestions, command-chain wording, skill-reference text, and offline optimization notes.

---

## 6. WORKFLOW SUMMARY

The selected YAML workflow initializes deep-research state, dispatches fresh `@deep-research` LEAF agents per iteration, evaluates convergence, synthesizes `{artifact_dir}/research.md`, optionally emits `{artifact_dir}/resource-map.md`, and refreshes continuity through canonical spec docs. This command does not proceed to implementation.

For code review and quality auditing, route to `/deep:review`. Research path: `/deep:research` → `/speckit:plan` → `/speckit:implement`; review path: `/deep:review` → (if issues) `/speckit:plan` → `/speckit:implement`.
