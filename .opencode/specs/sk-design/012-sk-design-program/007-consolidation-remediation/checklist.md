---
title: "Checklist: sk-design consolidation remediation"
description: "Verification checklist for the nine shipped fixes, with evidence cited per item. Two gates deferred, documented as pending rather than checked."
trigger_phrases:
  - "sk-design consolidation remediation checklist"
  - "post-consolidation fixes checklist"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/007-consolidation-remediation"
    last_updated_at: "2026-07-27T08:07:00.762Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored L2 verification checklist with gate evidence"
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
# Checklist: sk-design consolidation remediation

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` REQ-001 through REQ-006
- [x] CHK-002 [P0] Every finding re-verified against the live tree before any edit
  - **Evidence**: `spec.md` §2 — fresh-context Opus pass re-severed two findings and surfaced two defects neither automated pass caught
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No fix added a mode, command, schema, alias, adapter, or template (REQ-006)
  - **Evidence**: all nine fixes are deletions, corrections, or a guard on an existing write path — see `plan.md` §3
- [x] CHK-011 [P0] `grounding-receipt.mjs`'s `PAIRED_MODES` matches `mode-registry.json`'s live `packetKind:"workflow"` set exactly
  - **Evidence**: `['design-interface','design-motion','design-md-generator']`, verified by the Open Design transport suite
- [x] CHK-012 [P1] Paired severity deletion left no contract demanding data no surviving mode produces
  - **Evidence**: `sk-code-handoff.md` Audit Backlog Handoff Card and `creation-contract.md` audit deterministic-minimum row deleted together
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `procedure-card-schema-check.mjs` passes
  - **Evidence**: fail (3 cards) → pass (12/12, 0 failures)
- [x] CHK-021 [P0] `interface-command-contract.test.mjs` passes
  - **Evidence**: 8/8 pass, unchanged from before
- [x] CHK-022 [P0] `design-command-surface-check.test.mjs` and `.mjs` pass
  - **Evidence**: 7/7 pass; `invalid=0 drift=0`
- [x] CHK-023 [P0] `parent-skill-check.cjs` clean
  - **Evidence**: OK, 0 warnings
- [x] CHK-024 [P0] Open Design transport suite passes
  - **Evidence**: 37/37 pass
- [x] CHK-025 [P0] md-generator backend suite passes, including the two new negative tests
  - **Evidence**: 173/173 pass, build clean
- [x] CHK-026 [P0] Full sk-design suite set passes
  - **Evidence**: 260/260 passing, 0 failing
- [x] CHK-027 [P1] `styles build --check` executes and matches the documented record count
  - **Evidence**: previously MODULE_NOT_FOUND; now `ok:true`, `recordCount:1290`, empty diff
- [ ] CHK-028 [P2] Design benchmark suite re-run
  - **Evidence**: Not run — route gold still encodes the retired six-mode topology and would fail for the wrong reason until regenerated. Deferred, not silently dropped.
- [ ] CHK-029 [P2] Styles SHA-256 equality check against `006/scratch/styles.sha256.before`
  - **Evidence**: Not run. Deferred, not silently dropped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Fix 1 — advisor score overclaim removed
  - **Evidence**: `description.json`, `graph-metadata.json:123-124`, `SKILL.md:11` keyword/trigger/comment deleted; audit/accessibility/performance-audit and the anti-slop example kept
- [x] CHK-FIX-002 [P0] Fix 2 — thirteen styles paths corrected by three-way mapping
  - **Evidence**: `SKILL.md:207,208,218,255`, `README.md:72`, `manual-testing-playbook.md:284,285`, two `styles-library-utilization/*.md`; proven live by CHK-027
- [x] CHK-FIX-003 [P1] Fix 3 — styles README shrunk, two broken refs fixed
  - **Evidence**: `styles/README.md` 165,030 B / 1,314 lines → 1,928 B / 26 lines; `styles/README.md:8` references corrected
- [x] CHK-FIX-004 [P0] Fix 4 — retired vocabulary removed from 15 live contract files
  - **Evidence**: includes the three foundations procedure cards' `Owning subworkflow` → `Owning mode | design-interface` rename; proven by CHK-020–CHK-023
- [x] CHK-FIX-005 [P0] Fix 5 — paired severity deletion
  - **Evidence**: `sk-code-handoff.md` Audit Backlog Handoff Card and `creation-contract.md` audit deterministic-minimum row deleted in the same change; see CHK-012
- [x] CHK-FIX-006 [P0] Fix 6 — `PAIRED_MODES` corrected
  - **Evidence**: see CHK-011
- [x] CHK-FIX-007 [P1] Fix 7 — four unsupported proof claims deleted
  - **Evidence**: `commands/interface/design.md:24`, `motion.md:24`, two presentation assets
- [x] CHK-FIX-008 [P1] Fix 8 — duplicate lane enum deleted, not synchronised
  - **Evidence**: `interface-design-auto.yaml:157` `build` lane removed; command's `handoff` lane is now the only lane
- [x] CHK-FIX-009 [P0] Fix 9 — `--design-md` guarded
  - **Evidence**: `guided-run.ts:170` resolves through `resolveOutputPath()`, fails closed via a `design-md-path` preflight check; two new negative tests, one proving a file outside the allowlist is byte-identical after a blocked run
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced
  - **Evidence**: manual diff review of all nine fixes confirms contract/prose/code edits only, no new credential or secret surface
- [x] CHK-031 [P1] `--design-md` write path cannot escape the resolved-output boundary
  - **Evidence**: `guided-run.ts` negative test proving a file outside the allowlist is byte-identical after a blocked run (Fix 9)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the final shipped state
  - **Evidence**: this document set, authored against `spec.md`
- [x] CHK-041 [P1] `implementation-summary.md` records the final disposition and full gate table
  - **Evidence**: `implementation-summary.md` §Verification
- [x] CHK-042 [P1] Sibling `006` packet reconciled for its two contradictory lines
  - **Evidence**: `006/spec.md:157` NFR-S01 marked superseded; `006/checklist.md:3` frontmatter corrected
- [ ] CHK-043 [P2] AI-tell fixture restoration decision recorded but not actioned
  - **Evidence**: open question in `spec.md` §7 — capability decision, not a defect, left for the operator
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only files named in `spec.md`'s Files to Change table were touched
  - **Evidence**: nine fixes map one-to-one to the six file groups in `spec.md` §3
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 10 | 10/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-07-27
**Verified By**: Claude (orchestrator) — full gate re-run per `plan.md` §2; two items (CHK-028, CHK-029) intentionally deferred, not dropped
<!-- /ANCHOR:summary -->
