---
title: "Feature Specification: Code README standard and enforcement"
description: "The code-README standard contradicts itself in three places and neither the validator nor the auditor can detect the defect class this program is about. This phase settles the ambiguous requirements in the authoring surface, then extends validate_document.py with an opt-in code-folder mode and rebuilds audit_readmes.py discovery to run from a durable-directory manifest across all repository roots."
trigger_phrases:
  - "code readme standard ruling"
  - "directory tree requirement readme"
  - "validate_document code folder mode"
  - "audit_readmes discovery manifest"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/022-code-readme-coverage"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement"
    last_updated_at: "2026-08-02T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented the accepted authoring, validator, auditor, and fixture contracts"
    next_safe_action: "Downstream phases consume the frozen manifest and opt-in code-folder mode"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Applicability is need-based, not census-based"
      - "Q1 — tree is mandatory only when immediate subdirectory count is greater than zero; a complete flat-folder inventory table is equivalent"
      - "Q2 — general README format rules bind code-folder READMEs except the tagline"
      - "Q3 — a designated orientation file may replace README.md when it passes the same Overview and inventory check"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Code README Standard And Enforcement

## EXECUTIVE SUMMARY

One unresolved sentence in the create-readme standard — whether a complete file table satisfies the multi-file Directory Tree requirement — controls 76 of the 88 findings in the sibling sweep phase. Two findings were refuted during research for exactly that reason, which is direct evidence the ambiguity produces unstable findings rather than stable defects. This phase settles that sentence and two adjacent ones, then makes the settled standard mechanically checkable: an opt-in code-folder mode in the document validator, and a manifest-driven auditor that can finally discover a *missing* README outside `.opencode`.

**Key Decisions**: the tree-equivalence ruling (Q1); the scope of the general format rules over code-folder READMEs (Q2).

