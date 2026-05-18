---
title: "Tasks: Any Type Justification Sweep"
description: "Review every packet 026 possible-any finding and either justify real explicit-any usage or close false positives."
trigger_phrases:
  - "030"
  - "any type justification sweep"
  - "tasks"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/030-any-type-justification-sweep"
    last_updated_at: "2026-05-15T12:04:51Z"
    last_updated_by: "codex"
    recent_action: "Closed packet 026 sk-code follow-on ledger"
    next_safe_action: "Use verification evidence before any future expansion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Any Type Justification Sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete with evidence.
- `[ ]` pending.
- P0 blocks completion; P1 required unless documented.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read packet 026 audit report and implementation summary. Evidence: ledger counts captured.
- [x] T002 [P0] Read sk-code TypeScript, JavaScript, Python, and shared references. Evidence: header and type policies applied.
- [x] T003 [P1] Scaffold Level 2 packet folder. Evidence: this packet contains required docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P0] Apply packet-scoped code/evidence changes. Evidence: Ledger closure script: `030 fixed=0, na=10, fail=0`; explicit-any regex returned no matches.
- [x] T011 [P0] Keep unrelated dirty files unstaged. Evidence: staging plan excludes database and cli-devin changes.
- [x] T012 [P1] Record exceptions. Evidence: No justification comments were added because there were no real explicit-any type sites to justify.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 [P0] Run both TypeScript typechecks. Evidence: advisor and spec-kit typechecks PASS.
- [x] T021 [P0] Run ledger closure checker. Evidence: packet 030 failures = 0.
- [x] T022 [P1] Run packet strict validation. Evidence: final validation recorded in implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Assigned audit findings closed.
- [x] Verification evidence recorded.
- [x] No unrelated dirty files included in packet commit.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction`
- Audit: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/026-sk-code-and-code-readme-audit/audit-report.md`
- This packet: `system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/030-any-type-justification-sweep`
<!-- /ANCHOR:cross-refs -->
