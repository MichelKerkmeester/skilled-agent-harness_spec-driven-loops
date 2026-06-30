---
title: "D2-R11 — Interface mode hides 11 intent lanes behind one bridge"
description: "Add an interface-record tasks array to command-metadata.json binding the 11 interface-mode INTENT_SIGNALS lanes, each classed; project them as an INTERFACE TASK LANES wrapper section; and enforce shape + class-enum + lane-set==INTENT_SIGNALS + a negative-fixture guard in design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r11 interface intent lanes"
  - "interface intent lanes design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/011-interface-intent-lanes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgraded spec to Level 2; recorded INTENT_SIGNALS-sync + interface-targeted invariants"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r11-interface-intent-lanes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lane set is reconciled to the live INTENT_SIGNALS keys, so the surface cannot drift from the router"
      - "tasks stays interface-targeted and is not added to the global REQUIRED_FIELDS, so the 4 siblings keep drift=0"
---
# Feature Specification: D2-R11 — Interface intent lanes as visible task projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `011-interface-intent-lanes` |
| **Dimension** | D2 — Command Specificity |
| **Enforcement class** | hybrid |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/design:interface` command collapses the interface mode's eleven router intent lanes into a single thin bridge. A caller cannot see the distinct jobs it covers — invent a direction, produce N debiased options, redesign an existing surface, run the pre-ship mechanical gate, hand a build to sk-code, name a realized look — nor tell which apparent "lanes" are really sibling-command work (quality review), internal calibration (register, copy gate, system grounding), or non-surfaced tooling (real-world reference). The evidence is the `INTENT_SIGNALS` router block in `design-interface/SKILL.md`, which exposes eleven lanes that the command surface never projects.

### Purpose
Surface all eleven lanes as visible task projections and bind them to the router so the surface and the mode cannot silently diverge. Each lane is enumerated in an interface-record `tasks` array with a `class` (`argument` / `sibling-command` / `internal` / `hidden`), projected into the wrapper, and reconciled by the surface gate against the live `INTENT_SIGNALS` keys.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `tasks` array to the `/design:interface` record in `command-metadata.json` — one entry per `INTENT_SIGNALS` lane with `lane`, `label`, `class`, `surface`; all eleven lanes represented.
- Project the lanes as a `## INTERFACE TASK LANES` body section in `commands/design/interface.md` (body-only; frontmatter frozen).
- Extend `design-command-surface-check.mjs` with an interface-targeted Stage-1 `tasks` validator (shape + class-enum + lane-set reconciliation + negative-fixture guard) and a Stage-2 `task-lanes` body rule.

