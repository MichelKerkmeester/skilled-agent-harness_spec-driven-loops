---
title: "Implementation Summary: Terminal-Proof Discipline and Directive Injection"
description: "AGENTS.md gains the five-step terminal protocol, the per-turn capsule gains a proof-over-appearance directive through the existing governor chain, and the packet passes strict validation."
trigger_phrases:
  - "terminal proof summary"
  - "resume terminal proof work"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/001-terminal-proof-discipline"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Integrated the terminal-proof rules into their existing AGENTS.md authorities"
    next_safe_action: "None; distributed integration and final strict validation are complete"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "specs/agents/001-terminal-proof-discipline/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-agents-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Terminal-Proof Discipline and Directive Injection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-terminal-proof-discipline |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The terminal-proof protocol remains permanent operating discipline in AGENTS.md, but no longer appears as a benchmark-shaped standalone lifecycle. The review-directed integration distributes its mechanics across the Four Laws clarification, Verification Standards and task-specific proofs, Blast-Radius Management, a new Final-State Verification hard gate, Execution Behavior, Quality Principles, search and terminal routing, Startup and Resume Recovery, and the Quick Reference. The standalone Terminal Discipline block is removed after every useful invariant is assigned to an authoritative owner.

The hook assessment proved the governor directive injection already exists and is live: render.ts line 60 holds the canonical constant, mk-skill-advisor.js line 46 mirrors it for the OpenCode fallback, and the pi runtime wires it through the .pi/extensions/prompt-advisor.ts symlink into the compiled Claude hook chain. The extension adds a one-line proof-over-appearance directive to the same capsule, shipped through a rebuilt dist.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Eleven-step distributed integration across existing framework authorities; standalone protocol block removed |
| `specs/agents/001-terminal-proof-discipline/` | Created | Level 2 packet docs |
| `render.ts` | Modified | TERMINAL_PROOF_DIRECTIVE in the capsule |
| `mk-skill-advisor.js` | Modified | FALLBACK_DIRECTIVE mirror |
| `dist/` | Rebuilt | Compiled renderer and hook chain carry the new capsule |
| three vitest files | Modified | Expectations extended to the new capsule text |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Analysis first: the hook chain was traced with file-level evidence before any edit. The AGENTS.md change was written and verified against git. The packet was authored to the manifest templates with full anchors and continuity frontmatter after the first validation run exposed template-header and anchor gaps. The hook patch was applied to the renderer and the plugin mirror, the dist was rebuilt, and the three test files with exact-string capsule expectations were extended to the new text before the suites were re-run.

The review integration pass then treated `review-report.md` as authoritative: its Protocol-to-Framework Mapping supplied the placement analysis, its eleven-step Placement Plan supplied the edit order, and ADR-003 was amended without reversing its durable-home decision. Focused grep and diff checks confirmed that the local placements landed and the standalone protocol vocabulary left AGENTS.md.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Choice | Where |
|----------|--------|-------|
| Extend the existing capsule rather than build a new injection | Extend | decision-record.md ADR-001 |
| Apply the patch now with git revert rollback | Apply | decision-record.md ADR-002 |
| AGENTS.md stays the durable home of the full protocol | Split | decision-record.md ADR-003 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| AGENTS.md distributed integration diff | Pass | `git diff --stat -- AGENTS.md`: 51 insertions, 2 deletions; `git diff --check -- AGENTS.md` exits 0 |
| Planned placements and standalone-block removal | Pass | integrated rules at lines 26, 84-113, 193-201, 284-318, 373-388, 417-419, 525-526; focused grep finds no standalone heading or benchmark-step labels |
| Packet docs present | Pass | ls of the packet folder |
| Advisor build | Pass | npm build exited 0 |
| Vitest suite | Pass | 672 passed; 16 directive-expectation tests fixed and green |
| Plugin node test | Pass | node --test reports 14 pass, 0 fail |
| Strict validation | Pass | after metadata backfill, `validate.sh --strict` reports Errors: 0, Warnings: 0, RESULT: PASSED and exits 0 |
| Stray probe file removed | Pass | specs/agents holds only the packet and pre-existing entries |
| Review integration pass | Pass | AGENTS.md diff and residue checks pass; metadata backfill reports no failures or drift; strict packet validation exits 0 |

Note on the vitest remainder: 27 failures persist that are pre-existing drift in this clone (environment variables, corpus counts, routing ledgers, missing @opencode-ai/plugin package). They were failing identically before the directive test updates, and none touch the brief text; they are outside this packet scope.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The capsule text is fixed in source; operators who want different wording edit render.ts and the plugin mirror and rebuild.
- The folder-name convention required the packet to live at specs/agents/001-terminal-proof-discipline rather than directly at specs/agents; the user-directed track root is preserved and holds the packet.
- The completion-freshness fingerprint is a placeholder; the next memory save regenerates it.
<!-- /ANCHOR:limitations -->
