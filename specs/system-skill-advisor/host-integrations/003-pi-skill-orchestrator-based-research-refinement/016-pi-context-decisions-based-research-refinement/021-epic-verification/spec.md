---
title: "Feature Specification: Phase 21: epic-verification"
description: "The epic's claims about the advisor were checked by the sessions that built them. A fresh Fable 5.2 high read checks the Ollama changes and the other main changes since v4.1.0.0 against the code at HEAD, claim by claim."
trigger_phrases:
  - "epic verification"
  - "phase 21 epic verification"
  - "verify advisor ollama changes"
  - "fable verification of the advisor epic"
importance_tier: "normal"
contextType: "review"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: epic-verification

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `main` (report-only, no code change) |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-review-p1-fixes |
| **Successor** | None |
| **Handoff Criteria** | `evidence/report.md` gives a verdict with file:line for every listed claim |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the pi-context-decisions refinement packet, a report-only verification like phase 017.

**Scope Boundary**: read the code and write one report. No code, doc or config change.

**Dependencies**:
- Phases 001 to 020 merged to main.
- The `claude2` account for the Fable 5.2 dispatch.

**Deliverables**:
- `evidence/report.md`, one verdict per claim plus any defects, ranked
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The epic changed the advisor in 49 commits since tag v4.1.0.0. Each claim about that work was checked by the session that built it, through its own tests and its own reading. Nobody outside those sessions has checked the claims as a set against the code at HEAD, with the Ollama path first.

### Purpose
One independent report says which claims hold, which hold only in part and which do not, with sources, and names any defect the earlier checks missed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git log --oneline v4.1.0.0..HEAD -- .skilled/skills/system-skill-advisor | wc -l
      49
$ git rev-parse --short HEAD
7ee80c87364
$ rg -n "semantic_shadow" .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts
13:  { id: 'semantic_shadow', defaultWeight: 0, defaultShadowWeight: 0.05, live: true },
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dispatch one read-only Fable 5.2 high review through `claude2` with the claim list in `scratch/prompt.md`: six Ollama claims (O1 to O6) and four others (S1 to S4).
- Save the returned report as `evidence/report.md`.
- Check the report's load-bearing verdicts and defects against the code.

### Out of Scope
- Fixing anything the report finds - fixes are a separate operator decision, as for phases 015 to 017.
- Running Ollama or the advisor live - the claims are checked by reading code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `021-epic-verification/evidence/report.md` | Create | The verification report |
| `021-epic-verification/*.md`, `scratch/prompt.md` | Create/Modify | This phase's own docs and the dispatch brief |
| `../spec.md` | Modify | Phase map rows for phases 20 and 21 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The report gives every claim O1 to O6 and S1 to S4 a verdict with file:line | `evidence/report.md` has one verdict line per claim, each citing a file and line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The conductor checks every non-CONFIRMED verdict and every P0 or P1 defect against the code | `implementation-summary.md` lists each one as confirmed or not, with the line read |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `evidence/report.md` exists, and `rg -c '^(- )?\**[OS][1-6]' evidence/report.md` counts at least 10 verdict lines.
- **SC-002**: `git status --short` shows no change from this phase outside this phase folder and the parent `spec.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `claude2` OAuth token and the `claude-fable-5-2` model id | No report if either is refused | Check the dispatch's exit status and stderr; on a refusal, stop and ask rather than switch model or account |
| Risk | A model report asserts behavior it did not read | A sound change gets reopened, or a real defect is waved through | Run it read-only with `--permission-mode plan`, demand file:line for each verdict, and confirm each non-CONFIRMED verdict against the code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
