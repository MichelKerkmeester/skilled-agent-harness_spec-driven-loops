---
title: "Implementation Plan: Post-019 Feature-Catalog Accuracy Remediation"
description: "Apply ten evidence-backed catalog corrections in three owner-scoped batches, then validate source anchors, catalog structure, and packet completion."
trigger_phrases:
  - "feature catalog remediation plan"
  - "catalog evidence correction"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/016-documentation-quality-program/012-fix-post-019-alignment-p1-findings-for-feature-catalog-accuracy"
    last_updated_at: "2026-07-25T13:29:20Z"
    last_updated_by: "opencode"
    recent_action: "Completed all three correction and verification phases."
    next_safe_action: "None; all catalog and packet gates pass."
    blockers: []
    key_files: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Post-019 Feature-Catalog Accuracy Remediation

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | Markdown, JSON registries, Node.js validators |
| **Storage** | Repository files only |
| **Testing** | Path probes, feature-catalog validation, strict spec validation |

Use the smallest correct change for each sealed finding. Current registries, hook configuration, command metadata, durable implementation files, and purpose-built playbooks are authoritative; the catalogs must follow them without changing behavior.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Ten findings confirmed against the live tree.
- [x] Target catalogs and authority files identified.
- [x] Runtime behavior explicitly excluded.

### Definition of Done

- [x] Ten findings corrected with no unrelated prose rewrite. [EVIDENCE: `tasks.md` records 10/10 finding corrections.]
- [x] Every changed source path exists. [EVIDENCE: the bounded source probe resolved 24/24 paths.]
- [x] Catalog and strict packet validators pass. [EVIDENCE: seven document validators and `validate.sh --strict` exit 0.]
- [x] Checklist contains command-backed evidence. [EVIDENCE: `checklist.md` records each P0/P1 verification command.]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Authority-first documentation correction: live source establishes current reality, and catalog prose changes only where it disagrees.

### Key Components

- Feature catalogs as the only mutated product surface.
- Registries, hooks, commands, playbooks, and filesystem paths as read-only authorities.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| CLI catalogs | Describe executor and Cursor surfaces | Correct four-packet, hook, and authority claims | Registry/hook probes plus catalog validator |
| sk-code catalog | Locates shared doctrine | Replace underscore glob with live hyphenated paths | Three path-existence probes |
| sk-design catalogs | Describe command, manager, and style capabilities | Correct parity claim, validation anchor, and unshipped capability status | Command surface check and path probes |
| Runtime, hook, and command files | Current authority | Read only | Git diff confirms no changes |
| Design command metadata | Describes command packages | Synchronize four hints | Command surface check |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: CLI And sk-code Corrections

- Update both CLI packet-count claims to four and include `cli-cursor`.
- Replace mutable Cursor phase narration and numbered-spec evidence with current hook configuration and durable playbooks.
- Correct shared workflow-doctrine paths.

### Phase 2: sk-design Corrections

- Resolve descriptive metadata parity using live command frontmatter as authority.
- Point manager-shell validation to the real PASS/FAIL playbook.
- Recast both absent styles backends as unavailable capabilities rather than shipped implementations.

### Phase 3: Verification And Closeout

- Probe every cited path.
- Run catalog/document validators and strict packet validation.
- Record exact evidence in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Structural | Catalog source paths and required sections | Repository catalog validator |
| Contract | `/interface:*` package/metadata parity | `design-command-surface-check.mjs` |
| Regression | No stale report phrases remain | Exact-text search |
| Packet | Spec-document consistency | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Alignment report finding inventory | Green | Cannot claim all findings closed without it |
| Live registries and hook config | Green | Catalog truth cannot be established |
| Catalog validation tooling | Green | Completion remains unverified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A changed catalog contradicts a live source, a validator fails, or a correction removes accurate capability information.
- **Procedure**: Revert only this phase's catalog hunks and restore the prior packet docs; no runtime rollback is needed because runtime files remain unchanged.
<!-- /ANCHOR:rollback -->
