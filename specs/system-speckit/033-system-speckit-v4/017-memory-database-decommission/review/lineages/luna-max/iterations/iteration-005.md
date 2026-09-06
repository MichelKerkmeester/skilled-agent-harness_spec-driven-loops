# Iteration 5: Trigger-index reader contract

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.

## Focus

Determine whether the committed trigger-index reader fails closed for a structurally corrupt or stale-but-readable index, as required for a replacement of the old Gate 1 retrieval path.

## Files Reviewed

- `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs`
- `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs`
- `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts`
- `.opencode/skills/system-spec-kit/README.md`
- `.opencode/specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/implementation-summary.md`
- `.opencode/specs/system-speckit/049-memory-decommission/goal.md`

## Scorecard

| Dimension | Result | Evidence posture |
| --- | --- | --- |
| Correctness | fail | Reader validation is weaker than the writer contract and silently skips malformed postings. |
| Security | conditional | A stale index can suppress retrieval, but no privilege or data-exfiltration path is shown. |
| Traceability | conditional | The implementation summary describes a validated artifact without a matching reader invariant. |
| Maintainability | fail | Tests cover normal lookup and scope behavior but not malformed posting/schema/manifest reads. |

## Findings - New

### P0

None.

### P1

- **F001** The committed trigger-index reader fails open on a structurally invalid but parseable index. `loadIndex` checks only that JSON is an object with a `phrases` object and a `paths` array, then returns schema and manifest values without validating them [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-89]. During lookup, a non-array posting is silently skipped and an out-of-range path id is silently skipped, so a corrupted posting can produce incomplete or empty results [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:157-178]. The generator’s own read-back validator requires schema version, manifest hash, normalization, path/phrase counts, non-empty postings, and in-range integer ids [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403]. The documented Gate 1 contract says an unreadable index is an error and that a missing or truncated index must be regenerated [SOURCE: .opencode/skills/system-spec-kit/README.md:487-496], while the lookup tests cover normal scoring, substring, token floor, and scope boundaries but no malformed reader input [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:552-635].

#### F001 claim-adjudication packet

- findingId: `F001`
- claim: A parseable but invalid committed index can be accepted by the reader and treated as a clean miss or incomplete result rather than an error requiring regeneration.
- evidenceRefs: `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:71-89`; `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:157-178`; `.opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403`.
- counterevidenceSought: The generator validator and all existing lookup tests were checked for a shared reader-side schema/manifest/posting validator or malformed-index assertion.
- alternativeExplanation: The committed artifact may be considered immutable and only generator-produced values may be trusted, making reader-side checks intentionally minimal.
- finalSeverity: `P1`
- confidence: `0.92`
- downgradeTrigger: Downgrade to P2 if the reader validates the same schema, manifest, and posting invariants or the release contract explicitly guarantees integrity before every read.

## Findings Existing/Refined

- **F002** and **F003** remain open and are unrelated to the reader implementation; they concern packet closure and research-fold evidence.

## Traceability Checks

| Protocol | Result | Reason |
| --- | --- | --- |
| `spec_code` | fail | The implementation summary claims a validated artifact, but the reader accepts weaker invariants. |
| `checklist_evidence` | fail | F002 and F003 remain open in the target packet. |
| `index-contract` | fail | Writer validation is not mirrored by the read path. |
| `test-coverage` | fail | No malformed reader fixture covers the silent skip behavior. |
| `skill_agent` | not-applicable | No skill-library claim is needed. |
| `agent_cross_runtime` | not-applicable | No cross-runtime agent contract is asserted. |

## Assessment

Dimensions addressed: correctness, security, traceability, maintainability. This is a source-confirmed fail-open seam. The issue is not that the generator emits malformed output; its validator is strong. The issue is that a readable file can become stale or malformed after publication and the reader has no contract-level defense against silently returning too few candidates.

## Ruled Out

- No P0 security consequence was found: the observed behavior suppresses retrieval results rather than granting access or exposing stored content [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:157-178].
- The normal valid-artifact lookup contract is covered for scoring, mid-word substrings, token filtering, and folder scoping [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:570-635].
- The writer-side post-publication validation is not itself defective on the inspected paths [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs:369-403].

## Recommended Next Focus

Stress parser and input-boundary behavior around frontmatter, path identity, schema values, and the fail-closed guarantee without changing the target files.

Review verdict: CONDITIONAL
