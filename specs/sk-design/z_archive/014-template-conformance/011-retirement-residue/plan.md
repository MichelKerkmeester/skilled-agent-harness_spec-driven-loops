---
title: "Implementation Plan: Close retirement residue + finish interrupted design-interface leaf docs"
description: "Two-track plan: fix five confirmed non-motion residue sites, and verify-then-reconcile 006-009's documentation against their real on-disk skill-file state."
trigger_phrases:
  - "retirement residue plan"
  - "audit foundations vocabulary cleanup plan"
  - "design-interface leaf docs finish plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/011-retirement-residue"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored two-track plan"
    next_safe_action: "Execute Track A (residue sites); gate Track B on 010 landing where design-motion is involved"
    blockers:
      - "Track B's design-motion-adjacent items wait on 010-motion-merge"
    key_files:
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/006-scripts/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Close retirement residue + finish interrupted design-interface leaf docs
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill content, JSON fixtures/contracts, spec-kit docs |
| **Framework** | sk-design hub residue + system-spec-kit leaf-packet continuity |
| **Storage** | Git-tracked files only |
| **Testing** | `rg` sweep per site; per-leaf requirement re-verification against `spec.md` |

### Overview
Two independent tracks. Track A fixes five confirmed vocabulary-residue sites outside `design-motion/`. Track B verifies `006-009`'s actual on-disk skill-file state against each leaf's own `spec.md` requirements, then reconciles `implementation-summary.md`/`checklist.md` to match — never rubber-stamping from the `005-corpus` pattern. Track A and Track B are independent of each other; both are independent of, but Track A's `design-motion`-adjacent notes must defer to, `010-motion-merge`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All five Track A residue sites are re-confirmed present with a fresh `rg` (concurrent work may have already fixed some).
- [ ] Each of `006-009`'s `spec.md` requirements is read in full before checking its on-disk state.

### Definition of Done
- [ ] All five Track A sites (outside `design-motion/`) are fixed.
- [ ] Each of `006-009` has a genuine, evidence-cited verification recorded, and its checklist reflects only what actually passed.
- [ ] `design-motion/`-internal residue is explicitly deferred to `010-motion-merge`, not touched here.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two independent verification-and-fix tracks sharing one packet because both are "residue from earlier retirement work," not because they share mechanism.

### Key Components
- **Track A (vocabulary residue)**: `design-md-generator/SKILL.md:246`, `canary-cases.v1.json`, `install-guides/README.md`, `command-contract.json:81`, `shared-base-not-workflow.md:34`.
- **Track B (doc reconciliation)**: per-leaf verify-then-document loop for `006-scripts`, `007-feature-catalog`, `008-manual-testing-playbook`, `009-changelog`.

### Data Flow
**Track A**: re-confirm each site with `rg` -> fix the vocabulary -> re-sweep to confirm clean.
**Track B**: for each of `006-009` — read its `spec.md` requirements -> inspect the actual on-disk `design-interface/{corpus,scripts,feature-catalog,manual-testing-playbook,changelog}/` state -> compare against requirements -> record a genuine verification note -> mark `checklist.md` items `[x]` only where the comparison actually passed -> rewrite `implementation-summary.md`'s What Was Built / Files Changed to match reality.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Track A — vocabulary residue
- [ ] Re-confirm and fix `design-md-generator/SKILL.md:246`.
- [ ] Re-confirm and fix `canary-cases.v1.json`'s `foundations`/`audit` cases.
- [ ] Re-confirm and fix `install-guides/README.md`'s sk-design row.
- [ ] Re-confirm and fix `command-contract.json:81`'s `invocation_aliases`.
- [ ] Re-confirm and fix `shared-base-not-workflow.md:34`'s mode-count claim.

### Phase 2: Track B — leaf verification (per leaf: 006, 007, 008, 009)
- [ ] Read the leaf's `spec.md` requirements in full.
- [ ] Inspect the actual on-disk skill-file state the leaf claims to have changed.
- [ ] Compare; record a genuine pass/fail note per requirement.
- [ ] Mark `checklist.md` items `[x]` only where the comparison passed, citing real evidence.
- [ ] Rewrite `implementation-summary.md`'s What Was Built / Files Changed / Status to match the verified reality.

### Phase 3: Verification
- [ ] `rg -n "foundations|audit"` across all five Track A sites (excluding `design-motion/` and legitimate history) returns nothing.
- [ ] Each of `006-009`'s `checklist.md` and `implementation-summary.md` agree with each other and with the real on-disk state.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/011-retirement-residue --strict` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Track A sites clean of retired vocabulary | `rg -n` |
| Manual comparison | Track B leaf requirements vs. actual on-disk state | Side-by-side read, no tool |
| Consistency check | Checklist and implementation-summary agree per leaf | Cross-read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `010-motion-merge` landing | Internal | Sibling, in progress | `design-motion/README.md`/`corpus-map.md` residue stays open until then; does not block Track A or Track B |
| `002-design-interface`'s own conformance work | Internal | Sibling, owned by another worker | Track B verifies against the leaf's existing `spec.md`, does not modify sibling scope beyond the four named leaves |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A Track B "verified complete" claim is later found to be inaccurate.
- **Procedure**: Revert the doc-reconciliation commit for that leaf; re-run the verify-then-document loop with the corrected finding.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Track A) ──┐
                     ├──> Phase 3 (Verify)
Phase 2 (Track B) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Track A | None | Verify |
| Track B | None (per-leaf independent) | Verify |
| Verify | Track A + Track B | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All five Track A sites re-confirmed present before editing (concurrent work may have already fixed some)
- [ ] Each Track B leaf's verification note cites real evidence, not the `005` pattern copy-pasted

### Rollback Procedure
1. **Immediate**: If a Track B checklist mark turns out unverified, revert that leaf's doc edit only — other leaves and Track A are unaffected.
2. **Revert code**: `git revert` the specific leaf's or site's commit.
3. **Verify**: Re-run the verify-then-document loop.

### Data Reversal
- **Has data migrations?** No — documentation and JSON fixture content only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Two independent tracks (vocabulary residue, leaf doc reconciliation)
- Track B never rubber-stamps; every checklist mark cites real evidence
-->
