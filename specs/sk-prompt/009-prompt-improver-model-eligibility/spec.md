---
title: "Feature Specification: Restrict which models may act as the prompt-improve agent"
description: "The prompt-improve surface accepts any model the caller happens to be running, and nothing records which models the operator considers fit for it. This packet writes a route-scoped eligibility contract into the two surfaces a prompt-improve run can enter through."
trigger_phrases:
  - "prompt improver model eligibility"
  - "which model may act as prompt-improve"
  - "opus fable never eligible prompt improver"
  - "luna eligible through cli-codex only"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Restrict which models may act as the prompt-improve agent

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Whichever model a session happens to be running becomes the prompt-improve agent when
`@prompt-improver` is dispatched, and whichever model is running becomes the prompt
improver when `sk-prompt` is invoked inline. The operator holds a view about which model
families are fit for that work and which are not, and that view was recorded nowhere: not
in the agent definition, not in the skill, not in the command that routes to both.

### Purpose

The eligibility contract is written where both readers of it can see it — the model about
to act as the agent, and the caller about to choose one — so an ineligible model refuses
and an eligible route is named in its place.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The eligibility contract itself: the denied list, the allowed routes, the precedence between them, and the refusal behavior.
- Its placement in the canonical agent definition, and its propagation to every runtime mirror.
- Its placement in `sk-prompt`, the skill a caller can invoke without going through the agent.

### Out of Scope

- Machine enforcement (a validator, hook, or gate that rejects an ineligible dispatch) — no model-identity signal exists at dispatch time in any of the six runtimes, so a machine check would have nothing to read. The contract is enforced by the two readers who *can* observe model identity: the model itself, and the human or agent choosing it.
- The `/prompt:improve` command surface — it selects a dispatch *mode*, never a model (verified: no `model` token in either workflow YAML or the presentation contract), so it reaches the contract through whichever of the two in-scope surfaces it routes to.
- Every other agent under `.opencode/agents/` — the restriction was stated for the prompt-improve surface only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/prompt-improver.md` | Modify | Canonical home of the contract: new `## 0.1` hard-block section |
| `.claude/agents/prompt-improver.md` | Modify | Runtime mirror; body must carry the same tokens or the commit gate blocks |
| `.pi/agents/prompt-improver.md` | Regenerate | Generated from the canonical by `sync-agents-pi.cjs` |
| `.opencode/skills/sk-prompt/SKILL.md` | Modify | Caller-facing copy of the contract in the agent-invocation section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Opus and Fable are never eligible, by any route | Both named in a denied list that no allowance clause can reopen |
| REQ-002 | Eligible: Sonnet natively or through `cli-claude-code`; GPT Luna through `cli-codex`; any non-Luna model through `cli-pi` or `cli-opencode` | All four clauses present, route-scoped, in both surfaces |
| REQ-003 | The Luna asymmetry survives implementation | Luna allowed under the `cli-codex` row and denied under the `cli-pi` / `cli-opencode` row, with a note that this is deliberate |
| REQ-004 | The contract reaches a live caller, not just a file | A dispatch of the live agent surface reports the rule; the same probe reported its absence before the change |
| REQ-005 | The four runtime mirrors stay in sync | `check-agent-mirror-sync.cjs` and the mirror-parity checks pass on the working tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | A model outside every listed clause is not silently admitted | Default-deny stated explicitly, so the allowance list reads as closed |
| REQ-007 | One surface is named canonical so a future edit has one place to land | `sk-prompt` points at the agent definition as the source |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh` on this folder prints `RESULT: PASSED`.
- **SC-002**: The agent-mirror gate reports all mirrors in sync after the edit.
- **SC-003**: A live `@prompt-improver` dispatch quotes the denied list back, where the identical pre-change probe returned "NO MODEL-ELIGIBILITY RULE PRESENT".
- **SC-004**: An independent reviewer confirms all four eligibility clauses and the precedence rule are present and faithful in both surfaces.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The contract lives verbatim in two files and can drift | Med | One file named canonical; the other points at it and says so in its own text |
| Risk | A self-enforced rule depends on the model reading its own instructions | Med | Stated as a hard block next to the existing nesting/write hard block, which the same surface already enforces the same way |
| Dependency | `sync-agents-pi.cjs` regenerates the Pi mirror | Low | Script is committed and run as part of the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Default-deny was chosen for models named in no clause (Haiku natively, GPT SOL through `cli-codex`). The operator stated an allowed list and an absolute denied list, and a closed allowance is the conservative reading; an open one would let any unnamed model act. Reversible in one edit if the operator meant otherwise.
<!-- /ANCHOR:questions -->

---
