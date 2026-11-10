---
title: "Implementation Plan: Phase 11: create-sh-parent-corruption-fix"
description: "Guard create.sh's parent description.json regeneration behind the append-mode flag, then dry-run-repair the one already-corrupted packet."
trigger_phrases:
  - "create.sh parent corruption fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/048-create-sh-parent-corruption-fix"
    last_updated_at: "2026-07-04T17:11:45.809Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from spec.md"
    next_safe_action: "Implement Phase 2 (writer guard)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-011-create-sh-corruption-20260702"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: create-sh-parent-corruption-fix

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`create.sh`) calling a compiled TypeScript generator (`generate-description.js`) |
| **Framework** | None - flat shell script plus Node CLI |
| **Storage** | `description.json` flat files at each spec-folder root |
| **Testing** | Existing shell/vitest fixtures for `create.sh` phase scaffolding |

### Overview
`create.sh`'s append-mode path (`APPEND_TO_EXISTING_PARENT=true`, set at `:1054-1055` when `--phase-parent <existing>` resolves to a real packet) already correctly skips re-creating the parent's own scaffold files (`:1145` guards that). It does NOT currently guard the parent `description.json` regeneration call at `:1310-1321`, which unconditionally re-derives and overwrites `description.json` for whatever `FEATURE_DIR` currently points at — the existing parent, in append mode. The fix adds the same `APPEND_TO_EXISTING_PARENT` guard already used elsewhere in the file to this one call site. The child-phase `description.json` generation (`:1351-1361`) is untouched — it targets `_child_path`, a different variable, and was confirmed correct.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from `review-report.md` T1 findings)
- [x] Success criteria measurable (SC-001 through SC-003)
- [x] Dependencies identified (none - isolated fix plus scoped data repair)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-004)
- [ ] Regression fixture passing, existing `create.sh` fixtures unaffected
- [ ] `001-speckit-memory` repair verified in both metadata roots
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single conditional guard at the existing corruption site, plus a standalone, run-once repair pass. No new abstraction layer.

### Key Components
- **`create.sh:1310-1321`**: the parent `description.json` regeneration call — the exact defect site.
- **`create.sh:1046-1062`**: sets `APPEND_TO_EXISTING_PARENT` and rebinds `FEATURE_DIR`; the guard variable already exists and is used at `:1086`, `:1145`, `:1214`, `:1266`, `:1462` for other append-mode branches — this fix follows that identical established pattern.
- **`generate-description.ts`/`generate-description.js`**: unmodified; the fix prevents the call, it does not change the generator itself.
- **Repair pass**: a one-off script (not a permanent codebase addition) that reads `001-speckit-memory/spec.md`, derives the correct `specFolder`/`parentChain`, and surgically patches `description.json` in both metadata roots after a reviewed dry-run diff.

### Data Flow
No change to data flow for new-parent creation or child-phase generation. Append-mode simply stops invoking the parent generator call at all; `FEATURE_DIR`'s parent `description.json` is left untouched by `create.sh` for that run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create.sh:1310-1321` | Regenerates parent `description.json` unconditionally after phase scaffolding | Guard behind `APPEND_TO_EXISTING_PARENT != true` | New regression fixture + existing fixtures green |
| `create.sh:1351-1361` (child metadata) | Generates each child phase's own `description.json` | Unchanged - already targets `_child_path` correctly | Existing fixtures unaffected |
| `is-phase-parent.ts` / `phase-classifier.ts` | Parent/child folder classification | Not modified; the repair classifier reuses this logic read-only | Existing tests unaffected |
| `001-speckit-memory/description.json` (both metadata roots) | Corrupted parent identity metadata | Repair: regenerate `specFolder`/`parentChain` from `spec.md` | Manual diff review pre/post; `memory_index_scan` re-run post-repair |
| Every OTHER `description.json` repo-wide | Passive data | Not touched - the 332 "related drift" records are a different signature, explicitly deferred by the review | No action; out of scope |

Required inventories:
- All call sites writing `description.json` from `create.sh`: `rg -n "generate-description" .opencode/skills/system-spec-kit/scripts/spec/create.sh` — confirmed exactly 2 call sites (parent at `:1315`, child at `:1355`); only the parent site is in scope.
- Confirm no other script path calls the parent-description generator in append mode: `rg -n "APPEND_TO_EXISTING_PARENT" .opencode/skills/system-spec-kit/scripts` before finalizing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline And Inventory
- [ ] Confirm the 2 `generate-description` call sites in `create.sh` and that only the parent one needs guarding
- [ ] Capture `001-speckit-memory/description.json`'s current (corrupted) content in both metadata roots as the pre-repair baseline

### Phase 2: Writer Guard
- [ ] Wrap `create.sh:1310-1321` in `if [[ "$APPEND_TO_EXISTING_PARENT" != true && -f "$_DESC_SCRIPT" ]]; then ... fi`
- [ ] Add an inline comment stating the invariant: append mode must never regenerate the existing parent's `description.json`

### Phase 3: Regression Fixture
- [ ] Add a fixture/test: copy an existing parent packet to a scratch location, run `create.sh --phase --phase-parent <copied-parent> ...`, assert the parent's `description.json` is byte-identical before/after and the new child's `description.json` is created correctly
- [ ] Run existing `create.sh` phase-scaffolding fixtures, confirm no regression for new-parent creation or child metadata generation

### Phase 4: Scoped Repair
- [ ] Write a read-only dry-run classifier reusing `isPhaseParent()`'s direct-child rule, confirm it identifies exactly the one known candidate (`001-speckit-memory`)
- [ ] Review the dry-run diff for the proposed repaired `description.json`
- [ ] Apply the repair to both metadata roots (`.opencode/specs/` and legacy `specs/`)
- [ ] Re-run `memory_index_scan` (or equivalent) to confirm the packet is now correctly indexed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | New append-mode fixture (parent byte-stability) | Matching the existing `create.sh` fixture convention |
| Regression | Existing `create.sh` new-parent + child-metadata fixtures | Same runner |
| Manual | Repair diff review + post-repair `description.json` correctness | Direct file read + `memory_index_scan` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | N/A | Isolated fix, no external dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: existing `create.sh` fixtures regress, or the repair pass writes incorrect `description.json` content
- **Procedure**: revert `create.sh` via targeted `git checkout` of the prior commit; the repair is a small surgical JSON edit, revertible via `git checkout -- <path>` on the two affected `description.json` files if the repair itself needs undoing
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
