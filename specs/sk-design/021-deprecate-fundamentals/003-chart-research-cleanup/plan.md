---
title: "Implementation Plan: Phase 3: chart-research-cleanup"
description: "Read each chart citation against the rule it backs, state the rule on its own, remove the pointer and prove the result with the document validator and a sweep of every design mode."
trigger_phrases:
  - "chart research cleanup plan"
  - "chart citation removal plan"
  - "sk-design-chart cleanup steps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: chart-research-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documents |
| **Framework** | Skilled skill hub with the `sk-design-chart` mode |
| **Storage** | None |
| **Testing** | `validate_document.py`, an `rg` sweep and `validate.sh --strict` |

### Overview
Remove each research citation from the four chart files and state the rule it backed in place. Sweep every `sk-design` mode so a second leak cannot hide behind the four known files. Prove it with `VALID 0 issues` on the four documents and `RESULT: PASSED` from the packet gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `validate_document.py` reports VALID 0 issues on the four chart files and the changelog
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup --strict` prints RESULT: PASSED
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Documentation cleanup with a source review.

### Key Components
- **The four chart files**: Each states its own rules, figures and decisions.
- **The document validator**: Checks structure, frontmatter and metadata on each file.
- **The sweep**: Finds every remaining research mention across the design modes and classifies it.

### Data Flow
A reader opens a chart reference. Each rule names its own case and carries the figure or decision that supports it. No sentence sends the reader to a research packet or to a phase that no longer exists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section for the citation gap that four chart files carry.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design-chart/references/color-system.md` | Owns the role split and the categorical gates | update | `validate_document.py` reports VALID 0 issues |
| `sk-design-chart/references/catalog.md` | Owns the palette catalog and the radar and pie decision | update | `validate_document.py` reports VALID 0 issues |
| `sk-design-chart/references/template-contract.md` | Owns the template rules and the type scale | update | `validate_document.py` reports VALID 0 issues |
| `sk-design-chart/assets/style-reference/evilcharts/origin.md` | Owns the evilcharts provenance | update | `validate_document.py` reports VALID 0 issues |
| `sk-design-chart/SKILL.md` | Carries the mode version | update | `rg -n 'version: 0.23.7.0'` prints one line |
| `sk-design-diagram`, `sk-design-md-generator` and `mcp-figma` | Own their own documents | not a consumer | The sweep finds no research citation |

Required inventories:
- Same-class producers: `rg -n '\[SOURCE:|Phase 13|this phase|from the research|another packet' .skilled/skills/sk-design` lists every citation before the cleanup.
- Consumers of the cleaned rules: the `sk-design-chart` reader, plus the changelog that records the release.
- Matrix axes: file (four), citation kind (source line, phase name, narrative reference) and hit class (citation, changelog record, benchmark record, site description).
- Algorithm invariant: not applicable, no path, parser, resolver or security code changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup reads the four files and records each citation and the rule it backs. Implementation states each rule in place and removes each pointer. Verification sweeps the design modes, runs the document validator and runs the packet gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The four chart documents against the document contract | `validate_document.py` |
| Integration | Every `sk-design` mode against the research sweep | `rg` |
| Manual | Each changed section read against the rule it states | Read, no browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate_document.py` | Internal | Green | No document verdict and no proof the cleanup is clean |
| The `sk-design-chart` document set | Internal | Green | No rule to state and no file to clean |
| Node and Python tooling in the repo | Internal | Green | The validator and the packet gate cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A rule loses its meaning when the citation goes, or the sweep finds a citation the cleanup missed.
- **Procedure**: Revert the phase commit. Git history keeps the prior text, and the four files return with their citations.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
