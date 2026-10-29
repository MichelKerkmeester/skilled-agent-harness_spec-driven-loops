---
title: "Feature Specification: Phase 15: align-sk-code"
description: "After the machine router moved from SKILL.md to ROUTER.md, sk-code docs, playbooks and scripts still pointed at SKILL.md for routing or cited sections that moved. This phase ran an operator-local alignment check over the skill, fixed the upheld findings that did not change routing, and added the alignment drift tests to CI."
trigger_phrases:
  - "align sk code"
  - "phase 15 align sk code"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: align-sk-code

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/274-packet-router-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 22 |
| **Predecessor** | 014-align-mcp-tooling |
| **Successor** | 016-align-sk-design |
| **Handoff Criteria** | Every upheld sk-code finding that does not change routing is fixed, each other item carries a written disposition, and every recheck failure is classified. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files under `.skilled/skills/sk-code/` that changed since base `6a9946a800`, the CI workflow `.github/workflows/sk-code-script-tests.yml`, and this spec folder. Routing data stays unchanged.

**Dependencies**:
- The router move from phases 004 and 005, which put each sk-code router in a `ROUTER.md`.
- An operator-local alignment check, whose evidence sits in the run folder outside the checkout.
- The router-file resolver, used to prove that no skill routes differently.

**Deliverables**:
- The fix-lane edits to the sk-code docs, playbooks and scripts listed in section 3.
- A CI step that runs the alignment drift checker's Python suite.
- A disposition for each LEFT and OUTSIDE item, and a classification for each recheck failure.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of the sk-code hub and its packets moved from `SKILL.md` to `ROUTER.md`. READMEs, playbook scenarios, changelogs and script comments still credited `SKILL.md` with routing or cited router sections by their old place. The alignment drift checker also had no fallback when a `ROUTER.md` could not be read, and its tests ran in no CI job.

### Purpose
Every sk-code doc and script comment points at the file that now holds the router, and CI runs the drift checker's tests, with no change to what the skill routes to.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Captured by the operator-local alignment check. Full output in the run folder outside the checkout.
```text
$ first run (pushed tree, before the fix lane)
Commits: 6a9946a800 to 4f741f6b48, 27 first-parent commits
Files: 71, of which 0 uncommitted or untracked
Findings: 27 (P0 0, P1 3, P2 24), 20 literal, 0 inferred, 14 outside the scope; 2 more overturned by the critic and not counted
Battery: {"pass":112,"not_applicable":4}
Probes: no probes

$ recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"pass":126,"not_applicable":4,"fail":4}

$ /usr/bin/python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py
Ran 36 tests in 1.059s

OK
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the sk-code files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes (code; skill docs; READMEs, changelogs and env; routing).
- Fix each upheld finding that does not change routing, including the drift checker's fallback to `SKILL.md`.
- Add a CI step that runs `test_verify_alignment_drift.py`.
- Recheck the full battery against the worktree and classify each failure.

### Out of Scope
- Accepting a router anywhere in a hub, which E-01 proposed - it would flip ten hubs to `router-md`, and a test already pins the hub shape.
- Routing-data changes - the packet decision is that no skill routes differently; such items go to the routing follow-up recorded in the parent spec.

### Files to Change

All paths are under `.skilled/skills/sk-code/` unless they start with `.github/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code-skilled/assets/scripts/router-file-resolver.cjs`, `router-replay-lib.cjs` | Modify | Docstring and comment state the heading rule, the hub `none` verdict and that ROUTER.md is probed first |
| `sk-code-skilled/assets/scripts/verify_alignment_drift.py` | Modify | An unreadable ROUTER.md falls back to SKILL.md |
| `ROUTER.md`, `README.md`, `shared/README.md`, `shared/references/stack-detection.md`, `sk-code-quality/SKILL.md` | Modify | Section citations and router credits |
| `sk-code-skilled/assets/checklists/skill-authoring.md`, `sk-code-skilled/references/shared/alignment-verification-automation.md`, `sk-code-skilled/assets/scripts/README.md` | Modify | ROUTER.md named in the checklist, the reference and the script map |
| `manual-testing-playbook/**`, `sk-code-ci/manual-testing-playbook/**`, `sk-code-quality/manual-testing-playbook/**`, `sk-code-skilled/manual-testing-playbook/**` | Modify | Scenarios cite ROUTER.md and the right section owner |
| `sk-code-quality/README.md`, `sk-code-ci/README.md`, packet changelogs, `sk-code-review/changelog/v1.9.14.0.md` | Modify | ROUTER.md rows; claims the packets cannot back removed |
| `.github/workflows/sk-code-script-tests.yml` | Modify | New step runs `test_verify_alignment_drift.py` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No skill routes differently after the edits. | All 54 skill routers parse identically to HEAD through the router-file resolver. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each upheld finding is fixed or carries a written disposition, and each recheck failure is classified. | The evidence lists 26 FIXED lines, and the 1 LEFT, 1 OUTSIDE and 4 recheck failures each have a disposition or classification. |
| REQ-003 | CI runs the alignment drift checker's Python suite. | `sk-code-script-tests.yml` has a step for `test_verify_alignment_drift.py`, and the suite prints 36 tests OK locally with `/usr/bin/python3`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` passes on the hub, sk-code-ci, sk-code-quality, sk-code-review and sk-code-skilled, `validate_document.py` reports 0 issues on the 41 changed `.md` files, and the link check reports 0 broken markdown links.
- **SC-002**: The recheck battery reads `{"pass":126,"not_applicable":4,"fail":4}`, and each failure is derived or was fixed after the recheck.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash review and fix workers | A weak finding could land as a wrong edit | A critic overturned 2 findings, and E-01's resolver proposal was refuted against the hub-shape test |
| Risk | The drift checker's new fallback changes its output | Med | The fixture moves from 0 findings at HEAD to 1, which is the intended catch, and the 36-test suite passes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the resolver accept a router anywhere in a hub (E-01)? Decision: no; it would flip ten hubs to `router-md`, and the hub shape is already pinned by a test.
- None else blocks.
<!-- /ANCHOR:questions -->

---

