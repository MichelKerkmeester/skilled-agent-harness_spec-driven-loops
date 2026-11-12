# Iteration 5: Runtime invocation mechanics

## Focus

Investigate Angle 5: trace how plain user prompts reach the advisor and how the model can reach a command workflow after receiving a recommendation. The reducer's Next Focus remains Q1, while the dispatch orders invocation mechanics fifth; I followed Angle 5 and recorded the runtime inventory mismatch.

## Findings
1. Six runtimes in the delivery table share the advisor's prompt gate, scorer and renderer, but use different transport paths: four editor shims emit additionalContext, Pi emits a model-visible message and OpenCode appends to system context. This supports one route contract with host-specific adapters; it contradicts assuming one portable slash-command call exists across hosts. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:47-60]

2. DSH has an adapter not listed in that table. It runs at agent/pre-step, extracts only the operator-typed prompt, calls the shared handler with runtime dsh, and adds the returned brief as a notice; docs say it is interactive-only and off in a fan-out leaf. This proves a plain-chat DSH path exists, but the main per-runtime list is incomplete. [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:115-180] [SOURCE: .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs:80-121] [SOURCE: .dsh/SYNC.md:47-49] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:51-60]

3. DSH generates prompt stubs that a dispatcher composes into task text, and its documentation says it has no command loader. A DSH model therefore needs a skill or prompt-stub route; emitting /command text alone cannot invoke the workflow through a native command loader. Prompt stubs do exist and can be composed, so this is an adapter constraint rather than a total routing dead end. [SOURCE: .dsh/SYNC.md:31-33] [SOURCE: .dsh/SYNC.md:49] [SOURCE: .dsh/README.md:43-48]

4. Runtime support evidence conflicts. The advisor enum contains eight labels including copilot and dsh; the hook registration test explicitly excludes Copilot because its wiring was removed and lists six active registrations; the main table lists the same six but validation still prescribes a Copilot smoke. Build an active adapter inventory from registrations, keep runtime labels separate from installed hooks, and remove or repair stale validation claims. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts:10-19] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts:5-14] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:51-60] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:126-147]

5. The hook contract is advisory and fail-open: skipped, unmatched or unavailable advice does not block the prompt, and it does not replace explicit skill loading. Gate 2 provides a direct CLI path when the hook is absent, but neither recommendation path itself proves command execution. This supports graceful prompt continuity; it contradicts a promise that every plain-chat request will automatically execute its suggested command. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-25] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:37-43] [SOURCE: AGENTS.md:63-70]

## Ruled Out

- Assuming every runtime has an API to invoke slash commands from model context; DSH has no command loader and dispatches prompt stubs as task text.
- Treating a runtime enum value or stale validation example as proof that an adapter is currently registered.

## Dead Ends

- None established. The supported hook path injects route advice; direct command execution still depends on each host's native loader or explicit workflow-file loading.

## Edge Cases

- Contradictory evidence: Main adapter documentation lists six runtimes, DSH code and docs add a seventh, and Copilot appears in the enum and validation instructions even though the hook registration parity test says its wiring was removed. Treat Copilot hook support as UNKNOWN until its source registration is restored and verified.
- Missing dependencies: None for current adapter source; the runtime contract document is stale relative to DSH.
- Partial success: Plain-chat prompt hooks are verified by source for the six documented runtimes plus DSH, but automatic command loading across all registered slash-command mirrors is not established.
- Ambiguous input: The reducer still recommends Q1 inventory authority; the dispatched sequence names Angle 5, so the ordered angle was followed.

## Sources Consulted

- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-60
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:126-147
- .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:17-30, 115-180
- .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs:80-121
- .skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts:10-19
- .skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts:5-14
- .dsh/SYNC.md:29-49
- .dsh/README.md:43-48
- AGENTS.md:63-70
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:234-235

## Assessment

- New information ratio: 0.90 (four findings describe runtime-specific delivery or coverage; one extends the output-contract finding).
- Questions addressed: Prompt-time advisor delivery, runtime-specific transport, DSH command invocation constraint and runtime coverage gaps.
- Questions answered: None fully. DSH support and Copilot drift are identified, but invocation parity for all commands across registered runtimes remains unverified.

## Reflection

- What worked and why: Comparing the adapter table, DSH source, runtime enum and registration-path test exposed a real documentation mismatch and separated a runtime label from an active adapter.
- What did not work and why: The first per-runtime table and a validation playbook disagree on Copilot, so that playbook cannot be treated as authoritative for current registration without checking source paths.
- What I would do differently: Use the runtime registration tests and the live adapter inventory as the coverage denominator before evaluating cross-host command reach.

## Recommended Next Focus

Angle 6: plain-chat-only users. Determine the exact model-facing route instruction and fallback needed when the user never types a slash command, and distinguish supported prompt contexts from direct command loaders.
