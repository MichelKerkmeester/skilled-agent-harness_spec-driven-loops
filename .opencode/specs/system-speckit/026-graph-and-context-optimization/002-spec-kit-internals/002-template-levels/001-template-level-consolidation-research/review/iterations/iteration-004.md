# Iteration 004: validator-coverage

## Dispatcher

- **Dimension**: validator-coverage
- **Focus**: Does the validation suite catch template/contract mismatches? Are there gaps between sectionGates declarations and actual validator coverage?
- **Budget profile**: `verify` (11-13 calls)
- **Status**: complete

## Files Reviewed

| File | Lines Reviewed | Key Sections |
|------|---------------|-------------|
| `scripts/rules/check-files.sh` | 1-113 | FILE_EXISTS rule, phase-parent branch, level-based doc enumeration via `template-structure.js docs` |
| `scripts/rules/check-template-headers.sh` | 1-208 | TEMPLATE_HEADERS rule, calls `template-structure.js compare <level> <doc> headers` |
| `scripts/rules/check-anchors.sh` | 1-280 | ANCHORS_VALID rule, calls `template-structure.js compare <level> <doc> anchors`, anchor syntax/pairing/order checks |
| `scripts/spec/validate.sh` | 1-1044 | Master orchestrator, rule execution loop, strict validator chain, TS rule bridge |
| `scripts/spec/check-template-staleness.sh` | 1-244 | Version-based staleness comparison only |
| `scripts/utils/template-structure.js` | 1-877 | `loadTemplateContract()`, `compareDocumentToTemplate()`, `assertSectionGates()`, `parseAnchoredSections()`, `loadLevelContract()` |
| `scripts/lib/template-utils.sh` | 1-281 | `copy_template()`, `copy_templates_batch()`, `_manifest_template_path()` |
| `scripts/lib/validator-registry.json` | 1-276 | All 31 registered rules, severities, categories |
| `templates/manifest/spec-kit-docs.json` | 1-709 | Full sectionGates declarations for levels 1/2/3/3+/phase |

## Validation Run

```text
$ validate.sh --strict --verbose /target/spec-folder

Spec Folder Validation v3.0.0
  Folder: .../001-template-level-consolidation-research
  Level: 3

+ FILE_EXISTS: All required files present for Level 3
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
x TEMPLATE_HEADERS: 1 template headers issue(s) found
x ANCHORS_VALID: 1 template anchors issue(s) found
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked

Summary: Errors: 2  Warnings: 0
RESULT: FAILED

Details:
  - TEMPLATE_HEADERS: checklist.md: missing or out-of-order header 'FIX COMPLETENESS'
  - ANCHORS_VALID: checklist.md: missing required anchor 'fix-completeness'
```

The validator detected 2 issues in the authored spec folder, but neither relates to the template/contract mismatches from iter 3.

## Findings - New

### P1 Findings

1. **ANCHORS_VALID contract derived from template content only — sectionGate-to-template cross-validation missing** -- `template-structure.js:420-501` / `check-anchors.sh:190-192` -- The `ANCHORS_VALID` rule calls `template-structure.js compare` with `anchors` scope. This invokes `compareDocumentToTemplate()` which derives its contract from `loadTemplateContract()`. That function extracts ANCHOR tags by parsing the rendered `.tmpl` file (line 458-464), never cross-referencing spec-kit-docs.json sectionGates. If a template `.tmpl` file is missing ANCHOR wrappers for sections declared in sectionGates — such as `risk-matrix:["3","3+"]` and `user-stories:["3","3+"]` at `spec-kit-docs.json:381-382` — the validator silently accepts the reduced ANCHOR set as the valid contract. The P1-003-001 finding (missing ANCHOR:risk-matrix and ANCHOR:user-stories in spec.md.tmpl) would therefore never be caught by `validate.sh` when run against authored spec folders.

   **Finding class**: missing-coverage
   **Scope proof**: `template-structure.js:420-501` loadTemplateContract extracts ANCHORs from template content only; `check-anchors.sh:190-208` compares authored docs against template-derived contract only; `spec-kit-docs.json:370-382` declares risk-matrix/user-stories as Level 3 sectionGates; no code path links sectionGates array to ANCHOR validation
   **Affected surface hints**: [`check-anchors.sh`:compare_required_anchors, `template-structure.js`:loadTemplateContract, `template-structure.js`:assertSectionGates, `spec-kit-docs.json`:levels.3.sectionGates.spec.md]

   ```json
   {"type":"claim-adjudication","claim":"sectionGates declarations and template ANCHOR content can drift without validator detection","evidenceRefs":["template-structure.js:420-501","check-anchors.sh:190-208","spec-kit-docs.json:370-382"],"counterevidenceSought":"Checked all code paths in validate.sh, check-anchors.sh, check-template-headers.sh — none call assertSectionGates or loadLevelContract for ANCHOR cross-reference. loadLevelContract returns sectionGates at line 153 but loadTemplateContract ignores it.","alternativeExplanation":"The validator assumes the template is the ground truth and that template authors manually ensure ANCHOR/sectionGate consistency. This assumption is undocumented and unenforced.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":null}
   ```

