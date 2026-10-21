---
title: "Feature Specification: Hub repo folder exemption"
description: "A parent hub that is also a repository root fails the skilled checkers, because its spec packets read as second identities and its folder name is not a skill id. A repo-root-hub registry extension lets the hub name its repository entries so the checkers skip them."
trigger_phrases:
  - "hub repo folder exemption"
  - "repo-root-hub extension"
  - "parent hub at a repository root"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hub repo folder exemption

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Some AI systems are a parent hub and a repository at once: Product Owner and Moneybird Accountant keep `SKILL.md`, `mode-registry.json` and their packets at the repository root, beside `specs/`, `export/` and other repository files. The skilled checkers read the whole folder as the skill. Every spec packet's `graph-metadata.json` counts as a second identity, the repository folders count as stray packets, and a folder named `Product Owner` never equals the skill id `product-owner`. Product Owner had to move its hub into a subfolder to pass, and Moneybird fails 35 invariants today.

### Purpose
A hub at a repository root names its repository entries once, in `mode-registry.json`, and the parent-hub checker and the package validator then hold only the hub and its packets to the contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `repo-root-hub` extension in `mode-registry.json` with a `repoPaths` list of top-level names
- `parent-skill-check.cjs`: skip the listed entries in the identity walk and the child-directory check, read the hub id from the folder name in kebab case, and validate the extension under 3f
- `package_skill.py`: compare the frontmatter name with the kebab-case folder name, and skip the listed entries in the naming walk, the version walk, the catalog-root scan and the zip
- `validate_skill_package.py`: pass the kebab-case hub id to the compiled-routing readiness check
- Tests for each, and one row in the hub doctrine's extension table

### Out of Scope
- Moneybird Accountant's registry. Its 35 failures are mostly schema gaps the extension does not touch, and changing it is that system's own work
- Any default allowlist of repository folder names. A hub declares its own, so no other hub changes behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Modify | Read the extension, skip declared entries, kebab-case hub id, 3f validation |
| .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | Modify | Five repo-root cases |
| .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py | Modify | Kebab-case name check, declared entries skipped in every walk |
| .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py | Modify | Kebab-case hub id for the compiled-routing check |
| .skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py | Modify | Three repo-root cases |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md | Modify | The extension's table row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A hub that declares `repo-root-hub` passes `parent-skill-check.cjs` and `validate_skill_package.py --strict` with spec packets, exports and other repository files at its root. |
| REQ-002 | A hub that does not declare the extension is checked exactly as before. |
| REQ-003 | A `repoPaths` entry that names a packet, a hub-owned file or a nested path fails 3f, so the extension cannot hide the skill itself. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The extension is documented in the hub doctrine's named-extension table. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Product Owner keeps its hub at the repository root and passes both checkers.
- **SC-002**: Every existing checker and validator test still passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hub hides part of its skill behind `repoPaths` | High | 3f refuses packets, hub-owned files and nested paths |
| Risk | Another hub changes verdict | Med | Nothing changes without the declaration, and the existing suites run unchanged |
| Dependency | Peer sessions edit the same tree | Low | The diff touches four scripts and two tests, and a clean clone isolates a failing suite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: One extension name and one field, read the same way by the JavaScript checker and the Python validator.

### Reliability
- **NFR-R01**: A malformed registry reads as undeclared, and 3a or 3f reports it, so no walk crashes on it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `repoPaths`: 3f fails.
- An entry that does not exist on disk: skipped harmlessly, since a clone may lack an ignored folder such as `export/`.

### Error Scenarios
- A graph-metadata.json in a folder the hub did not declare still fails 2a.
- A folder name that kebab-cases to a different id still fails 1b and the name check.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four scripts, two tests, one doc row |
| Risk | 12/25 | Shared checkers every hub runs |
| Research | 6/20 | A probe copy of a real repository named every blocker |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose a hub-declared list over a fixed allowlist on 2026-10-20.
<!-- /ANCHOR:questions -->

---
