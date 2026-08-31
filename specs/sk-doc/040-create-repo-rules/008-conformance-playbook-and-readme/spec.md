---
title: "Feature Specification: Phase 8: Conformance, Playbook and README"
description: "The create-repo-rule mode shipped without a manual testing playbook and with a README that never explained what repo rules are for. This phase closes both gaps and confirms the packet matches the sk-create-skill contract."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: Conformance, Playbook and README

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-validation-and-changelog |
| **Successor** | None |
| **Handoff Criteria** | Playbook package validates fail-closed with zero violations, README validates as a readme, skill package check passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the create-repo-rule packet. It aligns the mode with the sk-create-skill contract, adds the manual testing playbook and rewrites the README.

**Scope Boundary**: The `sk-create-repo-rule` packet, its slash command and the sk-doc hub surfaces that make the mode discoverable, plus one line in the playbook fail-closed allowlist. Widened during the phase after an independent review showed the mode was invisible on the hub's own contract and on three of four runtime surfaces. Still excluded: any rule file, any router trigger row, and any `AGENTS.md` change.

**Dependencies**:
- Phase 7 closed the packet on validation and changelog, so the mode already existed to be tested.
- `sk-create-manual-testing-playbook` owns the playbook contract and its fail-closed validator.
- `sk-create-skill` owns the ALWAYS and NEVER rules the conformance audit ran against.

**Deliverables**:
- A conformance fix removing file references from the `WHEN TO USE` section, and two further fixes the strict packaging gate caught later.
- A ten-scenario manual testing playbook across three category folders.
- A rewritten README on the sibling nine-section skeleton, written to HVR.
- One new line in `playbook-failclosed-allowlist.txt` making the clean state permanent.
- Command-package remediation: the presentation asset brought up to the family contract, both workflow YAMLs rebuilt from stubs.
- Hub discoverability: the mode row and packet count in the hub contract, and the three missing runtime command mirrors.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode shipped without a manual testing playbook, so nothing recorded how an operator confirms it behaves correctly. Its README described the mode to someone who already knew what a repo rule was, and never explained what rules are for or how one reaches you at runtime. Neither gap was visible from the packet's own validators, because both artifacts were absent rather than wrong.

### Purpose
An operator can validate the mode from a written contract, and a reader arriving at the README with no prior context understands what a repo rule does before reaching the reference list.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A conformance audit against the `sk-create-skill` ALWAYS and NEVER rules, and a fix for anything it found.
- A manual testing playbook package following the `sk-create-manual-testing-playbook` contract.
- A README rewrite explaining what repo rules are for and how they are used, written to HVR.
- Graduating the clean playbook package into the fail-closed allowlist.

