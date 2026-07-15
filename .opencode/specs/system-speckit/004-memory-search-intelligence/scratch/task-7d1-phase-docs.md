# Phase-Local Documentation Lineage Reconciliation

## Scope and path resolution

- Resolution source: `scratch/topology-migration-manifest.json` (`status: applied`; no fallback Glob required).
- Former 010 `query-channel-calibration` -> `002-speckit-memory/012-query-channel-calibration`; writable target: `plan.md`.
- Former 011 `automatic-drift-self-healing` -> `002-speckit-memory/014-automatic-drift-self-healing`; writable target: `plan.md`.
- Former 013 `drift-marker-pipeline-resilience` -> `002-speckit-memory/018-drift-marker-pipeline-resilience`; writable target: `checklist.md`.
- Former 023 `self-healing-model-consolidation` -> `002-speckit-memory/033-self-healing-model-consolidation`; writable target: `spec.md`.
- Related former root phases used to correct the former-023 historical claim: former 017 -> `005-dark-flag-graduation/010-flag-vocabulary-consolidation`; former 018 -> `002-speckit-memory/025-git-hooks-reinstall-and-guard`; former 019 -> `003-spec-data-quality/010-validation-enforce-graduation`.

## Local evidence and reconciliation decisions

### Former 010

- `tasks.md` records the phase-007 dependency confirmation and all implementation tasks complete.
- `checklist.md` marks the dependency available and records full verification.
- `implementation-summary.md` records the packet as implemented with explicitly itemized unrelated package-wide limitations.
- Decision: preserve the dependency table's plan-time Red state, qualify it as historical, add the current shipped state, and close the matching pre-deployment checkbox with phase-local evidence.

### Former 011

- `tasks.md` records phases 007 and 008 as shipped prerequisites and all implementation tasks complete, while leaving broad external gates open.
- `checklist.md` confirms both dependencies shipped before implementation and keeps lint, broad-console/suite state, and temp cleanup open.
- `implementation-summary.md` remains In Progress because those external gates are unresolved.
- Decision: preserve the dependency table's original planned state as an as-of statement and add the current shipped state without claiming packet completion.

### Former 013

- `tasks.md` reports `completion_pct: 100`, all tasks complete, no blocked tasks, and strict validation passed.
- `checklist.md` already has every P0/P1/P2 item checked and its summary reports 14/14 P0, 13/13 P1, and 1/1 P2, but frontmatter incorrectly reports `completion_pct: 0`.
- `implementation-summary.md` reports `completion_pct: 100`, Complete status, and strict validation passed.
- Decision: change only checklist frontmatter `completion_pct` from 0 to 100; no checklist item states need alteration.

### Former 023

- `tasks.md`, `checklist.md`, and `implementation-summary.md` report complete implementation and verification.
- The migration manifest proves former root phases 017, 018, and 019 now have canonical folders; the spec's statement that they do not exist is stale.
- Decision: preserve the statement as a plan-authoring snapshot, then state the current manifest-resolved existence and replace the obsolete nonexistence caveat with a current overlap-recheck instruction.

## Validation checkpoints

Each production-document edit is followed immediately by strict validation of its resolved phase folder. Full command output and exit status are appended below.

## Quality assessment

- Workflow: existing-document optimization using the document's current structure (`template=none`), `sk-doc` create-quality-control rules, and system-spec-kit checklist evidence requirements.
- DQI: former 010 = 91, former 011 = 91, former 013 = 79, former 023 = 89; minimum = **79**, satisfying the required threshold of 75.
- HVR: edits are narrow, direct, evidence-qualified, and preserve historical meaning rather than rewriting history.

## External or pre-existing failures

- Spec Memory trigger retrieval timed out twice during the original attempt/retry; local canonical files were used as runtime truth.
- Phase-local pre-existing validation warnings or errors, if any, are recorded verbatim at the checkpoint that surfaces them.

### Checkpoint 1 — former 010 `plan.md`

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration --strict`
- Exit: `2`

```text

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Implemented, verification-limited' and implementation-summary.md Status 'IMPLEMENTED, verification-limited' both classify as complete
+ EVIDENCE_CITED: All completed P0/P1 checklist/task items have substantive evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=3, tasks=27, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '012-query-channel-calibration' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity last_updated_at is within the 10-minute heuristic policy budget
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
(node:54246) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

## Halt state

- Execution stopped at the first atomic production-file-plus-validation checkpoint.
- Strict validation exited `2` after the former-010 `plan.md` edit, reporting enforced `GENERATED_METADATA_INTEGRITY` and `SPEC_DOC_INTEGRITY` failures.
- The validator output did not identify enough detail to prove these failures were external or pre-existing, and the writable boundary forbids the JSON metadata changes that might otherwise reconcile generated integrity. Per the dispatch contract, no guess or further production edit was made.
- DQI extraction was not run because strict validation blocked continuation; no `DQI >= 75` completion claim is made.
- Modified paths at halt: `002-speckit-memory/012-query-channel-calibration/plan.md` and `scratch/task-7d1-phase-docs.md` only.

## Retry 2 attribution and continuation

### Checkpoint 1 attribution — former 010

- Re-run command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration --strict --verbose`.
- `GENERATED_METADATA_INTEGRITY`: external/out-of-scope. Detail: `graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH`. Editing any governed source document changes the re-derived fingerprint; the task explicitly forbids JSON/generated-metadata writes.
- `SPEC_DOC_INTEGRITY`: external/pre-existing topology residue. Detail: `implementation-summary.md has stale Spec Folder metadata: 010-query-channel-calibration`; the only writable former-010 file is `plan.md`, and this stale metadata is outside that file.
- Attributable issues in the in-scope `plan.md` edit: **0**. All document-structure, section, anchor, frontmatter, evidence, status-consistency, and comment-hygiene checks passed.
- Continuation decision: proceed past the proven generated-metadata and out-of-scope implementation-summary failures, as authorized by Retry 2.

### Former 011 write

- Qualified both dependency rows with explicit plan-authoring and current-state clauses.
- Phase-local evidence: `tasks.md` T001/T002 and `checklist.md` CHK-003 record both dependencies as shipped before implementation; `implementation-summary.md` remains In Progress for unrelated lint/broad-suite gates, so this edit does not claim packet completion.

### Checkpoint 2 — former 011 `plan.md`

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/014-automatic-drift-self-healing --strict --verbose`
- Exit: `2`

```text

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/014-automatic-drift-self-healing
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
i LEVEL_DECLARED: Detected Level 2
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
    - graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH: source_fingerprint does not match a re-derive of the current source docs, the stored derived fields may be stale
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'In Progress', not Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'In Progress' and implementation-summary.md Status 'In Progress' both classify as in-progress
+ EVIDENCE_CITED: All completed P0/P1 checklist/task items have substantive evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=5, tasks=43, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '014-automatic-drift-self-healing' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/014-automatic-drift-self-healing
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
    - implementation-summary.md has stale Spec Folder metadata: 011-automatic-drift-self-healing
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Continuity last_updated_at lags graph-metadata derived.last_save_at by more than the 10-minute heuristic policy budget
    - deltaMs=742084
    - continuity=2026-07-10T19:32:17.000Z
    - graph=2026-07-10T19:44:39.084Z
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets
    - filesScanned=5
    - totalMarkers=0

Summary: Errors: 2  Warnings: 1

RESULT: FAILED
(node:78129) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

#### DQI extraction (former 010 and former 011)

### Checkpoint 2 attribution — former 011

- Strict validation exit `2` is external/out-of-scope: `graph-metadata.json` reports `SOURCE_FINGERPRINT_MISMATCH`, `implementation-summary.md` retains stale pre-migration Spec Folder metadata `011-automatic-drift-self-healing`, and continuity timestamps lag generated metadata.
- Attributable issues in the in-scope `plan.md` edit: **0**. The dependency qualification introduced no structural, anchor, section, frontmatter, evidence, status, or comment-hygiene failure.
- DQI: former-010 `plan.md` = **91/100 (excellent)**; former-011 `plan.md` = **91/100 (excellent)**. Source: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py` output recorded below.

### Former 013 write

- Changed only checklist frontmatter `completion_pct: 0` to `completion_pct: 100`.
- Explicit local evidence: `tasks.md` and `implementation-summary.md` both report 100%; every checklist item is already checked, and the checklist summary reports 14/14 P0, 13/13 P1, and 1/1 P2.
- No checklist item was newly marked complete.

