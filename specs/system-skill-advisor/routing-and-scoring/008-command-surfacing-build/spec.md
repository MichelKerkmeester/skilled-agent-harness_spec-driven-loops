---
title: "Feature Specification: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow"
description: "Thirteen phases that make the skill advisor surface every tracked slash command with a run-or-ask policy and bring a chat-only request onto a proper workflow."
trigger_phrases:
  - "command surfacing build phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
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
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skill-advisor/routing-and-scoring/008-command-surfacing-build |
| **Predecessor** | 007-command-surfacing-and-workflow-enforcement |
| **Successor** | None |
| **Handoff Criteria** | Each phase meets its exit check in the Phase Handoff Criteria table before the next phase starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository ships 44 tracked slash commands that own complete workflows, but the skill advisor reaches the model with skills. Only `/doctor:*` commands arrive as a runnable line, 22 of 62 command bridge rows are off in the TypeScript scorer, the recommendation carries no command field and no rule tells a model what to do with a surfaced command. A user who chats without typing a command therefore gets an improvised approach where a command workflow exists. The evidence is in `../007-command-surfacing-and-workflow-enforcement/research/research.md` and the independent review `../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`.

### Purpose
Deliver the review's recommendation set (R1 to R10, L1 to L12, G1 to G7) in the order its build plan gives, under the operator decisions D1 to D5 recorded in section 13 of `../007-command-surfacing-and-workflow-enforcement/research/research.md`. When the last phase closes, a plain chat request surfaces the matching command beside its skill with a run, start or ask policy, the model picks between the command path and the skill path, and a measured baseline shows what changed.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure command routing before changing it: a command prompt corpus and a baseline for the 44 tracked commands.
- Generate one command inventory with a risk class and a derived policy per command and per doctor route.
- Make plain chat reach a command: attach the command to its owner skill for hub commands, and author intent phrases for commands with no hub mode.
- Reach a command from a paraphrase that shares no words with it, by matching the prompt's meaning against a vector per command.
- Extend the recommendation and the brief with the command, its policy and its owner skill.
- Bind the behaviour in `AGENTS.md` Gate 2 and in a generated pointer for runtimes with no brief.
- Prove the behaviour per runtime from transcripts.

### Out of Scope
- Changing how skills are scored against each other. The four existing accuracy numbers are a floor in every phase.
- Surfacing the private, untracked `/local-skilled-alignment` command (decision D5).
- Forcing the command path. Decision D2 keeps the model free to pick the skill path.
- Adding a command front door to a skill that has none.

