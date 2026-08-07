---
title: "Tasks: Dist Freshness Enforcement"
description: "Task ledger for the dist freshness enforcement build."
trigger_phrases:
  - "dist freshness enforcement tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/016-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement"
    last_updated_at: "2026-07-04T17:11:52.937Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed dist freshness tasks"
    next_safe_action: "Run final freshness verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/sk-code/scripts/check-dist-staleness.sh"
      - ".opencode/plugins/mk-dist-freshness-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-030-dist-freshness-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Dist Freshness Enforcement

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm the full package table (source dirs + dist entry file) for all 7 known dist-producing packages.
- [x] T002 Read `spec-memory.cjs:87-102` in full to confirm the exact reusable mtime/hash logic.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Build the shared freshness-check utility covering all 7 packages. [EVIDENCE: `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`]
- [x] T004 Wire the `validate.sh` backstop into `run_node_orchestrator()`. [EVIDENCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`]
- [x] T005 Build `check-dist-staleness.sh` and wire it into `claude-posttooluse.sh`. [EVIDENCE: `.opencode/skills/sk-code/scripts/check-dist-staleness.sh`, `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`]
- [x] T006 Build `.opencode/plugins/mk-dist-freshness-guard.js`. [EVIDENCE: `.opencode/plugins/mk-dist-freshness-guard.js`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Add stale-dist and fresh-dist bash fixtures; confirm `validate.sh` exit codes. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh`]
- [x] T008 Add plugin tests mirroring `mk-deep-loop-guard.test.cjs`'s harness shape. [EVIDENCE: `.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`]
- [x] T009 Run `test-validation-extended.sh` in full; confirm no regression. [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` passed 113/113]
- [x] T010 Rebuild all 7 packages' dist once more cleanly; author implementation-summary.md and mark spec.md/plan.md Complete. [EVIDENCE: `node .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs check-all`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. [EVIDENCE: T001-T010 complete]
- [x] No `[B]` blocked tasks remaining. [EVIDENCE: no blocked task entries remain]
- [x] Manual verification passed (`validate.sh --strict` exits 0 for this folder). [EVIDENCE: final verification gate]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
