---
title: "Iteration 9: D1 Correctness with adversarial replay — cross-lane ranking determinism"
trigger_phrases: []
---

# Iteration 9: D1 Correctness with adversarial replay — cross-lane ranking determinism

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`
- executor: inline `cli-codex model=gpt-5.6-luna`; nested dispatch was not used

## Focus

This pivot closes the deferred ranking-determinism class and replays all ten
active findings against their source boundaries. The lexical ripgrep lane sorts
by evidence field, match class, relative path and line `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:346-394]`.
The trigger-index lane reduces each document to its best score and sorts by
score, match class and path `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:166-203]`.
The legacy replay's SQL candidate order includes `m.id ASC`
`[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:295-305]`,
and its later score/timestamp sort therefore receives a deterministic input for
equal values `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:337-343]`.

The zvec lane is different by contract: it carries the tool's rank and preserves
that external order `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs:528-579]`,
while the retrieval convention explicitly says that a merged list must not be
described as deterministically ranked end to end `[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:310-319]`.
This is an explicit capability boundary, not an implementation mismatch. The
focused tests cover lexical path ties and zvec rank preservation
`[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:570-585]`
`[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/zvec-lane.vitest.ts:235-245]`.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 23
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 23 listed paths
- Cumulative review count: 133/438 (30.37%; cumulative count follows the lineage's iteration accounting)

## Findings

### P0, Blocker

- None.

### P1, Required

- No new or changed P1 finding. F001, F003, F004, F006 and F007 remain active
  after replay. Their source contracts and previously recorded evidence are
  unchanged: hidden-path omission, missing request authentication, missing
  checklist evidence, count-only forced-depth proof, and lexical-only physical
  containment respectively.

### P2, Advisory

- No new or changed P2 finding. F002, F005, F008, F009 and F010 remain active
  after replay. Their source contracts and previously recorded evidence are
  unchanged: permissive `--limit` parsing, cli-codex example drift,
  prefix-only frontmatter closure, advisor-local payload vocabulary drift, and
  retired plugin documentation residue.

## Ranking adjudication

- **Lexical ranking is deterministic.** `rankMatches` derives each component
  from the parsed match, compares evidence field and class before path and line,
  and does not use ripgrep's emission order `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:346-394]`.
  The wrapper applies that rank after parsing `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:180-210]`.
- **Trigger-index ranking is deterministic.** Phrase postings are reduced by
  best score/class per path, phrase lists are code-unit sorted, and the final
  results use score, class and path `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:166-203]`.
  The focused fixture asserts best-class ordering and path tie breaks
  `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:570-585]`.
- **Legacy replay ordering has an explicit database tie-break.** Candidate rows
  are ordered by exact-query preference, timestamp and `m.id ASC`
  `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:295-305]`.
  The post-score comparator adds score and timestamp but does not introduce a
  different result for equal input rows `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:337-343]`.
- **Zvec rank preservation is intentional.** The parser retains the printed rank
  and normalization returns hits in tool order `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs:405-425,528-579]`.
  The convention explicitly limits the deterministic tuple guarantee to the
  lexical lane and names external zvec ranking as the merge boundary
  `[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:192-202,310-319]`.

The candidate **cross-lane ranking determinism** is ruled out as a defect: the
lexical and index lanes have stable source-derived tie breakers, while the
zvec lane's external ordering is openly specified and exposed through `rank`.
Making the merged result appear deterministic by re-sorting zvec hits would
discard the unreconstructible fusion score, which the contract expressly
forbids `[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:317-319]`.

## Adversarial replay and traceability

- F001 replayed against the free-text recipe and the zvec `--hidden` precedent;
  the mismatch remains a P1 coverage gap `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:28-43]`.
- F002 replayed against the CLI parser; whole-token validation is still absent,
  so malformed suffixes and fractions remain a P2 input gap
  `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:245-261]`.
- F003 replayed against bind gating, `/api/embed`, the request handler and the
  client; token use remains confined to remote-bind admission and is absent at
  request time `[SOURCE: .opencode/bin/hf-model-server.cjs:166-193,827-909,942-955]`
  `[SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:489-500]`.
- F004 replayed against the doctor workflow and packet root; the workflow still
  names `checklist.md#doctor-memory` while the packet evidence remains in
  `tasks.md` and acceptance rows are open `[SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:34-40]`
  `[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/acceptance-criteria.md:33-35,55-60]`.
- F005 replayed against the cli-codex hard rule and example; the example still
  omits the documented stdin closure `[SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:7-10,207-218]`.
- F006 replayed against both forced-depth branches and the count helper; no
  contiguous sequence or state reconciliation is required
  `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:675-683,779-789,827-834]`.
- F007 replayed against root realpath and descendant status checks; the lexical
  path comparison still lacks physical descendant canonicalization
  `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:282-287,307-323,423-450]`
  `[SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:1324-1333]`.
- F008 replayed against the harvest parser; the closing search still accepts a
  prefix collision `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts:93-98]`.
- F009 replayed against local and canonical shared payload vocabularies; the
  extra local producers remain undocumented and no current extra producer was
  found `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:291-299]`.
- F010 replayed against the current plugin inventory, test README, hook index and
  package removal statement; current docs still advertise the retired memory
  kill switch `[SOURCE: .opencode/plugins/README.md:16-20,24-44,90-100]`
  `[SOURCE: .opencode/plugins/tests/README.md:92-95]`
  `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:14-18,361-365]`.

The authoritative validators, tests, graph coverage and continuity writer were
not run because their writes are outside the user-bound lineage. The evidence
pointer remains partial and checklist evidence remains blocked; this iteration
does not claim acceptance criteria completion.

## Iteration handoff

- Active registry: P0=0, P1=5, P2=5, open=10
- Ranking determinism: covered and ruled out as a defect by explicit lane contract
- Next angle: final iteration-10 adversarial closure, max-depth proof and traceability ledger
- Stop policy: continue through iteration 10 even though this pivot produced no new finding

Review verdict: CONDITIONAL
