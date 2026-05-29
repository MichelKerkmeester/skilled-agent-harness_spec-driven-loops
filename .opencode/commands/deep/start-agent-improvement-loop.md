---
description: "Evaluate and improve any agent: 5 dimensions, proposals, scoring, guarded promotion. :auto/:confirm."
argument-hint: "<agent_path> [:auto|:confirm] [--spec-folder=PATH] [--iterations=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

> **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load matching YAML workflow and execute
>
> This command is **general-agent based** — orchestrates deep-agent-improvement skill invocation.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate deep-agent-improvement invocation
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command orchestrates deep-agent-improvement skill          │
    │   │ invocation and runs general-agent based.            │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:start-agent-improvement-loop [arguments]                               │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: For `:confirm` or no suffix, the consolidated setup prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder or load prior context is allowed, then ask ALL questions immediately and wait.

For `:auto`, do not emit the consolidated prompt by default. Resolve setup with the three-tier branch below, then load the auto YAML only after all required values are bound.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{spec_folder}/improvement/agent-improvement-config.json` (shape: `targetPath`, `targetProfile`, `specFolder`, `executionMode: "auto"`, `scoringMode`, `maxIterations`, `agentName`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_folder`. **Ordering rule**: none needed; `target_path` absence is missing input, not ambiguity, and goes to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:start-agent-improvement-loop:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  lane: agent-improvement  # optional; one of: agent-improvement | model-benchmark; defaults to agent-improvement when an agent path is present
  target_path: .opencode/agents/debug.md  # required path matching .opencode/agents/*.md
  target_profile: dynamic  # optional; one of: handover | context-prime | dynamic; derived from target_path when omitted
  spec_folder: specs/041/008  # required spec folder path or explicit runtime folder
  execution_mode: AUTONOMOUS  # from :auto suffix
  scoring_mode: dynamic  # dynamic is the current supported scoring mode
  max_iterations: 5  # positive integer
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over $ARGUMENTS flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `lane` | Y | flag `--lane`, marker `lane`, agent-path presence -> `agent-improvement`, benchmark-profile or `--profile` arg -> `model-benchmark` | `agent-improvement` when an agent path is present | N |
| `target_path` | Y | `$ARGUMENTS` agent path, or marker `target_path` | none | N |
| `target_profile` | Y | marker `target_profile`, or auto-detect from `target_path` (`handover` -> `handover`, `context-prime` -> `context-prime`, otherwise `dynamic`) | inferred from `target_path` | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, or requires-ask | none | Y |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `scoring_mode` | Y | marker `scoring_mode`, Q3 equivalent, or default | `dynamic` | N |
| `max_iterations` | Y | flag `--iterations`, marker `max_iterations`, or default | `5` | N |

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction for setup.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

1B. RESOLVE lane BEFORE the agent-path check (additive; default is Lane A):
   ├─ IF $ARGUMENTS contains an agent path (.opencode/agents/*.md) OR --lane=agent-improvement OR marker lane=agent-improvement
   │     → lane = "agent-improvement", omit Q(lane), proceed exactly as today (Lane A)
   ├─ IF --lane=model-benchmark OR marker lane=model-benchmark OR a --profile arg / benchmark-profile is present
   │     → lane = "model-benchmark" → AUTO-ROUTE to the dedicated model-benchmark workflow:
   │         load .opencode/commands/deep/assets/deep_start-model-benchmark-loop_{auto,confirm}.yaml
   │         (see /deep:start-model-benchmark-loop). Subsequent questions become the Lane B set
   │         (profile, outputs/spec_folder, exec, scoring_method, grader, executor+model).
   │         DO NOT ask Q0/Q1/Q3 (the agent-improvement questions).
   └─ IF neither lane signal present AND interactive (no :auto)
         → include Q(lane) as the FIRST question in the consolidated prompt and resolve it before Q0.

2. CHECK if $ARGUMENTS contains an agent path (Lane A only; skipped when lane=model-benchmark):
   ├─ IF present (.opencode/agents/*.md) → target_path = detected value, omit Q0
   └─ IF missing → include Q0 in prompt

3. CHECK for --spec-folder flag:
   ├─ IF present → spec_folder = value, omit Q1
   └─ IF missing → include Q1 in prompt

4. CHECK for --iterations flag:
   ├─ IF present → max_iterations = value
   └─ IF missing → max_iterations = 5 (default)

5. List available agents for Q0:
   $ ls .opencode/agents/*.md

6. List recent spec folders for Q1:
   $ ls -d specs/*/ 2>/dev/null | tail -10

7. ASK user with SINGLE consolidated prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q(lane). Use Case** (only when lane is ambiguous: no agent    │
   │    path and no --lane flag):                                    │
   │    A) Improve an agent file (Lane A)                           │
   │    B) Benchmark a model / prompt framework (Lane B)            │
   │    (If A or an agent path was given, continue with Q0-Q3 below. │
   │     If B, this command auto-routes to                          │
   │     /deep:start-model-benchmark-loop and asks the Lane B set.)  │
   │                                                                │
   │ **Q0. Target Agent** (if not provided in command):             │
   │    Which agent would you like to evaluate and improve?         │
   │    [list agents found above]                                   │
   │                                                                │
   │ **Q1. Spec Folder** (if no --spec-folder flag):                 │
   │    A) Use existing spec folder: [list if found]                │
   │    B) Create new spec folder                                   │
   │    C) Use temporary directory                                  │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Autonomous — run loop without approval gates             │
   │    B) Interactive — confirm at each iteration                   │
   │                                                                │
   │ **Q3. Scoring Mode**:                                          │
   │    A) Dynamic — 5-dimension integration-aware (current release) │
   │                                                                │
   │ Reply format: "handover, A, A, A" or                           │
   │ ".opencode/agents/debug.md, B, B, A"                            │
   └────────────────────────────────────────────────────────────────┘

