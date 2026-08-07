# Iteration 2: Security

## Focus

Re-read the authored destination guard and adversarial tests, then compared them with the database indexer's realpath containment checks and retrieval input boundaries.

## Scorecard

- Dimensions covered: security
- Files reviewed: 9
- New findings: P0=1 P1=0 P2=0
- Refined findings: P0=0 P1=2 P2=1
- New findings ratio: 0.80

## Findings

### P0, Blocker

- **F004**: Authored leaf symlinks can redirect a permitted write into measured data — `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:72` — the guard validates only the lexical filename and then calls `writeFile` on the destination. If `AUTHORED-DESIGN.md` already points at `DESIGN.md` (or another measured file), the write follows that symlink and clobbers measured content, directly violating the hard authored/measured boundary. The adversarial test covers direct measured path strings but not pre-existing symlinks. Remediation: reject symlinked destination entries with `lstat`, and use no-follow/atomic creation semantics for the final write.

```json
{
  "claim": "The authored writer cannot write into measured artifacts.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/spec.md:75",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/spec.md:77",
    ".opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:66",
    ".opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:72",
    ".opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs:25"
  ],
  "counterevidenceSought": "A final-path lstat/no-follow check or a test proving an existing authored-name symlink cannot redirect the write.",
  "alternativeExplanation": "The caller may ensure the authored root contains no symlinks, but the write boundary itself does not enforce that invariant.",
  "finalSeverity": "P0",
  "confidence": 0.98,
  "downgradeTrigger": "A boundary-level symlink test demonstrates that existing authored-name symlinks are rejected before writeFile follows them."
}
```

### Refined Findings

- **F001** remains P1: the parent/child topology drift is independent of security review.
- **F002** remains P1: malformed authored Markdown remains writable after the security pass.
- **F003** remains P2: paired export failure atomicity remains a resilience concern, not a direct injection path.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | fail | hard | `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:72` | The hard boundary is bypassable through an existing destination symlink. |
| checklist_evidence | partial | hard | `.opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs:25` | Direct path negatives exist; symlink and no-follow negatives are absent. |
| feature_catalog_code | partial | advisory | `.opencode/skills/sk-design/styles/lib/database/indexer.mjs:297` | Corpus input containment is strong, but the authored writer uses a weaker final-path policy. |
| playbook_capability | fail | advisory | `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/spec.md:77` | The documented never-clobber invariant is not enforced for symlinked destinations. |

## Assessment

- New findings ratio: 0.80
- Dimensions addressed: security
- Novelty justification: the P0 is a distinct leaf-symlink path bypass; prior correctness findings did not cover filesystem redirection.

## Ruled Out

- The measured indexer checks resolved artifact paths against the corpus root before reading (`.opencode/skills/sk-design/styles/lib/database/indexer.mjs:297`), so no separate corpus symlink-escape finding was raised.
- Retrieval composition facets use parameterized SQL and bounded normalization (`.opencode/skills/sk-design/styles/lib/database/retrieval.mjs:141`), so no SQL-injection finding was raised.

## Dead Ends

- No credential, network, or command-execution surface was found in the reviewed implementation paths.

## Recommended Next Focus

Traceability and maintainability together: reconcile the five-child packet map, checklist claims, generated metadata, and the implementation contracts that future maintainers will rely on.

Review verdict: FAIL
