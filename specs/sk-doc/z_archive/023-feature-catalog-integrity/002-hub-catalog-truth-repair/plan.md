---
title: "Implementation Plan: hub catalog truth repair"
description: "Ten hub-root feature catalogs mislead a reading agent: eight files cite retired compiled-routing directories, six roster and count claims contradict their own registries, four shipped capabilities have no catalog entry at all, and one safety claim about transport mutation is flatly wrong. This phase repairs them in four lanes, starting with the mechanical retired-path lane that takes the validator from 19 violations to 0."
trigger_phrases:
  - "hub catalog truth repair implementation plan"
  - "feature catalog integrity implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/002-hub-catalog-truth-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from research synthesis"
    next_safe_action: "Confirm baselines in T001 before any edit begins"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Hub Catalog Truth Repair

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Ten hub-root feature catalogs under `.opencode/skills/*/feature-catalog/` hold 425 leaves. They are the surface an
agent reads to learn what a hub does, and their leaves are indexed in each root's `leaf-manifest.json`, which is what
Lane C skill-benchmark `resourceRecall` scores against. Twenty-eight confirmed findings say they are wrong: stale
rosters and counts, retired paths, a phantom row, four shipped-but-uncatalogued capabilities, and a false safety claim.
Nineteen of the defects are already visible to the existing validator; the rest are invisible to it, which is why `001`
exists.

### Overview
Four lanes. Lane A is mechanical path substitution and delivers the 19-to-0 headline with no dependency. Lane B fixes
the rosters and counts an agent will act on. Lane C authors four new leaves for capabilities that ship. Lane D repairs
the advisor's structure and closes the hygiene tier. Documentation only; no runtime change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- T001 confirm-against-HEAD has re-captured the 19-violation baseline and re-checked the six roster and count claims.
- Every Lane C implementation path has been re-derived, not copied from the research.
- For Lane D only: `001` has ruled description-parity strictness.

### Definition of Done
- `python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --strict` exits 0.
- `rg -l "011-runtime-engine|010-live-activation"` over the catalogs returns nothing.
- Every derived assertion in the testing strategy returns zero mismatches.
- Ten-lane `checklist.md`, one lane per hub, each closed with evidence.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-hub repair against a live truth source, with duplicated facts replaced by links to the owner. Each edit names the
registry, schema, or source file it was derived from, so the next reader can re-derive it.

### Key Components
- **Truth sources (read-only):** each hub's `mode-registry.json`, `hub-router.json` and `SKILL.md`;
  `.opencode/commands/interface/`; `skill-graph-tools.ts`; `sk-git/scripts/hooks/`;
  `sk-design/shared/authored-brand/authored-brand-boundary.mjs`.
- **Lane A substitution set:** `011-runtime-engine` becomes `014-runtime-engine`, `010-live-activation` becomes
  `013-live-activation`, across seven table cells and one prose citation, plus five advisor anchor repairs.
- **Lane C new leaves:** four, each authored from the real module surface with a real validation anchor.
- **Lane D reshape:** advisor root entries move from two-column Feature/File tables to the governing
  H3/Description/Current-Reality/Source-Files form.

### Data Flow
Read the registry or source, derive the claim, write the catalog entry, then re-derive it as verification. The
verification is the same derivation run a second time by a different mechanism (a command rather than a reading), which
is what makes the assertions in section 5 meaningful rather than circular.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Confirm every finding against HEAD, capture the validator baseline, and re-derive all four Lane C implementation paths.

### Phase 2: Core Implementation
Lane A first and alone, so the 19-to-0 delta is attributable. Then Lane B and Lane C in parallel. Then Lane D, which is
reshape-then-parity in that order.

### Phase 3: Verification
Validator to 0, derived assertions, anti-regression greps, manual per-leaf checks for the four new leaves and the two
narrowed sk-git claims, then the ten-lane checklist and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Mechanical first, manual only where the standard requires a human check.

**Primary mechanical gate.** `validate_catalog_package.py --strict` over the hub packages goes 19 to 0. Capture the
baseline before touching anything and report the delta, not a claim.

**Derived assertions.** Each compares a catalog claim to a live source. Each should become a check in `001` rather than
staying a one-off here:

- mode count in every hub root equals `len(mode-registry.modes)`;
- distinct packet count equals the number of distinct `packet` values (catches sk-doc twelve-versus-eleven);
- every `packet` or `workflowMode` identifier named in a catalog resolves to an existing directory (catches sk-prompt);
- `/interface:*` command count equals the number of files in `.opencode/commands/interface/`;
- every tool in `skillGraphToolDefinitions` and `advisorToolDefinitions` appears in the advisor root.

**Anti-regression greps.** Zero `011-runtime-engine` and `010-live-activation` hits repo-wide, prose included. Zero
plain-text `.md` rows in any root table.

**Manual, per the standard's manual-verification rule.** The four new Lane C leaves each cite an implementation path
and a validation anchor that exist. The two narrowed sk-git claims match what their anchors actually test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `001` for the description-parity ruling (Lane D only) and, once it lands, the derived-assertion checks.
- The ten hubs' registries and source files as read-only truth.
- Nothing from `003`. The two phases are disjoint by file and can run in parallel.
- No edge to `036/032`, which owns deep-loop READMEs and registries rather than catalogs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is catalog markdown. Rollback is `git revert` per lane, and the lanes are separable by commit so Lane A
can survive a revert of Lane D. No runtime behavior can be affected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Lane | Depends on | Blocks | Note |
|------|-----------|--------|------|
| A retired paths | Nothing | Nothing | Start immediately; delivers 19 to 0 |
| B rosters and counts | T001 re-check | Nothing | Parallel with C |
| C new leaves | T001 path re-derivation | Nothing | Parallel with B |
| D advisor and hygiene | `001` Q2 ruling; reshape before parity | Nothing | Last lane |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Lane | Relative size | Driver |
|------|---------------|--------|
| A | Small | Eight files, mechanical substitution plus five anchor repairs |
| B | Medium | Nine claims across seven hubs, each re-derived from a registry |
| C | Medium | Four new leaves authored from real module surfaces |
| D | Large | Advisor root reshape, then five parity findings, then two anchor gaps |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Validator baseline captured (19 violations, all `missing_source_path`).
- The eight retired-path files enumerated by grep, prose included.
- All four Lane C features confirmed to still exist and still lack entries.

### Rollback Procedure
1. Revert the offending lane's commits. Lanes are separable.
2. If a new leaf turns out to describe a capability that has since been removed, delete the leaf and its root row
   together, never one alone, so bijection stays intact.
3. Re-run the validator to confirm the revert did not reintroduce a violation.

### Data Reversal
None. Documentation only.
<!-- /ANCHOR:enhanced-rollback -->
