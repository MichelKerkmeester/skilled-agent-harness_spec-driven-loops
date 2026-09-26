---
title: "Phase Parent: Pi Skill Orchestrator Research for Skill Advisor Refinement"
description: "Phased packet that mines the pi-skill-orchestrator extension for mechanisms that could upgrade system-skill-advisor. Phase 1 ran a two-lineage deep research: 10 iterations on MiMo v2.6 Pro (high) through cli-pi on LLM Gateway and 5 on SWE-2 MAX through cli-devin. Phases 2 to 4 implement the nine recommendations the operator adopted: nested hook deadlines and diagnostics, a leaner hook path and a clearer fallback. Phase 5 fixes the limitations they recorded, and phase 6 reviews all of it with two other model families."
trigger_phrases:
  - "pi skill orchestrator"
  - "pi-skill-orchestrator research"
  - "skill advisor refinement"
  - "lazy skill loading advisor"
  - "skill orchestrator advisor upgrade"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement"
    last_updated_at: "2026-09-26T16:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Completed 005-follow-up-fixes"
    next_safe_action: "Run the phase 6 fan-out review"
    blockers: []
    key_files:
      - "spec.md"
      - "001-deep-research/research/research.md"
      - "002-hook-deadline-and-diagnostics/spec.md"
      - "003-hook-path-cli-spawn-trim/spec.md"
      - "004-headless-fallback-status-and-dedup/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Q2, answered by the operator 2026-09-26: fix the advisor docs to match the CLI-only hook, with the casual-prompt gate in front of the CLI call."
      - "Q7, answered by the operator 2026-09-26: Claude and OpenCode may send only the status heading when a fallback repeats in a known session."
      - "Executor split fixed by the operator: 10 iterations MiMo v2.6 Pro high via cli-pi on LLM Gateway, 5 iterations SWE-2 MAX via cli-devin."
      - "Adopted for implementation by the operator: R1 to R7, R11 and R12. R8, R9 and R10 are not planned."
      - "The casual-prompt gate lost its only caller in a87379aa610, which retired the MCP transport and states no visible change, so its loss reads as a side effect."
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

# Phase Parent: Pi Skill Orchestrator Research for Skill Advisor Refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Active. Phases 1 to 5 are complete; phase 6 reviews them |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | None. This packet sits directly under the `system-skill-advisor` track root |
| **Parent Packet** | system-skill-advisor |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Phase 1 leaves a merged `research/research.md` whose ranked recommendations cite both codebases at `file:line`, with every cited reference opened and checked by the orchestrator. Only then are refinement phases authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor routes by push. A daemon-backed five-lane scorer builds a brief for every prompt, and runtime hooks inject it before the model runs. The pi-skill-orchestrator extension (v0.1.26, MIT, stored in `context/pi-skill-orchestrator-main/`) attacks the same routing problem from the other end. It removes the eager skill catalog from the system prompt, lets the model pull a bounded `skill_search` result when it needs a capability, and loads one root skill plus its recursive dependencies. It also scopes search through profiles and groups with a bounded global fallback. Nobody has compared the two designs against our code, so we do not know which of its mechanisms would improve routing precision, prompt cost or robustness here, and which would not transfer.

### Purpose
Produce an evidence-backed, ranked set of adopt, adapt or reject verdicts, each citing both codebases at `file:line`. Then turn only the adopted items into system-skill-advisor refinement phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only deep research over `context/pi-skill-orchestrator-main/` and `.skilled/skills/system-skill-advisor/`, including the advisor hooks for each runtime.
- A merged synthesis that ranks the transferable mechanisms and records where the two research lineages agree or disagree.
- Refinement phases on system-skill-advisor, authored after the synthesis and limited to the recommendations the operator adopts.

### Out of Scope
- Editing the orchestrator source. It is reference material, kept byte-for-byte as delivered.
- Installing the orchestrator extension into this repository's Pi setup. The question is what to learn from it, not whether to run it.
- General tool-output compression from its Token Saver. Token Saver ideas count only where they bear on advisor output size, brief format or lazy discovery.

