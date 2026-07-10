---
title: "Implementation Plan: Public Doc Internal Spec Reference Removal [template:level_2/plan.md]"
description: "Scrub public-facing documentation surfaces for hardcoded internal spec packet paths while preserving generic user-selected Spec Kit placeholders."
trigger_phrases:
  - "public docs"
  - "internal spec references"
  - "doc cleanup"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal"
    last_updated_at: "2026-05-18T09:12:49Z"
    last_updated_by: "codex"
    recent_action: "Completed public-doc packet path cleanup and scoped verification scans"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/commands/"
      - ".opencode/install_guides/"
      - ".opencode/skills/"
    session_dedup:
      fingerprint: "sha256:64b87baf39fca441d1ca01d3981f3682bc8a1cbdb1a01b8df1817176092a6bb3"
      session_id: "public-doc-internal-spec-reference-removal-2026-05-18"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User chose a new spec folder under release-cleanup/003-cross-cutting-cleanup-pass."
      - "Generic Spec Kit root examples stay when they describe user-selected workflow paths."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Public Doc Internal Spec Reference Removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON documentation assets |
| **Framework** | OpenCode command and skill documentation |
| **Storage** | Filesystem only |
| **Testing** | `rg` scoped searches plus Spec Kit strict validation |

### Overview
The cleanup scans public-facing docs for concrete internal packet paths and rewrites those references into portable prose. Generic placeholders remain only when the doc is describing an input supplied by the user or a real Spec Kit workflow contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable with scoped `rg` searches.
- [x] Dependencies identified: command docs, setup guides, READMEs, skill docs, feature catalogs, and manual playbooks.

### Definition of Done
- [x] Hardcoded internal packet paths are absent from scoped public docs.
- [x] Accidental non-doc edits are inspected and restored when out of scope.
- [x] Spec packet validates with `validate.sh --strict`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only cleanup with scoped search, targeted replacement, and verification.

### Key Components
- **Search inventory**: Finds concrete internal packet paths and leaked upstream packet references.
- **Public docs/assets**: Commands, setup/install guides, READMEs, skill references, assets, feature catalogs, and manual testing playbooks.
- **Verification**: Confirms the concrete internal paths are gone while generic workflow placeholders remain intentional.

### Data Flow
Search results identify leaked internal paths. Each hit is rewritten to portable wording or a user-provided placeholder. Verification reruns the scoped search and validates this packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Command assets | Public command behavior and prompt contracts | Remove internal upstream packet paths | `rg` for concrete internal path roots |
| Setup/install guides | External setup instructions | Remove packet links and research packet callouts | `rg` for `.opencode/specs/system-spec-kit` and `specs/system-spec-kit` |
| README files | Public overview and folder docs | Rewrite recent-work references without internal packet links | `rg` and diff review |
| Skill references/assets/catalogs/playbooks | Public skill knowledge and test docs | Replace internal provenance with local contract wording | `rg` for concrete internal paths |

Required inventories:
- Same-class producers: `rg -n '.opencode/specs/|specs/system-spec-kit|specs/skilled-agent-orchestration' README.md .opencode/commands .opencode/install_guides .opencode/plugins .opencode/skills`.
- Consumers of changed symbols: not applicable; no code symbols intentionally changed.
- Matrix axes: command assets, setup guides, READMEs, skill references/assets, feature catalogs, manual playbooks.
- Algorithm invariant: concrete internal packet paths are not public documentation contracts.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [x] Create the cleanup spec folder.
- [x] Search public-facing docs and assets for concrete internal spec packet paths.
- [x] Separate internal packet provenance from generic Spec Kit workflow examples.

### Phase 2: Public Doc Cleanup
- [x] Replace command upstream packet paths with local contract wording.
- [x] Remove setup guide and root README internal packet links.
- [x] Replace internal provenance in skill docs, feature catalogs, and manual playbooks where found.

### Phase 3: Verification
- [x] Rerun scoped `rg` searches for concrete internal path roots.
- [x] Review diffs for accidental runtime-file edits.
- [x] Run strict validation for this spec packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static search | Public docs and assets | `rg` |
| Diff review | Ensure changes are doc-surface scoped | `git diff --stat`, targeted `git diff` |
| Spec validation | Cleanup packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec Kit validator | Internal script | Green | Cannot claim packet validation |
| ripgrep | Local tool | Green | Manual fallback would be slower and less reliable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Search replacement damages non-doc runtime files or removes legitimate workflow examples.
- **Procedure**: Use targeted `git diff` to identify the affected hunks and restore only the accidental edits made by this cleanup.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Inventory -> Public Doc Cleanup -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Public Doc Cleanup |
| Public Doc Cleanup | Inventory | Verification |
| Verification | Public Doc Cleanup | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Medium | 20-30 minutes |
| Public Doc Cleanup | Medium | 45-90 minutes |
| Verification | Medium | 20-40 minutes |
| **Total** | | **1.5-2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scope limited to docs/assets/catalogs/playbooks.
- [x] Spec folder created under the requested cleanup parent.
- [x] Verification searches completed.

### Rollback Procedure
1. Inspect `git diff` for the affected file.
2. Restore only the accidental hunk, not unrelated dirty work.
3. Rerun the scoped search and spec validation.
4. Report any remaining intentional generic placeholders.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Targeted hunk reversal only.
<!-- /ANCHOR:enhanced-rollback -->
