---
title: "create-diff: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the create-diff sk-doc mode."
version: 1.0.0.0
---

# create-diff: Manual Testing Playbook

This document combines the full manual-validation contract for the `create-diff` sk-doc mode into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `create-diff` mode. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `comparison/`
- `snapshot/`
- `safety/`

---

## 1. OVERVIEW

This playbook provides 11 deterministic scenarios across 3 categories validating the `create-diff` mode surface. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-07-15): every scenario is runnable today against `scripts/create_diff.py` and `scripts/validate_report.py`; PDF scenarios require a local extractor (`pdftotext`/`pypdf`/`pdfplumber`).

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the packet root `.opencode/skills/sk-doc/create-diff/` (or supply absolute paths to the scripts).
2. Python 3.9+ is available on `PATH`.
3. For PDF scenarios, at least one of `pdftotext`, `pypdf`, or `pdfplumber` is installed; otherwise CMP-003 is a documented SKIP.
4. A scratch directory outside the repo is used for generated reports and the `.create-diff/` snapshot store.
5. No destructive scenarios exist — the engine never mutates source files — but each scenario MUST confirm the input files are byte-unchanged afterward.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets (CLI summary and/or `--json`)
- Generated report path and `validate_report.py` result
- Source-file checksum before and after (to prove no mutation)
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `python3 scripts/create_diff.py <subcommand> [args]`.
- Validator calls shown as `python3 scripts/validate_report.py <report.html>`.
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` (CMP-001, SNAP-001, SAFE-001, SAFE-003) forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run any environment-dependent scenario (CMP-003 PDF) in a wave that first confirms extractor availability.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role -> Context -> Action -> Format contract
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. COMPARISON (`CMP-001..CMP-004`)

### CMP-001 | Markdown before/after review

#### Description
Verify that two versions of a Markdown document produce a correct, full-fidelity before/after report.

#### Scenario Contract
Prompt: `Show me what changed between these two versions of my onboarding guide.`

Compare the shipped fixtures with `compare-pair`; expect added, changed, and unchanged lines with inline word highlights and a `markdown, tier full` summary.

Desired user-visible outcome: a self-contained HTML report the user can open offline that clearly shows the additions and reworded sentences.

#### Test Execution
> **Feature File:** [CMP-001](comparison/markdown-before-after-review.md)
> **Catalog:** [multi-format-extraction](../feature-catalog/comparison-engine/multi-format-extraction.md)

---

### CMP-002 | DOCX text comparison

#### Description
Verify that paragraph and table text is extracted from two `.docx` files and compared at text fidelity with an honest warning.

#### Scenario Contract
Prompt: `Diff these two Word documents and tell me what text changed.`

Compare two `.docx` files; expect extracted paragraph text, a `docx, tier text` summary, and a fidelity warning that formatting/tracked-changes are not compared.

Desired user-visible outcome: a report of the textual changes plus a clear statement that styling was not compared.

#### Test Execution
> **Feature File:** [CMP-002](comparison/docx-text-comparison.md)
> **Catalog:** [multi-format-extraction](../feature-catalog/comparison-engine/multi-format-extraction.md)

---

### CMP-003 | PDF text comparison (conditional)

#### Description
Verify that the text layer of two PDFs is extracted and compared when an extractor is available, and that missing extractors fail cleanly.

#### Scenario Contract
Prompt: `Compare the text of these two PDF exports.`

With an extractor present, expect a `pdf, tier text*` report; with none, expect exit `3` and an actionable message pointing to the explicit-pair fallback.

Desired user-visible outcome: a text diff of the PDFs, or a clear, non-fabricated explanation of why it could not run.

#### Test Execution
> **Feature File:** [CMP-003](comparison/pdf-text-comparison.md)
> **Catalog:** [capability-tier-reporting](../feature-catalog/safety-and-capabilities/capability-tier-reporting.md)

---

### CMP-004 | HTML visible-text comparison

#### Description
Verify that only visible text is extracted from HTML (scripts/styles dropped) and compared at text fidelity.

#### Scenario Contract
Prompt: `What text changed between these two HTML pages?`

Compare two `.html` files where one contains a `<script>`/`<style>`; expect the script/style content to be excluded, visible text compared, and a fidelity warning.

Desired user-visible outcome: a report of the visible-text changes that does not leak or execute page scripts.

#### Test Execution
> **Feature File:** [CMP-004](comparison/html-visible-text-comparison.md)
> **Catalog:** [multi-format-extraction](../feature-catalog/comparison-engine/multi-format-extraction.md)

---

## 8. SNAPSHOT (`SNAP-001..SNAP-003`)

### SNAP-001 | Baseline capture then compare

#### Description
Verify the capture-before-edit invariant: snapshot a file, edit it, then compare against the stored baseline.

#### Scenario Contract
Prompt: `Save a baseline of this doc before I let the AI edit it, then show me the diff afterward.`

Run `snapshot`, modify the file, then `compare`; expect the report to reflect the edit and the source snapshot store under `.create-diff/`.

Desired user-visible outcome: a correct diff between the pre-edit baseline and the edited file.

#### Test Execution
> **Feature File:** [SNAP-001](snapshot/baseline-capture-then-compare.md)
> **Catalog:** [baseline-snapshot-and-compare](../feature-catalog/snapshot-lifecycle/baseline-snapshot-and-compare.md)

---

### SNAP-002 | Missing baseline routes to fallback

#### Description
Verify that `compare` with no stored baseline exits `4` and that the explicit-pair fallback works instead.

#### Scenario Contract
Prompt: `Diff this file — oh, I never saved a baseline.`

Run `compare` on a file with no snapshot (expect exit `4` and guidance), then `compare-pair` with two explicit files (expect a report).

Desired user-visible outcome: a clear "no baseline" message and a working fallback path.

#### Test Execution
> **Feature File:** [SNAP-002](snapshot/missing-baseline-fallback.md)
> **Catalog:** [explicit-pair-comparison](../feature-catalog/snapshot-lifecycle/explicit-pair-comparison.md)

---

### SNAP-003 | Snapshot status and cleanup

#### Description
Verify that stored baselines can be listed and pruned safely, with a dry-run preview.

#### Scenario Contract
Prompt: `List my saved baselines and clean up the old ones.`

Run `status` (expect a listing), then `cleanup --older-than N --dry-run` (expect a preview with no deletion), then `cleanup --older-than N` (expect removal).

Desired user-visible outcome: an accurate snapshot listing and a safe, previewable cleanup.

#### Test Execution
> **Feature File:** [SNAP-003](snapshot/snapshot-status-and-cleanup.md)
> **Catalog:** [snapshot-state-management](../feature-catalog/snapshot-lifecycle/snapshot-state-management.md)

---

## 9. SAFETY (`SAFE-001..SAFE-004`)

### SAFE-001 | Report is self-contained and zero-JS

#### Description
Verify that a generated report passes the safety validator: correct doctype, `lang`, CSP, no scripts, no remote references.

#### Scenario Contract
Prompt: `Make sure the diff report is safe to open and doesn't call out to the internet.`

