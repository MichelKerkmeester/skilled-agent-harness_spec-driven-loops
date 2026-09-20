---
title: "Implementation Plan: Phase 6: Always-Loaded Routing Compression"
description: "Take an independent fresh-model review of four AGENTS.md routing sections, re-verify its load-bearing claims, and act only on what survives. Three compress, one stays untouched, and the mcp-code-mode skill is corrected first so the always-loaded registration inventory is not the last accurate copy when it is deleted."
trigger_phrases:
  - "routing compression plan"
  - "independent review verification"
  - "decommissioned server removal"
  - "dangling reference sweep"
  - "byte accounting"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: Always-Loaded Routing Compression

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown read by agents at load time; one shell script and three command assets left untouched by design |
| **Framework** | The always-loaded document plus the skill tree it points into |
| **Storage** | Git working tree |
| **Testing** | Reference-resolution sweeps, byte accounting against the prior commit, `validate.sh --strict` |

### Overview
Take an independent review of four routing sections, re-verify its load-bearing claims, then act only on what survives. Three sections compress; one stays untouched because its value is that it fires rather than that it informs. Order matters in one place: the `mcp-code-mode` skill had to be corrected *before* the `AGENTS.md` registration inventory was cut, because until then the inventory was the repository's only accurate statement about the decommissioned server.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator approval for the `AGENTS.md` edits recorded
- [x] An independent review completed by a fresh model with no access to the first reader's conclusions
- [x] The review's load-bearing claims re-verified rather than adopted

### Definition of Done
- [x] All acceptance criteria met
- [x] No dead command or decommissioned server named outside `specs/`
- [x] Every reference the cuts could dangle resolves
- [x] Byte delta measured against the prior commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Review, verify, then act — with the verification step owned by a different reader than the review. The review was briefed with evidence and constraints and deliberately without the first reader's leanings, so agreement between the two means something.

### Key Components
- **The four verdicts**: keep, compress, split, compress.
- **The ordering constraint**: skill corrected before the always-loaded inventory is cut.
- **The relocation**: the `cli`-manual naming exception moved to the reference an agent reaches when it hits the error.
- **The recorded non-actions**: doctor tooling and a broken link in another skill, named and left.

### Data Flow
Independent review produces verdicts with citations. Each load-bearing citation is re-opened. Surviving verdicts become edits. Every cut is swept for dangling references in both directions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Cuts to an always-loaded document strand references silently, so the inventory runs in both directions.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` code-search tree | Named tools absent from this runtime | update — capabilities named, tools as examples | The bullet that referenced "the Grep, Glob, and Read routes above" reworded in the same pass; 0 dangling |
| `AGENTS.md` MCP routing | Restated three config files; said "enumerate at runtime" three times | update — inventory deleted, statement made once | Config roster re-read before deleting the inventory |
| `AGENTS.md` Quick Reference | Named a command dead six weeks | update — dead token dropped, restated mechanics dropped | Every remaining command path resolved |
| `AGENTS.md` Gate 2 artifact trigger | The only surviving routing obligation while the advisor is down | unchanged — reason recorded | Advisor connection state observed live this session |
| `mcp-code-mode/SKILL.md`, `README.md` | Documented a decommissioned server as live | update — 14 mentions removed, 1 explanatory note kept | `rg -c` before and after |
| `mcp-code-mode/references/naming-convention.md` | Showed `"mcp"` five times, never explained `cli` | update — exception added as Mistake 0 | The `AGENTS.md` pointer resolves to it |
| Doctor tooling, cleanup scripts, changelogs, benchmark reports | Also name the retired server | not a consumer of this change — deliberately untouched | Classified by meaning before exclusion |

Required inventories:
- Same-class producers: `rg -n -i 'sequential.?thinking'` across the repo excluding `specs/` and `node_modules`, classified into misleading, behavioral, historical, and different-meaning.
- Consumers of changed symbols: every command path, capability route, and `repo-rules/` link in `AGENTS.md` re-resolved after the cuts.
- Matrix axes: candidate (4) x verdict (keep, compress, split); plus reference class (4) x action (fix, leave).
- Algorithm invariant: no sentence unique to the repository is removed — checked by grep before each deletion, not after.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T015); the stages below say what each one has to establish before the next can start.

### Phase 1: Review and verify
- [x] Independent review dispatched with evidence and constraints, and without the first reader's conclusions
- [x] Four load-bearing claims re-opened and confirmed; the review's own line count corrected

### Phase 2: Correct, then cut
- [x] `mcp-code-mode` corrected first, so the always-loaded inventory was not the last accurate copy when it was deleted
- [x] The `cli` naming exception relocated to the reference that owns it
- [x] B, C and D applied; A left untouched with the reason recorded

### Phase 3: Sweep
- [x] Dangling-reference sweep in both directions, byte accounting, and the adjacent defects recorded rather than fixed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Claim verification | Four load-bearing review claims re-opened before any edit | `git log --diff-filter=D`, `rg`, byte measurement |
| Uniqueness | Sentences with no other home survive the cut | `rg` across `repo-rules/` and `.opencode/skills/` before deleting |
| Dangling references | Tool names, command paths, rule links, cross-section pointers | Targeted `grep` per removed phrase |
| Command resolution | Every command named in `AGENTS.md` | Existence check against both runtime command directories |
| Reference classification | Every `sequential thinking` hit sorted before acting | Read each in context; concept usages excluded |
| Byte accounting | Delta against the prior commit | `git show HEAD:AGENTS.md | wc -c` versus working tree |
| Packet gate | Spec docs validate | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval for `AGENTS.md` | External | Green — granted in the instruction that opened this phase | The phase blocks entirely |
| An independent reviewer | Internal | Green — fresh model, briefed without the first reader's conclusions | Every verdict would rest on one lens, which the packet's own rule refuses for judgment calls |
| `mcp-code-mode` corrected before the inventory cut | Internal | Green — sequenced deliberately | Deleting the inventory first would leave only the stale skill |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a compressed section turns out to have carried something load-bearing, or a weaker model is observed failing at a lookup the table used to serve.
- **Procedure**: each candidate is a separate hunk, so one reverts without the others. The `mcp-code-mode` correction should not be reverted with them — it fixed a real inaccuracy independent of the compression.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Review --> Verify claims --> Fix the skill --> Relocate --> Cut B/C/D --> Sweep
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Review | Operator approval | Verify |
| Verify claims | Review | Fix the skill |
| Fix the skill | Verify | Cut C |
| Relocate the naming rule | Verify | Cut C |
| Cut B, C, D | Fix the skill, Relocate | Sweep |
| Sweep | Cut | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Review and verification | Medium | ~10 minutes of agent wall-clock plus re-verification |
| Core Implementation | Medium | 1-2 hours |
| Sweep | Low | under an hour |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Each candidate kept as a separate hunk
- [x] Uniqueness checked before each deletion, not after
- [x] The skill corrected before the always-loaded inventory was cut

### Rollback Procedure
1. Identify the candidate behind the regression
2. Revert that hunk only
3. Leave the `mcp-code-mode` correction in place — it is independent
4. Re-run the reference sweeps

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

