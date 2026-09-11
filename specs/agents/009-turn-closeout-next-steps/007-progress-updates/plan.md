---
title: "Implementation Plan: Phase 7: progress-updates"
description: "Run the four decision tests against the operator's progress-update request before drafting anything, then write only what the verdict admits."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: progress-updates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown. Governance documents, no code |
| **Framework** | The four decision tests in `sk-doc/sk-create-repo-rule` |
| **Storage** | The spec folder itself |
| **Testing** | `validate.sh <folder> --strict`, plus citation resolution by hand |

### Overview
Answer whether forward-looking progress updates may exist as a repo rule before writing one. The
tests run in order against the live corpus, the answer routes the content, and only then does
anything get drafted. The route the tests returned was `AGENTS.md-row`, so no rule file and no
wiring was authored.
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
Gate before draft. The tests decide whether the artifact may exist, and drafting is downstream of a
passing verdict rather than parallel to it.

### Key Components
- **`decision-tests.md`**: owns the four gates and the routing table for every refusal.
- **`REPO RULES.md` section 4**: owns the In and Out boundary that test two reads.
- **`rule-anatomy.md` section 3**: owns the length bands that decide whether a section route exists.
- **`AGENTS.md` Gate 5**: owns when a rule file loads at all, which is what test one turns on.

### Data Flow
The operator's sentence becomes a restated behaviour. That behaviour runs test one, then two, then
three, then four. Each test either refuses and names a destination, or passes it along. The last
answer plus the routing table in `decision-tests.md` section 5 produces the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix and not a deep-review remediation. The table is filled because the proposal touches
shared policy, which the section's own trigger list names.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/communication.md` | Owns reply delivery on every substantive reply | unchanged | `git status` clean for this file; 244 lines, measured with `wc -l` |
| `repo-rules/handoff-and-questions.md` | Owns the turn end and the operator handback | unchanged | Untracked from phase 003 and left alone; the research states the boundary rather than moving it |
| `REPO RULES.md` | Router, trigger table and scope boundary | unchanged by this phase | Carries phase 004's uncommitted diff; `git diff` returns no match for this phase's vocabulary, and no row or widening was added |
| `AGENTS.md` | Always-loaded document, section 3 registers | not modified, one bullet drafted for the operator | Carries phase 004's uncommitted diff; `git diff` returns no match for this phase's vocabulary. The draft lives in `research/research.md` section 7 |

Required inventories:
- Existing homes for the behaviour: read `communication.md` sections 2, 4, 5, 6, 7, 8 and 9 line by line.
- Vocabulary collision: `grep -rn "threshold" repo-rules/` and a roadmap-vocabulary grep across `repo-rules/`, `AGENTS.md` and `REPO RULES.md`.
- Trigger-phrase collision: extract every `trigger_phrases` block from the ten rule files, then `sort | uniq -d`.
- Router-level containment: compare the candidate trigger row against the existing rows in `REPO RULES.md` section 2.
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
| Unit | Each citation resolves to the line it names | `sed -n`, `grep -n` |
| Integration | The packet validates as a phase child of 009 | `validate.sh --strict` |
| Manual | No governance file outside the spec folder changed | `git status --short` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-create-repo-rule` references | Internal | Green | Without the tests there is no basis for a verdict |
| Phase 001 and 006 records | Internal | Green | Without the precedents the same refusal gets re-derived |
| Spec-kit runtime build | Internal | Green | A stale build makes `validate.sh` exit 3 with no rule output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The operator overrides the verdict and directs the rule-file route, as in phase 001.
- **Procedure**: Nothing to revert. This phase changed no file outside its own folder, so the
  override starts from the current state and the research records what an eleventh rule would cost.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read corpus) ──► Core (run four tests) ──► Verify (validate, git status)
```

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
| Setup | Low | Read the corpus and both precedents |
| Core Implementation | Medium | Four tests, the home inventory, the verdict |
| Verification | Low | Strict validation and a clean `git status` |
| **Total** | | **One session, read-mostly** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No governance file modified, so no backup is needed
- [x] No feature flag applies
- [x] No monitoring applies

### Rollback Procedure
1. Nothing to disable. The phase shipped research, not behaviour.
2. If the verdict is overturned, keep the research and author the rule alongside it.
3. Confirm with `git status --short` that `repo-rules/`, `REPO RULES.md` and `AGENTS.md` are untouched.
4. No stakeholder notification applies.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