- Document: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration/plan.md`; extractor exit: `0`

```json
{
  "file": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration/plan.md",
  "type": "spec",
  "detected_from": "path",
  "frontmatter": {
    "raw": "title: \"Implementation Plan: Query-Channel Calibration and Visibility\"\ndescription: \"Recalibrate the stopword-ratio and entity-density escalation hatches that gate graph/degree for simple-tier queries, and propagate runtime vector-channel skips and channel exceptions into result-visible metadata instead of console-only logs.\"\ntrigger_phrases:\n  - \"query channel calibration\"\n  - \"graph degree channel skip\"\n  - \"query classifier escalation hatch\"\n  - \"skipped channels visibility\"\n  - \"stopword ratio threshold\"\nimportance_tier: \"important\"\ncontextType: \"general\"\n_memory:\n  continuity:\n    packet_pointer: \"system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration\"\n    last_updated_at: \"2026-07-10T11:20:21.000Z\"\n    last_updated_by: \"claude-code\"\n    recent_action: \"Scaffold template titles removed from four doc frontmatters; packet now strict-clean\"\n    next_safe_action: \"Review Phase R evidence and the consolidated swarm commit\"\n    blockers: []\n    key_files: []\n    session_dedup:\n      fingerprint: \"sha256:0000000000000000000000000000000000000000000000000000000000000000\"\n      session_id: \"template-session\"\n      parent_session_id: null\n    completion_pct: 100\n    open_questions: []\n    answered_questions: []",
    "parsed": {
      "title": "\"Implementation Plan: Query-Channel Calibration and Visibility\"",
      "description": "\"Recalibrate the stopword-ratio and entity-density escalation hatches that gate graph/degree for simple-tier queries, and propagate runtime vector-channel skips and channel exceptions into result-visible metadata instead of console-only logs.\"",
      "trigger_phrases": "",
      "importance_tier": "\"important\"",
      "contextType": "\"general\"",
      "_memory": "",
      "continuity": "",
      "packet_pointer": "\"system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration\"",
      "last_updated_at": "\"2026-07-10T11:20:21.000Z\"",
      "last_updated_by": "\"claude-code\"",
      "recent_action": "\"Scaffold template titles removed from four doc frontmatters; packet now strict-clean\"",
      "next_safe_action": "\"Review Phase R evidence and the consolidated swarm commit\"",
      "blockers": [],
      "key_files": [],
      "session_dedup": "",
      "fingerprint": "\"sha256:0000000000000000000000000000000000000000000000000000000000000000\"",
      "session_id": "\"template-session\"",
      "parent_session_id": "null",
      "completion_pct": "100",
      "open_questions": [],
      "answered_questions": []
    },
    "issues": []
  },
  "structure": {
    "headings": [
      {
        "level": 1,
        "text": "Implementation Plan: Query-Channel Calibration and Visibility",
        "line": 29,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "1. SUMMARY",
        "line": 44,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 3,
        "text": "Technical Context",
        "line": 46,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Overview",
        "line": 55,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "2. QUALITY GATES",
        "line": 63,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 3,
        "text": "Definition of Ready",
        "line": 65,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Definition of Done",
        "line": 69,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "3. ARCHITECTURE",
        "line": 78,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 3,
        "text": "Pattern",
        "line": 80,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Key Components",
        "line": 84,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Data Flow",
        "line": 91,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "FIX ADDENDUM: AFFECTED SURFACES",
        "line": 99,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "4. IMPLEMENTATION PHASES",
        "line": 122,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 3,
        "text": "Phase 1: Investigation + Setup",
        "line": 124,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Phase 2: Core Implementation",
        "line": 129,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Phase 3: Verification",
        "line": 134,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Benchmark (SPECIFIED, not run)",
        "line": 141,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "5. TESTING STRATEGY",
        "line": 163,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 2,
        "text": "6. DEPENDENCIES",
        "line": 177,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 2,
        "text": "7. ROLLBACK PLAN",
        "line": 189,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 2,
        "text": "L2: PHASE DEPENDENCIES",
        "line": 198,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "L2: EFFORT ESTIMATION",
        "line": 215,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "L2: ENHANCED ROLLBACK",
        "line": 228,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Pre-deployment Checklist",
        "line": 230,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Rollback Procedure",
        "line": 235,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Data Reversal",
        "line": 241,
        "has_emoji": false,
        "has_number": false
      }
    ],
    "sections": [
      {
        "heading": "Implementation Plan: Query-Channel Calibration and Visibility",
        "level": 1,
        "line_start": 29,
        "line_end": 43,
        "word_count": 50,
        "has_code_blocks": false,
        "content_preview": "<!-- SPECKIT_LEVEL: 2 -->\n<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->\n<!--\nSELF-CHECK:\n- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.\n- Match phases to the stated scope. Remove setup theater that does not change the outcome.\nFAILURE MODES:\n- Over-planning, missing rollback, and treating assumptions as dependencies.\n-->\n\n---\n\n<!-- ANCHOR:summary -->"
      },
      {
        "heading": "1. SUMMARY",
        "level": 2,
        "line_start": 44,
        "line_end": 45,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Technical Context",
        "level": 3,
        "line_start": 46,
        "line_end": 54,
        "word_count": 61,
        "has_code_blocks": false,
        "content_preview": "| Aspect | Value |\n|--------|-------|\n| **Language/Stack** | TypeScript on Node, mk-spec-memory MCP server |\n| **Framework** | None, pure library functions in `lib/search/` and `lib/query/` |\n| **Storage** | Reads `vector_index` DB (SQLite) for entity-density scoring; no new storage of its own |\n| **Testing** | vitest fixtures against `query-classifier.ts`, `query-router.ts`, `routing-telemetry.ts`; a frozen query-shape fixture for the before/after measurement |"
      },
      {
        "heading": "Overview",
        "level": 3,
        "line_start": 55,
        "line_end": 62,
        "word_count": 158,
        "has_code_blocks": false,
        "content_preview": "Two independent, already-shipped escalation hatches gate graph/degree away from `simple`-tier queries: `query-classifier.ts`'s stopword-ratio hatch (`isLowSignalShortQuery`, threshold 0.5) and `query-router.ts`'s entity-density hatch (`shouldPreserveGraph`, threshold 2). Both under-fire for the dominant 2-3-term content-rich query pattern per the live telemetry sample (2/7 = 28.6% invocation rate, 1.0 hit rate when run). This phase (a) determines from the telemetry sample which hatch is the bin..."
      },
      {
        "heading": "2. QUALITY GATES",
        "level": 2,
        "line_start": 63,
        "line_end": 64,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Definition of Ready",
        "level": 3,
        "line_start": 65,
        "line_end": 68,
        "word_count": 42,
        "has_code_blocks": false,
        "content_preview": "- [x] 007-search-index-integrity-sweep has shipped (index is clean before graph/degree usage is widened)\n- [x] Investigation task (Phase 1) has attributed the skipped-but-should-have-run queries to content-rich short-query routing rather than broad tier escalation"
      },
      {
        "heading": "Definition of Done",
        "level": 3,
        "line_start": 69,
        "line_end": 77,
        "word_count": 37,
        "has_code_blocks": false,
        "content_preview": "- [x] All acceptance criteria in spec.md met for packet scope\n- [x] Before/after graph/degree invocation-rate and latency measurement recorded with reproduce commands\n- [x] Docs updated (spec/plan/tasks/checklist)\n<!-- /ANCHOR:quality-gates -->\n\n---\n\n<!-- ANCHOR:architecture -->"
      },
      {
        "heading": "3. ARCHITECTURE",
        "level": 2,
        "line_start": 78,
        "line_end": 79,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Pattern",
        "level": 3,
        "line_start": 80,
        "line_end": 83,
        "word_count": 40,
        "has_code_blocks": false,
        "content_preview": "Recalibrate two existing heuristics in place; no new channel, no new subsystem. Metadata propagation is a plumbing fix: an already-computed value (`vectorSearchSkipped`) is threaded one hop further, and existing fail-open `console.warn` sites gain a second, structured sink."
      },
      {
        "heading": "Key Components",
        "level": 3,
        "line_start": 84,
        "line_end": 90,
        "word_count": 172,
        "has_code_blocks": false,
        "content_preview": "- **`query-classifier.ts`**: Owns `LOW_SIGNAL_STOPWORD_RATIO`/`isLowSignalShortQuery`. Candidate change: lower the threshold, or replace the stopword-ratio proxy with a signal that actually separates \"vague\" from \"content-rich short\" queries \u2014 the investigation determines which.\n- **`query-router.ts`**: Owns `ENTITY_DENSITY_ACTIVATION_THRESHOLD`/`shouldPreserveGraph`. Candidate change: lower the threshold from 2, or loosen the `>=3 outgoing causal_edges` qualifying condition inside `getEntityDe..."
      },
      {
        "heading": "Data Flow",
        "level": 3,
        "line_start": 91,
        "line_end": 98,
        "word_count": 68,
        "has_code_blocks": false,
        "content_preview": "`routeQuery` classifies the query and resolves the planned channel subset (unchanged shape, recalibrated thresholds). `collectAndFuseHybridResults` executes the planned channels; when a channel fails at runtime (embedding generation, graph traversal, BM25/FTS/trigger-phrase), the failure is caught, logged as today, and additionally appended to a per-request channel-exception list that gets merged into `s3meta.routing.skippedChannels` before the result metadata is finalized.\n<!-- /ANCHOR:archite..."
      },
      {
        "heading": "FIX ADDENDUM: AFFECTED SURFACES",
        "level": 2,
        "line_start": 99,
        "line_end": 121,
        "word_count": 424,
        "has_code_blocks": false,
        "content_preview": "Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.\n\n| Surface | Current Role | Action | Verification |\n|---------|--------------|--------|---------------|\n| `query-classifier.ts` (`LOW_SIGNAL_STOPWORD_RATIO`, `isLowSignalShortQuery`) | Sole stopword-ratio escalation hatch for `simple`-tier queries | Reca..."
      },
      {
        "heading": "4. IMPLEMENTATION PHASES",
        "level": 2,
        "line_start": 122,
        "line_end": 123,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Phase 1: Investigation + Setup",
        "level": 3,
        "line_start": 124,
        "line_end": 128,
        "word_count": 76,
        "has_code_blocks": false,
        "content_preview": "- [x] Confirm 007-search-index-integrity-sweep has shipped\n- [x] Re-derive or obtain the 7-query telemetry sample the finding cites; the named fixture models the under-firing pattern and proves the content-rich short-query route is the binding constraint\n- [x] Build the frozen query-shape fixture (content-rich 2-3-term queries modeled on the telemetry sample, plus a control set of genuinely-vague and trigger-anchored queries that must NOT gain channels)"
      },
      {
        "heading": "Phase 2: Core Implementation",
        "level": 3,
        "line_start": 129,
        "line_end": 133,
        "word_count": 79,
        "has_code_blocks": false,
        "content_preview": "- [x] Recalibrate the hatch(es) identified in Phase 1 as the binding constraint, guarded by a flag (existing `SPECKIT_GRAPH_CHANNEL_PRESERVATION` or a new dedicated flag) for a no-restart revert path\n- [x] Thread runtime vector skip visibility into `hybrid-search.ts` and fold it into `s3meta.routing.skippedChannels`\n- [x] Add the shared channel-exception sink and wire it into the named fail-open call sites (`causal-boost.ts` graph traversal + context injection, `hybrid-search.ts` BM25/FTS/trigge..."
      },
      {
        "heading": "Phase 3: Verification",
        "level": 3,
        "line_start": 134,
        "line_end": 140,
        "word_count": 87,
        "has_code_blocks": false,
        "content_preview": "- [x] Before/after graph/degree invocation-rate measurement on the frozen fixture via `routing-telemetry.ts`'s rolling-window snapshot\n- [x] Before/after latency measurement on the same fixture, confirming NFR-P01/P02 are not violated\n- [x] Control-set fixture confirms genuinely-vague and trigger-anchored queries do not gain channels they should not (REQ-003)\n- [x] Forced-failure fixtures confirm the vector-skip and four channel-exception call sites are now visible in result metadata (REQ-002, R..."
      },
      {
        "heading": "Benchmark (SPECIFIED, not run)",
        "level": 3,
        "line_start": 141,
        "line_end": 162,
        "word_count": 413,
        "has_code_blocks": false,
        "content_preview": "This is a routing/observability change on the retrieval path, so the metric is the graph/degree channel invocation rate and its downstream recall contribution, not a new index or write-path metric.\n\n**Frozen fixture**: a query-shape fixture under `scratch/query-channel-calibration-fixture/` carrying (a) content-rich 2-3-term queries modeled on the live telemetry sample's dominant shape, (b) a control set of genuinely-vague and trigger-anchored queries, and (c) forced-failure variants (null embe..."
      },
      {
        "heading": "5. TESTING STRATEGY",
        "level": 2,
        "line_start": 163,
        "line_end": 176,
        "word_count": 116,
        "has_code_blocks": false,
        "content_preview": "| Test Type | Scope | Tools |\n|-----------|-------|-------|\n| Unit | `isLowSignalShortQuery`, `shouldPreserveGraph`, `enforceMinimumChannels` invariant after recalibration | vitest, existing `query-classifier.ts`/`query-router.ts` suites plus new fixture cases |\n| Integration | `routeQuery` end-to-end on the frozen content-rich and control fixture sets | vitest, `scratch/query-channel-calibration-fixture/` |\n| Metadata propagation | Forced embedding failure and forced channel-exception fixtures..."
      },
      {
        "heading": "6. DEPENDENCIES",
        "level": 2,
        "line_start": 177,
        "line_end": 188,
        "word_count": 116,
        "has_code_blocks": false,
        "content_preview": "| Dependency | Type | Status | Impact if Blocked |\n|------------|------|--------|---------------------|\n| 007-search-index-integrity-sweep | Internal | At plan authoring: Red (not yet started). Current phase-local evidence: shipped before this packet's implementation began. | Widening graph/degree usage before the index was clean would have amplified stale-row recall; this dependency gated Core Implementation until 007 shipped. |\n| `entity-density.ts` (`getEntityDensityScore`) | Internal | Gree..."
      },
      {
        "heading": "7. ROLLBACK PLAN",
        "level": 2,
        "line_start": 189,
        "line_end": 197,
        "word_count": 80,
        "has_code_blocks": false,
        "content_preview": "- **Trigger**: The before/after measurement shows a latency regression beyond the agreed ceiling, or the control-set fixture shows false escalation on genuinely-vague/trigger-anchored queries.\n- **Procedure**: Flip `SPECKIT_GRAPH_CHANNEL_PRESERVATION` (or the new dedicated flag, if introduced) off to revert to pre-recalibration thresholds with no restart. If the metadata-propagation fix itself is implicated, it is additive (new fields, no removed fields) and can be reverted independently via gi..."
      },
      {
        "heading": "L2: PHASE DEPENDENCIES",
        "level": 2,
        "line_start": 198,
        "line_end": 214,
        "word_count": 34,
        "has_code_blocks": true,
        "content_preview": "```\n007-search-index-integrity-sweep (external) \u2500\u2500\u2510\n                                                \u251c\u2500\u2500\u25ba Phase 1 (Investigate) \u2500\u2500\u25ba Phase 2 (Core) \u2500\u2500\u25ba Phase 3 (Verify)\n```\n\n| Phase | Depends On | Blocks |\n|-------|------------|--------|\n| Investigate | 007 shipped | Core |\n| Core | Investigate | Verify |\n| Verify | Core | None |\n<!-- /ANCHOR:phase-deps -->\n\n---\n\n<!-- ANCHOR:effort -->"
      },
      {
        "heading": "L2: EFFORT ESTIMATION",
        "level": 2,
        "line_start": 215,
        "line_end": 227,
        "word_count": 30,
        "has_code_blocks": false,
        "content_preview": "| Phase | Complexity | Estimated Effort |\n|-------|------------|---------------------|\n| Investigation + Setup | Med | 2-4 hours |\n| Core Implementation | Med | 4-8 hours |\n| Verification | Med | 3-5 hours |\n| **Total** | | **9-17 hours** |\n<!-- /ANCHOR:effort -->\n\n---\n\n<!-- ANCHOR:enhanced-rollback -->"
      },
      {
        "heading": "L2: ENHANCED ROLLBACK",
        "level": 2,
        "line_start": 228,
        "line_end": 229,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Pre-deployment Checklist",
        "level": 3,
        "line_start": 230,
        "line_end": 234,
        "word_count": 56,
        "has_code_blocks": false,
        "content_preview": "- [x] 007-search-index-integrity-sweep confirmed shipped before Phase 2 started. **Evidence**: `tasks.md` T001 records the dependency confirmation; `checklist.md` marks the dependency available; `implementation-summary.md` records the implemented packet state.\n- [ ] Frozen fixture and control set agreed and committed before recalibration lands\n- [ ] Latency ceiling agreed with the operator before Phase 3 measurement runs"
      },
      {
        "heading": "Rollback Procedure",
        "level": 3,
        "line_start": 235,
        "line_end": 240,
        "word_count": 59,
        "has_code_blocks": false,
        "content_preview": "1. Flip the graph-preservation flag off to revert threshold behavior with no restart\n2. Revert the metadata-propagation commit independently via git if only that half is implicated\n3. Re-run the frozen fixture to confirm the pre-recalibration invocation rate and metadata shape are restored\n4. No stakeholder notification needed, this is an internal retrieval-quality tier"
      },
      {
        "heading": "Data Reversal",
        "level": 3,
        "line_start": 241,
        "line_end": 245,
        "word_count": 22,
        "has_code_blocks": false,
        "content_preview": "- **Has data migrations?** No\n- **Reversal procedure**: N/A \u2014 this phase changes routing thresholds and metadata shape, not stored data.\n<!-- /ANCHOR:enhanced-rollback -->"
      }
    ]
  },
  "code_blocks": [
    {
      "language": "unknown",
      "line_start": 200,
      "line_count": 2,
      "preview": "007-search-index-integrity-sweep (external) \u2500\u2500\u2510\n                                                \u251c\u2500\u2500\u25ba..."
    }
  ],
  "metrics": {
    "total_words": 2424,
    "total_lines": 245,
    "heading_count": 26,
    "code_block_count": 1,
    "max_heading_depth": 3,
    "sections_with_code": 1
  },
  "checklist": {
    "type": "spec",
    "results": [
      {
        "id": "has_content",
        "check": "Has content",
        "status": "pass",
        "details": null
      }
    ],
    "passed": 1,
    "failed": 0,
    "pass_rate": 100.0
  },
  "content_issues": [
    {
      "type": "missing_language",
      "line": 200,
      "text": "Code block missing language tag",
      "severity": "warning"
    }
  ],
  "style_issues": [],
  "dqi": {
    "total": 91,
    "band": "excellent",
    "band_description": "Production-ready documentation",
    "components": {
      "structure": 40,
      "structure_max": 40,
      "content": 23,
      "content_max": 30,
      "style": 28,
      "style_max": 30
    },
    "breakdown": {
      "checklist_pass_rate": 100.0,
      "word_count": 2424,
      "word_count_range": [
        100,
        5000
      ],
      "word_count_score": 10,
      "h2_count": 11,
      "heading_density": 2.27,
      "heading_score": 8,
      "code_block_count": 1,
      "code_score": 2,
      "has_tables": true,
      "has_lists": true,
      "structure_data_score": 3,
      "internal_links": 0,
      "external_links": 0,
      "link_score": 0,
      "h2_format_score": 10,
      "divider_count": 24,
      "expected_dividers": 10,
      "divider_score": 6,
      "style_issue_count": 0,
      "style_issue_score": 8,
      "has_intro": true,
      "intro_score": 4
    }
  },
  "evaluation_questions": [
    {
      "id": "q1",
      "question": "What is this document about?",
      "target_section": "Introduction",
      "importance": "high"
    },
    {
      "id": "q2",
      "question": "What are the key points?",
      "target_section": "Main Content",
      "importance": "high"
    }
  ]
}
```

### Checkpoint 3 — former 013 `checklist.md`

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/018-drift-marker-pipeline-resilience --strict --verbose`
- Exit: `2`

