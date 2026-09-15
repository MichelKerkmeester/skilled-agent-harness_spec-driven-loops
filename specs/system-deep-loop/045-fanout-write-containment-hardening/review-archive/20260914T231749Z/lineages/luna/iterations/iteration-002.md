# Deep Review Iteration 002

## Focus

Security of trusted quarantine destinations and symlink boundary enforcement.

## Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:943-1117`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1714-1970`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:194-196`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:63-70`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/luna/iterations/iteration-001.md`

## Findings

### P0

- **LUNA-F003**: Quarantine destinations are not canonicalized before trusted writes — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:943` — `writeQuarantineFile` creates and writes the supplied destination without checking its resolved parent; the fixed containment/quarantine path and all nested content and patch paths therefore follow a pre-existing symlink and can write outside the lineage.

### P1

- **LUNA-F001**: Pre-existing untracked deletions disappear from the baseline diff — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:823` — carried from iteration 1; the current-status-only loop still omits a baseline-only untracked path deleted before sampling.
- **LUNA-F002**: Failed or incomplete lanes skip containment entirely — `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381` — carried from iteration 1; failure gates still throw before containment.

### P2

None.

## Claim Adjudication Packets

```json
{"findingId":"LUNA-F003","claim":"A pre-existing symlink at the artifact containment or quarantine destination can redirect content, patch, or manifest writes outside the lineage because the writer does not canonicalize the destination before mkdir or write.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:943-950",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:988-991",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1014-1017",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1037-1040",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1078-1113","specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:194-196"],"counterevidenceSought":["A canonical path check in writeQuarantineFile or quarantineViolations that rejects symlinked parents before every trusted write."],"alternativeExplanation":"The detector canonicalizes target scope, and its tests catch symlinks in the artifact tree, but those checks do not validate the writer's destination tree.","finalSeverity":"P0","confidence":0.99,"downgradeTrigger":"A destination-realpath check that rejects artifact, containment, quarantine, and nested write escapes before any write would invalidate this finding."}
```

## Ruled Out

- Target-path symlink escapes are covered by the existing detector tests at `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1718-1823`; that coverage does not prove trusted quarantine destinations safe.
- The ordinary non-symlink quarantine path is not alleged to escape; the defect requires a pre-existing destination link or equivalent reparse point.

## Traceability Checks

- `spec_code`: fail for NFR-S01. The implementation's detector-side canonicalization is not applied to the quarantine writer's destination path.
- `checklist_evidence`: partial. Existing tests exercise a symlink under the artifact tree and an unwritable quarantine destination, but no symlinked containment/quarantine destination that asserts no external file is created.
- `feature_catalog_code`: pending; the feature-catalog consumer sweep is deferred to iteration 3.
- `playbook_capability`: pending; the manual capability sweep is deferred to iteration 4.

## Next Focus

Traceability: reconcile the current runtime with command YAML callers, phase 007 removal decisions, feature catalog, and packet closure records.

## Assessment

Dimensions addressed: security. A P0 boundary violation is directly evidenced in the trusted writer, while the two correctness P1s remain active. Convergence telemetry is not a stop decision under the configured max-iterations policy.

Review verdict: FAIL
