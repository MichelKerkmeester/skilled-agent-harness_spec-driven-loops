---
title: Deep Review Iteration 002 - Security
description: Security and trust-boundary pass for the sk-code opencode merger packet.
---

# Iteration 002 - security

## Dispatcher

- Session: `deep-review-066-20260503T211436Z`
- Generation: `1`
- Lineage mode: `new`
- Mode: `review`
- Run / iteration: `2`
- Focus: security / trust boundary
- Budget profile: `scan` (security pass over known scope files and exact-token searches)
- Status: `complete`

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-config.json`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/prompts/iteration-2.md`
- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/skills/sk-code/` exact security-token and unsafe-command search results
- `.opencode/agents/` public-agent exact search results
- `.opencode/commands/spec_kit/` command/workflow exact search results
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/` generated advisor artifact exact search results
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/` packet exact search results

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None.

### P2 Findings

- None.

## Traceability Checks

- Security doctrine loaded from `.opencode/skills/sk-code-review/references/review_core.md`; severity definitions require P0 for exploitable security/auth/destructive data loss and P1 for must-fix gate issues. [SOURCE: `.opencode/skills/sk-code-review/references/review_core.md:20`]
- The iteration prompt scoped this pass to secret exposure, prompt-injection regressions, unsafe tool permissions, unsafe command examples, path/sandbox bypass language, public wording, verifier relocation, and generated advisor artifacts. [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/prompts/iteration-2.md:30`]
- Config confirms the relevant security surfaces include `sk-code`, moved verifier scripts, `sk-code-review`, advisor generated artifacts, public agent mirrors, and `spec_kit` command assets. [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-config.json:51`]
- Prior P1/P2 correctness documentation drift was not security-relevant in this pass and remains carried forward for traceability synthesis rather than duplicated as a new security finding. [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-findings-registry.json:9`]

## Integration Evidence

- Public command/agent wording search reviewed `.opencode/agents/` and `.opencode/commands/spec_kit/` for old skill names, stack-specific public claims, secrets vocabulary, and unsafe shell examples. Matches were either generic review/security guidance or false positives such as ordinary words containing `go`; no new public-disclosure or command-injection finding was supported.
- Advisor artifact search reviewed `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` and routing accuracy prompts. The skill graph lists `sk-code` and `sk-code-review`, not a live `sk-code-opencode` dependency, and no stale old-skill execution hook was supported by the checked matches. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:1`]
- Verifier relocation references in the packet point to `.opencode/skills/sk-code/scripts/verify_alignment_drift.py`, including the implementation-summary verification command; no stale execution hook was elevated as a security issue. [SOURCE: `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md:131`]

## Edge Cases

- Exact searches for `GO` produced false positives inside words like `good`; these were treated as non-evidence for public stack disclosure.
- Historical references to `.opencode/skills/sk-code-opencode/` remain expected inside the spec packet/resource map and were not treated as live public surface leaks.
- The code graph startup digest was stale; this iteration used direct file reads and exact searches rather than relying on structural graph conclusions.

## Confirmed-Clean Surfaces

- No new P0/P1/P2 security finding was supported for secret exposure, stale old-skill advisor hook execution, public agent/command disclosure, or unsafe command wording in the checked scope.
- The broad `sk-code` secrets search returned policy/example text about not hardcoding secrets rather than exposed live credentials.

## Ruled Out

- New secret exposure in checked `sk-code`, public command/agent, advisor artifact, and packet surfaces: ruled out for this iteration by exact-token review.
- Security-relevant duplicate of Iteration 1 ADR/resource-map drift: ruled out; carried forward as correctness/traceability state drift.
- Stale `sk-code-opencode` execution hook in generated advisor graph: ruled out for the checked generated graph artifact.

## Next Focus

- dimension: traceability
- focus area: reconcile packet docs, resource map, checklist evidence, public agent/command surfaces, generated advisor artifacts, and moved verifier references after the merger.
- reason: security pass found no new security findings; prior P1/P2 documentation drift remains best handled in traceability.
- rotation status: D2 security complete; D3 traceability remaining.
- blocked/productive carry-forward: avoid repeating Iteration 1 broad historical `sk-code-opencode` search; use focused live-surface and packet-current-state checks.
- required evidence: exact file:line citations for spec/checklist/resource-map/implementation-summary/advisor/agent/command alignment.

## Iteration Metrics

- Findings new: P0=0, P1=0, P2=0
- Active prior findings carried forward: P0=0, P1=1, P2=1
- newFindingsRatio: 0.0
- noveltyJustification: This pass covered a new security dimension and found no new actionable security defects; prior correctness drift was not duplicated.

## Assessment

Dimensions addressed: security