2. **TEMPLATE_HEADERS contract also template-derived — no sectionGate gate-level cross-check** -- `template-structure.js:420-501` / `check-template-headers.sh:64` -- Similar to finding 1, the `TEMPLATE_HEADERS` rule derives `headerRules` from the rendered template's H2 sections (line 441-447), not from spec-kit-docs.json sectionGates. Furthermore, the template IF gate conditions (e.g., `level:3+` at `template-structure.js:237-258`) are never validated against the sectionGates level arrays. The iter 3 finding P1-003-003 (`implementation-summary.md.tmpl` uses `level:3+` gate but sectionGates declare `architecture-summary:["3","3+"]`) exists because no validator compares template gate expressions (`<!-- IF level:3+ -->`) against the sectionGates entitlement arrays. A template can restrict access to content that sectionGates says should be available.

   **Finding class**: missing-coverage
   **Scope proof**: `template-structure.js:237-258` evaluateTemplateGate parses IF conditions from template content; `spec-kit-docs.json:408-416` declares architecture-summary for ["3","3+"]; `spec-kit-docs.json:575-578` declares governance-summary for ["3+"]; no validator cross-references the two
   **Affected surface hints**: [`check-template-headers.sh`:compare_headers, `template-structure.js`:evaluateTemplateGate, `template-structure.js`:assertSectionGates, `spec-kit-docs.json`:levels.3.sectionGates.implementation-summary.md]

   ```json
   {"type":"claim-adjudication","claim":"template IF gate conditions can diverge from sectionGate level arrays without detection","evidenceRefs":["template-structure.js:237-258","spec-kit-docs.json:408-416","spec-kit-docs.json:575-578"],"counterevidenceSought":"Traced all calls to assertSectionGates: only loadLevelContract returns it (line 153) and it is not consumed by any validator rule. The only consumer of sectionGates outside scaffold is the inline-gate-renderer at render time, not validation time.","alternativeExplanation":"Gate expressions in templates are the rendering implementation detail; sectionGates is the contract declaration. They may intentionally differ for progressive rendering, but the validator has no way to alert when they contradict.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"If sectionGates are explicitly a 'maximum entitlement' contract and template IF gates are an independent implementation detail, this is by design and would be P2. No such documentation exists."}
   ```

