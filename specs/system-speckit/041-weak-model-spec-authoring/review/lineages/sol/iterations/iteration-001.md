# Iteration 001: Correctness

## Dimension
Correctness. The operator focus was addressed by comparing phase 010 containment and the phase 003/010 placeholder contract with the shipped scaffold, validator, shell rule and their tests. I also inspected the phase 017 Draft repair and phase 022 scorer/provisioning producers for follow-up passes.

## Files Reviewed
- specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/spec.md:139
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1138
- .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-containment.vitest.ts:118
- .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:814
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:74
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1281
- .skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:169
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:536
- .skilled/skills/sk-git/scripts/worktree-naming.sh:622

## Findings by Severity

### P0 Findings
None.

### P1 Findings

1. **SOL-001: Symlinked track writes a new packet outside specs.** [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1138] Phase 010 requires rejection before any mkdir when a track resolves outside specs [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/spec.md:139]. The implementation validates only the raw text and then creates the directory through the symlink [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1286]. The shipped test positively asserts that a symlink to an outside directory receives the packet [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-containment.vitest.ts:118]. Case: create with --track linked where specs/linked points outside specs. Impact: the containment promise is false and writes escape the packet root. Fix: resolve and check the track target before mkdir, then revise the test.

Claim adjudication:
```json
{"id":"SOL-001","claim":"The shipped create path accepts a track that resolves outside specs despite phase 010 requiring rejection.","evidenceRefs":["specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/spec.md:139",".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1138",".skilled/skills/system-spec-kit/runtime/cli/tests/create-track-containment.vitest.ts:118"],"counterevidenceSought":"Looked for a later resolved-path containment guard before packet creation; the positive symlink test confirms the opposite behavior.","alternativeExplanation":"The implementation intentionally allows symlinked tracks for another repository, but that choice conflicts with the phase requirement.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A documented amendment to the phase requirement explicitly exempts symlinked tracks."}
```

2. **SOL-002: Mixed fence markers hide a later unfilled value token.** [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:814] The TypeScript and shell scanners toggle fence state on either delimiter [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:74]. A read-only helper probe over tilde-open, literal backtick-fence line, tilde-close and a prose token returned no row; the same token alone returned `1 token`. This violates the phase 003 token gate for a Complete packet. Fix: close a fence only with the opening delimiter and enough markers.

Claim adjudication:
```json
{"id":"SOL-002","claim":"The token-gate scanner misses a bare value token after a valid tilde fence containing a literal backtick fence line.","evidenceRefs":[".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:814",".skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:74"],"counterevidenceSought":"Checked the shell helper on the mixed-fence sequence and a single-token control; the former returned no row and the latter returned 1 token.","alternativeExplanation":"If the doc grammar forbade mixed fence text, the case would be invalid, but the templates and validator claim general Markdown fenced-code handling.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A documented, enforced spec-doc grammar bans backtick delimiter text inside tilde fences."}
```

### P2 Findings
None.

## Traceability Checks
- spec_code: fail for phase 010 track containment; partial for the broader 22-phase packet.
- checklist_evidence: fail for the phase 010 AC-001 Met row, which tests traversal but the shipped test separately authorizes a symlink escape.
- resource-map coverage: skipped because the packet has no root resource-map.md.

## SCOPE VIOLATIONS
- The workflow's packet-keyed graph upsert could write outside this assigned lineage. I skipped it and used direct source reads and a read-only helper probe. No reviewed source was modified.

## Verdict
Two required correctness fixes remain.

## Next Dimension
Security: path trust boundaries and write surfaces in create, repair and provisioning.

Review verdict: CONDITIONAL