### Files to Change
Audit trail only. Each child's `plan.md` holds the detail, and phases 5 to 7 are not planned yet, so their rows name the area the review points at.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` | Create | 001 | Command prompt corpus, its scorer and a baseline file |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/` | Modify | 002 | One generated inventory, risk class and policy, retired ids |
| `.skilled/skills/*/command-metadata.json`, `.skilled/commands/doctor/_routes.yaml` | Modify, Create | 002 | Risk class and write target per command and route |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/`, `advisor/handlers/` | Modify | 003 | Command attached to the owner skill, authored phrases, one row per command |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/`, `lib/skill-graph/`, `scripts/command-bridges/`, `scripts/routing-accuracy/` | Modify | 004 | A vector per command, a meaning anchor in scoring and a capture that uses the real embedding |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`, `lib/render.ts` | Modify | 005 | New recommendation fields and the brief line |
| `AGENTS.md`, generated runtime pointer blocks | Modify | 006 | The Gate 2 sentence, the Gate 4 retirement and the static pointer |
| Per-runtime transcript checks | Create | 007 | Behaviour proof and the started-command-is-followed check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-command-routing-baseline-corpus/ | Command prompt corpus and baseline, no scorer change (R8, L8, L9) | Complete |
| 2 | 002-command-inventory-and-risk-metadata/ | One generated inventory, risk class and derived policy, private command excluded (R1, R4, G4) | Complete |
| 3 | 003-plain-chat-command-reach/ | Attach commands to owner skills, authored phrases, one activation source (R2, L2, L3, R10 precedence) | Complete |
| 4 | 004-command-meaning-matching/ | A vector per command and a meaning anchor, so a paraphrase reaches its command (operator decision, 2026-11-12) | Complete |
| 5 | 005-recommendation-contract-and-brief/ | Recommendation fields, brief line, degraded path, retired ids (R3, L6, L12, G6, L1, L7) | Complete |
| 6 | 006-gate-2-binding-and-runtime-pointers/ | Gate 2 sentence, typed override, static pointer, child authority (R6, L5, R5, L4, G1, G3, L10) | Complete |
| 7 | 007-per-runtime-behaviour-proof/ | Transcript proof per runtime and the started-command-is-followed check (R8 transcripts, G2, G5) | In Progress |
| 8 | 008-embedder-setup-and-cost/ | The embedder for external repositories: visible state, a plan-first doctor route, the measured memory and latency cost in the install guides and defined absent, cold and slow behaviour (operator requirement, 2026-11-12) | Complete |
| 9 | 009-ux-performance-cross-cli-research/ | Research only: further gains in user experience, performance and cross-CLI use after phases 005 to 008, 14 ranked recommendations each to be built in a new phase or declined with a reason (research/research.md section 9). Segment two is merged with 18 ranked items (research/research-segment-2.md) and segment three follows the merge to main | In Progress |
| 10 | 010-reachability-and-attribution/ | Offer and brief delivery on every run line with a backfill of the before arm, an attributable scorer summary, the Codex and DSH install steps with read-only doctor checks and a measured cold first prompt (research ranks 1 to 6 and 10) | Complete |
| 11 | 011-typed-command-delivery-and-guards/ | Every typed tracked command reaches the model on the top recommendation with its command and policy, measured as 44 of 44 typed rows in the command capture, plus a command visibility guard in the mirror check, hook health in the advisor status and a head length test with a brief cost script (research ranks 9, 12 and 14 in part) | Complete |
| 12 | 012-plain-offer-reach/ | A plain request gets its command: the doctor hand-off names the command its ranker put first, task-shaped aliases on the `sk-doc` and deep-loop hubs, deep and create anchors and a `(needs a mode)` label for a deferring hub, measured as plain tune offers 9 to 23 of 45 in the command capture (segment two ranks 1, 4, 6, 7 and 12) | Complete |
| 13 | 013-attribution-and-install-reach/ | Brief delivery as a stored fact on five runtimes, offer accounting with loop-without-init in the safety floor and host-expanded typed starts counted, a Codex preflight and a restore to HEAD in the behaviour runner, a `CLAUDE.md` pointer on the default embed install, a delivery leg in `/doctor:setup` and an OpenCode brief that keeps the command fields (segment two ranks 2, 3, 5, 8 to 11 and 13) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-command-routing-baseline-corpus | 002-command-inventory-and-risk-metadata | Corpus rows exist for all 44 tracked commands and a baseline records per-command recall, with the four existing numbers unchanged | The baseline file exists and the existing routing-accuracy run still reports 158/195, 50/66 and 20/24 |
| 002-command-inventory-and-risk-metadata | 003-plain-chat-command-reach | Every tracked command and doctor route has a risk class and a derived policy | The deriver's check mode is fresh and exits 1 on a fixture command with no metadata |
| 003-plain-chat-command-reach | 004-command-meaning-matching | Command recall rises against the phase 1 baseline with no drop in the four existing numbers | The phase 1 scorer run, and no typed command is ambiguous with its own owner |
| 004-command-meaning-matching | 005-recommendation-contract-and-brief | Holdout plain recall rises above 0 of 44 with false offers at 0 of 35 and typed recall at least 24 of 44, measured with the real embedding | The real-embedding capture and the full advisor suite |
| 005-recommendation-contract-and-brief | 006-gate-2-binding-and-runtime-pointers | The recommendation and the brief carry the command and its policy | Schema test and golden briefs pass, and `save context` returns one entry |
| 006-gate-2-binding-and-runtime-pointers | 007-per-runtime-behaviour-proof | The Gate 2 sentence and the generated pointer are in place | `/doctor:agents-md check` passes and the pointer generator's check exits 0 |
| 007-per-runtime-behaviour-proof | 008-embedder-setup-and-cost | Phase 005 is merged and the per-runtime proof is recorded, so this phase edits the final recommendation handler and bridge activation list | `rg -n "ownerSkillId" .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` prints a line and phase 007 validates under `validate.sh --strict` |
| 011-typed-command-delivery-and-guards | 012-plain-offer-reach | Phase 011 is committed, the command capture reads 44 of 44 typed rows and every pinned floor holds | `jq -c '.attachedMetrics.typed' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` prints `combined` 44 of 44 and phase 011 validates under `validate.sh --strict` |
| 012-plain-offer-reach | 013-attribution-and-install-reach | Phase 012 is committed, its renderer prints `(needs a mode)` and its diff touches none of the files phase 013 edits | The committed command baseline reads `attachedMetrics.plain.tune.combined` above 9 of 45 and phase 012 validates under `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Phase 7 needs runs on runtimes the research never exercised live (Pi, Cursor, Devin, DSH, Codex, OpenCode). Which of them the operator wants proven is decided when phase 7 is planned.
- The review's G2 check, that a started command actually runs its own setup, is a condition of decision D1. If phase 7 shows setup being skipped, D1 returns to the operator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