```text

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/018-drift-marker-pipeline-resilience
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
i LEVEL_DECLARED: Detected Level 2
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
    - graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH: source_fingerprint does not match a re-derive of the current source docs, the stored derived fields may be stale
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete' and implementation-summary.md Status 'Complete -- F3 and F4 implemented, verified, validate.sh --strict passed' both classify as complete
+ EVIDENCE_CITED: All completed P0/P1 checklist/task items have substantive evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=4, tasks=28, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '018-drift-marker-pipeline-resilience' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/018-drift-marker-pipeline-resilience
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
    - implementation-summary.md has stale Spec Folder metadata: 013-drift-marker-pipeline-resilience
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity last_updated_at is within the 10-minute heuristic policy budget
    - deltaMs=15253
    - continuity=2026-07-10T19:12:49.000Z
    - graph=2026-07-10T19:13:04.253Z
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets
    - filesScanned=5
    - totalMarkers=0

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
(node:89931) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

#### DQI extraction — former 013

### Checkpoint 3 attribution — former 013

- Strict validation exit `2` is external/out-of-scope: `graph-metadata.json` reports `SOURCE_FINGERPRINT_MISMATCH`, and `implementation-summary.md` retains stale pre-migration Spec Folder metadata `013-drift-marker-pipeline-resilience`.
- Attributable issues in the in-scope `checklist.md` edit: **0**. Frontmatter, continuity structure, anchors, evidence coverage, status consistency, and all checklist rules passed.
- DQI: former-013 `checklist.md` = **79/100 (good)**. Source: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py` output recorded below.

