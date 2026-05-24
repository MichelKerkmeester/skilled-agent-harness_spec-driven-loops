---
description: Autonomous deep-research loop: iterative investigation with convergence detection. Modes :auto, :confirm.
argument-hint: "<topic> [:auto|:confirm] [--max-iterations=N] [--convergence=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search, mcp__cocoindex_code__search, code_graph_query, code_graph_context
---

> **Code Graph ownership:** `code_graph_query` and `code_graph_context` stay stable MCP tool IDs; implementation and docs now live under `.opencode/skills/system-code-graph/`.

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve:
>    - `research_topic`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `deep_start-research-loop_auto.yaml`
>    - Confirm: `deep_start-research-loop_confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`

> **Canonical mode syntax:** use attached command suffixes (`/deep:start-research-loop:auto`, `/deep:start-research-loop:confirm`) and keep AGENTS, skills, and quick references synchronized to this entrypoint.

> **Note:** Late-INIT `spec.md` detection and bounded `spec.md` mutations follow
> `.opencode/skills/deep-research/references/spec_check_protocol.md`.
> Acquire `{spec_folder}/research/.deep-research.lock` before `folder_state` classification and keep `research/research.md` as the source of truth for any generated findings sync.
> Targeted strict validation after deep-research spec mutations uses the Node validation orchestrator; the current strict path is designed for fast packet checks and was measured at about 108ms for a fresh Level 3 packet on the local harness.

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all setup inputs in one prompt. Confirm mode still includes multiple approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: For `:confirm` or no suffix, the consolidated setup prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder or load prior context is allowed, then ask ALL questions immediately and wait.

For `:auto`, do not emit the consolidated prompt by default. Resolve setup with the three-tier branch below, then load the auto YAML only after all required values are bound.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{artifact_dir}/deep-research-config.json` (shape: `researchTopic`, `specFolder`, `maxIterations`, `convergenceThreshold`, `executionMode: "auto"`, `resource_map.emit`, `config.executor.*`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_folder`. **Ordering rule**: none needed. Missing `research_topic` is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:start-research-loop:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  research_topic: WebSocket reconnection strategies  # string
  spec_folder: <spec-folder>  # existing | new | update-related | phase-folder | explicit path
  execution_mode: AUTONOMOUS  # from :auto suffix
  maxIterations: 10  # positive integer
  convergenceThreshold: 0.05  # decimal 0..1
  executor: native  # native | cli-codex | cli-gemini | cli-claude-code | cli-opencode | cli-devin
  executor_model: ""  # optional executor-specific model id
  executor_reasoning: ""  # optional reasoning effort
  executor_service_tier: ""  # optional service tier
  executor_timeout: 900  # optional positive integer seconds
  resource_map_emit: true  # boolean
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `research_topic` | Y | `$ARGUMENTS` positional topic, or marker `research_topic` | none | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, or targeted choice among suggested existing/new/update-related/phase folder | none | Y, when topic is present but folder choice is ambiguous |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `maxIterations` | Y | flag `--max-iterations`, marker `maxIterations`, or default | `10` | N |
| `convergenceThreshold` | Y | flag `--convergence`, marker `convergenceThreshold`, or default | `0.05` | N |
| `executor` | N | flag `--executor`, marker `executor`, config file, or default | `native` | N |
| `executor_model` | N | flag `--model`, marker `executor_model`, or executor-specific validation | none | N |
| `executor_reasoning` | N | flag `--reasoning-effort`, marker `executor_reasoning`, or executor default | none | N |
| `executor_service_tier` | N | flag `--service-tier`, marker `executor_service_tier`, or executor default | none | N |
| `executor_timeout` | N | flag `--executor-timeout`, marker `executor_timeout`, or default | `900` | N |
| `resource_map_emit` | N | flag `--no-resource-map`, marker `resource_map_emit`, or default | `true` | N |

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"         -> execution_mode = "AUTONOMOUS"
   |-- ":confirm"      -> execution_mode = "INTERACTIVE"
   +-- No suffix       -> execution_mode = "ASK"

