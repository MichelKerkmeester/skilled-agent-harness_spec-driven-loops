---
title: "Feature Specification: cross-runtime command mirror restoration"
description: "Restore three symlinks deleted by an unrelated earlier bulk-sync commit and bring /create:diagram to cross-runtime parity with every sibling /create:* command."
trigger_phrases:
  - "command mirror restoration"
  - "create diagram cross-runtime parity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/016-command-mirror-restoration"
    last_updated_at: "2026-08-13T17:00:20.000Z"
    last_updated_by: "claude"
    recent_action: "Restored 3 dangling symlinks; generated diagram's 3 missing cross-runtime mirrors"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope is deliberately narrower than the full audit of the earlier bulk-sync commit's ~841 other deletions — this phase fixes only the command/advisor-relevant subset found during the diagram-integration check; a broader audit is a named, separate follow-up."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: cross-runtime command mirror restoration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/v4.0.0.0` (direct commit, operator bypass authority) |
| **Parent Spec** | `../spec.md` |
| **Phase** | 16 of 16 |
| **Predecessor** | `../015-flowchart-deprecation/spec.md` |
| **Successor** | None — closes the packet's current phase set |
| **Handoff Criteria** | 0 dangling symlinks from the earlier bulk-sync incident remain in the command/advisor scope; `/create:diagram` has all 3 cross-runtime mirrors sibling commands have |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Fix the command/advisor-relevant subset of an earlier bulk-sync commit's damage, plus close a pre-existing, unrelated gap in `/create:diagram`'s own cross-runtime reachability. No broader audit of that commit's other deletions.

**Dependencies**: The "make sure diagram creation skill is properly integrated... check if we have related commands" audit that surfaced both issues; the earlier `e3a66403df` bulk-sync commit that caused the first.

**Deliverables**: `.claude/commands` symlink restored; 2 Pi extension symlinks restored; `/create:diagram` Codex, Pi, and Cursor mirrors created (matching the pattern of every sibling `/create:*` command).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An earlier bulk-sync commit on this branch (`e3a66403df`) deleted the `.claude/commands` symlink and two Pi extension symlinks as part of a 902-file "land accumulated cross-session WIP" commit, blocking every `/create:*` command for Claude Code and both affected Pi extensions. Separately, and unrelated to that incident, `/create:diagram` never had Codex, Pi, or Cursor mirrors — every sibling `/create:*` command has all three; diagram had none, since phase 005 never wired them.

### Purpose

Restore the dangling symlinks and bring `/create:diagram` to full cross-runtime parity, so the diagram command is reachable identically from every supported runtime, matching every sibling command.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Restore `.claude/commands -> ../.opencode/commands` (unblocks every `/create:*` command for Claude Code, not just diagram).
- Restore `.pi/extensions/completion-evidence.ts` and `.pi/extensions/task-dispatch-guard.ts` (dangling since the same bulk-sync commit).
- Generate `.codex/prompts/create-diagram.md` and `.pi/prompts/create-diagram.md` via their own sync scripts (`sync-prompts.cjs`, `sync-prompts-pi.cjs`), not hand-written.
- Add `.cursor/commands/create-diagram.md -> ../../.opencode/commands/create/diagram.md`, matching the symlink pattern every sibling command uses there.

### Out of Scope

- A full audit of the bulk-sync commit's other ~841 deletions outside the command/advisor/sk-doc scope — flagged as a named follow-up, not undertaken here.
- Any change to the diagram command's own content (`diagram.md`, its YAML assets) — this phase only adds reachability, not behavior.

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.claude/commands` | Restore | Symlink to `../.opencode/commands`, deleted by `e3a66403df` |
| `.pi/extensions/completion-evidence.ts`, `.pi/extensions/task-dispatch-guard.ts` | Restore | Symlinks deleted by the same commit; targets confirmed still present |
| `.codex/prompts/create-diagram.md` | Create | Generated via `sync-prompts.cjs` |
| `.pi/prompts/create-diagram.md` | Create | Generated via `sync-prompts-pi.cjs` |
| `.cursor/commands/create-diagram.md` | Create | Symlink to `.opencode/commands/create/diagram.md` |
| `016-command-mirror-restoration/` | Create | This phase's spec-folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every `/create:*` command is reachable from Claude Code again. | `.claude/commands/create/diagram.md` (and every sibling) resolves via the restored symlink. |
| REQ-002 | Both restored Pi extension symlinks resolve to an existing target. | `readlink -f` succeeds on both, target file exists. |
| REQ-003 | `/create:diagram` has Codex, Pi, and Cursor mirrors matching every sibling command's pattern. | All 3 files present; Codex/Pi mirrors are script-generated, not hand-written; Cursor mirror is a symlink. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No new command-reference integrity regression introduced. | `validate-command-references.cjs` shows the same 2 pre-existing, unrelated failures and nothing new. |
| REQ-005 | The generated mirrors are produced by the canonical sync scripts, not hand-authored. | `sync-prompts.cjs`/`sync-prompts-pi.cjs` each report writing exactly the 1 new file, confirming no other command was affected. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 3 dangling symlinks restored, confirmed resolvable.
- **SC-002**: `/create:diagram` reachable from all 4 runtimes (OpenCode native, Claude via symlink, Codex/Pi via generated prompt, Cursor via symlink) — full parity with siblings.
- **SC-003**: `validate-command-references.cjs` shows no new failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The bulk-sync commit's other ~841 deletions could hold further undiscovered regressions outside this phase's scope. | Medium (deferred) | Scoped this phase's sweep to command/advisor/sk-doc paths only; named the broader audit as a follow-up rather than silently expanding scope or silently ignoring the risk. |
| Dependency | `sync-prompts.cjs` / `sync-prompts-pi.cjs` regeneration scripts | High | Confirmed both exist and ran clean before relying on their output. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Packet root: `../spec.md`
- Related incident: commit `e3a66403df` (bulk-sync that caused the regression)
