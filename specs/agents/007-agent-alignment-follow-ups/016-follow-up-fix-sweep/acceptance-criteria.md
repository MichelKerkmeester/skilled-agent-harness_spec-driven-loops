---
title: "Acceptance Criteria: Phase 16: follow-up-fix-sweep"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "follow up fix sweep acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/016-follow-up-fix-sweep"
    last_updated_at: "2026-11-15T08:26:06Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-follow-up-fix-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 16: follow-up-fix-sweep

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `016-follow-up-fix-sweep`
**Level:** [2/3/3+]
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a terminal record with stopReason `error` or `manualStop`, When it is prepared, Then it is accepted; Given one with an `unknown` gate, Then it is refused | `deep-review-ledger-schema.vitest.ts`: the terminal test accepts `manualStop` and `error` and refuses an `unknown` gate; the file passes in the full suite (`scratch/after.txt`) | Met | - |
| AC-002 | REQ-002 | Given both review workflows, When `rg -n 'gate_pre_synthesis\|consecutive_failures' .skilled/commands/deep/assets/deep-review-{auto,confirm}.yaml` runs, Then every loop exit into synthesis and the auto three-errors rule name `record_terminal_gates` | `deep-review-confirm.yaml:1298` and `:1704` read `on_C: { set: { reason: "manualStop" }, run_first: record_terminal_gates, proceed_to: gate_pre_synthesis }`; the pivot `on_C` blocks set the reason first; `deep-review-auto.yaml:2708` runs `record_terminal_gates` with stop reason `error`; no `on_C: { proceed_to: gate_pre_synthesis` remains | Met | - |
| AC-003 | REQ-003 | Given a lineage with no registry whose state log holds only a `terminal_gates` row naming `coverage`, When `mergeReviewRegistries` runs on the rebuilt lineage, Then `mergedVerdict` is FAIL | `fanout-merge.vitest.ts` case `keeps a registry-less lineage whose state log holds only a failed terminal gate`: merged verdict FAIL with `['coverage']` | Met | - |
| AC-004 | REQ-004 | Given `orchestrate.md`, When `rg -n 'LOW' .skilled/agents/orchestrate.md` and `wc -l` run, Then the @review checklist line names the re-dispatch and the file is 600 lines or less | `.skilled/agents/orchestrate.md:379` names the LOW-confidence re-dispatch; `wc -l` prints 599 | Met | - |
| AC-005 | REQ-005 | Given the six docs and two agents, When the stale-string searches in T013 to T017 and the mirror check run, Then each search exits 1 and the mirror check exits 0 | Every stale-string search in `scratch/after.txt` printed nothing; `check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync — OK` | Met | - |
| AC-006 | REQ-006 | Given a new Claude Code session on Opus, When the SC-002 probe runs with `--output-format stream-json`, Then its result is recorded with the sub-agent's model | `scratch/sc-002-summary.txt`: the subagent ran as `claude-sonnet-5-5` from an Opus parent with no model passed and returned `FRAMEWORK: default skeleton ...`; PASS | Met | - |
| AC-007 | REQ-001 | Given the T001 baseline, When the build is done, Then `npm test` and `npm run typecheck` show no failure the baseline lacks and the drift check prints `OK` | `scratch/after.txt`: typecheck exit 0; suite 2989 passed with 2 failures, both the deep-ai-council contract digest, which pass 43/43 after the recompile; drift `OK commands=3` (baseline 2990 passed, 0 failed) | Met | - |
| AC-008 | REQ-007 | Given a blocked stop then a terminal record with no failed gate, When `synthesis_started` is folded, Then no error is thrown, the status is `converging`, and a `maxIterationsReached` record gives outcome `active` | `deep-review-reducers.vitest.ts` five terminal cases pass, 95/95, each new one failing on its mutation; suite 2996 passed, 0 failed (`scratch/after-fix-open.txt`) | Met | - |
| AC-009 | REQ-008 | Given the council skill, When `rg -n 'mirrors use deep-ai-council\|@deep-ai-council' .skilled/skills/system-deep-loop/deep-ai-council --glob '!**/changelog/**'` runs, Then it exits 1 | exit 1; drift `OK commands=3` (`scratch/after-fix-open.txt`) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
