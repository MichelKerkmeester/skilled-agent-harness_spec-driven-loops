---
title: "Feature Specification: Completion gate and catalog alignment"
description: "Close lane 005's second round: the completion checker reads acceptance closure so the sentinel gates on the authored contract, hand-written fingerprint stamps become a visible class, the standalone links scan stops pretending to be a rule, and the catalog, references and assets say what the level and completion contract is."
trigger_phrases:
  - "completion gate acceptance closure"
  - "AC_UNMET status"
  - "malformed fingerprint class"
  - "catalog stale references fixed"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Completion gate and catalog alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 005-overengineering-simplification |
| **Successor** | None |
| **Handoff Criteria** | Every row of lane 005's round-two section in `research/confirmed-findings.md` is fixed, documented or recorded, and the four test lanes pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the spec-kit simplification research program: the remediation child for the overengineering lane's second round, which verified children 011 and 012 and then read the enforcement chain behind the assets they aligned.

**Scope Boundary**: the completion checker and the sentinel that spawns it, the continuity-freshness checker, the standalone links scan and the rules README, two spec README rows, the execution-methods and validation-rules references, the quick reference, the template guide, two assets, the hooks README and the sentinel playbook, and seven catalog entries.

**Dependencies**:
- Lane 005's round-two synthesis and its census section
- Child 016, which moved the sentinel's gate to `tasks.md` during this round

**Deliverables**:
- `check-completion.sh` reads the acceptance-criteria table and returns `AC_UNMET`; the sentinel advises on it
- `continuity-freshness.ts` reports a hand-written fingerprint as `malformed_fingerprint`
- `check-links.sh` is a standalone scan with a real default directory and no dead rule path
- Every document the round cited says what the code does; ten catalog references point at files that exist or say the file is gone
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Child 011 aligned the command assets to the acceptance-criteria closure but the mechanical backstop never learned it: `check-completion.sh` read the checklist only, so the sentinel could pass a packet whose criteria were all `Unmet`. The freshness checker folded 27 hand-written `sha256:<label>` stamps into "never recorded", which is how round one's adoption count was wrong by a factor of three. `check-links.sh` carried a flag-gated rule path with no registry row and a default directory that never existed. Seven surfaces called the checker the completion gate in the old voice, four still called LOC soft guidance and enforcement manual, the decision matrix said "L1 + checklist", the composition entry listed a removed bridge document, and ten catalog references pointed at removed or moved source.

### Purpose
The Stop hook checks a completion claim against the same contract the workflow authors, a fabricated attestation is visible as such, a script is either a rule or a tool, and the documents describe the running system.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The checker, sentinel, freshness and links changes above, with tests
- The document and catalog corrections named in the census

### Out of Scope
- Rewriting the 27 hand-written stamps: they live in closed packets whose attestations and generated fingerprints would change; the new class makes them countable
- A registry row for the links scan: its repository-wide run reports memory-name links that are not files, so it stays a hand-run tool

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/spec/check-completion.sh` | Modify | Acceptance-row count, `AC_UNMET`, JSON block, text line, help |
| `runtime/lib/hooks/completion-evidence-sentinel.cjs` | Modify | Advise on `AC_UNMET` |
| `runtime/cli/validation/continuity-freshness.ts` | Modify | `malformed_fingerprint` warning |
| `runtime/cli/rules/check-links.sh`, `rules/README.md` | Modify | Standalone scan; inventory claim |
| `runtime/tests/completion-evidence-sentinel.vitest.ts`, `runtime/cli/tests/continuity-freshness.vitest.ts` | Modify | Two new cases each side |
| `runtime/cli/spec/README.md`, `runtime/lib/hooks/README.md`, `manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md` | Modify | What the checker reads |
| `references/workflows/{execution-methods,quick-reference}.md`, `references/templates/template-guide.md`, `references/validation/validation-rules.md`, `assets/{level-decision-matrix,template-mapping}.md` | Modify | Level recommender; closure document; new class |
| Seven files under `feature-catalog/tooling-and-scripts/` | Modify | Checker contract; upgrade inputs; composition list; stale references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With a closed checklist and an `Unmet` criterion, `check-completion.sh --json` reports `AC_UNMET` and the sentinel advises; with every row `Met` it reports `COMPLETE` |
| REQ-002 | A present, non-zero, non-hex fingerprint reports `malformed_fingerprint` as a warning and the hex and zero cases keep their codes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The four test lanes pass and the program validates recursively |
| REQ-004 | No catalog reference names a file that does not exist without saying so, and no cited document calls LOC soft guidance, enforcement manual, or Level 2 a checklist document |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The sentinel suite covers the unmet and closed acceptance cases
- **SC-002**: The freshness suite covers the malformed case
- **SC-003**: The catalog scan for missing paths returns only rows marked as removed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `AC_UNMET` ranks after the checklist statuses | A packet with both problems sees the checklist one first | The JSON carries the acceptance counts on every status, so a consumer can read both |
| Risk | The malformed class warns on 27 closed packets | Strict runs with the freshness flag on see new warnings there | The flag is opt-in and the warning names the value; that visibility is the fix |
| Dependency | Child 016's sentinel gate | The closure read only matters if the checker runs | Landed first in `737926c666` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The acceptance read is one pass over one document inside the bounded spawn the sentinel already makes
- **NFR-P02**: No new process is spawned

### Security
- **NFR-S01**: The links scan's default directory is inside the repository
- **NFR-S02**: The waiver check accepts only a decision-record id

### Reliability
- **NFR-R01**: An absent acceptance document changes nothing
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an acceptance document with no `AC-` rows counts zero and blocks nothing
- Maximum length: not applicable
- Invalid format: a status cell outside the four values counts as unmet

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the private index kept the other session's files out

### State Transitions
- Partial completion: code, tests and documents ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Four code files, two tests, nineteen documents |
| Risk | 10/25 | Advisory hook and an opt-in warning |
| Research | 5/20 | Every row re-checked |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
