# Implementation Plan: AGENTS.md Gate Refinement

Technical approach for simplifying the gate system.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

## 1. IMPLEMENTATION APPROACH

### Phase 1: Create Constitutional Memory Rules
Create new constitutional memory rules for converted gates:

```markdown
# Constitutional Rules (Always Active)

1. **Continuation Validation**: When message contains "CONTINUATION - Attempt" pattern, validate claimed state against spec folder's memory files before proceeding

2. **Memory Context Loading**: When resuming existing spec folder (Gate 4 option A or C), load memory context using memory_search({ specFolder, includeContent: true })

3. **Completion Verification**: Before claiming "done/complete/finished", verify all checklist.md items are marked with evidence

4. **Memory Save Enforcement**: Memory files MUST use generate-context.js script, NEVER Write tool on memory/ paths
```

### Phase 2: Modify AGENTS.md Section 2

1. **Remove Gate 1 box** entirely (lines 53-78)
2. **Update Gate 3** to say "ADVISORY" instead of "MANDATORY"
3. **Remove Context Health Monitoring box** (lines 195-210)
4. **Remove redundant Self-Verification items** that duplicate gates
5. **Remove redundant Common Failure Patterns** (#3, #4, #15, #16, #19)

### Phase 3: Update Flow Diagram

Update the pre-execution gate flow to show only Gates 2-4:

```
Gate 2 → Gate 3 (Advisory) → Gate 4 → EXECUTE
```

---

## 2. FILE CHANGES

### Files to Modify:
1. `AGENTS.md` - Main changes
2. `.opencode/skill/system-spec-kit/constitutional/` - New constitutional rules file

### Files to Update (deprecated flag):
1. `specs/003-memory-and-spec-kit/z_archive/030-gate3-enforcement/memory/constitutional-gate-rules.md` - Already deprecated, verify deprecation

---

## 3. DETAILED CHANGES

### AGENTS.md Line-by-Line Changes:

| Section | Lines | Change |
|---------|-------|--------|
| Gate 1 box | 53-78 | REMOVE entirely |
| Gate 1 arrow | 79 | REMOVE |
| Gate 3 | 93-98 | Change "MANDATORY" to "ADVISORY" |
| Context Health Monitoring | 195-210 | REMOVE entirely |
| Self-Verification | 241-250 | Remove items #2, #3, #4 (duplicate gates) |
| Common Failure Patterns | 297-321 | Remove rows #3, #4, #15, #16, #19 |

### New Constitutional Memory File:

Location: `.opencode/skill/system-spec-kit/constitutional/behavioral-rules.md`

Content will include 4 rules extracted from removed gates.

---

## 4. VALIDATION

After changes:
1. Verify AGENTS.md still parses correctly
2. Verify gate flow diagram shows Gates 2-4
3. Verify constitutional rules are indexed by memory system
4. Count line reduction (target: 100-150 lines)

---

## 5. ROLLBACK PLAN

If issues arise:
1. Revert AGENTS.md from git
2. Delete new constitutional memory file
3. Re-run memory indexer

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
