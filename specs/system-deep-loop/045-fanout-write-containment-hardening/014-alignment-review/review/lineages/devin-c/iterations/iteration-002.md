# Iteration 2: Security — General architecture write containment

## Focus

Dimension: security. Surface: general architecture (packet scope item 6) — shared-checkout containment, fan-out runner, merge semantics, quarantine layout, ledger fencing, path handling. Files: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`, `runtime/scripts/fanout-run.cjs`, `runtime/scripts/fanout-merge.cjs`, `runtime/scripts/append-mode-event.cjs`, `deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, plus both loop-protocols.

## Scorecard

- Dimensions covered: security (with traceability overlap)
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.75

## Findings

### P0, Blocker
(none)

### P1, Required
- **F003**: Deep-review loop-protocol's executor-resolution section understates the shipped containment posture, `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280`. It claims "The only real containment is (a) the prompt-level 'ALLOWED WRITE PATHS' / 'BANNED OPERATIONS' contract ... and (b) post-dispatch validation (`validateIterationOutputs`) catching some violations after the fact." Shipped behavior contradicts this: the git-diff write-containment guard (`write-containment.ts`) is invoked via `snapshotOutOfScopeDirtyPaths`/`enforceWriteContainment` in every CLI executor branch of `deep-review-auto.yaml` (lines 1443-1795: codex, claude, cursor, pi), in `deep-review-confirm.yaml:1145-1191`, and in the shared fan-out runner `fanout-run.cjs:3376-3494` (with quarantine under `{artifact_dir}/containment/quarantine/<iteration>`, write-containment.ts:318). The sibling deep-research loop-protocol documents this exact guard at `deep-research/references/protocol/loop-protocol.md:287-290`. An operator reading the review protocol concludes review lanes have no structural containment; the remediation (this packet's own topic) is present in the runtime but absent from the review protocol doc.

### P2, Suggestion
- **F004**: Deep-research loop-protocol self-contradiction on containment, `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:275`. The same stale sentence ("The only real containment is (a) ... and (b) post-dispatch validation") appears at line 275, directly above the section at lines 287-290 that documents the two containment rules binding every CLI lineage. The doc contradicts itself; the earlier sentence should be reconciled with the containment section.

## Claim Adjudication (F003)

```json
{
  "findingId": "F003",
  "claim": "deep-review loop-protocol line 280 claims prompt contract + post-dispatch validation are the ONLY containment mechanisms for CLI review lanes, but the shipped runtime also runs the git-diff write-containment guard in every executor branch and the shared fan-out runner.",
  "evidenceRefs": [
    ".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:1443-1795",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3376-3494",
    ".opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:287-290"
  ],
  "counterevidenceSought": "Grepped the deep-review auto/confirm YAMLs and fanout-run.cjs for snapshotOutOfScopeDirtyPaths/enforceWriteContainment (present in every branch); grepped the deep-review loop-protocol for containment/quarantine (absent); checked whether the review protocol points to the shared containment doc (it does not).",
  "alternativeExplanation": "Could be intentional: the review protocol's executor section predates the containment guard and was never updated while the deep-research sibling was. That is a documentation lag, not a deliberate claim — and a lag is itself the finding.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the deep-review loop-protocol executor-resolution section is updated to describe the git-diff guard (or to reference the deep-research containment section), downgrade to P2 documentation hygiene.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | loop-protocol.md:280 vs auto YAML branches + fanout-run.cjs | Runtime implements more containment than the review protocol documents (F003) |
| checklist_evidence | notApplicable | hard | - | No checked completion claims reviewed this iteration |

## Assessment

- New findings ratio: 0.75 (P1 weight 5 + P2 weight 1 over prior P2 weight 2)
- Dimensions addressed: security, traceability (partial)
- Novelty justification: F003/F004 not previously recorded in this lineage; the guard exists in the runtime but the review protocol prose was missed by the remediation pass.

## Ruled Out

- Missing containment control in the runtime: ruled out — `enforceWriteContainment` is invoked in every CLI executor branch of deep-review-auto.yaml (codex/claude/cursor/pi single-executor branches), in deep-review-confirm.yaml, and in fanout-run.cjs; quarantine layout matches the deep-research doc (`containment/quarantine/<iteration>`, write-containment.ts:318,330-335).
- Recursion-guard weakness: ruled out — fanout-run.cjs:3258 implements a fail-closed stack-based recursion guard.
- Merge strongest-restriction drift: ruled out — fanout-merge.cjs:751-830 implements the documented strongest-restriction rollup (any active lineage P0 → merged FAIL).
- Symlink escape in quarantine writes: ruled out on read — write-containment.ts refusal semantics (lines 291-311, 633-682) resolve through symlinks and refuse outside-artifact destinations.

## Dead Ends

- Auditing every git-status edge in write-containment.ts line by line: the first review did the line-level pass; this iteration confirms cross-surface wiring only.

## Recommended Next Focus

Iteration 3: traceability — SKILL.md against references/assets (system-deep-loop, deep-review, cli-external-orchestration, sk-code) with core protocols spec_code and checklist_evidence against packet docs.

Review verdict: CONDITIONAL
