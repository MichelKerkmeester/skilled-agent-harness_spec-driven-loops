---
title: "OpenCode CLI - Prompt Templates"
description: "Copy-paste ready prompt templates for the three documented use cases plus specialized agent dispatch, parallel detached sessions, ablation suites, worker farms, cross-AI handback, and Memory Epilogue."
---

# OpenCode CLI - Prompt Templates

Copy-paste templates for `opencode run` dispatches. Each template names the use case it serves, the framework it applies, and the canonical invocation shape.

> **⚠️ NON-INTERACTIVE DISPATCH RULE:** ANY automation that redirects stdout and/or stderr to files (e.g. `> stdout.log 2> stderr.log`) MUST also redirect stdin from `/dev/null`. opencode v1.14.39 reads stdin at startup; without explicit closed stdin, dispatches hang at 0% CPU after the `+60s snapshot prune cleanup` log line. Position: AFTER the prompt argument, BEFORE stdout/stderr redirects. The templates below show foreground patterns (terminal stdout, no redirect — works as-is). When adapting any of these for automation/background dispatch (`> file 2> file`), append `</dev/null` after the prompt. See `../references/integration_patterns.md` §6 for full failure modes + fix matrix.

## 1. OVERVIEW

The cli-opencode skill ships templates for the three documented use cases (per ADR-002) plus specialized dispatches for agent routing, parallel research, ablation, worker farms, and cross-AI handback. Every template ends with the Memory Epilogue when the calling AI needs to preserve session context.

Templates are numbered for cross-reference from `references/integration_patterns.md` and `SKILL.md`.

---

## 2. TEMPLATE 1 — EXTERNAL RUNTIME TO OPENCODE (USE CASE 1)

**Framework:** RCAF
**Calling runtime:** Claude Code, Codex, Copilot, raw shell

```text
You are dispatching from <calling-runtime> into a fresh OpenCode session via cli-opencode.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Plugins / skills required: <list>
- MCP tools required: <list>

Constraints:
- <list>

Success criteria:
- <list>

Budget awareness:
- Apply `../references/context-budget.md`; canonical semantics live in `../../sk-prompt-small-model/references/context-budget.md`.
- When content is cut for context budget, keep the retained span and insert `[... truncated N tokens]`.
- Treat truncation markers as intentional boundaries; do not infer missing evidence.

Memory Epilogue:
At the end of your response, include a structured handback inside delimiters:

<!-- MEMORY_HANDBACK_START -->
{
  "specFolder": "<path>",
  "sessionSummary": "<one-paragraph summary>",
  "user_prompts": ["<verbatim prompt>"],
  "observations": ["<key finding 1>", "<key finding 2>"],
  "recent_context": ["<recent change 1>"],
  "FILES": [
    {"path": "<path>", "DESCRIPTION": "<change description>", "ACTION": "<verb>", "MODIFICATION_MAGNITUDE": "<small|medium|large>"}
  ],
  "nextSteps": ["<next safe action>"]
}
<!-- MEMORY_HANDBACK_END -->
```

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt-from-template>" 2>&1
```

---

## 3. TEMPLATE 2 — IN-OPENCODE PARALLEL DETACHED SESSION (USE CASE 2)

**Framework:** CIDI
**Calling runtime:** OpenCode itself (TUI / web / serve / acp)

```text
You are spawning a parallel detached OpenCode session for <purpose>.

Goal: <one-sentence goal — must mention "parallel detached", "ablation suite", "worker farm", or "share URL">

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Iteration N of <total>
- State file: <path>

Constraints:
- This session must NOT modify the parent session's state.
- Write results to <state file path>.
- Publish a share URL only if the operator confirmed (CHK-033).
- Do NOT delegate the same prompt back to OpenCode (cycle protection).

Success criteria:
- <list>
```

```bash
opencode run \
  --share \
  --port 4096 \
  --model opencode-go/deepseek-v4-pro \
  --agent deep-research \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt-from-template>" 2>&1
```

---

## 4. TEMPLATE 3 — CROSS-AI ORCHESTRATION HANDBACK (USE CASE 3)

**Framework:** RCAF + TIDD-EC
**Calling runtime:** Codex, Copilot

```text
You are dispatching from <calling-runtime> into OpenCode for a spec-kit-specific workflow.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Subsystem: <spec-kit | memory | code-graph | advisor>
- Operation: <save | search | query | scan | validate>

Do's:
- Load the system-spec-kit skill before any spec-folder write.
- Route MCP calls through the project's local MCP servers.
- Cite file:line evidence for every claim.