### Former 023 write

- Qualified both stale nonexistence claims as plan-authoring snapshots and added the manifest-resolved canonical locations for former phases 017, 018, and 019.
- Preserved the original sequencing history while replacing the obsolete assumption with a current overlap-review instruction.
- Phase-local `tasks.md`, `checklist.md`, and `implementation-summary.md` remain complete and were used only as read-only evidence.

- Extractor exit: `0`

```json
{
  "file": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/018-drift-marker-pipeline-resilience/checklist.md",
  "type": "spec",
  "detected_from": "path",
  "frontmatter": {
    "raw": "title: \"Verification Checklist: Drift-Marker Producer/Consumer Resilience\"\ndescription: \"Implementation complete. All P0/P1/P2 items verified with concrete evidence from a real scratch git repo and two source-code harness tests.\"\ntrigger_phrases:\n  - \"drift marker pipeline resilience checklist\"\n  - \"stale lock breaking checklist\"\n  - \"marker path resolution checklist\"\nimportance_tier: \"normal\"\ncontextType: \"general\"\n_memory:\n  continuity:\n    packet_pointer: \"system-speckit/004-memory-search-intelligence/002-speckit-memory/018-drift-marker-pipeline-resilience\"\n    last_updated_at: \"2026-07-10T08:09:04.000Z\"\n    last_updated_by: \"claude-code\"\n    recent_action: \"Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced\"\n    next_safe_action: \"Review Phase R evidence and the consolidated swarm commit\"\n    blockers: []\n    key_files:\n      - \".opencode/scripts/git-hooks/lib/memory-drift-marker.sh\"\n    session_dedup:\n      fingerprint: \"sha256:0000000000000000000000000000000000000000000000000000000000000000\"\n      session_id: \"spec-028-013-drift-marker-pipeline-resilience\"\n      parent_session_id: null\n    completion_pct: 100\n    open_questions: []\n    answered_questions: []",
    "parsed": {
      "title": "\"Verification Checklist: Drift-Marker Producer/Consumer Resilience\"",
      "description": "\"Implementation complete. All P0/P1/P2 items verified with concrete evidence from a real scratch git repo and two source-code harness tests.\"",
      "trigger_phrases": "",
      "importance_tier": "\"normal\"",
      "contextType": "\"general\"",
      "_memory": "",
      "continuity": "",
      "packet_pointer": "\"system-speckit/004-memory-search-intelligence/002-speckit-memory/018-drift-marker-pipeline-resilience\"",
      "last_updated_at": "\"2026-07-10T08:09:04.000Z\"",
      "last_updated_by": "\"claude-code\"",
      "recent_action": "\"Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced\"",
      "next_safe_action": "\"Review Phase R evidence and the consolidated swarm commit\"",
      "blockers": [],
      "key_files": "",
      "session_dedup": "",
      "fingerprint": "\"sha256:0000000000000000000000000000000000000000000000000000000000000000\"",
      "session_id": "\"spec-028-013-drift-marker-pipeline-resilience\"",
      "parent_session_id": "null",
      "completion_pct": "100",
      "open_questions": [],
      "answered_questions": []
    },
    "issues": []
  },
  "structure": {
    "headings": [
      {
        "level": 1,
        "text": "Verification Checklist: Drift-Marker Producer/Consumer Resilience",
        "line": 28,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Verification Protocol",
        "line": 43,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Pre-Implementation",
        "line": 55,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Code Quality",
        "line": 68,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Testing",
        "line": 85,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Fix Completeness",
        "line": 105,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Security",
        "line": 142,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Documentation",
        "line": 157,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "File Organization",
        "line": 172,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Finding-Specific Verification Evidence",
        "line": 183,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "Verification Summary",
        "line": 235,
        "has_emoji": false,
        "has_number": false
      }
    ],
    "sections": [
      {
        "heading": "Verification Checklist: Drift-Marker Producer/Consumer Resilience",
        "level": 1,
        "line_start": 28,
        "line_end": 42,
        "word_count": 43,
        "has_code_blocks": false,
        "content_preview": "<!-- SPECKIT_LEVEL: 2 -->\n<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->\n<!--\nSELF-CHECK:\n- Confirm every required item has concrete evidence before marking it complete.\n- Keep optional deferrals explicit, owned, and separate from blockers.\nFAILURE MODES:\n- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.\n-->\n\n---\n\n<!-- ANCHOR:protocol -->"
      },
      {
        "heading": "Verification Protocol",
        "level": 2,
        "line_start": 43,
        "line_end": 54,
        "word_count": 32,
        "has_code_blocks": false,
        "content_preview": "| Priority | Handling | Completion Impact |\n|----------|----------|-------------------|\n| **[P0]** | HARD BLOCKER | Cannot claim done until complete |\n| **[P1]** | Required | Must complete OR get user approval |\n| **[P2]** | Optional | Can defer with documented reason |\n<!-- /ANCHOR:protocol -->\n\n---\n\n<!-- ANCHOR:pre-impl -->"
      },
      {
        "heading": "Pre-Implementation",
        "level": 2,
        "line_start": 55,
        "line_end": 67,
        "word_count": 80,
        "has_code_blocks": false,
        "content_preview": "- [x] CHK-001 [P0] Requirements documented in `spec.md` REQUIREMENTS section (REQ-001 through REQ-006)\n- [x] CHK-002 [P0] Technical approach defined in `plan.md` ARCHITECTURE section\n- [x] CHK-003 [P1] Dependencies identified and available. Status: none required -- both fixes are\n  self-contained edits to `memory-drift-marker.sh`. Confirmed: no other file references\n  `MEMORY_DRIFT_MARKER_PATH`, `marker_dir`, or sources this lib besides `post-commit`/`post-merge`/\n  `post-rewrite` (`rg` swept,..."
      },
      {
        "heading": "Code Quality",
        "level": 2,
        "line_start": 68,
        "line_end": 84,
        "word_count": 131,
        "has_code_blocks": false,
        "content_preview": "- [x] CHK-010 [P0] `shellcheck .opencode/scripts/git-hooks/lib/memory-drift-marker.sh` -> exit 0,\n  zero warnings (same as the pre-change baseline)\n- [x] CHK-011 [P0] Confirmed via `run_hook.sh` scratch-repo smoke test: normal rename+commit with\n  no override writes the marker silently, exit code 0, no stderr output\n- [x] CHK-012 [P1] Confirmed via harness test with `fs.statSync` monkeypatched to throw for the\n  lock dir (real shipped code, not reimplemented): falls back to the existing 5s wait..."
      },
      {
        "heading": "Testing",
        "level": 2,
        "line_start": 85,
        "line_end": 104,
        "word_count": 178,
        "has_code_blocks": false,
        "content_preview": "- [x] CHK-020 [P0] REQ-001 through REQ-006 each met by a dedicated shell-level smoke test (see\n  `CHK-060`-`CHK-069` below for per-requirement evidence)\n- [x] CHK-021 [P0] Manual testing complete: stale-lock reclaim (Test 4), DB-path-override marker\n  placement under `SPEC_KIT_DB_DIR`, `MEMORY_DB_PATH`, and both-set-precedence (Test 2/3) all run\n  against a real scratch git repo with the actual hook script\n- [x] CHK-022 [P1] Edge cases tested: fresh-lock non-reclaim (Test 5, elapsed 5s exit 0,..."
      },
      {
        "heading": "Fix Completeness",
        "level": 2,
        "line_start": 105,
        "line_end": 141,
        "word_count": 402,
        "has_code_blocks": false,
        "content_preview": "- [x] CHK-FIX-001 [P0] Finding class recorded for both: F3 (stale-lock recovery) is\n  `class-of-bug` -- every future SIGKILL between acquire and release reproduces it, not a one-time\n  instance. F4 (hardcoded marker path) is `class-of-bug` -- every session running under a\n  DB-path override reproduces it. Both fixed at the mechanism level, not patched per-instance.\n- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. `rg -n\n  \"mkdirSync|marker_dir|MEMORY_DRIFT_MARKER\" .opencode/scrip..."
      },
      {
        "heading": "Security",
        "level": 2,
        "line_start": 142,
        "line_end": 156,
        "word_count": 101,
        "has_code_blocks": false,
        "content_preview": "- [x] CHK-030 [P0] No hardcoded secrets (diff to `memory-drift-marker.sh` is lock/path-resolution\n  logic only)\n- [x] CHK-031 [P0] `reclaimStaleLock()` renames first, then checks `!fs.existsSync(dir) &&\n  fs.existsSync(reclaimedDir)` before `rmSync` -- never deletes without confirming the rename\n  moved the actual lock, matching `spec-folder-mutex.ts:101-122`'s confirm-before-delete pattern\n- [x] CHK-032 [P1] Both `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` and `MEMORY_DB_PATH` are `.trim()`-ed\n  and ch..."
      },
      {
        "heading": "Documentation",
        "level": 2,
        "line_start": 157,
        "line_end": 171,
        "word_count": 107,
        "has_code_blocks": false,
        "content_preview": "- [x] CHK-040 [P1] `tasks.md` and `checklist.md` updated to reflect final implementation state;\n  `spec.md`/`plan.md` required no edits (already correct from the prior correction round)\n- [x] CHK-041 [P1] Code comments adequate: `LOCK_STALE_MS`'s reasoning and the marker-dir\n  resolution precedence are explained inline with durable WHY only -- no spec/packet/task IDs in\n  the comments (comment-hygiene rule honored)\n- [x] CHK-042 [P2] Reviewed `install-git-hooks.sh` -- its hook-list comment and..."
      },
      {
        "heading": "File Organization",
        "level": 2,
        "line_start": 172,
        "line_end": 182,
        "word_count": 61,
        "has_code_blocks": false,
        "content_preview": "- [x] CHK-050 [P1] All scratch smoke-test repos/harnesses created under the session scratchpad\n  directory (`/private/tmp/claude-501/.../scratchpad/013-drift/`), never inside the source tree\n- [x] CHK-051 [P1] Scratchpad directory `rm -rf`'d after the test session; confirmed removed\n  before finishing (`ls` on the path returned \"No such file or directory\")\n<!-- /ANCHOR:file-org -->\n\n---\n\n<!-- ANCHOR:finding-verification -->"
      },
      {
        "heading": "Finding-Specific Verification Evidence",
        "level": 2,
        "line_start": 183,
        "line_end": 234,
        "word_count": 555,
        "has_code_blocks": false,
        "content_preview": "**F3 -- stale-lock breaking**\n- [x] CHK-060 [P0] Test 4: lock dir backdated 60s (older than `LOCK_STALE_MS=45000`), no live\n  owner -- reclaimed, hook wrote the marker in 0s, well inside the 5s wait budget (REQ-001)\n- [x] CHK-061 [P0] Test 5: fresh (just-created, ~19ms old) `lockDir` -- never reclaimed; hook\n  waited the full ~5s, exited 0, marker file hash unchanged (REQ-002)\n- [x] CHK-062 [P1] `LOCK_STALE_MS = 45_000` is a named top-level constant in the embedded node\n  block with an inline c..."
      },
      {
        "heading": "Verification Summary",
        "level": 2,
        "line_start": 235,
        "line_end": 251,
        "word_count": 94,
        "has_code_blocks": false,
        "content_preview": "| Category | Total | Verified |\n|----------|-------|----------|\n| P0 Items | 14 | 14/14 |\n| P1 Items | 13 | 13/13 |\n| P2 Items | 1 | 1/1 |\n\n**Verification Date**: 2026-07-09. All items verified against a real scratch git repo running the\nactual (post-fix) hook script, plus two harness tests (statSync-failure monkeypatch, real compiled\nconsumer resolver) that exercise the exact shipped/consumer code without reimplementing it.\n\nStatus: implementation complete, all checklist items verified with co..."
      }
    ]
  },
  "code_blocks": [],
  "metrics": {
    "total_words": 1939,
    "total_lines": 251,
    "heading_count": 11,
    "code_block_count": 0,
    "max_heading_depth": 2,
    "sections_with_code": 0
  },
  "checklist": {
    "type": "spec",
    "results": [
      {
        "id": "has_content",
        "check": "Has content",
        "status": "pass",
        "details": null
      }
    ],
    "passed": 1,
    "failed": 0,
    "pass_rate": 100.0
  },
  "content_issues": [],
  "style_issues": [],
  "dqi": {
    "total": 79,
    "band": "good",
    "band_description": "Minor improvements recommended",
    "components": {
      "structure": 40,
      "structure_max": 40,
      "content": 21,
      "content_max": 30,
      "style": 18,
      "style_max": 30
    },
    "breakdown": {
      "checklist_pass_rate": 100.0,
      "word_count": 1939,
      "word_count_range": [
        100,
        5000
      ],
      "word_count_score": 10,
      "h2_count": 10,
      "heading_density": 2.58,
      "heading_score": 8,
      "code_block_count": 0,
      "code_score": 0,
      "has_tables": true,
      "has_lists": true,
      "structure_data_score": 3,
      "internal_links": 0,
      "external_links": 0,
      "link_score": 0,
      "h2_format_score": 0,
      "divider_count": 22,
      "expected_dividers": 9,
      "divider_score": 6,
      "style_issue_count": 0,
      "style_issue_score": 8,
      "has_intro": true,
      "intro_score": 4
    }
  },
  "evaluation_questions": [
    {
      "id": "q1",
      "question": "What is this document about?",
      "target_section": "Introduction",
      "importance": "high"
    },
    {
      "id": "q2",
      "question": "What are the key points?",
      "target_section": "Main Content",
      "importance": "high"
    }
  ]
}
```

### Checkpoint 4 — former 023 `spec.md`

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation --strict --verbose`
- Exit: `2`

