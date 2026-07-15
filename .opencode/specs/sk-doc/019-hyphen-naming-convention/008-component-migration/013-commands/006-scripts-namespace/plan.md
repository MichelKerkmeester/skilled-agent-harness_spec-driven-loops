---
title: "Implementation Plan: scripts command namespace naming (017 phase 008/013/006)"
description: "Audit the already-clean scripts namespace, preserve its negative fixture contract, and produce evidence for the command-surface rollup."
trigger_phrases:
  - "scripts namespace naming plan"
  - "command checker naming audit plan"
  - "scripts no-op migration plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/006-scripts-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts namespace plan"
    next_safe_action: "Run the scripts audit and self-test"
    blockers: []
    key_files:
      - ".opencode/commands/scripts/README.md"
      - ".opencode/commands/scripts/fixtures/broken-command-refs.yaml"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Scripts command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

This is an evidence-only child. Inspect the four tracked files and two directory basenames, compare them with the frozen exemption map, and record that no physical rename is required. Keep the deliberately broken fixture unchanged, then run its documented self-test and the command-reference scan.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The inventory covers every file and directory under `.opencode/commands/scripts/`.
- [ ] Each basename is kebab-case or has a documented exemption; no silent cleanup is allowed.
- [ ] The negative fixture's intended broken agent, skill-asset, and runtime-directory cases are identified.

### Definition of Done

- [ ] The filesystem-name scan reports no in-scope snake_case basename.
- [ ] The self-test, live scan, and path-scoped diff receipts are attached.
- [ ] The no-rename disposition is ready for `010-commands-gate`.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The checker and its fixture are shared command-surface infrastructure. The fixture's underscore-bearing path is data consumed by a negative test, not a filesystem basename. The plan therefore separates filesystem-name evidence from literal fixture content and leaves the checker contract untouched.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture BASE inventory, candidate inventory, and a frozen-map row for each file and directory.
- [ ] Load the program exemption boundary and the commands-parent handoff.

### Phase 2: Implementation

- [ ] Scan names and path references, classifying the fixture values without changing them.
- [ ] Record any unexpected live reference with its owner and disposition; do not create an unapproved rename.

### Phase 3: Verification

- [ ] Run `node .opencode/commands/scripts/validate-command-references.cjs --self-test` and capture the expected output and exit status.
- [ ] Run the default live-tree checker scan and capture its output and exit status.
- [ ] Review the scoped diff and hand the no-rename evidence to `010-commands-gate`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The required behavioral evidence is the documented self-test: the broken fixture must produce the expected three violation classes, and the real command tree must resolve cleanly. Add a direct filesystem-name scan and a reference search for any discovered old basename. A zero-file rename result is valid only when all receipts are present.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Program boundary and exemptions | Internal | Required | The fixture and any Python/tool-mandated names could be misclassified. |
| Shared command component map | Internal | Required | The scripts namespace could overlap a sibling phase. |
| Checker behavior and fixture contract | Local | Required | The self-test cannot prove preservation without its documented baseline. |
| `010-commands-gate` rollup | Internal | Required for handoff | The no-rename evidence has no accepting owner. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No filesystem mutation is expected. If an accidental edit occurs, restore only the files in this child to the captured BASE state before rerunning the evidence checks; do not reset unrelated worktree changes.
<!-- /ANCHOR:rollback -->
