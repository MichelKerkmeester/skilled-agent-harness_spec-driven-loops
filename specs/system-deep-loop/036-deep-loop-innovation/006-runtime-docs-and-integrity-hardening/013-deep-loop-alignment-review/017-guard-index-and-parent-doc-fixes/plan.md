---
title: "Implementation Plan: Phase 17: guard-index-and-parent-doc-fixes"
description: "Trace each of three red or stale checks to the producer that made it wrong, fix it there with a test that fails first, and regenerate the trigger index last so it reflects the committed tree."
trigger_phrases:
  - "guard index fixes plan"
  - "generated skill copy skip"
  - "lineage pruning rule plan"
  - "parent goal budget plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: guard-index-and-parent-doc-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python verifier, Node.js ESM corpus walker, Markdown spec documents |
| **Framework** | pytest for the verifier and the Hermes plugin; Vitest for the retrieval suites |
| **Storage** | Committed JSON trigger index and its fixture outputs |
| **Testing** | pytest, Vitest, `run-all-drift-guards.sh`, `validate.sh --strict` |

### Overview
None of the three checks was wrong about what it saw; each saw something it was never meant to judge. The plan fixes what each one reads rather than what it reports: the verifier learns what a generated copy is, the corpus walker learns where fan-out lineages live, and the parent documents are filled in rather than waived.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each defect traced to its producer
- [x] No fan-out run active in the checkout

### Definition of Done
- [x] Drift-guard wrapper exits 0
- [x] Retrieval suites pass with the widened rule
- [x] Trigger index regenerated with no lineage path
- [x] Parent spec and goal validate without warnings
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer. A generated copy declares itself with a marker, so the verifier reads the marker. A fan-out lineage lives under `specs/` in whatever artifact directory the runner was given, so the walker prunes it by name under that root.

### Key Components
- **`check_router_paths()`** in the alignment verifier, and `GENERATED_SKILL_COPY_RE`.
- **`isExcludedDirectory()`** in the corpus library, and `EXCLUSIONS`, which is folded into the manifest hash.
- **`SCOPED_DIVERGENCES`** in the parity suite and Section 9 of the retrieval conventions, which must describe the same policy.

### Data Flow
`sync-skills-hermes.cjs` writes marked copies; the verifier skips them and checks the canonical skills. The fan-out runner writes lineages; the corpus walker prunes them; the generator writes the index, manifest, diagnostics and variants from what remains.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `verify_alignment_drift.py` dead-route check | Reports routes with no file | Update: skip marked copies | New test fails before, passes after; wrapper exit 0 |
| Language-integrity scan | Checks authored code, including `.hermes/plugins` | Unchanged | The plugin's shebang finding surfaced and was fixed rather than exempted |
| `sync-skills-hermes.cjs` | Writes the marker | Unchanged: marker already present in all 68 copies | Marker count |
| `corpus.mjs` pruning rule | Prunes directories from the walk | Update: `lineages` under `specs/` | Parity probe fails before, passes after |
| `sweep-memory-residue.mjs`, `retrofit-convention.mjs` | Import only the flat directory-name set | Unchanged: the widened rule is not a flat name | Import lines read |
| Ripgrep retrieval lane | Raw evidence search | Unchanged: still reaches lineages, as the divergence records | `ripgrepExcludes: false` probe |
| Trigger index and fixture outputs | Committed generator output | Regenerate | No lineage path in `paths` |
| Parent spec and goal | Packet documents | Update | Strict validation of the parent |

Required inventories:
- Same-class producers: every tracked `SKILL.md` carrying a generated marker (68, all Hermes), and every `lineages` directory under the corpus roots (380, all fan-out output).
- Consumers of changed symbols: every importer of the corpus policy exports.
- Matrix axes: `lineages` under `specs/` or not, with a `research` parent or not.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Drift guard**: baseline the verifier tests, add the generated-copy test and watch it fail, add the skip, then fix the plugin finding the flood had buried.
2. **Trigger index**: baseline the retrieval tests, add the lineage probes and watch them fail, widen the rule with its manifest text, table and documentation, then regenerate after every document this phase adds exists.
3. **Parent documents**: fill every template leftover in the parent spec, and bring the goal's durable slice under budget without dropping a decision or criterion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Generated copy with a dead route is not reported | pytest |
| Regression | `lineages` under `specs/` is pruned whatever its parent | Vitest parity suite |
| Suite | Verifier, Hermes plugin, retrieval and trigger suites | pytest, Vitest |
| Gate | Drift-guard wrapper; strict validation of phase and parent | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A quiet shared checkout | Environment | Confirmed | Regeneration could index another session's uncommitted files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A real document is found missing from the index, or a real dead route goes unreported.
- **Procedure**: `git checkout --` the changed files, then re-run `generate-trigger-index.mjs` so the index matches the restored rule.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Drift guard | None | None |
| Trigger index | Parent documents and this phase's own documents exist | Final validation |
| Parent documents | None | Trigger index regeneration |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Drift guard | Low | Tracing the marker convention |
| Trigger index | Medium | Tracing the rule and every lineage location |
| Parent documents | Low | Wording within budget |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration
- [x] Generated outputs are rebuilt, not hand-edited

### Rollback Procedure
1. Revert the changed source, test and document files.
2. Regenerate the trigger index and its fixtures.
3. Re-run the verifier, retrieval and trigger suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
