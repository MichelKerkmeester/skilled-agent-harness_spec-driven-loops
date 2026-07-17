---
title: "Implementation Plan: sk-code subtree rollup gate (032 phase 008/009)"
description: "Plan for reconciling phases 001-008, running the final scope-aware sk-code naming census and active-reference checks, and issuing a non-mutating pass/block handoff."
trigger_phrases:
  - "sk-code skill gate plan"
  - "sk-code subtree rollup plan"
  - "sk-code kebab-clean census"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate plan"
    next_safe_action: "Execute the sibling matrix and final census"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/"
      - ".opencode/skills/sk-code/changelog/"
      - "../008-changelog-verify/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: sk-code subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-code/` and phases 001-008 |
| **Change class** | Final rollup verification; no migration edits |
| **Execution** | Sibling verdict matrix, scope-aware census, and active-reference checks |
| **Verification** | Checklist status, map consistency, path closure, exemption classification, pass/block handoff |

### Overview

Reconcile every child checklist and handoff, then inspect the complete sk-code filesystem surface against the 032
exemption boundary and completed maps. Resolve active references and produce a reproducible pass/block result; route
unknown names or stale paths back to their owning phase instead of implementing fixes in the gate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phases 001-008 have checklists, maps, handoffs, and release evidence available.
- [ ] Candidate SHA, BASE SHA, sibling map hashes, and the final census/reference commands are recorded.
- [ ] The 032 exemption boundary and frozen/generated/tool-mandated surfaces are fixed before scanning.

### Definition of Done

- [ ] Every sibling P0 contract passes and the handoffs have no unresolved conflict.
- [ ] The full sk-code census and active-reference checks are clean by scope, with every retained name classified.
- [ ] The final evidence records a pass or all blocking findings without new migration edits.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Sibling verdict matrix**: record each phase 001-008 checklist result, map/hash, handoff, owner, and unresolved finding.
- **Naming census**: enumerate every filesystem name under `.opencode/skills/sk-code/`, then classify candidates as
  rename-complete, exempt, generated, tool-mandated, frozen, or blocking unknown under the 032 policy.
- **Reference closure**: resolve active markdown links, imports, registries, shell/path values, and metadata references
  against the child maps without changing them.
- **Release handoff**: include phase 008 changelog/version evidence and distinguish it from final census evidence.
- **Gate result**: return a pass only when all P0 rows and scope checks pass; route every failure to its owner.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load phases 001-008 checklists, maps, reports, handoffs, pinned BASE metadata, and candidate SHA.
- [ ] Enumerate the complete `.opencode/skills/sk-code/` tree, active version/changelog surfaces, and reference roots.
- [ ] Capture baseline path inventory, map hashes, sibling statuses, and the exact census/reference commands.

### Phase 2: Core Implementation

- [ ] Build the sibling verdict matrix and check ownership, scope, and handoff consistency.
- [ ] Run the scope-aware filesystem census and classify every retained non-kebab name against the 032 boundary.
- [ ] Resolve active references and verify that the phase 008 release/version evidence closes its handoff.
- [ ] Record findings only; do not rename, rewrite, repair metadata, or alter changelog/history content.

### Phase 3: Verification

- [ ] Confirm all sibling P0 checklist items pass and no map or disposition conflicts remain.
- [ ] Confirm no unknown in-scope name, stale active path, or unreported release contradiction remains.
- [ ] Record commands, exit codes, census counts, findings, and the final pass/block handoff.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Sibling completion | Read each 001-008 checklist and handoff; compare P0 verdicts, map hashes, ownership, and blockers. |
| Naming cleanliness | Enumerate all filesystem names under sk-code and classify every non-kebab result using the 032 exemptions. |
| Reference closure | Resolve active links, imports, registries, shell/path values, and metadata paths against completed child maps. |
| Release coherence | Recheck phase 008 changelog coverage and version agreement above BASE `4.1.0.0`. |
| Scope safety | Confirm the gate changed no code, migration path, changelog/history, metadata, or assigned packet outside evidence. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-008 | Internal | Required | The rollup cannot prove sibling completion or map closure. |
| Pinned BASE and frozen map | Internal | Required | Scope classification and evidence comparisons are ungrounded. |
| `.opencode/skills/sk-code/` | Internal | Required | The final census and reference closure have no target surface. |
| Central validation/evidence gate | Internal | Required | The documented pass cannot be accepted centrally. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Incomplete sibling, conflicting map, unknown in-scope name, stale reference, unresolved release finding,
  or any mutation during the read-only gate.
- **Procedure**: Discard only generated rollup evidence, restore the pre-gate evidence baseline, and route the finding
  to the owning phase. Do not implement a rename or reference repair as part of rollback.
<!-- /ANCHOR:rollback -->

