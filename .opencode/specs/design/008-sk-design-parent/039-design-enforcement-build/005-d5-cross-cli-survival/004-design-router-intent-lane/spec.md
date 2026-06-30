---
title: "Feature Specification: D5-R4 — DESIGN router intent lane in all 3 CLI dictionaries"
description: "Design work dispatched to a child CLI has no weighted routing signal for design intent, so it falls into a generic lane; add a DESIGN intent to each cli-* provider dictionary so design phrasing is a recognized, scored signal that composes with the always-fires Design Standards Loading rule."
trigger_phrases:
  - "d5-r4 design router intent lane"
  - "design intent lane design build"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/004-design-router-intent-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record INTENT_SIGNALS-only DESIGN lane resolution"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r4-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R4 — DESIGN router intent lane in all 3 CLI dictionaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `004-design-router-intent-lane` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deterministic cli-* router lowercases a prompt, boundary-matches keywords, scores intents, and conditional-loads `RESOURCE_MAP[intent]`. None of the three cli-* provider dictionaries declared a design intent, so design work dispatched to a child CLI had no weighted routing signal: design phrasing scored zero against every known intent and fell through to the generic `UNKNOWN_FALLBACK` lane. Design context survived only through the always-fires `Design Standards Loading` rule, never as a first-class routing signal the scorer recognized.

### Purpose
Add a `DESIGN` intent to the `INTENT_SIGNALS` dictionary in each of `cli-codex`, `cli-claude-code`, and `cli-opencode` so that unambiguous design phrasing becomes a recognized, weighted routing signal in every child CLI. The lane makes design intent legible to the scorer so design work routes to sk-design rather than being lost in transport. It composes with — does not duplicate — the always-fires `Design Standards Loading` rule and the D5-R3 dispatch manifest, which remain the durable sk-design loading contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one `DESIGN` key to `INTENT_SIGNALS` (weight 4) in each of the three cli-* provider dictionaries, with a parallel keyword set traced to the hub-router vocabulary and hub-identity tokens.
- Record a WHY comment in each dictionary stating the INTENT_SIGNALS-only resolution and where the durable design loading contract lives.

