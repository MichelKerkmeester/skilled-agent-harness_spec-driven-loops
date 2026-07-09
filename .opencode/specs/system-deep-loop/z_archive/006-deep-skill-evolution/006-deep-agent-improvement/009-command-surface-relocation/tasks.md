---
title: "Tasks: Deep Agent Improvement Command Surface Relocation"
description: "Task list for moving the legacy agent-improvement command to /deep:start-agent-improvement-loop, making /prompt canonical, removing improve folders, and verifying repo-wide references."
trigger_phrases:
  - "tasks deep agent command relocation"
  - "prompt command migration tasks"
  - "remove improve command group tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/006-deep-agent-improvement/009-command-surface-relocation"
    last_updated_at: "2026-05-24T06:55:51Z"
    last_updated_by: "codex"
    recent_action: "completed migration tasks and verification recording"
    next_safe_action: "report final status"
    blockers: []
    key_files:
      - ".opencode/commands/README.txt"
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
      - ".opencode/commands/prompt.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000011"
      session_id: "codex-2026-05-24-command-surface-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep Agent Improvement Command Surface Relocation

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Move OpenCode agent-improvement auto asset to `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`.
- [x] T002 Move OpenCode agent-improvement confirm asset to `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`.
- [x] T003 Move Gemini agent command mirror to `.gemini/commands/deep/start-agent-improvement-loop.toml`.
- [x] T004 Remove obsolete `the legacy OpenCode improve command folder` folder.
- [x] T005 Remove obsolete `the legacy Gemini improve command folder` folder.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Update `.opencode/commands/deep/start-agent-improvement-loop.md` command syntax and asset paths.
- [x] T011 Update `.opencode/commands/prompt.md` setup text, purpose text, and examples to `/prompt`.
- [x] T012 Add/update `.gemini/commands/prompt.toml` root prompt mirror.
- [x] T013 Update `.opencode/commands/README.txt` to remove the improve group and list deep/root surfaces.
- [x] T014 Remove stale Gemini `/create:prompt` mirror drift so `/prompt` is the root prompt command.

## Phase 3: Repo-Wide Rewrite

- [x] T020 Replace `the legacy agent-improvement command` with `/deep:start-agent-improvement-loop` across the repo.
- [x] T021 Replace `the legacy prompt-improvement command` with `/prompt` across the repo.
- [x] T022 Replace old improve command file paths with new deep/root paths.
- [x] T023 Replace old `legacy agent-improvement assets` asset names with `deep_start-agent-improvement-loop_*`.
- [x] T024 Rewrite archives and changelogs per user request.

- [x] T030 Create `009-command-surface-relocation` phase folder.
- [x] T031 Populate Level 3 spec, plan, tasks, checklist, decision record, and implementation summary.
- [x] T032 Create/refresh child `description.json` and `graph-metadata.json`.
- [x] T033 Update parent `005-deep-agent-improvement` phase map and metadata with child `009`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T040 Run asset and deleted-folder checks.
- [x] T041 Run zero-old-reference gate.
- [x] T042 Run positive-reference gate.
- [x] T043 Run strict child spec validation.
- [x] T044 Run recursive parent spec validation.
- [x] T045 Run skill-advisor routing smoke tests.
- [x] T046 Run OpenCode alignment drift check and report result.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No old improve command references remain under the requested zero-reference gate.
- [x] Verification results are recorded in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Decision record: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
