---
title: "Tasks: Phase 2: hub-scaffold-and-mode-migration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
  - "hub scaffold tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-orca/002-consolidate-official-orca-skills/review/containment/quarantine/1/content/specs/cli-jev/002-cli-jev-hub-migration/002-hub-scaffold-and-mode-migration"
    last_updated_at: "2026-09-20T14:35:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Task list authored at closeout from the executed hub stand-up"
    next_safe_action: "Run phase 003: decouple the old hub and rewire dispatch, hooks and rosters"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-002-hub-scaffold-and-mode-migration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: hub-scaffold-and-mode-migration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the pre-move state: the hub directory absent, the packet still under `.skilled/skills/cli-external-orchestration/cli-jev/`, and the old hub's compiled-routing registration green (repo root)
- [x] T002 Read the sanctioned scaffolder's contract — `/create:skill-parent`, its auto workflow and the five sk-doc parent-skill templates — and record that its Phase 0 `@markdown` persona gate cannot be satisfied by a non-interactive orchestrator session (`.skilled/commands/create/`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/`)
- [x] T003 Census the mode folder for old-hub references and for the `cli-jev` string by file, so every later edit is a classified one rather than a blind substitution (`.skilled/skills/cli-external-orchestration/cli-jev/**`)
- [x] T004 [P] Record the old hub's `cli-jev` registration as the source of the retag: mode key, `packetKind`, `backendKind`, `toolSurface`, aliases, `advisorRouting`, the `transport-axis` block, the router signal and its two vocabulary classes (`.skilled/skills/cli-external-orchestration/mode-registry.json`, `hub-router.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author the hub registry with the retagged mode and the moved axis (`.skilled/skills/cli-jev/mode-registry.json`)
- [x] T006 Author the hub router: `defaultMode: null`, one `cli-usage` signal over the alias and dispatch classes, `tieBreak: ["cli-usage"]` (`.skilled/skills/cli-jev/hub-router.json`)
- [x] T007 Author the hub description and the single hub advisor identity (`.skilled/skills/cli-jev/description.json`, `.skilled/skills/cli-jev/graph-metadata.json`)
- [x] T008 Author the thin hub `SKILL.md` with the mode table, the hub's allowed-tools union and the compiled-routing directive block carrying all four markers (`.skilled/skills/cli-jev/SKILL.md`)
- [x] T009 Author the hub `README.md` and the `stage1-only` root `ROUTER.md` with all four machine collections declared and empty (`.skilled/skills/cli-jev/README.md`, `.skilled/skills/cli-jev/ROUTER.md`)
- [x] T010 Author the hub companion files: hub changelog, benchmark baseline and the non-discoverable shared note (`.skilled/skills/cli-jev/changelog/v1.0.0.0.md`, `benchmark/README.md`, `shared/README.md`)
- [x] T011 Move the packet with the rename recorded: `mkdir -p .skilled/skills/cli-jev` then `git mv .skilled/skills/cli-external-orchestration/cli-jev .skilled/skills/cli-jev/cli-usage`
- [x] T012 Retag the packet: frontmatter `name: cli-usage`, version `1.0.2.0`, and the migration changelog entry (`.skilled/skills/cli-jev/cli-usage/SKILL.md`, `cli-usage/changelog/v1.0.2.0.md`)
- [x] T013 Regenerate the hub leaf manifest so the mode entry and its five leaves are recorded from the new location (`.skilled/skills/cli-jev/leaf-manifest.json`)
- [x] T014 Identity-pass the mode's own docs: packet `SKILL.md`, `README.md`, the five feature-catalog pages, the benchmark index and reports index, the playbook root and its scenario files, and the four reference pages (`.skilled/skills/cli-jev/cli-usage/**`)
- [x] T015 Author the hub's verification surface: the playbook root index and three `CJ-` hub-routing scenarios (`.skilled/skills/cli-jev/manual-testing-playbook/**`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the doctor and record its first verdict, then fix and re-run: the first run failed `3d-name-frontmatter` and `9a` (`.skilled/skills/cli-jev`)
- [x] T017 Run the package validator in strict mode and record the three sub-check lines (`.skilled/skills/cli-jev`)
- [x] T018 Probe the hub's serving state and confirm the documented legacy sentinel rather than a broken lookup (`.skilled/skills/cli-jev`)
- [x] T019 Dispatch the two read-only reviewers over the finished tree and triage every finding: six fixed in place, two assigned to phase 003 with the interim evidence recorded (`.skilled/skills/cli-jev`, `.skilled/hooks/dispatch/**`)
- [x] T020 Re-run both gates on the post-triage bytes and record the final counts (`.skilled/skills/cli-jev`)
- [x] T021 Record the interim states the phase intentionally leaves: the old hub's `FAIL: 3c` on the dangling packet, the preflight's fail-open hard rules, the red dispatch bijection test, and the stale generated surfaces owned by phase 003 (repo root)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