### Out of Scope
- `design-interface/SKILL.md` `INTENT_SIGNALS` — read-only reconciliation source; not mutated.
- `mode-registry.json` — read-only `workflowMode` source; not mutated.
- The four sibling records and wrappers (`audit`, `foundations`, `md-generator`, `motion`) — `tasks` is deliberately NOT added to the global `REQUIRED_FIELDS`, so they stay at drift 0.
- The prior interface-record fields and wrapper frontmatter — preserved, never reshaped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add an 11-entry `tasks` array to the `/design:interface` record only; preserve every prior field |
| `.opencode/commands/design/interface.md` | Modify | Add a `## INTERFACE TASK LANES` body section; preserve all prior sections + frontmatter |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add the interface-targeted Stage-1 `tasks` validator + INTENT_SIGNALS reconciliation + negative-fixture guard, and the Stage-2 `task-lanes` body rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `/design:interface` record carries a `tasks` array covering all eleven `INTENT_SIGNALS` lanes | Each entry has non-empty `lane`/`label`/`class`/`surface`; `class` in the four-value enum; the four named lanes (directions/preflight/redesign/handoff) are `argument`; checker `invalid=0` |
| REQ-002 | The lane set is reconciled to the live router, not authored once in prose | `tasks[].lane` set equals the `INTENT_SIGNALS` keys parsed from `design-interface/SKILL.md` exactly (no missing, no extra, no unknown lane) |
| REQ-003 | The wrapper projects the visible lanes | `interface.md` carries `## INTERFACE TASK LANES` with every lane label, the `/design:audit` route for the sibling-command lane, and not-surfaced/not-selectable notes for internal/hidden lanes; checker `drift=0` |
| REQ-004 | The gate rejects lanes that should not become commands | The negative-fixture guard fails any non-`argument` lane that names a `/design:*` command as its `surface`, and any lane promoted into the command set |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No regression on the prior D2 surface | `tasks` NOT added to global `REQUIRED_FIELDS`; the four sibling records keep drift 0; overall `invalid=0 drift=0`, exit 0 |
| REQ-006 | Strictly additive non-mutation | `mode-registry.json`, `design-interface/SKILL.md`, and the four sibling wrappers byte-unchanged; exactly 3 files changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` reports `STATUS=PASS ... invalid=0 drift=0`, exit 0.
- **SC-002**: A synthetic break — a `tasks[].lane` set to a non-`INTENT_SIGNALS` value — flips the checker to `STATUS=INVALID` "tasks lane set must match interface INTENT_SIGNALS missing=[...] extra=[...]" (`invalid=1`); restoring returns it to `invalid=0 drift=0`.
- **SC-003**: `tasks` does not appear in the global `REQUIRED_FIELDS`; the four sibling records remain at drift 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `command-metadata.json` interface record | The `tasks` array attaches to it; the record must exist with its prior fields | D2 SSOT landed; every prior interface-record field preserved; verified by checker `invalid=0` |
| Dependency | `design-interface/SKILL.md` `INTENT_SIGNALS` block | The eleven-lane reconciliation source | The lane set is bound to it: **adding or removing a router lane makes the surface-check fail until `tasks` is updated** — the INTENT_SIGNALS-sync invariant, which is the point of the gate |
| Risk | Forcing `tasks` onto the four siblings would break their drift=0 baseline | The siblings have no intent-lane surface | The gate is **interface-targeted, not global**: it resolves the `/design:interface` record by name and `tasks` is deliberately NOT in `REQUIRED_FIELDS`, so the four siblings never need the field |
| Risk | A non-`argument` lane could be wrongly promoted to a new `/design:*` command | Quality is owned by `/design:audit`, internal/hidden lanes are not commands | The negative-fixture guard fails any non-`argument` lane naming a `/design:*` command and any lane promoted into the command set |
| Risk | Wrapper frontmatter drift | Touching frontmatter would trip the prior D2 gate | Body-only edit keeps frontmatter byte-frozen so existing drift stays 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The surface gate is deterministic and re-runnable on demand; output is sorted and stable.

### Evergreen
- **NFR-E01**: No spec/packet/phase ID or spec-folder path appears in the metadata, the wrapper, or the checker.

### Additivity
- **NFR-A01**: All changes are additive; the prior D2 baseline (`invalid=0 drift=0`) is preserved and `tasks` stays out of the global `REQUIRED_FIELDS`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Metadata Boundaries
- Missing or empty `tasks`: Stage 1 INVALID (exit 2), "tasks must be a non-empty array".
- An entry with an empty `lane`/`label`/`class`/`surface`: shape violation → Stage 1 INVALID (exit 2).
- A `class` outside the four-value enum: Stage 1 INVALID (exit 2).
- A lane missing from or extra to the `INTENT_SIGNALS` key set: Stage 1 INVALID (exit 2), message names the missing/extra lanes.
- A duplicate lane: Stage 1 INVALID (exit 2).
- A non-`argument` lane naming a `/design:*` command as its `surface`, or any lane promoted into the command set: Stage 1 INVALID (exit 2) — the negative-fixture guard.

### Surface Boundaries
- Wrapper missing the `## INTERFACE TASK LANES` section: Stage 2 drift `field: "task-lanes"` (exit 1).
- A lane label, the `/design:audit` route, or the not-surfaced/not-selectable notes missing from the section: Stage 2 drift `field: "task-lanes"` (exit 1).
- Frontmatter touched: the existing frontmatter-drift gate fires (exit 1).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | 3 files: 1 JSON SSOT (one record, one nested array), 1 wrapper (one body section), 1 checker |
| Risk | 13/25 | First cross-file reconciliation assertion (tasks ↔ INTENT_SIGNALS) + interface-targeted gate; additive, frontmatter frozen, no live mutation outside scope |
| Research | 8/20 | Lane table + class taxonomy pre-authored in plan §3 from research §5 (D2-R11) |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None remaining. Two design questions are resolved and recorded in RISKS above: (1) the lane set is reconciled to the live `INTENT_SIGNALS` keys by the checker — the **INTENT_SIGNALS-sync invariant** — so the surface cannot drift from the router; and (2) the gate is **interface-targeted, not global** — `tasks` is deliberately kept out of the global `REQUIRED_FIELDS`, so the four sibling records keep drift 0.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum (NFR, edge cases, complexity)
- D2-R11: interface tasks[] (11 INTENT_SIGNALS lanes, each classed) + INTERFACE TASK LANES wrapper section + Stage-1/Stage-2 interface-targeted gate
- Strictly additive: tasks NOT in global REQUIRED_FIELDS, mode-registry + SKILL.md + 4 siblings untouched, frontmatter frozen, final surface-check invalid=0 drift=0
-->
