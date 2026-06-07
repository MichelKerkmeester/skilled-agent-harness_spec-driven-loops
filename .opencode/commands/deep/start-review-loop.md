---
description: Autonomous deep-review loop: iterative code audit with convergence detection. Modes :auto, :confirm.
argument-hint: "<target> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--spec-folder=PATH] [--executor=<type> --count=N --label=X ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query, code_graph_context
---

> **Code Graph ownership:** `code_graph_query` and `code_graph_context` stay stable MCP tool IDs; implementation and docs now live under `.opencode/skills/system-code-graph/`.

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
> Under `:auto`, setup follows the three-tier resolution contract in §0: resolve confidently, ask only targeted ambiguity questions, then fail fast if required inputs remain unresolved. Under `:confirm`, setup keeps the consolidated interactive question block.
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates — do them in order, skip neither):**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run the Unified Setup Phase (BLOCKED gate) in this Markdown entrypoint and resolve:
>    - `review_target`
>    - `review_target_type`
>    - `review_dimensions`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
> 3. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `deep_start-review-loop_auto.yaml`
>    - Confirm: `deep_start-review-loop_confirm.yaml`
> 4. Execute the YAML workflow step by step using those resolved values
>
> This command is **general-agent based** — it orchestrates the deep-review loop. Gate 1 (@general verification) and Gate 2 (the BLOCKED Unified Setup Phase) below are HARD BLOCKS; neither may be skipped.
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate the deep-review loop (YAML workflow execution)
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to the Unified Setup Phase (also a HARD BLOCK)
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates the deep-review loop and runs    │
    │   │ general-agent based.                                       │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:start-review-loop [arguments]                      │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`

> **Canonical mode syntax:** use attached command suffixes (`/deep:start-review-loop:auto`, `/deep:start-review-loop:confirm`) and keep AGENTS, skills, and quick references synchronized to this entrypoint.

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all setup inputs in one prompt. Confirm mode still includes multiple approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: For `:confirm` or no suffix, the consolidated setup prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder or load prior context is allowed, then ask ALL questions immediately and wait.

For `:auto`, do not emit the consolidated prompt by default. Resolve setup with the three-tier branch below, then load the auto YAML only after all required values are bound.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{spec_folder}/review/deep-review-config.json` (shape: `reviewTarget`, `reviewTargetType`, `reviewDimensions`, `specFolder`, `maxIterations`, `convergenceThreshold`, `executionMode: "auto"`, `resource_map.emit`, `config.executor.*`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `review_target_type`, `spec_folder`. **Ordering rule**: if `review_target_type` is ambiguous, ask only for `review_target_type` first — the answer may make `spec_folder` self-evident on the next Tier 1 pass. Missing `review_target` is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:start-review-loop:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the Consolidated Setup Prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults.

```yaml
PRE-BOUND SETUP ANSWERS:
  review_target: <spec-folder>
  review_target_type: spec-folder  # one of: spec-folder | skill | agent | track | files
  review_dimensions: all  # or comma-separated subset: correctness, security, traceability, maintainability
  spec_folder: existing  # one of: existing | new | update-related | phase-folder, or an explicit specs/.opencode/specs path
  execution_mode: AUTONOMOUS  # from :auto suffix
  maxIterations: 10
  convergenceThreshold: 0.10
  executor: native  # one of: native | cli-codex | cli-gemini | cli-claude-code | cli-opencode | cli-devin
  executor_model: ""  # optional, executor-specific (cli-opencode e.g. xiaomi-token-plan-ams/mimo-v2.5-pro, minimax-coding-plan/MiniMax-M2.7-highspeed)
  executor_reasoning: ""  # optional
  executor_service_tier: ""  # optional
  executor_timeout: 900  # optional
  resource_map_emit: true  # optional
```

Rules:

- Any unspecified field falls back to its documented default.
- Marker fields take precedence over `$ARGUMENTS` flags because the caller explicitly bound setup in the prompt body.
- Unknown fields are warnings, not errors.
- Malformed lines, including missing `:`, emit a parse error naming the offending line. Known fields parsed before the error may still be used, and unresolved fields continue to Tier 2 or Tier 3.
- Empty strings count as unresolved for required fields.
- Compact legacy answer strings are only for the consolidated `:confirm` prompt. They are not a `:auto` marker format.

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `review_target` | Y | `$ARGUMENTS` first positional target, or marker `review_target` | none | N |
| `review_target_type` | Y | marker `review_target_type`, or auto-detect from `review_target` | inferred only | Y, when target is present but ambiguous |
| `review_dimensions` | Y | flag `--dims` if supported by caller, marker `review_dimensions`, or default | `"all"` | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, `scope-extract` → a target/scope path that resolves to an existing spec folder (auto-bound, per `auto_mode_contract` §1 source 3), or target path when target is a spec folder | none | Y, when target is not a spec folder |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `maxIterations` | Y | flag `--max-iterations`, marker `maxIterations`, or default | `7` | N |
| `convergenceThreshold` | Y | flag `--convergence`, marker `convergenceThreshold`, or default | `0.10` | N |
| `executor` | N | flag `--executor`, marker `executor`, config file, or default | `native` | N |
| `executor_model` | N | flag `--model`, marker `executor_model`, or executor-specific validation | none | N |
| `executor_reasoning` | N | flag `--reasoning-effort`, marker `executor_reasoning`, or executor default | none | N |
| `executor_service_tier` | N | flag `--service-tier`, marker `executor_service_tier`, or executor default | none | N |
| `executor_timeout` | N | flag `--executor-timeout`, marker `executor_timeout`, or default | `900` | N |
| `resource_map_emit` | N | flag `--no-resource-map`, marker `resource_map_emit`, or default | `true` | N |
| `fanout_executors` | N | repeatable `--executor=<type>` flags or `--executors=<json>`; each group accepts `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout`, `--iters`, `--label`, `--count` | none (single-executor when absent) | N |
| `fanout_concurrency` | N | flag `--concurrency=N` | `2` | N |

**Fan-out default policy:** 0–1 `--executor` flags and no `--executors` → `config.executor` (single-executor, default, unchanged). 2+ `--executor` flags, `--executors`, or any `--count > 1` → `config.fanout`. Review fan-out uses strongest-restriction: any lineage active P0 → merged FAIL. Native fan-out (count N for `native` executor) runs N sequential `@deep-review` sub-agents; CLI fan-out runs N headless subprocesses in the capped pool.

### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode

Use this block only when `execution_mode = "INTERACTIVE"` or when no suffix was supplied and Q2 must ask for the execution mode.

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"    -> execution_mode = "AUTONOMOUS"
   |-- ":confirm" -> execution_mode = "INTERACTIVE"
   +-- No suffix  -> execution_mode = "ASK" (include Q2)

2. CHECK $ARGUMENTS for target (review_target):
   |-- Has content (ignoring suffixes and flags):
   |     -> review_target = $ARGUMENTS, omit Q0
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
   |-- --executor=<type> [--model=X] [--reasoning-effort=Y] [--service-tier=Z] [--executor-timeout=N] [--iters=N] [--label=X] [--count=N]
   |     (repeatable; each occurrence adds one entry to config.fanout.executors)
   |-- --executors=<json> -> config.fanout.executors = parse(json) escape hatch
   |-- --concurrency=N -> config.fanout.concurrency (default 2)
   |
   |   Fan-out default policy:
   |   - 0 or 1 --executor (no --executors, no count>1): write config.executor (single, unchanged)
   |   - 2+ --executor flags, --executors, or any count>1: write config.fanout
   |   - Review fan-out verdict: strongest-restriction (any lineage active P0 → merged FAIL)
   |
   +-- Defaults: maxIterations=7, convergenceThreshold=0.10, config.executor.type=`native`, config.executor.timeoutSeconds=900, config.resource_map.emit=`true`

   Executor precedence for setup resolution:
   - CLI flag > config file > schema defaults
   - The generated `deep-review-config.json` stores executor settings under `config.executor.*`

   Parsing to config mapping:
   - `--executor` -> `config.executor.type`
   - `--model` -> `config.executor.model`
   - `--reasoning-effort` -> `config.executor.reasoningEffort`
   - `--service-tier` -> `config.executor.serviceTier`
   - `--executor-timeout` -> `config.executor.timeoutSeconds`

   Validation hook:
   - `parseExecutorConfig` from `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` runs at config-write time
   - Invalid combinations fail fast with clear errors, including `cli-codex` without `--model` and reserved-but-unwired executor kinds

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: review_target OR "deep-review", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):
   - Include Q-Exec only when `--executor` is NOT present and the target text does NOT already mention executor hints such as `cli-codex`, `codex`, or `gpt-5.4`
   - If Q-Exec is omitted and no executor is otherwise resolved, default to `native`

   Q0. Review Target (if not in command): What to review?
     Examples: spec folder path, `skill:sk-name`, `agent:name`, `track:NN--name`, or file paths/globs

   Q1_type. Review Target Type (auto-detect from Q0, confirm):
     A) spec-folder -- Review spec artifacts + implementation files
     B) skill -- SKILL.md + references/ + assets/ + agents + commands
     C) agent -- Agent family across all runtimes
     D) track -- All child spec folders in a feature track
     E) files -- Arbitrary file paths or globs

   Q_dims. Which review dimensions? (default: all 4)
     All: correctness, security, traceability, maintainability
     Or specify a subset (e.g., "correctness, security")

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 7 for review. Change? [Enter number or press enter for default]

   Q-Exec. Executor (optional, press enter for default):
     A) Native (default) — dispatch via @deep-review agent with Opus.
     B) cli-codex — `codex exec` with --model X -c model_reasoning_effort -c service_tier.
     C) cli-gemini — `gemini "PROMPT" -m gemini-3.1-pro-preview -y -o text`. Single supported model currently. No reasoning-effort or service-tier.
     D) cli-claude-code — `claude -p "PROMPT" --model X --permission-mode acceptEdits` with optional --effort. No service-tier.
     E) cli-opencode — `opencode run --model X --format json --dangerously-skip-permissions --pure --dir {repo_root} [--variant Y] "PROMPT" </dev/null` (no `--agent`: current opencode rejects top-level `--agent general` — default agent runs; required for MiniMax/Xiaomi token-plan models). `reasoningEffort` maps to `--variant`. No service-tier.
     F) cli-devin — `devin --print --prompt-file ... --model X --permission-mode auto`. Default model swe-1.6. No reasoning-effort or service-tier.

   Reply format examples:
   - `"skill:deep-research, B, all, A, A"`
   - `"review the deep-review packet output, E, correctness security, B, B, 5"`
   - `"Review review/review-report.md contract drift, E, all, A, 7, 0.10, B, gpt-5.4, high, fast"`
   - `"review executor drift across CLIs, E, all, A, 7, 0.10, C, gpt-5.4, _, _"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - review_target = [from Q0 or $ARGUMENTS]
   - review_target_type = [from Q1_type, auto-detected]
   - review_dimensions = [from Q_dims or default "all"]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 7]
   - convergenceThreshold = [from flag or default 0.10]
   - executor config = [CLI flags, compact reply, config file, or default `native`; map compact reply fields to `config.executor.type/model/reasoningEffort/serviceTier`, and accept an optional volunteered convergence value before executor fields]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**

- `review_target` | `review_target_type` | `review_dimensions`
- `spec_choice` | `spec_path` | `execution_mode` | `maxIterations` | `convergenceThreshold`

---

# Deep Review

Conduct autonomous iterative code review with convergence detection. Each iteration dispatches a fresh LEAF agent (`@deep-review`) that reads externalized state, performs focused review work across configured dimensions, and writes findings to files.

## Convergence Threshold Semantics

**Default:** 0.10 (weighted P0/P1/P2 severity ratio)

**Semantic:** `convergenceThreshold` compares new severity-weighted findings (P0=10, P1=5, P2=1) against accumulated findings. Lower = more iterations / higher signal threshold.

**NOT INTERCHANGEABLE with siblings:**
- `deep-research` uses 0.05 default on newInfoRatio (negative-knowledge emphasis)
- `deep-ai-council` (proposed) uses 0.20 default on adjudicator-verdict stability

Carrying threshold expectations across siblings will cause unexpected iteration counts. See 130 research at `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/006-deep-stack-cross-cutting/001-unique-value-differentiation/research/research.md` §2 F56/F78, §5 Recommendation, and §6 Parity Invariants.

```yaml
role: Deep Review Loop Manager
purpose: Run iterative review cycles until convergence or max iterations
action: Execute YAML workflow managing init, loop, synthesis, and save phases
operating_mode:
  workflow: iterative_loop
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: convergence_detection
```

---

## 1. PURPOSE

Run an iterative loop for code review: Initialize the review packet under `{artifact_dir}` (resolved via `resolveArtifactRoot()` — root specs use `{spec_folder}/review/`; child phases and sub-phases use `{spec_folder}/review/{packet}-pt-{NN}/`), dispatch `@deep-review` agent per iteration, evaluate convergence across review dimensions, synthesize findings into `{artifact_dir}/review-report.md`, and emit `{artifact_dir}/resource-map.md` at convergence unless `--no-resource-map` disables it. Use when auditing code, specs, skills, agents, or tracks for quality and release readiness.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Review target with optional flags and mode suffix
**Outputs:** Spec folder with `{artifact_dir}/` packet (`{spec_folder}/review/` for root specs or `{spec_folder}/review/{packet}-pt-{NN}/` for nested phases), `review-report.md`, optional `resource-map.md`, state files, and `STATUS=<OK|FAIL|CANCELLED>`

---

## 3. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Init | Initialize | Scope discovery, resolve files, create config + strategy with review dimensions | Review packet in `{spec_folder}/review/` |
| Loop | Iterate | Dispatch @deep-review agent per dimension, evaluate review convergence + quality guards | `review/iterations/iteration-NNN.md` files, `review/deep-review-dashboard.md` |
| Synth | Synthesize | Build finding registry, emit `review/resource-map.md`, deduplicate, compile `review/review-report.md` | `review/resource-map.md`, `review/review-report.md` (9 sections) |
| Save | Preserve | Refresh continuity update in canonical spec docs | canonical spec doc updated via `generate-context.js` |

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/deep:start-review-loop:auto "target"` | All iterations without approval |
| `:confirm` | `/deep:start-review-loop:confirm "target"` | Multi-gate review at setup, iteration, and synthesis |
| (default) | `/deep:start-review-loop "target"` | Ask user to choose mode during setup |

