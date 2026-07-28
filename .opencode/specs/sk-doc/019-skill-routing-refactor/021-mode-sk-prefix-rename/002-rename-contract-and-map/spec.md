---
title: "Feature Specification: Freeze the rename contract and map"
description: "One frozen contract and machine-readable map: 21 workflowModes, 20 packet directories, the shared-packet exception, gate definitions and history exclusions."
trigger_phrases:
  - "rename contract freeze"
  - "sk rename map"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Freeze the rename contract and map

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/002-rename-contract-and-map |
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Executor** | GPT-5.6-LUNA xhigh (cli-codex) authored the contract; orchestrator added section 8 amendments during execution |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Twenty directories and twenty-one keys renamed across four hubs by three different models cannot
stay consistent by memory. The contract fixes the map, the per-hub gates, the history exclusions
and the division of labor before anything moves, and records falsified assumptions as numbered
amendments instead of silent drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `contract.md` — rename rules, gates, exclusions, execution order, section 8 amendments.
- `../assets/rename-map.json` — the frozen machine-readable map.

### Out of Scope
- Any rename execution (phases 003-006).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Map is frozen before execution | Committed before any hub commit |
| REQ-002 | Routing keys adopt directory names | Single exception documented: sk-create-skill-parent shares packet sk-create-skill |
| REQ-003 | Gates defined per hub | Pre-rename Lane C verdicts and the 84-entry link baseline captured |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Contract and map committed (6645d48d6a) before the first hub commit; every later phase cites them; execution falsified three assumptions and recorded them as amendments 8.1-8.3 rather than deviating silently.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A missed consumer surfaces later as a silent routing break | Independent survivor audit plus exact gate reproduction before closeout |

**Dependencies:** the frozen map and contract in phase 002, and the pre-captured Lane C baselines.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Falsified assumptions were folded back into the contract as section 8 amendments.
<!-- /ANCHOR:questions -->
