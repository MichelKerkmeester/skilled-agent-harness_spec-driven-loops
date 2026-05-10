---
title: "Deep AI Council Seat Diversity Patterns"
description: "Lens combinations and vantage targets for diverse Deep AI Council seats."
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

# Deep AI Council Seat Diversity Patterns

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

Prefer distinct executor or AI-system vantages where available:

| Vantage Target | Role in the Council | Typical Pairing |
| --- | --- | --- |
| `cli-codex` | Implementation realism, code-change sequencing, refactor constraints | Analytical or Pragmatic |
| `cli-gemini` | Breadth, external ecosystem awareness, alternative framing | Creative or Research |
| `cli-claude-code` | Deep decomposition, correctness scrutiny, edge-case reasoning | Analytical or Critical |
| native `@deep-research` | Evidence-first investigation and citation discipline | Research or Critical |

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

Pair lenses and vantages to create complementary coverage:

- Analytical + `cli-codex`: implementation sequence and codebase fit.
- Pragmatic + `cli-codex`: minimal working path and churn control.
- Creative + `cli-gemini`: alternative framing and breadth.
- Research + `cli-gemini`: ecosystem context and external unknowns.
- Analytical + `cli-claude-code`: deep decomposition.
- Critical + `cli-claude-code`: edge-case and correctness scrutiny.
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

### 2. Vantage Diversity

Selected seats seek different AI-system or native-agent perspectives when available.

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

Use this flow when the user does not specify seats.

```text
Task Type Received
    │
    ├─► Bug Fix
    │   └─► Analytical + Critical + Pragmatic (N=3)
    │       Vantages sought: cli-claude-code, cli-codex, cli-gemini
    │       Rationale: Root cause needs systematic analysis,
    │       edge cases need scrutiny, fix should be minimal
    │
    ├─► New Feature
    │   └─► Creative + Analytical + Holistic (N=3)
    │       Vantages sought: cli-gemini, cli-codex, cli-claude-code
    │       Rationale: Novel approaches explored, then
    │       structured, then checked for system fit
    │
    ├─► Refactoring
    │   └─► Holistic + Pragmatic + Critical (N=3)
    │       Vantages sought: cli-opencode, cli-codex, cli-claude-code
    │       Rationale: System impact first, simplicity second,
    │       regression risk third
    │
    ├─► Architecture
    │   └─► Analytical + Critical + Holistic (N=3)
    │       Vantages sought: cli-claude-code, native @deep-research, cli-gemini
    │       Rationale: Balance structure, risk, and system fit
    │
    ├─► Research / Unknowns
    │   └─► Research + Critical + Creative (N=3)
    │       Vantages sought: native @deep-research, cli-gemini, cli-claude-code
    │       Rationale: Establish evidence, test assumptions,
    │       explore viable alternatives
    │
    └─► Custom (user specifies)
        └─► User-selected strategies (N=user-defined, max 3)
```

Respect user-selected custom strategies up to the maximum of three. If the user requests more than three, stage extra viewpoints as follow-up validation instead of widening the first round.

---

## 7. CROSS-REFERENCES

- Agent body: `.opencode/agents/deep-ai-council.md` §3 and §16.
- Decision record: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md` ADR-001.
- Scoring rubric: `scoring_rubric.md`.
- Depth dispatch: `depth_dispatch.md`.
- Failure handling: `failure_handling.md`.
