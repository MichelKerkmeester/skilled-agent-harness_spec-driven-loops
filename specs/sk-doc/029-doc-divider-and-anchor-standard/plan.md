---
title: "Implementation Plan: Reconcile the numbered-H2 divider and TOC/anchor conventions across the structured .md fleet"
description: "Three workstreams in dependency order: ratify one standard, teach the general validation path to enforce it (dividers required, TOC/nav-anchors forbidden, continuity anchors exempt), then normalize the fleet in bulk behind the now-enforcing gate."
trigger_phrases:
  - "divider anchor plan"
  - "validate_document enforcement plan"
  - "fleet normalization plan"
  - "doc standard reconciliation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/029-doc-divider-and-anchor-standard"
    last_updated_at: "2026-08-13T06:10:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored plan: standard -> tooling -> normalization"
    next_safe_action: "Confirm approach before editing validate_document.py"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/assets/template-rules.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-029-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconcile the numbered-H2 divider and TOC/anchor conventions across the structured .md fleet

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (validator), JSON (rules), Markdown (fleet) |
| **Framework** | sk-doc `validate_document.py` + `template-rules.json` |
| **Storage** | None (filesystem docs) |
| **Testing** | Existing sk-doc `scripts/tests/`, fixtures `007-valid-anchors` / `008-invalid-anchors` |

### Overview

Three workstreams run in dependency order. First ratify one standard so every authority agrees. Then teach the general validation path to enforce it: require `---` between numbered ALL-CAPS H2, forbid a TOC and `<!-- ANCHOR -->` nav on README/skill-doc types, and leave the functional continuity anchors untouched. Only then normalize the fleet in bulk, so the now-enforcing gate proves each fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see `spec.md`, `research.md`)
- [x] Success criteria measurable (census-script counts)
- [x] Operator decision recorded (bare numbered-H2)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Negative-control reproduced before fix, passing after
- [ ] `007-valid-anchors` fixtures still pass unchanged
- [ ] Census reports 0 divider gaps and 0 vestigial TOC/nav-anchors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single validator, two document contracts today (general path and opt-in code-folder path). The plan closes the gap by lifting the code-folder path's divider and no-TOC/no-anchor rules into the general path for applicable doc types, without disturbing the separate spec-kit continuity-anchor contract enforced by `validate.sh`.

### Key Components
- **`validate_document.py`**: the enforced gate. Add general-path divider check plus README/skill-doc TOC/nav-anchor prohibition.
- **`template-rules.json`**: per-doc-type flags the validator reads.
- **`hvr-rules.md` §9 + `core-standards.md`**: the written authorities to reconcile.
- **census script** (`scratch/`): quantifies drift and proves the end state.

### Data Flow

