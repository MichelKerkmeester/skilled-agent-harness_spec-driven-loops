---
title: "AI Council Seat Diversity Patterns"
description: "Lens combinations and vantage targets for diverse AI Council seats."
trigger_phrases:
  - "deep-ai-council seat diversity"
  - "council lens combinations"
  - "council vantage targets"
  - "council diversity requirement"
  - "council strategy lenses"
  - "council task type auto-selection"
  - "council strategy count"
importance_tier: "normal"
contextType: "reference"
---

# AI Council Seat Diversity Patterns

Each round uses at most 3 seats. The goal is useful disagreement, not more copies of the same answer.

---

## 1. OVERVIEW

Seat diversity is the council's first quality gate. A council that repeats the same reasoning path three times has spent more compute without gaining more judgment.

| Task Type | Recommended Lenses | Why |
| --- | --- | --- |
| Bug fix | analytical + critical + pragmatic | Finds cause, pressure-tests failure modes, keeps the fix small |
| Feature | creative + analytical + holistic | Explores shape, decomposes implementation, checks system fit |
| Refactor | holistic + pragmatic + critical | Protects architecture, limits churn, exposes regression risk |
| Architecture | analytical + critical + holistic | Names trade-offs, challenges assumptions, checks long-range fit |
| Research | research + critical + creative | Gathers evidence, tests source quality, opens alternative paths |

---

## 2. STRATEGY LENSES

Use different strategy lenses for each seat. The temperature values describe the intended reasoning posture from the agent body; they are guidance for prompt framing, not a requirement to mutate runtime temperature settings when the runtime does not expose them.

| Strategy | Temp | Reasoning Lens | Best For |
| --- | --- | --- | --- |
| Analytical | 0.1 | Systematic decomposition, formal analysis | Structure, correctness |
| Creative | 0.5 | Lateral thinking, novel approaches | Innovation, alternatives |
| Critical | 0.2 | Edge cases, failure modes, security | Robustness, safety |
| Pragmatic | 0.3 | Simplest working solution, MVP focus | Quick wins, prototypes |
| Holistic | 0.4 | System-wide impact, architecture fit | Integration, scale |
| Research | 0.2 | Evidence gathering, source validation, unknown reduction | Ambiguous requirements, external facts |

---

## 3. AI VANTAGE TARGETS

> **Primary mode: in-CLI.** The default council run uses the CURRENT active runtime's own model bench as seats - no external dispatch needed. The "Vantage Target" below names *which CLI's models supply the round's seats*, whether that CLI is the active runtime (in-CLI mode) or an externally-dispatched one (via the `cli-*` skill family).
>
> **One-CLI-per-round invariant.** A single round MUST run all its seats through ONE CLI's models. Seat diversity inside a round comes from different models/reasoning lenses on that CLI (and from different strategy lenses). Multiple CLIs in the same deliberation are staged as MULTIPLE rounds, each with its own state event. See `SKILL.md §0` Operational Modes and `§4` ALWAYS rule 6 / NEVER rule 5.

Vantage = the CLI whose model bench supplies the round's seats. Each row below is a complete round option:

| Vantage Target | Mode | Same-CLI Seat Diversity Options | Role in the Council | Typical Strategy Pairing |
| --- | --- | --- | --- | --- |
| `cli-claude-code` | in-CLI when active runtime is Claude Code; otherwise external | model: Opus / Sonnet / Haiku; reasoning: high / xhigh | Deep decomposition, correctness scrutiny, edge-case reasoning | Analytical or Critical |
| `cli-codex` | in-CLI when active runtime is Codex; otherwise external | model: gpt-5.5 / gpt-5.5-pro / gpt-5.5-fast; reasoning: medium / high / xhigh | Implementation realism, code-change sequencing, refactor constraints | Analytical or Pragmatic |
| `cli-opencode` | in-CLI when active runtime is OpenCode; otherwise external | model via `opencode-go/*` gateway (`deepseek-v4-pro`, `kimi-k2.6`, `glm-5.1`, etc.) or direct provider (`deepseek/deepseek-v4-pro`, `openai/gpt-5.5-pro`); `--variant low/medium/high` | Full plugin/skill/MCP runtime, cross-model gateway, broad model bench within one CLI | Holistic, Research, or Creative |
| native `@deep-research` | always in-CLI (active runtime's research agent) | n/a (single-seat round) | Evidence-first investigation and citation discipline | Research or Critical |

The default council run is an in-CLI round on the active runtime. External-CLI rounds are dispatched only when the active runtime cannot supply the required vantage or when explicit cross-AI validation is requested by the caller.

Unavailable vantages may be simulated only when clearly labeled as simulated. Do not imply an external AI participated when it did not.

### Vantage Selection Rules

Use real external or native vantages when the caller actually runs them or provides their result.

Do not overclaim.

Valid:

```text
Critical Seat, simulated cli-claude-code lens
```

Valid when actually executed:

```text
Critical Seat via cli-claude-code
```

Invalid:

```text
Claude Code found...
```

when Claude Code did not run.

### Pairing Guidance

Pair lenses and vantages to create complementary coverage. **All pairings below are SINGLE-ROUND patterns** - each entry stays within one CLI; multi-CLI rounds are not pairings, they are sequential rounds.

- Analytical + `cli-codex` (gpt-5.5 high): implementation sequence and codebase fit.
- Pragmatic + `cli-codex` (gpt-5.5 medium): minimal working path and churn control.
- Holistic + `cli-opencode` (deepseek-v4-pro high): system-wide impact, broad architectural fit via gateway model bench.
- Research + `cli-opencode` (multiple gateway models in one round): ecosystem context and external unknowns covered by multiple models within ONE CLI invocation.
- Analytical + `cli-claude-code` (Opus high): deep decomposition.
- Critical + `cli-claude-code` (Opus xhigh): edge-case and correctness scrutiny.
- Research + native `@deep-research`: source discipline and evidence reduction.
- Critical + native `@deep-research`: evidence-backed challenge to assumptions.

---

## 4. DIVERSITY REQUIREMENTS

Every council run must satisfy all applicable diversity checks.

### 1. Lens Diversity

Selected seats use different strategy lenses.

Bad:

```text
Analytical + Analytical + Analytical
```

Good:

```text
Analytical + Critical + Pragmatic
```

### 2. Vantage Diversity (within a single round)

Within ONE round, vantage diversity is achieved via DIFFERENT MODELS or REASONING LEVELS on the SAME CLI (e.g. on `cli-opencode`: `opencode-go/deepseek-v4-pro --variant high` + `opencode-go/kimi-k2.6`; on `cli-claude-code`: Opus + Haiku). Across-CLI diversity is staged as ADDITIONAL ROUNDS - each round runs on one CLI only.

If real external vantages are unavailable, preserve lens diversity and label simulated vantages.

### 3. Mandate Diversity

Each seat receives a unique success criterion and risk focus.

Examples:

- one seat optimizes correctness;
- one seat attacks failure modes;
- one seat minimizes implementation churn.

### 4. Output Diversity

If two seats return essentially the same plan, run cross-critique to decide whether convergence is real or artificial.

Artificial convergence signs:

- same phrasing;
- same blind spots;
- no unique evidence;
- no disagreement before recommendation.

### 5. Evidence Diversity

At least one seat must challenge assumptions, missing context, or failure modes.

Evidence diversity is mandatory because planning without challenge turns council output into repeated intuition.

---

## 5. STRATEGY COUNT GUIDELINES

| Strategies | When to Use |
| --- | --- |
| N=2 | Simple tasks with clear constraints and low risk |
| N=3 | Default and maximum: balanced diversity, critique, and synthesis |

Never increase N above 3 to simulate consensus.

If more than three vantage points matter, stage them in the plan as follow-up validation instead of dispatching an oversized council.

### N=2

Use two seats when:

- the task is small;
- scope is clear;
- risk is low;
- a focused challenge lens is enough.

Recommended pairings:

- Bug fix: Analytical + Critical.
- Narrow docs change: Pragmatic + Critical.
- Small planning choice: Analytical + Pragmatic.

### N=3

Use three seats when:

- this is the default council mode;
- requirements have multiple trade-offs;
- implementation risk exists;
- architecture fit matters;
- evidence is incomplete.

Recommended pattern:

```text
Builder lens + critic lens + integrator lens
```

### More Than Three

Do not run a wider first round.

Instead:

- complete the three-seat council;
- identify remaining validation needs;
- stage extra external vantages as follow-up checks.

---

## 6. TASK-TYPE AUTO-SELECTION

Use this flow when the user does not specify seats. **Each row below = ONE round on ONE CLI.** Multi-CLI deliberations stage additional CLIs as sequential dedicated rounds, never folded into the same round.

```text
Task Type Received
    │
    ├─► Bug Fix
    │   └─► Round 1 (recommended): cli-claude-code
    │       Seats: Analytical (Opus high) + Critical (Opus xhigh) + Pragmatic (Sonnet)
    │       Rationale: deep decomposition + edge-case scrutiny + minimal-fix lens.
    │       Optional Round 2: cli-codex (gpt-5.5 high) for implementation-realism cross-check.
    │
    ├─► New Feature
    │   └─► Round 1: cli-opencode (via opencode-go gateway)
    │       Seats: Creative (kimi-k2.6) + Analytical (deepseek-v4-pro high) + Holistic (glm-5.1)
    │       Rationale: broad model bench within one CLI; novel → structured → system-fit.
    │       Optional Round 2: cli-claude-code for correctness-scrutiny pass.
    │
    ├─► Refactoring
    │   └─► Round 1: cli-codex
    │       Seats: Holistic (gpt-5.5-pro) + Pragmatic (gpt-5.5 medium) + Critical (gpt-5.5 xhigh)
    │       Rationale: implementation-realism CLI excels at refactor sequencing.
    │       Optional Round 2: cli-claude-code for regression-risk deep dive.
    │
    ├─► Architecture
    │   └─► Round 1: cli-claude-code
    │       Seats: Analytical (Opus high) + Critical (Opus xhigh) + Holistic (Sonnet)
    │       Rationale: deep-decomposition CLI for trade-off mapping.
    │       Optional Round 2: native @deep-research (single-seat) for evidence backstop.
    │
    ├─► Research / Unknowns
    │   └─► Round 1: native @deep-research (single seat)
    │       Rationale: evidence-first investigation with citation discipline.
    │       Optional Round 2: cli-opencode (multiple gateway models) for alternative framing.
    │       Optional Round 3: cli-claude-code (Critical lens) to test assumptions.
    │
    └─► Custom (user specifies)
        └─► User-selected strategies (N=user-defined, max 3 PER ROUND).
            If user names seats from multiple CLIs, the council MUST stage them as
            separate dedicated rounds (one CLI per round) rather than mixing.
```

Respect user-selected custom strategies up to the maximum of three PER ROUND. If the user requests more than three seats or multiple CLIs, stage them as additional dedicated rounds - never widen a single round beyond its CLI boundary.

---

## 7. CROSS-REFERENCES

- Agent body: `.opencode/agents/ai-council.md` §3 and §16.
- Decision context: local doctor command ADRs ADR-001.
- Scoring rubric: `../scoring/scoring_rubric.md`.
- Depth dispatch: `../convergence/depth_dispatch.md`.
- Failure handling: `../convergence/failure_handling.md`.
