---
title: "Implementation Plan: DECISION RATIONALE proof lane"
description: "Plan to add a conditional decision/options/evidence/tradeoffs/validation/source-proof lane to the sk-design context contract, proof card, and proof_check.py, triggered on direction/pattern-break/handoff work."
trigger_phrases:
  - "decision rationale proof lane"
  - "design rationale contract field"
  - "proof check decision rationale"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/005-decision-rationale-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark the plan Definition of Done complete after the verified rationale-lane build"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: DECISION RATIONALE proof lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown contract + Markdown proof card + Python 3 checker (`proof_check.py`) |
| **Surface** | `sk-design/shared` proof-of-application machinery |
| **Storage** | Plain files in the skill tree; no DB, no network |
| **Testing** | Run `proof_check.py` against positive and negative fixtures (present/well-formed vs missing/placeholder); re-run existing proof-field, source-proof, and application-witness paths to prove no regression |

### Overview
This adds a conditional `DECISION RATIONALE` lane so that direction-setting, pattern-breaking, or handoff design work must record what was decided, what options were weighed, what evidence informed it, the trade-offs accepted, a validation plan, and cited source proofs — instead of shipping a significant design choice unjustified. The lane lives in three places that already work as a set: the shared contract defines the field shape and gate, the proof-of-application card gives a fill-in section, and `proof_check.py` gains a `--require-decision-rationale` flag that exits non-zero when the section is absent or its required fields are placeholders. The enforcement is hybrid: presence and well-formedness are code-enforced once the flag is asserted; whether the reasoning is actually sound stays advisory, and whether a given prompt is a triggering one is the caller's judgment, not the checker's.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Field shape is fixed: `decision`, `optionsConsidered[]`, `evidenceSources[]`, `tradeoffs[]`, `validationPlan`, `sourceProofs[]` — all six in the contract block, card rows, and validator field set
- [x] Trigger set is fixed: direction, pattern-break, handoff — named in the contract §4 block and the card section
- [x] Existing checker contract read in full (the `--require-application-witness` validator is the clone template the new lane mirrors)
- [x] Additive-only edit boundary confirmed for all three target files — appends after R4's interaction-state-matrix lane, 0 lines removed

### Definition of Done
- [x] Contract carries the conditional field shape and a HARD GATE row, additively — `### Decision Rationale` under §4 + the §5 gate row
- [x] Proof card carries a fill-in DECISION RATIONALE section, additively — `## 9. DECISION RATIONALE` with the opt-in gate note
- [x] `proof_check.py --require-decision-rationale` passes a well-formed card and fails a missing/placeholder one — complete→ok, missing-field→fail naming the field, no-section→fail
- [x] No existing proof field, flag, validator, or gate changed behaviour — default gate byte-behaviour-identical; `--require-source-proof` / `--require-application-witness` non-regressed; `py_compile` clean
- [x] Shipped content carries no spec paths, packet/phase numbers, or finding IDs — evergreen scan clean across the three files

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Append-only extension of an established three-part proof contract. Two prior conditional lanes (SOURCE PROOF and APPLICATION WITNESS) already use the exact shape this lane clones: a card section with a fixed-column table, a heading-scoped row finder, a validator, and an opt-in `--require-*` flag wired through `check()` and `main()`. This lane is the third instance of that same pattern, not a new mechanism.

### Key Components
- **Contract field shape** (`shared/context_loading_contract.md` §4): a fenced `DECISION RATIONALE` block listing the six required fields plus the trigger line, in the same style as Register And Dials / Contrast Pairs.
- **Contract HARD GATE row** (`shared/context_loading_contract.md` §5): one table row that names the gate and what it blocks (a direction/pattern-break/handoff claim with no recorded rationale).
- **Card section** (`shared/assets/proof_of_application_card.md`): a new conditional `DECISION RATIONALE` section appended after APPLICATION WITNESS, using a `| Field | Value |` table whose Field column carries the six canonical names, plus a sourceProofs pointer to the existing SOURCE PROOF table convention.
- **Checker validator** (`shared/scripts/proof_check.py`): a `DECISION_RATIONALE_HEADING` regex, a `_find_decision_rationale_rows()` heading-scoped table reader, a `_validate_decision_rationale()` presence/well-formedness check, and a `--require-decision-rationale` flag threaded through `check()` and `main()` and the usage string.

### Data Flow
1. A caller doing direction / pattern-break / handoff work fills the card's DECISION RATIONALE section.
2. The build/delivery/CI step runs `proof_check.py --require-decision-rationale <card>.md` (the flag is asserted only for triggering work).
3. The validator locates the DECISION RATIONALE heading, reads the field/value rows, and confirms each required field has a non-placeholder value.
4. Missing section, missing required field, or all-placeholder values → non-zero exit and a named gap; complete → the lane passes and the existing READY/field/source/witness logic continues unchanged.
5. Reasoning quality is never scored by the checker; that judgment is left to review (advisory).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract field + gate
- [x] Add the conditional `DECISION RATIONALE` field-shape block to the Required Proof Fields section, additively, matching the existing fenced-block house style — `### Decision Rationale` under §4 (contract line 167)
- [x] Add one HARD GATE row naming the gate and what it blocks — Decision Rationale row at §5 (contract line 201)
- [x] Name the trigger set (direction / pattern-break / handoff) inline, no IDs or paths in the prose — trigger sentence at contract line 169

