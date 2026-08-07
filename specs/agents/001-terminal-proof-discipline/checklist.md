---
title: "Verification Checklist: Terminal-Proof Discipline and Directive Injection"
description: "Verification evidence for the AGENTS.md terminal discipline, the proof-over-appearance directive capsule, and the strict packet gate."
trigger_phrases:
  - "terminal proof checklist"
  - "directive capsule verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/001-terminal-proof-discipline"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Recorded the review-directed AGENTS.md integration evidence"
    next_safe_action: "None; distributed integration and final strict validation are complete"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-agents-001"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Terminal-Proof Discipline and Directive Injection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A claim that the directive ships without a green build and green tests is not a claim. The pi bridge imports the compiled dist, so the build output is the only proof the capsule changed for real sessions. Evidence markers use the `[evidence: ...]` bracket form with concrete file, command, or numeric substance so the validator can check mechanically.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Terminal-engineer prompt steps mapped to framework gaps
  - **Evidence**: [evidence: `review-report.md:121-156` maps each protocol idea to its existing overlap, durable framework owner, and minimal integration; `decision-record.md` ADR-003 records the resulting interpretation]
- [x] CHK-002 [P0] Injection chain traced before any change
  - **Evidence**: [evidence: `render.ts:60`, `mk-skill-advisor.js:46`, and the `.pi/extensions/prompt-advisor.ts` symlink documented in `decision-record.md`]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] AGENTS.md diff is limited to the distributed policy integration
  - **Evidence**: [evidence: `git diff --stat -- AGENTS.md` reports 51 insertions and 2 deletions; `git diff --check -- AGENTS.md` exits 0; focused diff inspection shows only the eleven planned placements]
- [x] CHK-004 [P0] AGENTS.md keeps the full protocol in its durable owners without a parallel lifecycle
  - **Evidence**: [evidence: placements are at `AGENTS.md:26`, `AGENTS.md:84-113`, `AGENTS.md:193-201`, `AGENTS.md:284-318`, `AGENTS.md:373-388`, `AGENTS.md:417-419`, and `AGENTS.md:525-526`; focused grep returns no `Terminal Discipline — Proof Over Appearance`, `TARGET —`, `SOLVE FAST`, or `FINAL GATE (mandatory)` in AGENTS.md]
- [x] CHK-005 [P0] render.ts carries TERMINAL_PROOF_DIRECTIVE in all three composition points
  - **Evidence**: [evidence: `grep render.ts` finds the constant and three append sites; compiled `render.js` contains the line]
- [x] CHK-006 [P0] mk-skill-advisor.js FALLBACK_DIRECTIVE mirrors the directive
  - **Evidence**: [evidence: `grep mk-skill-advisor.js` finds TERMINAL_PROOF_DIRECTIVE appended to FALLBACK_DIRECTIVE]
- [x] CHK-007 [P1] The directive text is one line in the governor style
  - **Evidence**: [evidence: the constant in `render.ts` is a single line appended after GOVERNOR_DIRECTIVE]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Advisor server build exits 0
  - **Evidence**: [evidence: `npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build` exited 0]
- [x] CHK-009 [P0] Vitest suite passes for all directive-related tests
  - **Evidence**: [evidence: `vitest` run 2 reports tests 672 passed; all 16 directive-expectation tests fixed and green]
- [x] CHK-010 [P0] Plugin node test passes
  - **Evidence**: [evidence: `node --test` reports tests 14 passed, 0 failed]
- [x] CHK-011 [P1] No exact-string assertion breaks on the extended capsule
  - **Evidence**: [evidence: three test files updated: `advisor-renderer.vitest.ts`, `advisor-brief-producer.vitest.ts`, `claude-user-prompt-submit-hook.vitest.ts`]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-012 [P0] Strict validation exits 0 on the packet after the integration pass
  - **Evidence**: [evidence: metadata backfill reports `refreshed: 1`, `changed: 1`, `failed: []`, `drift: []`; subsequent `validate.sh --strict` reports `Errors: 0`, `Warnings: 0`, `RESULT: PASSED` and exits 0]
- [x] CHK-013 [P0] No stray files remain under the agents track
  - **Evidence**: [evidence: `ls specs/agents` shows only the packet folder and pre-existing entries]
- [x] CHK-014 [P1] Packet docs reflect the distributed integration state
  - **Evidence**: [evidence: ADR-003 records distributed ownership; `tasks.md` contains T015-T016; this checklist replaces the obsolete insertion-only claims; `implementation-summary.md` records the review integration pass]
- [x] CHK-021 [P0] Existing hard blockers retain their original wording and authority
  - **Evidence**: [evidence: `git diff -- AGENTS.md` shows no changed lines in the Four Laws, Scope Lock, Comment Hygiene, Mandatory Gate definitions, or Completion Verification Rule; additions clarify Law 4 and precede the unchanged completion rule]
- [x] CHK-022 [P1] Specialized search tools remain authoritative over terminal commands
  - **Evidence**: [evidence: `AGENTS.md:373-388` places exact-failure routing in the Code Search Decision Tree and states that terminal commands do not override Grep, Glob, and Read]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-015 [P0] No secrets, tokens, or credentials in any packet doc
  - **Evidence**: [evidence: content audit of `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` shows only paths, commands, and prose]
- [x] CHK-016 [P1] No ephemeral artifact ids embedded in code comments
  - **Evidence**: [evidence: `render.ts` and `mk-skill-advisor.js` comments carry only durable WHY text]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-017 [P0] Spec, plan, tasks, checklist, decision-record, and summary all present
  - **Evidence**: [evidence: `ls specs/agents/001-terminal-proof-discipline` shows all six files]
- [x] CHK-018 [P1] Decision record names the rollback path
  - **Evidence**: [evidence: `decision-record.md` ADR-001 and ADR-002 implementation subsections state git revert plus rebuild]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-019 [P0] Packet lives under the agents track with a convention-compliant name
  - **Evidence**: [evidence: packet path `specs/agents/001-terminal-proof-discipline` matches the ###-short-name pattern]
- [x] CHK-020 [P1] Track root holds no stray packet-level docs
  - **Evidence**: [evidence: the plan-mode-era docs and `probe.txt` were removed from `specs/agents` before the packet was finalized]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- **P0**: [x] Complete — all blocker items evidenced and strict validation passes
- **P1**: [x] Complete — all required items evidenced
- **Overall**: Complete
<!-- /ANCHOR:summary -->
