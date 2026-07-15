---
title: "Tasks: /create:diff slash command for the create-diff mode"
description: "Planned implementation queue for the /create:diff command: author the router, presentation contract, and auto/confirm workflow YAML; generate the Codex stub via sync-prompts.cjs; wire the mode-registry command field; verify asset existence, tool-surface subset, engine-never-bypassed, and recursive strict validation."
trigger_phrases:
  - "create diff command tasks"
  - "diff command router tasks"
  - "create-diff command workflow tasks"
importance_tier: "important"
contextType: "implementation"
status: "in-progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/009-create-diff-command"
    last_updated_at: "2026-07-15T20:10:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the Level 2 planning docs for the /create:diff command child"
    next_safe_action: "Author the command router, presentation contract, and auto/confirm workflow YAML assets"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-command-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: /create:diff slash command for the create-diff mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)

> This is a newly-created, not-yet-built packet: every task is `[ ]` pending. No task is claimed complete and no evidence is recorded until the command is actually built.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the sibling command pattern by reading `flowchart.md` + its three assets, and the create-diff engine CLI surface from `create-diff/SKILL.md` §3; freeze scope in `spec.md` (full sibling pattern, engine-backed).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Author `.opencode/commands/create/diff.md`: frontmatter (`description`, `argument-hint`, `allowed-tools: Read, Write, Edit, Bash, Glob, Grep`) + ROUTER CONTRACT / OWNED ASSETS / MODE ROUTING / EXECUTION TARGETS / PRESENTATION BOUNDARY / WORKFLOW SUMMARY, ending `User request: $ARGUMENTS`, modeled on `flowchart.md` (REQ-001, REQ-004) (`.opencode/commands/create/diff.md`).
- [ ] T003 Author `create_diff_presentation.txt`: Phase 0 packet-resource self-check, the four startup questions (which document; automatic-baseline vs explicit before/after pair; report output path; unified vs side-by-side view), setup/status dashboards, and the completion display (report path + change counts + fidelity tier + validator result) (REQ-007) (`.opencode/commands/create/assets/create_diff_presentation.txt`).
- [ ] T004 [P] Author `create_diff_auto.yaml`: autonomous workflow — resolve inputs → `create_diff.py compare` (automatic baseline) or `compare-pair` (explicit pair) → `validate_report.py` on the output → present; no approval gates (REQ-001, REQ-003) (`.opencode/commands/create/assets/create_diff_auto.yaml`).
- [ ] T005 [P] Author `create_diff_confirm.yaml`: interactive checkpointed workflow with the same engine steps as `:auto`; the default when no mode is given (REQ-001, REQ-003) (`.opencode/commands/create/assets/create_diff_confirm.yaml`).
- [ ] T006 Set the create-diff mode's `command` field in `mode-registry.json` from `null` to `"/create:diff"`; keep the JSON valid (REQ-005) (`.opencode/skills/sk-doc/mode-registry.json`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Generate `.codex/prompts/create-diff.md` via `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` from the OpenCode command; confirm it is idempotent and carries no hand-authored drift (REQ-006) (`.codex/prompts/create-diff.md`).
- [ ] T008 Verify `:auto`, `:confirm`, and an omitted mode each resolve exactly one workflow YAML, and that the router references only owned assets that exist on disk (REQ-001, REQ-002).
- [ ] T009 Verify `allowed-tools` is a subset of the create-diff mode surface with no `Task`, and that the workflow drives `create_diff.py` + `validate_report.py` without re-implementing any diffing (REQ-003, REQ-004).
- [ ] T010 Run `parent-skill-check.cjs` (create-diff registered with its command) and confirm `mode-registry.json` is valid (REQ-005).
- [ ] T011 Run `validate.sh --recursive --strict` on 999; confirm 0 content/structure errors for this child (the not-yet-generated `description.json`/`graph-metadata.json` are produced by the operator afterward).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Router + presentation + both workflow YAMLs authored; every owned asset resolves
- [ ] `:auto`/`:confirm`/omitted-mode each resolve exactly one workflow YAML
- [ ] `allowed-tools` is a subset of the mode surface with no `Task`
- [ ] The workflow drives the engine end to end; no diffing re-implemented; source byte-unchanged
- [ ] `mode-registry.json` `command` = `"/create:diff"`; `parent-skill-check.cjs` clean
- [ ] Codex stub generated (not hand-edited) and idempotent
- [ ] Recursive strict validation clean (content/structure) on the 999 parent
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Predecessor (hardened engine)**: `../008-fidelity-safety-a11y-hardening/`
- **Modeled-on router**: `../../../../commands/create/flowchart.md`
- **Engine + validator**: `../../../../skills/sk-doc/create-diff/scripts/`
<!-- /ANCHOR:cross-refs -->
