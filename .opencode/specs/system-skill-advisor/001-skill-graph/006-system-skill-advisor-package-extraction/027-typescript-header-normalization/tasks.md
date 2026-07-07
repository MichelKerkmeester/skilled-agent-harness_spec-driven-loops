---
title: "Tasks: TypeScript Header Normalization"
description: "Normalize TypeScript source module headers found by the packet 026 sk-code audit."
trigger_phrases:
  - "027"
  - "ts header normalization"
  - "tasks"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/027-typescript-header-normalization"
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
# Tasks: TypeScript Header Normalization

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

- [x] T010 [P0] Apply packet-scoped code/evidence changes. Evidence: Ledger closure script: `027 fixed=78, na=1, fail=0`.
- [x] T011 [P0] Keep unrelated dirty files unstaged. Evidence: staging plan excludes database and cli-devin changes.
- [x] T012 [P1] Record exceptions. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/context/budget-allocator.ts` no longer exists on main and is recorded as not applicable.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 [P0] Run both TypeScript typechecks. Evidence: advisor and spec-kit typechecks PASS.
- [x] T021 [P0] Run ledger closure checker. Evidence: packet 027 failures = 0.
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

- Parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction`
- Audit: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit/audit-report.md`
- This packet: `system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/027-typescript-header-normalization`
<!-- /ANCHOR:cross-refs -->
