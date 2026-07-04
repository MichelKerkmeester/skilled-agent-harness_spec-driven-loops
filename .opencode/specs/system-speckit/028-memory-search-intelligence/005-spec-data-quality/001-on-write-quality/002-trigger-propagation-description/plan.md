---
title: "Implementation Plan: A2 Trigger Propagation and Derived Description [template:level_2/plan.md]"
description: "Populate trigger_phrases in the per-folder description generator from curated frontmatter plus a derived extractive set capped at 12, demote the title-copy to a fallback so a real description wins, and raise the extractTriggersFromContent cap to match."
trigger_phrases:
  - "trigger propagation description"
  - "extractive description derive"
  - "description json triggers"
  - "extractTriggersFromContent cap"
  - "subset coherence triggers"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/002-trigger-propagation-description"
    last_updated_at: "2026-07-04T17:12:01.703Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase plan for A2 trigger-propagation scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A2 Trigger Propagation and Derived Description

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, the spec-kit MCP server |
| **Framework** | Per-folder description generator inside the memory search layer |
| **Storage** | None, the generator reads spec.md and writes description.json on disk |
| **Testing** | A regeneration pass over a folder with curated triggers plus a subset coherence assertion |

### Overview
This phase populates the `trigger_phrases` field in `generatePerFolderDescription`, merging the curated frontmatter triggers with a derived extractive set, deduplicated and capped at 12. It also demotes the verbatim title-copy in `extractDescription` to a last-resort fallback so a Problem or Purpose line wins when present, and raises the `extractTriggersFromContent` cap from 8 to 12 so the derive helper and the propagation cap agree. A2 is a write-time metadata fix that bypasses the retrieval floor, so it changes generation only and touches no ranking path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Field-population fix inside one generator function plus a cap-constant alignment. No new abstraction and no retrieval-path change.

### Key Components
- **`folder-discovery.ts` `generatePerFolderDescription` (:872-902)**: builds the description record with `description` and `keywords` but no `trigger_phrases` key, the single place the propagation lands.
- **`folder-discovery.ts` `extractDescription` Pass 1 (:455-461)**: returns the first `# ` heading verbatim, demoted here to a fallback behind a Problem or Purpose line.
- **`quality-loop.ts` `extractTriggersFromContent` (:515)**: derives the extractive trigger set at a cap of 8, raised here to 12.
- **`description-schema.ts` (:66)**: already declares `trigger_phrases` optional, confirmed to tolerate the populated capped array with no schema break.

### Data Flow
`generatePerFolderDescription` reads spec.md once, derives a description and an extractive trigger set, then writes description.json. After this phase the curated frontmatter triggers fill first, the derived set fills the remaining slots up to 12, and the `description` prefers a Problem or Purpose line over the title copy. The retrieval and adherence readers then see a real description and the curated trigger vocabulary instead of a title echo and a missing field.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `generatePerFolderDescription` (:872-902) | Builds the record with `description` and `keywords`, never sets `trigger_phrases` | update to set `trigger_phrases` from curated frontmatter merged with the derived set, deduplicated and capped at 12 | regenerating `005/description.json` writes a non-empty capped array that includes every curated trigger |
| `extractDescription` Pass 1 (:455-461) | Returns the first `# ` heading verbatim as the description | demote the title-copy to a last-resort fallback, prefer a Problem or Purpose line | a folder with a Problem Statement yields a description that is not byte-equal to its first heading |
| `extractTriggersFromContent` (:515) | Caps the derived extractive set at 8 | raise the cap to 12 to match the propagation cap | the derive cap and the propagation cap read the same value |
| `description-schema.ts` (:66) | Declares `trigger_phrases` optional, never written today | confirm validation tolerates the populated capped array, no schema change | the schema accepts a 12-entry `trigger_phrases` array, no new schema logic added |
| `graph-metadata.json` generation, embedding and re-index path | Downstream metadata and retrieval surfaces | not a consumer, unchanged | A2 is write-time only and bypasses the retrieval floor by construction |

Required inventories:
- Same-class producers: `rg -n 'trigger_phrases' .opencode/skills/system-spec-kit/mcp_server/lib/search .opencode/skills/system-spec-kit/mcp_server/lib/description`.
- Consumers of changed symbols: `rg -n 'extractTriggersFromContent|generatePerFolderDescription|extractDescription' .opencode/skills/system-spec-kit`.
- Matrix axes: empty curated set, curated set under 12, curated set already at 12, spec.md with a Problem line, spec.md with neither Problem nor Purpose, unreadable spec.md.
- Algorithm invariant: the propagated set is a superset of the curated set whenever the curated count is at or below 12, the derived set only fills remaining slots, and the title-copy is the sole fallback.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the curated frontmatter `trigger_phrases` are readable from spec.md inside the existing single read in `generatePerFolderDescription`
- [ ] Confirm `description-schema.ts` (:66) tolerates a populated capped `trigger_phrases` array with no schema break
- [ ] Capture the baseline `005/description.json` state, a title-echo description and a missing `trigger_phrases` key

### Phase 2: Core Implementation
- [ ] Raise the `extractTriggersFromContent` cap from 8 to 12 (`quality-loop.ts`:515)
- [ ] Derive a real extractive description in `extractDescription`, preferring a Problem or Purpose line and demoting the title-copy to a fallback (:455-461)
- [ ] Populate `trigger_phrases` in `generatePerFolderDescription` from the curated frontmatter set merged with the derived set, deduplicated and capped at 12 (:872-902)
- [ ] Add the subset coherence check, asserting the curated set is a subset of the propagated set, never byte equality

### Phase 3: Verification
- [ ] Regenerating `005/description.json` writes a `trigger_phrases` superset of its curated frontmatter set and a description that is not a verbatim title copy
- [ ] The derive cap and the propagation cap both read 12, and the subset coherence assertion passes against a folder with curated triggers
- [ ] A second regeneration over an unchanged spec.md produces identical `trigger_phrases` and `description`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The derive and propagation over a folder with curated triggers, an empty curated set, and a curated set at 12 | direct generator invocation |
| Integration | A full regeneration of `005/description.json` plus the subset coherence assertion | regeneration pass plus assertion |
| Manual | Idempotence check, a second pass over an unchanged spec.md yields identical output | repeat regeneration and diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `extractTriggersFromContent` derive helper | Internal | Green | None, the helper ships today, only its cap moves |
| `trigger_phrases` schema field (:66) | Internal | Green | None, the field is already declared optional |
| `015-prodmode-recall-gate` | Internal | Green | None, A2 bypasses the prod retrieval floor and makes no promotion claim |
| `026-shared-safe-fix-engine` reuse path | Internal | Yellow | The shared `triggers.propagate` fixer reuses this logic, so the derive path must stay in `generatePerFolderDescription` to avoid divergence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A regenerated folder loses a curated trigger, or a folder whose only signal is its title regresses to an empty description.
- **Procedure**: Revert the `generatePerFolderDescription` population and the `extractDescription` demotion, leaving the cap alignment in place, then re-run the regeneration to confirm the prior output.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `005/description.json` state captured before the change
- [ ] Subset coherence assertion staged against a folder with curated triggers
- [ ] Idempotence proof staged, a second pass yields identical output

### Rollback Procedure
1. Revert the `trigger_phrases` population in `generatePerFolderDescription`
2. Revert the `extractDescription` title-copy demotion
3. Keep the cap alignment at 12, it carries no behavior regression on its own
4. Re-run the regeneration to confirm the prior description.json output

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change touches metadata generation only and a regeneration restores prior output
<!-- /ANCHOR:enhanced-rollback -->

---
