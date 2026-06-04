# Iteration 003 - Security / Integrity: path and link safety

## State Read

- Read `deep-review-state.jsonl`.
- Read `deep-review-findings-registry.json`.
- Read `deep-review-strategy.md`.

## Review Actions

1. Parsed root playbook markdown links and checked relative targets.
2. Parsed per-scenario markdown links and checked relative targets.
3. Checked feature-catalog per-file markdown links.
4. Reviewed path spelling and prompt quality in scenario 136.

## Findings

### DR-CAT-P1-005 - Manual playbook contains broken cross-reference links

Severity: P1  
Category: link-integrity  
Finding class: broken-cross-reference-links  
Content hash: `d88b438e15c00c00`

The root playbook declares Section 12 as the feature catalog cross-reference index. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3675]

That index contains stale catalog links; for example, the Hybrid search pipeline row points at `../feature_catalog/01--retrieval/006-hybrid-search-pipeline.md`, while the current catalog file is not at that path. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3682]

The scenario package also has broken links. The stress-cycle scenario references `../../feature_catalog/14--stress-testing/01-stress-test-cycle.md`, while the current feature catalog entry is under the pipeline-architecture category. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/170-run-stress-cycle.md:146]

Command evidence: root playbook link scan found 83 broken relative links; scenario-file scan found 29 broken relative links; sampled feature-catalog files had 0 broken links.

Impact: operators following the root index or scenario references can land on missing targets, which breaks the traceability chain this audit slice is meant to validate.

Concrete fix: add a markdown-link integrity check for root playbook and scenario files, then regenerate stale links from current file paths.

### DR-CAT-P2-001 - Uppercase catalog path is portability-risky

Severity: P2  
Category: portability  
Finding class: case-sensitive-path-risk  
Content hash: `cfecb8e7e9ea35d6`

The code-reference entry says annotation names must match headings in `feature_catalog/FEATURE_CATALOG.md`. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md:26]

Scenario 136 repeats `feature_catalog/FEATURE_CATALOG.md` and `FEATURE_CATALOG.md` in its command contract. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:38]

On this macOS worktree, that path resolves to the lower-case catalog due case-insensitive filesystem behavior. On a case-sensitive checkout, the documented command can fail even though `feature_catalog.md` exists.

Concrete fix: use the canonical lower-case file path consistently, or make the command discover the catalog root file explicitly.

### DR-CAT-P2-003 - Scenario 136 has malformed request and expected-signal text

Severity: P2  
Category: playbook-quality  
Finding class: malformed-scenario-prompt  
Content hash: `90cca5460583247f`

The scenario's real-user-request text starts in the middle of a command and contains unmatched formatting around `sort -u`. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:18]

The expected-signal text repeats the same malformed fragment instead of naming the complete command sequence cleanly. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:21]

Impact: the scenario's executable command block is still usable, but the operator-facing prompt is degraded and can produce inconsistent delegated execution.

Concrete fix: rewrite the request and expected-signal fields from the clean command block at lines 35-44.

## Security Self-Check

No P0 security vulnerability was found. The integrity issues are documentation/path-traceability failures rather than runtime data exposure or unsafe mutation.

## Iteration Delta

P0: 0  
P1: 1  
P2: 2  
New findings ratio: 0.34

Review verdict: CONDITIONAL
