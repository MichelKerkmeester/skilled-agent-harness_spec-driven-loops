---
title: "Tasks: Pi manual-testing playbook authoring"
description: "Task breakdown for authoring the cli-pi manual-testing playbook root file and 19 PI-NNN scenario files."
trigger_phrases: ["pi manual testing playbook authoring tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/013-pi-manual-testing-playbook-authoring"
    last_updated_at: "2026-07-27T17:10:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks executed with real evidence; phase Complete"
    next_safe_action: "None -- terminal phase"
    blockers: []
    key_files: ["../010-pi-manual-testing-playbook/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi manual-testing playbook authoring

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

- [x] T001 Confirm phase 012 landed [EVIDENCE: commit `97036ca885`, `.pi/prompts/` (36) + `.pi/agents/` (13) + `.pi/extensions/` (7) all present and live-verified]
- [x] T002 [P] Re-read `010-pi-manual-testing-playbook/spec.md` §9 verbatim [EVIDENCE: all 19 rows reproduced verbatim in the LUNA dispatch brief and executed against exactly that scope, no redesign]
- [x] T003 [P] Re-read `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` in full [EVIDENCE: root file mirrors its 17-section shape plus one disclosed addition]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the root `manual-testing-playbook.md` [EVIDENCE: 318 lines, 17 sections, independently re-validated `VALID, 0 issues`]
- [x] T005 [P] Author `cli-invocation/` scenarios (PI-001..003) [EVIDENCE: 3 files present]
- [x] T006 [P] Author `skill-discovery/` scenarios (PI-004..006) [EVIDENCE: 3 files present]
- [x] T007 [P] Author `command-dispatch/` scenarios (PI-007..008) [EVIDENCE: 2 files present]
- [x] T008 [P] Author `agent-bridge/` scenarios (PI-009..010) [EVIDENCE: 2 files present]
- [x] T009 [P] Author `mcp-host-integration/` scenarios (PI-011..013) [EVIDENCE: 3 files present]
- [x] T010 [P] Author `hook-extension-layer/` scenarios (PI-014..016) [EVIDENCE: 3 files present]
- [x] T011 [P] Author `model-dispatch/` scenarios (PI-017..018) [EVIDENCE: 2 files present]
- [x] T012 [P] Author `prompt-quality/` scenario (PI-019) [EVIDENCE: 1 file present]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Live-execute PI-007/008 (command-dispatch) [EVIDENCE: 36-prompt count confirmed, `$ARGUMENTS` token confirmed real per a live pi.dev docs fetch, live session exit clean]
- [x] T014 Live-execute PI-009/010 (agent-bridge) [EVIDENCE: `sync-agents-pi.cjs --check` PASS 13/13; PI-010's live-collision sub-check correctly SKIPPED with the real-environment safety-boundary reason, independently confirmed `~/.pi/agent/agents/` does not exist]
- [x] T015 Live-execute PI-014/015/016 (hook-extension-layer) [EVIDENCE: live session loaded all 7 extensions without a startup error; PI-016 honestly documents the title/behavior (fail-closed vs. fail-open) mismatch rather than silently reinterpreting it]
- [x] T016 Run `validate_document.py`/`extract_structure.py` [EVIDENCE: all 20 files independently re-run by me, 0 issues each]
- [x] T017 Dispatch GLM-5.2 for an independent review [EVIDENCE: full playbook reviewed; verdict recorded in `implementation-summary.md`]
- [x] T018 Metadata round-trip + `validate.sh --strict` [EVIDENCE: see `implementation-summary.md`]
- [x] T019 Author `implementation-summary.md` [EVIDENCE: this document]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with real evidence
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` exits with `Errors: 0` for this phase folder
- [x] Whole-packet `validate.sh --recursive --strict` still `Errors: 0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Depends on `../010-pi-manual-testing-playbook/`, `../012-pi-runtime-compatibility/`
- Terminal phase of `031-cli-pi-creation`
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
