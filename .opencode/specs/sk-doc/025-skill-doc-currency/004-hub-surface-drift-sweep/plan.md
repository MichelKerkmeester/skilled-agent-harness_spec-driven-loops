---
title: "Implementation Plan: hub-surface-drift-sweep"
description: "Build the two checks no existing gate provides — a relative-link resolver over skill markdown and a dangling-entry check over the install surface — run them before editing to get real starting numbers, then sweep the link rot and orphaned ownership language they expose."
trigger_phrases:
  - "link resolver plan"
  - "install surface repair"
  - "cardinality assertion"
  - "worktree recipe sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep"
    last_updated_at: "2026-08-02T14:32:45Z"
    last_updated_by: "skd025-004-build"
    recent_action: "Executed the planned design, code, git, install, and archive lanes"
    next_safe_action: "Run and record strict packet validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/resolve_skill_markdown_links.py"
      - ".opencode/skills/sk-doc/shared/scripts/check_install_entries.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "All locked operator rulings were applied before their governed edits."
---
# Implementation Plan: hub-surface-drift-sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references and assets, shell install scripts, symlinks |
| **Framework** | A relative-link resolver, a dangling-entry check, count-derivation assertions |
| **Storage** | Repository files only |
| **Testing** | The two introduced checks, plus running the installer's help and tool-specific paths |

### Overview

This phase is volume rather than depth, and the leverage is in measuring before editing. None of the existing gates resolve prose links, which is exactly why twelve of these findings survived a clean hub check — so the first deliverable is a repo-wide relative-link resolver run **before** any edit, to get a real starting count. The second is a dangling-entry check over the install surface with counts derived from the directory rather than retyped. The findings then become a worklist against those two numbers, and the phase's claim at the end is a delta, not an assertion.

Four genuine forks must be answered before the edits they govern. They are not implementation details: quarantining a reachable procedure card, or bumping a version pin that turns out to be a deliberate fixture, would each destroy information.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The four open forks are answered and recorded
- [x] **[OPERATOR-DECISION: Q3 — supplementary findings]** answered, because it sets this phase's arithmetic at 20 or 17
- [x] **[OPERATOR-DECISION: Q7 — shared tooling ownership]** answered, so this phase builds or consumes the link resolver rather than duplicating it
- [x] The canon phase's structure ruling is available, or the conformance-dependent edits are deferred to last

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: link resolver delta reported, dangling-entry check at zero, both installer paths run
- [x] Docs updated (spec/plan/tasks)
- [x] Every count on the touched surfaces derived from disk, not retyped
- [x] No symlink repointed at an unverified target
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measure, then sweep. Two checks provide the measurement; the findings provide the worklist; the delta between the two measurements is the claim.

### Key Components

- **Relative-link resolver** over skill markdown: the durable artifact this phase leaves behind, and the reason the drift went unnoticed.
- **Dangling-entry check** over the install surface: existence per entry, plus counts derived from the directory.
- **Prose-versus-machine drift check** for the two code-hub surface documents: every path in the human map exists and appears in the machine map.
- **Cardinality assertion** for the design hub: README count equals workflow-document count equals non-quarantined files on disk.
- **Reachability check** before any card is quarantined.

### Data Flow

Disk → link resolver → failure count, before and after. Directory listing → count assertion → the number stated in prose. Machine resource map → drift check → the human map. Every stated number has a producer behind it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Two of these findings touch path handling and an executable installer, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Machine resource maps in the code-hub surface documents | Correct authority for resource paths | Unchanged | The human map is matched to it, not the reverse |
| Human reference maps | Consumers that drifted | Update | Prose-versus-machine drift check at zero |
| Shared routing prose and debugging checklist | Consumers pointing at retired locations | Update | Link resolver |
| Motion references and assets | Consumers with external anchors and split version pins | Update per the recorded fork answers | Link resolver; a single version-pin value or an explicit historical label |
| Design-hub registry | Authority for which lanes exist | Unchanged — read-only | Grep for retired lane names in active documents returns zero |
| Design-hub documents and procedure cards | Consumers assigning retired ownership | Update, or quarantine after a reachability check | Cardinality assertion |
| The allocator and its grammar | Authority for branch shape | Unchanged — read-only | Every recipe uses the allocator |
| Git-hub recipes across five files | Consumers teaching a forbidden shape | Update; legacy examples explicitly labelled | Grep returns only labelled legacy |
| Git-hub counts and package map | Consumers with retyped numbers | Update — derived | Count assertion against the playbook inventory |
| Install-surface entries and installer | Broken paths | Update after target verification | Dangling check at zero; both installer paths run |
| Benchmark archive path | Live writer already emits one location | Ratify canon to the writer | Grep the writer's emitted path and the canon statement; they agree |

