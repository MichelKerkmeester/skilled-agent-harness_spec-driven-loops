# Iteration 1: (d) OpenCode plugin brief beside the hook brief after the mapper fix

## Focus

Question (d): after phase 013's plugin mapper fix, what still differs between the OpenCode plugin brief and the hook brief for the same prompt — wording, fields, order, bytes, command line, policy, fail-open path — shown side by side from code or a renderer run rather than from memory.

Ambiguity resolved first: "the hook brief" means the brief the Claude `UserPromptSubmit` hook renders through `buildSkillAdvisorBriefFromCli` plus the shared `renderAdvisorBrief`. That is the only hook path with a full renderer in this repo, and it is the same shared renderer the plugin loads as its shadow renderer, so the comparison isolates the two callers rather than two renderers.

## Actions Taken

1. Read the plugin's recommendation mapper and render call (`.opencode/plugins/system-skill-advisor.js`), the shared renderer (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts`), the Claude hook caller (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`) and its CLI reader (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`).
2. Wrote `scratch/render-parity.mjs`, which asks the real advisor CLI for the payload of nine prompts, feeds that payload to the plugin through its own `spawnOverride`, and renders the same prompt through `buildSkillAdvisorBriefFromCli` + `renderAdvisorBrief`. Ran it with `env -u AI_SESSION_CHILD` so the child-session policy rewrite does not mask the policy word.
3. Wrote `scratch/repeat-parity.mjs` and ran the plugin transform three times in one session to measure the repeat reduction.
4. Ran the committed phase-013 probe (`013-.../scratch/planning/probe-opencode-brief.mjs --doctor`) as a cross-check, once with the child marker and once without.

## Findings

1. **After the mapper fix the two heads are byte-identical, not merely similar.** Nine prompt classes produced the same first line and the same total brief length on both paths: typed 286 B, plain 286 B, ambiguous 305 B, doctor 298 B, no-match 244 B, `/deep:research` plain 294 B, `/deep:review` plain 292 B, `/deep:ai-council` plain 296 B, doctor-deep-loop plain 293 B. The command, the policy word and the owner all match. This is the check phase 013 promised and it now passes on real CLI payloads, not a fixture. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-parity.json]

2. **The OpenCode brief carries a second block the hook never emits.** After the brief, the plugin pushes `Compiled routing (served=compiled): hub=sk-doc outcome=route targets=none` as its own `output.system` entry — 73 bytes, present on the first prompt and on every repeat. The hook asks for the same compiled route (`includeCompiledRoute: true, compiledRouteTopOnly: true`) and renders no summary line at all. So an OpenCode prompt receives 73 more bytes than a Claude prompt for the same routing decision, and in this measurement the line's `targets` list is `none`, so it adds no routing information. [SOURCE: .opencode/plugins/system-skill-advisor.js:1586] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:238]

3. **Repeat reduction has the same shape but a different reset trigger.** The plugin's first transform emits 286 B; the second transform in the same session and message emits 68 B, the head only, with the directive block dropped. The hook's `decideDirectiveLifecycleDelivery` reduces the same way — head kept, constant directives dropped. The triggers differ: the plugin resets on `startup`, `resume`, `compact`, a generation change or an epoch change; the hook also resets when the transcript file shrinks (`transcriptBytes`), which the plugin cannot see. [SOURCE: .opencode/plugins/system-skill-advisor.js:223] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:397] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/repeat-parity.json]

4. **The two paths read their pass thresholds from different places.** The hook recomputes `passes_threshold` from `data.effectiveThresholds` echoed by the CLI, falling back to its own options. The plugin ignores `effectiveThresholds` entirely and hardcodes `DEFAULT_THRESHOLD_UNCERTAINTY = 0.35` beside its own confidence option. With the workspace defaults the CLI echoed `{"confidenceThreshold":0.8,"uncertaintyThreshold":0.35,"confidenceOnly":false}` on every probe prompt, so the outputs agreed; a workspace that sets a different uncertainty threshold would make the plugin show a row the hook hides, or hide one the hook shows. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:341] [SOURCE: .opencode/plugins/system-skill-advisor.js:573]

5. **The request shapes differ in three fields.** The hook sends `includeCompiledRoute: true` and `compiledRouteTopOnly: true`; the plugin sends neither, and adds a `surfaceHint` the hook does not send. Measured effect on the nine prompts: none — the handler attaches the command before the compiled route is consulted, so `/deep:research`, `/deep:review` and `/deep:ai-council` reach the plugin head without the flag. The difference is latent: a command that only the compiled route can supply would reach Claude and not OpenCode. [SOURCE: .opencode/plugins/system-skill-advisor.js:867] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:228]