---

## 4. KEY BEHAVIORS

### Autonomous Mode (`:auto`)

- Executes all iterations without user approval gates
- Self-validates at each convergence checkpoint
- Makes informed decisions on dimension ordering and iteration focus
- Documents all significant decisions in `review/deep-review-dashboard.md`
- Stops when convergence threshold is met or max iterations reached

### Interactive Mode (`:confirm`)

- Pauses after each iteration for user approval
- Presents iteration findings summary with dimension coverage
- Options at each gate: Approve, Review Details, Modify Scope, Skip Dimension, Abort
- Documents user decisions at each checkpoint
- Allows course correction of dimensions, depth, or scope throughout

---

## 5. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on execution_mode:

- **AUTONOMOUS**: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- **INTERACTIVE**: `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`

The YAML contains the full loop workflow: initialization, iteration dispatch, convergence detection, synthesis, and memory save.

---

## 6. OUTPUT FORMATS

**Review Success:**
```
Deep review complete.
Iterations: [N] | Stop reason: [converged|max_iterations|all_dimensions_clean]
Findings: P0=[N] P1=[N] P2=[N] | Verdict: [PASS|CONDITIONAL|FAIL] [PASS may include hasAdvisories=true]
Artifacts: review/review-report.md, review/resource-map.md (unless `--no-resource-map`), [N] iteration files in review/, continuity update in canonical spec docs refreshed
Ready for: /speckit:plan [remediation] (if FAIL/CONDITIONAL)
STATUS=OK PATH=[spec-folder-path]
```

