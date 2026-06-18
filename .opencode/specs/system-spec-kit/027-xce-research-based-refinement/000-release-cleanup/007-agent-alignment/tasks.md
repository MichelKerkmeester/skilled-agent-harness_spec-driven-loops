---
title: "Tasks: Agent Alignment"
description: "Planned task outline for Agent Alignment."
trigger_phrases:
  - "agent alignment tasks"
  - "027 release cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/007-agent-alignment"
    last_updated_at: "2026-06-10T15:30:42Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Aligned agent runtime mirrors to shipped agent-io and verification doctrine"
    next_safe_action: "No further action for this phase; restart runtimes to load changed agent definitions"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-007-agent-alignment-planned"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved Planned release-cleanup scaffolds."
---
# Tasks: Agent Alignment

<!-- SPECKIT_LEVEL: 1 -->
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
## PHASE 1: SETUP

- [x] T001 Inventory current claims (.opencode/agents/**, .claude/agents/**, .codex/agents/**) — Evidence: 12 agent triplets found in all three mirrors; normalized body comparison identified drift in 11 triplets and confirmed @code already aligned.
- [x] T002 List claims about schema, flags, CLI, constitutional rules, memory features, and doctrine (.opencode/agents/**, .claude/agents/**, .codex/agents/**) — Evidence: shipped contract and verification changelogs read; marker checks covered AGENT_IO groups, reviewer_focus/spec_drift, read-budget, status honesty, active-P0 verdict lock, and consume-only verdict discipline.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T003 [P] Align stale schema and flag references (.opencode/agents/**, .claude/agents/**, .codex/agents/**) — Evidence: stale packet/ADR/task labels and obsolete `/spec_kit:resume`/capability-scan wording absent after grep.
- [x] T004 [P] Align CLI front-door and memory-feature references (.opencode/agents/**, .claude/agents/**, .codex/agents/**) — Evidence: canonical `.opencode` bodies propagated to `.claude` and `.codex` with runtime path-format substitution only.
- [x] T005 [P] Align constitutional-rule and doctrine references (.opencode/agents/**, .claude/agents/**, .codex/agents/**) — Evidence: shipped agent I/O and peck doctrine markers present across owning agents in all mirrors.
- [x] T006 Preserve ownership boundary: Keep three-mirror parity explicit. (.opencode/agents/**, .claude/agents/**, .codex/agents/**) — Evidence: wrappers preserved; no command, skill, source, routing, permission, identity, or commit changes made.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T007 Run strict validation for this child phase (.opencode/skills/system-spec-kit/scripts/spec/validate.sh) — Evidence: strict validation exit 0 recorded in implementation-summary.md.
- [x] T008 Record evidence in implementation-summary.md (implementation-summary.md) — Evidence: implementation summary updated with touched agents, drift fixed, parity, stale-doctrine grep, TOML parse, and validation evidence.
- [x] T009 Confirm no out-of-scope source, command, agent, skill, or YAML edits were made (git diff) — Evidence: global git status contains concurrent sibling-lane changes outside this task; this lane's edits were limited to agent mirrors and this phase's spec docs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All planned tasks are complete or explicitly deferred with approval
- [x] No blocked tasks remain
- [x] Strict validation passes for this child phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
