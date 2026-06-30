---
title: "Tasks: Phase 20: system-code-graph Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "system-code-graph frontmatter tasks"
  - "code graph doc contract tasks"
  - "doc contract normalization tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/020-system-code-graph"
    last_updated_at: "2026-06-11T09:29:13Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/references/runtime/launcher_lease.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-020-system-code-graph"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: system-code-graph Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 7/7 docs fail — 6 missing `importance_tier`+`contextType`, `launcher_lease.md` also missing `trigger_phrases` (`check-skill-doc-frontmatter.sh --skill system-code-graph --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add tier+contextType to the 6 partial-block docs (`.opencode/skills/system-code-graph/references/{config/database_path_policy,readiness/code_graph_readiness_check,readiness/readiness_and_scope_fingerprint,runtime/naming_conventions,runtime/ownership_boundary,runtime/tool_surface}.md`)
- [x] T003 Author the full detailed block on `launcher_lease.md`: 4 phrases derived from the lease mechanism, tier `normal`, contextType `implementation` (`.opencode/skills/system-code-graph/references/runtime/launcher_lease.md`)
- [x] T004 Replace camelCase phrase `ensureCodeGraphReady` with lowercase multi-word "ensure code graph ready" (`code_graph_readiness_check.md`); promote the four formal contract docs (`database_path_policy.md`, `readiness_and_scope_fingerprint.md`, `naming_conventions.md`, `ownership_boundary.md`) to `important`; descriptive docs stay `normal`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Coverage check green: `PASS mode=coverage scope=system-code-graph docs=7 carrying-detailed-block=7 violations=0`
- [x] T006 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "code graph launcher lease stale reclaim" ranks system-code-graph first (0.95) with `!code graph launcher lease(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T007 Diff hygiene: git diff shows frontmatter-only hunks for the 7 files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (coverage check + routing smoke without touching the live daemon)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification evidence**: See `implementation-summary.md`
- **Contract origin**: `../001-frontmatter-benefit-investigation/research.md`
- **Pilot phase**: `../008-deep-loop-runtime/`
- **Consumer + checker packet**: `skilled-agent-orchestration/145-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
