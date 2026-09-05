# Iteration 3 - traceability: packet metadata and completion state

## Dispatcher

- Execution mode: AUTONOMOUS inline fan-out leaf; no nested executor was dispatched.
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Target: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` (`spec-folder`)
- Scope: target packet metadata and bounded content-changed set in `scratch/review-scope.txt` (partition 3 of 10, lines 85-126).

## Focus

Traceability between the packet's declared level/status, execution posture, generated description and graph metadata, acceptance evidence, task checklist, and the actual post-move tree. The review also checked the deep-review contract and state artifacts that define how these claims are recorded.

## Files Reviewed

- `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`
- `description.json`, `graph-metadata.json`
- `.opencode/skills/system-deep-loop/deep-review/SKILL.md`, `.opencode/skills/system-deep-loop/deep-review/assets/deep-review-config.json`, `.opencode/skills/system-deep-loop/deep-review/assets/deep-review-strategy.md`, `.opencode/skills/system-deep-loop/deep-review/references/convergence/convergence.md`, `.opencode/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md`, `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`, `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md`
- `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json`, `.opencode/skills/system-deep-loop/shared/synthesis/resource-map.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs`
- `.opencode/skills/system-spec-kit/ARCHITECTURE.md`, `.opencode/skills/system-spec-kit/README.md`, `.opencode/skills/system-spec-kit/SKILL.md`, `.opencode/skills/system-spec-kit/assets/complexity-decision-matrix.md`, `.opencode/skills/system-spec-kit/assets/template-mapping.md`, `.opencode/skills/system-spec-kit/config/README.md`

## Traceability Evidence

- `spec.md` declares Level 3 and Complete in its metadata table (`spec.md:18-32`), while its frontmatter and `<!-- SPECKIT_LEVEL: 2 -->` marker remain Level 2 and its body still describes the move as planned rather than started (`spec.md:1-16`, `47-65`, `80-83`).
- `plan.md` retains the planning-only contract and an unchecked Definition of Done (`plan.md:31-48`), while `tasks.md` marks every task, completion criterion, and verification checkbox complete (`tasks.md:34-70`, `98-169`).
- `acceptance-criteria.md` still says `Status: Planned` (`acceptance-criteria.md:45-48`) but marks all four acceptance criteria Met and states that the move executed, including a 63-test failure remainder (`acceptance-criteria.md:58-63`, `90`). `implementation-summary.md` likewise reports the move as completed and records the actual post-move paths (`implementation-summary.md:45-68`, `208-231`).
- `description.json` remains Level 2 with the old sibling-package description and an early `lastUpdated` timestamp (`description.json:2-4`, `21`); `graph-metadata.json` reports status complete but its causal summary still names `scripts/` as a sibling workspace and includes the absent `runtime/cli/package.json` among derived key files (`graph-metadata.json:42-63`, `211-224`).
- The four source-document hashes stored in `graph-metadata.json` do match the current four documents, so the defect is semantic metadata/status drift rather than a stale source fingerprint. The generated metadata therefore certifies the wrong level/status narrative while appearing internally fingerprinted.

## Finding Evidence

Finding ID F004, severity P1: packet metadata and completion documents disagree about level, status, and whether the move was planned or completed. The disagreement is directly observable across `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`. This can cause routing, completion verification, and handoff consumers to use conflicting packet state even though the source-document hashes are current.

## Typed Claim-Adjudication

```json
{
  "findingId": "F004",
  "claim": "Packet metadata and completion documents disagree about level, status, and whether the move was planned or completed.",
  "evidenceRefs": [
    "spec.md:1-32",
    "plan.md:31-48",
    "tasks.md:34-70",
    "acceptance-criteria.md:45-63",
    "implementation-summary.md:45-68",
    "description.json:2-21",
    "graph-metadata.json:42-63,211-229"
  ],
  "counterevidenceSought": [
    "a later packet-owned metadata refresh that changes the level/status fields coherently",
    "a documented rule that intentionally preserves Level 2 frontmatter and Planned acceptance status after execution"
  ],
  "alternativeExplanation": "The execution may have been intentionally performed under an operator override while the planning packet remains a Level 2 historical record, but no explicit dual-state contract explains why acceptance, implementation, description, graph, and frontmatter states diverge.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "A documented metadata schema proving that these fields are independent and a synchronized refresh of all consumer-facing status/level projections."
}
```

## Traceability Checks

- `spec_code`: fail remains active because the missing nested workspace manifest invalidates a declared executable contract.
- `checklist_evidence`: fail for F004; completion evidence is present but contradictory across packet-owned documents and generated metadata.
- `feature_catalog_code`: not applicable to this pass.
- `playbook_capability`: partial; the packet documents the intended move and reports execution, but its handoff and metadata do not form one consistent state machine.

## Confirmed-Clean Surfaces

- The stored graph metadata source-document hashes match the current four source documents; this rules out a simple hash freshness explanation for the semantic drift.
- The target-layout rationale and the implementation summary both identify `runtime/cli/`, so the contradiction is in state/metadata claims rather than the selected destination name.

## Ruled Out

- A mere source-fingerprint mismatch was ruled out by independently hashing all four source documents and comparing them with `graph-metadata.json:225-229`.
- The metadata drift is not explained by an absent target-layout decision; the decision is present in the packet and in the implementation summary.

## Assessment

Dimensions addressed: traceability, completion-state consistency, and review protocol evidence. F004 is an active P1. No source or packet files were modified.

## Recommended Next Focus

Residual path references and test/build configuration: inspect every changed producer and consumer for old `scripts/`, `memory/`, and retired test-root paths, with special attention to root Vitest include patterns and executable smoke commands.

Review verdict: FAIL
