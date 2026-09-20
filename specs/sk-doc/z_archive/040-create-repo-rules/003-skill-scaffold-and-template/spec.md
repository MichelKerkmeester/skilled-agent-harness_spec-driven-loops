---
title: "Feature Specification: Phase 3: Skill Scaffold and Templates"
description: "Scaffold the sk-create-repo-rule mode packet and author what it emits: a rule template built from the anatomy contract, and a router template for a repository whose trigger table does not exist yet. The test is that the rule template reproduces a shipped rule's structure without the author consulting the corpus."
trigger_phrases:
  - "skill scaffold"
  - "rule template"
  - "router template"
  - "mode packet"
  - "template reproduces a shipped rule"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: Skill Scaffold and Templates

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-inventory-and-skill-contract |
| **Successor** | 004-creation-standards-and-guardrails |
| **Handoff Criteria** | The packet exists, both templates exist, and the rule template reproduces a shipped rule's structure |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the create-repo-rule packet, and the first that writes into `.opencode/`.

**Scope Boundary**: the mode packet at `.opencode/skills/sk-doc/sk-create-repo-rule/` and its two templates. No hub registration, no command, no standards document - those are phases 4 through 6.

**Dependencies**:
- Phase 2's four contract documents. The templates are built from `rule-anatomy.md` and `target-tree.md`, and the SKILL.md workflow is built from `decision-tests.md`.
- `sk-create-skill` owns skill scaffolding, per the mode boundary; this phase routes through it rather than hand-rolling a packet.

**Deliverables**:
- `SKILL.md` - the executable contract, structured to the `sk-create-skill` template.
- `README.md` - what the mode is, for a reader outside the workflow.
- `assets/repo-rule-template.md` - what the mode emits when someone asks for a rule.
- `assets/repo-rules-router-template.md` - the prerequisite, emitted only when the destination is missing.
- `references/` seeded with the two contract documents that govern generation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 2 produced a contract nothing can execute. `rule-anatomy.md` states that ten elements are universal and that dividers equal numbered sections in every file; `decision-tests.md` states four gates a proposal must pass; `target-tree.md` states a layout. None of it is reachable by an agent, because there is no skill to route to and nothing to fill in. The contract's own test - that phase 3 could build a template from it without re-reading the corpus - has not been run.

### Purpose
Build the packet and the two templates, and run that test: author the rule template from the contract alone, then check the result against a shipped rule structurally.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The mode packet tree from `target-tree.md`: `SKILL.md`, `README.md`, `assets/`, `references/`, `changelog/`.
- `SKILL.md` carrying the sections `sk-create-skill` requires - WHEN TO USE, SMART ROUTING with pseudocode, HOW IT WORKS, RULES, REFERENCES - with the workflow driven by the four decision tests.
- The rule template, with every MUST element from the anatomy contract and placeholders for what varies.
- The router template, structurally distinct because the router is a different document class.
- Copying `rule-anatomy.md` and `decision-tests.md` into `references/` as the generation authority.
- A `references/README.md` router, because every sibling mode has one.