Generate any report, then run `validate_report.py`; expect `PASS` and confirm by inspection that CSS is inlined and there are no `<script>` tags or remote `href`/`src`.

Desired user-visible outcome: a validator `PASS` and a report that works fully offline.

#### Test Execution
> **Feature File:** [SAFE-001](safety/self-contained-zero-js-report.md)
> **Catalog:** [report-safety-validation](../feature-catalog/safety-and-capabilities/report-safety-validation.md)

---

### SAFE-002 | Hostile content is escaped

#### Description
Verify that document content containing markup (e.g. `<script>`, `onerror=`) is escaped as inert text and does not become live markup or fail the validator.

#### Scenario Contract
Prompt: `One of these files has a fake script tag in the text — make sure the report is still safe.`

Compare a file whose content includes `<script>alert(1)</script>` and `<img src=x onerror=...>`; expect the tokens escaped (`&lt;script&gt;`) and a validator `PASS`.

Desired user-visible outcome: the hostile text is shown as literal characters, never executed, and the report still validates safe.

#### Test Execution
> **Feature File:** [SAFE-002](safety/hostile-content-escaped.md)
> **Catalog:** [self-contained-report](../feature-catalog/comparison-engine/self-contained-report.md)

---

### SAFE-003 | Source file never mutated

#### Description
Verify that neither `snapshot` nor `compare` nor `compare-pair` ever writes to a source document.

