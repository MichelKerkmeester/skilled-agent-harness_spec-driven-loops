---
title: "Feature Specification: Document Composer 2.5 Max-Mode Absence in cli-cursor"
description: "Record in the cli-cursor skill docs that Composer 2.5 ships only composer-2.5 and composer-2.5-fast with no -max (1M Max Mode) variant, and clarify that Cursor Max Mode is reached via an enumerated -max id, not the [context=1m] bracket the CLI --help advertises (which is rejected)."
trigger_phrases:
  - "cursor composer max mode"
  - "composer-2.5-max cli-cursor"
  - "cursor cli max mode toggle"
  - "cursor -max 1m context model id"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/051-cli-cursor-max-mode-doc"
    last_updated_at: "2026-08-19T19:25:45Z"
    last_updated_by: "claude"
    recent_action: "Documented Composer 2.5 has no -max tier across SKILL/README/providers docs"
    next_safe_action: "Operator review of the 3 cli-cursor doc edits, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-051-cli-cursor-max-mode-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Document Composer 2.5 Max-Mode Absence in cli-cursor

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Track** | cli-external-orchestration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A request to define "Composer 2.5 Max Mode" in the cli-cursor model roster surfaced a documentation gap. Composer 2.5's real dispatchable ids (`composer-2.5`, `composer-2.5-fast`) are already in the enforced allowlist, but nothing in the cli-cursor docs states that Composer has **no** `-max` (1M "Max Mode") variant. A live `cursor-agent --list-models` probe returns only the two Composer ids, and `composer-2.5[context=1m]` is rejected with `Cannot use this model`. Without a note, the same "add composer-2.5-max" assumption recurs — and adding a non-existent id to the runtime-enforced allowlist would break dispatch.

### Purpose
Add a short, evidence-backed note across the three cli-cursor doc surfaces (SKILL override table, README roster paragraph, providers-and-models §4) that: (a) Composer ships only base + fast, no `-max` tier; and (b) Cursor "Max Mode" (the 1M-context tier) is selected via an enumerated `-max` id where a model offers one — not the `[context=1m]` bracket the CLI `--help` advertises, which is rejected.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `cli-cursor/SKILL.md` §3 user-override table: one row for "Use Composer max".
- `cli-cursor/README.md` roster paragraph: a clause stating Composer has no `-max` variant.
- `cli-cursor/references/providers-and-models.md` §4: a "Max Mode" clarification paragraph.

### Out of Scope
- Any runtime-code change (`executor-config.ts`, `fanout-run.cjs`) — the allowlist stays exactly 21 ids; no id added or removed.
- Adding `claude-*-max` / `gpt-5.6-sol-max` ids to the allowlist (a separate capability request, not made here).
- The already-correct bracket-rejection documentation (left unchanged; only extended with the Max-Mode note).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Modify | Add "Use Composer max" override-table row |
| `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` | Modify | Note Composer has no `-max` tier in the roster paragraph |
| `.opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md` | Modify | Add the "Max Mode = `-max` id" clarification in §4 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Composer no-Max fact documented | All three surfaces state Composer 2.5 has only `composer-2.5`/`composer-2.5-fast` and no `-max` variant |
| REQ-002 | Max-Mode mechanism clarified | providers §4 explains Max Mode = enumerated `-max` id, and that `[context=1m]` is rejected |
| REQ-003 | No runtime change | `git diff` touches only the three cli-cursor doc files; the 21-id allowlist is unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three doc edits are present and consistent (no `composer-2.5-max` presented as a usable id).
- **SC-002**: `validate.sh 051-cli-cursor-max-mode-doc --strict` returns Errors:0.
- **SC-003**: No change to `executor-config.ts` / `fanout-run.cjs` or their tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A future edit adds `composer-2.5-max` to the allowlist | Dispatch breaks with `Cannot use this model` | This note records the id does not exist; the override-table row forbids substitution |
| Dependency | Live `cursor-agent --list-models` roster | Doc could drift if Cursor later adds a Composer Max tier | Re-probe `--list-models` before adding any `composer-2.5-*` id |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Adding specific `-max` ids (e.g. `claude-sonnet-5-max`) to the enforced allowlist is a separate capability request, explicitly out of scope here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Evidence**: Live `cursor-agent --list-models` (2 Composer ids) and `composer-2.5[context=1m]` → `Cannot use this model`.
