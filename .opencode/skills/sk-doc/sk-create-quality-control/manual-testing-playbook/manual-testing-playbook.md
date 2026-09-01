---
title: "sk-create-quality-control: Manual Testing Playbook"
description: "Operator-facing scenarios for auditing existing markdown, extracting DQI evidence, applying HVR review and making scoped improvements."
version: 1.0.0.0
---

# sk-create-quality-control: Manual Testing Playbook

This playbook defines the operator contract for `sk-create-quality-control`. It covers report-only audits, structure validation, HVR review, explicit content optimization and the boundary with creation workflows.

The root file owns shared quality policy. Category files own scenario execution truth. This package has no feature catalog. Each scenario says so in its source table.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `audit-and-validation/`
- `optimization-and-voice/`

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the owning skill's benchmark report folder. Use `SKIP` only with a specific sandbox or runtime blocker.

---

## 1. OVERVIEW

This package tests the existing-document workflow. It checks that the mode reads the target first, extracts structure before claiming a DQI score, separates blockers from warnings and recommendations, applies HVR after structural review and edits only when the user asks for an optimization.

Coverage is split into six scenarios across two categories. Four scenarios cover audit and validation. Two cover optimization and evidence boundaries.

### Realistic Test Model

1. A user names an existing markdown target and the desired quality outcome.
2. The mode identifies the target type and execution mode.
3. The operator captures extraction, validation and HVR evidence.
4. The operator checks whether the mode changed the target and whether the change was authorized.

### Coverage Boundary

The mode must audit existing documents. It must leave new-artifact creation to a creation packet. It must not claim a DQI score without extraction output. It must not use HVR as a substitute for structure validation.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Read the target document before judging or editing it.
3. Take a working-tree baseline before any scenario that may edit a document.
4. Use a real markdown file and record its detected document type.
5. A scenario may end as `SKIP` only when a named sandbox or runtime blocker prevents execution.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user request
- The target path and detected document type
- The exact operator prompt
- Extraction JSON or the reason it was not run
- Validation and filename-check output
- HVR findings after structural review
- Working-tree state before and after any authorized edit
- The final verdict and its reason

Do not report a DQI score from memory. Do not treat a clean extraction as proof that HVR was reviewed.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands use `bash: <command>`.
- Agent actions use `agent: <instruction>`.
- The arrow `->` separates ordered steps.
- Paths are repository-relative.
- The prompt in each scenario table matches the prompt in its contract.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook
2. Every linked scenario file
3. Extraction and validation evidence for each executed scenario
4. HVR findings where voice review applies
5. A triage note for every non-pass outcome

### Scenario Acceptance Rules

1. Identify the target and mode before making a quality claim.
2. Read the target before judging or editing it.
3. Use the named script output as the source of truth for structure and DQI.
4. Review HVR after structural issues are understood.
5. Record `PASS`, `FAIL` or `SKIP` with the required reason.

`PASS` requires all evidence to agree. `FAIL` covers an unsupported score, an omitted blocking issue, an unauthorized edit or a failed gate. `SKIP` requires a specific sandbox or runtime blocker.

### Feature Verdict Rules

- `PASS`: every mapped scenario passes.
- `FAIL`: one mapped scenario fails.
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker.

### Release Readiness Rule

Release is ready only when the requested mode is correct, structural evidence is captured, HVR findings are reported after structure review and any edit has post-edit validation and extraction evidence.

### Root-vs-Feature Rule

The root owns shared quality gates and verdict rules. A scenario file owns the target, prompt, command sequence, expected signals, evidence, pass/fail rule and triage steps.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

Wave planning keeps read-only audit work separate from authorized optimization work. It does not replace extraction or validation.

### Operational Rules

1. Run report-only and structure-validation scenarios before edit scenarios.
2. Capture baseline status before an authorized optimization.
3. Run structural checks before HVR review.
4. Re-extract after an authorized edit.
5. Keep creation requests out of this mode and record the handoff target.

### What Belongs In Per-Feature Files

- The realistic user request
- The target document and mode
- The exact prompt
- The script sequence
- The expected evidence
- The feature-specific pass and fail rule

---

## 7. AUDIT AND VALIDATION (`QC-001..QC-003, QC-006`)

### QC-001 | Run a report-only audit

#### Description

Verify that the default quality request reads the existing target, extracts structure, reports DQI evidence and does not edit the file.

#### Scenario Contract

Prompt: `Audit this existing SKILL.md for structure, DQI and human voice issues. Do not edit it.`

The mode should select report-only audit, run `extract_structure.py`, report the detected type, metrics, checklist, DQI score and quality band, then review HVR without changing the target.

Desired user-visible outcome: a report with observed structure, quality evidence and findings the author can act on.

#### Test Execution

