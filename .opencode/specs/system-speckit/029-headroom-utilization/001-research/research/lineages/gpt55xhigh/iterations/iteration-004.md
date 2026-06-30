# Iteration 004: Skill Advisor and Hook System Fit

## Focus

Evaluate Headroom against prompt-time advisor routing and runtime hooks.

## Evidence

- The skill advisor routes non-trivial work by scoring prompts through `mk_skill_advisor`; exact skill names or explicit user direction win, then top recommendations above threshold invoke the skill. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:55]
- Prompt-time hooks exist to inject startup context and compact skill-advisor briefs; Codex uses `SessionStart` and `UserPromptSubmit`. [SOURCE: .opencode/skills/cli-codex/references/hook_contract.md:22]
- Codex hook commands receive JSON with snake_case fields and reject unknown properties. [SOURCE: .opencode/skills/cli-codex/references/hook_contract.md:83]
- Codex hook output uses `hookSpecificOutput.additionalContext`, injected as model-visible developer context after the user prompt for `UserPromptSubmit`. [SOURCE: .opencode/skills/cli-codex/references/hook_contract.md:121]
- Hook failure semantics are fail-open except `UserPromptSubmit` exit 2; Spec Kit hooks return bounded stale advisory on cold-start timeout. [SOURCE: .opencode/skills/cli-codex/references/hook_contract.md:145]
- The cross-runtime hook system maps prompt-time advisor to `UserPromptSubmit` for Claude/Codex/Copilot and `experimental.chat.system.transform` for OpenCode. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:56]
- The OpenCode advisor bridge has a default prompt-time threshold contract of `0.8` confidence and `0.35` uncertainty. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:149]
- Headroom output shaping appends a system-prompt block and mutates effort on mechanical continuations when enabled. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:253] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:289]

## Findings

Advisor and hook traffic should be considered control-plane data. It must not be compressed, shaped, or rerouted before it reaches the runtime. The system is intentionally threshold-sensitive and prompt-time; altering text or JSON can change skill routing.

Compatible uses:

- Compress large source documents before an explicit advisor maintenance task, not prompt-time routing inputs.
- Use CacheAligner in detector-only mode to warn about unstable cache prefixes.

Incompatible uses:

- Output-shaper on prompt-time hook context.
- Proxy compression of hook JSON.
- `headroom learn` modifications to AGENTS.md that alter future skill routing without Spec Kit Memory provenance.

New information ratio: 0.70.

## Dead Ends / Ruled Out

- "Compress every hook output" is rejected; hook output is developer-role context and routing-critical.
- "Use Headroom memory as advisor memory" is rejected; advisor already has package metadata and Spec Kit Memory integration.
