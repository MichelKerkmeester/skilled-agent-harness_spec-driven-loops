# Deep-Review Iteration 2 / 10 — Security

## Dimension
Security

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:1-700` — v2 enforcement validator, input validation, env var parsing
- `.opencode/skills/deep-review/scripts/reduce-state.cjs:1-1657` — JSONL parsing, registry serialization, dashboard rendering
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1-1377` — YAML workflow interpolation patterns
- `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:1-751` — graph node upsert, label handling
- `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:1-191` — graph upsert validation, kind allowlist
- `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts:1-92` — graph vocabulary test fixtures

## Findings by Severity

### P2 (Suggestions)

**F004**: evidenceRefs strings lack path traversal sanitization — `post-dispatch-validate.ts:255` / `reduce-state.cjs:1087`

The validator checks that `evidenceRefs` is a non-empty string array (`post-dispatch-validate.ts:255`) but does not validate that individual strings exclude path traversal sequences like `../`. While these strings are currently only used for citation in dashboard rendering (`reduce-state.cjs:1087`) and not as filesystem paths, the lack of sanitization creates future risk if the codebase evolves to use evidenceRefs for file operations. Recommend either (a) adding path traversal validation to evidenceRefs entries, or (b) documenting in the state format reference that evidenceRefs are display-only and must never be used as filesystem paths.

**Evidence**: `post-dispatch-validate.ts:255` validates `isNonEmptyStringArray(action.evidenceRefs)` without content checks; `reduce-state.cjs:1087` renders as `evidence=${entry.evidenceRefs.join(', ')}` in markdown dashboard.

## Traceability Checks

### spec_code
The v2 state format reference (`.opencode/skills/deep-review/references/state_format.md`) documents evidenceRefs as a string array for citation but does not specify security constraints or path traversal restrictions. The security surface is partially documented but lacks explicit sanitization requirements.

### checklist_evidence
The Phase B test fixtures (`.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-*.vitest.ts`) include v2 enforcement tests but do not cover evidenceRefs content validation or path traversal edge cases. The graph vocabulary fixtures (`review-depth-graph.vitest.ts`) test node kind allowlist validation but not label content sanitization.

## Verdict
PASS

## Next Dimension
traceability
