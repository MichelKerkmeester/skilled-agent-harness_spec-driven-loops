# Iteration 019: sk-doc --type Classification and Mandatory Requirements Audit

## Focus

**Q2: What sk-doc `--type` does each authored doc under `.opencode/skills/system-code-graph/` match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?**

This iteration maps all authored docs to their sk-doc document types and validates compliance with mandatory section anchors, H2 case requirements, and TOC specifications per the `template_rules.json` contract.

## Actions Taken

1. Read sk-doc `SKILL.md` to understand document type routing and validation workflow
2. Read sk-doc `scripts/validate_document.py` to understand document type detection logic
3. Read sk-doc `assets/template_rules.json` to extract mandatory requirements per document type
4. Listed all authored markdown files under `.opencode/skills/system-code-graph/` using glob patterns
5. Read representative authored docs (SKILL.md, README.md, INSTALL_GUIDE.md, ARCHITECTURE.md, feature_catalog.md, manual_testing_playbook.md, and mcp_server READMEs) to classify their --type and validate against contracts

## Findings

### Document Type Classification and Compliance

| Document | Path | Detected --type | Mandatory Sections (per contract) | Compliance Status | Missing/Issues |
|----------|------|-----------------|----------------------------------|-------------------|---------------|
| **SKILL.md** | `.opencode/skills/system-code-graph/SKILL.md` | `skill` | when_to_use, smart_routing, how_it_works, rules | ✅ COMPLIANT | All 4 required sections present at lines 29-104. TOC not required for skill type. H2 emoji not required. |
| **README.md** | `.opencode/skills/system-code-graph/README.md` | `readme` | overview | ✅ COMPLIANT | Required overview section present at lines 36-80. TOC present and properly formatted with double-dash anchors at lines 19-31. TOC entries are ALL CAPS. H2 headers are ALL CAPS. |
| **INSTALL_GUIDE.md** | `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | `install_guide` | overview, prerequisites, installation, verification | ✅ COMPLIANT | All 4 required sections present: overview (39-58), prerequisites (63-72), installation (77-95), verification (160-178). TOC present with double-dash anchors (22-34). TOC entries ALL CAPS. H2 headers ALL CAPS. |
| **ARCHITECTURE.md** | `.opencode/skills/system-code-graph/ARCHITECTURE.md` | `reference` | overview | ✅ COMPLIANT | Required overview section present at lines 36-41. TOC not required for reference type. H2 emoji not required. |
| **feature_catalog.md** | `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | `reference` | overview | ✅ COMPLIANT | Required overview section present at lines 34-51. TOC present (20-31) but not required for reference type. H2 headers are not ALL CAPS (acceptable for reference type). |
| **manual_testing_playbook.md** | `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | `playbook` | overview, global_preconditions, global_evidence_requirements, deterministic_command_notation | ✅ COMPLIANT | All 4 required sections present: overview (40-56), global_preconditions (58-63), global_evidence_requirements (65-70), deterministic_command_notation (72-77). TOC present with double-dash anchors (18-37). TOC entries ALL CAPS. H2 headers ALL CAPS. |
| **mcp_server/README.md** | `.opencode/skills/system-code-graph/mcp_server/README.md` | `readme` | overview | ✅ COMPLIANT | Required overview section present at lines 33-47. TOC present with double-dash anchors (16-28). TOC entries ALL CAPS. H2 headers ALL CAPS. |
| **mcp_server/handlers/README.md** | `.opencode/skills/system-code-graph/mcp_server/handlers/README.md` | `readme` | overview | ✅ COMPLIANT | Required overview section present at lines 36-48. TOC present with double-dash anchors (18-31). TOC entries ALL CAPS. H2 headers ALL CAPS. |
| **Changelog files** | `.opencode/skills/system-code-graph/changelog/v*.md` | `changelog` | none | ✅ COMPLIANT | No required sections per changelog contract. No TOC required. H2 case not enforced. |

### Per-Feature Playbook Files (sample validation)

The manual_testing_playbook contains 22 scenario files under numbered category folders. Based on the sk-doc detection logic in `validate_document.py` (lines 123-130), these files should be classified as `playbook_feature` type when they live under `manual_testing_playbook/NN--category/` directories.

**playbook_feature contract requirements:**
- Required sections: overview, scenario_contract, test_execution, source_metadata
- TOC required: false
- H2 uppercase required: true
- H2 emoji required: false

**Sample validation of representative per-feature files:**

| File | Path | Required Sections Present | H2 Case Compliance |
|------|------|---------------------------|-------------------|
| `ensure-ready-selective-reindex.md` | `manual_testing_playbook/read-path-freshness/` | Not validated in this iteration (sample check deferred to Q8) | Not validated |
| `tool-call-shape-validation.md` | `manual_testing_playbook/mcp-tool-surface/` | Not validated in this iteration (sample check deferred to Q8) | Not validated |

### Per-Feature Catalog Files (sample validation)

The feature_catalog contains 17 per-feature files under numbered category folders. These should be classified as `reference` type based on their location under `feature_catalog/`.

**reference contract requirements:**
- Required sections: overview
- TOC required: false
- H2 emoji required: false
- H2 uppercase required: false

**Sample validation of representative per-feature files:**

| File | Path | Required Sections Present | Notes |
|------|------|---------------------------|-------|
| `01-ensure-code-graph-ready.md` | `feature_catalog/read-path-freshness/` | Not validated in this iteration (sample check deferred to Q7) | Deferred to Q7 iteration |
| `01-tool-registrations.md` | `feature_catalog/mcp-tool-surface/` | Not validated in this iteration (sample check deferred to Q7) | Deferred to Q7 iteration |

### MCP Server Sub-folder READMEs

Based on the glob results, the following additional README files exist under `mcp_server/` subdirectories:

- `mcp_server/lib/README.md`
- `mcp_server/lib/utils/README.md`
- `mcp_server/database/README.md`
- `mcp_server/tools/README.md`
- `mcp_server/tests/README.md`
- `mcp_server/tests/handlers/README.md`
- `mcp_server/plugin_bridges/README.md`
- `mcp_server/stress_test/code-graph/README.md`

These should all be classified as `readme` type based on their filename and location. Full validation of these files was not completed in this iteration due to tool call limits, but they should follow the same contract as the validated mcp_server READMEs (required: overview section; TOC required with double-dash anchors and ALL CAPS entries; H2 headers ALL CAPS).

### Key Contract Insights

1. **TOC Requirements**: Only `readme`, `install_guide`, and `playbook` types require TOC. All validated docs of these types have TOC present with proper double-dash anchor format (e.g., `#1--overview`).

2. **H2 Case Requirements**: 
   - `readme`, `install_guide`, and `playbook` types require ALL CAPS H2 headers
   - `skill`, `reference`, `asset`, and `changelog` types do not require ALL CAPS H2 headers
   - All validated docs comply with their type's H2 case requirements

3. **Required Sections**: Each document type has specific mandatory sections. All validated root-level docs contain their required sections.

4. **H2 Emoji Requirements**: No validated document types require H2 emojis per current template_rules.json (all have `h2EmojiRequired: false`).

## Questions Answered

**Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?**

Answered: Mapped 8 primary authored docs to their sk-doc --type classifications and validated compliance with mandatory section anchors, H2 case requirements, and TOC specifications. All root-level authored docs are compliant with their type contracts. Per-feature files under feature_catalog and manual_testing_playbook were identified but sample validation deferred to Q7/Q8 iterations per the progressive focus guide.

## Questions Remaining

- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from?
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?

## Next Focus

**Q3: HVR violations audit** - Itemize em dashes, banned words, banned phrases, semicolons, and Oxford commas per authored doc with line numbers. This will inform the child-001 task ordering by identifying which files need HVR remediation alongside other fixes.