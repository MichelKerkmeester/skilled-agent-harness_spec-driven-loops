---
title: "Verification Checklist: nextOptions[] + handoff status grammar (no silent chain)"
description: "P0/P1/P2 verification gate for the additive handoff-grammar port: known-recipe resolution, no-silent-chain enforcement, wrapper drift, evergreen output, and no-regression against STATUS=PASS drift=0 and hubRoute 23/5/0."
trigger_phrases:
  - "d6-r7 next options handoff grammar"
  - "handoff grammar design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/007-next-options-handoff-grammar"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the handoff SSOT, checker, and wrappers"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: nextOptions[] + handoff status grammar (no silent chain)

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

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec deliverable read: `STATUS`/`PRODUCES`/`NEXT_OPTIONS`/`HANDOFF_REQUIRED`/`HANDOFF_REASON` added to wrappers + `command-metadata.json`; checker resolves every `NEXT_OPTIONS` to a known recipe; auto-chain forbidden
  - **Evidence**: spec.md §3 build outline + §5 success criteria restated in plan.md §1; the `handoff` object carries the three net-new tokens
- [x] CHK-002 [P0] Baseline surface-check captured before any edit
  - **Evidence**: `node design-command-surface-check.mjs` → `STATUS=PASS ... invalid=0 drift=0`, exit 0 captured pre-edit
- [x] CHK-003 [P0] D6-R1 sequencing confirmed: 001's `argumentGrammar`/`choreography[]` land first; `handoff` additions coexist beside them
  - **Evidence**: R1 fields verified intact post-merge; surface-check `drift=0` after the additive port
- [x] CHK-004 [P1] `handoff` field name/shape and wrapper grammar placement decided
  - **Evidence**: grouped `handoff` object + dedicated `## HANDOFF GRAMMAR` section chosen; success tail kept intact

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All five SSOT records carry a valid `handoff` object; no existing field removed or mutated
  - **Evidence**: `command-metadata.json` change is additive only; metadata stage reports `commands=5`
- [x] CHK-011 [P0] Every `nextOptions[].command` resolves to a known recipe (one of the five `/design:*` commands) and is not the record's own command
  - **Evidence**: `validateHandoff` enforces resolution + no-self + no-duplicate; injected unknown option bites (CHK-021)
- [x] CHK-012 [P1] `handoff.nextOptions[].command` set equals the record `next` set; `next` / `pipeline.nextCommands` / `handoff.nextOptions` stay in lockstep
  - **Evidence**: `validateHandoff` requires `nextOptions == next` exactly; `pipeline.nextCommands ⊆ next` preserved
- [x] CHK-013 [P1] `handoffRequired` is boolean and `false`; `handoffReason` and each `nextOptions[].when` are non-empty
  - **Evidence**: metadata stage enforces boolean-and-`false` `handoffRequired` plus non-empty `handoffReason`/`when`
- [x] CHK-014 [P1] Surface-check code follows existing patterns (required-field set, validator, drift detector, drift-field registration)
  - **Evidence**: `validateHandoff` and `expectedHandoffDrift` mirror the existing `validate*` / `expected*Drift` shapes

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance met: a wrapper emitting an unknown next option fails the checker; declared options all resolve to known recipes
  - **Evidence**: surface-check pass on the clean surface; fail on an injected unknown option
- [x] CHK-021 [P0] Negative probe (unknown option): injected unknown/malformed `nextOptions` command fails the checker, then reverted
  - **Evidence**: `STATUS=INVALID invalid=1` with the locus reported; revert restores `drift=0` (temp-corrupt-restore on the real metadata)
- [x] CHK-022 [P0] Negative probe (silent chain): removing `handoffRequired` from a record fails the checker, then reverted
  - **Evidence**: `STATUS=INVALID invalid=2` (required-field + boolean-type errors); revert restores the green baseline
- [x] CHK-023 [P1] All five wrappers carry the handoff grammar (`NEXT_OPTIONS`, `HANDOFF_REQUIRED`, `HANDOFF_REASON`) matching the SSOT
  - **Evidence**: surface-check surface stage → `drift=0`; each `## HANDOFF GRAMMAR` section matches the metadata
- [x] CHK-024 [P0] Post-change surface-check clean
  - **Evidence**: `node design-command-surface-check.mjs` → `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Every spec acceptance criterion is met
  - **Evidence**: SSOT parses; every `nextOptions` resolves to a known non-self recipe; wrappers match metadata; unknown-option and silent-chain cases both bite
- [x] CHK-061 [P0] The drift hook proves wrapper-equals-metadata (not just field presence)
  - **Evidence**: `expectedHandoffDrift` compares each wrapper `## HANDOFF GRAMMAR` content (tokens, option commands + rationale, `HANDOFF_REQUIRED=false`, no-silent-chain line) to the SSOT
- [x] CHK-062 [P1] No partial port — all five records and all five wrappers carry the new object/section
  - **Evidence**: per-command tally is 5/5 for the `handoff` object and the `## HANDOFF GRAMMAR` section
- [x] CHK-063 [P1] Rollback path validated as clean
  - **Evidence**: both bites reverted to the green baseline; text-only revert with no data migration

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No secrets, tokens, or external network calls introduced in the checker or metadata
  - **Evidence**: checker reads only local JSON + markdown; no new dependencies
- [x] CHK-031 [P1] No auto-invocation/auto-chain path introduced; handoff is recommend-only by contract
  - **Evidence**: `HANDOFF_REQUIRED=false` in every wrapper; the no-silent-chain assertion is drift-gated

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized; exact targets and D6-R1 reconciliation reflected
  - **Evidence**: plan §3 targets + §6 reconciliation match tasks + checklist; spec RISKS/OPEN QUESTIONS record R7-adds-what-R1-deferred
- [x] CHK-041 [P0] Evergreen [HARD]: no spec path, phase number, or artifact id in shipped artifacts (metadata strings, wrapper text, checker comments)
  - **Evidence**: evergreen scan of the SSOT, five wrappers, and checker → none
- [x] CHK-042 [P2] Wrapper handoff section reads cleanly alongside the existing `PIPELINE & HANDOFF` section (no contradiction)
  - **Evidence**: manual read of each wrapper; the recommend-only line and the `## HANDOFF GRAMMAR` block agree

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] No-regression: `mode-registry.json` (and `hub-router.json` if present) byte-unchanged; `hubRoute` 23 pass / 5 known-gap / 0 regression held
  - **Evidence**: registry diff vs recorded hash clean; routing replay unchanged; D6-R1 fields preserved
- [x] CHK-051 [P1] Only in-scope files changed (SSOT, checker, five wrappers); negative-probe scratch artifacts removed
  - **Evidence**: change set is exactly the seven in-scope files; both bites reverted (the working-tree `score-skill-benchmark.cjs` change belongs to sibling D6-R2)

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification against the delivered SSOT, surface-check, and the five wrappers)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
CHK-NNN with [P*] priorities + fix-completeness section
All items [x] with verified evidence; STATUS=PASS commands=5 invalid=0 drift=0; unknown-nextOptions-INVALID (invalid=1) and missing-handoffRequired-INVALID (invalid=2) bites confirmed
Fix-completeness: unknown-option + silent-chain both bite; all five wrappers + SSOT + checker covered; no-regression + evergreen gated
-->
