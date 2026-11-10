---
title: "Iteration 5: D1 Correctness — forced-depth proof and containment boundary"
trigger_phrases: []
---

# Iteration 5: D1 Correctness — forced-depth proof and containment boundary

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

## Focus

Primary dimension: correctness. This pass follows the forced-depth max-iterations proof from filename discovery through stop-policy validation, then checks the adjacent artifact containment boundary for physical-path escapes. It also re-reads the inline execution directive and executor audit path to distinguish a real runtime gap from a documentation or test-only concern.

## Scorecard

- Dimensions covered: correctness, security
- Files reviewed: 8
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 8 listed paths

## Findings

### P0, Blocker

- None.

### P1, Required

- **F006 — Forced-depth completion accepts a gapped iteration filename set because it checks only the count.** `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:675-683]` `countIterationFiles` counts every filename matching `iteration-\\d+\\.md` but does not verify that the numeric set is exactly `1..N`. `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:827-834]` When a lineage directory is present, `findMaxIterationsPolicyViolation` compares only that count with `lineage.iterations` and checks the synthesis stop reason; it does not cross-check the state-record iteration numbers. `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:779-789]` The artifact fallback has the same count-only behavior. A directory containing `iteration-001.md` through `iteration-009.md` plus `iteration-011.md`, with a max-iterations synthesis event, can therefore satisfy a ten-iteration cap while omitting iteration 10. This is a confirmed validation weakness from source inspection; the exact forged directory is an inferred boundary case that a focused regression fixture would confirm.
  - Recommendation: parse iteration numbers, require the exact contiguous set `1..lineage.iterations`, reject duplicates/out-of-range names, and reconcile those numbers with unique `type:iteration` records before accepting forced-depth completion.

- **F007 — Post-dispatch write containment can be bypassed through a symlink beneath the artifact directory.** `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:282-287]` `isInsideArtifact` makes a lexical repo-relative prefix decision. `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:307-323]` `realpath` is applied to the artifact root during scope setup, but not to each reported path or each path component beneath it. `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:423-450]` Detection then relies on Git's dirty-path names, so a write through an in-artifact symlink to an external target can leave the symlink path lexically inside the allowed subtree and leave the external target absent from Git status. The review-side preflight repeats the lexical pattern with `resolve(repoRoot, candidate)` `[SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:1324-1333]`. This is a confirmed structural gap in the post-hoc guard; no live escape was attempted because the review boundary forbids writes outside the lineage.
  - Recommendation: reject symlink components in the artifact tree or canonicalize every written path/parent and require its physical path to remain under the physical artifact root; add a regression case for a symlink target outside the worktree and retain a preventive sandbox where available.

## Claim adjudication

```json
[
  {
    "findingId": "F006",
    "claim": "Forced-depth validation can certify a non-contiguous iteration filename set as complete.",
    "evidenceRefs": [
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:675-683",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:779-789",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:827-834"
    ],
    "counterevidenceSought": "Followed both the directory-backed and artifact-fallback completion branches; neither validates numeric contiguity or state-record agreement.",
    "alternativeExplanation": "The producer normally emits sequential files. That does not make a count-only policy gate equivalent to proving every requested iteration ran.",
    "finalSeverity": "P1",
    "confidence": 0.94,
    "downgradeTrigger": "If the final gate independently rejects sequence gaps and the helper is shown to be advisory-only, downgrade to P2 documentation/test debt.",
    "transitions": [
      { "iteration": 5, "from": null, "to": "P1", "reason": "Forced-depth completion proof is count-only and can accept a missing in-range iteration." }
    ]
  },
  {
    "findingId": "F007",
    "claim": "The artifact write boundary is lexical and does not detect writes through a symlink below the artifact root.",
    "evidenceRefs": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:282-287",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:307-323",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:423-450",
      ".opencode/commands/deep/assets/deep-review-auto.yaml:1324-1333"
    ],
    "counterevidenceSought": "Checked root realpath handling, Git-status detection, and the YAML preflight. They canonicalize the root but not every descendant path.",
    "alternativeExplanation": "A provider sandbox may independently deny the external write. The shared post-dispatch guard still advertises a structural boundary and cannot rely on an executor-specific preventive control for every kind.",
    "finalSeverity": "P1",
    "confidence": 0.88,
    "downgradeTrigger": "If every supported executor's preventive sandbox is proven to resolve symlink targets before writes, or the guard is explicitly advisory rather than containment enforcement, reassess severity.",
    "transitions": [
      { "iteration": 5, "from": null, "to": "P1", "reason": "Per-path canonicalization is absent from the structural containment path." }
    ]
  }
]
```

## Search and ruled-out checks

- The executor audit path closes child stdin after optional input `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1169-1226]`, and the fan-out prompt places the inline/no-nested-dispatch directive before the skill instruction `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1234-1251]`; no separate nested-dispatch or stdin-liveness finding was opened.
- The prompt regression contract preserves the directive for CLI lineages and the write-containment sentence for both CLI and native lineages `[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts:50-87]`; this is a coverage confirmation, not proof that physical-path containment is complete.
- The executor capability matrix rejects unsupported fields before command construction `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:58-100]`; no fan-out override validation gap was supported in this slice.
- The script interface contract explicitly states that workflow-facing scripts emit JSON and map failures to exit codes `[SOURCE: .opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md:31-60]`; no new stdout/exit-status finding was opened.

## Traceability checks

- `spec_code`: partial. The YAML and shared guard describe a contained, forced-depth lineage, but the implementation checks cardinality rather than sequence and uses lexical rather than physical descendant paths (F006, F007).
- `checklist_evidence`: blocked. No authoritative validator or checklist gate was run under the explicit lineage-only write boundary.

## Adversarial self-check

- Hunter: traced both max-iterations completion branches, the directory count helper, Git-status containment, root realpath handling, YAML preflight, and executor prompt/audit contracts.
- Skeptic: normal producers emit sequential files and executor sandboxes may block some symlink escapes; those facts reduce exploit frequency but do not make the shared validation and containment logic proof-complete.
- Referee: F006 and F007 are distinct P1s: one is forced-depth evidence integrity, the other is physical write-boundary enforcement. Existing F001, F003, and F004 remain active P1s; F002 and F005 remain P2.

## Next dimension

D2 Security — preserved skill-advisor, embedding, IPC and trust-boundary surfaces; continue the forced-depth loop despite convergence telemetry.

Review verdict: CONDITIONAL
