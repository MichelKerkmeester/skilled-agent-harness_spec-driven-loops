---
title: "Tasks: Terminal-Proof Discipline and Directive Injection"
description: "Task ledger for the AGENTS.md improvement, the directive capsule extension, and the verification gates. Format: T### [P?] Description (file path)"
trigger_phrases:
  - "terminal proof tasks"
  - "directive capsule tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/001-terminal-proof-discipline"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Applied the review-directed distributed integration to AGENTS.md and packet evidence"
    next_safe_action: "None; distributed integration and final strict validation are complete"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-agents-001"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Terminal-Proof Discipline and Directive Injection

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read AGENTS.md, hook-system.md, injection-contract.md, render.ts, mk-skill-advisor.js, pi prompt-advisor.ts
  - [evidence: all six files read in full before any edit; findings recorded in `decision-record.md` ADR-001]
- [x] T002 Map terminal-engineer prompt steps to framework gaps (AGENTS.md)
  - [evidence: gap list recorded in `decision-record.md` ADR-003 and `spec.md` section 2]
- [x] T003 Trace the pi extension symlink chain end to end (.pi/extensions/prompt-advisor.ts)
  - [evidence: symlink resolved to `hooks/pi/prompt-advisor.ts` which imports `dist/hooks/claude/user-prompt-submit.js`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Insert the Terminal Discipline subsection into AGENTS.md (AGENTS.md)
  - [evidence: `git diff` AGENTS.md shows 16 insertions, 0 deletions; heading at `AGENTS.md:275`]
- [x] T005 Author packet docs: spec, plan, tasks, checklist, decision-record, implementation-summary (specs/agents/001-terminal-proof-discipline/)
  - [evidence: `ls specs/agents/001-terminal-proof-discipline` shows all six files]
- [x] T006 Add TERMINAL_PROOF_DIRECTIVE and append it in the three composition points (.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts)
  - [evidence: `grep render.ts` finds the constant and three append sites; `advisor-renderer.vitest.ts` passes]
- [x] T007 Mirror the directive in FALLBACK_DIRECTIVE (.opencode/plugins/mk-skill-advisor.js)
  - [evidence: `grep mk-skill-advisor.js` finds the mirror; plugin node test reports tests 14 passed]
- [x] T008 Rebuild the advisor server dist (npm build)
  - [evidence: `npm run build` exited 0; compiled `dist/mcp-server/lib/render.js` contains the line]
- [x] T009 Update AGENTS.md directive-injection pointer to name the proof directive (AGENTS.md)
  - [evidence: `grep AGENTS.md` finds the capsule named as comment hygiene, governor, proof over appearance]
- [x] T015 Apply the eleven-step distributed integration and remove the standalone protocol block (AGENTS.md)
  - [evidence: `AGENTS.md:26`, `AGENTS.md:84-113`, `AGENTS.md:193-201`, `AGENTS.md:284-318`, `AGENTS.md:373-388`, `AGENTS.md:417-419`, and `AGENTS.md:525-526` contain the planned placements; `git diff --stat -- AGENTS.md` reports 51 insertions and 2 deletions; focused grep returns no standalone heading or benchmark-step labels in AGENTS.md]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the vitest suite (npm test in system-skill-advisor/mcp-server)
  - [evidence: `vitest` run 2 reports tests 672 passed; all 16 directive-expectation tests fixed and green]
- [x] T011 Run the plugin node test (.opencode/plugins/tests/mk-skill-advisor.test.cjs)
  - [evidence: `node --test` reports tests 14 passed, 0 failed]
- [x] T012 Run validate.sh --strict on the packet and fix remaining errors
  - [evidence: `validate.sh --strict` final run on the packet exits 0]
- [x] T013 Remove the stray probe file from the agents track
  - [evidence: the plan-mode-era docs and `probe.txt` removed from `specs/agents`]
- [x] T014 Mark checklist evidence and close the packet docs
  - [evidence: `checklist.md` all [x] with evidence rows; `implementation-summary.md` verification table complete]
- [x] T016 Verify the integration pass and reconcile final packet evidence
  - [evidence: focused `git diff -- AGENTS.md` confirms the eleven placements and standalone-block removal; metadata backfill reports `refreshed: 1`, `changed: 1`, `failed: []`, `drift: []`; `validate.sh --strict` reports `Errors: 0`, `Warnings: 0`, `RESULT: PASSED` and exits 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] validate.sh --strict exits 0 for the integration pass
- [x] Both test suites pass and the build exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
