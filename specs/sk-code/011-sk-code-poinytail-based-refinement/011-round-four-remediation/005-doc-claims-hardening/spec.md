---
title: "Feature Specification: Phase 5: doc-claims-hardening"
description: "The documentation claim checker crashes on a missing --root, passes stale path-shaped link labels and dead anchors, and reports conditional loading bullets as every-route claims, and the moved guardrails text carries four semicolons. This phase closes all five gaps round three recorded."
trigger_phrases:
  - "doc claims hardening"
  - "phase 5 doc claims hardening"
  - "claim checker anchors"
  - "verify doc claims labels"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: doc-claims-hardening

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/005-doc-claims-hardening` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-quality-obsidian-coverage |
| **Successor** | 006-deep-loop-findings-parser |
| **Handoff Criteria** | The four new checker tests fail on the unedited checker and all ten pass after, the checker reports nothing under `sk-code-opencode/`, and every hit in another child's file is in `scratch/hits-for-orchestrator.txt` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Round four children specification.

**Scope Boundary**: The claim checker, its test, the guardrails text and the OpenCode packet version, all under `.skilled/skills/sk-code/sk-code-opencode/`.

**Dependencies**:
- Known Limitations 1 to 5 in `../../010-round-three-remediation/005-opencode-and-guards/implementation-summary.md`
- The handoffs in `plan.md` section 3, which the orchestrator moves to children 002 and 004 so the whole-tree checker passes once those land

**Deliverables**:
- A one-line usage error and exit 2 for a missing `--root`
- Path-shaped link labels and `#anchor` targets checked against real files and headings
- Conditional loading bullets left out of the tier check
- The guardrails text without semicolons
- Four new test cases, version 1.2.1.0 and its changelog

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Round three shipped `verify_doc_claims.cjs` with five recorded gaps, and all five still reproduce. `--root /nonexistent-dir` prints a Node `ENOENT` stack trace and exits 1. A label such as `assets/checklists/gone.md` over a real target passes, and an anchor that names no heading passes, because only `./` and `../` labels and the file part of a target are read. A loading bullet that names a glob only for some routes is still reported as an every-route claim. `workflow-guardrails.md` keeps four semicolons that the voice scan counts as hard blockers.

### Purpose
The checker reports every stale label and dead anchor, stays quiet on conditional bullets, fails cleanly on a bad `--root`, and the guardrails text passes the voice scan.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A usage error and exit 2 when `--root` is not a directory
- A label check for path-shaped labels that do not start with `./` or `../`
- Anchor resolution for link targets and backticked paths, against headings by GitHub's slug rule and explicit `<a id>` or `<a name>` anchors
- A condition rule for `### Surface-aware loading` bullets that covers files and globs
- Four semicolons in `workflow-guardrails.md` rewritten as sentence breaks
- Four test cases, a README row update, the 1.2.1.0 version and a changelog entry

### Out of Scope
- Hits in files other children own. They are written as exact handoff edits in `plan.md` and listed by the builder in `scratch/hits-for-orchestrator.txt`
- Hermes regeneration and the leaf-manifest refresh. The orchestrator runs them after every build
- Other semicolons and em dashes in `sk-code-opencode/SKILL.md`. Only its version line changes, and its voice-scan count must not rise

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs` | Modify | Root check, label check, anchor resolution, condition rule |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` | Modify | Four new test cases |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md` | Modify | Semicolons rewritten |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md` | Modify | Checker row names labels and anchors |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modify | Version 1.2.0.0 to 1.2.1.0 |
| `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.2.1.0.md` | Create | Changelog entry |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/` | Create | Before and after outputs, the scope copies and `hits-for-orchestrator.txt` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A missing `--root` gets a usage error | `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs --root /nonexistent-dir` writes one stderr line starting `usage: verify_doc_claims` and containing `--root is not a directory`, and exits 2 |
| REQ-002 | Path-shaped labels are checked | Over `scratch/repro-fixture`, the checker prints `doc.md:3: link label is a path that does not resolve: assets/checklists/gone.md` and nothing for `doc.md:6` |
| REQ-003 | Anchors are resolved | Over `scratch/repro-fixture`, the checker prints `doc.md:4: link anchor does not resolve: ./target.md#9-missing-section` and `doc.md:5: anchor does not resolve: sk-code-demo/references/target.md#nope` |
| REQ-004 | Conditional bullets are not every-route claims | Over `scratch/repro-fixture`, the checker prints `PASS check tiers` |
| REQ-005 | Each checker change has a fixture case that fails before and passes after | The test file run before the checker edits prints `pass 6` and `fail 4`, and after them `pass 10` and `fail 0` |
| REQ-006 | The packet itself is clean | `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs \| grep -c 'sk-code-opencode/'` prints `0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The guardrails text has no semicolon | `grep -c ';' .skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md` prints `0`, and `hvr_scan.py` on it reports `hard blockers:          0` |
| REQ-008 | The packet is versioned | `SKILL.md` reads `version: 1.2.1.0`, `changelog/v1.2.1.0.md` validates with `Total issues: 0`, and doctor check `13d-packet-version` passes |
| REQ-009 | The other drift guards stay green | `run-all-drift-guards.sh` prints `PASS:` for alignment-drift, stack-folders and router-sync, and doc-claims passes or fails only on lines outside `sk-code-opencode/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A stale path-shaped label or a dead anchor in any sk-code doc fails the drift gate
- **SC-002**: Every checker hit outside this packet is named, with file, line, text and check, in `scratch/hits-for-orchestrator.txt`
- **SC-003**: The build touches only the six files in Files to Change, checked against `scratch/status-before.txt`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Children 002 and 004 own the eight files the stricter checker flags at plan time | Until their handoff edits land, the checker and the umbrella exit 1 on doc-claims | The orchestrator moves the exact edits in `plan.md` section 3 to those children before builds start |
| Risk | Child 002 rewrites 59 Webflow link labels | A new path-shaped label that is not the tail of its target becomes a hit | Handoff to 002: a path-shaped label must end its own target path |
| Risk | The heading slug differs from a renderer's | False anchor hits | The rule follows GitHub, which `validate_document.py:498` already assumes, and the plan-time run over the hub found only true hits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The slug rule, the condition words and the label rule are recorded as decisions in `plan.md` section 3.
<!-- /ANCHOR:questions -->

---