8. WAIT for user response (DO NOT PROCEED)

9. Parse response and store ALL results:
   - lane = [agent-improvement (Lane A) or model-benchmark (Lane B), resolved in step 1B / Q(lane)]
   - IF lane = model-benchmark → STOP this Lane A parse and HAND OFF to
     /deep:start-model-benchmark-loop using
     .opencode/commands/deep/assets/deep_start-model-benchmark-loop_{auto,confirm}.yaml;
     the Lane B set (profile, outputs/spec_folder, exec, scoring_method, grader, executor+model)
     replaces the fields below.
   - target_path = [from Q0 or $ARGUMENTS]
   - target_profile = [derived dynamic profile for the selected target]
   - spec_folder = [from Q1 or --spec-folder]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - scoring_mode = [dynamic from Q3]
   - max_iterations = [from --iterations or default 5]

10. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER infer target agent from context, screenshots, or conversation history
⛔ NEVER auto-select spec folder without user confirmation
⛔ NEVER split these questions into multiple prompts
⛔ NEVER assume what the user wants based on open files or recent activity
```

**Phase Output:**
- `general_agent_verified = ________________`
- `lane = ________________`
- `target_path = ________________`
- `target_profile = ________________`
- `spec_folder = ________________`
- `execution_mode = ________________`
- `scoring_mode = ________________`
- `max_iterations = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                  |
| ---------------------- | ------------- | ---------- | ----------------------- |
| general_agent_verified | ✅ Yes         | ______     | Automatic check         |
| lane                   | ✅ Yes         | ______     | Step 1B / Q(lane)       |
| target_path            | ✅ Yes         | ______     | Q0 or $ARGUMENTS        |
| target_profile         | ✅ Yes         | ______     | Derived from target rules |
| spec_folder            | ✅ Yes         | ______     | Q1 or --spec-folder     |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q2            |
| scoring_mode           | ✅ Yes         | ______     | Q3                      |
| max_iterations         | ✅ Yes         | ______     | --iterations or 5       |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **DO NOT** infer target agent from context, screenshots, or conversation history
- **DO NOT** start the loop without all setup values resolved
- **FIRST ACTION** is always: run Phase 0, run Setup, then load YAML workflow

---

# Improve Agent

Evaluate and improve any agent across 5 integration-aware dimensions. The skill scans all surfaces the agent touches, derives a scoring profile from the agent's own rules, writes packet-local candidates, scores them deterministically, and only allows promotion when evidence and approval gates are satisfied.

---

## 1. PURPOSE

