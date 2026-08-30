---
title: "Implementation Summary: Checklist Deprecation Closure"
description: "The acceptance-coverage advisory now reads evidence from the document it counts from. Four packets moved from zero coverage to full without a single criterion changing meaning."
trigger_phrases:
  - "ac coverage evidence source"
  - "checklist deprecation closure"
  - "traceability precedence fixed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the canonical evidence read, the source precedence and the rule's first unit suite"
    next_safe_action: "None; the review is complete and its findings are dispositioned"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh"
    session_dedup:
      fingerprint: "sha256:44f69435cb593a2d33a1b065dcdce6bfd063ac6e56695a3c26127fce7cf45d8d"
      session_id: "2026-08-29-033-004-checklist-deprecation-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-checklist-deprecation-closure |
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An advisory that measures the document it counts from. Phase 2 moved acceptance criteria into their own document and repointed the total at it, but left the evidence read scanning a separate traceability table. One ratio drawn from two documents can only under-report, and it did: every packet carrying a criteria document scored zero, and across the whole repository exactly one packet satisfied the rule.

### The canonical read

`_ac_analyze_canonical` reads the criteria table's own Verification column, binding columns by header name so an inserted column cannot shift the read. A row counts when its cell carries a `file:line` citation, or when its Status is `Waived` or `Superseded` — a retired criterion needs no citation because the decision record behind it is the evidence, and the closure gate already verifies that record exists. A cell with prose and no citation is named as malformed rather than silently dropped, because a dropped row would inflate the ratio it was meant to lower.

### The precedence the merge intended

`_ac_traceability_file` preferred a standalone `checklist.md` over the merged `tasks.md` — the inverse of what the tasks-and-checklist merge's own summary claims it shipped. 2,262 packets carry both files, so all of them were read from the pre-merge one. The order is now merged-first, pre-merge as fallback.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/rules/check-ac-coverage.sh` | Modified | Canonical evidence read, source precedence, lifecycle activation, remediation wording |
| `scripts/tests/check-ac-coverage.sh` | Created | The rule's first unit suite, 16 cases |
| `specs/.../042-*/00*/acceptance-criteria.md` | Modified | Citations backfilled into 20 Verification cells |
| `specs/.../042-*/00*/checklist.md` | Deleted | Four unfilled 26-item scaffolds of a deprecated document |
| `specs/.../033-*/002-*/implementation-summary.md` | Modified | Added the missing Status row |
| `specs/.../033-*/spec.md` | Modified | Phase map records phase 2 as shipped |
| `scripts/rules/check-description-shape.sh` | Modified | Compares the recorded level against the declared marker |
| `scripts/spec/repair-derived.cjs` | Modified | Corrects a disagreeing level, not only an absent one |
| `manual-testing-playbook/tooling-and-scripts/ac-coverage-single-source-ratio.md` | Create | M-013, the count-versus-evidence scenario |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The defect surfaced from an advisory line nobody had reason to read closely: `0/5 ACs have evidence` on a packet whose criteria all carried evidence. Reading the rule against the merge that deprecated the checklist document showed the count and the evidence read had been separated and never rejoined.

The pre-change reading was captured as the negative control before any edit, and the same reading proves the fix: four packets moved from `0/5` to `5/5` without a criterion changing meaning.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The evidence source follows the count.** The alternative — teaching the merged tasks document to carry a traceability table — would have restored the duplication that moving criteria into their own document existed to remove.

**A retired criterion is exempt from citation.** Requiring a `file:line` for a criterion that was deliberately dropped would push authors to invent evidence for work they chose not to do.

**The pre-merge document stays in the level contract.** It is listed as optional, and that listing is what lets 2,262 legacy packets keep validating. Removing it would be a migration, not a rule fix.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `scripts/tests/check-ac-coverage.sh` | 16/16, 13 of them asserting the reported ratio |
| Negative control after the fix | Prose-only verification still scores `0/2` |
| Live symptom | Four packet-042 phases: `0/5` → `5/5` |
| Legacy path unchanged | A pre-merge packet still resolves to `checklist.md` |
| `bash -n` | Clean |
| `validate.sh --strict` | Exit 0 on this packet |
| Regression baseline | Two drifted packets that fail today also failed with the rule change stashed - the new warn adds no failures |
| Level drift | 0 mismatched across both active trees after repair |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review -->
## Deep Review