Required inventories:
- Same-class producers: `rg -n '\]\(\.{1,2}/' .opencode/skills --glob '*.md'` to find every relative link, not only the reported ones — this is the whole point of the resolver.
- Consumers of changed symbols: for each renamed path, `rg -n '<old-path-fragment>' .opencode/` before declaring the rename complete.
- Matrix axes: hub × document class (SKILL.md, README, reference, asset, procedure card) × claim type (path, count, ownership). The findings cover a subset; the resolver covers the rest.
- Algorithm invariant: link resolution is case-sensitive, ignores anchors and external URLs by design, and reports the exclusion counts so the number is interpretable.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm all 20 items against HEAD, design-hub group and the three supplementary items first
- [x] Build or consume the relative-link resolver; run it before any edit and record the count
- [x] Build the dangling-entry check; run it and record the result
- [x] Answer and record the four open forks

### Phase 2: Core Implementation
- [x] Code-hub lane: human maps matched to machine maps; retired locations repointed; motion anchors, pins and labels resolved per the fork answers
- [x] Design-hub lane: lane ownership, cardinality, orphan cards after a reachability check, always-loaded resources
- [x] Git-hub lane: allocator recipes across five files, derived counts, integration-document contradiction
- [x] Install lane: verify replacement targets, repoint, repair the installer, derive the counts
- [x] Benchmark lane: ratify the archive path

### Phase 3: Verification
- [x] Re-run the link resolver; report the delta and the phase-scoped subset separately
- [x] Re-run the dangling-entry check: zero
- [x] Run the installer's help or dry-run path and the tool-specific path
- [x] Run the prose-versus-machine drift check and the cardinality assertion
- [x] Confirm every scope item reached a terminal state
- [x] `validate.sh --strict` at Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Link resolver on a case-mismatched link, an anchor-only link and an external URL | The repo's Node test runner |
| Unit | Dangling-entry check on a symlink whose target is outside the repository root | Same |
| Integration | Installer help or dry-run path, and the tool-specific path | Shell |
| Manual | Reachability of each orphan procedure card before quarantine | Reading the choreographies |
| Regression | Link-resolver count before and after | The resolver itself |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The canon phase's structure rulings | Internal | Yellow | Conformance-dependent edits wait; link and install lanes proceed |
| The first phase's fleet-gate re-baseline | Internal | Yellow | No-regression claims unfalsifiable |
| A link resolver from another track | Internal | Yellow | Either consumed or built here — never both |
| Replacement targets for the dangling entries | Internal | Green | Verified before repointing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the design-hub confirmation rate collapses because the consolidation moved more than expected; a repointed symlink turns out to break the installer differently.
- **Procedure**: revert the phase's commits, re-run the link resolver and the dangling-entry check, and confirm the recorded pre-edit numbers return. Re-run both installer paths after any symlink revert — a reverted link that leaves a stale target is not a rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Confirm (design first) ──► Checks built + baseline run ──► Fork answers ──┬──► Code-hub lane
                                                                          ├──► Design-hub lane
                                                                          ├──► Git-hub lane
                                                                          ├──► Install lane
                                                                          └──► Benchmark lane
                                                                                   │
                                                                                   ▼
                                                                             Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm | None | Everything |
| Checks + baseline | Confirm | Every delta claim |
| Fork answers | Confirm | Code-hub and design-hub lanes |
| Code-hub lane | Fork answers | Verification |
| Design-hub lane | Fork answers, reachability check | Verification |
| Git-hub lane | Confirm | Verification |
| Install lane | Target verification | Verification |
| Benchmark lane | Fork answer on the archive path | Verification |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Building the resolver is the bulk; confirmation is wide but shallow |
| Core Implementation | High | Five lanes, ~35 files, mostly mechanical once the forks are answered |
| Verification | Low | The checks do the work |
| **Total** | | **Volume-dominated; the only slow parts are the resolver and the reachability checks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Link-resolver failure count recorded over all skill markdown
- [x] Dangling-entry check result recorded
- [x] Installer paths exercised and their current behaviour recorded
- [x] The fleet-gate re-baseline from the first phase is available and cited

### Rollback Procedure
1. Revert the phase's commits.
2. Re-run the link resolver; confirm the recorded pre-edit count.
3. Re-run the dangling-entry check; confirm the recorded pre-edit state.
4. Re-run both installer paths and confirm they behave as recorded.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Symlink changes revert with the commit; verify the targets after reverting.
<!-- /ANCHOR:enhanced-rollback -->

---
