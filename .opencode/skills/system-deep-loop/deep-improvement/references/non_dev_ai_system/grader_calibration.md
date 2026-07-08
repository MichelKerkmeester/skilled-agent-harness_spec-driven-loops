---
title: "Lane D Grader Calibration"
description: "The calibration protocol for independent graders: different-family requirement, calibrate.py two-grader agreement flow, the recorded first calibration, phantom-gap tracking, and the strict-JSON grader reply contract."
trigger_phrases:
  - "lane d grader calibration"
  - "different-family grader requirement"
  - "two-grader agreement flow"
  - "phantom-gap tracking"
  - "strict-json grader reply"
importance_tier: normal
contextType: implementation
version: 1.17.0.3
---

# Lane D Grader Calibration

The calibration protocol that keeps independent grades trustworthy. A grader that drifts or disagrees with its calibration baseline produces promotion decisions that are no better than self-scoring.

---

## 1. OVERVIEW

### Purpose

Provides the calibration protocol for independent graders in Lane D packagings, ensuring grades remain trustworthy across model changes and iterations.

### When to Use

- Setting up a new grader model
- Validating grader agreement after a model change
- Diagnosing phantom-gap drift or reward-hacking signals

### Core Principle

A grader that drifts or disagrees with its calibration baseline produces promotion decisions that are no better than self-scoring.

---

## 2. DIFFERENT-FAMILY REQUIREMENT

The grader must be a different model family from whatever produced the outputs. The loop checks `GRADER_MODEL` against `PROPOSER_FAMILY` substring and raises a kill-switch on a match (e.g. a deepseek grader for a deepseek proposer).

This is a hard gate, not a preference. Same-family graders inherit the proposer's biases and blind spots, defeating the purpose of independent evaluation.

Hard rules (banned vocabulary, structural rules) are checked by a deterministic code linter (`benchmark/grader/deterministic_lint.py`), never by a model.

---

## 3. CALIBRATE.PY TWO-GRADER AGREEMENT FLOW

`calibrate.py` runs two independent graders over the same gold outputs and measures their agreement:

- **PROCEED** — mean absolute disagreement <= 2.0 of 25. The grader is trustworthy.
- **RECALIBRATE** — mean absolute disagreement above 2.0 of 25. The grader has drifted. Recalibrate before trusting new grades.
- **UNMEASURABLE** — n=0 gold outputs available. Cannot assess agreement.

Run `calibrate.py` whenever the grader model changes. The gold set must be version-locked and outside any tree the loop can write.

---

## 4. THE RECORDED FIRST CALIBRATION

The first calibration recorded in the pilot: MiMo (the proposer) vs an independent Claude read. Mean absolute disagreement was approximately 1.0 of 25, well within the PROCEED threshold.

This baseline establishes that the two-grader agreement flow works and that a different-family grader produces stable, low-disagreement grades.

---

## 5. PHANTOM-GAP TRACKING

Wherever the system under test self-reports a score, record `self_score` vs the independent score and their gap per fixture. In Lane D this is `phantom_gap` in the loop journal.

A widening phantom gap is a reward-hacking signal. The convergence check requires the phantom gap to be shrinking (or stable) for the loop to continue. If the gap widens while the independent score holds steady, the proposer is learning to game the self-score without real improvement.

---

## 6. STRICT-JSON GRADER REPLY CONTRACT

Grader replies follow a strict-JSON contract: single-line JSON, no fences, no commentary. The expected shape:

```json
{"M": 3, "E": 7, "Q": 5, "T": 3, "D": 2, "total": 20, "floors_met": true, "notes": "one short line"}
```

Parsers stay tolerant and record explicit `grader_error` values. An auth failure must be diagnosable from the record, not parsed as a zero score (teaching T11).

---

## 7. HVR_VIOLATIONS OBSERVABILITY

The deterministic linter (`deterministic_lint.py`) checks graded output against the packaging's hard-blocker words and patterns. Violations are recorded as `hvr_violations` in the grade record.

A hard-blocker lint failure on the CANDIDATE'S held-out output is a hard kill-switch: the loop halts without promoting. (Lint failures on visible-benchmark output are recorded in the grade records and depress the score, but do not halt.) This catches cases where the proposer introduces banned vocabulary into technique docs that then bleed into generated output.

---

## 8. GOLD-SET MAINTENANCE

- A gold set anchors the grader, not the proposer.
- Keep gold outputs and target scores version-locked outside any tree a loop can write.
- Re-score the gold set whenever the grader model changes.
- Disagreement beyond about 2 of 25 (or 8 of 100) means recalibrate before trusting new grades.
- Gold fixtures are never optimized against. They are calibration anchors only.

---

## 9. RELATED RESOURCES

- [loop_contract.md](./loop_contract.md) — the formal benchmark/_loop/loop.py contract
- [guardrails_teachings.md](./guardrails_teachings.md) — T1 (self-scores unsafe), T3 (different-family grader), T11 (auth probes)
- [fixture_authoring.md](./fixture_authoring.md) — gold-set authoring rules
- [operator_guide.md](./operator_guide.md) — conformance checklist and invocation
