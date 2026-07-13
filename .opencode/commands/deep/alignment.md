---
description: Autonomous deep-alignment loop: conformance audit against named standard authorities across resolved lanes. Modes :auto, :confirm.
argument-hint: "<target> [authority] [:auto|:confirm] [--lane-config <file.json>] [--max-iterations=N] [--coverage-threshold=N] [--stability-window=N] [--spec-folder=PATH] [--restart|--lineage-mode=restart] [--executor-timeout=SECONDS] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Grep, Glob, Task, Bash, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query
---

# Deep Start Alignment Loop

Thin router for the deep-alignment loop. This command verifies the orchestrating agent, resolves setup and execution mode, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

This command is **general-agent based** and must pass the dispatch-context check before setup routing continues. Do not use the Task tool to spawn the general agent; in `opencode run --command`, the default primary agent is the command orchestrator when it has the tools listed below. Keep raw agent handles out of this command body because OpenCode parses them as delegation requests.

In `:auto` mode, an explicit `--restart` or `--lineage-mode=restart` flag is operator authorization to archive the resolved alignment packet before phase init. Do not ask for a second confirmation; preserve rollback by moving the timestamped archive directory back to `alignment/` if needed.

### PHASE 0: DISPATCH-CONTEXT CHECK

**STATUS: ☐ CHECKED**

```
This gate checks actual dispatch context, not self-reported capability.

CHECK: was this file invoked directly as /deep:alignment (typed by the user, or an
explicit Task delegation naming this exact command), or is this agent the default
primary agent for `opencode run --command deep/alignment` -- as opposed to another
agent pasting this file's raw content into a Task-dispatch prompt as inline ad hoc
instructions for a worker to follow (that worker should follow its own dispatch
prompt, not re-run this command's full setup contract)?

├─ YES, or no concrete evidence of the pasted-inline case:
│   └─ general_agent_verified = TRUE → Continue to the Unified Setup Phase (also a HARD BLOCK)
│
└─ NO, with concrete evidence this file's content was pasted inline rather than
   invoked as the command itself:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    ├─ Do NOT dispatch the general agent through Task; it is not a loop executor.
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ DIRECT INVOCATION REQUIRED                              │
    │   │                                                            │
    │   │ This command orchestrates the deep-alignment loop and runs │
    │   │ general-agent based.                                       │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:alignment [arguments]                              │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"

Default on ambiguity: PROCEED. Do not block on an inability to introspect abstract
capability -- that question is unanswerable from the inside. Block only on
concrete evidence of the pasted-inline case above.
```

**Phase Output:**
- `general_agent_verified = ________________`

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `lanes` (resolved via the structured scoping question, or `--lane-config`), `spec_folder`, `execution_mode`, `maxIterations`, `coverageThreshold`, `stabilityWindow`, `lineage_mode`


### AUTONOMOUS EXECUTION DIRECTIVE (:auto)

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/alignment` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (the prebound spec folder is your write authority).
- PROCEED immediately: load the auto workflow YAML and dispatch the `deep-alignment` agent to run ONE iteration of the alignment loop over the bound target.
- DISPATCH ONLY: you dispatch `deep-alignment` to run one iteration; you do NOT read, edit, patch, or run the alignment loop over the target yourself. The auto workflow YAML owns the loop itself — setup, dispatch-per-iteration, reducer sync, convergence checks, synthesis, and all loop-level artifact writes; the `deep-alignment` leaf owns only its own single-iteration artifacts — mixing your own inline work with the dispatch is a route violation.
- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so `deep-alignment` writes each iteration state record with the route-proof fields present — `target_agent: "deep-alignment"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "alignment"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

Your job is to DISPATCH `deep-alignment` to run ONE iteration of the alignment loop over the bound target — NOT to run the loop yourself, and NOT to review, analyze, or summarize this contract. The auto workflow YAML owns the loop itself (setup, dispatch-per-iteration, reducer sync, convergence, synthesis, and loop-level writes). This contract is your instruction set; the alignment target is the bound spec_folder/target named in your message, never this document.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/deep/assets/deep_alignment_presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep_alignment_auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep_alignment_confirm.yaml` |

The presentation asset owns every dashboard, prompt, and result-template string this mode presents, mirroring `/deep:review`'s `deep_review_presentation.txt`. No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:alignment:auto` and `/deep:alignment:confirm`; keep AGENTS, skills, and quick references synchronized to this entrypoint.
2. Treat target/authority text, `--lane-config`, `--max-iterations`, `--coverage-threshold`, `--stability-window`, `--spec-folder`, lifecycle flags (`--restart`, `--lineage-mode`), executor flags, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS`. A `--lane-config <file.json>` flag resolves lanes non-interactively (`scripts/scoping.cjs` `parseLaneConfigFile`); without it, resolve lanes through the structured three-axis scoping question (authority x artifactClass x scope) before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the consolidated setup prompt (inline in the confirm workflow's own `gate_init_approval`-equivalent step) before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the same consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `lanes`, `spec_folder`, `execution_mode`, `maxIterations`, `coverageThreshold`, `stabilityWindow`, and `lineage_mode` are bound.

### Lane Config Flag

`--lane-config <file.json>` is the ONLY non-interactive lane-resolution path (ADR-011 LOCKED) — there is no inline per-flag lane syntax. The file must contain a JSON array of `{authority, artifactClass, scope}` objects; see `.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md`.

### Convergence Flags

`--coverage-threshold <F>` (default `1.0`) and `--stability-window <N>` (default `2`) tune the two-signal AND-gate `deep-alignment/scripts/check-convergence.cjs` evaluates; both must hold together before STOP is legal, and `--max-iterations` remains an independent hard stop regardless of their outcome. Do not transfer `deep-review`'s single `convergenceThreshold` ratio semantics onto these two flags — they are not equivalent.

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep_alignment_auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep_alignment_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep_alignment_presentation.txt`:

- Startup-question wording, the consolidated setup prompt, three-axis scoping question text (authority x artifactClass x scope), and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution rules, and fail-fast display references.
- Dashboard and checkpoint layouts, per-lane progress displays, and coverage/stability convergence-signal wording.
- Success and failure result templates, per-lane `alignment-report.md` presentation wording, and PASS/CONDITIONAL/FAIL verdict display.
- Example invocations, notes, related-command wording, and next-step suggestions.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs a structured conformance audit by resolving one or more alignment lanes (authority x artifactClass x scope), initializing an `alignment/` packet under `{artifact_dir}`, dispatching fresh `deep-alignment` LEAF agents once per iteration to check each lane's next artifact slice (`scripts/partition-corpus.cjs`), evaluating the coverage-AND-stability convergence gate (`scripts/check-convergence.cjs`), and synthesizing findings into one `alignment-report.md` section per lane (`runtime/scripts/reduce-alignment-state.cjs`). Convergence requires both 100% artifact coverage AND a stable zero-new-findings window, never either alone; do not transfer sibling defaults from `deep-review`, `deep-research`, or `deep-ai-council`. The default loop is read-only — remediation is a separate, operator-gated hook (`scripts/remediate-hook.cjs`) this workflow never invokes automatically.

**Alignment path (findings):** `/deep:alignment` -> (if any lane FAIL/CONDITIONAL) `/speckit:plan` -> `/speckit:implement`
**Alignment path (clean):** `/deep:alignment` -> (if every lane PASS) `/create:changelog`
