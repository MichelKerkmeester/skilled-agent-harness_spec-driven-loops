---
title: "Verification Checklist: Command-surface projection layer (argumentGrammar + choreography[])"
description: "P0/P1/P2 verification gate for the additive recipe-field port: SSOT validity, surface-check enforcement, wrapper drift, and no-regression against the STATUS=PASS drift=0 baseline."
trigger_phrases:
  - "d6-r1 command recipe projection"
  - "command metadata design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/001-command-recipe-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered SSOT, surface-check, and wrappers"
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
# Verification Checklist: Command-surface projection layer (argumentGrammar + choreography[])

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

- [x] CHK-001 [P0] Spec deliverable and target set understood
  - **Evidence**: spec names the SSOT, the five wrappers, the registry-as-identity, and the drift hook; all targets verified on disk
- [x] CHK-002 [P0] Baseline surface-check captured before any edit
  - **Evidence**: `node design-command-surface-check.mjs` → `STATUS=PASS ... invalid=0 drift=0`, exit 0 captured pre-edit
- [x] CHK-003 [P0] Logic-sync decision recorded: `ownerMode` stays singular vs spec `ownerModes[]`
  - **Evidence**: resolved in spec RISKS/OPEN QUESTIONS; singular kept, the rename is not adopted (it breaks `drift=0`)
- [x] CHK-004 [P1] Scope boundary recorded: `nextOptions[]` full handoff grammar deferred to sibling phase 007
  - **Evidence**: spec dependency/risk row; `next[]` kept as minimal next-options here
- [x] CHK-005 [P1] Net-new field shapes agreed (`argumentGrammar`, `choreography[]`)
  - **Evidence**: shapes match plan §3; `argumentGrammar.render` equals `argumentHint`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] SSOT parses as valid JSON with five records after edits
  - **Evidence**: `JSON.parse` clean; metadata stage reports `commands=5`, no parse error
- [x] CHK-011 [P0] Additive only — no existing SSOT field removed or mutated
  - **Evidence**: only `argumentGrammar` + `choreography[]` added per record; all prior fields preserved
- [x] CHK-012 [P0] Mode registry is byte-unchanged (identity preserved)
  - **Evidence**: `mode-registry.json` untouched; routing artifacts untouched
- [x] CHK-013 [P1] Surface-check additions reuse existing helpers and patterns
  - **Evidence**: `validateArgumentGrammar`, the choreography validator, and the drift detector mirror the existing pipeline/taskProjections style
- [x] CHK-014 [P0] Every code comment is evergreen — no spec path, phase id, or artifact number
  - **Evidence**: evergreen scan of the edited script clean

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Both new fields are required and validated by the surface-check
  - **Evidence**: both in the required-field set; removing either from a record yields `STATUS=INVALID` with a named error
- [x] CHK-021 [P0] `argumentGrammar.render === argumentHint` enforced for all five records
  - **Evidence**: bite — corrupting a real `argumentGrammar.render` yields `STATUS=INVALID invalid=1`; reverted
- [x] CHK-022 [P0] `choreography[]` validated as a non-empty ordered array of real named steps
  - **Evidence**: validator rejects an empty array or a step missing `skill`/`action`; all five records accepted
- [x] CHK-023 [P0] Every wrapper `## CHOREOGRAPHY` section matches the SSOT (drift gate)
  - **Evidence**: bite — one diverged numbered step yields `STATUS=DRIFT drift=1`; revert restores `drift=0`
- [x] CHK-024 [P0] Final surface-check is green
  - **Evidence**: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (post-change, orchestrator-verified)
- [x] CHK-025 [P1] 1:1 projection holds — every `workflowMode` key resolves to exactly one recipe
  - **Evidence**: metadata stage reports `commands=5 workflowModes=audit,foundations,interface,md-generator,motion`

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Every spec acceptance criterion is met
  - **Evidence**: SSOT parses; every `workflowMode` key resolves to one recipe; wrappers match metadata
- [x] CHK-061 [P0] The drift hook proves wrapper-equals-metadata (not just field presence)
  - **Evidence**: the detector compares each wrapper `## CHOREOGRAPHY` content to the SSOT, and the divergence bite is caught (`drift=1`)
- [x] CHK-062 [P1] No partial port — all five records and all five wrappers carry the new fields/sections
  - **Evidence**: per-command tally is 5/5 for both fields and the `## CHOREOGRAPHY` section
- [x] CHK-063 [P1] Rollback path validated as clean
  - **Evidence**: both bites reverted to the green baseline; text-only revert with no data migration

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Surface-check no-regression: `invalid=0 drift=0`, exit 0 held vs baseline
  - **Evidence**: pre and post outputs identical on the summary line
- [x] CHK-031 [P0] Existing D2/D3 fields preserved (`outputContract`, `next`, `pipeline`, `discriminator`, `registerPolicy`, `taskProjections`, `argumentHint`)
  - **Evidence**: diff confirms these are unchanged; only the two new fields were added
- [x] CHK-032 [P1] Routing artifacts untouched (registry identity + hub router); hubRoute metric unaffected
  - **Evidence**: no edit to `mode-registry.json`, `hub-router.json`, or `score-skill-benchmark.cjs`; `ownerModes`=0, `nextOptions`=0; hubRoute 23/5/0
- [x] CHK-033 [P1] No sibling-phase scope leaked in
  - **Evidence**: no scorer cap (002), no `nextOptions[]` handoff grammar (007), no broader structural drift audit (008) added here

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the shipped recipe shapes
  - **Evidence**: all three reflect `argumentGrammar` + `choreography[]` and the deferred `ownerModes[]`/`nextOptions[]`
- [x] CHK-041 [P1] Wrapper `CHOREOGRAPHY` sections read as house-style, content-first prose
  - **Evidence**: each section names the ordered steps a reader can follow; no template scaffolding left
- [x] CHK-042 [P2] Honest enforcement note recorded (code-enforced structure vs advisory taste)
  - **Evidence**: plan §3 enforcement-honesty paragraph and spec OPEN QUESTIONS record presence-enforceable vs sequence-quality-advisory

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the three in-scope artifacts (SSOT, surface-check, five wrappers) changed
  - **Evidence**: change set limited to `command-metadata.json`, `design-command-surface-check.mjs`, and the five `design/*.md` wrappers
- [x] CHK-051 [P1] Negative-probe scratch reverted; working tree clean before completion
  - **Evidence**: both bites reverted; final surface-check green (`invalid=0 drift=0`)

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification against the delivered SSOT, surface-check, and the five wrappers)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
CHK-NNN with [P*] priorities + fix-completeness section
All items [x] with verified evidence; STATUS=PASS commands=5 invalid=0 drift=0; render-INVALID and choreography-DRIFT bites confirmed
-->
