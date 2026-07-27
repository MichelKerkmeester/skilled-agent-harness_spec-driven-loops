---
title: "Implementation Plan: Template conformance for design-md-generator and design-mcp-open-design"
description: "Three-phase plan: fix the one real enum violation, decide and execute relocate-vs-exempt for the four exemplar DESIGN.md files, and number/uppercase five design-mcp-open-design reference files' H2 headings."
trigger_phrases:
  - "remaining mode conformance plan"
  - "design-md-generator conformance plan"
  - "design-mcp-open-design conformance plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/012-remaining-mode-conformance"
    last_updated_at: "2026-07-27T18:03:42Z"
    last_updated_by: "conformance-executor"
    recent_action: "Executed all four phases plus the sweep addendum"
    next_safe_action: "Packet complete, no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Template conformance for design-md-generator and design-mcp-open-design
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill content + frontmatter enums |
| **Framework** | sk-design `design-md-generator` and `design-mcp-open-design` modes |
| **Storage** | Git-tracked files only |
| **Testing** | `rg` sweep for enum values; heading-count diff per renumbered file |

### Overview
Three phases, each independently low-risk. Phase 1 is a one-line frontmatter fix. Phase 2 decides relocate-vs-exempt for the four exemplar `DESIGN.md` files and executes without touching their content. Phase 3 numbers and upper-cases H2 headings in the 5 non-conformant `design-mcp-open-design` reference files, leaving the other 4 untouched. `003-design-motion`'s own conformance is explicitly out of scope, superseded by `010-motion-merge`.

**Execution addendum:** the exhaustive sweep required by the executing task (beyond this plan's originally-named files) found the identical bug classes recurring in 13 more files — see `spec.md`'s Scope addendum and `implementation-summary.md` for the full list and evidence. All were fixed under the same low-blast-radius discipline this plan already established (grep for citing sites before renumbering; content stays byte-identical for exempted files).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The relocate-vs-exempt tradeoff for the four exemplar files has been weighed (does anything else in `design-md-generator` cite their current path?).
- [x] Each of the 5 `design-mcp-open-design` files' current H2 list is recorded before renumbering.

### Definition of Done
- [x] `extraction-workflow.md`'s `importance_tier` is in-enum.
- [x] The four exemplar files' conformance is resolved (relocated or exempted), content unchanged.
- [x] All 5 non-conformant `design-mcp-open-design` files use `## N. HEADING` form; the other 4 are untouched.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent, low-blast-radius fixes bundled into one packet because they share a discovery source (the targeted look at the two unaudited modes), not a mechanism.

### Key Components
- **Enum fix**: `extraction-workflow.md:10`.
- **Placement decision**: four `examples/**/DESIGN.md` files, relocate or exempt.
- **Heading numbering**: 5 `design-mcp-open-design/references/*.md` files.

### Data Flow
Fix `extraction-workflow.md`'s enum -> decide relocate-vs-exempt for the four exemplar files -> execute that decision without touching content -> record each of the 5 heading files' pre-edit H2 list -> renumber + uppercase each -> diff against the pre-edit list to confirm no content loss -> sweep-grep + heading-count check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fix the enum violation
- [x] Change `extraction-workflow.md:10`'s `importance_tier` from `"high"` to `important`.

### Phase 2: Resolve the exemplar DESIGN.md files
- [x] Check whether any other file cites `references/examples/{vercel,linear,supabase,stripe}/DESIGN.md` by path.
- [x] Decide relocate vs. documented exemption based on that citation check.
- [x] Execute the decision (move the four files, or author an exemption note) without altering their content.
- [x] If relocated, update any citing site found in the check above.

### Phase 3: Number design-mcp-open-design reference headings
- [x] Record the current H2 list for `cli-child-pairing.md`, `freshness-invalidation.md`, `guarded-proxy.md`, `inner-generator-binding.md`, `smart-router-pseudocode.md`.
- [x] Number + uppercase each file's H2 headings in place.
- [x] Diff each against its pre-edit H2 list to confirm no heading was dropped or altered in meaning.
- [x] Confirm the other 4 `design-mcp-open-design/references/*.md` files remain untouched.

### Phase 4: Verification
- [x] `rg -n "importance_tier" design-md-generator/references/extraction-workflow.md` shows an in-enum value.
- [x] Exemplar-file conformance resolution is documented (relocation path or exemption note).
- [x] All 5 renumbered files use `## N. HEADING`; the other 4 are unchanged in `git diff`.
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/012-remaining-mode-conformance --strict` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Enum values in-bounds | `rg -n` |
| Heading diff | Renumbered files lose no heading/content | Pre/post H2 list comparison |
| Untouched-file check | The 4 already-conformant files show no diff | `git diff --stat` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `010-motion-merge` (for `003-design-motion`'s conformance) | Internal | Sibling, in progress | Not a blocker for this packet — this packet never touches `design-motion/` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A renumbered file's heading diff shows lost or altered content, or the relocate decision breaks a citing site.
- **Procedure**: Revert the specific phase's commit; re-attempt with the corrected approach.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Enum fix) ──┐
Phase 2 (Exemplar files) ──┤──> Phase 4 (Verify)
Phase 3 (Heading numbering) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Enum fix | None | Verify |
| Exemplar files | None | Verify |
| Heading numbering | None | Verify |
| Verify | All three | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Relocate-vs-exempt decision recorded with rationale before Phase 2 executes
- [x] Each Phase 3 file's pre-edit H2 list recorded before renumbering

### Rollback Procedure
1. **Immediate**: If a heading diff shows content loss, do not proceed to the next file.
2. **Revert code**: `git revert` the specific phase's commit.
3. **Verify**: Re-run the diff check after the fix.

### Data Reversal
- **Has data migrations?** No — frontmatter and markdown heading content only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Three independent low-blast-radius fixes
- Exemplar file content is immutable; only placement/exemption changes
-->
