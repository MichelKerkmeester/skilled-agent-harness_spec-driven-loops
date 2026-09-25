---
title: "Feature Specification: Make 4000 characters the one limit for a parent goal durable slice"
description: "A parent goal.md warned past 3000 durable characters and failed past 4000, so authors cut goals to under 3000 and treated the warning as the limit. The operator's limit is 4000, and nothing should warn below it."
trigger_phrases:
  - "parent goal limit"
  - "goal durable budget"
  - "4000 character goal"
  - "goal warning tier"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Make 4000 characters the one limit for a parent goal durable slice

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A phase parent or top-level `goal.md` had two thresholds: the validator warned past 3000 durable characters and failed past 4000, and `goal.cjs packet` reported `packet_budget=warn` above 3000. The template, the set-string playbook, the validation reference and both READMEs repeated the pair. An agent writing a parent goal took the warning as the limit and cut the goal to 2998 characters, well short of the 4000 the operator set.

### Purpose
4000 characters is the one stated and enforced limit for a parent goal. Nothing warns, advises cutting or reports a non-ok budget at or below it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Drop the warning tier from the manifest, the validator and the runtime goal-slice module
- Report only `ok`, `over` or `unknown` from `goal.cjs` and the OpenCode plugin, with one wording for the over-limit warning
- Restate the limit in the template, the validation reference, the set-string playbook, the goal plugin contract and both READMEs
- Update the tests and the scaffold golden snapshot that pinned the old tier
- Budget a phase parent nested inside another packet in the runtime, as the validator already does
- Replace the old template sentence in the goal documents already scaffolded under `specs/`, and re-derive their graph metadata

### Out of Scope
- What counts as the durable slice - unchanged, and the validator and runtime measure it identically
- Released changelogs that describe the old tier - they record what shipped then
- Decision records that state the old tier as the decision taken at the time
- Copies of the specs tree kept under `research/`, `review/` or `iterations/` folders

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` | Modify | `goalDurableBudget` keeps only `errorChars: 4000` |
| `.skilled/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts` | Modify | The budget type and resolver carry one limit |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modify | Remove the warning branch of `SPECDOC_SUFFICIENCY_005` |
| `.skilled/hooks/goal/lib/goal-slice.cjs` | Modify | One-limit resolver, no `warn` budget state |
| `.skilled/hooks/goal/bin/goal.cjs`, `.opencode/plugins/opencode-goal.js` | Modify | The bind warning names the limit and fires only past it |
| Template, references, READMEs, `goal-plugin.md` | Modify | Describe one 4000-character limit |
| `goal-slice.test.cjs`, `spec-doc-structure.vitest.ts`, the scaffold snapshot | Modify | Pin the limit, the absence of a lower tier, and the nested phase parent |
| 49 `goal.md` files under `specs/` and their `graph-metadata.json` | Modify | The new slice note, and the re-derived fingerprint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A parent goal up to 4000 characters raises nothing | `goal.cjs packet` reports `packet_budget=ok` at 2998, 3500 and 4000, and the validator emits no `SPECDOC_SUFFICIENCY_005` for them |
| REQ-002 | A parent goal past 4000 still fails | At 4001 `goal.cjs` reports `packet_budget=over` and `validate.sh` fails with `SPECDOC_SUFFICIENCY_005` |
| REQ-003 | No document states 3000 as a goal threshold | A search of the skill, the hook and both READMEs finds no 3000 goal tier |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A manifest that still carries the old tier does not revive it | `resolveGoalBudget` returns `{ errorChars: 4000 }` for a manifest with `warnChars: 3000` |
| REQ-005 | Both bind surfaces word the warning the same way | `goal.cjs bind` and the OpenCode `bind` both print `past the 4000-character limit` at 4001 and nothing at 4000 |
| REQ-006 | The runtime budgets exactly the goals the validator budgets | A nested phase parent reports `over` at 4001 and `ok` at 4000, a plain phase child stays `unknown`, and `goal.cjs` agrees with `validate.sh` on every fixture shape with generator hardening on and off |
| REQ-007 | No scaffolded goal document keeps the old sentence | A search of `specs/` goal documents outside research and review copies finds no "warns past 3000" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The goal hook suites, the validator suite and the scaffold snapshot pass, and the new boundary test fails against the previous `goal-slice.cjs`
- **SC-002**: The AI Systems packet 075 goal at 2998 characters reports `ok`, and a copy padded to 3500 and 4000 reports `ok` while 4001 fails
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stale runtime dist reads the new manifest and throws on the missing `warnChars` | Med | The runtime dist was rebuilt, and the dist freshness guard flags a stale one |
| Risk | Another workspace keeps an older manifest with both numbers | Low | The new resolvers ignore `warnChars`, and a test pins that |
| Dependency | The runtime goal surfaces' own caps | Low | They cap objective and prompt at 4000 and the injection block at 4800; none caps at 3000 |
| Risk | The runtime's copy of the phase-parent rule drifts from the spec kit's | Med | The copy mirrors the canonical classifier and the declared-level read, and a comment names why it must match |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator named 4000 as the limit.
<!-- /ANCHOR:questions -->

---
