---
title: "Implementation Plan: remove em-dashes from authored READMEs"
description: "Replace 909 prose em-dashes across 147 authored READMEs with the punctuation each sentence wants, leaving vendored content, historical records and not-applicable glyphs alone."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: remove em-dashes from authored READMEs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The Human Voice Rules carry an Em Dash Ban with three permitted replacements: comma, full stop,
colon. 1,446 em-dashes sit in READMEs across the repository. 909 of them are in authored files; the
rest are vendored copies of external projects and historical spec records.

A blanket substitution does not work. A comma after a dash whose following clause can stand alone is
a comma splice, which reads worse than the dash.

### Overview

Classify the usages, replace by sentence shape, leave glyphs and vendored text alone, and audit every
changed line against `HEAD` so the sweep cannot drift into prose it was never scoped to.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] The usages are classified before any file is written

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] Zero prose em-dashes, zero comma splices, zero out-of-scope edits
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Rule-driven transform with a line-by-line audit. The transform is mechanical; the check that it did
not damage anything is not.

### Key Components

- **The label rule**: a bulleted bold or code label followed by its explanation takes a colon.
- **The clause rule**: a following clause that can stand alone takes a colon, not a comma.
- **The appositive rule**: a short following fragment takes a comma.
- **The exclusions**: fenced code, ascii art, whole-cell dashes, vendored and historical files.

### Data Flow

Each line is classified, then transformed or left. Nothing crosses a line boundary, which is why three wrapped sentences needed hand fixes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `.opencode/**/README.md` and `README.md` | 689 lines across 147 files |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Classify every usage: prose, table glyph, ascii art, code fence | The counts add up to the total |
| 2 | Bucket by authorship: authored, vendored, historical | Only the authored bucket is in scope |
| 3 | Transform by sentence shape | Read the diff on the heaviest files |
| 4 | Fix the wrapped sentences by hand | Scan for a trailing dash |
| 5 | Audit every changed line against `HEAD` | Zero out-of-scope, zero splices |
| 6 | Run the scanner before and after | The em-dash finding is gone |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| Completeness | Prose em-dash count across the authored set |
| Correctness | Line-by-line audit against `HEAD` for splices and out-of-scope edits |
| Independence | `hvr_scan.py` before and after on the heaviest files |
| Preservation | Whole-cell dashes, code fences and ascii art counted and unchanged |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| The Human Voice Rules | Supply the ban and the three replacements |
| `hvr_scan.py` | The independent check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the README changes. No line without an em-dash was touched, so the revert is exact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `010-readme-human-voice` | Nothing | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Files changed | 147 |
| Lines changed | 689 |
| Em-dashes removed | 909 |
| Left deliberately | 88 glyphs, 13 in code, 530 vendored or historical |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Usages classified before any write
- [x] Every changed line audited against `HEAD`
- [x] Scanner run before and after

### Rollback Procedure
1. `git checkout --` the README set
2. Re-run the scanner; the em-dash finding returns

### Data Reversal

None. Prose only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
classify 1,446 usages: prose / glyph / art / code
        |
        v
bucket by authorship: 909 authored, 377 vendored, 153 historical
        |
        v
transform authored by sentence shape
        |
        v
hand-fix 3 wrapped sentences -> audit every changed line vs HEAD
        |
        v
0 prose dashes, 0 splices, 0 out-of-scope edits
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Classify | The full corpus | Four buckets |
| Transform | The rules | 689 rewritten lines |
| Audit | `HEAD` | Proof of no collateral damage |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The audit, not the transform. A transform that reads well on the files you sampled can still have
damaged the ones you did not, and the only way to know is to compare every changed line against what
it was.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Classified | 909 authored, 377 vendored, 153 historical, 88 glyphs, 13 in code |
| Swept | 689 lines across 147 files |
| Clean | 0 prose dashes, 0 splices, 0 out-of-scope edits |
| Independently confirmed | `hvr_scan.py`: the `punctuation —` finding is gone |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Replace by sentence shape, not by one substitution

**Status**: Accepted, after the first attempt failed

**Context**: The rules permit comma, full stop or colon. The first pass defaulted to a comma, which
produced comma splices wherever the following clause could stand alone.

**Decision**: A colon after a label or before an independent clause, a comma for a short appositive,
a full stop where the continuation was already sentence-shaped.

**Consequences**:
- The prose reads as intended rather than merely lacking dashes.
- The rule set is more complex and needed a line-by-line audit to trust.

**Alternatives Rejected**:
- Blanket comma: produces splices, which the rules would also reject.

### ADR-002: Revert whole rather than patch a bad sweep

**Status**: Accepted

**Context**: The first sweep produced splices. Two follow-up passes tried to repair them and made
things worse, because neither could distinguish its own edits from prose that was always there.

**Decision**: Revert every README and redo the sweep once, with the rule right.

**Consequences**:
- The final diff contains one transformation rather than three layered ones.
- The intermediate work was thrown away, which was cheaper than auditing what each pass had done.

**Alternatives Rejected**:
- Keep patching: each pass compounded the previous one's damage.

### ADR-003: Vendored and historical content keeps its dashes

**Status**: Accepted

**Context**: 377 em-dashes sit in copies of external projects, and 153 in spec records.

**Decision**: Leave both. Sweep only authored files.

**Consequences**:
- A repository-wide grep still finds em-dashes, permanently, and that is correct.
- A vendored README still matches the project it was copied from.

**Alternatives Rejected**:
- Sweep everything: rewrites someone else's prose and falsifies records of what was written then.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