```text

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
i LEVEL_DECLARED: Detected Level 2
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
    - graph-metadata.json: SOURCE_FINGERPRINT_MISMATCH: source_fingerprint does not match a re-derive of the current source docs, the stored derived fields may be stale
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete' and implementation-summary.md Status 'COMPLETE' both classify as complete
+ EVIDENCE_CITED: All completed P0/P1 checklist/task items have substantive evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=3, tasks=20, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '033-self-healing-model-consolidation' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
    - implementation-summary.md has stale Spec Folder metadata: 023-self-healing-model-consolidation
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity timestamp is newer than graph-metadata; treating as benign clock drift
    - deltaMs=-6422524
    - continuity=2026-07-10T09:45:40.000Z
    - graph=2026-07-10T07:58:37.476Z
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets
    - filesScanned=5
    - totalMarkers=0

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
(node:92773) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

#### DQI extraction — former 023

### Checkpoint 4 attribution — former 023

- Strict validation exit `2` is external/out-of-scope: `graph-metadata.json` reports `SOURCE_FINGERPRINT_MISMATCH`, and `implementation-summary.md` retains stale pre-migration Spec Folder metadata `023-self-healing-model-consolidation`.
- Attributable issues in the in-scope `spec.md` edit: **0**. Frontmatter, required sections, anchors, status consistency, evidence, links, comment hygiene, and complexity checks passed.
- DQI: former-023 `spec.md` = **89/100 (good)**. Source: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py` output recorded below.

