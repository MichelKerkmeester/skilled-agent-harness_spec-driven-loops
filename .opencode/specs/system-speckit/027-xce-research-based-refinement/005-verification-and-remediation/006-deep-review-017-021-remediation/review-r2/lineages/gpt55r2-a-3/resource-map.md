# Review Resource Map - gpt55r2-a-3

## Source Scope

- Scope file: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md`
- Source `resource-map.md`: not present.

## Evidence Map

| Finding | Primary Files | Evidence Lines |
|---------|---------------|----------------|
| F001 | `handlers/memory-search.ts`, `lib/search/community-search.ts`, `tool-schemas.ts` | `tool-schemas.ts:236`, `memory-search.ts:1166-1219`, `community-search.ts:101-170` |
| F002 | `lib/search/memory-summaries.ts`, `lib/search/pipeline/stage1-candidate-gen.ts` | `memory-summaries.ts:167-175`, `memory-summaries.ts:190-192`, `memory-summaries.ts:210-218`, `stage1-candidate-gen.ts:1301-1357` |
| F003 | `tool-schemas.ts`, `handlers/memory-search.ts`, `tests/handler-memory-search.vitest.ts` | `tool-schemas.ts:336-340`, `memory-search.ts:818-831`, `memory-search.ts:1334-1339`, `handler-memory-search.vitest.ts:225-238` |

## Phase-5 Augmentation

- Novel logic gaps: scoped fallback injection and large-corpus summary retrieval sampling.
- Empty-result case: not applicable; this review found active findings.
