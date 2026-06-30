---
title: "Implementation Plan: Transform-Lane Proof Cards"
description: "Plan to add fillable applied-transform proof cards for the distill, clarify, and delight lanes to transform_application.md so an applied transform produces an auditable keep/remove ledger, before/after, earned-moment, reduced-motion, and opt-out record, while the guidance lanes and routing sections stay byte-stable and the aesthetic call stays advisory."
trigger_phrases:
  - "transform lane proof cards plan"
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
    recent_action: "Marked plan tasks complete with evidence; renamed L2 anchors to canonical form"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase ships markdown only: the spec target names only transform_application.md and calls for no validator; a deterministic card checker is a flagged out-of-scope follow-up"
      - "Residual is the fillable proof card, not the verb lanes: the guidance lanes already exist, so the per-application auditable artifact is what landed"
---
# Implementation Plan: Transform-Lane Proof Cards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown fill-in cards (interface reference doc); no script, no runtime |
| **Primary target (spec-named)** | `design-interface/references/design-process/transform_application.md` (EDIT, additive — appends fillable proof cards for the distill/clarify/delight lanes) |
| **What lands** | One new subsection at the end of the verb-lanes section: a fillable proof card per named lane (Distill, Clarify, Delight) the applier completes for a real surface |
| **Contract bound** | `transform_application.md` Shared Application Contract (the proof-field definitions) + the per-verb guidance lanes already in the same file — the cards reference both, they do not restate them |
| **Verification** | Card-shape grep/review: each named lane's proof card carries a keep-ledger row, a remove-ledger row, and before + after rows (plus earned-moment, reduced-motion, opt-out); routing rule + gold prompts byte-unchanged; aesthetic stays advisory |

### Overview
The interface transform lane already defines a Shared Application Contract — the proof *fields* every transform must respect (keep ledger, remove ledger, before/after, earned moment, reduced motion, opt-out) — and a per-verb guidance lane for each of bolder, quieter, distill, clarify, and delight. Those two pieces landed with the transform-verb work and are present in `transform_application.md` today. What is missing is the *fillable artifact*: a per-application proof card an applied distill, clarify, or delight transform must produce, recording what it actually kept and removed on a specific surface and the before/after read it achieved. The Shared Application Contract names the fields in the abstract and the guidance lanes say what to keep or remove in general, but nothing in the file is an emittable, auditable card an applied transform hands back, and nothing states the card-shape check.

This build closes that gap with one additive move: **append a fillable proof card for each of the three named lanes** to `transform_application.md`, immediately after the verb-lane guidance. Each card is a blank skeleton whose rows map to the Shared Application Contract fields, plus a pointer to the matching guidance lane so it never recopies the guidance text. An applied transform fills the card for its surface; the filled card is the auditable proof.

**Reconciliation with the existing file (no duplication).** Three layers, each with a distinct job:
1. **Shared Application Contract** — the proof *field definitions* (what keep ledger / remove ledger / before-after / earned moment / reduced motion / opt-out mean). Unchanged.
2. **Verb-lane guidance (bolder, quieter, distill, clarify, delight)** — the generic *advice* on what to keep or remove per verb. Unchanged.
3. **Proof cards (this phase, distill/clarify/delight)** — the *fillable per-application artifact* that turns the field contract plus the lane guidance into an auditable proof an applied transform must emit. NEW. The card references the contract and the matching lane by name; it does not duplicate either.

**Honest enforcement boundary (scope-faithful).** The spec target is `transform_application.md` only, and the spec build outline — unlike the sibling hybrid phases that explicitly call for a validator — names no checker. So this phase ships **markdown only**. The card *shape* is deterministically grep-verifiable (each named card has a keep row, a remove row, and before + after rows), and that shape is enforceable on a corpus/CI gate in principle, but **this phase bundles no gate**: the card check is performed by grep/review at build time. Whether the kept/removed choices and the earned moment are the *right* aesthetic call stays advisory — always. A deterministic card checker is the natural sibling-pattern follow-up; it is explicitly **out of scope here** because the spec does not call for it (see §3, Future enforcement).