**Critical Dependencies**: none inbound. This phase blocks `003` and the `019` amendment hard, and `002` class (c) softly.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/022-code-readme-coverage` |
| **Owner skill** | sk-doc |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three defects in the governing surface, each independently confirmed against source:

1. **The standard contradicts itself.** `shared/references/hvr-rules.md:451-454` requires "H2 sections numbered ALL CAPS with anchors" and "TOC entries match H2 headings"; `sk-create-readme/SKILL.md:434-435` forbids both for code READMEs. A reviewer can cite either and be right.
2. **The requirements are under-specified.** `readme-code-template.md:47-58` requires a Directory Tree for every multi-file folder but never says whether an exhaustive `CONTENTS`/`FILES`/`Key Files` table satisfies it. Separately, the format block at `SKILL.md:217-229` is titled "General README format rules" and §6 (code-folder output shape) never restates it, so the tagline, numbering, casing and separator requirements bind code READMEs only by inference. The template scaffold at `readme-code-template.md:180-193` ships YAML frontmatter and no tagline, while `SKILL.md:231` calls frontmatter optional — the scaffold and the prose disagree in two directions at once.
3. **Nothing enforces any of it.** `validate_document.py:1131-1133` runs three checks for a README: TOC, H2 case, required sections. There is no Directory-Tree rule, no separator rule, no fence-language rule, no link-resolution rule, no durability rule. `audit_readmes.py:13-23` and `find_readmes():288-309` scan only the repo-root `README.md` and `.opencode/**`, so the auditor cannot discover a missing README at all and never sees `.claude`, `.pi`, `.github` or `scripts/`.

### Purpose

Produce the oracle: a standard with no self-contradiction and no inferred requirements, plus the two tools that can mechanically decide conformance against it.

### Non-Goals

- Editing any README to conform. This phase changes the standard and the tools; the file remediation is `002` and `003`.
- A repo-wide HVR sweep. Only the `hvr-rules.md` contradiction that affects README audits is touched.
- Making the new validator mode default-on for the 379 existing READMEs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **The ruling**, recorded in `decision-record.md`: tree-vs-table equivalence, the applicability of the general format rules to code-folder READMEs, and the frontmatter/tagline position of the code template.
- **Authoring-surface edits** that make the ruling explicit in `SKILL.md` §6, the code template, and the checklist reference.
- **The `hvr-rules.md` contradiction**, removed or explicitly scoped away from code-folder READMEs.
- **An opt-in code-folder mode in `validate_document.py`** covering: Directory Tree presence per the ruling, `---` separators between numbered H2 sections, language-tagged fences, local-link resolution, and a durability grep for packet/phase IDs and `.opencode/specs/` paths.
- **Manifest-driven discovery in `audit_readmes.py`** across all repository roots (`.opencode`, `.claude`, `.pi`, `.github`, `scripts`, repo root) with codified path-class exclusions for generated output, fixture payloads, and parent-documented single-file zones.
- **A negative-fixture corpus** under the existing `sk-doc/scripts/tests/` harness, one fixture per defect class plus one fully conformant control.

### Out of Scope

- Remediating any README — that is `002` (truth) and `003` (structure).
- `runtime/**` READMEs — `036/019` owns them; this phase only supplies the oracle they are checked against.
- Turning the code-folder mode on by default. Opt-in only, so the 379 existing README verdicts do not silently reclassify.

### Findings in scope

| ID | Sev | Kind | Surface | What it asserts |
|----|-----|------|---------|-----------------|
| `RA-001-01` | P1 | insight | `sk-create-readme/scripts/audit_readmes.py` | `find_readmes()` reads only repo root + `.opencode`; no missing-dir inventory exists |
| `RA-001-02` | P1 | insight | `shared/scripts/validate_document.py` | README validation is three checks; no tree/separator/fence/link/durability rule |
| `RA-001-03` | P1 | nonconformance | `shared/references/hvr-rules.md` | `:451-454` requires anchors + TOC that `SKILL.md:434-435` forbids |
| `RA-001-04` | P2 | nonconformance | `sk-create-readme/assets/readme-code-template.md` | Scaffold `:189-193` is H1 → `---` → `## 1. OVERVIEW` with no blockquote tagline |
| `RA-003-06` | P2 | insight | `sk-create-readme/assets/readme-code-template.md` | Analysis input to the ruling; generates no file edit of its own |
| `RA-005-40` | P2 | insight | `shared/scripts/validate_document.py` | Validator README contract is narrower than the authoring standard |
| `RA-005-41` | P2 | insight | `sk-create-readme/SKILL.md` | Analysis input to the ruling; generates no file edit of its own |
| `RA-009-01` | P2 | insight | `sk-create-readme/SKILL.md` | Analysis input to the ruling; generates no file edit of its own |
| `RA-010-01` | P1 | insight | `sk-create-readme/scripts/audit_readmes.py` | Auditor scope omits `.pi`, `.github`, `.claude`, `scripts/` |
| `NEW-A1` | P2 | nonconformance | `sk-create-readme/assets/readme-code-template.md` | `:180-187` scaffold ships `title`/`description`/`trigger_phrases` frontmatter while `SKILL.md:231` calls frontmatter optional. Found during synthesis; not in the 152 |

`RA-003-06`, `RA-005-41` and `RA-009-01` are analysis, not defects in any file. Their remedy is the decision record. They must not generate per-file tasks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-readme/SKILL.md` | Modify | State the tree ruling and the format-rule scope explicitly in §6 |
| `.opencode/skills/sk-doc/sk-create-readme/assets/readme-code-template.md` | Modify | Align scaffold with the ruling: frontmatter position, tagline, tree block |
| `.opencode/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md` | Modify | Reconcile checklist items with the ruling |
| `.opencode/skills/sk-doc/shared/references/hvr-rules.md` | Modify | Remove or scope away the anchor/TOC requirement for code READMEs |
| `.opencode/skills/sk-doc/shared/assets/template-rules.json` | Modify | Add the code-folder document-type rules |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Opt-in code-folder mode implementing the ruling |
| `.opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modify | Manifest-driven discovery + codified path-class exclusions |
| `.opencode/skills/sk-doc/scripts/tests/**` | Create | Negative-fixture corpus and the conformant control |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The tree-vs-table question is settled and recorded as a codified rule, not reviewer taste | `decision-record.md` carries an ADR with status Accepted; `SKILL.md` §6 states the rule in a form a script can implement. **[OPERATOR-DECISION: Q1 — tree vs table]** |
| REQ-002 | The applicability of the general format rules to code-folder READMEs is stated, not inferred | `SKILL.md` §6 explicitly lists which of numbering, casing, separators, fences, no-TOC and tagline bind code READMEs. `rg -n "General README format rules" SKILL.md` shows the block cross-referenced from §6. **[OPERATOR-DECISION: Q2 — format-rule applicability]** |
| REQ-003 | The `hvr-rules.md` contradiction no longer applies to code-folder READMEs | `rg -n "with anchors\|TOC entries match" .opencode/skills/sk-doc/shared/references/hvr-rules.md` returns zero lines, or returns only lines explicitly scoped away from code-folder READMEs |
| REQ-004 | `validate_document.py` gains an opt-in code-folder mode that flags every defect class in the fixture corpus and passes the conformant control | Each negative fixture exits non-zero with the expected rule id; the positive fixture exits zero |
| REQ-005 | Existing non-code-folder README verdicts are byte-identical before and after | Verdict dump over the 759 existing READMEs diffed pre/post: empty diff |
| REQ-006 | `audit_readmes.py` discovers missing READMEs from a durable-directory manifest across all repository roots | Run against the frozen 585-dir manifest reproduces the derived candidate set; codified exclusions leave seven raw gaps; `.pi/extensions/README.md` and `.github/workflows/README.md` appear in the audited set |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The code template scaffold and the SKILL prose agree on frontmatter and tagline | `NEW-A1` and `RA-001-04` both close: scaffold and `SKILL.md:231` state the same position |
| REQ-008 | The auditor can pass a folder that supplies equivalent orientation under a different filename | A designated orientation file supplying Overview plus inventory is accepted and the exemption is recorded, not reported as a gap. **[OPERATOR-DECISION: Q3 — equivalent orientation]** |
| REQ-009 | Every census-exclusion path class from the parent's dispositions list has a fixture-backed exclusion test | 21 disposition IDs map to exclusion test cases; `RA-005-08` in particular is path-excluded so the validator never scores its own test input |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer and a script reach the same verdict on the same code README, because every requirement is codified.
- **SC-002**: The negative-fixture corpus covers every defect class named in `003`'s scope and each fixture fails for the stated reason.
- **SC-003**: The 379 existing README verdicts are unchanged — the new mode adds capability without reclassifying the corpus.
- **SC-004**: The auditor reports a missing README anywhere in the repository, and reports zero false gaps for the 21 disposition paths.
- **SC-005**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` → Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Silent reclassification of 379 existing READMEs | High — turns a documentation phase into a repo-wide breakage | Mode is opt-in; REQ-005 diffs verdicts pre/post and blocks on any delta |
| Risk | CI consumes `validate_document.py`; a new default-on rule breaks unrelated pipelines | High | Opt-in flag plus a CI-path grep before landing; no change to the default code path |
| Risk | The ruling arrives late and `003` is authored against a guess | Medium — wasted task authoring | Hard gate: `003` Task 1 re-triages against the recorded ruling before `tasks.md` exists |
| Risk | The auditor's exclusion list becomes a way to hide real gaps | Medium | Every exclusion is a named path class with a fixture, not an ad-hoc path |
| Dependency | Operator rulings Q1, Q2, Q3 | Blocking for REQ-001, REQ-002, REQ-008 | Escalate once with the three questions together; they are inputs, not outputs |
| Dependency | Frozen 501-dir manifest (2026-07-30) | REQ-006 asserts against it | Re-freeze at Task T001 if HEAD has moved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The code-folder mode is deterministic — the same file yields the same verdict regardless of CWD.
- **NFR-R02**: Link resolution is evaluated relative to the README's own location, never the invocation directory.

### Security
- **NFR-S01**: The auditor's manifest walk does not follow symlinks out of the repository root.

---

## 8. EDGE CASES

### Data Boundaries
- Flat two-file folder with an exhaustive table and no tree: verdict depends entirely on the Q1 ruling. Fixture exists for both outcomes.
- Folder whose only README is owned by a fixture (`RA-005-08`): must be excluded, not scored.
- Folder with orientation supplied under a non-`README.md` filename: Q3 decides pass-with-exemption vs reported gap.

### Error Scenarios
- Broken relative link inside a fenced code block: must not be treated as a link.
- A `.opencode/specs/` path appearing inside an example command: durability grep must be scoped so a legitimate example is not a false positive.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 8, two scripts plus a JSON rule set, new fixture tree |
| Risk | 16/25 | Breaking: yes if the mode defaults on; CI consumes the validator |
| Research | 8/20 | Rulings are the research output; implementation is understood |
| Multi-Agent | 3/15 | Single workstream |
| Coordination | 8/15 | Blocks three downstream consumers |
| **Total** | **49/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | New rule defaults on and reclassifies 379 READMEs | H | M | Opt-in flag; REQ-005 verdict diff |
| R-002 | Ruling changes after `003` is authored | H | L | Hard gate on `003` task authoring |
| R-003 | Exclusion list drifts into a suppression list | M | M | Path classes only, each with a fixture |
| R-004 | Durability grep produces false positives on example text | M | M | Scope the pattern; conformant control fixture includes a legitimate example |

---

## 11. USER STORIES

### US-001: Codified verdict (Priority: P0)

**As a** README author, **I want** one unambiguous statement of what a code-folder README must contain, **so that** I do not have to guess which of two contradicting documents applies.

**Acceptance Criteria**:
1. Given a flat two-file folder with an exhaustive table, When I run the code-folder validator, Then the verdict matches the recorded ruling and cites a named rule id.

### US-002: Discoverable gaps (Priority: P1)

**As a** maintainer, **I want** the auditor to tell me which folders are missing orientation anywhere in the repository, **so that** a gap outside `.opencode` is not invisible.

**Acceptance Criteria**:
1. Given the frozen directory manifest, When I run the auditor, Then `.github/workflows` and `.pi/extensions` appear in the audited set and every disposition path is reported as an exclusion rather than a gap.

---

## 12. OPEN QUESTIONS

- **Q1** — Accepted. A fenced tree is mandatory when the target folder's immediate subdirectory count is greater than zero. A complete `CONTENTS`, `FILES` or `KEY FILES` table naming every direct file other than the README satisfies the flat-folder branch.
- **Q2** — Accepted. Numbering, ALL-CAPS H2 casing, `---` separators, language-tagged fences, no-TOC and no-anchor rules bind code-folder READMEs. The blockquote tagline does not.
- **Q3** — Accepted. A manifest-designated orientation file with the same Overview plus inventory content is an explicit exemption from the `README.md` filename requirement.

### Implementation Evidence

- Frozen manifest: `.opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, with 585 derived directories against the parent prose baseline of 501, a delta of +84, and reproducible output.
- Parity baseline: `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`, containing 759 existing README verdicts with an empty post-change diff.
- Mode invocation: `--type code_folder` or `--type code-folder`. The narrow `--type readme` caller path remains unchanged.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
