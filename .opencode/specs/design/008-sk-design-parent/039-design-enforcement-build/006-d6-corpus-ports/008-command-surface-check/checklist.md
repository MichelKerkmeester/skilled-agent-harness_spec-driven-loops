---
title: "Verification Checklist: design-command-surface-check roster-reconciliation drift audit"
description: "P0/P1/P2 verification gate for the additive roster-reconciliation stage: glob commands/design/, three-way roster reconciliation, route-fixture cross-check, dangling-handoff resolution, evergreen output, and no-regression against STATUS=PASS commands=5 invalid=0 drift=0 and hubRoute 34/29/5/0. Each item marked [x] includes evidence of completion."
trigger_phrases:
  - "command surface check checklist"
  - "design surface drift audit checklist"
  - "wrapper roster reconciliation checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/008-command-surface-check"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the surface-check and the two DRIFT bites"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: design-command-surface-check roster-reconciliation drift audit

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

- [x] CHK-001 [P0] Spec §3 target + §4 build outline + §5 acceptance read in full
  - **Evidence**: spec §3 target + §5 acceptance restated in plan §1; the roster-reconciliation stage maps to the "vs route fixtures" comparison
- [x] CHK-002 [P0] R1 (argumentGrammar/choreography) confirmed landed in checker + metadata before R8
  - **Evidence**: R1 fields verified present on all five records before R8 build starts
- [x] CHK-003 [P0] R7 (handoff/nextOptions) confirmed landed BEFORE R8, and R8 authored LAST consuming R7's fields
  - **Evidence**: R7 handoff/nextOptions verified present; R8 built last and resolves those targets against the reconciled roster (build order R1 → R7 → R8 honored)
- [x] CHK-004 [P0] R8 consumes R7's handoff/next fields (does not re-implement or pre-empt them)
  - **Evidence**: the dangling-handoff clause resolves R7's `nextOptions`/handoff targets; R7 fields preserved, not duplicated
- [x] CHK-005 [P1] Clean-surface + hubRoute baselines captured before any edit
  - **Evidence**: `STATUS=PASS ... invalid=0 drift=0`, exit 0, and hubRoute 34/29/5/0 captured pre-edit

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Change is a single additive hunk; checker still runs deterministically
  - **Evidence**: one stage joins the existing `drift[]` + sort + `emitAndExit`; `node --check` clean; one merged `SUMMARY`
- [x] CHK-011 [P0] Evergreen: no spec paths, packet/phase numbers, or R-ids in new code comments/strings
  - **Evidence**: evergreen scan of the one extended file is clean
- [x] CHK-012 [P1] Structural drift carries a greppable `kind` and a specific locus
  - **Evidence**: each structural locus (`orphan-wrapper`, `missing-wrapper`, `unroutable-command`, `uncommanded-mode`) carries a greppable `kind`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Checker BITES: orphan-wrapper, missing-wrapper, frontmatter≠metadata, dead placeholder, alias collision, route-fixture drift, dangling handoff each FAIL
  - **Evidence**: removing a wrapper → `STATUS=DRIFT` (missing-wrapper); adding an orphan doc → `STATUS=DRIFT` (orphan-wrapper); prior field/alias/route/handoff bites preserved
