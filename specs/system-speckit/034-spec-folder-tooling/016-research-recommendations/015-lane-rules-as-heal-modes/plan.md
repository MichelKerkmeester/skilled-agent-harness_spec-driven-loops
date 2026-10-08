---
title: "Implementation Plan: Phase 15: lane-rules-as-heal-modes"
description: "Automate five deterministic lane rules (anchor wrap, link repoint, continuity placeholders, level from spec, header add) as permanent heal modes in heal-spec-docs.cjs with derivability checks; integrate into upgrade-legacy repair sequence and prove idempotence through tests."
trigger_phrases:
  - "lane rules as heal modes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: lane-rules-as-heal-modes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`heal-spec-docs.cjs`) and ESM (`upgrade-legacy.mjs`) |
| **Framework** | system-spec-kit CLI runtime, fixture-based tests |
| **Storage** | Packet documents (spec.md, plan.md, implementation-summary.md, tasks.md) |
| **Testing** | Vitest with fixtures from phase 13 lane briefs |

### Overview
Five new modes plug into `heal-spec-docs.cjs` discovery and `upgrade-legacy.mjs` repair sequence. Each mode reads packet evidence (anchors, links, frontmatter, spec.md) and applies a deterministic transformation only when the rule's derivability check passes. Tests prove both the positive case (transformation applied) and the negative (refusal) with fixtures from phase 13.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 14 research named all five rules and their exact derivability criteria
- [x] Phase 13 lane briefs show the evidence used for each transformation
- [x] Dependencies identified (SH-01 anchor fix, SH-05 and SH-06 healer honesty)

### Definition of Done
- [ ] All five modes implemented with derivability checks
- [ ] Idempotence tests pass for each mode
- [ ] Per-folder validation after apply confirms no contradictions
- [ ] Docs updated: spec, plan, tasks, acceptance criteria, README
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Plugin modes in heal-spec-docs discovery. Each mode is independent, reads evidence from the packet, checks derivability, and applies or refuses deterministically.

### Key Components
- **Lane rule 2 (anchor-wrap)**: Matches section headings to the template's anchor ids and wraps anchors around the matching sections. Refuses when no template/heading match is derivable. Boundary: anchor numbering and un-nesting belong to sibling SH-11 (anchor-repair-mode).
- **Lane rule 4 (link-repoint)**: Updates `[text](old-link)` to `[text](new-link)` when old link is broken and one unique new target exists, or removes only the link syntax when zero matches (keep text, repoint-or-unlink). Refuses if multiple matches.
- **Lane rule 6 (continuity-placeholders)**: Detects scaffold placeholder in continuity fields (empty or template value), fills with fixed constants: `recent_action: "No continuity update was recorded"`, `next_safe_action: "None, the packet is archived"` (if in z_archive) or `"None recorded"` (else). Refuses if field contains an authored non-placeholder value.
- **Lane rule 8 (level-from-spec)**: Derives level from the packet's own docs per folder-structure.md section 3 (reads spec.md structure), sets `level:` in frontmatter. Refuses when spec.md is unreadable or does not match a known folder structure.
- **Lane rule 9 (header-add)**: Adds a missing template header when section anchors match a template signature exactly. Refuses when no exact anchor match exists or template match is not derivable.

### Data Flow
`upgrade-legacy.mjs` discovers failing packets -> for each failing packet, iterate heal modes in order -> each mode checks derivability, transforms if it passes, records refusal if it does not -> next mode runs -> validator checks the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `heal-spec-docs.cjs` discovery | Walks spec folders and documents | Add five new modes with their derivability checks | Each mode's test covers both transformation and refusal |
| `upgrade-legacy.mjs` repair sequence | Calls heal tools in order | Call new modes, record refusals in baseline | Baseline file grows; no contradictions across runs |
| Existing heal modes (phrases, frontmatter) | Apply template defaults | Unchanged | Regression test the existing modes |

Required inventories:
- Same-class producers: Five heal modes all read evidence from the packet and refuse if it is missing or ambiguous.
- Consumers of changed symbols: `upgrade-legacy.mjs` calls the modes, validator reads the baseline.
- Matrix axes: committed tree (no edits), dirty tree (edits allowed), archived packet (structure-only edits), phase packet (same rules as track packet), with and without exact evidence.
- Algorithm invariant: Each transformation reads evidence from the packet and is deterministic. Refusal never hides a failure; it always records the reason.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each mode's derivability check and transformation | Vitest with fixtures from phase 13 |
| Integration | Full upgrade-legacy sequence with all five modes | Vitest with a corpus of failing packets |
| Idempotence | Second run on a fixed packet changes nothing for each mode | Vitest: apply mode, re-validate same packet, assert zero changes |
| Regression | Existing heal modes and upgrade-legacy behavior | Vitest full suite |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 13 lane briefs and evidence | Internal | Complete | Phase 13's records show exactly what evidence each rule read; modes test derivability independent of prior runs |
| SH-05 (healer phrase seeding) | Internal | Context | Provides background; not a blocker since modes use only packet-local evidence |
| SH-06 (evidence-gated provenance) | Internal | Context | Provides background; not a blocker since modes test refusal cases independently |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A mode's derivability check is wrong and refuses a valid transformation, or applies a transformation when it should refuse.
- **Procedure**: `git revert` the code commit and rerun `upgrade-legacy --apply` on a clean tree. Per-folder validation catches any contradictions.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
heal-spec-docs.cjs (five new modes)
     |
     ├──► anchor-wrap (needs SH-01 fixed template)
     ├──► link-repoint (independent)
     ├──► continuity-placeholders (independent)
     ├──► level-from-spec (independent)
     └──► header-add (independent)
          |
          └──► upgrade-legacy.mjs (calls all five in sequence)
```

| Mode | Depends On | Blocks |
|------|------------|--------|
| anchor-wrap | SH-01 | Nothing else |
| link-repoint | Nothing | Nothing else |
| continuity-placeholders | Nothing | Nothing else |
| level-from-spec | Nothing | Nothing else |
| header-add | Nothing | Nothing else |
| All five | SH-05 and SH-06 | Corpus upgrade |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Mode | Complexity | Estimated Effort |
|------|------------|------------------|
| anchor-wrap | Med | 3-4 hours (anchor parsing, wrapping, test) |
| link-repoint | Med | 4-5 hours (link matching, uniqueness check, test) |
| continuity-placeholders | Low | 2-3 hours (read frontmatter, fill, test) |
| level-from-spec | Low | 2-3 hours (parse spec.md header, write, test) |
| header-add | Low | 2-3 hours (anchor signature match, add, test) |
| Integration and docs | Med | 3-4 hours (upgrade-legacy sequence, README, idempotence) |
| **Total** | | **16-22 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Phase 13 lane briefs document all five rules and their evidence
- [x] Phase 14 research verified the rules independently
- [ ] Derivability checks are validated on phase 13 fixtures

### Rollback Procedure
1. `git revert` the code commit
2. Delete any `upgrade-baseline.json` files written by the modes
3. Rerun `upgrade-legacy --apply` on a clean tree

### Data Reversal
- **Has data migrations?** No, only structure changes and baseline files.
- **Reversal procedure**: The revert restores the tools. Baseline files are created fresh on next run.
<!-- /ANCHOR:enhanced-rollback -->

---

