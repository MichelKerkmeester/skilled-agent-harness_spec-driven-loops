---
title: "Feature Specification: The Devin swe alias already moved to SWE-2"
description: "Cognition released SWE-2 and repointed the bare `swe` alias to it. Every repo surface still documented `swe` as SWE-1.7 Lightning, so the skill's own default dispatched to a model the docs did not name. The curated roster names SWE-2 now, and the alias claim matches the CLI."
trigger_phrases:
  - "swe-2 cutover"
  - "devin swe alias drift"
  - "replace swe 1.7 with swe 2"
  - "devin curated roster refresh"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: The Devin swe alias already moved to SWE-2

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator: "replace SWE 1.7 with SWE2 (just released)", then "Swe 2 max" when asked which tier the follow-on research should dispatch at |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator asked for a version bump. `devin models list` on version 3000.10.21 shows something worse than a stale version number: the family `SWE-2 (swe-2)` carries `aliases: swe`. Every surface in this repository claimed `swe` resolved to `swe-1-7-lightning`, and `swe` is the skill's documented default in both its dangerous-mode dispatch table and its `accept-edits` reference. So every dispatch that took the default was already running SWE-2 while eight documents said otherwise. The drift also ran wider than the alias: the reference roster claimed a 37-family catalog where the CLI now reports 48, and it advertised the default as a lightning speed tier when SWE-2 has no lightning tier at all.

### Purpose

The bare `swe` alias is documented as what the CLI actually resolves it to, and every roster claim in the curated set was read from `devin models list` rather than carried forward.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The alias claim, wherever a surface states what `swe` resolves to
- The curated roster's SWE family: SWE-2's three effort ids added, SWE-1.7 retained as explicitly pinnable
- The per-task rationale tables that recommended a specific SWE id
- The two stale counts: the 37-family roster figure and the "lightning tier" description of the default
- The hub's advisor routing vocabulary, widened so a prompt naming either generation routes
- **The deep-loop fan-out allowlist.** It enforces a literal set of cli-devin ids and would have refused `swe-2-max` outright, so the follow-on research could not dispatch without it. Both copies plus the stale comment on the default

