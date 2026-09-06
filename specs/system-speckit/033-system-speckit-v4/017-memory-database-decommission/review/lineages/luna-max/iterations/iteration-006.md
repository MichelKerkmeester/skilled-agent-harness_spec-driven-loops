# Iteration 6: Parser and input-boundary stress

## Dispatcher

- Target agent: `deep-review`.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Agent definition loaded: yes.
- Execution mode: autonomous inline executor; no nested dispatch.

## Focus

Stress the normalization, frontmatter, corpus-walk, exclusion, and symlink-deduplication boundaries adjacent to the trigger-index reader finding.

## Files Reviewed

- `.opencode/skills/system-spec-kit/scripts/retrieval/lib/normalize.mjs`
- `.opencode/skills/system-spec-kit/scripts/retrieval/lib/frontmatter.mjs`
- `.opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs`
- `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs`

## Scorecard

| Dimension | Result | Evidence posture |
| --- | --- | --- |
| Correctness | conditional | F001 remains at the reader boundary; parser behavior is explicit and tested. |
| Security | pass | Scope, fixture, archive, and symlink boundaries are constrained and covered. |
| Traceability | conditional | The reader/writer contract remains the only unresolved implementation seam. |
| Maintainability | conditional | F001 still lacks a malformed-reader regression test. |

## Findings - New

### P0

None.

### P1

None new. F001 remains open and is narrowed to the post-publication reader contract; F002 and F003 remain packet-state findings.

### P2

None new.

## Findings Existing/Refined

- **F001** reaffirmed without scope expansion. The parser and corpus layers do not explain the silent skip: they produce explicit categories for malformed frontmatter and deterministic path identities, while the reader still accepts a malformed posting after JSON parsing.
- **F002** and **F003** reaffirmed without new evidence.

## Traceability Checks

| Protocol | Result | Reason |
| --- | --- | --- |
| `spec_code` | partial | Parser and corpus contracts are explicit; F001 remains at the reader seam. |
| `checklist_evidence` | fail | F002 and F003 remain unresolved. |
| `parser-boundary` | pass | Malformed frontmatter, aliases, duplicate phrases, token floors, fixture exclusions, and symlink dedupe have direct tests. |
| `index-contract` | fail | F001’s reader-side invariant remains absent. |
| `skill_agent` | not-applicable | No skill-library claim is needed. |
| `agent_cross_runtime` | not-applicable | No cross-runtime agent contract is asserted. |

## Assessment

Dimensions addressed: correctness, security, traceability, maintainability. Normalization declares separate scoring and query floors and caps query tokens [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/normalize.mjs:15-39] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/normalize.mjs:86-113]. The frontmatter reader explicitly distinguishes missing, malformed, wrong-type, alias, duplicate, and usable phrase states [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/frontmatter.mjs:293-343] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/frontmatter.mjs:347-433] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/frontmatter.mjs:466-515]. The corpus walker prunes declared exclusions, handles fixture scope deliberately, resolves real paths, and deduplicates aliases [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:19-31] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:50-70] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:221-245]. Existing tests cover these boundaries, including malformed generation and symlink dedupe [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:208-280] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:285-320] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:393-462].

## Ruled Out

- No separate unsafe-input finding was confirmed in parser or corpus handling; the inputs are categorized or excluded explicitly [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/frontmatter.mjs:306-343] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:98-112].
- No symlink duplication or path-scope bypass was found in the reviewed walk logic or tests [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/corpus.mjs:221-245] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:306-320] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:618-635].
- The token floor and cap are intentional contract surfaces, not unexplained data loss; their reasons are returned to callers and tested [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/normalize.mjs:86-113] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:81-90].

## Recommended Next Focus

Replay the retired tool-prefix and live-residue proof, separating historical evidence and negative guards from live instruction/configuration surfaces.

Review verdict: CONDITIONAL