**Failure:**
```
Error: [error description]  Phase: [phase name]
STATUS=FAIL ERROR="[message]"
```

---

## 7. MEMORY INTEGRATION

### Before Starting
- `memory_context({ input: review_target, intent: "understand" })` -- Load prior review context
- Inject results into strategy.md "Known Context" section

### Code Context Bootstrap
- Use Code Graph (`code_graph_query`) to find relevant code examples before starting review
- Query: 2-5 word concept descriptions related to the review target
- Inject discovered code patterns into strategy.md "Known Context" section alongside memory findings

### After Completing
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
- Verify that the canonical save routed continuity into the expected packet doc (decision-record.md / implementation-summary.md / handover.md)

### Anchor Tags (Automatic)
`ANCHOR:deep-review-[target]`, `ANCHOR:findings`, `ANCHOR:convergence-report`

---

## 8. SKILL REFERENCE

Full protocol documentation: `.opencode/skills/deep-review/SKILL.md`

Key references:
- Review contract: `deep-review/assets/review_mode_contract.yaml`
- Review strategy template: `deep-review/assets/deep_review_strategy.md`
- Review dashboard template: `deep-review/assets/deep_review_dashboard.md`
- Review config template: `deep-review/assets/deep_review_config.json`

---

## 9. EXAMPLES

