---
title: "Tasks: sk-create-diagram manual playbook execution"
description: "Task queue for running all 9 scenarios and gathering results."
trigger_phrases:
  - "diagram playbook execution tasks"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/009-manual-playbook-execution"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue"
    next_safe_action: "Run T002 (dispatch 1)"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram manual playbook execution

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all 9 scenario prompts; confirm DeepSeek direct-API auth; provision + smoke-test `docs/system.drawio` + `docs/onboarding.md`; confirm Playwright absent [EVIDENCE: `opencode providers list` shows DeepSeek 5/5 credentials; both fixtures parsed cleanly by the real extraction scripts; `python3 -c "import playwright"` -> ModuleNotFoundError.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [B] Dispatch 1 (deepseek/deepseek-v4-flash): execute DIA-001..004 for real [EVIDENCE: 4/4 PASS self-reported; 3 real HTML files written (8376/9641/7763 bytes), DIA-003 correctly wrote nothing.]
- [x] T003 Independently verify dispatch 1's claims [EVIDENCE: file existence 3/3 confirmed, accessible-SVG contract present, `style-guide.md` untouched (`git status` empty diff) for DIA-003, sketchy-filter/callout counts confirmed via grep, Google Fonts link confirmed consistent with the packet's own shipped template (not a new defect).]
- [x] T004 Record DIA-001..004 via `run-manual-playbook-scenario.cjs` [EVIDENCE: 4/4 report folders created.]
- [x] T005 [B] Dispatch 2 (deepseek/deepseek-v4-flash): execute IMP-001..002 for real [EVIDENCE: 2/2 PASS self-reported; both extraction scripts run for real, 2 redrawn HTML files written.]
- [x] T006 Independently verify dispatch 2's claims [EVIDENCE: file existence 2/2 confirmed, both source-file checksums independently recomputed and matched the claimed byte-unchanged values exactly (56cd965cc2..., cf55ce110c...).]
- [x] T007 Record IMP-001..002 via `run-manual-playbook-scenario.cjs` [EVIDENCE: 2/2 report folders created.]
- [x] T008 [B] Dispatch 3 (deepseek/deepseek-v4-flash): execute IMP-003, CMD-001, CMD-002 for real [EVIDENCE: IMP-003 SKIP (PNG blocked), CMD-001/002 PASS self-reported.]
- [x] T009 Independently verify dispatch 3's claims [EVIDENCE: SVG file valid XML confirmed; **caught a real discrepancy** — dispatch 3's claimed "before" checksum for `checkout-architecture.html` did not match the actual file; independently confirmed via mtime (unchanged), byte-count (matches dispatch 1's own report), and content (all 3 node labels intact) that the file was genuinely untouched, then recorded the orchestrator's own recomputed checksum instead of the dispatch's unverified claim. Also independently confirmed the `export diagram` alias gap in `hub-router.json` is real (first check used the wrong JSON key path, corrected and reconfirmed).]
- [x] T010 Record IMP-003, CMD-001, CMD-002 via `run-manual-playbook-scenario.cjs` with corrected evidence [EVIDENCE: 3/3 report folders created.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirm the harness-generated run index reflects all 9 results correctly [EVIDENCE: `benchmark/reports/README.md` (auto-generated) shows 9 rows: 8 PASS, 1 SKIP, 0 FAIL — matches every recorded verdict exactly.]
- [x] T012 Evaluate the playbook's own Release Readiness Rule [EVIDENCE: no FAIL verdict; all 5 critical-path scenarios (DIA-001, DIA-002, IMP-001, IMP-002, CMD-001) PASS; coverage 9/9; 2 non-blocking follow-ups documented, no unresolved BLOCKING triage -> releasable.]
- [x] T013 Write `implementation-summary.md`
- [x] T014 Write `checklist.md` [EVIDENCE: `checklist.md` in this folder, 11 items across P0/P1, all with `[EVIDENCE: ...]` brackets.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required tasks marked [x]
- [x] No [B] tasks remain
- [x] All gates clean; 1 real evidence-fabrication finding caught and corrected before recording
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
