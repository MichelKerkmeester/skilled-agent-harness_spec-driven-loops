---
title: "Implementation Plan: Devin manual-testing playbook"
description: "Mirror cli-codex's split-document Feature Catalog template exactly (root file + category folders + universal per-feature template) while reframing the category set against Devin's live-verified 2026-07 surface."
trigger_phrases: ["devin manual testing playbook plan", "DV-NNN scenario authoring plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/006-devin-manual-testing-playbook"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for phase 006 (Planned)"
    next_safe_action: "Author tasks.md and checklist.md; wait for phases 003-005 before implementation"
    blockers: ["devin auth login requires an interactive OAuth browser flow only the operator can complete - blocks scenario EXECUTION, not this phase's authoring work"]
    key_files: ["spec.md", ".opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Devin manual-testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown only - this phase's deliverable is documentation, not code |
| **Framework** | sk-doc's Feature Catalog split-document pattern (root directory file + per-category scenario folders) |
| **Storage** | None |
| **Testing** | sk-doc's `validate_document.py` structural checks + system-spec-kit's `validate.sh --strict` on this phase's own docs |

### Overview
Author a Devin-native manual-testing playbook by mirroring cli-codex's confirmed root-file and per-feature templates verbatim in structure, while reframing the 9 Codex categories down to 8 Devin categories grounded in phase 001's live-verified contract. `permission-modes` replaces `sandbox-modes`; `subagents` replaces `agent-routing`. `hooks`, `cloud-handoff`, and `mcp-integration` are new categories covering genuine Devin capabilities Codex lacks in this shape. `prompt-templates` ports near-verbatim as a shared cli-family pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001's live Devin CLI contract facts are available and unchanged (hooks, permission modes, subagents, cloud handoff, model roster, mcp subcommands).
- [ ] Phases 003 (skill packet), 004 (hook adapter layer), and 005 (model registry) have landed, so the SKILL.md cross-reference target, hook-adapter paths, and current model slugs exist.
- [ ] The 15-20 scenario-count target and 8-category reframing are confirmed against `spec.md`.

### Definition of Done
- [ ] Root file authored with all 17 confirmed sections plus both banners.
- [ ] All 8 categories authored, each with `>=1` `DV-NNN` scenario file, total count in the 15-20 range.
- [ ] Hallucination-fixture scenario present with explicit FAIL criteria.
- [ ] Playbook cross-referenced from `cli-devin/SKILL.md`.
- [ ] sk-doc's `validate_document.py` and this phase's `validate.sh --strict` both report 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split-document Feature Catalog: a root directory/orchestration file plus category subfolders, each holding one or more `DV-NNN` scenario files that carry the full execution contract.

### Key Components
- **Root file** (`manual-testing-playbook.md`): EXECUTION POLICY banner, SELF-INVOCATION GUARD banner, then 17 numbered sections - Overview, Global Preconditions, Global Evidence Requirements, Deterministic Command Notation, Review Protocol and Release Readiness, Sub-Agent Orchestration and Wave Planning, one section per category (8), Automated Test Cross-Reference, Feature Catalog Cross-Reference Index.
- **8 category folders**: `cli-invocation`, `permission-modes`, `subagents`, `hooks`, `session-continuity`, `cloud-handoff`, `prompt-templates`, `mcp-integration`. Each holds `>=1` scenario file using the universal per-feature template (frontmatter with title/description/version, then §1 Overview + Why This Matters, §2 Scenario Contract, §3 Test Execution with Recommended Orchestration Process + 9-column table + Optional Supplemental Checks, §4 Source Files, §5 Source Metadata).

### Data Flow
An operator or AI reads the root file's Feature Catalog Cross-Reference Index, picks a `DV-NNN` scenario, follows the link to its category file, dispatches the real `devin` invocation per the Exact Command Sequence column, captures evidence, and records a PASS/FAIL/SKIP verdict. The root file's Review Protocol and Release Readiness section rolls per-scenario verdicts up into a feature verdict and an overall release-readiness rule, mirroring cli-codex's rules exactly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a new-authoring phase, not a bug fix - the affected-surfaces addendum applies narrowly here, to the one existing-behavior surface this phase's implementation touches.

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `cli-devin/SKILL.md` | Skill discoverability doc (created in phase 003) | Add a cross-reference to the manual-testing playbook | `grep "manual-testing-playbook" cli-devin/SKILL.md` returns `>=1` match |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 003, 004, and 005 have landed (SKILL.md target, hook-adapter paths, current model slugs).
- [ ] Re-verify phase 001's live contract facts remain accurate.
- [ ] Re-confirm the archived `swe-1.6` hallucination-fixture facts against the 018 packet.

### Phase 2: Core Implementation
- [ ] Author the root file's 17-section structure.
- [ ] Author all 8 category folders with their scenario files (target 15-20 total).
- [ ] Add the cross-reference from `cli-devin/SKILL.md` to the playbook.

### Phase 3: Verification
- [ ] Run sk-doc's `validate_document.py` against every playbook file.
- [ ] Confirm scenario count, category coverage, and `DV-NNN` ID sequencing.
- [ ] Run `validate.sh <phase-folder> --strict` on this phase's own spec-kit docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Root file + every scenario file | sk-doc `validate_document.py` |
| Spec-folder | `spec.md`/`plan.md`/`tasks.md`/`checklist.md` | system-spec-kit `validate.sh --strict` |
| Manual (deferred) | Actual `devin` dispatch execution of each scenario | Gated on operator `devin auth login`; out of scope for this phase |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 `cli-devin` skill packet | Internal | Yellow (Planned) | SKILL.md cross-reference target doesn't exist yet; author playbook content independently, add the link once shipped. |
| Phase 004 hook adapter layer | Internal | Yellow (Planned) | `hooks` category can't cite exact adapter script paths yet; author against phase 001's contract, backfill paths later. |
| Phase 005 model registry | Internal | Yellow (Planned) | Model roster note needs current sibling-model slugs; author against phase 001's facts, confirm slugs later. |
| `devin auth login` (operator OAuth) | External | Red (not completed) | Blocks scenario EXECUTION only; does not block authoring. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The category reframing (`permission-modes`, `subagents`, `cloud-handoff`, `mcp-integration`) proves wrong after review, or the operator wants closer mirroring of Codex's category shape.
- **Procedure**: Revert the created `manual-testing-playbook/` directory tree and the `cli-devin/SKILL.md` cross-reference edit; no other surface is touched by this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phases 001-005 precede this phase; phase 007 follows. Playbook authoring can start once phase 001's facts are in hand, but the SKILL.md cross-reference (phase 003), the `hooks` category's adapter paths (phase 004), and the model roster note (phase 005) each depend on their respective predecessor phase landing first.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 006 root file + categories (content) | 001 | 006 SKILL.md cross-reference |
| 006 SKILL.md cross-reference | 003 | 007 |
| 006 `hooks` category exact paths | 004 | 006 verification |
| 006 model roster note | 005 | 006 verification |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm predecessor phases + re-verify facts |
| Core Implementation | High | Root file + ~16-20 scenario files across 8 categories |
| Verification | Low-Medium | Validator runs + count/ID checks |
| **Total** | | **Several authoring sessions once phases 003-005 have landed** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup: not applicable, no data changes.
- [ ] Feature flag: not applicable, documentation only.
- [ ] Monitoring: not applicable.

### Rollback Procedure
1. Revert the `manual-testing-playbook/` directory tree.
2. Revert the `cli-devin/SKILL.md` cross-reference edit.
3. Confirm no other file was touched (`git status` scoped to `cli-external-orchestration/cli-devin/`).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
