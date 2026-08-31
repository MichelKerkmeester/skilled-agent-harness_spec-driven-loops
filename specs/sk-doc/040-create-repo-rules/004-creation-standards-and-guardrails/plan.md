---
title: "Implementation Plan: Phase 4: Creation Standards and Guardrails"
description: "Derive the quality bar from what the eight shipped rules already do, then validate it in both directions: every standard must pass on all eight, and phase 3 thin sample must fail. A bar that passes everything measures nothing."
trigger_phrases:
  - "standards plan"
  - "quality bar derivation"
  - "negative control"
  - "eight rule check"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: Creation Standards and Guardrails

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference document |
| **Framework** | The eight shipped rules as the corpus the bar must already describe |
| **Storage** | `.opencode/skills/sk-doc/sk-create-repo-rule/references/` |
| **Testing** | Apply every standard to all eight rules and to phase 3's thin sample |

### Overview
Derive the bar from what the corpus already does, then prove it in both directions: every standard must pass on all eight shipped rules, and the thin sample from phase 3 must fail. A bar that passes everything measures nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 3's structural floor closed, so standards sit above it rather than restating it
- [x] The thin sample exists as the negative fixture

### Definition of Done
- [ ] Every standard names its failure
- [ ] All eight shipped rules pass every standard
- [ ] The thin sample fails, with the failing tests named
- [ ] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Derive from corpus, validate in both directions. Standards are read out of what eight files already do, not written as an ideal and imposed on them.

### Key Components
- **Section test**: a section exists when it names a failure.
- **Trigger-phrase test**: symptom vocabulary, no cross-rule collision.
- **Binding-sentence test**: one sentence, one obligation.
- **Self-check test**: one item per obligation, not per section.
- **Misreading guard**: when a "what this is not" section is required.

### Data Flow
Corpus to candidate standards, candidate standards to the eight-rule check, survivors to the document, document to the thin sample as a negative control.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/*.md` | The corpus the bar must describe | read-only | md5 set unchanged |
| Phase 3's thin sample | The negative fixture | read-only | Unedited; a fixture you fix proves nothing |
| `references/creation-standards.md` | The bar | create | Every standard cites a rule that meets it |
| `references/README.md`, `SKILL.md` | Routing to it | modify | The standards load at the authoring step |

Required inventories:
- Same-class producers: all eight rules, per standard, no sampling.
- Matrix axes: 5 standards x 8 rules, plus 5 standards x the thin sample.
- Algorithm invariant: a standard enters the document only if all eight pass it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns task state (T001-T010).

### Phase 1: Derive
- [ ] Candidate standards read out of the corpus, each with a failure named

### Phase 2: Validate
- [ ] Every candidate checked against all eight rules; failures either drop the standard or record an exception
- [ ] The thin sample run against the survivors

### Phase 3: Wire
- [ ] Document written, reference router and `SKILL.md` updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Positive | All eight rules pass every standard | Manual application, recorded per rule |
| Negative | The thin sample fails, tests named | Same, recorded |
| Non-duplication | No standard restates a phase-3 assertion | Diff against the assertion list |
| Length | The document fits its own bands | `wc -l` |
| Packet gate | Spec docs validate | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The eight shipped rules | Internal | Green | No corpus to derive from |
| Phase 3's thin sample | Internal | Green | No negative control |
| Phase 3's assertion list | Internal | Green | Cannot check for duplication |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a standard fails on a shipped rule and the rule is right.
- **Procedure**: drop the standard, or record the rule as an exception with its reason. The document is one file; `git checkout` reverts it and nothing downstream depends on it yet.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Corpus --> Candidate standards --> Eight-rule check --> Document
Thin sample -----------------------------------------> Negative control
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Derive | Phase 3 | Validate |
| Validate | Derive | Wire |
| Wire | Validate | Phase 5 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Derive | Medium | 1-2 hours |
| Validate | Medium | the cost is 5 x 8 applications |
| Wire | Low | under an hour |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Corpus md5 captured
- [ ] The thin sample preserved unedited

### Rollback Procedure
1. `git checkout` the standards document and the two hooks
2. Confirm the corpus and the sample are untouched

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->

---

