---
title: "Tasks: command-template conformance across all seven OpenCode command families"
description: "Task breakdown for conforming create/design/doctor/memory/speckit/prompt-improve/goal_opencode command docs to the sk-doc create-command canon, behavior-preserving, validate_document --type command clean."
trigger_phrases:
  - "command template conformance tasks"
  - "create-command router vocabulary tasks"
  - "doctor header fix tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/001-command-template-conformance"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded shipped task list with commit + validate evidence"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/mcp.md"
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/commands/create/"
      - ".opencode/commands/memory/save.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All conformance work landed across two commits: 95b5a60240 and 52d17a8075."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: command-template conformance across all seven OpenCode command families

<!-- SPECKIT_LEVEL: 2 -->

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

P0 remediation of the two validator-failing families (INVALID → VALID).

- [x] T001 Conform `doctor/{mcp,speckit,update}.md` unnumbered → numbered six-section router-core, keeping the subsystem-dispatch model and `_routes.yaml`. Evidence: commit `95b5a60240` (doctor family P0, INVALID→VALID); each file `validate_document.py --type command` → exit 0, 0 blocking, 0 warnings.
- [x] T002 Conform `prompt-improve.md`: add the missing required leaf section; numbered H2s. Evidence: commit `52d17a8075`; `validate_document.py --type command` exit 1 → exit 0.
- [x] T003 Verify the four P0 files moved from exit 1 to exit 0. Evidence: `validate_document.py --type command` returns exit 0 / 0 blocking for `doctor/mcp.md`, `doctor/speckit.md`, `doctor/update.md`, `prompt-improve.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Canon vocabulary sweep across the remaining (validator-passing but drifted) families.

- [x] T004 [P] Rename `create/*` (10) Title-case sections (`Routing Assets`, `Routing Rules`) to the canonical six-section router vocabulary; keep the `_auto`/`_confirm`/`_presentation` triad. Evidence: commit `52d17a8075`; each file exit 0 / 0 warnings.
- [x] T005 [P] Replace `memory/*` (4) banned-synonym headers (`ROUTING ASSETS`, `WORKFLOW ROUTING`) with canon; use presentation-only OWNED ASSETS + EXECUTION TARGETS (direct-dispatch variant, no workflow YAML authored). Evidence: commit `52d17a8075`; each file exit 0 / 0 warnings.
- [x] T006 Correct `memory/save.md`'s "Missing upstream asset" mis-framing to a plain by-design no-workflow-YAML statement. Evidence: commit `52d17a8075`; the mis-framing line is replaced; `validate_document.py --type command` exit 0.
- [x] T007 [P] Fold inserted sections / renumber `design/*` (5) and `speckit/{complete,implement,plan}.md` (3) where recommended-section warnings remained. Evidence: commit `52d17a8075`; each file exit 0 / 0 warnings. `goal_opencode.md` and `speckit/resume.md` confirmed already conformant — unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `validate_document.py --type command` across every in-scope command file. Evidence: all 23 modified files → exit 0, 0 blocking, 0 warnings (CONFIRMED).
- [x] T009 Run the per-file reference-set behavior diff (HEAD vs conformed) over every dispatch target, asset path, and `$ARGUMENTS` token. Evidence: ZERO losses across all 23 modified files (CONFIRMED; satisfies REQ-004).
- [x] T010 Confirm report anchors present per conformed file. Evidence: report anchors present on each conformed file across commits `95b5a60240` and `52d17a8075`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]` with evidence (commit hashes + validate exit codes).
- [x] No `[B]` blocked tasks remaining.
- [x] doctor family + prompt-improve moved INVALID → VALID (exit 1 → 0).
- [x] Every in-scope command doc exits 0 on `validate_document.py --type command`.
- [x] Behavior preserved — reference-set diff clean across all 23 modified files.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent packet**: See `../spec.md` (138-command-agent-canon-conformance)
<!-- /ANCHOR:cross-refs -->
