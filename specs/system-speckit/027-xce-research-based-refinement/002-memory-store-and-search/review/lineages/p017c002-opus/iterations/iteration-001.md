# Iteration 1: Full-packet review (correctness, security, traceability, maintainability)

## Focus

Single-iteration fan-out lineage (`p017c002-opus`, maxIterations=1). All four review
dimensions in one pass over the `002-request-quality-aggregation` packet.

Files under review:
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` (the `assessRequestQuality` change + new constants)
- `.opencode/skills/system-spec-kit/mcp_server/tests/request-quality-aggregation.vitest.ts` (new focused test)
- Packet docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 8
- New findings: P0=0 P1=3 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.80 (first pass, all findings novel)

## Findings

### P0, Blocker

None. The code change is logically sound and has no security surface (pure in-memory
scoring; no I/O, path handling, or untrusted input). Edge cases are guarded:
`assessRequestQuality` returns `gap` on empty input (`confidence-scoring.ts:359-361`),
reads `results[1]` only when `results.length > 1` (`:379-381`), and the `head > 0`
guard on `qualityRatio` (`:375`) prevents a divide-by-zero / NaN.

### P1, Required

- **F001**: Packet completion metadata not reconciled, `graph-metadata.json:3`,
  `implementation-summary.md:26`. `graph-metadata.json` records `Status: planned` and
  lists only `spec.md, plan.md, tasks.md` as Key/Source Docs, while
  `implementation-summary.md` declares `completion_pct: 100` and a finished build. The
  canonical save (`generate-context.js`) that refreshes graph-metadata status and key
  files was not run at completion, so a downstream `/speckit:resume` or memory search
  reads this finished packet as still "planned" with the wrong key files.

- **F002**: Core spec docs are unmodified scaffolds; `spec_code` core protocol has no
  baseline, `spec.md:85-127`, `plan.md:46-57`, `tasks.md:53-77`. `spec.md`,
  `plan.md`, and `tasks.md` retain verbatim template placeholders (`REQ-001
  [Requirement description]`, `T001 Create project structure`, `[What is broken...]`).
  No real requirements, acceptance criteria, or task records exist. The two hard-gated
  core traceability protocols cannot pass: `spec_code` → fail (no normative claims to
  trace the code to); `checklist_evidence` → N/A (no `checklist.md`). The
  implementation-summary is the only real source of truth for a packet marked complete.

- **F003**: Declared 100% complete while the change is not live and a test is red,
  `implementation-summary.md:109`, `implementation-summary.md:117`. The runtime executes
  compiled `dist/`; the source edit is unbuilt, so production search behavior is
  unchanged, and `dist-freshness.vitest.ts` FAILs. This is documented as a deferred
  build step, but the packet is still marked `completion_pct: 100`, so a reader trusting
  the status would wrongly assume the improved request-quality verdict is in effect.

### P2, Suggestion

- **F004**: Slightly imprecise claim in the summary, `implementation-summary.md:61`,
  `confidence-scoring.ts:370-375`. The summary states "weak / gap thresholds are
  unchanged," but the `qualityRatio` that feeds the weak branch
  (`topScore >= LOW_THRESHOLD || qualityRatio >= 0.3`, `:394`) now uses a head-capped
  denominator (`min(N, 5)`) instead of the whole set. The constant `0.3` is unchanged,
  but its operand changed: a weak tail makes the head-capped ratio `>=` the old
  whole-set ratio, so the gap→weak boundary loosens marginally. Behavior is defensible;
  the prose just over-claims "unchanged."

- **F005**: Missing test for the in-band fall-through, `request-quality-aggregation.vitest.ts:36-87`,
  `confidence-scoring.ts:389-395`. No test pins the case where `0.7 <= topScore < 0.8`
  AND `qualityRatio < 0.6` AND `topMargin < 0.15` (two near-equal strong top hits),
  which must fall through to `weak`. Known Limitation #2 (`implementation-summary.md:118`)
  describes this behavior but no assertion locks it, so a future threshold edit could
  silently regress it.

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "graph-metadata.json status and key-file list were not refreshed at completion, so the finished packet reads as 'planned' with stale key files.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation/graph-metadata.json:3",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation/implementation-summary.md:26"
  ],
  "counterevidenceSought": "Checked whether graph-metadata status is auto-derived/absent (the doc says it falls back to implementation-summary presence + checklist completion only when explicit status is ABSENT); here Status is an explicit literal 'planned' while implementation-summary.md is present, so the explicit value is stale, not a fallback. Also confirmed Key/Source Docs omit implementation-summary.md and the changed code files.",
  "alternativeExplanation": "Could be an in-progress save where only the impl-summary continuity block was hand-edited (ADR-004 quick path) without running generate-context.js. That is exactly the gap: the canonical metadata refresh was skipped, so the conflict is real.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If generate-context.js is run to set graph-metadata Status to a completed state and refresh Key Files, downgrade to resolved.",
  "transitions": [ { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" } ]
}
```

