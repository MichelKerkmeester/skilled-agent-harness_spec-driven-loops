---
title: "Implementation Plan: Observation/Problem/Fix finding triad"
description: "Additive plan to add a neutral OBSERVATION slot ahead of PROBLEM and FIX in the audit finding schema and the report skeletons, plus an opt-in proof_check.py --require-observation-triad gate that bites on a missing or placeholder slot, with the relabel mapping Impact→Problem and Recommended-fix→Fix and Evidence/Category/Owner preserved."
trigger_phrases:
  - "observation problem fix triad plan"
  - "audit finding triad implementation plan"
  - "observation slot audit schema"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/009-observation-problem-fix-triad"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan Definition of Done complete after the verified observation-triad build"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/audit_contract.md"
      - ".opencode/skills/sk-design/design-audit/assets/audit_report_template.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Observation/Problem/Fix finding triad

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (audit schema + report template) + Python 3 (stdlib only) checker |
| **Surface** | `sk-design` design-audit references + assets; the shared `proof_check.py` checker |
| **Storage** | Flat files in the skill tree (no database, no build step) |
| **Testing** | `proof_check.py --require-observation-triad` validator-in-isolation assertion (complete triad → ok, missing-Observation → fail naming the slot, no-finding → fail) + no-regression on the existing default / decision-rationale / source-proof / application-witness gates + `py_compile` |

### Overview
The audit finding schema used to jump straight to the diagnosis and the fix, which conflated seeing with judging. This work adds a neutral OBSERVATION slot ahead of the problem and fix so each critique records what was seen before judging it, then makes the triad enforceable with an opt-in checker flag. The change is additive at the information level: the schema relabels `Impact` → `Problem` and `Recommended fix` → `Fix` and adds the leading `Observation`, while `Evidence`, `Category`, and `Owner` survive verbatim; legacy reports without the triad still pass the default gate; and the new gate only bites when the flag is passed. The enforcement is honestly split — slot presence and non-placeholder are code-enforced once the flag is asserted, while whether the Observation is genuinely neutral and whether the critique is correct stay advisory.

Three real targets, all edited (no new files):
- `.opencode/skills/sk-design/design-audit/references/audit_contract.md` — §3 Findings Schema gains the OBSERVATION → PROBLEM → FIX slots and the neutrality note; Evidence/Category/Owner and the D6-R6 a11y coverage line preserved.
- `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md` — the four §3 finding skeletons (P0/P1/P2/P3) gain the same slots in the same order.
- `.opencode/skills/sk-design/shared/scripts/proof_check.py` — gains the opt-in `--require-observation-triad` flag plus a validator that asserts all three slots per finding block.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Triad shape fixed: OBSERVATION (neutral, factual) → PROBLEM (how a real user fails) → FIX (the change, not the implementation)
- [x] Slot-label mapping decided and recorded: relabel `Impact` → `Problem`, `Recommended fix` → `Fix`, add leading `Observation`; keep `Evidence`, `Category`, `Owner`
- [x] Shared-file sequencing confirmed: the D6-R6 a11y-coverage-matrix phase landed first on `audit_contract.md`; the R5 decision-rationale phase landed first on `proof_check.py`
- [x] Acceptance bite defined: a complete-triad finding passes, a finding missing OBSERVATION fails and names the slot

### Definition of Done
- [x] Schema, template skeletons, and checker slot labels agree exactly — `Observation` / `Problem` / `Fix` in all three homes
- [x] `--require-observation-triad` passes a complete triad and fails a missing/placeholder slot — complete → `ok:True`, missing-Observation → `ok:False` naming the slot, no-finding → fail
- [x] Existing gates (default, `--require-decision-rationale`, `--require-source-proof`, `--require-application-witness`) unchanged; `py_compile` clean
- [x] D6-R6 7-layer accessibility coverage matrix preserved; Evidence/Category/Owner kept; relabel drops nothing
- [x] No spec IDs, finding IDs, phase numbers, or spec-folder paths in any edited skill file (evergreen); only the three named files modified

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive proof-field extension. The checker flag follows the established `--require-source-proof` / `--require-application-witness` / `--require-decision-rationale` pattern already in `proof_check.py`: a CLI flag, a heading/block-anchored parser, a validator returning `{rows, items, missing, ok}`, and wiring into `check()` and `main()`. No existing gate is altered. The triad differs from the prior lanes in one respect: it parses per-finding bullet slots (anchored on the `### P*` finding heading) rather than a `| Field | Value |` table, so it adds two slot helpers alongside the block finder.

