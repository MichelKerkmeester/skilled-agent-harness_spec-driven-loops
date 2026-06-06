---
description: Codebase-context loop: heterogeneous parallel sweep with convergence detection. Modes :auto, :confirm.
argument-hint: "<scope> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--executor=<type> [--model=X] [--prompt-framework=X] [--label=X] ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query, code_graph_context
---

> **Code Graph ownership:** `code_graph_query` and `code_graph_context` stay stable MCP tool IDs; implementation and docs live under `.opencode/skills/system-code-graph/`.

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve:
>    - `scope`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
>    - `executor_pool` (heterogeneous by-model-shared-scope pool)
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `deep_start-context-loop_auto.yaml`
>    - Confirm: `deep_start-context-loop_confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `scope`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`

> **Canonical mode syntax:** use attached command suffixes (`/deep:start-context-loop:auto`, `/deep:start-context-loop:confirm`) and keep AGENTS, skills, and quick references synchronized to this entrypoint.

> **Note:** This loop is **inward** (the codebase, not the web). Every iteration is one **parallel heterogeneous sweep** of a **shared** focus; cross-executor **agreement** is the confidence signal. Seats are READ-ONLY analyzers; the host writes all merged state (Gate-3-safe). Full loop design lives in `.opencode/skills/deep-context/references/loop_protocol.md` and `convergence.md` (authoritative).

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all setup inputs in one prompt. Confirm mode still includes multiple approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: For `:confirm` or no suffix, the consolidated setup prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder, seed the frontier from the code graph, or load prior context is allowed, then ask ALL questions immediately and wait.

For `:auto`, do not emit the consolidated prompt by default. Resolve setup with the three-tier branch below, then load the auto YAML only after all required values are bound.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{artifact_dir}/deep-context-config.json` (shape: `scope`, `specFolder`, `loopType: "context"`, `maxIterations`, `convergenceThreshold`, `executionMode: "auto"`, `relevanceGate`, `agreementMin`, `fanout.{mode,concurrency,executors}`, `report.*`, `reducer.*`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_folder`. **Ordering rule**: none needed. Missing `scope` is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:start-context-loop:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  scope: WebSocket reconnection in the realtime client  # string — target feature/area to gather context for
  spec_folder: <spec-folder>  # existing | new | update-related | phase-folder | explicit path
  execution_mode: AUTONOMOUS  # from :auto suffix
  maxIterations: 8  # positive integer
  convergenceThreshold: 0.10  # decimal 0..1
  relevanceGate: 0.55  # decimal 0..1 — prune findings below this relevance
  agreementMin: 2  # positive integer — distinct executors required to confirm a finding
  concurrency: 4  # positive integer — CLI-pool concurrency cap
  executors: '[{"kind":"native","label":"native-a"},{"kind":"native","label":"native-b"},{"kind":"cli-opencode","model":"xiaomi-token-plan-ams/mimo-v2.5-pro","reasoningEffort":"high","promptFramework":"costar","label":"mimo"},{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","label":"gpt"},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4-pro","reasoningEffort":"high","promptFramework":"tidd-ec","label":"deepseek"}]'  # JSON array — the heterogeneous by-model-shared-scope pool
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `scope` | Y | `$ARGUMENTS` positional scope, or marker `scope` | none | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, or targeted choice among suggested existing/new/update-related/phase folder | none | Y, when scope is present but folder choice is ambiguous |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `maxIterations` | Y | flag `--max-iterations`, marker `maxIterations`, or default | `8` | N |
| `convergenceThreshold` | Y | flag `--convergence`, marker `convergenceThreshold`, or default | `0.10` | N |
| `relevanceGate` | N | flag `--relevance-gate`, marker `relevanceGate`, or default | `0.55` | N |
| `agreementMin` | N | flag `--agreement-min`, marker `agreementMin`, or default | `2` | N |
| `executor_pool` | N | repeatable `--executor=<type>` flags or `--executors=<json>`, marker `executors`, config file, or default pool; each `--executor` group accepts `--model`, `--reasoning-effort`, `--prompt-framework`, `--label` | default heterogeneous pool (see config) | N |
| `concurrency` | N | flag `--concurrency=N`, marker `concurrency`, or default | `4` | N |

