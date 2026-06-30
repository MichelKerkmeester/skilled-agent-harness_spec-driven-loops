---
title: "Tasks: Transform-Lane Proof Cards"
description: "Ordered implementer items to append fillable Distill/Clarify/Delight proof cards to transform_application.md after the verb-lane guidance, mirroring the Shared Application Contract field set, citing each guidance lane without recopying it, and leaving the routing rule and gold prompts byte-unchanged so the route-gold headline holds 0 regression."
trigger_phrases:
  - "transform lane proof cards tasks"
  - "distill clarify delight proof card design build"
  - "applied transform keep remove before after card"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/008-transform-lane-proof-cards"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all tasks complete with evidence after card-shape and no-regression acceptance"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Transform-Lane Proof Cards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Confirm the Residual, Read Before Write]

- [x] T001 Re-read the Shared Application Contract in `transform_application.md` to lock the exact field names the card rows must mirror — keep ledger, remove ledger, before/after, earned moment, reduced motion, opt-out (`.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md`) [10m] — contract field set locked; card rows mirror it one to one
- [x] T002 Re-read the Distill, Clarify, and Delight guidance lanes to confirm each card extends and cites its lane rather than restating it; note each lane's keep/remove emphasis for the parenthetical hints (`transform_application.md`) [10m] — lanes confirmed present; cards cite them by name, no guidance recopied
- [x] T003 Identify the routing-critical regions to leave byte-unchanged: the Routing Rule section and the Gold Prompts table; confirm the insertion point is the end of the verb-lanes section, before the Gold Prompts divider (`transform_application.md`) [10m] — §1 Routing Rule and §4 Gold Prompts marked off-limits; insert point set at end of §3

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Author the Proof Cards, Additive Edit]

- [x] T004 Append a `### Applied-Transform Proof Cards` subsection at the end of the verb-lanes section (after the Delight guidance lane, before the Gold Prompts divider), introducing it as the fillable per-application proof artifact for the named lanes (`transform_application.md`) [10m] — subsection appended at end of §3 with the shape-check and advisory lines
- [x] T005 Add the Distill proof card: a fillable table with rows for surface+job, keep ledger, remove ledger, before, after, earned moment, reduced motion, and opt-out; cite the Distill guidance lane and the Shared Application Contract by name; do not recopy guidance prose (`transform_application.md`) [15m] — Distill card added, all seven rows + surface/job line, cites lane + contract
- [x] T006 [P] Add the Clarify proof card with the identical field set, citing the Clarify guidance lane (`transform_application.md`) [10m] — Clarify card added with the identical field set, cites the Clarify lane
- [x] T007 [P] Add the Delight proof card with the identical field set, citing the Delight guidance lane (`transform_application.md`) [10m] — Delight card added with the identical field set, cites the Delight lane
- [x] T008 Add the card-check line (deterministic shape: a filled card has a keep row, a remove row, and a before and after) and the advisory-boundary line (whether the choices and earned moment are right stays an audit judgment) to the subsection (`transform_application.md`) [10m] — both lines present in the subsection intro
- [x] T009 Verify additivity in place: every existing lane, contract row, routing rule, and gold prompt is preserved verbatim; only a new subsection was inserted; no `specs/` path or packet/phase ID embedded (`transform_application.md`) [10m] — 0 existing non-blank lines removed; evergreen grep clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Card Shape (Acceptance)
- [x] T010 Card check: grep the Distill, Clarify, and Delight proof cards; confirm each has a keep-ledger row, a remove-ledger row, and before + after rows present (deterministic shape) [10m] — all three cards carry keep/remove/before/after rows
- [x] T011 Confirm each card also carries the earned-moment, reduced-motion, and opt-out rows the Shared Application Contract requires [5m] — earned-moment, reduced-motion, and opt-out rows present in each card

### Reconciliation
- [x] T012 Confirm each card cites its matching guidance lane and the Shared Application Contract by name, and adds no duplicate guidance prose (the cards are the fillable artifact, the lanes stay the guidance) [10m] — each card cites `Guidance lane` + `Shared Application Contract`; no guidance prose recopied
- [x] T013 Confirm the card field set equals the Shared Application Contract field set exactly — no field invented, none dropped [5m] — card rows match the contract field set exactly

### No-Regression
- [x] T014 Diff the file: confirm the Routing Rule section and the Gold Prompts table are byte-unchanged [10m] — §1 Routing Rule and §4 Gold Prompts byte-identical
- [x] T015 Re-run the route-gold / hubRoute guard; confirm 0 regression against the live headline (the proof cards are routing-inert, so the pass/known-gap headline is unchanged) [10m] — hubRoute holds 23 pass / 5 known-gap / 0 regression; craft ref is not a fixture source

### Audits
- [x] T016 Evergreen audit: grep the added subsection for spec/packet/phase IDs and `specs/` paths; confirm none present — only same-file section names or skill-relative paths appear [5m] — evergreen grep clean over the subsection
- [x] T017 Scope-lock audit: confirm the change set is exactly one edited file (`transform_application.md`) with one inserted subsection, no prose deleted, and no script or other interface doc touched [5m] — scope clean; mode-registry.json, hub-router.json, fixtures, checkers untouched

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Each of the three named proof cards has a keep row, a remove row, and before + after present (deterministic card shape)
- [x] Each card cites its guidance lane + the Shared Application Contract and recopies no guidance prose
- [x] Routing Rule + Gold Prompts byte-unchanged; route-gold / hubRoute guard reports 0 regression
- [x] Additive only — no existing lane, contract row, or section deleted or reworded
- [x] Evergreen + scope-lock audits pass
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Target + bound contract**: `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md` (Shared Application Contract + Distill/Clarify/Delight guidance lanes)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit card-shape + reconciliation + no-regression + audit tasks)
- Markdown-only: append fillable distill/clarify/delight proof cards; routing regions byte-unchanged
-->