2. CHECK $ARGUMENTS for topic:
   |-- Has content (ignoring suffixes and flags):
   |     -> research_topic = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   |-- --executor=<type> -> config.executor.type (`native` | `cli-codex` | `cli-gemini` | `cli-claude-code` | `cli-opencode` | `cli-devin`)
   |-- --model=<id> -> config.executor.model (for example `gpt-5.4`)
   |-- --reasoning-effort=<level> -> config.executor.reasoningEffort (`none` | `minimal` | `low` | `medium` | `high` | `xhigh`)
   |-- --service-tier=<tier> -> config.executor.serviceTier (`priority` | `standard` | `fast`)
   |-- --executor-timeout=<seconds> -> config.executor.timeoutSeconds (positive integer, default `900`)
   |-- --no-resource-map -> config.resource_map.emit = false
   +-- Defaults: maxIterations=10, convergenceThreshold=0.05, config.executor.type=`native`, config.executor.timeoutSeconds=900, config.resource_map.emit=`true`

   Executor precedence for setup resolution:
   - CLI flag > config file > schema defaults
   - The generated `deep-research-config.json` stores executor settings under `config.executor.*`

   Parsing to config mapping:
   - `--executor` -> `config.executor.type`
   - `--model` -> `config.executor.model`
   - `--reasoning-effort` -> `config.executor.reasoningEffort`
   - `--service-tier` -> `config.executor.serviceTier`
   - `--executor-timeout` -> `config.executor.timeoutSeconds`

   Validation hook:
   - `parseExecutorConfig` from `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` runs at config-write time
   - Invalid combinations fail fast with clear errors, including `cli-codex` without `--model` and reserved-but-unwired executor kinds

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: research_topic OR "deep-research", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):
   - Include Q-Exec only when `--executor` is NOT present and the topic text does NOT already mention executor hints such as `cli-codex`, `codex`, or `gpt-5.4`
   - If Q-Exec is omitted and no executor is otherwise resolved, default to `native`

   Q0. Research Topic (if not in command): What topic to research deeply?

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 10. Change? [Enter number or press enter for default]

   Q-Exec. Executor (optional, press enter for default):
     A) Native (default) — dispatch via @deep-research agent with Opus.
     B) cli-codex — `codex exec` with --model X -c model_reasoning_effort -c service_tier.
     C) cli-gemini — `gemini "PROMPT" -m gemini-3.1-pro-preview -y -o text`. Single supported model currently. No reasoning-effort or service-tier.
     D) cli-claude-code — `claude -p "PROMPT" --model X --permission-mode acceptEdits` with optional --effort. No service-tier.
     E) cli-opencode — `opencode run --model X --agent general --format json --dangerously-skip-permissions --pure --dir {repo_root} [--variant Y] "PROMPT" </dev/null`. `reasoningEffort` maps to `--variant`. No service-tier.
     F) cli-devin — `devin --print --prompt-file ... --model X --permission-mode auto`. Default model swe-1.6. No reasoning-effort or service-tier.

   Reply format examples:
   - `"A, A"`
   - `"WebSocket research, A, B, 15"`
   - `"WebSocket reconnection strategies, B, A, 10, 0.05, B, gpt-5.4, high, fast"`
   - `"agent execution guardrails research, B, A, 15, 0.05, C, gpt-5.4, _, _"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - research_topic = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 10]
   - convergenceThreshold = [from flag or default 0.05]
   - executor config = [CLI flags, compact reply, config file, or default `native`; map compact reply fields to `config.executor.type/model/reasoningEffort/serviceTier`, and accept an optional volunteered convergence value before executor fields]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**
- `research_topic` | `spec_choice` | `spec_path`
- `execution_mode` | `maxIterations` | `convergenceThreshold`

---

# Deep Research

Conduct autonomous iterative deep research with convergence detection. Each iteration dispatches a fresh LEAF agent (`@deep-research`) that reads externalized state, performs focused investigation, and writes findings to files.

For code review and quality auditing, see `/deep:start-review-loop`.

## Convergence Threshold Semantics

**Default:** 0.05 on newInfoRatio (fully-new=1.0, partially-new=0.5, +0.10 simplicity bonus, capped 1.0)

**Semantic:** `convergenceThreshold` compares newly discovered information against accumulated research knowledge with negative-knowledge emphasis. Lower = more iterations / higher signal threshold.

**NOT INTERCHANGEABLE with siblings:**
- `deep-review` uses 0.10 default on weighted P0/P1/P2 severity ratio
- `deep-ai-council` (proposed) uses 0.20 default on adjudicator-verdict stability

Carrying threshold expectations across siblings will cause unexpected iteration counts. See 130 research at `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation/research/research.md` §2 F56/F78, §5 Recommendation, and §6 Parity Invariants.

```yaml
role: Deep Research Loop Manager
purpose: Run iterative research cycles until convergence or max iterations
action: Execute YAML workflow managing init, loop, synthesis, and save phases
operating_mode:
  workflow: iterative_loop
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: convergence_detection
```

---

## 1. PURPOSE

Run an iterative loop for deep research: Initialize state under `{artifact_dir}` (resolved via `resolveArtifactRoot()` — root specs use `{spec_folder}/research/`; child phases and sub-phases use `{spec_folder}/research/{packet}-pt-{NN}/`), dispatch `@deep-research` agent per iteration, evaluate convergence, synthesize findings into `{artifact_dir}/research.md`, and emit `{artifact_dir}/resource-map.md` at convergence unless `--no-resource-map` disables it. Use when deep investigation requiring multiple rounds of discovery.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Research topic with optional flags and mode suffix
**Outputs:** Spec folder with `{artifact_dir}/` packet (`{spec_folder}/research/` for root specs or `{spec_folder}/research/{packet}-pt-{NN}/` for nested phases), `research.md`, optional `resource-map.md`, state files, and `STATUS=<OK|FAIL|CANCELLED>`

---

## 3. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Init | Initialize | Create config, strategy (with research charter), state files | State files in `research/` |
| Loop | Iterate | Dispatch @deep-research agent, evaluate convergence + quality guards, generate dashboard | iteration-NNN.md files, deep-research-dashboard.md |
| Synth | Synthesize | Emit `research/resource-map.md` and compile final research/research.md | research/resource-map.md, research/research.md (17 sections) |
| Save | Preserve | Refresh continuity update in canonical spec docs | canonical spec doc updated via `generate-context.js` |

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/deep:start-research-loop:auto "topic"` | All iterations without approval |
| `:confirm` | `/deep:start-research-loop:confirm "topic"` | Multi-gate review at setup, iteration, and synthesis |
| (default) | `/deep:start-research-loop "topic"` | Ask user to choose mode during setup |

