---
title: "Deep Council"
description: Multi-topic deep-ai-council session loop with adjudicator-verdict stability. Modes :auto, :confirm.
argument-hint: "<deliberation-topic|topics> [:auto|:confirm] [--max-rounds-per-topic=N] [--max-topics=N] [--saturation=N] [--convergence=N] [--spec-folder=PATH] (:auto supports PRE-BOUND SETUP ANSWERS)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query, code_graph_context
---

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
> Under `:auto`, setup follows the three-tier resolution contract in Section 0: resolve confidently, ask only targeted ambiguity questions, then fail fast if required inputs remain unresolved. Under `:confirm`, setup keeps the consolidated interactive question block.
>
> **YOUR FIRST ACTION (two HARD-BLOCK gates — do them in order, skip neither):**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run the Unified Setup Phase (BLOCKED gate) in this Markdown entrypoint and resolve:
>    - `deliberation_topic` or `topics`
>    - `max_rounds_per_topic`
>    - `max_topics_per_session`
>    - `saturation_threshold`
>    - `convergenceThreshold`
>    - `executor.*`
>    - `spec_folder`
>    - `execution_mode`
> 3. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `assets/deep_ask-ai-council_auto.yaml`
>    - Confirm: `assets/deep_ask-ai-council_confirm.yaml`
> 4. Execute the YAML workflow step by step using those resolved values.
>
> This command is **general-agent based** — it orchestrates the deep-ai-council session. Gate 1 (@general verification) and Gate 2 (the BLOCKED Unified Setup Phase) below are HARD BLOCKS; neither may be skipped.
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You can orchestrate the deep-ai-council session (YAML workflow execution)
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
    │   │ This command orchestrates the deep-ai-council session and  │
    │   │ runs general-agent based.                                  │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:ask-ai-council [arguments]                         │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `deliberation_topic` or `topics`
  - `max_rounds_per_topic`
  - `max_topics_per_session`
  - `saturation_threshold`
  - `convergenceThreshold`
  - `executor.*`
  - `spec_folder`
  - `execution_mode`
- **PLANNING BOUNDARY**: deep council writes packet-local `ai-council/**` artifacts only. Implementation remains with the caller or follow-on implementation agents.
- **GRAPH BOUNDARY**: derived council graph replay uses `deep-loop-runtime` CLI scripts with `--loop-type council`; `ai-council/**` artifacts remain authoritative.
- **ONE CLI PER ROUND**: all seats in a round use one executor boundary. Different CLIs are separate rounds, not mixed seats.

> **Canonical mode syntax:** use attached command suffixes (`/deep:ask-ai-council:auto`, `/deep:ask-ai-council:confirm`) and keep AGENTS, skills, command references, and runtime mirrors synchronized to this entrypoint.

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all setup inputs in one prompt. Confirm mode still includes approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: For `:confirm` or no suffix, the consolidated setup prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder or load prior context is allowed, then ask ALL questions immediately and wait.

For `:auto`, do not emit the consolidated prompt by default. Resolve setup with the three-tier branch below, then load the auto YAML only after all required values are bound.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` from the `:auto` suffix, follow the three-tier flow:

1. **Tier 1 - Resolve confidently**: parse `$ARGUMENTS` flags, the `PRE-BOUND SETUP ANSWERS:` block, and the Default Resolution Table below. When every required field is resolved, persist to `{spec_folder}/ai-council/council-session.json` or the YAML-designated setup artifact, bind runtime YAML placeholders, set `STATUS: PASSED`, and load `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml`. End Section 0.
2. **Tier 2 - Targeted ask**: when one or two required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2 fields: `spec_folder` and `topics` when the prompt contains multiple plausible topic lists. Missing `deliberation_topic` is absence, not ambiguity - go to Tier 3.
3. **Tier 3 - Fail fast**: emit the named-missing-inputs error format with `/deep:ask-ai-council:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged - see the Consolidated Setup Prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults.

