---
title: "Feature Specification: OpenBot parity research for skilled bots"
description: "Three research runs that answer what skilled bots must build for OpenBot parity and how deeply the build plan must be specified: the original parity research, the review of the 003 build plan, and the planning-depth check of each 003 phase."
trigger_phrases:
  - "openbot parity research"
  - "research how close skilled bots can get"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research"
    last_updated_at: "2026-11-25T22:45:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md. These belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: OpenBot parity research for skilled bots

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | None |
| **Parent Packet** | system-skilled-bots/002-openbot-parity-research |
| **Predecessor** | None |
| **Successor** | `003-openbot-parity-build` |
| **Handoff Criteria** | Every 003 build phase is either planned deeply enough to build in one shot or carries the child phases it needs, and each child passes `validate.sh --strict` for its own folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled bots can run a `BOT.md` by hand, from a queue or on a launchd schedule, park a question for an answer and report what ran. OpenBot gives a team far more: conversations with a bot, routines, memory, skills, connected apps, a computer, approvals and an activity feed, plus a desktop app. The research that answers which of those parts a small team needs outgrew one run. The first run ranked the gaps and named the reference repo to borrow from for each one. The second reviewed the build plan those gaps produced and found what a single-phase reading cannot see. The third checks whether each build phase is planned deeply enough that a builder needs no design decision while building. Three runs whose evidence arrives at different times do not fit one packet.

### Purpose
Answer what skilled bots must build for OpenBot parity, and how deeply the build plan must be specified, through one research run per child, so the build packet starts from a ranked, reviewed and depth-checked plan.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The three research runs, one child each: the original parity research, the review of the 003 build plan, and the planning-depth check of each 003 phase.
- The eight-part comparison the first run produced, with OpenBot's behavior, our current state, the best reference repo, the smallest change, its size and its risk for each part.
- The terminal verdict, the small-team model, the skip list with a reason per skipped part, and the reuse and licensing rule.
- The ranked build order the build packet reads, including the two operator decisions that moved the terminal screen up and fixed it as a new MIT Rust app.
- The review rounds 2 to 6 over the 003 build plan, the merged findings registry, and the repair order.
- The planning-depth verdict per 003 phase, with the child phases and planning artifacts each phase needs.

### Out of Scope
- Building any recommended change. The build lives in `../003-openbot-parity-build/`.
- Rewriting the 003 phase documents. The review reports findings and the build packet applies them.
- Reviewing the six children of `003-terminal-screen`. The depth run uses them as the benchmark for depth and does not review them.
- Changing the reference repos under `specs/system-skilled-bots/context/`. They are read-only inputs and stay gitignored.
- Enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts of OpenBot. The first run puts each on the skip list with its reason.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This table is the audit trail of the surfaces the three runs write.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-openbot-parity-research/research/` | Create | 001 | The loop state, 52 iteration records, four lineage syntheses, `research.md` and `resource-map.md` |
| `002-plan-review-research/research/` | Create | 002 | The review rounds 2 to 6, the merged findings registry and the synthesis |
| `003-plan-depth-research/research/` | Create | 003 | The fan-out state, the lineage records and the per-phase depth findings |
| `*/spec.md`, `*/plan.md`, `*/tasks.md` | Modify | 001, 002, 003 | Each child's own packet docs and continuity |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

The packet has three phases. Each is one research run over the OpenBot parity question, and each answers a different part of it.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-openbot-parity-research/` | The eight OpenBot bot parts compared against skilled bots and seven reference repos, the terminal verdict, the small-team model, the skip list, reuse and licensing, and the ranked build order | Complete |
| 2 | `002-plan-review-research/` | The build-readiness review of the 003 build plan, review rounds 2 to 6, with the merged findings registry and the repair order | Complete |
| 3 | `003-plan-depth-research/` | Whether each 003 build phase is planned deeply enough to build in one shot, with the child phases and planning artifacts each one needs | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-openbot-parity-research | 002-plan-review-research | The ranked build order exists and the 003 build plan is written from it | `001-openbot-parity-research/research/research.md` §15 names the order, and the 003 parent's phase map carries one row per ranked slice |
| 002-plan-review-research | 003-plan-depth-research | Every P0 and P1 the review raised is fixed in the 003 docs or recorded as a decision | The merged findings registry holds no open P0, and each P1 names its fix |
| 003-plan-depth-research | `../003-openbot-parity-build/` | Every 003 phase is deep enough to build in one shot or carries the child phases it needs | The depth synthesis names a verdict per phase and ranks the expansion plan |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Can a resumed fan-out lineage run on a different executor?** UNKNOWN until a `--dry-run` shows it.
- **Does the depth run's expansion plan get applied inside 003, or does each expansion become a new child of 003?** 003 owns that decision, and the depth run only names the children each phase needs.
- **Is the review's finding count stable once rounds 2 to 6 are merged?** The merged registry is the count of record, and the synthesis dedupes it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Research source**: `001-openbot-parity-research/research/research.md` §15 for the ranked build order, and §12 to §14 for the small-team model, the skip list and reuse
- **Build packet**: `../003-openbot-parity-build/spec.md` and its `research/research.md` for the plan the second and third runs read
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
