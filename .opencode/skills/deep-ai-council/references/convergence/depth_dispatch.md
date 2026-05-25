---
title: "AI Council Depth Dispatch"
description: "Adaptive Depth 0 and Depth 1 dispatch rules for AI Council execution without recursive counciling."
trigger_phrases:
  - "deep-ai-council depth dispatch"
  - "depth 0 council dispatch"
  - "depth 1 council dispatch"
  - "sequential thinking council"
  - "ndp compliant council"
importance_tier: "normal"
contextType: "reference"
---

# AI Council Depth Dispatch

Depth controls whether a council may launch seats in parallel or must deliberate inline. The goal is useful diversity without illegal nesting.

## Deep Mode (Iterative Multi-Topic)

Deep mode is the iterative, multi-topic council workflow exposed through `/deep:ask-ai-council`. It is additive to the existing single-round council behavior: regular `ai-council` runs still produce one planning report and packet-local `ai-council/**` artifacts, while deep mode owns a session loop with topic-by-topic rounds, adjudicator-verdict stability checks, and a session-wide findings registry.

Use `/deep:ask-ai-council:auto` for non-interactive bounded runs when setup answers are pre-bound, and `/deep:ask-ai-council:confirm` when the operator should approve setup, loop, synthesis, and save gates. The command Markdown owns setup resolution and then loads `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` or `.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml` for execution.

Deep mode uses a three-level state hierarchy:

```text
session
  -> topic
     -> round
```

The session stores `council-session.json`, append-only session state, the session-wide findings registry, and `session-report.md`. Each topic stores topic config/state, per-topic reports, and round folders with seat, deliberation, critique, and verdict artifacts. Cross-topic priors move by registry fingerprint, not copied prose.

Default cost guards are intentionally conservative: `max_rounds_per_topic = 3`, `max_topics_per_session = 5`, `saturation_threshold = 0.20`, and three seats per round. The default upper bound is 45 seat outputs, but stable verdict deltas should stop topics earlier. Operators may tune these values through command setup answers, and `:auto` must surface the computed upper bound before dispatch.

Choose deep mode when the planning problem has multiple separable topics, requires more than one round per topic, or needs auditable convergence/cost controls. Choose single-round council mode when one deliberation report is enough and extra loop machinery would only add cost.

---

## 1. OVERVIEW

The Multi-AI Council uses adaptive dispatch based on invocation depth.

At Depth 0, the council is invoked directly by the user or top-level runtime and may dispatch seats in parallel when the Task tool is available. At Depth 1, the council is already inside another agent or orchestrator and must process seats sequentially through `sequential_thinking` MCP inline.

This protects NDP compliance.

NDP compliance principle:

```text
Nested deliberation must not create nested agent dispatch.
```

Depth dispatch is not about quality level. Depth 1 can still perform rigorous multi-seat deliberation. It simply performs that deliberation inside one context instead of spawning more agents.

Use this reference when:

- a prompt includes `Depth: 1`;
- an orchestrator dispatches `@deep-ai-council`;
- a council run needs to choose between Task dispatch and inline MCP thinking;
- recursive counciling risk is present;
- the runtime cannot safely dispatch diverse seats.

---

## 2. DEPTH DETECTION

Depth detection happens before DIVERSIFY or DISPATCH.

The dispatcher must inspect task context and choose the safest mode.

### Depth 0 Cues

Assume Depth 0 when:

- the council is invoked directly by the user;
- no explicit nesting marker is present;
- no parent agent says this is a LEAF call;
- Task tool dispatch is available and safe;
- the runtime context does not prohibit sub-dispatch.

Depth 0 is the fallback when no nesting evidence exists.

### Depth 1 Cues

Use Depth 1 when:

- task context includes `Depth: 1`;
- the caller says the council is a LEAF;
- the caller says no sub-agents may be dispatched;
- the council was invoked by orchestrator or another agent;
- runtime constraints prohibit Task dispatch;
- nested deliberation would produce recursive agent work.

### Explicit Marker

The strongest cue is:

```text
Depth: 1
```

When that marker appears, select sequential inline mode.

Do not reinterpret it as an optional preference.

### LEAF And Nesting Constraints

LEAF constraints mean the council must return its deliberation to the parent rather than dispatching new workers.

Depth 1 still requires:

- distinct strategy lenses;
- distinct mandates;
- scoring rubric;
- cross-critique;
- honest simulated-vantage labels.

It changes the execution vehicle, not the synthesis standard.

### Fallback Rule

If depth is unclear:

1. Check for explicit `Depth: 1`.
2. Check caller identity and LEAF language.
3. Check available tools and nesting constraints.
4. If no nesting evidence exists, operate as Depth 0.
5. If runtime safety is uncertain, choose Depth 1 and label dispatch mode honestly.

---

## 3. DEPTH 0: PARALLEL DISPATCH

Depth 0 is the default top-level council mode.

Use when:

- Multi-AI Council is invoked directly at top level;
- Task tool dispatch is allowed;
- distinct council seats can run independently;
- the runtime can collect all seat results before synthesis.

### Execution Contract

At Depth 0:

1. Select 2-3 council seats.
2. Assign distinct strategy lenses.
3. Assign distinct vantage targets when available.
4. Launch all selected seats simultaneously via Task tool.
5. Give each seat the same task and evidence.
6. Give each seat a distinct mandate and risk focus.
7. Prevent shared state between seats.
8. Collect all returned results before DELIBERATE.

### Independent Seats

Each seat runs independently.

That means:

- no seat reads another seat's output before returning;
- no seat modifies the shared plan;
- no seat invokes another council;
- no seat claims external execution unless it actually ran.

Independence matters because the council needs genuine disagreement before it can trust agreement.

---

## 4. DEPTH 1: SEQUENTIAL VIA MCP

Depth 1 is the NDP-compliant nested mode.

Use when:

- Multi-AI Council is dispatched by another agent;
- the caller marks the task `Depth: 1`;
- Task dispatch would violate nesting constraints;
- runtime cannot safely create independent sub-agents.

### Execution Contract

At Depth 1:

1. Use `sequential_thinking` MCP inline.
2. Process one council seat per thinking step.
3. Apply a different strategy lens at each step.
4. Keep a running comparison as each seat completes.
5. Preserve the seat's distinct mandate.
6. Label external vantages as simulated unless an external result was provided.
7. Run cross-critique inside the same context.
8. Return one synthesized council report to the caller.

### One Strategy Per Thinking Step

Each sequential step should behave like a separate seat.

Example:

```text
Step 1: Analytical Seat
Step 2: Critical Seat
Step 3: Pragmatic Seat
Step 4: Cross-critique and scoring
Step 5: Consensus reconciliation
```

Do not collapse all lenses into one generic analysis paragraph.

### NDP Compliance Rationale

Depth 1 avoids nested dispatch while preserving deliberation.

It is compliant because:

- no sub-agent is launched;
- no recursive council is created;
- each lens is processed in the current context;
- the parent orchestrator remains responsible for any implementation work.

---

## 5. DECISION RULE FLOWCHART

Use this decision rule before dispatch.

```text
Am I dispatched by another agent?
    │
    ├─► YES (Depth 1) -> sequential_thinking MCP
    │   └─► Process council seats inline, no Task dispatch
    │
    └─► NO (Depth 0) -> Task tool parallel dispatch
        └─► Launch 2-3 seats simultaneously
```

---

## 6. NO RECURSIVE COUNCILING

Recursive counciling is a hard block.

The council is a planning architecture pattern, not a self-replicating runtime.

### Rule 1: Never Dispatch Council From Inside Council

Do not invoke `@deep-ai-council` while already inside a council run.

If a seat needs critique, run the critique in the current council's deliberation round.

### Rule 2: Never Ask A Seat To Invoke Another Council

Seat prompts must not include:

```text
Invoke the AI Council...
```

or:

```text
Run another council to validate this...
```

Seats propose and critique. They do not spawn councils.

### Rule 3: Simulate When Runtime Cannot Dispatch

If the runtime cannot dispatch diverse seats safely:

- use sequential inline deliberation;
- preserve lens diversity;
- label simulated external vantages;
- reduce confidence when missing real external participation is material.

Honest label:

```text
Dispatch mode: sequential inline; external vantages simulated.
```

Dishonest label:

```text
cli-opencode agreed with cli-codex.
```

This also violates the one-CLI-per-round invariant (these would need to be TWO dedicated rounds, not one). See `SKILL.md §5` ALWAYS rule 6.

Unless those tools actually ran (and were dispatched as separate rounds).

---

## 7. CROSS-REFERENCES

- Agent body: `.opencode/agents/ai-council.md` §0 ILLEGAL NESTING and §5 PARALLEL VS SEQUENTIAL.
- Caller patterns: `../patterns/command_wiring.md`.
- Seat selection: `../patterns/seat_diversity_patterns.md`.
- Failure policy: `failure_handling.md`.
- Scoring and critique: `../scoring/scoring_rubric.md`.
