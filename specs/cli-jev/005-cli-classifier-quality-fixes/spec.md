---
title: "Feature Specification: cli-classifier quality fixes"
description: "Fixes the required findings from the cli-classifier quality research: five cli-jev docs without an Overview, a backwards transport sentence, a caller that records Pi answers as Jev, two transport edge cases and three stale doc lines."
trigger_phrases:
  - "cli-classifier quality fixes"
  - "cli-jev overview fix"
  - "clarify-default transport record"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli-classifier quality fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research in `specs/cli-jev/004-cli-classifier-quality-research/research/research.md` confirmed eleven findings in the shipped cli-classifier work. Five cli-jev docs fail the blocking doc validator, the hub `SKILL.md` describes the transport default backwards, `score-clarify-default.cjs` records Pi answers as Jev, two transport edge cases have no guard or test, and three docs carry stale lines.

### Purpose
Every required finding is fixed and proven by the validator or a failing-first test, with no suite count going down.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an Overview section to the four `cli-jev/references/*.md` files and `cli-jev/assets/question-shaping-card.md` (CQ-01).
- Correct the transport sentence in the hub `SKILL.md` and resync the Hermes copy (CQ-02).
- Record the answering `transport` in `score-clarify-default.cjs` call records, with a test (CQ-03).
- Guard `choiceRequestFrom` against a missing question and default `spawnClassifierCall` `env` to `process.env`, each with a test (CQ-04, CQ-05).
- Rewrite `shared/README.md`, fix the 41-case count and the 0.75 review band (CQ-06, CQ-07, CQ-08, CQ-12).

### Amendment (operator, 2026-10-04: "fix optionals")
- Narrow the hub keywords so a prompt that only says "score" stops reaching cli-classifier, and drop the resolved advisor divergence entry (CQ-11).
- Add the `jev` install step to the hub README and SKILL (CQ-10).
- Check the latest live injection screen run into `benchmark/reports/` and index it.
- Release hub `v0.8.0.0` with a changelog entry and current metadata dates (CQ-09).

### Out of Scope
- New live classifier calls. The report curates a run that already exists.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/cli-jev/references/*.md`, `cli-jev/assets/question-shaping-card.md` | Modify | Overview sections |
| `.skilled/skills/cli-classifier/SKILL.md`, `.hermes/skills/cli-classifier/SKILL.md` | Modify | Transport default sentence |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` and its test | Modify | Transport field in call records |
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` and its test | Modify | Question guard and env default |
| `.skilled/skills/cli-classifier/shared/README.md`, `benchmark/pi-transport/tests/README.md`, the 049 004 implementation summary | Modify | Stale lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The five cli-jev docs pass the doc validator | `validate_document.py` reports no blocking error on each |
| REQ-002 | Call records name the route that answered | A failing-first test asserts `transport` in `calls.jsonl` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The transport edge cases are guarded | Two failing-first tests pass after the fix |
| REQ-004 | No regression | Every suite in the baseline run keeps or raises its pass count |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every required finding is closed with the evidence named in its requirement.
- **SC-002**: A read-only Luna review of the diff finds no open P0 or P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash max on cli-pi through OpenCode Go | Code fixes stall | The orchestrator writes the fix and Luna reviews it |
| Risk | Renumbering the reference sections breaks a section citation | Low | Search for section citations before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


