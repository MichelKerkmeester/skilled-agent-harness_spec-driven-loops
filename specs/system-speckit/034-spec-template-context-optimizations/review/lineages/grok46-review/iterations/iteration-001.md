# Iteration 1: D1 Correctness — Requirement logic, acceptance criteria, and gate integrity

## Focus
Dimension: correctness. Scope: spec.md REQ-001..006, plan.md quality gates, checklist vs tasks completion marks, implementation-summary verification claims, description.json, renderer gating, and the packet's own `validate.sh --strict` gate.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 10
- New findings: P0=0 P1=3 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Packet completion state is internally contradictory, `specs/system-speckit/034-spec-template-context-optimizations/tasks.md:47`, [Evidence: `tasks.md` still has T004 and every Impl Phase / Verification task T010–T053 as `[ ]` (lines 47–80) and frontmatter `completion_pct: 5`; `checklist.md` CHK-011..CHK-019 are `[x]` claiming P0/P1 requirements implemented and `validate.sh --strict` clean; `spec.md:47` Status is Complete. `validate.sh --strict` exit 0 does not reconcile the open task list because EVIDENCE_CITED only inspects already-checked items.]
- **F002**: implementation-summary reports golden-snapshot failures that do not exist, `specs/system-speckit/034-spec-template-context-optimizations/implementation-summary.md:87`, [Evidence: §5 says "`scaffold-golden-snapshots` shows 4 failures — confirmed pre-existing". Observed: `npx vitest run --config mcp-server/vitest.config.ts scripts/tests/scaffold-golden-snapshots.vitest.ts scripts/tests/research-template-gating.vitest.ts` → Test Files 2 passed, Tests 10 passed (6 snapshot + 4 gating). CHK-007's 6/6 claim matches the command; the summary's 4-failure claim does not.]
- **F003**: Status still says uncommitted / awaiting commit after the feat commit landed, `specs/system-speckit/034-spec-template-context-optimizations/spec.md:47`, [Evidence: Status "Complete (uncommitted) … awaiting commit go-ahead"; `git log` shows `c8c4e79139 feat(system-speckit): optimize templates + add validation and budget gates` already on this branch. `plan.md:15` continuity still says `next_safe_action: Resolve Phase 1 consumer question; implement Phase 1` and `completion_pct: 5` (`plan.md:23`). A resume agent would restart implementation that already shipped.]

### P2, Suggestion
- **F004**: REQ-001 still cites a 944-line ungated research template, `specs/system-speckit/034-spec-template-context-optimizations/spec.md:108`, [Evidence: working-tree and HEAD `research.md.tmpl` are 948 lines; L1 render is 175 lines; L3 render is 944 lines. The constant matches L3 rendered size, not source LOC. Directionally the gating claim holds.]
- **F005**: AC_COVERAGE registry copy still says opt-in after default-on, `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:85`, [Evidence: description is "Opt-in advisory scan for acceptance-criteria traceability coverage"; `check-ac-coverage.sh:11` defaults `SPECKIT_AC_COVERAGE` to `true`. Behavior is default-on; the registry sentence is stale.]

## Claim adjudication

```json
{
  "findingId": "F001",
  "claim": "tasks.md still lists implementation and verification work as open while spec.md and checklist.md claim the packet complete.",
  "evidenceRefs": [
    "specs/system-speckit/034-spec-template-context-optimizations/tasks.md:47",
    "specs/system-speckit/034-spec-template-context-optimizations/tasks.md:80",
    "specs/system-speckit/034-spec-template-context-optimizations/checklist.md:111",
    "specs/system-speckit/034-spec-template-context-optimizations/spec.md:47"
  ],
  "counterevidenceSought": "Ran validate.sh --strict (exit 0) and checked whether EVIDENCE_CITED requires tasks.md items to be checked when checklist is complete. It does not; STATUS_CROSS_DOC_CONSISTENCY only compares spec.md vs implementation-summary.md.",
  "alternativeExplanation": "tasks.md could be a historical snapshot left unchecked by design, with checklist as the only completion ledger. Rejected because tasks.md is a Level-2 required canonical doc and still carries live frontmatter completion_pct: 5.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If tasks.md T004 and T010–T053 are marked [x] with evidence, or an explicit note states checklist supersedes tasks.md as the completion ledger, downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "implementation-summary.md §5 claims scaffold-golden-snapshots has 4 failures, but the current vitest run of that file is green.",
  "evidenceRefs": [
    "specs/system-speckit/034-spec-template-context-optimizations/implementation-summary.md:87",
    ".opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:44"
  ],
  "counterevidenceSought": "Re-ran vitest for scaffold-golden-snapshots.vitest.ts and research-template-gating.vitest.ts from the skill root with mcp-server/vitest.config.ts. Result: 10/10 pass. Also confirmed CHK-007 claims 6/6, which matches the snapshot file's six tests.",
  "alternativeExplanation": "The 4 failures could be an older isolated baseline that still fails under a different vitest include path. Rejected for this review: the same config the packet cites (mcp-server/vitest.config.ts include scripts/tests) is green.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If §5 is rewritten to match the green vitest output, or a reproduced command shows 4 failures under the cited config, downgrade or disprove.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F003",
  "claim": "spec.md Status and plan.md continuity still describe uncommitted / not-yet-implemented work after the implementation commit landed.",
  "evidenceRefs": [
    "specs/system-speckit/034-spec-template-context-optimizations/spec.md:47",
    "specs/system-speckit/034-spec-template-context-optimizations/plan.md:15",
    "specs/system-speckit/034-spec-template-context-optimizations/plan.md:23"
  ],
  "counterevidenceSought": "git log -3 --oneline; git status --short on implementation surfaces (templates, rules, memory-search.ts) is clean. Feat commit c8c4e79139 is in history. Latest commit 2f11f68082 is docs-only.",
  "alternativeExplanation": "Uncommitted could mean unpushed to origin. Branch is ahead 1 behind 1, but the feat commit is already local history, so awaiting commit go-ahead is still the wrong next action.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "If Status is rewritten to Complete (committed, awaiting push/merge) and plan.md continuity is refreshed, downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:47, tasks.md:47, implementation-summary.md:87, validate.sh exit 0 | REQ-001 L1=175 confirmed; REQ-002 snapshots green; completion claims contradict tasks.md / plan.md continuity |
| checklist_evidence | partial | hard | checklist.md CHK-007/019 vs tasks.md T010–T053 | Checked CHK items have evidence text; open tasks contradict those checks |

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: correctness
- Novelty justification: All five findings are new. F001–F003 are observed doc/gate contradictions against current git and vitest output. F004–F005 are precision issues that do not fail the functional gates.

## Ruled Out
- Byte-identical / snapshot gate still red: [vitest 10/10 pass under the packet's cited config], [scaffold-golden-snapshots.vitest.ts]
- description.json missing level: [description.json has `"level": "2"`; validate DESCRIPTION_SHAPE passed], [description.json:2]
- REQ-001 L1 collapse missing: [L1 render is 175 lines], [inline-gate-renderer.sh --level 1]

## Dead Ends
- Treating sibling pi-flash-review F001 (red snapshots) as still true: current tree is green; that finding is historical.

## Recommended Next Focus
D2 Security — trust boundaries of the shipped changes: scope-adherence git-diff contract, AC_COVERAGE escape hatch, memory_search budget drop vs shared helper, renderer CLI input handling.

Review verdict: CONDITIONAL