```yaml
PRE-BOUND SETUP ANSWERS:
  deliberation_topic: Runtime boundary and convergence defaults  # string; use this OR topics
  topics:
    - Runtime boundary
    - Convergence threshold semantics
  max_rounds_per_topic: 3
  max_topics_per_session: 5
  saturation_threshold: 0.20
  convergenceThreshold: 0.20
  executor:
    mode: in-cli  # in-cli | external-cli
    cli: active-runtime  # active-runtime | cli-codex | cli-claude-code | cli-opencode
    model: ""  # optional executor-specific model id (cli-opencode e.g. xiaomi-token-plan-ams/mimo-v2.5-pro, minimax-coding-plan/MiniMax-M2.7-highspeed)
    reasoning: ""  # optional reasoning effort or variant
    service_tier: ""  # optional, executor-specific
    timeout: 900  # optional positive integer seconds
  spec_folder: <spec-folder>  # existing | new | update-related | phase-folder | explicit path
  execution_mode: AUTONOMOUS  # from :auto suffix
```

Rules:

- Any unspecified field falls back to its documented default.
- Marker fields take precedence over `$ARGUMENTS` flags because the caller explicitly bound setup in the prompt body.
- Unknown fields are warnings, not errors.
- Malformed lines, including missing `:`, emit a parse error naming the offending line. Known fields parsed before the error may still be used, and unresolved fields continue to Tier 2 or Tier 3.
- Empty strings count as unresolved for required fields.
- Compact legacy answer strings are only for the consolidated `:confirm` prompt. They are not a `:auto` marker format.
- `deliberation_topic` and `topics` are mutually compatible only when `deliberation_topic` is the session title and `topics` is the bounded topic list. If they conflict, prefer explicit `topics` and use `deliberation_topic` as the session summary.

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `deliberation_topic` | Y | `$ARGUMENTS` positional topic, marker `deliberation_topic`, or synthesized title from marker `topics` | none | N |
| `topics` | N | marker `topics`, comma/newline topic list in `$ARGUMENTS`, or single-item list from `deliberation_topic` | `[deliberation_topic]` | Y, when multiple plausible topic lists exist |
| `max_rounds_per_topic` | Y | flag `--max-rounds-per-topic`, marker `max_rounds_per_topic`, or default | `3` | N |
| `max_topics_per_session` | Y | flag `--max-topics`, marker `max_topics_per_session`, or default | `5` | N |
| `saturation_threshold` | Y | flag `--saturation`, marker `saturation_threshold`, or default | `0.20` | N |
| `convergenceThreshold` | Y | flag `--convergence`, marker `convergenceThreshold`, or `saturation_threshold` | `0.20` | N |
| `executor.mode` | Y | flag `--executor-mode`, marker `executor.mode`, or default | `in-cli` | N |
| `executor.cli` | Y | flag `--executor`, marker `executor.cli`, or active runtime | `active-runtime` | N |
| `executor.model` | N | flag `--model`, marker `executor.model`, or executor default | none | N |
| `executor.reasoning` | N | flag `--reasoning-effort`, marker `executor.reasoning`, or executor default | none | N |
| `executor.service_tier` | N | flag `--service-tier`, marker `executor.service_tier`, or executor default | none | N |
| `executor.timeout` | N | flag `--executor-timeout`, marker `executor.timeout`, or default | `900` | N |
| `spec_folder` | Y | flag `--spec-folder`, marker `spec_folder`, or targeted choice among suggested existing/new/update-related/phase folder | none | Y, when topic is present but folder choice is ambiguous |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |

### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode

Use this block only when `execution_mode = "INTERACTIVE"` or when no suffix was supplied and Q2 must ask for the execution mode.

**STATUS: ☐ BLOCKED**