```
# Single-executor (default — unchanged)
/deep:start-review-loop "skill:deep-research"
/deep:start-review-loop:auto "specs/03--commands-and-skills/030-deep-research-review-mode/"
/deep:start-review-loop:confirm "agent:deep-research" --max-iterations=5

# Fan-out: two CLI lineages in parallel
/deep:start-review-loop:auto "skill:sk-code" \
  --executor=cli-codex --model=o4-mini --label=codex \
  --executor=cli-claude-code --model=claude-opus-4-8 --label=claude \
  --concurrency=2

# Fan-out: native + CLI (mixed)
/deep:start-review-loop:auto "agent:deep-research" \
  --executor=native --count=1 --label=native \
  --executor=cli-codex --model=o4-mini --count=2 \
  --concurrency=3
```

> **Review fan-out verdict:** strongest-restriction applies — if any lineage has an active P0 finding, the merged verdict is FAIL regardless of other lineages' outcomes.

---

## 10. NEXT STEPS

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Review FAIL/CONDITIONAL, need fixes | `/speckit:plan [remediation]` | Plan remediation from review findings |
| Review PASS, ready for release | `/create:changelog` | Generate changelog entry |
| Need to fix specific findings | `/speckit:implement [spec-folder]` | Implement fixes from existing plan |
| Need more investigation | `/deep:start-research-loop [topic]` | Deep research session for unclear areas |
| Want to refresh search support | `/memory:save [spec-folder]` | Refresh the indexed canonical spec document while canonical continuity stays in spec docs |