A doc is typed (README, reference, command, and so on), the matching rules are loaded, and the general path validates structure. The continuity-anchor contract stays in its own lane under `validate.sh` and the anchor fixtures.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet changes a shared validation policy, so the producer/consumer inventory matters.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate_document.py` general path | Validates README/reference/command/etc. | Update: add divider + TOC/anchor prohibition | Negative-control file fails; fixtures pass |
| `validate_document.py` code-folder path | Already enforces dividers + no TOC/anchor | Unchanged | Existing code-folder tests stay green |
| `validate.sh` + anchor-generator | Enforces functional continuity anchors | Unchanged (must not be caught by the new rule) | `007-valid-anchors` passes untouched |
| `template-rules.json` | Per-type flags | Update README/reference flags | Validator reads new flags |
| `hvr-rules.md` §9, `core-standards.md` | Written authorities | Reconcile wording | grep shows no contradiction |

Required inventories:
- Consumers of the validator: `rg -n "validate_document" .opencode --glob '*.sh' --glob '*.py' --glob '*.js'` to find every gate that would start failing.
- Anchor classes: `rg -ln "<!--\s*ANCHOR" .opencode/skills` split into continuity docs (keep) vs README/skill nav (strip).
- Invariant: the new rule fires only between numbered ALL-CAPS H2, is fence-aware, and treats HTML-comment lines as transparent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ratify the standard
- [ ] Record the decision in `decision-record.md` (bare numbered-H2)
- [ ] Reconcile `hvr-rules.md` §9 wording and confirm `core-standards.md` as canonical
- [ ] Resolve the open GitHub single-vs-double-dash question empirically

### Phase 2: Enforce in the validator
- [ ] Add a negative-control fixture (numbered-H2 file missing a divider)
- [ ] Add the general-path divider check (fence-aware, HTML-comment-transparent)
- [ ] Add the README/skill-doc TOC + nav-anchor prohibition; verify continuity anchors are exempt
- [ ] Dry-run the new rule across all 8,620 files and read the count before enforcing

### Phase 3: Normalize the fleet
- [ ] Add missing dividers across applicable types (bulk, gate-verified)
- [ ] Triage the ~54 anchor files into a keep/strip allowlist; strip only vestigial nav
- [ ] Re-run the census; confirm 0 gaps and 0 vestigial TOC/anchors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New divider + TOC/anchor rules | sk-doc `scripts/tests/`, new negative-control fixture |
| Regression | Continuity-anchor contract unchanged | `007-valid-anchors` / `008-invalid-anchors` |
| Fleet dry-run | All 8,620 structured `.md` | census script + `validate_document.py` batch run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate_document.py` behavior | Internal | Green | Enforcement cannot land |
| GitHub slug empirical check | Internal | Yellow | Anchor-slug normalization stays deferred |
| Operator approval for fleet edit | Internal | Yellow | Phase 3 bulk edit cannot start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new rule fails the CI doc gate on files that are actually correct (false positives), or a bulk edit corrupts a doc.
- **Procedure**: Revert the `validate_document.py` and `template-rules.json` change (single commit); the fleet edits are a separate commit and revert independently.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Standard) ──► Phase 2 (Enforce) ──► Phase 3 (Normalize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Standard | None | Enforce |
| Enforce | Standard | Normalize |
| Normalize | Enforce | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Standard | Low | 1-2 hours |
| Enforce | Medium | 3-5 hours |
| Normalize | Medium | 3-6 hours (bulk, scriptable; deepseek-flash candidate) |
| **Total** | | **7-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fleet dry-run count captured as the baseline
- [ ] Enforcement change is its own commit, separate from fleet edits
- [ ] Fixtures green before merge

### Rollback Procedure
1. Revert the validator + rules commit
2. If fleet edits regressed a doc, revert the normalization commit independently
3. Re-run the census to confirm the baseline is restored

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (docs only, git-reversible)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Standard   │────►│   Enforce   │────►│  Normalize  │
│  (authority)│     │ (validator) │     │  (fleet)    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Standard | None | One ratified rule | Enforce |
| Enforce | Standard | Failing gate on drift | Normalize |
| Normalize | Enforce | Clean fleet | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Standard ratification** - 1-2 hours - CRITICAL
2. **Validator enforcement + dry-run** - 3-5 hours - CRITICAL
3. **Fleet normalization** - 3-6 hours - CRITICAL

**Total Critical Path**: 7-13 hours

**Parallel Opportunities**:
- The anchor-file triage (keep/strip allowlist) can run alongside the divider work.
- The GitHub slug empirical check can run during Phase 1 independently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Standard ratified | No contradictory statement across the 5 authorities | Phase 1 |
| M2 | Enforcement live | Negative control fails; fixtures pass | Phase 2 |
| M3 | Fleet clean | Census reports 0 gaps, 0 vestigial TOC/anchors | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Lift the code-folder structural rules into the general path

**Status**: Accepted

**Context**: Dividers and the no-TOC/no-anchor rule already exist and are enforced, but only in the opt-in code-folder path. The general path leaves them unchecked, which is why the fleet drifted.

**Decision**: Extend the general path to enforce the same divider and no-TOC/no-nav-anchor rules for applicable doc types, while explicitly exempting the spec-kit continuity-anchor contract.

**Consequences**:
- Drift becomes impossible to merge silently.
- The CI doc gate will fail on the current fleet until normalization lands, so enforcement and normalization must be sequenced carefully.

**Alternatives Rejected**:
- Keep enforcement code-folder-only and rely on authoring discipline: rejected, that is the status quo that produced 1,015 drifted files.
