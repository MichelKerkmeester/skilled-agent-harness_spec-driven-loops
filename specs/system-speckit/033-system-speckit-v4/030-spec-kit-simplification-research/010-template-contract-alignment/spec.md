---
title: "Feature Specification: Template contract alignment"
description: "Make the level contract the single authority for which documents a packet has, give goal.md a creator, repair the staleness checker and the coverage enforce switch, reconcile template versions, and rewrite every document that described a template system that no longer exists."
trigger_phrases:
  - "template contract alignment"
  - "with goal flag"
  - "lazy addons documented"
  - "acceptance criteria closure gate"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Template contract alignment

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
| **Phase** | 10 of 10 |
| **Predecessor** | 004-template-system-and-acceptance-criteria |
| **Successor** | None |
| **Handoff Criteria** | Every row of `004-template-system-and-acceptance-criteria/research/confirmed-findings.md` is fixed, documented or carries a recorded decision, and the scaffolder, validator and their tests agree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the spec-kit simplification research program.

**Scope Boundary**: the template manifest, the scaffolder, the structure validator, the staleness checker, the coverage rule, the template-source rule, the goal template, and every document under the skill and the root README that describes which documents a packet has and how they are enforced.

**Dependencies**:
- `004-template-system-and-acceptance-criteria/research/confirmed-findings.md`, the censused ledger this phase closes

**Deliverables**:
- One authority for document inclusion: the `levels` contract, with `resource-map.md` a lazy add-on at every level and the hardcoded pair gone from the validator
- `create.sh --with-goal`, so the durable-directive document has a creator; the closure document scaffolded from the contract's own list instead of a substring grep
- The staleness checker reading the manifest that exists; the coverage rule honouring its enforce switch; the template-source example naming a real marker
- Manifest versions reconciled with the five templates that declared their own, pinned by a new test
- The orphan migration-bridge template removed
- The root README, the skill README and SKILL.md, the extension guide, four reference guides, three assets, the hooks and runtime READMEs, the env reference and template, and the goal playbook describing the acting system

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The template system's documents described a different system from the one that runs: a cumulative per-level ladder where the real add-on list is flat, a closure document that "warns" where the rule fails, a hard block on decision records that no rule enforces, seven documents "written when you ask" of which only four had a flag, a `checklist.md` retired months ago, and a manifest taxonomy nothing reads. Two maintenance tools had drifted too: the staleness checker read a manifest path that never existed, and the coverage rule's enforce switch was reserved but inert.

### Purpose
A maintainer or an operator reading any of these documents learns which files a packet gets, how each is created, and which rule enforces it, and every one of those statements matches the code.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Contract, scaffolder, validator, checker and rule changes listed above
- The new version-parity test
- Every document correction the census recorded