## Final attribution summary

| Former phase | Production document | Strict exit | Attributable issues | External/out-of-scope failures | DQI |
|---|---|---:|---:|---|---:|
| 010 | `002-speckit-memory/012-query-channel-calibration/plan.md` | 2 | 0 | Generated source fingerprint mismatch; stale `implementation-summary.md` Spec Folder value `010-query-channel-calibration` | 91 |
| 011 | `002-speckit-memory/014-automatic-drift-self-healing/plan.md` | 2 | 0 | Generated source fingerprint mismatch; stale `implementation-summary.md` Spec Folder value `011-automatic-drift-self-healing`; continuity timestamp lag | 91 |
| 013 | `002-speckit-memory/018-drift-marker-pipeline-resilience/checklist.md` | 2 | 0 | Generated source fingerprint mismatch; stale `implementation-summary.md` Spec Folder value `013-drift-marker-pipeline-resilience` | 79 |
| 023 | `002-speckit-memory/033-self-healing-model-consolidation/spec.md` | 2 | 0 | Generated source fingerprint mismatch; stale `implementation-summary.md` Spec Folder value `023-self-healing-model-consolidation` | 89 |

### External-blocker classification

- Every `SOURCE_FINGERPRINT_MISMATCH` is an expected generated-metadata consequence of changing a governed source document. Resolving it requires modifying `graph-metadata.json`, which this dispatch explicitly forbids.
- Every stale Spec Folder failure is in a non-writable `implementation-summary.md` and reflects the topology migration's old phase number, not content introduced by these four edits.
- Former 011's continuity warning compares existing generated/frontmatter timestamps; neither timestamp is in the writable `plan.md` content changed here.
- These failures remain itemized rather than hidden. Retry 2 explicitly authorizes continuation and success when packet-global strict exit 2 is proven external.

### Completion decision

- All four requested contradictions are reconciled at manifest-resolved canonical paths.
- Historical planning meaning is preserved through explicit plan-authoring/as-of qualification.
- No checklist item was newly checked without local evidence; former 013 required only its contradictory completion percentage correction.
- Strict validation ran after every production-document write. Attributable validation issues: **0 across all four files**.
- DQI minimum: **79**, above the required 75.
- Writable boundary honored: only the four production documents and this scratch log were modified; no JSON, generated metadata, root docs, or changelog was changed.
- Final scoped `git status --short` reports all five writable paths as untracked under the topology-migrated tree, so Git cannot provide a tracked-file diff/stat baseline for them; this is a repository state observation, not a validation failure. Scoped `git diff --check` emitted no error.

- Extractor exit: `0`