### Out of Scope
- Any `RESOURCE_MAP["DESIGN"]` entry — deliberately not added (see the sanctioned deviation in RISKS and OPEN QUESTIONS).
- Any edit to `hub-router.json`, `router-replay.cjs`, or `cli_reference.md` — those are reconciliation or verification sources, never edited here.
- The static token lint and route-replay fixtures that assert the lane — that is the sibling fixture phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-codex/SKILL.md` | Modify | Add a `DESIGN` key to `INTENT_SIGNALS` (weight 4) + a WHY comment; `RESOURCE_MAP` unchanged |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modify | The same `DESIGN` key + WHY comment (parallel keyword set); `RESOURCE_MAP` unchanged |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | The same `DESIGN` key + WHY comment, stacked on top of concurrent GLM WIP; `RESOURCE_MAP` unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `DESIGN` added to `INTENT_SIGNALS` in all three cli-* | one new `DESIGN` key per dictionary, `weight: 4`, identical keyword set across siblings |
| REQ-002 | No `RESOURCE_MAP["DESIGN"]` entry exists | the router guard rejects cross-skill paths and non-`.md`, and no skill-local design `.md` exists; `RESOURCE_MAP` is left unchanged in every cli-* |
| REQ-003 | Existing routes byte-identical | the prior intents and every `RESOURCE_MAP` entry are unchanged in all three cli-* |
| REQ-004 | Concurrent GLM WIP preserved | the GLM-5.2 work in `cli-opencode/SKILL.md` is byte-identical before/after; only the `DESIGN` key is added |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Every `DESIGN` keyword traces to hub-router vocabulary | each keyword maps to a hub-router vocabulary alias or a hub-identity token; no net-new design vocabulary invented in the cli dictionary |
| REQ-006 | Lane composes with the Design Standards Loading rule | a WHY comment states the lane is an intent signal only; the durable contract lives in the always-fires D5-R1 rule plus the D5-R3 dispatch manifest |
| REQ-007 | No hub-route regression | the sk-design hubRoute scorer stays 13 pass / 5 known-gap / 0 regression; a cli-* `INTENT_SIGNALS` change does not touch the sk-design hub corpus |
| REQ-008 | Deliverable is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the lane or the WHY comment |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A static read finds a `DESIGN` key in `INTENT_SIGNALS` in all three cli-* with weight 4 and an identical, hub-router-traceable keyword set, and finds no `DESIGN` key in any `RESOURCE_MAP`.
- **SC-002**: The existing routes and the concurrent GLM WIP are byte-identical, and the sk-design hubRoute scorer stays 13 pass / 5 known-gap / 0 regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

> **Sanctioned deviation (INTENT_SIGNALS-only):** The phase `spec.md` scaffold and the plan originally called for "a `DESIGN` intent + keywords + `RESOURCE_MAP` target." During preconditions the orchestrator resolved the lane to **INTENT_SIGNALS-only** and deliberately added **no** `RESOURCE_MAP["DESIGN"]`. The router same-skill guard (`_guard_in_skill`) rejects cross-skill paths and any non-`.md` target, and no skill-local design `.md` exists in any cli-* skill root, so a `RESOURCE_MAP["DESIGN"]` target would be a guard-violating dangling cross-skill reference that breaks routing. The design resource is reached instead through the always-fires D5-R1 `Design Standards Loading` rule and the D5-R3 dispatch manifest. The lane therefore composes with D5-R1 (it is the fast, scored keyword path; D5-R1 remains the phrasing-independent safety net) rather than introducing a competing or dangling load instruction. This deviation from the spec's "INTENT_SIGNALS + RESOURCE_MAP" wording is sanctioned and recorded here and in OPEN QUESTIONS.

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A `RESOURCE_MAP["DESIGN"]` target would violate the router same-skill guard | Routing would break on a dangling cross-skill / non-`.md` path | Resolve the lane to INTENT_SIGNALS-only; reach the design resource via the D5-R1 ALWAYS rule + the D5-R3 manifest |
| Risk | A new design intent could misroute existing prompts | An existing-route prompt could falsely score `DESIGN` | Keep weight 4 (equal to siblings) and keywords design-specific and hub-router-traced; the existing routes verified byte-identical |
| Risk | Concurrent GLM-5.2 workstream editing `cli-opencode` | A bulk edit could clobber GLM WIP | Add only the `DESIGN` key; GLM WIP verified byte-identical before/after |
| Dependency | Hub-router vocabulary (alias classes + hub-identity) | Read-only reconciliation source | Green — exists; every `DESIGN` keyword traces to it |
| Dependency | `Design Standards Loading` ALWAYS rule (D5-R1) + D5-R3 dispatch manifest | The durable design loading contract the lane composes with | Green — landed; the lane is an intent signal on top of them |
| Dependency | `_guard_in_skill` same-skill path guard | Read-only harness semantics | Green — its cross-skill / non-`.md` rejection is the reason RESOURCE_MAP stays unchanged |
| Dependency | sk-design hubRoute scorer (13 / 5 / 0 baseline) | Read-only no-regression harness | Green — a cli-* `INTENT_SIGNALS` change does not touch the sk-design hub corpus |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Every `DESIGN` keyword traces to a hub-router vocabulary alias or hub-identity token, so the lane has a single source of truth and cannot drift from the hub vocabulary.
- **NFR-M02**: The lane is evergreen — no ephemeral artifact IDs — so it survives doc reorganization.

### Safety
- **NFR-S01**: The lane adds only an `INTENT_SIGNALS` key; no `RESOURCE_MAP` target is introduced, so the router same-skill guard cannot be tripped by a dangling cross-skill path.
- **NFR-S02**: The addition is byte-additive; the existing routes and the concurrent GLM WIP are untouched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### No skill-local design contract
- No cli-* skill root contains a design `.md`. A `RESOURCE_MAP["DESIGN"]` target would resolve to a guard rejection, so the lane is INTENT_SIGNALS-only and the design resource is reached through the D5-R1 ALWAYS rule and the D5-R3 manifest.

### Design phrasing with no keyword match
- A design prompt whose phrasing matches no `DESIGN` keyword still loads sk-design through the always-fires `Design Standards Loading` rule; the lane is the fast scored path, not the only path.

### Concurrent dirty target
- `cli-opencode/SKILL.md` carries uncommitted GLM WIP. The `DESIGN` key is added on top; the GLM WIP is byte-identical before/after.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One additive `INTENT_SIGNALS` key in each of three dictionaries, no running code |
| Risk | 11/25 | No code/DB; risk is the concurrent GLM WIP and the guard-aware INTENT_SIGNALS-only resolution |
| Research | 6/20 | Reuses the hub-router vocabulary and the landed D5-R1 / D5-R3 contracts |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Resolved (sanctioned deviation):** Whether to add `RESOURCE_MAP["DESIGN"]` alongside the `INTENT_SIGNALS` key. Resolution: NO. The router same-skill guard rejects cross-skill paths and non-`.md` targets, and no skill-local design `.md` exists, so a `RESOURCE_MAP["DESIGN"]` entry would be a guard-violating dangling reference. The lane is INTENT_SIGNALS-only; the design resource is reached via the D5-R1 ALWAYS `Design Standards Loading` rule and the D5-R3 dispatch manifest. This is a sanctioned deviation from the spec scaffold's "INTENT_SIGNALS + RESOURCE_MAP" wording, recorded in RISKS.
- No other questions outstanding. The composition with D5-R1 (the lane is the fast scored path; D5-R1 is the phrasing-independent safety net) is a documented design boundary, not an open defect.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
</content>
</invoke>