### Out of Scope
- **Hub registration** - `mode-registry.json`, `hub-router.json`, `command-metadata.json` are phase 6.
- **The command** - phase 6, through `sk-create-command`.
- **`creation-standards.md` and `agents-md-integration.md`** - phases 4 and 5 author them into `references/`.
- **The changelog symlink** - phase 7.
- **Change and remove paths** - the mode owns them, but their contract is unwritten and phase 5 owns it. `SKILL.md` names them as routes and defers the mechanics.
- **Any edit to a shipped rule** - the corpus is the fixture this phase tests against, and a fixture you edit proves nothing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Create | The executable contract |
| `.opencode/skills/sk-doc/sk-create-repo-rule/README.md` | Create | Reader-facing description |
| `.../assets/repo-rule-template.md` | Create | What the mode emits |
| `.../assets/repo-rules-router-template.md` | Create | The prerequisite template |
| `.../references/rule-anatomy.md` | Create | Copied from phase 2 |
| `.../references/decision-tests.md` | Create | Copied from phase 2 |
| `.../references/README.md` | Create | Reference router |
| `.../changelog/` | Create | Directory; symlinked in phase 7 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The rule template contains every MUST element from the anatomy contract, and a file generated from it satisfies the same structural assertions the shipped rules pass. |
| REQ-002 | The templates are authored from the contract documents, not by copying a shipped rule, so the contract is what gets tested. |
| REQ-003 | `SKILL.md` runs the four decision tests before authoring anything, because most of what the mode does is refuse. |
| REQ-004 | The router template is structurally distinct from the rule template - no frontmatter, no `Fires when`, no `The rule`, no self-check. |
| REQ-005 | The packet tree matches `target-tree.md`, including its deliberate omissions. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `SKILL.md` carries the sections `sk-create-skill` requires, including a Smart Router pseudocode block. |
| REQ-007 | The rule template states the length bands and where the generated rule should aim. |
| REQ-008 | `SKILL.md` names the change and remove routes even though their mechanics are deferred, so the deferral is visible rather than an omission. |
| REQ-009 | The rule template's placeholders are self-describing, so an author filling one in does not need the anatomy contract open. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A rule generated from the template passes the same structural checks the eight shipped rules pass - uppercase numbered headings, sequential numbering, dividers equal sections, six-key frontmatter that parses.
- **SC-002**: The contract's own claim holds: the template was built without consulting the corpus, and the result matches it anyway.
- **SC-003**: An agent reaching `SKILL.md` with a rule request runs the decision tests before writing.
- **SC-004**: The packet tree is exactly `target-tree.md`, with nothing scaffolded that the tree defers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The template is written by copying a shipped rule, so it reproduces the corpus while proving nothing about the contract | High - it would hide a defective contract until the first real use | REQ-002 forbids it; the template is authored from the contract and checked against the corpus afterwards, which is the only order that tests anything |
| Risk | The generated rule passes structural checks and reads badly | Med - structure is checkable, quality is not | Phase 4's standards carry the quality bar; this phase claims structure only, and says so |
| Risk | The router template is guessed, since nobody has asked what a good router looks like | Med, and named in phase 2's limitations | The template reproduces the shipped router's structure and claims no more than that |
| Risk | Scaffolding the deferred directories because they are cheap | Low | `target-tree.md` records each omission with a precedent; REQ-005 checks the tree matches |
| Dependency | Phase 2's contract documents | The templates have no source | Complete and validating |
| Dependency | `sk-create-skill` | Owns skill scaffolding per the mode boundary | Present; its template contract read before authoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Conformance
- **NFR-C01**: `SKILL.md` conforms to the `sk-create-skill` template contract.
- **NFR-C02**: Both emitted templates produce files inside the length bands.

### Usability
- **NFR-U01**: An author filling the rule template needs no other document open.
- **NFR-U02**: `SKILL.md` is readable as a procedure, top to bottom, by an agent that has loaded nothing else.

### Restraint
- **NFR-R01**: Nothing is scaffolded that `target-tree.md` defers, however cheap it would be.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Generation Boundaries
- **A request that fails a decision test**: the mode refuses and names the test, which is the common path rather than an error case.
- **A repository with no router**: the router template runs first, then the rule.
- **A request that is really a skill**: routed to `sk-create-skill` by the mode boundary before any authoring.

### Template Boundaries
- **A rule needing a section the template does not anticipate**: the numbered body is open-ended by design; only the MUST elements are fixed.
- **A generated rule exceeding 250 lines**: the template says split or cut, because that is what the band means.
- **A rule with no sideways cross-references**: the default, not an omission.

### Structural Boundaries
- **The divider invariant**: dividers equal numbered sections, checked mechanically, no exception in nine files.
- **Frontmatter with an unquoted colon**: the template quotes `title` and `description` by construction, because every shipped rule failed this on first authoring.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | 7 files in a new packet, no code |
| Risk | 9/25 | First write into `.opencode/`; nothing wired yet, so blast radius is contained |
| Research | 6/20 | The contract is the input; only `sk-create-skill`'s template needed reading |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the rule template ship a filled example alongside the blank? **Leaning yes, but as a pointer to a shipped rule rather than a second maintained artifact - a worked example that drifts from the corpus is worse than none.**
- Does `SKILL.md` embed the decision tests or point at `references/decision-tests.md`? **Point at it. Embedding duplicates the authority and the two will diverge, which is the failure the cross-reference doctrine exists to prevent.**
<!-- /ANCHOR:questions -->

---