```json
{
  "file": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation/spec.md",
  "type": "spec",
  "detected_from": "path",
  "frontmatter": {
    "raw": "title: \"Feature Specification: Self-Healing Model Consolidation [template:level_2/spec.md]\"\ndescription: \"Of the self-healing system's three discovery layers, only Layer 1 (query-time existence filtering) is a pure discoverer that enqueues into the shared suspect queue for a later confirmed look. Layer 3's own orphan sweep and Layer 2's marker-triggered scoped delete each independently decide-and-delete on first detection, bypassing the confirm-and-tombstone step Layer 3 already owns for Layer 1's suspects.\"\ntrigger_phrases:\n  - \"self-healing model consolidation\"\n  - \"suspect queue sole confirmation funnel\"\n  - \"runSuspectConfirmation one confirmer\"\n  - \"orphan sweep discoverer not deleter\"\n  - \"drift suspect queue size cap\"\nimportance_tier: \"normal\"\ncontextType: \"general\"\n_memory:\n  continuity:\n    packet_pointer: \"system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation\"\n    last_updated_at: \"2026-07-10T09:45:40.000Z\"\n    last_updated_by: \"opencode\"\n    recent_action: \"Implemented and verified the sole suspect-confirmation funnel\"\n    next_safe_action: \"No further implementation work\"\n    blockers: []\n    key_files: []\n    session_dedup:\n      fingerprint: \"sha256:0000000000000000000000000000000000000000000000000000000000000000\"\n      session_id: \"template-session\"\n      parent_session_id: null\n    completion_pct: 100\n    open_questions: []\n    answered_questions: []",
    "parsed": {
      "title": "\"Feature Specification: Self-Healing Model Consolidation [template:level_2/spec.md]\"",
      "description": "\"Of the self-healing system's three discovery layers, only Layer 1 (query-time existence filtering) is a pure discoverer that enqueues into the shared suspect queue for a later confirmed look. Layer 3's own orphan sweep and Layer 2's marker-triggered scoped delete each independently decide-and-delete on first detection, bypassing the confirm-and-tombstone step Layer 3 already owns for Layer 1's suspects.\"",
      "trigger_phrases": "",
      "importance_tier": "\"normal\"",
      "contextType": "\"general\"",
      "_memory": "",
      "continuity": "",
      "packet_pointer": "\"system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation\"",
      "last_updated_at": "\"2026-07-10T09:45:40.000Z\"",
      "last_updated_by": "\"opencode\"",
      "recent_action": "\"Implemented and verified the sole suspect-confirmation funnel\"",
      "next_safe_action": "\"No further implementation work\"",
      "blockers": [],
      "key_files": [],
      "session_dedup": "",
      "fingerprint": "\"sha256:0000000000000000000000000000000000000000000000000000000000000000\"",
      "session_id": "\"template-session\"",
      "parent_session_id": "null",
      "completion_pct": "100",
      "open_questions": [],
      "answered_questions": []
    },
    "issues": []
  },
  "structure": {
    "headings": [
      {
        "level": 1,
        "text": "Feature Specification: Self-Healing Model Consolidation",
        "line": 29,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "1. METADATA",
        "line": 44,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 2,
        "text": "2. PROBLEM & PURPOSE",
        "line": 59,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 3,
        "text": "Problem Statement",
        "line": 61,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Purpose",
        "line": 104,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Implementation Result",
        "line": 111,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "3. SCOPE",
        "line": 124,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 3,
        "text": "In Scope",
        "line": 126,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Out of Scope",
        "line": 160,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Files to Change",
        "line": 189,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "4. REQUIREMENTS",
        "line": 201,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 3,
        "text": "P0 - Blockers (MUST complete)",
        "line": 203,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "P1 - Required (complete OR user-approved deferral)",
        "line": 212,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "5. SUCCESS CRITERIA",
        "line": 224,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 2,
        "text": "6. RISKS & DEPENDENCIES",
        "line": 240,
        "has_emoji": false,
        "has_number": true
      },
      {
        "level": 2,
        "text": "L2: NON-FUNCTIONAL REQUIREMENTS",
        "line": 257,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Performance",
        "line": 259,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Reliability",
        "line": 268,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Observability",
        "line": 277,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "L2: EDGE CASES",
        "line": 287,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Data Boundaries",
        "line": 289,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "Error Scenarios",
        "line": 299,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 3,
        "text": "State Transitions",
        "line": 308,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "L2: COMPLEXITY ASSESSMENT",
        "line": 321,
        "has_emoji": false,
        "has_number": false
      },
      {
        "level": 2,
        "text": "10. OPEN QUESTIONS",
        "line": 333,
        "has_emoji": false,
        "has_number": true
      }
    ],
    "sections": [
      {
        "heading": "Feature Specification: Self-Healing Model Consolidation",
        "level": 1,
        "line_start": 29,
        "line_end": 43,
        "word_count": 50,
        "has_code_blocks": false,
        "content_preview": "<!-- SPECKIT_LEVEL: 2 -->\n<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->\n<!--\nSELF-CHECK:\n- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.\n- Remove placeholders, stale status, and claims that are not backed by a check.\nFAILURE MODES:\n- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.\n-->\n\n---\n\n<!-- ANCHOR:metadata -->"
      },
      {
        "heading": "1. METADATA",
        "level": 2,
        "line_start": 44,
        "line_end": 58,
        "word_count": 30,
        "has_code_blocks": false,
        "content_preview": "| Field | Value |\n|-------|-------|\n| **Level** | 2 |\n| **Priority** | P2 |\n| **Status** | Complete |\n| **Created** | 2026-07-09 |\n| **Branch** | `023-self-healing-model-consolidation` |\n| **Verdict** | COMPLETE \u2014 all five decisions implemented and verified |\n<!-- /ANCHOR:metadata -->\n\n---\n\n<!-- ANCHOR:problem -->"
      },
      {
        "heading": "2. PROBLEM & PURPOSE",
        "level": 2,
        "line_start": 59,
        "line_end": 60,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Problem Statement",
        "level": 3,
        "line_start": 61,
        "line_end": 103,
        "word_count": 581,
        "has_code_blocks": false,
        "content_preview": "The self-healing system ships in three layers (`011-automatic-drift-self-healing/spec.md` section 3), and its own\ndesign already establishes the correct model for one of them: Layer 1 (query-time existence filtering,\n`memory-search.ts:372-441`) never deletes on first miss. It appends the excluded row's id to a shared suspect\nqueue (`appendMemoryDriftSuspects`, `mcp_server/lib/storage/memory-drift-healing.ts:106`) and Layer 3 is the\nlayer documented to own \"confirming Layer 1's suspect queue: a..."
      },
      {
        "heading": "Purpose",
        "level": 3,
        "line_start": 104,
        "line_end": 110,
        "word_count": 59,
        "has_code_blocks": false,
        "content_preview": "Make the suspect queue the sole confirmation funnel across all three layers. Marker consumption and the\norphan sweep become pure discoverers that enqueue candidate ids into the existing queue; `runSuspectConfirmation`\nbecomes the one place in the codebase that verifies-and-tombstones. Three candidate discoverers, one confirmer\n\u2014 not three semi-independent healing paths that happen to share a delete function."
      },
      {
        "heading": "Implementation Result",
        "level": 3,
        "line_start": 111,
        "line_end": 123,
        "word_count": 80,
        "has_code_blocks": false,
        "content_preview": "`runGlobalOrphanSweep` now enqueues candidates at\n`mcp_server/handlers/memory-index.ts:821-826`; the scoped path resolves ids and enqueues at\n`mcp_server/handlers/memory-index.ts:1075-1080`. Confirmation precedes orphan discovery at\n`memory-index.ts:1064-1065` and `:1565-1576`, guaranteeing next-scan confirmation. The queue is capped at\n1,000 entries in `memory-drift-healing.ts:10,131-134`, and `suspectQueueSize` is returned in the scan\nenvelope at `memory-index.ts:1160-1167,1571-1576`.\n<!-- /A..."
      },
      {
        "heading": "3. SCOPE",
        "level": 2,
        "line_start": 124,
        "line_end": 125,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "In Scope",
        "level": 3,
        "line_start": 126,
        "line_end": 159,
        "word_count": 430,
        "has_code_blocks": false,
        "content_preview": "- `runGlobalOrphanSweep` (`memory-index.ts:785-853`) stops calling `deleteIndexedRecordIds` on\n  `sweep.orphanRecordIds` directly (`:815`). It calls `appendMemoryDriftSuspects` with those same ids instead,\n  leaving the tombstone decision to `runSuspectConfirmation`.\n- The marker-triggered scoped-delete branch inside `handleMemoryIndexScan`'s `files.length === 0` path\n  (`memory-index.ts:1059-1069`) stops calling `deleteStaleIndexedRecords(categorized.toDelete)` directly. It\n  resolves `categor..."
      },
      {
        "heading": "Out of Scope",
        "level": 3,
        "line_start": 160,
        "line_end": 188,
        "word_count": 373,
        "has_code_blocks": false,
        "content_preview": "- The full-corpus scan's definitive stale-delete path (`memory-index.ts:1531-1539`,\n  `deleteStaleIndexedRecords(filesToDelete)` when `results.failed === 0`). `filesToDelete` there comes from\n  diffing an explicit, just-walked file listing against the index \u2014 a ground-truth corpus comparison, not a\n  heuristic candidate \u2014 so it stays a direct delete. Only the two heuristic/candidate paths (orphan sweep,\n  marker-triggered scoped delete) convert to discoverers.\n- Layer 1 itself (`memory-search.t..."
      },
      {
        "heading": "Files to Change",
        "level": 3,
        "line_start": 189,
        "line_end": 200,
        "word_count": 132,
        "has_code_blocks": false,
        "content_preview": "| File Path | Change Type | Description |\n|-----------|-------------|-------------|\n| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | `runGlobalOrphanSweep` enqueues instead of deleting (`:815`); marker-triggered scoped-delete branch enqueues instead of deleting (`:1059-1069`); phase-order/same-cycle decision for orphan-discovered suspects; suspect-queue size cap or metric surfaced through the scan result |\n| `.opencode/skills/system-spec-kit/mcp_server/lib/sto..."
      },
      {
        "heading": "4. REQUIREMENTS",
        "level": 2,
        "line_start": 201,
        "line_end": 202,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "P0 - Blockers (MUST complete)",
        "level": 3,
        "line_start": 203,
        "line_end": 211,
        "word_count": 262,
        "has_code_blocks": false,
        "content_preview": "| ID | Requirement | Acceptance Criteria |\n|----|-------------|---------------------|\n| REQ-001 | `runGlobalOrphanSweep` SHALL enqueue its discovered orphan candidate ids into the shared suspect queue via `appendMemoryDriftSuspects` instead of calling `deleteIndexedRecordIds` on them directly. | Against a synthetic orphan backlog, immediately after `runGlobalOrphanSweep` returns, the discovered ids are present in `readMemoryDriftSuspects()` and the corresponding `memory_index` rows are still pr..."
      },
      {
        "heading": "P1 - Required (complete OR user-approved deferral)",
        "level": 3,
        "line_start": 212,
        "line_end": 223,
        "word_count": 248,
        "has_code_blocks": false,
        "content_preview": "| ID | Requirement | Acceptance Criteria |\n|----|-------------|---------------------|\n| REQ-005 | The suspect queue SHALL enforce a documented size cap or emit an observable size metric, so a large orphan-sweep backlog funneled through `appendMemoryDriftSuspects` cannot grow the `config`-table JSON blob or `runSuspectConfirmation`'s single `WHERE id IN (...)` statement without bound. | A synthetic backlog at/above the chosen cap either has enqueue behavior that truncates/rejects the excess with..."
      },
      {
        "heading": "5. SUCCESS CRITERIA",
        "level": 2,
        "line_start": 224,
        "line_end": 239,
        "word_count": 125,
        "has_code_blocks": false,
        "content_preview": "- **SC-001**: All three discovery paths (Layer 1 query-time filter, Layer 3 orphan sweep, Layer 2\n  marker-triggered scoped delete) enqueue into the same suspect queue and no longer independently call\n  `deleteIndexedRecordIds`/`deleteStaleIndexedRecords` on their own discovered candidates \u2014 proven by REQ-001\n  through REQ-003's grep and behavioral evidence.\n- **SC-002**: `runSuspectConfirmation` is the mechanically verifiable single confirm-and-tombstone site for\n  all suspect-queue-sourced de..."
      },
      {
        "heading": "6. RISKS & DEPENDENCIES",
        "level": 2,
        "line_start": 240,
        "line_end": 256,
        "word_count": 351,
        "has_code_blocks": false,
        "content_preview": "| Type | Item | Impact | Mitigation |\n|------|------|--------|------------|\n| Risk | Deferring orphan-sweep and marker-triggered deletes to a confirmation pass, instead of deleting on first detection, delays when a truly-gone row is actually removed from `memory_index` and from search results. | A confirmed-orphan row could still surface in a search hit for up to one extra scan cycle before Layer 3 or Layer 1's own query-time filter catches it. | Layer 1's query-time existence filter (`memory-s..."
      },
      {
        "heading": "L2: NON-FUNCTIONAL REQUIREMENTS",
        "level": 2,
        "line_start": 257,
        "line_end": 258,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Performance",
        "level": 3,
        "line_start": 259,
        "line_end": 267,
        "word_count": 87,
        "has_code_blocks": false,
        "content_preview": "- **NFR-P01**: Converting orphan sweep to an enqueue-only discoverer must not materially change\n  `runGlobalOrphanSweep`'s own wall-clock time budget (`ORPHAN_SWEEP_TIME_BUDGET_MS_DEFAULT`, `memory-index.ts:293`)\n  \u2014 an `appendMemoryDriftSuspects` write per page is expected to be cheap relative to the per-row DELETE\n  cascade it replaces, not more expensive.\n- **NFR-P02**: `runSuspectConfirmation`'s existence recheck stays a single fresh `buildPathExistenceCache`\n  batch call per confirmation pa..."
      },
      {
        "heading": "Reliability",
        "level": 3,
        "line_start": 268,
        "line_end": 276,
        "word_count": 96,
        "has_code_blocks": false,
        "content_preview": "- **NFR-R01**: A crash or restart between an enqueue (orphan sweep or marker-triggered) and the next\n  confirmation pass must leave the suspect queue's persisted state consistent \u2014 the existing `config`-table\n  write already covers this; this packet must not introduce an in-memory-only staging step between enqueue\n  and persistence.\n- **NFR-R02**: The consolidation must not regress Layer 1's existing suspect-then-confirm safety property\n  (`011-automatic-drift-self-healing` REQ-001/SC-001) \u2014 a r..."
      },
      {
        "heading": "Observability",
        "level": 3,
        "line_start": 277,
        "line_end": 286,
        "word_count": 63,
        "has_code_blocks": false,
        "content_preview": "- **NFR-O01**: Whatever size-cap or metric REQ-005 lands on must be visible in the existing scan result\n  envelope (the same object that already carries `orphanSwept`, `suspectTombstoned`, `suspectCleared`,\n  `suspectFailed` at `memory-index.ts:1543-1552`) rather than only in a log line, so an operator or a future\n  `/doctor` route can read it without grepping server logs.\n<!-- /ANCHOR:nfr -->\n\n---\n\n<!-- ANCHOR:edge-cases -->"
      },
      {
        "heading": "L2: EDGE CASES",
        "level": 2,
        "line_start": 287,
        "line_end": 288,
        "word_count": 0,
        "has_code_blocks": false,
        "content_preview": ""
      },
      {
        "heading": "Data Boundaries",
        "level": 3,
        "line_start": 289,
        "line_end": 298,
        "word_count": 120,
        "has_code_blocks": false,
        "content_preview": "- An id discovered by both orphan sweep and the marker-triggered path in the same scan cycle (same\n  underlying deleted file, different signal source): `appendMemoryDriftSuspects` already dedups by id and\n  refreshes `lastSeenAt` on re-observation (`memory-drift-healing.ts:106-131`), so a double-enqueue is a\n  no-op merge, not a duplicate row.\n- An empty orphan-sweep page or an empty scoped-delete candidate set: both call `appendMemoryDriftSuspects`\n  with an empty array, which is already a safe..."
      },
      {
        "heading": "Error Scenarios",
        "level": 3,
        "line_start": 299,
        "line_end": 307,
        "word_count": 96,
        "has_code_blocks": false,
        "content_preview": "- `appendMemoryDriftSuspects`'s write fails under lock contention (the busy-timeout scenario REQ-007\n  targets): today this is caught and logged as a warning in Layer 1's caller (`memory-search.ts:431-432`);\n  the two new callers need the same best-effort, non-fatal handling \u2014 a failed enqueue must not abort the\n  scan or silently re-introduce a direct-delete fallback.\n- `runSuspectConfirmation` itself errors mid-pass on a very large queue (the SQLite parameter-limit risk in\n  Risks & Dependenci..."
      },
      {
        "heading": "State Transitions",
        "level": 3,
        "line_start": 308,
        "line_end": 320,
        "word_count": 101,
        "has_code_blocks": false,
        "content_preview": "- A suspect enqueued by orphan sweep whose file reappears before the next confirmation pass (e.g. a\n  restore): `removeMemoryDriftSuspects` already clears without a write on reappearance\n  (`memory-index.ts:895-911`); this path is unchanged, only the volume of callers feeding it changes.\n- The phase-order decision (REQ-006) itself is a state-machine question: same-cycle confirmation means an\n  orphan-discovered id can be enqueued and tombstoned within one `memory_index_scan` call; next-cycle\n  c..."
      },
      {
        "heading": "L2: COMPLEXITY ASSESSMENT",
        "level": 2,
        "line_start": 321,
        "line_end": 332,
        "word_count": 110,
        "has_code_blocks": false,
        "content_preview": "| Dimension | Score | Notes |\n|-----------|-------|-------|\n| Scope | 10/25 | Two call-site conversions in one already-open file (`memory-index.ts`), one size-cap/metric addition, one busy-timeout policy decision \u2014 no new files, no schema change |\n| Risk | 12/25 | Touches the shared delete-decision path for authored, non-regenerable memory rows; mitigated by REQ-004's confirm-before-tombstone invariant and Layer 1's independent query-time filter already covering user-visible staleness |\n| Resea..."
      },
      {
        "heading": "10. OPEN QUESTIONS",
        "level": 2,
        "line_start": 333,
        "line_end": 347,
        "word_count": 134,
        "has_code_blocks": false,
        "content_preview": "_All three questions below are resolved; kept under this heading per the template's fixed section contract._\n\n\n- **Confirmation timing:** next-cycle. `suspect-confirmation` runs before `orphan-sweep` in both scan shapes;\n  `orphan-sweep-time-budget-and-refresh.vitest.ts:131-172` proves a queued row survives the first scan and is\n  tombstoned on the second.\n- **Queue bound:** a 1,000-entry hard cap preserves already-queued confirmation work and defers excess ids with\n  a warning. `memory-drift-h..."
      }
    ]
  },
  "code_blocks": [],
  "metrics": {
    "total_words": 3758,
    "total_lines": 347,
    "heading_count": 25,
    "code_block_count": 0,
    "max_heading_depth": 3,
    "sections_with_code": 0
  },
  "checklist": {
    "type": "spec",
    "results": [
      {
        "id": "has_content",
        "check": "Has content",
        "status": "pass",
        "details": null
      }
    ],
    "passed": 1,
    "failed": 0,
    "pass_rate": 100.0
  },
  "content_issues": [],
  "style_issues": [],
  "dqi": {
    "total": 89,
    "band": "good",
    "band_description": "Minor improvements recommended",
    "components": {
      "structure": 40,
      "structure_max": 40,
      "content": 21,
      "content_max": 30,
      "style": 28,
      "style_max": 30
    },
    "breakdown": {
      "checklist_pass_rate": 100.0,
      "word_count": 3758,
      "word_count_range": [
        100,
        5000
      ],
      "word_count_score": 10,
      "h2_count": 10,
      "heading_density": 1.33,
      "heading_score": 8,
      "code_block_count": 0,
      "code_score": 0,
      "has_tables": true,
      "has_lists": true,
      "structure_data_score": 3,
      "internal_links": 0,
      "external_links": 0,
      "link_score": 0,
      "h2_format_score": 10,
      "divider_count": 24,
      "expected_dividers": 9,
      "divider_score": 6,
      "style_issue_count": 0,
      "style_issue_score": 8,
      "has_intro": true,
      "intro_score": 4
    }
  },
  "evaluation_questions": [
    {
      "id": "q1",
      "question": "What is this document about?",
      "target_section": "Introduction",
      "importance": "high"
    },
    {
      "id": "q2",
      "question": "What are the key points?",
      "target_section": "Main Content",
      "importance": "high"
    }
  ]
}
```