Scope is frozen to one additive edit of one file. No script, no other interface doc, no routing change.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec target confirmed: `transform_application.md` exists and already carries the Shared Application Contract + the five verb-lane guidance blocks — confirmed on disk
- [x] Confirmed the residual gap is the fillable proof card, not the guidance lane (the distill/clarify/delight guidance lanes already exist) — residual is the per-application artifact
- [x] Field set fixed by the existing Shared Application Contract: keep ledger, remove ledger, before/after, earned moment, reduced motion, opt-out — card rows mirror this set
- [x] Card scope fixed by spec: the three named lanes — distill, clarify, delight (bolder/quieter keep their guidance lane only, out of this phase's scope) — three cards shipped
- [x] Placement fixed: append after the verb-lane guidance so the Routing Rule and Gold Prompts sections keep their position and number — appended at end of §3, before §4

### Definition of Done
- [x] `transform_application.md` carries one fillable proof card per named lane (Distill, Clarify, Delight), each with rows for keep ledger, remove ledger, before, after, earned moment, reduced motion, and opt-out — three cards render with all rows
- [x] Each card points to its matching guidance lane and the Shared Application Contract by name — no guidance text is recopied — each card cites lane + contract, no prose duplicated
- [x] ACCEPTANCE (card check, deterministic shape): each of the three named proof cards has a keep-ledger row, a remove-ledger row, and before + after rows present — grep-verifiable — all three pass
- [x] Advisory boundary honest: the section states the card check confirms shape only; whether the transform was applied *well* stays a judgment call — advisory line present
- [x] No-regression: the Routing Rule section and the Gold Prompts table are byte-unchanged, so routing behavior and the route-gold / hubRoute headline are preserved (0 regression) — §1 and §4 byte-identical, hubRoute 23/5/0
- [x] Additive only: the edit inserts one subsection; no existing line, lane, or section is deleted or reworded — 0 existing non-blank lines removed
- [x] Evergreen [HARD]: no spec/packet/phase IDs and no `specs/` paths in the added cards or prose; references use same-file section names or skill-relative paths only — evergreen grep clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Placement — additive, routing-inert
Append a single new subsection at the **end of the verb-lanes section**, after the last guidance lane (Delight) and before the section divider that precedes the Gold Prompts. Appending here keeps the cards adjacent to the guidance they extend and leaves the **Routing Rule** section and the **Gold Prompts** table byte-identical — those two sections feed the hub route, so leaving them untouched is what guarantees zero routing regression. No existing section is renumbered.

### The proof card (per named lane)
Each named lane (Distill, Clarify, Delight) gets one fillable card. The card is a blank skeleton the applier completes for a specific surface; its rows map one-to-one to the Shared Application Contract fields, so the card is the contract made fillable rather than a new field set:

```markdown
#### Proof Card — Distill

Fill this when an applied `make it distill` transform lands on a real surface. Apply per the
Distill guidance lane above; fields per the Shared Application Contract. Record what actually
changed on this surface — not the generic advice.

| Field | Record for this surface |
|---|---|
| Surface + single job | `__________` |
| Keep ledger | `__________` (what survived: primary goal, required controls, safety/legal copy, state cues) |
| Remove ledger | `__________` (what was cut or reduced) |
| Before (current read) | `__________` (one sentence) |
| After (intended read) | `__________` (one sentence) |
| Earned moment | `__________` (the one memorable move, tied to the surface's job) |
| Reduced motion | `__________` (the static/instant parity for any motion introduced) |
| Opt-out | `__________` (`applied`, or `declined — rerouted to audit/foundations because ___`) |

Card check (deterministic shape): a filled card has a keep-ledger row, a remove-ledger row, and
a before and after present. Whether the kept/removed choices and the earned moment are the right
call stays an audit judgment, not a card check.
```

Clarify and Delight repeat the same skeleton, each pointing to its own guidance lane and keeping the contract field set identical. The three cards differ only by which guidance lane they cite and the parenthetical hints, which echo (do not recopy) that lane's keep/remove emphasis.

### Enforcement honesty (stated in the section)
- **Verifiable shape (deterministic, not gated here):** the *presence* of a keep row, a remove row, and a before + after in each named card. Grep-checkable, same answer every run; enforceable on a corpus/CI gate in principle.
- **Advisory (judgment):** whether the kept/removed decisions, the earned moment, and the before/after read are *good*. The card section says this in plain words; no artifact in this phase asserts taste.

### Future enforcement (out of scope, flagged honestly)
The sibling hybrid phases that ship a deterministic gate do so because their spec build outline explicitly calls for a validator. This spec does not — its target is `transform_application.md` only and its acceptance is a card-shape check. A small stdlib checker that confirms each named lane's proof card has the required rows (mirroring the existing `shared/scripts/proof_check.py` convention) is the natural enforcement upgrade, but it is **not part of this phase** and must not be added here under scope-lock. It is recorded only so a later phase can pick it up deliberately.

### Additive / no-regression contract
- The edit only inserts one subsection; no existing line, lane, contract row, routing rule, or gold prompt is deleted or reworded.
- The Routing Rule section and the Gold Prompts table are byte-unchanged, so the proof cards are routing-inert and the route-gold / hubRoute gate keeps its headline (0 regression).
- Reverting the feature is: delete the appended proof-card subsection. Nothing else to unwind; nothing depends on it.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm the residual (read before write)
- [x] Re-read `transform_application.md` Shared Application Contract to lock the exact field names the card rows must mirror — field set locked
- [x] Re-read the Distill, Clarify, and Delight guidance lanes to confirm the cards extend (and cite) them rather than restate them — lanes confirmed, cited not restated
- [x] Confirm the Routing Rule section and the Gold Prompts table are the routing-critical regions to leave byte-unchanged — §1 and §4 marked off-limits

### Phase 2: Author the proof cards (additive edit)
- [x] Append a `### Applied-Transform Proof Cards` subsection at the end of the verb-lanes section, before the Gold Prompts divider — appended at end of §3
- [x] Add a fillable proof card for Distill, Clarify, and Delight — each with keep-ledger, remove-ledger, before, after, earned-moment, reduced-motion, and opt-out rows — three cards added
- [x] In each card, point to its matching guidance lane and the Shared Application Contract by name; do not recopy guidance text — citations added, no prose duplicated
- [x] Add the card-check line (deterministic shape) and the advisory-boundary line to the subsection — both lines present

### Phase 3: Verification
- [x] Card check: grep each named card for a keep-ledger row, a remove-ledger row, and before + after rows — all three cards pass — verified
- [x] No-regression: diff confirms the Routing Rule section and the Gold Prompts table are byte-unchanged; re-run the route-gold / hubRoute guard and confirm 0 regression against the live headline — §1/§4 byte-identical, hubRoute 23/5/0
- [x] Reconciliation: confirm the cards reference the contract and guidance lanes and add no duplicate guidance prose — cards cite, lanes unchanged
- [x] Evergreen + scope-lock: grep the added subsection for spec/packet/phase IDs and `specs/` paths (none); confirm the change set is exactly the one file, one inserted subsection, no prose deleted — evergreen + scope clean

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Card-shape (pass) | Each named proof card | grep finds a keep row, a remove row, and before + after in Distill, Clarify, and Delight cards |
| Field-set consistency | Card rows vs Shared Application Contract | the card rows mirror the contract fields exactly; no field invented, none dropped |
| Reconciliation | Card vs guidance lane | each card cites its guidance lane + the contract; no guidance prose is recopied |
| No-regression (routing) | Routing Rule + Gold Prompts | diff shows both byte-unchanged; route-gold / hubRoute guard re-run reports 0 regression |
| Additive lint | File diff | only the new subsection added; no existing lane, contract row, or section deleted/reworded |
| Evergreen lint | Added subsection | grep finds no `specs/` paths and no packet/phase IDs; only same-file/skill-relative references |
| Scope audit | Working tree | only `transform_application.md` modified; no script or other interface doc touched |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `transform_application.md` Shared Application Contract | Internal | Green | Card rows have no field set to mirror |
| `transform_application.md` Distill/Clarify/Delight guidance lanes | Internal | Green | Cards have no guidance lane to cite; risk of duplicating guidance |
| `transform_application.md` Routing Rule + Gold Prompts | Internal | Green | The byte-unchanged regions that keep routing 0-regression |
| Route-gold / hubRoute guard | Internal | Green | No-regression cannot be confirmed; 0-regression floor unverifiable |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the cards duplicate guidance, contradict the Shared Application Contract field set, or any routing region drifts.
- **Procedure**: delete the appended `### Applied-Transform Proof Cards` subsection, restoring the file byte-for-byte. The change is a pure insertion referenced by nothing else, so removal restores the prior state exactly. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm residual) ──> Phase 2 (Author cards) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm residual | None | Author cards |
| Author cards | Confirm residual | Verify |
| Verify | Author cards | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm residual (re-read contract + 3 lanes + routing regions) | Low | 20-30 minutes |
| Author the three proof cards (skeleton + citations + check/advisory lines) | Low | 45-60 minutes |
| Verification (card shape, no-regression, reconciliation, evergreen/scope) | Low | 30-45 minutes |
| **Total** | | **~1.5-2.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the change set is exactly one edited file with one inserted subsection — verified, one additive edit
- [x] Confirm the Routing Rule section and the Gold Prompts table are byte-unchanged — verified byte-identical
- [x] Confirm the inserted cards delete and reword no existing prose — 0 existing non-blank lines removed

### Rollback Procedure
1. Delete the appended `### Applied-Transform Proof Cards` subsection in `transform_application.md`
2. Confirm the routing rule and gold prompts are byte-identical to the pre-change file
3. Confirm no other file references the proof cards (grep)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Subsection deletion only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Markdown-only additive proof cards (distill/clarify/delight) reconciled with the existing contract + guidance lanes
- Honest enforcement: deterministic card shape (grep/review), no bundled gate this phase, aesthetic advisory, routing byte-unchanged
-->
