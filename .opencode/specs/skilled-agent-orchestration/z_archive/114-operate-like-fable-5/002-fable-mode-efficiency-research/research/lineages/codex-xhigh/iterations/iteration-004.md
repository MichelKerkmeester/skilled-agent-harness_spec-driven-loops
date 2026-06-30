# Iteration 4: Public Surface Reliability Map

## Focus
Map adjustable Public surfaces by runtime reach, read reliability, and fit for doctrine, mechanism, or measurement deltas.

## Actions Taken
- Read root AGENTS, hook-system references, skill-advisor hook reference, agent headers, skill headers, and command router headers.
- Inventoried `.opencode/agents`, `.codex/agents`, `.claude/agents`, `.opencode/skills`, and `.opencode/commands`.
- Compared surface reach against the opus governor pattern.

## Findings
1. **Root AGENTS is highest reliability for universal doctrine, but round 1 already used it.** It is read at session start and carries the operating discipline; more text here risks bloat and duplication. [SOURCE: AGENTS.md:59]

2. **Constitutional memory is high reliability for triggerable rules, not broad style.** Existing rules capture baseline/delta and finding-as-hypothesis with trigger phrases and always-surface importance. This is ideal for machine-checkable obligations, not the full governor prose. [SOURCE: .opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md:20] [SOURCE: .opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md:20]

3. **Prompt-time hooks are the best match for a Fable governor.** The hook system supports `UserPromptSubmit` across Claude, Codex, and OpenCode's transform/plugin path, exactly where a recurring compact reminder can counter context decay. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:59] [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:68]

4. **The skill-advisor hook already provides compact prompt-safe briefs and a threshold contract.** It injects a compact advisor brief before response, does not replace skill loading, fails open, and uses default thresholds. A Fable governor could ride this surface or adjacent hook plumbing without inventing a new runtime transport. [SOURCE: .opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:36] [SOURCE: .opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:81]

5. **OpenCode has an explicit plugin bridge for prompt-time advice.** The bridge mutates `output.system`, has a cache TTL, timeout, and disable flags. That is the strongest OpenCode path for a persistent compact governor. [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/opencode-plugin-bridge.md:21]

6. **Codex hook support is available but registration-sensitive.** Codex requires hooks enabled and user/workspace registration; timeout fallback can return stale advisory context instead of empty output. This makes Codex governor delivery valuable but must fail loud/stale-labeled. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:43] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:199]

7. **Agents are point-of-role surfaces.** Orchestrate owns decomposition/delegation/evaluation and treats hook advisor context as hints only; deep-research is a leaf and owns evidence-bound iteration outputs. These are good places for targeted ritual deltas, not global governor text. [SOURCE: .opencode/agents/orchestrate.md:20] [SOURCE: .opencode/agents/deep-research.md:36]

8. **Commands are workflow-entry surfaces.** `/deep:*`, `/speckit:*`, `/memory:*`, `/doctor*`, and `/prompt` are thin routers that load YAML/presentation contracts. They should receive measurement/benchmark routes or workflow-specific verification text only when the command owns that behavior. [SOURCE: .opencode/commands/deep/research.md:1] [SOURCE: .opencode/commands/doctor/_routes.yaml:101]

## Questions Answered
- Which adjustable Public surfaces exist?
- Which are most reliable per runtime?

## Questions Remaining
- Which exact recommendations rank highest after dedup?
- Which caveats must be carried into synthesis?

## Assessment
- newInfoRatio: 0.43.
- Novelty justification: the surface map converts source mechanisms into repo-specific landing zones.
- Confidence: high for hook surface ranking because multiple docs independently describe prompt-time injection across runtimes.

## Reflection
What worked: ranking by delivery reliability before deciding content.

What failed or was ruled out: scattering governor text through every agent and command. It would be broad, drift-prone, and less reliable than hook injection.

## Recommended Next Focus
Rank recommendations by leverage, cost, blast radius, and dedup status.
