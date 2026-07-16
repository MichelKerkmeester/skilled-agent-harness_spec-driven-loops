---
title: "Implementation Plan: remove transition aliases (032 phase 009)"
description: "Implementation Plan for phase 009 of the 032 kebab-case filesystem-naming program: remove the bounded coexistence aliases after the physical migration is complete and make unsupported legacy names fail closed."
trigger_phrases:
  - "remove transition aliases implementation plan"
  - "hyphen naming phase 009 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Defined the alias-removal sequence, consumer sweep, and negative verification matrix"
    next_safe_action: "Confirm phase 002 closure evidence before changing any compatibility branch"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/002-root-name-consumer-migration/checklist.md"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases/spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Alias removal is allowed only after the phase 002 coexistence window and physical-root migration are proven closed."
---
# Implementation Plan: Remove transition aliases

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc consumers and their runtime/test fixtures (phase 009) |
| **Change class** | Compatibility removal and fail-closed behavior |
| **Execution** | Isolated migration worktree after phase 002 closure |

### Overview
Phase 002's bounded dual-name resolver keeps the repository bisectable while physical roots move. After the coexistence window closes, this plan removes the underscore root/index branches from the classifier, benchmark paths, routing, packaging, and guard consumers, then proves that canonical hyphenated paths still work and every unsupported legacy input fails explicitly.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002's checklist records a closed coexistence window and the physical canonical roots are present.
- [ ] The complete phase 002 consumer manifest is available, including nested skill and test consumers.
- [ ] The candidate branch is clean, based on the pinned program baseline, and scoped to alias removal.
- [ ] The phase 009 negative-test matrix names legacy roots, legacy indexes, mismatched pairs, and near-matches.

### Definition of Done
- [ ] Every manifest consumer has no live transition alias branch or emission target.
- [ ] Canonical names pass the classifier, loader, router, package, generator, and guard paths.
- [ ] Unsupported names and physical-root conflicts fail closed without a generic fallback.
- [ ] The phase checklist has command, exit-code, fixture, and consumer-row evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Canonical root contract**: the shared resolver treats `feature-catalog` and `manual-testing-playbook` plus their hyphenated indexes as the only live names.
- **Consumer sweep**: the phase 002 manifest is the ownership list; each row is either edited or explicitly proven not to resolve names at runtime.
- **Fail-closed boundary**: unsupported names return an explicit error before classification, discovery, routing, packaging, or emission; there is no `readme`, empty-corpus, or guessed-root fallback.
- **Fixture matrix**: each consumer family runs canonical, legacy, conflict, mismatched, and near-match cases, with the expected result recorded.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Attach phase 002's closure evidence and confirm the physical-root migration is complete.
- [ ] Reconcile the consumer manifest with the current branch and mark any stale row before editing.

### Phase 2: Core Implementation
- [ ] Remove underscore root/index compatibility reads, writers, normalizers, and emission paths from the classifier and all manifest consumers.
- [ ] Update tests and fixtures to make canonical hyphenated paths positive and removed aliases explicitly negative.
- [ ] Preserve the canonical conflict check and the policy exemptions; do not alter identifiers, data keys, or frozen references.

### Phase 3: Verification
- [ ] Run the consumer matrix for canonical names and confirm typed classification/discovery remains unchanged.
- [ ] Run legacy, mismatched, near-match, and both-root fixtures and confirm explicit fail-closed results.
- [ ] Review the diff for residual executable alias handling and hand the evidence to phase 010.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare every phase 002 consumer-manifest row against the code and test diff; no live legacy lookup or emission remains. |
| REQ-002 | Run canonical root/index fixtures through classifier, Lane C loader/generator, router, package, and guard consumers; compare typed results and scenario IDs with phase 002 evidence. |
| REQ-003 | Run old roots, old indexes, mismatched pairs, and near-matches; assert a named error/non-zero result and assert no `readme`, empty corpus, or unrelated category output. |
| REQ-004 | Present both physical roots and assert the resolver rejects the conflict before any leaf is processed. |
| REQ-005 | Review changed path predicates and fixtures against the policy exemption table; verify no exempt or frozen surface was changed. |
| REQ-006 | Confirm each removed alias has a negative fixture and each canonical path has a positive fixture with evidence pinned to the candidate SHA. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 032 program dependencies: the phase 000 immutable baseline and worktree, the phase 001 convention and exemption policy, the phase 002 consumer manifest and coexistence evidence, and the completed physical migration. Phase 010 consumes this phase's evidence; it is not a substitute for the alias-removal checks.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a still-live consumer is discovered, revert the alias-removal commit to restore the bounded phase 002 read tolerance, then fix that consumer before retrying. The rollback restores compatibility logic only; it does not restore old physical directories or broaden the naming policy. A failed fixture run stops the phase before handoff to 010.
<!-- /ANCHOR:rollback -->