### Out of Scope
- Authoring, revising or retiring any actual repo rule. The mode is the subject here, not its output.
- Editing `AGENTS.md` or `REPO RULES.md`. Neither needs to change for a playbook or a README.
- A feature catalog. The playbook contract treats it as optional, and every scenario records its absence rather than linking to something that does not exist.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modify | Remove file references from `WHEN TO USE` to satisfy ALWAYS-7 |
| `.opencode/skills/sk-doc/sk-create-repo-rule/README.md` | Modify | Rewrite onto the sibling nine-section skeleton, HVR voice |
| `.opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/manual-testing-playbook.md` | Create | Root directory, review protocol and orchestration guide |
| `.opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-decision/` | Create | Four refusal scenarios |
| `.opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-authoring/` | Create | Three authoring scenarios |
| `.opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/lifecycle-and-wiring/` | Create | Three wiring and retirement scenarios |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modify | Add the new root so its clean state is enforced |
| `.opencode/commands/create/repo-rule.md` | Modify | Divider fixes, `WORKFLOW SUMMARY`, `allowed-tools`, non-circular retire rule |
| `.opencode/commands/create/assets/create-repo-rule-presentation.txt` | Modify | Phase 0 and the non-interactive setup block the command contract requires |
| `.opencode/commands/create/assets/create-repo-rule-{auto,confirm}.yaml` | Modify | Rebuilt from 8 keys to the family contract; real checkpoints in confirm |
| `.opencode/skills/sk-doc/SKILL.md` · `description.json` | Modify | The missing mode row, and the packet count corrected to twelve |
| `.opencode/skills/sk-doc/graph-metadata.json` · `hub-router.json` · `ROUTER.md` | Modify | Both routing stages: advisor vocabulary, tieBreak entry, `REPO_RULE` intent |
| `.codex/prompts/` · `.pi/prompts/` · `.cursor/commands/` | Create | The three missing runtime mirrors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The packet satisfies the `sk-create-skill` ALWAYS and NEVER rules, with any violation fixed rather than noted |
| REQ-002 | A manual testing playbook exists and passes the operator-scenario validator fail-closed with zero violations |
| REQ-003 | The README explains what a repo rule is, how one reaches you at runtime and how to use the mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The README passes HVR: no em dashes, no prose semicolons, no serial commas before a conjunction, no banned filler |
| REQ-005 | The clean playbook package is added to the fail-closed allowlist so the state is enforced rather than incidental |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The playbook validator reports `PASS`, tier `FAIL_CLOSED`, ten scenarios, zero violations.
- **SC-002**: The fleet validator scans a package count equal to the number of playbook roots on disk, with zero failures.
- **SC-003**: `validate_document.py --type readme` reports the README valid with zero issues.
- **SC-004**: A mechanical HVR sweep of the README returns no violation outside code spans.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `validate-playbook-package.cjs` | Without it the playbook ships unchecked | Run it per package and again fleet-wide, comparing the scanned count against roots on disk |
| Risk | A scenario command that was never executed | Med. An operator copies a command that does not work and blames the mode | Run every bash command in the package against the live corpus before shipping it |
| Risk | A scenario asserting a fact nobody checked | Med. The playbook teaches a wrong claim as gold | Verify each corpus claim directly, including phrase counts and rule ownership |
| Risk | The README recommending a validator that fails on the corpus | Low. A reader runs it, sees red and distrusts the docs | Run the suggested command against a shipped rule first and document what it actually does |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Documentation quality
- **NFR-D01**: Every bash command in the playbook runs against the live corpus and produces the output the scenario claims.
- **NFR-D02**: Every corpus fact a scenario asserts is verified directly rather than recalled.

### Enforcement
- **NFR-E01**: The playbook package fails closed rather than warning, so a later regression blocks instead of reporting.
- **NFR-E02**: The fleet validator's scanned count equals the number of playbook roots on disk, because an unscanned root cannot fail.

### Readability
- **NFR-R01**: The README is understandable to a reader who has never seen a repo rule.
- **NFR-R02**: The README passes a mechanical HVR sweep outside code spans.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Playbook content boundaries
- A scenario table cell containing a shell pipe: the pipe splits the row and shifts every later column. Every command in this package avoids pipes.
- An unanchored grep for a trigger phrase: it matches body prose in four files instead of the one frontmatter entry. Patterns are anchored to the list-item form.
- A validator that fits the document type but not the document: `--type reference` fails all eight shipped rules for a missing Overview section they omit by design.

### Absent-artifact cases
- No feature catalog: each scenario records the absence in its own source table rather than linking to a file that does not exist.
- No automated feature tests: the cross-reference section names the two packaging gates and states plainly that neither tests the workflow.

### Grading inversions
- A run that produces no file: usually a pass, graded on whether the refusal named its test and destination.
- A run that produces a good rule where a refusal was expected: a failure, however well the rule reads.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Thirteen files across one packet plus one allowlist line. No runtime code |
| Risk | 6/25 | Documentation only. No rule, router or `AGENTS.md` change, so nothing binds differently at runtime |
| Research | 12/20 | The playbook contract, the skill rules and the HVR standard all had to be read before authoring, and several corpus claims needed direct verification |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator asked for template alignment, a playbook and an extended README, and all three were fully specified by the contracts they route through.
<!-- /ANCHOR:questions -->

---