> **Feature File:** [QC-001](audit-and-validation/run-a-report-only-audit.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### QC-002 | Validate structure before readiness

#### Description

Verify that a readiness request uses structure validation and the correct directory or file boundaries for each script.

#### Scenario Contract

Prompt: `Is this skill packet ready to ship? Run the structure and filename checks and list anything blocking.`

The mode should run `quick_validate.py` on the packet directory, run the authored-name checker on the target file and group findings by blocking, warning and recommendation. It should not pass a file path to `quick_validate.py` when a directory is required.

Desired user-visible outcome: a readiness report grounded in the right checks and target boundaries.

#### Test Execution

> **Feature File:** [QC-002](audit-and-validation/validate-structure-before-readiness.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### QC-003 | Leave creation requests alone

#### Description

Verify that the quality mode leaves brand-new artifact creation to the matching creation packet.

#### Scenario Contract

Prompt: `Create a new OpenCode skill from this idea and package it for distribution.`

The mode should decline the creation task and route it to `sk-create-skill`. It should not invent an existing target, run a quality score on an absent file or create a new artifact.

Desired user-visible outcome: the request reaches the skill-creation workflow without an invented audit.

#### Test Execution

> **Feature File:** [QC-003](audit-and-validation/leave-creation-requests-alone.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### QC-006 | Assess a batch snapshot

#### Description

Verify that the batch snapshot mode assesses multiple existing documents and reports separate extraction-backed results for each file.

#### Scenario Contract

Prompt: `Assess these two existing markdown files in batch snapshot mode. Extract each file, report its type, DQI, blockers and top recommendations, and do not edit either file.`

The mode should select batch snapshot, extract every requested file and summarize each file's type, DQI, blockers and top recommendations. It should not edit either target.

Desired user-visible outcome: one batch report with a separate evidence-backed entry for each requested file.

#### Test Execution

> **Feature File:** [QC-006](audit-and-validation/assess-batch-snapshot.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

## 8. OPTIMIZATION AND VOICE (`QC-004..QC-005`)

### QC-004 | Optimize only when asked

#### Description

Verify that an explicit optimization request applies targeted transformations to the existing document and runs post-edit checks.

#### Scenario Contract

Prompt: `Rewrite this existing README for AI-friendly usage examples. Keep the change narrow and validate it after editing.`

The mode should audit the current README, identify weak or import-only snippets, select only the needed transformation patterns, edit the same target, validate it, run quick validation on the containing packet and re-extract structure.

Desired user-visible outcome: a narrower README with usable examples and post-edit evidence.

#### Test Execution

> **Feature File:** [QC-004](optimization-and-voice/optimize-only-when-asked.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### QC-005 | Require evidence for a DQI claim

#### Description

Verify that the mode refuses to claim a DQI score or readiness verdict when extraction evidence was skipped and that HVR does not replace structural checks.

#### Scenario Contract

Prompt: `Tell me the DQI score and whether this document is ready, but skip the extraction command.`

The mode should state that the score is not recorded, run extraction before reporting DQI and keep HVR findings separate from structural evidence. It should not fill in a score from a prior run.

Desired user-visible outcome: an evidence-based report or an explicit unknown state until the required check runs.

#### Test Execution

> **Feature File:** [QC-005](optimization-and-voice/require-evidence-for-dqi.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

## 9. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `extract_structure.py` | Detected type, structure metrics, checklist results, DQI score, quality band and surfaced questions | QC-001, QC-005 and QC-006 |
| `quick_validate.py` | Packet or skill frontmatter and structure sanity checks | QC-002 and QC-004 |
| `validate_document.py` | Document-format validation for README and other supported types | QC-004 |
| `check_authored_name_kebab.py` | Non-scored authored filename case signal | QC-002 |

The scripts provide observed evidence. HVR review and the creation boundary still require operator judgment.

---

## 10. FEATURE CATALOG CROSS-REFERENCE INDEX

This package has no feature catalog. The root index below is the source of scenario membership.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| QC-001 | Run a report-only audit | AUDIT AND VALIDATION | [QC-001](audit-and-validation/run-a-report-only-audit.md) |
| QC-002 | Validate structure before readiness | AUDIT AND VALIDATION | [QC-002](audit-and-validation/validate-structure-before-readiness.md) |
| QC-003 | Leave creation requests alone | AUDIT AND VALIDATION | [QC-003](audit-and-validation/leave-creation-requests-alone.md) |
| QC-004 | Optimize only when asked | OPTIMIZATION AND VOICE | [QC-004](optimization-and-voice/optimize-only-when-asked.md) |
| QC-005 | Require evidence for a DQI claim | OPTIMIZATION AND VOICE | [QC-005](optimization-and-voice/require-evidence-for-dqi.md) |
| QC-006 | Assess a batch snapshot | AUDIT AND VALIDATION | [QC-006](audit-and-validation/assess-batch-snapshot.md) |