A 4-iteration deep review ran against this packet after the first commit
(`cli-cursor`, `cursor-grok-4.6-xhigh`, forced depth, `stopReason:
maxIterationsReached`). Verdict CONDITIONAL: 0 P0, 3 P1, 7 P2. Every finding was
reproduced against the files before being acted on.

Two were real defects in this change and are fixed here:

| ID | Defect | Fix |
|----|--------|-----|
| F006 | The row count parsed `AC-ID` positionally while the evidence read bound it by header. A column inserted before `AC-ID` dropped the count to zero, which short-circuits the gate to "no criteria found" - the packet goes unmeasured rather than reporting a low ratio. The same split this packet exists to close, reopened in the other direction. | `_ac_count_canonical_rows` now delegates to the evidence parser, so one pass yields both halves of the ratio |
| F005 | `_ac_lifecycle_active` substring-matched `*"complete"*` against the whole rendered Status row, so a packet marked `Incomplete` activated the gate | Reads the Status cell and matches it whole, mirroring the closure rule |

Both were invisible to the original suite: its column-shift case inserted the
column after `AC-ID`, and it had no Incomplete fixture. Two cases were added.

Five were stale documents in this packet, all corrected: a plan and tasks
frontmatter still describing the goal-shape validator they were seeded from
(F001, F009), continuity claiming zero percent beside a Complete status (F003),
an unfilled parent phase-map row and handoff (F002), and unchecked completion
criteria under finished tasks (F007).

All three initially declined findings were subsequently fixed at their roots:

| ID | Finding | Root cause and fix |
|----|---------|--------------------|
| F004 | `description.json` level disagrees with the declared level marker | Two faults, not one. No rule checked the value, so nothing reported the drift; and because `repair-derived.cjs` only acts on packets the validator already flags, it could never engage. `DESCRIPTION_SHAPE` now compares the recorded level against the declared marker at `warn`, and the repairer corrects a disagreeing value instead of only filling an absent one. The 927 fleet-wide cases self-heal on their next `--apply` rather than needing a mass rewrite |
| F010 | Continuity fingerprints are the all-zero placeholder | The placeholder is a recognised sentinel the freshness rule skips on, so those packets were never actually checked. Real fingerprints computed with the shipped `buildContinuityFingerprint` for all 56 documents in both trees, each round-trip verified. `CONTINUITY_FRESHNESS` now evaluates the real check instead of short-circuiting at `zero_fingerprint` |
| F008 | No scenario pins count-versus-evidence | `manual-testing-playbook/tooling-and-scripts/ac-coverage-single-source-ratio.md` (M-013), with evidence captured from real runs, including the shifted-column control that reports `1/2` where a positional read reported a no-op |

The origin of F004's wrong value is `create.sh:734`, which scaffolds every phase
child at Level 1 regardless of the `--level` passed. That is left alone: the
whole child scaffold is Level 1 by design, so changing it is a scaffolding
decision this packet was not asked to make. The reconciliation above makes the
disagreement visible and repairable either way.

<!-- /ANCHOR:review -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **2,262 packets still carry a pre-merge `checklist.md`.** They validate today and the fallback still reads them. Retiring those files is a migration this packet deliberately did not start.
2. **A citation is checked for shape, not for truth.** `file:line` proves an author pointed somewhere, not that the line says what the row claims. Nothing here reads the target.
3. **The review lineage split its state log across two paths.** It wrote
   `deep-review-state.jsonl` both at the lineage root (15 events, all four
   iterations) and under a nested `review/` subdirectory (8 events, including
   `synthesis_started` and `run_completed`, which the root log lacks). Neither
   file alone is the complete record. The fan-out prompt tells the lineage to
   bind `artifact_dir` directly to the override and not to run the artifact-root
   resolver; it appears to have partly done both. Both files are kept because
   each holds events the other does not.
4. **Phase 2's own checklist keeps 36 unchecked boilerplate items.** They were never applicable to a validation-rule packet. Ticking them to close the packet is the failure this advisory exists to catch, so they were left as they are.
<!-- /ANCHOR:limitations -->

---