- [x] CHK-021 [P0] Clean surface passes: `STATUS=PASS invalid=0 drift=0`
  - **Evidence**: `node design-command-surface-check.mjs` → `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified, temp-corrupt-restore, no pipe-masking)
- [x] CHK-022 [P0] No-regression: hubRoute lane unaffected by this phase
  - **Evidence**: lane holds 34/29/5/0; this phase touches no scorer or router file
- [x] CHK-023 [P1] Exit codes correct (0 pass / 1 drift / 2 invalid) for each class
  - **Evidence**: clean surface exits 0; structural drift exits non-zero with the named locus; invalid metadata short-circuits

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Wrapper roster sourced from a real glob of `commands/design/*.md` (not only the hardcoded list)
  - **Evidence**: the stage globs `.opencode/commands/design/*.md` into the on-disk command-doc roster; orphan/missing bites depend on it
- [x] CHK-031 [P0] Three rosters reconciled: command-doc files ↔ metadata records ↔ routable modes
  - **Evidence**: three-way symmetric diff with `orphan-wrapper` / `missing-wrapper` / `unroutable-command` / `uncommanded-mode` loci
- [x] CHK-032 [P0] Route-fixture cross-check covers `hub-router.json` AND `mode-registry.json`
  - **Evidence**: every `ownerMode` resolves to a `hub-router.json` route and a `mode-registry.json` workflowMode; no routable mode lacks a command
- [x] CHK-033 [P1] All five commands covered; no command silently skipped by the new stage
  - **Evidence**: roster reconciles to `commands=5`; five command-doc wrappers ↔ five metadata records ↔ five routable modes
- [x] CHK-034 [P1] Prior field-level invariants (`<design request>`, mutation-free tools, ownerMode∈workflowMode, alias uniqueness) preserved, not removed or weakened
  - **Evidence**: each prior bite still fires; frontmatter ≠ metadata still drifts; the stage is additive
- [x] CHK-035 [P1] Dangling-handoff / unknown-recipe next options detected
  - **Evidence**: a `nextOptions`/handoff target not resolving to a command in the reconciled roster fails resolution

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No secrets, tokens, or external network calls introduced in the stage
  - **Evidence**: the stage globs and parses only local command docs, metadata, router, and registry; no new dependencies
- [x] CHK-041 [P1] The stage is read-only over its inputs; no auto-invocation or write path introduced
  - **Evidence**: `command-metadata.json`, the five wrappers, `mode-registry.json`, `hub-router.json`, and the fixtures are read, never written

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks/checklist synchronized; the R1 → R7 → R8 build-on order is reflected
  - **Evidence**: spec RISKS/OPEN QUESTIONS record R8-last + build-on order; plan/tasks/checklist agree on the reconciled-roster scope
- [x] CHK-051 [P1] implementation-summary records the deliverable, the PASS 5/0/0, the two DRIFT bites, and the code-enforced (roster symmetry, route consistency, dangling-handoff) vs advisory (surface taste, live NL routing) ceiling
  - **Evidence**: implementation-summary documents the roster-reconciliation stage, `STATUS=PASS commands=5 invalid=0 drift=0`, the missing-wrapper / orphan-wrapper bites, and the enforced-vs-advisory split in Known Limitations §1
- [x] CHK-052 [P2] No completion claim overstates the guarantee beyond structural consistency
  - **Evidence**: docs claim only that the surface is structurally consistent, never that it is tasteful or correct on open-ended input

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Only `design-command-surface-check.mjs` modified; no out-of-scope edits
  - **Evidence**: change set is exactly the one extended file; inputs untouched
- [x] CHK-061 [P1] Temp bite-test fixtures restored/removed; surface left clean
  - **Evidence**: both DRIFT bites used temp-corrupt-restore on the real surface; restore returned `STATUS=PASS drift=0`

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
**Verified By**: markdown-agent (independent re-verification against the delivered surface-check, the two DRIFT bites, and the untouched rosters)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
CHK-NNN with [P*] priorities + canonical order (protocol, pre-impl, code-quality, testing, fix-completeness, security, docs, file-org, summary)
All items [x] with verified evidence; STATUS=PASS commands=5 invalid=0 drift=0; missing-wrapper-DRIFT and orphan-wrapper-DRIFT bites confirmed and restored
Fix-completeness: roster sourced from a real glob; three rosters reconciled; route-fixture cross-check; dangling handoff detected; prior field checks preserved
Build-on order R1 -> R7 -> R8 (R8 last); hubRoute 34/29/5/0 unaffected; evergreen; one file extended; completes Group A
-->
