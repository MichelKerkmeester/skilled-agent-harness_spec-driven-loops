# Iteration 002: Security

## Dimension
Security. The operator focus was addressed through the write boundaries shipped in phases 010, 017, 021 and 022: scaffold paths, Draft repair, changed-packet CI output and private command provisioning. The packet's other phases were reviewed through their phase records; this pass inspected the security-sensitive producers.

## Files Reviewed
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1240
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2103
- .skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:181
- .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:653
- .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:271
- .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1568
- .github/workflows/changed-packet-validation.yml:117
- .skilled/skills/sk-git/scripts/worktree-naming.sh:622
- specs/system-speckit/054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata/spec.md:118

## Findings by Severity

### P0 Findings
None.

### P1 Findings

1. **SOL-003: Existing symlink at an explicit scaffold target bypasses repo containment.** [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1240] The resolver checks the real parent and then appends the requested basename; it does not resolve an existing final-component symlink. The later mkdir and touch follow that symlink [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2103]. The renderer's destination guard compares against the already redirected destination [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:181]. Case: `--path specs/linked` with `specs/linked` pointing outside the repository. Impact: the repo-relative containment statement in create.sh is false and packet files can land outside the repository. The full scaffold was not executed because that would write beyond this lineage. Fix: check the existing target's real path before any write and add a symlink case.

Claim adjudication:
```json
{"id":"SOL-003","claim":"An existing symlink at the final --path component allows a repo-relative scaffold to write outside the repository.","evidenceRefs":[".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1240",".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2103",".skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:181"],"counterevidenceSought":"Searched for a later realpath/lstat check on FEATURE_DIR and for a symlink --path test; neither was found in the create path or CLI tests.","alternativeExplanation":"The hidden --path option intentionally permits an absolute /tmp target, but the repo-relative branch explicitly promises containment and gives no symlink exception.","finalSeverity":"P1","confidence":"high from code path; dynamic scaffold not run under lineage-only write boundary","downgradeTrigger":"A later pre-write final-component containment guard is identified in the invoked path."}
```

### P2 Findings
None.

## Traceability Checks
- spec_code: partial. The explicit path containment statement in the scaffold source conflicts with the actual final-component behavior; no phase AC specifically exercises that hidden option.
- checklist_evidence: partial. Phase 017 auto-repair claims were checked against the realpath and symlink refusal paths, but not executed in a disposable packet because writes outside this lineage are barred.
- Security boundaries ruled out by direct read: repair-derived checks lexical and real packet paths before writing [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:653], and the CI workflow escapes annotation properties and brackets raw output with stop-commands [SOURCE: .github/workflows/changed-packet-validation.yml:117]. No broad security clearance follows from these narrow checks.
- The private local command link only reads declared ignore patterns and skips existing worktree paths [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:622]. I found no new exploit case in that reviewed branch.

## Verdict
One additional required containment fix remains. The existing SOL-001 and SOL-002 findings remain active.

## Next Dimension
Traceability and maintainability: compare all phase records, templates, card, validator and advisor behavior against their claims.

Review verdict: CONDITIONAL
