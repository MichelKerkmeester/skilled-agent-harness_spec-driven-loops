# Iteration 003: Traceability Link and Status Replay

Focus dimension: traceability.

Files reviewed:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md`
- All `changelog/*/*root.md` files under the 026 changelog tree
- Sampled recent packet `spec.md` and `graph-metadata.json` status pairs
- Timeline section D link mapping by generated-link spot checks

## Findings

### F005 - P1 - Top-level rollups contain broken child-group links

Category: traceability

Finding class: broken-changelog-link

Content hash: `sha256:169e64bbfff857aa0e7ed26476ac81b1caa248b516fd8d1b3d1bb139c34a51e0`

The program README says phase-parent rollups use the `-root.md` suffix and that per-directory rollups are the authoritative child inventory [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:42] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:45]. Two top-level rollups still link to old per-child `changelog/` directories instead of current flat rollup files. `002-spec-kit-internals` links three child groups to missing relative directories [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:31] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:32]. `006-operator-tooling` does the same for two child groups [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-operator-tooling-root.md:30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-operator-tooling-root.md:31].

Impact: a user following the advertised authoritative rollup path hits missing directories, so the changelog traceability chain breaks even where leaf changelogs exist.

Concrete fix: rewrite those five entries to existing flat `changelog-*-root.md` files when a matching rollup exists, or mark child groups without rollups as intentionally absent with a valid current-home link.

Claim adjudication:

```json
{
  "findingId": "F005",
  "claim": "The top-level changelog rollups for 002 and 006 contain five relative links that do not resolve in the current flat changelog tree.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:42",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/README.md:45",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:30",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:31",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/002-spec-kit-internals/changelog-002-spec-kit-internals-root.md:32",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-operator-tooling-root.md:30",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/006-operator-tooling/changelog-006-operator-tooling-root.md:31"
  ],
  "counterevidenceSought": "Ran a link-resolution pass over the program README and all root rollups; only these five links failed.",
  "alternativeExplanation": "The entries may be intended as current-home spec-folder links, but they are written as relative changelog-directory links under the changelog aggregation tree, where they do not exist.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade to P2 if the README stops presenting rollups as authoritative navigation and marks these entries as historical text rather than links."
}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence |
|---|---|---|---|
| spec_code | partial | hard | The README's authoritative-rollup claim is contradicted by broken rollup links. |
| checklist_evidence | partial | hard | Sampled completion status mismatch from iteration 001 remains active. |
| feature_catalog_code | partial | advisory | Changelog index and rollups remain partially stale. |
| playbook_capability | pass | advisory | No new playbook capability issue found. |

## P0 Adversarial Self-Check

No P0 findings were asserted in this iteration.

Review verdict: CONDITIONAL
