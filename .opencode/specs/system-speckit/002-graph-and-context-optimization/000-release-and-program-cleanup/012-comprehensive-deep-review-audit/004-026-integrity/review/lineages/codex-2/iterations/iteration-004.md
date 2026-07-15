# Iteration 004: Maintainability and Template Conformance

Focus dimension: maintainability.

Files reviewed:

- Full `changelog/**/*.md` tree via punctuation-rule searches
- Program changelog README
- Changelog backfill audit report
- Program resource map for lingering template stubs

## Findings

### F006 - P1 - Changelog voice gate claims are false against current entries

Category: maintainability

Finding class: changelog-template-conformance

Content hash: `sha256:cf3f41391851febf2540fece0b2fdecccd457272d661b3a1467d540a1423487d`

The program changelog README states that voice rules are non-negotiable: no em-dashes, no semicolons in narrative, and no Oxford commas [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:44]. The backfill audit report says the verification gate includes whole-file em-dash/en-dash lint and non-backtick semicolon lint [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/audit-report.md:62], then claims the final sweep had 0 hard failures across authored leaf changelogs and rollups [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/audit-report.md:64].

Current changelog entries still contain the forbidden punctuation. For example, `changelog-013-003-front-proxy-in-place-recycle.md` has an em dash and a narrative semicolon in its Summary [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md:23], plus em dashes in Added rows [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md:27] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md:29]. `changelog-006-006-doctor-install-alignment.md` contains em dashes and narrative semicolons in its Changed section [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:33] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:37].

Impact: the changelog surface advertises a strict template/voice guarantee that is currently not true. This makes automated conformance claims and audit sign-off unreliable.

Concrete fix: rerun the changelog punctuation gate over the current tree, repair current violations or relax the README/audit claim to the actual enforced rule, and update the audit report with the current pass/fail counts.

Claim adjudication:

```json
{
  "findingId": "F006",
  "claim": "The current changelog tree violates the README and audit-report claims that em-dashes and narrative semicolons are forbidden and lint-clean.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:44",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/audit-report.md:62",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/002-changelog-backfill-and-audit/audit-report.md:64",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md:23",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md:27",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-003-front-proxy-in-place-recycle.md:29",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:33",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:35",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-006-doctor-install-alignment.md:37"
  ],
  "counterevidenceSought": "Checked whether punctuation was confined to code spans or generated paths; cited examples include narrative prose and headings.",
  "alternativeExplanation": "Some files may have been authored after the original audit sweep, but the README and audit report present the rule as current and non-negotiable.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade to P2 if maintainers explicitly scope the voice rule to newly generated files only and mark legacy exceptions as allowed."
}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence |
|---|---|---|---|
| spec_code | partial | hard | Changelog template claims do not match current changelog content. |
| checklist_evidence | partial | hard | Audit-report verification claim conflicts with current samples. |
| feature_catalog_code | partial | advisory | Changelog catalog conformance claim is stale. |
| playbook_capability | pass | advisory | No new playbook capability issue found. |

## P0 Adversarial Self-Check

No P0 findings were asserted in this iteration.

Review verdict: CONDITIONAL
