---
title: "Implementation Summary: sk-design consolidation remediation"
description: "Nine verified fixes closing the deep-review and deep-research findings after the /interface:audit and /interface:foundations retirement; full sk-design gate set green."
trigger_phrases:
  - "sk-design consolidation remediation summary"
  - "post-consolidation fixes summary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/007-consolidation-remediation"
    last_updated_at: "2026-07-27T08:07:00.762Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored L2 completion record; full gate set green"
    next_safe_action: "Run the deferred styles checksum and a regenerated design benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/design-mcp-open-design/grounding-receipt.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-007-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, the only mechanism proving a detector fires?"
    answered_questions: []
---
# Implementation Summary: sk-design consolidation remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-consolidation-remediation |
| **Status** | Complete — nine fixes shipped, full gate set green |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Actual Effort** | Not tracked — documented after delivery |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed all nine findings a fresh-context Opus pass verified against the prior deep-review (CONDITIONAL, P0=0/P1=4/P2=3) and deep-research output for `006-design-mode-consolidation`. The most serious — the advisor still promising a `design-quality-score` after the scoring apparatus was deleted — was invisible to both automated passes; the Opus pass also re-severed two findings and showed the prescribed styles-path fix would have created four *new* broken paths.

Every fix is a deletion, correction, or guard on an existing path — none adds a mode, command, schema, alias, adapter, or template (REQ-006).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-design/description.json`, `graph-metadata.json` (:123-124), `SKILL.md` (:11) | Modified | Fix 1 — remove the `design-quality-score` keyword and trigger example |
| `SKILL.md` (:207,208,218,255), `README.md` (:72), `manual-testing-playbook.md` (:284,285), two `styles-library-utilization/*.md` | Modified | Fix 2 — correct 13 styles paths by three-way mapping |
| `styles/README.md` | Modified | Fix 3 — shrink from 165,030 B / 1,314 lines to 1,928 B / 26 lines; fix two broken refs at line 8 |
| 15 live contract files (incl. `shared/sk-code-handoff.md`, `creation-contract.md`, `procedure-card-schema.md`, `design-proof-token.md`, `anti-slop-principles.md`, `procedures/polish-gate-orchestration.md`, two `design-interface` references, three foundations procedure cards, two script READMEs, two feature-catalog files) | Modified | Fix 4 — remove retired `foundations`/`audit` vocabulary |
| `shared/sk-code-handoff.md`, `shared/creation-contract.md` | Modified | Fix 5 — paired severity deletion (counted within the Fix 4 file set) |
| `design-mcp-open-design/grounding-receipt.mjs` (:26-31) | Modified | Fix 6 — correct `PAIRED_MODES` to the live three-mode set |
| `commands/interface/design.md` (:24), `motion.md` (:24), two presentation assets | Modified | Fix 7 — delete four unsupported proof claims |
| `interface-design-auto.yaml` (:157) | Modified | Fix 8 — delete the duplicate `build` lane enum |
| `design-md-generator/backend/scripts/guided-run.ts` (:170) + two new test files | Modified/Created | Fix 9 — guard `--design-md` through `resolveOutputPath()`; add two negative tests |
| `006-design-mode-consolidation/spec.md` (:157), `checklist.md` (:3) | Modified | Sibling reconciliation (separate packet) — NFR-S01 superseded, frontmatter corrected |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix was applied directly against the live tree, then verified by re-running the specific gate its finding named before moving to the next — not batched and verified once at the end. After all nine landed, the full sk-design suite set (260 tests) and the styles build check ran clean. The original five-child worktree scaffold was abandoned mid-flight in favor of this direct approach once it became clear the scaffold was larger than the work it described.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Delete `design-quality-score` rather than reintroduce scoring | The preflight card is strictly binary (SHIP/FIX); reintroducing a score would need the retired rubric back |
| Three-way path mapping instead of a substitution | A blind substitution on the prescribed fix would have created four new broken paths (Opus pass finding) |
| Delete the Audit Backlog Handoff Card and the last severity row together | Prevents a contract from demanding data no surviving mode produces — accepted-lost, not accidentally-lost |
| Delete the duplicate `build` lane enum rather than synchronise it with `handoff` | Removes the drift trap instead of resetting it to drift again later |
| Route `--design-md` through the existing `resolveOutputPath()` contract | Reuses the same boundary `--output` already enforces instead of adding a second write-path policy |
| Collapse the five-child phase scaffold into this single leaf packet | The scaffold had grown larger than the work it described; the nine fixes were executed directly and verified per-gate instead |
| Reconcile `006`'s two contradictory lines in a separate spec-folder action | Keeps this packet's scope to the nine verified fixes; the reconciliation is recorded here as fix-adjacent, not folded in |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Before | After |
|---|---|---|
| `procedure-card-schema-check.mjs` | fail (3 cards) | pass (12/12, 0 failures) |
| `interface-command-contract.test.mjs` | 8 pass / 0 fail | 8 pass / 0 fail |
| `design-command-surface-check.test.mjs` | 7 pass / 0 fail | 7 pass / 0 fail |
| `design-command-surface-check.mjs` | `invalid=0 drift=0` | `invalid=0 drift=0` |
| `parent-skill-check.cjs` | OK, 0 warnings | OK, 0 warnings |
| Open Design transport tests | — | 37 pass / 0 fail |
| md-generator backend | — | 173 pass / 0 fail, build clean |
| All sk-design suites | — | 260 passing, 0 failing |
| `styles build --check` | MODULE_NOT_FOUND | `ok:true`, `recordCount:1290`, empty diff |

### Not Run

Recorded honestly as not run, not silently dropped:
- **Design benchmark suite** — its route gold still encodes the retired six-mode topology and would fail for the wrong reason until regenerated.
- **Styles SHA-256 equality check** against the frozen `006/scratch/styles.sha256.before` snapshot.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Design benchmark suite not re-run** — route gold still encodes the retired six-mode topology; would need regeneration before it can validate anything meaningful.
2. **Styles SHA-256 equality check not run** — the frozen `006/scratch/styles.sha256.before` snapshot was not diffed against the post-fix corpus.
3. **AI-tell fixture pairs remain deleted** — the eleven `clean.html`/`tell.html` pairs removed with the audit surface were the only mechanism proving a detector fires; several preflight card rows are now honour-system prose rather than fixture-backed. Restoring the fixtures without the rubric is a capability decision left open (`spec.md` §7), not a defect of this remediation.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| REQ-001 | Advisor promises no capability it can't deliver | Score/severity promise removed; audit/accessibility/performance-audit vocabulary kept | Pass |
| REQ-002 | Every documented styles command executes | `styles build --check`: `ok:true`, 1,290 records, empty diff | Pass |
| REQ-003 | No live contract names a retired mode as valid owner | `procedure-card-schema-check.mjs` 12/12 pass | Pass |
| REQ-004 | Severity-demanding handoff card and last severity vocabulary deleted together | Confirmed via Fix 5 | Pass |
| REQ-005 | `--design-md` resolves through the same output policy as `--output`, fails closed | `resolveOutputPath()` reuse + negative test proving a byte-identical file after a blocked run | Pass |
| REQ-006 | No fix adds a mode, command, schema, alias, adapter, or template | Every fix is a deletion, correction, or guard | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Five-child phase scaffold (`001`–`005`), each with its own worktree cycle | Collapsed into this single leaf packet; fixes executed directly against the live tree | The scaffold had grown larger than the work it described |
| Per-child plan/tasks/checklist for children `001`, `002`, `003`, `005` | Left as historical artifacts (several remain planning stubs); this packet's own four Level-2 documents are the record of what actually shipped | Documenting the collapse honestly rather than backfilling the abandoned per-child cycle |
<!-- /ANCHOR:deviations -->
