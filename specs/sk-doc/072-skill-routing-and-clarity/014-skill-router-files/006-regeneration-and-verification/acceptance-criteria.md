---
title: "Acceptance Criteria: Phase 6: regeneration-and-verification"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "regeneration and verification acceptance criteria"
  - "phase 6 regeneration acceptance criteria"
  - "router derived file regeneration criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification"
    last_updated_at: "2026-10-29T16:57:00Z"
    last_updated_by: "luna"
    recent_action: "Recorded the regeneration evidence"
    next_safe_action: "Conductor rebuilds the trigger index and validates"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
      - ".skilled/bin/compiled-route-guard.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: regeneration-and-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-regeneration-and-verification
**Level:** 1
**Status:** Draft
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the post-move tree, When the 13 leaf manifests are regenerated and re-checked, Then every one recomputes byte-identical | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` prints `checked=13 fresh=13 failed=0` Observed: ci-leaf-manifest-freshness prints "checked=13 fresh=13 failed=0". | Met | - |
| AC-002 | REQ-001 | Given the post-move tree, When the Hermes copies are regenerated, Then every copy is in sync and carries the router pointer | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: 65 Hermes skill copies in sync` Observed: the post-commit Hermes check prints "PASS: 65 Hermes skill copies in sync". | Met | - |
| AC-003 | REQ-001 | Given the post-move tree, When the seven activation manifests are refreshed and copied over their authored twins, Then every hub serves bytes that match its inputs | `node .skilled/bin/compiled-route-guard.cjs --json` exits 0 with seven `"ok": true` rows, and `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 7 hubs resolve` Observed: compiled-route-guard --json exits 0 with seven "ok": true rows. compiled-route-sync prints "all 7 hubs resolve" and "all 55 served copies match their authored files". | Met | - |
| AC-004 | REQ-001 | Given the post-move tree, When the skill graph and the trigger index are rebuilt, Then both match their sources | `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` prints `STALE COMPILED: none`, and `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` prints `trigger index matches the corpus` and `stale documents   : 0` Observed: skill-graph-freshness --strict exits 0 and prints "STALE COMPILED: none". After the last document write of the packet, the regenerated index makes generate-trigger-index --check print "trigger index matches the corpus" and "stale documents   : 0 (0 missing from the index)". | Met | - |
| AC-005 | REQ-002 | Given the recaptured baseline, When its metrics and fixture hashes are compared with the committed baseline, Then the three readings hold and the three fixture hashes are unchanged | The metrics read 155/195, 49/66 and 19/24, and `corpusSha256`, `holdoutSha256` and `ambiguitySha256` equal `scorer-eval-baseline.json` Observed: both captures read 155/195, 49/66 and 19/24. corpusSha256, holdoutSha256 and ambiguitySha256 match each other and the committed baseline. | Met | - |
| AC-006 | REQ-003 | Given one tree, When the replay projection is captured before and after regeneration, Then the two reports are byte-identical | `diff scratch/replay-before/report.json scratch/replay-after/report.json` prints nothing and exits 0 Observed: diff prints nothing and exits 0. Both replay runs print "total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49". | Met | - |
| AC-007 | REQ-004 | Given the post-move tree, When the per-skill token table is regenerated, Then it holds one row per skill and its totals sit beside the research totals | The CSV holds 54 data rows, and the word, token and initial-load totals are printed beside 39159, 89931 and 88689 in `scratch/token-delta.txt` Observed: the token table has 54 rows. token-delta.txt prints 41019 words, 92418 section tokens and 90823 initial-load tokens against 39159, 89931 and 88689. | Met | - |
| AC-008 | REQ-005 | Given the final tree, When the route permission gates run, Then every one passes | `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`, `ci-skill-root-metadata.cjs` prints `checked=13 passed=13 failed=0`, `ci-hub-vocabulary-source.cjs` prints `RESULT: PASSED` Observed: the gates print "router-sync: 5/5 checks passed", "all 7 hubs resolve", "checked=13 passed=13 failed=0" and "RESULT: PASSED". | Met | - |
| AC-009 | REQ-005 | Given the seven hub routers, When the vocabulary carry is checked, Then no declared phrase is missing from the stage the advisor scores | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` prints `checked=7 hub(s), missing=0` Observed: generate-router-intent-signals --check prints "checked=7 hub(s), missing=0". | Met | - |
| AC-010 | REQ-006 | Given the finished packet, When strict validation runs on it and on its parent program folder, Then both pass | `validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification --strict` and `validate.sh specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files --strict --recursive` each end with `RESULT: PASSED` Observed: the strict run on this folder prints "Summary: Errors: 0  Warnings: 0" and "RESULT: PASSED", and the recursive strict run on the parent ends with "RESULT: PASSED" for the parent and all 22 phases. | Met | - |

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

**Closeable:** Yes

Every row is Met. AC-004 closed after the trigger index was regenerated last, and AC-010 closed on the strict runs over this folder and the parent.
<!-- /ANCHOR:closure -->

---
