---
title: "Tasks: deep-review P1+P2 remediation"
description: "16-finding remediation via single cli-codex dispatch + verification."
trigger_phrases:
  - "102 p1 p2 remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure/005-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-11T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-005-deep-review-p1-p2-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: deep-review P1+P2 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Verify all 9 files in scope exist on disk.
- [ ] T002 Read `../review/deep-review-dashboard.md` to confirm 16 findings.
- [ ] T003 Baseline strict-validate state of 004 captured.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Compose comprehensive cli-codex prompt enumerating all 16 finding → edit pairs.
- [ ] T005 Dispatch cli-codex `gpt-5.5 / high / fast` with `-c sandbox_workspace_write.network_access=true`; capture transcript.
- [ ] T006 Inspect transcript for partial application; retry any failed edits via Claude Edit.

### Findings → Edits enumerated

P1 fixes:
- [ ] T010 `102/spec.md` Phase 2 status Draft → Complete (F-000-001 / F-001-001)
- [ ] T011 `102/spec.md` 003→004 handoff row add SD-019 dispatch-gap note (F-001-005)
- [ ] T012 `002/checklist.md` CHK-003 add Phase 1→2 handoff acceptance evidence (F-000-002 / F-003-001)
- [ ] T013 `004/spec.md` Status Draft → Complete (F-001-002 promoted; closes F-003-002 ambiguity)
- [ ] T014 `004/implementation-summary.md` completion_pct 90→100; close open_questions; status Active→Complete (F-004-001)
- [ ] T015 `06--agent-dispatch/002-markdown-agent-cli-codex.md` add `expected_skip_in_non_interactive: true` + rationale (closes the open question)
- [ ] T016 `102/spec.md` add Known Issues section referencing F-001/F-002/F-003 + new review P1 IDs (F-004-003)

P2 fixes:
- [ ] T020 `001/spec.md` "1 of 3" → "1 of 5" (F-004-004)
- [ ] T021 `002/spec.md` "2 of 3" → "2 of 5" (F-003-003)
- [ ] T022 `003/spec.md` "3 of 3" → "3 of 5" (F-003-003)
- [ ] T023 `002/checklist.md` frontmatter completion_pct 0 → 100 (F-001-004 / F-004-002)
- [ ] T024 `004/checklist.md` mark all CHK items with evidence references (F-001-003)
- [ ] T025 `102/spec.md` add 003-prior-review cross-reference (F-003-004)
- [ ] T026 No edit for F-002-001 (SD-020 session-id noise — accepted runtime metadata; document in implementation-summary)
- [ ] T027 No edit for F-000-003 (duplicate of F-004-001)
- [ ] T028 No edit for F-001-001 (consolidated with F-000-001 in T010)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T030 Run `validate.sh --strict` against 004; exit 0.
- [ ] T031 Run `validate.sh --strict` against 005; exit 0.
- [ ] T032 Grep matrix: "of 5" hits in 001/002/003/004 spec.md.
- [ ] T033 Grep matrix: `grep -n "Known Issues" 102/spec.md` (1 hit).
- [ ] T034 Grep matrix: `grep -n "expected_skip_in_non_interactive: true" 06--agent-dispatch/002-*.md` (1 hit).
- [ ] T035 Populate `implementation-summary.md` with per-finding closure rows.
- [ ] T036 Update parent `102/spec.md` Phase 4 + Phase 5 status rows to Complete (final pass).
- [ ] T037 Update parent `102/graph-metadata.json` `derived.status` active → completed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Strict-validate exit 0 on 004 AND 005
- [ ] `implementation-summary.md` enumerates closure evidence for all 16 dashboard findings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source of findings**: `../review/deep-review-dashboard.md` and `../review/review-report.md`
- **Memory hints**: `feedback_codex_cli_fast_mode.md`, `feedback_codex_sandbox_blocks_network.md`, `feedback_cli_codex_for_grunt_work.md`
<!-- /ANCHOR:cross-refs -->