Don'ts:
- Do not modify files outside the named spec folder.
- Do not skip the strict spec-folder validation.

Success criteria:
- <list>

Memory Epilogue: include MEMORY_HANDBACK delimiters as in Template 1.
```

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt-from-template>" 2>&1
```

---

## 5. TEMPLATE 4 — SPECIALIZED AGENT DISPATCH

**Framework:** RCAF
**Use case:** Any (1, 2, or 3)

Dispatch a task to a specific agent slug. See `../references/agent_delegation.md` for the full routing matrix.

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent <slug> \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

Common slugs: `general`, `context`, `orchestrate`, `write`, `review`, `debug`, `deep-research`, `deep-review`, `ai-council`, `deep-improvement`.

---

## 6. TEMPLATE 5 — CODE REVIEW

**Framework:** TIDD-EC
**Agent:** `review`
**Use case:** 1 or 3

```text
As @review:

Task: Review <files> for <issue type>.

Instructions:
- Cite file:line evidence for every finding.
- Surface P0 / P1 / P2 separately.
- Map findings to the closest sk-code baseline check item.

Do's:
- Apply the project's sk-code baseline.
- Layer `sk-code` surface-specific evidence selected from codebase signals; add `sk-code-review` for findings-first review output.

Don'ts:
- Do not propose fixes — leave that for a follow-up dispatch.
- Do not modify files (READ-ONLY).

Examples: <if available>

Context: Spec folder: <path> (pre-approved, skip Gate 3).
```

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent review \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

---

## 7. TEMPLATE 6 — ITERATIVE DEEP RESEARCH

**Framework:** CRISPE
**Agent:** `deep-research`
**Use case:** 2 (parallel detached) or 1 (single iteration from external runtime)

```text
Run iteration N of the deep-research loop on packet <packet-id>.

State file: <path to iteration-N.jsonl>
Strategy file: <path to strategy.md>

Capacity: leaf-agent execution — single iteration only, no nested dispatches.
Insight: <what the prior iteration converged on>
Statement: <hypothesis for this iteration>
Personality: rigorous, evidence-first, no speculation.
Experiment: <list of files to read and queries to run>
```

```bash
opencode run \
  --share \
  --port 4096 \
  --model opencode-go/deepseek-v4-pro \
  --agent deep-research \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

---

## 8. TEMPLATE 7 — ABLATION SUITE

**Framework:** CIDI
**Agent:** `general` or `orchestrate`
**Use case:** 2 (parallel detached)

```text
Spawn a parallel detached session to run an ablation suite on <subsystem>.

Context: <one-paragraph context>
Instructions:
- For each ablation in <ablation list>, run <experiment>.
- Capture results in <state file path>.
- Compare against the baseline at <baseline path>.

Details:
- Ablation 1: <description>
- Ablation 2: <description>
- ...

Input: <input data path>
```

```bash
opencode run \
  --share \
  --port 4097 \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

---

## 9. TEMPLATE 8 — WORKER FARM DISPATCH

**Framework:** CIDI
**Agent:** `general`
**Use case:** 2 (parallel detached)

Spawn N parallel detached sessions in a loop, each with a distinct port and state file.

```text
You are worker N of <total> in a parallel farm. Spec folder: <path>.

Goal: <one-sentence goal scoped to your shard>

Constraints:
- Read input from <input shard path for worker N>.
- Write output to <output shard path for worker N>.
- Do NOT touch other workers' state.
```

```bash
# Dispatch loop — note the </dev/null redirect (see integration_patterns.md §6)
for n in $(seq 1 8); do
  port=$((4100 + n))
  opencode run \
    --share \
    --port "$port" \
    --model opencode-go/deepseek-v4-pro \
    --agent general \
    --variant high \
    --format json \
    --dir /repo \
    "Worker $n: <prompt>" > "logs/worker-$n.log" 2>&1 </dev/null &
done
wait
```

---

## 10. TEMPLATE 9 — SPEC KIT MEMORY SEARCH VIA OPENCODE

**Framework:** RCAF
**Agent:** `general`
**Use case:** 3 (cross-AI handback) or 1 (external runtime)

```text
Search the project's Spec Kit Memory database for <query>.

Spec folder context: <path> (pre-approved, skip Gate 3).

Action:
- Call memory_search with the query.
- Filter results to importance_tier in [critical, important].
- Return the top 5 hits with their packet pointers.

Format: structured JSON event stream. Memory Epilogue at the end.
```

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

---

## 11. TEMPLATE 10 — MULTI-STRATEGY PLANNING VIA @MULTI-AI COUNCIL

