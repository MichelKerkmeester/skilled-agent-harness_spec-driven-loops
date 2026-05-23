---
title: "AI Council Convergence Signals"
description: "Convergence rules and escape hatches for AI Council planning rounds."
trigger_phrases:
  - "deep-ai-council convergence"
  - "two-of-three-agree"
  - "council escape hatches"
  - "council validator graduation"
importance_tier: "normal"
contextType: "reference"
---

# AI Council Convergence Signals

This reference defines the lightweight v1 convergence signal and the conditions that prevent a council round from being called converged.

---

## 1. OVERVIEW

Use `two-of-three-agree` for v1. If 2 of 3 seats endorse essentially the same plan and cross-critique produces no new high-severity findings, declare convergence and write `council-report.md`.

Agreement means the seats align on the material plan: implementation order, core risks, dependencies, and acceptance criteria. They do not need identical wording.

---

## 2. ESCAPE HATCHES

`max_rounds` reached without convergence: emit `council_complete` with `convergence:false`, preserve the competing plans, and recommend a user decision.

All seats fail in a round: do not fabricate convergence. Report the failed round with each seat status and ask for reframing or more context.

Single-seat endorsement: insufficient diversity. Re-run with stronger contrarian framing or a different vantage mix before calling the plan converged.

---

## 3. WHY SIMPLE FOR V1

ADR-001 keeps the convention lightweight. Sophisticated convergence math is non-goal N1 because the packet needs auditable output persistence, not a deep-skill state machine.

---

## 4. VALIDATOR GRADUATION

State schema and convergence fields are convention-only for v1. If drift appears in real council artifacts, graduate to a typed validator in a follow-on packet.

Cross-references:
- Agent body: `.opencode/agents/deep-ai-council.md` §16
- Decision context: local doctor command ADRs ADR-001 and ADR-003

---

## Convergence Threshold Semantics

**Default:** 0.20 (proposed) on adjudicator-verdict stability across rounds

**Semantic:** the deep-ai-council threshold scores per-topic Round-N -> Round-N+1 verdict deltas from the adjudicator. Lower = more rounds / higher stability threshold.

**NOT INTERCHANGEABLE with siblings:**
- `deep-review` uses 0.10 default on weighted P0/P1/P2 severity ratio
- `deep-research` uses 0.05 default on newInfoRatio (negative-knowledge emphasis)

Carrying threshold expectations across siblings will cause unexpected iteration counts. See 130 research at `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/research.md` §2 F56/F78, §5 Recommendation, and §6 Parity Invariants.
