---
title: "Iteration 4: D4 Maintainability — mirrors and executor contracts"
trigger_phrases: []
---

# Iteration 4: D4 Maintainability — mirrors and executor contracts

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

Dimension: maintainability. This slice compares canonical and translated deep-review agent mirrors, reads the cli-codex dispatch contract and examples, and follows the shared executor audit path far enough to see whether the documentation's process-safety requirements are honored by the actual runtime.

## Scorecard

- Dimensions covered: maintainability
- Files reviewed: 10
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 10 listed paths

## Findings

### P0, Blocker

- None.

### P1, Required

- None.

### P2, Suggestion

- **F005 — The cli-codex hard rule and its default non-interactive example disagree about stdin closure.** `[SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:7-10]` The skill requires every non-interactive `codex exec` to close or redirect stdin with `</dev/null`, specifically to prevent an apparent hang. `[SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:207-218]` Its default invocation is a non-interactive `codex exec` example but ends after the prompt and does not include the required redirect. The shared executor's actual asynchronous path does call `child.stdin.end()` `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1192-1226]`, so this review did not find a current runtime hang. The mismatch remains a maintenance trap for operators copying the documented direct command.
  - Recommendation: append `</dev/null` to the default and every non-interactive direct example, or mark examples that intentionally remain interactive and explicitly exempt them from the hard rule.

## Claim adjudication

```json
{
  "findingId": "F005",
  "claim": "The cli-codex skill's mandatory stdin rule is not reflected in its default non-interactive invocation example.",
  "evidenceRefs": [
    ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:7-10",
    ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:207-218",
    ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1192-1226"
  ],
  "counterevidenceSought": "Followed the real shared executor spawn path to determine whether the mismatch also affects orchestrated dispatch; it ends child stdin after optional input.",
  "alternativeExplanation": "The example may be intended for a terminal session where stdin is naturally interactive. Rejected as a clean contract because it is labelled the default invocation for a non-interactive exec and the hard rule applies to any such command.",
  "finalSeverity": "P2",
  "confidence": 0.93,
  "downgradeTrigger": "If the example is explicitly reclassified as interactive and all non-interactive examples carry the redirect, close as documentation corrected.",
  "transitions": [
    { "iteration": 4, "from": null, "to": "P2", "reason": "Hard-rule/example mismatch confirmed; runtime path separately closes stdin" }
  ]
}
```

## Search and ruled-out checks

- The canonical `.opencode` deep-review agent and the `.claude`, `.pi` and `.codex` representations differ in frontmatter/tool syntax and runtime path references as expected for their hosts. The translated mirrors preserve the one-iteration leaf boundary and nested-dispatch refusal `[SOURCE: .opencode/agents/deep-review.md:1-28]` `[SOURCE: .claude/agents/deep-review.md:1-14]` `[SOURCE: .pi/agents/deep-review.md:1-21]`; no independent mirror-drift finding was opened.
- The executor configuration has an explicit per-kind capability matrix and rejects unsupported fields before command construction `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:58-100]`. The audit path checks fan-out lineage, dispatch stack, ancestry, runtime environment and lockfile before spawn `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:818-880]`; no recursion-guard gap was supported in this slice.
- The cli-codex skill routes actual process construction to the shared deep-loop runtime and labels its direct snippets as operator references `[SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:174-178]`. That is why F005 remains P2 rather than a runtime P1.

## Traceability checks

- `spec_code`: partial. The executor implementation honors stdin closure, but the cli-codex documentation's stated hard rule and default example diverge (F005); earlier F001, F003 and F004 remain active.
- `checklist_evidence`: partial. The packet's task checklist is present, but no authoritative run or fix evidence was produced under the lineage-only boundary.

## Adversarial self-check

- Hunter: diffed canonical/translated agent headers, read the executor capability and recursion guards, and traced both synchronous and asynchronous child input handling.
- Skeptic: the runtime closes stdin, so the documentation mismatch is not promoted to P1. The copied direct example can still hang or appear hung in a non-interactive shell, matching the hard-rule rationale.
- Referee: no P0/P1. F005 is P2 documentation drift; the existing active P1s remain the provisional gate.

## Next dimension

D1 Correctness — deep-loop runtime/YAML state transitions, fan-out overrides, append/reducer contracts and max-iteration behavior.

Review verdict: CONDITIONAL
