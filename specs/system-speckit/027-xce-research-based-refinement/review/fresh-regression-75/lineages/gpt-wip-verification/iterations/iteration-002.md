# Seat gpt-wip-verification — iteration 2 (global #68)

- Model: `kimi-for-coding/k2p7` · Executor: opencode · Angle: gpt-wip-verification
- Verdict: **FAIL** · Findings: P0=0 P1=5 P2=2

## Analysis

I reviewed the 002-tri-system-deep-research packet: its canonical spec docs, the synthesized `research/research.md`, the machine-readable `findings-registry.json`, the supporting config/iterations/deltas, and the three main code files cited by the top P0 findings. The artifacts are structurally complete (50 iterations, 50 deltas, registry, config), but the traceability layer has real defects: the synthesis cites code ranges that do not match the claimed behavior, and the completion state is inconsistently recorded across the canonical docs.

```json
{
  "seat": "gpt-wip-verification",
  "model": "openai/gpt-5.5-fast",
  "angle": "005 tri-system deep research artifacts integrity: research.md anchors/_memory blocks, references resolve.",
  "verdict": "FAIL",
  "summary": "Research synthesis cites incorrect code ranges for three confirmed P0 findings and completion state is inconsistent across canonical docs.",
  "files_reviewed": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/spec.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/plan.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/tasks.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/implementation-summary.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/deep-research-strategy.md",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/deep-research-config.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/findings-registry.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/graph-metadata.json",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/description.json",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/auto-promotion.ts",
    ".opencode/skills/system-spec-kit/scripts/core/workflow.ts"
  ],
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Research P0 mis-cites lineage-state source-kind guard",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:8",
      "evidence": "research.md claims .opencode/skills/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1365-1381 retires rows reading only importance_tier and exempting only constitutional. The actual retirePredecessorForActiveReindex at 1369-1403 selects source_kind at 1374 and carries manual tiers forward at 1393-1395 before deprecating the predecessor.",
      "why": "A top-level confirmed P0 is supported by a range that omits the existing source-kind/manual-tier guard, so the synthesis points remediation at a non-bug.",
      "recommendation": "Re-verify the finding against the full function body and either remove/refute the P0 or cite the exact unguarded lines that prove manual rows are lost."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Research P0 mis-cites auto-promotion source-kind exclusion",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:9",
      "evidence": "research.md claims .opencode/skills/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:140-146,259-262 updates importance_tier with no source-kind check. Lines 140-146 only SELECT (including source_kind), 259-262 count recent promotions, checkAutoPromotion rejects manual source kinds at 178-186, and the UPDATE at 273-278 explicitly excludes manual source kinds.",
      "why": "The registry's P0 claim of unguarded automated tier overwrite is contradicted by the cited file, risking false remediation.",
      "recommendation": "Correct the citation to the actual guard-free lines or downgrade/refute the finding and update the synthesis."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Research P0 mis-locates generate-context secret scrubber",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/research.md:10",
      "evidence": "research.md claims .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1424+ persists durable artifacts without the scrub step. Lines 1424-1435 perform tree thinning; scrubWorkflowSavePayloadTextFields runs at 1492-1505 and scrubs contentSlug, memoryTitle, sessionData, collectedData, and rawCtxFilename before persistence.",
      "why": "The cited range describes thinning, not durable persistence, and a scrubber is present in the save path, so the P0 lacks accurate coordinates.",
      "recommendation": "Identify any genuinely unscrubbed durable field and cite the exact write line, or refute the finding."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Implementation summary names non-existent spec folder",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/implementation-summary.md:30",
      "evidence": "implementation-summary.md lists Spec Folder as 028-tri-system-deep-research; the actual folder is 002-tri-system-deep-research (description.json:2, graph-metadata.json:4).",
      "why": "Resume and cross-reference tooling will resolve to a folder that does not exist, breaking traceability from the summary to the packet.",
      "recommendation": "Correct the Spec Folder value to 002-tri-system-deep-research and align it with description.json/graph-metadata.json."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Canonical docs still advertise in-progress state after completion",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/spec.md:32",
      "evidence": "spec.md status is In Progress and its _memory block (lines 15-16) says recent_action 'Authored 50 research angles and program scaffolding' / next_safe_action 'Dispatch research iterations...'. tasks.md lines 64-66 mark T008-T010 complete and implementation-summary.md:80 reports 50/50 verification pass.",
      "why": "A completed packet advertises an in-progress state and stale resume actions, misleading session recovery and bootstrap routing.",
      "recommendation": "Update spec.md status to Complete, refresh the _memory continuity block to match implementation-summary.md, and regenerate graph-metadata.json so derived.status is not in_progress."
    },
    {
      "severity": "P2",
      "dimension": "traceability",
      "title": "Plan definition-of-done checkboxes do not match completed tasks",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/plan.md:52-54",
      "evidence": "plan.md Definition of Done boxes for iterations recorded, findings registry synthesized, and packet strict validation are unchecked, while tasks.md T007-T010 are all [x] and implementation-summary.md:79 reports strict validation pass.",
      "why": "The plan does not reflect the actual done state, creating audit confusion.",
      "recommendation": "Mark the Definition of Done checkboxes [x] or remove them if superseded by tasks.md."
    },
    {
      "severity": "P2",
      "dimension": "traceability",
      "title": "deep-research-config.json status still running",
      "file": ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/deep-research-config.json:12",
      "evidence": "deep-research-config.json has \"status\": \"running\"; implementation-summary.md and tasks.md state the program is complete.",
      "why": "The program config does not match the completed execution state.",
      "recommendation": "Update status to completed (or remove the stale field) to align with the final registry."
    }
  ]
}
```
