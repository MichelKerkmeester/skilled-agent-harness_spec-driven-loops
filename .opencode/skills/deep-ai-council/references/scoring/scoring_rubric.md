---
title: "AI Council Scoring Rubric"
description: "Five-dimension scoring, deliberation rounds, adversarial critique, conflict resolution, and attribution rules for AI Council synthesis."
trigger_phrases:
  - "deep-ai-council scoring rubric"
  - "five-dimension council scoring"
  - "hunter skeptic referee"
  - "council comparison table"
importance_tier: "normal"
contextType: "reference"
---

# AI Council Scoring Rubric

Use this reference when synthesizing council seats into a scored, attributed planning recommendation. It mirrors the agent body synthesis protocol.

---

## 1. OVERVIEW

Subjective picking is the failure mode this rubric prevents.

A AI Council run should not adopt the first plausible plan, the most familiar plan, or the plan with the most confident language. It should score every returned seat against the same planning rubric, run cross-critique when disagreement is close or suspiciously absent, and compose a final plan from supported elements.

This reference applies to planning-only council synthesis.

The council:

1. receives multiple distinct seat proposals;
2. extracts each proposal independently;
3. scores each proposal with the same dimensions;
4. critiques the leading plan adversarially;
5. resolves conflicts without fabricating convergence;
6. attributes every final plan element to the seat that contributed it.

The scoring output belongs in the Multi-AI Council Report comparison table and in any persisted deliberation artifact. The score is not a popularity vote. It is an auditable planning judgment based on evidence, risk, completeness, and fit.

Core principle:

```text
Principled scoring beats repeated intuition.
```

Use the score to clarify trade-offs. Do not use it to hide unresolved contradictions.

---

## 2. THE 5-DIMENSION RUBRIC

Score every usable council seat out of 100 points.

| Dimension | Weight | Description | Scoring Guide |
| --- | --- | --- | --- |
| Correctness | 30% | Solves the stated problem completely | 30=perfect, 20=mostly, 10=partial, 0=wrong |
| Completeness | 20% | Edge cases handled, all requirements met | 20=all covered, 15=most, 10=some, 0=minimal |
| Elegance | 15% | Simple, clean, maintainable | 15=exemplary, 10=good, 5=acceptable, 0=poor |
| Robustness | 20% | Error handling, performance, security | 20=bulletproof, 15=solid, 10=adequate, 0=fragile |
| Integration | 15% | Fits existing codebase patterns and workflow constraints | 15=no friction, 10=compatible, 5=minor friction, 0=conflicts |

Operator checks:

- Does the plan answer the original request?
- Does it cover requirements, edge cases, and verification?
- Does it avoid unnecessary complexity?
- Does it handle failure, performance, security, and recovery concerns when relevant?
- Does it fit existing codebase and workflow constraints?

### Recommended Comparison Table Shape

| Seat | Correctness /30 | Completeness /20 | Elegance /15 | Robustness /20 | Integration /15 | Total /100 | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Seat A |  |  |  |  |  |  |  |
| Seat B |  |  |  |  |  |  |  |
| Seat C |  |  |  |  |  |  |  |

Timeout or error rows should remain visible but excluded from scored totals.

Example:

| Seat | Correctness /30 | Completeness /20 | Elegance /15 | Robustness /20 | Integration /15 | Total /100 | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Critical Seat | 24 | 16 | 10 | 19 | 12 | 81 | Strong risk handling, moderate complexity |
| Pragmatic Seat | 25 | 13 | 14 | 13 | 14 | 79 | Simple plan, weaker failure handling |
| Research Seat | TIMEOUT | N/A | N/A | N/A | N/A | N/A | Excluded from scored totals |

---

## 3. MULTI-ROUND DELIBERATION

Do not recommend after the first plausible answer.

Run at least two deliberation passes before any recommendation:

1. Round 1: Independent Extraction.
2. Round 2: Cross-Critique.
3. Round 3: Consensus Reconciliation when required.

### Round 1: Independent Extraction

Summarize each seat without merging.

Extract:

- proposed plan;
- key evidence;
- assumptions;
- confidence;
- risks and trade-offs;
- alternative challenged.

Rules:

- Preserve each seat's distinct lens.
- Do not smooth away disagreement.
- Do not promote a plan because it appears first.
- Do not treat repeated phrasing as consensus.

Output pattern:

| Seat | Proposed Plan | Key Evidence | Assumptions | Confidence |
| --- | --- | --- | --- | --- |
| Analytical |  |  |  |  |
| Critical |  |  |  |  |
| Pragmatic |  |  |  |  |

### Round 2: Cross-Critique

Have each seat's strongest concern attack the leading plan.

Identify:

- evidence-backed criticisms;
- preference-only criticisms;
- missing context;
- ignored failure modes;
- assumptions that carry too much weight.

The critique should be adversarial but fair. A trade-off is not automatically a flaw.

### Round 3: Consensus Reconciliation

Run reconciliation when any of these are true:

- scores are within 15 points;
- assumptions conflict;
- the leading plan has unresolved high-severity risk;
- all seats propose essentially the same approach;
- one assumption carries the whole plan.

Reconciliation outcomes:

- merge compatible elements;
- adopt a clear winner with documented rationale;
- present unresolved alternatives with trade-offs;
- escalate if contradiction remains.