#### Scenario Contract
Prompt: `Confirm the tool never changes my original files.`

Checksum inputs, run snapshot + compare + compare-pair, then re-checksum; expect byte-identical sources.

Desired user-visible outcome: identical checksums before and after every operation.

#### Test Execution
> **Feature File:** [SAFE-003](safety/source-never-mutated.md)
> **Catalog:** [baseline-snapshot-and-compare](../feature-catalog/snapshot-lifecycle/baseline-snapshot-and-compare.md)

---

### SAFE-004 | Capability reporting and unsupported handling

#### Description
Verify that `capabilities` reports the format matrix and detected PDF extractor, and that unsupported/limited cases fail honestly.

#### Scenario Contract
Prompt: `What document formats can this compare, and how well?`

Run `capabilities` (and `capabilities --json`); expect the five formats with tiers and the detected PDF extractor; confirm an unsupported case exits `3` rather than fabricating a diff.

Desired user-visible outcome: an accurate capability matrix and honest failure on unsupported input.

#### Test Execution
> **Feature File:** [SAFE-004](safety/capability-and-unsupported-handling.md)
> **Catalog:** [capability-tier-reporting](../feature-catalog/safety-and-capabilities/capability-tier-reporting.md)

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/create_diff.py` (engine) | Extraction, diff, snapshot, report across five formats | CMP-001..004, SNAP-001..003 |
| `scripts/validate_report.py` (validator) | Report self-containment and safety | SAFE-001, SAFE-002 |

Note: automated coverage is exercised by a cross-format engine suite (27 checks) run during development; this playbook is the operator-facing manual equivalent and does not ship a committed test runner.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CMP-001 | Markdown before/after review | COMPARISON | [CMP-001](comparison/markdown-before-after-review.md) |
| CMP-002 | DOCX text comparison | COMPARISON | [CMP-002](comparison/docx-text-comparison.md) |
| CMP-003 | PDF text comparison | COMPARISON | [CMP-003](comparison/pdf-text-comparison.md) |
| CMP-004 | HTML visible-text comparison | COMPARISON | [CMP-004](comparison/html-visible-text-comparison.md) |
| SNAP-001 | Baseline capture then compare | SNAPSHOT | [SNAP-001](snapshot/baseline-capture-then-compare.md) |
| SNAP-002 | Missing baseline routes to fallback | SNAPSHOT | [SNAP-002](snapshot/missing-baseline-fallback.md) |
| SNAP-003 | Snapshot status and cleanup | SNAPSHOT | [SNAP-003](snapshot/snapshot-status-and-cleanup.md) |
| SAFE-001 | Report is self-contained and zero-JS | SAFETY | [SAFE-001](safety/self-contained-zero-js-report.md) |
| SAFE-002 | Hostile content is escaped | SAFETY | [SAFE-002](safety/hostile-content-escaped.md) |
| SAFE-003 | Source file never mutated | SAFETY | [SAFE-003](safety/source-never-mutated.md) |
| SAFE-004 | Capability reporting and unsupported handling | SAFETY | [SAFE-004](safety/capability-and-unsupported-handling.md) |
