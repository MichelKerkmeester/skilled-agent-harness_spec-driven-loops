---
title: "Handover: 036/009 Innovation Gap Remediation — planned, ready to implement"
description: "Resume doc for the 009 remediation packet: five Planned phases that close the seven confirmed 036 gap-analysis findings (authority cutover still dark, gateway not identity-fail-closed, no production-boundary proof). Authored + landed on v4+main; implementation not started."
trigger_phrases:
  - "resume 009 innovation gap remediation"
  - "036 authority cutover remediation next steps"
  - "implement fail-closed gateway phase"
  - "036 gap analysis findings"
importance_tier: "critical"
contextType: "handover"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored and landed the five-phase 009 remediation packet on v4 and main"
    next_safe_action: "Implement phase 001-measurement-and-traceability"
    blockers:
      - "Phase 002 (substrate identity fail-closed) gates phase 003: no mode may be cut over authoritatively until the shared gateway denies missing/null/partial identity by default and rollback certificates require verified identity."
      - "All five phases are Planned; no remediation code is written yet."
    key_files:
      - "001-research-inputs-and-architecture/research/research.md"
      - "009-innovation-gap-remediation/002-substrate-identity-fail-closed/spec.md"
      - "009-innovation-gap-remediation/003-pilot-mode-cutover/spec.md"
      - "goal.md"
    completion_pct: 0
    open_questions:
      - "Which single mode is the phase-003 pilot cutover (deep-research is the natural first, but operator picks)?"
    answered_questions:
      - "The seven findings are confirmed against live runtime code; four were corrected during verification (see below)."
---

# Handover — 036/009 Innovation Gap Remediation

## Status: packet authored + landed on v4+main · all five phases Planned · implementation not started

This packet decomposes the 036 gap analysis into five dependency-ordered remediation phases. It is a
**phase parent** (lean trio at the root; five Level-2 children each with spec/plan/tasks/checklist). It is
**shipped as documentation only** — nothing here is implemented yet. The whole 036 tree validates
recursively `--strict` with zero errors.

## Where it lives (confirmed)

- **v4** `skilled/v4.0.0.0` @ `19499c0521` — commit `feat(deep-loop): add 036 innovation-gap-remediation phased packet`.
- **main** @ `b0fe35acee` — same commit cherry-picked (`-x`); scoped content byte-identical to the v4 commit.
- Path: `specs/system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/`.
- Registered in the 036 parent: PHASE MAP + PHASE DOCUMENTATION MAP row 9, `children_ids` = 9, and the
  embedded child manifest in `validate.sh` (`load_child_manifest`) bumped to 9 entries, sha256
  `1940b29222495ae77e6cc043b224ced712624ae9421068c290287d337d54f2f9`.

## The gap analysis it closes (confirmed against live code)

A 10-iteration deep-research loop ran to completion but its synthesis was **never persisted** — a
fail-closed findings-writeback halt swallowed it, leaving only a status log. The findings were
**reconstructed verify-first** into `001-research-inputs-and-architecture/research/research.md`, grounded
in the runtime lib, tests, all eight rollback switches, and the frozen recommendation ledger. Four
hypotheses were **corrected** against the code during that pass.

| Finding | Confirmed claim | Closed by |
|---|---|---|
| F1 | Per-mode authority flip is dark/unwired — coordinator + selector have no production call site (`per-mode-authority-flip/cutover-coordinator.ts`, `authority-selector.ts`; all call sites are unit tests). | 003 pilot, 004 fleet |
| F2 | Shared gateway is **not** identity-fail-closed by default (missing/null/partial identity is not denied). Corrected: the forward-cutover coordinator already adds a stricter required resolver, so the gap is scoped to the generic gateway. | 002 |
| F3 | 0 of 8 mode roots have on-disk production composition for cutover. Marked confirmed **only** as an on-disk count; actual deployed processes are UNKNOWN. | 003, 004 |
| F4 | The production-boundary verification matrix is **unbuilt** (corrected from "empty"), not a blank table. | 003, 004, 005 |
| F5 | The 178-row recommendation ledger is a frozen planning bijection, not a row-level composition-status ledger (schema has no composition/symbol/test fields). | 001, finalized 005 |
| F6 | No derived recommendation->runtime-symbol/test/composition map exists yet. | 001 |
| F7 | All eight rollback switches issue certificates without requiring verified identity flags; certs are evidence-only (`authorityMutation: false`), and a durable reverse CAS exists but is unwired. | 002, proven per-mode in 003/004 |

