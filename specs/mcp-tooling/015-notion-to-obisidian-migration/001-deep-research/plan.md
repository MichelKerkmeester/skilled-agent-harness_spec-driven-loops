---
title: "Implementation Plan: Phase 1 — Deep research: flawless complex Notion→Obsidian migration"
description: "Run a no-early-convergence 20-iteration /deep:research loop (10x GLM-5.2 High via cli-devin + 10x DeepSeek V4 Flash xhigh via cli-opencode/Cline), seeded by prior-findings.md, then synthesize a flawless migration method into research.md."
trigger_phrases:
  - "notion obsidian migration research plan"
  - "deep research notion obsidian migration"
  - "015 phase 1 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/001-deep-research"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored plan for the two-track 20-iter deep-research run; not yet launched"
    next_safe_action: "run the 20-iter deep research loop"
    blockers: []
    key_files:
      - "spec.md"
      - "prior-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-001-deep-research"
      parent_session_id: "015-notion-to-obisidian-migration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Deep research: flawless complex Notion→Obsidian migration

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | `/deep:research` loop (system-deep-loop), no code changes |
| **Framework** | Track A: cli-devin, GLM-5.2 High (`glm-5-2`) — Track B: cli-opencode (Cline), DeepSeek V4 Flash xhigh |
| **Storage** | `research/lineages/glm/` + `research/lineages/deepseek/` — `deep-research-state.jsonl` + iterations + findings registry per track |
| **Testing** | Per-iteration evidence + `validate.sh` on this phase |

### Overview
Drive a two-track deep-research loop over the flawless complex Notion→Obsidian migration question — 10 iterations GLM-5.2 High via cli-devin, 10 iterations DeepSeek V4 Flash xhigh via cli-opencode/Cline, convergence detection disabled on both — seeded by the preserved `prior-findings.md`, then synthesize both tracks into a single cited `research.md` that decides the migration method and the exact `mcp-notion`/`mcp-obsidian` division of labor.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `cli-devin/SKILL.md` and `cli-opencode/SKILL.md` read; fanout flag/env confirmed for both tracks
- [x] Seed sources listed (incl. `prior-findings.md`); research sub-questions enumerated
- [ ] Deep-research state initialized under `research/lineages/glm/` and `research/lineages/deepseek/`

### Definition of Done
- [ ] 20 iterations completed (10 per track), no early convergence on either track
- [ ] `research.md` resolves every sub-question with citations, extending `prior-findings.md` rather than discarding it
- [ ] The mcp-notion-reads / mcp-obsidian-writes division of labor, recovery path, and required-plugin list are captured
- [ ] `validate.sh` on this phase passes; continuity refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two parallel iterative evidence loops (deep-research state machine, one lineage per executor) with disabled convergence early-exit, seeded by a shared prior-findings note.

### Key Components
- **Init**: register both lineages, seed sources + sub-questions (shared), set `no-early-convergence` / `max-iterations` per track.
- **Iteration loop**: 10 GLM-5.2/cli-devin iterations + 10 DeepSeek-V4-Flash-xhigh/cli-opencode iterations; each appends to its own state ledger + a per-iteration file; findings accrue to each track's registry.
- **Synthesis**: fold both lineages into a single `research.md`; rank the patterns; write the migration method, tool-division verdict, and required-plugin list.

### Data Flow
`prior-findings.md` (seed) + fresh seed sources → per-track per-iteration findings (`iterations/iteration-NNN.md` + `findings-registry.json`) → aggregated per-track state → synthesized `research.md` → handoff to phase 002+.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase is read-only research. It creates artifacts only inside its own phase folder and touches no shipped runtime, no shared policy, and no other packet. (Runtime-affecting surfaces begin in phase 002+ — implementation into `mcp-notion` / `mcp-obsidian` plus any plugin install — and are inventoried there.)
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `cli-devin/SKILL.md` and `cli-opencode/SKILL.md`; confirm each track's fanout flag/env
- [ ] Initialize `/deep:research` state (no-early-convergence, `max-iterations`) under `research/lineages/glm/` and `research/lineages/deepseek/`
- [ ] Load seed sources (incl. `prior-findings.md`) + enumerate the research sub-questions in `spec.md` §3

### Phase 2: Core Implementation
- [ ] Run the 10-iteration GLM-5.2 High loop via cli-devin (no early convergence)
- [ ] Run the 10-iteration DeepSeek V4 Flash xhigh loop via cli-opencode/Cline (no early convergence)
- [ ] Map the survives-automatically vs needs-reconstruction matrix across both tracks

### Phase 3: Verification
- [ ] Synthesize both lineages into `research.md` (per-question answers + citations, extending `prior-findings.md`)
- [ ] Write the mcp-notion-reads / mcp-obsidian-writes division of labor + the required-plugin list
- [ ] `validate.sh` this phase; author `implementation-summary.md`; refresh continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | 10 iterations recorded per track, no early stop | deep-research state ledger (both lineages) |
| Coverage | Every sub-question in `spec.md` §3 resolved with citations | manual review of `research.md` |
| Doc | `research.md` structure + citations | `validate.sh`, manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin (GLM-5.2 High) | External | Green | Track A cannot run without it |
| cli-opencode (DeepSeek V4 Flash xhigh, Cline) | External | Green | Track B cannot run without it |
| `/deep:research` loop | Internal | Green | Fall back to manual iteration only if broken |
| WebFetch / WebSearch | External | Yellow | Blocklist/rate limits → widen queries |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: research inconclusive on one or both tracks, or an executor becomes unavailable.
- **Procedure**: research artifacts are additive and phase-local — discard `research/lineages/<track>/` (state ledger, iterations); `prior-findings.md` and the seeded `research/research.md` remain untouched as fallback content. No shipped state to revert.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
