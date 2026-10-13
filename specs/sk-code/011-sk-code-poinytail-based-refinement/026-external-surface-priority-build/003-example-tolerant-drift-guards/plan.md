---
title: "Implementation Plan: Example-tolerant drift guards"
description: "Filter the hard-coded surface lists to packets on disk, skip archived gold for undeclared modes, anchor the prose scan on the first map heading and count surfaces from the registry, each with one test, then prove the removal copy passes and the pristine tree does not move."
trigger_phrases:
  - "example tolerant drift guards plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Example-tolerant drift guards

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/`; `run-all-drift-guards.sh` |

### Overview
Four in-place edits to two guard scripts. Each reads data the tree already has: the packet directories on disk, the leaf manifest's declared modes, the ROUTER.md headings and the registry's surface modes. Nothing new is minted or stored.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Derive the checked set from the tree instead of a fixed list

### Key Components
- **`SURFACES`, `SURFACE_PACKETS`** (`verify-router-sync.cjs:31-32`): the union-child sets check 2 reads
- **`proseExplicitPaths`** (`:124-133`): leg 1a's prose scan between two section anchors
- **Leg 3** (`:242-252`): resolves each archived route-gold destination through `LEAF_CONTRACT.qualifiedIdToLeaf`
- **`TWO_SURFACE_WORDING`** (`verify-doc-claims.cjs:42-44`) and its loop (`:316-321`)

### Data Flow
`run-all-drift-guards.sh` runs router-sync, doc-claims and the other guards and exits non-zero on any failing check. The guards read the hub's ROUTER.md, registry, leaf manifest and archived route gold.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `verify-router-sync.cjs` | Router drift guard | Update | T1 to T3, P10-1 to P10-3, P10-5 |
| `verify-doc-claims.cjs` | Doc-claims guard | Update | T4, P10-4 |
| `run-all-drift-guards.sh` | Completion gate wrapper | Unchanged | P10-1 |
| sk-code-opencode `SKILL.md` and changelog | Packet edition | Release | sk-code doctor 13d |

Required inventories:
- Same-class producers: `grep -nE "sk-code-(webflow|obsidian)|WEBFLOW|three surfaces" .skilled/skills/sk-code/sk-code-opencode/assets/scripts/*.cjs` lists every hard-coded example reference; each is changed or shown not to block a removal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Removal recipe for the copy, research F84: delete both example packets; drop both modes from `mode-registry.json` (their `modes` entries and `extensions.surface-axis.surfaces`) and from `hub-router.json` (`tieBreak`, `routerSignals`, the four `code-webflow-*` and `code-obsidian-*` classes); run `generate-leaf-manifest.cjs --write .skilled/skills/sk-code`; refresh and copy the manifest to its authored twin; drop the deleted paths from ROUTER.md section 11 RESOURCE_MAP, then drop the nine emptied keys from both RESOURCE_MAP and INTENT_SIGNALS. The copy base is research run V0's, built under the session scratchpad with `.opencode` kept.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | T1 to T4 | `node --test` |
| Integration | Live wrapper and the removal copy | `run-all-drift-guards.sh`, `verify-router-sync.cjs` |
| Regression | Pristine check 2 output | A diff of the live and pristine-copy output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026 planning commit on origin/main | Internal | Waits on the operator's merge | The worktree lacks this spec folder |
| Archived route gold under `specs/sk-doc/z_archive/019-skill-routing-refactor/` | Internal | Present | Leg 3 reports `route-gold not found`, as today |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The live wrapper fails or a pristine check moves.
- **Procedure**: Revert this phase's commits, the release included.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

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
| Setup | Low | Worktree, baseline, removal copy |
| Core Implementation | Med | Four edits and four tests |
| Verification | Med | Copy runs and a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline per-check output of the live wrapper saved in scratch

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the live wrapper and compare with the baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
