---
title: "Deep AI Council Failure Handling"
description: "Timeout, all-seat failure, contradiction, insufficient vantage diversity, and state-log treatment rules for Deep AI Council runs."
trigger_phrases:
  - "deep-ai-council failure handling"
  - "council seat timeout"
  - "all seats fail"
  - "contradiction without resolution"
  - "insufficient vantage diversity"
importance_tier: "normal"
contextType: "reference"
---

# Deep AI Council Failure Handling

Council failures are first-class planning signals. Record them honestly instead of fabricating convergence.

---

## 1. OVERVIEW

The council is allowed to fail.

A failed seat, timeout, unresolved contradiction, or missing external vantage is not an excuse to invent a confident plan. It is evidence that the synthesis must continue with reduced confidence, escalate to the user, or roll back an unsalvageable round.

Failure handling protects:

- auditability;
- user trust;
- planning quality;
- state-log integrity;
- future resume behavior.

```text
Never fabricate convergence.
```

Failure handling applies during:

- seat dispatch;
- sequential inline deliberation;
- scoring;
- conflict resolution;
- persistence;
- rollback;
- resume.

---

## 2. COUNCIL SEAT TIMEOUT

A timeout means one seat did not return in the expected window.

Do not silently remove it from the report.

### Depth 0 Behavior

At Depth 0:

- continue with remaining seats if at least two usable seats returned;
- mark the timed-out seat in the comparison table;
- exclude the timed-out seat from scored totals;
- lower confidence if the missing lens was material.

Minimum quorum:

```text
N >= 2 usable seats
```

If fewer than two usable seats remain, treat the round as failed and escalate or roll back.

### Depth 1 Behavior

At Depth 1:

- skip the timed-out lens;
- note the skipped lens in deliberation notes;
- keep the sequential thinking trace honest;
- do not claim that lens participated.

Depth 1 does not get a free pass to pretend every lens completed. It should still record missing coverage.

### Comparison Table Treatment

Represent timeout rows explicitly:

| Seat | Status | Correctness /30 | Completeness /20 | Elegance /15 | Robustness /20 | Integration /15 | Total /100 | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Analytical Seat | ok |  |  |  |  |  |  |  |
| Critical Seat | ok |  |  |  |  |  |  |  |
| Research Seat | TIMEOUT | N/A | N/A | N/A | N/A | N/A | N/A | Excluded from scored totals |

Required phrase:

```text
<Seat>: TIMEOUT (N/A)
```

### Scored Totals

Timeout rows:

- are visible;
- are not scored;
- do not count toward average totals;
- may affect confidence qualitatively.

---

## 3. ALL SEATS FAIL

If all seats fail or return unusable results, stop.

Do not fabricate a plan.

Required report language:

```text
All council seats failed. Task may need reframing.
```

Include:

- each seat name;
- intended lens;
- intended vantage;
- status;
- failure reason;
- whether any partial evidence is salvageable.

Escalate with reformulation.

All-seat failure should not produce a normal `council_complete` with convergence `true`.

If artifacts were written for a failed round, follow rollback treatment in Section 6.

---

## 4. CONTRADICTION WITHOUT RESOLUTION

Contradiction without resolution happens when two high-scoring seats produce incompatible plans.

Threshold:

```text
Two seats score >70 and recommend contradictory solutions.
```

Rules:

- do not pick arbitrarily;
- do not average the contradiction away;
- do not hide one plan because the other is easier;
- present both plans with trade-off analysis;
- ask the user to choose based on priorities.

Required marker:

```text
ESCALATION: Contradictory high-confidence council recommendations require user decision.
```

The report should include both plans, evidence for each, risk for each, what priority chooses each option, and a recommended user decision question.

---

## 5. INSUFFICIENT VANTAGE DIVERSITY

The council seeks distinct AI-system or native-agent vantages when available.

Sometimes the runtime cannot provide real external participation.

When that happens:

- proceed with lens diversity only if the task can still be planned safely;
- label unavailable external targets as simulated;
- reduce confidence when missing real external participation is material;
- do not claim that an external CLI or AI system participated.

Honest labels:

```text
simulated cli-codex lens
simulated cli-opencode lens
native inline Research lens
```

Unsafe claims:

```text
cli-codex recommended...
cli-opencode confirmed...
Claude Code found...
```

unless those tools actually ran.

Proceed with lens diversity only when local source evidence is sufficient and missing external vantages do not control the outcome. Escalate when external facts are central, no lens can challenge the default plan, all seats converge without evidence, or the user explicitly required real external AI participation.

---

## 6. STATE LOG TREATMENT FOR FAILURES

Failures belong in `ai-council-state.jsonl`.

State rows preserve what happened so resume and audit can reason from facts.

### Seat Failure Events

Use `seat_returned` rows with failure status:

```jsonl
{"event":"seat_returned","round":1,"seat":"seat-002","timestamp":"<ISO>","status":"timeout"}
{"event":"seat_returned","round":1,"seat":"seat-003","timestamp":"<ISO>","status":"error"}
```

Status values:

- `ok`;
- `timeout`;
- `error`.

Timeout and error rows are not scored but remain part of round history.

### Rollback Events

When a round is unsalvageable, append a `rollback` event.

Unsalvageable means:

- fewer than two usable seats remain;
- all seats fail;
- artifacts were written for a failed round;
- convergence cannot be trusted after max rounds;
- a persistence step produced partial artifacts that should be superseded.

Rollback row shape:

```jsonl
{"event":"rollback","round_id":"round-001","reason":"seat quorum failed","timestamp":"<ISO>","supersedes":["seats/round-001/seat-001-cli-codex.md"]}
```

After rollback, move failed round artifacts into:

```text
ai-council/failed/round-NNN-<timestamp>/
```

Then append `artifact_superseded` rows for artifacts from that round.

---

## 7. CROSS-REFERENCES

- Agent body: `.opencode/agents/deep-ai-council.md` §10 FAILURE HANDLING and §17 ROLLBACK FOR OPERATORS.
- State format: `state_format.md`.
- Scoring rubric: `scoring_rubric.md`.
- Convergence signals: `convergence_signals.md`.
- Folder layout: `folder_layout.md`.
