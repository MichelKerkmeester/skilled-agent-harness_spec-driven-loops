---
title: "Implementation Plan: Create-Benchmark Resource Reorganization and Routing"
description: "Apply one mechanical resource reorganization, rewrite path consumers, and add the same four routing terms to the packet contract and hub metadata. Verify the package, path graph, and phased spec recursively."
trigger_phrases:
  - "create benchmark reorganization plan"
  - "benchmark routing coverage plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/001-organize-benchmark-resources-and-routing"
    last_updated_at: "2026-07-13T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned moves, rewrites, routing, and verification"
    next_safe_action: "Execute git mv operations"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Create-Benchmark Resource Reorganization and Routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML |
| **Framework** | OpenCode skill and system-spec-kit contracts |
| **Storage** | Git worktree files |
| **Testing** | package_skill.py, git grep, validate.sh |

### Overview
Create the requested family subfolders, move each tracked resource with `git mv`, and rewrite links and command paths according to the new family ownership. Add identical family vocabulary to the packet source and hub routing metadata, without running registry generation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact move map and allowed write paths supplied by the operator.
- [x] Current resource layout, routing schema, packet state, and consumers inventoried.
- [x] Canonical Level 2 templates and authoring checklists loaded.

### Definition of Done
- [ ] Sixteen resources retain Git rename history.
- [ ] All writable active consumers use new family paths.
- [ ] Package check and recursive strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Family-keyed resource organization under conventional top-level `assets/` and `references/` roots.

### Key Components
- **Packet source contract**: `create-benchmark/SKILL.md` owns family vocabulary and resource maps.
- **Hub routing metadata**: `mode-registry.json` and `hub-router.json` make the vocabulary effective immediately.
- **Consumers**: command assets, agents, skill READMEs, and lane-owned guides point to moved resources.

### Data Flow
Authoring intent matches hub vocabulary, loads the packet SKILL, and follows a family-specific guide or template path. The subsequent registry regeneration can recover the same terms from the packet source contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create-benchmark` resources | Authoring templates and guides | Move into family folders | Exact path inventory and Git status |
| Packet and hub routing | Select create-benchmark for authoring prompts | Add four family terms | JSON parse and exact-term search |
| Repository consumers | Load or link packet resources | Update path only | Exact filename search and link checks |
| Frozen historical specs and banned script source | Historical evidence or tool waiver | Unchanged | Report residuals separately |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Load required skills, templates, checklists, packet metadata, and consumer inventory.
- [x] Create one combined Level 2 child packet.

### Phase 2: Core Implementation
- [ ] Create eight family subfolders and run the 16 exact `git mv` operations.
- [ ] Rewrite packet-local and active consumer paths.
- [ ] Add durable and immediate family routing vocabulary.

### Phase 3: Verification
- [ ] Run package validation and JSON parsing.
- [ ] Run dangling-reference searches and inspect residuals.
- [ ] Complete child documentation and run recursive strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Exact resources and Git renames | Glob, `git status --short` |
| Configuration | Routing JSON syntax and terms | JSON parser, Grep |
| Package | create-benchmark skill contract | `package_skill.py --check` |
| Integration | Packet phase shape and canonical docs | `validate.sh --recursive --strict` |
| Reference | Old and new resource paths | `git grep`, markdown link checker when permitted |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git rename tracking | Internal | Green | Move history cannot be preserved. |
| create-benchmark package checker | Internal | Green | Package validity cannot be confirmed. |
| system-spec-kit validator | Internal | Green with stale-dist warning | Recursive packet validity cannot be confirmed if runtime fails. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A move targets the wrong family, a path rewrite changes behavior, or validation cannot be restored within scope.
- **Procedure**: Reverse only this workstream's uncommitted `git mv` operations and patches; leave unrelated worktree files untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Child packet -> Resource moves -> Path rewrites -> Routing vocabulary -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Inventory and packet scaffold |
| Core Implementation | Medium | Sixteen moves and bounded path rewrites |
| Verification | Medium | Package, references, and recursive spec gates |
| **Total** | | **Single implementation session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No commit, push, stash, or staging operation will run.
- [x] Existing worktree changes were identified and excluded.
- [x] All moves are reversible tracked renames.

### Rollback Procedure
1. Identify only paths changed by this workstream from Git status and diff.
2. Reverse incorrect renames with `git mv`.
3. Reverse only corresponding path and routing patches.
4. Re-run package and recursive spec validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; this work changes tracked documentation and configuration only.
<!-- /ANCHOR:enhanced-rollback -->
