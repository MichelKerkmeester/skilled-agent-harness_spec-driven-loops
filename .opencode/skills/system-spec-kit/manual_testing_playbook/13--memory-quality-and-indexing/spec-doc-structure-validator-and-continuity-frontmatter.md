---
title: "201 -- Spec-doc structure validator and continuity frontmatter"
description: "This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block."
audited_post_018: true
version: 3.6.0.13
---

# 201 -- Spec-doc structure validator and continuity frontmatter

## 1. OVERVIEW

This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block.

## 2. SCENARIO CONTRACT


- Objective: Verify the five-rule validator bridge and continuity block enforcement.
- Real user request: `` Please validate Spec-doc structure validator and continuity frontmatter against _memory.continuity and tell me whether the expected signals are present: five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly. ``
- Prompt: `Validate spec-doc structure validator and continuity frontmatter enforcement.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the five rules run in order and malformed continuity/frontmatter state fails closed; FAIL if a rule is skipped or invalid continuity state is accepted

---

## 3. TEST EXECUTION

### Prompt

```
Validate spec-doc structure validator and continuity frontmatter enforcement.
```

### Commands

1. Create or pick a spec doc with a deliberately malformed `_memory.continuity` block
2. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict <target-spec>`
3. Confirm the five rules appear in the expected order
4. Repair the continuity block and rerun
5. Confirm the document passes cleanly

### Expected

Five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly

### Evidence

Pre-existing malformed target selected by read-only search:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts/spec.md:
  Line 24:       fingerprint: "sha256:rm8-009-spec-author-2026-05-11"


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts/plan.md:
  Line 21:       fingerprint: "sha256:rm8-009-plan-author-2026-05-11"


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts/tasks.md:
  Line 20:       fingerprint: "sha256:rm8-009-tasks-author-2026-05-11"
```

Malformed validation command run:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict ".opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts"
```

Malformed validation output:

```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts
  Level:  1

+ FILE_EXISTS: All required files present for Level 1
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 4 file(s)
+ ANCHORS_VALID: Template anchors match in 4 file(s)
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 3 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
+ GENERATED_METADATA_INTEGRITY: Generated metadata passed schema, status-enum and path-prefix invariants
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'In Progress', not Complete; scaffold markers are allowed
+ EVIDENCE_CITED: No checklist.md (Level 1 or missing)
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 1
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 1; phases=3, tasks=13, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '009-harden-deep-review-iteration-prompts' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 1)
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
! SECTION_COUNTS: Section counts below expectations for Level 1
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity normalization drift detected (soft detector)
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window

Summary: Errors: 1  Warnings: 1

RESULT: FAILED
```

Repair/rerun step status:

```text
BLOCKED: scenario command 4 requires repairing the continuity block in the selected target spec folder, but the allowed write paths for this run permit editing only .opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/spec-doc-structure-validator-and-continuity-frontmatter.md. No repaired validation run was executed.
```

### Pass / Fail

- **BLOCKED**: malformed continuity/frontmatter state failed closed, but the scenario could not complete because repairing and rerunning the selected target would require modifying a file outside the single allowed write path for this run.

### Failure Triage

Inspect `mcp_server/lib/validation/spec-doc-structure.ts` rule dispatch, validate.sh aliases, and the continuity block renderer

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/spec-doc-structure-validator.md](../../feature_catalog/13--memory-quality-and-indexing/spec-doc-structure-validator.md)
- Source files: `mcp_server/lib/validation/spec-doc-structure.ts`, `scripts/spec/validate.sh`

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 201
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/spec-doc-structure-validator-and-continuity-frontmatter.md`
