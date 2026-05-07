---
title: "Multi-AI Council Seat Diversity Patterns"
description: "Lens combinations and vantage targets for diverse Multi-AI Council seats."
trigger_phrases:
  - "multi-ai-council seat diversity"
  - "council lens combinations"
  - "council vantage targets"
  - "council diversity requirement"
importance_tier: "normal"
contextType: "reference"
---

# Multi-AI Council Seat Diversity Patterns

Each round uses at most 3 seats. The goal is useful disagreement, not more copies of the same answer.

---

## 1. OVERVIEW

| Task Type | Recommended Lenses | Why |
| --- | --- | --- |
| Bug fix | analytical + critical + pragmatic | Finds cause, pressure-tests failure modes, keeps the fix small |
| Feature | creative + analytical + holistic | Explores shape, decomposes implementation, checks system fit |
| Refactor | holistic + pragmatic + critical | Protects architecture, limits churn, exposes regression risk |
| Architecture | analytical + critical + holistic | Names trade-offs, challenges assumptions, checks long-range fit |
| Research | research + critical + creative | Gathers evidence, tests source quality, opens alternative paths |

---

## 2. VANTAGE TARGETS

Prefer distinct executor or AI-system vantages where available:

- `cli-codex`
- `cli-copilot`
- `cli-gemini`
- `cli-claude-code`
- native `@deep-research`

Unavailable vantages may be simulated only when clearly labeled as simulated. Do not imply an external AI participated when it did not.

---

## 3. DIVERSITY REQUIREMENT

At least one seat must challenge assumptions, missing context, failure modes, or the likely default plan. If all seats agree immediately, run the cross-critique pass before declaring convergence.

Max 3 seats per round. More than 3 seats is staged as follow-up validation, not a wider first round.

Cross-references:
- Agent body: `.opencode/agent/multi-ai-council.md` §3 and §16
- Decision record: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md` ADR-001