3. **parseAnchoredSections first-match strategy hides structural nesting issues** -- `template-structure.js:363-397` -- The `parseAnchoredSections()` function finds the first matching `<!-- /ANCHOR:id -->` as the closing tag (line 376-380). This means when `ANCHOR:questions` opens at a higher level and wraps other independent ANCHOR blocks (as found in P1-003-002: `/ANCHOR:questions` at line 845 wraps `ANCHOR:approval-workflow`, `ANCHOR:compliance-checkpoints`, `ANCHOR:stakeholder-matrix`, and `ANCHOR:change-log`), these interior anchors become invisible to the validator. Their section content is absorbed into `ANCHOR:questions`, and `loadTemplateContract` (line 467-482) will never see them as independent sections. This means the validator cannot detect that `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, and `change-log` anchors exist in the template but are structurally inaccessible. No nesting-depth or anchor-overlap validation exists.

   **Finding class**: silent-data-loss
   **Scope proof**: `template-structure.js:376-380` uses first ANCHOR_CLOSE_LINE_RE match as end boundary; `template-structure.js:467-482` iterates parseAnchoredSections results to build requiredAnchors/optionalAnchors; no nesting-depth check exists in the 877-line file
   **Affected surface hints**: [`template-structure.js`:parseAnchoredSections, `check-anchors.sh`:compare_required_anchors, `check-template-headers.sh`:compare_headers]

   ```json
   {"type":"claim-adjudication","claim":"nested ANCHOR blocks cause content to be silently absorbed and undetectable","evidenceRefs":["template-structure.js:363-397","template-structure.js:467-482","spec.md.tmpl:718,845 (from iter 3 evidence)"],"counterevidenceSought":"Checked whether flattening logic or post-processing handles nesting in compareDocumentToTemplate or printCompareResult — neither does. The contract's requiredAnchors array is flat and unordered in the template's structural terms.","alternativeExplanation":"The template author is expected to manually ensure all ANCHOR wrappers are non-nested. This assumption is implicit and unenforced.","finalSeverity":"P1","confidence":0.90,"downgradeTrigger":"If this behavior is explicitly documented as 'ANCHORs must be non-nested, authors are responsible' it could drop to P2, but no such documentation was found."}
   ```

### P2 Findings

4. **check-template-staleness.sh only compares version strings — no structural drift detection** -- `check-template-staleness.sh:60-73` -- The staleness checker compares `SPECKIT_TEMPLATE_SOURCE` version comments in authored spec files against the current template version from `spec-kit-docs.json:versions`. It does not detect structural mismatches between spec-kit-docs.json sectionGates and actual template ANCHOR/H2 output. A template change that doesn't bump the version string (e.g., adding/moving an ANCHOR) would produce stale folders with no warning.

   **Finding class**: incomplete-detection
   **Scope proof**: `check-template-staleness.sh:60-73` uses version string comparison only; `check-template-staleness.sh:89-101` discovers spec folders by finding spec.md files; no structural comparison against template content
   **Affected surface hints**: [`check-template-staleness.sh`]

5. **No integration test for sectionGate→ANCHOR contract consistency across all levels** -- `templates/manifest/spec-kit-docs.json:126-708` vs `templates/manifest/*.tmpl` -- There is no automated test that renders every `.tmpl` file at every declared level and verifies the resulting ANCHOR set matches the `sectionGates` declarations for that level+document combination. The existing `template-rendered-parity.vitest.ts` test could not execute due to module resolution failure (iter 3 finding), and even if it worked, it tests rendering parity, not sectionGate contract compliance. Without such a test, template authors must manually verify that every sectionGate entry has a corresponding `<!-- ANCHOR:section-id -->` block in the template, and that gate conditions match.

   **Finding class**: test-gap
   **Scope proof**: No test file in `scripts/tests/` or `mcp_server/**/tests/` validates sectionGate contract compliance; `spec-kit-docs.json:126-708` contains sectionGates for 5 levels × 5+ documents; `templates/manifest/` contains 12 .tmpl files
   **Affected surface hints**: [`templates/manifest/spec-kit-docs.json`, `templates/manifest/*.tmpl`, `scripts/tests/`]

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `check-files.sh` uses `template-structure.js docs` for doc enumeration | PASS | `check-files.sh:87-93` calls `node "$helper_script" docs "$level"` |
| `check-template-headers.sh` uses `template-structure.js compare` for header validation | PASS | `check-template-headers.sh:64` calls `node "$helper_script" compare "$contract_level" ... headers` |
| `check-anchors.sh` uses `template-structure.js compare` for anchor validation | PASS | `check-anchors.sh:190` calls `node "$helper_script" compare "$level" ... anchors` |
| `validate.sh` rule routing from `validator-registry.json` | PASS | `validate.sh:422-431` `should_run_rule` queries registry; `:438-441` `canonicalize_rule_name` resolves aliases |
| `check-template-staleness.sh` reads version from `spec-kit-docs.json` | PASS | `check-template-staleness.sh:60-73` reads `versions["spec.md.tmpl"]` |
| sectionGate cross-validation against template ANCHORs | FAIL | No code path links `assertSectionGates()` output to `loadTemplateContract()` output; see P1-004-001 |
| template IF gate condition validation against sectionGates | FAIL | No code path compares `evaluateTemplateGate()` conditions against sectionGates level arrays; see P1-004-002 |
| ANCHOR nesting structural validation | FAIL | `parseAnchoredSections()` uses first-match; no nesting-depth check; see P1-004-003 |
| `inline-gate-renderer.ts` produces deterministic output | PASS (confirmed iter 002) | Pure-function analysis in iter 002 |

## Integration Evidence

| Integration Surface | Canonical Path | Reviewed? | Finding |
|---------------------|---------------|-----------|---------|
| Dispatcher command | `.opencode/commands/deep/start-review-loop.md` | N/A (not in scope) | Not reviewed |
| Auto workflow | `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | N/A (not in scope) | Not reviewed |
| Orchestrator agent | `@orchestrate` | N/A (not in scope) | Not reviewed |
| Single-pass reviewer | `@review` | N/A (not in scope) | Not reviewed |
| `create.sh` scaffold | `scripts/spec/create.sh` | Yes (indirect) | Uses `loadLevelContract()` which returns sectionGates but never validates them against templates |
| `inline-gate-renderer.ts` | `scripts/templates/inline-gate-renderer.ts` | Yes (indirect) | Consumes template content and gate expressions; no sectionGate validation |
| Runtime mirrors | `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` | Not in this iteration | Deferred to iter 5 |

## Edge Cases

- **Ambiguity: sectionGates as "maximum entitlement" vs "implementation detail"**: The sectionGates in spec-kit-docs.json could be interpreted as either (a) a contract declaration of what SHOULD exist, or (b) metadata used solely by the inline-gate-renderer for rendering decisions. Without explicit documentation, the validator cannot determine which interpretation is correct. The current validation treats templates as ground truth (interpretation b), but the research.md findings assume interpretation (a). This ambiguity is itself a gap that needs resolution.

- **Partial success: verbose validator output shows 2 errors but neither is template/contract related**: The validator does catch issues in user-authored docs (missing fix-completeness anchor/header in this spec folder's checklist.md), confirming the validation pipeline works. But the specific template/contract drift issues (missing risk-matrix/user-stories ANCHORs, misplaced /ANCHOR:questions, gate-level conflicts) are structurally invisible to the current validator.

- **Contradiction: SECTIONS_PRESENT rule reports "covered by per-document manifest anchors"**: The validate.sh output shows `+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors`. This implies a belief that section presence is already covered by anchor validation. But as shown in P1-004-001, anchor validation only covers anchors the template actually contains, not anchors that sectionGates declares.

## Confirmed-Clean Surfaces

- **check-files.sh FILE_EXISTS rule**: Correctly uses `template-structure.js docs <level>` to enumerate required docs from spec-kit-docs.json. The level contract resolution is accurate.
- **check-template-headers.sh header syntax/pairing**: The header comparison logic (`compare_headers` function) correctly classifies missing, out-of-order, and extra headers with position-aware warning thresholds for mid-document drift vs post-required extensions.
- **validator-registry.json rule registration**: All 31 rules have correct `script_path`, `severity`, `category`, and `rule_id` fields. The registry-driven dispatch in `validate.sh` resolves aliases correctly via `canonicalize_rule_name`.
- **check-anchors.sh anchor syntax/pairing**: Correctly validates anchor syntax (`<!-- ANCHOR:id -->`), pairing (open/close match), uniqueness (no duplicate IDs), and basic presence (at least 1 ANCHOR in major docs).

## Ruled Out

- **check-files.sh as a sectionGate validator**: This rule only checks file existence, not content structure. Not a gap — it does exactly what it claims.
- **validate_template_hashes in validate.sh**: This function (`validate.sh:226-252`) is intentionally informational-only (hash mismatches aren't failures) and is not a coverage gap in the current design.
- **EVIDENCE_MARKER_LINT and CONTINUITY_FRESHNESS**: These are strict-mode-only rules that validate evidence formatting and continuity frontmatter. Not relevant to template/contract ANCHOR coverage.

## Next Focus

- **Dimension**: cross-runtime-mirror-consistency
- **Focus Area**: Do `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` mirror each other consistently? Are template-path references consistent across runtimes? Does the `@deep-review` agent file (this agent's own runtime) correctly reference the current manifest-based architecture?
- **Reason**: This is the final dimension in the review charter. With 15 findings (11 P1, 8 P2) across 4 dimensions, the cross-runtime mirror check completes the coverage audit. The validator-coverage findings (P1-004-001/002/003) show structural gaps that cross-runtime agents may also be vulnerable to.
- **Rotation status**: Final dimension
- **Blocked/productive carry-forward**: Conclusive — 3 new P1 findings with strong evidence
- **Required evidence**: Compare agent markdown files across runtimes; verify parameter consistency in `@deep-review` agent definition across all 4 runtimes
- **Recovery note**: None — budget profile `scan` (9-11 calls) sufficient for file comparison