---

## 11. ERROR HANDLING

| Error | Action |
|-------|--------|
| Agent dispatch timeout | Retry once with reduced scope, then mark timeout |
| State file missing | Reconstruct from iteration files |
| 3+ consecutive failures | Halt loop, enter synthesis with partial findings |
| Memory save failure | Preserve the `review/` packet as backup |

---

## 12. KEY FEATURES

### Review Dimensions
- Iterative (multi-pass) code/spec audit across configurable dimensions
- Dimension ordering follows risk priority (correctness and security first)
- Each dimension can be individually included or excluded

### Severity and Verdicts
- Three severity levels: P0 (Blocker), P1 (Required), P2 (Suggestion)
- Three verdicts: PASS, CONDITIONAL, FAIL
- PASS may include `hasAdvisories=true` when P2 findings exist
- P0 override: new P0 findings block convergence regardless of threshold

### Convergence Detection
- Severity-weighted `newFindingsRatio` with rolling average
- MAD noise-floor test for robust churn detection
- Dimension coverage as convergence signal (all required dimensions must be reviewed)
- Three binary quality gates (evidence, scope, coverage) must pass before STOP

### Adversarial Self-Check
- Runs on all P0 findings to validate evidence quality
- Cross-reference verification across spec/code/test boundaries
- Finding deduplication and progressive synthesis

### Agent Model
- Dispatches `@deep-review` LEAF agent per iteration (fresh context each time)
- Externalized state via JSONL + strategy files (no context degradation)
- Review target is READ-ONLY (agent never modifies reviewed code)
- Does NOT proceed to implementation (outputs remediation plan for `/speckit:plan`)

---

## 13. COMMAND CHAIN

**Review path (findings):** `/deep:start-review-loop` -> (if FAIL/CONDITIONAL) `/speckit:plan` -> `/speckit:implement`
**Review path (clean):** `/deep:start-review-loop` -> (if PASS) `/create:changelog`

---

## 14. OFFLINE OPTIMIZATION

Convergence thresholds and recovery settings used by this command are a governed maintenance surface managed by the offline loop optimizer (042.004). The optimizer tunes deterministic numeric thresholds offline against real run traces and emits advisory-only candidate patches.

**Key constraints:**
- Optimization is offline only -- it does not run during live review sessions
- Promotion is advisory-only until replay fixtures and behavioral suites exist
- Prompt optimization is deferred future work (Phase 4b) and will use generated prompt packs, never direct agent markdown mutation

**References:**
- Optimizer configuration: `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-control file.json`
- Tunable thresholds: `convergenceThreshold`, `stuckThreshold`, `maxIterations`, `compositeStopScore`
- Convergence reference: `.opencode/skills/deep-review/references/convergence/convergence.md`
