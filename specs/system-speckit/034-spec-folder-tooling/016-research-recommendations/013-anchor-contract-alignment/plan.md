---
title: "Implementation Plan: Phase 13: anchor-contract-alignment"
description: "Add a nesting check with the adr-NNN allowance and duplicate-closer detection to ANCHORS_VALID, as a warning after 001 and an error after 011, and align the registry and docs."
trigger_phrases:
  - "anchor contract alignment plan"
  - "ANCHORS_VALID anchor rules plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: anchor-contract-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (orchestrator.ts), JSON (registry), Markdown (docs) |
| **Framework** | spec-kit validator infrastructure |
| **Storage** | Spec folder validation rules and documentation |
| **Testing** | Validator test suite (spec-kit CLI tests) |

### Overview
The operator chose on 2026-10-08: add a nesting check that allows `adr-NNN` to contain `adr-NNN-*`, plus duplicate-closer detection, and reject template-sequence order. The work ships in two steps. Step A, after phase 001 lands: the checks land with nesting at warning severity, and the registry and docs are aligned. Step B, after phase 011 lands: nesting becomes an error. A corpus baseline is captured before each step.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator decision recorded in spec.md section 10 (done 2026-10-08)
- [x] Phase 001 has landed before step A, and phase 011 before step B. Phase 001 is Complete (wave 1, pushed to main). Phase 011's un-nesting is built and census3 finds zero nested documents. Checked 2026-10-09: 011 spec.md reads Status Complete, so this item is met
- [x] Research findings (SH-13) understood (research.md section 5.2)
- [x] Affected files identified (spec.md Files to Change)

### Definition of Done
- [x] All acceptance criteria met (decision recorded, code and docs aligned). See acceptance-criteria.md, AC-001 to AC-007 Met
- [x] Corpus baseline captured before code changes (step A baseline, scratch/anchors-baseline-step-a.md)
- [x] Tests passing, with fixtures updated where they nest (gates/tree5/cli-test.log rc 0)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validator enhancement: extend the anchor validation logic in TypeScript.

### Key Components
- **validateAnchorIntegrity()**: The main validation function in orchestrator.ts that checks anchors
- **Nesting check**: A stack over the anchor events. An open while another anchor is open is reported unless the inner id starts with the outer id plus `-` and the outer id matches `adr-NNN`
- **Duplicate-closer check**: A name closed more times than it is opened is reported
- **Corpus baseline**: Snapshot of validation state before code change
- **Registry and docs**: Updated to match the implementation

### Data Flow
1. Wait for phase 001. Capture the corpus baseline
2. Step A: add both checks, nesting findings at warning severity, duplicate closers at error severity
3. Update validator-registry.json and validation-rules.md to match
4. Re-run the corpus and compare to the baseline
5. Wait for phase 011. Capture a second baseline
6. Step B: raise nesting findings to error severity, and re-run the corpus
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches the ANCHORS_VALID check code and its documentation. Anchor usage in retrieval, merging, and parsing is unaffected.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| validateAnchorIntegrity() in orchestrator.ts | Performs anchor validation | Add the nesting check with the `adr-NNN` allowance and duplicate-closer detection | Unit fixtures: nested `questions` reported, decision-record nesting allowed, duplicate closer reported |
| validator-registry.json ANCHORS_VALID entry | Documents what the check does | Update description to match the code | Verify text matches code behavior |
| validation-rules.md Anchor Rules section | Documents what users must follow | Update to match the code | Verify docs match code behavior |
| Existing spec folders | About 416 live packets nest today | No change to the packets in this phase | Warning in step A, error in step B after 011 repairs them |
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
| Validator behavior | ANCHORS_VALID check on test anchors | spec-kit CLI tests, validate.sh |
| Regression | All spec-kit CLI tests | Vitest (full suite) |
| Manual | Create test packets with various anchor patterns | bash + validate.sh |
| Corpus comparison | Before and after validation on full corpus | validate.sh over specs/ |

Test plan:
1. Capture corpus baseline: run validate.sh on all spec folders and count ANCHORS_VALID findings by severity
2. Step A: implement both checks, nesting as a warning
3. Re-run corpus validation and compare: expect nesting warnings, no new errors except duplicate closers (about 0)
4. Step B after 011: raise nesting to error, re-run, expect about 13 live packets that need a hand fix first
5. Run full spec-kit test suite after each step

Outcome: step B found zero nesting findings in the working tree, so the hand-fix expectation in item 4 was met by 011's un-nesting before the flip. See implementation-summary.md.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decision on anchor rules | External | Decided 2026-10-08 | None |
| Phase 001 (template anchor nesting) | Internal | Complete | Step A waits, or every new Level 2 or 3 scaffold warns |
| Phase 011 (anchor repair mode) | Internal | Complete (011 spec.md, checked 2026-10-09) | Step B waits, or about 400 live packets fail |
| Corpus access for baseline | Internal | Green | Required to measure impact of changes |
| orchestrator.ts source code | Internal | Green | Required to make the code change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test failures indicate the change broke anchor validation
- **Procedure**: `git revert` the commit; the check returns to its original behavior
- **Impact**: Instant rollback; no data effects
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Task | Complexity | Estimated Effort |
|------|------------|------------------|
| Capture corpus baseline | Low | 30 min |
| Implement both checks in orchestrator.ts | Med | 2-3 hours |
| Update registry and docs | Low | 1 hour |
| Testing and comparison | Low | 1 hour |
| **Total** | Med | **4-5.5 hours** |
<!-- /ANCHOR:effort -->

---
