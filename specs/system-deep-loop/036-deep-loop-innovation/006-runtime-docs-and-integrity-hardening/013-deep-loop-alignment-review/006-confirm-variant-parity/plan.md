---
title: "Implementation Plan: Phase 5: confirm-variant-parity"
description: "Restore each auto step into its confirm twin where the interactive flow reaches it, correct the auto variant where the auto side held the defect, and write a machine-checked census for every remaining difference."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: confirm-variant-parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) plus a CommonJS runner script |
| **Framework** | None |
| **Storage** | Git working tree, JSONL state and status ledgers |
| **Testing** | Vitest |

### Overview
Each divergence was checked against both files before editing. Where the confirm variant was missing behaviour the interactive flow can reach, the step was restored from its auto twin along with the machinery that makes it functional. Where the auto variant was the incorrect one, the auto variant was corrected rather than copied. Everything left over is written into a census block inside the confirm file itself, and four tests now fail if that census stops matching the files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Restore, correct or census, with the census machine-checked

### Key Components
- **Confirm workflow YAMLs**: The interactive surfaces that had been diverging
- **Auto workflow YAMLs**: The reference twins, corrected where they were themselves wrong
- **Census block**: Per-file record of every remaining difference and its reason
- **Parity tests**: Four assertions binding the census to the files

### Data Flow
Each auto step is matched against its confirm twin; the unmatched set is restored or censused; the census is then asserted against the file pair by test.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| deep-review confirm and auto | Sixty-seven auto steps against fifty-five confirm | restore and census | four auto-only steps, four census entries, zero uncensused |
| deep-research confirm and auto | Sixty-nine auto steps against fifty-nine confirm | restore and census | ten auto-only steps, ten census entries, zero uncensused |
| Gateway state writes | Mandated by four prompt packs, wired by none | restore | canonical events staged through the append gateway in all four variants |
| Mechanical post-dispatch gate | Invoked by review-auto only | restore | the verifier is invoked once in each of the four variants |
| Artifact staging | Review-auto left artifacts unstaged against an unqualified documented invariant | correct auto | all four variants stage, commit authority stays with the operator |
| Compiled contracts | Staled by the YAML edits | regenerate | drift check reports OK for three commands |

Required inventories:
- Same-class producers: four workflow YAMLs, both command families.
- Consumers: the orchestrating agent that executes the YAML, and the compiled contract readers.
- Residuals enumerated: fourteen censused steps, one auto-only gateway site inside a censused step, and the ai-council pair which the review measured as non-divergent.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parity | Auto-step coverage or census, census integrity, config and record placeholder parity, gateway wiring | Vitest |
| Drift | Compiled contracts against their sources | node |
| Suite | Whole deep-loop runtime | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A restored step misbehaves on an interactive run
- **Procedure**: Revert this phase's commit; the census records what each restore was for
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | minutes |
| Core Implementation | Low | one dispatch |
| Verification | Med | full suite run |
| **Total** | | **one dispatch plus one suite run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

