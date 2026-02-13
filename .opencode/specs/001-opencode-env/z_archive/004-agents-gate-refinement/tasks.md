# Tasks: AGENTS.md Gate Refinement

Implementation task breakdown.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

## Task List

### Phase 1: Create Constitutional Memory Rules

- [ ] **T1.1** Create `.opencode/skill/system-spec-kit/constitutional/behavioral-rules.md`
  - Add Continuation Validation rule
  - Add Memory Context Loading rule  
  - Add Completion Verification rule
  - Add Memory Save Enforcement rule (already exists, consolidate)

- [ ] **T1.2** Index new constitutional memory file
  - Run `memory_save` on new file
  - Verify it appears in constitutional memory searches

### Phase 2: Modify AGENTS.md

- [ ] **T2.1** Remove Gate 1 (Continuation Validation) box and arrow
  - Delete lines 53-79 (Gate 1 box + arrow)
  - Verify Gate 2 flows correctly

- [ ] **T2.2** Update Gate 3 to ADVISORY
  - Change "MANDATORY" to "ADVISORY" in header
  - Update action text to indicate optional script call
  - Update logic to say "SHOULD" instead of "MUST"

- [ ] **T2.3** Remove Context Health Monitoring section
  - Delete lines 194-210 (entire box)
  - Verify flow still works

- [ ] **T2.4** Consolidate Self-Verification checklist
  - Remove items that duplicate gates
  - Keep: scope drift check, memory save check, original request alignment

- [ ] **T2.5** Slim down Common Failure Patterns table
  - Remove pattern #3 (Skip Memory) - duplicate of Gate 2
  - Remove pattern #4 (Skip Trigger Match) - duplicate of Gate 2
  - Remove pattern #15 (Skip Checklist) - moved to constitutional
  - Remove pattern #16 (Skip Anchor Format) - already in Memory Save Rule
  - Remove pattern #19 (Skip Gate 4) - redundant with Gate 4 definition
  - Renumber remaining patterns

### Phase 3: Verify & Cleanup

- [ ] **T3.1** Verify AGENTS.md structure
  - Check all section references still work
  - Verify Quick Reference table is accurate
  - Count total line reduction

- [ ] **T3.2** Update deprecated constitutional memory file
  - Ensure `specs/.../030-gate3-enforcement/memory/constitutional-gate-rules.md` deprecation notice is current
  - Point to new canonical location

---

## Estimated Impact

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Pre-execution gates | 4 | 3 | -1 |
| Post-execution rules | 4 | 1 (Memory Save) | -3 |
| Self-Verification items | 8 | 4 | -4 |
| Common Failure Patterns | 23 | 18 | -5 |
| Constitutional rules | 1 (deprecated) | 4 | +3 |
| AGENTS.md lines | ~670 | ~550 | -120 |