### Key Components
- **Findings schema (contract):** the canonical shape every audit finding follows. Gains a neutral `Observation` slot before the diagnosis; `Impact` is relabeled `Problem` and `Recommended fix` is relabeled `Fix`, while `Evidence`, `Category`, and `Owner` are kept and the §3 a11y coverage line is preserved.
- **Finding skeletons (report template):** the four fill-in blocks (P0/P1/P2/P3) operators copy. Each gains the same three slots in the same order so a filled report carries the triad per finding.
- **Triad validator + flag (checker):** `_find_observation_triad_blocks` (finding-heading-scoped block reader), `_validate_observation_triad` (presence + non-placeholder over `OBSERVATION_TRIAD_FIELDS`), the `_observation_triad_value` / `_is_observation_triad_placeholder` helpers, and an opt-in `--require-observation-triad` flag, failing closed on any missing slot.

### Data Flow
1. An audit produces findings, one `### P*` block per issue.
2. Each finding records OBSERVATION (neutral) before PROBLEM and FIX.
3. A filled report or notes file is run through `proof_check.py --require-observation-triad`.
4. The validator locates each finding block and checks for all three slots, non-placeholder.
5. Exit non-zero when any slot is missing or placeholder (naming it); exit zero when every finding carries the complete triad.
6. Without the flag, the default gate behaves exactly as before — legacy reports degrade gracefully.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the three targets and confirm the current schema, skeletons, and the `--require-*` flag pattern — the application-witness / decision-rationale validators are the clone template
- [x] Decide the slot-label mapping: relabel `Impact` → `Problem`, `Recommended fix` → `Fix`, add leading `Observation` (three literal, greppable slots; keep Evidence/Category/Owner). Recorded in spec §3 and the checklist
- [x] Confirm the checker runs on filled reports/findings (anchored on `### P*` headings), not on prose

### Phase 2: Core Implementation
- [x] Edit the §3 findings schema so each finding carries Observation → Evidence → Category → Problem → Fix → Owner; add the one-line neutrality note — Observation note at `audit_contract.md` line 92, example slots at lines 96-102
- [x] Edit the four §3 finding skeletons (P0/P1/P2/P3) to add the same slots in the same order, placeholders fill-in — `audit_report_template.md` P0 at lines 57-63, P1 69-75, P2 81-87, P3 93-99
- [x] Add `_validate_observation_triad`, `_find_observation_triad_blocks`, and the `_observation_triad_value` / `_is_observation_triad_placeholder` helpers; wire `--require-observation-triad` into `check()` and `main()` — validator `proof_check.py` line 420, block finder line 247, helpers 227/240, flag wired 468/484-486/513/532/549-551
- [x] Author the triad slot matchers to match the schema/template labels exactly (case-insensitive, bullet/bold tolerant) — `OBSERVATION_TRIAD_FIELDS = ("Observation", "Problem", "Fix")` line 62