### Files to Change
Phase 1 writes research artifacts, plus one fix to the research workflows that its close needed. Each refinement phase lists its exact files in its own `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-deep-research/research/` | Create | 001-deep-research | Fan-out lineages, merged state and `research.md` synthesis |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` and `deep-research-confirm.yaml` | Modify | 001-deep-research | Require the root dashboard only for runs without lineage logs, so a fan-out close can record `synthesis_complete` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Modify | 002-hook-deadline-and-diagnostics | Nested deadline so the advisor hook times out before the shim kills it |
| `.skilled/skills/system-skill-advisor/hooks/` and `runtime/lib/` | Modify | 002, 003, 004 | Diagnostics, Pi hook guards, hook-path request option, casual-prompt gate, fallback rendering |
| `.skilled/plugins/system-skill-advisor.js` | Modify | 004-headless-fallback-status-and-dedup, 005-follow-up-fixes | Plugin copy of the fallback line and its repeat handling; transform dedup before lifecycle reduction |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` and `deep-review-confirm.yaml` | Modify | 005-follow-up-fixes | The research workflows' fan-out dashboard rule |
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | 005-follow-up-fixes | `edit_lines` trailing-newline refusal |
| `006-fanout-deep-review/review/` | Create | 006-fanout-deep-review | Two-lineage review state and merged report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Two-lineage deep research: MiMo v2.6 Pro high via cli-pi on LLM Gateway for 10 iterations, SWE-2 MAX via cli-devin for 5 iterations, synthesized by Opus 5.5 at max effort | Complete |
| 2 | 002-hook-deadline-and-diagnostics/ | R1 nested hook deadlines, R3 brief bytes and runtime in diagnostics, R7 Pi dist-path test, R11 crash-safe log trim, R12 Pi call deadline | Complete |
| 3 | 003-hook-path-cli-spawn-trim/ | R2 skip compiled-route spawns on the hook path, R5 reconnect the casual-prompt gate | Complete |
| 4 | 004-headless-fallback-status-and-dedup/ | R4 status-aware fallback line, R6 no repeated fallback on Claude and OpenCode | Complete |
| 5 | 005-follow-up-fixes/ | Fan-out review close without a root dashboard, `edit_lines` trailing-newline refusal, plugin transform dedup before lifecycle reduction, trigger index from committed content | Complete |
| 6 | 006-fanout-deep-review/ | Two-model `/deep:review` of the phase 2 to 5 changes: MiMo v2.6 Pro high and DeepSeek V4.1 Flash max through cli-pi, three iterations each, no early stop | Active |

R8, R9 and R10 from `001-deep-research/research/research.md` are not planned. Each waits on a replay or an A/B test that has not run.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-hook-deadline-and-diagnostics | `research/research.md` holds the merged, ranked synthesis and the load-bearing citations for R1 to R7, R11 and R12 were opened and confirmed | Lineage state logs show 10 and 5 iteration records, and the orchestrator's citation checks are recorded in each phase spec |
| 002-hook-deadline-and-diagnostics | 003-hook-path-cli-spawn-trim | Hook diagnostics carry `emittedBytes` and the real runtime, and a baseline of hook `durationMs` exists | A debug-on hook turn per runtime writes a record with both fields |
| 003-hook-path-cli-spawn-trim | 004-headless-fallback-status-and-dedup | The fallback reaches all four subprocess runtimes, since 002 lands R1, and the hook path no longer spawns compiled-route | A forced slow CLI yields the directives fallback on Claude, and no `compiled-route.cjs` child starts on a hook request |
| 004-headless-fallback-status-and-dedup | 005-follow-up-fixes | Phases 1 and 4 recorded the review close, plugin dedup and index limitations | Each limitation names its file and line in the phase's implementation summary |
| 005-follow-up-fixes | 006-fanout-deep-review | A fan-out review close records `synthesis_complete` without a root dashboard | The fan-out review case in `run-now-yaml-control.vitest.ts` passes and fails with the fix reverted |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. The operator adopted R1 to R7, R11 and R12, chose to fix the hook docs to match the code (research Q2), and allowed head-only fallback repeats (research Q7). Each implementation phase is Level 1.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Research source**: `context/pi-skill-orchestrator-main/` (README, `docs/architecture.md`, `src/`)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
