---
title: "Feature Specification: Phase 016 - Hub Routing Optimization"
description: "Brings sk-design's mode-registry.json/hub-router.json/command-metadata.json up to the structural pattern established in sk-code's and sk-doc's parent hubs, and syncs command-metadata.json to Phase 015's router+assets build."
trigger_phrases:
  - "hub routing optimization"
  - "phase 016 hub routing"
  - "sk-design routing parity with sk-code sk-doc"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/016-hub-routing-optimization"
    last_updated_at: "2026-07-06T21:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-routing-optimization-016"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 016 - Hub Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../015-design-commands-implementation/spec.md |
| **Successor Phase** | None |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code` and `sk-doc` (the other two parent hubs in this repo) both carry two structural conventions in their `mode-registry.json`/`hub-router.json` that `sk-design`'s equivalents lack: (1) a per-mode `"command"` field recording the bound slash command, documented in `advisorRoutingContract`; (2) a `"hub-identity"` vocabulary class wired into every mode's `routerSignals.classes` array. `sk-design`'s `hub-router.json` already *defines* a `hub-identity` vocabulary class but never references it from any mode, so it is dead configuration. Separately, Phase 015's router+assets rewrite added `--register` and `:auto`/`:confirm` to all five `/design:*` commands' real `argument-hint` values, but the older, richer `command-metadata.json` file (choreography/handoff/register-policy projections consumed elsewhere) still has the pre-015 `argumentHint`/`argumentGrammar` values for all five commands, making it stale relative to the live commands.

### Purpose

Bring `sk-design`'s hub-routing registries into structural parity with the pattern already established in `sk-code`/`sk-doc`, and resync `command-metadata.json`'s per-command argument grammar with the real command files Phase 015 built.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a `"command"` field to each of the 5 mode entries in `.opencode/skills/sk-design/mode-registry.json`, matching sk-doc's exact field placement and documenting it in `advisorRoutingContract`.
- Wire `"hub-identity"` into every mode's `routerSignals.classes` array in `.opencode/skills/sk-design/hub-router.json`, matching both sk-code's and sk-doc's pattern (the `hub-identity` vocabulary class already exists there, unreferenced).
- Update `.opencode/skills/sk-design/command-metadata.json`'s `argumentHint`, `argumentGrammar.flags`, and `argumentGrammar.render` for all 5 commands to include the `--register brand|product` flag and `:auto`/`:confirm` execution-mode suffix, matching the live `argument-hint` values in `.opencode/commands/design/*.md` (built in Phase 015).
- Bump `mode-registry.json` (1.2.0.0 -> 1.3.0.0) and `hub-router.json` (1.1.0.0 -> 1.2.0.0) versions for the additive changes.

### Out of Scope

- Changing `routerPolicy.defaultMode: "interface"` — `sk-design`'s own `SKILL.md` §2 explicitly documents and justifies this default ("default a generic prompt to interface"); it is an intentional domain-specific divergence from sk-code's/sk-doc's `null` default, not a gap to close.
- Restructuring or merging `command-metadata.json` into `mode-registry.json` — it is a distinct, richer, command-facing metadata file (choreography, handoff, register policy, output contracts) with no equivalent in sk-code/sk-doc; this phase only syncs its stale fields, it does not redesign its shape.
- Any edit to the 5 `/design:*` command files or their assets (Phase 015's output) — those are the source of truth this phase reads from, not writes to.
- Adding a sixth mode or changing the five-mode taxonomy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/mode-registry.json` | Edit | Add per-mode `command` field + `advisorRoutingContract.command` doc; version bump |
| `.opencode/skills/sk-design/hub-router.json` | Edit | Add `hub-identity` to all 5 modes' `classes`; version bump |
| `.opencode/skills/sk-design/command-metadata.json` | Edit | Sync `argumentHint`/`argumentGrammar` for all 5 commands to the post-Phase-015 argument shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every mode in `mode-registry.json` carries a `"command"` field with its real bound `/design:*` command | 5/5 modes have `command` set to the exact command string used in `.opencode/commands/design/*.md` |
| REQ-002 | Every mode in `hub-router.json`'s `routerSignals` includes `"hub-identity"` in its `classes` array | 5/5 modes' `classes` arrays include `hub-identity` |
| REQ-003 | `command-metadata.json`'s `argumentHint`/`argumentGrammar.render` match the live command frontmatter `argument-hint` value exactly, for all 5 commands | String-for-string match against `.opencode/commands/design/*.md` frontmatter |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `advisorRoutingContract` in `mode-registry.json` documents the new `command` field, matching sk-doc's phrasing/intent | Field description present, notes sk-design's fields are never null (unlike sk-doc) |
| REQ-005 | `command-metadata.json`'s `argumentGrammar.flags` for each command includes explicit `--register` and `:auto\|:confirm` grammar entries, not just a wider `render` string | Each of the 5 `flags` arrays has both new entries |
| REQ-006 | No behavior change to routing outcomes — this is additive metadata only | `routerPolicy`, `tieBreak`, `bundleRules`, weights, and every existing alias/keyword list unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 registry files parse as valid JSON and pass a diff review confirming only the additive fields changed (weights, aliases, `routerPolicy`, `tieBreak`, `bundleRules` untouched).
- **SC-002**: `validate.sh --strict` on this phase folder passes with 0 errors.
- **SC-003**: sk-design's registries now match sk-code's/sk-doc's `command` + `hub-identity` conventions exactly, with the one documented, intentional exception (`defaultMode`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding `hub-identity` to `classes` shifts scoring weight and changes routing outcomes | Medium | `hub-identity`'s keywords (sk-design, mode-registry, workflowmode, etc.) are hub-generic, not mode-discriminating — every mode gains the same signal, so relative ranking between modes is unaffected; only genuinely hub-identity phrases gain a small uniform boost |
| Risk | `command-metadata.json`'s consumers (if any) expect the old narrower `argumentHint` strings | Low | The change is a strict superset (existing behavior unchanged, new optional syntax added), matching the same superset approach already verified safe in Phase 015's router frontmatter |
| Dependency | Phase 015's live command files as source of truth for the new argument-hint strings | High if stale | Read directly from `.opencode/commands/design/*.md` frontmatter before editing `command-metadata.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding — scope (all three files) and spec folder placement (new phase 016) were confirmed via AskUserQuestion before this spec was written.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Future hub-routing audits across sk-code/sk-doc/sk-design can rely on all three having the same `command` + `hub-identity` shape, reducing one source of cross-hub drift.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- A mode with no dedicated command (not applicable to sk-design today — all 5 modes have one) would set `command: null`, per sk-doc's documented convention, if a future mode is added without a command.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 3 JSON files, additive fields only, no new files |
| Risk | 5/25 | Pure metadata/config; no runtime code path |
| Research | 3/20 | Comparative read of sk-code/sk-doc equivalents already done |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Reference Pattern**: `.opencode/skills/sk-doc/mode-registry.json`, `.opencode/skills/sk-doc/hub-router.json`, `.opencode/skills/sk-code/hub-router.json`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
