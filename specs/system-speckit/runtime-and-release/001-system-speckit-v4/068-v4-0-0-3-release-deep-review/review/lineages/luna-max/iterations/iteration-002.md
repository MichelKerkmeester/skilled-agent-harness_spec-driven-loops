# Iteration 2: Security — commit-message gate input bounds

## Dimension
Security. This pass follows the prior iteration's next focus into the shared commit-message contract validator, its configured attribution prohibition and the callers that enforce it.

## Files Reviewed
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs`
- `.skilled/skills/sk-git/scripts/validate-message.mjs`
- `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`
- `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts`
- `.skilled/scripts/git-hooks/lib/message-contract-gate.sh`
- `.skilled/scripts/git-hooks/commit-msg`
- `.skilled/scripts/git-hooks/pre-push`
- `.skilled/skills/sk-git/assets/commit-message-template.md`
- `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs`
- `.github/workflows/message-contract.yml`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/steer.md`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **Oversized commit messages can hide forbidden trailers from every gate** — `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:427`. `validateCommit` silently slices any message longer than 200,000 characters, then validates only that prefix. A valid subject and body followed by a prohibited `Co-Authored-By:` trailer after the cutoff is therefore accepted. The template explicitly forbids that trailer, and the commit hook, pre-push hook, agent gate and CI all use this shared validator. [SOURCE: `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:426-427`] [SOURCE: `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:523-526`] [SOURCE: `.skilled/skills/sk-git/assets/commit-message-template.md:264-266`] [SOURCE: `.github/workflows/message-contract.yml:61,79`]
   - Finding class: class-of-bug
   - Scope proof: the shared validator documents that every gate uses this module; the commit hook and pre-push workflow call its CLI, and the CI workflow validates the pushed commit range through the same CLI. The cap therefore affects the common enforcement path rather than one adapter.
   - Affected surface hints: ["message-contract.mjs", "commit-msg", "pre-push", "agent gate", "message-contract CI"]
   - Recommendation: reject messages above the supported limit with a validation error instead of validating a truncated prefix.
   - Claim adjudication:
     ```json
     {
       "type": "claim-adjudication",
       "findingId": "F001",
       "claim": "Commit messages longer than 200,000 characters are truncated before validation, so forbidden content after that boundary bypasses every gate that calls validateCommit.",
       "evidenceRefs": [
         ".skilled/skills/sk-git/scripts/lib/message-contract.mjs:426-427",
         ".skilled/skills/sk-git/scripts/lib/message-contract.mjs:523-526",
         ".skilled/skills/sk-git/assets/commit-message-template.md:264-266",
         ".github/workflows/message-contract.yml:61,79"
       ],
       "counterevidenceSought": "Read the shared validator's cap and attribution scan, the template's forbidden attribution rule, the command-line commit and range paths, the commit-msg hook, the pre-push call and CI invocations.",
       "alternativeExplanation": "The cap appears intended to bound regex work. It does not make acceptance safe because the function truncates rather than rejecting the unvalidated suffix.",
       "finalSeverity": "P1",
       "confidence": 0.94,
       "downgradeTrigger": "Downgrade if oversized messages are rejected before validation or every rule is applied to the full original message at all gate entry points."
     }
     ```

### P2 Findings
None.

## Traceability Checks
- `spec_code`: not evaluated in this security pass; planned for the traceability pass.
- `checklist_evidence`: not evaluated in this security pass; planned for the traceability pass.

## Assessment
- Dimensions addressed: security.
- New findings: P0=0, P1=1, P2=0.
- New findings ratio: 1.0. This is one new P1 finding out of one finding reviewed.
- Novelty justification: the truncation boundary creates a distinct bypass of the shared enforcement contract.
- Tests were read but not executed. The finding follows directly from the truncate-before-validation control flow.

## Ruled Out
1. The shared rule source is not duplicated between the commit hook and CI: both route through `validate-message.mjs` and the same template-backed validator. [SOURCE: `.skilled/scripts/git-hooks/commit-msg:76-79`] [SOURCE: `.github/workflows/message-contract.yml:61,79`]
2. The pre-tool parser's documented fail-open behavior for shell syntax it cannot parse is separate from this defect; the committed-message hooks and CI are intended backstops but share the truncating validator. [SOURCE: `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:11-14`]

## Edge Cases
- The concrete bypass requires a message exceeding the 200,000-character cap. The message contract does not set a whole-message maximum; the configured 100-character limit applies to the subject.
- The rule failure is shared by commit-time, pre-push, agent and CI validation, so an independent downstream gate does not catch the truncated suffix.

## Confirmed-Clean Surfaces
- Contract resolution uses the repository's template block, and malformed declared contracts fail closed in the shared validator.
- The reviewed commit and PR CI paths use the same checked-in validator.

## Next Focus
- Dimension: traceability.
- Focus area: compare the phase's declared review requirements and checked setup evidence with the release-range workflow and actual lineage artifacts.
- Reason: the next pass must verify spec-to-implementation alignment and checklist claims.
- Required evidence: packet requirements, workflow bindings, run records and cited implementation surfaces.

## Sources
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:12-13,29-31,420-427,523-526,572-586`
- `.skilled/skills/sk-git/scripts/validate-message.mjs:135-171`
- `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:11-14,298-352`
- `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts:7-12,17-43`
- `.skilled/scripts/git-hooks/lib/message-contract-gate.sh:38-56`
- `.skilled/scripts/git-hooks/commit-msg:43-79`
- `.skilled/scripts/git-hooks/pre-push:247-249`
- `.skilled/skills/sk-git/assets/commit-message-template.md:177-210,264-266`
- `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:360-418`
- `.github/workflows/message-contract.yml:41-93`
- `specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/steer.md`

Review verdict: CONDITIONAL
