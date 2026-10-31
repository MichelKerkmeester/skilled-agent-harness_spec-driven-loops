---
title: "Feature Specification: Template seams and sentinel repair"
description: "Close the seams beside child 010's changes: the completion sentinel gates on the retired checklist, two copies of the continuity set disagree, a scaffold flag advertises templates that do not exist, guides contradict the manifest, and the runtime test project fails on the same retired document and pre-nesting paths."
trigger_phrases:
  - "template seams sentinel repair"
  - "sentinel checklist gate fixed"
  - "sharded flag removed"
  - "runtime test project green"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Template seams and sentinel repair

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
| **Phase** | 16 of 16 |
| **Predecessor** | 004-template-system-and-acceptance-criteria |
| **Successor** | None |
| **Handoff Criteria** | Every row of lane 004's round-two section in `research/confirmed-findings.md` is fixed, documented or removed, and the runtime, CLI, legacy and validation test lanes all pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the spec-kit simplification research program: the remediation child for the template lane's second round, which also owns the runtime test project's repair because the sentinel defect is what both share.

**Scope Boundary**: the completion-evidence sentinel, the two validation modules that held the continuity set, the scaffolder's sharded flag, four validator rules and the template helper, the manifest, the templates README and extension guide, three reference guides, the skill README and SKILL.md, the root README, the goal playbook, the coverage reference, child 010's criteria, and the runtime test project.

**Dependencies**:
- Lane 004's round-two synthesis and its census section
- Child 010, whose machine-level claims this round verified

**Deliverables**:
- A sentinel that spawns the checklist evaluation when `tasks.md` carries the verification section
- One continuity set, an optional-add-on collector, goal anchors enforced, the sharded flag gone, the ToC and template-source rules reading the documents that exist, an evidence pattern that names a path
- Guides, READMEs, the manifest and the playbook saying what the code does; two orphan manifest and template regions removed
- A goal golden and a packet-type parity pin
- The runtime test project green in CI alongside the other lanes
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Child 010 made the level contract the one authority and left the code and prose beside it untouched. The completion-evidence sentinel still stat'd `checklist.md` before spawning the checklist evaluation, so the enforcement the hooks README described never ran from the Stop hook. The optional-continuity set lived in two modules with different members. `create.sh --sharded` was help-advertised with a templates directory that did not exist. The template guide called a lazy add-on required, the extension guide said the lazy list never varies when three packet types narrow it, the ToC lists disagreed with their rule, the evidence pattern accepted clock times, and the manifest carried a taxonomy nothing read. The runtime test project, which CI never ran, failed in seven files for the same retired document and for paths and messages from before the nesting.

### Purpose
A completion claim is checked against the tasks checklist from the Stop hook, every validator reads one continuity set and one document list, every document about templates matches the manifest, and every test lane the skill declares runs green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The sentinel, validation-module, scaffolder, rule and helper changes listed above
- The manifest, template and document corrections
- The seven runtime suite repairs and the CI lane for the runtime project

### Out of Scope
- Cleaning the repository's criteria to cite `file:line`: documented as aspirational; child 010's own rows are retro-cited
- A per-document staleness checker: documented in the checker, since the parity test holds the versions equal

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/hooks/completion-evidence-sentinel.cjs` | Modify | Gate on the tasks verification section |
| `runtime/lib/validation/spec-doc-structure.ts`, `orchestrator.ts` | Modify | One exported continuity set; optional add-ons collected; goal anchors; comment |
| `runtime/cli/spec/create.sh`, `lib/template-utils.sh`, `spec/check-template-staleness.sh` | Modify | Sharded flag removed; basename resolution; upgrade set and scope note |
| `runtime/cli/rules/check-ac-coverage.sh`, `check-toc-policy.sh`, `check-template-source.sh`, `utils/template-structure.js` | Modify | Path-like evidence; closure document in the ToC rule; a template-source document list separate from the required list |
| `runtime/cli/tests/{scaffold-golden-snapshots,template-version-parity}.vitest.ts` | Modify | Goal golden and scaffold; packet-type pins |
| `templates/spec-kit-docs.json`, `templates/README.md`, `templates/EXTENSION-GUIDE.md`, `templates/stress-test/` | Modify or delete | Taxonomy removed; trigger qualified; goal rows; enum and lazy-list wording; orphan removed |
| `references/templates/{template-guide,template-style-guide}.md`, `references/validation/validation-rules.md`, `references/structure/folder-structure.md`, `references/workflows/goal-set-string-playbook.md`, `README.md` (skill and root), `SKILL.md` | Modify | Corrections named in the census |
| `010-template-contract-alignment/acceptance-criteria.md` | Modify | Retro-cited |
| Seven files under `runtime/tests/` | Modify | Fixtures and expectations |
| `.github/workflows/spec-kit-check.yml` | Modify | Runtime project lane |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The sentinel advises on a packet whose `tasks.md` verification section carries a completed P0 item without evidence, and falls back to the implementation-summary stat when no section exists |
| REQ-002 | The runtime, CLI, legacy and validation test lanes all pass, and the workflow runs the runtime project |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `validate.sh --strict --recursive` prints RESULT: PASSED for this program and for three older packets that exercise the widened template-source rule |
| REQ-004 | No document under the skill or the root README presents the sharded flag, a required decision record, an unvarying lazy list, an absence warning or an owning workflow for the resource map as current |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The seven previously failing runtime suites pass with their fixtures on `tasks.md`
- **SC-002**: The goldens, parity, template-source and ToC rules pass on the program's packets and the three older ones
- **SC-003**: The sk-doc validator exits zero on every touched document
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widening the document list the template-source rule reads also widens the file-presence rules | Older packets fail LEVEL_MATCH | It did, on the first attempt; the list is now a separate helper command that only the template-source rule reads, and three older packets were re-validated |
| Risk | The unified continuity set changes a verdict | A document gains or loses a required block | The union of both copies plus the resource map was taken; the program's sixteen packets and three older ones validate |
| Dependency | The runtime dist | Rules read compiled modules | Rebuilt after every module change; dist freshness checked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The sentinel reads `tasks.md` once before deciding to spawn
- **NFR-P02**: The runtime project adds about four minutes to the spec-kit check

### Security
- **NFR-S01**: The council test authorizes only the temporary directory it creates
- **NFR-S02**: No rule became less strict; two rules read more documents

### Reliability
- **NFR-R01**: The runtime project cannot rot unseen again
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a `tasks.md` without the protocol anchor takes the implementation-summary path
- Maximum length: not applicable
- Invalid format: an unreadable `tasks.md` derives an unknown status, as the graph test asserts

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: code, tests, documents and the workflow ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About forty files across the sentinel, validators, rules, templates, guides and tests |
| Risk | 12/25 | One rule widening was reversed at its first side effect |
| Research | 6/20 | Every row re-checked |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
