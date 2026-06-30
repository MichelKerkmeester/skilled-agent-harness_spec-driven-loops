---
title: "Verification Checklist: D6-R10 READABILITY/DENSITY + LOCALE STRESS proof"
description: "Verification checklist for the append-only addition of the Readability And Density and Locale Stress conditional proof fields and the documented RTL physical-direction lint to the sk-design context loading contract, with fix-completeness, no-regression, and enforcement-honesty evidence."
trigger_phrases:
  - "d6-r10 checklist"
  - "readability density locale proof checklist"
  - "rtl lint contract checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/010-readability-density-locale-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered readability/locale fields and RTL lint"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D6-R10 READABILITY/DENSITY + LOCALE STRESS proof

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

- [x] CHK-001 [P0] Target confirmed as the single named file `.opencode/skills/sk-design/shared/context_loading_contract.md`
  - **Evidence**: spec.md §3 names exactly one target; no new/extended script authorized this phase; the only change this phase made is to the contract file
- [x] CHK-002 [P0] Insertion regions identified: §4 REQUIRED PROOF FIELDS (new fields) and §5 HARD GATES (lint rule)
  - **Evidence**: §4 subsection convention (`###` + fenced `text` block) used at lines 216/241; §5 deterministic-enforcement convention used for the gate row (279) + lint block (283-289)
- [x] CHK-003 [P0] Shared-file sequencing reconciled before writing
  - **Evidence**: 004 / 005 / 006 write status checked; rebased on latest; 006's in-place AUDIT EVIDENCE reshape accounted for; R10 appended last in the §4 lane

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edits are additive-only — no existing field, gate row, calculator reference, or anchor altered
  - **Evidence**: `git diff --numstat` reports `+57 / -0` for the contract; zero existing non-blank lines removed; all prior content byte-stable
- [x] CHK-011 [P0] Evergreen [HARD]: no phase IDs, spec paths, or "ported from" provenance in contract content
  - **Evidence**: grep of the additions for `D6-`, `.opencode/specs`, packet numbers, and provenance phrasing returns zero hits; orchestrator evergreen scan clean
- [x] CHK-011a [P1] House style content-first: field blocks lead with substance, match existing §4 shapes
  - **Evidence**: the two new subsections read like Register And Dials / Audit Evidence (a `###` heading + fenced `text` block + a short usage note), not a narrative aside
- [x] CHK-012 [P1] Field shapes faithful to corpus measured values
  - **Evidence**: measure 45-75 (~66 ideal), `ch`-unit max-width, ~130% expansion proxy (German/Finnish), logical properties — consistent with readable-measure / localization-design

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] READABILITY AND DENSITY PROOF field present, triggers on content-heavy UI, display/short-UI exempt
  - **Evidence**: `### Readability And Density` at §4 line 216; trigger (content-heavy) + exemption (display type, short UI strings) stated; `COMPLETE | GAPS | N/A` verdict
- [x] CHK-021 [P0] LOCALE STRESS PROOF field present, triggers on global/localized UI
  - **Evidence**: `### Locale Stress` at §4 line 241; covers ~130% expansion proxy, RTL logical properties, mirrored directional icons; `COMPLETE | GAPS | N/A` verdict
- [x] CHK-022 [P0] RTL lint BITES: physical `margin-left`/`padding-left` sample is flagged (deterministic fail)
  - **Evidence**: the documented `rg --pcre2` rule (lines 283-289) flagged `.physical { margin-left: 8px; padding-right: 4px; text-align: left; }` on a CSS sample
- [x] CHK-023 [P0] RTL lint passes on logical properties (no false positive)
  - **Evidence**: the same rule did not match `.logical { margin-inline-start: 8px; padding-inline-end: 4px; text-align: start; }` — clean
- [x] CHK-024 [P1] Logical-property exemption documented so the lint does not block legitimate uses
  - **Evidence**: §5 (lines 289) names the logical equivalents the rule intentionally does not match and the "replace with a logical equivalent or document the exception" escape

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: a missing measured readability/locale shape is a `class-of-gap` (content-heavy and global surfaces had no fillable proof field), not a one-doc omission
  - **Evidence**: the fix adds two conditional proof fields plus a gated lint, generalizing the floor so content-heavy and global surfaces must declare their measured/locale state
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the shared context-loading contract is the single producer of design proof-field shape; both new fields land there consistently
  - **Evidence**: both fields land under §4 REQUIRED PROOF FIELDS in `context_loading_contract.md`, the SSOT for proof-field shape; no second parallel surface was created
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the RTL lint is documented-deterministic-when-run, walked by an operator/CI step, not a new wired parser — recorded honestly rather than overclaimed
  - **Evidence**: no new `.py`/`.mjs`; `proof_check.py` byte-unchanged; the lint ships as an exact `rg` rule gated by the §5 "Locale Stress / RTL" row, run on demand
- [x] CHK-FIX-004 [P0] Trigger/verdict cases listed for the gate to exercise: content-heavy → readability field; global → locale field; physical CSS → lint flags; logical CSS → lint passes
  - **Evidence**: both fields state their trigger + `COMPLETE | GAPS | N/A` verdict; the lint bit on physical CSS and passed on logical CSS in test
- [x] CHK-FIX-005 [P1] Enforcement axis listed: presence convention-enforced vs measured-quality advisory vs RTL-lint deterministic-when-run
  - **Evidence**: the hybrid split and the documented-rule vs declined-wired-script fork are recorded identically in spec §6/§7 and implementation-summary

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No script created or modified — scope held to the single named contract file
  - **Evidence**: only `context_loading_contract.md` changed by this phase; `proof_check.py` / `contrast_check.py` / `audit_contract.md` / cards carry no change from it
- [x] CHK-031 [P2] Enforcement honesty recorded: presence-enforceable vs advisory-quality vs deterministic-when-run lint
  - **Evidence**: implementation-summary §What/§Limitations state the hybrid split and the "not always-on wired" lint caveat; the wired-script fork is recorded as declined

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the as-built contract additions
  - **Evidence**: spec.md upgraded to Level 2, status complete, §7 resolved; plan/tasks marked `[x]` and reflect the final field + lint shape
- [x] CHK-041 [P1] No-regression confirmed
  - **Evidence**: R4 Interaction State Matrix, R5 Decision Rationale, and R6 Audit Evidence accessibility coverage lanes intact; `proof_check.py` / `contrast_check.py` references still resolve
- [x] CHK-042 [P2] Shared-file sequencing flag carried into implementation-summary
  - **Evidence**: the summary notes the 004/005/006/010 §4 contention and the resolution order (R4 → R5 → R6 → R10, R10 last)

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: the CSS lint sample was created in a `mktemp` dir and removed after the bite test; nothing committed to the tree
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: no stray fixtures left behind; the phase folder carries only its spec docs

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification of the delivered Readability And Density + Locale Stress §4 fields and the §5 documented RTL lint in `context_loading_contract.md`, with the append-only `+57 / -0` diff, the R4/R5/R6 lane preservation, and the lint-bite test confirmed)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Fix-completeness, no-regression, evergreen, and enforcement-honesty dimensions
-->
</content>
