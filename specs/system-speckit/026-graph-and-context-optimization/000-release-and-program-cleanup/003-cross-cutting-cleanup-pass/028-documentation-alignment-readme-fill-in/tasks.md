---
title: "Tasks: Phase 053 doc-alignment and README fill-in [template:level_3/tasks.md]"
description: "Task breakdown for the 5 work-blocks plus packet scaffolding, verification, and completion gates."
trigger_phrases:
  - "phase 053 tasks"
  - "wave dispatch tasks"
  - "doc alignment tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in"
    last_updated_at: "2026-05-07T11:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Author checklist.md, restore graph-metadata, then dispatch Wave A"
    blockers: []
    key_files: []
    completion_pct: 12
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 053

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[~]` | In progress |
| `[x]` | Done |
| `[P0]` | Hard blocker |
| `[P1]` | Required |
| `[P2]` | Optional |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0 — Scaffold

- [x] T-001 [P0] Run create.sh --phase --phase-parent <parent> --phases 1 --level 3 --number 53
- [x] T-002 [P0] Verify still on `main` branch (stay-on-main rule)
- [x] T-003 [P0] Author spec.md with Level 3 content (replace L1 scaffold)
- [x] T-004 [P0] Author resource-map.md with detailed per-WB path catalog
- [x] T-005 [P0] Author decision-record.md with 3 ADRs (D-1 merge scope, D-2 prefix, D-3 manifest placement)
- [x] T-006 [P0] Author plan.md (this packet's plan)
- [x] T-007 [P0] Author tasks.md (this file)
- [ ] T-008 [P0] Author checklist.md (verification gates)
- [ ] T-009 [P1] Restore graph-metadata.json `parent_id` to `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup` (auto-generated value is null)
- [ ] T-010 [P1] Update parent (`000-release-cleanup/`) `graph-metadata.json.derived.last_active_child_id` to point at this packet
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1-wave-a -->
## Phase 1 — Wave A (parallel, 3 cli-codex dispatches)

- [ ] T-101 [P0] WB-1: dispatch cli-codex for `references/multi-ai-council/` 6 files; add reference frontmatter + intro + divider + numbered H2
- [ ] T-102 [P0] WB-2: dispatch cli-codex for `templates/manifest/{EXTENSION_GUIDE,MIGRATION}.md`; reference frontmatter + co-location header comment
- [ ] T-103 [P0] WB-3: dispatch cli-codex for `shared/predicates/README.md`; readme_code_template structure
- [ ] T-104 [P0] Wait for all three Wave A dispatches; capture per-file validator output
- [ ] T-105 [P1] If any WB-A target fails validator, re-dispatch only the failing file (avoid wholesale retry)
<!-- /ANCHOR:phase-1-wave-a -->

---

<!-- ANCHOR:phase-1-wave-b -->
## Phase 1 — Wave B (single cli-codex dispatch)

- [ ] T-201 [P0] WB-4: dispatch cli-codex for `mcp_server/code_graph/lib/utils/README.md`; readme_code_template, mirror `shared/parsing/README.md` brevity
- [ ] T-202 [P0] Validate WB-4 output
<!-- /ANCHOR:phase-1-wave-b -->

---

<!-- ANCHOR:phase-1-wave-c -->
## Phase 1 — Wave C (solo cli-codex, the merge)

- [ ] T-301 [P0] Pre-merge grep: `rg -ln 'operator_runbook' --hidden -uu` to map ALL repo references (capture in scratch/)
- [ ] T-302 [P0] WB-5: dispatch cli-codex solo for the merge:
  - port 43 operator_runbook scenarios into manual_testing_playbook with sk-doc per-feature scaffold
  - rewrite manual_testing_playbook.md entry-point to sk-doc template §1–6 + per-category summaries
  - absorb 4 SAD scenarios into NC-001/NC-004/NC-006/CL-001 (with "Absorbed from former SAD-NNN" notes)
  - add cross-reference appendix in entry-point: SAD-001..004 -> NC/CL targets
  - update all cross-repo references (from T-301 grep output) to point at manual_testing_playbook
  - `rm -rf` operator_runbook directory
- [ ] T-303 [P0] Validate every merged .md file with sk-doc validator
- [ ] T-304 [P0] `rg -ln 'operator_runbook' .opencode/ specs/` excluding this packet returns empty
- [ ] T-305 [P0] `rg -ln '\bSAD-00[1-4]\b' .opencode/` returns hits only in cross-ref appendix
- [ ] T-306 [P0] Per-test file count == 43
<!-- /ANCHOR:phase-1-wave-c -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2 — Verification

- [ ] T-401 [P0] Run sk-doc `validate_document.py` on every modified .md (full file list in resource-map.md §Author Instructions)
- [ ] T-402 [P0] Run `validate.sh --strict` on packet 053; exit 0 expected
- [ ] T-403 [P0] Verify directory removal: `test ! -d .../operator_runbook`
- [ ] T-404 [P1] Spot-check 2 random merged per-test files for §3 9-column TEST EXECUTION table presence
- [ ] T-405 [P1] Spot-check that NC-001/NC-004/NC-006/CL-001 receivers have "Absorbed from former SAD-NNN" notes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3 — Completion

- [ ] T-501 [P0] Fill implementation-summary.md with concrete evidence per WB (no `[YOUR_VALUE_HERE` markers remaining)
- [ ] T-502 [P0] Mark every checklist.md item `[x]` with evidence (file path + grep hit / test result)
- [ ] T-503 [P0] Final `validate.sh --strict` exit 0
- [ ] T-504 [P1] Run `generate-context.js` once more to refresh continuity; restore parent_id afterward
- [ ] T-505 [P1] Update parent `000-release-cleanup/graph-metadata.json.derived.status` if appropriate
<!-- /ANCHOR:phase-3 -->