### Out of Scope
- Wiring the manifest's `documents` taxonomy into enforcement - declared descriptive instead, since both the scaffolder and the validator read the `levels` rows
- Moving `acceptance-criteria.md` to `requiredAddonDocs` - the file-presence rule has no notion of the rollout cutoff and would fail every grandfathered packet
- Rewriting the continuity-freshness test that edits a retired `checklist.md` - it fails before this phase and belongs with the tests it exercises

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `templates/spec-kit-docs.json` | Modify | Descriptive values corrected, versions reconciled, `resource-map.md` lazy at every level, `context-index.md` removed |
| `templates/packet-types/context-index.md.tmpl` | Delete | Orphan migration bridge |
| `templates/addons/goal.md.tmpl` | Modify | Author slug the memory-block rule accepts |
| `runtime/lib/validation/spec-doc-structure.ts` | Modify | Hardcoded document pair removed |
| `runtime/cli/spec/create.sh` | Modify | `--with-goal`; closure document from the contract list |
| `runtime/cli/spec/check-template-staleness.sh` | Modify | Manifest path; grandfathering note |
| `runtime/cli/rules/check-ac-coverage.sh`, `rules/check-template-source.sh` | Modify | Enforce switch; real remediation example |
| `runtime/cli/tests/template-version-parity.vitest.ts` | Create | Manifest versus markers, flat lazy list, checker path |
| `runtime/cli/tests/level-contract-resolver.vitest.ts` | Modify | Lazy list pins include the resource map |
| `README.md`, `system-spec-kit/README.md`, `SKILL.md`, `templates/README.md`, `templates/EXTENSION-GUIDE.md`, `templates/MIGRATION.md` | Modify | Trigger table, level table, tree, gates, descriptive index |
| `references/templates/{template-guide,template-style-guide,level-selection-guide,level-specifications}.md`, `references/structure/folder-structure.md`, `references/validation/{validation-rules,phase-checklists,template-compliance-contract}.md`, `references/workflows/{intake-contract,goal-set-string-playbook}.md` | Modify | Flat model, real enforcement, goal creation and naming |
| `assets/{level-decision-matrix,template-mapping,parallel-dispatch-config}.md` | Modify | The retired checklist replaced by the closure document |
| `runtime/README.md`, `runtime/lib/hooks/README.md`, `runtime/ENV-REFERENCE.md`, `.env.example` | Modify | Discovery list, sentinel input, enforce switch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `create.sh --with-goal` scaffolds a `goal.md` that passes the frontmatter memory-block rule, and the default Level 2 scaffold still carries `acceptance-criteria.md` |
| REQ-002 | The validator's document inclusion comes only from the level contract, and every level contract lists `resource-map.md` as a lazy add-on |
| REQ-003 | The manifest version of every template equals the version its marker declares, asserted by a test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The staleness checker classifies documents instead of reporting every folder unknown |
| REQ-005 | `SPECKIT_AC_COVERAGE_ENFORCE=true` turns an under-floor coverage result into a failing rule, and the reference and template document it |
| REQ-006 | No document under the skill or the root README presents `checklist.md`, `context-index.md`, a cumulative add-on ladder, a warning on a missing closure document, or a hard block on a missing decision record as current |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scaffold goldens, the resolver suite, the parity suite and the workflow-invariance suite pass together
- **SC-002**: A residue search for the retired names returns nothing outside historical notes, fixtures and playbooks
- **SC-003**: The sk-doc validator exits zero on every touched README and asset
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a document to every `lazyAddonDocs` list changes the resolver's pinned expectations | Four resolver tests fail | The pins were updated in the same commit; the new parity test pins the four numbered lists equal |
| Risk | A fresh `goal.md` scaffold fails validation | The new flag would ship a document the validator rejects | The smoke scaffold surfaced the author-slug failure and the template was corrected before commit |
| Dependency | The scaffolder writes into `specs/` for a real run | Smoke tests would create packets | Smoke scaffolds used `--path` into a temporary directory and were deleted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The version-parity suite reads sixteen small files and finishes in milliseconds
- **NFR-P02**: The scaffolder gains one `node` call per closure-document decision, replacing a `grep`

### Security
- **NFR-S01**: `--with-goal` writes only the requested document into the target packet
- **NFR-S02**: No rule became less strict; the enforce switch only adds a failing branch

### Reliability
- **NFR-R01**: A future manifest-versus-marker drift fails the parity suite on the next run
- **NFR-R02**: Every gate result was read from its output
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a contract with no `optionalAddonDocs` scaffolds no closure document, as before
- Maximum length: not applicable
- Invalid format: the checker still reports `unknown` for a folder whose marker has no version

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: the other session's working-tree edits stayed out of the private index

### State Transitions
- Partial completion: contract, validator, scaffolder and documents ship in one commit
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Thirty-two files, mostly documents |
| Risk | 10/25 | One contract list change and one new scaffold flag, both tested |
| Research | 4/20 | Findings arrived censused |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The two carried questions live in the research lane's confirmed-findings document.
<!-- /ANCHOR:questions -->
