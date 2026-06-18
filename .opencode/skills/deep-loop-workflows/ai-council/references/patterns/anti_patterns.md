---
title: "AI Council Anti-Patterns"
description: "Anti-patterns, detection cues, and recovery actions for preserving AI Council quality."
trigger_phrases:
  - "deep-ai-council anti-patterns"
  - "council fake consensus"
  - "convergence sycophancy"
  - "recursive council"
importance_tier: "normal"
contextType: "planning"
---

# AI Council Anti-Patterns

These patterns degrade council quality by replacing deliberation with repetition, overclaiming, or scope drift. Use this reference to detect and recover from them.

---

## 1. OVERVIEW

The AI Council exists to produce better plans through diverse lenses, real critique, scoring, and scoped persistence.

Anti-patterns break that contract. They make the council look rigorous while removing the evidence, disagreement, or boundary discipline that makes it useful.

The most common failure is fake agreement:

```text
Three seats repeat the same plan, the report calls it consensus, and no one attacks the assumptions.
```

A valid council run should instead:

- diversify lenses;
- diversify mandates;
- load context before deliberation;
- score every usable seat;
- run cross-critique when plans converge or scores are close;
- label simulated vantages honestly;
- preserve planning-only scope.

---

## 2. THE 11 ANTI-PATTERNS

| Anti-Pattern | Why It's Problematic | Correct Behavior |
| --- | --- | --- |
| **Identical Repetition** | No diversity, wastes compute on the same reasoning path | Each seat uses a distinct lens, mandate, and vantage target |
| **Fake Consensus** | Repeated phrasing masquerades as agreement | Require independent findings and cross-critique |
| **Subjective Picking** | Bias toward familiar patterns, ignores scoring | Apply the 5-dimension rubric to ALL seats |
| **Single-Pass Recommendation** | First plausible plan adopted without deliberation | Run independent extraction, cross-critique, and reconciliation |
| **Strategy Overload** | >3 seats creates noise, not signal | Max 3. More seats are staged as follow-up validation |
| **Out-of-scope File Modification** | Council write authority is limited to `ai-council/**` | Persist council artifacts only. User or another agent executes code/spec changes |
| **Ignoring Low Scorers** | Low-scoring seats may have valuable partial insights | Score everything, cherry-pick good elements |
| **Recursive Council** | Nesting the council inside itself creates infinite loops | Multi-AI Council is a planning leaf, no self-recursion |
| **No Context Loading** | Deliberation without evidence produces hallucinated plans | ALWAYS run PREPARE before DIVERSIFY |
| **Convergence Sycophancy** | All seats artificially agree, masking real trade-offs | Run cross-critique when scores are close or plans converge |
| **External Vantage Overclaim** | Implies a tool or AI participated when it did not | Label unavailable external systems as simulated vantage lenses |

---

## 3. DETECTION CUES

Operators can spot anti-patterns from the report structure.

Red flags:

- identical opening sentences across seats;
- no critical seat;
- no seat with assumption-challenge mandate;
- no comparison table;
- no Pre-Critique or Post-Critique rows in the comparison table;
- all seats have the same confidence without explanation;
- missing `simulated:` labels for unavailable external vantages;
- no dropped-alternative section;
- no attribution for final plan elements;
- report recommends before describing deliberation;
- no timeout/error rows even though dispatch was incomplete;
- council writes outside `ai-council/**`;
- Depth 1 dispatches sub-agents;
- root cause claims lack file or packet evidence.

Structural cue:

```text
If the report could be produced by one ordinary analysis pass, the council did not add enough deliberative value.
```

---

## 4. RECOVERY ACTIONS

Recover as soon as an anti-pattern is detected.

### Re-Dispatch With Stronger Contrarian Framing

Use when:

- plans converge too quickly;
- all scores are close;
- no seat attacked assumptions.

Action:

```text
Re-run the weakest or most redundant seat with a mandate to find the strongest failure mode in the leading plan.
```

### Halt And Reframe

Use when:

- all seats fail;
- every plan scores low;
- required context is missing;
- scope is unclear.

Action:

```text
Stop synthesis, report the gap, and ask for narrower requirements or source evidence.
```

### Escalate

Use when:

- two high-scoring plans contradict each other;
- missing external vantage is material;
- the council cannot satisfy minimum diversity;
- an out-of-scope write was attempted.

Action:

```text
ESCALATION: Council cannot safely choose without user or orchestrator decision.
```

### Repair The Report

Use when:

- scoring exists but attribution is missing;
- simulated labels were omitted;
- low-scoring seats were dropped silently.

Action:

- add attribution;
- restore dropped alternatives;
- add simulated-vantage labels;
- add post-critique adjustment rationale.

---

## 5. CROSS-REFERENCES

- Agent body: `.opencode/agents/ai-council.md` §11 ANTI-PATTERNS.
- Scoring rubric: `../scoring/scoring_rubric.md`.
- Seat diversity: `seat_diversity_patterns.md`.
- Depth dispatch: `../convergence/depth_dispatch.md`.
- Failure handling: `../convergence/failure_handling.md`.