**Framework:** CRAFT
**Agent:** `ai-council`
**Use case:** 1 or 3

```text
Plan the <feature / refactor> using multi-strategy comparison.

Context: <one-paragraph context>
Role: planning architect — no file modifications.
Action: generate three distinct strategies, score each across the 5-dimension rubric, synthesize the optimal plan.
Format: structured JSON plus a summary paragraph.
Target: an implementation-ready plan that another agent can execute.
```

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent ai-council \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

---

## 12. TEMPLATE 11 — DOC GENERATION VIA @WRITE

**Framework:** RCAF
**Agent:** `write`
**Use case:** 1

```text
Generate a <doc type> for <subject>.

Context: Spec folder: <path> (pre-approved, skip Gate 3).
Action: load the appropriate sk-doc template, fill it, run the DQI score, surface any HIGH issues for manual patching.
Format: markdown.
```

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent write \
  --variant high \
  --format json \
  --dir /repo \
  "<prompt>" 2>&1
```

---

## 13. TEMPLATE 12 — SELF-INVOCATION REFUSAL SURFACE

**Use case:** Refusal path

When the smart router refuses (per ADR-001), the calling AI surfaces this exact message to the operator:

```text
ERROR: cli-opencode self-invocation refused.

You are already inside OpenCode (signal: <env|ancestry|lockfile> tripped).
Asking cli-opencode to delegate this exact prompt back to OpenCode would create
a circular dispatch.

Options:
1. Use a sibling cli-* skill (cli-claude-code, cli-codex)
   to dispatch a different model.
2. Open a fresh shell session (no OpenCode parent) and re-run from there.
3. If you wanted a parallel detached session (different session id, separate
   state directory), restate the request with explicit "parallel detached" /
   "ablation suite" / "worker farm" / "share URL" keywords — that triggers
   use case 2 instead of refusal.
```

This template is NOT an `opencode run` invocation — it is the user-facing message the calling AI prints when the router refuses dispatch.

---

## 14. TEMPLATE 13 — MEMORY EPILOGUE (REUSABLE TAIL)

Append this block to any prompt that produces evidence the calling AI wants to save through Spec Kit Memory.

```text
Memory Epilogue:

At the end of your response, include a structured handback inside delimiters:

<!-- MEMORY_HANDBACK_START -->
{
  "specFolder": "<path>",
  "sessionSummary": "<one-paragraph summary, 2-4 sentences>",
  "user_prompts": ["<verbatim caller prompt>"],
  "observations": ["<key finding 1>", "<key finding 2>"],
  "recent_context": ["<recent change 1>", "<recent change 2>"],
  "FILES": [
    {
      "path": "<absolute or repo-rooted path>",
      "DESCRIPTION": "<one sentence describing the change>",
      "ACTION": "<verb: created | modified | deleted | reviewed>",
      "MODIFICATION_MAGNITUDE": "<small | medium | large>",
      "_provenance": "<short cite>"
    }
  ],
  "keyDecisions": ["<decision 1 with rationale>"],
  "nextSteps": ["<next safe action>", "<follow-up 1>"],
  "triggerPhrases": ["<phrase 1>", "<phrase 2>"]
}
<!-- MEMORY_HANDBACK_END -->

The calling AI extracts this block via regex
/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/
and feeds it to generate-context.js.
```

---

## 15. TEMPLATE 14 — MINIMAX (TOKEN PLAN; EMPIRICAL DEFAULT: TIDD-EC + DENSE PRE-PLAN)

**When**: dispatching to the MiniMax Token Plan default `minimax-coding-plan/MiniMax-M3` (pay-per-token alternative `minimax/MiniMax-M3` via the Direct API). The 120/003 benchmark (real MiniMax M2.7 runs) found MiniMax diverges from the cross-model defaults: **TIDD-EC** framework + **dense** pre-planning wins (RCAF + medium is the fallback) — carry this contract forward to M3 until re-benchmarked. `--variant` is omitted by default (unverified). **Omit `--agent`** (rejected on opencode 1.15.13).

**Invocation**:

```bash
opencode run \
  --model minimax-coding-plan/MiniMax-M3 \
  --dir "$REPO_ROOT" \
  "$(cat prompt.md)" \
  </dev/null
```

**Prompt scaffold (TIDD-EC + dense pre-plan)**:

```markdown
## Task
<one-line goal>

## Instructions
1. Write a `<pre-plan>` block with 4-5 ordered steps (dense). Each step: input, output, acceptance criterion, verification command.
2. Write the code in fenced markdown blocks with the file path in a comment on the first line.
3. End with a `## Verification` list of the exact commands that prove acceptance.

