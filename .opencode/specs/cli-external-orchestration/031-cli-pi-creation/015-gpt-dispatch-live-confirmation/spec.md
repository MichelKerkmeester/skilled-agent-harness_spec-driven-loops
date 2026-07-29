---
title: "Feature Specification: Confirm the cli-pi GPT-5.6 dispatch invocation from a live run"
description: "Resolve the pi-contract track's open live-dispatch item: document the confirmed openai-codex/gpt-5.6-* + --thinking invocation."
trigger_phrases:
  - "pi gpt dispatch confirmation"
  - "cli-pi gpt-5.6 invocation"
importance_tier: "important"
contextType: "implementation"
parent: "cli-external-orchestration/031-cli-pi-creation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Confirm The cli-pi GPT-5.6 Dispatch Invocation From A Live Run

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | cli-external-orchestration/031-cli-pi-creation/015-gpt-dispatch-live-confirmation |
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The pi-contract reference `model-dispatch-gpt-5.6.md` carried an OPEN EXECUTION ITEM: it documented the
GPT-5.6 ids from an operator screenshot but marked the reasoning-effort and service-tier syntax
UNCONFIRMED, pending a live authenticated dispatch. A real sk-design recall investigation dispatched
`gpt-5.6-luna` through cli-pi and produced that missing evidence, so the doc could assert the actual
invocation instead of a gap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `cli-pi/references/model-dispatch-gpt-5.6.md`: replace the UNCONFIRMED effort/tier sections and the open execution item with the confirmed invocation.
- `cli-pi/SKILL.md`: update the reference pointer and add a GPT-5.6 row to the headless-modes table.

### Out of Scope
- The deep-loop fan-out cli-pi executor (its command builder still throws by design; a separate, larger runtime change).
- sol/terra tiers, which stay picker-confirmed but not yet live-dispatched.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The confirmed invocation is documented | model-dispatch-gpt-5.6.md shows the provider-qualified id + --thinking, no UNCONFIRMED effort claim |
| REQ-002 | The provider-qualification gotcha is captured | The bare-id / wrong-provider / exit-0 failure is stated with the exit-code guard cross-ref |
| REQ-003 | The SKILL.md surfaces it | The headless-modes table carries a GPT-5.6 dispatch row |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A reader can call a GPT-5.6 model through cli-pi from the docs alone: provider-qualified id, `--thinking` for effort, and the exit-code caveat, all confirmed by the live run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| The confirmed invocation is model-specific and may not hold for sol/terra | Only the luna row is marked live-confirmed; sol/terra stay picker-confirmed |

**Dependencies:** the live dispatch evidence from the sk-design recall investigation.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Whether the deep-loop fan-out cli-pi executor should now be implemented, since the headless contract is confirmed (its command builder currently throws by design).
<!-- /ANCHOR:questions -->