Run a bounded evaluator-first loop that:
1. Scans the target agent's full integration surface (mirrors, commands, YAML workflows, skills)
2. Generates a dynamic scoring profile from the agent's own ALWAYS/NEVER/ESCALATE IF rules
3. Proposes packet-local candidates without mutating the canonical target
4. Scores candidates across 5 weighted dimensions (structural, ruleCoherence, integration, outputQuality, systemFitness)
5. Runs fixture benchmarks against target-specific test sets
6. Reduces evidence into a dimensional dashboard with convergence detection (per SKILL canonical stopReason enum: converged | maxIterationsReached | blockedStop | manualStop | error | stuckRecovery)
7. Stops on canonical stopReason: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, or `stuckRecovery`

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — agent path, optional mode suffix, optional spec folder, optional iteration count
**Outputs:** improvement packet state under `{spec_folder}/improvement/` + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 5-DIMENSION REFERENCE

| Dimension | Weight | What It Measures |
| --- | --- | --- |
| Structural Integrity | 0.20 | Agent template compliance (required sections) |
| Rule Coherence | 0.25 | ALWAYS/NEVER rules align with workflow steps |
| Integration Consistency | 0.25 | Mirrors in sync, commands reference agent, skills reference agent |
| Output Quality | 0.15 | Output verification items present, no placeholder content |
| System Fitness | 0.15 | Permission-capability alignment, resource references valid |

### Scoring Modes

| Mode | Flag | Profiles | Use When |
| --- | --- | --- | --- |
| Dynamic | `--dynamic` | Any agent (generated on-the-fly) | Evaluating arbitrary agents, integration health checks |

---

## 4. WORKFLOW STEPS

### Step 1: Load deep-agent-improvement Skill

```
Read(".opencode/skills/deep-agent-improvement/SKILL.md")
```

### Step 2: Run Integration Scan

```bash
node .opencode/skills/deep-agent-improvement/scripts/scan-integration.cjs --agent={agent_name} --output={spec_folder}/improvement/integration-report.json
```

Review the integration report: mirror sync status, command coverage, skill references.

### Step 3: Generate Profile

```bash
node .opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs --agent={target_path} --output={spec_folder}/improvement/dynamic-profile.json
```

### Step 4: Initialize Runtime

Create the improvement directory structure and copy templates:
```bash
mkdir -p {spec_folder}/improvement/candidates {spec_folder}/improvement/benchmark-outputs
```
Copy config, strategy, charter, and manifest from skill assets into runtime root.

### Step 5: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/deep_start-agent-improvement-loop_auto.yaml`
- **INTERACTIVE** -> `assets/deep_start-agent-improvement-loop_confirm.yaml`

Execute the YAML workflow step by step. Each iteration:
1. Scan integration surfaces (refresh)
2. Dispatch `@deep-agent-improvement` to write one bounded candidate
3. Score candidate with the dynamic 5-dimension profile
4. Run benchmark fixtures
5. Append results to JSONL ledger
6. Reduce state, refresh dashboard
7. Check stop conditions (converged via legal-stop bundle, maxIterationsReached, blockedStop, manualStop, error, stuckRecovery)

### Step 6: Review Results

After loop exits, present:
- `{spec_folder}/improvement/agent-improvement-dashboard.md` — dimensional progress + stop status
- `{spec_folder}/improvement/experiment-registry.json` — per-profile metrics + best-known state
- Recommendation: continue, promote (if eligible), or stop

### Step 6B: Journal Emission

At each journal boundary, the orchestrator MUST emit events via `improvement-journal.cjs`. The CLI entrypoint accepts `--emit`, `--journal`, and `--details`:

```bash
# At session start:
node .opencode/skills/deep-agent-improvement/scripts/improvement-journal.cjs --emit session_start --journal specs/042/008/improvement/improvement-journal.jsonl --details '{"sessionId":"imp-2026-04-11T12-00-00Z","target":"deep-research","charter":"...","startedAt":"2026-04-11T12:00:00Z"}'

# At iteration boundaries:
# candidate_generated after the candidate is written
# candidate_scored after scoring completes
# gate_evaluation after stop-check or operator-gate evaluation
# The CLI form carries boundary metadata inside details because the helper's CLI does not expose top-level iteration/candidate fields.

# At session end:
# node .opencode/skills/deep-agent-improvement/scripts/improvement-journal.cjs --emit session_end --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{"stopReason":"blockedStop","sessionOutcome":"advisoryOnly","endedAt":"2026-04-11T12:05:00Z","totalIterations":3}'
```

### Step 6C: Stop-Reason Reporting

After loop exits, classify the termination:

**stopReason** (WHY):
- `converged` — All legal-stop gate bundles passed
- `maxIterationsReached` — Hit `max_iterations` limit
- `blockedStop` — Convergence math triggered but gate bundles failed
- `manualStop` — User cancelled
- `error` — Script or infra failure
- `stuckRecovery` — Stuck detection triggered and recovery exhausted

**sessionOutcome** (WHAT):
- `keptBaseline` — Baseline retained
- `promoted` — Candidate promoted to canonical target
- `rolledBack` — Promotion reversed
- `advisoryOnly` — Assessment only, no mutation

### Step 6D: Session Boundary (current release)

`/deep:start-agent-improvement-loop` is one-session-only in the current release. Every invocation starts a fresh `new`-mode session with generation 1, writes a new journal, and evaluates candidates from iteration 1 for that session.

Do **not** document or attempt journal replay, iteration carry-forward, or `resume`/`restart`/`fork`/`completed-continue` behavior here. Those lineage modes were described in earlier drafts but have no shipped runtime wiring; see `.opencode/skills/deep-agent-improvement/SKILL.md §Resume/Continuation Semantics (current release)` for the canonical retraction.

### Step 7: Return Status

- Completed normally: `STATUS=OK ITERATIONS={N} BEST_SCORE={score}`
- User cancelled: `STATUS=CANCELLED`
- Max iterations: `STATUS=OK REASON="max_iterations_reached"`
- Converged: `STATUS=OK REASON="converged"` (when all 5 legal-stop gates pass)
- Error: `STATUS=FAIL ERROR="{message}"`

---

## 5. EXAMPLES

### Evaluate Handover Agent (Interactive)

```
/deep:start-agent-improvement-loop ".opencode/agents/debug.md" :confirm --spec-folder=specs/041/008
```

### Evaluate Any Agent (Dynamic Profile, Autonomous)

```
/deep:start-agent-improvement-loop ".opencode/agents/debug.md" :auto --iterations=3
```

### Quick Integration Health Check

```
/deep:start-agent-improvement-loop ".opencode/agents/review.md" :auto --iterations=1
```

### Prompt for Target Selection

```
/deep:start-agent-improvement-loop :confirm
```
Setup phase lists available agents and asks for selection.

---

## 6. EXAMPLE OUTPUT

```
Agent Improvement Loop Complete
────────────────────────────────

Target: .opencode/agents/debug.md
Profile: generated dynamic profile
Scoring: 5-dimension dynamic
Iterations: 3

Dimensional Scores (final):
  Structural:    100 (best: 100, trend: ->)
  Rule Coherence: 95 (best: 95, trend: ->)
  Integration:   100 (best: 100, trend: ->)
  Output Quality:  90 (best: 95, trend: down)
  System Fitness: 100 (best: 100, trend: ->)

Weighted Score: 97/100
Stop Reason: converged (all 5 legal-stop gates passed) after 3 iterations

Artifacts:
  Dashboard: specs/041/008/improvement/agent-improvement-dashboard.md
  Registry:  specs/041/008/improvement/experiment-registry.json
  Candidates: 3 written to specs/041/008/improvement/candidates/

STATUS=OK ITERATIONS=3 BEST_SCORE=97 REASON="converged"
```

---

## 7. NOTES

- **Skill dependency**: Requires `deep-agent-improvement` at `.opencode/skills/deep-agent-improvement/`
- **Promotion**: Promotion remains guarded by evidence, repeatability, and operator approval.
- **Scoring**: All 5 dimensions are deterministic (regex, string matching, file existence). No LLM-as-judge.
- **Stop rules**: Loop stops on `converged` (legal-stop bundle pass + stable trajectory), max iterations, or infra failure threshold.
- **Runtime parity**: Agent exists across 4 runtimes (.opencode, .claude, .gemini, .codex). Scanner checks all (`.gemini/agents/` path corrected in 060/002).
- **Benchmark assets** (post-060/005): static at `.opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json` + `assets/model-benchmark/benchmark-fixtures/*.json`. Materializer at `.opencode/skills/deep-agent-improvement/scripts/materialize-benchmark-fixtures.cjs` writes fixture markdown to `{spec_folder}/improvement/benchmark-outputs/` before `run-benchmark.cjs` consumes them. `benchmark_completed` event is gated on `report.json` existing.
- **Legal-stop emission** (post-060/005): YAML emits nested `legal_stop_evaluated.details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}` matching the reducer consumer shape. Flat `gateResult/gateName` is retired.
- **Stop-reason enum** (post-060/005): canonical values are `converged | maxIterationsReached | blockedStop | manualStop | error | stuckRecovery`. Old `plateau`/`benchmarkPlateau` retired.
- **CRITIC PASS verbatim emission** (post-060/006): `@deep-agent-improvement` body now mandates the 6 challenge labels appear verbatim in candidate JSON `critic_pass` field. Reviewers and stress tests grep for the exact strings.