```text
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"    -> execution_mode = "AUTONOMOUS"
   |-- ":confirm" -> execution_mode = "INTERACTIVE"
   +-- No suffix  -> execution_mode = "ASK" (include Q2)

2. CHECK $ARGUMENTS for topic or topics:
   |-- Has content (ignoring suffixes and flags):
   |     -> deliberation_topic = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-rounds-per-topic=N -> max_rounds_per_topic = N
   |-- --max-topics=N -> max_topics_per_session = N
   |-- --saturation=N -> saturation_threshold = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   |-- --executor-mode=<in-cli|external-cli> -> executor.mode
   |-- --executor=<active-runtime|cli-codex|cli-claude-code|cli-opencode> -> executor.cli
   |-- --model=<id> -> executor.model
   |-- --reasoning-effort=<level> -> executor.reasoning
   |-- --service-tier=<tier> -> executor.service_tier
   |-- --executor-timeout=<seconds> -> executor.timeout
   +-- Defaults: max_rounds_per_topic=3, max_topics_per_session=5, saturation_threshold=0.20, convergenceThreshold=0.20, executor.mode=in-cli, executor.cli=active-runtime, executor.timeout=900

   Cost guard preview:
   - max_rounds = max_topics_per_session * max_rounds_per_topic
   - max_seat_outputs = max_topics_per_session * max_rounds_per_topic * 3
   - Default upper bound = 5 * 3 * 3 = 45 seat outputs

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 4 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: deliberation_topic OR "deep-ai-council", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):

   Q0. Deliberation Topic or Topics (if not in command): What should the council deliberate?
     You may provide one topic or a numbered list of topics.

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous - run setup, topic loops, synthesis, and save without approval
     B) Interactive - pause at setup, loop, synthesis, and save gates

   Q3. Cost Guards (if not set via flags):
     Defaults: max_rounds_per_topic=3, max_topics_per_session=5, saturation_threshold=0.20, convergenceThreshold=0.20.
     Change any values?

   Q4. Executor (optional, press enter for default):
     A) Active runtime / in-cli (default) - use the current runtime's council seats.
     B) cli-codex - one external Codex round.
     C) cli-claude-code - one external Claude Code round.
     D) cli-opencode - one external OpenCode round.

   Reply format examples:
   - `"runtime boundary strategy, A, A"`
   - `"topics: runtime boundary; convergence; cost guards, A, B, defaults"`
   - `"Deep council architecture, D, A, rounds=3 topics=5 saturation=0.20 convergence=0.20, A"`
   - `"Council executor comparison, A, A, rounds=2 topics=3, B, gpt-5.5, high, fast"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - deliberation_topic = [from Q0 or $ARGUMENTS]
   - topics = [from Q0, $ARGUMENTS, or derived single-item list]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - max_rounds_per_topic = [from Q3 or flag or default 3]
   - max_topics_per_session = [from Q3 or flag or default 5]
   - saturation_threshold = [from Q3 or flag or default 0.20]
   - convergenceThreshold = [from Q3 or flag or saturation_threshold or default 0.20]
   - executor config = [CLI flags, compact reply, config file, or default active-runtime]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers.
NEVER auto-create spec folders without confirmation.
NEVER split questions into multiple prompts.
```

**Phase Output:**

- `deliberation_topic` | `topics`
- `spec_choice` | `spec_path`
- `execution_mode`
- `max_rounds_per_topic` | `max_topics_per_session`
- `saturation_threshold` | `convergenceThreshold`
- `executor.*`

---

# Deep Council

Run a bounded multi-topic AI Council session: initialize session state, deliberate topic-by-topic, evaluate adjudicator-verdict stability, synthesize per-topic and session-wide reports, and route continuity through the spec packet.

## Convergence Threshold Semantics

**Default:** 0.20 on adjudicator-verdict stability across rounds.

**Semantic:** `convergenceThreshold` compares per-topic Round-N to Round-N+1 adjudicator verdict deltas. Lower = more rounds / higher stability requirement.

**NOT INTERCHANGEABLE with siblings:**
- `deep-review` uses 0.10 default on weighted P0/P1/P2 severity ratio.
- `deep-research` uses 0.05 default on newInfoRatio with negative-knowledge emphasis.

Carrying threshold expectations across siblings will cause unexpected iteration counts. Council stability is about recommendation, confidence, risk, decision-axis, and blocking-disagreement drift, not prose similarity.

```yaml
role: Deep AI Council Session Manager
purpose: Run iterative multi-topic council sessions until per-topic convergence or cost guards stop the run
action: Execute YAML workflow managing setup, topic loop, synthesis, and save phases
operating_mode:
  workflow: iterative_multi_topic_loop
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: adjudicator_verdict_stability
```

---

## 1. PURPOSE

Run an iterative multi-topic council session under `{spec_folder}/ai-council/`: initialize `council-session.json`, run topic loops with session-wide findings registry priors, compile per-topic reports, compile `session-report.md`, and refresh packet continuity.

Use this when a planning problem needs more than one council topic, more than one round per topic, or explicit cost/convergence guards. For single-round planning, use the regular `ai-council` agent behavior.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` - deliberation topic(s), optional flags, and optional mode suffix.

