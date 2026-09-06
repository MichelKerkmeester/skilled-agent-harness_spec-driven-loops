# Iteration 002: Security, Path Containment And Hook Selection

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: verify.

## Files Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts:23-92`
- `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:87-105`
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:61-89`
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:101-111`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js:232-253`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-subfolder-resolution.js:968-999`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/generate-description-identity-safety.vitest.ts:1-85`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/continuity-freshness.vitest.ts:111-125`

## Findings - New
### P1 Findings
1. **Security replay is not independently observed in this lineage** -- `.opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts:61-90` -- `sanitizePath` uses canonical bases and `path.relative`, while `generate-description.ts` uses realpath plus a separator-aware prefix check. The source supports containment, but the packet's completion claim relies on test and hook replay that this detached review does not execute.
- Finding class: matrix/evidence
- Scope proof: Direct comparison of the shared sanitizer, description generator boundary and the existing null-byte, outside-root and symlink regression tests.
- Affected surface hints: ["path traversal", "symlink containment", "description identity"]
- Claim adjudication: {"type":"claim-adjudication","claim":"Relocated path handling preserves containment","evidenceRefs":[".opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts:61-90",".opencode/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:90-105"],"counterevidenceSought":"Read the direct path tests and hook resolver; no contradictory source branch found.","alternativeExplanation":"The recorded command suite may already pass in the implementation session, but that result is not replayed here.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"An authorized replay records passing boundary tests and the packet evidence is refreshed."}

### P2 Findings
1. **Containment logic is duplicated at two trust seams** -- `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:90-105` -- `generate-description` maintains a local realpath prefix check while `path-utils.ts` maintains a canonical relative containment check. Both are boundary-sensitive and can drift in future path changes.
- Finding class: class-of-bug
- Scope proof: Direct comparison of both implementations and their separate test consumers.
- Affected surface hints: ["path-utils", "generate-description", "symlink regression tests"]

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `session-stop.ts:71-76` | The four candidate paths now target `runtime/cli/dist/continuity`; source shape matches the move. |
| checklist_evidence | partial | hard | `test-scripts-modules.js:232-253` | Security cases are represented, but not replayed in this lineage. |

## Integration Evidence
- Production autosave ignores the test-only override outside test mode at `session-stop.ts:61-70`, then checks candidate readability before returning a path at lines 79-89.
- The continuity CLI documents explicit CLI target precedence at `generate-context.ts:108-111`.

## Edge Cases
- `sanitizePath` canonicalizes existing paths and falls back to canonical parents for not-yet-created leaves at `path-utils.ts:36-52`.
- Symlink escape is explicitly tested in `test-subfolder-resolution.js:968-999`.

## Confirmed-Clean Surfaces
- No direct source evidence of an auth or credential exposure was found in the reviewed path-handling and hook-selection files.
- Candidate selection does not accept a production environment override.

## Ruled Out
- Prefix bypass in description identity check: mitigated by `realBase + path.sep` at `generate-description.ts:102-104`.
- Null-byte omission in the shared sanitizer: ruled out by `path-utils.ts:30-34` and its harness references.

## Next Focus
- dimension: traceability
- focus area: packet truth, acceptance rows, generated metadata and current-state claims
- reason: source security posture is supported, while packet completion and generated identity must be reconciled
- rotation status: new angle
- blocked/productive carry-forward: direct source review productive; runtime replay unavailable
- required evidence: spec, plan, tasks, acceptance criteria, implementation summary, description and graph metadata
- recovery note: none

Review verdict: CONDITIONAL
