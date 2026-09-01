---
title: "Implementation Plan: Phase 1: human-voice-playbook"
description: "Gives sk-create-with-human-voice the manual testing playbook it never had: a root document plus nine scenarios in three categories, covering the text the mode must flag and the text it must leave alone. The scoring scenarios run the packet's own shipped fixtures rather than invented input, and the same validator-versus-loader frontmatter conflict found in phase 005 is resolved the same way."
trigger_phrases:
  - "human voice playbook plan"
  - "tell detection scope gate"
  - "shipped fixture scoring"
  - "voice mode scenario categories"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: human-voice-playbook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario documents under `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/` |
| **Framework** | The sk-doc manual-testing-playbook package contract at its `FAIL_CLOSED` tier, plus the skill-benchmark scenario loader |
| **Storage** | None. A playbook package is markdown on disk with no runtime state |
| **Testing** | `validate-playbook-package.cjs`, the benchmark scenario loader, `d5-connectivity.cjs`, and the mode's own scanner run against its shipped fixtures |

### Overview
The mode that enforces the voice standard had no playbook, so nothing stated what correct behaviour looks
like for it and the benchmark loader found no scenarios to score it on. This phase writes nine scenarios in
three categories, splitting them along the two directions the spec asked for: the text the mode must flag,
and the text it must leave alone. Nothing in the mode itself is edited. This phase tests the mode, it does
not change what the mode enforces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — spec.md §2 gives the measured gap (three of thirteen sk-doc modes have a playbook) and §3 puts the other eight and any change to the standard out of scope
- [x] Success criteria measurable — SC-001 is a validator verdict, SC-002 is a loader count against files on disk, SC-003 is a pair of scanner runs with expected scores and exit codes
- [x] Dependencies identified — the playbook package contract and its validator, the benchmark loader, and the packet's own shipped clean and dirty fixtures

### Definition of Done
- [x] All acceptance criteria met — this phase has no `acceptance-criteria.md`; its spec.md carries the acceptance criteria inline, and REQ-001, REQ-002 and REQ-003 plus SC-001, SC-002 and SC-003 are each satisfied with the evidence quoted in tasks.md Phase 3
- [x] Tests passing (if applicable) — `PASS package=sk-doc/sk-create-with-human-voice tier=FAIL_CLOSED scenarios=9 categories=3 operator=9 routing_gold_excluded=0 violations=0 warnings=0`, and the loader reports `shape=sk-doc scenarios=9 warnings=[]`
- [x] Docs updated (spec/plan/tasks) — plan.md, tasks.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002/003
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not a software architecture. The structure is the playbook package contract: a root document carrying the
scenario index, kebab-case category directories, one scenario per file, and frontmatter shaped so that both
of the package's readers can use it.

### Key Components
- **`tell-detection/`** (HVT-001 to HVT-003) — the text the mode must flag: the hard-blocker terms, a word whose sense makes it a candidate rather than a certainty, and a judgment pass the scanner does not cover.
- **`scope-gate/`** (HVS-001 to HVS-004) — the text the mode must leave alone: named exempt spans, code and quotations, a document about the standard itself, and the rule that accuracy outranks the standard.
- **`scoring-and-rescan/`** (HVR-001 to HVR-002) — the arithmetic and the rescan, priced against the packet's own shipped fixtures rather than invented input.
- **The frontmatter shape** — identical to the frontmatter mode's package, and for the identical reason: the package validator and the benchmark loader read the same block under mutually exclusive rules.

### Data Flow
Each scenario names a command, an input and an expected result. The package validator reads every scenario's
frontmatter and body to decide whether the package conforms; the benchmark loader reads the same frontmatter
for `id`, `expected_intent`, `expected_resources` and `expected_leaf_resources` to decide whether the mode
has anything to be scored on. The two scoring scenarios additionally run the mode's own scanner over the
fixtures the packet already ships, so their expected numbers come from the packet rather than from this
phase.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Four checks, each answering a different question. `validate-playbook-package.cjs` answers whether the package
conforms to its own contract at the fail-closed tier. The benchmark scenario loader answers whether the
benchmark can see the scenarios at all, which is the gap this phase exists to close. `d5-connectivity.cjs`
answers whether every resource the scenarios name resolves on disk. And the mode's own scanner, run over the
packet's shipped clean and dirty fixtures, answers whether the two scoring scenarios describe what the tool
actually does. The playbook's own prose was also scanned with the tool it documents, which is the sharpest
available check on a document about a voice standard.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The playbook package contract and its validator | Internal | Green — `PASS` with zero violations and zero warnings | No package verdict |
| The benchmark scenario loader | Internal | Green — `shape=sk-doc scenarios=9 warnings=[]` | REQ-002 unanswerable, and the mode stays unscored |
| The packet's shipped clean and dirty fixtures | Internal | Green — both executed, and both match the scenarios written against them | SC-003 would rest on invented input rather than on what the packet ships |
| Phase 005's frontmatter finding | Internal, upstream | Green — the same conflict applies here and is resolved the same way | The package would report `SKIP` at exit 0 and be silently excluded from every sweep |
| `playbook-failclosed-allowlist.txt` | Internal | Green — enrolled alongside the frontmatter package | The package's clean state would be incidental rather than enforced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/` and delete its line from
`playbook-failclosed-allowlist.txt`, then rerun the fleet sweep and confirm the package count drops by one
with zero FAIL. Nothing else needs reverting, because this phase edits nothing inside the mode: it adds a
package and one allowlist line, and both reversals are deletions.
<!-- /ANCHOR:rollback -->

---