**Pool default policy (the key difference from research/review):** deep-context is **always a by-model-shared-scope pool** — there is no single-executor path. 0 `--executor` flags and no `--executors`/marker → the default heterogeneous pool from `.opencode/skills/deep-context/assets/deep_context_config.json` (2 native + MiMo + gpt + deepseek). Any explicit `--executor`/`--executors`/marker → that pool. A 1-seat pool is legal but defeats the purpose (no agreement signal); warn and continue. The pool is written to `config.fanout.executors` with `config.fanout.mode = "by-model-shared-scope"`.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"         -> execution_mode = "AUTONOMOUS"
   |-- ":confirm"      -> execution_mode = "INTERACTIVE"
   +-- No suffix       -> execution_mode = "ASK"

2. CHECK $ARGUMENTS for scope:
   |-- Has content (ignoring suffixes and flags):
   |     -> scope = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --relevance-gate=N -> relevanceGate = N
   |-- --agreement-min=N -> agreementMin = N
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   |-- --executor=<type> [--model=X] [--reasoning-effort=Y] [--prompt-framework=Z] [--label=X]
   |     (repeatable; each occurrence adds one seat to config.fanout.executors)
   |     type = `native` | `cli-opencode` | `cli-codex` | `cli-claude-code` | `cli-devin`
   |-- --executors=<json> -> config.fanout.executors = parse(json) escape hatch for the full pool
   |-- --concurrency=N -> config.fanout.concurrency (default 4)
   |
   |   Pool resolution:
   |   - No --executor / --executors / marker: use the default heterogeneous pool from
   |     .opencode/skills/deep-context/assets/deep_context_config.json
   |   - Any explicit seats: write config.fanout.executors from them
   |   - ALWAYS set config.fanout.mode = "by-model-shared-scope" (every seat sweeps the SAME focus)
   |
   +-- Defaults: maxIterations=8, convergenceThreshold=0.10, relevanceGate=0.55, agreementMin=2,
       concurrency=4, config.loopType="context"

   Pool precedence for setup resolution:
   - CLI flags / --executors / marker > config file > default pool
   - The generated `deep-context-config.json` stores the pool under `config.fanout.executors`
     and per-model prompt framing under each seat's `promptFramework`

   Per-model prompt framing:
   - Each seat's optional `promptFramework` is resolved against `sk-prompt-small-model`
     (MiMo -> COSTAR, MiniMax -> TIDD-EC, DeepSeek -> TIDD-EC). Native seats carry no framework.
   - cli dispatch honors the cli-* contracts (cli-opencode: closed stdin `</dev/null`,
     NO top-level `--agent`; model id form per the executor skill).

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Seed the frontier + load prior context (background, read-only):
   - code_graph_query on 2-5 word concept descriptions from {scope} -> ranked SLICE anchors
   - memory_context({ input: scope OR "deep-context", mode: "focused", includeContent: true })
   - Store: frontier_seeded = [yes/no], prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):
   - Include Q-Pool only when no `--executor`/`--executors` is present and the scope text does
     NOT already name an executor pool. If Q-Pool is omitted and no pool is otherwise resolved,
     default to the heterogeneous pool from deep_context_config.json.

   Q0. Scope (if not in command): What feature/area should I gather codebase context for?

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)
     E) None yet — use a standalone run dir and hand the report path to /speckit:plan

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 8. Change? [Enter number or press enter for default]

   Q-Pool. Executor Pool (optional, press enter for default):
     A) Default heterogeneous pool — 2 native @deep-context + MiMo (cli-opencode) + gpt (cli-codex) + deepseek (cli-opencode), all sweeping the SAME scope in parallel; agreement = confidence.
     B) Native only — 2 @deep-context Task subagents (Opus) in a parallel batch. No CLI seats.
     C) Custom — provide a pool via repeatable `--executor=...` flags or `--executors='<json>'`.

   Reply format examples:
   - `"A, A"`
   - `"WebSocket reconnection context, A, A, 6"`
   - `"realtime client reconnection, B, A, 8, 0.10, A"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - scope = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D/E from Q1]
   - spec_path = [derived path, or standalone run dir for E]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 8]
   - convergenceThreshold = [from flag or default 0.10]
   - executor_pool = [CLI flags, --executors, compact reply, config file, or default heterogeneous pool;
     ALWAYS written to config.fanout.executors with config.fanout.mode = "by-model-shared-scope"]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**
- `scope` | `spec_choice` | `spec_path`
- `execution_mode` | `maxIterations` | `convergenceThreshold`
- `executor_pool` (by-model-shared-scope)

---

# Deep Context

Gather autonomous, iterative, **multi-model** codebase context with convergence detection. Each iteration is ONE parallel heterogeneous sweep: every executor in the pool analyzes the **same** current focus, the host merges their findings by `file:symbol`, and **cross-executor agreement** drives confidence. The deliverable is a reuse-first **Context Report** for `/speckit:plan` and `/speckit:implement`.

For outward/web knowledge discovery, see `/deep:start-research-loop`. For code audit / defect finding, see `/deep:start-review-loop`.

## Convergence Threshold Semantics

**Default:** 0.10 on per-iteration new-agreement-eligible-findings ratio (relevance-gated coverage saturation).

**Semantic:** `convergenceThreshold` is the floor for *new agreement-eligible findings per iteration*. When successive sweeps stop surfacing new relevance-gated, multi-executor-confirmed findings (below threshold for K iterations) AND the blocking guards pass, the loop is saturated. Lower = more iterations / higher signal threshold.

**NOT INTERCHANGEABLE with siblings:**
- `deep-research` uses 0.05 default on newInfoRatio (negative-knowledge emphasis)
- `deep-review` uses 0.10 default on weighted P0/P1/P2 severity ratio
- `deep-context` (this) uses 0.10 default on relevance-gated coverage saturation, with **agreement** and **relevance** as blocking guards

Carrying threshold expectations across siblings will cause unexpected iteration counts. See `.opencode/skills/deep-context/references/convergence.md` for the full signal table, composite-score weights, and the stop contract.

```yaml
role: Deep Context Loop Manager
purpose: Run iterative parallel-sweep cycles until coverage saturation or max iterations
action: Execute YAML workflow managing init, parallel-sweep loop, synthesis, and save phases
operating_mode:
  workflow: iterative_loop
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: convergence_detection
```

---

## 1. PURPOSE

Run an iterative loop that maps the existing codebase for a feature: seed a frontier of `SLICE` nodes from the scope (via `code_graph_query`, Glob/Grep fallback — never a whole-repo sweep), then each iteration dispatch the **heterogeneous executor pool** over the **same** focus as ONE parallel sweep, merge findings by `file:symbol` with per-executor attribution + agreement counts, upsert coverage-graph nodes/edges (`loop_type='context'`), evaluate convergence, and at stop synthesize a reuse-first **Context Report** into `{spec_folder}/context/context-report.md` (+ `.json`). Use before `/speckit:plan` or `/speckit:implement` when you need a verified map of code to reuse, integration points, and conventions.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Target feature/area scope with optional flags and mode suffix
**Outputs:** Spec folder with `{spec_folder}/context/` packet, `context-report.md` + `context-report.json`, state files, coverage-graph (`loop_type='context'`), and `STATUS=<OK|FAIL|CANCELLED>`

---

## 3. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Init | Initialize | Create config (pool + thresholds), strategy (with seeded frontier + known context), state files | State files in `context/` |
| Loop | Parallel Sweep | Per iteration: dispatch ALL seats over the shared focus concurrently (native batch ‖ CLI pool), merge by `file:symbol` + agreement, upsert coverage-graph, evaluate convergence | iteration-NNN.md files, coverage-graph, deep-context-dashboard.md |
| Synth | Synthesize | Compile the reuse-first Context Report from merged findings | context/context-report.md, context/context-report.json |
| Save | Preserve | Refresh continuity update in canonical spec docs | canonical spec doc updated via `generate-context.js` |

### Session Classification

Before writing any files, `step_classify_session` inspects the three state artifacts (`deep-context-config.json`, `deep-context-state.jsonl`, `deep-context-strategy.md`) and classifies the run into one of four outcomes:

| Session state | Condition | Action |
|---------------|-----------|--------|
| `fresh` | None of the three state artifacts exist | Proceed with a new session: create config, strategy, and state from templates |
| `resume` | Config, JSONL, and strategy all exist and agree on scope/spec folder | Continue the same lineage (sessionId/generation unchanged) and skip straight to the loop |
| `completed-session` | Resume artifacts exist and `config.status == "complete"` | Halt: archive or replace the existing `context/` tree before starting a new session |
| `invalid-state` | Any partial, missing, or contradictory combination | Halt: repair or archive the invalid context packet before continuing |

A `:restart` request archives the current packet and starts a new lineage segment (fresh sessionId, generation + 1).

### Runtime Robustness

The host applies the deep-loop-runtime durability layer for every session:

| Mechanism | What Happens |
|-----------|-------------|
| **Loop-lock** | A single-writer advisory lock is acquired via `scripts/loop-lock.cjs` (`step_acquire_lock`) at session start and released (`step_release_lock`) at exit, preventing concurrent sessions from racing the shared state files. |
| **Atomic state writes** | The registry and dashboard are written crash-safe (temp file → fsync → rename) via the runtime `writeStateAtomic` helper in `reduce-state.cjs`. A partial write never corrupts the existing state. |
| **JSONL repair** | Before each reduce pass, the runtime `repairJsonlTail` helper inspects `deep-context-state.jsonl` and truncates a corrupt trailing line, so a mid-write crash does not block subsequent iterations. |
| **Post-dispatch seat-output validation** | Each seat's returned finding set is validated (known kind / path-or-symbol / numeric relevance) before it enters the merge. Invalid findings surface as `seatValidationWarnings` and are never silently merged. |
| **Executor-audit recursion guard** | CLI seats are dispatched with the runtime recursion-guard env variable set, so a seat cannot launch a nested deep-context loop regardless of its prompt content. |

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/deep:start-context-loop:auto "scope"` | All iterations without approval |
| `:confirm` | `/deep:start-context-loop:confirm "scope"` | Multi-gate review at setup, each iteration, and synthesis |
| (default) | `/deep:start-context-loop "scope"` | Ask user to choose mode during setup |