---

## 4. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on execution_mode:

- **AUTONOMOUS**: `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`
- **INTERACTIVE**: `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`

The YAML contains the full loop workflow: initialization, iteration dispatch, convergence detection, synthesis, and memory save.

---

## 5. OUTPUT FORMATS

**Success:**
```
Deep research complete.
Iterations: [N] | Stop reason: [converged|max_iterations|all_answered]
Artifacts: research/research.md, research/resource-map.md (unless `--no-resource-map`), [N] iteration files, continuity update in canonical spec docs refreshed
Ready for: /speckit:plan [feature-description]
STATUS=OK PATH=[spec-folder-path]
```

**Failure:**
```
Error: [error description]  Phase: [phase name]
STATUS=FAIL ERROR="[message]"
```

---

## 6. MEMORY INTEGRATION

### Before Starting
- `memory_context({ input: topic, intent: "understand" })` -- Load prior research
- Inject results into strategy.md "Known Context" section

### Code Context Bootstrap
- Use CocoIndex (`mcp__cocoindex_code__search`) to find relevant code examples before starting research
- Query: 2-5 word concept descriptions related to the research topic
- Inject discovered code patterns into strategy.md "Known Context" section alongside memory findings

### After Completing
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
- Verify that the canonical save routed continuity into the expected packet doc (decision-record.md / implementation-summary.md / handover.md)