---

## 4. ADVERSARIAL CROSS-CRITIQUE (HUNTER / SKEPTIC / REFEREE)

Adversarial cross-critique counters convergence bias and shallow consensus.

It is required when:

- strategies are within 15 points after initial scoring;
- all seats propose the same approach;
- a single assumption carries the plan.

Skip only when one seat leads by 25+ points and no critical risk is unresolved.

### HUNTER

The Hunter attacks Seat A while wearing Seat B's lens.

Prompt:

```text
What weakness does Seat A miss that Seat B would catch?
```

The Hunter looks for:

- ignored edge cases;
- hidden operational risk;
- missing dependencies;
- weak evidence;
- incorrect assumptions;
- places where another lens has stronger coverage.

### SKEPTIC

The Skeptic defends Seat A from the Hunter.

Prompt:

```text
Is this a real weakness or an intentional trade-off?
```

The Skeptic distinguishes:

- genuine flaws;
- acceptable simplifications;
- scope-controlled omissions;
- preference-only objections;
- risks already mitigated by the plan.

### REFEREE

The Referee adjusts scores after Hunter and Skeptic arguments.

Rules:

- For each undefended weakness, reduce 1-3 points.
- For a defended trade-off, keep the score stable.
- For a newly surfaced strength, allow a modest increase.
- Maximum total adjustment is +/-10 points per seat.
- Document adjustments in the comparison table.

### Comparison Table Treatment

Include both pre-critique and post-critique rows.

| Seat | Stage | Correctness /30 | Completeness /20 | Elegance /15 | Robustness /20 | Integration /15 | Total /100 | Adjustment Rationale |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Seat A | Pre-Critique |  |  |  |  |  |  | Initial score |
| Seat A | Post-Critique |  |  |  |  |  |  | Hunter found an undefended failure mode |
| Seat B | Pre-Critique |  |  |  |  |  |  | Initial score |
| Seat B | Post-Critique |  |  |  |  |  |  | Skeptic defended the simplicity trade-off |

### Consensus Check

If all seats score within 5 points and propose essentially the same plan, flag potential convergence sycophancy.

Ask:

```text
Are these genuinely the same good idea, or did the council fail to diversify?
```

If convergence is genuine:

- note the shared evidence;
- explain why independent seats reached the same plan;
- keep simulated-vantage labels visible.

If convergence is artificial:

- re-run the weakest seat with stronger contrarian framing; or
- report insufficient diversity and reduce confidence.

---

## 5. CONFLICT RESOLUTION MATRIX

Use this matrix after scoring and critique.

| Scenario | Action |
| --- | --- |
| Clear winner (>15 point lead) | Adopt winner, note alternatives |
| Close race (<10 point spread) | Merge best elements from top 2 |
| All low scores (<50) | Escalate: task may need reframing |
| Contradictory approaches | Present both to user with trade-off analysis |
| Strategy timeout/failure | Score remaining seats, note incomplete data |
| Simulated external vantage only | Label it as simulated; do not imply external execution |

Close races merge only elements that improve the plan without bloating it. All-low-score rounds escalate for reframing. Timeout rows remain visible as `TIMEOUT (N/A)` and are excluded from scored totals. Simulated external vantages must be labeled as simulated unless the CLI or native agent actually executed.

---

## 6. ATTRIBUTION RULES

Every final plan element needs provenance.

Attribution tells the reader which seat contributed each part and why it survived synthesis.

### Required Attribution Points

Attribute the recommended plan, validation steps, risk mitigations, dropped alternatives, unresolved trade-offs, assumptions, and confidence rationale.

### Plan Element Pattern

Use this pattern:

```text
- <Plan element> - contributed by <Seat>, strengthened by <Seat>, retained because <reason>.
```

Example:

```text
- Keep the change documentation-only - contributed by Pragmatic Seat, reinforced by Critical Seat, retained because the request names no runtime behavior change.
```

### Seat Labeling

Use stable labels: Analytical Seat, Creative Seat, Critical Seat, Pragmatic Seat, Holistic Seat, and Research Seat.

When a real external vantage ran, cite it:

```text
Analytical Seat via cli-codex
```

When it did not run, label it:

```text
Analytical Seat, simulated cli-codex lens
```

### Simulated-Vantage Preservation

Preserve simulated labels in council composition, seat summaries, comparison tables, attribution notes, and final confidence.

Missing external participation can reduce confidence when the absent vantage was material.

### Dropped Alternative Attribution

Do not erase lower-scoring seats.

Record:

- seat name;
- total score;
- one-line approach;
- why it was dropped;
- any useful element retained.

Example:

| Dropped Seat | Score | Approach | Reason Dropped | Retained Element |
| --- | ---: | --- | --- | --- |
| Creative Seat | 68 | Broader redesign | Too much scope for packet | Naming idea reused in docs |

---

## 7. CROSS-REFERENCES

- Agent body: `.opencode/agents/ai-council.md` §6 SYNTHESIS PROTOCOL.
- Output schema: `../structure/output_schema.md` §4 Seat Section Fallback.
- Council signals: `../convergence/convergence_signals.md`.
- Seat diversity: `../patterns/seat_diversity_patterns.md`.
- Failure handling: `../convergence/failure_handling.md`.