**Outputs:** Packet-local `ai-council/**` artifacts, including session config/state, topic folders, per-topic council reports, session report, findings registry, and `STATUS=<OK|FAIL|CANCELLED>`.

---

## 3. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Setup | Initialize | Resolve setup answers, cost guards, executor, spec folder, and session state | `ai-council/council-session.json`, session directories |
| Loop | Iterate | Run bounded topic loops and evaluate adjudicator-verdict stability | `ai-council/topics/**`, session state, findings registry |
| Synth | Synthesize | Build per-topic reports and a session-wide report with cross-topic priors | `topic-report.md`, `council-report.md`, `session-report.md` |
| Save | Preserve | Route completion context through memory/spec continuity | refreshed packet docs and metadata |

### Execution Modes

| Mode | Invocation | Behavior |
|------|------------|----------|
| `:auto` | `/deep:ask-ai-council:auto "topic"` | Runs setup, loop, synthesis, and save without approval gates after Tier-1 setup succeeds |
| `:confirm` | `/deep:ask-ai-council:confirm "topic"` | Prompts once for setup, then gates setup, loop, synthesis, and save |
| (default) | `/deep:ask-ai-council "topic"` | Ask user to choose mode during setup |

---

## 4. KEY BEHAVIORS

### Autonomous Mode (`:auto`)

- Resolves required inputs through the three-tier setup contract.
- Surfaces the computed cost upper bound before dispatch.
- Runs all configured topics without approval gates after setup passes.
- Stops a topic when verdict stability is reached, `max_rounds_per_topic` is reached, all seats fail, or critical disagreement remains unresolved at the limit.
- Preserves cross-topic priors by registry fingerprint instead of copied prose.

### Interactive Mode (`:confirm`)

- Uses the single consolidated setup prompt before any workflow writes.
- Pauses before setup, loop, synthesis, and save phases.
- Presents cost guards and executor boundary before running the loop.
- Lets the operator cancel without losing already persisted packet-local artifacts.

---

## 5. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on `execution_mode`:

- **AUTONOMOUS**: `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml`
- **INTERACTIVE**: `.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml`

The YAML contains the full loop workflow: initialization, session orchestration, topic iteration, findings-registry use, synthesis, and memory save.

---

## 6. OUTPUT FORMATS

**Success:**

```text
Deep council complete.
Topics: [N completed]/[N configured] | Rounds: [N total] | Stop reason: [converged|max_rounds|max_topics|cancelled]
Convergence: threshold=[0.20] semantic=adjudicator-verdict-stability
Artifacts: ai-council/session-report.md, ai-council/deep-ai-council-findings-registry.json, ai-council/topics/**
Ready for: implementation planning or next packet phase
STATUS=OK PATH=[spec-folder-path]
```

**Failure:**

```text
Error: [error description]  Phase: [phase name]
STATUS=FAIL ERROR="[message]"
```

**Cancelled:**

```text
Deep council cancelled.
Preserved artifacts: [list]
STATUS=CANCELLED PATH=[spec-folder-path]
```

---

## 7. MEMORY INTEGRATION

### Before Starting

- `memory_context({ input: deliberation_topic, intent: "understand" })` - load prior council and planning context unless the user says `skip context`, `fresh start`, or `skip memory`.
- Inject useful context into the session setup so topic prompts can distinguish new evidence from prior packet decisions.

### After Completing

- Route the completed session through `/memory:save` or the YAML-owned `generate-context.js` call for the resolved spec folder.
- Refresh `description.json`, `graph-metadata.json`, and canonical `_memory.continuity` in the packet docs.
- Do not treat memory rows as source-of-truth for council state. Packet-local `ai-council/**` artifacts remain canonical.

---

## 8. SKILL REFERENCE

Full protocol documentation: `.opencode/skills/deep-ai-council/SKILL.md` Section "Deep Mode (Iterative Multi-Topic)".

Key references:

- Command workflow assets: `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` and `.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml`
- Skill package: `.opencode/skills/deep-ai-council/SKILL.md`
- State hierarchy ADR: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-deep-ai-council/008-iterative-research-and-architecture/decision-record.md`
