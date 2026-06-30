---
title: "Implementation Plan: D6-R10 READABILITY/DENSITY + LOCALE STRESS proof"
description: "Additive plan to add measured readability/density and locale-stress conditional proof fields plus a static physical-property RTL lint rule to the sk-design context loading contract."
trigger_phrases:
  - "d6-r10 plan"
  - "readability density locale proof plan"
  - "rtl lint contract plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/010-readability-density-locale-proof"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete with as-built evidence for the readability/locale contract additions"
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
# Implementation Plan: D6-R10 READABILITY/DENSITY + LOCALE STRESS proof

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown contract (sk-design shared vocabulary) |
| **Target** | `.opencode/skills/sk-design/shared/context_loading_contract.md` (single named file) |
| **Edit class** | ADDITIVE — append-only; preserve every existing field, gate, and anchor |
| **Enforcement** | Hybrid — field presence convention-enforced; measured-value quality advisory; RTL lint deterministic-when-run |
| **Verification** | Manual rubric + a deterministic `rg` lint rule on changed CSS; no strict-validate at plan stage |

### Overview
This phase ports two measured field *shapes* from the designer-skills-main corpus into the design context loading contract, plus one static lint. Content-heavy UI work gains a `READABILITY AND DENSITY PROOF` field (chars-per-line / measure, max-width in `ch`, line-height, decision count); global UI work gains a `LOCALE STRESS PROOF` field (text-expansion locale proxy, RTL logical-property usage, mirrored directional icons). The enforceable half is a documented static lint that flags physical `margin-left` / `padding-left` in changed CSS in favour of logical properties. The contract today carries readability and i18n only as prose scattered across audit references; porting the measured shape makes the claims fillable and checkable, with the RTL lint deterministic. All work is append-only to one file — no existing field, gate, calculator, or anchor is altered.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target file and exact insertion regions (§4 REQUIRED PROOF FIELDS, §5 HARD GATES) confirmed against the latest on-disk contract — §4 fields at lines 216/241, §5 gate+lint at 279/283
- [x] Sibling-phase write status on the same file (004 / 005 / 006) checked so the §4 append does not collide — R4/R5/R6 landed; R10 appended last in the lane
- [x] Measured shapes drafted evergreen (no phase IDs, spec paths, or "ported from" provenance in contract content) — evergreen scan clean across the additions
- [x] Honest enforcement split agreed: presence-enforceable fields vs advisory quality vs deterministic-when-run lint — recorded in spec §6/§7 and implementation-summary

### Definition of Done
- [x] Both conditional fields present under §4 with the exact `text` block shape and clear trigger conditions — Readability And Density (216), Locale Stress (241)
- [x] Static RTL lint rule documented in §5 with an exact deterministic command and a logical-property exemption — `rg --pcre2` rule at lines 283-289
- [x] Lint bites: a physical `margin-left`/`padding-left` sample is flagged; a logical-property sample passes — verified on a CSS sample (physical flagged, logical clean)
- [x] No existing field, gate, calculator reference, or anchor changed (additive verified) — `git diff --numstat` reports `+57 / -0`
- [x] Evergreen scan clean; no-regression on existing `proof_check.py` / `contrast_check.py` references — both references untouched and still resolve

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive contract extension — new conditional proof fields follow the existing §4 subsection convention (a `###` heading + a fenced `text` field block, exactly like Register And Dials / Contrast Pairs / Interface Preflight / Audit Evidence). The lint follows the §5 "Deterministic enforcement" convention (a named, runnable check stated inline).

### Key Components
- **READABILITY AND DENSITY PROOF field (§4)** — conditional on content-heavy UI (articles, docs, dashboards, long-form). Rows: measure (chars-per-line, target 45-75, ~66 ideal), max-width (`ch` unit, e.g. `max-width: 65ch`), line-height (scaled to measure), decision count. Display type and short UI strings are exempt.
- **LOCALE STRESS PROOF field (§4)** — conditional on global / localized UI. Rows: text-expansion proxy (validate at ~130% length, German/Finnish worst case), RTL logical-property usage (`margin-inline-start` not `margin-left`; `text-align: start` not `left`), mirrored directional icons (arrows/chevrons mirror; logos/clocks/media-play do not).
- **Static RTL lint (§5 deterministic enforcement)** — flags physical `margin-left` / `padding-left` in changed CSS; a hit fails unless a logical-property note is recorded. This is the enforceable half; the measured rows above stay advisory in quality.

### Data Flow
1. A content-heavy or global prompt triggers the matching conditional field(s).
2. Author fills the measured rows / locale rows in the proof card or notes.
3. Before a ready claim on a global surface, run the documented RTL lint over changed CSS.
4. A physical-property hit is a deterministic fail unless a logical-property exemption note is present.
5. Measured-value adequacy (is 65ch right *here*?) remains a human/advisory call — presence is checkable, taste is not.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Re-read the latest `context_loading_contract.md`; confirm §4 and §5 anchors/structure unchanged — §4 REQUIRED PROOF FIELDS + §5 HARD GATES intact before editing
- [x] Check whether sibling phases 004 / 005 / 006 have already appended to §4 of the same file; rebase on the latest before editing — R4/R5/R6 landed; rebased; R10 appended last
- [x] Draft both field shapes and the lint rule text, evergreen (no IDs, no spec paths, no provenance) — drafted from the readable-measure / localization-design corpus shapes

