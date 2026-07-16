---
title: "Tasks: Phase 6: live-verification-capture (mcp-refero)"
description: "Task list for recording the 2026-07-16 refero discovery fixture, closing the doubled-prefix naming conflict, and correcting the pre-auth discovery preconditions."
trigger_phrases:
  - "refero discovery tasks"
  - "refero fixture tasks"
  - "refero live verification tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "All tasks complete with evidence"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-refero"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: live-verification-capture

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

- [x] T001 Read the discovery fixture end to end and extract the observed facts (`references/discovery-fixture-2026-07-16.json`) [evidence: 8/8 names in `discoveredCallableNames` (`refero.refero.refero_search_styles` through `refero.refero.refero_get_flow`); `Access as: refero.refero_refero_search_styles(args)`; `response_format?: "json" | "md"` in `tool_info_first`]
- [x] T002 Grep the packet for conflict and OAuth-gated-discovery wording (`mcp-refero/**`) [evidence: `rg -n "doubled|conflict|confirm" README.md INSTALL_GUIDE.md mcp-servers examples assets` produced the 7-file flip set]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flip SKILL.md: naming trap, discovery paragraph, quick-ref callable row, version 1.1.1.0 (`mcp-refero/SKILL.md`) [evidence: 4 edits; frontmatter `version: 1.1.1.0`]
- [x] T004 [P] Flip README.md naming paragraph, FAQ, and callable-confirmation verification row (`mcp-refero/README.md`) [evidence: 3 edits; verification row now reads "works pre-auth"]
- [x] T005 [P] Flip INSTALL_GUIDE.md preconditions and the tool_info checklist item (`mcp-refero/INSTALL_GUIDE.md`) [evidence: 3 edits; checklist item `[x]` with `tool_info_first` cited]
- [x] T006 [P] Flip references: mcp-wiring.md banner + naming section; tool-surface.md open questions 1 and 2 (`references/mcp-wiring.md`, `references/tool-surface.md`) [evidence: Q1 marked RESOLVED with 8/8 names; Q2 PARTIALLY RESOLVED with the 2 confirmed schemas]
- [x] T007 [P] Flip the server README and the DISCOVER-001 playbook rationale (`mcp-servers/refero-mcp/README.md`, `manual_testing_playbook/discovery-setup/discovery-first.md`) [evidence: 2 edits; both cite the fixture path]
- [x] T008 Add `changelog/v1.1.1.0.md` (`mcp-refero/changelog/v1.1.1.0.md`) [evidence: need/change/why sections + 9 file rows]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the packet gate and residual sweeps (`package_skill.py`, `rg`) [evidence: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-refero --check --strict` printed "Result: PASS"; scripts confirmed already-correct via grep (0 stale names), left untouched]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001-T009 above, 9/9]
- [x] No `[B]` blocked tasks remaining [evidence: zero `[B]` rows in this file]
- [x] Manual verification passed [evidence: checklist.md 100% verified with per-item evidence]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