---

## 4. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on execution_mode:

- **AUTONOMOUS**: `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml`
- **INTERACTIVE**: `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml`

The YAML contains the full loop workflow: initialization, per-iteration parallel heterogeneous sweep + merge + convergence, synthesis, and memory save.

---

## 5. OUTPUT FORMATS

**Success:**
```
Deep context complete.
Iterations: [N] | Stop reason: [converged|max_iterations|blocked]
Artifacts: context/context-report.md (+ .json), [N] iteration files, coverage-graph (loop_type=context), continuity update in canonical spec docs refreshed
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
- `memory_context({ input: scope, intent: "understand" })` -- Load prior context for the scope
- Inject results into strategy.md "Known Context" section

### Code Context Bootstrap
- Use Code Graph (`code_graph_query`) to seed the frontier BEFORE the first sweep
- Query: 2-5 word concept descriptions from the scope -> ranked `SLICE` anchors (blast-radius / calls)
- Inject the seeded frontier into strategy.md alongside memory findings; fall back to Glob+Grep when the graph is stale

### After Completing
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
- Verify that the canonical save routed continuity into the expected packet doc (decision-record.md / implementation-summary.md / handover.md)

### Anchor Tags (Automatic)
`ANCHOR:deep-context-[scope]`, `ANCHOR:reuse-catalog`, `ANCHOR:convergence-report`

---

## 7. SKILL REFERENCE

Full protocol documentation: `.opencode/skills/deep-context/SKILL.md`

Key references:
- Loop protocol: `deep-context/references/loop_protocol.md`
- Convergence: `deep-context/references/convergence.md`
- Context Report template: `deep-context/assets/context_report_template.md`
- Config shape + default pool: `deep-context/assets/deep_context_config.json`

Shared runtime: `.opencode/skills/deep-loop-runtime/` (coverage-graph `loop_type='context'`, `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/fanout-run.cjs`, `lib/council/multi-seat-dispatch.cjs`).
Per-model prompt framing: `.opencode/skills/sk-prompt-small-model/`.

---

## 8. EXAMPLES

```
# Default heterogeneous pool (2 native + MiMo + gpt + deepseek, all sweeping the same scope)
/deep:start-context-loop:auto "WebSocket reconnection in the realtime client"
/deep:start-context-loop:confirm "notification template rendering pipeline"
/deep:start-context-loop:auto "checkout cart merge logic" --max-iterations 6 --convergence 0.10