### Phase 2: Card section + checker
- [x] Append a conditional DECISION RATIONALE section to the proof card with a `| Field | Value |` table carrying the six canonical fields and a sourceProofs pointer to the SOURCE PROOF table — `## 9. DECISION RATIONALE` at card line 111
- [x] Add the heading regex, row finder, and validator to `proof_check.py`, cloning the application-witness structure — `DECISION_RATIONALE_HEADING`, `_find_decision_rationale_rows`, `_validate_decision_rationale`
- [x] Thread `--require-decision-rationale` through `check()`, `main()`, the usage string, and the non-JSON print block — flag wired and printed as `DECISION RATIONALE`

### Phase 3: Verification
- [x] Confirm the validator bites on positive and negative cases — complete six-field → `ok:True`; `validationPlan` row absent → fail naming the field; no section → `decision-rationale rows missing`
- [x] Re-run `proof_check.py` with no new flag, with `--require-source-proof`, and with `--require-application-witness` to confirm unchanged behaviour — default gate byte-behaviour-identical; both existing flags non-regressed
- [x] Confirm the flag is fully opt-in: a card without the section still passes a plain `proof_check.py` run — legacy report carries no `decision_rationale` result, same `missing` set
- [x] Grep the three shipped files for spec paths, packet/phase numbers, and finding IDs; confirm none — evergreen scan clean

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Checker positive | Well-formed DECISION RATIONALE section passes under the flag | `proof_check.py --require-decision-rationale` |
| Checker negative | Missing section, missing required field, all-placeholder rows each fail with a named gap | `proof_check.py --require-decision-rationale`, `--json` |
| Opt-in isolation | A card without the section still passes a plain run | `proof_check.py` (no flag) |
| Regression | Source-proof and application-witness paths unchanged | `proof_check.py --require-source-proof`, `--require-application-witness` |
| Doc hygiene | No spec paths / packet numbers / finding IDs in shipped content | `rg` over the three target files |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `proof_check.py` source-proof/witness validators | Internal | Green | Clone template for the new validator |
| SOURCE PROOF table convention | Internal | Green | sourceProofs reuse it by reference |
| Sibling state-matrix lane (also edits contract + card) | Internal | Pending | Append-only ordering avoids collision; see Phase Dependencies |
| Sibling a11y-coverage lane (also edits contract) | Internal | Pending | Append-only ordering avoids collision; see Phase Dependencies |
| Command surface checker / benchmark scorer | Internal | N/A | Not touched by this lane — see Rollback and Phase Dependencies notes |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new validator false-fails a well-formed card, or the contract/card additions collide with a concurrently-landed sibling section.
- **Procedure**: Revert the three additive hunks (one contract block + one gate row, one card section, one checker validator + flag wiring). Because every change is append-only, removing the added blocks restores the prior contract, card, and checker exactly; no existing field, flag, or gate is touched.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ──> Phase 2 (Card + Checker) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract field + gate | None | Card + Checker |
| Card section + checker | Contract | Verify |
| Verify | Card + Checker | None |

**Cross-phase shared-file sequencing (must read before editing):**
- The contract (`context_loading_contract.md`) is a shared target with the sibling INTERACTION STATE MATRIX lane and the sibling ACCESSIBILITY COVERAGE lane. The proof card (`proof_of_application_card.md`) is a shared target with the INTERACTION STATE MATRIX lane. None of those siblings has landed yet (no matching section on disk). Edit **append-only**: add the new field block at the end of Required Proof Fields, add the gate row at the end of the HARD GATES table, and append the card section after the last existing section. If a sibling lands first, re-read both files and append after whatever exists — distinct headings make the merge clean with no overwrite.
- **Honest scope flag:** this lane does NOT touch `command-metadata.json`, `design-command-surface-check.mjs`, or `score-skill-benchmark.cjs`. The command-surface drift and hub-route scorer contracts (shared by the command-projection, scorer-cap, and surface-check siblings) are outside this lane's blast radius. No sequencing dependency exists between this lane and those three files.
- `proof_check.py` already carries two landed conditional validators (source-proof, application-witness). This lane appends a third in the same style; it must not alter the two existing validators or their flags.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract field + gate | Low | 30-45 minutes |
| Card section + checker validator | Medium | 1.5-2.5 hours |
| Verification (fixtures + regression + hygiene) | Low-Medium | 1-1.5 hours |
| **Total** | | **3-4.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Captured the current line counts and section list of all three target files before editing — append points fixed after R4's interaction-state-matrix lane
- [x] Confirmed no sibling section already present (append-after baseline known) — rationale lane appended after the existing audit-evidence / state-matrix content
- [x] Feature flag configured (N/A — the lane is gated by the opt-in `--require-decision-rationale` flag, not a runtime toggle)

### Rollback Procedure
1. **Checker**: remove the `--require-decision-rationale` branch, the validator, the row finder, and the heading regex; the two existing validators and their flags are untouched
2. **Card**: delete the appended DECISION RATIONALE section
3. **Contract**: delete the appended field block and the single gate row
4. **Verify**: re-run `proof_check.py` plain, `--require-source-proof`, and `--require-application-witness` to confirm prior behaviour restored
5. **Notify**: flag the revert in the build phase parent so the sibling lanes know the contract/card baseline is back to prior state

### Data Reversal
- **Has data migrations?** No — documentation and a checker only; no stored data, no schema.
- **Reversal procedure**: append-only edits revert cleanly by deleting the added blocks.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