### Anchor Tags (Automatic)
`ANCHOR:deep-research-[topic]`, `ANCHOR:findings`, `ANCHOR:convergence-report`

---

## 7. SKILL REFERENCE

Full protocol documentation: `.opencode/skills/deep-research/SKILL.md`

Key references:
- Loop protocol: `deep-research/references/loop_protocol.md`
- Spec check protocol: `deep-research/references/spec_check_protocol.md`
- State formats: `deep-research/references/state_format.md`
- Convergence: `deep-research/references/convergence.md`
- Quick reference: `deep-research/references/quick_reference.md`

For code review, see `deep-review` skill (`.opencode/skills/deep-review/SKILL.md`).

---

## 8. EXAMPLES

```
/deep:start-research-loop:auto "WebSocket reconnection strategies across browsers"
/deep:start-research-loop:confirm "distributed caching patterns for microservices"
/deep:start-research-loop:auto "API rate limiting approaches" --max-iterations 5 --convergence 0.10
```

---

## 9. NEXT STEPS

> **Note:** Deep-research now anchors bounded findings back into `spec.md` through the generated findings fence while keeping `research/research.md` canonical.

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Research complete, ready to plan | `/speckit:plan [feature]` | Use findings for spec/plan |
| Need more investigation | `/deep:start-research-loop [new-topic]` | Another deep research session |
| Need code/spec audit | `/deep:start-review-loop [target]` | Iterative code review |
| Want to refresh search support | `/memory:save [spec-folder]` | Refresh the indexed canonical spec document while canonical continuity stays in spec docs |

---

## 10. ERROR HANDLING

| Error | Action |
|-------|--------|
| Agent dispatch timeout | Retry once with reduced scope, then mark timeout |
| State file missing | Reconstruct from iteration files |
| 3+ consecutive failures | Halt loop, enter synthesis with partial findings |
| Memory save failure | Save to `scratch/` as backup |

---

## 11. KEY DIFFERENCES (vs. single-pass research)

- Iterative (multi-pass) vs. single-pass research
- Dispatches `@deep-research` LEAF agent per iteration (fresh context each time)
- Externalized state via JSONL + strategy files
- Automatic convergence detection with quality guards (3 binary checks before STOP)
- Persistent dashboard auto-generated each iteration for progress tracking
- Negative knowledge (ruled-out directions) as first-class research output
- Research charter (non-goals, stop conditions) validated at init
- Does NOT proceed to implementation

---

## 12. COMMAND CHAIN

**Research path:** `/deep:start-research-loop` → `/speckit:plan` → `/speckit:implement`
**Review:** `/deep:start-review-loop` → (if issues) `/speckit:plan` → `/speckit:implement`

---

## 13. OFFLINE OPTIMIZATION

Convergence thresholds and recovery settings used by this command are a governed maintenance surface managed by the offline loop optimizer (042.004). The optimizer tunes deterministic numeric thresholds offline against real run traces and emits advisory-only candidate patches.

**Key constraints:**
- Optimization is offline only -- it does not run during live research sessions
- Promotion is advisory-only until replay fixtures and behavioral suites exist
- Prompt optimization is deferred future work (Phase 4b) and will use generated prompt packs, never direct agent markdown mutation

**References:**
- Optimizer configuration: `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-control file.json`
- Tunable thresholds: `convergenceThreshold`, `stuckThreshold`, `maxIterations`
- Convergence reference: `.opencode/skills/deep-research/references/convergence.md`
