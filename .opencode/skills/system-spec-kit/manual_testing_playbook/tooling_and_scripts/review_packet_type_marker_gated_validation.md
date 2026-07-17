---
title: "M-011 -- Review packet type marker-gated validation"
description: "Verify the review packet type: the SPECKIT_LEVEL review marker waives plan/tasks/implementation-summary and requires only the lean review record plus review/review-report."
version: 3.7.0.0
id: tooling-and-scripts-review-packet-type-marker-gated-validation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-011 -- Review packet type marker-gated validation

## 1. OVERVIEW

This scenario validates the review packet type in `validate.sh`. A `<!-- SPECKIT_LEVEL: review -->` marker in `spec.md` selects the lean review-record level. That level waives the heavy authored docs (`plan.md`, `tasks.md`, `implementation-summary.md`) and requires only `spec.md` plus a `review/review-report.md`. The marker is the only entry into the review path, so no inferred folder reaches it. The `review.spec.md.tmpl` template seeds a compliant review record. Archived packets may still carry unrelated metadata or content warnings; use a clean scaffold when asserting a strict exit-code 0.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the review marker selects the review level, waives plan/tasks/implementation-summary and requires only the lean review record plus its review report.
- Real user request: `Validate the review packet type: a spec.md carrying the SPECKIT_LEVEL review marker should validate clean with only the review record and review/review-report.md present, and should not demand plan.md, tasks.md or implementation-summary.md.`
- Prompt: `Validate the review packet type marker-gated validation against bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict <spec-folder> and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: validate.sh reports the detected level as `review` via the explicit marker, validates the lean review record and review/review-report.md file set, and never flags missing plan.md, tasks.md or implementation-summary.md. A clean scaffold exits 0 under `--strict`; an archived packet with unrelated warnings may exit 2 without invalidating the review-file waiver.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the marker selects the review level and the heavy docs are waived; do not fail this scenario solely because the chosen archived packet has unrelated strict-mode warnings.

---

## 3. TEST EXECUTION

### Prompt

`Validate the review packet type marker-gated validation against bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict <spec-folder> and report cited pass/fail evidence.`

### Commands

1. Identify a review-record packet whose `spec.md` carries `<!-- SPECKIT_LEVEL: review -->`. Use a clean scaffold from `templates/manifest/review.spec.md.tmpl` when the assertion includes exit-code 0; archived packets can be used for marker and file-waiver evidence only if their unrelated warnings are called out.
2. Confirm the marker and the required files:
   ```bash
   grep -lE '<!-- SPECKIT_LEVEL: *review *-->' <spec-folder>/spec.md
   ls <spec-folder>/review/review-report.md
   ```
3. Validate the packet under strict mode:
   ```bash
   bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
   ```
4. Check the detected level and exit code in the output.

### Expected

The detected level is `review` (explicit method), the run never reports a missing `plan.md`, `tasks.md` or `implementation-summary.md`, and a clean review scaffold exits 0 under `--strict`. If an archived review packet exits 2 because of unrelated warnings, record those warnings as packet-local caveats rather than review-level validation failures.

### Evidence

Selected packet: `.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation`

Command:
```bash
grep -lE '<!-- SPECKIT_LEVEL: *review *-->' ".opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation/spec.md"
```

Output:
```text
.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation/spec.md
```

Command:
```bash
ls ".opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation/review/review-report.md"
```

Output:
```text
.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation/review/review-report.md
```

Command:
```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation" --strict
```

Output:
```text

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation
  Level:  review

+ FILE_EXISTS: All required files present for Level review
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 1 file(s)
+ ANCHORS_VALID: Template anchors match in 1 file(s)
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'Research Complete', not Complete; scaffold markers are allowed
+ EVIDENCE_CITED: No checklist.md (Level 1 or missing)
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 1
! COMPLEXITY_MATCH: Content metrics may not match declared Level 1
+ FOLDER_NAMING: Folder name '010-dark-flag-validation' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 1)
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
! DESCRIPTION_SHAPE: description.json has 1 shape error(s)
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
! SECTION_COUNTS: Section counts below expectations for Level review
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window

Summary: Errors: 0  Warnings: 3

RESULT: FAILED
```

Exit-code check command:
```bash
bash -c 'bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/system-speckit/028-memory-search-intelligence/007-dark-flag-graduation/010-dark-flag-validation" --strict; status=$?; printf "\nEXIT_CODE=%s\n" "$status"'
```

Exit-code output:
```text
EXIT_CODE=2
```

Archived-packet caveat: this packet proves marker detection and the heavy-doc waiver (`FILE_EXISTS: All required files present for Level review`), but it is not a clean strict-exit fixture. Its strict run exits 2 because of unrelated packet-local warnings for `COMPLEXITY_MATCH`, `DESCRIPTION_SHAPE`, and `SECTION_COUNTS`.

### Pass / Fail

- **PASS WITH CAVEAT**: review level was selected by the marker and heavy docs were waived. The selected archived packet is not a strict-exit fixture because it prints `RESULT: FAILED` and `EXIT_CODE=2` with unrelated warnings for `COMPLEXITY_MATCH`, `DESCRIPTION_SHAPE`, and `SECTION_COUNTS`.

### Failure Triage

Inspect the review-marker detection in `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (the `<!-- SPECKIT_LEVEL: review -->` branch that sets `DETECTED_LEVEL=review`). Confirm the review level maps to the lean `spec + review/review-report` required-file set and that the `review.spec.md.tmpl` template carries the marker.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Validator: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- Template: `.opencode/skills/system-spec-kit/templates/manifest/review.spec.md.tmpl`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/review_packet_type_marker_gated_validation.md`
