---
title: "Implementation Plan: Phase 6: evidence-gated-provenance"
description: "Make template version stamping evidence-gated: exact match against the level's rendered anchor set, retire --auto-upgrade, leave unknowns unmarked."
trigger_phrases:
  - "evidence gated provenance plan"
  - "template version stamping plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: evidence-gated-provenance

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (check-template-staleness.sh, quality-audit.sh), Node.js (heal-spec-docs.cjs) |
| **Framework** | Shell scripting, CommonJS |
| **Storage** | File-based, Markdown headers |
| **Testing** | Vitest unit tests |

### Overview
Make provenance stamping evidence-gated, as the operator decided on 2026-10-08. Retire `check-template-staleness.sh --auto-upgrade`: for one release the flag prints "removed, use upgrade-legacy" and exits 2. Remove the dead `quality-audit.sh --fix` branch or point it at upgrade-legacy. Make heal-spec-docs.cjs stamp a header only on an exact match against the anchor set rendered for the document's level. Add no marker to unknown-provenance documents, and state the rule in MIGRATION.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] check-template-staleness.sh, quality-audit.sh and heal-spec-docs.cjs code paths traced
- [ ] The renderer that produces a level's anchor set located, so the healer can reuse it
- [ ] In-repo callers of --auto-upgrade confirmed with rg (quality-audit.sh only)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests pass
- [ ] Docs updated (spec/plan/tasks, MIGRATION.md)
- [ ] validate.sh --strict passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at source: a tool writes a template header only from exact evidence, and never bumps one.

### Key Components
- **check-template-staleness.sh**: The report stays. The `--auto-upgrade` branch is replaced by a message and exit 2
- **quality-audit.sh**: The `--fix` branch no longer calls the staleness script
- **heal-spec-docs.cjs**: Compares the document's anchor set with the set rendered for its level, and stamps only on equality

### Data Flow
1. A document lacks a template marker or has an old one
2. heal-spec-docs renders the level's anchor set and compares
3. Equal: name the template. Not equal: leave the document as it is
4. An old marker is never bumped, and no unknown-provenance marker is added
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-template-staleness.sh:171-186` | Version bump under --auto-upgrade | Replace with "removed, use upgrade-legacy" and exit 2 | Test runs the flag and checks message and exit code |
| `quality-audit.sh:148-153` | Dead --fix call to the staleness script | Remove, or point at upgrade-legacy | rg finds no --auto-upgrade call |
| `heal-spec-docs.cjs:60-83` | Superset check against a fixed Level 1 list | Exact equality against the level's rendered anchor set | Test: exact match stamps, superset and subset do not |
| `templates/MIGRATION.md` | Legacy marker policy | State the never-invent-history rule | grep for the rule |
| `template-version-parity.vitest.ts` | Reads the staleness script's manifest path | Unchanged | Suite still passes |

Required inventories:
- Same-class producers: `rg -n 'SPECKIT_TEMPLATE_SOURCE' .skilled/skills/system-spec-kit/runtime` for every writer of the header.
- Consumers of the flag: `rg -n 'auto-upgrade' . --glob '!specs/**'`.
- Matrix axes: document level (1, 2, 3, 3+), anchor set (exact, superset, subset, none), marker state (none, old, current).
- Invariant: no tool writes or bumps a template header without an exact match against the level's rendered anchor set.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

1. **Setup**: Trace the three scripts and the level renderer
2. **Implementation**: Retire the flag, fix quality-audit, gate the healer on an exact level match, update MIGRATION.md
3. **Verification**: Tests, rg checks, validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | heal-spec-docs exact level match: exact stamps, superset and subset do not | Vitest |
| Unit | --auto-upgrade prints "removed, use upgrade-legacy", exits 2 and writes nothing | Vitest running the script on a fixture |
| Manual | One markerless and one old-marker document traced through heal-spec-docs | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Retire or restrict decision | Operator | Decided 2026-10-08: retire | None |
| Phase 009 (doctor update) | Downstream | Waits on this phase | 009 must not ship a healer that invents provenance |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test failures or a broken healing workflow
- **Procedure**: `git revert` the commit, correct, re-test
- **Data impact**: Code-only change. No corpus is written by this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Core Implementation | Low | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Tests pass before commit
- [ ] rg confirms no in-repo caller still passes --auto-upgrade

### Rollback Procedure
1. `git revert` the commit
2. Re-run the spec-kit test suite
3. Not user-facing beyond the retired flag

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, code-only change
<!-- /ANCHOR:enhanced-rollback -->

---