---

## 8. MODEL-BENCHMARK MODE (LANE B)

This command is the **Lane A** (agent-improvement) entry point. The underlying `deep-agent-improvement` skill ALSO supports a separate **model-benchmark** mode (Lane B) that benchmarks a model or prompt framework instead of mutating an agent file. It shares the candidate, dispatcher, and scorer seams with the agent-improvement path.

**Lane B now has its own command: `/deep:start-model-benchmark-loop`.** When this command resolves `lane=model-benchmark` (via `--lane=model-benchmark`, a `--profile` / benchmark-profile arg, or the Q(lane) answer), it auto-routes to that dedicated command and loads `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_{auto,confirm}.yaml` instead of the agent-improvement YAMLs. When an agent path is supplied (the normal Lane A invocation) the lane resolves to `agent-improvement` automatically and this command runs exactly as before.

- **Entry point**: `scripts/loop-host.cjs` resolves `--mode`. Default or `--mode=agent-improvement` routes to `scripts/score-candidate.cjs` (this command's path, unchanged). `--mode=model-benchmark` runs `scripts/materialize-benchmark-fixtures.cjs` then `scripts/run-benchmark.cjs`. An unknown mode warns to stderr and falls back to agent-improvement.
- **Dispatcher**: `scripts/dispatch-model.cjs` is the model-agnostic dispatcher (executor routing across cli-opencode, cli-claude-code, cli-codex, cli-gemini, cli-devin). It loads only on the model-benchmark path, never in agent-improvement mode.
- **Scorer selection**: `run-benchmark.cjs --scorer pattern` (default) uses the byte-identical heading/pattern matcher. `--scorer 5dim` routes materialized outputs through `scripts/scorer/score-model-variant.cjs` (the ported 120/003 five-dimension scorer: deterministic checks plus a pluggable grader). `--grader noop` (default) stays deterministic with no model dispatch; `--grader mock` or `--grader llm` select the stub or real grader.
- **Records**: every state record carries `mode: agent-improvement` or `mode: model-benchmark`. Benchmark reports and `benchmark_run` records carry `scoringMethod: pattern|5dim` for downstream attribution.
- **Hardening env gates**: `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in the 5-dim scorer, and `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the on-disk cache. Both default permissive for backward compatibility.

Canonical source of truth: `.opencode/skills/deep-agent-improvement/SKILL.md` "Mode 4: Model-Benchmark". Provenance: built in spec 121/003, remediated in 121/004, opt-in scorer and docs in 121/005.

---

## 9. RELATED COMMANDS

| Command | Purpose |
| --- | --- |
| `/deep:start-model-benchmark-loop` | Lane B: benchmark a model or prompt framework (auto-routed from here when `--lane=model-benchmark`) |
| `/speckit:complete` | Full spec-driven development workflow |
| `/prompt` | Improve AI prompts with DEPTH + CLEAR scoring |
| `/deep:start-review-loop` | Iterative code review with convergence detection |

---

## 10. VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed workflow without @general agent verification
- Started executing steps before all Setup Phase fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Inferred target agent from context, screenshots, or conversation history
- Auto-selected spec folder without user confirmation

**Workflow Violations (Steps 1-7):**
- Skipped integration scan before candidate generation
- Loaded wrong YAML workflow for execution mode
- Dispatched agents from this markdown command body (YAML owns loop execution)
- Claimed a target-specific promotion carve-out that is not part of the current release contract
- Modified canonical agent file directly instead of writing packet-local candidate

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately
2. STATE: "I [specific violation]. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set

FOR WORKFLOW VIOLATIONS:
1. STOP immediately
2. STATE: "I skipped STEP [X] by [specific action]. Correcting now."
3. RETURN to the skipped step
4. COMPLETE all activities for that step
5. CONTINUE to next step in sequence
```

**If ANY violation:** STOP -> State violation -> Return to correct step -> Complete properly