### Out of Scope
- **Removing SWE-1.7.** The CLI still offers `swe-1-7`, `swe-1-7-medium`, `swe-1-7-lightning` and `swe-1-7-lightning-medium`. Deleting the ids would break a deliberate pin, so they stay documented as pinnable and lose only the alias claim and the default position
- **Changelogs and dated benchmark reports.** They record what was true when written. Nine files keep SWE-1.7 names for that reason
- **The advisor reference filenames.** `standalone-mcp-shape.md` and `legacy-tool-bridge.md` keep MCP in their filenames while their titles and bodies no longer do. Renaming them breaks inbound references and belongs to the decommission packet, not this one
- **The other five CLI modes.** `cli-opencode` and `cli-pi` have uncommitted model changes in the working tree from the V4.1 Flash packet, and three modes carry an unrelated `AGENTS.md` section renumber. None is this packet's
- **The Fusion families.** `devin models list` shows `fusion-*-sidekick-swe-2-medium` pairings. They are outside the curated six and were not evaluated

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Default alias, the "swe max" dispatch row, the curated family list in three places, selection strategy |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modify | Three SWE-2 roster rows added, alias claim moved off the lightning row, default-model row, family count |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` | Modify | Overview, `--model` flag description, default-dispatch paragraph, four rationale rows, troubleshooting |
| `.opencode/skills/cli-external-orchestration/cli-devin/README.md` | Modify | Roster line, default claim, troubleshooting row, model-choice FAQ |
| `.opencode/skills/cli-external-orchestration/ROUTER.md` | Modify | Roster line and the DEVIN keyword weight |
| `.opencode/skills/cli-external-orchestration/graph-metadata.json` | Modify | Advisor vocabulary widened with `swe-2` in three lists |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Modify | `devin-dispatch` keyword list widened |
| `.opencode/skills/cli-external-orchestration/description.json` | Modify | Hub description vocabulary widened |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Three SWE-2 ids added to the supported set; the doc comment claiming `swe` is the SWE-1.7 Lightning alias corrected |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | The same three ids in the synchronous copy the lineage builder reads |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | The positive fixture claimed to cover every allowlisted model and no longer did; negatives add the bare `swe-2` that Devin does not publish |
| `.opencode/skills/cli-external-orchestration/cli-devin/changelog/v1.4.2.0.md` | Create | One entry, which is how this skill has recorded every prior roster change |
| `.opencode/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md` | Modify | Missing `version` field added; the repository frontmatter gate was failing on it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No live surface claims `swe` resolves to `swe-1-7-lightning` | A repo scan outside `changelog/` returns no hit for the alias claim |
| REQ-002 | Every SWE id named in a live surface exists in `devin models list` | Each id cross-checked against the CLI output, including the absence of a bare `swe-2` |
| REQ-003 | SWE-1.7 stays reachable as an explicit pin | `swe-1-7`, `swe-1-7-medium` and `swe-1-7-lightning` still appear in the roster with their real tiers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The two stale figures are corrected | No surface says 37 families, and none calls the default a lightning tier |
| REQ-005 | A prompt naming either SWE generation still routes to the Devin mode | `swe-2` vocabulary present alongside `swe-1.7` in the hub's three metadata files |
| REQ-006 | The compiled serving manifest is re-minted | `compiled-route-guard.cjs` reports the hub fresh |
| REQ-007 | The fan-out accepts `swe-2-max` in both allowlist copies, and its comment on the default no longer misnames the alias | `executor-config.vitest.ts`, `fanout-run.vitest.ts` and `combo-matrix.vitest.ts` all pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `devin models list` shows `aliases: swe` under `SWE-2 (swe-2)`, and the roster says the same
- **SC-002**: `swe-2-max`, `swe-2-high` and `swe-2-medium` are documented as free at 262K context, matching the CLI
- **SC-003**: A live `devin -p --model swe-2-max` dispatch returns a reply, so the id is dispatch-verified rather than list-verified
- **SC-006**: The three deep-loop suites that read the allowlist pass, 218 tests in total
- **SC-007**: `check-frontmatter-versions.sh` reports no failures across the repository
- **SC-004**: `compiled-route-guard.cjs` reports all five hubs fresh
- **SC-005**: `validate.sh` on this packet reports `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A blanket replace deletes SWE-1.7 ids the CLI still serves | Med | The ids were checked against live CLI output first. SWE-1.7 lost the alias and the default, not its rows |
| Risk | "SWE 2 max" is read as a bare family id | High | There is no bare `swe-2` id in the listing. The three concrete ids are high, medium and max, so max resolves to `swe-2-max` |
| Risk | Replacing the routing vocabulary breaks a prompt that names 1.7 | Med | The vocabulary was widened, not replaced. Both generations route |
| Risk | Editing a hub's `SKILL.md` and `hub-router.json` stales the serving manifest silently | High | Those two are exactly the narrow set the pre-commit re-mint gate covers; the guard confirmed the hub stale and the commit re-mints it |
| Risk | The allowlist copy in the script drifts from the TypeScript source | Med | Both were edited in one pass and `combo-matrix.vitest.ts` asserts across them. That test is the reason the pair stays honest |
| Dependency | `devin models list` output on version 3000.10.21 | Low | Read on 2026-09-12 and cited with that date. Cognition moves the alias without notice, which is the failure this packet is fixing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The alias moved under the repository without any signal. Nothing here detects the next move. A periodic `devin models list` diff against the roster would, and would belong to the mode rather than to this packet.
- The Fusion families pair a sidekick with `swe-2-medium`. Whether any belongs in the curated six is unevaluated.
<!-- /ANCHOR:questions -->

---
