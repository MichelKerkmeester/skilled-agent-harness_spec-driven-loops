---
title: "Tasks: Phase 6 — build remaining modes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code build remaining modes tasks"
  - "code mode contract tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/006-build-remaining-modes"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented completed mode-contract build tasks"
    next_safe_action: "phase 007 advisor-and-integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6 — build remaining modes

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

- [x] T001 Recover the pre-hub flat doctrine; evidence: `git show <scaffold-commit>~1:.opencode/skills/sk-code/SKILL.md` = 316 lines, section headings mapped to owning modes.
- [x] T002 Inventory consumed vs owned material; evidence: `shared/references/{stack_detection,smart_routing,phase_detection}.md` + `universal/*` are consumed; each packet's `references/`, `assets/`, `scripts/` are pointed at.
- [x] T003 Fix mirror + tool surfaces; evidence: `sk-design/design-interface` + `design-audit` as shape; `mode-registry.json` tool surfaces recorded per mode.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `code-implement/SKILL.md`; evidence: 265 lines, `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]`, owns Phase 0 research + Phase 1 implementation + WEBFLOW/OPENCODE/UNKNOWN authoring workflows, OPENCODE language sub-detection, write-time authoring-checklist pointer to `../code-quality/`.
- [x] T005 Author `code-implement/README.md`; evidence: 86-line mode orientation doc.
- [x] T006 Author `code-quality/SKILL.md`; evidence: 263 lines, `allowed-tools: [Read, Edit, Bash, Grep, Glob]`, owns Phase 1.5 gate, P0/P1/P2 model, target-path checklist map, three comment-hygiene enforcement layers.
- [x] T007 Author `code-quality/README.md`; evidence: 109-line mode orientation doc.
- [x] T008 Author `code-debug/SKILL.md`; evidence: 237 lines, `allowed-tools: [Read, Edit, Bash, Grep, Glob, Task]`, owns Phase 2 root-cause, one-cause-fix rule, bounded-Task boundary, three-strike escalation discipline.
- [x] T009 Author `code-debug/README.md`; evidence: 109-line mode orientation doc.
- [x] T010 Author `code-verify/SKILL.md`; evidence: 272 lines, `allowed-tools: [Read, Bash, Grep, Glob]`, owns Phase 3 Iron Law, verification ladder, mutation/claim-falsifier ritual, baseline/delta contract, explicit non-mutating boundary.
- [x] T011 Author `code-verify/README.md`; evidence: 116-line mode orientation doc.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Assert tool-surface equality; evidence: all four `allowed-tools` lines equal their `mode-registry.json` `toolSurface.allowed`; `code-verify` non-mutating (no Edit/Write/Task).
- [x] T013 Assert one-identity; evidence: `find` returns no `graph-metadata.json` under any of the four packets.
- [x] T014 Resolve links; evidence: deterministic resolver — 117 links in the implement pair + 89 links across the other three pairs all resolve.
- [x] T015 Scan comment hygiene; evidence: 0 spec-path/artifact-id violations inside code fences across the four SKILL.md files.
- [x] T016 Read contracts for correctness; evidence: each mode owns one phase, consumes `../shared/`, cross-references the four siblings, and routes handoffs correctly.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Four mode contracts built and verified; phase 007 advisor-and-integration is the next safe action
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