```json
{
  "findingId": "F002",
  "claim": "spec.md, plan.md, and tasks.md are unfilled template scaffolds, so the hard-gated spec_code traceability protocol has no normative baseline for a packet marked complete.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation/spec.md:85",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation/tasks.md:53"
  ],
  "counterevidenceSought": "Verified the three docs are verbatim v2.2 templates (placeholder REQ-001/T001/'[What is broken...]', SCAFFOLD_VALIDATION_COUNTS block still present). Confirmed no checklist.md exists in the folder. Checked that implementation-summary.md alone carries real content.",
  "alternativeExplanation": "Phase-child packets in this repo sometimes treat implementation-summary.md as the source of truth and leave spec/plan/tasks thin. But the completion-verification gate requires a reconciled baseline, and a verbatim scaffold provides none, so the protocol still fails.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "If spec.md/tasks.md are populated with the real requirement (top-dominant + margin-aware rule) and acceptance criteria, or the packet is explicitly re-classified as impl-summary-canonical, downgrade to P2.",
  "transitions": [ { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" } ]
}
```

```json
{
  "findingId": "F003",
  "claim": "The packet is marked 100% complete while the source change is unbuilt (runtime runs dist/) and dist-freshness.vitest.ts is failing, so the fix has no production effect.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation/implementation-summary.md:109",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation/implementation-summary.md:117"
  ],
  "counterevidenceSought": "Read the Verification and Known Limitations sections; the not-live state and dist-freshness FAIL are explicitly self-reported and attributed to the no-build write-scope constraint. Looked for a Definition of Done scoping the packet to source+tests-only that would make 'not live' expected — none exists because plan.md is an unfilled scaffold.",
  "alternativeExplanation": "Build-then-commit-dist is a routine separate step in this repo, so source-only completion may be the intended packet boundary. But absent a DoD stating that, marking completion_pct 100 overstates release readiness.",
  "finalSeverity": "P1",
  "confidence": 0.7,
  "downgradeTrigger": "If npm run build is run (dist refreshed, dist-freshness green) OR plan.md records a DoD scoping this packet to source+tests with build tracked in a named follow-up, downgrade to P2.",
  "transitions": [ { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" } ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | spec.md:85-127 | spec.md has no normative claims (verbatim scaffold); code cannot be traced to spec |
| checklist_evidence | n/a | hard | (no checklist.md) | No checklist.md in folder; Level-1 per description.json so not strictly required, but no completion evidence ledger exists |
| feature_catalog_code | n/a | advisory | — | No catalog claim targets this internal scoring helper |
| playbook_capability | n/a | advisory | — | No playbook scenario covers request-quality aggregation |

## Assessment

- New findings ratio: 0.80
- Dimensions addressed: correctness (PASS — no code defects), security (PASS — no
  surface), traceability (3 P1), maintainability (2 P2)
- Novelty justification: first and only iteration; all 5 findings novel. Code is
  PASS-quality; every active finding sits in packet documentation / completion metadata
  / traceability, not in the shipped logic.

## Ruled Out

- **Code correctness P0/P1**: traced all six new test cases against the implementation
  branch logic (top-dominant `>=0.8`, margin-aware `>=0.7 && (ratio>=0.6 || margin>=0.15)`,
  weak/gap net). All consistent; existing `d5-confidence-scoring` and
  `absolute-relevance-calibration` expectations remain satisfiable. No code defect.
- **Security**: pure scoring over internal `ScoredResult` rows; no injection, path,
  env, or persistence surface. Ruled out.

## Dead Ends

- Test execution under this fan-out runtime: `vitest`/`npx` are not on the permission
  allowlist, so the targeted suite could not be re-run here. Relied on a manual trace of
  the branch logic against the test assertions plus the implementation-summary's
  self-reported PASS (102 tests, 6 files).

## Recommended Next Focus

Remediation, not further review: run `generate-context.js` to reconcile graph-metadata
status/key-files (F001), populate spec.md/tasks.md with the real requirement or
re-classify the packet (F002), and build dist + confirm dist-freshness green (F003).

Review verdict: CONDITIONAL