## Do's
- Stay strictly within the allowed-writes scope.
- Use only documented/real CLI flags, functions, and files.
- Satisfy every acceptance criterion exactly.

## Don'ts
- Do not invent CLI flags, functions, or files.
- Do not touch files outside scope.
- Do not replace code with prose disclaimers.

## Examples
Output shape: a `<pre-plan>` block, then fenced code with a path comment, then a `## Verification` command list.

## Context
- CWD / active surface / existing files in scope
- Acceptance criteria (what "done" means)
```

**Why**: TIDD-EC's explicit Do's/Don'ts curb MiniMax's scope/format drift more than RCAF's role anchor (0.767 vs 0.742), and MiniMax uses dense plan structure rather than being slowed by it (0.775 dense vs 0.767 medium) — the opposite of SWE-1.6. Evidence: `.opencode/skills/sk-prompt-small-model/benchmarks/120-003-minimax-prompt-framework/eval-loop/synthesis.md`.

---

## 16. TEMPLATE 15 — MiMo (XIAOMI TOKEN PLAN + DIRECT API; COSTAR + LEAN)

**When**: dispatching to MiMo-V2.5-Pro via the Xiaomi Token Plan (Europe) — primary slug `xiaomi-token-plan-ams/mimo-v2.5-pro` (provider `xiaomi-token-plan-ams`, quota pool `xiaomi-token-plan`) — or via the Xiaomi Direct API — slug `xiaomi/mimo-v2.5-pro` (provider `xiaomi`, pay-per-token). The 126/004 benchmark (10/10 real `mimo-v2.5-pro` runs) found **COSTAR wins** (RACE is a statistical-tie fallback); use **lean-to-medium** pre-planning. MiMo is frontier-correct already, so frame for format + brevity, **not** guardrails — TIDD-EC/dense ranked LAST, and CIDI is unreliable (it intermittently writes to a file instead of returning inline code). **Always pass `--variant high`** — opencode maps low/medium/high to MiMo's reasoning effort (confirmed accepted on opencode 1.15.13); high is the standing default. **Omit `--agent`** (on opencode 1.15.13 `--agent general` warns and falls back to the default agent). For cheap iteration / probing, the free gateway path `opencode/mimo-v2.5-free` (opencode-go credit pool; v2.5, not -pro tier) is available. Confirm live model ids with `opencode models xiaomi-token-plan-ams` (Token Plan) or `opencode models xiaomi` (Direct API).

**Invocation (Token Plan)**:

```bash
opencode run \
  --model xiaomi-token-plan-ams/mimo-v2.5-pro \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt>" \
  </dev/null
```

**Invocation (Direct API — pay-per-token)**:

```bash
opencode run \
  --model xiaomi/mimo-v2.5-pro \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt>" \
  </dev/null
```

**Prompt scaffold (COSTAR — empirical winner)**: Context (task + repo facts) → Objective (the single concrete deliverable) → Style (`precise, no preamble`) → Tone (neutral) → Audience (`an automated/downstream consumer that parses your output`) → Response (exact output shape, e.g. "return ONLY the function body"). Keep pre-planning lean-to-medium. **RACE** (Role/Action/Context/Expectation) is the equally-valid fallback. Do NOT use TIDD-EC or dense guardrail framing — it ranked last for MiMo (inflated output ~2.4× and leaked explanatory prose that broke the code-only contract).

**Why**: MiMo-V2.5-Pro (1M-token context, strongly agentic — 1000+ tool calls, token-efficient; SWE-bench Pro 57.2) is an explicitly-selectable model on the Xiaomi Token Plan (Europe) and the Xiaomi Direct API; the default skill model stays `opencode-go/deepseek-v4-pro`. The COSTAR/RACE-lean contract is the empirical 126/004 finding (10/10 real dispatches; the discriminator was format adherence + token efficiency, not correctness — MiMo solved every fixture under every framework). Evidence: `.opencode/skills/sk-prompt-small-model/benchmarks/126-004-mimo-prompt-framework/eval/synthesis.md`.

---

## 17. RELATED RESOURCES

- `../references/cli_reference.md` - Full subcommand and flag reference
- `../references/integration_patterns.md` - Three use cases and decision tree
- `../references/agent_delegation.md` - Agent routing matrix
- `../references/opencode_tools.md` - Unique value props
- `./prompt_quality_card.md` - Framework selection and CLEAR check
- `../SKILL.md` - Smart router pseudocode
