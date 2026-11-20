# Review Iteration 015

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 15 of 24
- Focus: **Frontier node F-2-007: traceability**
- Dimension: traceability
- Frontier node: F-2-007 (depth 2 of 3, child of F-1-002), scope `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, `fanout-run.md` preview section, `executor-config.ts` capability record, `fanout-run.cjs` label derivation.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:193,197` (the `sandboxEnforcement` vocabulary and the opencode/claude paragraphs)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2817-2825` (`sandboxEnforcementFor`)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:160-170,281-307` (surface type and preventive record)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts:286-329` (per-surface assertions)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new.

## Findings - Refined

1. **R13-P2-001 refined: the catalog's definition makes `none` correct for devin workspace-write, so the fix is the record's comment or the builder's flag, not the label** -- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:193` -- The catalog defines `sandboxEnforcement` as `preventive` when the executor's own confinement is on, `compensating` when the builder emits a non-OS restriction, and `none` otherwise. Under that definition the devin workspace-write label is correct: the builder emits no restriction, and the fan-out guard is not a builder output. The inconsistency is therefore between the capability record's comment (which names the guard as devin's compensating control) and the builder's `compensatingControl` flag, not between the label and the catalog. The fix is one of: set `compensatingControl` for devin workspace-write so the label matches the record, or correct the record's comment to say the guard is a runner-level control the label does not describe.
   - Finding class: class-of-bug
   - Scope proof: the catalog's definition is the only place the three values are defined; `sandboxEnforcementFor` implements it exactly. The record's comment at `executor-config.ts:303` is the only statement that names the guard as the compensating control.
   - Affected surface hints: ["devin command builder", "executor-config.ts preventive record", "fanout-run.md vocabulary", "sandboxEnforcementFor"]

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:193`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2817-2825` | The catalog's three-value definition matches `sandboxEnforcementFor` exactly, and the preview paragraph's per-kind claims match the builders. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |
| `feature_catalog_code` | pass | `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:193,197` | The vocabulary and the per-kind paragraphs match the code; the one inconsistency is inside the capability record, reported as R13-P2-001. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2819-2825` implements the catalog's definition line for line: `preventive` when the kind's preventive capability is true and the command confines, `compensating` when the builder set the flag, `none` otherwise.
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:197` states the opencode preview records `compensating`, never `preventive`, which matches the builder's `compensatingControl: workspaceWrite` and the record's `false` preventive entry.
- `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts:286-329` asserts the sandbox surface per kind but not the enforcement label, which is why the devin gap is not caught by the suite.

## Edge Cases

- **The label and the record answer different questions.** The label describes the command; the record's comment describes the run. Both are defensible; the finding is that nothing states which one `sandboxEnforcement` means when they differ.
- **The catalog is the only definition.** If it were treated as the authority, the record's comment would be the defect. If the record were the authority, the builder would be. The refinement names both fixes rather than choosing.
- **The conformance test does not assert the label.** It asserts the surface, so a label regression would not fail the suite. That is the same test gap reported as R3-P2-001, not a new one.

## Confirmed-Clean Surfaces

- **Vocabulary definition.** One definition, implemented exactly.
- **Preview paragraph.** Per-kind claims match the builders.
- **Opencode label.** `compensating` under workspace-write, `none` under full access, matching the catalog's explicit statement.
- **Codex and cursor labels.** Follow the mode and the `confines` flag.

## Ruled Out

- **A new finding for the vocabulary.** Ruled out: the catalog and the code agree; the inconsistency is inside the record, already reported.
- **A finding for the conformance test not asserting the label.** Ruled out as a duplicate of R3-P2-001's test-gap class.
- **A finding for the catalog's per-kind paragraphs.** Ruled out: every claim checked matches the builders.

## Next Focus

- Dimension: maintainability
- Frontier node: F-2-007 (still active; maintainability is its last dimension)
- Focus area: the conformance test's structure as the drift guard for the capability record: whether its per-surface switch can express the label matrix, and whether the record's hand-maintained comments are the only place the runner-level controls are described.
- Reason: F-2-007 traceability produced one refinement; maintainability is the node's last dimension and the test is its stated guard.
- Rotation status: F-2-007 correctness, security and traceability complete; maintainability next.
- Blocked/productive carry-forward: productive (catalog-to-code comparison sharpened the fix direction); no blocked approaches.
- Required evidence: the conformance test's switch structure and the record's comment blocks.
- Recovery note: none.

Review verdict: PASS