### Phase 2: Additive Contract Edits
- [x] Append `### Readability And Density` subsection under §4 with its `text` field block + trigger note — landed at line 216 (content-heavy trigger; display/short-UI exempt)
- [x] Append `### Locale Stress` subsection under §4 with its `text` field block + trigger note — landed at line 241 (global/localized trigger)
- [x] Document the static RTL lint in §5 (deterministic command + logical-property exemption); optionally add a HARD GATES row for the locale/RTL gate — `rg` rule at 283-289 + "Locale Stress / RTL" gate row at 279
- [x] Preserve every existing field, gate row, calculator reference, and anchor verbatim — `git diff --numstat` reports `+57 / -0` (0 removed)

### Phase 3: Verification
- [x] Confirm trigger semantics read cleanly (content-heavy → readability/density; global → locale stress) — both fields state their trigger and a `COMPLETE | GAPS | N/A` verdict
- [x] Run the RTL lint on a physical-property sample (must flag) and a logical-property sample (must pass) — physical (`margin-left`/`text-align: left`) flagged; logical (`margin-inline-start`/`text-align: start`) clean
- [x] Evergreen scan: no phase IDs, spec paths, or provenance strings in the additions — scan clean
- [x] No-regression: existing fields intact; `proof_check.py` / `contrast_check.py` references untouched and still valid — both references resolve; R4/R5/R6 lanes preserved

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic | RTL lint flags physical `margin-left`/`padding-left`; logical properties pass | `rg` on a CSS sample |
| Structural | Both §4 subsections present with the exact field shape; anchors intact | Read + grep |
| Evergreen | No IDs, spec paths, or provenance embedded in contract content | grep scan |
| No-regression | Existing fields/gates/calculator references unchanged | diff review + existing checkers still parse |
| Advisory | Measured-value adequacy (is the chosen measure/line-height right) | human review — not automatable |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context_loading_contract.md` §4/§5 anchors stable | Internal | Shared | Edit collision with siblings on §4 |
| Sibling phases 004 / 005 / 006 (same file, §4) | Internal | Sequencing | Must serialize §4 appends; rebase before editing |
| readable-measure / localization-design corpus | External evidence | Green | Source for the measured shapes (read-only) |
| `rg` / ripgrep | External | Green | Lint runtime; plain `grep` is a fallback |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The append collides with a sibling edit, or the lint/fields are judged out of scope.
- **Procedure**: Revert the two §4 subsections and the §5 lint paragraph; the contract returns to its prior state. Single-file change — no other file is touched.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Prep / rebase) ──> Phase 2 (Additive edits) ──> Phase 3 (Verify)

Shared-file lane (context_loading_contract.md §4):
  004 ─┐
  005 ─┼─ serialize §4 appends ─> 010 (this)
  006 ─┘   (006 modifies AUDIT EVIDENCE in place — highest collision risk)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Prep | Latest contract state; sibling write status | Edits |
| Edits | Prep | Verify |
| Verify | Edits | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Prep / rebase check | Low | 20 minutes |
| Additive edits (2 fields + lint) | Low | 45 minutes |
| Verification (lint bite + evergreen + no-regression) | Low | 30 minutes |
| **Total** | | **~1.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Latest contract pulled; sibling §4 edits reconciled before writing — R4/R5/R6 reconciled; R10 appended last
- [x] Additions scoped to §4 and §5 only (no reflow of unrelated sections) — diff confined to §4 fields + §5 gate/lint; `+57 / -0`

### Rollback Procedure
1. **Immediate**: Remove the two §4 subsections and the §5 lint paragraph from `context_loading_contract.md`
2. **Revert code**: `git checkout -- .opencode/skills/sk-design/shared/context_loading_contract.md`
3. **Verify**: Existing `proof_check.py` / `contrast_check.py` references still resolve; no other file changed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — single-file documentation change

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
SHARED-FILE SEQUENCING FLAG (Group B):
  Phases 004, 005, 006, and 010 all append to context_loading_contract.md §4.
  - 004 → §4 INTERACTION STATE MATRIX field (+ proof card + interface preflight card)
  - 005 → §4 DECISION RATIONALE field (+ proof card + proof_check.py)
  - 006 → §4 AUDIT EVIDENCE subsection, replacing the single a11y field IN PLACE (highest collision risk)
  - 010 → §4 two new fields + §5 RTL lint (this phase)
  Not parallel-safe at the file level. Serialize: rebase on latest, append a DISTINCT anchored
  subsection, do not reflow §4. If 006 lands first it reshapes AUDIT EVIDENCE — re-read before appending.

CODE-ENFORCED vs ADVISORY (honest):
  - Measured readability/density + locale-stress rows → HYBRID. Presence is convention-enforced
    (a content-heavy/global prompt must fill them); measured-value QUALITY is advisory — no script grades it.
  - RTL lint → enforceable half, but spec names ONLY the contract file. Unlike sibling 005 (which names
    proof_check.py), this phase authorizes NO new or extended script. The lint ships as a DOCUMENTED
    deterministic rule (an exact `rg` command) that bites WHEN RUN — it is "deterministic-when-run," not
    an always-on wired gate like contrast_check.py / proof_check.py.
  - FORK for the operator: if an always-on wired lint is wanted (e.g. new shared/scripts/rtl_lint.py, or
    proof_check.py --require-rtl-logical), that EXPANDS the spec's single named target and needs an
    amendment decision. Recommendation: ship the documented deterministic rule now (faithful to scope);
    escalate the wired-script option separately rather than silently widening scope.
-->
