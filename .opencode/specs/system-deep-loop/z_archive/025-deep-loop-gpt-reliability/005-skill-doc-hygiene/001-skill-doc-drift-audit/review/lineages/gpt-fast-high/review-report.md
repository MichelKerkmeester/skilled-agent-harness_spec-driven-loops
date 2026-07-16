# Deep Review Report — gpt-fast-high

## Executive Summary

Verdict: CONDITIONAL. This lineage reached the required 10 iterations and found no P0 blockers, but it confirmed 7 active P1 documentation drift findings and 1 P2 advisory. The highest-impact theme is that some cli-opencode docs and playbooks still instruct direct `opencode run --agent ai-council` usage even though phase 010 converted `ai-council` to `mode: subagent` and verified direct invocation is rejected. The second theme is stale `.opencode/agents/*.toml` mirror references across deep-loop docs despite no such files existing in the current workspace.

Scope: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit` and its candidate documentation surface.

Active counts: P0=0, P1=7, P2=1. `hasAdvisories=true`.

## Planning Trigger

Plan a documentation-only remediation phase. The fixes should update living docs, prompt templates, playbooks, and runtime mirror references. Do not treat this review as implementation approval; the packet explicitly keeps fixes out of scope for the investigation phase.

## Active Finding Registry

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F001 | P1 | `cli-opencode/SKILL.md` still lists `ai-council` as directly invokable/primary. | `.opencode/skills/cli-opencode/SKILL.md:31`; `.opencode/skills/cli-opencode/SKILL.md:285`; current `.opencode/agents/ai-council.md:4`; phase 010 `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:48-60`. |
| F002 | P1 | `cli-opencode/README.md` still permits `ai-council` as a primary top-level route. | `.opencode/skills/cli-opencode/README.md:76`; `.opencode/skills/cli-opencode/README.md:164`; `.opencode/agents/ai-council.md:4`. |
| F003 | P1 | CO-017 playbook still expects direct `--agent ai-council` dispatch to exit 0. | `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:362`; `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:417-423`; `.opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:27-33`; `.opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:43`. |
| F004 | P1 | `cli-opencode` prompt template hard-codes `--agent ai-council`. | `.opencode/skills/cli-opencode/assets/prompt_templates.md:385-392`; the corrected command-only guidance already exists in `.opencode/skills/cli-opencode/references/agent_delegation.md:197` and `:229`. |
| F005 | P1 | `deep-context/SKILL.md` still requires an absent `.opencode/agents/deep-context.toml` mirror. | `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279-287`; `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md:302`; `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit/spec.md:56`; scoped Glob found no `.opencode/agents/*.toml`. |
| F006 | P1 | `deep-ai-council/SKILL.md` says runtime mirrors include `.opencode/agents/ai-council.toml` and calls `ai-council` primary. | `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:431-432`; `.opencode/agents/ai-council.md:4`; scoped Glob found no `.opencode/agents/*.toml`. |
| F007 | P2 | `deep-ai-council` output schema cross-reference names absent `.opencode/agents/ai-council.toml`. | `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/output_schema.md:27-29`; scoped Glob found no `.opencode/agents/*.toml`. |
| F008 | P1 | `deep-review` loop protocol lists absent `.opencode/agents/deep-review.toml`. | `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_protocol.md:721-724`; scoped Glob found no `.opencode/agents/*.toml`. |
| F009 | P1 | `deep-research` capability matrix lists absent `.opencode/agents/deep-research.toml`. | `.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md:51-55`; scoped Glob found no `.opencode/agents/*.toml`. |

## Remediation Workstreams

1. Update cli-opencode's primary/subagent taxonomy in `SKILL.md`, `README.md`, prompt templates, and CO-017 playbook so `ai-council` routes through `/deep:ai-council` or orchestrate/Task dispatch, not direct `--agent ai-council`.
2. Remove or replace stale `.opencode/agents/*.toml` mirror claims in deep-context, deep-ai-council, deep-review, and deep-research docs with current Markdown-agent and `.claude` mirror reality.
3. Re-run scoped grep for `--agent ai-council`, `.opencode/agents/*.toml`, `deep-route-guard`, and `mk-deep-loop-guard` after edits.

## Spec Seed

Add a follow-up documentation-remediation phase under packet 031 or under this 014 phase. Requirements should require exact file:line replacement of direct-agent and absent-TOML claims, preservation of historical changelog text where explicitly historical, and no behavior/code changes.

## Plan Seed

1. Patch cli-opencode docs and CO-017 playbook.
2. Patch deep-loop runtime mirror path docs.
3. Run targeted grep and `validate.sh --strict` on the remediation phase.
4. Feed changed docs to fresh verification agents before marking 014 T008/T009 complete.

## Traceability Status

| Protocol | Status | Notes |
|---|---|---|
| spec_code | FAIL | Active findings contradict current runtime state or file existence. |
| checklist_evidence | PARTIAL | Review fanout synthesis exists; packet-level Sonnet verification remains pending. |
| feature_catalog_code | PARTIAL | `mk-deep-loop-guard` entries sampled as current; mirror docs remain stale. |
| playbook_capability | FAIL | CO-017 still encodes a command that phase 010 made invalid. |

## Deferred Items

- Fresh Sonnet 5 xhigh verification for each iteration remains a packet-level task and was not performed by this lineage.
- Historical changelog entries were not treated as active findings unless they looked like current operational guidance.
- The broad top-level README surface was not promoted to a finding in this lineage; the highest-risk stale claims were in skill-owned docs and playbooks.

## Audit Appendix

Stop reason: `maxIterationsReached`. Iterations: 10. Dimension coverage: correctness, security, traceability, maintainability all covered. Final iteration stabilization found no new findings. No P0 findings were recorded, so adversarial P0 replay was N/A. Resource-map coverage gate was skipped because the target spec folder had no `resource-map.md` at init; this lineage emitted `resource-map.md` as a synthesis evidence map.