# Native-only pool (two @deep-context Task subagents in a parallel batch)
/deep:start-context-loop:auto "auth session refresh" \
  --executor=native --label=native-a \
  --executor=native --label=native-b \
  --concurrency=2

# Custom heterogeneous pool (per-seat model + prompt framework)
/deep:start-context-loop:auto "rate limiter middleware" \
  --executor=native --label=native-a \
  --executor=cli-opencode --model=xiaomi-token-plan-ams/mimo-v2.5-pro --prompt-framework=costar --label=mimo \
  --executor=cli-codex --model=gpt-5.5 --reasoning-effort=high --label=gpt \
  --executor=cli-opencode --model=opencode-go/deepseek-v4-pro --prompt-framework=tidd-ec --label=deepseek \
  --concurrency=4

# Pool via JSON escape hatch
/deep:start-context-loop:auto "billing invoice generation" \
  --executors='[{"kind":"native","label":"native-a"},{"kind":"native","label":"native-b"},{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","label":"gpt"}]' \
  --concurrency=3
```

> **Note on the pool:** deep-context is **by-model-shared-scope** — every seat sweeps the SAME focus each iteration and agreement across executors is the confidence signal. This is the opposite of `deep-research`/`deep-review` fan-out, where lineages take disjoint slices. A 1-seat pool is legal but yields no agreement signal.

---

## 9. NEXT STEPS

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Context gathered, ready to plan | `/speckit:plan [feature]` | Consume the Context Report's reuse catalog + integration points + touch list |
| Context gathered, ready to implement | `/speckit:implement [spec-folder]` | Implement against the verified reuse map |
| Need outward/web research | `/deep:start-research-loop [topic]` | Knowledge discovery, not codebase mapping |
| Need a code/defect audit | `/deep:start-review-loop [target]` | Iterative code review |
| Want to refresh search support | `/memory:save [spec-folder]` | Refresh the indexed canonical spec document |

---

## 10. ERROR HANDLING

| Error | Action |
|-------|--------|
| A seat dispatch times out | Record the seat as failed for the iteration; merge the surviving seats (agreement degrades gracefully); retry the seat once next iteration |
| Whole sweep returns no seats | After 3 consecutive empty sweeps, halt and synthesize partial findings |
| Code graph unavailable | Fall back to Glob+Grep frontier seeding; label affected findings `unverified` |
| Provider not authenticated | Escalate (drop the seat or halt); never silently sweep with fewer executors than the agreement floor allows |
| Memory save failure | Save to `scratch/` as backup |

---

## 11. KEY DIFFERENCES (vs. siblings + one-shot context)

- **By-model shared scope**: all seats sweep the SAME focus each iteration (not disjoint slices) — agreement is the signal. `deep-research`/`deep-review` fan-out split work across lineages.
- **Parallel heterogeneous sweep**: native Task batch AND CLI pool start together and barrier-join — true 2-native + N-CLI parallelism per iteration.
- **Inward**: maps the codebase, not the web (`deep-research`) and not for defect finding (`deep-review`).
- Host-writes-state (Gate-3-safe): seats are READ-ONLY analyzers; the host merges and writes everything.
- Convergence is **relevance-gated coverage saturation** with **agreement** + **relevance** as blocking guards (not newInfoRatio, not severity).
- Ships **pointers, not source bodies** (consumer pulls bodies just-in-time) — avoids context rot.
- Does NOT proceed to planning or implementation; it feeds them.

---

## 12. COMMAND CHAIN

**Context path:** `/deep:start-context-loop` → `/speckit:plan` → `/speckit:implement`
**Research:** `/deep:start-research-loop` → `/speckit:plan` → `/speckit:implement`
**Review:** `/deep:start-review-loop` → (if issues) `/speckit:plan` → `/speckit:implement`
