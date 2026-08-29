---
title: "Feature Specification: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute [template:level-2/spec.md]"
description: "Grok models are Cursor-hosted and must not appear in cli-devin's allowlist. Remove the 7 bare devin Grok ids from SKILL.md, README.md, cli-reference.md, providers-and-models.md, executor-config.ts, fanout-run.cjs, and fanout-run.vitest.ts while preserving all cursor-grok-* entries."
trigger_phrases:
  - "grok devin roster"
  - "devin model misroute"
  - "drop grok from devin"
  - "devin allowlist grok"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Drop the Grok 4.5 and 4.6 model families from the cli-devin skill and its executor roster; Grok is a Cursor-hosted model and its presence in devin's roster caused a misroute

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `scaffold/057-roster-drop-grok-from-devin` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-devin allowlist advertised Grok 4.5 and 4.6 model ids (`grok-4-5-high`, `grok-4-5-low`, `grok-4-5-medium`, `grok-4-6-high`, `grok-4-6-low`, `grok-4-6-medium`, `grok-4-6-xhigh`). Grok is a Cursor-hosted model and cannot be dispatched through the Devin CLI. A real misroute occurred: a dispatch for "grok 4.6 xhigh" was sent to cli-devin because the executor's allowlist listed the literal id `grok-4-6-xhigh`, producing a silent failure.

### Purpose
Remove all 7 bare devin-scoped Grok ids from every allowlist, table, example, and prose reference in cli-devin and its executor runtime so the roster truthfully reflects what Devin can dispatch, while leaving every `cursor-grok-*` entry untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove 7 bare devin Grok ids from `DEVIN_SUPPORTED_MODELS` in `executor-config.ts`
- Remove 7 bare devin Grok ids from `DEVIN_ALLOWED_MODELS` in `fanout-run.cjs`
- Update the allowlist fixture in `fanout-run.vitest.ts` to match
- Remove Grok rows from the model table and notes in `providers-and-models.md`
- Remove Grok from curated family list, selection strategy, and model-resolution table in `SKILL.md`
- Remove Grok from FAQ answer in `README.md`
- Remove Grok from usage examples, selection table, and env var reference in `cli-reference.md`

### Out of Scope
- `cli-devin/changelog/` entries — historical record of what shipped; must not be rewritten
- Any `cursor-grok-4.5-*` or `cursor-grok-4.6-*` entries — Cursor legitimately hosts Grok
- Any files outside the explicitly listed scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Remove 7 bare Grok ids from `DEVIN_SUPPORTED_MODELS` array |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Remove 7 bare Grok ids from `DEVIN_ALLOWED_MODELS` array |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Remove Grok ids from the allowlist acceptance fixture |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modify | Remove 7 Grok table rows, update family count and notes |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Remove Grok from model-resolution table, family list, selection strategy, rule 7 |
| `.opencode/skills/cli-external-orchestration/cli-devin/README.md` | Modify | Update FAQ model recommendation |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` | Modify | Remove Grok from usage examples, selection table, env var reference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | All 7 bare devin Grok ids removed from `executor-config.ts` `DEVIN_SUPPORTED_MODELS` and `fanout-run.cjs` `DEVIN_ALLOWED_MODELS` |
| REQ-002 | Every `cursor-grok-4.5-*` and `cursor-grok-4.6-*` entry in `executor-config.ts` and `fanout-run.cjs` remains unchanged |
| REQ-003 | `fanout-run.vitest.ts` fixture updated; `npx vitest run` exits 0 with all tests passing |
| REQ-004 | No bare devin Grok id remains in any in-scope skill doc or runtime file |
| REQ-005 | `validate.sh --strict` on the packet folder exits 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n '(^|[^-])grok-4-[56]-' <in-scope-files>` returns only changelog hits (out of scope) or cursor-prefixed matches — zero bare devin Grok ids in allowlists or docs.
- **SC-002**: Cursor Grok count in `fanout-run.cjs` and `executor-config.ts` equals the pre-edit baseline (8 each).
- **SC-003**: 112 vitest tests pass (exit 0) in `fanout-run.vitest.ts`.
- **SC-004**: `validate.sh --strict` exits 0 on the packet folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Accidental removal of a `cursor-grok-*` entry | Breaks live deep-research run | Pre-edit baseline count; grep safety check post-edit |
| Risk | Stale fanout-run.cjs/executor-config.ts drift | Test fixture mismatch | Both files edited in same session; tests rerun to confirm |
| Dependency | None | — | — |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance impact — change is allowlist data only.

### Security
- **NFR-S01**: No credentials, secrets, or auth flows touched.

### Reliability
- **NFR-R01**: The Cursor Grok allowlist (cursor-grok-4.5-* and cursor-grok-4.6-*) must remain intact so live deep-research runs are unaffected.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Bare Grok ids (`grok-4-[56]-*`) must be removed; `cursor-grok-*` ids must be preserved exactly.
- Changelog files contain historical Grok mentions — these are read-only and intentionally excluded.

### Error Scenarios
- If a cursor-grok entry were accidentally removed: the live deep-research run dispatching `cursor-grok-4.6-xhigh` would receive an allowlist rejection. Mitigation: baseline count verification before and after each edit.

### State Transitions
- No state transitions. This is a pure data/doc edit with no runtime migration.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 7 files modified across skill docs and runtime |
| Risk | 8/25 | Low; only allowlist data and prose — no logic, auth, or API changes. Key risk: accidental cursor-grok removal (mitigated by baseline check) |
| Research | 5/20 | Baseline grep counts and file reads required before editing |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. All decisions were pre-approved in the task brief.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
