---
description: Autonomous deep-alignment loop: conformance audit against named standard authorities across resolved lanes. Modes :auto, :confirm.
argument-hint: "<target> [authority] [:auto|:confirm] [--lane-config <file.json>] [--max-iterations=N] [--coverage-threshold=N] [--stability-window=N] [--convergence-mode=default|off] [--spec-folder=PATH] [--restart|--lineage-mode=restart] [--executor-kind=native|cli-codex|cli-opencode] [--model=MODEL] [--reasoning-effort=LEVEL] [--service-tier=TIER] [--executor-timeout=SECONDS] (--model/--reasoning-effort apply to cli-codex and cli-opencode; --service-tier is cli-codex-only; :auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
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
  - `lanes` (resolved via the structured scoping question, or `--lane-config`), `spec_folder`, `execution_mode`, `maxIterations`, `coverageThreshold`, `stabilityWindow`, `convergenceMode`, `lineage_mode`

### AUTONOMOUS EXECUTION DIRECTIVE (:auto)

> Read this first. It is an imperative to you, the executor — not background information.

You were invoked via `opencode run --command deep/alignment` with the `:auto` suffix and a bound spec_folder and target in your message. The `:auto` suffix plus the bound spec_folder mean setup is ALREADY resolved. Therefore:

- DO NOT emit the consolidated setup question (target/mode, research topic, Spec Folder A/B/C/D/E, execution mode, max iterations, executor). The bound spec_folder is your write authority; do not ask which spec folder should own the writes.
- DO NOT halt for the repo-wide `CLAUDE.md` Gate-3 documentation gate. Under AUTONOMOUS execution with a validated prebound spec folder, Gate 3 is already satisfied by that folder (the prebound spec folder is your write authority).
- PROCEED immediately — as an ACTION, not an announcement. Your VERY NEXT output MUST be a tool call: `Read` the auto workflow YAML (`.opencode/commands/deep/assets/deep-alignment-auto.yaml`), then begin executing its steps as tool calls without pausing — its opening steps resolve the artifact root, create the `alignment/` packet directories, and acquire the loop lock (`alignment/.deep-alignment.lock`), so a run that has started leaves that lock and those directories behind as proof. Emit NO prose before that first tool call. Do NOT write "I'm now invoking the runner", "I'll load the YAML", or any sentence describing what you are about to do — there is no separate runner or command process that executes the YAML for you; YOU are the runner. A turn that ends after describing the handoff, with an empty `alignment/`, is a FAILED run.
- DISPATCH ONLY the AUDIT; EXECUTE the ORCHESTRATION yourself. You do NOT read, edit, patch, or audit the target artifacts yourself — the `deep-alignment` leaf you dispatch does that. But YOU execute the auto workflow YAML's own orchestration steps, step by step, as your own tool calls: its setup bash commands, the per-iteration leaf dispatch, reducer sync, convergence checks, and synthesis. "The YAML owns the loop" means those steps are written there for YOU to run — NOT that another process runs them. The `deep-alignment` leaf owns only its single-iteration artifacts; mixing your own inline audit work into the loop is a route violation.
- ROUTE PROOF: dispatch through the auto workflow with its prompt pack so `deep-alignment` writes each iteration state record with the route-proof fields present — `target_agent: "deep-alignment"`, `resolved_route`, `agent_definition_loaded: true`, and `mode: "alignment"`. A completed run whose iteration state records omit these fields is an incomplete delegation and does not pass.

Your job is to EXECUTE the auto workflow YAML's orchestration yourself — emitting its setup steps as tool calls and dispatching `deep-alignment` once per iteration — NOT to audit the target artifacts yourself, and NOT to review, analyze, or summarize this contract. Executing the YAML means YOU issue each of its steps as a tool call, in order, starting now; there is no separate runner that does it for you. This contract is your instruction set; the alignment target is the bound spec_folder/target named in your message, never this document.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/deep/assets/deep-alignment-presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep-alignment-auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep-alignment-confirm.yaml` |

The presentation asset owns every dashboard, prompt, and result-template string this mode presents.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:alignment:auto` and `/deep:alignment:confirm`.
2. Treat target/authority text, `--lane-config`, `--max-iterations`, `--coverage-threshold`, `--stability-window`, `--spec-folder`, lifecycle flags (`--restart`, `--lineage-mode`), executor flags, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS`. A `--lane-config <file.json>` flag resolves lanes non-interactively (`scripts/scoping.cjs` `parseLaneConfigFile`); without it, resolve lanes through the structured three-axis scoping question (authority x artifactClass x scope) before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the consolidated setup prompt (inline in the confirm workflow's own `gate_init_approval`-equivalent step) before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the same consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `lanes`, `spec_folder`, `execution_mode`, `maxIterations`, `coverageThreshold`, `stabilityWindow`, `convergenceMode`, and `lineage_mode` are bound.

### Lane Config Flag

`--lane-config <file.json>` is the ONLY non-interactive lane-resolution path (ADR-011 LOCKED) — there is no inline per-flag lane syntax. The file must contain a JSON array of `{authority, artifactClass, scope}` objects; see `.opencode/skills/system-deep-loop/deep-alignment/references/lane-config-schema.md`.

### Convergence Flags

`--coverage-threshold <F>` (default `1.0`) and `--stability-window <N>` (default `2`) tune the two-signal AND-gate `deep-alignment/scripts/check-convergence.cjs` evaluates; both must hold together before STOP is legal, and `--max-iterations` remains an independent hard stop regardless of their outcome. Do not transfer `deep-review`'s single `convergenceThreshold` ratio semantics onto these two flags — they are not equivalent.

`--convergence-mode=default` uses that early-convergence gate. `--convergence-mode=off` disables the `CONVERGED` decision so an applicable run executes exactly `--max-iterations` and stops with `STOP_MAX_ITERATIONS`; zero-applicable-lane runs still exit as `NOTHING_TO_CONVERGE`.

### Executor Flags

The per-iteration LEAF defaults to the native `@deep-alignment` agent on `opus` (`--executor-kind=native`). In `:auto`, set `--executor-kind=cli-codex` to dispatch a single external GPT codex executor, or `--executor-kind=cli-opencode` to dispatch a single OpenCode-backed model such as GLM 5.2 or MiniMax M3. Both external executors act as the deep-alignment leaf for one iteration at a time. `:confirm` and no-suffix interactive execution remain native-only.

- `--model=MODEL` and `--reasoning-effort=LEVEL` (`none|minimal|low|medium|high|xhigh|max|ultra`) apply to `cli-codex` and `cli-opencode`. OpenCode requires an explicit model and maps reasoning effort to `--variant`.
- `--service-tier=TIER` (`priority|standard|fast`) is **cli-codex-only** and is rejected for native and cli-opencode.
- The codex leaf always runs `--sandbox workspace-write` with `approval_policy=never`. The OpenCode leaf runs with `--pure --dangerously-skip-permissions` only after the workflow verifies an isolated linked worktree, a clean primary worktree, artifact-contained local changes, and the prompt pack's `BANNED OPERATIONS` / `ALLOWED WRITE PATHS` markers. Its single-executor path remains subject to the cli-opencode cross-runtime self-invocation guard.
- `--executor-timeout=SECONDS` bounds a single executor invocation for any kind.
- `cli-claude-code` is not available for this single-executor mode. Parallel fan-out is a separate path this command does not expose here.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep-alignment-auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep-alignment-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep-alignment-presentation.txt`:

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