### Phase 3: Verification
- [x] Run the checker on a complete-triad finding → passes — `_validate_observation_triad` returns `{missing:[], ok:True}` (tested in isolation from the base gate)
- [x] Run the checker on a finding missing OBSERVATION → fails naming the slot — `{missing:['P0 - ...: Observation missing'], ok:False}`
- [x] Re-run the existing gates (default, `--require-decision-rationale`, `--require-source-proof`, `--require-application-witness`) → unchanged; `py_compile` clean
- [x] Grep every edited skill file for spec IDs / finding IDs / phase numbers / spec-folder paths → none (orchestrator evergreen scan clean)
- [x] Confirm Evidence/Category/Owner and the D6-R6 7-layer a11y matrix survive; the relabel drops nothing

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Positive gate | Complete OBSERVATION/PROBLEM/FIX finding passes | `_validate_observation_triad` (isolated) → `ok:True` |
| Negative gate | Finding missing OBSERVATION fails and names the slot | `_validate_observation_triad` (isolated) → `ok:False` |
| Negative gate | Report with no finding block fails | `_validate_observation_triad` → `observation-triad findings missing` |
| No-regression | Default, decision-rationale, source-proof, application-witness gates unchanged; compile clean | `proof_check.py` existing flags + `python3 -m py_compile` |
| Sync | Schema labels = template labels = checker `OBSERVATION_TRIAD_FIELDS` | Manual grep across the three targets |
| Preserve | Evidence/Category/Owner + D6-R6 a11y matrix intact | `rg` over `audit_contract.md` |
| Evergreen | No IDs/paths in edited skill files | `rg` over the three targets |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python 3 (stdlib) | External | Green | Checker cannot run |
| `proof_check.py` source-proof / witness / rationale validators | Internal | Green | Clone template for the new validator and flag wiring |
| `audit_contract.md` (shared with the D6-R6 a11y-matrix phase) | Internal | Green | The a11y phase landed first; this phase edits §3 only and preserves the matrix |
| `proof_check.py` (shared with the R5 decision-rationale phase) | Internal | Green | The rationale flag landed first; this is the second extension, appended without altering the first |
| `audit_report_template.md` | Internal | Green | Sole owner within the corpus-ports set |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The triad gate produces false positives on filled reports, or a shared-file edit collides with a sibling phase.
- **Procedure**: Revert the three edits independently. The flag is opt-in, so reverting the checker restores prior behavior with no caller impact; reverting the schema edit restores the prior Impact/Recommended-fix labels; reverting the template edit restores the prior skeletons. Every change is additive at the information level, so the revert restores the prior schema, skeletons, and checker exactly.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core) ──> Phase 3 (Verify)
                         │
              shared-file sequencing:
              audit_contract.md  ↔ D6-R6 a11y-coverage-matrix phase (landed first)
              proof_check.py     ↔ R5 decision-rationale phase (landed first)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup, shared-file sequencing | Verify |
| Verify | Core | None |

**Cross-phase shared-file sequencing (read before editing):**
- `audit_contract.md` is shared with the D6-R6 accessibility-coverage-matrix phase, which landed first. This phase edits the §3 Findings Schema only — relabel two slots, add the Observation slot and note — and leaves the 7-layer a11y coverage matrix (the `- layer:` rows and the layer-states vocabulary) untouched.
- `proof_check.py` already carries the source-proof, application-witness, and R5 decision-rationale validators. This phase appends the observation-triad validator and flag as the second corpus-port extension; it must not alter the three existing validators or their flags.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (read + decide mapping) | Low | 30 minutes |
| Schema relabel + template edits | Low | 45 minutes |
| Checker flag + validator + helpers | Medium | 1-1.5 hours |
| Verification (positive/negative/no-regression/preserve) | Low | 45 minutes |
| **Total** | | **3-3.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed the D6-R6 a11y-coverage-matrix phase landed before editing `audit_contract.md` §3
- [x] Confirmed the R5 decision-rationale phase's `proof_check.py` flag landed first and is the append point
- [x] Captured the current exit codes of the existing gates as the no-regression baseline (N/A runtime toggle — the triad is gated by the opt-in flag)

### Rollback Procedure
1. **Checker**: Revert the `proof_check.py` edit — the opt-in flag, validator, block finder, and helpers disappear; every existing gate is byte-identical.
2. **Template**: Revert the `audit_report_template.md` edit — the four skeletons return to their prior shape.
3. **Contract**: Revert the `audit_contract.md` §3 edit — the schema returns to its prior Impact/Recommended-fix labels with no Observation slot; the a11y matrix was never touched.
4. **Verify**: Re-run the existing gates and `py_compile` to confirm no residue.

### Data Reversal
- **Has data migrations?** No — flat-file doc and script edits only.
- **Reversal procedure**: Git revert of the three edits; no state to unwind.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