## Phase sequence (all Planned)

1. **001-measurement-and-traceability** — derived rec->symbol/test/composition-status join over the 72
   phase-013 rows + alias manifest, without mutating the frozen 178-row ledger. Prerequisite report for 004/005.
2. **002-substrate-identity-fail-closed** — gateway denies missing/null/partial identity by default; rollback
   certs + `matchesPreparedAuthorizationDecision` require verified identity; reconcile the identity ADR. **Gates 003.**
3. **003-pilot-mode-cutover** — wire ONE mode's `AuthorityFlipCoordinator` into a production composition root
   behind a rollback window, shadow-parity green first, + five-boundary production test.
4. **004-fleet-authority-cutover** — roll the proven pattern to the remaining 7 modes one at a time; retire
   legacy writers only after zero-use telemetry.
5. **005-closeout-and-drift-reconcile** — three-field status across mode docs, reconcile the ledger via phase-1
   traceability, final matrix green, epic-completion reconcile.

## Immediate next action (next session)

Implement **001-measurement-and-traceability** first — it is the only phase with no upstream dependency and it
supplies the status vocabulary every later phase reports against. Then 002 (the hard fail-closed prerequisite),
then the 003 pilot behind a rollback window.

## Key mechanics (carry-forward)

- **Metadata regen** must run from a worktree with a built `dist/` (this main checkout has one):
  `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js <folder>` then
  `.../spec-folder/generate-description.js <folder> <repo-root>`. For a phase parent, clear `children_ids` to
  `[]` first — backfill merges rather than prunes.
- **Adding any doc under a phase-parent root** (e.g. `research/research.md`, `handover.md`) staleness the
  parent's graph-metadata fingerprint; regen the parent after.
- **Executor dispatch** for authoring workers: prefix `MK_SPEC_GATE_DISABLED=1 MK_SPEC_GATE_ENFORCE=0
  AI_SESSION_CHILD=1` and redirect `</dev/null`; SOL-high = `opencode run --model openai/gpt-5.6-sol-fast
  --variant high`.
- **Deep-research trap:** a lean phase-parent host lacking Open-Questions/Research-Context anchors makes the
  findings-writeback halt fail-closed and **drop the synthesis**. Bind research to a contract-backed host, or
  reconstruct verify-first (as was done here).
- **Push** needs `SPECKIT_ALLOW_REMOTE_PUSH=1`; v4/main are fast-forward only, never force.

## Session cleanup done alongside this packet

- Two Dependabot alerts (#831 cryptography high, #832 langgraph-checkpoint-sqlite medium) were **dismissed as
  `not_used`** — both live in a vendored GraphARC research snapshot under packet 037 `context/`, not a runtime
  dependency. Reversible from the Security tab.
- The `0148` and `0149` landing worktrees were removed (both branches were merged into origin/v4). The
  `refs/autostash-rescue/8cd995f63ad3` ref is preserved.

## Confirmed vs inferred

- **Confirmed:** the seven findings (verified against live code with file:line in `research.md`); the packet
  validates recursively `--strict` at zero errors; both remote heads carry the commit.
- **Inferred / to verify at implementation:** actual deployed-process cutover state (F3 is an on-disk count
  only); which mode is the 003 pilot; that the phase acceptance criteria survive contact with the real
  composition roots.
