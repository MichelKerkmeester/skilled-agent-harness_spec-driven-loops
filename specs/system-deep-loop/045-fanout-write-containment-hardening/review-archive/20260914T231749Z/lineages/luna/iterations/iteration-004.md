# Deep Review Iteration 004

## Focus

Maintainability and operational durability across repeated quarantine passes and boundary-test coverage.

## Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1050-1117`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1625-1970`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381-3436`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:130,194-196`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:120-123`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:63-70`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/luna/iterations/iteration-001.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/luna/iterations/iteration-002.md`
- `specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/luna/iterations/iteration-003.md`

## Findings

### P0

- **LUNA-F003**: Quarantine destinations are not canonicalized before trusted writes — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:943` — carried from iteration 2; the writer still has no destination boundary check.

### P1

- **LUNA-F001**: Pre-existing untracked deletions disappear from the baseline diff — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:823` — carried from iteration 1.
- **LUNA-F002**: Failed or incomplete lanes skip containment entirely — `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3381` — carried from iteration 1.
- **LUNA-F004**: Command caller migration still contains removed worktree assumptions and raw state writes — `.opencode/commands/deep/assets/deep-review-auto.yaml:1307` — carried from iteration 3.
- **LUNA-F005**: Canonical packet records disagree about isolation state — `specs/system-deep-loop/045-fanout-write-containment-hardening/goal.md:62` — carried from iteration 3.
- **LUNA-F006**: Churn threshold rationale contradicts executable defaults — `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:192` — carried from iteration 3.
- **LUNA-F007**: Quarantine evidence is a mutable single snapshot across retries — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1058` — every pass writes the same containment/quarantine paths and the source explicitly says a later pass replaces the manifest and named files, so a retry can erase the only durable evidence of an earlier out-of-scope write.

### P2

- **LUNA-F008**: Boundary regression tests omit the destination and failure seams — `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1714` — the reviewed suite covers target-side symlinks, ordinary quarantine records, and an unwritable destination, but has no regression case for a symlinked trusted destination, baseline-only untracked deletion, or a failed lane reaching containment.

## Claim Adjudication Packets

```json
{"findingId":"LUNA-F007","claim":"quarantineViolations always uses one fixed containment/quarantine directory and fixed relative content and patch paths, while the implementation documents that a later pass replaces the manifest and files, so repeated attempts do not retain immutable evidence per pass.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:988-991",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1014-1017",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1037-1040",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1050-1059",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1078-1113"],"counterevidenceSought":["An attempt- or iteration-keyed quarantine directory, append-only manifest, or other immutable retention mechanism in the caller or writer."],"alternativeExplanation":"A single latest snapshot may be sufficient for a one-shot lane, but retries and repeated containment sweeps are explicitly part of the runner lifecycle and overwrite the same paths.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"An immutable per-attempt retention scheme or an explicit contract proving earlier quarantine evidence is stored elsewhere would invalidate this finding."}
```

## Ruled Out

- The existing size-bound behavior is represented by tests around `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1903-1921`; this pass does not promote it to a new finding.
- The ordinary quarantine success path is exercised at `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1865-1901`; the missing cases are the destination boundary and repeated-pass identity.

## Traceability Checks

- `spec_code`: partial. The packet specifies quarantine evidence and symlink safety, but does not state whether repeated attempts must retain immutable historical records.
- `checklist_evidence`: fail for the newly identified safety boundaries; the current acceptance evidence does not test destination symlinks, baseline-only untracked deletion, failure-path containment, or repeated quarantine retention.
- `feature_catalog_code`: pass; the feature entry remains a shared-checkout description.
- `playbook_capability`: pass; the playbook still describes the shared-checkout preservation capability.
- `skill_agent`: notApplicable; the target is a spec folder.
- `agent_cross_runtime`: notApplicable; this lineage is inline cli-codex.

## Next Focus

Cross-dimension stabilization and replay: re-check every active finding against current bytes, rule out false positives, and leave convergence as telemetry while reaching the five-pass cap.

## Assessment

Dimensions addressed: maintainability. One new P1 retention defect and one P2 test gap are recorded; the P0 and five earlier P1s remain active. No early synthesis is permitted.

Review verdict: FAIL
