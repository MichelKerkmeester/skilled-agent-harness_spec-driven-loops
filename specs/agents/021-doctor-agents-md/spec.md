---
title: "Feature Specification: /doctor:agents-md and /doctor:helper"
description: "A repository's root AGENTS.md drifts from the shipped Skilled template, and no tool reports what shipped, what is repo-unique and what is stale. This phased packet adds /doctor:agents-md, which checks, embeds and restores the root instruction files around a shipped manifest, and /doctor:helper, which names the doctor command that fits a problem."
trigger_phrases:
  - "doctor agents md"
  - "embedded repo unique agents md"
  - "doctor helper command"
  - "root instruction files drift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md"
    last_updated_at: "2026-10-30T17:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed all three phases and the packet"
    next_safe_action: "None: the packet is complete"
    blockers: []
    key_files:
      - "specs/agents/021-doctor-agents-md/001-doctor-agents-md/spec.md"
      - "specs/agents/021-doctor-agents-md/002-doctor-helper/spec.md"
      - "specs/agents/021-doctor-agents-md/003-advisor-bridge-activation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 001 carries five Level 2 children, phase 002 is a single Level 2 packet and phase 003 activates the four advisor bridges both phases derived"
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

# Feature Specification: /doctor:agents-md and /doctor:helper

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | agents/021-doctor-agents-md |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Both phases pass `validate.sh --recursive --strict` and every command-based acceptance criterion in their children is met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A consumer repository takes the framework through `.skilled/` but owns its root `AGENTS.md`, and `/doctor:update` never touches that file because it is not a release unit. Nothing reports which shipped sections a repository still carries, which lines are its own, or which of its own lines sit inside a shipped section where the next update will overwrite them. The same gap exists on the other side of the doctor family: an operator who can describe a problem in plain words has no entry point that names the doctor command which fits, and the shipped manifest of 19 routes has to be read by hand.

### Purpose
Deliver two doctor surfaces that answer those two questions. `/doctor:agents-md` checks the root instruction files against a shipped, machine-readable manifest of sections, pins, runtime copies and router rows, then embeds a repository's own content into one marked block while proving that no repo-unique line was dropped. `/doctor:helper` reads the existing route manifest and ranks the doctor commands that fit a described problem, handing every writing command back to its own plan-and-yes gate.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One manifest of what the template ships: 46 sections with match prefixes, the pins tooling greps, the expected runtime copies, the delivery budget and the shipped router rows.
- A read-only `check` that classifies a repository as pure, adopted, stale, forked, foreign, claude-only or absent, and names unmarked content with its byte range.
- An `embed` that composes the shipped template plus one marked repository block, proves no repo-unique line was dropped, and a `restore` that puts the previous bytes back.
- A deterministic matcher that ranks doctor commands for a described problem and never runs a writing command on the operator's behalf.

### Out of Scope
- Any automatic move of repository content out of the block - moving a line into a file that binds only on a write changes when it binds, which is the operator's call.
- Authoring repository rules - the create-repo-rule decision tests own that, and the doctor only prints the command.
- Activating the new advisor bridges in the scoring compatibility list during phases 001 and 002 - deferred there, because activating a bridge needs a routing-slice row and a scorer rebaseline beside it; phase 003 owns that activation.
- Any file the update engine already owns under `.skilled/` - the two surfaces divide at that boundary.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md, and the two phase specs list the decisions and files their own children own.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `AGENTS.md` | Modify | 001-doctor-agents-md | Rewrite line 3 and append the empty marked block |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Create | 001-doctor-agents-md | The shipped-section, pin, copy and router-row manifest |
| `.skilled/commands/doctor/scripts/agents-md-manifest.cjs` | Create | 001-doctor-agents-md | `--write` and `--check` freshness for the derived key |
| `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` | Create | 001-doctor-agents-md | Shared segmenter and classifier |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | Create | 001-doctor-agents-md | Read-only check engine |
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | Create | 001-doctor-agents-md | `plan`, `apply` and `restore` |
| `.skilled/commands/doctor/agents-md.md` | Create | 001-doctor-agents-md | Router with the six canonical sections |
| `.skilled/commands/doctor/assets/doctor-agents-md-*.yaml` | Create | 001-doctor-agents-md | Check, embed and restore workflows |
| `.skilled/commands/doctor/helper.md` | Create | 002-doctor-helper | Router for the helper command |
| `.skilled/commands/doctor/scripts/doctor-helper-match.cjs` | Create | 002-doctor-helper | Deterministic ranking over `_routes.yaml` |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Both phases | Three agents-md routes and one helper route |
| `.github/workflows/spec-kit-check.yml` | Modify | 001-doctor-agents-md | Add the root instruction files to both path filter lists |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-doctor-agents-md/ | The `/doctor:agents-md` build, a nested phase parent with five Level 2 children: manifest and template block, check engine, embed engine, command plumbing, verification and docs | Complete |
| 2 | 002-doctor-helper/ | `/doctor:helper`, one Level 2 packet with no children: the deterministic matcher, its contract suite and its command plumbing | Complete |
| 3 | 003-advisor-bridge-activation/ | Activation of the four advisor bridges both earlier phases derived: the helper and the three root-instruction targets, in both scoring lanes, with the reach probe and the routing slice proving every phrase | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **Precondition on both phases.** No phase starts implementation until `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) is on `main`. That command adds one route, one router file and one advisor bridge, so the route, bridge, phrase and mirror counts every acceptance criterion quotes must be re-measured from the branch the phase actually starts on. The two phases also share those counts: whichever lands second re-measures and rebases its numbers.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-doctor-agents-md | 002-doctor-helper | The manifest, check engine and embed engine exist, and the command plumbing phase has landed the three agents-md routes | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and its summary names the three routes |
| 002-doctor-helper | 003-advisor-bridge-activation | Both phases leave the four doctor bridges derived and admitted by no lane, and phase 003 adds the activation entries, the slice rows and the release note | `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 with `STATUS=OK phrases=164 bridges=28` and the deriver reports `fresh` at 33 TypeScript and 43 Python entries |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which phase lands first? They touch different files, so either order works; each acceptance criterion that counts routes, bridges or mirrors states the re-measured number rather than an absolute, because the second phase shifts every shared count by one.
- Does Devin apply `.cursor/rules/*.md`? The mirror of the repository block into that file costs Cursor a second load of the same text, and the claim that Devin then sees the block is inferred until a live session reads it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-doctor-agents-md/spec.md` and `002-doctor-helper/spec.md`; phase 001 carries its own five children.
- **Parent Spec**: None (top-level packet).
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
