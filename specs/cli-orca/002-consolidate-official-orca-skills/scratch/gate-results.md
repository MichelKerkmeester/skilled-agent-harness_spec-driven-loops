# Gate results: cli-orca extraction

Captured 2026-09-20T09:42:43Z on branch skilled/v4.0.0.0.

### 1. Fleet root metadata (class H/S conformance, regenerates derivable files)
```text
OK   [H] cli-external-orchestration
OK   [S] cli-orca
OK   [S] mcp-code-mode
OK   [H] mcp-tooling
OK   [H] sk-code
OK   [S] sk-communication
OK   [H] sk-design
OK   [H] sk-doc
OK   [S] sk-git
OK   [S] sk-prompt
OK   [S] sk-vision
OK   [H] system-deep-loop
OK   [S] system-skill-advisor
OK   [S] system-spec-kit

checked=14 passed=14 failed=0 fixed=0
```
exit=0  cmd=node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix

### 2. cli-orca package validation
```text
Skill: .skilled/skills/cli-orca
Detected kind: standalone
- package_skill.py --check --strict: PASS (exit 0)
```
exit=0  cmd=python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/cli-orca --strict

### 3. cli-orca package check
```text
🔍 Validating skill: cli-orca
(strict mode)
==================================================

✅ Skill is valid!

==================================================
Result: PASS
```
exit=0  cmd=python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/cli-orca --check --strict

### 4. cli-orca feature catalog package
```text
PACKAGE cli-orca: PASS tier=fail violations=0
PASS: 0 violations (all enforced catalog checks).
```
exit=0  cmd=python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package cli-orca

### 5. cli-orca manual testing playbook package
```text
contract=operator-scenario routing_gold_contract=routing-gold strict=on
manifest=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json
warn_packages=
PASS package=cli-orca tier=FAIL_CLOSED scenarios=8 categories=4 operator=8 routing_gold_excluded=0 violations=0 warnings=1
  WARN HAND_TYPED_CENSUS manual-testing-playbook.md root contains a hand-typed census (8 scenarios, 4 categories); derived census is 8 scenarios across 4 categories
exit=0
```
exit=0  cmd=node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package cli-orca

### 6. Hub parent check (nine modes)
```text
INFO: Parent skill: .skilled/skills/mcp-tooling
INFO: Resolved:     /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/mcp-tooling
INFO: Mode 5-9:     canon (FAIL)

PASS: 1a: exactly one graph-metadata.json, located at the hub root
PASS: 1b: hub skill_id "mcp-tooling" matches directory name
PASS: 1c: hub family "mcp" is in the allowed set
PASS: 2a: no nested graph-metadata.json inside any packet or shared/
PASS: 2b: no nested description.json inside any packet or shared/
PASS: 3a: mode-registry.json exists and parses as JSON
PASS: 3b: mode-registry.json declares 9 modes
PASS: 3c: every mode packet resolves to an existing sub-directory
PASS: 3d: every mode carries the hard discriminator (workflowMode + backendKind)
PASS: 3d-canon: every mode carries packetKind + toolSurface + grandfatheredFolderMismatch
PASS: 3d-name: every mode folder matches packetSkillName (or is grandfathered)
PASS: 3d-name-frontmatter: all 9 packet SKILL.md frontmatter name(s) match packetSkillName
PASS: 3d-files: every packet carries SKILL.md, README.md, and changelog/
PASS: 3d-alias: all 84 aliases are unique across modes
PASS: 3e: every mode has an advisorRouting block with a valid routingClass
INFO: 3g: hub declares no surface packets
PASS: 3f: extensions {transport-axis} are internally consistent
PASS: 3j: hub allowed-tools equals the union of mode tool surfaces
INFO: 4a: hub declares no lexical/alias-fold modes — no advisor drift-guard required
INFO: 4b: registry declares no lexical modes; nothing to cross-check against the advisor
PASS: 5a: hub-router.json exists and parses as JSON
PASS: 5b: routerSignals keys match the registry workflowMode set (9)
PASS: 5c: all 21 referenced vocabulary classes are defined
PASS: 5d: every router resource path resolves on disk
PASS: 5e: routerPolicy.tieBreak covers every registered mode
PASS: 5f: bundleRules reference real modes
PASS: 5g: base router outcomes present (single, orderedBundle, defer)
PASS: 5h: routerPolicy.defaultMode is null (surface-primary or no default)
PASS: 5i: tieBreak orders workflow modes before surface/transport modes
INFO: 5j: hub declares no command subworkflows
PASS: 6a: every hub child directory is a registered packet or an allowlisted support dir
PASS: 6b: every registered mode (9) appears in the hub SKILL.md mode table
PASS: 6c: every mode-table row whose registry entry declares a command shows that exact command
PASS: 7a: all changelog entries are real files (no symlinks)
PASS: 8a: description.json present with the required fields
PASS: 8b: description.json carries no registry-owned duplicate keys
PASS: 9a: manual-testing-playbook/ present
PASS: 9b: benchmark/ baseline present
PASS: 10a-manifest-source: resourceContractVersion declared and leaf-manifest.json is present, readable, and well-formed
PASS: 10b-byte-drift: committed leaf-manifest.json matches a fresh regeneration byte for byte
PASS: 10c-target-collision: no duplicate composite keys; every committed leaf resolves to a disk file or a declared alias
PASS: 10d-reachability: all 9 manifest mode(s) reach back to a registered mode and vice versa
PASS: 11a-class: root metadata conforms to class H (declares the complete mode-registry + hub-router pair)
PASS: 12a-router-contract: root ROUTER.md conforms to the two-state contract (active)
PASS: 13a-version: all routing artifacts carry the SKILL.md version 1.8.0.0
PASS: 13b-version: SKILL.md version 1.8.0.0 matches the newest changelog entry

─────────────────────────────────────────────────────────────────
OK: parent-skill-check — all hard invariants passed, 0 warnings
```
exit=0  cmd=node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling

### 7. Packet 001 strict validation
```text

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-orca/001-mcp-orca-cli
  Level:  3
  Engine: orchestrator

+ FILE_EXISTS: All required files present for Level 3
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ ANCHORS_VALID: Anchors well formed in 6 file(s)
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ MERGE_LEGALITY: No merge plan supplied; legality check skipped
+ CROSS_ANCHOR_CONTAMINATION: No routing payload supplied; contamination check skipped
+ POST_SAVE_FINGERPRINT: No post-save payload supplied; fingerprint check skipped
+ GRAPH_METADATA_PRESENT: Graph metadata checked
+ GENERATED_METADATA_INTEGRITY: Generated metadata passed schema, status-enum and path-prefix invariants
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete — specification and Orca integration delivered; compiled serving and live mutating lanes deferred' and implementation-summary.md Status 'Complete — Orca leaf and mcp-tooling integration delivered; compiled serving and live mutating lanes deferred' both classify as complete
+ AC_COVERAGE: Acceptance coverage gate not active for this level or lifecycle state
+ AC_CLOSURE: AC_CLOSURE: 13/13 criteria met, waived or superseded; packet is closeable
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ AI_PROTOCOLS: AI protocols present and complete (4/4)
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 3; phases=4, tasks=51, stories=2, scenarios=0)
+ FOLDER_NAMING: Folder name '001-mcp-orca-cli' follows naming convention
+ GREP_CONVENTION: Grep convention: 6 document(s) conform
+ LEVEL_MATCH: Level consistent across all files (Level 3)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_CHILD_IDENTITY: children_ids entries all carry the packet's own identity
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: cli-orca/001-mcp-orca-cli
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness skew detected (soft detector)
    - context.description.lastUpdated=2026-09-20T10:45:00.000Z
    - context.graph.derived.last_save_at=2026-09-20T08:05:28.404Z
    - deltaMs=9571596
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: SPECKIT_COMPLETION_FRESHNESS is not enabled
    - code:not_opted_in
+ IMPROVEMENT_ARTIFACTS: No improvement/ folder in this packet
+ LINKS_VALID: All wikilinks under the system-spec-kit skill resolve

Summary: Errors: 0  Warnings: 0

RESULT: PASSED
```
exit=0  cmd=bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-orca/001-mcp-orca-cli --strict

### 8. Packet 002 strict validation
```text

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-orca/002-consolidate-official-orca-skills
  Level:  3
  Engine: orchestrator

+ FILE_EXISTS: All required files present for Level 3
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ ANCHORS_VALID: Anchors well formed in 6 file(s)
! FRONTMATTER_VALID: 10 frontmatter continuity warning(s)
    - implementation-summary.md: missing _memory.continuity.packet_pointer
    - implementation-summary.md: missing _memory.continuity.last_updated_at
    - implementation-summary.md: missing _memory.continuity.last_updated_by
    - implementation-summary.md: missing _memory.continuity.recent_action
    - implementation-summary.md: missing _memory.continuity.next_safe_action
    - decision-record.md: missing _memory.continuity.packet_pointer
    - decision-record.md: missing _memory.continuity.last_updated_at
    - decision-record.md: missing _memory.continuity.last_updated_by
    - decision-record.md: missing _memory.continuity.recent_action
    - decision-record.md: missing _memory.continuity.next_safe_action
! FRONTMATTER_MEMORY_BLOCK: 2 frontmatter_memory_block issue(s) found
    - SPECDOC_FRONTMATTER_002: implementation-summary.md: missing _memory block
    - SPECDOC_FRONTMATTER_002: decision-record.md: missing _memory block
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ MERGE_LEGALITY: No merge plan supplied; legality check skipped
+ CROSS_ANCHOR_CONTAMINATION: No routing payload supplied; contamination check skipped
+ POST_SAVE_FINGERPRINT: No post-save payload supplied; fingerprint check skipped
+ GRAPH_METADATA_PRESENT: Graph metadata checked
+ GENERATED_METADATA_INTEGRITY: Generated metadata passed schema, status-enum and path-prefix invariants
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete' and implementation-summary.md Status 'Complete' both classify as complete
+ AC_COVERAGE: AC_COVERAGE advisory (under floor): 0/9 ACs have evidence; floor 9/9. Cite file:line in the Verification cell, or retire the criterion through a decision record.
    - Malformed evidence citation(s): AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009
+ AC_CLOSURE: AC_CLOSURE: 9/9 criteria met, waived or superseded; packet is closeable
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ AI_PROTOCOLS: AI protocols present and complete (4/4)
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 3; phases=7, tasks=42, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '002-consolidate-official-orca-skills' follows naming convention
+ GREP_CONVENTION: Grep convention: 6 document(s) conform
+ LEVEL_MATCH: Level consistent across all files (Level 3)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_CHILD_IDENTITY: children_ids entries all carry the packet's own identity
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: cli-orca/002-consolidate-official-orca-skills
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: SPECKIT_COMPLETION_FRESHNESS is not enabled
    - code:not_opted_in
+ IMPROVEMENT_ARTIFACTS: No improvement/ folder in this packet
+ LINKS_VALID: All wikilinks under the system-spec-kit skill resolve

Summary: Errors: 0  Warnings: 2

RESULT: PASSED
```
exit=0  cmd=bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-orca/002-consolidate-official-orca-skills --strict

