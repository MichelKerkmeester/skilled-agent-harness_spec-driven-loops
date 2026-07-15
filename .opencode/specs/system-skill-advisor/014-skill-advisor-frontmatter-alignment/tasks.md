---
title: "Tasks: Phase 21: system-skill-advisor Frontmatter Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "system-skill-advisor frontmatter tasks"
  - "advisor doc contract tasks"
  - "phase 21 normalization tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/014-skill-advisor-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:31:00Z"
    last_updated_by: "claude-fable"
    recent_action: "All tasks complete and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-021-system-skill-advisor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: system-skill-advisor Frontmatter Alignment

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

- [x] T001 Capture coverage-mode baseline: 15/15 docs fail — `contextType` missing on all 15, `importance_tier` missing on 8, `trigger_phrases` missing on 1 (`check-skill-doc-frontmatter.sh --skill system-skill-advisor --coverage`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author the full detailed block for the one title+description-only doc: 5 trigger phrases from the runtime matrix, tier `important`, contextType `implementation` (`.opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md`)
- [x] T003 Apply tier policy: `important` only on the 5 contract/policy docs (`config/db_path_policy.md`, `runtime/daemon_lease_contract.md`, `runtime/freshness_contract.md`, `runtime/legacy_tool_bridge.md`, `hooks/skill_advisor_hook.md`); demote 5 over-marked docs to `normal` (`decisions/deferred_decisions.md`, `graph/skill_graph_drift.md`, `graph/skill_graph_query_cookbook.md`, `scoring/lane_weight_tuning.md`, `scoring/validation_baselines.md`)
- [x] T004 Assign contextType on all 15 docs: `implementation` x12, `planning` (`graph/skill_graph_extraction_plan.md`), `research` (`scoring/validation_baselines.md`), `general` (`decisions/deferred_decisions.md`)
- [x] T005 Replace weak phrases on the extraction roadmap: single-token `lib/skill-graph` and generic `skill graph database` swapped for `skill graph library ownership` and `skill graph migration status` (`.opencode/skills/system-skill-advisor/references/graph/skill_graph_extraction_plan.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Coverage check green: `PASS mode=coverage scope=system-skill-advisor docs=15 carrying-detailed-block=15 violations=0`
- [x] T007 Python local-mode smoke with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`: "advisor hook fail-open" ranks system-skill-advisor first (0.95) with `!advisor hook fail-open(signal)`; live-daemon `matchedDocs` smoke rides packet 145 T025
- [x] T008 Diff hygiene: git diff shows frontmatter-only hunks for the 15 files (36 insertions, 7 deletions)
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
- **Consumer + checker packet**: `system-skill-advisor/012-advisor-doc-trigger-harvest`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
