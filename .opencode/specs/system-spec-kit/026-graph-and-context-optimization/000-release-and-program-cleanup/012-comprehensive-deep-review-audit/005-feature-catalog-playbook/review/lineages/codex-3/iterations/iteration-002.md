# Iteration 002 - Spec Alignment / Traceability: playbook coverage

## State Read

- Read `deep-review-state.jsonl`.
- Read `deep-review-findings-registry.json`.
- Read `deep-review-strategy.md`.

## Review Actions

1. Re-read root playbook release-readiness rules.
2. Ran the root playbook's deterministic scenario-count logic.
3. Compared scenario files against Section 12 root-index links.
4. Compared catalog feature files against playbook scenario source references.
5. Sampled unlinked scenario and feature files for concrete citations.

## Findings

### DR-CAT-P1-002 - Playbook release-readiness count is stale

Severity: P1  
Category: playbook-coverage  
Finding class: stale-release-readiness-count  
Content hash: `a10163490a62373e`

The release-readiness rule requires 100% coverage of playbook scenarios defined by the root index. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:139]

The deterministic count block hard-codes `380` expected scenario files. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166]

Running that same count rule against the current tree returns `384`. The root also repeats the stale `380` value in prose. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:173]

Impact: the published release-readiness gate is self-inconsistent with the current tree and will reject a truthful execution report unless the operator ignores the documented check.

Concrete fix: regenerate the count from the current root, decide whether README/package-map markdown files are scenario files, and update the count rule so it derives expected totals from the index rather than a stale literal.

### DR-CAT-P1-003 - Root cross-reference index does not link all scenario files

Severity: P1  
Category: playbook-root-index  
Finding class: orphan-scenario-index-gap  
Content hash: `f47de555bcac894a`

The playbook says orphan scenario count must be zero, defined as every scenario file being linked in Section 12. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:142]

Section 12 is the declared feature catalog cross-reference index. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3675]

A path comparison found `384` scenario-like files, `325` root-index links, and `90` scenario files not linked by the root index extraction. One concrete unlinked scenario is `03--discovery/031-detect-changes-preflight.md`, which is a real scenario file with its own frontmatter and title. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/03--discovery/031-detect-changes-preflight.md:1]

Impact: the playbook currently violates its own zero-orphan release-readiness rule, so root-index coverage cannot be trusted as the complete scenario ledger.

Concrete fix: regenerate Section 12 from the filesystem, then decide whether package READMEs and auxiliary files are excluded from scenario counts or indexed with explicit `non-scenario` classification.

### DR-CAT-P1-004 - Feature catalog entries lack playbook scenario source references

Severity: P1  
Category: feature-to-playbook-coverage  
Finding class: missing-scenario-reference  
Content hash: `127203a3a9a1c2fb`

The playbook acknowledges that scenario coverage is not a one-to-one feature-file count and says feature-catalog cross-reference coverage is reviewed separately. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:140]

The final verdict report is supposed to call out feature-catalog entries that are automated-only, indirect, or intentionally operator-only. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:172]

The current source-reference extraction found `48` feature catalog files with no scenario source reference. Sampled unlinked entries include `Search API surface`, a public API-boundary feature. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/01--retrieval/012-search-api-surface.md:15]

Another sampled unlinked entry is `Codex hook freshness smoke check`, which has implementation and test references but no playbook scenario source reference in the extraction. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/239-codex-hook-freshness-smoke-check.md:17]

Impact: the catalog/playbook pair does not currently provide a complete classification for features without manual scenarios, so release reports cannot truthfully distinguish covered, indirect, automated-only, and unverified entries.

Concrete fix: add a generated coverage table with one row per feature catalog file and an explicit state: direct manual scenario, indirect scenario, automated-only, operator-only, or gap.

## Iteration Delta

P0: 0  
P1: 3  
P2: 0  
New findings ratio: 0.68

Review verdict: CONDITIONAL