### 9. cli-orca document corpus sweep (blocking issues)
```text
cli-orca docs checked=32 blocking=0
```
exit=0  cmd=doc_sweep

### 10. Stale reference sweep (live retired-leaf references)
```text
live retired-leaf references outside changelog history and benchmark evidence: 0
```
exit=0  cmd=stale_sweep

### 11. Frontmatter version gate (fleet)
```text
[gate] 2926 files | ok=2918  skip-no-frontmatter=8
```
exit=0  cmd=bash .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh

### 12. Advisor positive replay (Orca phrase)
```text
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [
      {
        "skillId": "cli-orca",
        "score": 0.7,
        "confidence": 0.8962,
        "uncertainty": 0.16,
        "dominantLane": "explicit_author",
        "matchedDocs": [
          "references/orca-skills/orca-cli.md"
        ],
        "status": "active"
      },
      {
        "skillId": "sk-git",
        "score": 0.608653,
        "confidence": 0.8472,
        "uncertainty": 0.12,
        "dominantLane": "explicit_author",
        "status": "active"
      }
    ],
    "ambiguous": true,
    "freshness": "live",
    "trustState": {
      "state": "live",
      "reason": null,
      "generation": 75,
      "checkedAt": "2026-09-20T09:42:53.416Z",
      "lastLiveAt": "2026-09-20T09:31:26.240Z"
    },
    "generatedAt": "2026-09-20T09:42:53.451Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": true
    },
    "_shadow": {
      "model": "advisor-shadow-learned-weights-v1",
      "liveWeightsFrozen": true,
      "recommendations": [
        {
          "skillId": "cli-orca",
          "liveScore": 0.7,
          "shadowScore": 0.642857,
          "delta": -0.057143,
          "dominantShadowLane": "explicit_author"
        },
        {
          "skillId": "sk-git",
          "liveScore": 0.608653,
          "shadowScore": 0.600566,
          "delta": -0.008087,
          "dominantShadowLane": "explicit_author"
        }
      ]
    }
  }
}
```
exit=0  cmd=node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt orca worktree handoff to another agent through the Orca CLI --format json

### 13. Advisor holdout replay (OpenOrca)
```text
{
  "status": "ok",
  "data": {
    "workspaceRoot": "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
    "effectiveThresholds": {
      "confidenceThreshold": 0.8,
      "uncertaintyThreshold": 0.35,
      "confidenceOnly": false
    },
    "recommendations": [],
    "ambiguous": false,
    "freshness": "live",
    "trustState": {
      "state": "live",
      "reason": null,
      "generation": 75,
      "checkedAt": "2026-09-20T09:42:54.284Z",
      "lastLiveAt": "2026-09-20T09:31:26.240Z"
    },
    "generatedAt": "2026-09-20T09:42:54.314Z",
    "cache": {
      "hit": false,
      "sourceSignaturePresent": true
    },
    "_shadow": {
      "model": "advisor-shadow-learned-weights-v1",
      "liveWeightsFrozen": true,
      "recommendations": []
    }
  }
}
```
exit=0  cmd=node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt Show the OpenOrca model label for the current request. --format json

### 14. Skill derived metadata freshness (fleet)
```text

checked=14 fresh=14 stale=0 errored=0
```
exit=0  cmd=node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs

### 15. sk-doc frozen directory manifest reproduction
```text
MANIFEST derived=816 frozen=816 baseline=501 gaps=23 exclusions=2 reproduced=True
DISCOVERY readmes=789 pi_extensions=True github_workflows=True
EXCLUSIONS classes=21 fixture_readmes_scored=False
SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible
```
exit=0  cmd=python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py

### 16. Compiled route replay against the hub for the former Orca prompt
```text
{"servingAuthority":"legacy","hubId":"mcp-tooling"}
```
exit=0  cmd=node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt Use the Orca CLI to inspect the current worktree and terminal

FAILING GATES: 0
