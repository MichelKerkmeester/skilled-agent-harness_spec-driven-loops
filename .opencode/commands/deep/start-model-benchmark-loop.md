---
description: "Benchmark a model or prompt framework: fixtures, pattern or 5dim scoring, deterministic or graded runs. :auto/:confirm."
argument-hint: "<profile_path> [:auto|:confirm] [--spec-folder=PATH] [--scorer=pattern|5dim] [--grader=noop|mock|llm] [--executor=NAME --model=NAME] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

> **EXECUTION PROTOCOL - READ FIRST**
>
> This command runs a structured workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load matching YAML workflow and execute
>
> This command is **general-agent based** - orchestrates deep-agent-improvement skill invocation in model-benchmark mode.
> This command is the dedicated Lane B entry. It sets `lane = model-benchmark` directly. It does NOT ask a lane question.

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
    │   │ invocation in model-benchmark mode and runs general-agent based. │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:start-model-benchmark-loop [arguments]                               │
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

This command fixes `lane = model-benchmark`. There is no lane question. The lane is implied by the command name.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 - Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist a config record under `{spec_folder}/improvement/model-benchmark-config.json` (shape: `lane: "model-benchmark"`, `profilePath`, `specFolder`, `outputsDir`, `executionMode: "auto"`, `scoringMethod`, `grader`, optional `executor`, optional `model`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml`. End §0.

2. **Tier 2 - Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_folder`. **Ordering rule**: none needed. `profile_path` absence is not ambiguity because it has a default, and `executor`/`model` are only required when `grader = llm`.

3. **Tier 3 - Fail fast** (contract §4): emit the named-missing-inputs error format with `/deep:start-model-benchmark-loop:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged - see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  profile_path: .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json  # optional; default profile when omitted
  spec_folder: specs/121/008  # required spec folder path or explicit runtime folder
  execution_mode: AUTONOMOUS  # from :auto suffix
  scoring_method: pattern  # pattern (default) or 5dim
  grader: noop  # noop (default) | mock | llm
  executor: cli-codex  # required only when grader = llm; one of cli-opencode | cli-claude-code | cli-codex | cli-gemini | cli-devin
  model: gpt-5.5  # required only when grader = llm; model id for the chosen executor
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default, marker fields take precedence over $ARGUMENTS flags, unknown fields warn, malformed lines parse-error). When `grader != llm`, any `executor`/`model` marker fields are ignored with a warning.

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `lane` | Y | fixed by command | `model-benchmark` | N |
| `profile_path` | Y | `$ARGUMENTS` profile path, or marker `profile_path` | `.opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json` | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, or requires-ask | none | Y |
| `outputs_dir` | Y | derived from `spec_folder` | `{spec_folder}/improvement/benchmark-outputs` | N |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `scoring_method` | Y | flag `--scorer`, marker `scoring_method`, Q3 equivalent, or default | `pattern` | N |
| `grader` | Y | flag `--grader`, marker `grader`, Q4 equivalent, or default | `noop` | N |
| `executor` | Conditional | flag `--executor`, marker `executor`, required only when `grader = llm` | none | N |
| `model` | Conditional | flag `--model`, marker `model`, required only when `grader = llm` | none | N |

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

**Round-trip optimization:** This workflow requires only 1 user interaction for setup.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. SET lane = "model-benchmark" (fixed by this command, never asked).

2. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

3. CHECK if $ARGUMENTS contains a profile path:
   ├─ IF present (a *.json benchmark profile) → profile_path = detected value, omit Q0
   └─ IF missing → Q0 offered with the default profile pre-selected

4. CHECK for --spec-folder flag:
   ├─ IF present → spec_folder = value, omit Q1
   └─ IF missing → include Q1 in prompt

5. CHECK for --scorer / --grader flags:
   ├─ IF --scorer present → scoring_method = value, omit Q3
   ├─ IF --grader present → grader = value, omit Q4
   └─ IF missing → scoring_method = pattern (default), grader = noop (default)

6. List available benchmark profiles for Q0:
   $ ls .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/*.json

7. List recent spec folders for Q1:
   $ ls -d specs/*/ 2>/dev/null | tail -10

8. ASK user with SINGLE consolidated prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Benchmark Profile** (if not provided in command):        │
   │    Which benchmark profile should drive the fixtures?          │
   │    A) Default - assets/model-benchmark/benchmark-profiles/default.json │
   │    B) Other - paste a profile path                              │
   │                                                                │
   │ **Q1. Spec Folder** (if no --spec-folder flag):                 │
   │    A) Use existing spec folder: [list if found]                │
   │    B) Create new spec folder                                   │
   │    C) Use temporary directory                                  │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Autonomous - run loop without approval gates             │
   │    B) Interactive - confirm at each iteration                   │
   │                                                                │
   │ **Q3. Scoring Method**:                                        │
   │    A) Pattern - heading/pattern matcher (default, fastest)      │
   │    B) 5dim - ported 5-dimension scorer (deterministic + grader) │
   │                                                                │
   │ **Q4. Grader**:                                                │
   │    A) noop - deterministic, no model dispatch (default)         │
   │    B) mock - stub grader                                        │
   │    C) llm - real model dispatch (requires Q5)                   │
   │                                                                │
   │ **Q5. Executor + Model** (ONLY if Q4 = llm):                    │
   │    Which executor and model? e.g. "cli-codex, gpt-5.5"          │
   │    Executors: cli-opencode | cli-claude-code | cli-codex |      │
   │               cli-gemini | cli-devin                            │
   │                                                                │
   │ Reply format: "A, A, A, A, A" or                               │
   │ "default, B, B, B, C, cli-codex gpt-5.5"                        │
   └────────────────────────────────────────────────────────────────┘

9. WAIT for user response (DO NOT PROCEED)

10. Parse response and store ALL results:
   - lane = "model-benchmark" (fixed)
   - profile_path = [from Q0 or $ARGUMENTS or default profile]
   - spec_folder = [from Q1 or --spec-folder]
   - outputs_dir = [{spec_folder}/improvement/benchmark-outputs]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - scoring_method = [pattern or 5dim from Q3 or --scorer]
   - grader = [noop/mock/llm from Q4 or --grader]
   - executor = [from Q5, only when grader = llm]
   - model = [from Q5, only when grader = llm]

11. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER ask a lane question - this command IS the model-benchmark entry
⛔ NEVER infer the profile from context, screenshots, or conversation history
⛔ NEVER auto-select spec folder without user confirmation
⛔ NEVER request executor/model when grader is not llm
⛔ NEVER split these questions into multiple prompts
⛔ NEVER assume what the user wants based on open files or recent activity
```

**Phase Output:**
- `general_agent_verified = ________________`
- `lane = model-benchmark`
- `profile_path = ________________`
- `spec_folder = ________________`
- `outputs_dir = ________________`
- `execution_mode = ________________`
- `scoring_method = ________________`
- `grader = ________________`
- `executor = ________________` (only when grader = llm)
- `model = ________________` (only when grader = llm)

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED      | YOUR VALUE | SOURCE                  |
| ---------------------- | ------------- | ---------- | ----------------------- |
| general_agent_verified | ✅ Yes         | ______     | Automatic check         |
| lane                   | ✅ Yes         | model-benchmark | Fixed by command   |
| profile_path           | ✅ Yes         | ______     | Q0, $ARGUMENTS, or default |
| spec_folder            | ✅ Yes         | ______     | Q1 or --spec-folder     |
| outputs_dir            | ✅ Yes         | ______     | Derived from spec_folder |
| execution_mode         | ✅ Yes         | ______     | Suffix or Q2            |
| scoring_method         | ✅ Yes         | ______     | Q3 or --scorer          |
| grader                 | ✅ Yes         | ______     | Q4 or --grader          |
| executor               | Conditional   | ______     | Q5 (only when grader=llm) |
| model                  | Conditional   | ______     | Q5 (only when grader=llm) |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ grader == llm AND (executor missing OR model missing)?
│   │   └─ Re-prompt Q5 only
│   ├─ YES → Proceed to "INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **DO NOT** ask a lane question - this command fixes `lane = model-benchmark`
- **DO NOT** infer the benchmark profile from context, screenshots, or conversation history
- **DO NOT** request executor/model unless `grader = llm`
- **DO NOT** start the loop without all setup values resolved
- **FIRST ACTION** is always: run Phase 0, run Setup, then load YAML workflow

---

# Benchmark Model or Prompt Framework

Benchmark a model or prompt framework against a fixture profile. The skill materializes benchmark fixtures into packet-local outputs, scores them with the pattern matcher or the ported 5-dimension scorer, records mode-aware state, and never mutates a canonical agent file.

---

## 1. PURPOSE

Run a bounded model-benchmark loop that:
1. Resolves the benchmark profile (default profile or an explicit profile path)
2. Materializes the profile's fixtures into packet-local markdown outputs
3. Runs the fixtures against those outputs with the selected scorer (`pattern` or `5dim`)
4. Selects a grader for the 5-dimension path (`noop` deterministic, `mock` stub, or `llm` real dispatch)
5. Records mode-aware state where every record carries `mode: model-benchmark` and every benchmark report carries `scoringMethod: pattern|5dim`
6. Reduces evidence into a benchmark report and presents the result
7. Stops on max iterations, convergence, or infra failure

This command drives the model-benchmark lane only. To improve an agent definition, use `/deep:start-agent-improvement-loop` (the agent-improvement lane).

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` - optional profile path, optional mode suffix, optional spec folder, optional scorer/grader flags, optional executor+model (only with `--grader=llm`)
**Outputs:** benchmark packet state under `{spec_folder}/improvement/benchmark-outputs/` + `STATUS=<OK|FAIL|CANCELLED>`

### Lane B Runtime Contract

The model-benchmark loop runs through `loop-host.cjs` in model-benchmark mode:

```bash
node .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs \
  --mode=model-benchmark \
  --profile {profile_path} \
  --outputs-dir {outputs_dir} \
  --scorer {scoring_method} \
  --grader {grader}
```

- `loop-host.cjs` resolves `--mode=model-benchmark`, then runs `materialize-benchmark-fixtures.cjs` and `run-benchmark.cjs` in that order (the EC-5 ordering: materialize MUST run and succeed before run-benchmark, or scoring has no inputs).
- `--profile` and `--outputs-dir` are required for the model-benchmark path. `loop-host.cjs` forwards `--output`, `--state-log`, `--label`, and `--profiles-dir` through to `run-benchmark.cjs`.
- `--scorer pattern` (default, heading/pattern matcher) or `--scorer 5dim` (ported 5-dimension scorer via `scripts/model-benchmark/scorer/score-model-variant.cjs`). `--scorer` and `--grader` are consumed at the `run-benchmark.cjs` layer.
- `--grader noop` (default, deterministic, no model dispatch) or `--grader mock` (stub) or `--grader llm` (real model dispatch).
- An unknown `--mode` warns to stderr and falls back to agent-improvement. An unknown `--scorer` warns and falls back to `pattern`.

### Default Profile and Fixtures

- Default profile: `.opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json`
- Fixtures: `.opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-fixtures/` (`fixture-baseline`, `fixture-improved`, `fixture-edge`)

### User Input

```text
$ARGUMENTS
```

---

## 3. SCORING AND GRADER REFERENCE

### Scorers

| Scorer | Flag | What It Does | Use When |
| --- | --- | --- | --- |
| Pattern | `--scorer pattern` | Byte-identical heading/pattern matcher (default) | Fast deterministic structural benchmarking |
| 5dim | `--scorer 5dim` | Ported 5-dimension scorer (`scripts/model-benchmark/scorer/score-model-variant.cjs`) with deterministic checks plus a pluggable grader | Richer multi-dimension evaluation of produced outputs |

### Graders (5-dimension path)

| Grader | Flag | Behavior |
| --- | --- | --- |
| noop | `--grader noop` | Deterministic, no model dispatch (default) |
| mock | `--grader mock` | Stub grader for wiring and tests |
| llm | `--grader llm` | Real model dispatch via `dispatch-model.cjs`, requires an executor + model |

### Executor Routing (only on `--grader llm`)

`dispatch-model.cjs` is the executor router. It is loaded only on the model-benchmark path and only when `grader = llm`. Supported executors: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-devin`.

### Hardening Env Gates

- `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in the 5-dim scorer.
- `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the on-disk cache.
- Both default to the permissive value for backward compatibility.

---

## 4. WORKFLOW STEPS

### Step 1: Load deep-agent-improvement Skill

```
Read(".opencode/skills/deep-agent-improvement/SKILL.md")
```

Focus on Mode 4: Model-Benchmark for the canonical contract.

### Step 2: Resolve Profile

Confirm `profile_path` exists. When the user did not supply one, use the default profile:
```bash
ls .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json
```

### Step 3: Initialize Runtime

Create the benchmark output directory:
```bash
mkdir -p {spec_folder}/improvement/benchmark-outputs
```
Persist the config record to `{spec_folder}/improvement/model-benchmark-config.json` (`lane`, `profilePath`, `specFolder`, `outputsDir`, `executionMode`, `scoringMethod`, `grader`, optional `executor`, optional `model`).

### Step 4: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/deep_start-model-benchmark-loop_auto.yaml`
- **INTERACTIVE** -> `assets/deep_start-model-benchmark-loop_confirm.yaml`

Execute the YAML workflow step by step. Each iteration:
1. Materialize benchmark fixtures into packet-local markdown outputs (`materialize-benchmark-fixtures.cjs`)
2. Run the fixtures with the selected scorer and grader (`run-benchmark.cjs`)
3. Record mode-aware state where each record carries `mode: model-benchmark` and the report carries `scoringMethod: pattern|5dim`
4. Reduce state and refresh the benchmark report
5. Check stop conditions (converged, maxIterationsReached, blockedStop, manualStop, error, stuckRecovery)

The orchestrator never runs `materialize` and `run-benchmark` out of order. `loop-host.cjs` enforces materialize-before-benchmark (EC-5).

### Step 5: Review Results

After the loop exits, present:
- `{spec_folder}/improvement/benchmark-outputs/report.json` - fixture scores, aggregate, `scoringMethod`
- Per-fixture pass/fail against the profile thresholds (`requiredAggregateScore`, `minimumFixtureScore`)
- Recommendation: continue, promote (if eligible), or stop

### Step 6: Promotion (mode-aware, optional)

Promotion is guarded and mode-aware. When evidence and approval allow it:
```bash
node .opencode/skills/deep-agent-improvement/scripts/shared/promote-candidate.cjs --benchmark-report {spec_folder}/improvement/benchmark-outputs/report.json ...
```
Promotion stays guarded by evidence, repeatability, and operator approval. It refuses to act while the runtime config is still proposal-only.

### Step 7: Return Status

- Completed normally: `STATUS=OK SCORING={scoring_method} GRADER={grader} AGGREGATE={score}`
- User cancelled: `STATUS=CANCELLED`
- Max iterations: `STATUS=OK REASON="max_iterations_reached"`
- Converged: `STATUS=OK REASON="converged"`
- Error: `STATUS=FAIL ERROR="{message}"`

---

## 5. EXAMPLES

### Default Profile, Pattern Scorer (Autonomous)

```
/deep:start-model-benchmark-loop :auto --spec-folder=specs/121/008
```
Uses the default profile, `--scorer pattern`, `--grader noop`.

### Explicit Profile, 5-Dimension Scorer (Interactive)

```
/deep:start-model-benchmark-loop ".opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json" :confirm --scorer=5dim
```
Setup asks the remaining questions. Grader stays `noop` unless changed.

### 5-Dimension Scorer with Real Model Dispatch

```
/deep:start-model-benchmark-loop :auto --spec-folder=specs/121/008 --scorer=5dim --grader=llm --executor=cli-codex --model=gpt-5.5
```
Routes graded scoring through `dispatch-model.cjs` to the named executor and model.

### Prompt for Setup

```
/deep:start-model-benchmark-loop :confirm
```
Setup phase lists available profiles, defaults the profile to `default.json`, and asks for spec folder, scorer, and grader.

---

## 6. EXAMPLE OUTPUT

```
Model Benchmark Loop Complete
─────────────────────────────

Profile: .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json
Scoring: pattern
Grader:  noop
Mode:    model-benchmark

Fixture Scores:
  fixture-baseline: 82 (pass)
  fixture-improved: 91 (pass)
  fixture-edge:     74 (pass, >= minimumFixtureScore 70)

Aggregate Score: 82 (>= requiredAggregateScore 80)
scoringMethod: pattern
Stop Reason: converged

Artifacts:
  Report: specs/121/008/improvement/benchmark-outputs/report.json
  Outputs: specs/121/008/improvement/benchmark-outputs/

STATUS=OK SCORING=pattern GRADER=noop AGGREGATE=82 REASON="converged"
```

---

## 7. NOTES

- **Skill dependency**: Requires `deep-agent-improvement` at `.opencode/skills/deep-agent-improvement/`
- **Lane**: This command fixes `lane = model-benchmark`. It never mutates a canonical agent file. Use `/deep:start-agent-improvement-loop` for the agent-improvement lane.
- **Entry point**: `scripts/shared/loop-host.cjs --mode=model-benchmark` runs `materialize-benchmark-fixtures.cjs` then `run-benchmark.cjs` in that order. Required flags: `--profile`, `--outputs-dir`.
- **Scorer default**: `--scorer pattern` keeps the byte-identical heading/pattern matcher. `--scorer 5dim` is opt-in and lazily loads `scripts/model-benchmark/scorer/score-model-variant.cjs`.
- **Grader default**: `--grader noop` stays deterministic with no model dispatch. `--grader llm` is the only grader that loads `dispatch-model.cjs`.
- **Mode-aware records**: every state record carries `mode: model-benchmark` and benchmark reports carry `scoringMethod: pattern|5dim` for downstream attribution.
- **Promotion**: `promote-candidate.cjs` is mode-aware and stays guarded by evidence, repeatability, and operator approval.
- **Provenance**: model-benchmark mode built in spec 121/003, remediated in 121/004, opt-in scorer and docs in 121/005, command entry in 121/008. Canonical source of truth: `.opencode/skills/deep-agent-improvement/SKILL.md` "Mode 4: Model-Benchmark".

---

## 8. RELATED COMMANDS

| Command | Purpose |
| --- | --- |
| `/deep:start-agent-improvement-loop` | Improve an agent definition (agent-improvement lane) |
| `/speckit:complete` | Full spec-driven development workflow |
| `/prompt` | Improve AI prompts with DEPTH + CLEAR scoring |
| `/deep:start-review-loop` | Iterative code review with convergence detection |

---

## 9. VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Executed workflow without @general agent verification
- Started executing steps before all Setup Phase fields are set
- Asked a lane question instead of fixing `lane = model-benchmark`
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Inferred the benchmark profile from context, screenshots, or conversation history
- Requested executor/model when `grader` is not `llm`
- Auto-selected spec folder without user confirmation

**Workflow Violations (Steps 1-7):**
- Ran `run-benchmark.cjs` before `materialize-benchmark-fixtures.cjs` (EC-5 ordering)
- Loaded wrong YAML workflow for execution mode
- Loaded the agent-improvement YAML for this model-benchmark command
- Dispatched agents from this markdown command body (YAML owns loop execution)
- Loaded `dispatch-model.cjs` outside the `--grader llm` path
- Mutated a canonical agent file (this lane never mutates agent definitions)

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