6. **Delivery channel and position differ even when the bytes do not.** The hook returns `hookSpecificOutput.additionalContext` on the user-prompt event; the plugin pushes a string onto `output.system` in `experimental.chat.system.transform`. Same text, different position in the model's context, and the OpenCode copy exists only in memory — which is why the 24 OpenCode rows of the committed arm still read `briefDelivered: unknown`. [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:429] [SOURCE: .opencode/plugins/system-skill-advisor.js:1448]

7. **The fail-open text is a second implementation, not a shared one.** The plugin imports `renderPluginFallbackDirective` from `.opencode/plugins/lib/skill-advisor-render.js`, a plugin-local copy held equal by a parity test; the hook uses `renderAdvisorFallbackDirective` from the shared renderer. Measured no-match fallback: 244 bytes on both. The text matches today; the risk is that a future edit to one copy is only caught by the parity test. A missing prompt produces `Advisor: prompt skipped.` on both. [SOURCE: .opencode/plugins/lib/skill-advisor-render.js:51] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:627]

8. **Three smaller asymmetries, all inert today.** The plugin drops `kind` and `heldBelow` from the recommendation it forwards; the shared renderer copies both into its renderable shape and reads neither for the label. The plugin clamps the final brief at 2048 characters while the hook relies on the 120-token (480-character) renderer cap; at 244-305 bytes neither binds. The plugin caches the brief for five minutes per session and prompt, so a route change inside the TTL is invisible to OpenCode and visible to Claude. [SOURCE: .opencode/plugins/system-skill-advisor.js:56] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:274] [SOURCE: .opencode/plugins/system-skill-advisor.js:41]

9. **The child-session rewrite is shared and correctly applied by both.** With `AI_SESSION_CHILD=1`, both paths rendered `/create:readme` with `(parent-named only)` instead of `(start)`; without the marker both rendered `(start)`. The difference is the process environment, not the caller. This is also the cause of the two failing brief test files the phase-013 summary records. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/planning/probe-opencode-brief.mjs] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md:154]

## Ruled Out

- Rendering the plugin brief from a fixture alone. The committed probe offered a fixture case, but the mapper fix is only proven against a real CLI payload, so the nine-prompt real run carried the conclusion and the fixture was used only as a control.
- Comparing against the `~/.claude` transcript brief. That is a delivered brief after host formatting, so a difference could be the host rather than the caller.

## Dead Ends

- Looking for a wording or field difference in the head: there is none left after the mapper fix. Any further gain in this area is in the extra block, the channel, or the threshold source, not in the brief text.

## Edge Cases

- Ambiguous input: "the hook brief" could mean any of six runtime hooks. Selected the Claude `UserPromptSubmit` path because it is the only one whose renderer is shared with the plugin; the Pi, Devin and DSH hooks call the same CLI reader, so their brief text follows the same renderer.
- Contradictory evidence: none. The phase-013 summary says the OpenCode head names command and policy; this measurement confirms it and adds that the total brief is byte-identical to the hook's.
- Missing dependencies: no live OpenCode session is available in this lane (no CLI session allowed), so delivery position is established from the hook contract and the plugin code, not from a transcript.
- Partial success: none; all nine prompts rendered on both paths.

## Sources Consulted

- `.opencode/plugins/system-skill-advisor.js`
- `.opencode/plugins/lib/skill-advisor-render.js`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/planning/probe-opencode-brief.mjs`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-parity.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/repeat-parity.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/steer.md` (absent at the time of this iteration; recorded because the dispatch requires listing it when present)

## Assessment

- New information ratio: 0.9
- Questions addressed: (d)
- Questions answered: (d)

## Reflection

- What worked and why: feeding the plugin the real CLI payload through its own `spawnOverride`, then rendering the same prompt through the hook's own reader function, removed both the network and the fixture as variables. That is why the byte-identical result is trustworthy: two different callers, one payload, one renderer.
- What did not work and why: the first probe run happened under `AI_SESSION_CHILD=1` and both paths printed `parent-named only`, which would have hidden a policy-word difference. Re-running with the marker unset was necessary to see `(start)`.
- What I would do differently: measure the extra compiled-routing block first, since it is the only byte-level difference and it took a repeat run to notice that it survives the dedup.

## Recommended Next Focus

(e) The Claude 32-of-44 command visibility collapse: enumerate options that keep every operator-facing command name intact, with per-runtime cost and a check that proves 44 of 44.
